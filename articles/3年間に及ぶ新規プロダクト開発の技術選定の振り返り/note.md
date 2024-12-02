# 3年間に及ぶ新規プロダクト開発の技術選定の振り返り

ref: <https://tech.buysell-technologies.com/entry/adventcalendar2024-12-01>

## プロダクト概要

EXSは複数のECサイトへの出品・受注業務を一元管理するWebアプリケーションです。8つのECサイトに対応し、各サイトの仕様の違いを吸収して連携を行います[1]。

## 技術スタック

**バックエンド**

- Go言語
- GraphQL/REST API
- Hasura
- GORM

**フロントエンド**

- Next.js
- TypeScript
- Apollo Client

**インフラ**

- Google Cloud
- Cloud Run
- PostgreSQL
- Elasticsearch[1]

## 成功した技術選定

**Go言語の採用**

- 学習コストが低く、新メンバーが参加しやすい
- シンプルな言語仕様により可読性が高い
- CLIツール作成が容易[1]

**GraphQLの採用**

- Fragment Colocationによるデータフェッチの最適化
- スキーマファーストの開発が可能
- フロントエンド・バックエンド間の契約としての機能[1]

**Cloud Runの採用**

- デプロイが容易
- 自動スケーリング機能
- サービスごとの柔軟な設定が可能[1]

## 課題のあった技術選定

**Hasuraの採用**

- テーブル構造がそのままGraphQLスキーマになる制約
- フロントエンド処理の肥大化
- パフォーマンスの問題[1]

**Next.jsの採用**

- Static Exportsでのダイナミックルーティングの制限
- サーバーへの移行コストが高い
- アップデート追従のコスト[1]

**Apollo Clientの採用**

- キャッシュ機構の活用が想定より限定的
- 挙動の変更による予期せぬ問題
- キャッシュを使わない方針となり、メリットが減少[1]

この振り返りから、技術選定では要件を正確に見極め、必要以上に高機能な技術を選択せず、要件に適した技術を選ぶことの重要性が示されています[1]。

Sources
[1] adventcalendar2024-12-01 <https://tech.buysell-technologies.com/entry/adventcalendar2024-12-01>
[2] 3年間に及ぶ新規プロダクト開発の技術選定の振り返り - バイセル Tech Blog <https://tech.buysell-technologies.com/entry/adventcalendar2024-12-01>
