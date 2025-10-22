---
title: "Sandbox SDK (Beta)"
source: "https://developers.cloudflare.com/sandbox/"
author:
  - "[[Cloudflare Docs]]"
published: 2025-10-21
created: 2025-10-22
description: "Sandbox SDKは、信頼できないコードを隔離された環境で安全に実行できるようにします。Containersを基盤として構築されたSandbox SDKは、Workersアプリケーションからコマンドの実行、ファイル管理、バックグラウンドプロセスの実行、サービスの公開を行うためのシンプルなAPIを提供します。"
tags:
  - "clippings"
---
[コンテンツにスキップ](https://developers.cloudflare.com/sandbox/#_top)

Workers Paid プランで利用可能

Sandbox SDKは、信頼できないコードを隔離された環境で安全に実行できるようにします。[Containers](https://developers.cloudflare.com/containers/)を基盤として構築されたSandbox SDKは、[Workers](https://developers.cloudflare.com/workers/)アプリケーションからコマンドの実行、ファイル管理、バックグラウンドプロセスの実行、サービスの公開を行うためのシンプルなAPIを提供します。

Sandboxは、コードを実行する必要があるAIエージェント、対話型開発環境、データ分析プラットフォーム、CI/CDシステム、およびエッジでの安全なコード実行を必要とするあらゆるアプリケーションの構築に最適です。各サンドボックスは、完全なLinux環境を備えた独自の隔離されたコンテナで実行され、パフォーマンスを維持しながら強力なセキュリティ境界を提供します。

Sandboxを使用すると、Pythonスクリプトの実行、Node.jsアプリケーションの実行、データの分析、コードのコンパイル、複雑な計算の実行が可能です。シンプルなTypeScript APIで、インフラストラクチャの管理は不要です。

- [コマンドの実行](https://developers.cloudflare.com/sandbox/#tab-panel-810)
- [コードインタプリタ](https://developers.cloudflare.com/sandbox/#tab-panel-811)
- [ファイル操作](https://developers.cloudflare.com/sandbox/#tab-panel-812)

```typescript
import { getSandbox } from '@cloudflare/sandbox';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const sandbox = getSandbox(env.Sandbox, 'user-123');

    // コマンドを実行して結果を取得
    const result = await sandbox.exec('python --version');

    return Response.json({
      output: result.stdout,
      exitCode: result.exitCode,
      success: result.success
    });
  }
};
```

[

はじめに

](<https://developers.cloudflare.com/sandbox/get-started/)[>

APIリファレンス

](<https://developers.cloudflare.com/sandbox/api/>)

---

## 機能

### コマンドを安全に実行

シェルコマンド、Pythonスクリプト、Node.jsアプリケーションなどを、ストリーミング出力サポートと自動タイムアウト処理で実行できます。

[コマンド実行について学ぶ](https://developers.cloudflare.com/sandbox/guides/execute-commands/)

### ファイルとプロセスの管理

サンドボックスファイルシステム内のファイルの読み取り、書き込み、操作が可能です。バックグラウンドプロセスを実行し、出力を監視し、長時間実行される操作を管理できます。

[ファイル操作について学ぶ](https://developers.cloudflare.com/sandbox/guides/manage-files/)

### プレビューURLでサービスを公開

サンドボックスで実行されているHTTPサービスを、自動生成されたプレビューURLで公開できます。対話型開発環境やアプリケーションホスティングに最適です。

[プレビューURLについて学ぶ](https://developers.cloudflare.com/sandbox/guides/expose-services/)

### コードを直接実行

チャート、テーブル、画像を含むリッチな出力でPythonおよびJavaScriptコードを実行できます。AI生成コードや対話型ワークフローのために、実行間で永続的な状態を維持できます。

[コード実行について学ぶ](https://developers.cloudflare.com/sandbox/guides/code-execution/)

---

## ユースケース

Sandboxで強力なアプリケーションを構築:

大規模言語モデルが生成したコードを安全かつ確実に実行できます。信頼できないコードを実行する必要があるAIエージェント、コードアシスタント、自律システムに最適です。

pandas、NumPy、Matplotlibを使用した対話型データ分析環境を作成できます。自動的なリッチ出力フォーマットでチャート、テーブル、ビジュアライゼーションを生成します。

完全なLinux環境とプレビューURLを備えたクラウドIDE、コーディングプレイグラウンド、共同開発ツールを構築できます。

並列実行とストリーミングログにより、隔離された環境でテストの実行、コードのコンパイル、ビルドパイプラインの実行が可能です。

---

**[Containers](https://developers.cloudflare.com/containers/)**

Sandboxを支えるサーバーレスコンテナランタイム。エッジであらゆるコンテナ化されたワークロードを実行できます。

**[Workers AI](https://developers.cloudflare.com/workers-ai/)**

ネットワーク上で機械学習モデルとLLMを実行します。Sandboxと組み合わせることで、安全なAIコード実行ワークフローを実現できます。

**[Durable Objects](https://developers.cloudflare.com/durable-objects/)**

Sandboxが強力な一貫性を持つ永続的な環境を維持できるようにするステートフルな調整レイヤー。

---

[チュートリアル](https://developers.cloudflare.com/sandbox/tutorials/)

AIコード実行、データ分析、対話型環境などの完全な例を探索できます。

[ハウツーガイド](https://developers.cloudflare.com/sandbox/guides/)

Sandbox SDKを使用して特定の問題を解決し、機能を実装する方法を学びます。

[APIリファレンス](https://developers.cloudflare.com/sandbox/api/)

Sandbox SDKの完全なAPIドキュメントを探索できます。

[コンセプト](https://developers.cloudflare.com/sandbox/concepts/)

Sandbox SDKの主要なコンセプトとアーキテクチャについて学びます。

[設定](https://developers.cloudflare.com/sandbox/configuration/)

Sandbox SDKの設定オプションについて学びます。

[GitHubリポジトリ](https://github.com/cloudflare/sandbox-sdk)

SDKのソースコードを表示し、問題を報告し、プロジェクトに貢献できます。

[ベータ版情報](https://developers.cloudflare.com/sandbox/platform/beta-info/)

Sandboxベータ版、現在のステータス、今後の機能について学びます。

[料金](https://developers.cloudflare.com/sandbox/platform/pricing/)

基盤となるContainersプラットフォームに基づくSandboxの料金体系を理解できます。

[制限](https://developers.cloudflare.com/sandbox/platform/limits/)

リソース制限、クォータ、それらの範囲内で作業するためのベストプラクティスについて学びます。
