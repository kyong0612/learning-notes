# LLMs.txtについての覚書

ref: <https://zenn.dev/watany/articles/0b28a68a2dffc3>

## LLM時代のWebアクセスとは

世は大LLM時代。皆が元気にTavilyでWebクロールしたり、AI AgentでガンガンDeep Researchする時代は、人間用のWebサイトにえげつない負荷を与えているのであった。

そんな時に「仕様を1枚のテキストにまとめたよ！」みたいな情報が時々流れてくるが、これは `LLMs.txt` というらしい。恥ずかしながら仕様の存在を知らなかったので、勉強がてらにまとめてみる。

## LLMs.txt?

Answer.AI の Jeremy Howard 氏が2024/9/3に提案したのが発端のようだ。

[**The /llms.txt file – llms-txt** \
A proposal to standardise on using an llms.txt file to provide information to help LLMs use a website
![llmstxt.org favicon image](https://www.google.com/s2/favicons?sz=14&domain_url=https://llmstxt.org)

![llmstxt.org thumbnail image](https://embed.zenn.studio/api/optimize-og-image/f1500f61013e0d611417/https%3A%2F%2Fllmstxt.org%2F%2Fsample.png)](<https://llmstxt.org/>)

[https://llmstxt.org/](https://llmstxt.org/)

LLMs.txtはLLM（推論エンジン）向けの課題を解決するための提案である。LLMのコンテキストウィンドウの制限に対応したり、不要なマークアップやスクリプトを削除し、AI処理に最適化された構造でコンテンツを提供できる。ということらしい。シングルファイルなのでCDNにポン置きできるし、人間用のサイトへの負荷も減らせていいように思う。

ある意味当然なのだが、このサイトにも `https://llmstxt.org/llms.txt` があり、本記事もそこからの知識をNotebookLMに突っ込んでインプットにしている。(なので便利さを理解している。)

### 他ファイルとの位置づけ

説明を見ていると検索エンジン用のファイルを思い出すが、役割の違いを再確認する。

- robots.txt
  - **検索エンジンのクローラー** のアクセスを制御するもの
- sitemap.xml
  - インデックス可能な **ページのリスト**

## 分類

LLMs.txtは厳密には `llms.txt` と `llms-full.txt` の2種類がある。

### llms.txt

サイトの構造をLLMに伝えるためのサマリー的な役割のファイル。

ファイルのFormatはうっすら決まっていて、概ねこんな感じ。

```md code-line
# Title

> Optional description goes here

Optional details go here

## Section name

- [Link title](https://link_url): Optional link details

## Optional

- [Link title](https://link_url)

```

- H1 プロジェクト名から始める
- Documentのリンク集をMarkdown形式で列挙する
- 優先度の低い項目を `Optional` として下部にまとめる

### llms-full.txt

Markdown形式のサイト情報を表す完全なドキュメント。コンテキストの限り突っ込むならこちらのファイルを使う。

具体例としてAntropic, Cloudflareのものを共有する。(すごいテキスト量だ！)

[**https://docs.anthropic.com/llms-full.txt** \\
\\
![docs.anthropic.com favicon image](https://www.google.com/s2/favicons?sz=14&domain_url=https://docs.anthropic.com)docs.anthropic.com](https://docs.anthropic.com/llms-full.txt)

[https://docs.anthropic.com/llms-full.txt](https://docs.anthropic.com/llms-full.txt)

[**https://developers.cloudflare.com/llms-full.txt** \\
\\
![developers.cloudflare.com favicon image](https://www.google.com/s2/favicons?sz=14&domain_url=https://developers.cloudflare.com)developers.cloudflare.com](https://developers.cloudflare.com/llms-full.txt)

[https://developers.cloudflare.com/llms-full.txt](https://developers.cloudflare.com/llms-full.txt)

### 具体例

`/llms.txt directory` というサイトがあって、先ほど挙げたものだけでなく、Perplexity、Cursor、DuckDBなど著名なプロダクト・サービスのLLMs.txtを読むことができる。

[**llms.txt directory** \\
\\
Discover websites embracing the llms.txt standard, designed to provide LLM-friendly content and guid\\
\\
![directory.llmstxt.cloud favicon image](https://www.google.com/s2/favicons?sz=14&domain_url=https://directory.llmstxt.cloud)directory.llmstxt.cloud\\
\\
![directory.llmstxt.cloud thumbnail image](https://embed.zenn.studio/api/optimize-og-image/33b2d7af4c0ad3e6a434/https%3A%2F%2Fdirectory.llmstxt.cloud%2Fllmstxt-directory.png)](https://directory.llmstxt.cloud/llms.text)

[https://directory.llmstxt.cloud/llms.text](https://directory.llmstxt.cloud/llms.text)

## LLMs.txtの使い方

AI Agentに使わせるのもいいが、NotebookLMに食わせるとシンプルに強い。(Twitterで見た使い方)

[**Google NotebookLM Plus を導入した** \\
\\
資料を渡して解説して貰うというのは ChatGPT を利用していたのだが、かなりの確率で嘘つかれるので、だんだん使わなくなってきた。\\
\\
Google NotebookLM がどうやら、それに特化してい\\
\\
![voluntas.ghost.io favicon image](https://www.google.com/s2/favicons?sz=14&domain_url=https://voluntas.ghost.io)voluntas.ghost.io\\
\\
![voluntas.ghost.io thumbnail image](https://embed.zenn.studio/api/optimize-og-image/411671e276b8cfb78cb7/https%3A%2F%2Fstatic.ghost.org%2Fv5.0.0%2Fimages%2Fpublication-cover.jpg)](https://voluntas.ghost.io/google-notebooklm-plus-introduction/)

[https://voluntas.ghost.io/google-notebooklm-plus-introduction/](https://voluntas.ghost.io/google-notebooklm-plus-introduction/)

![](https://storage.googleapis.com/zenn-user-upload/5c395776fa31-20250218.png)

仕様について雑に聞き放題の先生が作れる。

![](https://storage.googleapis.com/zenn-user-upload/be12a990e4f1-20250218.png)

## 課題

LLMs.txtは使われているとはいえ標準とまでは達していないため、AI AgentにLLMs.txtを渡すスマートな方法はないらしく、当面は手動で扱う運用になりそうだ。

一応Python用のモジュールは見つけた。

[**Python module & CLI – llms-txt** \\
\\
Read llms.txt files and create XML context documents for LLMs\\
\\
![llmstxt.org favicon image](https://www.google.com/s2/favicons?sz=14&domain_url=https://llmstxt.org)llmstxt.org](https://llmstxt.org/intro.html#how-to-use)

[https://llmstxt.org/intro.html#how-to-use](https://llmstxt.org/intro.html#how-to-use)

LLM利用者的には「こういう概念があるので、RAGや解説物をLLMにさせるときはLLMs.txtを探そう」と理解しておけば良さそう。

サービス提供者側がすぐ公開しないとマズい、という性格のものではないが、動向は意識しておくと良いのだろう。

## 参考

以下の記事があるので参考にした。

[**AIエージェントファーストなwebとllms.txtについて考える無職 - Qiita** \\
\\
LLM時代のWebアクセシビリティここ数年でLLMが情報を検索する時代になってしまいました。ChatGPTなどのサービスに要求するだけでLLMが検索のためのクエリをバックエンドで生成することがで…\\
\\
![qiita.com favicon image](https://www.google.com/s2/favicons?sz=14&domain_url=https://qiita.com)qiita.com\\
\\
![qiita.com thumbnail image](https://embed.zenn.studio/api/optimize-og-image/b10685dd5841a448e5a3/https%3A%2F%2Fqiita-user-contents.imgix.net%2Fhttps%253A%252F%252Fqiita-user-contents.imgix.net%252Fhttps%25253A%25252F%25252Fcdn.qiita.com%25252Fassets%25252Fpublic%25252Farticle-ogp-background-afbab5eb44e0b055cce1258705637a91.png%253Fixlib%253Drb-4.0.0%2526w%253D1200%2526blend64%253DaHR0cHM6Ly9xaWl0YS11c2VyLXByb2ZpbGUtaW1hZ2VzLmltZ2l4Lm5ldC9odHRwcyUzQSUyRiUyRnMzLWFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20lMkZxaWl0YS1pbWFnZS1zdG9yZSUyRjAlMkYxOTc3MzYwJTJGY2MyMDc4NTE2YzcwM2UzMmIyNWEzNGY3ODNlNzUwOGU5MzRlMjFkZSUyRmxhcmdlLnBuZyUzRjE2ODEzNTczMzg_aXhsaWI9cmItNC4wLjAmYXI9MSUzQTEmZml0PWNyb3AmbWFzaz1lbGxpcHNlJmZtPXBuZzMyJnM9NjY2MDJlNmQ2ZTA3YmE5ZDkxNTU5MjY5NGNiN2NlMzg%2526blend-x%253D120%2526blend-y%253D467%2526blend-w%253D82%2526blend-h%253D82%2526blend-mode%253Dnormal%2526s%253D12253347de95bdd02a4fb45bffd32c3c%3Fixlib%3Drb-4.0.0%26w%3D1200%26fm%3Djpg%26mark64%3DaHR0cHM6Ly9xaWl0YS11c2VyLWNvbnRlbnRzLmltZ2l4Lm5ldC9-dGV4dD9peGxpYj1yYi00LjAuMCZ3PTk2MCZoPTMyNCZ0eHQ9QUklRTMlODIlQTglRTMlODMlQkMlRTMlODIlQjglRTMlODIlQTclRTMlODMlQjMlRTMlODMlODglRTMlODMlOTUlRTMlODIlQTElRTMlODMlQkMlRTMlODIlQjklRTMlODMlODglRTMlODElQUF3ZWIlRTMlODElQThsbG1zLnR4dCVFMyU4MSVBQiVFMyU4MSVBNCVFMyU4MSU4NCVFMyU4MSVBNiVFOCU4MCU4MyVFMyU4MSU4OCVFMyU4MiU4QiVFNyU4NCVBMSVFOCU4MSVCNyZ0eHQtYWxpZ249bGVmdCUyQ3RvcCZ0eHQtY29sb3I9JTIzMUUyMTIxJnR4dC1mb250PUhpcmFnaW5vJTIwU2FucyUyMFc2JnR4dC1zaXplPTU2JnR4dC1wYWQ9MCZzPTI4MzQxOTQ2ZGUxMWYwZjE0ZDliOTk3YzIyNDhhM2Ex%26mark-x%3D120%26mark-y%3D112%26blend64%3DaHR0cHM6Ly9xaWl0YS11c2VyLWNvbnRlbnRzLmltZ2l4Lm5ldC9-dGV4dD9peGxpYj1yYi00LjAuMCZ3PTgzOCZoPTU4JnR4dD0lNDBudW1la3VkaSZ0eHQtY29sb3I9JTIzMUUyMTIxJnR4dC1mb250PUhpcmFnaW5vJTIwU2FucyUyMFc2JnR4dC1zaXplPTM2JnR4dC1wYWQ9MCZzPThlNTk1Mzc4ZTIxZDZjNGFjODE5MWJiYjZkYTEzNjNh%26blend-x%3D242%26blend-y%3D480%26blend-w%3D838%26blend-h%3D46%26blend-fit%3Dcrop%26blend-crop%3Dleft%252Cbottom%26blend-mode%3Dnormal%26s%3D15460082c76898206e880e22a13cab7a)](https://qiita.com/numekudi/items/16799a62b62f7c012981#%E5%AF%BE%E7%AD%96%E3%81%A8%E3%81%97%E3%81%A6%E3%81%AEllmstxt)

[https://qiita.com/numekudi/items/16799a62b62f7c012981#対策としてのllmstxt](https://qiita.com/numekudi/items/16799a62b62f7c012981#%E5%AF%BE%E7%AD%96%E3%81%A8%E3%81%97%E3%81%A6%E3%81%AEllmstxt)

[**LLMs.txt Explained \| Towards Data Science** \\
\\
Your guide to the web's new LLM-ready content standard\\
\\
![towardsdatascience.com favicon image](https://www.google.com/s2/favicons?sz=14&domain_url=https://towardsdatascience.com)towardsdatascience.com\\
\\
![towardsdatascience.com thumbnail image](https://embed.zenn.studio/api/optimize-og-image/ce7bbeb1b102701d6caf/https%3A%2F%2Ftowardsdatascience.com%2Fwp-content%2Fuploads%2F2024%2F11%2F1SUhj4n10S8PWllp3-yQZtw-1024x512.png)](https://towardsdatascience.com/llms-txt-414d5121bcb3/)

[https://towardsdatascience.com/llms-txt-414d5121bcb3/](https://towardsdatascience.com/llms-txt-414d5121bcb3/)
