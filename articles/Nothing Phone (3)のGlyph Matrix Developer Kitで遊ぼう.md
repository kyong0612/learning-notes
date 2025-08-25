---
title: "Nothing Phone (3)のGlyph Matrix Developer Kitで遊ぼう"
source: "https://blog.lai.so/nothing-phone-3/"
author:
  - "laiso"
published: 2025-08-23
created: 2025-08-25
description: |
  Nothing Phone (3)に搭載されたGlyph Matrixと、そのDeveloper Kitを使ってオリジナルのミニアプリ「Glyph Toy」を作成する方法を解説する記事。SDKの導入からサンプルアプリの実装までを紹介し、ガジェットとしてのカスタマイズの楽しさを伝えます。
tags:
  - "Nothing Phone"
  - "Glyph Matrix"
  - "Android"
  - "SDK"
  - "ガジェット"
---

## Nothing Phoneとは？

Nothing Phoneは、イギリスの元OnePlus創業者Carl Peiが手がけるAndroidスマートフォンです。その独特のデザインで注目を集め、2022年の初代Phone (1)発売以来、熱狂的なファン層を獲得しています。Phone (3)は、2025年7月に発表された3世代目のモデルです。

## Glyph InterfaceとGlyph Matrix

Nothing Phoneの最大の特徴の一つが、背面のLEDをアプリのインターフェイスとして活用する「Glyph Interface」です。

* **Phone (1)/(2)**: 複数のバー状LEDを組み合わせ、通知や充電状態などを表現していました。
* **Phone (3)**: 新たに「Glyph Matrix」を搭載。これは円形に配置された489個のマイクロLEDで、より複雑な図形やアニメーションの描画が可能になりました。

![Glyph Interface](https://blog.lai.so/content/images/2025/08/Screenshot-2025-08-23-at-19.10.03.png)

## Glyph ToyとGlyph Button

Glyph Matrix上で動作するミニアプリが「Glyph Toy」です。これはAndroidのServiceとして実装され、SDKを通じて独自の機能を開発できます。

* **Glyph Button**: 背面に搭載された物理ボタン。タップでToyを切り替え、長押しでインタラクションを実行します。
* **利用可能なイベント**: タップ、長押しに加え、ジャイロスコープや加速度センサーの情報も利用できます。
* **サンプルToy**: 「カメラToy」（ボタンで撮影）、「タイマーToy」、「Magic 8 Ball」（占いアプリ）などが提供されており、25x25のLEDと各種センサーを組み合わせたアプリケーションが作成可能です。

![様々なGlyph Toys](https://blog.lai.so/content/images/2025/08/image-13.png)

## Glyph Toyの作り方

開発は、GitHubで公開されている「Glyph Matrix SDK」（AAR形式）を利用して、Android Studio上でKotlinやJavaを用いて行います。

1. **開発環境**: サンプルリポジトリ「[GlyphMatrix-Example-Project](https://github.com/Nothing-Developer-Programme/GlyphMatrix-Example-Project?ref=blog.lai.so)」をベースにするのが最も簡単です。
2. **実装**: `AndroidManifest.xml`にServiceを登録し、Toyのフレームごとの更新処理をオーバーライドすることでロジックを実装します。
3. **プレビュー用SVG**: Nothing Phoneの設定画面で表示されるプレビュー用のSVG画像は、Figmaプラグイン「[Glyph Matrix Util](https://www.figma.com/community/plugin/1526505846480298025/glyph-matrix-util?ref=blog.lai.so)」を使って簡単に作成できます。

著者は、寿司のピクセルアートを表示する「Shushi Toy」を制作例として挙げています。

![Shushi Toy](https://blog.lai.so/content/images/2025/08/image-14.png)
![Glyph Matrix Util](https://blog.lai.so/content/images/2025/08/Screenshot-2025-08-23-at-18.54.11.png)

## おわりに

Glyph Matrix SDKを活用することで、開発者はNothing Phone (3)のハードウェア機能を活かした独自のアプリケーションを作成し、ガジェットを自由にカスタマイズして楽しむことができます。これはMacBookのTouch Barを彷彿とさせるギミックであり、実用性というよりはインタラクションそのものを楽しむための機能と言えるでしょう。

また、記事では触れられていませんが、Nothing OS 3.0にはユーザーのデバイス上の活動を監視して自動でタスクリストを作成するAI機能なども搭載されているとのことです。
