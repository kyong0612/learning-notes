---
title: "Introducing new .env file support in 1Password environments"
source: "https://1password.com/blog/1password-environments-env-files-public-beta"
author:
  - "[[Francine Boulanger]]"
published: 2025-10-29
created: 2025-11-24
description: "1Password's new native .env file integration makes it simple for developers to collaborate securely on environment variables from the desktop app. This feature addresses the security and collaboration challenges of traditional .env files by providing secure, virtual file mounting that prevents secrets from being written to disk."
tags:
  - "clippings"
  - "1password"
  - "environments"
  - "env-files"
  - "secrets-management"
  - "developers"
  - "security"
---

## 概要

1Password environmentsに新しい.envファイルサポート機能が追加され、開発者がデスクトップアプリから直接、セキュアに.envファイルを使用・共同作業できるようになりました。この機能は2025年10月にベータ版としてリリースされ、MacとLinuxのデスクトップパスワードマネージャーで利用可能です。

## .envファイルの問題点

多くの開発者が開発環境で.envファイルを使用してAPIキー、データベースURL、アクセストークンなどの認証情報を保存・読み込んでいます。このアプローチは[The Twelve-Factor App](https://www.12factor.net/config)から広まりましたが、以下の問題があります：

- **平文での保存**: 認証情報が平文でディスクに保存される
- **Git履歴への混入リスク**: .gitignoreへの追加を忘れやすく、コミットに認証情報が含まれる危険性
- **同期の煩雑さ**: マシン間やチームメンバー間での変更の同期が面倒
- **オンボーディングの困難**: 新しい開発者のオンボーディング時にチャットや内部ドキュメントから認証情報を探す必要がある

これらの問題はチームの速度を低下させ、機密データ漏洩のリスクを高めます。

## 1Password environmentsの解決策

1Password environmentsは、開発者がSSHキーや個人認証情報に信頼しているのと同じ保護を.envファイルにも提供します。デスクトップパスワードマネージャーに直接組み込まれており、アプリが必要な変数を読み取れるようにしながら、シークレットがディスクに書き込まれることはありません。

### 主な利点

#### ワークフローの簡素化

- 既存の.envツールやライブラリと互換性があり、コードの書き直しや環境変数の読み込み方法の変更は不要

#### 即座のセットアップ

- 環境を作成し、変数をインポートし、ファイルをマウントし、同僚を招待して共同作業を開始
- 管理者のセットアップやアカウントレベルの設定は不要

#### ゼロ平文

- シークレットはディスクに書き込まれないため、Git履歴に表示されない
- 誤ってコミットすることは不可能

#### オフラインアクセス

- 接続が切れてもブロックされない
- オフライン時でもキャッシュされたシークレットにアクセス可能（ユーザーからの長年の要望）

#### 共同作業に最適化

- バージョン履歴、アクセス制御、自動更新がすべて一箇所に集約
- ファイルをやり取りすることなく、全員が同期を維持可能

## 技術的な仕組み

1Password environmentsは、選択したパスに.envファイルをマウントします。アクセスを承認すると、1PasswordはUNIXパイプを通じてデータを直接アプリに渡します。アプリケーションは通常の.envファイルとして読み取ることができますが、ファイルの内容はディスクに書き込まれることはありません。

マウントされたファイルは、1Passwordが実行されている限り利用可能で、1Passwordがロックされると自動的にロックされます。ファイルは仮想的にマウントされているため、Gitによって追跡されず、シークレットがステージング、コミット、プッシュされることはありません。

この設定により、アプリは通常どおり.envファイルと対話できますが、シークレットが露出または永続化されることはありません。

## セットアップ手順

1Password environmentsのセットアップは1分で完了します：

1. 1Passwordデスクトップアプリで、サイドバーのDeveloperセクションに移動（まだ有効化していない場合は、設定で[1Password Developer experience](https://support.1password.com/developer/)を有効化する必要があります）
2. 環境を作成または開く
3. 既存の.envファイルをインポート
4. Destinationsで「Local .env file」を選択
5. マウントするファイルパスを選択
6. プロンプトが表示されたらアクセスを承認
7. 通常どおりアプリを実行（1Passwordが必要に応じてシークレットを安全に提供）
8. まだ削除していない場合は、古い.envファイルを削除

1Password environmentsは既存のdotenvライブラリとそのまま動作します。Destinationsタブから、マウントされた.envファイルをいつでも無効化または再有効化できます。

## 現在の統合と今後の展開

1Password environmentsは既に[AWS Secrets Managerとの統合](/blog/1password-secrets-syncing-integration-with-aws)があり、チームが本番環境で安全にシークレットを同期・使用できます。さらに多くの宛先が計画されています。

今後は、ベータ版のフィードバックに基づいてエクスペリエンスを改善しながら、より多くの開発者ワークフローへのサポート拡大に焦点を当てています。また、Windowsへのこの機能の提供も検討中です。

## ベータ版のフィードバック

ベータ版で1Password environmentsを試している場合、フィードバックをお待ちしています：

- [1Password Community](https://www.1password.community/discussions/developers/introducing-new-env-file-support-in-1password/162994)でディスカッションに参加
- [開発者ニュースレター](https://1password.com/dev-subscribe/)を購読して更新情報を受け取る

## 関連リソース

- [デモ動画を視聴](https://youtu.be/W0SNYmdVD0o)
- [ドキュメントを参照](https://developer.1password.com/docs/environments)
- [ディスカッションに参加](https://www.1password.community/discussions/developers/introducing-new-env-file-support-in-1password/162994)
- [更新情報にサインアップ](https://1password.com/dev-subscribe/)

## 重要なポイント

- **セキュリティ**: シークレットはディスクに書き込まれず、Git履歴に含まれることはない
- **互換性**: 既存のdotenvライブラリとそのまま動作し、コード変更は不要
- **利便性**: オフラインアクセス、自動ロック、チーム共同作業機能を提供
- **現在の利用範囲**: MacとLinuxで利用可能（Windowsは検討中）
- **本番環境対応**: AWS Secrets Managerとの統合により、本番環境でも使用可能
