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

Here’s how this works:

1. **Force traffic through your dedicated IP.** First, you deploy a [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) in the network that owns your dedicated IP (for example, your primary VPC in a cloud provider). All traffic you send through this tunnel will exit to the Internet with `203.0.113.9` as its source IP.
2. **Route the banking app to that tunnel.** Next, you create a hostname route in your Zero Trust dashboard. This rule tells Cloudflare: "Any traffic destined for `bank.example.com` must be sent through this specific tunnel."
3. **Apply your user policies.** Finally, in Cloudflare Gateway, you create your granular access rules. A low-priority [network policy](https://developers.cloudflare.com/cloudflare-one/policies/gateway/network-policies/) blocks access to the [SNI](https://developers.cloudflare.com/cloudflare-one/policies/gateway/network-policies/#sni) `bank.example.com` for everyone. Then, a second, higher-priority policy explicitly allows users in the "finance" group to access the [SNI](https://developers.cloudflare.com/cloudflare-one/policies/gateway/network-policies/#sni) `bank.example.com`.

Now, when a finance team member accesses the portal, their traffic is correctly routed through the tunnel and arrives with the source IP the bank expects. An employee from any other department is blocked by Gateway before their traffic even enters the tunnel. You've enforced a precise, user-based zero trust policy for a third-party service, all by using its public hostname.

## Under the hood: how hostname routing works

To build this feature, we needed to solve a classic networking challenge. The routing mechanism for Cloudflare Tunnel is a core part of Cloudflare Gateway, which operates at both Layer 4 (TCP/UDP) and Layer 7 (HTTP/S) of the network stack.

Cloudflare Gateway must make a decision about which Cloudflare Tunnel to send traffic upon receipt of the very first IP packet in the connection. This means the decision must necessarily be made at Layer 4, where Gateway only sees the IP and TCP/UDP headers of a packet. IP and TCP/UDP headers contain the destination IP address, but do not contain destination *hostname*. The hostname is only found in Layer 7 data (like a TLS SNI field or an HTTP Host header), which isn't even available until after the Layer 4 connection is already established.

This creates a dilemma: how can we route traffic based on a hostname before we've even seen the hostname?

### Synthetic IPs to the rescue

The solution lies in the fact that Cloudflare Gateway also acts as a DNS resolver. This means we see the user's *intent* — the DNS query for a hostname — *before* we see the actual application traffic. We use this foresight to "tag" the traffic using a [synthetic IP address](https://blog.cloudflare.com/egress-policies-by-hostname/).

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/7Kd3x5SppGp8G4KZeO34n/67b338ca8e81db63e110dc89c7596bf6/6.png)

Let’s walk through the flow:

1. **DNS Query**. A user's device sends a DNS query for `canada-payroll-server.acme.local ` to the Gateway resolver.
2. **Private Resolution**. Gateway asks the `cloudflared ` agent running in your private network to resolve the real IP for that hostname. Since `cloudflared` has access to your internal DNS, it finds the real private IP `10.4.4.4`, and sends it back to the Gateway resolver.
3. **Synthetic Response**. Here's the key step. Gateway resolver **does not** send the real IP (`10.4.4.4`) back to the user. Instead, it temporarily assigns an *initial resolved IP* from a reserved Carrier-Grade NAT (CGNAT) address space (e.g., `100.80.10.10`) and sends the initial resolved IP back to the user's device. The initial resolved IP acts as a tag that allows Gateway to identify network traffic destined to `canada-payroll-server.acme.local`. The initial resolved IP is randomly selected and temporarily assigned from one of the two IP address ranges:
	- IPv4: `100.80.0.0/16`
	- IPv6: `2606:4700:0cf1:4000::/64`
4. **Traffic Arrives**. The user's device sends its application traffic (e.g., an HTTPS request) to the destination IP it received from Gateway resolver: the initial resolved IP `100.80.10.10`.
5. **Routing and Rewriting**. When Gateway sees an incoming packet destined for `100.80.10.10`, it knows this traffic is for `canada-payroll-server.acme.local` and must be sent through a specific Cloudflare Tunnel. It then rewrites the destination IP on the packet back to the *real* private destination IP (`10.4.4.4`) and sends it down the correct tunnel.

