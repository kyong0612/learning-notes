---
title: "Passkey認証の実装ミスに起因する脆弱性・セキュリティリスク"
source: "https://blog.flatt.tech/entry/passkey_security"
author:
  - "[[flattsecurity]]"
  - "[[Webサービスの認可制御の不備によって起こる仕様の脆弱性と対策]]"
published: 2025-06-24
created: 2025-07-03
description: "こんにちは、GMO Flatt Security株式会社 セキュリティエンジニアの小武です。 近年、WebAuthn、特にPasskeyはパスワードレス認証への関心の高まりや利便性の高さから、普及が進んでいます。 WebAuthnによるPasskey認証は強固な認証手段ですが、複雑な認証基盤の実装に不備があると、依然としてアカウント乗っ取りを含む従来のセキュリティリスクを払拭できません。 本記事では、W3CのWorking Draft(2025年5月現在)である Web Authentication: An API for accessing Public Key Credentials Level 3 を読み解き、Relying Party(RP)としてPasskey認証を導入する際に実装で注意すべき点を説明いたします。"
tags:
  - "clippings"
---
GMO Flatt Security株式会社の公式ブログです。  
プロダクト開発やプロダクトセキュリティに関する技術的な知見・トレンドを伝える記事を発信しています。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/f/flattsecurity/20250624/20250624164433.png)

## はじめに

こんにちは、GMO Flatt Security株式会社 セキュリティエンジニアの小武です。

近年、WebAuthn、特にPasskeyはパスワードレス認証への関心の高まりや利便性の高さから、普及が進んでいます。

WebAuthnによるPasskey認証は強固な認証手段ですが、複雑な認証基盤の実装に不備があると、依然としてアカウント乗っ取りを含む従来のセキュリティリスクを払拭できません。

