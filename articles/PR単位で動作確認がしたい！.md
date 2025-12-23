---
title: "PR単位で動作確認がしたい！"
source: "https://zenn.dev/ubie_dev/articles/8c34b08626aa88"
author:
  - "Teruya Ono (@teru0x1)"
published: 2025-12-20
created: 2025-12-23
description: |
  UbieでPRごとに独立した動作確認環境「preview環境」を提供するプラットフォームについて紹介。マルチクラスタ構成を活用し、GitHubのPRコメントから簡単にpreview環境を作成できる仕組みにより、開発者の動作確認のボトルネックを解消し開発効率を向上させている。
tags:
  - "Kubernetes"
  - "Google Cloud"
  - "Platform Engineering"
  - "SRE"
  - "CI/CD"
  - "Preview Environment"
---

## 概要

Ubieのプラットフォームエンジニア/SREであるTeruya Ono氏が、PRごとに独立した動作確認環境を提供する「preview環境」の仕組みについて解説した記事。Ubie Tech Advent Calendar 2025の20日目の記事。

---

## 背景と課題

### 現状の問題点

- **AIコーディング支援ツールの普及**により、コードを書くハードル自体は下がっている
- しかし、**動作確認が開発フローのボトルネック**になるケースが増加
- 特にフロントエンドを持つアプリケーションで顕著

### 具体的な課題

| 環境 | 問題点 |
|------|--------|
| **STG環境（共有環境）** | 複数開発者が同じ環境を利用しようとして順番待ちが発生 |
| **ローカル環境** | Devinのようなリモートコーディングエージェントを多用する開発スタイルでは開発速度が低下 |

---

## 作成したもの：Preview環境プラットフォーム

### 重要なポイント

**特定のアプリケーションのpreview環境をアドホックに作成したのではなく、preview環境を簡単に作成できる仕組み自体を構築した**

### 背景となるニーズ

Ubieでは以下のような多数のフロントエンドアプリケーションを運用：

- エンドユーザー向けサービス
- 社内オペレータ向け管理画面
- 社内用AIプラットフォーム「Dev Genius」

各サービスチームからpreview環境の要望が上がっていたが、個別に構築すると：

- 手間がかかる
- 設定の管理方式にばらつきが発生
- アクセス制御の統制が困難

→ **プラットフォームエンジニアリング的アプローチ**として、共通の仕組みを構築

---

## Preview環境のアーキテクチャ

### Ubieのインフラ構成

- プライバシー・セキュリティの観点から**マルチクラスタ構成**を採用
- 複数のマイクロサービスとモジュラモノリスの集合体

### Preview環境の構成

