---
title: "Biome v2—codename: Biotype"
source: "https://biomejs.dev/ja/blog/biome-v2/#monorepo-support"
author:
  - "[[Emanuele Stoppa]]"
  - "[[Biome Core Team]]"
  - "[[Biome Maintainers]]"
published: 2025-06-17
created: 2025-07-18
description: "Biome v2—codename: Biotype、TypeScriptコンパイラに依存しない型認識リンティングルールを提供する初のJavaScriptおよびTypeScriptリンター。マルチファイル解析、モノレポサポート、プラグイン、改良されたインポートオーガナイザーなどの新機能を搭載。"
tags:
  - "clippings"
  - "JavaScript"
  - "TypeScript"
  - "Linting"
  - "Web Toolchain"
  - "Development Tools"
  - "Open Source"
---
# 概要

![The brand of the project. It says "Biome, toolchain of the web"](https://biomejs.dev/_astro/banner-dark.Dl3moAyv_2qbteA.webp)

Biome v2—codename: Biotype が正式にリリースされました！🍾 これは**TypeScriptコンパイラに依存せずに型認識リンティングルールを提供する初のJavaScriptおよびTypeScriptリンター**です。つまり、`typescript`パッケージをインストールせずにプロジェクトをリントできるようになりました。

## 主要な成果

- **短期間での達成**: わずか2年でこの画期的なマイルストーンを達成
- **パフォーマンス**: `noFloatingPromises`ルールは、`typescript-eslint`の約75%のケースを検出可能で、パフォーマンスへの影響は最小限
- **スポンサーシップ**: Vercelが型推論機能の開発をスポンサー

## インストールとマイグレーション

```shell
npm install --save-dev --save-exact @biomejs/biome
npx @biomejs/biome migrate --write
```

`migrate`コマンドが設定の破壊的変更を自動的に処理します。ただし、自動化できない変更については[マイグレーションガイド](https://biomejs.dev/guides/upgrade-to-biome-v2)を参照してください。

# 主要な新機能

## 1. マルチファイル解析と型推論

### ファイルスキャナー

v2.0以前のBiomeは一度に1つのファイルしか操作できませんでしたが、より高度なルールには他のファイルからの情報が必要でした。新しいファイルスキャナーはプロジェクト内のすべてのファイルをスキャンしてインデックス化します。

### パフォーマンス考慮事項

- **オプトイン方式**: v1からv2への移行でパフォーマンスに大きな影響はありません
- デフォルトでは、ネストされた設定ファイルの発見のみに使用
- **フルスキャン**（プロジェクトファイルと`node_modules`）は[プロジェクトルール](https://biomejs.dev/linter/domains#project)が有効な場合のみ実行
- `files.includes`でスキャン対象を制御可能（`node_modules`を除く）
- 型収集やモジュールグラフクエリが必要なルールは[`project`ドメイン](https://biomejs.dev/linter/domains/#project)外では推奨されません

## 2. モノレポサポート

モノレポのサポートが大幅に改善されました。`package.json`に依存するリントルールが適切なパッケージの`package.json`を使用するようになり、**ネストされた設定ファイル**がサポートされました。

### ネストされた設定の使用方法

1. **root: falseの使用**:
```json
{
    "root": false,
    // ...
}
```

2. **extendsマイクロ構文**:
```json
{
    "extends": "//",  // ルート設定から拡張
    // ...
}
```

これにより、`"extends": ["../../biome.json"]`のような相対パスが不要になります。

## 3. リンタープラグイン

[リンタープラグイン](https://biomejs.dev/linter/plugins)の初期バージョンが導入されました。現在はコードスニペットのマッチングと診断の報告に限定されています。

### プラグインの例：
```grit
\`$fn($args)\` where {
    $fn <: \`Object.assign\`,
    register_diagnostic(
        span = $fn,
        message = "Prefer object spread instead of \`Object.assign()\`"
    )
}
```

プラグインの配布方法については、コミュニティからのフィードバックを求めています。

## 4. インポートオーガナイザーの改良

### v1.xの制限事項の解決：
- **空行を越えたソート**: 空行で区切られたインポートグループも適切にソート
- **同一モジュールからのインポートのマージ**:
  ```js
  // Before
  import { util1 } from "./utils.js";
  import { util2 } from "./utils.js";
  
  // After (v2)
  import { util1, util2 } from "./utils.js";
  ```
- **カスタム順序設定**: 独自のインポート順序を設定可能

### その他の改善：
- `export`文の整理をサポート
- "detached"コメントでインポートチャンクを明示的に分離
- インポート属性のソート

## 5. Biome Assist

インポートオーガナイザーは、リンターでもフォーマッターでもない特殊なケースでした。v2.0では、これをBiome Assistとして一般化しました。

### Assistの特徴：
- **アクション**を提供（診断なしの修正機能）
- インポートオーガナイザーがAssistに移行
- 新しいAssist機能：
  - [`useSortedKeys`](https://biomejs.dev/assist/actions/use-sorted-keys/): オブジェクトリテラルのキーをソート
  - [`useSortedAttributes`](https://biomejs.dev/assist/actions/use-sorted-attributes/): JSX属性をソート

## 6. 改良された抑制機能

### 新しい抑制コメント：
- `// biome-ignore-all`: ファイル全体でルールまたはフォーマッターを抑制
- `// biome-ignore-start` と `// biome-ignore-end`: 範囲指定での抑制
  - `// biome-ignore-end`は省略可能（ファイル末尾まで適用）

## 7. HTMLフォーマッター（実験的）

HTMLフォーマッターが試験的に利用可能になりました。これはVueやSvelteなどのフレームワークで使用されるHTMLテンプレート言語の完全サポートへの大きな一歩です。

### 現在の制限：
- `.html`ファイルのみ対応（`.vue`や`.svelte`はまだ未対応）
- 埋め込み言語（JavaScript/CSS）のフォーマットは未対応
- **デフォルトでは無効**（実験的段階のため）

### サポートされるオプション：
- `attributePosition`
- `bracketSameLine`
- `whitespaceSensitivity`

### 有効化方法：
```json
{
  "html": {
    "formatter": {
      "enabled": true
    }
  }
}
```

# 謝辞

![it's](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjQ2b3d6MjYzMTdsazdzcm41NmM1ZTMzaGcyM2xyeHo2N2k5NmxscyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QW5nKIoebG8y4/giphy.gif)

## スポンサー
- **Vercel**（プラチナスポンサー）: [型推論機能の開発をスポンサー](https://biomejs.dev/blog/vercel-partners-biome-type-inference)
- **Depot**（ゴールドスポンサー）: 高速で強力なCIランナーを提供

## 主要貢献者
- JetBrains拡張機能の安定化とマルチワークスペースサポート
- インポートオーガナイザーの改良、新しいglobエンジン、多数の新しいリンティングルール
- マルチファイルアーキテクチャ、型推論、プラグイン開発
- [GitHub Action](https://github.com/biomejs/setup-biome)と[VS Code拡張機能](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)の開発
- HTMLパーサーとフォーマッターの開発

# 今後の展望

## 2025年ロードマップの主要項目
- HTMLサポートの安定化
- Vue、Svelte、Astroなどのフレームワークへの拡張
- Markdownサポート（パーサーから開始）
- 型推論インフラストラクチャの継続的改善

# コントリビューション方法

## 技術的貢献
- **新しいリントルールの作成**: ESLint、ESLintプラグイン、Next.js、Solidなどのルール
- **パーサーの開発**: エラー耐性のある回復可能パーサー（CST出力）
- **LSPとエディタ拡張機能**: VS Code、Zed、JetBrains IntelliJ

## その他の貢献方法
- **翻訳**: [i18nダッシュボード](https://biomejs.dev/i18n-dashboard/)で言語サポート状況を確認
- **コミュニティ参加**: [Discordサーバー](https://biomejs.dev/chat)での交流
- **財政的支援**: [Open Collective](https://opencollective.com/biome)または[GitHub Sponsors](https://github.com/sponsors/biomejs)
- **企業サポートプログラム**: [エンタープライズサポート](https://biomejs.dev/enterprise)

# まとめ

Biome v2は、TypeScriptコンパイラに依存しない型認識リンティングを実現した画期的なリリースです。パフォーマンスを維持しながら高度な機能を提供し、モノレポサポート、プラグイン、改良されたインポートオーガナイザーなど、開発者体験を大幅に向上させる機能が満載です。ボランティアベースのプロジェクトながら、強力なスポンサーとコミュニティの支援により、ウェブツールチェーンの次世代標準を目指して着実に進化しています。
