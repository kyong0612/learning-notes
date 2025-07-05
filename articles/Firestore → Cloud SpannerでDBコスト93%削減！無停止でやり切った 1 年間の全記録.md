---
title: "Firestore → Cloud SpannerでDBコスト93%削減！無停止でやり切った 1 年間の全記録"
source: "https://zenn.dev/kauche/articles/1e733da3748ee1"
author:
  - "a-thug"
published: 2025-07-02
created: 2025-07-05
description: |
  ソーシャルEC「カウシェ」が、1年をかけて本番環境のデータベースをFirestoreからCloud Spannerへ無停止で移行した記録。この移行により、データベース費用を93%削減し、パフォーマンスも大幅に改善しました。本記事では、移行の背景、クリーンアーキテクチャを活用した4段階の移行戦略、リスク管理、E2Eテストによる安全性確保、そして移行から得られた学びまで、その全貌を解説します。
tags:
  - "Firestore"
  - "Cloud Spanner"
  - "Google Cloud"
  - "Go"
  - "Database Migration"
---

ソーシャルEC「カウシェ」は、2024年5月から2025年5月にかけて、本番環境で運用中のFirestoreからCloud Spannerへのデータベース完全移行を、サービスを一切停止することなく実施しました。このプロジェクトは、40以上のコレクション、数億件のデータを扱う大規模なもので、結果的に**データベース費用を93%削減**し、パフォーマンスも大幅に改善させることに成功しました。

この記事では、その1年間にわたる移行プロジェクトの全貌を解説します。

## なぜFirestoreからCloud Spannerに移行したのか

### 当初Firestoreを選択した背景

2020年のサービス開始当初、以下の理由からFirestoreは魅力的な選択肢でした。

- **コスト**: 当時のSpannerは高コストで、従量課金制のFirestoreはスタートアップにとって初期投資を抑えられました。
- **手軽さ**: 安価に素早く始められる点がメリットでした。

### サービス成長とともに顕在化したFirestoreの課題

サービスの成長に伴い、Firestoreの以下の課題が顕在化しました。

- **複雑なクエリの制限**: 複合インデックスの管理コストが高く、アプリケーション側でのソートが必要になるケースがありました。
- **コストの増大**: 読み取り・書き込みコストがサービス規模に比例して増大し、最大の課題となりました。
- **分析クエリの性能不足**: BigQueryへのデータ転送パフォーマンスが十分ではありませんでした。
- **トランザクションの制約**: 500件のドキュメント書き込み制限がありました。

### Cloud Spannerによる課題解決

Cloud Spannerはこれらの課題を解決できると判断しました。

- **複雑なクエリの実行**: SQLによる高速な結合や集計が可能です。
- **コストの予測可能性**: ノード時間課金のため、コストの急増リスクを回避できます。
- **分析性能**: BigQueryとの高速連携により、分析処理が効率化されます。
- **大容量トランザクション**: 1トランザクションあたりのmutation数が大幅に拡張されます。

## 移行戦略の基本設計

### クリーンアーキテクチャを活用した段階的移行

既存のコードベースがクリーンアーキテクチャを採用していたため、移行作業は主にRepositoryレイヤーの変更に集約できました。SpannerリポジトリがFirestoreリポジトリを内包する設計により、メソッド単位での段階的な移行を実現しました。

```go
// db/spanner/user_repository.go
type userRepository struct {
    usecase.UserRepository  // Firestore repositoryを埋め込み
    client *libspanner.Client
}

func NewUserRepository(
    firestoreRepo usecase.UserRepository,
    client *libspanner.Client,
) (usecase.UserRepository, error) {
    return &userRepository{
        UserRepository: firestoreRepo,  // 段階的移行のためFirestoreを保持
        client:         client,
    }, nil
}
```

### 4段階の移行プロセス

各コレクションの移行は、以下の4段階で慎重に進めました。

1. **Double Write（両DBへの書き込み）**
    - 書き込み処理の際にまずFirestoreに書き込み、成功したらSpannerにも書き込む構成にしました。

2. **データ移行**
    - バッチ処理で既存データをFirestoreからSpannerへ移行しました。レート制限を考慮し、チャンクごとに処理を実行しました。

