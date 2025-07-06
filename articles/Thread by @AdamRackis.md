---
title: "Thread by @AdamRackis"
source: "https://x.com/adamrackis/status/1940477573735301563?s=12"
author:
  - "[[@AdamRackis]]"
published: 2025-07-02
created: 2025-07-06
description: |
  PrismaとDrizzleのORMパフォーマンスベンチマークを巡るX上での議論。PrismaのCTOがベンチマークの正確性に異議を唱え、開発者コミュニティから様々な意見が寄せられている状況をまとめたもの。
tags:
  - "clippings"
  - "Prisma"
  - "Drizzle"
  - "ORM"
  - "benchmark"
  - "database"
---
## Prisma vs. Drizzle パフォーマンス論争

Adam Rackis氏のXでの投稿をきっかけに、ORMであるPrismaとDrizzleのパフォーマンス、特にベンチマークの信憑性を巡る議論が巻き起こった。

### 発端

Adam Rackis氏は、PrismaとDrizzleの対立の原因として、DrizzleがPrismaより10倍高速であると主張するベンチマーク画像（下記参照）を投稿したことから議論が始まった。

![Image](https://pbs.twimg.com/media/Gu32DQeW8AAVU2C?format=jpg&name=large)

### 主な論点と意見

この投稿に対し、開発者コミュニティから様々な意見が寄せられた。

* **Prisma側の反論**:
  * Prismaの共同創設者であるSøren Bramer Schmidt氏は、このベンチマークは不正確であり、事実に反すると強く主張。Prismaチームは何度もこのベンチマークの取り下げを求めてきたが、応じられていないと述べた。
  * Kent C. Dodds氏は、自身のサイトでPrismaを使用しているが、複数回のDBクエリにもかかわらず200ms未満の高速なページロードを実現していると述べ、Prismaのパフォーマンスを擁護した。

* **コミュニティからの意見**:
  * **Drizzleの出自**: Anthony Hagi氏は「DrizzleはPrismaのフォークであることを考えればかなり良い」と述べたが、これに対してAdam Rackis氏は驚きを示している。
  * **PrismaのJoin実装**: `meekaaku`氏は、PrismaがデータベースレベルのJOIN（INNER/LEFT/OUTER JOIN）をサポートしたのはバージョン5.8からであり、それ以前は複数回のクエリを発行してアプリケーションランタイムで結果を結合していたと技術的な背景を指摘した。この機能はまだプレビュー段階であり、PostgreSQLとMySQLに限定されている。
  * **ベンチマークの現在性**: Pavel Romanov氏は、現在のPrismaはバージョン6.11.0であり、議論されているベンチマークが現在のバージョンでも有効かは不明確だと指摘した。

* **開発者の体感**:
  * スレッドの主であるAdam Rackis氏は、Drizzleを実際に使用して気に入っていると述べている。
  * 一方で、Dwayne氏は「drizzle sucks」と否定的な意見を表明しており、開発者の間でも評価が分かれている。

### 結論

この一連のスレッドは、特定のベンチマーク結果を巡って、PrismaとDrizzleの支持者および開発者たちの間で意見が大きく分かれている現状を浮き彫りにした。ベンチマークの正確性、Prismaの過去と現在の実装、そして開発者個人の実体験など、多角的な視点からの意見が交わされ、ORM選定の複雑さを示唆している。
