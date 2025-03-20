# SSRで認証をどうするべきか？

ref: <https://zenn.dev/naofumik/articles/1d1fba86ee0df2>

## CSRとSSRの認証の違い

### トークン管理の基本的な違い

1. **トークンを送るタイミング**
   - CSR：HTMLを読み込んだ後、JavaScriptでlocalStorageからトークンを取得してAPIリクエスト時に送信
   - SSR：最初のHTMLリクエスト時に自動的にトークンを送る必要があり、実質的にCookieしか選択肢がない

2. **トークンの送り先指定**
   - CSR：JavaScriptで任意のホストに対してトークンを送信可能
   - SSR：Cookieの制約により同じホストにしかトークンを送れない

3. **トークンの保管先**
   - CSR：localStorage、Cookie、メモリなど保存先は自由
   - SSR：Cookieにしか保管できない

## 実例：企業の解決策

### メドレーの例

- Ruby on Railsサーバで認証を行い、HTMLテンプレートとCSRページ用JSONのAPIもCookieで認証
- Next.jsのSSRは別ホストにあるためCookie情報を共有できず、認証を諦めた

### Zozoの例

- 複数ドメインでのCookie同期方式を採用
- ASPとNext.jsで別々に認証処理を行うが、共通のRedis DBにセッション情報を保存
- ドメインごとに独立したCookieでも内容を同期させている
- 事前にセッション管理システムの刷新が必要だった

### GMOペパボの例

- Cookie転送方式を採用
- Ruby on Railsサーバが認証を担当
- サブドメイン共通のCookieを使用
- ExpressのSSRサーバはCookieの中身をそのままRailsサーバに転送
- 既存認証システムの書き換えが不要で実装が簡単

## 考慮点と筆者の見解

1. サーバ構成とレンダリング方式（CSR/SSR）の選択は認証システムに大きな影響を与える
2. 多くの場合、Vercelでの簡単なホスティングからSSRを安易に採用するケースがある
3. 小規模チームには以下のようなシンプルな構成が推奨される：
   - Hotwire（Rails認証システムをそのまま利用可能）
   - SEOが不要ならReact Router v7のSPAモード

4. 難しいのはSSR自体ではなく、**ドメイン・ホストを分けつつ共通の認証方式を使うこと**

5. モダンな視点で従来の簡単なアプローチを再考することも有効