![preview環境](https://storage.googleapis.com/zenn-user-upload/8a65766ccb34-20251220.png)

- マルチクラスタ構成を拡張し、**previewをデプロイする専用クラスタ**を新規作成
- フロントエンドサービスはSSR（Server-Side Rendering）を行い、他クラスタのバックエンドサービスと通信
- **サービスメッシュ内で通信が閉じている点**がVercelなどの既存ソリューションより優位
- 外部通信用にpreviewクラスタに1つのGatewayを作成し、全preview環境で共有

### 環境選択

previewクラスタは**qa環境**と**stg環境**のフリートにそれぞれ作成されており、ユーザーは作成時にどちらにデプロイするか選択可能。

### メリット

- 独立したクラスタで動作しながら実際のバックエンドサービスと連携
- ローカル環境では再現困難な統合テストが可能
- 実際のデータを使った動作確認も可能

---

## Previewへの通信方式

### 課題

1つのアプリケーションに対して複数バージョンのコンテナがデプロイされる（例：PR#100用とPR#101用のPodが同居）

### 選択肢

| 方式 | 例 |
|------|-----|
| **ホスト名** | `foobar-100.example.com` → PR#100のコンテナに接続 |
| **HTTPヘッダ** | ホスト名は共有、`ubie-preview: foobar-100`ヘッダで振り分け |

### 採用した方式：HTTPヘッダ方式

**理由**：外部IDPを使った認証で、リダイレクトURIを固定する必要があったため

利用者はpreview作成時に指定すべきヘッダが通知され、**Chrome拡張**でヘッダを設定してアクセス（セキュリティ観点からVibe Codingで内製）

### HTTPRouteリソースの例

```yaml
apiVersion: gateway.networking.k8s.io/v1beta1
kind: HTTPRoute
metadata:
  name: foobar-preview-100
  namespace: jp-foobar-p-stg
spec:
  hostnames:
  - "foobar.example.com"
  parentRefs:
  - group: gateway.networking.k8s.io
    kind: Gateway
    name: preview-gateway
    namespace: gateway
  rules:
  - matches:
    - headers:
      - type: Exact
        name: ubie-preview
        value: "foobar-100"
    backendRefs:
    - group: ""
      kind: Service
      name: foobar-preview-100
      port: 80
```

### 補足情報

- **KubernetesのGatewayコントローラ**は同じ`hostnames`を持つ複数の`HTTPRoute`をうまくマージしてくれる
- 一方、**IstioのVirtualService**では同様のことをすると未定義の動作をする可能性あり

---

## アクセス制御：IAP（Identity-Aware Proxy）

preview環境はインターネットから直接アクセス不可にする必要があり、**Google CloudのIAP**を使用。

### GCPBackendPolicyリソースの例

```yaml
apiVersion: networking.gke.io/v1
kind: GCPBackendPolicy
metadata:
  name: foobar-preview-100
  namespace: jp-foobar-p-stg
spec:
  default:
    iap:
      enabled: true
      oauth2ClientSecret:
        name: iap-secret
      clientID: myoauthclientid.apps.googleusercontent.com
  targetRef:
    group: ""
    kind: Service
    name: foobar-preview-100
```

IAPのclient ID/secretを全preview環境で使い回すことで、手軽にセキュアな環境を実現。

---

## Preview作成フロー

### 操作方法

**GitHubのPRにコメントを投稿するだけ**でpreview環境を作成可能

![preview環境をPRで起動する](https://storage.googleapis.com/zenn-user-upload/72ca61f2116d-20251220.png)

### フロー詳細

![preview環境の起動フロー](https://storage.googleapis.com/zenn-user-upload/33cc8454d137-20251220.png)

1. **PRにコメント付与** → webhookでCloud Runにリクエスト送信（環境等を引数で指定可）
2. **Cloud Runが構成情報をFirestoreに保存**（イメージビルド後に再利用するため）
3. **コンテナイメージビルド** → Artifact Registryにpush
4. **Artifact RegistryがpushをCloud Runに通知**
5. **Cloud Runがマニフェスト生成**
   - Firestoreから構成情報を取得
   - 選択した環境からコピー＆編集
   - HTTPRoute等の新規マニフェスト生成
   - preview環境固有のConfigMap値を挿入可能
6. **GHAがマニフェストをpreviewクラスタにapply**
7. **GHAがPRにコメント**（指定すべきHTTPヘッダと完了通知）

### メリット

- 追加設定なしで既存サービスの設定をベースにpreview環境作成
- マニフェスト生成の自動化により設定の一貫性を確保

---

## まとめ

### Preview環境の効果

| 効果 | 詳細 |
|------|------|
| **ボトルネック解消** | PRごとに独立した動作確認環境を提供 |
| **開発効率向上** | 順番待ちなく即座に動作確認可能 |
| **チーム共有の容易さ** | URLでアクセス可能なため、成果物を簡単に共有・認識合わせがスムーズ |
| **統合テスト** | 実際のバックエンドサービスと連携した動作確認が可能 |
| **認知負荷軽減** | GitHubコメントだけで環境作成 |

### 技術的なポイント

- マルチクラスタ構成を活用した設計
- preview環境を独立クラスタで運用しながらバックエンドと連携
- プラットフォームエンジニアリング的アプローチで共通基盤を構築

### 今後の展望

- バックエンドAPIサービスへの対応拡大
- より高度な設定オプションの提供
