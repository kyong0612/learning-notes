---
title: "Announcing Cloudflare Email Service’s private beta"
source: "https://blog.cloudflare.com/email-service/"
author:
  - "[[Thomas Gauvin]]"
  - "[[Celso Martinho]]"
  - "[[Richard Boulton]]"
  - "[[Steve Goldsmith]]"
  - "[[Maurizio Abba]]"
  - "[[Matthew Bullock]]"
  - "[[Anni Wang]]"
  - "[[Mingwei Zhang]]"
  - "[[Bryton Herdes]]"
  - "[[Tim Kadlec]]"
published: 2025-09-25
created: 2025-09-27
description: "Cloudflare Email Serviceを発表。Workersのネイティブバインディングを使い、APIキー不要でメール送受信を統合した開発者向けサービスのプライベートベータ案内。"
tags:
  - "clippings"
---
2025年9月25日

読了目安: 約4分

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/1ekIsDppJhAU4ktpHPSC2v/9c94c6383d3e759cc9c0eb588191c39a/unnamed__31_.png)

アプリケーションを構築しているなら、ユーザーとのコミュニケーションにメールを頼っています。サインアップを検証し、イベントを通知し、請求書をメールで送信します。エージェント型ワークフローや、単純なメールを入出力に使うその他のAIツールのおかげで、メールの需要は新たな用途を獲得し続けています。

しかし、開発者がそれを管理するのは大きな負担です。多くのチームにとって最も厄介な業務であり続けています。開発者には、シンプルで信頼性が高く、ワークフローに深く組み込まれたソリューションが必要です。

