---
title: "システム設計・コーディング・行動・機械学習インタビュー（和訳版）"
source: "https://bytebytego.com/courses/system-design-interview/scale-from-zero-to-millions-of-users"
author:
  - "[[ByteByteGo]]"
published:
created: 2025-08-21
description: "システム設計スキルを次のレベルに引き上げるために必要なすべて"
tags:
  - "clippings"
  - "翻訳"
---

数百万のユーザーをサポートするシステムの設計は困難であり、継続的な洗練と終わりのない改善を必要とする道のりです。この章では、単一のユーザーをサポートするシステムを構築し、それを数百万のユーザーにサービスを提供できるように徐々にスケールアップします。この章を読み終えることで、システム設計の面接質問を突破するのに役立ついくつかのテクニックを習得できます。

## シングルサーバー構成

* **はじめの一歩**: 複雑なシステムの構築も、まずはシンプルな構成から始めます。ウェブアプリ、データベース、キャッシュなど、すべてを1台のサーバーで実行します。 (図1)

![Image represents a simplified client-server architecture with DNS resolution.  A rounded rectangle labeled 'User' contains icons for a 'Web browser' and a 'Mobile app.'  The web browser requests the website using the domain name 'www.mysite.com,' while the mobile app uses 'api.mysite.com.' Both requests are directed to a DNS server (represented by a globe with 'DNS' inscribed), which resolves the domain names into IP addresses.  The IP address is then sent back to the user's devices.  These IP addresses then direct the requests to a single 'Web server' (represented by a green rectangle) within a dashed-line box, which handles both the website requests ('www.mysite.com') and the API requests ('api.mysite.com') from the web browser and mobile app respectively.  The arrows indicate the direction of information flow, showing the requests from the user, the DNS lookup, and the responses from the web server.](https://bytebytego.com/_next/image?url=%2Fimages%2Fcourses%2Fsystem-design-interview%2Fscale-from-zero-to-millions-of-users%2Ffigure-1-1-WCFZBBLA.png&w=640&q=75)

* **リクエストフロー** (図2):
    1. ユーザーは `api.mysite.com` のようなドメイン名でウェブサイトにアクセスします。DNSは通常、サードパーティの有料サービスです。
    2. DNSはIPアドレス (`15.125.23.214` など) をブラウザやモバイルアプリに返します。
    3. IPアドレスを取得後、HTTPリクエストがウェブサーバーに直接送信されます。
    4. ウェブサーバーはレンダリング用のHTMLページやJSONレスポンスを返します。

![Image represents a simplified client-server architecture diagram illustrating the process of accessing a website.  A user, represented by a web browser and a mobile app icons within a rounded rectangle labeled 'User,' initiates the process.  The user's device first sends a request (1) to a DNS server with the domain name 'api.mysite.com'. The DNS server responds (2) with the IP address '15.125.23.214'.  The user's device then uses this IP address (3) to connect to a web server, depicted as a green rectangle labeled 'Web server' within a dashed-line box.  The web server sends back an HTML page (4) to the user's device, completing the request.  The arrows indicate the direction of information flow, showing the request and response between the user's device, the DNS server, and the web server.  Numbers in circles correspond to the steps in the process.](https://bytebytego.com/_next/image?url=%2Fimages%2Fcourses%2Fsystem-design-interview%2Fscale-from-zero-to-millions-of-users%2Ffigure-1-2-GPY73ZNO.png&w=640&q=75)

* **トラフィックソース**:
  * **ウェブアプリケーション**: サーバーサイド言語（Java, Pythonなど）でビジネスロジックを、クライアントサイド言語（HTML, JavaScript）で表示を処理します。
  * **モバイルアプリケーション**: ウェブサーバーとの通信にHTTPプロトコルを使用し、データ転送にはJSON形式が一般的に使われます。

## データベース

* **サーバーの分離**: ユーザーベースの増加に伴い、ウェブ/モバイルトラフィック用のサーバー（ウェブ層）とデータベース用のサーバー（データ層）を分離します。これにより、それぞれを独立してスケールさせることが可能になります。(図3)

![Image represents a simplified system architecture diagram showing the interaction between a user, a website, and a database.  A user, accessing via either a web browser or a mobile app, initiates a request to `www.mysite.com`. This domain name is resolved to an IP address via a DNS (Domain Name System) server. The request then reaches a web server, labeled as such, which handles `www.mysite.com` requests.  Simultaneously, the mobile app makes a request to `api.mysite.com`, which also points to the same web server. The web server acts as an intermediary, sending `read/write/update` requests to a database (labeled 'DB') and receiving 'return data' in response.  The dashed lines around the web server and database suggest these are separate components or services.  The overall flow depicts a typical client-server architecture with a database backend.](https://bytebytego.com/_next/image?url=%2Fimages%2Fcourses%2Fsystem-design-interview%2Fscale-from-zero-to-millions-of-users%2Ffigure-1-3-2P4MNG7C.png&w=640&q=75)

* **データベースの選択**:
  * **リレーショナルデータベース (RDBMS/SQL)**:
    * MySQL, PostgreSQLなど。
    * データをテーブルと行で表現し、SQLでJOIN操作が可能です。
    * 40年以上の歴史があり、多くの開発者にとって最初の選択肢です。
  * **非リレーショナルデータベース (NoSQL)**:
    * CouchDB, Cassandra, DynamoDBなど。キーバリューストア、グラフストア、カラムストア、ドキュメントストアの4種類に分類されます。
    * 通常、JOIN操作はサポートされません。
    * 次のような場合に適しています:
      * 超低レイテンシーが要求される。
      * データが非構造化である。
      * データのシリアライズ/デシリアライズのみが必要。
      * 大量のデータを保存する必要がある。

## 垂直スケーリング vs 水平スケーリング

* **垂直スケーリング (スケールアップ)**: サーバーの能力（CPU, RAMなど）を増強すること。
  * トラフィックが少ない場合はシンプルで良い選択肢です。
  * **デメリット**:
    * ハードウェアには限界があります。
    * フェイルオーバーや冗長性がなく、サーバーがダウンするとサービス全体が停止します。

* **水平スケーリング (スケールアウト)**: サーバーの台数を増やすこと。
  * 大規模アプリケーションにはこちらが望ましいです。
  * サーバーダウンや負荷増大の問題に対処するため、ロードバランサーを導入します。

## ロードバランサー

* **役割**: 受信トラフィックを、定義されたウェブサーバー群に均等に分散させます。(図4)
* **仕組み**:
  * ユーザーはロードバランサーのパブリックIPに接続します。
  * ウェブサーバーはプライベートIPを持ち、外部から直接アクセスできなくなります。
  * ロードバランサーとウェブサーバーはプライベートIPで通信します。
* **メリット**:
  * **フェイルオーバー**: サーバー1が停止しても、トラフィックはサーバー2にルーティングされ、サービスは継続します。
  * **スケーラビリティ**: トラフィックが増加した場合、ウェブサーバープールにサーバーを追加するだけで、ロードバランサーが自動的にリクエストを分散します。

![Image represents a simplified client-server architecture with load balancing.  A user, accessing via either a web browser or mobile app, initiates a request to `mywebsite.com`. This request first goes to a DNS server, which resolves the domain name `mywebsite.com` to its corresponding public IP address, `88.88.88.1`.  This IP address points to a load balancer, which receives the request from the user over the public IP. The load balancer then forwards the request to one of two servers (Server1 or Server2) using their private IP addresses (`10.0.0.1` and `10.0.0.2` respectively), distributing the load between them.  A table shows the domain name and its associated IP address mapping used by the DNS server.  The two servers are grouped within a dashed-line box, visually representing their internal network.  The arrows indicate the direction of information flow.](https://bytebytego.com/_next/image?url=%2Fimages%2Fcourses%2Fsystem-design-interview%2Fscale-from-zero-to-millions-of-users%2Ffigure-1-4-2EGRRANZ.png&w=640&q=75)

## データベースレプリケーション

* **目的**: データ層のフェイルオーバーと冗長性を確保します。
* **マスター/スレーブモデル**:
  * **マスターデータベース**: 書き込み操作（insert, delete, update）のみをサポートします。
  * **スレーブデータベース**: マスターからデータのコピーを取得し、読み取り操作のみをサポートします。
  * 多くのアプリケーションでは読み取りの比率が非常に高いため、通常スレーブの数の方がマスターより多くなります。(図5)

![Image represents a database replication architecture.  At the top, a cluster of three green boxes labeled 'Web servers' is depicted.  These web servers connect via dark-blue lines to a central, blue cylindrical database labeled 'Master DB,' sending 'writes' to it.  The 'Master DB' then replicates its data via dark-blue lines labeled 'DB replication' to three other blue cylindrical databases, labeled 'Slave DB1,' 'Slave DB2,' and 'Slave DB3.'  The web servers also connect to these slave databases via green lines, performing 'reads' from them.  This setup indicates a master-slave replication strategy where the master database handles all write operations, and the slave databases handle read operations, distributing the read load and improving performance.  The entire system is enclosed within a light-blue rounded rectangle.](https://bytebytego.com/images/courses/system-design-interview/scale-from-zero-to-millions-of-users/figure-1-5-TJLQVE5N.svg)

* **メリット**:
  * **パフォーマンス向上**: 読み書きを分離することで、より多くのクエリを並列処理できます。
  * **信頼性**: データが複数の場所に複製されるため、データ損失のリスクが低減します。
  * **高可用性**: 一つのデータベースがオフラインになっても、他のサーバーからデータにアクセスできるため、サービスは継続します。
* **障害対応**:
  * **スレーブDBダウン**: 読み取り操作は一時的にマスターDBまたは他の正常なスレーブDBに向けられます。
  * **マスターDBダウン**: スレーブDBの一つが新しいマスターに昇格します。本番環境では、データの一貫性を保つために複雑な手順が必要です。

(図6: ロードバランサーとDBレプリケーションを追加した構成)

![Image represents a simplified web application architecture.  A user, accessing via a web browser or mobile app, initiates a request to `www.mysite.com`. This domain name is resolved to an IP address via a DNS server. The request then reaches a load balancer, which distributes traffic across two web servers (`Server 1` and `Server 2`) labeled as the 'Web tier'.  These servers communicate with a database system ('Data tier') consisting of a master database (`Master DB`) and a slave database (`Slave DB`).  The web servers send write requests to the master database and read requests to either the master or slave database. The master database replicates data to the slave database, ensuring data consistency and redundancy.  The load balancer uses `api.mysite.com` as the internal endpoint for communication with the web servers.  The entire architecture is visually divided into three tiers: the user tier (user and their access methods), the web tier (load balancer and web servers), and the data tier (master and slave databases).  The arrows indicate the flow of requests and data between components, with labels like 'Write,' 'Read,' and 'Replicate' clarifying the type of interaction.](https://bytebytego.com/_next/image?url=%2Fimages%2Fcourses%2Fsystem-design-interview%2Fscale-from-zero-to-millions-of-users%2Ffigure-1-6-L2YNDDKF.png&w=640&q=75)

## キャッシュ

* **目的**: 負荷の高いレスポンスや頻繁にアクセスされるデータをメモリに一時保存し、後続のリクエストを高速に処理します。
* **キャッシュ層**:
  * データベースよりもはるかに高速な一時データストア層です。
  * システムのパフォーマンス向上、データベースの負荷軽減、キャッシュ層の独立したスケーリングといった利点があります。(図7)

![Image represents a simplified system architecture illustrating data retrieval from a cache and database.  The diagram shows three main components: a green rectangular 'Web server,' a blue square labeled 'CACHE' representing a cache, and a blue cylindrical 'Database' component labeled 'DB.'  A green arrow connects the cache to the web server, labeled '1. If data exists in cache, read data from cache,' indicating data flows from the cache to the web server. A blue arrow connects the database to the cache, labeled '2.1 If data doesn't exist in cache,...,' showing data retrieval from the database to the cache when the data is not found in the cache. Another blue arrow connects the cache back to the web server, labeled '2.2 Return data to the web server,' indicating the data's return path to the web server after being fetched either from the cache or the database.  The overall flow depicts a common caching strategy where the web server first checks the cache; if the data is present, it's directly returned; otherwise, the database is queried, the data is retrieved, stored in the cache, and then returned to the web server.](https://bytebytego.com/images/courses/system-design-interview/scale-from-zero-to-millions-of-users/figure-1-7-GGNXNZX6.svg)

* **リードスルーキャッシュ戦略**:
    1. ウェブサーバーはまずキャッシュに応答があるか確認します。
    2. あれば、そのデータをクライアントに返します。
    3. なければ、データベースに問い合わせ、その応答をキャッシュに保存してからクライアントに返します。
* **キャッシュ利用時の考慮事項**:
  * **利用タイミング**: 頻繁に読み取られ、変更が少ないデータに適しています。
  * **有効期限ポリシー**: データが古くならないように、またDBへの再ロードが頻発しないように、適切な有効期限を設定することが重要です。
  * **一貫性**: データストアとキャッシュの同期を保つ必要があります。
  * **障害の軽減**: 単一障害点（SPOF）を避けるため、複数のキャッシュサーバーを異なるデータセンターに配置することが推奨されます。(図8)

![Image represents a system architecture diagram illustrating a single point of failure.  Three client devices, labeled 'User A,' 'User B,' and 'User C,' each represented by a laptop icon, are connected via blue lines to a single, vertically oriented, light-green rectangular box labeled 'Single Server.'  Arrows on the lines indicate the direction of data flow, showing that each user is sending requests to the single server. Above the server, the text 'Single Point of Failure' highlights the vulnerability of this architecture; if the single server fails, all three users will lose access to the service.  The diagram's simplicity emphasizes the central role of the single server and the risk associated with its potential failure.](https://bytebytego.com/_next/image?url=%2Fimages%2Fcourses%2Fsystem-design-interview%2Fscale-from-zero-to-millions-of-users%2Ffigure-1-8-AVKYQBAQ.png&w=640&q=75)

* **退避ポリシー**: キャッシュが満杯になった場合、どのアイテムを削除するかを決定するポリシー。LRU（Least-Recently-Used）が最も一般的です。

## コンテンツ配信ネットワーク (CDN)

* **役割**: 静的コンテンツ（画像、動画、CSS, JSファイルなど）を配信するために地理的に分散されたサーバーのネットワークです。
* **仕組み**: (図9, 図10)
    1. ユーザーがウェブサイトにアクセスすると、最も近いCDNサーバーが静的コンテンツを配信します。
    2. ユーザーAが画像 `image.png` をリクエストします。
    3. CDNにキャッシュがなければ、オリジンサーバー（ウェブサーバーやS3など）にファイルを要求します。
    4. オリジンサーバーはファイルをCDNに返し、CDNはそれをキャッシュしてユーザーAに返します。
    5. ユーザーBが同じ画像をリクエストすると、TTL（Time-to-Live）が切れていなければキャッシュから直接返されます。

![Image represents a system architecture diagram illustrating the interaction between clients, a CDN (Content Delivery Network), and an origin server.  Two rectangular boxes labeled 'Client' represent users requesting content.  One client connects directly to a rectangular box labeled 'Origin,' taking 120ms, representing the time it takes to retrieve data from the origin server. The other client connects to a light-blue cloud icon labeled 'CDN' (with a lightning bolt inside, symbolizing speed), which takes 30ms.  This CDN then connects to the 'Origin' server.  The text 'Viewer does not support full SVG 1.1' is present below the CDN, indicating a potential limitation of the visualization tool used to create the diagram.  Arrows indicate the direction of data flow, showing that the CDN acts as an intermediary, caching content to reduce latency for clients compared to directly accessing the origin server.  The numbers '30ms' and '120ms' represent the latency in milliseconds for each connection path.](https://bytebytego.com/images/courses/system-design-interview/scale-from-zero-to-millions-of-users/figure-1-9-SA7OOP7O.svg)

![Image represents a system architecture illustrating how a Content Delivery Network (CDN) serves images to users.  Two users, labeled 'User A' and 'User B,' are depicted as laptops.  Each user requests an image ('image.png') from the CDN, represented as a light-blue cloud with a lightning bolt symbolizing speed. Solid arrows indicate the requests (labeled '1. get image.png' and '5. get image.png') and responses ('4. return image.png' and '6. return image.png') between the users and the CDN.  If the CDN doesn't have the image, dashed arrows show a request ('2. if not in CDN, get image.png from server') to a green rectangular 'Server' component, which then sends the image to the CDN ('3. store image.png in CDN').  This ensures that subsequent requests for the same image from other users are served quickly from the CDN's cache, improving performance and reducing load on the server.](https://bytebytego.com/_next/image?url=%2Fimages%2Fcourses%2Fsystem-design-interview%2Fscale-from-zero-to-millions-of-users%2Ffigure-1-10-E6HDAMPH.png&w=640&q=75)

(図11: CDNとキャッシュを追加した後の設計)

![Image represents a system architecture diagram illustrating a typical web application deployment.  The diagram starts with a user accessing the application via a web browser or mobile app, which then sends a request to a DNS server.  The DNS resolves the domain names (www.mysite.com and api.mysite.com) and directs the request to a load balancer. The load balancer distributes traffic across two web servers (Server1 and Server2) within a 'Web tier'. These servers communicate with a database system in a 'Data tier', consisting of a master database (Master DB) and a slave database (Slave DB) with replication occurring from the master to the slave.  Both web servers also connect to a separate cache (labeled 'CACHE') for improved performance.  The entire system is connected to a CDN (Content Delivery Network) for faster content delivery to users globally.  Solid lines represent primary data flow, while dashed lines indicate secondary or replicated data flow.  Green lines highlight the connection between the web servers and the cache.](https://bytebytego.com/_next/image?url=%2Fimages%2Fcourses%2Fsystem-design-interview%2Fscale-from-zero-to-millions-of-users%2Ffigure-1-11-VI5Z74Q2.png&w=640&q=75)

## ステートレスなウェブ層

* **目的**: ウェブ層を水平にスケーリングするために、状態（ユーザーセッションデータなど）をウェブ層から分離します。
* **ステートフルアーキテクチャ**: (図12)
  * サーバーがクライアントのデータ（状態）をリクエスト間で記憶します。
  * 同じクライアントからのリクエストは常に同じサーバーにルーティングされる必要があり（スティッキーセッション）、サーバーの追加・削除や障害対応が困難になります。

![Image represents a system architecture diagram showing three separate servers (Server 1, Server 2, Server 3) each handling a different user (User A, User B, User C respectively).  Each user, represented by a laptop icon, sends an 'http request' to their designated server.  The servers are depicted as rounded rectangles, each containing a green rectangle symbolizing a database and a list of data stored: session data and a profile image for the corresponding user.  The connections between the users and servers are shown as blue arrows indicating the direction of the HTTP requests.  There is no apparent interaction or data flow between the servers themselves; each operates independently to serve its assigned user.](https://bytebytego.com/_next/image?url=%2Fimages%2Fcourses%2Fsystem-design-interview%2Fscale-from-zero-to-millions-of-users%2Ffigure-1-12-WTWFBLWX.png&w=640&q=75)

* **ステートレスアーキテクチャ**: (図13)
  * サーバーは状態情報を保持しません。
  * ユーザーからのHTTPリクエストはどのウェブサーバーにでも送信でき、サーバーは共有データストア（リレーショナルDB, NoSQL, Memcached/Redisなど）から状態データを取得します。
  * この設計はよりシンプルで堅牢、かつスケーラブルです。

(図14: ステートレスなウェブ層を持つ更新された設計。セッションデータをNoSQLなどの永続ストアに移動し、ウェブサーバーのオートスケーリングを容易にします。)

![Image represents a simplified client-server architecture. Three clients, labeled 'User A,' 'User B,' and 'User C,' each represented by a laptop icon, send 'http request' messages (indicated by blue arrows with labels) to a cluster of three 'Web servers' (depicted as green vertical rectangles within a dashed blue box).  The web servers collectively process these requests.  After processing, the web servers then access a 'Shared Storage' (represented by a blue cylinder containing curly braces `{}`), indicated by a downward blue arrow labeled 'fetch state.' This shared storage likely contains data needed to fulfill the user requests.  The overall diagram illustrates a system where multiple users interact with a set of web servers that share a common data store.](https://bytebytego.com/_next/image?url=%2Fimages%2Fcourses%2Fsystem-design-interview%2Fscale-from-zero-to-millions-of-users%2Ffigure-1-13-WILHQ2SA.png&w=640&q=75)

![Image represents a system architecture diagram for a web application.  Users access the application via web browsers or mobile apps, initially resolving `www.mysite.com` (for web) or `api.mysite.com` (for mobile) through a DNS server.  These requests are then routed to a CDN (Content Delivery Network) for faster content delivery.  The requests subsequently reach a load balancer, distributing traffic across four application servers (Server1-Server4) which are auto-scaled (indicated by '① Auto scale').  These servers connect to a database system consisting of a master database and two slave databases, with replication occurring between the master and slaves.  Additionally, the servers interact with a cache for improved performance and a NoSQL database, likely for specific data storage needs.  Connections between the servers and databases are shown as dashed lines, suggesting asynchronous communication.  The green line indicates a connection from Server3 to the cache, while the purple line shows a connection from Server3 to the NoSQL database.  The blue lines represent the main flow of requests and data.](https://bytebytego.com/_next/image?url=%2Fimages%2Fcourses%2Fsystem-design-interview%2Fscale-from-zero-to-millions-of-users%2Ffigure-1-14-CCBCQMO6.png&w=640&q=75)

## データセンター

* **目的**: 可用性を向上させ、より広い地理的エリアで優れたユーザー体験を提供するために、複数のデータセンターをサポートします。
* **GeoDNS**: (図15)
  * ユーザーの地理的な位置に基づいて、ドメイン名を最も近いデータセンターのIPアドレスに解決するDNSサービスです。
  * 通常、トラフィックは複数のデータセンターに分散されます（例: US-Eastにx%, US-Westに(100-x)%）。
* **障害対応**: (図16)
  * あるデータセンターで大規模な障害が発生した場合、すべてのトラフィックを正常なデータセンターにリダイレクトします。

![Image represents a system architecture diagram for a website.  A user, accessing via web browser (www.mysite.com) or mobile app (api.mysite.com), initiates a request that first resolves through a DNS server.  The request then proceeds to a CDN (Content Delivery Network) for caching and faster delivery.  From the CDN, the request hits a load balancer, which distributes traffic across two geographically separate data centers (DC1: US-East and DC2: US-West) based on geo-routing. Each data center contains multiple web servers, which in turn access databases and caches for data retrieval.  The web servers are connected to their respective databases and caches.  Additionally, both data centers' web servers connect to a central NoSQL database via thick purple lines, suggesting a shared data layer or a specific data synchronization mechanism.  The connections between web servers and their respective caches are shown in green and blue, while the connections to the NoSQL database are shown in purple.  The load balancer uses geo-routing to direct requests to the closest data center, optimizing latency.](https://bytebytego.com/_next/image?url=%2Fimages%2Fcourses%2Fsystem-design-interview%2Fscale-from-zero-to-millions-of-users%2Ffigure-1-15-GICUI26J.png&w=640&q=75)

![Image represents a system architecture diagram for a website, `www.mysite.com`, and its API, `api.mysite.com`.  Users access the system via web browsers and mobile apps, initially resolving the domain name through a DNS server.  Traffic is then directed to a load balancer, which distributes requests across two data centers (DC1 in US-East and DC2 in US-West).  The load balancer shows a red 'X' indicating that it's not directing traffic to DC2 (100% traffic goes to DC1). Each data center contains multiple web servers, which in turn access databases and caches.  A dark purple line shows that both data centers' web servers also access a NoSQL database.  The entire system is connected to a CDN (Content Delivery Network) for faster content delivery.  The diagram clearly illustrates the flow of user requests, the distribution of load, and the interaction between different components of the system, including the databases, caches, and the NoSQL database.](https://bytebytego.com/_next/image?url=%2Fimages%2Fcourses%2Fsystem-design-interview%2Fscale-from-zero-to-millions-of-users%2Ffigure-1-16-DUWJTBCU.png&w=640&q=75)

* **技術的課題**:
  * **トラフィックリダイレクション**: GeoDNSなどの効果的なツールが必要です。
  * **データ同期**: 異なる地域のユーザーが異なるデータベースを使用する可能性があるため、複数のデータセンター間でデータを複製する戦略が必要です。
  * **テストとデプロイ**: すべてのデータセンターでサービスの一貫性を保つために、自動化されたデプロイツールが不可欠です。

## メッセージキュー

* **目的**: システムのコンポーネントを疎結合にし、それぞれを独立してスケールできるようにします。
* **アーキテクチャ**: (図17)
  * **プロデューサー/パブリッシャー**: メッセージを作成し、メッセージキューに発行するサービス。
  * **コンシューマー/サブスクライバー**: キューに接続し、メッセージで定義されたアクションを実行するサービス。

![Image represents a producer-consumer architecture using a message queue.  A rectangular box labeled 'Producer' is connected via a solid arrow labeled 'publish' to a hexagonal box representing a 'Message Queue'.  Inside the message queue are three envelope icons, symbolizing messages.  The message queue is connected to a rectangular box labeled 'Consumer' via two arrows. A solid arrow labeled 'consume' indicates the flow of messages from the queue to the consumer. A dashed arrow labeled 'subscribe' points from the consumer back to the message queue, illustrating the consumer's subscription to the queue for receiving messages.  Below the diagram, the text 'Viewer MessageQueue.svg 1.1.1' indicates the diagram's source and version.](https://bytebytego.com/images/courses/system-design-interview/scale-from-zero-to-millions-of-users/figure-1-17-J2NLNRNY.svg)

* **利点**:
  * 非同期通信をサポートし、プロデューサーとコンシューマーが互いに利用不可能な状態でもシステムが機能します。
  * プロデューサーとコンシューマーを独立してスケーリングできます。(図18: 写真処理の例)

![Image represents a system architecture diagram illustrating a message queue used for photo processing.  On the left, a group of three vertically stacked green rectangles labeled 'Producer' and further described as 'Web servers' are depicted within a dashed light-blue box.  These represent web servers that publish messages. A solid dark-blue arrow labeled 'publish' connects the Producer to a central component: a dark-blue, trapezoidal box containing three icons resembling envelopes, representing a message queue labeled 'queue for photo processing'.  A second solid dark-blue arrow labeled 'consume' extends from the queue to a group of three vertically stacked green rectangles on the right, labeled 'Consumer' and further described as 'Photo processing workers', also enclosed in a dashed light-blue box.  These represent worker servers that consume messages from the queue to process photos. The overall flow shows web servers publishing photo processing tasks to a queue, which are then consumed and processed by dedicated worker servers.](https://bytebytego.com/images/courses/system-design-interview/scale-from-zero-to-millions-of-users/figure-1-18-P3WDK5LN.svg)

## ロギング、メトリクス、自動化

* **重要性**: システムが大規模で複雑になるにつれて、これらのツールへの投資は不可欠になります。
* **ロギング**: システムのエラーや問題を特定するためにエラーログを監視します。
* **メトリクス**: ビジネスの洞察を得て、システムの健全性を理解するために様々なメトリクスを収集します。
  * ホストレベルのメトリクス（CPU, メモリなど）
  * 集約レベルのメトリクス（DB層全体のパフォーマンスなど）
  * 主要なビジネスメトリクス（DAU, 収益など）
* **自動化**: 生産性を向上させるために自動化ツールを構築または活用します。CI（継続的インテグレーション）や、ビルド、テスト、デプロイプロセスの自動化が有効です。

(図19: メッセージキューと各種ツールを追加した設計)

![Image represents a system architecture diagram for a web application.  A user, accessing via web browser (www.mysite.com) or mobile app (api.mysite.com), initiates a request that first goes through a DNS server.  The request then reaches a load balancer, distributing traffic to multiple web servers within a data center (DC1).  The web servers interact with databases and caches for data retrieval.  A green arrow shows the web servers using caches. A blue arrow shows the web servers using databases.  A purple arrow indicates that after processing, the web servers send messages to a message queue.  These messages are then processed by a set of workers, which subsequently write data to a NoSQL database.  The entire system is fronted by a CDN (Content Delivery Network) for faster content delivery.  Finally, a separate component labeled 'Tools' (2) at the bottom shows monitoring, logging, metrics, and automation functionalities, suggesting a robust operational monitoring and management system.](https://bytebytego.com/_next/image?url=%2Fimages%2Fcourses%2Fsystem-design-interview%2Fscale-from-zero-to-millions-of-users%2Ffigure-1-19-MOPDW7TD.png&w=640&q=75)

## データベースのスケーリング

* **垂直スケーリング（スケールアップ）**:
  * 既存のマシンのパワー（CPU, RAMなど）を追加すること。
  * 強力なサーバーは存在しますが、ハードウェアの限界、単一障害点のリスク、高いコストといった欠点があります。
* **水平スケーリング（シャーディング）**: (図20)
  * サーバーを追加すること。大規模なデータベースをシャードと呼ばれる、より小さく管理しやすい部分に分割します。
  * 各シャードは同じスキーマを共有しますが、データは固有です。
  * **シャーディングキー**: どのシャードにデータを配置するかを決定するキー（例: `user_id`）。データを均等に分散できるキーを選ぶことが重要です。(図21, 図22)

![Image represents a comparison between vertical and horizontal scaling in system design.  The diagram is enclosed within a dashed blue rectangle. On the left, under the label 'Vertical Scaling (Increase CPU, RAM, DISK, etc)', three vertically stacked, light-green rectangles of decreasing size represent a single server with its resources increased over time. A thick, upward-pointing blue arrow indicates the increase in resources.  To the right, under the label 'Horizontal Scaling (Add more servers)', six light-green rectangles are arranged in two rows of three, representing multiple servers added to handle increased load. A thick, rightward-pointing blue arrow indicates the addition of more servers. The word 'VS' is placed between the vertical and horizontal scaling representations, clearly indicating a comparison.  The bottom of the diagram contains the text 'Viewer does not support full SVG 1.1,' indicating a limitation of the viewer used to display the image.](https://bytebytego.com/images/courses/system-design-interview/scale-from-zero-to-millions-of-users/figure-1-20-VLGHMELC.svg)

![Image represents a simple data sharding scheme.  A diamond-shaped decision node labeled 'user_id % 4' acts as a routing mechanism.  This node takes a user ID as input and performs a modulo 4 operation. The result of this operation (the remainder after dividing the user ID by 4) determines which of four cylindrical database instances (labeled 0, 1, 2, and 3) will store the data for that specific user.  A light-blue line connects the decision node to each database instance, visually representing the data flow.  Each database instance represents a shard, and the modulo operation distributes user data evenly across these four shards, improving scalability and reducing load on any single database.  The text 'Viewer does not support full SVG 1.1' at the bottom is a browser-related message unrelated to the core diagram's functionality.](https://bytebytego.com/images/courses/system-design-interview/scale-from-zero-to-millions-of-users/figure-1-21-ZDWDWEO5.svg)

![Image represents a database sharding scheme.  Four cylindrical database shards, labeled 'Shard 0,' 'Shard 1,' 'Shard 2,' and 'Shard 3,' are depicted. Each shard contains a table named 'Users' with columns 'user_id...' and an unspecified second column.  The 'user_id...' column in each shard contains a subset of user IDs; Shard 0 holds IDs 0, 4, and presumably others indicated by '...'; Shard 1 holds IDs 1, 5, and others; Shard 2 holds IDs 2, 6, and others; and Shard 3 holds IDs 3, 7, and others.  The arrangement suggests a horizontal partitioning strategy where user IDs are distributed across the shards, likely based on a modulo operation or similar hashing function to ensure even distribution. There are no explicit connections drawn between the shards, implying independent access to each shard.](https://bytebytego.com/images/courses/system-design-interview/scale-from-zero-to-millions-of-users/figure-1-22-FI2MHR5M.svg)

* **課題**:
  * **リシャーディング**: シャードの容量が不足したり、データが不均等に分散した場合に必要になります。
  * **有名人問題（ホットスポット）**: 特定のシャードへのアクセスが集中し、サーバーの過負荷を引き起こす可能性があります。
  * **JOINと非正規化**: 複数のシャードにまたがるJOIN操作は困難です。回避策としてデータベースを非正規化することがあります。

(図23: データベースをシャーディングし、一部の機能をNoSQLに移行した最終的な設計)

![Image represents a system architecture diagram for a web application.  A user, accessing via web browser (www.mysite.com) or mobile app (api.mysite.com), initiates a request that first resolves through a DNS server. The request then goes to a CDN (Content Delivery Network) before reaching a load balancer distributing traffic across multiple web servers within a data center (DC1).  These web servers interact with a sharded database (labeled 'Databases,' numbered 1), a cache layer for improved performance, and a message queue.  Data is also written to a NoSQL database (labeled 'NoSQL,' numbered 2).  A separate set of workers processes tasks from the message queue.  Finally, a 'Tools' section at the bottom shows components for logging, metrics, monitoring, and automation, suggesting a robust system monitoring and management infrastructure.  The connections between components show the flow of requests and data, with green lines indicating data flow to the cache, purple lines indicating data flow to the NoSQL database, and blue lines representing the main request flow.](https://bytebytego.com/_next/image?url=%2Fimages%2Fcourses%2Fsystem-design-interview%2Fscale-from-zero-to-millions-of-users%2Ffigure-1-23-3IYFN6Q6.png&w=640&q=75)

## 数百万ユーザーとその先へ

* システムのスケールは反復的なプロセスです。この章で学んだテクニックは良い基盤となりますが、数百万ユーザーを超えてスケールするには、さらなる微調整と新しい戦略が必要です。
* **まとめ**:
  * ウェブ層をステートレスに保つ
  * すべての層で冗長性を構築する
  * 可能な限りデータをキャッシュする
  * 複数のデータセンターをサポートする
  * 静的アセットをCDNでホストする
  * シャーディングによってデータ層をスケールする
  * 層を個別のサービスに分割する
  * システムを監視し、自動化ツールを使用する

お疲れ様でした！
