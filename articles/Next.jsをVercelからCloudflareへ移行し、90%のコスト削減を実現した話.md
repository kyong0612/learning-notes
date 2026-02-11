---
title: "Next.jsをVercelからCloudflareへ移行し、90%のコスト削減を実現した話"
source: "https://tech.hello.ai/entry/vercel-cloudflare-migration"
author:
  - "[[酒井 (hello__sakai)]]"
published: 2026-02-10
created: 2026-02-11
description: |
  AutoReserve（グローバルレストラン予約サービス）のNext.jsアプリケーションをVercelからOpenNext + Cloudflare Workersへ移行し、月額インフラコストを約90%削減した技術的な移行記録。Vercelのコスト構造上の課題、Cloudflare選定の理由、移行時の技術的課題と対策、段階的な移行戦略、開発体験の維持について詳述。
tags:
  - "clippings"
  - "Next.js"
  - "Cloudflare Workers"
  - "OpenNext"
  - "Vercel"
  - "インフラコスト最適化"
  - "セルフホスティング"
---

# Next.jsをVercelからCloudflareへ移行し、90%のコスト削減を実現した話

ref: <https://tech.hello.ai/entry/vercel-cloudflare-migration>

---

## 背景

- **AutoReserve**は世界中のレストラン予約を扱うグローバルサービス（iOS / Android / Web の3プラットフォーム展開）
- Web版は**約100ページ規模のNext.jsアプリケーション**
- 一時期SPA構成だったが、SEOとパフォーマンスの課題から**2024年ごろにNext.js + Vercelへ段階的に移行**

### SPA → Next.js + Vercel移行の成果

- キャッシュ無効状態のクローラ向けページロード時間が**約2.8倍高速化**
- Core Web Vitals（LCP）が**平均1.7倍改善**

### 問題の発生

SSR化により、サービスの成長とグローバル展開に伴い**Vercelのコストが急増**。月あたり**約200万円**の請求が継続的に発生し、さらに増加する見込みだった。

---

## Vercelで直面したコスト問題

### 1. キャッシュが効きづらい構造

- **(世界のレストラン数 + 検索結果ページ) × 言語数**のページが存在し、キャッシュヒット率が低い
- **Fluid Compute**を検証：約40%のCompute削減効果を確認したが、以下の問題で本番導入を見送り
  - CPUをPerformanceレベルに上げるとCompute削減効果が相殺
  - CPUをStandardのままにするとCPU Throttlingによりレイテンシーが増加
- **請求額の約1/3がCompute課金**だが、削減余地が限られていた

### 2. 帯域幅課金の構造的問題

- Vercelではデータ転送（帯域幅）に課金が発生
  - VercelのCDN ↔ エンドユーザー間
  - VercelのCDN ↔ Vercel Compute間
  - マネージドインフラのため原因究明・解消が困難
- SSRが多いサービスではバックエンドAPI（GCP）との通信・HTML配信が積み上がりやすい
- **請求額の約1/2が帯域幅に起因**

---

## 移行先の検討

### 重視したポイント

1. SEO/パフォーマンスを維持できること
2. SSRのComputeコストが安いこと
3. 帯域幅課金がない、または極めて安価であること
4. Next.jsを継続利用できること

### Cloudflareを選んだ理由

| 項目 | Vercel | Cloudflare Workers |
|---|---|---|
| Compute課金 | Wall Time（バックエンドAPI待ち時間含む） | **CPU Timeベース**（API待ち時間が課金対象外） |
| 帯域幅課金 | あり（請求額の約50%） | **なし** |
| CPU時間単価 | $0.36/CPU-hr | **約1/4** |

> Vercelの単価は Legacy Pricing、Standard = 1vCPU / 2GB での計算（$0.18/GB-hr）。ワークロード特性により変動あり。

### OpenNextを選んだ理由

Next.jsのセルフホスティング方法は3つ：
1. **OpenNext**を使用しプラットフォームにデプロイ ← **採用**
2. Dockerを使用しデプロイ
3. Node.jsサーバーとして動かす

OpenNext採用の理由：
- Cloudflare Workersは**オートスケールで管理が容易**
- **エッジで動作**し、コールドスタートもほぼなくパフォーマンス的に有利
- CloudflareのアダプターはCloudflare公式が管理しており**長期的なメンテナンスが期待できる**

---

## Cloudflareへの移行：技術的課題と対策

### Cloudflare Workersの制約対応

#### Node.js互換性対応

- Cloudflare WorkersはNode.jsとの互換性が完全ではない（`nodejs_compat`有効化でも動作しないパッケージあり）
- **対応**: `axios`の依存関係からの除去（実際にはアプリケーションで未使用だった）
- 対応ライブラリへの移行や不要パッケージの除去で比較的回避しやすい

#### バンドルサイズ制限

Workers Paidプランの制約:
- Worker単体: **10MB**
- 全体: **64MB**（圧縮前）

