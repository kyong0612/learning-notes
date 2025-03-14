# state-of-cloud-security

ref: <https://www.datadoghq.com/state-of-cloud-security/>

## FACT1 Long-lived credentials continue to be a major risk

長寿命のクラウド・クレデンシャルは、有効期限がなく、ソースコード、コンテナ・イメージ、ビルド・ログ、アプリケーションの成果物から頻繁に漏れるため、大きなセキュリティ・リスクとなる。過去の調査によると、クラウド・セキュリティ侵害の最も一般的な原因となっています。本レポートでは、組織が人間とアプリケーションの認証にどのようにレガシー認証と最新認証の手法を使い分けているかを分析した。

人間については、ほとんどの組織が、AWS コンソールにアクセスするために、何らかの形式の連携認証（つまり、一元化された ID を使用して、ユーザーに複数のシステムへのアクセスを許可する）を活用していることがわかった（たとえば、AWS IAM Identity Center や Okta を使用）。しかし、ほぼ半数（46％）はIAMユーザー（長期保存クレデンシャルの一種）も使用しており、4人に1人はIAMユーザーのみを使用している。これは、組織が集中型ID管理を使用するようになってきているものの、長期保存クレデンシャルを使用する非管理ユーザーが依然として人気があることを示している。

![alt text](<assets/CleanShot 2024-10-29 at 17.17.51@2x.png>)

また、クラウドのクレデンシャルは、広く普及しているだけでなく、長期間使用されていないことも多い。 AWSでは、IAMユーザーの60％が1年以上前のアクセスキーを持っている。 これらのユーザーの半数以上が90日以上使用されていないクレデンシャルを持っており、簡単に削除できる危険なクレデンシャルを示唆している。 Google CloudサービスアカウントとMicrosoft Entra IDアプリケーションも同様のパターンで、それぞれ62パーセントと46パーセントが1年以上前のアクティブな長期間のクレデンシャルを持っている。

![alt text](<assets/CleanShot 2024-10-29 at 17.18.43@2x.png>)

このデータは、組織が特に規模が大きい場合に、長期間のクレデンシャルを安全に管理するのに苦労していることを示している。 これは、この種のクレデンシャルに固有のリスクを増大させるので、完全に避けるべきである。 代わりに、組織は期限付きの一時的なクレデンシャルを提供するメカニズムを活用すべきである。 ワークロードの場合、これはEC2インスタンスのIAMロールまたはAWSのEKS Pod Identity、AzureのManaged Identities、およびGoogle Cloudのワークロードにアタッチされたサービスアカウントで実現できる。 人間の場合、最も効果的なソリューションは、AWS IAM Identity Center、Okta、Microsoft Entra IDなどのソリューションを使用してID管理を一元化することである。

> 「アクセス・キーのような寿命の長いクレデンシャルは、脅威行為者によって日和見的に狙われ続けています。過去6ヶ月の間に、攻撃者がこれらのクレデンシャルをどのように活用するかに顕著な変化が見られました。コモディティ（商品）の脅威行為者は資金を追っており、今まさにLLMリソースの乗っ取りがチャンスなのです」。
> Ian Ahl
> SVP, p0 Labs, Permiso

## FACT2 Adoption of public access blocks in cloud storage services is rapidly increasing

現代のセキュリティ慣行は、正しいことをするのを容易にする「舗装された道路」と、失敗を防ぎ人為的ミスがデータ漏洩に発展しないようにする「ガードレール」を包含している。 パブリック・ストレージ・バケットは、歴史的に多くの有名なデータ漏洩の原因となってきた。 今日、バケットが誤って公開されることがないように、ガードレールのカテゴリに分類される最新のコントロールがあります。 まず、AWS S3バケットの1.48パーセントが、2023年の1.5パーセントの数字と同様に、実質的に公開されていることを確認しました。 一方、S3バケットの79%はアカウント全体またはバケット固有のS3パブリックアクセスブロックでカバーされており、1年前の73%から増加している。 この増加は、この問題に対する認識が広まったことと、AWSが2023年4月以降、新規に作成されたS3バケットのパブリックアクセスを積極的にブロックしていることが原因だと思われる。

