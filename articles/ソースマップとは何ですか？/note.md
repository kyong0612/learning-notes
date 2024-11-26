# ソースマップとは何ですか？

ref: <https://web.dev/articles/source-maps?hl=ja>

## ソースマップの基本概念

モダンなWeb開発では、開発効率と実行性能の両方を追求するため、開発時のコードと本番環境のコードが大きく異なります。ソースマップは、この2つのコードを紐付けて、デバッグを容易にする仕組みです[1]。

**主な用途**
TypeScript、SCSS、Pugなどの高度な言語やプリプロセッサを使用して開発したコードを、ブラウザが理解できる標準的なHTML、CSS、JavaScriptにコンパイルする際に活用されます[1]。

## 具体的な活用例

以下のTypeScriptコードを例に説明します：

```typescript
document.querySelector('button')?.addEventListener('click', () => {
    const num: number = Math.floor(Math.random() * 101);
    const greet: string = 'Hello';
    (document.querySelector('p') as HTMLParagraphElement).innerText = 
        `${greet}, you are no. ${num}!`;
    console.log(num);
});
```

このコードは本番環境では以下のように圧縮されます：

```javascript
document.querySelector("button")?.addEventListener("click",(()=>{const e=Math.floor(101*Math.random());document.querySelector("p").innerText=`Hello, you are no. ${e}!`,console.log(e)}));
```

ソースマップを使用することで、圧縮されたコードでエラーが発生した場合でも、開発者は元のTypeScriptコードの該当箇所を簡単に特定できます[1]。

## ソースマップの生成と構造

**生成方法**
Vite、webpack、Rollupなどの主要なビルドツールで生成可能です。設定例：

```javascript
export default defineConfig({
    build: {
        sourcemap: true,  // 本番用ソースマップを有効化
    },
    css: {
        devSourcemap: true  // 開発時のCSSソースマップを有効化
    }
})
```

**ファイル構造**
ソースマップファイルには、以下の重要な情報が含まれます[1]：

- mappings：コードの対応関係を示すVLQ base64エンコードされた文字列
- sources：元のソースファイルのパス
- names：変数名やメソッド名のリスト

## 制限事項と今後の展望

ビルド時の最適化により、一部の変数や情報が失われる可能性があります。例えば、上記の例では`greet`変数が最適化により除去され、デバッグ時に実際の値を確認できない場合があります[1]。

この問題を解決するため、ソースマップv4の仕様策定が進められており、より詳細なデバッグ情報の提供が期待されています[1]。

Sources
[1] source-maps <https://web.dev/articles/source-maps>
[2] What are source maps? | Articles | web.dev <https://web.dev/articles/source-maps>
