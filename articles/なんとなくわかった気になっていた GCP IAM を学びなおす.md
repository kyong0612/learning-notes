---
title: "なんとなくわかった気になっていた GCP IAM を学びなおす"
source: "https://zenn.dev/kimkiyong/articles/8f935f3c694a9a"
author:
  - "[[きょん (kimkiyong)]]"
  - "[[Zenn]]"
published: 2026-01-17
created: 2026-01-18
description: "GCP IAMの仕組みを基礎から体系的に整理し、Principal、Role、Policy、Binding、Impersonation、Workload Identity Federationなどの概念を「なんとなく」から「しっかり」理解できるよう解説した技術記事"
tags:
  - "clippings"
  - "Google Cloud"
  - "IAM"
  - "GCP"
  - "Service Account"
  - "Workload Identity Federation"
---

## 概要

GCP IAMを日常的に使っているが、Principal と Member の違いや、Policy と Binding の関係、Impersonation や Workload Identity Federation の仕組みなど、「なんとなく」の理解に留まっていることを解消するための体系的な解説記事。

---

## 1. IAMの全体像

GCP IAMは **「誰が(WHO)、何を(WHAT)、どのリソースに対して(WHERE)できるか」** を制御するシステム。

| 要素 | 説明 | 例 |
|------|------|-----|
| **Principal (主体)** | 誰が | User, Service Account, Group |
| **Role (権限の集合)** | 何を | Basic, Predefined, Custom |
| **Resource (対象)** | どこに | Organization, Folder, Project, 個別リソース |

これらを **Binding** で結びつけ、**Policy** として管理する。

### アクセス判定のフロー

```
1. Principal Access Boundary (PAB) → アクセス資格があるか？
2. Deny Policy → 明示的に拒否されていないか？ (Allow より優先)
3. Allow Policy → 必要な権限が付与されているか？
```

**重要:** Deny が Allow より優先される。

---

## 2. Principal（プリンシパル）

**Principal** は「アクションを実行する主体」。以前は **Member** と呼ばれていたが、現在は Principal が標準。

### Principal の種類

| 種類 | 識別子の形式 | 用途 |
|------|-------------|------|
| Google Account | `user:alice@example.com` | 個人ユーザー |
| Service Account | `serviceAccount:my-sa@project.iam.gserviceaccount.com` | アプリケーション用ID |
| Google Group | `group:developers@example.com` | ユーザーのグループ |
| Google Workspace Domain | `domain:example.com` | ドメイン内の全ユーザー |
| allUsers | `allUsers` | インターネット上の誰でも（認証不要） |
| allAuthenticatedUsers | `allAuthenticatedUsers` | Googleアカウント保持者全員 |

### v2 形式の Principal 識別子

Deny Policy や PAB Policy では、より詳細な v2形式を使用：

```
# ユーザー
principal://goog/subject/alice@example.com

# サービスアカウント
principal://iam.googleapis.com/projects/-/serviceAccounts/my-sa@project.iam.gserviceaccount.com

# グループ
principalSet://goog/group/developers@example.com
```

- `principal://` は単一のID
- `principalSet://` は複数のIDの集合

---

## 3. Service Account の二面性

Service Account（SA）は GCP IAM で最も重要かつ混乱しやすい概念。SAは **「IDとして」** と **「リソースとして」** の二つの顔を持つ。

| 使い方 | 説明 | 例 |
|--------|------|-----|
| **IDとして** | SA が他のリソースにアクセス | 「SA に Storage Admin を付与」 |
| **リソースとして** | 誰が SA を使えるか管理 | 「User に SA の使用権を付与」 |

### Service Account の種類

| 種類 | 説明 | 管理責任 |
|------|------|----------|
| **User-managed SA** | ユーザーが明示的に作成 | ユーザー |
| **Default SA** | 特定サービス有効化時に自動作成 | ユーザー（⚠️過剰権限に注意） |
| **Service Agent** | Googleが内部用に作成 | Google |

**注意:** Default SA は多くの場合 Editor 相当の過剰な権限を持つため、本番環境では専用の SA を作成することを推奨。

---

## 4. Role と Permission の関係

**Permission** は「何ができるか」を表す最小単位：

```
<service>.<resource>.<verb>

例:
compute.instances.create    # VMインスタンスを作成
storage.objects.get         # オブジェクトを読み取り
```

Permission を直接 Principal に付与することはできず、Permission をまとめた **Role** を付与する。

### Role の種類

