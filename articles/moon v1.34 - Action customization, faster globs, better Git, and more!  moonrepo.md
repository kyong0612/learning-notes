---
title: "moon v1.34 - Action customization, faster globs, better Git, and more! | moonrepo"
source: "https://moonrepo.dev/blog/moon-v1.34#better-git-integration"
author:
  - "Miles Johnson"
published: 2025-03-31
created: 2025-07-07
description: "With this release, we're introducing a handful of performance and customization improvements!"
tags:
  - "moonbase"
  - "remote"
  - "cache"
  - "action"
  - "pipeline"
  - "glob"
  - "git"
  - "experiment"
---

moon v1.34では、パフォーマンスとカスタマイズ性向上のための改善が導入されました。

### moonbaseのサービス終了

リモートキャッシングサービス `moonbase` が終了し、今後はBazel Remote Execution APIを採用する方針に転換されました。これにより、moonとprotoの開発にリソースを集中させることができます。既存のユーザーは、新しい[リモートキャッシングオプション](https://moonrepo.dev/docs/guides/remote-cache)への移行が推奨されます。

### パイプライン内のアクションのカスタマイズ

タスク実行時のオーバーヘッドを削減するため、`.moon/workspace.yml` の `pipeline` 設定で、アクション（依存関係のインストール、プロジェクト同期など）を無効化できるようになりました。

- **`installDependencies`**: 依存関係のインストールを制御します。
- **`syncProjects`**: プロジェクト同期を制御します。
- **`syncProjectDependencies`**: 依存関係の再帰的な同期を制御します。
- **`syncWorkspace`**: ワークスペースの同期を制御します。

また、`moon run` コマンドに `--no-actions` フラグが追加され、タスク実行時に他のアクションをスキップできるようになりました。

### 新しい実験的機能

#### Faster glob walking

ファイルシステム探索のボトルネックである `glob` のパフォーマンスを向上させるための新機能です。ディレクトリごとの並列探索やキャッシングにより、パフォーマンスが1.5〜2倍向上します。有効にするには、`experiments.fasterGlobWalk` を `true` に設定します。

```yaml
# .moon/workspace.yml
experiments:
  fasterGlobWalk: true
```

#### Better Git integration

Git統合機能がゼロから再実装され、submoduleやworktreeといった複雑なリポジトリ構造をサポートするようになりました。これは他のビルドシステムにはない特徴です。ファイル検出やハッシュ化のパフォーマンスも向上しています。有効にするには `experiments.gitV2` を `true` に設定します。

```yaml
# .moon/workspace.yml
experiments:
  gitV2: true
```

### その他の変更点

- `moon templates` コマンドに `--json` フラグが追加されました。
- コンソールレンダリングシステムが新しくなり、ターミナルのスタイルや出力が改善されました。
- 環境変数の置換パフォーマンスが向上しました。
- ツールチェーンプラグインがオンデマンドで読み込まれるようになりました。

### 今後の予定

今後は隔週でのリリースが予定されており、次回のリリースでは以下の点が計画されています。

- RustツールチェーンのWASMプラグインへの移行。
- 新しいコマンドラインパーサーの調査。
- PythonツールチェーンへのPoetryサポートの追加。
