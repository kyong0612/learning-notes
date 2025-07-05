---
title: "Node.js — セキュリティ・ベストプラクティス"
source: "https://nodejs.org/en/learn/getting-started/security-best-practices"
author:
  - "RafaelGSS"
  - "UlisesGascon"
  - "fraxken"
  - "facutuesca"
  - "mhdawson"
  - "arhart"
  - "naugtur"
  - "anonrig"
published:
created: 2025-07-05
description: |
  このドキュメントは、現在の脅威モデルを拡張し、Node.jsアプリケーションをセキュアにするための広範なガイドラインを提供することを目的としています。
tags:
  - "Node.js"
  - "Security"
  - "Best Practices"
  - "Threats"
  - "Vulnerability"
  - "Threat Model"
  - "CWE"
---

# セキュリティ・ベストプラクティス

## 目的

このドキュメントは、現在の[脅威モデル](https://github.com/nodejs/node/security/policy#the-nodejs-threat-model)を拡張し、Node.jsアプリケーションをセキュアにするための広範なガイドラインを提供することを目的としています。

## ドキュメントの内容

* ベストプラクティス：ベストプラクティスを簡潔にまとめたもの。[このissue](https://github.com/nodejs/security-wg/issues/488)や[このガイドライン](https://github.com/goldbergyoni/nodebestpractices)を出発点としています。このドキュメントはNode.jsに特化している点に注意してください。より広範なものを探している場合は、[OSSF Best Practices](https://github.com/ossf/wg-best-practices-os-developers)を検討してください。
* 攻撃の説明：脅威モデルで言及している攻撃について、可能であればコード例を交えて平易な言葉で図解・文書化します。
* サードパーティライブラリ：脅威（タイポスクワッティング攻撃、悪意のあるパッケージなど）と、npmモジュールの依存関係に関するベストプラクティスを定義します。

## 脅威リスト

### HTTPサーバーのサービス妨害（DoS）(CWE-400)

これは、受信したHTTPリクエストの処理方法が原因で、アプリケーションが意図された目的のために利用できなくなる攻撃です。これらのリクエストは、悪意のある攻撃者によって意図的に作成される必要はありません。設定ミスやバグのあるクライアントも、サービス妨害につながるリクエストパターンをサーバーに送信する可能性があります。

HTTPリクエストはNode.jsのHTTPサーバーによって受信され、登録されたリクエストハンドラを介してアプリケーションコードに渡されます。サーバーはリクエストボディの内容を解析しません。したがって、リクエストハンドラに渡された後のボディの内容によって引き起こされるDoSは、Node.js自体の脆弱性ではありません。それを正しく処理するのはアプリケーションコードの責任です。

Webサーバーがソケットエラーを適切に処理することを確認してください。例えば、エラーハンドラなしでサーバーを作成すると、DoSに対して脆弱になります。

```javascript
const net = require('node:net');

const server = net.createServer(function (socket) {
  // socket.on('error', console.error) // これによりサーバーのクラッシュを防ぎます
  socket.write('Echo server\r\n');
  socket.pipe(socket);
});

server.listen(5000, '0.0.0.0');
```

*不正なリクエスト*が実行されると、サーバーがクラッシュする可能性があります。

リクエストの内容に起因しないDoS攻撃の例として[Slowloris](https://en.wikipedia.org/wiki/Slowloris_%28computer_security%29)があります。この攻撃では、HTTPリクエストがゆっくりと断片化され、一度に1フラグメントずつ送信されます。完全なリクエストが配信されるまで、サーバーは進行中のリクエストにリソースを割り当て続けます。これらのリクエストが同時に十分に送信されると、同時接続数がすぐに最大に達し、サービス妨害が発生します。このように、攻撃はリクエストの内容ではなく、サーバーに送信されるリクエストのタイミングとパターンに依存します。

**緩和策**

* リバースプロキシを使用して、リクエストを受信し、Node.jsアプリケーションに転送します。リバースプロキシは、キャッシング、ロードバランシング、IPブラックリストなどを提供でき、DoS攻撃が効果的である可能性を低減します。
* サーバーのタイムアウトを正しく設定し、アイドル状態の接続やリクエストの到着が遅すぎる接続をドロップできるようにします。[`http.Server`](https://nodejs.org/api/http.html#class-httpserver)のさまざまなタイムアウト、特に`headersTimeout`、`requestTimeout`、`timeout`、`keepAliveTimeout`を参照してください。
* ホストごとおよび合計のオープンソケット数を制限します。[httpのドキュメント](https://nodejs.org/api/http.html)、特に`agent.maxSockets`、`agent.maxTotalSockets`、`agent.maxFreeSockets`、`server.maxRequestsPerSocket`を参照してください。

### DNSリバインディング (CWE-346)

これは、[--inspectスイッチ](/en/learn/getting-started/debugging)を使用してデバッグインスペクタを有効にして実行されているNode.jsアプリケーションを標的とする可能性のある攻撃です。

Webブラウザで開かれたWebサイトはWebSocketおよびHTTPリクエストを作成できるため、ローカルで実行されているデバッグインスペクタを標的にすることができます。これは通常、最新のブラウザに実装されている[同一オリジンポリシー](/en/learn/getting-started/debugging)によって防がれます。これにより、スクリプトが異なるオリジンのリソースにアクセスすることが禁止されます（つまり、悪意のあるWebサイトはローカルIPアドレスから要求されたデータを読み取ることができません）。

しかし、DNSリバインディングを通じて、攻撃者はリクエストのオリジンを一時的に制御し、ローカルIPアドレスから発信されているように見せかけることができます。これは、WebサイトとそのIPアドレスを解決するために使用されるDNSサーバーの両方を制御することによって行われます。詳細については、[DNSリバインディングのWiki](https://en.wikipedia.org/wiki/DNS_rebinding)を参照してください。

**緩和策**

* `process.on('SIGUSR1', ...)`リスナーをアタッチして、*SIGUSR1*シグナルでインスペクタを無効にします。
* 本番環境でインスペクタプロトコルを実行しないでください。

### 不正なアクターへの機密情報の漏洩 (CWE-552)

パッケージの公開中、現在のディレクトリに含まれるすべてのファイルとフォルダがnpmレジストリにプッシュされます。

`.npmignore`と`.gitignore`でブロックリストを定義するか、`package.json`で許可リストを定義することによって、この動作を制御するいくつかのメカニズムがあります。

**緩和策**

* `npm publish --dry-run`を使用して、公開するすべてのファイルをリストします。パッケージを公開する前に内容を確認してください。
* `.gitignore`や`.npmignore`などの無視ファイルを作成し、維持することも重要です。これらのファイルを通じて、公開すべきでないファイル/フォルダを指定できます。`package.json`の[filesプロパティ](https://docs.npmjs.com/cli/configuring-npm/package-json#files)は、逆の操作（許可リスト）を可能にします。
* 漏洩が発生した場合は、必ず[パッケージの公開を取り消し](https://docs.npmjs.com/unpublishing-packages-from-the-registry)てください。

### HTTPリクエストスマグリング (CWE-444)

これは、2つのHTTPサーバー（通常はプロキシとNode.jsアプリケーション）が関与する攻撃です。クライアントは、まずフロントエンドサーバー（プロキシ）を通過し、次にバックエンドサーバー（アプリケーション）にリダイレクトされるHTTPリクエストを送信します。フロントエンドとバックエンドが曖昧なHTTPリクエストを異なって解釈する場合、攻撃者はフロントエンドには見えないがバックエンドには見える悪意のあるメッセージを送信する可能性があり、事実上プロキシサーバーを「密輸」することになります。

詳細な説明と例については、[CWE-444](https://cwe.mitre.org/data/definitions/444.html)を参照してください。

この攻撃は、Node.jsが（任意の）HTTPサーバーとは異なる方法でHTTPリクエストを解釈することに依存するため、攻撃が成功するかどうかはNode.js、フロントエンドサーバー、またはその両方の脆弱性に起因する可能性があります。Node.jsによるリクエストの解釈方法がHTTP仕様（[RFC7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3)参照）と一致している場合、それはNode.jsの脆弱性とは見なされません。

**緩和策**

* HTTPサーバーを作成する際に`insecureHTTPParser`オプションを使用しないでください。
* 曖昧なリクエストを正規化するようにフロントエンドサーバーを設定します。
* Node.jsと選択したフロントエンドサーバーの両方で、新しいHTTPリクエストスマグリングの脆弱性を継続的に監視します。
* 可能であれば、エンドツーエンドでHTTP/2を使用し、HTTPダウングレードを無効にします。

### タイミング攻撃による情報漏洩 (CWE-208)

これは、攻撃者が例えばアプリケーションがリクエストに応答するのにかかる時間を測定することによって、潜在的に機密性の高い情報を知ることができる攻撃です。この攻撃はNode.jsに特有のものではなく、ほぼすべてのランタイムを標的にする可能性があります。

この攻撃は、アプリケーションがタイミングに敏感な操作（例：分岐）でシークレットを使用する場合に可能になります。典型的なアプリケーションでの認証処理を考えてみましょう。ここでは、基本的な認証方法としてメールアドレスとパスワードが資格情報として含まれます。ユーザー情報は、理想的にはDBMSからユーザーが提供した入力から取得されます。データベースから取得したユーザー情報とパスワードを比較します。組み込みの文字列比較を使用すると、同じ長さの値の場合、より長い時間がかかります。この比較が許容できる量実行されると、意図せずにリクエストの応答時間が増加します。リクエストの応答時間を比較することで、攻撃者は大量のリクエストでパスワードの長さと値を推測できます。

**緩和策**

* `crypto` APIは、定数時間アルゴリズムを使用して実際と期待される機密値を比較するための`timingSafeEqual`関数を公開しています。
* パスワードの比較には、ネイティブのcryptoモジュールでも利用可能な[scrypt](https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback)を使用できます。
* より一般的には、可変時間操作でシークレットを使用しないでください。これには、シークレットでの分岐や、攻撃者が同じインフラストラクチャ（例：同じクラウドマシン）に共存している場合にシークレットをメモリへのインデックスとして使用することが含まれます。JavaScriptで定数時間コードを書くのは困難です（一部はJITのため）。暗号アプリケーションには、組み込みの暗号APIまたはWebAssembly（ネイティブに実装されていないアルゴリズムの場合）を使用してください。

### 悪意のあるサードパーティモジュール (CWE-1357)

現在、Node.jsでは、どのパッケージもネットワークアクセスなどの強力なリソースにアクセスできます。さらに、ファイルシステムにもアクセスできるため、任意のデータをどこにでも送信できます。

nodeプロセスで実行されるすべてのコードは、`eval()`（またはその同等物）を使用して追加の任意のコードをロードして実行する能力を持っています。ファイルシステムへの書き込みアクセス権を持つすべてのコードは、ロードされる新しいファイルまたは既存のファイルに書き込むことによって同じことを達成できます。

Node.jsには、ロードされたリソースを信頼できない、または信頼できると宣言するための実験的な[¹](#experimental-features-in-production)[ポリシーメカニズム](https://nodejs.org/api/permissions.html#policies)があります。ただし、このポリシーはデフォルトでは有効になっていません。依存関係のバージョンを固定し、一般的なワークフローまたはnpmスクリプトを使用して脆弱性の自動チェックを実行してください。パッケージをインストールする前に、そのパッケージが維持されており、期待するすべてのコンテンツが含まれていることを確認してください。注意してください、GitHubのソースコードは公開されているものと常に同じとは限りません。*node_modules*で検証してください。

#### サプライチェーン攻撃

Node.jsアプリケーションに対するサプライチェーン攻撃は、その依存関係の1つ（直接または推移的）が侵害されたときに発生します。これは、アプリケーションが依存関係の仕様に甘すぎる（不要な更新を許可する）こと、および/または仕様の一般的なタイプミス（[タイポスクワッティング](https://en.wikipedia.org/wiki/Typosquatting)に対して脆弱）が原因で発生する可能性があります。

上流のパッケージを乗っ取った攻撃者は、悪意のあるコードを含む新しいバージョンを公開できます。Node.jsアプリケーションが、どのバージョンが安全に使用できるかについて厳密でなくそのパッケージに依存している場合、パッケージは自動的に最新の悪意のあるバージョンに更新され、アプリケーションが侵害される可能性があります。

`package.json`ファイルで指定された依存関係は、正確なバージョン番号または範囲を持つことができます。ただし、依存関係を正確なバージョンに固定しても、その推移的な依存関係は固定されません。これにより、アプリケーションは依然として不要な/予期しない更新に対して脆弱なままです。

考えられる攻撃ベクトル：

* タイポスクワッティング攻撃
* ロックファイルの汚染
* 侵害されたメンテナー
* 悪意のあるパッケージ
* 依存関係の混乱

**緩和策**

* `--ignore-scripts`を使用してnpmが任意のスクリプトを実行するのを防ぎます
  * さらに、`npm config set ignore-scripts true`でグローバルに無効にできます
* 依存関係のバージョンを、範囲や可変ソースではなく、特定の不変バージョンに固定します。
* すべての依存関係（直接および推移的）を固定するロックファイルを使用します。
  * [ロックファイル汚染の緩和策](https://blog.ulisesgascon.com/lockfile-posioned)を使用します。
* [`npm-audit`](https://docs.npmjs.com/cli/commands/npm-audit)のようなツールを使用して、CIで新しい脆弱性を自動的にチェックします。
  * [`Socket`](https://socket.dev/)のようなツールを使用して、静的分析でパッケージを分析し、ネットワークやファイルシステムへのアクセスなどの危険な動作を見つけることができます。
* `npm install`の代わりに[`npm ci`](https://docs.npmjs.com/cli/v8/commands/npm-ci)を使用します。これにより、ロックファイルが強制され、それと*package.json*ファイルとの間の不整合がエラーを引き起こします（*package.json*を優先してロックファイルを黙って無視するのではなく）。
* *package.json*ファイルで依存関係の名前にエラー/タイプミスがないか注意深く確認します。

### メモリアクセス違反 (CWE-284)

メモリベースまたはヒープベースの攻撃は、メモリ管理エラーと悪用可能なメモリアロケータの組み合わせに依存します。すべてのランタイムと同様に、Node.jsは、共有マシンでプロジェクトを実行する場合、これらの攻撃に対して脆弱です。セキュアヒープを使用すると、ポインタのオーバーランやアンダーランによる機密情報の漏洩を防ぐのに役立ちます。

残念ながら、セキュアヒープはWindowsでは利用できません。詳細については、Node.jsの[secure-heapドキュメント](https://nodejs.org/dist/latest-v18.x/docs/api/cli.html#--secure-heapn)を参照してください。

**緩和策**

* アプリケーションに応じて`--secure-heap=n`を使用します。ここで*n*は割り当てられる最大バイトサイズです。
* 本番アプリを共有マシンで実行しないでください。

### モンキーパッチ (CWE-349)

モンキーパッチとは、既存の動作を変更することを目的として、実行時にプロパティを変更することを指します。例：

```javascript
Array.prototype.push = function (item) {
  // グローバルの [].push を上書き
};
```

**緩和策**

`--frozen-intrinsics`フラグは、実験的な[¹](#experimental-features-in-production)凍結された組み込みオブジェクトを有効にします。これは、すべての組み込みJavaScriptオブジェクトと関数が再帰的に凍結されることを意味します。したがって、次のスニペットは`Array.prototype.push`のデフォルトの動作を上書き**しません**。

```javascript
Array.prototype.push = function (item) {
  // グローバルの [].push を上書き
};

// Uncaught:
// TypeError <Object <Object <[Object: null prototype] {}>>>:
// Cannot assign to read only property 'push' of object ''
```

ただし、`globalThis`を使用して新しいグローバルを定義したり、既存のグローバルを置き換えたりすることはまだ可能であることに注意することが重要です。

```shell
> globalThis.foo = 3; foo; // 新しいグローバルを定義できます
3
> globalThis.Array = 4; Array; // ただし、既存のグローバルも置き換えられます
4
```

したがって、`Object.freeze(globalThis)`を使用して、グローバルが置き換えられないことを保証できます。

### プロトタイプ汚染攻撃 (CWE-1321)

プロトタイプ汚染とは、`__proto__`、`constructor`、`prototype`、および組み込みプロトタイプから継承されたその他のプロパティの乱用により、Javascript言語アイテムにプロパティを変更または注入する可能性を指します。

```javascript
const a = { a: 1, b: 2 };
const data = JSON.parse('{"__proto__": { "polluted": true}}');

const c = Object.assign({}, a, data);
console.log(c.polluted); // true

// 潜在的なDoS
const data2 = JSON.parse('{"__proto__": null}');
const d = Object.assign(a, data2);
d.hasOwnProperty('b'); // Uncaught TypeError: d.hasOwnProperty is not a function
```

これは、JavaScript言語から継承された潜在的な脆弱性です。

**例**:

* [CVE-2022-21824](https://www.cvedetails.com/cve/CVE-2022-21824/) (Node.js)
* [CVE-2018-3721](https://www.cvedetails.com/cve/CVE-2018-3721/) (サードパーティライブラリ: Lodash)

**緩和策**

* [安全でない再帰的マージ](https://gist.github.com/DaniAkash/b3d7159fddcff0a9ee035bd10e34b277#file-unsafe-merge-js)を避けます。[CVE-2018-16487](https://www.cve.org/CVERecord?id=CVE-2018-16487)を参照してください。
* 外部/信頼できないリクエストに対してJSONスキーマ検証を実装します。
* `Object.create(null)`を使用してプロトタイプなしのオブジェクトを作成します。
* プロトタイプを凍結します：`Object.freeze(MyObject.prototype)`。
* `--disable-proto`フラグを使用して`Object.prototype.__proto__`プロパティを無効にします。
* `Object.hasOwn(obj, keyFromObj)`を使用して、プロパティがプロトタイプからではなく、オブジェクトに直接存在することを確認します。
* `Object.prototype`のメソッドの使用を避けます。

### 制御されていない検索パス要素 (CWE-427)

Node.jsは、[モジュール解決アルゴリズム](https://nodejs.org/api/modules.html#modules_all_together)に従ってモジュールをロードします。したがって、モジュールが要求された（require）ディレクトリが信頼されていると想定します。

これにより、次のアプリケーションの動作が期待されます。次のディレクトリ構造を想定します。

* *app/*
  * *server.js*
  * *auth.js*
  * *auth*

server.jsが`require('./auth')`を使用する場合、モジュール解決アルゴリズムに従い、*auth.js*ではなく*auth*をロードします。

**緩和策**

実験的な[¹](#experimental-features-in-production)[整合性チェック付きのポリシーメカニズム](https://nodejs.org/api/permissions.html#integrity-checks)を使用すると、上記の脅威を回避できます。上記のディレクトリに対して、次の`policy.json`を使用できます。

```json
{
  "resources": {
    "./app/auth.js": {
      "integrity": "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8="
    },
    "./app/server.js": {
      "dependencies": {
        "./auth": "./app/auth.js"
      },
      "integrity": "sha256-NPtLCQ0ntPPWgfVEgX46ryTNpdvTWdQPoZO3kHo0bKI="
    }
  }
}
```

したがって、*auth*モジュールを要求すると、システムは整合性を検証し、期待されるものと一致しない場合はエラーをスローします。

```shell
» node --experimental-policy=policy.json app/server.js
node:internal/policy/sri:65
      throw new ERR_SRI_PARSE(str, str[prevIndex], prevIndex);
      ^

SyntaxError [ERR_SRI_PARSE]: Subresource Integrity string "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8=%" had an unexpected "%" at position 51
    at new NodeError (node:internal/errors:393:5)
    at Object.parse (node:internal/policy/sri:65:13)
    at processEntry (node:internal/policy/manifest:581:38)
    at Manifest.assertIntegrity (node:internal/policy/manifest:588:32)
    at Module._compile (node:internal/modules/cjs/loader:1119:21)
    at Module._extensions..js (node:internal/modules/cjs/loader:1213:10)
    at Module.load (node:internal/modules/cjs/loader:1037:32)
    at Module._load (node:internal/modules/cjs/loader:878:12)
    at Module.require (node:internal/modules/cjs/loader:1061:19)
    at require (node:internal/modules/cjs/helpers:99:18) {
  code: 'ERR_SRI_PARSE'
}
```

ポリシーの変更を避けるために、常に`--policy-integrity`の使用をお勧めします。

## 本番環境での実験的機能

本番環境での実験的機能の使用は推奨されません。実験的機能は必要に応じて破壊的変更を受ける可能性があり、その機能は安全に安定していません。ただし、フィードバックは高く評価されます。

## OpenSSF ツール

[OpenSSF](https://openssf.org/)は、特にnpmパッケージを公開する予定がある場合に非常に役立ついくつかのイニシアチブを主導しています。これらのイニシアチブには次のものが含まれます。

* [OpenSSF Scorecard](https://securityscorecards.dev/) Scorecardは、一連の自動化されたセキュリティリスクチェックを使用してオープンソースプロジェクトを評価します。これを使用して、コードベースの脆弱性と依存関係を事前に評価し、脆弱性を受け入れるかどうかの情報に基づいた決定を下すことができます。
* [OpenSSF Best Practices Badge Program](https://bestpractices.coreinfrastructure.org/en) プロジェクトは、各ベストプラクティスにどのように準拠しているかを説明することで、自発的に自己認証できます。これにより、プロジェクトに追加できるバッジが生成されます。
