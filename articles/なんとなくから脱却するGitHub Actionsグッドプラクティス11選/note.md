# なんとなくから脱却するGitHub Actionsグッドプラクティス11選

ref: <https://gihyo.jp/article/2024/10/good-practices-for-github-actions>

## フェイルファスト

- 素早く失敗を検知し、効果的にフィードバックを得る

### タイムアウトを常に指定する

- Github Actionsのdefault timeoutは360 min(6h)

```yaml
timeout-minutes: 5 # 分単位でタイムアウトを指定
```

### デフォルトシェルでBashのパイプエラーを拾う

- Ubuntuランナーではシェル指定省略時にBashが起動する
  - このBash、**パイプ処理中のエラーを無視する**
  - エラー時に意図せず処理を継続するため、結果として不具合の温床になる
- デフォルトシェルを指定すると、なぜかpipefaildオプションが有効化される

```yaml
defaults:
  run:
    shell: bash # ワークフローで使うシェルをまとめて指定

```

### 「actionlint」ですばやく構文エラーをチェックする

```bash
docker run --rm -v "$(pwd):$(pwd)" -w "$(pwd)" rhysd/actionlint
```

## 無駄の削減

### Concurrencyで古いワークフローをキャンセルする

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true # 実行中ワークフローのキャンセルを有効化
```

- ャンセル条件はgroupキーへ指定する
  - このコード例では「同じプルリクエスト」の「同じワークフロー」が複数起動したら、古いワークフローを自動的にキャンセルする

### 不要なイベントで起動しないようにフィルタリングする

```yaml
on:
  pull_request:
    paths: ['**.go']   # Goのファイルが変更されたら実行
  push:
    branches: ['main'] # デフォルトブランチなら実行
    tags: ['v*']       # バージョンタグが作成されたら実行
```

### 最安値のUbuntuランナーを優先する

## セキュリティ

- 最小権限を徹底し、侵害リスクを下げる設計が重要

### GITHUB_TOKENのパーミッションはジョブレベルで定義する

- パーミッションの設定方法は3つある
  1. ジョブレベルへ定義したパーミッション
  2. ワークフローレベルへ定義したパーミッション
  3. リポジトリに設定されたデフォルトパーミッション

- ワークフローレベルのパーミッションを無効化し、改めて最小限のパーミッションをジョブレベルで定義する

```yaml
# ワークフローレベルでパーミッションをすべて無効化
permissions: {}

obs:
  example:
    # もっとも安価なUbuntuランナーを利用
    runs-on: ubuntu-latest
    # 6時間も待たされないようにタイムアウトを設定
    timeout-minutes: 5
    # ジョブレベルで必要最小限のパーミッションを定義
    permissions:
      contents: read
```

### アクションはコミットハッシュで固定する

- versionを厳格に固定する

```yaml
- uses: actions/checkout@eef61447b9ff4aafe5dcd4e0bbf5d482be7e7871 # v4.2.1

```

## メンテナンス性

### Bashトレーシングオプションでログを詳細に出力する

```yaml
steps:
  - run: |
      set -x # 最初に一行追加するだけで、ログ出力が詳細になる
      date
      hostname
```

### workflow_dispatchイベントで楽に動作確認する

## テンプレート

```yaml
# なにをするワークフローか手短に記述
#
# ワークフローの目的や影響範囲、参考URLなどを数行で書く。
# 実装詳細ではなく、コードから読み取れない背景情報を中心にする。
---
name: Example
on:
  # 動作確認しやすいように手動起動をサポート
  workflow_dispatch:
  # プルリクエストはファイルパスでフィルタリング
  pull_request:
    paths: [".github/workflows/**.yml", ".github/workflows/**.yaml"]

# ワークフローレベルでパーミッションをすべて無効化
permissions: {}

# デフォルトシェルでパイプエラーを有効化
defaults:
  run:
    shell: bash

# ワークフローが複数起動したら自動キャンセル
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  example:
    # もっとも安価なUbuntuランナーを利用
    runs-on: ubuntu-latest
    # 6時間も待たされないようにタイムアウトを設定
    timeout-minutes: 5
    # ジョブレベルで必要最小限のパーミッションを定義
    permissions:
      contents: read
    steps:
      # アクションはコミットハッシュで固定
      - name: Checkout
        uses: actions/checkout@eef61447b9ff4aafe5dcd4e0bbf5d482be7e7871 # v4.2.1

      # Bashトレーシングオプションの有効化でログを詳細化
      - name: Run actionlint
        run: |
          set -x
          docker run --rm -v "$(pwd):$(pwd)" -w "$(pwd)" rhysd/actionlint:1.7.3
```
