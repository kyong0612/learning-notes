---
title: "Node.js — Node.jsのデバッグ"
source: "https://nodejs.org/en/learn/getting-started/debugging"
author:
  - "[[@nodejs]]"
published:
created: 2025-06-30
description: "Node.js®は、開発者がサーバー、Webアプリ、コマンドラインツール、スクリプトを作成できる、無料のオープンソース、クロスプラットフォームのJavaScriptランタイム環境です。"
tags:
  - "clippings"
---
## Node.jsのデバッグ

このガイドは、Node.jsアプリとスクリプトのデバッグを始めるのに役立ちます。

## インスペクターを有効にする

`--inspect`スイッチを付けて起動すると、Node.jsプロセスはデバッグクライアントを待ち受けます。デフォルトでは、ホストとポート127.0.0.1:9229で待ち受けます。各プロセスには一意の[UUID](https://tools.ietf.org/html/rfc4122)も割り当てられます。

インスペクタークライアントは、接続するためにホストアドレス、ポート、およびUUIDを知って指定する必要があります。完全なURLは`ws://127.0.0.1:9229/0f2c936f-b1cd-4ac9-aab3-f63b0f33d55e`のようになります。

Node.jsは、`SIGUSR1`シグナルを受信した場合もデバッグメッセージの待ち受けを開始します（`SIGUSR1`はWindowsでは利用できません）。Node.js 7以前では、これによりレガシーなDebugger APIが有効になります。Node.js 8以降では、Inspector APIが有効になります。

## セキュリティに関する考慮事項

デバッガーはNode.jsの実行環境に完全にアクセスできるため、このポートに接続できる悪意のある攻撃者は、Node.jsプロセスに代わって任意のコードを実行できる可能性があります。デバッガーポートをパブリックおよびプライベートネットワークに公開することのセキュリティ上の影響を理解することが重要です。

### デバッグポートを公に公開するのは安全ではありません

デバッガーがパブリックIPアドレスまたは0.0.0.0にバインドされている場合、あなたのIPアドレスに到達できるクライアントは、制限なくデバッガーに接続でき、任意のコードを実行できます。

デフォルトでは`node --inspect`は127.0.0.1にバインドします。デバッガーへの外部接続を許可するつもりなら、明示的にパブリックIPアドレスや0.0.0.0などを提供する必要があります。そうすることで、潜在的に重大なセキュリティ脅威にさらされる可能性があります。セキュリティ上の脆弱性を防ぐために、適切なファイアウォールとアクセス制御が設定されていることを確認することをお勧めします。

リモートデバッガークライアントが安全に接続できるようにするためのアドバイスについては、「[リモートデバッグシナリオを有効にする](https://nodejs.org/en/learn/getting-started/#enabling-remote-debugging-scenarios)」のセクションを参照してください。

### ローカルアプリケーションはインスペクターに完全にアクセスできます

インスペクターポートを127.0.0.1（デフォルト）にバインドしても、マシン上でローカルに実行されているアプリケーションは無制限にアクセスできます。これは、ローカルのデバッガーが便利にアタッチできるように設計されているためです。

### ブラウザ、WebSocket、および同一生成元ポリシー

Webブラウザで開かれたWebサイトは、ブラウザのセキュリティモデルの下でWebSocketおよびHTTPリクエストを行うことができます。一意のデバッガーセッションIDを取得するには、最初のHTTP接続が必要です。同一生成元ポリシーにより、WebサイトはこのHTTP接続を行うことができません。[DNSリバインディング攻撃](https://en.wikipedia.org/wiki/DNS_rebinding)に対する追加のセキュリティとして、Node.jsは接続の'Host'ヘッダーがIPアドレスまたは`localhost`を正確に指定していることを検証します。

これらのセキュリティポリシーにより、ホスト名を指定してリモートデバッグサーバーに接続することは許可されません。この制限は、IPアドレスを指定するか、以下で説明するようにsshトンネルを使用することで回避できます。

## インスペクタークライアント

`node inspect myscript.js`で最小限のCLIデバッガーが利用できます。いくつかの商用およびオープンソースツールもNode.jsインスペクターに接続できます。

### Chrome DevTools 55+、Microsoft Edge

- **オプション1**: Chromiumベースのブラウザで`chrome://inspect`を開くか、Edgeで`edge://inspect`を開きます。Configureボタンをクリックし、ターゲットのホストとポートがリストされていることを確認します。
- **オプション2**: `/json/list`の出力（上記参照）または--inspectヒントテキストから`devtoolsFrontendUrl`をコピーし、Chromeに貼り付けます。

詳細については、[https://github.com/ChromeDevTools/devtools-frontend](https://github.com/ChromeDevTools/devtools-frontend)、[https://www.microsoftedgeinsider.com](https://www.microsoftedgeinsider.com/)を参照してください。

### Visual Studio Code 1.10+

- デバッグパネルで、設定アイコンをクリックして`.vscode/launch.json`を開きます。初期設定のために「Node.js」を選択します。

詳細については、[https://github.com/microsoft/vscode](https://github.com/microsoft/vscode)を参照してください。

### Visual Studio 2017+

- メニューから「デバッグ > デバッグの開始」を選択するか、F5キーを押します。
- [詳細な手順](https://github.com/Microsoft/nodejstools/wiki/Debugging)。

### JetBrains WebStormおよびその他のJetBrains IDE

- 新しいNode.jsデバッグ構成を作成し、デバッグを押します。Node.js 7+では`--inspect`がデフォルトで使用されます。無効にするには、IDEレジストリで`js.debugger.node.use.inspect`のチェックを外します。WebStormおよびその他のJetBrains IDEでのNode.jsの実行とデバッグの詳細については、[WebStormオンラインヘルプ](https://www.jetbrains.com/help/webstorm/running-and-debugging-node-js.html)を確認してください。

### chrome-remote-interface

- [Inspector Protocol](https://chromedevtools.github.io/debugger-protocol-viewer/v8/)エンドポイントへの接続を容易にするためのライブラリ。

詳細については、[https://github.com/cyrus-and/chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface)を参照してください。

### Gitpod

- `Debug`ビューからNode.jsデバッグ構成を開始するか、`F5`キーを押します。[詳細な手順](https://medium.com/gitpod/debugging-node-js-applications-in-theia-76c94c76f0a1)

詳細については、[https://www.gitpod.io](https://www.gitpod.io/)を参照してください。

### Eclipse IDE with Eclipse Wild Web Developer extension

- .jsファイルから、「Debug As... > Node program」を選択するか、
- 実行中のNode.jsアプリケーション（`--inspect`で既に開始済み）にデバッガーをアタッチするためのデバッグ構成を作成します。

詳細については、[https://eclipse.org/eclipseide](https://eclipse.org/eclipseide)を参照してください。

## コマンドラインオプション

次の表は、さまざまなランタイムフラグがデバッグに与える影響をリストしています：

| フラグ | 意味 |
| --- | --- |
| \--inspect | インスペクターエージェントを有効にする。デフォルトのアドレスとポート（127.0.0.1:9229）で待ち受ける |
| \--inspect=\[host:port\] | インスペクターエージェントを有効にする。アドレスまたはホスト名`host`にバインドする（デフォルト: 127.0.0.1）。ポート`port`で待ち受ける（デフォルト: 9229） |
| \--inspect-brk | インスペクターエージェントを有効にする。デフォルトのアドレスとポート（127.0.0.1:9229）で待ち受ける。ユーザーコードが開始する前に中断する |
| \--inspect-brk=\[host:port\] | インスペクターエージェントを有効にする。アドレスまたはホスト名`host`にバインドする（デフォルト: 127.0.0.1）。ポート`port`で待ち受ける（デフォルト: 9229）。ユーザーコードが開始する前に中断する |
| \--inspect-wait | インスペクターエージェントを有効にする。デフォルトのアドレスとポート（127.0.0.1:9229）で待ち受ける。デバッガーがアタッチされるのを待つ。 |
| \--inspect-wait=\[host:port\] | インスペクターエージェントを有効にする。アドレスまたはホスト名`host`にバインドする（デフォルト: 127.0.0.1）。ポート`port`で待ち受ける（デフォルト: 9229）。デバッガーがアタッチされるのを待つ。 |
| \--disable-sigusr1 | プロセスにSIGUSR1シグナルを送信してデバッグセッションを開始する機能を無効にする。 |
| node inspect script.js | ユーザーのスクリプトを--inspectフラグの下で実行するために子プロセスを生成し、メインプロセスを使用してCLIデバッガーを実行する。 |
| node inspect --port=xxxx script.js | ユーザーのスクリプトを--inspectフラグの下で実行するために子プロセスを生成し、メインプロセスを使用してCLIデバッガーを実行する。ポート`port`で待ち受ける（デフォルト: 9229） |

## リモートデバッグシナリオを有効にする

デバッガーがパブリックIPアドレスで待ち受けることは決して推奨しません。リモートデバッグ接続を許可する必要がある場合は、代わりにsshトンネルを使用することをお勧めします。以下の例は説明のみを目的として提供しています。続行する前に、特権サービスへのリモートアクセスを許可することのセキュリティリスクを理解してください。

デバッグしたいリモートマシンremote.example.comでNode.jsを実行しているとします。そのマシンで、インスペクターがlocalhostのみをリッスンするようにしてノードプロセスを開始する必要があります（デフォルト）。

```bash
node --inspect server.js
```

次に、デバッグクライアント接続を開始したいローカルマシンで、sshトンネルを設定できます：

```bash
ssh -L 9221:localhost:9229 user@remote.example.com
```

これにより、ローカルマシンのポート9221への接続がremote.example.comのポート9229に転送されるsshトンネルセッションが開始されます。これで、Chrome DevToolsやVisual Studio Codeなどのデバッガーをlocalhost:9221にアタッチでき、Node.jsアプリケーションがローカルで実行されているかのようにデバッグできるはずです。

## レガシーデバッガー

**レガシーデバッガーはNode.js 7.7.0で非推奨になりました。代わりに`--inspect`とインスペクターを使用してください。**

バージョン7以前で**\--debug**または**\--debug-brk**スイッチを付けて起動した場合、Node.jsは廃止されたV8デバッグプロトコルで定義されたデバッグコマンドをTCPポート（デフォルトは`5858`）で待ち受けます。このプロトコルを話すデバッガークライアントは、実行中のプロセスに接続してデバッグできます。いくつかの人気のあるものが以下にリストされています。

V8デバッグプロトコルはもはや維持も文書化もされていません。

### 内蔵デバッガー

`node debug script_name.js`を実行して、内蔵のコマンドラインデバッガーの下でスクリプトを開始します。スクリプトは`--debug-brk`オプションで開始された別のNode.jsプロセスで開始され、最初のNode.jsプロセスは`_debugger.js`スクリプトを実行し、ターゲットに接続します。詳細については、[ドキュメント](https://nodejs.org/dist/latest/docs/api/debugger.html)を参照してください。

### node-inspector

Chromiumで使用される[Inspector Protocol](https://chromedevtools.github.io/debugger-protocol-viewer/v8/)をNode.jsで使用されるV8デバッガープロトコルに変換する中間プロセスを使用して、Chrome DevToolsでNode.jsアプリをデバッグします。詳細については、[https://github.com/node-inspector/node-inspector](https://github.com/node-inspector/node-inspector)を参照してください。

[前の記事：Node.jsとWebAssembly](https://nodejs.org/en/learn/getting-started/nodejs-with-webassembly) [次の記事：Node.jsアプリケーションのプロファイリング](https://nodejs.org/en/learn/getting-started/profiling)
