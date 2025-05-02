# react-dropzone

ref: <https://react-dropzone.js.org/>

`react-dropzone` は、HTML5のドラッグアンドドロップ機能をReactアプリケーションで簡単に実装するためのシンプルなライブラリです。主にフック (`useDropzone`) を使用して、ファイルドロップゾーンを作成します。

## 主な機能と特徴

* **簡単な実装:** `useDropzone` フックを使用することで、数行のコードでドラッグアンドドロップ機能を追加できます。
* **HTML5準拠:** 標準的なHTML5のドラッグアンドドロップAPIを利用しています。
* **フックベース:** `useDropzone` フックは、ドロップゾーンのルート要素と入力要素に必要なプロパティ (`getRootProps`, `getInputProps`) を提供します。
* **状態管理:** ドラッグ操作がアクティブかどうか (`isDragActive`) などの状態も提供されます。
* **カスタマイズ:** `accept` プロパティで受け入れるファイルの種類 (MIMEタイプや拡張子) を指定したり、`maxFiles`、`multiple` などのオプションで動作を制御できます。
* **イベントハンドラ:** `onDrop` コールバックで、ドロップされたファイル (acceptedFiles) を処理できます。他にも `onDragEnter`, `onDragLeave`, `onDropAccepted`, `onDropRejected`, `onFileDialogCancel` など、様々なイベントに対応するコールバックを指定できます。
* **ファイルダイアログ:** クリック時にファイル選択ダイアログを開く機能も含まれています。`open` 関数を呼び出してプログラム的にダイアログを開くことも可能です。
* **ファイル内容へのアクセス:** ドロップされたファイルの内容を読み取るには、`onDrop` コールバック内で `FileReader` API を使用する必要があります。`react-dropzone` 自体はファイルアップロード機能を提供しません。
* **Refs:** ドロップゾーンのルート要素や入力要素への参照 (`rootRef`, `inputRef`) を取得できます。

## 使用方法の例 (フック)

```javascript
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

function MyDropzone() {
  const onDrop = useCallback(acceptedFiles => {
    // ドロップされたファイルに対する処理
    acceptedFiles.forEach((file) => {
      console.log(file.name);
      // 例: FileReaderで内容を読む
      const reader = new FileReader()
      reader.onload = () => {
        const binaryStr = reader.result
        console.log(binaryStr) // ファイルの内容
      }
      reader.readAsArrayBuffer(file)
    })
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {'image/*': ['.jpeg', '.jpg', '.png']} // 例: 画像ファイルのみ許可
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>ここにファイルをドロップ...</p> :
          <p>ファイルをドラッグ＆ドロップ、またはクリックして選択</p>
      }
    </div>
  )
}
```

## 注意点・制限事項

* **ファイルアップローダーではない:** このライブラリはファイルのドラッグアンドドロップと選択のインターフェースを提供するものであり、サーバーへのファイルアップロード機能は含みません。アップロード処理は別途実装が必要です。
* **`accept` プロパティのブラウザ制限:** ファイルタイプを指定する `accept` プロパティの挙動はブラウザによって異なる場合があります。詳細はドキュメントの「Browser limitations」セクションで説明されています (検索結果からの情報)。
* **ファイルパス:** 返される `File` オブジェクトには `path` や `fullPath` プロパティは含まれません。
* **`onFileDialogCancel` の不安定さ:** ファイルダイアログのキャンセルイベント (`onFileDialogCancel`) は一部のブラウザで不安定な場合があります。File System Access API (`useFsAccessApi: true`) を使用することで、より信頼性の高いキャンセル検出が可能ですが、対応ブラウザやセキュアコンテキストなどの制約があります。
* **`<label>` 要素:** ルート要素として `<label>` を使用すると、ファイルダイアログが2回開かれる問題があります。これを避けるには `noClick: true` オプションを使用します。
* **Reactバージョン:** React 16.8以上が必要です (フックを使用するため)。

## 重要な点

* `getRootProps` と `getInputProps` から返されるプロパティを、それぞれ対応する要素（通常は `div` と `input`）に展開することが重要です。
* 特に `<input {...getInputProps()} />` をレンダリングしないと、クリックによるファイルダイアログの表示ができなくなります。

---

**注意:** この要約はウェブ検索結果に基づいており、公式サイト (`https://react-dropzone.js.org/`) の完全な内容や最新情報を反映していない可能性があります。