![alt text](<assets/CleanShot 2024-10-29 at 17.22.40@2x.png>)

Azure側では、Azure blobストレージコンテナの2.6パーセントが事実上公開されており、1年前の5パーセントから減少している。 関連して、5つに2つ以上（42パーセント）のAzure blobストレージ・コンテナは、パブリック・アクセスをプロアクティブにブロックしているストレージ・アカウントにある。 これは、マイクロソフトが2023年11月以降に作成されたストレージアカウントのパブリックアクセスをプロアクティブにブロックし、デフォルトでセキュアにしているためと思われる。 クラウドプロバイダのセキュアバイデフォルトの仕組みが存在する場合、一連の脆弱性や設定ミスを修正するのに非常に強力であることがわかる。

S3バケットを誤って公開しないようにするには、アカウントレベルでS3パブリックアクセスブロックをオンにし、サービスコントロールポリシー（SCP）で設定を保護することをお勧めします。 Azureでは、ストレージアカウント構成でパブリックアクセスをブロックすることで、このストレージアカウント内のブロブストレージコンテナが不用意にパブリックにならないようにすることができる。 パブリック・ストレージ・バケットの正当なユースケースもあるが、静的なWebアセットなどの一般的な用途では、通常、Amazon CloudFrontなどのコンテンツ・デリバリー・ネットワーク（CDN）を使用すべきである。

## FACT3 Less than half of EC2 instances enforce IMDSv2, but adoption is growing fast

**IMDSv2は、EC2インスタンスにおけるクレデンシャルの盗難をブロックするためのAWSの重要なセキュリティメカニズムであり、多くの著名なデータ漏洩につながっている。** AzureとGoogle CloudはデフォルトでIMDSv2に類似したメカニズムを導入していますが、IMDSv2はこれまで、個々のEC2インスタンスに対して手動で導入する必要がありました。 IMDSv2の導入が拡大していることは喜ばしいことです。 平均して、組織はEC2インスタンスの47%にIMDSv2を適用しており、これは1年前の25%から増加しています。 全体では、全EC2インスタンスの32%にIMDSv2が適用されています。 しかし、最近作成されたインスタンスの方が、はるかにセキュアに構成されています： 本レポートのデータ収集期間前の2週間に起動されたEC2のうち、IMDSv2が適用されたインスタンスは42%であったのに対し、1年以上前に作成されたインスタンスはわずか10%であった。

![alt text](<assets/CleanShot 2024-10-29 at 17.26.01@2x.png>)

この増加は朗報であり、いくつかの要因によるものである。 第一に、今日、組織はこの問題をより広く認識している。 さらに、2022年後半にAWSはAMI単位でIMDSv2をデフォルトで強制するメカニズムをリリースし、人気のあるAmazon Linux 2023ディストリビューションでそれをオンにした。 さらに2024年3月、AWSはリージョン全体でIMDSv2を適用する新しい設定をリリースし、ユーザーは特定のリージョンで将来作成されるすべてのインスタンスに対してデフォルトでIMDSv2を適用できるようになりました。 とはいえ、IMDSv2の採用は組織間で非常に不平等であることも確認しました： 22%はどのEC2インスタンスにもIMDSv2を適用していないが、23%はすべてのインスタンスにIMDSv2を適用している。 全体として、80%以上のインスタンスにIMDSv2を適用している組織は3社に1社未満（33%）である。

![alt text](<assets/CleanShot 2024-10-29 at 17.26.51@2x.png>)

このデータは、IMDSv2の施行が急激に増加している一方で、ほとんどのインスタンスが依然として脆弱であることを示している。 しかし、EC2インスタンスでIMDSv2が実施されていない場合でも、そのインスタンス上の個々のアプリケーションやプロセスはIMDSv2を使用することができます。 CloudTrailのログを見ると、IMDSv2が適用されているEC2インスタンスは32%に過ぎませんが、70%は過去2週間にIMDSv2のみを使用していました。 これは、IMDSv2の適用と実際の使用との間に乖離があることを示しています。