**対応**: `@sentry/nextjs`が読み込む**5MBのWASMファイル**を除外（Webpack設定で不要なバンドルを防止）

#### メモリ制限（128MB）

- Vercelでは超過ケースがあったが、Cloudflare Workersでも**安定して動作**を確認
- 追加対応なし

### デプロイ戦略

#### Cloudflare Workers Buildを使わなかった理由

- ビルド時間20分制限を超えるとデプロイ失敗（まれに発生し安定性に懸念）
- デプロイ完了をトリガーにE2Eテストを走らせづらい

→ **GitHub Actionsからのデプロイを採用**

#### 環境変数管理

- **GitHub Environments**（staging / production）で管理
- Cloudflare Workersのランタイム環境変数は`wrangler secret bulk`でGitHub Environmentsと**デプロイ時に同期**

#### Sentry対応

- 移行実施時点で`@sentry/nextjs`がCloudflare Workers非対応（[Issue #14931](https://github.com/getsentry/sentry-javascript/issues/14931)）
- **対応**: ビルド時にSource Mapsをアップロード、`@sentry/cloudflare` + Sentry CLIに移行

#### OpenNextのミドルウェア不具合修正

- 外部URLに対するrewriteが正しく動作しない不具合
- 筆者が`@opennextjs/aws`に**コントリビュート**し修正（[PR #1046](https://github.com/opennextjs/opennextjs-aws/pull/1046)）
- `@opennextjs/aws`はCloudflare環境下でも使用されるコアライブラリ

---

## 段階的な移行戦略

### ロールバック容易な並行デプロイ

- **Vercel / Cloudflare を並行してデプロイ**し、問題発生時に即切り戻しできる構成
- 両方に対してE2Eテストを別々に実行
- Vercel側のトラフィックも元々Cloudflareを通る構成だったため、**Cloudflare Workers Routesの切り替えだけで数クリックで瞬時にロールバック可能**（DNS変更不要）

---

## 開発体験の維持：ブランチデプロイの実現

Vercelのプレビューデプロイ機能に相当するワークフローをCloudflare Workers上で再現：

- コミットごとに`opennextjs-cloudflare build`でビルド＆アップロード
- `--preview-alias`オプションで**PRごとに固定のエイリアスURL**を発行（QA用）
- コミットごとに**独立したURL**が発行され、このURLに対してE2Eテストを実行

### 注意点

- Cloudflare Workersでは**Durable Objectsを使用しているとPreview URLを生成できない**制約あり
- OpenNextのキャッシュ機構でDurable Objectsを使用するため、**ブランチデプロイ時はMemory Queueを使用**するよう分岐して対応

---

## 移行後の効果

### コスト削減

月次請求ベースでフロントエンドのインフラコストを**約90%削減**

| 項目 | 効果 |
|---|---|
| Compute | **大幅削減** — CPU Time課金によりバックエンドAPI待ち時間が課金対象外、時間単価が約1/4 |
| 帯域幅 | **ほぼゼロ** — Cloudflareは帯域幅課金なし |

> ※ 他プロジェクトで引き続き使用しているVercelの席課金などの固定費を除いた請求額

### パフォーマンス / SEO

- Next.js + Vercelと**同等の水準を維持**
- Web Vitals指標に**悪影響なし**
- 本番運用開始後も大きな問題は発生していない

---

## まとめ

- **Next.js + OpenNext + Cloudflare Workers**への移行により、AutoReserveのインフラコストを大幅に削減
- Vercelの利便性は高いものの、**SSRが多くキャッシュが効きづらい大規模なNext.jsアプリケーション**では、課金構造上コストが嵩みやすい
- 今回の移行により、**トラフィックの増大に対応できる持続可能なコスト構造**を実現

### 重要な知見

1. **Vercelのコスト問題の本質**: Compute（1/3）+ 帯域幅（1/2）が主要因で、特に帯域幅はマネージドゆえに削減困難
2. **Cloudflareの優位性**: CPU Time課金（API待ち不問）＋帯域幅無料の組み合わせがSSR多用アプリに最適
3. **OpenNextの実用性**: OSSコミュニティとCloudflare公式の連携により実運用レベルに到達、ただしミドルウェアの不具合修正等の貢献が必要になるケースもある
4. **段階的移行の重要性**: 並行デプロイ＋即時ロールバック可能な構成がリスクを最小化
5. **開発体験の維持**: ブランチデプロイ・E2Eテスト統合など、Vercel相当のDXを再構築することが移行成功の鍵

---

### 制限事項

- Cloudflare WorkersにはNode.js互換性、バンドルサイズ（10MB/Worker）、メモリ（128MB）の制限がある
- `@sentry/nextjs`がCloudflare Workers非対応のため代替手段が必要
- Durable Objects使用時のPreview URL制約あり
- OpenNextはまだ成熟途上であり、不具合に遭遇する可能性がある（コントリビュートが必要になるケースも）
- Next.js 16のBuild Adapters API（Alpha）の動向によっては、将来的にOpenNextの必要性が変わる可能性がある
