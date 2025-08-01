---
title: "Go 1.25 リリース連載 log/slog"
source: "https://future-architect.github.io/articles/20250731a/"
author:
  - "Anton Zhiyanov"
published: "2025-06-26"
created: 
description: |
  Go 1.25の新機能（synctest, json/v2, GOMAXPROCS, 新GC, CSRF対策, WaitGroup.Go, FlightRecorder, os.Root, reflect.TypeAssert, T.Attr, slog.GroupAttrs, hash.Cloner）をインタラクティブな例で解説します。
tags:
  - "Go"
  - "Go1.25"
  - "slog"
  - "testing"
  - "performance"
---

この記事では、2025年8月にリリース予定のGo 1.25における主要な新機能や変更点について、インタラクティブなコード例を交えながら詳しく解説しています。

### 主な新機能と変更点

1. **`testing/synctest`**:
    * 並行処理コードのテストを容易にするためのパッケージです。
    * `synctest.Test`関数は、テストを「バブル」内で実行し、偽のクロックを使用して`time`パッケージの関数を制御します。これにより、タイムアウトのような時間依存のロジックを即座にテストできます。
    * `synctest.Wait`は、バブル内のすべてのゴルーチンがブロックされるまで待機し、テストの同期を容易にします。

2. **`json/v2`**:
    * 多くの破壊的変更を含むメジャーアップデートです。
    * `MarshalToFunc`と`UnmarshalFromFunc`により、カスタムのマーシャラ・アンマーシャラを柔軟に定義できます。
    * I/Oリーダー/ライターのサポート、ネストされたオブジェクトのインライン化、パフォーマンスの大幅な向上が含まれます。

3. **コンテナを意識した `GOMAXPROCS`**:
    * Goランタイムがcgroupsによって設定されたCPUクォータを認識し、`GOMAXPROCS`のデフォルト値を、ホストの論理CPU数とCPUクォータのいずれか小さい方に設定するようになりました。
    * これにより、コンテナ環境でのリソース利用がより効率的になります。

4. **Green Tea ガベージコレクタ (実験的)**:
    * 多数の小さなオブジェクトを生成するプログラム向けに最適化された新しいGCアルゴリズムです。
    * メモリを大きな連続したブロック（スパン）でスキャンすることで、特に多コアCPUシステムでのGCオーバーヘッドを10〜40%削減することを目指します。
    * `GOEXPERIMENT=greenteagc`で有効化できます。

5. **CSRF (Cross-Site Request Forgery) 保護**:
    * `http.NewCrossOriginProtection`タイプが追加され、安全でないクロスオリジンリクエストを拒否することでCSRF攻撃を防ぎます。
    * `Sec-Fetch-Site`ヘッダーや`Origin`/`Host`ヘッダーを検証してクロスオリジンリクエストを検出します。

6. **`sync.WaitGroup.Go`**:
    * `wg.Add(1)`と`defer wg.Done()`の一般的なパターンを簡略化する新しいメソッドです。
    * ゴルーチン内で実行する関数を引数に取り、自動的にカウンタのインクリメント・デクリメントを行います。

7. **`trace.FlightRecorder`**:
    * 実行トレース（関数呼び出し、メモリ割り当てなど）をサイズや期間が限定されたスライディングウィンドウ内に収集する機能です。
    * 問題が発生した際の直前のプログラムの挙動を記録・分析するのに役立ちます。

8. **`os.Root` の機能拡張**:
    * ファイルシステム操作を指定されたディレクトリに制限する`os.Root`型に、`Chmod`, `Chown`, `Chtimes`, `Link`, `MkdirAll`, `RemoveAll`, `Rename`, `Symlink`, `WriteFile`, `ReadFile`といった多数のメソッドが追加されました。

9. **`reflect.TypeAssert`**:
    * `reflect.Value`を特定の型に戻すための、より慣用的で効率的なジェネリック関数です。

10. **テスト関連の機能強化 (`T.Attr`, `T.Output`)**:
    * `T.Attr`でテストにメタデータ（Issue番号など）を付与できます。
    * `T.Output`でテストの出力ストリームにアクセスし、アプリケーションのログをテストログに統合できます。

11. **`slog.GroupAttrs`**:
    * `slog.Attr`のスライスから直接グループを作成できるようになり、構造化ロギングがより便利になりました。

12. **`hash.Cloner`**:
    * ハッシュ関数の現在の状態をコピーできる`Clone()`メソッドを持つ新しいインターフェースです。標準ライブラリのすべてのハッシュ実装でサポートされます。

### 結論

Go 1.25は、並行処理テストの改善、JSON処理の刷新、ランタイムの最適化、セキュリティ強化など、多岐にわたる重要な改善が含まれており、非常に充実したリリースとなっています。
