---
title: "uiwjs/react-codemirror: CodeMirror 6 component for React. @codemirror https://uiwjs.github.io/react-codemirror/"
source: "https://github.com/uiwjs/react-codemirror?tab=readme-ov-file"
author:
  - "[[jaywcjlove]]"
published:
created: 2026-01-28
description: "ReactアプリケーションにCodeMirror 6を統合するためのコンポーネントライブラリ。豊富なテーマ、言語サポート、拡張機能を提供し、TypeScriptで記述されている。"
tags:
  - "clippings"
  - "react"
  - "codemirror"
  - "code-editor"
  - "typescript"
  - "syntax-highlighting"
---

## 概要

**react-codemirror** は、[CodeMirror 6](https://codemirror.net/) をReactアプリケーションに統合するためのコンポーネントライブラリ。GitHub上で2,126スター、155フォークを獲得している人気プロジェクト。

## 主な特徴

| 特徴 | 説明 |
|------|------|
| 🚀 **簡単なAPI設定** | シンプルで直感的なAPI |
| 🌱 **CodeMirror 6対応** | v4以降はCodeMirror 6を使用 |
| ⚛️ **React Hooks対応** | React 16.8以上が必要 |
| 📚 **TypeScript** | 型定義による優れたコード補完 |
| 🌐 **ブラウザ直接使用** | バンドル版でブラウザから直接利用可能 |
| 🎨 **テーマカスタマイズ** | 豊富なテーマと専用テーマエディタ |
| 🧑‍💻 **SwiftUI対応** | SwiftUIラッパーも提供 |

## インストール

```shell
npm install @uiw/react-codemirror --save
```

## 基本的な使用方法

```jsx
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

function App() {
  const [value, setValue] = React.useState("console.log('hello world!');");
  const onChange = React.useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);
  return (
    <CodeMirror
      value={value}
      height="200px"
      extensions={[javascript({ jsx: true })]}
      onChange={onChange}
    />
  );
}
```

## パッケージ構成

### コアパッケージ

- `@uiw/react-codemirror` - メインのReactコンポーネント
- `react-codemirror-merge` - 差分表示コンポーネント

### 拡張機能

| パッケージ | 機能 |
|-----------|------|
| `@uiw/codemirror-extensions-basic-setup` | 基本セットアップ |
| `@uiw/codemirror-extensions-color` | カラー表示 |
| `@uiw/codemirror-extensions-classname` | クラス名付与 |
| `@uiw/codemirror-extensions-events` | イベントハンドリング |
| `@uiw/codemirror-extensions-hyper-link` | ハイパーリンク |
| `@uiw/codemirror-extensions-langs` | 言語サポート |
| `@uiw/codemirror-extensions-line-numbers-relative` | 相対行番号 |
| `@uiw/codemirror-extensions-mentions` | メンション機能 |
| `@uiw/codemirror-extensions-zebra-stripes` | ゼブラストライプ |

### 利用可能なテーマ（一部）

dracula, github, vscode, monokai, nord, solarized, tokyo-night, material, gruvbox-dark, atomone, aura, eclipse, sublime, okaidia など **30種類以上**

## 言語サポート

公式の `@codemirror/lang-*` パッケージまたはレガシーモード経由で以下の言語をサポート：

- JavaScript / TypeScript / JSX
- Python, Go, Rust, Java, C++
- HTML, CSS, SASS, Less
- Markdown, JSON, XML
- SQL, PHP, Clojure, C# など

### Markdownの例（コードブロック内シンタックスハイライト付き）

```jsx
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';

export default function App() {
  return (
    <CodeMirror
      value={code}
      extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
    />
  );
}
```

## CodeMirror Merge（差分表示）

2つのファイルバージョン間の変更を横並びで表示し、追加・変更・削除された行をハイライト表示するコンポーネント。

```shell
npm install react-codemirror-merge --save
```

```jsx
import CodeMirrorMerge from 'react-codemirror-merge';
const Original = CodeMirrorMerge.Original;
const Modified = CodeMirrorMerge.Modified;

export const Example = () => {
  return (
    <CodeMirrorMerge>
      <Original value={originalDoc} />
      <Modified value={modifiedDoc} />
    </CodeMirrorMerge>
  );
};
```

## React Hooks対応（useCodeMirror）

```jsx
import { useRef, useEffect } from 'react';
import { useCodeMirror } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const extensions = [javascript()];

export default function App() {
  const editor = useRef();
  const { setContainer } = useCodeMirror({
    container: editor.current,
    extensions,
    value: "console.log('hello world!');",
  });

  useEffect(() => {
    if (editor.current) {
      setContainer(editor.current);
    }
  }, [editor.current]);

  return <div ref={editor} />;
}
```

## テーマのカスタマイズ

### 既存テーマの使用

```jsx
import { okaidia } from '@uiw/codemirror-theme-okaidia';

<CodeMirror theme={okaidia} extensions={[javascript()]} />
```

### カスタムテーマの作成

```jsx
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';

const myTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#ffffff',
    foreground: '#75baff',
    caret: '#5d00ff',
    selection: '#036dd626',
    lineHighlight: '#8a91991a',
    gutterBackground: '#fff',
    gutterForeground: '#8a919966',
  },
  styles: [
    { tag: t.comment, color: '#787b8099' },
    { tag: t.variableName, color: '#0080ff' },
    { tag: t.keyword, color: '#5c6166' },
    // ...その他のスタイル
  ],
});
```

## エディタ状態の永続化（initialState）

`toJSON` / `initialState` を使用してエディタ状態（履歴など）をシリアライズ・復元可能：

```jsx
import { historyField } from '@codemirror/commands';

const stateFields = { history: historyField };

function EditorWithInitialState() {
  const serializedState = localStorage.getItem('myEditorState');
  const value = localStorage.getItem('myValue') || '';

  return (
    <CodeMirror
      value={value}
      initialState={
        serializedState ? { json: JSON.parse(serializedState), fields: stateFields } : undefined
      }
      onUpdate={(viewUpdate) => {
        localStorage.setItem('myValue', viewUpdate.state.doc.toString());
        const state = viewUpdate.state.toJSON(stateFields);
        localStorage.setItem('myEditorState', JSON.stringify(state));
      }}
    />
  );
}
```

## 主要なProps

| Prop | 型 | デフォルト | 説明 |
|------|------|----------|------|
| `value` | string | - | エディタの初期値 |
| `height` / `width` | string | 'auto' | サイズ指定 |
| `theme` | 'light' / 'dark' / Extension | 'light' | テーマ |
| `editable` | boolean | true | 編集可能フラグ |
| `readOnly` | boolean | false | 読み取り専用 |
| `indentWithTab` | boolean | true | Tabキーでインデント |
| `extensions` | Extension[] | - | 拡張機能配列 |
| `onChange` | (value, viewUpdate) => void | - | 変更時コールバック |
| `onStatistics` | (data: Statistics) => void | - | 統計データ取得 |
| `onCreateEditor` | (view, state) => void | - | エディタ作成時 |
| `initialState` | { json, fields } | - | 状態復元用 |

## 関連プロジェクト

- [@uiw/react-textarea-code-editor](https://github.com/uiwjs/react-textarea-code-editor) - シンプルなコードエディタ
- [@uiw/react-md-editor](https://github.com/uiwjs/react-md-editor) - Markdownエディタ
- [@uiw/react-monacoeditor](https://github.com/jaywcjlove/react-monacoeditor) - Monaco Editorラッパー
- [Online JSON Viewer](https://github.com/uiwjs/json-viewer) - JSONビューア

## ライセンス

MIT License