The traffic goes down the tunnel and arrives at `canada-payroll-server.acme.local` at IP (`10.4.4.4)` and the user is connected to the server without noticing any of these mechanisms. By intercepting the DNS query, we effectively tag the network traffic stream, allowing our Layer 4 router to make the right decision without needing to see Layer 7 data.

## Using Gateway Resolver Policies for fine grained control

The routing capabilities we've discussed provide simple, powerful ways to connect to private resources. But what happens when your network architecture is more complex? For example, what if your private DNS servers are in one part of your network, but the application itself is in another?

With Cloudflare One, you can solve this by creating policies that separate the path for DNS resolution from the path for application traffic for the very same hostname using [Gateway Resolver Policies](https://developers.cloudflare.com/cloudflare-one/policies/gateway/resolver-policies). This gives you fine-grained control to match complex network topologies.

Let's walk through a scenario:

- Your private DNS resolvers, which can resolve `**acme.local**`, are located in your core datacenter, accessible only via `**tunnel-1**`.
- The webserver for `**canada-payroll-server.acme.local**` is hosted in a specific cloud VPC, accessible only via `**tunnel-2**`.
![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/2sVMsS4DhuN2yoTlGWTK5X/e5a66330c951e7b65428f5c76b5c7b0a/7.png)

Here’s how to configure this split-path routing.

**Step 1: Route DNS Queries via** `**tunnel-1**`

First, we need to tell Cloudflare Gateway how to reach your private DNS server

1. **Create an IP Route:** In the Networks > Tunnels area of your Zero Trust dashboard, create a route for the IP address of your private DNS server (e.g., `**10.131.0.5/32**`) and point it to `**tunnel-1**``.` This ensures any traffic destined for that specific IP goes through the correct tunnel to your datacenter.
	![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/32JcjFZXGuhDEHHlWJoF1C/4223a6f2e5b7b49015abfbfd9b4fd20f/8.png)
2. **Create a Resolver Policy:** Go to **Gateway -> Resolver Policies** and create a new policy with the following logic:
	- **If** the query is for the domain `**acme.local**` …
	- **Then**... resolve it using a designated DNS server with the IP `**10.131.0.5**`.
		![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/2j8kYsD692tCRYcDKoDXvb/7dbb20f426ba47350fb0b2906046d5f0/9.png)

With these two rules, any DNS lookup for `**acme.local**` from a user's device will be sent through `tunnel-1` to your private DNS server for resolution.

**Step 2: Route Application Traffic via** `**tunnel-2**`

Next, we'll tell Gateway where to send the actual traffic (for example, HTTP/S) for the application.

**Create a Hostname Route:** In your Zero Trust dashboard, create a **hostname route** that binds `**canada-payroll-server.acme.local **` to `**tunnel-2**`.

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/3Ufzpsb1FUYrM39gMiyovs/c5d10828f58b0e7c854ff9fa721e1757/10.png)

This rule instructs Gateway that any application traffic (like HTTP, SSH, or any TCP/UDP traffic) for `**canada-payroll-server.acme.local**` must be sent through `**tunnel-2**` leading to your cloud VPC.

Similarly to a setup without Gateway Resolver Policy, for this to work, you must delete your private network’s subnet (in this case `10.0.0.0/8`) and `100.64.0.0/10` from the [Split Tunnels Exclude](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/configure-warp/route-traffic/split-tunnels/) list. You also need to remove `.local` from the [Local Domain Fallback](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/configure-warp/route-traffic/local-domains/).

**Putting It All Together**

With these two sets of policies, the "synthetic IP" mechanism handles the complex flow:

1. A user tries to access `canada-payroll-server.acme.local`. Their device sends a DNS query to Cloudflare Gateway Resolver.
2. This DNS query matches a Gateway Resolver Policy, causing Gateway Resolver to forward the DNS query through `tunnel-1` to your private DNS server (`10.131.0.5`).
3. Your DNS server responds with the server’s actual private destination IP (`10.4.4.4`).
4. Gateway receives this IP and generates a “synthetic” initial resolved IP (`100.80.10.10`) which it sends back to the user's device.
5. The user's device now sends the HTTP/S request to the initial resolved IP (`100.80.10.10`).
6. Gateway sees the network traffic destined for the initial resolved IP (`100.80.10.10`) and, using the mapping, knows it's for `canada-payroll-server.acme.local`.
7. The Hostname Route now matches. Gateway sends the application traffic through tunnel-2 and rewrites its destination IP to the webserver’s actual private IP (`10.4.4.4`).
8. The `cloudflared` agent at the end of tunnel-2 forwards the traffic to the application's destination IP (`10.4.4.4`), which is on the same local network.

The user is connected, without noticing that DNS and application traffic have been routed over totally separate private network paths. This approach allows you to support sophisticated split-horizon DNS environments and other advanced network architectures with simple, declarative policies.

## What onramps does this support?

Our hostname routing capability is built on the "synthetic IP" (also known as *initially resolved IP*) mechanism detailed earlier, which requires specific Cloudflare One products to correctly handle both the DNS resolution and the subsequent application traffic. Here’s a breakdown of what’s currently supported for connecting your users (on-ramps) and your private applications (off-ramps).

#### Connecting Your Users (On-Ramps)

For end-users to connect to private hostnames, the feature currently works with [**WARP Client**](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/), agentless [**PAC files**](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/agentless/pac-files/) and [**Browser Isolation**](https://developers.cloudflare.com/cloudflare-one/policies/browser-isolation/).

Connectivity is also possible when users are behind [**Magic WAN**](https://developers.cloudflare.com/magic-wan/) (in active-passive mode) or [**WARP Connector**](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/private-net/warp-connector/), but it requires some additional configuration. To ensure traffic is routed correctly, you must update the routing table on your device or router to send traffic for the following destinations through Gateway:

- The initially resolved IP ranges: `100.80.0.0/16` (IPv4) and `2606:4700:0cf1:4000::/64` (IPv6).
- The private network CIDR where your application is located (e.g., `10.0.0.0/8)`.
- The IP address of your internal DNS resolver.
- The Gateway DNS resolver IPs: `172.64.36.1` and `172.64.36.2`.

Magic WAN customers will also need to point their DNS resolver to these Gateway resolver IPs and ensure they are running Magic WAN tunnels in active-passive mode: for hostname routing to work, DNS queries and the resulting network traffic must reach Cloudflare over the same Magic WAN tunnel. Currently, hostname routing will not work if your end users are at a site that has more than one Magic WAN tunnel actively transiting traffic at the same time.

#### Connecting Your Private Network (Off-Ramps)

On the other side of the connection, hostname-based routing is designed specifically for applications connected via [**Cloudflare Tunnel**](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) (`cloudflared`). This is currently the only supported off-ramp for routing by hostname.

Other traffic off-ramps, while fully supported for IP-based routing, are not yet compatible with this specific hostname-based feature. This includes using Magic WAN, WARP Connector, or WARP-to-WARP connections as the off-ramp to your private network. We are actively working to expand support for more on-ramps and off-ramps in the future, so stay tuned for more updates.

## Conclusion

By enabling routing by hostname directly within Cloudflare Tunnel, we’re making security policies simpler, more resilient, and more aligned with how modern applications are built. You no longer need to track ever-changing IP addresses. You can now build precise, per-resource authorization policies for HTTPS applications based on the one thing that should matter: the name of the service you want to connect to. This is a fundamental step in making a zero trust architecture intuitive and achievable for everyone.

This powerful capability is available today, built directly into Cloudflare Tunnel and free for all Cloudflare One customers.

Ready to leave IP Lists behind for good? Get started by exploring our [developer documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/private-net/cloudflared/connect-private-hostname/) to configure your first hostname route. If you're new to [Cloudflare One](https://developers.cloudflare.com/cloudflare-one/), you can sign up today and begin securing your applications and networks in minutes.

Cloudflare's connectivity cloud protects [entire corporate networks](https://www.cloudflare.com/network-services/), helps customers build [Internet-scale applications efficiently](https://workers.cloudflare.com/), accelerates any [website or Internet application](https://www.cloudflare.com/performance/accelerate-internet-applications/), [wards off DDoS attacks](https://www.cloudflare.com/ddos/), keeps [hackers at bay](https://www.cloudflare.com/application-security/), and can help you on [your journey to Zero Trust](https://www.cloudflare.com/products/zero-trust/).  
  
Visit [1.1.1.1](https://one.one.one.one/) from any device to get started with our free app that makes your Internet faster and safer.  
  
To learn more about our mission to help build a better Internet, [start here](https://www.cloudflare.com/learning/what-is-cloudflare/). If you're looking for a new career direction, check out [our open positions](http://www.cloudflare.com/careers).