新しいインスタンスにデフォルトでIMDSv2を強制するなどのリージョンレベルの制御は、セキュアな構成を自動的に実装するのに役立つが、特に再作成されない長寿命のEC2インスタンスには不十分である。 組織は、すべてのインスタンスにIMDSv2を適用し、AMIの「enforce IMDSv2」フラグなどのsecure-by-defaultメカニズムを使用し、リージョン内の将来のすべてのインスタンスにIMDSv2を適用すべきである。 また、安全でない IMDSv1 サービスを通じて取得されたクレデンシャルの使用状況を監視するために、細心の注意を払うことが推奨されます。 IMDSv2への移行に関するAWSのガイドとSlackの旅も参照してください。

> 「IMDSv2の実施における改善を見ていると、AWSがAMIとコンピュートサービスにおいてよりセキュアなデフォルトを実装していることが、引き続き最もインパクトのある変化であることがわかります。 また、多くの企業が、自社環境のインターネットエッジで IMDSv2 の利用を強制することの重要性を認識しています。 しかし、IMDSv2の施行は間もなく一段落すると思われます。 2024年以降、企業はますますデータ境界ガードレールを採用するようになり、IMDSv2が施行されない場合のクレデンシャル盗難の影響を緩和することができます。
> Houston Hopkins
> Cloud security veteran and fwd:cloudsec organizer

## FACT4 Securing managed Kubernetes clusters requires non-default, cloud-specific tuning

EKSやGKEのようなマネージドKubernetesサービスは、クラウド環境で高い人気を誇っており、チームはetcdのような複雑なKubernetesコントロールプレーンコンポーネントを管理する代わりに、アプリケーションワークロードの実行に集中することができる。 これらのサービスは人気があるが、デフォルトの構成ではセキュリティが欠けていることが多い。 これらのクラスタは本質的にクラウド環境で稼働しているため、これは問題となる可能性がある。マネージド・クラスタを侵害すると、攻撃者は基盤となるクラウド・インフラストラクチャに軸足を移す多くの可能性を開くことになる。 まず、マネージドKubernetesクラスタの多くがマネージドAPIサーバをインターネットに公開していることが確認されている。 これはAmazon EKSクラスタのほぼ半分、Azure AKSクラスタの41パーセント、Google Cloud GKEクラスタの3つに2つを占める。

![alt text](<assets/CleanShot 2024-10-29 at 17.29.49@2x.png>)

さらに、4つに1つ以上のEKSクラスタが監査ログを有効にしていない。 このため、新しいポッドの作成やシークレットへのアクセスなど、クラスタ内部で実行されたアクティビティを把握することができない。 このような監査ログがデフォルトでは有効になっておらず、明示的にオンにする必要があることが、導入率の低さにつながっていると考えられます。 最後に、さらに重要なことですが、EKSワーカーノードにアタッチされているIAMロールを分析した結果、クラスタの10パーセントが、完全な管理者アクセス、特権の昇格、過度に寛容なデータアクセス（すべてのS3バケットなど）、またはアカウント内のすべてのワークロードにわたる横方向の移動を許可する危険なノードロールを使用していることがわかりました。 Google Cloudでは、GKEクラスタの15パーセントが特権を持つサービスアカウントを持っています。このうち6パーセントは、クラウドプラットフォームのスコープが制限されていないデフォルトのコンピュートサービスアカウントを使っており、9パーセントは顧客が管理するサービスアカウントを使っています。

![alt text](<assets/CleanShot 2024-10-29 at 17.30.50@2x.png>)

