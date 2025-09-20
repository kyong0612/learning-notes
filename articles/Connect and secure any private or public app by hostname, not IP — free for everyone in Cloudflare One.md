---
title: "IPアドレスではなくホスト名でプライベート・パブリックアプリに接続し保護 — Cloudflare Oneで全ユーザーに無料提供"
source: "https://blog.cloudflare.com/tunnel-hostname-routing/"
author:
  - "[[Nikita Cano]]"
  - "[[Sharon Goldberg]]"
  - "[[Ayush Kumar]]"
  - "[[Andrew Meyer]]"
  - "[[Michael Mcgrory]]"
  - "[[Gavin Chen]]"
  - "[[Chris Draper]]"
  - "[[Koko Uko]]"
  - "[[AJ Gerstenhaber]]"
  - "[[Corey Mahan]]"
published: 2025-09-18
created: 2025-09-21
description: "IPリストにうんざりしていませんか？IPアドレスではなくホスト名でプライベートネットワークを任意のアプリに安全に接続できます。この強力なルーティング機能がCloudflare Tunnelに組み込まれ、Cloudflare Oneの全顧客に無料で提供され、ゼロトラストの導入を簡素化します。"
tags:
  - "clippings"
---
2025-09-18

1分で読める

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/1kNmxuKi9KEGqihLmmWMLD/afc4ae72f1fc8469d2173ffb4b45951b/Feature_Image.png)

アプリケーションへの接続は、その名前を知るだけで簡単にできるはずです。しかし、多くのセキュリティモデルは、脆弱で常に変化するIPアドレスに依存することを強いられています。そして、これらの絶えず変化するIPリストの管理が常に困難であるという声を多くの方からいただいています。

今日、私たちはこれを過去の遺物にするための大きな一歩を踏み出します。

