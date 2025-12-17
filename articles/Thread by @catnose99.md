---
title: "React2Shell脆弱性とプレビュー環境のセキュリティリスク"
source: "https://x.com/catnose99/status/1999660031546098028?s=46&t=WU3DbOf-gAM7zxLmoKvFDA"
author:
  - "[[@catnose99]]"
published: 2025-12-13
created: 2025-12-17
description: |
  GitHubへのプッシュで自動デプロイされるプレビュー環境において、React2Shell脆弱性（CVE-2025-55182）によるセキュリティリスクについて警告。VercelのDeployment Protectionが無効な場合、URLを特定されると攻撃を受ける可能性がある。
tags:
  - "security"
  - "React"
  - "Next.js"
  - "vulnerability"
  - "Vercel"
  - "DevOps"
---

## 概要

catnose氏（[@catnose99](https://x.com/catnose99)）による、**React2Shell脆弱性**とプレビュー環境のセキュリティに関する警告ツイート。

### 元のツイート内容

> ふと思ったけど「GitHubへのプッシュのたびにプレビュー環境が自動デプロイされる」系の設定になってると、URL特定されたらReact2Shellでやられ放題になるな
>
> VercelはDeployment ProtectionがONになっていればメンバーしかアクセスできないけど、利便性のためにオフになってるとこも多そう

### エンゲージメント（2025年12月17日時点）

- 👁️ 104.9K Views
- ❤️ 520 Likes  
- 🔄 48 Reposts
- 🔖 256 Bookmarks

---

## React2Shell (CVE-2025-55182) とは

### 基本情報

| 項目 | 内容 |
|------|------|
| **CVE ID** | [CVE-2025-55182](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)（React）、[CVE-2025-66478](https://github.com/vercel/next.js/security/advisories/GHSA-9qr9-h5gf-34mp)（Next.js） |
| **深刻度** | **CVSS 10.0**（Critical - 最高深刻度） |
| **影響範囲** | React Server Components (RSC)、Next.js |
| **脆弱性タイプ** | 認証なしリモートコード実行（RCE） |
| **発見者** | [Lachlan Davidson](https://github.com/lachlan2k) |
| **責任ある開示日** | 2025年11月29日 (PT) |
| **パッチリリース日** | 2025年12月3日 (PT) |

### 脆弱性の内容

- React Server Components (RSC) の「Flight」プロトコルにおける**不適切なデシリアライゼーション**が原因
- 攻撃者は単一の悪意のあるHTTPリクエストで、脆弱なサーバー上で任意のコードを実行可能
- **認証が不要**であり、攻撃の難易度が低い
- 既に野生での悪用が確認されており、**CISA KEV（Known Exploited Vulnerabilities）** に追加済み

### 影響を受けるバージョン

詳細はベンダーのセキュリティアドバイザリを参照：

- [React Security Advisory](https://github.com/facebook/react/security/advisories/GHSA-fv66-9v8q-g76r)
- [Next.js Security Advisory](https://github.com/vercel/next.js/security/advisories/GHSA-9qr9-h5gf-34mp)

---

## catnose氏の指摘するリスク

### プレビュー環境の危険性

多くの開発チームは、開発効率のために以下のような設定を採用している：

1. **GitHubへのプッシュ時に自動でプレビュー環境をデプロイ**
2. **プレビュー環境のURLは予測可能またはリークしやすい**
3. **Deployment Protection（認証保護）を無効化している場合がある**

この状況でReact2Shell脆弱性が存在すると：

- 攻撃者がプレビューURLを特定
- 認証なしで脆弱性を悪用
- サーバー上で任意のコード実行が可能に

### Vercel Deployment Protection

Vercelでは **Deployment Protection** 機能を提供：

| 状態 | リスク |
|------|--------|
| **ON** | チームメンバーのみがプレビュー環境にアクセス可能（安全） |
| **OFF** | 誰でもプレビューURLにアクセス可能（**危険**） |

⚠️ catnose氏の指摘：**利便性のためにOFFにしているケースが多い可能性**

---

## 推奨される対策

### 即座に行うべきこと

1. **パッチを適用する**
   - React、Next.jsを最新の修正済みバージョンにアップデート
   - 依存関係を確認（Next.jsはReactをバンドルしているため、通常の依存関係ツールで検出されない場合あり）

2. **Deployment Protectionを有効化**
   - Vercelの場合: プロジェクト設定でDeployment Protectionを**ON**に

3. **プレビュー環境のアクセス制御を見直す**
   - 認証を必須にする
   - IP制限を検討
   - 不要なプレビュー環境を削除

### 長期的な対策

- セキュリティアップデートの自動化
- CI/CDパイプラインでの脆弱性スキャン導入
- プレビュー環境のセキュリティポリシー策定

---

## 参考リンク

- [React2Shell 公式サイト](https://react2shell.com/)
- [React Security Blog](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)
- [Next.js Security Advisory (CVE-2025-66478)](https://github.com/vercel/next.js/security/advisories/GHSA-9qr9-h5gf-34mp)
- [Vercel Deployment Protection Documentation](https://vercel.com/docs/security/deployment-protection)