どちらの場合も、これは問題です。デフォルトでは、1つの侵害されたポッドがインスタンスメタデータサービスからワーカーノードの認証情報を盗み出し、AWSまたはGoogle Cloud APIに対してなりすます可能性があります。 組織はKubernetesクラスタをインターネットに公開すべきではありません。 その代わりに、プライベートネットワーク上に配置するか、GKEと完全な互換性を持つGoogle CloudのIAP（Identity-Aware Proxy）のような最新のゼロトラストメカニズムを使用する。 Kubernetesの監査ログ（少なくともAPIサーバー用）を有効にすることも、クラスタのセキュリティには不可欠だ。 最後に、多くの場合数十のアプリケーションを実行するワーカーノードにクラウドの権限を割り当てる際には特に注意を払い、個々のアプリケーションがワーカーノードからクラウドの認証情報にアクセスできないようにする。 マネージドKubernetesディストリビューションは複雑さを軽減する素晴らしい方法だが、デフォルトでセキュリティの仕組みがオンになっていなかったり、強制されていなかったりするクラウドリソースでは、最適なセキュリティが得られないことが多いことを示す良い例でもある。

> 「クラウドプロバイダーがKubernetesのコントロールプレーンを管理できるようにすることで、攻撃対象が減少するためだ。 しかし、クラスターのエンドポイントへのアクセス制限や監査ログの設定など、主要なコントロールによってクラスターを保護する必要があります。 マネージドサービスはKubernetesの採用を容易にするが、同時にこれらの環境のセキュリティ確保の複雑さを隠してしまう。 こうした本質的なセキュリティ管理の採用率が低いことから、Kubernetesクラスタにおけるより深いリスクが懸念されている。 TeamTNTやSCARLETEELのような脅威アクターによるクラスタからクラウドへの攻撃の増加は、クラスタセキュリティの強化の緊急の必要性を強調している。"
> Rami McCarthy
> Staff Cloud Security Engineer

## FACT5 Insecure IAM roles for third-party integrations leave AWS accounts at risk of exposure

パブリッククラウドの利用が拡大するにつれ、クラウドインフラの監視やログの収集など、顧客のAWSアカウントと統合するベンダーが増え始めている。 このような状況では、顧客は通常、プロバイダーの検証済みAWSアカウントを信頼するIAMロールを通じて、クラウド環境へのアクセスを委任する。 設計上、これはクラウドサプライチェーンリスクを生み出す： プロバイダの AWS アカウントが侵害された場合、攻撃者はプロバイダがアクセスできるのと同じデータにアクセスできる可能性が高い。 この事実について、我々は SaaS プロバイダに対応する既知の AWS アカウントを信頼する IAM ロールをレビューした。 その結果、組織には平均で 10.2 個のサードパーティ統合ロール（中央値 3）が導入され、平均で 2.4 個のベンダー（中央値 2）にリンクされていることがわかりました。 次に、これらの統合ロールに共通する 2 種類の弱点を調べました。 サードパーティの統合ロールの10%は、ベンダーがアカウント内のすべてのデータにアクセスできたり、AWSアカウント全体を乗っ取ったりできるような、危険な過剰特権を与えられていることがわかりました。 また、サードパーティの統合ロールの2パーセントが外部IDの使用を強制していないことも確認しました。これにより、攻撃者は**「混乱した代理人」**攻撃によってそれらを侵害することができます。

![alt text](<assets/CleanShot 2024-10-29 at 17.34.53@2x.png>)

これは、ソフトウェア開発と同様に、クラウド環境においてもサードパーティのリスクから保護することが不可欠であることを示している。 クラウドアカウントで信頼しているサードパーティの統合のインベントリを作成し、ベンダーとしての利用を停止する際には、必ずロールを削除することをお勧めする。 次に、クラウド環境に最低限の権限を付与することが重要だ。 一例として、EC2インスタンスのステータスを監視するベンダーは、S3バケットからデータを読み取ることはできないはずだ。 最後に、外部IDの強制については、必ずベンダーの指示に従うこと。

## FACT6 Most cloud incidents are caused by compromised cloud credentials

