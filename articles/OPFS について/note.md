# OPFS について

ref: |
    <https://github.com/voluntas/duckdb-wasm-parquet?tab=readme-ov-file#opfs-%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6>
    <https://developer.mozilla.org/ja/docs/Web/API/File_System_API/Origin_private_file_system>

## OPFS(オリジンプライベートファイルシステム)の特徴

1. パフォーマンスのために最適化されています[1]。

2. ページのオリジンには非公開で、ユーザーには見えません[1]。

3. セキュリティチェックや権限付与が不要なため、ファイルシステムアクセスAPIよりも高速です[1]。

4. ウェブワーカー内で同期呼び出しを利用できます[1]。

## OPFSと通常のファイルシステムの違い

1. ブラウザーのストレージ容量制限の対象となります[1]。

```javascript
const opfsRoot = await navigator.storage.getDirectory();
```

2. サイトのストレージデータをクリアすると削除されます[1]。

```javascript
await opfsRoot.removeEntry("example.txt");
```

3. ファイルアクセスに許可プロンプトやセキュリティチェックが不要です[1]。

4. ユーザーから見えることを意図していません[1]。

## OPFSの使用方法

1. `navigator.storage.getDirectory()` メソッドを呼び出してOPFSのルートにアクセスします[1]。

2. メインスレッドでは非同期の `Promise` ベースのAPIを使用します[1]。

3. `FileSystemDirectoryHandle.getFileHandle()` と `FileSystemDirectoryHandle.getDirectoryHandle()` を使用してファイルやディレクトリにアクセスします[1]。

4. ファイルの読み取り、書き込み、削除などの操作が可能です[1]。

5. ウェブワーカー内では同期APIを使用できます[1]。

## 具体的な操作例

1. ファイルの作成と取得[1]：

```javascript
const fileHandle = await opfsRoot.getFileHandle("my first file", { create: true });
```

2. ファイルの読み取り[1]：

```javascript
const file = await fileHandle.getFile();
const text = await file.text();
```

3. ファイルへの書き込み[1]：

```javascript
const writable = await fileHandle.createWritable();
await writable.write(content);
await writable.close();
```

4. ファイルやフォルダの削除[1]：

```javascript
await directoryHandle.removeEntry("my first nested file");
```

5. フォルダの内容の一覧表示[1]：

```javascript
for await (let [name, handle] of directoryHandle) {
  // 処理
}
```

OPFSは、高速なファイル操作が必要なWebアプリケーションに特に有用で、ブラウザ内でのデータベース操作やファイル処理を効率的に行うことができます。

Citations:
[1] <https://developer.mozilla.org/ja/docs/Web/API/File_System_API/Origin_private_file_system>
[2] <https://developer.mozilla.org/ja/docs/Web/API/File_System_API/Origin_private_file_system>
[3] <https://developer.chrome.com/blog/sqlite-wasm-in-the-browser-backed-by-the-origin-private-file-system?hl=ja>
[4] <https://zenn.dev/cybozu_frontend/articles/origin-private-file-system>
[5] <https://www.mitsue.co.jp/knowledge/blog/frontend/202304/03_1105.html>
