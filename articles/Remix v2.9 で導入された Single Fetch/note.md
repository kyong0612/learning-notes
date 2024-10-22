# Remix v2.9 で導入された Single Fetch

ref: <https://azukiazusa.dev/blog/single-fetch-in-remix/>

- Single Fetch
  - サーバへの複数のHTTPリクエストを並行して行う変わりに、1つのHTTPリクエストを実行しまとめてレスポンスを返す機能
  - v2.9ではfeature flagで提供、v3以降ではデフォルトの挙動
  - 利点
    - CDNキャッシュカバレッジの向上
    - よりシンプルなヘッダーの操作
    - Remix自体のコードの簡素化
