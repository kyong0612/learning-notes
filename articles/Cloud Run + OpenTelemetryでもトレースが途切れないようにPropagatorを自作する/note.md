# Cloud Run + OpenTelemetryでもトレースが途切れないようにPropagatorを自作する

ref: <https://dev.henry.jp/entry/otel-propagator>

## 株式会社ヘンリー エンジニアブログ

株式会社ヘンリーでSREをしているsumirenです。

ヘンリーではオブザーバビリティバックエンドにHoneycombを採用しています。

Cloud Runでサービス間通信をしている場合、外部オブザーバビリティバックエンドとOpenTelemetryを使うと、トレースが途切れてしまう課題があります。

解決してから1年弱経ってしまったのですが、対処事例を紹介します。

## Cloud Run + OpenTelemetry + 外部バックエンドでトレースが途切れてしまう理由

途切れてしまう理由を解説するために図解を用意しました。ここでは2つのCloud Runアプリケーションがサービス間通信を行い、番号順に処理を行ってトレースを生成しています。

トレースにおいてスパン間がつながるのは、トレースIDや親スパンIDの伝播のおかげです。この仕組みは**Context Propagation**と呼ばれ、HTTPによる通信であれば、そのヘッダに特定の形式でトレースIDや親スパンIDを埋め込むことで実現されます。

Cloud RunはOpenTelemetryをサポートし、スパン生成に加え、こうしたスパンの伝播も行います。

### トレースが途切れる原因

Cloud Runが生成したスパンはCloud Traceにしか送られません。一方で、アプリケーションでは正常にHoneycombにスパンを送信しています。そのため、1つのトレースのスパンがHoneycombとCloud Traceに分かれてしまい、ツリー構造が破綻してしまいます。

Cloud Runが生成したスパンの送信先を変更したり、Cloud RunがアプリケーションのOpenTelemetryトレースに干渉することを無効化できればよいのですが、これらの挙動は変更・無効化ができません。

## Propagatorを自作するという方針

Cloud Run側でOpenTelemetryサポートを無効化できない以上、ユーザーランドで何らかのワークアラウンドを行うしかありません。例えば、オブザーバビリティベンダーの独自エージェントを使いOpenTelemetryを避ける手段があります。

しかし、OpenTelemetryを継続しつつワークアラウンドを行う方法として、アプリケーションの**Context Propagation**の振る舞いを変更するために**Propagatorを自作**する方法を紹介します。

ヘンリーでは、GraphQL BFFにNode.js、gRPCバックエンドにKotlin/JVMを使っているため、それぞれの実装を紹介します。

## Node.jsの実装例

```javascript
initializeOpenTelemetry();

function initializeOpenTelemetry() {
  const provider = new NodeTracerProvider({
    resource: Resource.default().merge(
      // ...
    ),
    sampler: new AlwaysOnSampler(),
  });

  const exporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
  });
  const processor = new BatchSpanProcessor(exporter, {
    // ...
  });
  provider.addSpanProcessor(processor);

  provider.register({
    propagator: new MyTraceContextPropagator(),
  });

  registerInstrumentations({
    // ...
  });
}

class MyTraceContextPropagator {
  inject(context, carrier, setter = defaultTextMapSetter) {
    const spanContext = trace.getSpanContext(context);
    if (!spanContext) return;
    const traceparent = 
      `${spanContext.traceId}-${spanContext.spanId}-${spanContext.traceFlags.toString(16).padStart(2, "0")}`;
    setter.set(carrier, "my-traceparent", traceparent);
  }
  
  extract(context, carrier, getter = defaultTextMapGetter) {
    const traceparentTraceId = getter.get(carrier, "my-traceparent-traceid");
    if (!traceparentTraceId) return context;
    const match = traceparentTraceId.match(/([0-9a-f]{32})/);
    if (!match) return context;
    const traceId = match[1];
    const spanContext = { traceId, spanId: generateRandomSpanId(), traceFlags: 1, isRemote: false };
    return trace.setSpanContext(context, spanContext);
  }

  fields() {
    return ["my-traceparent"];
  }
}
```

## JVM/Kotlinの実装例

```kotlin
public class MyTraceContextPropagatorProvider : ConfigurablePropagatorProvider {
    override fun getPropagator(config: ConfigProperties): TextMapPropagator {
        return MyTraceContextPropagator()
    }

    override fun getName(): String {
        return "mypropagator"
    }
}

public class MyTraceContextPropagator : TextMapPropagator {
    private val traceparentRegex = """([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})""".toRegex()

    override fun fields(): MutableCollection<String> {
        return mutableListOf("my-traceparent")
    }

    override fun <C : Any?> inject(context: Context, carrier: C?, setter: TextMapSetter<C>) {
        val spanContext = Span.fromContext(context).spanContext
        if (!spanContext.isValid) return

        val traceparent = "${spanContext.traceId}-${spanContext.spanId}-${spanContext.traceFlags.toInt().toString(16).padStart(2, '0')}"
        setter.set(carrier, "my-traceparent", traceparent)
    }

    override fun <C : Any?> extract(context: Context, carrier: C?, getter: TextMapGetter<C>): Context {
        val traceparent = getter.get(carrier, "my-traceparent") ?: return context

        val match = traceparentRegex.find(traceparent)
        if (match == null || match.groupValues.size != 4) {
            return context
        }

        val traceId = match.groupValues[1]
        val spanId = match.groupValues[2]
        val traceFlags = match.groupValues[3].toInt(16)

        val spanContext = SpanContext.createFromRemoteParent(traceId, spanId, TraceFlags.fromByte(traceFlags.toByte()), TraceState.getDefault())
        return context.with(Span.wrap(spanContext))
    }
}
```

## 設計上のトレードオフ

このアーキテクチャのトレードオフとして、個別のマイクロサービスでPropagatorを実装しなければならない点があります。横断的関心事をアプリケーションに持たせるという問題もあります。

これを回避するために、例えばサイドカーに下流サービスへのリクエストをプロキシさせ、そこでHTTPSを終端してtraceparentヘッダを独自ヘッダに書き換える、といったアーキテクチャが考えられます。

## まとめ

この記事では、Cloud Run + OpenTelemetry + 外部オブザーバビリティバックエンドでトレースが途切れる原因を解説し、それを避ける方法としてPropagatorの自作を紹介しました。

トレースが途切れる現象に心当たりがあれば、ぜひ参考にしてください。