本記事では、W3CのWorking Draft(2025年5月現在)である [Web Authentication: An API for accessing Public Key Credentials Level 3](https://www.w3.org/TR/webauthn-3/) を読み解き、Relying Party(RP)としてPasskey認証を導入する際に実装で注意すべき点を説明いたします。

## Passkey認証でも生まれ得るセキュリティリスク

WebAuthnの仕様は詳細かつ多岐にわたるため、Relying Party(以降、RP)の実装者がすべての側面を完全に理解し、セキュリティ上のベストプラクティスを遵守するには高い専門性が求められます。仕様の誤解や考慮漏れによって、予期せぬ脆弱性を生み出す可能性があります。例えば、「Credential IDの重複検証不備」、「ユーザーの検証不備」、「Non Discoverable Credentialのフローとの混在」による不適切な処理などは、なりすましやアカウント乗っ取りのリスクに繋がりかねません。

例えば、「Non Discoverable Credentialのフローとの混在」で解説するCVE-2025-26788は、Non Discoverable CredentialsとDiscoverable Credentials（Passkey）の認証フローが混在する際の検証不備により、アカウント乗っ取りを可能にする脆弱性として報告されています。

その他、Passkey認証を導入するにあたり、実装時に注意すべき点が各処理で存在します。詳細は各章をご参照ください。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/f/flattsecurity/20250701/20250701162922.png) ![](https://cdn-ak.f.st-hatena.com/images/fotolife/f/flattsecurity/20250624/20250624155611.png)

※ 6. 安全でないフォールバック処理 は登録・認証のフローには存在しないので、図においては省略しています

そこで、これらの背景によりRPとして提供するPasskey認証の実装状況を専門的な観点から評価し、潜在的な脆弱性や設定不備を検出するための「Passkey認証診断」も提供しています。

## Passkeyの概要

Passkeyは、WebAuthnプロトコルを利用して実現される認証情報の一つです。 生体認証が搭載されているスマートフォンや物理的な認証器に秘密鍵を保存し、その秘密鍵で署名した情報をサーバーに登録した公開鍵を用いて検証することで、パスワードレスなログインができるようになります。

Passkeyを利用可能にするためには、Passkeyの登録と認証のフローを実装する必要があります。登録と認証のフローはW3Cに定義されており、そのフローのことをセレモニーと呼びます。

本稿では、「認証器」は生体認証が搭載されているスマートフォンや物理的なデバイスのことを指し、「クライアント」はWebブラウザーを指します。また、RPフロントエンドは、Webブラウザーで動作するフロントエンドアプリケーションを指し、RPバックエンドはサーバーサイドで動作するアプリケーションを指します。

登録

```mermaid
RPバックエンド(サーバーサイド)RPフロントエンド(クライアントサイド)クライアント(Webブウラザ)認証器ユーザーRPバックエンド(サーバーサイド)RPフロントエンド(クライアントサイド)クライアント(Webブウラザ)認証器ユーザー認証器内で公開鍵と秘密鍵のペアを生成Passkeyの登録を要求Passkeyの登録を要求登録オプション(チャレンジ含む)登録オプション(チャレンジ含む)チャレンジを指定し、認証を要求ユーザーに生体認証などを要求ユーザーが認証を行うCredential IDと公開鍵を連携Credential IDと公開鍵を連携チャレンジ、Credential IDと公開鍵を送信チャレンジを検証し、Credential IDと公開鍵を登録登録成功を通知登録完了を通知登録完了をUIに表示
```

認証

```mermaid
RPバックエンド(サーバーサイド)RPフロントエンド(クライアントサイド)クライアント(Webブラウザ)認証器ユーザーRPバックエンド(サーバーサイド)RPフロントエンド(クライアントサイド)クライアント(Webブラウザ)認証器ユーザーPassKey認証を要求Passkey認証を要求認証オプション(チャレンジ含む)認証オプション(チャレンジ含む)チャレンジを指定し、認証を要求利用可能なPasskeyを選択するよう要求ユーザーはPasskeyを選択し、認証を行う署名したアサーションを連携署名したアサーションを連携署名したアサーションを送信アサーションに含まれるCredential IDやuserHandleを基に登録済みの公開鍵を検索し、署名を検証ユーザーアカウントを特定し、認証済みの状態へ移行認証成功を通知ログイン成功/認証完了を通知ログイン成功/認証完了をUIに表示
```

## Passkey認証におけるセキュリティ観点

ここでは、W3CのWorking Draft(2025年5月現在)である Web Authentication: An API for accessing Public Key Credentials Level 3を基に、策定した検証事項を解説します。

### 1\. 署名の検証不備

「署名の検証不備」とは、Passkeyの認証セレモニーにおいて、RPサーバーが、認証器から返された認証応答に含まれるデジタル署名が有効であるかを検証していない、あるいは検証に不備がある場合の指摘事項です。

クライアントは認証器と連携し、生体認証などの処理を実行します。認証器は、RPサーバーから提供されたチャレンジなどの情報を含むclientDataJSONと、認証器自体の状態や認証対象のクレデンシャルの情報を含むauthenticatorDataを生成します。これらのデータの一部を連結し、Credential IDに紐づく秘密鍵を用いてデジタル署名を生成します。この署名は認証応答オブジェクトのsignatureフィールドに含まれます。

クライアントは、認証器が生成したアサーション（Passkeyを使用して作成された認証応答）をRPサーバーに送信します。 RPサーバーは、受信したアサーションに含まれる署名が、認証器が実際に該当するCredential IDに紐づく秘密鍵を使用して生成したものであることを、対応する公開鍵を用いて検証する必要があります。

以下は、認証応答の主要な構成要素を示す一般的なJSON形式の例です。

```json
{
    "response": {
        "id": "TXH7T72PDxbFGI_nkQ0g_0coe7c",
        "rawId": "TXH7T72PDxbFGI_nkQ0g_0coe7c",
        "type": "public-key",
        "response": {
            "authenticatorData": "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MdAAAAAA",
            "clientDataJSON": "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiUGZTYnR5YW5SRlhDX2FFWVF4Q2xyVFd4QzZHMkItelJHWWVFU2dHVnhZOCIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImNyb3NzT3JpZ2luIjpmYWxzZX0",
            "signature": "MEUCIQCZYXTff7W2bukFPqxloGnpr2AJyr0BM10umqlfonui1AIgY_L092vXWBzBnDc2CfjdZh49mwFX_EHnwU2iQoDk2U0",
            "userHandle": "ZDEyZWMyNDktOWE5Yy00MTQyLWEwOTUtNDQxZTcwN2UzOTQ2"
        }
    }
}
```

署名検証に不備がある場合、攻撃者が偽装したアサーションが受け入れられてしまい、結果として偽装されたユーザー情報での不正なログインを許してしまうことに繋がります。

実装例として [https://Passkey.dev/docs/tools-libraries/libraries/#other-fido2webauthn-libraries](https://passkey.dev/docs/tools-libraries/libraries/#other-fido2webauthn-libraries) に記載されているGo言語のライブラリである [https://github.com/go-webauthn/webauthn](https://github.com/go-webauthn/webauthn) やTypeScript製のライブラリであるSimpleWebAuthnにおける署名検証の処理を確認してみます。

Go言語のライブラリであるgo-webauthn/webauthnでは以下のような実装になっています。 ログイン処理を行うFinishDiscoverableLogin関数内で、ValidatePasskeyLogin関数を呼び出し、その内部でvalidateLogin関数を呼び出します。validateLogin関数では有効なアサーションかどうかを検証するための処理が含まれています。その処理の一つに署名検証の処理が実装されています。

[https://github.com/go-webauthn/webauthn/blob/7f3483eae21d5d510a0cc21ad62bf3900ffb1d5c/webauthn/login.go#L264-L372](https://github.com/go-webauthn/webauthn/blob/7f3483eae21d5d510a0cc21ad62bf3900ffb1d5c/webauthn/login.go#L264-L372)

```go
func (webauthn *WebAuthn) validateLogin(user User, session SessionData, parsedResponse *protocol.ParsedCredentialAssertionData) (*Credential, error) {
[省略]
    // Handle steps 4 through 16.
    if err = parsedResponse.Verify(session.Challenge, rpID, rpOrigins, rpTopOrigins, webauthn.Config.RPTopOriginVerificationMode, appID, shouldVerifyUser, credential.PublicKey); err != nil {
        return nil, err
    }
```

以下はVerify関数の一部抜粋です。authenticatorDataとclientDataJSONを元にしたハッシュ値を連結し、署名と一致するかの検証処理を行っています。

[https://github.com/go-webauthn/webauthn/blob/7f3483eae21d5d510a0cc21ad62bf3900ffb1d5c/protocol/assertion.go#L142-L195](https://github.com/go-webauthn/webauthn/blob/7f3483eae21d5d510a0cc21ad62bf3900ffb1d5c/protocol/assertion.go#L142-L195)

```go
// Specification: §7.2 Verifying an Authentication Assertion (https://www.w3.org/TR/webauthn/#sctn-verifying-assertion)
func (p *ParsedCredentialAssertionData) Verify(storedChallenge string, relyingPartyID string, rpOrigins, rpTopOrigins []string, rpTopOriginsVerify TopOriginVerificationMode, appID string, verifyUser bool, credentialBytes []byte) error {
[省略]
    sigData := append(p.Raw.AssertionResponse.AuthenticatorData, clientDataHash[:]...)
[省略]
    valid, err := webauthncose.VerifySignature(key, sigData, p.Response.Signature)
```

続いて、TypeScript製のライブラリであるSimpleWebAuthnは以下のような実装になっています。以下は、verifyAuthenticationResponseの抜粋です。 こちらもauthenticatorDataとclientDataJSONを元にしたハッシュ値を連結し、署名と一致するかの検証処理を行っています。

[https://github.com/MasterKale/SimpleWebAuthn/blob/786d2d8cd4560c36b6361f818a8ddaa8f0301012/packages/server/src/authentication/verifyAuthenticationResponse.ts#L37-L247](https://github.com/MasterKale/SimpleWebAuthn/blob/786d2d8cd4560c36b6361f818a8ddaa8f0301012/packages/server/src/authentication/verifyAuthenticationResponse.ts#L37-L247)

```typescript
export async function verifyAuthenticationResponse(
  options: {
    response: AuthenticationResponseJSON;
    expectedChallenge: string | ((challenge: string) => boolean | Promise<boolean>);
    expectedOrigin: string | string[];
    expectedRPID: string | string[];
    credential: WebAuthnCredential;
    expectedType?: string | string[];
    requireUserVerification?: boolean;
    advancedFIDOConfig?: {
      userVerification?: UserVerificationRequirement;
    };
  },
): Promise<VerifiedAuthenticationResponse> {
[省略]
 const signatureBase = isoUint8Array.concat([authDataBuffer, clientDataHash]);

  const signature = isoBase64URL.toBuffer(assertionResponse.signature);
[省略]
 const toReturn: VerifiedAuthenticationResponse = {
    verified: await verifySignature({
      signature,
      data: signatureBase,
      credentialPublicKey: credential.publicKey,
    }),
```

一方でスクラッチでPasskey認証のセレモニーを実装する場合は、上記で紹介したような署名検証の処理を実装することが必須です。

### 2\. チャレンジの検証不備

「チャレンジの検証不備」とは、Passkeyの登録または認証のセレモニーにおいて、RPサーバーが発行したチャレンジが、クライアントから返されたアサーションに含まれるclientDataJSON内のチャレンジ値と厳密に一致するかどうかを検証していない場合の指摘事項です。

チャレンジとはPasskeyの登録および認証のセレモニーにおいて、リクエストを傍受した攻撃者が入手したアサーションの再使用(リプレイ攻撃)を防ぐために使用される一意でランダムなパラメータのことです。

RPサーバーは受信したアサーションに含まれるclientDataJSONを解析してチャレンジを抽出し、自身がクライアントに発行したチャレンジと厳密に同一であることを検証する必要があります。

「署名の検証不備」と同様に、Go言語のライブラリであるgo-webauthn/webauthnにおける実装を解説します。

以下は、登録セレモニーを実装した場合のコードの一部です。

ユーザーが新しいPasskeyを登録する際、RPサーバーは登録を開始するためBeginDiscoverableLogin関数を呼び出します。 この関数は、クライアントに渡すためのリクエストオプションを生成します。 このリクエストオプションには、チャレンジが含まれます。クライアントからの応答を受け取って検証を完了するまでの間、一時的に保持しておく必要があります。RPサーバーでセッションと紐づけて保持するのが一般的です。

```go
options, session, err := webAuthn.BeginDiscoverableLogin()
```

次に、認証器が生成した公開鍵をRPサーバーに送信します。 RPサーバーは、クライアントから受け取った応答と、開始時に保持しておいたsession変数を、WebAuthnライブラリのFinishDiscoverableLogin関数に渡します。

```go
credential, err := webAuthn.FinishDiscoverableLogin(handler, session, r)
```

FinishDiscoverableLogin関数では、アサーションに含まれるチャレンジが開始時のリクエストオプションのものと一致することの確認を含め、WebAuthn仕様に定められた厳密な検証ロジックが自動的に実行されます。

例えばTypeScript製のライブラリであるSimpleWebAuthnでも、同様に以下のような実装が行われています。

独自のチャレンジ検証ロジックを使わない限りは、セッションに紐づくチャレンジを含めたオブジェクトを生成し、verifyRegistrationResponse関数へ渡すことにより、関数内部で検証が行われます。以下のコードは、SimpleWebAuthnのexampleにある使用例です。

[https://github.com/MasterKale/SimpleWebAuthn/blob/786d2d8cd4560c36b6361f818a8ddaa8f0301012/example/index.ts#L168-L179](https://github.com/MasterKale/SimpleWebAuthn/blob/786d2d8cd4560c36b6361f818a8ddaa8f0301012/example/index.ts#L168-L179)

```typescript
const expectedChallenge = req.session.currentChallenge;

 let verification: VerifiedRegistrationResponse;
  try {
    const opts: VerifyRegistrationResponseOpts = {
      response: body,
      expectedChallenge: \`${expectedChallenge}\`,
      expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: false,
    };
    verification = await verifyRegistrationResponse(opts);
```

以下のコードは、SimpleWebAuthnのverifyRegistrationResponse関数の実装の一部を抜粋したものです。

[https://github.com/MasterKale/SimpleWebAuthn/blob/786d2d8cd4560c36b6361f818a8ddaa8f0301012/packages/server/src/registration/verifyRegistrationResponse.ts#L116-L127](https://github.com/MasterKale/SimpleWebAuthn/blob/786d2d8cd4560c36b6361f818a8ddaa8f0301012/packages/server/src/registration/verifyRegistrationResponse.ts#L116-L127)

```typescript
// Ensure the device provided the challenge we gave it
  if (typeof expectedChallenge === 'function') {
    if (!(await expectedChallenge(challenge))) {
      throw new Error(
        \`Custom challenge verifier returned false for registration response challenge "${challenge}"\`,
      );
    }
  } else if (challenge !== expectedChallenge) {
    throw new Error(
      \`Unexpected registration response challenge "${challenge}", expected "${expectedChallenge}"\`,
    );
  }
```

検証後に一度使用されたチャレンジは再利用されないように無効化するか、そもそも値が重複しないように生成するのが良いでしょう。これは、攻撃者がアサーションを傍受し、再度使用することにより、攻撃者になりすますことを防ぐために必要な処理です。 セッション管理の機構は開発者自身が実装を行う必要があることに注意が必要です。

### 3\. チャレンジの安全性

「チャレンジの安全性」とは、「チャレンジの検証」で使用されるチャレンジが予測可能であったり、ユニークでないような場合の指摘事項です。

生成方法のランダム性を確保するために、RPサーバーで一意でランダムなチャレンジを生成する必要があります。この一意でランダムな値を、リプレイ攻撃や事前計算への対策としてPasskey認証では使用します。

チャレンジのエントロピーが低い場合や、値の重複が容易に発生する場合、何らかの方法で攻撃者が事前に取得したアサーションが悪用される可能性があります。

「チャレンジの検証不備」に記載しているとおり、ライブラリがチャレンジを生成する機構を有している場合は、基本的にライブラリを活用することでチャレンジの強度を担保できます。ここでもgo-webauthn/webauthnとSimpleWebAuthnの実装を確認してみます。

Go言語のライブラリであるgo-webauthn/webauthnの場合crypto/randを使用し、32バイトのチャレンジを生成しています。

[https://github.com/go-webauthn/webauthn/blob/7f3483eae21d5d510a0cc21ad62bf3900ffb1d5c/protocol/challenge.go#L1-L20](https://github.com/go-webauthn/webauthn/blob/7f3483eae21d5d510a0cc21ad62bf3900ffb1d5c/protocol/challenge.go#L1-L20)

```go
package protocol

import (
    "crypto/rand"
)

// ChallengeLength - Length of bytes to generate for a challenge.
const ChallengeLength = 32

// CreateChallenge creates a new challenge that should be signed and returned by the authenticator. The spec recommends
// using at least 16 bytes with 100 bits of entropy. We use 32 bytes.
func CreateChallenge() (challenge URLEncodedBase64, err error) {
    challenge = make([]byte, ChallengeLength)

    if _, err = rand.Read(challenge); err != nil {
        return nil, err
    }

    return challenge, nil
}
```

TypeScript製のライブラリであるSimpleWebAuthnの場合、Web Crypto APIを使用し32バイトのチャレンジを生成しています。

[https://github.com/MasterKale/SimpleWebAuthn/blob/786d2d8cd4560c36b6361f818a8ddaa8f0301012/packages/server/src/helpers/generateChallenge.ts#L1-L20](https://github.com/MasterKale/SimpleWebAuthn/blob/786d2d8cd4560c36b6361f818a8ddaa8f0301012/packages/server/src/helpers/generateChallenge.ts#L1-L20)

```typescript
import { isoCrypto } from './iso/index.ts';

/**
 * Generate a suitably random value to be used as an attestation or assertion challenge
 */
export async function generateChallenge(): Promise<Uint8Array> {
  /**
   * WebAuthn spec says that 16 bytes is a good minimum:
   *
   * "In order to prevent replay attacks, the challenges MUST contain enough entropy to make
   * guessing them infeasible. Challenges SHOULD therefore be at least 16 bytes long."
   *
   * Just in case, let's double it
   */
  const challenge = new Uint8Array(32);

  await isoCrypto.getRandomValues(challenge);

  return _generateChallengeInternals.stubThis(challenge);
}
```

[https://github.com/MasterKale/SimpleWebAuthn/blob/786d2d8cd4560c36b6361f818a8ddaa8f0301012/packages/server/src/helpers/iso/isoCrypto/getRandomValues.ts#L3-L14](https://github.com/MasterKale/SimpleWebAuthn/blob/786d2d8cd4560c36b6361f818a8ddaa8f0301012/packages/server/src/helpers/iso/isoCrypto/getRandomValues.ts#L3-L14)

```typescript
/**
 * Fill up the provided bytes array with random bytes equal to its length.
 *
 * @returns the same bytes array passed into the method
 */
export async function getRandomValues(array: Uint8Array): Promise<Uint8Array> {
  const WebCrypto = await getWebCrypto();

  WebCrypto.getRandomValues(array);

  return array;
}
```

独自に実装を行う必要がある場合は、(厳密には一意ではないが)上記の実装を参考にし言語に応じた暗号論的擬似乱数生成器を使用することが重要です。

### 4\. Credential IDの重複検証不備

Credential IDの重複検証不備とは、登録時にRPサーバー が、クライアントから提供されたCredential IDが既に他のユーザーに登録されていないかを確認していない場合の指摘事項です。

Credential IDは認証器によって生成されます。認証器はCredential IDと一対の公開鍵と秘密鍵のペアを生成し、その公開鍵は登録セレモニーでRPサーバーに送信され、ユーザーと関連付けられます。

なんらかの方法でユーザーのCredential IDと公開鍵を取得した攻撃者は、取得したCredential IDと公開鍵を、攻撃者自身のアカウントに紐づくPasskeyとして登録しようと試みます。 この処理の中で、RPサーバーが登録済みCredential IDを用いた重複登録リクエストを適切に失敗させない場合、実装次第ですが①攻撃者のアカウントの認証情報にそのCredential IDと公開鍵が紐づく可能性や、②そのCredential IDに対応する公開鍵が攻撃者のもので上書きされる可能性があります。

①のケースの場合、その後、被害者が自身のPasskeyを使ってログインしようとする際に、認証器が攻撃者のアカウントにも紐づいたCredential IDをログイン選択肢として提示し、被害者が認証を行った際に、RPサーバーの実装次第では攻撃者のアカウントにログインしてしまう可能性があります。 被害者を攻撃者のアカウントにログインさせることに成功し、被害者がその事象に気が付かない場合、その後の操作は全て攻撃者のアカウントに対する操作になります。 その場合、アプリケーションによっては、個人情報などの重要な情報が攻撃者のアカウントに登録され、漏洩する可能性があります。

以下の図は上記の攻撃の流れを図式化したものです。

```mermaid
RPバックエンド(サーバーサイド)認証器/クライアント (被害者所有)被害者攻撃者RPバックエンド(サーバーサイド)認証器/クライアント (被害者所有)被害者攻撃者Credential IDがユニークであることの検証不備により別ユーザーアカウントに紐付けることを許可してしまう可能性検証に成功したとしても、Credential IDはRPバックエンドでは攻撃者のアカウントにも紐づいているため、攻撃者のアカウントとして処理される可能性がある被害者は意図せず攻撃者アカウントを操作(何らかの方法で被害者のCredential IDと公開鍵を取得)攻撃者アカウントでPasskeyの登録を要求(被害者のCredential IDと公開鍵)内部処理: (脆弱性により) 被害者のCredential IDを攻撃者アカウントにも紐付けて登録完了してしまう攻撃者アカウントとしての登録成功通知Passkeyの認証を要求Passkeyの認証を要求認証オプション(チャレンジ含む)内部処理: 認証器に接続し、RP IDに紐づくPasskeyを検索利用可能なPasskeyを提示被害者自身のCredentialを選択被害者の秘密鍵で署名したアサーション内部処理: 署名を検証 (被害者の公開鍵で成功)認証成功(攻撃者アカウントのセッションが確立)ログイン成功表示(被害者は自身のアカウントにログインしたと認識している)(攻撃者アカウントとして) データアクセス/操作を実行
```

また、②のケースの場合、攻撃者がPasskey認証を行うだけで被害者のアカウント乗っ取りに繋がってしまう可能性も考えられます。

対策として、RPサーバーは登録時に新しいCredential IDを受け取った場合、それがデータベース内のどのユーザーのCredential IDとも重複していないことを厳格に検証し、重複している場合は登録を失敗させます。

Credential IDの重複検証は開発者が行う必要があり、ライブラリの導入だけでは本事象に対処できないことに注意が必要です。

### 5\. オリジンおよびRP ID検証不備 / 関連オリジンの設定不備

許可していないオリジンおよびRP ID(rpIdHash)が正しく検証されていない場合や、RPサーバーが関連オリジンリクエスト（Related Origin Requests）の仕組みを利用する際に、必要な設定や検証が正しく行われていない場合の指摘事項です。

Passkeyを含むWebAuthnプロトコルでは、認証情報は登録時のRP IDに紐づけられ、どのRPに利用するかのスコープが定められています。

通常、RP IDは、そのRPのドメイン名に基づいています。具体的には、呼び出し元のオリジンのドメイン、そのドメインの登録可能なドメイン（eTLD+1）、もしくはそのサブドメインである必要があります。 つまり、login.example.com が呼び出し元ドメインの場合、example.com もRP IDとして設定可能です。

しかし、Amazonのように日本ではamazon.co.jpで、北米ではamazon.comでサービスを運用しているような場合、同一のサービスでも同一のRP IDを使用できないケースがあります。このような場合に、ユーザーがどのオリジンからアクセスしても同じPasskeyを使用できるようにするため、「関連オリジンリクエスト 」の仕組みが導入されています。これにより、クライアントは、本来同一RP IDを指定可能なオリジン以外からPasskeyの作成および使用ができるようになります。

しかし、何らかの理由でクライアントがRP IDのスコープ制限を正しく実施できなかった場合、RPサーバーでのオリジン検証が機能しないと、攻撃者がユーザーのアサーションを不正に利用（例えば、悪意のあるサイト経由でアサーションを取得したり、それを使って不正な認証を試みたり）できてしまうことにつながります。

対策として、許可していないオリジンからの認証要求を受け入れないように、RPサーバーでclientDataのoriginが許可していいものか検証を行います。また、関連オリジンリクエストを有効にする場合は指定しているドメインおよびそのサブドメインが自社管理のリソース（JavaScriptコード等）のみをホスティングしており、検証などで使用する比較的脆弱になりやすいドメインが含まれない設定にする必要があります。

オリジン検証とあわせて、RPサーバーでAuthenticatorData内のrpIdHashを抽出し、RPサーバー自身が想定しているRP IDのSHA-256ハッシュと正確に一致することを検証する必要があります。もし、バグや脆弱性等、何らかの理由により別のRP IDがrpIdHashに設定されるケースがあったとしても、署名の検証やオリジンの検証を行うことで不正なアサーションを検知可能です。しかし、これらの検証に加えて、多層防御の観点からrpIdHashを検証することで、WebAuthnのセキュリティレベルの維持に繋がります。

### 6\. 安全でないフォールバック処理

安全でないフォールバック処理とは、特にPasskey認証のような強力な認証手段を導入したシステムにおいて、ユーザーがPasskeyを紛失したり、利用できなくなったりした場合に用いられる代替のアカウント復旧フローに潜在するセキュリティ上の問題点を指します。

アカウントの復旧が必要な場合、要求しているユーザーが実際にアカウントを有していることを検証する必要があります。例えば、復旧を行うアカウントに紐づくメールアドレスが紐づいている場合は、リカバリーコードを発行して検証を行うことなどが挙げられます。

### 7\. ユーザーの検証不備

ユーザーの検証不備とは、Passkeyを使用した認証において、RPサーバーが、アサーションに含まれるuserHandleと、署名検証に使用する公開鍵が紐づくユーザーアカウントの検証に不備がある場合の指摘です。

Passkeyは、認証器自身が、ユーザーアカウント識別子であるuserHandleと、認証器上に保存された公開鍵のCredential IDおよび対応する秘密鍵を紐付けて保持している認証情報です。

Passkeyを用いた認証セレモニーでは認証器はユーザーの指紋認証などで認証操作を完了すると、RPフロントエンドはクライアントと連携し、RPサーバーへアサーションを送信します。このアサーションには、認証器によって認証されたユーザーを示すuserHandleが含まれています。

RPサーバーは、アサーションがどのユーザーの秘密鍵によって署名されたものかを特定し、特定されたユーザーが所有する正当なCredential IDに紐づく公開鍵によって署名の検証が行えることを確認する必要があります。

RPサーバーが、アサーションに含まれるuserHandleを単にユーザー識別のために使用するだけで、そのuserHandleが示すユーザーアカウントが実際にそのrawId（Credential ID）を持つ認証情報を登録しているかを確認していない場合、悪意のあるユーザーや攻撃者が、偽のuserHandleをRPサーバーに送信することで、攻撃者が正規のユーザーになりすまして認証を成功させてしまう可能性があります。

以下の図は、上記の攻撃の流れを図式化したものです。

```mermaid
RPバックエンド(サーバーサイド)RPフロントエンド(クライアントサイド)クライアント(Webブラウザ)認証器攻撃者RPバックエンド(サーバーサイド)RPフロントエンド(クライアントサイド)クライアント(Webブラウザ)認証器攻撃者userHandleで特定したユーザーがCredential IDに対応する公開鍵を保持しているかの検証を行わないPasskey認証を要求Passkey認証を要求認証オプション(チャレンジ含む)認証オプション(チャレンジ含む)チャレンジを指定し、認証を要求利用可能なPasskeyを選択するよう要求ユーザーはPasskeyを選択し、認証を行う署名したアサーションを連携署名したアサーションを連携署名したアサーションを送信アサーションからuserHandleを取得アサーションのrawId(Credential ID)に対応する公開鍵を取得取得した公開鍵で署名を検証userHandleの値を使用して、RPのユーザーDBからユーザーアカウントを特定userHandleで特定したユーザーをログイン状態にし、セッションを発行署名は攻撃者のCredential IDを使用認証成功を通知ログイン成功/認証完了を通知ログイン成功/認証完了をUIに表示
```

対策として、Passkey認証では、以下の検証ステップをRPサーバーで行う必要があります。

- RPサーバーは、Credential IDに紐づく公開鍵を用いて、Passkeyのsignatureを検証する。
- RPサーバーは、アサーションにuserHandleが含まれていることを検証する。
- RPサーバーは、アサーションに含まれるuserHandleによって識別されるユーザーアカウントが、アサーションに含まれるrawId(Credential ID)と等しいIDを持つ公開鍵を保持していることを検証する。

### 8\. Non Discoverable Credentialのフローとの混在

Non Discoverable Credentialのフローとの混在は、ユーザーがログイン時にユーザーIDを指定するシナリオにおいて、認証器がPasskey（Discoverable Credential）を使用してアサーションを生成した場合に、サーバー側でアサーションを検証する処理が、本来期待されるCredential IDと提供されたアサーション（Credential IDやuserHandleを含む）との関連性を適切に確認できない場合に発生しうる場合の指摘です。

CVE-2025-26788を例に解説します。

この脆弱性は、StrongKey FIDO ServerがNon Discoverable Credentials（RPサーバーによるCredential IDの特定）の認証フローを処理する方法に起因します。具体的には、サーバーがPasskey(Discoverable Credential) とNon Discoverable Credentials の区別を行う中で、署名の検証には攻撃者のCredential IDに紐づく公開鍵を検証する一方で検証後にログインする処理はNon Discoverable Credentialsで認証を行うために指定したユーザーとしてログインを行うため、被害者ユーザーとして認証を通過できてしまうものです。

```mermaid
StrongKey FIDO Server (脆弱性を含むバージョン)RPフロントエンド(クライアントサイドアプリ)クライアント(Webブラウザ)認証器攻撃者StrongKey FIDO Server (脆弱性を含むバージョン)RPフロントエンド(クライアントサイドアプリ)クライアント(Webブラウザ)認証器攻撃者攻撃者はレスポンスを改ざんし自身が所有するCredential IDを指定する署名に使われたCredential IDがログイン要求時に指定したユーザーが所有しているものかの検証が行われないログイン開始 (被害者のユーザー名)ユーザー名チャレンジと被害者のCredential IDチャレンジと攻撃者のCredential IDチャレンジと攻撃者のCredential IDで認証を要求攻撃者のCredential IDに紐づく秘密鍵で署名を生成攻撃者の秘密鍵で署名したアサーション攻撃者の秘密鍵で署名したアサーションを送信アサーションの署名のみ検証、ログイン開始時に指定した被害者ユーザーとしてログインされる被害者のアカウントのセッション被害者アカウントの制御
```

対策として、userHandleに含まれるユーザーではなく認証を要求したユーザーが、署名に使われた秘密鍵に対応する公開鍵を保持しているかどうかを検証する必要があります。

参考:[https://nvd.nist.gov/vuln/detail/CVE-2025-26788](https://nvd.nist.gov/vuln/detail/CVE-2025-26788) [https://www.securing.pl/en/cve-2025-26788-passkey-authentication-bypass-in-strongkey-fido-server/](https://www.securing.pl/en/cve-2025-26788-passkey-authentication-bypass-in-strongkey-fido-server/)

### 9\. アカウント登録状態の漏洩

アカウント登録状態の漏洩とは、Non Discoverable Credentialで認証を行うフローにおいて、RPサーバーが認証セレモニーを開始する際に、特定のユーザーがシステムに登録されているか、公開鍵を登録しているかといった情報を攻撃者が観測できる場合の指摘事項です。

最初に認証を要求しているユーザーの特定を行うNon Discoverable Credentialでの認証においては、そのユーザーが登録している公開鍵を返し、その公開鍵のリストを認証器と連携して認証情報を生成します。 例えば、UserAというユーザー名で認証セレモニーを開始した場合、以下のようにUserAに登録済みのCredential IDがallowCredentialsに設定される実装となっているとします。

```json
{
    "publicKey": {
        "challenge": "2McZoeiUAwn4ipQ1bAkREKMvw-OLE7ob-MI2PDXN5uw",
        "timeout": 300000,
        "rpId": "localhost",
        "allowCredentials": [
            {
                "type": "public-key",
                "id": "qQc3X1rS7kZo1ddfRANqhQMnmZY"
            }
        ],
        "userVerification": "preferred"
    }
}
```

続いて、公開鍵を登録していないユーザーであるUserBというユーザー名で認証セレモニーを開始した場合、素直に実装をすると登録済みの公開鍵が存在しないため、allowCredentialsが設定されていない応答が返される実装になると考えられます。

```json
{
    "publicKey": {
        "challenge": "WBOnx6Bwf_1fmHqC_gelWrJWyiPF1oRBOSCA3gca7PY",
        "timeout": 300000,
        "rpId": "localhost",
        "allowCredentials": [],
        "userVerification": "preferred"
    }
}
```

または、そもそもユーザーが存在しない場合は、RPサーバーからユーザーが存在しないというエラーが返されるとします。

```json
{"message":"User not found"}
```

認証セレモニーを始める際のRPサーバーからの応答が上記のようになっている場合、ユーザーが存在しているかどうかや、Non Discoverable Credentialに対応する公開鍵が設定されているユーザーかどうかの観測が可能な仕様となってしまいます。

このような状況を防ぐための対策として、ユーザーが存在しなかった場合や、ユーザーに鍵が登録されていない場合でもランダムでもっともらしい仮想のCredential IDをallowCredentialsに含めることが、攻撃者にユーザーの情報を意図せず漏洩させないことへの対策になります。

## おわりに

本稿ではPasskey認証をサービスへ導入する上でRPサーバーが考慮すべき観点をご紹介しました。

冒頭でも触れたようにGMO Flatt Securityは「Passkey認証診断」を提供しています。本稿で紹介したような観点のチェックはぜひ我々専門家にお任せください。

弊社の脆弱性診断・ペネトレーションテストではPasskeyはもちろんのこと、Passkeyだけでなくその他の認証方法に関しても柔軟に診断を実施いたします。ぜひ、お問い合わせください。

また、日本初のセキュリティ診断AIエージェント「Takumi」を開発・提供しています。Takumiを雇用することで、高度なセキュリティレビューを月額7万円(税別)でAIに任せることができます。

今後ともGMO Flatt Securityは高度な専門性とAI製品の提供により開発組織にとって最適なセキュリティサービスを提供していきます。 [公式X](https://x.com/flatt_security) をフォローして最新情報をご確認ください！
[« Still X.S.S. - なぜいまだにXSSは生まれ…](https://blog.flatt.tech/entry/still_xss) [登壇・ハンズオン主催・聴講・ブース出展… »](https://blog.flatt.tech/entry/tskaigi_2025)