| 種類 | 説明 | 推奨度 |
|------|------|--------|
| **Basic Roles** | owner, editor, viewer | ⚠️ 非常に広範。本番環境では使用を避ける |
| **Predefined Roles** | Googleが作成・維持。サービスごとに細分化 | ✓ 最小権限の原則に沿った運用が可能 |
| **Custom Roles** | ユーザーがPermissionを選んで独自に定義 | ✓ 最も細かい制御が可能 |

### よく使う Predefined Roles

| Role | 説明 |
|------|------|
| `roles/iam.serviceAccountUser` | SA をリソースにアタッチできる |
| `roles/iam.serviceAccountTokenCreator` | SA の短期認証情報を生成（Impersonation に必要） |
| `roles/iam.workloadIdentityUser` | GKE Workload から SA を使用 |
| `roles/iam.securityAdmin` | IAM ポリシー全般の管理 |

---

## 5. Policy の種類と評価順序

### 5.1 Allow Policy（許可ポリシー）

最も基本的なポリシー。Principal に Role を付与する。

```yaml
bindings:
  - members:
      - user:alice@example.com
    role: roles/storage.objectViewer
```

### 5.2 Deny Policy（拒否ポリシー）

Allow Policy より優先され、特定の Permission を明示的に拒否。

**ユースケース:**
- 重要リソースの誤削除防止
- 特定操作の組織全体での禁止
- 緊急時のアクセス遮断

### 5.3 Principal Access Boundary (PAB) Policy

Principal がアクセス可能なリソースの範囲を制限。

**ユースケース:**
- データ流出防止
- フィッシングで別組織のRoleを付与されても、PABがブロックしてデータ流出を防ぐ

### 評価順序

```
1. PAB      → アクセス資格がなければ即座に DENY
2. Deny     → 明示的拒否があれば DENY（Allow より優先）
3. Allow    → 権限があれば ALLOW、なければ DENY
```

---

## 6. Binding とは何か

**Binding** は Principal と Role を結びつける構造。

構成要素：
- **Members**: Principal のリスト
- **Role**: 付与するRole
- **Condition** (オプション): 条件付きアクセス

### Conditional Role Binding

Condition を追加することで、より細かい制御が可能。

```yaml
bindings:
  - members:
      - user:contractor@example.com
    role: roles/storage.objectViewer
    condition:
      title: "Temporary access until March 2026"
      expression: |
        request.time < timestamp("2026-03-01T00:00:00Z")
```

**使用可能な条件属性:**

| 属性 | 説明 | 例 |
|------|------|-----|
| request.time | リクエスト時刻 | 期限付きアクセス |
| resource.name | リソース名 | 特定リソースのみ許可 |
| resource.type | リソースタイプ | VM のみ許可 |
| resource.matchTag() | リソースタグ | 本番環境のみ許可 |

---

## 7. Resource Hierarchy と継承

GCP のリソースは階層構造を持ち、Allow Policy は親から子へ継承される。

```
Organization → Folder → Project → Resources
```

### 継承のルール

- **Allow Policy は累積（Union）される**: 親で付与された権限 + 子で追加付与された権限
- **Deny Policy も継承される**: Allow より優先

---

## 8. Impersonation を正しく理解する

**Impersonation（なりすまし）** は、認証済みの Principal が別の Service Account として振る舞い、その SA の権限でリソースにアクセスする仕組み。

### なぜ Impersonation が必要か？

1. **一時的な権限昇格**: 普段は Viewer だが、デプロイ時だけ Admin 権限が必要
2. **ローカル開発**: 本番 SA の権限で動作確認したい（SA Key を発行せずに）
3. **権限テスト**: 「この SA でこの操作ができるか？」を確認

### 必要な Role

| Role | 用途 |
|------|------|
| `roles/iam.serviceAccountTokenCreator` | Access Token 生成、--impersonate-service-account フラグ |
| `roles/iam.serviceAccountUser` | SA をリソースにアタッチ（Impersonation ではない） |

### gcloud での Impersonation

```bash
# 単発コマンドで Impersonate
gcloud storage buckets list \
  --impersonate-service-account=deploy-sa@project.iam.gserviceaccount.com

# ADC (Application Default Credentials) で Impersonate
gcloud auth application-default login \
  --impersonate-service-account=deploy-sa@project.iam.gserviceaccount.com
```

### Impersonation vs SA Key

| 項目 | Impersonation | SA Key |
|------|---------------|--------|
| 認証情報の寿命 | 短期（1時間） | 長期（最大10年） |
| 漏洩リスク | 低い | 高い |
| 事前認証 | 必要 | 不要 |
| 監査ログ | 元のID + SA 両方記録 | SA のみ |
| **推奨度** | ✓ 推奨 | ✗ 非推奨 |

