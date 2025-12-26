---
title: "endcycles/porkbun-skill: Claude Code skill for managing Porkbun domains and DNS records"
source: "https://github.com/endcycles/porkbun-skill"
author:
  - "[[endcycles]]"
published:
created: 2025-12-26
description: |
  PorkbunドメインとDNSレコードを管理するためのClaude Code skill。MCPサーバーと比較して軽量で、トークンオーバーヘッドが大幅に少ない（約500トークン vs 10,000-17,000+トークン）。
  Dockerやプロセス管理が不要で、.envファイルの設定のみで使用可能。標準ライブラリのみを使用するPythonスクリプトで実装されており、依存関係がない。
tags:
  - "clippings"
  - "claude"
  - "code-skill"
  - "dns"
  - "domain-management"
  - "porkbun"
---

## Porkbun Skill

PorkbunドメインとDNSレコードを管理するためのClaude Code skill。`porkbun-mcp`にインスパイアされて、軽量なskillとして再構築された。

## 動作原理

```text
ユーザー: "www.example.comのAレコードを1.2.3.4に追加して"
  ↓
Claude Code: APIキーを使用してPythonスクリプトを実行
  ↓
Porkbun API: 成功/失敗を返す
  ↓
Claude Code: 結果をユーザーに報告
```

Docker不要。MCPサーバー不要。ミドルウェア不要。直接API呼び出しのみ。

## MCPとの比較

| アプローチ | トークンオーバーヘッド | セットアップ |
| --- | --- | --- |
| **このskill** | ~500トークン | .envファイルのみ |
| **MCP Server** | 10,000-17,000+トークン | Docker、プロセス管理 |

MCPサーバーは各ツール定義に10K-17Kトークンを消費する。5サーバーのセットアップでは、開始前に55K+トークンを消費し、Claudeのコンテキストウィンドウの最大1/3を占める可能性がある。

Skillsはトリガーされた時のみロードされ、永続的なプロセスを持たない。

## インストール

```bash
cd ~/.claude/skills
git clone https://github.com/endcycles/porkbun-skill.git
cd porkbun-skill
cp .env.example .env
```

`.env`ファイルを[Porkbun API認証情報](https://porkbun.com/account/api)で編集：

```bash
export PORKBUN_API_KEY=pk1_your_api_key_here
export PORKBUN_SECRET_API_KEY=sk1_your_secret_key_here
```

## CLIリファレンス

依存関係のないPythonスクリプト - 標準ライブラリのみを使用。

### 一般的なコマンド

```bash
porkbun.py ping                     # API接続をテスト
porkbun.py domains                  # すべてのドメインを一覧表示
porkbun.py check example.com        # 利用可能性を確認
porkbun.py pricing                  # TLD価格を取得
```

### DNSレコード

```bash
porkbun.py dns list example.com
porkbun.py dns get example.com 123456789
porkbun.py dns create example.com A 1.2.3.4 www 600
porkbun.py dns edit example.com 123456789 A 5.6.7.8 www 600
porkbun.py dns delete example.com 123456789
porkbun.py dns get-type example.com A www
porkbun.py dns edit-type example.com A 5.6.7.8 www 600
porkbun.py dns delete-type example.com A www
```

### ネームサーバー

```bash
porkbun.py ns get example.com
porkbun.py ns update example.com ns1.cloudflare.com ns2.cloudflare.com
```

### URL転送

```bash
porkbun.py forwards list example.com
porkbun.py forward add example.com https://newsite.com "" permanent
porkbun.py forward delete example.com 123456
```

### Glueレコード（複数のIPをサポート）

```bash
porkbun.py glue list example.com
porkbun.py glue create example.com ns1 192.168.1.1 192.168.1.2
porkbun.py glue update example.com ns1 10.0.0.1
porkbun.py glue delete example.com ns1
```

### SSL & DNSSEC

```bash
porkbun.py ssl example.com
porkbun.py dnssec list example.com
porkbun.py dnssec create example.com 12345 8 2 abc123...
porkbun.py dnssec delete example.com 12345
```

### ヘルプ

```bash
porkbun.py help
```

フルパス: `~/.claude/skills/porkbun-skill/scripts/porkbun.py`

## 自然言語での使用例

Claude Codeに自然な言語で質問するだけ：

```text
"すべてのPorkbunドメインを一覧表示して"
"www.example.comのAレコードを192.168.1.1に追加して"
"blog.example.comのCNAMEをmy-blog.netlify.appに作成して"
"Google Workspace用のMXレコードを設定して"
"old.example.comのAレコードを削除して"
"example.comが使用しているネームサーバーは？"
"example.comのSSL証明書を取得して"
"coolstartup.ioが利用可能か確認して"
```

## サポートされているレコードタイプ

| タイプ | 目的 | 例 |
| --- | --- | --- |
| A | IPv4アドレス | `192.168.1.1` |
| AAAA | IPv6アドレス | `2001:db8::1` |
| CNAME | エイリアス | `example.github.io` |
| MX | メールサーバー（優先度が必要） | `mail.example.com` |
| TXT | SPF、DKIM、検証 | `v=spf1 include:...` |
| NS | ネームサーバー | `ns1.example.com` |

## 技術的な特徴

- **軽量**: 標準ライブラリのみを使用し、外部依存関係がない
- **効率的**: MCPサーバーと比較してトークンオーバーヘッドが大幅に少ない
- **シンプル**: Dockerやプロセス管理が不要
- **直接的なAPI呼び出し**: ミドルウェアなしでPorkbun APIに直接アクセス

## ライセンス

MIT

## リポジトリ情報

- **スター数**: 3
- **フォーク数**: 0
- **言語**: Python 100.0%
- **コミット数**: 12
