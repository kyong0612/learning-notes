---
title: "【チート級】この5つのClaude Code Skillsは個人開発のチートスキルです【Claude Code】"
source: "https://www.youtube.com/watch?v=gkcUAtAfw1I"
author:
  - "[[ShinCode]]"
published: 2026-02-12
created: 2026-02-16
description: "Claude Codeのスキルズ機能を活用した個人開発の効率化について、実際に月5万円を稼ぐWebサービス「サムネAI」の開発者が、おすすめのスキル5選（find-skills、ui-ux-pro-max、vercel-react-best-practices、remotion-best-practices、funnel-analysis & cro-methodology）を実演付きで解説する動画。開発だけでなくビジネス分析やマーケティングにもスキルズが活用できることを示している。"
tags:
  - "clippings"
  - "youtube"
  - "Claude Code"
  - "AI"
  - "vibecoding"
  - "個人開発"
  - "Skills"
  - "React"
  - "Next.js"
  - "マーケティング"
---

## 動画概要

- **チャンネル**: [[ShinCode]]
- **公開日**: 2026-02-12
- **長さ**: 約33分

個人開発で月5万円を稼ぐWebサービス「サムネAI」の開発者・ShinCodeが、Claude Code Skillsの中から特におすすめの5つを実演付きで紹介する動画。skills.sh というスキルディレクトリサイトを起点に、開発・デザイン・ビジネス分析まで幅広くカバーするスキルを実際のプロジェクトで使いながら解説している。

## タイムスタンプ付き要約

### [00:00] イントロダクション

- Claude Codeの初期段階から使用しているShinCodeが、おすすめスキル5選を紹介
- 個人開発で月5万円を稼ぐ「サムネAI」（https://www.samune-ai.jp/）でもスキルズを活用中
- **skills.sh** というサイトでランキング形式でスキルの人気度を確認可能
- Vercel等のトップエンジニアが作成したスキルを、コマンド一つで自分の環境に導入できる

### [01:44] ① find-skills — スキル検索スキル

- **概要**: 「こういうスキルないかな？」と聞くと、適切なスキルを検索して提案してくれるスキル
- **インストール**: skills.shからコマンドをコピーして実行するだけ
- **スコープ**: プロジェクト単位（そのプロジェクトのみ）またはグローバル（全プロジェクト共通）で選択可能
- **使用例**: 「UI/UXをブラッシュアップしたい時に使えるスキルは？」と質問すると、ui-ux-pro-max等を提案
- スキルが多すぎてどれを入れればいいか分からない場合に特に有効

### [04:41] ② ui-ux-pro-max — UI/UXデザイン参照スキル

- **概要**: ページのURLを貼り付けるだけで、そのサイトのUI/UXデザインを分析し、自分のプロジェクトに反映できるスキル
- **主な機能**:
  - Webサイトを検索してデザインシステムを抽出
  - タイポグラフィ、スタイル等を参考にUI構築
  - UIレビューチェック機能
  - デザインシステムの永続化
- **デモ**: Tailwind CSSのダッシュボードテンプレートのURLを渡し、HTML/CSS/Tailwind CSSで同等品質のダッシュボードを約5分で生成
- **注意**: デザインはそのまま使わず、アレンジして使用することを推奨（著作権の観点から）

### [08:07] ③ vercel-react-best-practices — React/Next.jsベストプラクティスチェック

- **概要**: React / Next.jsプロジェクト全体のコードをベストプラクティスに照らしてチェック
- **デモ結果**（サムネAIの「作成履歴」ページで実施）:
  - **合格項目**:
    - ウォーターフォール排除: `Promise.all` で履歴と投稿済みIDを並列取得 ✅
    - ストリーミング: Suspense Boundary を活用 ✅
    - 不要な早期アベイト: なし ✅
  - **不合格項目**:
    - **バンドルサイズ最適化**: `JSZip` がトップレベルでインポートされており、一括ダウンロード時のみ使用するため `next/dynamic` か動的インポートにすべき ❌
    - **サーバーアクションの認証チェック**: 未実施 ❌
    - **フィルタリングのメモ化**: 未実施（再レンダリング時に全件再計算されている） ❌
- **修正例**: `JSZip` を `try` ブロック内で動的インポートに変更 → 一括ダウンロードしないユーザーのバンドルサイズ削減
- **学びのポイント**: 自分でアプリを作り、Vercelエンジニアのスキルでチェックするという「新しい勉強のあり方」
- Supabase用のベストプラクティス（スキーマ最適化、RLS、セキュリティチェック）も別途存在

### [14:30] ④ remotion-best-practices — Remotionで動画作成

- **概要**: Remotionライブラリを使ってコードで動画を作成するためのベストプラクティスを提供するスキル
- **Remotionとは**: コード（HTML/CSS）で動画を作成できるライブラリ
- **デモ**: サムネAIの20秒紹介動画をコマンド一つで生成
  - `npx remotion studio` でローカルホスト:3100にプレビュー画面が起動
  - レンダーボタンで動画ファイルとして出力可能（MP4等）
  - 約1分でビルド完了
- **活用シーン**:
  - アプリのローンチ時の紹介動画
  - TikTokやXでの宣伝動画
  - マーケティングツールとして
- **注意**: YouTube動画の量産はBANの対象になるため非推奨

### [20:17] ⑤ funnel-analysis & cro-methodology — ファネル分析とコンバージョン率最適化