私たちのセキュリティ・リサーチ活動の一環として、AWS CloudTrailログ、Azureアクティビティ、Entra IDアクティビティログなど、世界中のテレメトリから攻撃者のアクティビティを積極的に探しています。 まず、ほとんどのクラウドインシデントは、攻撃者が人（パスワード）とアプリケーションの両方からアイデンティティを侵害することによって引き起こされることがわかりました。 AWSでは、流出したアクセスキーは非常に人気があり、効率的な最初のアクセスベクトルです。 攻撃者はTrufflehogのような認証情報スキャナーを頻繁に活用し、ソースコードリポジトリやバージョン管理システム（VCS）の履歴から認証情報を特定します。 いったん足場を固めると、攻撃者の行動は、私たちが特定したいくつかの一貫したパターンに従うことがよくあります：

- **アクセスキーからコンソールアクセスへのピボット**： GetFederationToken APIコールを使って、AWSコンソールのサインインリンクを生成することができる。 これは、AWS CLI を使いたくない攻撃者や、侵害したアクセスキーが無効化されても侵害した環境に留まりたい攻撃者にとって便利です。
- **コアサービスの列挙**： これにより、攻撃者は素早く状況を把握し、侵害したアカウントの価値を理解することができる。 特に、攻撃者がAmazon SESの詳細な列挙を行い、アカウントのメール送信制限を理解した後、直接またはセカンダリーマーケットでアクセスを転売することによって、フィッシングメールやスパムメールを送信する手段としてこのアクセスを使用することを目撃しています。
- **セカンダリーマーケットでのアクセスの転売**： 攻撃者がAWSアカウントを侵害した場合、次のステップはそこからお金を稼ぐ方法を決定することです。 1つの方法は、侵害されたアカウントまたは特定のサービスへのアクセスを販売することです。 私たちは、アカウント全体、Amazon SESのみ（スパム/フィッシング送信目的）、またはAmazon Bedrockへのアクセスを転売しているのを目撃しています。
- **暗号マイニング**： いくつかのケースでは、攻撃者が侵害されたワークロードで暗号マイナーを直接実行しているのを目撃しています。 他のケースでは、攻撃者が未使用のAWSリージョンにEC2インスタンスを作成したり、暗号マイニング専用に新しいElastic Container Service（ECS）クラスタを作成したりするのを目撃しています。 アカウントが制限されすぎている場合、攻撃者がAWSのサポートケースを開いてクォータを増やし、ビジネスサポートプランにアップグレードしようとするケースも目撃されています。

他のクラウドプラットフォームでも同様の行動パターンが見られる。 マイクロソフト365で

- 初期アクセスは、クレデンシャル・スタッフィングによって達成されることが最も多いが、悪意のある OAuth アプリケーションや AitM（Adversary-in-the-Middle） 攻撃によっても達成される。
- 悪意のある OAuth アプリケーションは、初期アクセスだけでなく、電子メールの流出にも使用されます。 ID を侵害した後、攻撃者が `eM Client`やPERFECTDATA のような悪意のあるアプリケーションに電子メールへのアクセスを許可し、時にはサードパーティの OAuth アプリケーションの使用を制限するテナントレベルの設定を積極的に無効化することも、数多く目撃されています。
- また、受信トレイのルールは、被害者が自分のアカウントのアクティビティに関するITサポートからのメールを見ないようにするなど、被害者からメールを隠すために頻繁に使用されます。
- また、攻撃者が悪意のある添付ファイルやOneNoteノートブックを全社的に共有したり、社内にフィッシングメールを送信したりすることで、横方向への拡散を試みるケースも数多く見受けられます。 このような攻撃は、社外の顧客や取引先にも広がる可能性があります。

Google Cloudのテレメトリは最近のものですが、VPNネットワーク、家庭用プロキシ・プロバイダー、Torの出口ノードを使用することで、簡単に捕捉できる攻撃者をいくつか特定しました。 Google Cloudの脅威インテリジェンスでは、攻撃者がそこで暗号マイナーを起動することも確認しています。

