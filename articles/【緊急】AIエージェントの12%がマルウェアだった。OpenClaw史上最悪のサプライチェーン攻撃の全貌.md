---
title: "【緊急】AIエージェントの12%がマルウェアだった。OpenClaw史上最悪のサプライチェーン攻撃の全貌"
source: "https://qiita.com/emi_ndk/items/bf3b5f0f3eef99a4d124"
author:
  - "[[emi_ndk]]"
published: 2026-02-15
created: 2026-02-17
description: "パーソナルAIエージェント「OpenClaw」のスキルマーケットプレイス「ClawHub」にて、全スキルの約12%にあたる341個の悪意あるスキルが発見された。335個が同一攻撃者グループによる組織的サプライチェーン攻撃「ClawHavoc」であり、暗号資産ウォレットの秘密鍵やAPIキー等の窃取を目的としていた。さらにCVE-2026-25253によるワンクリックRCE脆弱性も判明し、21,639台のインスタンスが危険にさらされた。"
tags:
  - "clippings"
  - "サプライチェーン攻撃"
  - "AIエージェント"
  - "マルウェア"
  - "Security"
  - "OpenClaw"
---

## 概要

2026年2月、パーソナルAIエージェント「OpenClaw」のスキルマーケットプレイス「ClawHub」で、**341個の悪意あるスキル（全体の約12%）** が発見された。セキュリティ企業Koi Securityの調査により「ClawHavoc」と名付けられた大規模サプライチェーン攻撃の全貌が明らかになった。

### 被害の要点

- **21,639台**のOpenClawインスタンスがインターネットに公開状態
- **CVE-2026-25253**: ワンクリックでPCが乗っ取られる致命的脆弱性
- **標的**: 暗号資産ウォレットの秘密鍵、取引所APIキー、SSH認証情報
- **335個**が同一攻撃者グループによるもの（C&Cサーバー: `91.92.242.30`）
- ClawHub上の2,857スキル中、341個（12%）が悪意あるスキル

---

## 「ClawHavoc」作戦の攻撃手口

### 攻撃フロー

1. ユーザーが「便利そうな」スキルを発見（例: Solanaウォレットトラッカー、YouTubeユーティリティ）
2. スキルをインストール
3. 「Prerequisites（前提条件）」セクションに誘導 → 外部ファイルのダウンロード＆実行を指示
4. **マルウェア（AMOS Stealer）がインストール**される
5. 以下の情報が窃取される:
   - 暗号資産ウォレットの秘密鍵
   - 取引所APIキー
   - SSH認証情報
   - ブラウザのパスワード

### 335個が同一犯による組織的攻撃

341個中335個が同一のC&Cサーバー（`91.92.242.30`）に接続。攻撃者は正規ツールを装ったスキルを大量に公開していた。

| カテゴリ | 偽装例 |
|---|---|
| 暗号資産 | Solanaウォレットトラッカー、Polymarket取引ボット |
| 開発ツール | Auto-updater、ファイナンスツール |
| メディア | YouTubeユーティリティ |
| その他 | ClawHubのタイポスクワット（clawhub → c1awhub等） |

---

## CVE-2026-25253: ワンクリックRCE脆弱性

悪意あるWebページを訪問するだけで、OpenClawがインストールされたPCを**完全に乗っ取られる**脆弱性。

**攻撃チェーン:**

1. 攻撃者のWebページを訪問
2. WebSocketオリジン検証の欠如を悪用
3. 認証トークンを窃取
4. API経由でサンドボックスを無効化
5. ホストマシンを完全掌握

> 研究者のMav Levin氏: 「ミリ秒単位で任意のOpenClawインスタンスを侵害できる」

---

## Ciscoが指摘する4つの構造的問題

Ciscoのセキュリティチームは、OpenClawのようなパーソナルAIエージェントを **「セキュリティの悪夢」** と断言。

### 1. 過剰な権限
スクリプト実行、ファイルの読み書き、シェルコマンド実行が可能 → root権限に近いアクセスを保有。

### 2. 平文で保存された認証情報
APIキーや認証情報が平文でリーク。プロンプトインジェクションや公開エンドポイント経由で取得可能。

### 3. 攻撃面の拡大
WhatsAppやiMessageとの連携機能により、メッセージングアプリ経由での攻撃ベクトルが追加。

### 4. セキュリティは「オプション」
公式ドキュメントに *"There is no 'perfectly secure' setup"*（完璧にセキュアな設定は存在しない）と記載。セキュリティが基盤ではなくオプション扱い。

---

## 被害規模

Censysの調査による:

- **1月末時点で21,639台**のOpenClawインスタンスがインターネットに公開
- わずか**1週間で1,000台から21,000台以上に急増**
- すべてが攻撃者の標的になり得る状態

---

## 推奨される5つの対策

### 1. インストール済みスキルの確認

```bash
openclaw skills list
openclaw skills inspect <skill_name>
```

### 2. 不審なスキルの即削除

以下の特徴に注意:
- 暗号資産関連の機能を謳う
- `glot.io`等の外部サービスからスクリプトを取得
- 「Prerequisites」で外部ファイルのダウンロードを要求

### 3. Ciscoの「Skill Scanner」を活用

Ciscoがオープンソースで公開した [Skill Scanner](https://github.com/cisco-ai-defense/skill-scanner) でスキルの安全性を事前評価。

```bash
pip install cisco-skill-scanner
skill-scanner scan <skill_directory>
```

### 4. ネットワーク監視の強化

C&Cサーバー `91.92.242.30` への通信をブロック。

### 5. AIエージェントの必要性を再考

便利さと引き換えに、業務データ・個人情報・暗号資産をリスクにさらしていないか検討する。

---

## 2026年の展望: AIエージェントは「新しい攻撃ベクトル」へ

- **Palo Alto Networks**: 「AIエージェントは2026年最大の新しい攻撃ベクトルになる」
- **「マンチュリアン・エージェント」シナリオ**: 正規の人間の認証情報で動作するAIエージェントが、外部攻撃者によって操作され、企業ネットワーク内部から攻撃を実行する — 2026年中に現実化すると予測

---

## 参考リンク

- [Researchers Find 341 Malicious ClawHub Skills Stealing Data from OpenClaw Users](https://thehackernews.com/)
- [Personal AI Agents like OpenClaw Are a Security Nightmare - Cisco Blogs](https://blogs.cisco.com/)
- [OpenClaw Security Fallout: 341 Malicious Skills and Enabling One-Click Remote Code Execution](https://www.securityweek.com/)
- [Security Experts Dire Warning on AI Agents in 2026](https://www.darkreading.com/)