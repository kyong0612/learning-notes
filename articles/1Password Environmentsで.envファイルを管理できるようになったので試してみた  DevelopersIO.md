---
title: "1Password Environmentsで.envファイルを管理できるようになったので試してみた | DevelopersIO"
source: "https://dev.classmethod.jp/articles/1password-environments-env-management/"
author:
  - "[[和田 健司]]"
published: 2025-11-17
created: 2025-11-24
description: |
  1Password Environmentsの新機能を使って、.envファイルを仮想的にマウントし、シークレット情報をディスクに書き込まずに管理する方法を紹介。iOS開発における環境変数管理の課題を解決し、ArkanaとXcode Cloudを組み合わせた実践的な運用方法を解説。
tags:
  - "clippings"
  - "1Password"
  - "iOS"
  - "環境変数管理"
  - "セキュリティ"
  - "Arkana"
  - "Xcode Cloud"
---

## 要約

### 背景と課題

iOS開発において、APIキーやFirebaseの設定情報などのシークレット情報を管理する際、多くの開発者が`.env`ファイルを使用しているが、以下の課題がある。

#### セキュリティ上のリスク

- シークレット情報が平文でディスクに保存される
- `.gitignore`への追加を忘れてGitにコミットしてしまう危険性
- macOSのバックアップに含まれてしまう可能性

#### チーム開発での課題

- 新しいメンバーへのシークレット共有が煩雑
- SlackやメールでAPIキーを送るのはセキュリティ上好ましくない
- 環境変数の更新をチーム全体に反映するのが面倒

#### 開発マシンの移行

- 新しいMacをセットアップする際に、過去のチャットやドキュメントからシークレットを探す必要がある

### 1Password Environmentsとは

2025年10月にパブリックベータとしてリリースされた1Password Environmentsは、開発プロジェクトのシークレット情報を安全に管理するための専用ワークスペースを提供する機能である。

#### 主な特徴

- 指定したパスに`.env`ファイルを仮想的にマウント
- シークレット情報は**ディスクに書き込まれない**
- UNIXパイプを通じてアプリケーションにデータを直接渡す
- 既存のdotenvライブラリとそのまま互換
- Arkanaなどの`.env`ファイルを読み取るツールがそのまま動作

#### 仮想マウントの仕組み

1Passwordが仮想的に`.env`ファイルをマウントすることで、物理ファイルは存在しないがアプリケーションからは通常のファイルとして読み取れる。1Passwordがロックされると自動的にアクセスがブロックされ、オフラインでもキャッシュされた値にアクセス可能。

### 開発環境での構成

#### ローカル開発環境

```text
1Password Environments (.env仮想マウント)
    ↓
Arkana (難読化コード生成)
    ↓
Xcode (ビルド)
```

#### CI/CD環境(Xcode Cloud)

```text
Xcode Cloudの環境変数
    ↓
Arkana (難読化コード生成)
    ↓
ビルド・配信
```

この構成により、ローカルでもCI/CDでも一貫して安全にシークレットを管理できる。

## セットアップ手順

### 1. 1Password Developer機能の有効化

1. 1Passwordデスクトップアプリを起動
2. **Settings(設定) > 開発者**を開く
3. [1Password開発者エクスペリエンスを表示する]をオンにする

これでサイドバーに「開発者」セクションが表示される。

### 2. Environmentの作成

1. サイドバーの**開発者**セクションを開く
2. 環境タイルの[環境を表示]ボタンをクリック
3. [新規環境]ボタンをクリック
4. 環境名を入力して保存（例：開発中のアプリ名）

### 3. .envファイルのインポート

1. 作成した環境の[環境を表示]ボタンをクリック
2. [.envファイルをインポート]ボタンをクリック
3. インポートする`.env`ファイルを選択
4. インポートされたキーと値を確認して保存

インポートが完了すると、各環境変数は1Passwordのアイテムとして暗号化され、安全に保存される。

### 4. 元の.envファイルの削除

安全のため、元の`.env`ファイルを削除する。

```bash
cd /path/to/project

# 念のためバックアップ
cp .env .env.backup

# 削除
rm .env

# .gitignoreに.envが含まれているか確認
cat .gitignore | grep .env
```

### 5. ローカル.envファイルのマウント設定

1. 保存先タブを開く
2. ローカル.envファイルタイルの[目的地の設定]ボタンをクリック
3. [ファイルパスを選択する]ボタンをクリック
4. 以前`.env`ファイルを置いていたパスを指定
5. [.envファイルをマウントする]ボタンをクリック

これで、指定したパスに`.env`ファイルが仮想的にマウントされた。

### 6. .envにアクセスできるか確認