---

## 9. Workload Identity Federation の仕組み

**Workload Identity Federation** は、外部 IdP（AWS、Azure、GitHub Actions など）の認証情報を使って GCP リソースにアクセスする仕組み。SA Key を使わずに、外部ワークロードから GCP を操作できる。

### 全体フロー

1. 外部ワークロード（AWS EC2, GitHub Actions など）が外部 IdP から認証情報を取得
2. GCP Security Token Service に送信
3. Workload Identity Pool で検証
4. Federated Token 発行 → SA Impersonation または Direct Resource Access
5. GCP Resources にアクセス

### 設定例：GitHub Actions → GCP

```yaml
jobs:
  deploy:
    permissions:
      contents: read
      id-token: write  # OIDC トークン取得に必要

    steps:
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: 'projects/123456789/locations/global/workloadIdentityPools/github-pool/providers/github-provider'
          service_account: 'deploy-sa@my-project.iam.gserviceaccount.com'
```

### GKE Workload Identity

Kubernetes Service Account (KSA) と Google Service Account (GSA) を紐付ける：

```bash
# GSA に KSA からの Impersonation を許可
gcloud iam service-accounts add-iam-policy-binding \
  my-gsa@project.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="serviceAccount:project.svc.id.goog[namespace/my-ksa]"

# KSA に annotation を追加
kubectl annotate serviceaccount my-ksa \
  --namespace namespace \
  iam.gke.io/gcp-service-account=my-gsa@project.iam.gserviceaccount.com
```

---

## 10. 実践：よくあるユースケースと設定例

### ユースケース1: 開発者に Storage 読み取り権限を付与

```bash
gcloud projects add-iam-policy-binding my-project \
  --member="group:developers@example.com" \
  --role="roles/storage.objectViewer"
```

### ユースケース2: 期限付きの一時アクセス権を付与

```bash
gcloud projects add-iam-policy-binding my-project \
  --member="user:contractor@example.com" \
  --role="roles/compute.viewer" \
  --condition='expression=request.time < timestamp("2026-03-01T00:00:00Z"),title=temp-access'
```

### ユースケース3: SA の Impersonation 権限を付与

```bash
gcloud iam service-accounts add-iam-policy-binding \
  deploy-sa@my-project.iam.gserviceaccount.com \
  --member="user:alice@example.com" \
  --role="roles/iam.serviceAccountTokenCreator"
```

### ユースケース4: 権限のトラブルシューティング

```bash
gcloud policy-troubleshoot iam \
  //storage.googleapis.com/projects/_/buckets/my-bucket \
  --permission=storage.objects.get \
  --principal-email=alice@example.com
```

---

## 11. ベストプラクティス

1. **最小権限の原則を徹底**: Basic Roles を避け、Predefined または Custom Roles を使用
2. **個人ではなくグループに権限を付与**: 管理の簡素化
3. **SA Key を使わない**: Workload Identity Federation や Impersonation を推奨
4. **階層を適切に活用**: Organization → Folder → Project → Resource
5. **Deny Policy でガードレールを設置**: 本番環境での誤削除防止など
6. **定期的な監査**: IAM Recommender で過剰権限を検出

```bash
gcloud recommender recommendations list \
  --project=my-project \
  --location=global \
  --recommender=google.iam.policy.Recommender
```

---

## 12. まとめ

| カテゴリ | 内容 |
|----------|------|
| **登場人物** | Principal (誰が), Role (何を), Resource (どこに) |
| **結びつける仕組み** | Binding: Principal + Role + Condition, Policy: Binding の集合 |
| **Policy の優先度** | 1. PAB → 2. Deny → 3. Allow |
| **認証・認可の仕組み** | Impersonation, Workload Identity Federation |
| **継承** | Allow Policy は親から子へ累積、Deny は Allow より優先 |

**キーポイント:**
- 最小権限の原則を守る
- Deny Policy でガードレールを設置
- Workload Identity Federation で SA Key を排除

---

## 参考資料

- [IAM overview | Google Cloud](https://cloud.google.com/iam/docs/overview)
- [Understanding allow policies | Google Cloud](https://cloud.google.com/iam/docs/allow-policies)
- [Deny policies | Google Cloud](https://cloud.google.com/iam/docs/deny-overview)
- [Principal access boundary policies | Google Cloud](https://cloud.google.com/iam/docs/principal-access-boundary-policies)
- [Service account impersonation | Google Cloud](https://cloud.google.com/iam/docs/service-account-impersonation)
- [Workload Identity Federation | Google Cloud](https://cloud.google.com/iam/docs/workload-identity-federation)
