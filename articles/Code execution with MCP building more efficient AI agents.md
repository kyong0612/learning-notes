---
title: "Code execution with MCP: building more efficient AI agents"
source: "https://www.anthropic.com/engineering/code-execution-with-mcp"
author:
  - "Adam Jones"
  - "Conor Kelly"
published: 2025-11-04
created: 2025-11-06
description: "Learn how code execution with the Model Context Protocol enables agents to handle more tools while using fewer tokens, reducing context overhead by up to 98.7%."
tags:
  - "MCP"
  - "AI agents"
  - "code execution"
  - "context optimization"
  - "token efficiency"
  - "tool calling"
---

## 概要

Model Context Protocol (MCP)は、AIエージェントを外部システムに接続するためのオープン標準です。この記事では、コード実行環境を活用することで、MCPサーバーとのやり取りをより効率的にし、より多くのツールを扱いながらトークン使用量を削減する方法について解説します。

## 背景: MCPの急速な普及と課題

MCPは2024年11月のローンチ以来、急速に普及しています：

- コミュニティによって数千のMCPサーバーが構築
- すべての主要なプログラミング言語向けのSDKが利用可能
- エージェントをツールやデータに接続するためのデファクトスタンダードとして業界で採用

現在、開発者は数十のMCPサーバーにまたがる数百～数千のツールにアクセスできるエージェントを日常的に構築しています。しかし、接続されるツールの数が増えるにつれて、すべてのツール定義を事前にロードし、中間結果をコンテキストウィンドウ経由で渡すことがエージェントの速度低下とコスト増加を招いています。

## 問題: ツールによる過度なトークン消費がエージェントの効率を低下

MCPの利用が拡大するにつれ、エージェントのコストとレイテンシを増加させる2つの一般的なパターンがあります：

### 1. ツール定義がコンテキストウィンドウを圧迫

多くのMCPクライアントは、すべてのツール定義を事前にコンテキストに直接ロードし、直接的なツール呼び出し構文を使用してモデルに公開します。例：

```
gdrive.getDocument
     説明: Google Driveからドキュメントを取得
     パラメータ:
                documentId (必須, string): 取得するドキュメントのID
                fields (オプション, string): 返す特定のフィールド
     戻り値: タイトル、本文コンテンツ、メタデータ、権限等を含むドキュメントオブジェクト

salesforce.updateRecord
    説明: Salesforceのレコードを更新
    パラメータ:
               objectType (必須, string): Salesforceオブジェクトのタイプ (Lead, Contact, Account等)
               recordId (必須, string): 更新するレコードのID
               data (必須, object): 新しい値で更新するフィールド
     戻り値: 確認を含む更新されたレコードオブジェクト
```

**問題点**: ツールの説明がより多くのコンテキストウィンドウスペースを占有し、応答時間とコストが増加します。エージェントが数千のツールに接続されている場合、リクエストを読む前に数十万トークンを処理する必要があります。

### 2. 中間ツール結果が追加のトークンを消費

例えば、「Google Driveから会議の議事録をダウンロードして、Salesforceのリードに添付して」というタスクの場合：

```
TOOL CALL: gdrive.getDocument(documentId: "abc123")
        → "Q4の目標について議論...\n[完全な議事録テキスト]" を返す
           (モデルコンテキストにロード)

TOOL CALL: salesforce.updateRecord(
            objectType: "SalesMeeting",
            recordId: "00Q5f000001abcXYZ",
            data: { "Notes": "Q4の目標について議論...\n[完全な議事録テキスト]" }
        )
        (モデルは再び議事録全体をコンテキストに書き込む必要がある)
```

**問題点**: すべての中間結果がモデルを経由する必要があります。この例では、完全な議事録が2回流れます。2時間の会議の場合、追加で50,000トークンを処理することになる可能性があります。さらに大きなドキュメントではコンテキストウィンドウの制限を超え、ワークフローが破綻する可能性があります。

