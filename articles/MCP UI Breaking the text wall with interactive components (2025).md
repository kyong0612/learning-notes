---
title: "MCP UI: Breaking the text wall with interactive components (2025)"
source: "https://shopify.engineering/mcp-ui-breaking-the-text-wall"
author:
  - "[[Liad Yosef]]"
published: 2025-08-05
created: 2025-08-14
description: |
  MCP UI extends the Model Context Protocol to enable AI agents to return fully interactive UI components. It solves the critical challenge that commerce experiences require visual and interactive elements like product selectors, image galleries, and cart flows. This open-source protocol allows agents to embed commerce components while maintaining control through an intent-based messaging system, delivering shopping experiences that go far beyond traditional text-only AI interactions.
tags:
  - "MCP"
  - "MCP-UI"
  - "AI-Agents"
  - "Interactive-UI"
  - "Shopify"
---

## TL;DR

MCP UIは、Model Context Protocol（MCP）を拡張し、AIエージェントがテキストだけでなく、完全にインタラクティブなUIコンポーネント（商品セレクター、画像ギャラリー、カートフローなど）を返せるようにするオープンソースプロトコルです。これにより、複雑なバリアント選択やリアルタイムの在庫状況更新が求められるコマース体験を、AIエージェントを通じてリッチに提供できます。コンポーネントはインテントベースのメッセージシステムでエージェントとの同期を保ち、ホスト環境に合わせてCSSでスタイリングすることも可能です。

---

## 概要

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) は、AIエージェントに製品カタログの検索、レビューの要約、カートの構築、購入完了の支援といった機能を提供します。しかし、テキストのみの対話では、特にコマース分野においてユーザー体験に限界があります。コマースでは、商品の画像、色の選択、サイズの選択、バンドル構成など、視覚的なコンテキストが不可欠です。これらの要素は、顧客が商品を購入する上で基本的な役割を果たします。

## MCP UIによるUIの課題解決

エージェントが自身でUIを生成するアプローチには、コマースUIの複雑さという問題が伴います。例えば、商品セレクターは、単純に見えても実際には以下のような多くの複雑な要素を扱わなければなりません。

* **バリアント**: サイズや色によって選択肢が変わる。
* **バンドル**: 複雑な価格設定ルールを持つ。
* **サブスクリプション**: 頻度選択オプションがある。
* **在庫**: リアルタイムで更新される。
* **地域対応**: 価格や在庫状況が地域によって異なる。

この課題に対処するため、MCP UIは以下の3つの方法で埋め込みUIリソースを返すことでMCPを拡張します。

1. **インラインHTML**: サンドボックス化されたiframeに`srcDoc`経由で埋め込む。
2. **リモートリソース**: サンドボックス化されたiframeにロードする。
3. **リモートDOM**: クライアントサイドで直接レンダリングする。

これにより、エージェントは多機能な商品カード（バリアント選択、バンドル、サブスクリプション、画像ギャラリー、カート追加機能などを含む）をレンダリングできます。

![Search Shop Catalogue](https://cdn.shopify.com/s/files/1/0779/4361/files/search_shop_catalogue.png?v=1754344340)

> Shopify Storefront MCP UI Serverプロトタイプで、検索、商品、カート、チェックアウトコンポーネントのインタラクティブなプレビューを確認できます: [mcpstorefront.com](https://mcpstorefront.com/?store=demostore.mock.shop&style=default)

## インテントシステムによるエージェントの制御

インタラクティブなコンポーネントは、エージェントとの状態同期という課題を生みます。MCP UIは、これをインテントベースのメッセージシステムで解決します。コンポーネントは状態を直接変更せず、エージェントが解釈する「インテント」を送信します。

このアーキテクチャにより、エージェントはリッチなユーザー体験を提供しつつ、制御を維持できます。以下のようなイベントが同じパターンに従います。

* `view_details`: ユーザーが詳細情報をクリック
* `checkout`: ユーザーが購入準備完了
* `notify`: コンポーネントがアクションを実行（例：カート更新）
* `ui-size-change`: コンポーネントがサイズ調整を要求

## アダプティブスタイリング

埋め込みコンポーネントは、ホスト環境のデザインに合わせる必要があります。MCP UIは、レンダリングデータシステムを介してCSSスタイリングをサポートしており、エージェントはコンポーネントの表示をカスタマイズするためのCSSを渡すことができます。

## インタラクティブエージェントの未来

MCP UIは、MCPプロトコルを強化する強力なアドオンです。プロトコルと規約を明確に定義することで、エージェントとMCPプロバイダーが協力し、よりリッチで強力な体験を提供できるようになります。Shopifyの[agent MCP](https://shopify.dev/docs/agents)はMCP UIの早期採用者です。

MCP UIの仕様と実装はオープンソースであり、MCPの埋め込みリソース仕様を基盤に構築されています。コマースに焦点を当てていますが、データ可視化、フォームビルダー、メディアプレーヤーなど、視覚的コンテキストが理解を助けるあらゆるドメインで同様のパターンが利用可能です。
