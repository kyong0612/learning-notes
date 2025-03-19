# CursorのProject Rules運用のベストプラクティスを探る

ref: <https://zenn.dev/ks0318/articles/b8eb2c9396f9cb>

### 概要

- Project Rulesとは：AIエディタCursorで「AIにどう動いてほしいか」を伝える設定ファイル（.mdc形式）
- 従来の.cursorrulesとの違い：フォルダやファイル単位でルールの適用を制御可能

### 運用の基本方針

1. **日々アップデートして育てる**
   - AIへの要望は開発中に無限に生まれる
   - モデルの進化やツールの内部プロンプト変更に合わせた更新が必要

2. **育てやすい構成にする**
   - mdcファイルは基本的に4種類に分ける
     - 000_general.mdc：基本的な指示
     - 001_bestPractices_common.mdc：共通コーディングルール
     - 002_bestPractices_frontend.mdc：フロントエンドルール
     - 003_bestPractices_backend.mdc：バックエンドルール
   - 実際に編集するのは細かく分けられたmdファイル
   - この構成のメリット：
     - 指示追加時の書き場所が明確
     - チームでの知識共有が容易
     - コンフリクトが起きにくい

3. **複数のmdファイルを結合するスクリプトを作成する**
   - MDCファイルから直接MDファイルを読み込む方法は安定しない
   - 複数のmdファイルを結合してmdcファイルを生成するスクリプトを用意
   - 新ルール追加時は「yarn build:mdc」でmdcファイルを更新

4. **設定パラメータの注意点**
   - Auto Attach（globs）、Description、alwaysApplyは全て慎重に設定する
   - エージェントがルールを適用する判断フロー：
     1. alwaysApplyの確認
     2. Auto Attach（globs）の確認（alwaysApplyがfalseの場合）
     3. Descriptionの確認
   - 落とし穴：
     - alwaysApplyを設定していてもDescriptionは必要
     - Auto Attachはプロンプトで@で参照したファイルに対して適用
     - globsの書き方には注意（配列形式は不可）
     - Descriptionだけでは基本的にルールが適用されない

### その他の知見

- ルールの編集もAIに任せられる
- 最強のオンボーディング資料にもなる
- ファイル名に番号をつけるとプロンプト内での参照が容易
- コンテキストウィンドウの制限はあるが、将来的な拡大を見据えてルールを充実させるべき

### 実装例とリファレンス

- 著者の実装サンプル：<https://github.com/ks0318-p/Cursor-Project-Rules>
- 他にも多数の参考情報が記事内で紹介されている
