---
title: "Thread by @func25"
source: "https://x.com/func25/status/1956284004002619745?s=12"
author:
  - "[[@func25]]"
published: 2025-08-15
created: 2025-08-19
description: |
  google/wireがアーカイブされたのは、非推奨ではなく「完成した」と見なされたためであるという見解。それでもDIフレームワークは避け、手動での依存性注入が望ましいと主張。
tags:
  - "clippings"
---
**Phuong Le** @func25 [2025-08-15](https://x.com/func25/status/1956284004002619745)

google/wire は、非推奨になったからではなく、完成したと見なされたためにアーカイブされました (<https://github.com/google/wire)。>

それでも、DIフレームワークを避け、依存関係を手で配線するのが最善です。

コンストラクタと小さなパッケージは依存関係を明確にし、驚きを少なくします。また、設計についてより積極的に考えることを奨励します。

プロジェクトがすでにDIフレームワークを中心に構築されている場合、またはビジネス要件が手動での配線には複雑すぎる場合は、DIフレームワークを採用しても問題ありません。動的な配線は推奨されないため、uber/digやfxよりもgoogle/wireが望ましい選択です。明示的でコンパイル時の配線が常に優れています。

---

**Tamal Saha** @tsaha [2025-08-15](https://x.com/tsaha/status/1956314518138896391)

では、なぜ1.0ではないのですか？

---

**Phuong Le** @func25 [2025-08-15](https://x.com/func25/status/1956326586938204378)

セマンティックバージョニングに厳密に従う必要はありません。v0.3.0はすでに安定しています。

---

**Josh** @joshmo\_dev [2025-08-16](https://x.com/joshmo_dev/status/1956524004074033519)

非推奨でもないのに、なぜリポジトリをアーカイブするのでしょうか？意味がわかりません。

---

**kakkoyun** @kakkoyun\_me [2025-08-15](https://x.com/kakkoyun_me/status/1956404995533701286)

---

**Ben Hollis** @bhollis [2025-08-15](https://x.com/bhollis/status/1956373082680996239)

DIフレームワークを採用することは、アプリケーション内の合理的な構造が完全に崩壊する第一歩です。

---

**Nanda Gopal** @ramanagaadu07 [2025-08-15](https://x.com/ramanagaadu07/status/1956285171704942701)

私はfxを使っています。

---

**Mário Idival - Opinions here are my own** @marioidival [2025-08-16](https://x.com/marioidival/status/1956697488842281178)

ベータ版で完成...

![Image](https://pbs.twimg.com/media/GyeV-GCW0AAsrbk?format=png&name=large)

---

**Yuseferi** @yuseferi [2025-08-15](https://x.com/yuseferi/status/1956426712809455778)

何に基づいて、それが成熟したという結論に至ったのですか？

オープンソース環境では、それは非常に気まずいことです！！！！

DIは複雑すぎるので、彼らはそれにエネルギーを費やさず、何か他のことに集中することに決めたのだと私は信じています。

---

**Nicolas Sitbon** @NicolasSitbon [2025-08-15](https://x.com/NicolasSitbon/status/1956298508601852349)

全く同感です。いずれにせよビジネス要件が複雑な場合、Goは理想的な言語ではありません。したがって、常に手動で依存性注入を行い、アプリの「メイン」部分を目次として見なす方が良いです。

---

**Aleph de Tlön** @AlephDeTloen [2025-08-16](https://x.com/AlephDeTloen/status/1956540153524077016)

間違いです。それは放棄されたソフトウェア（アバンダンウェア）です。
