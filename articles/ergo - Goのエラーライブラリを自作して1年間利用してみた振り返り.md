---
title: "ergo - Goのエラーライブラリを自作して1年間利用してみた振り返り"
source: "https://tech.newmo.me/entry/2025/12/07/090000"
author:
  - "tenntenn"
  - "[[newmo]]"
published: 2025-12-07
created: 2025-12-09
description: |
  newmo社が開発したGoのエラーライブラリ「ergo」の特徴と1年間の運用を振り返る記事。スタックトレースの付与、slog.Attrによる属性の追加、エラーコードによるエラーハンドリングの統一化、静的解析ツールergocheckの活用について解説。OSSとして公開されたergoの設計思想と実践的な使用例を紹介。
tags:
  - Go
  - エラーハンドリング
  - ergo
  - 静的解析
  - OSS
  - newmo
  - slog
---

## 概要

newmo社が自作したGoのエラーライブラリ「[ergo](https://github.com/newmo-oss/ergo)」について、その特徴と1年間の運用経験をまとめた記事。Goのエラー処理においてデファクトスタンダードが不在な現状を背景に、ergoがどのような問題を解決し、どのように運用されてきたかを解説している。

## 背景：Goのエラー処理の現状

### エラーライブラリの変遷

- **過去**: `pkg/errors` や `golang.org/x/xerrors` がデファクトスタンダード
- **現在（2025年）**: デファクトスタンダードと呼べるライブラリが不在
- **標準の進化**:
  - Go 1.13: `errors.Is`、`errors.As`、エラーのラップ機能導入
  - Go 1.20: `errors.Join` 導入
  - Go 1.26（予定）: `AsType` 関数導入予定

### 標準ライブラリの制限

- スタックトレースを付与する機能がrevertされたため、標準の `errors` パッケージではスタックトレースを付与できない
- [Go公式ブログ](https://go.dev/blog/error-syntax)で、言語仕様の大きな変更によるエラー処理改善は今後行わない方針が発表

## ergoの特徴

### 1. スタックトレース

#### 基本機能

- `ergo.New` や `ergo.Wrap` でエラー作成時にスタックトレースを付与
- [newmo-oss/go-caller](https://github.com/newmo-oss/go-caller) を使用してスタックトレースを取得
- **スタックトレースは1度だけ付与** — ルートエラーに付与されていれば十分

```go
func f() error {
    err := ergo.New("error")
    return err
}

func g() {
    err := f()
    st := ergo.StackTraceOf(err)
    for _, frame := range st {
        fmt.Printf("%s/%s:%d\n", frame.PkgPath(), frame.File(), frame.Line())
    }
}
```

#### センチネルエラー

パッケージ変数として宣言するエラーには `ergo.NewSentinel` を使用：

```go
// NG: スタックトレースが付与される（意味がない）
var ErrSomething1 = ergo.New("error something")

// OK: スタックトレースが付与されない
var ErrSomething2 = ergo.NewSentinel("error something")
```

### 2. 属性の追加（slog.Attr）

#### 命名の由来

「ergo」はラテン語で「それゆえに」を意味し、「それゆえにエラーになった」という形で原因や状態を特定できることを意図。

#### 機能

- 標準の `log/slog` パッケージの `Attr` 型をエラーに付与可能
- `ergo.AttrsAll` 関数でイテレータとして属性を取得
- エラーがラップされる過程で属性が**伝播**

```go
// 属性の付与
err := ergo.New("error", slog.String("ride_id", rideID.String()))
err = ergo.Wrap(err, "wrapped", slog.String("vehicle_id", vehicleID.String()))
```

#### 実際の使用例

```go
func getVehicle(ctx context.Context, vehicleID uuid.UUID) (*Vehicle, error) {
    vehicle, err := db.FindVehicle(ctx, vehicleID)
    if err != nil {
        return nil, ergo.Wrap(err, "failed to get vehicle",
            slog.String("vehicle_id", vehicleID.String()))
    }
    return vehicle, nil
}

func dispatch(ctx context.Context, rideID, vehicleID uuid.UUID) error {
    vehicle, err := getVehicle(ctx, vehicleID)
    if err != nil {
        // さらにwrapしてride_idを追加
        return ergo.Wrap(err, "failed to dispatch",
            slog.String("ride_id", rideID.String()))
    }
    // ...
}
```

#### ログ出力結果

```json
{
  "level": "ERROR",
  "msg": "grpc request failed",
  "error": {
    "message": "failed to dispatch: failed to get vehicle: record not found",
    "stack": "...(省略)..."
  },
  "newmo.attrs": {
    "ride_id": "...",
    "vehicle_id": "..."
  }
}
```

**メリット**: Datadogで `@newmo.attrs.vehicle_id:<value>` のような構造化検索が可能。`fmt.Errorf` で文字列として埋め込むと不可能。

### 3. エラーコード

#### 概要

- `ergo.Code` 型でエラーコードを表現
- `ergo.NewCode` でキーとメッセージを指定して作成
- パッケージ変数として宣言することを想定
- 複数パッケージにまたがっても、キーに接頭語が不要（パッケージ名は自動付与）

#### 従来の方法（センチネルエラー）

```go
// ドメイン層でセンチネルエラーを定義
var (
    ErrVehicleNotFound  = errors.New("vehicle not found")
    ErrDriverNotFound   = errors.New("driver not found")
    ErrInvalidVehicleID = errors.New("invalid vehicle id")
    ErrInvalidDriverID  = errors.New("invalid driver id")
)

// ハンドラ層で errors.Is() を使って分岐
func (s *server) GetVehicle(ctx context.Context, req *pb.GetVehicleRequest) (*pb.GetVehicleResponse, error) {
    vehicle, err := s.service.GetVehicle(ctx, req.VehicleId)
    if err != nil {
        if errors.Is(err, ErrVehicleNotFound) {
            return nil, libgrpc.NewNotFound(err)
        }
        if errors.Is(err, ErrDriverNotFound) {
            return nil, libgrpc.NewNotFound(err)
        }
        // ... 複数のif文が続く
    }
    return &pb.GetVehicleResponse{Vehicle: vehicle}, nil
}
```

#### ergoを使用した方法

```go
// ドメイン層でエラーコードを定義
var (
    ErrCodeVehicleNotFound  = ergo.NewCode("VehicleNotFound", "vehicle not found")
    ErrCodeDriverNotFound   = ergo.NewCode("DriverNotFound", "driver not found")
    ErrCodeInvalidVehicleID = ergo.NewCode("InvalidVehicleID", "invalid vehicle id")
    ErrCodeInvalidDriverID  = ergo.NewCode("InvalidDriverID", "invalid driver id")
)

// ハンドラ層で switch ergo.CodeOf() を使って分岐
func (s *server) GetVehicle(ctx context.Context, req *pb.GetVehicleRequest) (*pb.GetVehicleResponse, error) {
    vehicle, err := s.service.GetVehicle(ctx, req.VehicleId)
    if err != nil {
        switch ergo.CodeOf(err) {
        case ErrCodeVehicleNotFound, ErrCodeDriverNotFound:
            return nil, libgrpc.NewNotFound(err)
        case ErrCodeInvalidVehicleID, ErrCodeInvalidDriverID:
            return nil, libgrpc.NewInvalidArgument(err)
        }
        return nil, libgrpc.NewInternal(err)
    }
    return &pb.GetVehicleResponse{Vehicle: vehicle}, nil
}
```

**メリット**:

- `switch` 文で見通しよく記述
- 複数のコードを同じcaseでまとめ可能
- エラーコードがログの `error.kind` に出力され、Datadogで検索可能

## 運用1年間の振り返り

### 既存コードの移行

- **移行戦略**: モジュラモノリスを採用しているため、モジュール（コンポーネント）ごとに段階的に移行
- **進め方**:
  1. まず1つのコンポーネントから試験的に移行
  2. 何名かで徐々に移行
  3. 移行完了したコンポーネントに静的解析ツールを適用
  4. 最終的にすべてのパッケージで強制

**現在であればClaude Codeなどを活用できた**という振り返りも。

### ergocheck — 静的解析ツール

ergoの正しい使用を強制するため、[ergocheck](https://pkg.go.dev/github.com/newmo-oss/ergo/ergocheck) という静的解析ツール（Linter）を自作。

#### 検出項目

| 項目 | 説明 |
|------|------|
| `errors.New` / `fmt.Errorf` の使用 | ergoの使用を強制し、スタックトレースの一貫性を確保 |
| エラーメッセージ内の `%d` / `%s` | 属性として情報を付与すべきところを文字列埋め込みしている検出 |
| nil エラーの検出 | `ergo.Wrap(nil, ...)` のような誤用を検出 |
| パッケージ変数での `ergo.New` 使用 | `ergo.NewSentinel` を使用すべき箇所を検出 |

#### nilエラー検出の技術的詳細

分岐によって第1引数がnilになるパスを検出するため、**静的単一代入（SSA）形式**に変換し、**制御フローグラフを有向グラフとして扱うアルゴリズム**を使用。

```go
// NG: 第1引数がnil
func f() error {
    return ergo.Wrap(nil, "something failed")
}

// NG: 分岐によって第1引数がnilになるパスが存在する
func g() error {
    var err error
    if someCondition {
        err = doSomething()
    }
    return ergo.Wrap(err, "something failed")
}

// OK: 第1引数がnilになるパスが存在しない
func h() error {
    err := doSomething()
    if err != nil {
        return ergo.Wrap(err, "something failed")
    }
    return nil
}
```

このアルゴリズムは、筆者が以前開発した[zagane](https://engineering.mercari.com/blog/entry/2019-06-10-120000/)（Google Cloud SpannerのLinter）と同様の手法。

### 現在の制限事項

#### 複数のエラーコードの付与

- **現状**: 1つのエラーに複数のエラーコードを付与できない
- **理由**: `ergo.CodeOf` が `errors.As` を使用しており、最初に見つけた1つしか返せない
- **提案されていた解決策**: [issue#66455](https://go.dev/issue/66455) の `errors.All` / `errors.AllAs` 関数 — しかしユースケース不足で不採択

### 社内メンバーからの改善要望

1. **属性の追加忘れが多い** — 追加を促す仕組みが必要
2. **`ergo.With` 関数の追加希望** — 関数の先頭で共通の属性を付与したい
3. **ergocheck の Suggested Fix 対応** — Go 1.26の `go fix` コマンドに対応希望

## まとめ

- **ergo**はnewmo社が開発したGoのエラーライブラリで、OSSとして公開済み
- **主な特徴**:
  - スタックトレースの自動付与（1度のみ）
  - `slog.Attr` による構造化された属性の付与・伝播
  - エラーコードによる簡潔なエラーハンドリング
- **静的解析ツール（ergocheck）**により、正しい使用を強制
- **1年間の運用**で大きな問題なく移行完了
- Goのエラーライブラリにお困りの場合は**ergoを選択肢の1つ**に

## リポジトリ

- [newmo-oss/ergo](https://github.com/newmo-oss/ergo)
- [newmo-oss/go-caller](https://github.com/newmo-oss/go-caller)