3. **Read切り替え**
    - 読み取り処理をSpannerから行うように切り替えました。書き込みは両DBに継続し、問題発生時にはCloud Runのrevision機能で即座にロールバックできる体制を整えました。

4. **Write切り替え**
    - 最終段階として、書き込み処理をSpannerのみに変更し、Firestoreへの依存を完全に排除しました。

## 移行の優先順位付けとリスク管理

### 段階的アプローチ

移行は **「移行が比較的簡単で、費用削減効果が高いコレクション」** を優先する方針で進めました。移行難易度（データ構造、影響範囲）とFirestoreのアクセス量を総合的に評価し、優先順位を決定しました。

### Key Visualizerによる監視

各段階でFirestore Key Visualizerを活用し、移行対象コレクションへのアクセスが完全になくなったこと（アクセスグラフが真っ黒になる）を確認してから次のステップに進むことで、安全な移行を実現しました。

![](https://storage.googleapis.com/zenn-user-upload/37ed47a32130-20250701.png)

## トランザクション処理と冪等性の確保

FirestoreとSpannerのクライアントライブラリはトランザクションのAbort時に自動でリトライするため、ビジネスロジックは冪等に設計する必要がありました。リクエストデータからハッシュIDを生成することで、ビジネスロジックレベルでの冪等性を担保しました。

```go
// リクエストデータからハッシュIDを生成して冪等性を保証
func generateIdempotentUserID(userID string, requestID string) string {
    data := fmt.Sprintf("%s:%s", userID, requestID)
    hash := sha256.Sum256([]byte(data))
    return hex.EncodeToString(hash[:])
}
```

## E2Eテストによる安全性確保

データベース実装に依存しないE2Eテストの存在が、移行の安全性を担保する上で極めて重要でした。テストはAPIの入出力のみを検証する設計だったため、DBを切り替えてもテストコードを一切変更する必要がありませんでした。

```go
// e2etests/create_user_profile_test.go
func TestCreateUserProfile_OK(t *testing.T) {
    res := customers.CreateUserProfile(t, client, ctx, &v1.CreateUserProfileRequest{
        UserProfileIconId:   "1",
        UserProfileNickName: "Bob（自動テストユーザー）",
    })
    
    // APIレスポンスのみを検証（DB実装は無関係）
    if res.Result.Code != v1.CreateUserProfileResponse_Result_CODE_OK {
        t.Errorf("res.Result.Code is %v, want CODE_OK", res.Result.Code)
    }
}
```

## 移行プロセスの型化とLLM活用

40以上のコレクションで移行を繰り返すうちに、4段階の移行プロセスが「型」として確立されました。これにより、後期の移行作業では、確立されたパターンをLLMに学習させ、新しいコレクションの移行コードを自動生成するレベルまで作業を標準化・効率化できました。

## 技術的な注意点と学び

- **Spannerのインデックス設計**: ホットスポットを避けるためのインデックス設計が重要でした。
- **Firestoreの幸運**: Firestoreのドキュメント階層が浅い構造だったため、RDBへのマッピングが比較的容易でした。
- **Cloud Runの活用**: revision切り替えによる即時ロールバックが可能で、移行リスクを大幅に軽減できました。

## コスト削減とパフォーマンス向上

移行によって以下の成果が得られました。

- **DB費用**: **93%削減**
- **パフォーマンス**: SQLによる複雑なクエリの実行速度が向上
- **分析時間**: BigQuery連携による分析クエリの実行時間が短縮
- **開発効率**: SQLの表現力により実装が簡素化

## まとめ

1年間にわたる無停止でのデータベース移行は、以下の成功要因によって達成できました。

1. **クリーンアーキテクチャ**: 影響範囲をリポジトリ層に限定。
2. **段階的移行**: 4段階のプロセスでリスクを最小化。
3. **E2Eテスト**: DB実装に依存しない安全網を構築。
4. **慎重な監視**: Key Visualizerで確実なトラフィック移行を確認。
5. **Cloud Runの活用**: 即時ロールバック可能なデプロイ環境。

この経験は、適切な設計と慎重な実行計画があれば、複雑な本番環境でも安全にデータベース移行が可能であることを証明しました。