ホスト名またはドメインに基づいて[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)にトラフィックをルーティングできるようになったことを発表できることを嬉しく思います。これにより、基盤となるIPを知る必要なく、プライベートおよびパブリックWebアプリケーション用のシンプルなゼロトラストおよびエグレスポリシーを構築するためにCloudflare Tunnelを使用できます。これは、[Cloudflare One](https://developers.cloudflare.com/cloudflare-one/) SASEプラットフォームでホスト名およびドメインベースのポリシーのプラットフォーム全体サポートを強化し、複雑さを簡素化し、顧客とエンドユーザーのセキュリティを向上させる[使命](https://blog.cloudflare.com/egress-policies-by-hostname/)におけるもう一歩です。

## ネットワークではなく、アプリケーションへのアクセス許可

2020年8月、米国国立標準技術研究所（NIST）は[特別刊行物800-207](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf)を発行し、組織に対して「城と堀」のセキュリティモデル（ネットワークの場所に基づいて信頼が確立される）を放棄し、ゼロトラストモデル（「[アクセスを確立しようとするあらゆるものを検証する](https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf)」）に移行することを推奨しました。

現在では、広範なネットワーク権限を付与する代わりに、個々のリソースへの特定のアクセスを許可します。リソース単位認証として知られるこの概念は、ゼロトラストフレームワークの基盤であり、組織が従来ネットワークを運用してきた方法に大きな変化をもたらします。リソース単位認証では、アクセスポリシーをリソース単位で設定する必要があります。最小権限の原則を適用することで、ユーザーには業務を行うために絶対に必要なリソースのみへのアクセスを許可します。これによりセキュリティが強化され、任意のリソースに対する潜在的な攻撃対象領域が縮小されます。

ユーザーに`**10.131.0.0/24**`のようなネットワークセグメント全体へのアクセスを許可する代わりに、セキュリティポリシーはより精密になります。例えば：

- 管理対象デバイスを実行している「SRE」グループの従業員のみが`**admin.core-router3-sjc.acme.local**`にアクセス可能
- カナダに所在する「finance」グループの従業員のみが`**canada-payroll-server.acme.local**`にアクセス可能
- ニューヨークに所在するすべての従業員が`**printer1.nyc.acme.local**`にアクセス可能

これらの強力で細かいルールに共通していることは何でしょうか？すべてリソースのプライベート**ホスト名**に基づいており、IPアドレスではありません。これが私たちの新しいホスト名ルーティングが可能にすることです。基盤となるIPアドレスを知る必要なく、安定したホスト名を使用して効果的なゼロトラストポリシーを記述することが劇的に簡単になりました。

## IPベースのルールが破綻する理由

内部サーバー`**canada-payroll-server.acme.local**`を保護する必要があると想像してください。このサーバーは内部IP `**10.4.4.4**`でホストされており、そのホスト名は内部プライベートDNSで利用可能ですが、パブリックDNSでは利用できません。現代のクラウド環境では、IPアドレスは最も不安定な要素であることが多いです。セキュリティポリシーがそのIPに依存している場合、それは不安定な基盤の上に構築されています。

これはいくつかの一般的な理由で発生します：

- **クラウドインスタンス**: AWSなどのクラウド環境でコンピュートインスタンスを起動する場合、その[ホスト名](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/hostname-types.html)は自分で管理しますが、IPアドレスは必ずしもそうではありません。その結果、ホスト名のみを追跡しており、サーバーのIPを知らない場合もあります。
- **ロードバランサー**: サーバーがクラウド環境のロードバランサー（AWS ELBなど）の背後にある場合、IPアドレスは[トラフィックの変化](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html)に応じて動的に変更される可能性があります。
- **エフェメラルインフラストラクチャ**: これは現代インフラストラクチャの「[ペットではなく家畜](https://cloudscaling.com/blog/cloud-computing/the-history-of-pets-vs-cattle/)」の世界です。自動スケーリンググループのサーバー、Kubernetesクラスター内のコンテナ、または夜間にシャットダウンするアプリケーションなどのリソースは、必要に応じて作成・破棄されます。ユーザーが見つけられるよう永続的なホスト名を維持しますが、IPは一時的で、起動するたびに変更されます。

これに対処するため、顧客がアドレスが変更されるたびに更新される、ホスト名からIPへのマッピングである動的な「IPリスト」を維持する複雑なスクリプトを構築するのを見てきました。このアプローチは巧妙ですが、IPリストの維持は面倒な作業です。脆弱で、単一のエラーで従業員が重要なリソースへのアクセスを失う可能性があります。

幸い、ホスト名ベースのルーティングにより、このIPリストの回避策は不要になります。

## 動作原理：Cloudflare One SASEプラットフォームを使用してホスト名でプライベートサーバーを保護

これを実際に見るために、先ほどの例からポリシーを作成しましょう：カナダに所在する「finance」グループの従業員に`**canada-payroll-server.acme.local**`へのアクセスを許可したいとします。IPアドレスに触れることなく、以下のようにして実現できます。

**ステップ1：プライベートネットワークを接続**

まず、サーバーのネットワークにCloudflareのグローバルネットワークへの安全な接続が必要です。これは、軽量エージェントである[cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)をサーバーと同じローカルエリアネットワークにインストールすることで行い、安全なCloudflare Tunnelを作成します。`**cloudflared tunnel create <TUNNEL-NAME>**`を実行するか、Zero Trustダッシュボードを使用して、cloudflaredから直接新しいトンネルを作成できます。

**ステップ2：ホスト名をトンネルにルーティング**

ここで新しい機能が活用されます。Zero Trustダッシュボードで、*ホスト名*`canada-payroll-server.acme.local`をそのトンネルに直接結びつけるルートを確立します。以前は、IPアドレス（`10.4.4.4`）またはそのサブネット（`10.4.4.0/24`）のみをルーティングできました。その古い方法では、前述した脆弱なIPリストを作成・管理する必要がありました。現在では、`acme.local`へのホスト名ルートを作成するだけで、`*.acme.local`のようなドメイン全体をトンネルに直接ルーティングすることさえ可能です。

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/3mcoBAILYENIP6kGW4tw96/bb7ec6571ae7b4f04b5dc0456f694d59/1.png)

これを機能させるには、プライベートネットワークのサブネット（この場合は`10.0.0.0/8`）と`100.64.0.0/10`を[Split Tunnels Exclude](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/configure-warp/route-traffic/split-tunnels/)リストから削除する必要があります。また、[Local Domain Fallback](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/configure-warp/route-traffic/local-domains/)から`.local`を削除する必要もあります。

（余談として、この機能はドメインでも動作することに注意してください。例えば、必要に応じて`*.acme.local`を単一のトンネルにバインドできます。）

**ステップ3：ゼロトラストポリシーを作成**

Cloudflareがサーバーに名前でアクセスする*方法*を知ったので、*誰*がアクセスできるかを制御するポリシーを記述できます。いくつかのオプションがあります：

- **Cloudflare Access（HTTPSアプリケーション用）:** 「finance」グループの従業員にプライベートホスト名`canada-payroll-server.acme.local`へのアクセスを許可する[Accessポリシー](https://developers.cloudflare.com/cloudflare-one/applications/non-http/self-hosted-private-app/)を作成します。これはポート443でHTTPS経由でアクセス可能なアプリケーションに最適です。
	![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/7lIZI9ThsAWtxFZZis3HtZ/08451586dbe373ff137bd9e91d23dea6/2.png)
- **Cloudflare Gateway（HTTPSアプリケーション用）:** または、「finance」グループの従業員に[SNI](https://developers.cloudflare.com/cloudflare-one/policies/gateway/network-policies/#sni) `canada-payroll-server.acme.local`へのアクセスを許可する[Gatewayポリシー](https://developers.cloudflare.com/cloudflare-one/policies/gateway/)を作成します。これは任意のポートでHTTPS経由でアクセス可能なサービスで[動作](https://developers.cloudflare.com/cloudflare-one/policies/gateway/network-policies/protocol-detection/)します。
	![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/5GpwDZNmdzapOyjOgFFlKD/50e2d0df64d2230479ad8d0a013de24b/3.png)
- **Cloudflare Gateway（非HTTPアプリケーション用）:** 「finance」グループを除く全従業員に対して`canada-payroll-server.acme.local`のDNS解決をブロックする[Gatewayポリシー](https://developers.cloudflare.com/cloudflare-one/policies/gateway/)を作成することもできます。
![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/3na5Mf6UMpBcKYm6JWmnzd/5791054c944300e667c3829e9bd8c6ec/4.png)

「何も信頼しない」原則は、セキュリティ態勢がデフォルトでトラフィックを拒否することから始まるべきであることを意味します。真のゼロトラストモデルでこのセットアップを機能させるには、内部IP範囲へのすべてのアクセスをブロックするデフォルトのGatewayポリシーと組み合わせる必要があります。これは、プライベートネットワークへのすべてのドアがデフォルトでロックされていることを確保するものと考えてください。ホスト名用に作成する特定の`allow`ポリシーは、承認されたユーザーのみに対して特定のドアを開錠するキーカードとして機能します。

その基本的な「deny」ポリシーがなければ、プライベートリソースへのルートを作成すると、組織内の全員がアクセス可能になり、最小権限モデルの目的を無効にし、重大なセキュリティリスクを生み出します。このステップにより、明示的に許可したトラフィックのみが企業リソースに到達できることが保証されます。

以上です。サーバーのプライベートホスト名のみを使用してリソース単位ポリシーを記述する全プロセスを説明しました。IPリストはどこにも見当たらず、管理者の負担を軽減します。

## サードパーティアプリケーションへのエグレストラフィックの保護

ホスト名ルーティングのもう一つの強力な用途：ユーザーからパブリックインターネットへの外向きの接続を制御することです。銀行ポータルやパートナーAPIなどの一部のサードパーティサービスは、セキュリティのためにIP許可リストを使用します。これらのサービスは、自社所有の特定の専用パブリック送信元IPアドレスから発信される接続のみを受け入れます。

この一般的な慣行は課題を生み出します。例えば、`bank.example.com`の銀行ポータルが、自社所有の専用送信元IP `203.0.113.9`からのすべてのトラフィックを要求するとしましょう。同時に、財務チーム*のみ*がそのポータルにアクセスできるゼロトラストポリシーを適用したいとします。銀行の宛先IPに基づいてポリシーを構築することはできません—それは自分では制御できず、いつでも変更される可能性があります。ホスト名を使用する必要があります。

この問題を解決する方法は2つあります。まず、専用送信元IPをCloudflareから購入している場合、以前に発表した[「ホスト名によるエグレスポリシー」機能](https://blog.cloudflare.com/egress-policies-by-hostname/)を使用できます。対照的に、専用送信元IPが組織に属している、またはクラウドプロバイダーからリースしている場合、以下の図に示すように、ホスト名ベースのルーティングでこの問題を解決できます：

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/6wXu6FMiiVz4lXsESFrBTg/e1bb13e8eef0653ab311d0800d95f391/5.png)

動作原理は以下の通りです：

1. **専用IPを通してトラフィックを強制する。** まず、専用IPを所有するネットワーク（例：クラウドプロバイダーのプライマリVPC）に[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)をデプロイします。このトンネルを通して送信するすべてのトラフィックは、`203.0.113.9`を送信元IPとしてインターネットに出力されます。
2. **銀行アプリをそのトンネルにルーティングする。** 次に、Zero Trustダッシュボードでホスト名ルートを作成します。このルールはCloudflareに「`bank.example.com`宛のトラフィックはすべてこの特定のトンネルを通して送信する必要がある」と指示します。
3. **ユーザーポリシーを適用する。** 最後に、Cloudflare Gatewayで細かいアクセスルールを作成します。低優先度の[ネットワークポリシー](https://developers.cloudflare.com/cloudflare-one/policies/gateway/network-policies/)で全員の[SNI](https://developers.cloudflare.com/cloudflare-one/policies/gateway/network-policies/#sni) `bank.example.com`へのアクセスをブロックします。そして、2番目の高優先度ポリシーで「finance」グループのユーザーに明示的に[SNI](https://developers.cloudflare.com/cloudflare-one/policies/gateway/network-policies/#sni) `bank.example.com`へのアクセスを許可します。

これで、財務チームメンバーがポータルにアクセスする際、そのトラフィックは正しくトンネル経由でルーティングされ、銀行が期待する送信元IPで到着します。他の部署の従業員は、トラフィックがトンネルに入る前にGatewayによってブロックされます。パブリックホスト名を使用するだけで、サードパーティサービスに対する精密なユーザーベースのゼロトラストポリシーを適用できました。

## 内部構造：ホスト名ルーティングの動作原理

この機能を構築するために、クラシックなネットワーキングの課題を解決する必要がありました。Cloudflare Tunnelのルーティングメカニズムは、ネットワークスタックのレイヤー4（TCP/UDP）とレイヤー7（HTTP/S）の両方で動作するCloudflare Gatewayの中核部分です。

Cloudflare Gatewayは、接続の最初のIPパケットを受信した時点で、どのCloudflare Tunnelにトラフィックを送信するかを決定する必要があります。これは、レイヤー4で決定を行う必要があることを意味し、ここではGatewayはパケットのIPとTCP/UDPヘッダーのみを参照できます。IPとTCP/UDPヘッダーには宛先IPアドレスが含まれていますが、宛先*ホスト名*は含まれていません。ホスト名は、レイヤー4接続が確立された後まで利用できないレイヤー7データ（TLS SNIフィールドやHTTP Hostヘッダーなど）にのみ含まれています。

これはジレンマを生み出します：ホスト名を見る前に、どうやってホスト名に基づいてトラフィックをルーティングできるのでしょうか？

### 救世主としてのSynthetic IP

解決策は、Cloudflare GatewayがDNSリゾルバーとしても機能するという事実にあります。これは、実際のアプリケーショントラフィックを見る*前*に、ユーザーの*意図*（ホスト名に対するDNSクエリ）を確認できることを意味します。この先見の明を利用して、[synthetic IPアドレス](https://blog.cloudflare.com/egress-policies-by-hostname/)を使用してトラフィックに「タグ付け」を行います。

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/7Kd3x5SppGp8G4KZeO34n/67b338ca8e81db63e110dc89c7596bf6/6.png)

フローを説明しましょう：

1. **DNSクエリ**。ユーザーのデバイスが`canada-payroll-server.acme.local`のDNSクエリをGatewayリゾルバーに送信します。
2. **プライベート解決**。Gatewayは、プライベートネットワークで実行されている`cloudflared`エージェントに、そのホスト名の実際のIPを解決するよう要求します。`cloudflared`は内部DNSにアクセスできるため、実際のプライベートIP `10.4.4.4`を見つけ、Gatewayリゾルバーに送り返します。
3. **Synthetic応答**。ここが重要なステップです。Gatewayリゾルバーは実際のIP（`10.4.4.4`）をユーザーに送り返し**ません**。代わりに、予約されたCarrier-Grade NAT（CGNAT）アドレス空間（例：`100.80.10.10`）から*初期解決IP*を一時的に割り当て、その初期解決IPをユーザーのデバイスに送り返します。初期解決IPは、Gatewayが`canada-payroll-server.acme.local`宛のネットワークトラフィックを識別できるタグとして機能します。初期解決IPは、次の2つのIPアドレス範囲の1つからランダムに選択され、一時的に割り当てられます：
	- IPv4: `100.80.0.0/16`
	- IPv6: `2606:4700:0cf1:4000::/64`
4. **トラフィックの到着**。ユーザーのデバイスは、Gatewayリゾルバーから受信した宛先IP（初期解決IP `100.80.10.10`）に対してアプリケーショントラフィック（例：HTTPS要求）を送信します。
5. **ルーティングと書き換え**。Gatewayが`100.80.10.10`宛の入力パケットを確認すると、このトラフィックが`canada-payroll-server.acme.local`用であり、特定のCloudflare Tunnelを通して送信する必要があることを認識します。その後、パケットの宛先IPを*実際の*プライベート宛先IP（`10.4.4.4`）に書き戻し、正しいトンネルに送信します。

トラフィックはトンネルを通って`canada-payroll-server.acme.local`のIP（`10.4.4.4`）に到着し、ユーザーはこれらのメカニズムに気づくことなくサーバーに接続されます。DNSクエリを傍受することで、ネットワークトラフィックストリームに効果的にタグ付けを行い、レイヤー7データを見る必要なく、レイヤー4ルーターが正しい決定を下せるようにします。

## 細かい制御のためのGateway Resolver Policies の使用

これまで説明したルーティング機能は、プライベートリソースに接続するシンプルで強力な方法を提供します。しかし、ネットワークアーキテクチャがより複雑な場合はどうでしょうか？例えば、プライベートDNSサーバーがネットワークの一部にあるが、アプリケーション自体は別の場所にある場合はどうでしょうか？

Cloudflare Oneでは、[Gateway Resolver Policies](https://developers.cloudflare.com/cloudflare-one/policies/gateway/resolver-policies)を使用して、同じホスト名に対してDNS解決のパスとアプリケーショントラフィックのパスを分離するポリシーを作成することで、この問題を解決できます。これにより、複雑なネットワークトポロジーに対応する細かい制御が可能になります。

シナリオを説明しましょう：

- `**acme.local**`を解決できるプライベートDNSリゾルバーは、コアデータセンターに配置されており、`**tunnel-1**`経由でのみアクセス可能です。
- `**canada-payroll-server.acme.local**`のWebサーバーは特定のクラウドVPCでホストされており、`**tunnel-2**`経由でのみアクセス可能です。
![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/2sVMsS4DhuN2yoTlGWTK5X/e5a66330c951e7b65428f5c76b5c7b0a/7.png)

この分割パスルーティングの設定方法は以下の通りです。

**ステップ1：`**tunnel-1**`経由でDNSクエリをルーティング**

まず、Cloudflare GatewayにプライベートDNSサーバーへの到達方法を伝える必要があります

1. **IPルートを作成：** Zero TrustダッシュボードのNetworks > Tunnelsエリアで、プライベートDNSサーバーのIPアドレス（例：`**10.131.0.5/32**`）用のルートを作成し、`**tunnel-1**`を指定します。これにより、その特定のIP宛のトラフィックがデータセンターへの正しいトンネルを通ることが保証されます。
	![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/32JcjFZXGuhDEHHlWJoF1C/4223a6f2e5b7b49015abfbfd9b4fd20f/8.png)
2. **Resolver Policyを作成：** **Gateway -> Resolver Policies**に移動し、以下のロジックで新しいポリシーを作成します：
	- **If** クエリが`**acme.local**`ドメイン用である場合…
	- **Then**... IP `**10.131.0.5**`の指定されたDNSサーバーを使用して解決します。
		![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/2j8kYsD692tCRYcDKoDXvb/7dbb20f426ba47350fb0b2906046d5f0/9.png)

これら2つのルールにより、ユーザーのデバイスからの`**acme.local**`に対するすべてのDNSルックアップは、解決のために`tunnel-1`を通してプライベートDNSサーバーに送信されます。

**ステップ2：`**tunnel-2**`経由でアプリケーショントラフィックをルーティング**

次に、アプリケーション用の実際のトラフィック（例：HTTP/S）をどこに送信するかをGatewayに指示します。

**ホスト名ルートを作成：** Zero Trustダッシュボードで、`**canada-payroll-server.acme.local**`を`**tunnel-2**`にバインドする**ホスト名ルート**を作成します。

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/3Ufzpsb1FUYrM39gMiyovs/c5d10828f58b0e7c854ff9fa721e1757/10.png)

このルールは、`**canada-payroll-server.acme.local**`に対するすべてのアプリケーショントラフィック（HTTP、SSH、または任意のTCP/UDPトラフィック）を、クラウドVPCに向かう`**tunnel-2**`を通して送信する必要があることをGatewayに指示します。

Gateway Resolver Policyなしのセットアップと同様に、これを機能させるには、プライベートネットワークのサブネット（この場合は`10.0.0.0/8`）と`100.64.0.0/10`を[Split Tunnels Exclude](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/configure-warp/route-traffic/split-tunnels/)リストから削除する必要があります。また、[Local Domain Fallback](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/configure-warp/route-traffic/local-domains/)から`.local`を削除する必要もあります。

**すべてをまとめる**

これら2つのポリシーセットにより、「synthetic IP」メカニズムが複雑なフローを処理します：

1. ユーザーが`canada-payroll-server.acme.local`にアクセスしようとします。デバイスはCloudflare Gateway ResolverにDNSクエリを送信します。
2. このDNSクエリはGateway Resolver Policyにマッチし、Gateway Resolverが`tunnel-1`を通してプライベートDNSサーバー（`10.131.0.5`）にDNSクエリを転送します。
3. DNSサーバーはサーバーの実際のプライベート宛先IP（`10.4.4.4`）で応答します。
4. GatewayはこのIPを受信し、「synthetic」初期解決IP（`100.80.10.10`）を生成してユーザーのデバイスに送り返します。
5. ユーザーのデバイスは初期解決IP（`100.80.10.10`）にHTTP/S要求を送信します。
6. Gatewayは初期解決IP（`100.80.10.10`）宛のネットワークトラフィックを確認し、マッピングを使用して、これが`canada-payroll-server.acme.local`用であることを認識します。
7. ホスト名ルートがマッチします。Gatewayはアプリケーショントラフィックをtunnel-2を通して送信し、宛先IPをWebサーバーの実際のプライベートIP（`10.4.4.4`）に書き換えます。
8. tunnel-2の末端にある`cloudflared`エージェントが、同じローカルネットワーク上にあるアプリケーションの宛先IP（`10.4.4.4`）にトラフィックを転送します。

ユーザーは、DNSとアプリケーショントラフィックが完全に別々のプライベートネットワークパスを通してルーティングされていることに気づくことなく接続されます。このアプローチにより、シンプルで宣言的なポリシーで、高度なスプリットホライズンDNS環境やその他の高度なネットワークアーキテクチャをサポートできます。

## サポートされるオンランプは何ですか？

ホスト名ルーティング機能は、前述の「synthetic IP」（*初期解決IP*とも呼ばれる）メカニズムに基づいて構築されており、DNS解決とその後のアプリケーショントラフィックの両方を適切に処理するために特定のCloudflare One製品が必要です。ユーザーの接続（オンランプ）とプライベートアプリケーション（オフランプ）について、現在サポートされている内容の詳細を以下に示します。

#### ユーザーの接続（オンランプ）

エンドユーザーがプライベートホスト名に接続するために、この機能は現在[**WARPクライアント**](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/)、エージェントレスの[**PACファイル**](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/agentless/pac-files/)、および[**ブラウザ分離**](https://developers.cloudflare.com/cloudflare-one/policies/browser-isolation/)で動作します。

[**Magic WAN**](https://developers.cloudflare.com/magic-wan/)（アクティブ・パッシブモード）や[**WARPコネクタ**](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/private-net/warp-connector/)の背後にユーザーがいる場合でも接続は可能ですが、追加の設定が必要です。トラフィックが正しくルーティングされることを確保するために、以下の宛先へのトラフィックをGateway経由で送信するように、デバイスまたはルーターのルーティングテーブルを更新する必要があります：

- 初期解決IP範囲：`100.80.0.0/16`（IPv4）および`2606:4700:0cf1:4000::/64`（IPv6）
- アプリケーションが配置されているプライベートネットワークCIDR（例：`10.0.0.0/8`）
- 内部DNSリゾルバーのIPアドレス
- Gateway DNSリゾルバーIP：`172.64.36.1`および`172.64.36.2`

Magic WANの顧客は、DNSリゾルバーをこれらのGatewayリゾルバーIPに向け、Magic WANトンネルをアクティブ・パッシブモードで実行していることを確認する必要もあります：ホスト名ルーティングを機能させるには、DNSクエリとその結果のネットワークトラフィックが同じMagic WANトンネル経由でCloudflareに到達する必要があります。現在、エンドユーザーが複数のMagic WANトンネルで同時にトラフィックを送信しているサイトにいる場合、ホスト名ルーティングは機能しません。

#### プライベートネットワークの接続（オフランプ）

接続の反対側では、ホスト名ベースのルーティングは[**Cloudflare Tunnel**](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)（`cloudflared`）経由で接続されたアプリケーション専用に設計されています。これは現在、ホスト名によるルーティングでサポートされている唯一のオフランプです。

他のトラフィックオフランプは、IPベースのルーティングでは完全にサポートされていますが、この特定のホスト名ベースの機能とはまだ互換性がありません。これには、プライベートネットワークへのオフランプとしてMagic WAN、WARPコネクタ、またはWARP-to-WARP接続を使用することが含まれます。今後、より多くのオンランプとオフランプのサポートを拡張するために積極的に取り組んでいますので、更新情報にご注目ください。

## 結論

Cloudflare Tunnel内でホスト名によるルーティングを直接可能にすることで、セキュリティポリシーをよりシンプルで、より回復力があり、現代のアプリケーションの構築方法により適合したものにしています。絶えず変化するIPアドレスを追跡する必要はもうありません。今では、重要であるべき唯一のもの、つまり接続したいサービスの名前に基づいて、HTTPSアプリケーション用の精密なリソース単位認証ポリシーを構築できます。これは、ゼロトラストアーキテクチャを誰にとっても直感的で実現可能なものにするための基本的なステップです。

この強力な機能は、Cloudflare Tunnelに直接組み込まれ、すべてのCloudflare Oneカスタマーに無料で提供されており、今日利用可能です。

IPリストを完全に過去のものにする準備はできましたか？最初のホスト名ルートを設定するために、[開発者向けドキュメント](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/private-net/cloudflared/connect-private-hostname/)を探索することから始めましょう。[Cloudflare One](https://developers.cloudflare.com/cloudflare-one/)が初めての場合は、今日サインアップして数分でアプリケーションとネットワークのセキュリティ確保を開始できます。

Cloudflareの接続クラウドは、[企業ネットワーク全体](https://www.cloudflare.com/network-services/)を保護し、顧客が[インターネット規模のアプリケーションを効率的に構築](https://workers.cloudflare.com/)することを支援し、あらゆる[Webサイトやインターネットアプリケーション](https://www.cloudflare.com/performance/accelerate-internet-applications/)を高速化し、[DDoS攻撃を防ぎ](https://www.cloudflare.com/ddos/)、[ハッカーを寄せ付けず](https://www.cloudflare.com/application-security/)、[ゼロトラストへの旅路](https://www.cloudflare.com/products/zero-trust/)をサポートします。

どのデバイスからでも[1.1.1.1](https://one.one.one.one/)にアクセスして、インターネットをより高速で安全にする無料のアプリを始めましょう。

より良いインターネットの構築を支援する私たちの使命について詳しく学ぶには、[こちらから始めましょう](https://www.cloudflare.com/learning/what-is-cloudflare/)。新しいキャリアの方向性をお探しの場合は、[私たちの求人情報](http://www.cloudflare.com/careers)をご確認ください。