```bash
vim /path/to/project/.env
```

同ファイルパスにアクセスすると、1Passwordがフックしてアクセスリクエストダイアログが表示される。認証を行うと、`.env`ファイルにアクセスできる。

認証後、以下のような内容が表示される：

```text
# このファイルは1Passwordによって生成されました。手動による編集は失われます。
# 詳細については、こちらをご覧ください：https://developer.1password.com/docs/environments/local-env-file
revenueCatApiKey=XXXXXX_XXXXXXXXXXXXXX
```

### 7. Arkanaの動作確認

```bash
# プロジェクトディレクトリで実行
bundle exec arkana
```

成功すると、通常通り`ArkanaKeys`などの難読化コードが生成される。1Passwordがマウントした`.env`ファイルを正しく読み取れていることが確認できる。

### 8. Xcode Cloudとの連携

Xcode Cloudを使ったCI/CD環境では、1Password Environmentsを使わず、Xcode Cloudの環境変数機能を利用する。

#### Xcode Cloudでの環境変数設定

1. **App Store Connect**を開く
2. 対象のアプリを選択
3. **Xcode Cloud > Settings**を開く
4. **Environment Variables**セクションで環境変数を追加
5. 各変数には**Secret**のチェックを入れて値を保護

#### Arkanaの環境変数読み取り

Arkanaはデフォルトで以下の優先順位で値を読み取る：

1. **環境変数**
2. **`.env`ファイル**

つまり、特別な設定なしで：

- **ローカル**: 1Passwordがマウントした`.env`ファイルから読み取り
- **Xcode Cloud**: 環境変数から読み取り

という動作になる。

## 運用上の注意点

### 1Passwordアプリの起動が必要

Arkanaを実行する際、1Passwordデスクトップアプリが：

- 起動している
- ロック解除されている

必要がある。ロックされている場合は、ビルドが失敗する。

### CI/CD環境は別途設定

CI/CD環境(Xcode Cloud、GitHub Actionsなど)では、1Password Environmentsは使用できない。各環境の機密情報管理機能を使用する必要がある。

ただし、1PasswordはAWS Secrets Managerとの連携機能も提供しているため、本格的なCI/CD環境ではこちらの利用も検討できる。

### Windowsは現在非対応

現在、1Password EnvironmentsはMacとLinuxのみ対応。Windows版は開発中とのこと。

## メリット

### セキュリティの向上

- `.env`ファイルが物理的にディスクに存在しないため、誤ってGitにコミットすることが不可能
- `git add .`を実行しても、仮想ファイルは検出されない
- 1Passwordをロックすると、自動的に`.env`ファイルへのアクセスがブロック

### 開発効率の向上

- 新しいMacをセットアップする際、1Passwordにログインするだけで環境変数が復元
- プロジェクトをcloneして、Environmentをマウントすればすぐに開発開始
- キャッシュされた値はオフラインでもアクセス可能

### チーム開発での利点

- 1Passwordの共有機能を使って、チームメンバーに安全に環境変数を共有
- Slackでシークレットを送る必要がなくなる
- 環境変数の変更履歴が1Passwordに記録される

## まとめ

1Password Environmentsを実際に運用してみて、想像以上に便利だと感じている。特に`.env`ファイルが物理的に存在しないため「誤ってGitにコミットしてしまうのでは」という不安から完全に解放されたのが大きい。

iOSアプリ開発の文脈では、Arkanaと組み合わせることで、既存のワークフローを維持したまま安全性を向上できた。ローカル開発では1Password Environmentsで.envファイルを管理し、CI/CD環境ではBitriseやXcode Cloudの環境変数機能を利用することで、一貫したシークレット管理が実現できる。

現在はmacOS/Linux対応のパブリックベータとして提供されており、Windows版は開発中とのこと。まだベータ版ではあるが、安定して動作しており、iOS開発でシークレット管理に課題を感じている方は試してみる価値がある。

### 検証環境

- macOS 15.7.1（24G231）
- Xcode 26.1.1
- 1Password デスクトップアプリ 8.11.18
- Arkana 1.4.0

### 参考リンク

- [1Password Environments 公式ブログ](https://1password.com/blog/1password-environments-env-files-public-beta)
- [1Password Environments ドキュメント](https://developer.1password.com/docs/environments/)
- [Arkana - GitHub](https://github.com/rogerluan/arkana)
- [CocoaPods の終了に備えて、cocoapods‑keys から Arkana + SPMへ移行する](https://dev.classmethod.jp/articles/cocoapods-cocoapods-keys-arkana-spm/) - 筆者による過去記事
- [1Password Developer Settings](https://support.1password.com/developer/)
