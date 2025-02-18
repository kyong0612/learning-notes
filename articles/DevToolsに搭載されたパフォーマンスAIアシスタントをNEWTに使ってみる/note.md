# DevToolsに搭載されたパフォーマンスAIアシスタントをNEWTに使ってみる

ref: <https://zenn.dev/reiwatravel/articles/031f88f4639b99>

はじめまして、フロントエンドエンジニアの白浜です。

私が所属する令和トラベルでは旅行アプリ『 [NEWT（ニュート）](https://newt.net/)』を提供しており、この3年弱で様々な新機能をリリースしてきました。

パフォーマンス面の改善は後回しになりがちだったのですが、2024年11月にChromeに搭載された [パフォーマンスのAIアシスタント](https://developer.chrome.com/docs/devtools/ai-assistance/performance) を試してみたところ、想像以上に手軽にパフォーマンスを改善できたので、今回はその取り組みをご紹介します。

![2024/11にリリースされたパフォーマンスAIアシスタント](https://storage.googleapis.com/zenn-user-upload/a94ed3752d11-20250213.png)

_2024/11にリリースされたパフォーマンスAIアシスタント_

## Lighthouseで改善点の洗い出し

まずはChromeのDevToolsからLighthouseでNEWTの改善点を洗い出します。

普段使っているChromeを使うとFireabse認証やChrome拡張機能によって影響を受けるため、作成したばかりのChromeプロファイルを使うことをおすすめします[\[1\]](https://zenn.dev/reiwatravel/articles/031f88f4639b99#fn-9a48-1)。

こちらがLighthouseによるnewt.netの診断結果になります。

![Lighthouseでnewt.netのspページを監査した結果](https://storage.googleapis.com/zenn-user-upload/edec67117a2b-20250213.png)

_Lighthouseでnewt.netのspページを監査した結果_

ページ下部のDIAGNOSTICSセクションを見ると、JavaScriptの実行時間が長いこと、メインスレッドを逼迫していることを指摘されていました。

![DIAGNOSTICSセクション](https://storage.googleapis.com/zenn-user-upload/e87426f5918a-20250213.png)

Reduce JavaScript execution timeの項目を開くと、下記2つのチャンクファイルの実行に時間かかっているようです。

![Reduce JavaScript execution time](https://storage.googleapis.com/zenn-user-upload/b104c4a34b76-20250213.png)

`https://newt.net/_next/static/chunks/framework-xxxxxxxx.js`

こちらはReact/Next.jsのベースコードが書かれたアプリ全体で共有するframeworkチャンクになります。

`https://newt.net/_next/static/chunks/pages/_app-xxxxxxxxx.js`

このページチャンクと呼ばれるファイルはページごとに分割・最適化されたファイルで、一般的にビジネスロジックの負債や設計の変更によって大幅な改善が見込めます。

今回はこちらを改善していきます🙌🏻

## パフォーマンス計測とAIアシスタントによる分析

実際に、`https://newt.net/_next/static/chunks/pages/_app-xxxxxxxxx.js` がどのように悪影響を及ぼしているか、今度は同じくDevToolsのパフォーマンスタブでパフォーマンスの計測を行います。

![パフォーマンス結果](https://storage.googleapis.com/zenn-user-upload/1ecfd27b3f5d-20250213.png)

左下に「Next.js-before-hydration」とあり、hydration前にEvaluate scriptが続き、処理も重そうです。こちらが問題の`_next/static/chunks/pages/_app-xxxxxxxxx.js` でした。

![Evaluate script](https://storage.googleapis.com/zenn-user-upload/ec0c9530575d-20250213.png)

**ここでパフォーマンスAIアシスタントの出番です。**

この「Evaluate script」を右クリックすると「Ask AI」という選択肢が出てくるので、押すと、AI assistanceタブを開くことができます。

![](https://storage.googleapis.com/zenn-user-upload/07fbd9cad3a2-20250213.png)

このパフォーマンスのAIアシスタントはスクリプトごとの改善点を探ってくれます。

早速聞いてみます：

「このスクリプトを改善する方法を教えて」

![](https://storage.googleapis.com/zenn-user-upload/93a57fe33452-20250213.png)

回答：

![](https://storage.googleapis.com/zenn-user-upload/84aba6b539fa-20250213.png)

エラー監視ツールのSentryは様々な機能を持っていますが、その中のReplay機能（エラー時のカスタマーの挙動を匿名化して動画にする機能）がボトルネックになっている、とのことでした。

実際 “Evaluate script” の処理の内訳を見てみると `(anonymous)` の処理に時間がかかっており、AIアシスタントによるとこの中身がSentryのReplayのようです。

![](https://storage.googleapis.com/zenn-user-upload/53e113222167-20250213.png)

質問：

(anonymous)はどんな処理をしていますか？

![](https://storage.googleapis.com/zenn-user-upload/e45a1c193195-20250213.png)

回答：

![](https://storage.googleapis.com/zenn-user-upload/05883379f7b0-20250213.png)

チャンクファイルは @next/bundle-analyzer 等で構成を分析することができますが、どの部分の処理がボトルネックになっているかまでは知ることができません。パフォーマンスのAIアシスタントは詳細を深ぼっていくことで、実際にかかった時間や改善の優先順位を教えてくれることがわかりました💡

指摘されたSentryのReplay機能は社内で十分に活用できておらず、今回は取り除くことにしました。AIアシスタントに聞かなければ気づかなかったボトルネックなので、とても貴重な気づきとなりました。

### Replay機能をオフにした結果

既存実装だと545msかかっていたscript evalutationを、半分の279msにすることができました。

![](https://storage.googleapis.com/zenn-user-upload/9e8f6288ce4e-20250213.png)

## まとめ

今回の記事では、2024年11月にリリースされたChromeのパフォーマンスAIアシスタントを実際に活用し、これまで把握しづらかったチャンクファイルの処理のボトルネックを詳細に解析してみました。

その結果、社内であまり活用できていなかったSentryのReplay機能が原因となっていることが判明し、これを除外したところスクリプトの評価時間を50％削減できるという大きな成果を得られました。

今後はChatGPTなどのAIも使い、パフォーマンス計測時のスクリーンショットを解説・分析等をしてもらいながら、さらなる改善に取り組んでいきます。

![ChatGPT o1 proに聞いてみた様子](https://storage.googleapis.com/zenn-user-upload/4daad5754750-20250213.png)

_ChatGPT o1 proに聞いてみた様子。気づかなかった・知らなかった観点が多くあり、学びになります。_
