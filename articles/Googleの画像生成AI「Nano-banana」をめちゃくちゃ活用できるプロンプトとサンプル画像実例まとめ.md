---
title: "Googleの画像生成AI「Nano-banana」をめちゃくちゃ活用できるプロンプトとサンプル画像実例まとめ"
source: "https://gigazine.net/news/20250912-nano-banana-prompt-example-matome/"
author:
  - "log1i_yk"
published: 2025-09-12
created: 2025-09-15
description: |
  Googleの画像生成AI「Nano Banana」は、入力画像の特徴を維持しながら編集することを得意としています。この記事では、Nano Bananaで使える具体的なプロンプトとその実例を16個のカテゴリに分けて紹介します。キャラクターフィギュア化、時代風の写真加工、線画の着色、ポーズ変更など、多岐にわたる活用法がまとめられています。
tags:
  - "ソフトウェア"
  - "ネットサービス"
  - "ウェブアプリ"
  - "画像生成AI"
  - "Google"
  - "Nano-banana"
---

Googleの画像生成AI「Nano Banana」は、入力した画像の特徴を維持しながら編集することを得意とし、無料ユーザーでも1日に100枚まで画像を生成できます。この記事では、有志によって公開されたNano Bananaで使えるプロンプトと、その実例を16個紹介します。

### ◆1：キャラクターのフィギュア化

入力した写真をキャラクターフィギュアに変換し、背景にそのキャラクターが印刷された箱やモデリング中のPC画面を配置します。

- **入力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/01inputa-a.jpg)
- **出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/01output-a.jpg)
- **プロンプト:**

    ```
    turn this photo into a character figure. Behind it, place a box with the character's image printed on it, and a computer showing the Blender modeling process on its screen. In front of the box, add a round plastic base with the character figure standing on it. set the scene indoors if possible
    ```

### ◆2：異なる時代の自分の写真

キャラクターのスタイルを指定した年代風に変更します。髪型や口ひげ、背景などをカスタマイズ可能です。

- **入力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/02input.jpg)
- **出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/02output.jpg)
- **プロンプト:**

    ```
    Change the characer's style to [1970]'s classical [male] style Add [long curly] hair, [long mustache], change the background to the iconic [californian summer landscape] Don't change the character's face
    ```

    *注記：`[角括弧]`内のテキストを希望する時代や詳細に変更してください。*

### ◆3：クロスビュー画像の生成

写真をトップダウンビューに変換し、撮影者の位置をマークします。

- **入力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/03input.jpg)
- **出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/03output.jpg)
- **プロンプト:**

    ```
    Convert the photo to a top-down view and mark the location of the photographer.
    ```

### ◆4：カラーパレットを使った線画の着色

カラーパレット画像を参照して、線画に着色します。

- **入力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/04input.jpg)
- **出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/04output.jpg)
- **プロンプト:**

    ```
    Accurately use the color palette from Figure 2 to color the character in Figure 1
    ```

### ◆5：古い写真のカラー化

古いモノクロ写真を復元し、カラー化します。

- **入力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/05input.jpg)
- **出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/05output.jpg)
- **プロンプト:**

    ```
    restore and colorize this photo.
    ```

### ◆6：指定のコーディネートに着替えさせる

人物画像と服装の画像を基に、人物に指定した服を着せることができます。

- **入力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/06input.jpg)
- **出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/06output.jpg)
- **プロンプト:**

    ```
    Choose the person in Image 1 and dress them in all the clothing and accessories from Image 2. Shoot a series of realistic OOTD-style photos outdoors, using natural lighting, a stylish street style, and clear full-body shots. Keep the person's identity and pose from Image 1, but show the complete outfit and accessories from Image 2 in a cohesive, stylish way.
    ```

### ◆7：キャラクターのポーズ変更

写真に写っている人物の向きを、プロンプトで指示して変更します。

- **入力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/07input.jpg)
- **出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/07output.jpg)
- **プロンプト:**

    ```
    Have the person in the picture look straight ahead
    ```

### ◆8：線画からポーズを指定する

人物の画像とポーズを指定する線画を使い、人物のポーズを線画に合わせて変更します。

- **入力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/08input.jpg)
- **出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/08output.jpg)
- **プロンプト:**

    ```
    Change the pose of the person in Figure 1 to that of Figure 2, and shoot in a professional studio
    ```

    *注記：線画と参考画像をアップロードする必要があります。*

### ◆9：地図から立体的な建物のイラストへ

地図上の建物を、指定したゲームタイトルのような立体的なイラストに変換します。

- **入力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/09input.jpg)
- **出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/09output.jpg)
- **プロンプト:**

    ```
    Take this location and make the landmark an isometric image (building only), in the stvle of the game Theme Park
    ```

### ◆10：メイクの分析

画像内のメイクを分析し、改善点を赤ペンでマークして示します。

- **入力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/10input.jpg)
- **出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/10output.jpg)
- **プロンプト:**

    ```
    Analyze this image. Use a red pen to mark areas that can be improved Analyze this image. Use a red pen to denote where you can improve
    ```

### ◆11：複数のキャラクターポーズ生成

1枚のイラストから、さまざまなポーズのシートを生成します。

- **入力と出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/11output.jpg)
- **プロンプト:**

    ```
    Please create a pose sheet for this illustration, making various poses!
    ```

### ◆12：照明制御

キャラクター画像と照明の参考画像を使い、キャラクターの照明を変更します。

- **入力と出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/12output.jpg)
- **プロンプト:**

    ```
    Change the character from Image 1 to the lighting from Image 2, with dark areas as shadows
    ```

    *注記：入力では画像と同時に照明の参考画像をアップロードする必要があります。*

### ◆13：被写体を抽出して透明なレイヤーに配置

画像から指定した被写体を抽出し、背景を透明にします。

- **入力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/13input.jpg)
- **出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/13output.jpg)
- **プロンプト:**

    ```
    extract the [samurai] and put transparent background
    ```

    *注記：`[角括弧]`内のテキストを、抽出したいオブジェクトに置き換えてください。*

### ◆14：アニメの巨大フィギュアを東京のど真ん中に置く

キャラクターの画像を、東京の中心部にある巨大な像としてリアルな写真作品に変換します。

- **入力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/14input.jpg)
- **出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/14output.jpg)
- **プロンプト:**

    ```
    A realistic photographic work. A gigantic statue of this person has been placed in a square in the center of Tokyo, with people looking up at it.
    ```

### ◆15：マンガスタイルへの変換

入力した写真を、白黒のマンガ風の線画に変換します。

- **入力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/15input.jpg)
- **出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/15output.jpg)
- **プロンプト:**

    ```
    Convert the input photo into a black-and-white manga-style line drawing.
    ```

### ◆16：証明写真の作成

入力した写真から、指定した背景色や服装の証明写真を作成します。

- **入力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/16input.jpg)
- **出力例:**
    ![](https://i.gzn.jp/img/2025/09/12/nano-banana-prompt-example-matome/16output.jpg)
- **プロンプト:**

    ```
    Crop the head and create a 2-inch ID photo with:
      1. Blue background
      2. Professional business attire
      3. Frontal face
      4. Slight smile
    ```
