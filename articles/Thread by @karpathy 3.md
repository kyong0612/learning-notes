---
title: "Thread by @karpathy"
source: "https://x.com/karpathy/status/2036487306585268612?s=12"
author:
  - "[[@karpathy]]"
published: 2026-03-24
created: 2026-03-26
description: "Andrej Karpathyが litellm PyPI サプライチェーン攻撃について警告。月間9,700万ダウンロードのパッケージが侵害され、pip install だけでSSH鍵・クラウド認証情報・暗号通貨ウォレット等の機密データが窃取される事態に。依存関係の危険性とLLMによる機能の内製化を提唱。"
tags:
  - "clippings"
  - "supply-chain-attack"
  - "security"
  - "python"
  - "pypi"
  - "litellm"
  - "AI-infrastructure"
---

## 要約

Andrej Karpathyが2026年3月24日に投稿したスレッドで、litellm PyPIパッケージに対するサプライチェーン攻撃の深刻さについて警鐘を鳴らした。このスレッドはセキュリティコミュニティからも大きな反響を呼んだ。

---

### Karpathyの警告：攻撃の概要

単純な `pip install litellm` を実行するだけで、以下の機密情報がすべて外部に送信される状態だった：

- **SSH鍵**
- **AWS / GCP / Azure クラウド認証情報**
- **Kubernetes設定ファイル**
- **git認証情報**
- **環境変数（全APIキーを含む）**
- **シェル履歴**
- **暗号通貨ウォレット**
- **SSL秘密鍵**
- **CI/CDシークレット**
- **データベースパスワード**

### 影響範囲

- litellm自体の月間ダウンロード数は **9,700万回**
- litellmに依存する他のプロジェクト（**2,000以上のOSSプロジェクト**）にも被害が波及
  - 例：`pip install dspy`（litellm>=1.64.0に依存）でも感染
  - MLflow、Open Interpreterなど主要AIフレームワークにも影響
- 約 **50万台** のデバイスからデータが流出した可能性（BleepingComputer報道）

### 発覚の経緯

攻撃が発覚したのは **マルウェア自体のバグ** がきっかけだった：

- **Callum McMahon**（FutureSearch社）がCursor内のMCPプラグインを使用中、litellmが推移的依存として取り込まれた
- litellm 1.82.8のインストール時、`.pth`ファイルがPython起動のたびに自動実行され、子プロセスが再帰的に`.pth`をトリガーする**指数的フォークボム**を引き起こした
- マシンのRAMが枯渇してクラッシュしたことで異常が検出された

Karpathyは「もし攻撃者がこの攻撃をバイブコーディングしていなければ、数日から数週間検出されなかった可能性がある」と指摘。

### マルウェアの3段階攻撃

攻撃グループ **TeamPCP** による攻撃は3段階で実行された：

1. **収集（Collection）**：SSH鍵、`.env`ファイル、クラウド認証情報、Kubernetes設定、データベースパスワード、シェル履歴、暗号通貨ウォレット等を収集。クラウドメタデータエンドポイント（IMDS）への問い合わせも実行
2. **窃取（Exfiltration）**：ハードコードされた4096ビットRSA公開鍵でAES-256-CBC暗号化し、tarアーカイブとして `https://models.litellm.cloud/`（非正規ドメイン）にPOST送信
3. **横展開と永続化（Lateral Movement & Persistence）**：Kubernetesサービスアカウントトークンが存在する場合、全ネームスペースのクラスタシークレットを読み取り、`kube-system`内に特権`alpine:latest`ポッドを作成。`/root/.config/sysmon/sysmon.py`にバックドアを設置し、systemdユーザーサービスとして永続化

### 攻撃の起源

- **Trivy（脆弱性スキャナ）** のサプライチェーン侵害から連鎖的に発生
- Trivyの侵害で盗まれた認証情報がlitellmのPyPIパブリッシングパイプラインへのアクセスに使用された
- GitHubリポジトリには対応するタグやリリースは存在せず、**PyPIに直接アップロード**された

### Karpathyの主張：依存関係への再考

