---
title: "codemirror/dev: Development repository for the CodeMirror editor project"
source: "https://github.com/codemirror/dev/"
author:
  - "[[Marijn Haverbeke]]"
  - "[[marijnh]]"
published: 
created: 2026-01-28
description: "CodeMirrorはWeb向けの拡張可能なコードエディタコンポーネント。シンタックスハイライト、オートコンプリート、複数言語サポートなど豊富な機能を備え、MITライセンスで公開されているオープンソースプロジェクト"
tags:
  - "clippings"
  - "code-editor"
  - "javascript"
  - "typescript"
  - "web-development"
  - "opensource"
---

## 概要

**CodeMirror**は、Webサイトにリッチなコード編集機能を実装するためのコードエディタコンポーネント。多数の編集機能をサポートし、さらなる拡張を可能にする豊富なプログラミングインターフェースを提供する。

- **GitHub Stars**: 7,529+
- **Forks**: 460+
- **ライセンス**: MIT
- **公式サイト**: [codemirror.net](https://codemirror.net/)
- **フォーラム**: [discuss.codemirror.net](https://discuss.codemirror.net/)

---

## 主な機能

### アクセシビリティとモバイル対応
- **スクリーンリーダー対応**: キーボードのみのユーザーにも最適化
- **モバイルサポート**: プラットフォームのネイティブ選択・編集機能を活用
- **双方向テキスト**: 右から左（RTL）と左から右（LTR）のテキスト混在をサポート

### エディタ機能
| 機能 | 説明 |
|------|------|
| **シンタックスハイライト** | 構文構造を反映したカラーリング |
| **行番号表示** | コード横にガター表示 |
| **オートコンプリート** | 言語固有の補完ヒント提供 |
| **コード折りたたみ** | ドキュメントの一部を一時的に非表示 |
| **検索/置換** | 正規表現対応の検索・置換機能 |
| **括弧の自動閉じ** | 入力中に対応する括弧を自動挿入 |
| **Linting** | エラー・警告メッセージの表示 |
| **Undo履歴** | コラボ編集対応のUndo/Redo |
| **複数選択** | 複数範囲の同時選択・編集 |

### 技術的特徴
- **拡張インターフェース**: 高度なエディタ拡張を堅牢に実装可能
- **モジュラー設計**: ほとんどの機能が汎用的な公開APIの上に実装
- **高速性**: 巨大なドキュメントや長い行でもレスポンシブ
- **完全なパース**: 詳細なパースツリーにより多様な言語統合が可能
- **柔軟なスタイリング**: フォントスタイル・サイズの混在、コンテンツ内ウィジェット追加
- **テーマ対応**: カスタムビジュアルスタイルのインポート/作成
- **協調編集**: 複数ユーザーによる同一ドキュメント編集
- **国際化対応**: カスタムテキストの表示・読み上げ

---

## サポート言語

公式パーサーパッケージが存在する言語：

| 言語 | リポジトリ |
|------|-----------|
| Angular | [lang-angular](https://github.com/codemirror/lang-angular) |
| CSS | [lang-css](https://github.com/codemirror/lang-css) |
| C++ | [lang-cpp](https://github.com/codemirror/lang-cpp) |
| Go | [lang-go](https://github.com/codemirror/lang-go) |
| HTML | [lang-html](https://github.com/codemirror/lang-html) |
| Java | [lang-java](https://github.com/codemirror/lang-java) |
| JavaScript | [lang-javascript](https://github.com/codemirror/lang-javascript) |
| Jinja | [lang-jinja](https://github.com/codemirror/lang-jinja) |
| JSON | [lang-json](https://github.com/codemirror/lang-json) |
| Liquid | [lang-liquid](https://github.com/codemirror/lang-liquid) |
| Markdown | [lang-markdown](https://github.com/codemirror/lang-markdown) |
| PHP | [lang-php](https://github.com/codemirror/lang-php) |
| Python | [lang-python](https://github.com/codemirror/lang-python) |
| Rust | [lang-rust](https://github.com/codemirror/lang-rust) |
| Sass | [lang-sass](https://github.com/codemirror/lang-sass) |
| SQL | [lang-sql](https://github.com/codemirror/lang-sql) |
| Vue | [lang-vue](https://github.com/codemirror/lang-vue) |
| WAST | [lang-wast](https://github.com/codemirror/lang-wast) |
| XML | [lang-xml](https://github.com/codemirror/lang-xml) |
| YAML | [lang-yaml](https://github.com/codemirror/lang-yaml) |

また、[CodeMirror 5 modes](https://github.com/codemirror/legacy-modes)や[コミュニティ管理の言語パッケージ](https://codemirror.net/docs/community#language)も利用可能。

---

## 開発環境セットアップ

### 前提条件
- Node.js バージョン16以上

### インストール手順

```bash
# リポジトリをクローン後、パッケージをインストール
node bin/cm.js install

# パッケージの再ビルド（全体）
node bin/cm.js build

# 個別パッケージの再ビルド
cd [package-directory]
npm run prepare
```

### 開発サーバー起動

```bash
npm run dev
```

ポート8090で開発サーバーが起動し、以下にアクセス可能：
- **デモ**: http://localhost:8090
- **ブラウザテスト**: http://localhost:8090/test/

コード変更時は自動的にパッケージが再ビルドされる。

---

## 貢献ガイドライン

### ヘルプを得る方法
- 質問や議論: [discuss.CodeMirror フォーラム](http://discuss.codemirror.net)

### バグ報告
- [GitHub Issue Tracker](http://github.com/codemirror/dev/issues)で報告
- 問題を再現するための詳細な手順を含める
- [サンドボックス](https://codemirror.net/try/)を使って再現スクリプトを作成すると効果的

### コード貢献

> **重要**: AIツール（言語モデル）により生成されたコードは受け付けていない。著作権侵害の可能性と品質の問題のため。

#### コーディング規約
- **言語**: TypeScript（ES2018ランタイムをターゲット）
- **インデント**: 2スペース（タブ不可）
- **セミコロン**: 必要な場合を除き使用しない
- **ドキュメント**: [getdocs](https://github.com/marijnh/getdocs-ts)スタイルのコメント
- JSHint/JSLintスタイルには準拠しない

#### 貢献の流れ
1. リポジトリをフォーク
2. ローカルでコードをチェックアウト
3. 変更を加えてコミット
4. 必要に応じてテストを追加（`test/`ディレクトリ）
5. `npm run test`でテスト実行
6. プルリクエストを送信（1機能/1修正につき1PR）

---

## スポンサー

CodeMirrorの開発・メンテナンスを支援している企業・組織：

### ゴールドスポンサー
- CodeCrafters
- GitHub
- Holmusk
- Repl.it
- Sourcegraph

### シルバースポンサー
- Cargo, CodePen, Desmos, Labware, Overleaf, 4me

### ブロンズスポンサー
- Amplenote, Anvil, Execute Program, Obsidian, Resources.co, Route4Me, System Initiative, UI Bakery, Val Town

---

## 制限事項・注意点

- **商用利用時の期待**: 法的義務ではないが、商用利用する場合はメンテナンス資金への貢献が社会的に期待される → [資金提供ページ](http://marijnhaverbeke.nl/fund/)
- **ブラウザサポート**: Internet Explorer 11以降（[polyfillが必要](https://codemirror.net/examples/ie11/)）
- **行動規範**: [Contributor Covenant](http://contributor-covenant.org/version/1/1/0/)に準拠した包括的なコミュニティ

---

## 関連リンク

- **公式サイト**: https://codemirror.net/
- **ドキュメント**: https://codemirror.net/docs/ref
- **GitHub**: https://github.com/codemirror/dev
- **フォーラム**: https://discuss.codemirror.net/
- **サンドボックス**: https://codemirror.net/try/
