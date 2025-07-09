---
title: "FujiwaraChoki/MoneyPrinterV2: Automate the process of making money online."
source: "https://github.com/FujiwaraChoki/MoneyPrinterV2"
author:
  - "[[FujiwaraChoki]]"
  - "@DevBySami"
published:
created: 2025-07-09
description: |
  An Application that automates the process of making money online. MPV2 (MoneyPrinter Version 2) is, as the name suggests, the second version of the MoneyPrinter project. It is a complete rewrite of the original project, with a focus on a wider range of features and a more modular architecture.
tags:
  - "clippings"
  - "python"
  - "cli"
  - "money"
  - "outreach"
  - "json"
  - "automation"
  - "youtube"
  - "twitter"
---

# MoneyPrinter V2

> ♥︎ **Sponsor**: The Best AI Chat App: [shiori.ai](https://www.shiori.ai)

---

> 𝕏 Also, follow me on X: [@DevBySami](https://x.com/DevBySami).

[![madewithlove](https://camo.githubusercontent.com/b199fabd947beb75a0113cae47b1dd8d1c8be22cd4802cd24b1c8863a4533e3f/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6d6164655f776974682d2545322539442541342d7265643f7374796c653d666f722d7468652d6261646765266c6162656c436f6c6f723d6f72616e6765)](https://github.com/FujiwaraChoki/MoneyPrinterV2)
[![Buy Me A Coffee](https://camo.githubusercontent.com/58a61ff58e4731aec6ca22af9517aadb2a67fc3b5a68170fb8219d1b9d5f7381/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4275792532304d6525323041253230436f666665652d446f6e6174652d627269676874677265656e3f6c6f676f3d6275796d6561636f66666565)](https://www.buymeacoffee.com/fujicodes)
[![GitHub license](https://camo.githubusercontent.com/690eb43218d31fa1e513e607e4739bae68c93c14cfcba707c21cf50ff3876f84/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c6963656e73652f46756a697761726143686f6b692f4d6f6e65795072696e74657256323f7374796c653d666f722d7468652d6261646765)](https://github.com/FujiwaraChoki/MoneyPrinterV2/blob/main/LICENSE)
[![GitHub issues](https://camo.githubusercontent.com/cb22078d958558a95cc5b012526647814f0b36bdc319e13224b00c881fcd8c22/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6973737565732f46756a697761726143686f6b692f4d6f6e65795072696e74657256323f7374796c653d666f722d7468652d6261646765)](https://github.com/FujiwaraChoki/MoneyPrinterV2/issues)
[![GitHub stars](https://camo.githubusercontent.com/378dfbd02fb3708cdc5747310cbcc542b6f1e9e92544e15a806bad26bd189248/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f73746172732f46756a697761726143686f6b692f4d6f6e65795072696e74657256323f7374796c653d666f722d7468652d6261646765)](https://github.com/FujiwaraChoki/MoneyPrinterV2/stargazers)
[![Discord](https://camo.githubusercontent.com/7b4f87fb92dcfad4340c8346c100f7a8592264e3d9a026f6d05533c0a92dd73d/68747470733a2f2f696d672e736869656c64732e696f2f646973636f72642f313133343834383533373730343830343433323f7374796c653d666f722d7468652d6261646765)](https://dsc.gg/fuji-community)

MPV2 (MoneyPrinter Version 2) は、オンラインでの収益化プロセスを自動化するアプリケーションです。これは、MoneyPrinterプロジェクトの第2版であり、元のプロジェクトを完全に書き直し、より広範な機能とモジュラーなアーキテクチャに焦点を当てています。

> **Note:** MPV2が効果的に機能するにはPython 3.9が必要です。
> YouTubeビデオは[こちら](https://youtu.be/wAZ_ZSuIqfk)で視聴できます。

## Features

* Twitterボット（CRONジョブ => `scheduler`）
* YouTube Shorts自動化（CRONジョブ => `scheduler`）
* アフィリエイトマーケティング（Amazon + Twitter）
* ローカルビジネスの検索とコールドアウトリーチ

## Versions

MoneyPrinterには、コミュニティによって開発された多言語のバージョンがあります。以下はいくつかの既知のバージョンです：

* 中国語: [MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo)

独自のバージョン/フォークを提出したい場合は、フォークに加えた変更を説明するissueを開いてください。

## Installation

まず[Microsoft Visual C++ build tools](https://visualstudio.microsoft.com/de/visual-cpp-build-tools/)をインストールしてください。これにより、CoquiTTSが正しく機能します。

> ⚠️ スクレイピングしたビジネスにEメールで連絡を取る予定の場合は、まず[Goプログラミング言語](https://golang.org/)をインストールしてください。

```bash
git clone https://github.com/FujiwaraChoki/MoneyPrinterV2.git

cd MoneyPrinterV2
# 設定例をコピーし、config.jsonの値を入力します
cp config.example.json config.json

# 仮想環境を作成します
python -m venv venv

# 仮想環境をアクティベートします - Windows
.\venv\Scripts\activate

# 仮想環境をアクティベートします - Unix
source venv/bin/activate

# 必要なライブラリをインストールします
pip install -r requirements.txt
```

## Usage

```bash
# アプリケーションを実行します
python src/main.py
```

## Documentation

関連するすべてのドキュメントは[こちら](/FujiwaraChoki/MoneyPrinterV2/blob/main/docs)にあります。

## Scripts

簡単な使用法のために、`scripts`ディレクトリにはいくつかのスクリプトがあり、ユーザーの操作なしでMPV2のコア機能に直接アクセスするために使用できます。

すべてのスクリプトは、プロジェクトのルートディレクトリから実行する必要があります。例：`bash scripts/upload_video.sh`。

## Contributing

私たちの行動規範およびプルリクエストを提出するプロセスについての詳細は、[CONTRIBUTING.md](/FujiwaraChoki/MoneyPrinterV2/blob/main/CONTRIBUTING.md)をお読みください。実装が必要な機能のリストについては、[docs/Roadmap.md](/FujiwaraChoki/MoneyPrinterV2/blob/main/docs/Roadmap.md)を確認してください。

## Code of Conduct

私たちの行動規範およびプルリクエストを提出するプロセスについての詳細は、[CODE_OF_CONDUCT.md](/FujiwaraChoki/MoneyPrinterV2/blob/main/CODE_OF_CONDUCT.md)をお読みください。

## License

MoneyPrinterV2は`Affero General Public License v3.0`でライセンスされています。詳細については、[LICENSE](/FujiwaraChoki/MoneyPrinterV2/blob/main/LICENSE)を参照してください。

## Acknowledgments

* [CoquiTTS](https://github.com/coqui-ai/TTS)
* [gpt4free](https://github.com/xtekky/gpt4free)

## Disclaimer

このプロジェクトは教育目的のみです。提供された情報の誤用について、作者は一切責任を負いません。このウェブサイト上のすべての情報は、誠意をもって、一般的な情報提供のみを目的として公開されています。作者は、この情報の完全性、信頼性、正確性についていかなる保証も行いません。このウェブサイト（FujiwaraChoki/MoneyPrinterV2）で見つけた情報に基づいて行ういかなる行動も、厳密に自己責任で行ってください。作者は、当社のウェブサイトの使用に関連するいかなる損失および/または損害についても責任を負いません。