そこで私たちは、Cloudflare Workersからトランザクションメールを直接送信できる新機能「Email Sending」のプライベートベータを発表します。Email Sendingは人気の[Email Routing](https://developers.cloudflare.com/email-routing/)を拡張し、両者を合わせて、あらゆるメールニーズに応える単一かつ統合された開発者体験であるCloudflare Email Serviceを形作ります。

Cloudflare Email Serviceでは、長年培ってきたメールの[セキュリティ強化](https://developers.cloudflare.com/cloudflare-one/email-security/)と[ルーティング](https://developers.cloudflare.com/email-routing/)の知見を、開発者プラットフォームの力と組み合わせました。Workerにバインディングを追加して`send`を呼ぶだけで、メール送信が完了します。

```javascript
export default {
  async fetch(request, env, ctx) {

    await env.SEND_EMAIL.send({
      to: [{ email: "hello@example.com" }],
      from: { email: "api-sender@your-domain.com", name: "Your App" },
      subject: "Hello World",
      text: "Hello World!"
    });

    return new Response(\`Successfully sent email!\`);
  },
};
```

### メール体験はユーザー体験そのもの

メールはユーザー体験の核心です。アプリケーションの外にいるユーザーと連絡を取り合う手段であり、パスワードリセットや購入レシート、マジックリンク、オンボーディングフローなど、行動を促す情報を伝える役割を担います。メールが届かなければ、アプリケーションの体験は破綻します。

つまり、メールが確実かつ迅速にユーザーの受信箱へ届くことが極めて重要です。マジックリンクが10分遅れればユーザーを失います。スパムフォルダに振り分けられれば、ユーザーフローが崩れ、製品への信頼も損なわれます。だからこそ、Cloudflare Email Serviceでは到達性と受信までの時間短縮に注力しています。

そのために、SPF、DKIM、DMARCといった必要なDNSレコードを自動構成するようDNSとの統合を強化し、送信ドメインが正しいことをメールプロバイダーが検証できるようにしました。さらにCloudflareらしく、Email Serviceはグローバルサービスです。世界中のどこへでも低遅延でメールを届けられ、リージョンごとにサーバーを管理する複雑さから解放されます。

### 開発者にとってシンプルで柔軟

メールをアプリケーションの中核要素として扱うには、開発ワークフローのあらゆるタッチポイントに対応することが不可欠です。Email ServiceはCloudflareスタックの一部として構築されており、メールを扱うことがWorkerを書くのと同じくらい自然に感じられるように設計しています。

具体的には、トランザクションメールのワークフロー全体を以下のようにカバーします。

- Email Serviceの導入は簡単です。APIキーやシークレットを管理する代わりに、`wrangler.jsonc`に`Email`バインディングを追加して、漏洩リスクなく安全にメールを送信できます。
- Workersを使って受信メールを処理し、添付ファイルをR2に保存し、Queuesにタスクを追加してアプリケーションのホットパスからメール送信を切り離せます。`wrangler`でEmail Sendingをローカルにエミュレートできるため、ツールや環境を行き来せずにユーザージャーニーをテストできます。
- 本番環境では、バウンス率や配送イベントを通じてメールの状況を明確に把握できます。ユーザーからメールが届かないと報告された場合も、配送ステータスをすばやく確認して問題を特定し、ユーザーをサポートに戻すことができます。

Email Serviceは既存のアプリケーションにも違和感なく溶け込みます。外部サービスからメールを送る必要があれば、REST APIまたはSMTPのどちらでも対応できます。また、[React Email](https://react.email/)のような既存のメールフレームワークを使ってリッチなHTMLメールを送信している場合も、そのままEmail Serviceで利用できます。ライブラリをインポートし、テンプレートをレンダリングし、`send`メソッドに渡すだけです。

```javascript
import { render, pretty, toPlainText } from '@react-email/render';
import { SignupConfirmation } from './templates';

export default {
  async fetch(request, env, ctx) {

    // Convert React Email template to html
    const html = await pretty(await render(<SignupConfirmation url="https://your-domain.com/confirmation-id"/>));

    // Use the Email Sending binding to send emails
    await env.SEND_EMAIL.send({
      to: [{ email: "hello@example.com" }],
      from: { email: "api-sender@your-domain.com", name: "Welcome" },
      subject: "Signup Confirmation",
      html,
      text: toPlainText(html)
    });

    return new Response(\`Successfully sent email!\`);
  }
};
```

### Email Routing and Email Sending: Better together

メールを送信するだけでは物語の半分にすぎません。多くのアプリケーションは、強力なワークフローを実現するためにメールを受信・解析する必要があります。Email Sendingと既存の[Email Routing](https://developers.cloudflare.com/email-routing)機能を組み合わせることで、アプリケーションのメールニーズを端から端までカバーする完全なソリューションを提供します。

Email Routingを使えば、ドメインにカスタムメールアドレスを作成し、Workerで受信メッセージをプログラム的に処理できます。たとえば、次のような高度なアプリケーションフローを実現できます。

- [Workers AI](https://developers.cloudflare.com/workers-ai/)を使って受信メールを解析・要約しラベル付けすることで、顧客からのセキュリティイベントやバグ・インシデントの兆候を検知し、受信メールに基づく自動応答を生成。
- `support@your-domain.com`に届いたメールからJIRAやLinearでサポートチケットを自動作成。
- `invoices@your-domain.com`に送られてきた請求書を処理し、添付ファイルをR2に保存。

Email Routingを利用するには、Workerアプリケーションに`email`ハンドラーを追加し、必要に応じて処理を実装します。

```javascript
export default {
  // Workerに配信されたメールを処理するemailハンドラーを作成
  async email(message, env, ctx) {

    // Workers AIを使って受信メールを分類
    const { score, label } = env.AI.run("@cf/huggingface/distilbert-sst-2-int8", { text: message.raw" })

    env.PROCESSED_EMAILS.send({score, label, message});
  },
};
```

受信と送信を組み合わせれば、Cloudflare内で完全なループを閉じることができます。ユーザーがサポートアドレスにメールを送ると、Workerがメールを受け取り内容を解析し、サードパーティAPIに連携してチケットを作成し、Email Sendingバインディングでチケット番号入りの確認メールを即座に返信できます。これが、統合されたEmail Serviceの真価です。

Email Sendingには有料のWorkersサブスクリプションが必要となり、送信したメッセージ数に基づいて課金する予定です。現在パッケージングの最終調整を行っており、詳細が決まり次第、ドキュメントや[変更履歴](https://developers.cloudflare.com/changelog/)を更新し、課金開始のずっと前にお客様へお知らせします。Email Routingの制限は変更しません。

### 今後の展開

メールは今日のアプリケーションに不可欠であり、次世代のAIエージェント、バックグラウンドタスク、自動化ワークフローにも欠かせない存在になりつつあります。私たちはCloudflare Email Serviceを、こうした新時代のアプリケーションを支える原動力として構築し、11月にはプライベートベータとして提供を開始します。

- Email Sendingに興味がありますか？[こちらからウェイトリストに登録してください。](https://forms.gle/BX6ECfkar3oVLQxs7)
- 受信メールの処理を始めたいですか？[Email Routing](https://developers.cloudflare.com/email-routing/)ならすぐに利用でき、引き続き無料です。今後は新しいEmail Sending APIにも統合されます。

Email Serviceを開発者プラットフォームに追加できることを嬉しく思っています。メールにますます依存するユーザー体験を、皆さんがどのように再構築してくださるのか楽しみです。

Cloudflareのコネクティビティクラウドは、[企業ネットワーク全体](https://www.cloudflare.com/network-services/)を保護し、[インターネット規模のアプリケーションを効率的に構築する](https://workers.cloudflare.com/)お客様を支援し、あらゆる[ウェブサイトやインターネットアプリケーションを高速化](https://www.cloudflare.com/performance/accelerate-internet-applications/)し、[DDoS攻撃を遮断](https://www.cloudflare.com/ddos/)し、[ハッカーの脅威を防ぎ](https://www.cloudflare.com/application-security/)、[ゼロトラストへの移行](https://www.cloudflare.com/products/zero-trust/)を後押しします。

どのデバイスからでも[1.1.1.1](https://one.one.one.one/)にアクセスして、インターネットをより高速かつ安全にする無料アプリを今すぐお試しください。

より良いインターネットの実現という私たちの使命については[こちら](https://www.cloudflare.com/learning/what-is-cloudflare/)をご覧ください。新しいキャリアを探しているなら、[採用情報](http://www.cloudflare.com/careers)もぜひチェックしてください。
