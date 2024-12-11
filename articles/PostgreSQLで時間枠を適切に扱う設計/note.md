# PostgreSQLで時間枠を適切に扱う設計

ref: <https://soudai.hatenablog.com/entry/postgresql-schedule-design>

## 時間枠管理の課題

時間枠の管理には以下のような複雑な要素があります：

- 範囲の包含関係の判定
- 時間枠の重複チェック
- 隣接する時間枠の処理[1]

## PostgreSQLの範囲型による解決策

**テーブル設計**

```sql
CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    car_id INT NOT NULL REFERENCES cars(car_id),
    reservation_time tstzrange NOT NULL
);
```

**主な機能**

- 1つのカラムで開始・終了時刻を管理
- 直感的な演算子による範囲の比較
- GiSTインデックスによる高速な検索[1]

## 排他制約によるダブルブッキング防止

```sql
ALTER TABLE reservations ADD CONSTRAINT reservations_no_overlap 
EXCLUDE USING gist (
    car_id WITH =,
    reservation_time WITH &&
);
```

この制約により、同一車両の予約時間の重複を自動的に防止できます[1]。

## PostgreSQL 14の複数範囲型

新機能として以下が可能になりました：

- 営業時間から予約済み時間を差し引いた空き時間の計算
- 複数の予約枠の一括管理
- より柔軟な時間枠の演算[1]

## 実用的な活用例

- ホテルの部屋予約管理
- 車両のレンタル予約
- 従業員のシフト管理
- 会議室予約システム[1]

## 注意点

- PostgreSQL固有の機能のため、他のDBMSへの移行が困難
- ORMとの互換性に制限がある場合がある
- View定義による対応が必要なケースがある[1]

Sources
[1] postgresql-schedule-design <https://soudai.hatenablog.com/entry/postgresql-schedule-design>
[2] PostgreSQLで時間枠を適切に扱う設計 - そーだいなるらくがき帳 <https://soudai.hatenablog.com/entry/postgresql-schedule-design>
