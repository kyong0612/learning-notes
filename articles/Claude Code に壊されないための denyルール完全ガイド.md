---
title: "Claude Code に壊されないための denyルール完全ガイド"
source: "https://izanami.dev/post/d6f25eec-71aa-4746-8c0d-80c67a1459be"
author:
  - "コムテ"
published: 2025-06-21
created: 2025-07-15
description: "Claude Code の permissions.deny 設定には、危険コマンドや env など機密ファイルの読み書き、外部通信、DB破壊を防ぐためのガードレールが詰まっている。AI活用時に必須のセキュリティ設計"
tags:
  - "Claude Code"
  - "個人開発"
---

## 要約

本稿は、AIコーディングアシスタント `Claude Code` の `permissions.deny` 設定について、その重要性と具体的な設定例を解説するものです。この設定は、AIによる意図しないシステムの破壊、機密情報の漏洩、外部への不正な通信を防ぐためのガードレールとして機能します。筆者は過去に `Supabase` のデータベースを `Claude Code` によって全削除された経験から、`deny` ルールの徹底が不可欠であると結論付けています。

### `permissions.deny` とは？

`Claude Code` における `permissions.deny` は、AIに実行を許可しない操作を定義するセキュリティ設定です。これにより、「壊さない・漏らさない・暴走しない」という安全なAI活用が実現可能になります。これは `Claude Code` に限らず、他のAIエージェントを運用する上でも重要な設計思想です。

### 推奨される deny 設定

筆者が実際に `.claude/settings.local.json` に設定している `deny` ルールは以下の通りです。

```json
{
  "permissions": {
    "deny": [
      "Bash(sudo:*)",
      "Bash(rm:*)",
      "Bash(rm -rf:*)",
      "Bash(git push:*)",
      "Bash(git commit:*)",
      "Bash(git reset:*)",
      "Bash(git rebase:*)",
      "Read(.env.*)",
      "Read(id_rsa)",
      "Read(id_ed25519)",
      "Read(**/*token*)",
      "Read(**/*key*)",
      "Write(.env*)",
      "Write(**/secrets/**)",
      "Bash(curl:*)",
      "Bash(wget:*)",
      "Bash(nc:*)",
      "Bash(npm uninstall:*)",
      "Bash(npm remove:*)",
      "Bash(psql:*)",
      "Bash(mysql:*)",
      "Bash(mongod:*)",
      "mcp__supabase__execute_sql"
    ]
  }
}
```

これらの設定は、主に以下のカテゴリに分類されます。

| カテゴリ | 内容の例 | 理由 |
| --- | --- | --- |
| 危険なBash操作 | `rm -rf`, `git reset`, `sudo` | ファイル削除やシステム破壊を防ぐ |
| 機密情報の読み書き | `.env`, `id_rsa`, `*token*` | クレデンシャルやAPIキーの漏洩防止 |
| 外部送信コマンド | `curl`, `wget`, `nc` | 意図しない情報の流出防止 |
| DB操作系 | `psql`, `mysql`, `mongod` | 本番DBへの誤った書き込みを防止 |
| Supabaseコマンド | `mcp__supabase__execute_sql` | DB破壊リスクのある直接実行を防止 |

### 各設定の意図

1. **Bashでの危険操作の禁止**: `sudo rm -rf /` のような壊滅的なコマンドや、`git push`, `git reset` のようなリポジトリ履歴を破壊しかねない操作を禁止します。
2. **機密ファイルへのアクセス制限**: `.env` ファイルやSSHキー (`id_rsa`) などの読み書きをブロックし、認証情報の漏洩を防ぎます。「賢いから大丈夫」ではなく「賢くても口を滑らせる」ことを前提とした設計が重要です。
3. **外部との通信系コマンドの禁止**: `curl` や `wget` を制限し、AIが外部に情報を送信したり、不審なスクリプトをダウンロードしたりするリスクを排除します。
4. **データベース操作の禁止**: CLIやMCP経由での直接的なDB操作 (`psql`, `mcp__supabase__execute_sql`) を禁止します。これにより、`DROP TABLE` や `WHERE` 句なしの `UPDATE` といった重大な事故を未然に防ぎます。

### 重要な補足：フォルダアクセス制限

記事のコメント欄にある通り、`Claude Code` の公式ドキュメントには、**実行されたディレクトリより上位にはアクセスできない**という組み込みの保護機能があると記載されています。これにより、`/` や `~/.ssh` といったプロジェクト外の重要なディレクトリへのアクセスは基本的にブロックされます。（ただし、`--add-dir` で追加した場合はこの限りではありません。）

### 教訓と結論

AIがコードを生成する時代において、「AIに何をさせるか」だけでなく「AIに何をさせないか」を定義することが極めて重要です。`permissions.deny` は、AIの能力を安全な範囲で活用するための必須の設計です。これはAIを信用しないのではなく、AIの潜在的なリスクを理解し、賢く管理するためのアプローチと言えます。

![記事がランキング1位になった画像](https://api.izanami.dev/storage/v1/object/public/pictures/eyecatch/fb108034-0e3a-41b4-9484-6744a07be5ce/2fd572b2-d8ef-49cb-9ea0-0abd380bf288.png)