> Classical software engineering would have you believe that dependencies are good (we're building pyramids from bricks), but imo this has to be re-evaluated, and it's why I've been so growingly averse to them, preferring to use LLMs to "yoink" functionality when it's simple enough and possible.

Karpathyの主要な論点：

- サプライチェーン攻撃は「現代ソフトウェアにおいて想像しうる最も恐ろしいもの」
- 任意の依存関係をインストールするたび、依存ツリーの深い部分で汚染パッケージを取り込むリスクがある
- 大量の依存関係を持つ大規模プロジェクトほどリスクが高い
- 盗まれた認証情報はさらなるアカウント乗っ取りとパッケージ侵害の連鎖を引き起こす
- **LLMを使って機能を「ヨインク（内製化）」する**ことで依存関係を減らすアプローチを推奨

---

### コミュニティの反応

**Snyk** (@snyksec)：
litellmの依存関係インシデントは単発ではなく、**より大規模なキャンペーンの一部**であると指摘。litellmからのサプライチェーン・セキュリティへの波及が既に他プロジェクトにも及んでいることを警告。

**Patrick Senti** (@productaizery)：
Pythonサプライチェーンの防御策として、@gjbernat による「[Defense in Depth: A Practical Guide to Python Supply Chain Security](https://x.com/productaizery/status/2036559275883937945)」を推奨。

**Feross** (@feross)：
2020年からこの問題を警告してきたとし、**Socket Firewall** を解決策の一つとして提案。

---

### 対処すべきアクション

影響を受けた可能性がある場合の即時対応：

1. **バージョン確認**：`pip show litellm` で 1.82.7 / 1.82.8 がないか確認
2. **パッケージ削除とキャッシュパージ**：`pip cache purge` または `rm -rf ~/.cache/uv`
3. **永続化の確認**：`~/.config/sysmon/sysmon.py` と `~/.config/systemd/user/sysmon.service` の存在確認
4. **Kubernetes監査**：`kube-system`内の `node-setup-*` ポッドを確認
5. **全認証情報のローテーション**：SSH鍵、クラウド認証情報、APIキー、データベースパスワード等

---

### 関連リンク

- [FutureSearch: Supply Chain Attack in litellm 1.82.8 on PyPI](https://futuresearch.ai/blog/litellm-pypi-supply-chain-attack/) — 最初の発見者による詳細レポート
- [BleepingComputer: Popular LiteLLM PyPI package backdoored](https://www.bleepingcomputer.com/news/security/popular-litellm-pypi-package-compromised-in-teampcp-supply-chain-attack/) — TeamPCPの攻撃キャンペーン全体像
- [LiteLLM公式: Security Update March 2026](https://docs.litellm.ai/blog/security-update-march-2026) — 公式対応と影響範囲
- [GitHub Issue #24512](https://github.com/BerriAI/litellm/issues/24512) — コミュニティによる追跡

---

## 原文

**Andrej Karpathy** @karpathy 2026-03-24

Software horror: litellm PyPI supply chain attack.

Simple `pip install litellm` was enough to exfiltrate SSH keys, AWS/GCP/Azure creds, Kubernetes configs, git credentials, env vars (all your API keys), shell history, crypto wallets, SSL private keys, CI/CD secrets, database passwords.

LiteLLM itself has 97 million downloads per month which is already terrible, but much worse, the contagion spreads to any project that depends on litellm. For example, if you did `pip install dspy` (which depended on litellm>=1.64.0), you'd also be pwnd. Same for any other large project that depended on litellm.

Afaict the poisoned version was up for only less than ~1 hour. The attack had a bug which led to its discovery - Callum McMahon was using an MCP plugin inside Cursor that pulled in litellm as a transitive dependency. When litellm 1.82.8 installed, their machine ran out of RAM and crashed. So if the attacker didn't vibe code this attack it could have been undetected for many days or weeks.

Supply chain attacks like this are basically the scariest thing imaginable in modern software. Every time you install any depedency you could be pulling in a poisoned package anywhere deep inside its entire depedency tree. This is especially risky with large projects that might have lots and lots of dependencies. The credentials that do get stolen in each attack can then be used to take over more accounts and compromise more packages.

Classical software engineering would have you believe that dependencies are good (we're building pyramids from bricks), but imo this has to be re-evaluated, and it's why I've been so growingly averse to them, preferring to use LLMs to "yoink" functionality when it's simple enough and possible.

> 2026-03-24
> 
> LiteLLM HAS BEEN COMPROMISED, DO NOT UPDATE. We just discovered that LiteLLM pypi release 1.82.8. It has been compromised, it contains litellm\_init.pth with base64 encoded instructions to send all the credentials it can find to remote server + self-replicate. link below

---

**Snyk** @snyksec [2026-03-24](https://x.com/snyksec/status/2036492254685069675)

The LiteLLM dependency incident didn't "just happen" though. This is part of a larger campaign

LiteLLM already extends to supply chain security fallout for other projects:

---

**Andrej Karpathy** @karpathy [2026-03-24](https://x.com/karpathy/status/2036571460345667993)

thank you for the detailed article, great reading

---

**Patrick Senti** @productaizery [2026-03-24](https://x.com/productaizery/status/2036559275883937945)

If you're wondering how to protect your Python supply chain against attacks like the one that caught LiteLLM off guard, here's a great guide

Defense in Depth: A Practical Guide to Python Supply Chain Security, by @gjbernat 🙏

---

**Feross** @feross [2026-03-24](https://x.com/feross/status/2036533308625240427)

We've been warning about this problem since 2020.

Socket Firewall is one good solution.