![alt text](<assets/CleanShot 2024-10-29 at 17.41.15@2x.png>)

このデータは、（FIDOのような）強力な認証メカニズムでアイデンティティを保護し、長期間のクレデンシャルを制限し、攻撃者がよく使用するAPIの変更を積極的に監視することが重要であることを示している。

## FACT7 Many cloud workloads are excessively privileged or running in inappropriate places

クラウド環境で実行されるワークロードは、一般的にクラウドリソースにアクセスする必要がある。 この目的のために、推奨されるアプローチは、EC2インスタンスのIAMロールやGoogle Cloud仮想マシン（VM）のサービスアカウントなど、ワークロードにプラットフォームIDを割り当てるメカニズムを活用することである。 しかし、このようなワークロードに過剰な特権権限を割り当てると、大きなリスクが生じる可能性がある。 例えば、アプリケーションレベルの脆弱性を悪用してワークロードを侵害する攻撃者は、関連する認証情報を盗み出し、クラウド環境にアクセスすることができる。

AWSでは、EC2インスタンスの1％未満が管理者権限を持っている一方で、18％以上が過剰な権限を持っていることが判明した。 このうち、

- 4.3パーセントは、SSMセッションマネージャを使用して他のインスタンスに接続するなど、アカウント内での横方向の移動を可能にする危険な権限を持っています。
- 2.8パーセントは、管理者権限を持つ新しいIAMユーザーを作成する権限など、攻撃者が権限昇格によってアカウントへの完全な管理者アクセスを得ることを可能にします。
- 17.6パーセントは、アカウント内のすべてのS3バケットからデータをリストアップしてアクセスするなど、過剰なデータアクセスを持っています。

この数字は依然として高いが、1年前と比べると、このような不安定なコンフィギュレーションの普及率が減少していることに気づいた。

![alt text](<assets/CleanShot 2024-10-29 at 17.45.18@2x.png>)

また、少なくとも6％の組織が、AWSの組織管理アカウントでEC2インスタンスを運用していることがわかった。 このAWSアカウントは、設計上、組織内のどの子アカウントにもアクセスできるため、これは非常にリスクの高いプラクティスと考えられる。 我々は、この発見は、組織が現在の本番環境でAWS Organizationsをオンにし、管理アカウントでインフラストラクチャを実行し、効果的にリスクの高いピボットポイントに変えたことが原因であると考えています。 このためAWSは、AWS Organizationsを使用する際に、このアカウントでワークロードをデプロイすることを避けるよう推奨しています。

Google Cloudでは、13パーセントのVMが、無制限のクラウドプラットフォームスコープを持つコンピュートエンジンのデフォルトサービスアカウントを使用することで、実行するプロジェクトに対して特権的な "エディタ "権限を持っていることがわかりました。 さらに、別の20パーセントは、同じメカニズムを通じてGoogle Cloud Storage（GCS）への完全な読み取りアクセス権を持っています。つまり、合計で3人に1人以上（33パーセント）のGoogle Cloud VMが、プロジェクトに対する機密アクセス権を持っていることになります。 これは、2023年（37パーセントから減少）からわずかな減少ではあるが、これらのデフォルトのパーミッションは、さらなる認識を必要とする広範で体系的な問題であることに変わりはない。

![alt text](<assets/CleanShot 2024-10-29 at 17.47.03@2x.png>)

Google Cloudを使用している組織は、"Disable automatic IAM grants for default service accounts "組織ポリシーを有効にし、VMがデフォルト以外のサービスアカウントを使用するようにする必要がある。 クラウドワークロードのIAM権限を管理するのは簡単なことではない。 監視すべきリスクは管理者アクセスだけでなく、ユーザが機密データにアクセスしたり、特権をエスカレートしたりできるような機密権限にも注意する必要がある。 クラウド・ワークロードは攻撃者の一般的なエントリー・ポイントであるため、これらのリソースに対する権限を可能な限り制限することが重要です。
