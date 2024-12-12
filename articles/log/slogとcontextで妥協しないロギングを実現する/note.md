# log/slogとcontextで妥協しないロギングを実現する

ref: <https://tech.buysell-technologies.com/entry/adventcalendar2024-12-10>

## slogの基本的な利用方法

```go
// main.go
func main() {
  // ロガーを作成
  logger := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    AddSource: true, // ログの出力元のファイル名、関数名、行番号を表示
  })

  // グローバルロガーを設定
  slog.SetDefault(logger)

  // ロガーを利用
  slog.Info("Info message")

  // contextを利用してロガーを利用
  // デフォルトではcontextに対してなにもしない
  ctx := context.Background()
  slog.InfoContext(ctx, "Info message")
}
```

## context.Contextを利用した値の受け渡し

```go
    // handler.go
func (h Handler) Handle(ctx context.Context, record slog.Record) error {
  if v, ok := ctx.Value(logContextKey{}).(*sync.Map); ok {
    v.Range(func(key, val any) bool {
      if keyString, ok := key.(string); ok {
        record.AddAttrs(slog.Any(keyString, val))
      }
      return true
    })
  }

  return h.handler.Handle(ctx, record)
}
```

```go
// context.go
type logContextKey struct{}

type Attrs map[string]any

func WithValue(parent context.Context, attrs Attrs) context.Context {
  if parent == nil {
    parent = context.Background()
  }
  if v, ok := parent.Value(logContextKey{}).(*sync.Map); ok {
    mapCopy := copySyncMap(v)
    for key, val := range attrs {
      mapCopy.Store(key, val)
    }
    return context.WithValue(parent, logContextKey{}, mapCopy)
  }
  v := &sync.Map{}
  for key, val := range attrs {
    v.Store(key, val)
  }
  return context.WithValue(parent, logContextKey{}, v)
}

func copySyncMap(m *sync.Map) *sync.Map {
  var cp sync.Map
  m.Range(func(k, v interface{}) bool {
    cp.Store(k, v)
    return true
  })
  return &cp
}
```

## Google Cloud対応

```go
// adapter/googleCloud/field.go
const (
  SourceKey     = "logging.googleapis.com/sourceLocation"
  LabelKey      = "logging.googleapis.com/labels"
  TraceKey      = "logging.googleapis.com/trace"
  SpanKey       = "logging.googleapis.com/spanId"
  MessageKey    = "message"
  LevelKey      = "severity"
  StackTraceKey = "stack_trace"
)
```

```go
// adapter/googleCloud/replaceRule.go
func KeyRule() adapter.ReplaceRule {
  return func(a slog.Attr) slog.Attr {
    switch a.Key {
    case slog.LevelKey:
      if a.Value.String() == slog.LevelWarn.String() {
        return slog.String(LevelKey, "WARNING")
      }
      a.Key = LevelKey
    case slog.MessageKey:
      a.Key = MessageKey
    case slog.SourceKey:
      a.Key = SourceKey
    }
    return a
  }
}
```

```go
// adapter/replacer.go

// implement Handler interface
type replacer func(groups []string, a slog.Attr) slog.Attr

var _ = slog.HandlerOptions{
  ReplaceAttr: replacer(nil),
}

type ReplaceRule func(a slog.Attr) slog.Attr

func NewReplacer(rules ...ReplaceRule) replacer {
  return func(groups []string, a slog.Attr) slog.Attr {
    for _, rule := range rules {
      a = rule(a)
    }
    return a
  }
}
```

```go
// example/googleCloud/main.go

func setupLogger() {
  baseLogHandler := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    AddSource: true,
    ReplaceAttr: adapter.NewReplacer(
      googleCloudAdapter.KeyRule(), // Google Cloud用のキーに置き換える
    ),
  })
  logHandler := slogcontext.NewHandler(baseLogHandler)
  slog.SetDefault(slog.New(logHandler))
}
```

## 検索性をさらに高める定数Attributeパターン

```go
// wrapper/strict/logger.go
type strictKey struct{ keyStr string }

var (
  UserIDKey    = strictKey{keyStr: "user_id"}
  ReqIDKey     = strictKey{keyStr: "req_id"}
  TraceIDKey   = strictKey{keyStr: "trace_id"}
  SessionIDKey = strictKey{keyStr: "session_id"}
)

func WithValue(ctx context.Context, key strictKey, val string) context.Context {
  return slogcontext.WithValue(ctx, slogcontext.Attrs{key.keyStr: val})
}
```