![MCPクライアントとMCPサーバー、LLMの連携図](https://www.anthropic.com/_next/image?url=https%3A%2F%2Fwww-cdn.anthropic.com%2Fimages%2F4zrzovbb%2Fwebsite%2F9ecf165020005c09a22a9472cee6309555485619-1920x1080.png&w=1920&q=75)

*MCPクライアントは、ツール定義をモデルのコンテキストウィンドウにロードし、各ツール呼び出しと結果が操作間でモデルを経由するメッセージループを編成します。*

## 解決策: コード実行によるコンテキスト効率の改善

エージェント向けのコード実行環境が一般的になってきた今、解決策はMCPサーバーを直接的なツール呼び出しではなく、**コードAPIとして提示する**ことです。エージェントはコードを書いてMCPサーバーとやり取りできます。このアプローチは両方の課題に対処します：エージェントは必要なツールのみをロードし、結果をモデルに返す前に実行環境内でデータを処理できます。

### 実装アプローチ: ファイルツリーによるツール管理

接続されたMCPサーバーから利用可能なすべてのツールのファイルツリーを生成する方法があります。TypeScriptでの実装例：

```
servers
├── google-drive
│   ├── getDocument.ts
│   ├── ... (他のツール)
│   └── index.ts
├── salesforce
│   ├── updateRecord.ts
│   ├── ... (他のツール)
│   └── index.ts
└── ... (他のサーバー)
```

各ツールはファイルに対応します：

```typescript
// ./servers/google-drive/getDocument.ts
import { callMCPTool } from "../../../client.js";

interface GetDocumentInput {
  documentId: string;
}

interface GetDocumentResponse {
  content: string;
}

/* Google Driveからドキュメントを読み取る */
export async function getDocument(input: GetDocumentInput): Promise<GetDocumentResponse> {
  return callMCPTool<GetDocumentResponse>('google_drive__get_document', input);
}
```

先ほどのGoogle DriveからSalesforceへの例は、次のコードになります：

```typescript
// Google Docsから議事録を読み取り、Salesforceの見込み客に追加
import * as gdrive from './servers/google-drive';
import * as salesforce from './servers/salesforce';

const transcript = (await gdrive.getDocument({ documentId: 'abc123' })).content;
await salesforce.updateRecord({
  objectType: 'SalesMeeting',
  recordId: '00Q5f000001abcXYZ',
  data: { Notes: transcript }
});
```

### 劇的な効率改善

エージェントはファイルシステムを探索してツールを発見します：`./servers/`ディレクトリをリストして利用可能なサーバー（`google-drive`や`salesforce`など）を見つけ、必要な特定のツールファイル（`getDocument.ts`や`updateRecord.ts`など）を読み取って各ツールのインターフェースを理解します。

**結果**: エージェントは現在のタスクに必要な定義のみをロードできます。これにより、**トークン使用量が150,000トークンから2,000トークンに削減され、時間とコストが98.7%節約されます。**

Cloudflareも[同様の結果を公表](https://blog.cloudflare.com/code-mode/)しており、MCPでのコード実行を「コードモード」と呼んでいます。核心となる洞察は同じです：LLMはコードを書くことが得意であり、開発者はこの強みを活かしてMCPサーバーとより効率的にやり取りするエージェントを構築すべきです。

## コード実行とMCPの利点

コード実行とMCPの組み合わせにより、エージェントはオンデマンドでツールをロードし、モデルに到達する前にデータをフィルタリングし、複雑なロジックを一度に実行することで、コンテキストをより効率的に使用できます。セキュリティと状態管理の面でも利点があります。

### 1. プログレッシブディスクロージャー（段階的開示）

モデルはファイルシステムのナビゲーションが得意です。ツールをファイルシステム上のコードとして提示することで、モデルは事前にすべてを読み込むのではなく、オンデマンドでツール定義を読み取れます。

代替として、`search_tools`ツールをサーバーに追加して関連する定義を見つけることもできます。例えば、上記のSalesforceサーバーで作業する際、エージェントは「salesforce」を検索し、現在のタスクに必要なツールのみをロードします。詳細レベルパラメータを`search_tools`ツールに含めることで、エージェントが必要な詳細レベル（名前のみ、名前と説明、またはスキーマを含む完全な定義など）を選択でき、コンテキストを節約し効率的にツールを見つけられます。

### 2. コンテキスト効率的なツール結果

大規模なデータセットを扱う際、エージェントはコード内で結果を返す前にフィルタリングと変換を行えます。10,000行のスプレッドシートを取得する場合を考えます：

```typescript
// コード実行なし - すべての行がコンテキストを通過
TOOL CALL: gdrive.getSheet(sheetId: 'abc123')
        → 手動でフィルタリングするために10,000行をコンテキストで返す

// コード実行あり - 実行環境内でフィルタリング
const allRows = await gdrive.getSheet({ sheetId: 'abc123' });
const pendingOrders = allRows.filter(row => 
  row["Status"] === 'pending'
);
console.log(`${pendingOrders.length}件の保留中の注文を見つけました`);
console.log(pendingOrders.slice(0, 5)); // レビューのために最初の5件のみをログ
```

エージェントは10,000行ではなく5行を見ます。同様のパターンは、集計、複数のデータソース間の結合、特定のフィールドの抽出にも機能し、すべてコンテキストウィンドウを膨張させません。

### 3. より強力でコンテキスト効率的な制御フロー

ループ、条件分岐、エラーハンドリングは、個々のツール呼び出しをチェーンするのではなく、馴染みのあるコードパターンで実行できます。例えば、Slackでデプロイメント通知が必要な場合、エージェントは次のように書けます：

```typescript
let found = false;
while (!found) {
  const messages = await slack.getChannelHistory({ channel: 'C123456' });
  found = messages.some(m => m.text.includes('deployment complete'));
  if (!found) await new Promise(r => setTimeout(r, 5000));
}
console.log('デプロイメント通知を受信しました');
```

このアプローチは、エージェントループを通じてMCPツール呼び出しとスリープコマンドを交互に実行するよりも効率的です。

さらに、実行される条件ツリーを書き出せることで、「最初のトークンまでの時間」のレイテンシも節約できます：モデルがif文を評価するのを待つ必要がなく、エージェントはコード実行環境にこれを任せられます。

### 4. プライバシー保護操作

エージェントがコード実行とMCPを使用する場合、中間結果はデフォルトで実行環境内に留まります。これにより、エージェントは明示的にログまたは返却したものだけを見ることができ、モデルと共有したくないデータは、モデルのコンテキストに入ることなくワークフローを通過できます。

さらに機密性の高いワークロードの場合、エージェントハーネスは機密データを自動的にトークン化できます。例えば、スプレッドシートから顧客の連絡先詳細をSalesforceにインポートする必要がある場合、エージェントは次のように書きます：

```typescript
const sheet = await gdrive.getSheet({ sheetId: 'abc123' });
for (const row of sheet.rows) {
  await salesforce.updateRecord({
    objectType: 'Lead',
    recordId: row.salesforceId,
    data: { 
      Email: row.email,
      Phone: row.phone,
      Name: row.name
    }
  });
}
console.log(`${sheet.rows.length}件のリードを更新しました`);
```

MCPクライアントはデータを傍受し、モデルに到達する前にPII（個人識別情報）をトークン化します：

```typescript
// エージェントがsheet.rowsをログに記録した場合に見えるもの:
[
  { salesforceId: '00Q...', email: '[EMAIL_1]', phone: '[PHONE_1]', name: '[NAME_1]' },
  { salesforceId: '00Q...', email: '[EMAIL_2]', phone: '[PHONE_2]', name: '[NAME_2]' },
  ...
]
```

その後、データが別のMCPツール呼び出しで共有される際、MCPクライアント内のルックアップを介してデトークン化されます。実際のメールアドレス、電話番号、名前はGoogle SheetsからSalesforceに流れますが、モデルを経由することはありません。これにより、エージェントが機密データを誤ってログに記録したり処理したりすることを防ぎます。これを使用して、データがどこから流れてどこに行けるかを選択する決定論的なセキュリティルールを定義することもできます。

### 5. 状態の永続化とスキル

ファイルシステムアクセスを備えたコード実行により、エージェントは操作間で状態を維持できます。エージェントは中間結果をファイルに書き込むことができ、作業を再開し進捗を追跡できます：

```typescript
const leads = await salesforce.query({ 
  query: 'SELECT Id, Email FROM Lead LIMIT 1000' 
});
const csvData = leads.map(l => `${l.Id},${l.Email}`).join('\n');
await fs.writeFile('./workspace/leads.csv', csvData);

// 後の実行で中断したところから再開
const saved = await fs.readFile('./workspace/leads.csv', 'utf-8');
```

エージェントは、自身のコードを再利用可能な関数として永続化することもできます。エージェントがタスクのための動作するコードを開発すると、その実装を将来の使用のために保存できます：

```typescript
// ./skills/save-sheet-as-csv.ts 内
import * as gdrive from './servers/google-drive';
export async function saveSheetAsCsv(sheetId: string) {
  const data = await gdrive.getSheet({ sheetId });
  const csv = data.map(row => row.join(',')).join('\n');
  await fs.writeFile(`./workspace/sheet-${sheetId}.csv`, csv);
  return `./workspace/sheet-${sheetId}.csv`;
}

// 後で、任意のエージェント実行で：
import { saveSheetAsCsv } from './skills/save-sheet-as-csv';
const csvPath = await saveSheetAsCsv('abc123');
```

これは[Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)の概念と密接に結びついています。Skillsは、特化したタスクでパフォーマンスを向上させるための再利用可能な指示、スクリプト、リソースのフォルダです。これらの保存された関数にSKILL.mdファイルを追加することで、モデルが参照して使用できる構造化されたスキルが作成されます。時間とともに、これによりエージェントは高レベルの機能のツールボックスを構築し、最も効果的に動作するために必要な足場を進化させることができます。

### 注意点: 実装の複雑さとトレードオフ

コード実行は独自の複雑さをもたらします。エージェントが生成したコードを実行するには、適切な[サンドボックス化](https://www.anthropic.com/engineering/claude-code-sandboxing)、リソース制限、監視を備えた安全な実行環境が必要です。これらのインフラストラクチャ要件は、直接的なツール呼び出しが回避する運用オーバーヘッドとセキュリティの考慮事項を追加します。コード実行の利点（トークンコストの削減、レイテンシの低下、ツール構成の改善）は、これらの実装コストと比較検討する必要があります。

## まとめ

MCPは、エージェントが多くのツールやシステムに接続するための基盤となるプロトコルを提供します。しかし、あまりに多くのサーバーが接続されると、ツール定義と結果が過剰なトークンを消費し、エージェントの効率を低下させます。

ここでの多くの問題（コンテキスト管理、ツールの構成、状態の永続化）は新しく感じるかもしれませんが、ソフトウェアエンジニアリングには既知の解決策があります。コード実行は、これらの確立されたパターンをエージェントに適用し、馴染みのあるプログラミング構造を使用してMCPサーバーとより効率的にやり取りできるようにします。このアプローチを実装する場合は、[MCPコミュニティ](https://modelcontextprotocol.io/community/communication)で知見を共有することをお勧めします。

## 重要な成果

- **トークン使用量の劇的な削減**: 150,000トークンから2,000トークンへ（98.7%削減）
- **オンデマンドでのツールロード**: 必要なツールのみを読み込み
- **データフィルタリング**: モデルに渡す前に実行環境内で処理
- **プライバシー保護**: 機密データを自動トークン化
- **状態管理とスキル**: 再利用可能なコードの構築と永続化

## 謝辞

*この記事はAdam JonesとConor Kellyによって執筆されました。Jeremy Fox、Jerome Swannack、Stuart Ritchie、Molly Vorwerck、Matt Samuels、Maggie Voには、この投稿の草稿へのフィードバックに感謝します。*
