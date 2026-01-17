---
title: "What came first- the CNAME or the A record"
source: "https://blog.cloudflare.com/cname-a-record-order-dns-standards/"
author:
  - "[[Sebastiaan Neuteboom]]"
  - "[[David Belson]]"
  - "[[Dane Knecht]]"
  - "[[João Tomé]]"
published: 2026-01-14
created: 2026-01-17
description: "A recent change to 1.1.1.1 accidentally altered the order of CNAME records in DNS responses, breaking resolution for some clients. This post explores the technical root cause, examines the source code of affected resolvers, and dives into the inherent ambiguities of the DNS RFCs."
tags:
  - "clippings"
  - "DNS"
  - "1.1.1.1"
  - "Post-Mortem"
  - "Resolver"
  - "RFC"
  - "Cloudflare"
---

## 概要

2026年1月8日、Cloudflareの1.1.1.1 DNSリゾルバへのルーティンアップデートが、インターネット全体でDNS解決障害を引き起こした。根本原因は攻撃や大規模なシステム障害ではなく、**CNAMEレコードの順序変更**という微妙な変更だった。

## インシデントの経緯

| 日時 | イベント |
|------|----------|
| 2025年12月2日 | メモリ使用量削減のためのコード変更が導入 |
| 2026年1月8日 | 変更がリリースされ、DNS解決障害が発生 |

## DNS CNAMEチェーンの仕組み

ドメイン（例：`www.example.com`）をクエリすると、CNAME（Canonical Name）レコードが返され、別の名前へのエイリアスを示すことがある。

```
www.example.com → cdn.example.com → server.cdn-provider.com → 198.51.100.1
```

1.1.1.1のようなパブリックリゾルバは、このチェーンをたどり、各中間レコードをキャッシュする。各レコードには独自の**TTL（Time-To-Live）**があり、キャッシュ可能な時間を示す。

### 部分的な期限切れの問題

CNAMEチェーン内の一部のレコードが期限切れになった場合、キャッシュされた部分を活用して、チェーン全体を再解決する必要がない。

## コード変更の内容

**変更前:** 新しいリストを作成し、既存のCNAMEチェーンを挿入してから新しいレコードを追加

**変更後:** メモリ割り当てとコピーを節約するため、既存の回答リストにCNAMEを追加

この結果、**CNAMEレコードが最終的な解決済み回答の後（下部）に表示される**ようになった。

## 影響が発生した理由

DNSクライアントが応答を受信すると、CNAMEチェーンをたどって最終的なIPアドレスを見つける必要がある。一部の実装は**CNAMEレコードが先頭に表示される**ことを期待している。

### 正常な順序での解析

1. `www.example.com`のレコードを検索
2. `www.example.com. CNAME cdn.example.com`を発見
3. `cdn.example.com`のレコードを検索
4. `cdn.example.com. A 198.51.100.1`を発見 ✓

### CNAMEが下部にある場合

1. `www.example.com`のレコードを検索
2. `cdn.example.com. A 198.51.100.1`を無視（期待する名前と一致しない）
3. `www.example.com. CNAME cdn.example.com`を発見
4. `cdn.example.com`のレコードを検索
5. これ以上レコードがないため、**応答が空と見なされる** ✗

## 影響を受けた実装

- **glibc の getaddrinfo 関数**: LinuxでDNS解決に広く使用される関数。順次解析を前提としている
- **Cisco イーサネットスイッチ（3モデル）のDNSCプロセス**: 1.1.1.1を使用するよう設定されたスイッチで自発的な再起動が発生。[Ciscoがサービスドキュメントを公開](https://www.cisco.com/c/en/us/support/docs/ip/domain-name-system-dns/222732-cisco-catalyst-series-switches-experien.html)

## 影響を受けなかった実装

- **systemd-resolved**: レコードを順序付きセットにパースしてから処理するため、CNAMEが先頭になくてもチェーン全体を検索可能

## RFCの規定

### RFC 1034 (1987年) の曖昧さ

RFC 1034のセクション4.3.1には「possibly preface（おそらく先行させる）」という表現があるが、RFC 2119で定義された**MUST**や**SHOULD**のような規範的キーワードを使用していない。

### RRset vs RR の微妙な区別

- **RRset（Resource Record Set）**: 同じ名前、タイプ、クラスを持つレコードの集合
- RFC 1034はRRset内の順序は重要でないと述べているが、**異なるRRset間の順序**については明確に規定していない

### RFC 1034 セクション6.2.1

「RRの順序は重要ではない」という例があるが、これは同じ名前の2つのAレコードについてであり、CNAMEとAレコードのような異なるレコードタイプには適用されない可能性がある。

## CNAMEチェーン内の順序問題

CNAMEを他のレコードタイプより先に配置しても、**CNAMEチェーン自体が順序通りでない**場合、順次解析は失敗する可能性がある。

RFC 1034は、`www.example.com. CNAME cdn.example.com.`が`cdn.example.com. CNAME server.cdn-provider.com.`より先に表示される必要があるとは規定していない。

## リゾルバの動作

RFC 1034セクション5.2.2は、リゾルバがCNAMEを見つけた場合、**応答内のどこに表示されても**クエリを再開始すべきと示唆している。ただし、これは主に**再帰リゾルバ**（1.1.1.1など）を念頭に書かれており、**スタブリゾルバ**（glibcのgetaddrinfoなど）の簡略化された実装には適用されない場合がある。

## DNSSECとの対比

RFC 4035（DNSSEC）はより明示的な言語を使用し、**MUST**や**higher priority**を定義している。ただし、これはRRSIGレコードが応答に含まれるかどうかについてであり、順序についてではない。

## Cloudflareの対応

1. **変更を元に戻した**: CNAME順序変更を撤回し、今後変更する予定はない
2. **Internet-Draft を提案**: IETFで議論するための明確化提案を作成
   - [https://datatracker.ietf.org/doc/draft-jabley-dnsop-ordered-answer-section](https://datatracker.ietf.org/doc/draft-jabley-dnsop-ordered-answer-section)
   - DNSOPワーキンググループで合意が得られれば、将来のRFCで明確化される

## 重要な教訓

1. **RFCの曖昧さ**: 1987年のRFC 1034は現代の規範的言語を使用しておらず、解釈の余地がある
2. **実装の多様性**: 広く普及しているDNSクライアントでも、異なる前提で実装されている
3. **テストの重要性**: 曖昧な仕様に基づく動作は、明示的なテストで保護すべき
4. **後方互換性**: 技術的に仕様に準拠していても、既存の実装を壊す変更は避けるべき