- **概要**: アプリにおけるユーザーの離脱率をチェックし、ボトルネックを特定して改善仮説を提案するスキル
- **ファネル分析の仕組み**: Supabase + Google Analytics 4を使用
  - LP訪問 → 新規登録 → 画像生成 → 課金 の各ステップでの離脱率を計測
- **サムネAIの実際のデータ（2週間分）**:
  - LP訪問 → サインアップ: **31.9%**（3人に1人が登録、大幅改善）
  - サインアップ → 初回生成: **88.7%**（非常に高い数値）
  - 初回生成 → 課金: **7.6%**（上昇傾向）
  - サブスクリプション: 5件、買い切り: 11件、合計16課金
  - SNSやブログからの流入はノイズ除外（LP直アクセスのみで計測）
  - 話者は「PMF（Product-Market Fit）を達成してきた感覚がある」と発言
- **CRO Methodology（Conversion Rate Optimization / コンバージョン率最適化）**: データとユーザー心理に基づいて訪問者を効率的にCVに導くプロセス
- **売上2倍のロードマップ**:
  - 単一レバーを2倍にする必要はなく、複数ステップの掛け算で達成
  - 課金率 +38%、ARPU（Average Revenue Per User / 課金者あたり平均売上） +40% で2倍に到達可能
  - **具体的施策**: 生成完了後のアップセルモーメント強化、価格のアンカリング効果の活用（中間プラン1,490円への誘導）
- **実績**: 月1〜2万円 → 月5万円超に売上が成長（MRR / Monthly Recurring Revenue は3万円、買い切り含めて5万円超）

### [26:02] 【番外編】skill-creator — 自作スキル

- **概要**: 自分が欲しいスキルを簡単に作成できるスキル
- **デモ**: 確定申告を自動化するスキルを作成
  - Stripe MCP経由で売上データを取得
  - 経費の仕訳（CSV、スプレッドシート、レシート等をアップロード）
  - Markdown形式で出力
  - ※最終的な判断は税理士に確認することを推奨
- **活用可能性**:
  - 投資のレコメンデーション
  - SNS API連携によるバズ分析
  - TikTok/X等のコンテンツ収集と分析

### [28:53] さいごに — AI時代の展望

- **主張**: スキルズの登場により、あらゆる専門職・ホワイトカラーの仕事が代替されつつある
- **具体例**:
  - Webライターの仕事は減少傾向
  - サムネイル作成もAIで可能に
  - ソフトウェア開発、デザイン、確定申告等のより高度な仕事も民主化
- **今後の予測**: お金の価値が変化し、AI起業が生き残りの鍵になる

## キーメッセージ

1. **skills.sh はスキルのハブ**: Vercel等のトップエンジニアが作ったスキルをランキング形式で閲覧・導入可能
2. **開発以外にもスキルは活用できる**: ファネル分析、CRO、確定申告など、ビジネス全般でスキルズが威力を発揮
3. **ベストプラクティスチェックは新しい学習法**: 自分のアプリをプロのスキルでレビューすることで、実践的に技術を学べる
4. **個人開発の収益化にはスキルズが効果的**: 実際に月1〜2万円から月5万円超へ成長した実績あり
5. **スキルクリエイターで無限の拡張性**: 自分だけのオリジナルスキルを簡単に作成可能

## 結論・示唆

### 話者の結論

- Claude Code Skillsにより、専門知識がなくてもプロレベルの開発・ビジネス運営が可能になった
- AI時代においては、自分でプロダクトを作って売ることが最も重要な生存戦略
- スキルズの民主化により外注・受託の需要は減少傾向にある

### 実践的な示唆

- [ ] skills.sh にアクセスしてランキングを確認し、自分のプロジェクトに合うスキルを探す
- [ ] find-skills をグローバルインストールして、スキル検索の入口にする
- [ ] vercel-react-best-practices でプロジェクトのコード品質をチェックする
- [ ] funnel-analysis スキルでユーザーの離脱ポイントを特定し、CROで改善仮説を立てる
- [ ] skill-creator で自分のビジネスに特化したオリジナルスキルを作成する

## 関連リソース

動画内で言及されたリソース：

- [skills.sh](https://skills.sh) — Claude Code Skills ディレクトリ
- [サムネAI](https://www.samune-ai.jp/) — ShinCodeが個人開発中のサムネイル生成サービス
- [ShinCode Camp](https://code-s-school-5bc2.thinkific.com/bundles/shincode-camp) — AI駆動開発の講座プラットフォーム
- [find-skills](https://skills.sh/vercel-labs/skills/find-skills) — スキル検索スキル（1位 / 36.8Kインストール）
- [ui-ux-pro-max](https://skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max) — UI/UXデザイン参照スキル
- [vercel-react-best-practices](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices) — React/Next.jsベストプラクティス（2位 / 35.9Kインストール）
- [remotion-best-practices](https://skills.sh/remotion-dev/skills/remotion-best-practices) — Remotion動画作成スキル（4位 / 92.8Kインストール）
- [skill-creator](https://skills.sh/anthropics/skills/skill-creator) — スキル作成スキル（8位 / 35.3Kインストール）
- [supabase-postgres-best-practices](https://skills.sh/supabase/agent-skills/supabase-postgres-best-practices) — Supabase/PostgreSQLスキル

---

*Source: [【チート級】この5つのClaude Code Skillsは個人開発のチートスキルです【Claude Code】](https://www.youtube.com/watch?v=gkcUAtAfw1I)*
