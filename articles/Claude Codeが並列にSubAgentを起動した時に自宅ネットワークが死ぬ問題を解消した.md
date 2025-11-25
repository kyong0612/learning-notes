---
title: "Claude Codeが並列にSubAgentを起動した時に自宅ネットワークが死ぬ問題を解消した"
source: "https://blog.shibayu36.org/entry/2025/11/11/110301"
author:
  - "[[shiba_yu36]]"
published: 2025-11-11
created: 2025-11-25
description: "Claude Codeが4~5並列でSubAgentを起動した際に、v6プラス(MAP-E方式)のポート数制限が原因でネットワーク障害が発生。DS-Lite形式（enひかりの超transix）への契約変更で解消した経験を共有。ネットワークの専門知識がなくても、知人の助けとChatGPTの分析で原因を特定し解決に至った過程を詳細に記録。"
tags:
  - Claude-Code
  - ネットワーク
  - v6プラス
  - MAP-E
  - DS-Lite
  - NAT
  - トラブルシューティング
  - IPv4-over-IPv6
---

## 概要

Claude Codeが4~5並列でSubAgentを起動すると、自宅ネットワークが完全に死ぬ問題が発生。知人の助けを借りながら原因を特定し、ISP契約の変更で解消した。

### 発生した症状

- pingなども含めて一切外部との通信ができなくなる
- Claude Codeを一旦止めて数分待つと復活する

### 環境

- **ISP**: enひかり + v6プラスオプション
- **ルーター**: Aterm 2600HP4

---

## 調査プロセス

### 1. 再現手順

「どういう内容でもいいので、10並列で何かの調査を行なってみて」とClaude Codeに指示を出すと、Explore SubAgentが一斉に起動。この状態でしばらく経つと外部通信が全くできなくなる。

### 2. Wiresharkでの調査

- Aterm 2600HP4にはログ出力機能がない
- Wiresharkを起動しパケットを確認、Expert Infoも確認
- ChatGPTにパケットキャプチャとExpert Infoのスクショを渡して分析 → **NAT周りが怪しい**との結果

### 3. 疑問点

- SubAgent起動時のTCP接続のESTABLISHED状態は100程度
- ルーターのNATテーブルは約6万セッション作れるはず
- この程度で上限に達する理由が不明

---

## 原因の特定

### MAP-E方式のポート数制限

知人からの指摘：**v6プラス(MAP-E方式)でのIPv4通信は、ISP側でポート数が約240に制限されている**

参考：[v6プラス(MAP-E方式) のポートが枯渇してインターネットに接続できなくなっていた](https://m1yam0t0.com/posts/20231027-run-out-v6plus-sessions/)

### 他環境での検証

| 環境 | 結果 |
|------|------|
| PPPoE接続環境 | ネットワークは死なない |
| スマホテザリング | ネットワークは死なない |

→ 通信が不安定なテザリング環境でも死なないことが確認でき、ISP側のポート制限が原因である可能性が高まった。

---

## 対策と解決

### 考えられた対策

1. **ポートセービングIPマスカレード機能付きルーター**を購入
   - 最近の安物ルーターでも大体搭載されている
2. **DS-Lite方式の契約に変更**
   - ISP側で動的にポートが決められるため、MAP-Eより柔軟

### 採用した解決策

**enひかりの「超transix」（DS-Lite方式）に契約変更**

- 月額: v6プラス 198円/month → 超transix 399円/month（+200円）
- **12,800ポート**確保可能

**結果**: SubAgentが一斉起動してもネットワークが死ななくなった！

---

## 残る疑問

完全に原因を理解した状態ではない点が残念。問題発生時の状況：

- Claude Code以外のアプリケーションをほぼ全て閉じた状態
- Wireshark上でもパケットがあまり流れない状態
- SubAgentを5並列程度起動するだけで発生
- **TCPの同時接続数は100程度**（240ポート制限には達していない）
- **Anthropic APIへの接続はIPv6**（ポート数制限は無関係）

### 推測される追加要因

> MAP-E方式では、ISP側はポート範囲を割り当てるだけで、NATテーブルの管理は自宅ルーター側の実装依存。UDPはタイムアウトまでNATセッション維持が有名だが、ルーターによってはTCPも接続切断後しばらくNATセッションを維持してしまう可能性がある。

**追記（2025/11/11）**: TCP/FINが来た後にNATテーブルに残るのは結構あるあるとの情報あり。[YAMAHA ルーターのNAT設定例](https://www.rtpro.yamaha.co.jp/RT/manual/rt-common/nat/nat_descriptor_timer.html)参照。

---

## 学んだ知識（調査メモ）

### IPv4/IPv6とNAT

| 項目 | 説明 |
|------|------|
| IPv6通信 | クライアント・サーバー双方のIPが一意に決まるためNAT不要 |
| PPPoE IPv4 | IPv4アドレスが契約につき1つ割り当て、約60,000ポート利用可能 |
| IPv4 over IPv6 | 複数契約でIPv4アドレスを共有、ポートで分割されるためポート数制限あり |

### MAP-E vs DS-Lite

| 方式 | NAT処理 | ポート割り当て | 特徴 |
|------|---------|---------------|------|
| **MAP-E** | 自宅ルーター | ISPが静的に決定 | ルーター側のNAT実装が関係 |
| **DS-Lite** | ISP側(AFTR) | ISPが動的に決定 | より柔軟にポート使用可能 |

### ポートセービングIPマスカレード

ルーターが扱うポートごとに「送信元IP・送信元ポート・プロトコル・送信先IP・送信先ポート」を保持。戻りパケットの送信先情報から送信元情報に逆変換できるため、ルーター側送信ポートを節約できる。

---

## 参考リンク

- [v6プラス(MAP-E方式) のポートが枯渇してインターネットに接続できなくなっていた](https://m1yam0t0.com/posts/20231027-run-out-v6plus-sessions/)
- [NAT動作をめぐる誤解まとめ - turgenev's blog](https://turgenev.hatenablog.com/entry/2024/03/04/010342)
- [IPv4の常識 vs IPv6の常識＠家庭内LAN - Qiita](https://qiita.com/tetsuy/items/22f0a1707f0adfe10d06)
- [DS-LiteでIPv4してみませんか？ - IIJ てくろぐ](https://techlog.iij.ad.jp/archives/1254)
- [IPv4 over IPv6について - パソコン屋のひとりごと](https://magic-user.net/ipv4-over-ipv6-1/107/)
- [私が「IPv4 over IPv6」を DS-LiteからMAP-Eに変更した理由 - IP実践道場](https://note.com/noblehero0521/n/n8b08dcf67d25)

---

## まとめ

- **v6プラス(MAP-E方式)** のIPv4環境では、Claude Codeの並列SubAgent起動でネットワーク障害が発生
- **DS-Lite方式（超transix）** への契約変更で解消
- 知人の助けとChatGPTの分析が問題解決に大きく貢献
- ネットワークの専門知識がなくても、仮説検証と環境比較で原因特定は可能
