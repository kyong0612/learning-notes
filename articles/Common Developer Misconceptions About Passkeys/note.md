# Common Developer Misconceptions About Passkeys

ref: <https://auth0.com/blog/common-developer-misconceptions-about-passkeys/>

Title: Common Developer Misconceptions About Passkeys

- パスキーは、フィッシング攻撃に対する耐性を提供しながら、ユーザーエクスペリエンスとセキュリティを向上させるパスワードの代替手段です。
- 「パスキー」という用語は一般名詞であり、製品名ではありません。FIDO Alliance によると、パスキーは、より迅速で簡単、そしてより安全なサインインのための資格情報を意味します。
- FIDO (Fast IDentity Online) は、ユーザー認証におけるパスワードに関する問題を解決することを目的とした取り組みで、FIDO Alliance がその標準を監督しています。
- FIDO2 認証は、WebAuthn と CTAP の仕様を含み、パスキーの技術的な基盤となっています。
- FIDO 資格情報、または WebAuthn 資格情報は、公開鍵暗号を利用し、共有秘密を必要とせずに安全な認証を可能にします。
- パスキーは、ユーザーを直接バイオメトリクスで認証するのではなく、バイオメトリクスは認証デバイスへのアクセスを承認するためのローカルなジェスチャーとして機能します。
- パスキーはユーザーアカウントとは異なり、アイデンティティを証明する資格情報であり、アカウントは特定のコンテキストにおけるユーザーのアイデンティティを表します。
- ハードウェアおよびソフトウェアの認証デバイスがパスキーに使用でき、ソフトウェアの認証デバイスはクラウド同期を含む柔軟性が高い。
- パスキーは、Webベースの使用に限定されるという誤解を払拭し、Webアプリケーションとネイティブアプリケーションの両方に適用できます。
- シングルサインオン (SSO) とパスキーは共存でき、従来の SSO の実装を変更することなく、認証済みセッションを seamless に管理できます。