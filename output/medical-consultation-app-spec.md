# もしかしてドクター - 症状ヒアリング・診察サポートWebアプリケーション仕様書

## プロダクト名称
- **日本語名**: もしかしてドクター
- **英語名**: MaybeDoctor (Maybe-Dr.)
- **略称**: MayDr
- **URL候補**: maybe-doctor.com, maydr.app

## 1. プロダクト概要

### 1.1 目的
患者が医療機関を受診する前に、症状を体系的に整理し、医師への伝達を効率化するためのWebアプリケーション。対話形式で症状をヒアリングし、診察時に使える要約文書と適切な診療科の提案を行う。

### 1.2 背景
- 医療現場で患者がAIを使って症状を要約し、医師に伝える事例が増加
- 症状の的確な伝達により、診察の効率化と精度向上が期待される
- 参考: https://togetter.com/li/2585794

### 1.3 ターゲットユーザー
- 症状を的確に伝えることが難しい方
- どの診療科を受診すべきか迷っている方
- 初診時の問診を効率化したい方

## 2. 機能要件（MVP）

### 2.1 コア機能

#### 2.1.1 対話型症状ヒアリング
- チャット形式での段階的な質問
- 症状の詳細化（いつから、どこが、どのように）
- 既往歴・服薬情報の確認
- 生活習慣・アレルギー情報の収集

#### 2.1.2 症状要約生成
- 医療従事者向けの構造化された要約
- 時系列での症状経過
- 重要度・緊急度の分類
- PDF/テキスト形式でのエクスポート

#### 2.1.3 診療科提案
- 症状に基づく適切な診療科の推薦
- 複数の可能性がある場合の優先順位付け
- 受診時の注意事項の提供

### 2.2 ユーザーストーリー
1. ユーザーがWebサイトにアクセス
2. 「症状の相談を開始」ボタンをクリック
3. AIが基本的な質問から開始（主訴、発症時期など）
4. ユーザーの回答に基づいて追加質問
5. 十分な情報が集まったら要約を生成
6. 診療科の提案と要約文書のダウンロード

### 2.3 非機能要件
- レスポンスタイム: 3秒以内
- 可用性: 99.9%
- セッションタイムアウト: 30分
- 同時接続数: 100ユーザー（MVP段階）

## 3. 技術仕様

### 3.1 技術スタック

```
Frontend:
- Framework: Hono + JSX (Cloudflare Workers)
- TypeScript
- Tailwind CSS (CDN経由)

Backend:
- Runtime: Cloudflare Workers
- LLM Integration: Vercel AI SDK
- Database: Cloudflare KV (セッション管理)

開発環境:
- Package Manager: pnpm
- Linter/Formatter: Biome
- Deployment: Wrangler (Cloudflare)
```

### 3.2 選定理由
- **Cloudflare Workers**: エッジコンピューティングによる低レイテンシー、グローバル展開の容易さ
- **Hono**: 軽量で高速、Cloudflare Workersとの相性が良い
- **Vercel AI SDK**: ストリーミング対応、複数LLMプロバイダーのサポート
- **Biome**: 高速で設定が簡単、TypeScriptとの統合が優れている

### 3.3 アーキテクチャ

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Browser   │────▶│ Cloudflare Edge  │────▶│   LLM API    │
│             │◀────│    (Workers)     │◀────│ (OpenAI/etc) │
└─────────────┘     └──────────────────┘     └──────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │ Cloudflare KV │
                    │  (Session)    │
                    └──────────────┘
```

### 3.4 プロジェクト構造

```
maybe-doctor/
├── src/
│   ├── index.tsx          # エントリーポイント
│   ├── routes/
│   │   ├── chat.tsx       # チャット画面
│   │   └── summary.tsx    # 要約表示画面
│   ├── components/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   └── SummaryDisplay.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── prompts.ts # プロンプト管理
│   │   │   └── client.ts  # AI SDK設定
│   │   ├── session/
│   │   │   └── manager.ts # セッション管理
│   │   └── utils/
│   │       └── pdf.ts     # PDF生成
│   └── types/
│       └── index.ts       # 型定義
├── public/
│   └── favicon.ico
├── wrangler.toml          # Cloudflare設定
├── package.json
├── pnpm-lock.yaml
├── biome.json
├── tsconfig.json
└── README.md
```

## 4. データモデル

### 4.1 セッション

```typescript
interface ConsultationSession {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  currentPhase: ConsultationPhase;
  collectedInfo: CollectedInfo;
  summary?: MedicalSummary;
  status: 'active' | 'completed' | 'timeout';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    questionType?: 'initial' | 'followup' | 'clarification';
    infoExtracted?: string[]; // 抽出された情報のキー
  };
}

type ConsultationPhase = 
  | 'initial'
  | 'symptom_details'
  | 'medical_history'
  | 'lifestyle'
  | 'summary_generation';
```

### 4.2 収集情報

```typescript
interface CollectedInfo {
  symptoms: {
    chief: string;              // 主訴
    onset: Date | null;         // 発症時期
    location: string[];         // 部位
    quality: string;            // 性質
    severity: number;           // 強度 (1-10)
    duration: string;           // 持続時間
    frequency: string;          // 頻度
    triggers: string[];         // 誘因
    relievingFactors: string[]; // 緩和要因
  };
  associatedSymptoms: string[];  // 随伴症状
  medicalHistory: {
    diseases: string[];         // 既往症
    surgeries: string[];        // 手術歴
    hospitalizations: string[]; // 入院歴
  };
  medications: Medication[];
  allergies: Allergy[];
  lifestyle: {
    smoking: boolean;
    alcohol: string;
    exercise: string;
  };
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date | null;
}

interface Allergy {
  type: 'drug' | 'food' | 'environmental';
  allergen: string;
  reaction: string;
}
```

### 4.3 医療要約

```typescript
interface MedicalSummary {
  generatedAt: Date;
  chiefComplaint: string;        // 主訴
  presentIllness: string;         // 現病歴
  medicalHistory: string[];       // 既往歴
  medications: string[];          // 服薬中の薬
  allergies: string[];            // アレルギー
  timeline: TimelineEntry[];      // 症状の時系列
  suggestedDepartments: Department[]; // 推奨診療科
  urgencyLevel: 'emergency' | 'urgent' | 'normal'; // 緊急度
  additionalNotes: string;        // 追加情報
}

interface TimelineEntry {
  date: Date;
  event: string;
}

interface Department {
  name: string;
  nameJa: string;  // 日本語名
  reason: string;
  priority: number; // 1が最優先
  considerations: string[];
}
```

## 5. UI/UXデザイン

### 5.1 画面構成

#### 5.1.1 ランディングページ
- シンプルで安心感のあるデザイン
- 主要機能の説明（3ステップ）
- 注意事項の明確な表示
- CTAボタン「相談を開始」

#### 5.1.2 チャット画面
```
┌─────────────────────────────────────┐
│  もしかしてドクター    [要約を見る] │
├─────────────────────────────────────┤
│ ┌─────────────────┬─────────────┐   │
│ │                 │   収集情報   │   │
│ │   チャット履歴   │             │   │
│ │                 │  主訴: 頭痛  │   │
│ │                 │  期間: 3日   │   │
│ │                 │  強度: 7/10  │   │
│ └─────────────────┴─────────────┘   │
│ ┌─────────────────────────────────┐ │
│ │ メッセージ入力...     [送信]     │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### 5.1.3 要約画面
- 印刷用レイアウト対応
- セクション別の情報表示
- 推奨診療科のカード表示
- ダウンロード/印刷ボタン

### 5.2 対話フロー例

```
AI: こんにちは。症状について教えてください。
    まず、どのような症状でお困りですか？

User: 頭痛があります

AI: 頭痛について詳しく教えてください。
    - いつから症状がありますか？
    - 痛みの程度は？（1-10のスケール）
    - 痛みの種類は？（ズキズキ、締め付けられる、など）

User: 3日前から、7くらいの強さで、ズキズキする痛みです

AI: その他の症状はありますか？
    例：発熱、吐き気、めまい、首の痛みなど

User: 少し吐き気もあります

AI: 頭痛が起きやすい状況や、楽になる要因はありますか？

[続く...]
```

### 5.3 デザインシステム

```css
/* カラーパレット */
--primary: #2563eb;     /* Blue 600 */
--secondary: #64748b;   /* Slate 500 */
--success: #16a34a;     /* Green 600 */
--warning: #ea580c;     /* Orange 600 */
--danger: #dc2626;      /* Red 600 */
--background: #f8fafc;  /* Slate 50 */

/* タイポグラフィ */
--font-base: 16px;
--font-heading: 'Noto Sans JP', sans-serif;
--font-body: 'Noto Sans JP', sans-serif;
```

## 6. API仕様

### 6.1 エンドポイント

```typescript
// チャットセッション開始
POST /api/sessions
Response: { sessionId: string, expiresAt: Date }

// メッセージ送信
POST /api/sessions/:sessionId/messages
Body: { message: string }
Response: { 
  reply: string, 
  phase: ConsultationPhase,
  collectedInfo: Partial<CollectedInfo>
}

// 要約生成
POST /api/sessions/:sessionId/summary
Response: { summary: MedicalSummary }

// PDF生成
GET /api/sessions/:sessionId/summary/pdf
Response: Binary (PDF file)

// セッション取得
GET /api/sessions/:sessionId
Response: { session: ConsultationSession }
```

### 6.2 エラーハンドリング

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// エラーコード
enum ErrorCode {
  SESSION_NOT_FOUND = 'SESSION_NOT_FOUND',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  INVALID_INPUT = 'INVALID_INPUT',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}
```

## 7. セキュリティ・法的考慮事項

### 7.1 免責事項
- アプリケーション全体に表示
- 医療アドバイスではないことの明記
- 緊急時は119番への連絡を促す
- 診断や治療法の提案は行わない

### 7.2 データ保護
- 個人情報の非保存（セッションIDのみ）
- セッションデータの自動削除（24時間後）
- HTTPS通信の強制
- IPアドレスのハッシュ化

### 7.3 コンプライアンス
- 医療法・医師法への配慮
- 個人情報保護法への準拠
- 利用規約の明示
- プライバシーポリシーの掲載

## 8. AI実装詳細

### 8.1 プロンプトエンジニアリング

```typescript
// src/lib/ai/prompts.ts

export const SYMPTOM_INTERVIEW_SYSTEM_PROMPT = `
あなたは経験豊富な医療問診アシスタントです。
患者の症状を段階的にヒアリングし、医師への伝達に必要な情報を収集します。

## ヒアリングの流れ
1. 主訴の確認
2. 症状の詳細（OPQRST法）
   - Onset: いつから
   - Provocation/Palliation: 悪化/改善要因
   - Quality: 症状の性質
   - Region/Radiation: 部位と放散
   - Severity: 程度
   - Time: 時間経過
3. 随伴症状
4. 既往歴・服薬歴
5. アレルギー

## 注意事項
- 診断や治療法の提案はしない
- 緊急性が高い症状の場合は救急受診を勧める
- 簡潔で分かりやすい質問を心がける
- 一度に複数の質問をしない
- 医学用語は必要最小限に留める
`;

export const SUMMARY_GENERATION_PROMPT = `
収集した症状情報を医療従事者向けに要約してください。

## 要約フォーマット
1. 主訴
2. 現病歴（時系列）
3. 既往歴
4. 内服薬
5. アレルギー
6. 推奨診療科とその理由

## 注意事項
- 簡潔で医学的に適切な表現を使用
- 患者の言葉をそのまま引用する場合は「」で囲む
- 不明な情報は「不明」と明記
- 緊急性の判断基準を明確に
`;

export const DEPARTMENT_SUGGESTION_PROMPT = `
症状情報から適切な診療科を提案してください。

## 出力形式
- 診療科名（日本語）
- 選択理由
- 優先順位
- 受診時の注意事項

## 診療科リスト
- 内科
- 外科
- 整形外科
- 脳神経外科
- 神経内科
- 耳鼻咽喉科
- 眼科
- 皮膚科
- 泌尿器科
- 産婦人科
- 小児科
- 精神科・心療内科
- 救急科
`;
```

### 8.2 緊急症状の判定

```typescript
const EMERGENCY_KEYWORDS = [
  '胸痛', '呼吸困難', '意識障害', '麻痺',
  '激しい頭痛', '吐血', '下血', '自殺念慮'
];

function checkEmergency(symptoms: string): boolean {
  return EMERGENCY_KEYWORDS.some(keyword => 
    symptoms.includes(keyword)
  );
}
```

## 9. 実装サンプルコード

### 9.1 エントリーポイント（src/index.tsx）

```typescript
import { Hono } from 'hono';
import { jsx } from 'hono/jsx';
import { cors } from 'hono/cors';
import { chatRoute } from './routes/chat';
import { summaryRoute } from './routes/summary';
import { apiRoute } from './routes/api';

const app = new Hono();

// Middleware
app.use('*', cors());

// Static pages
app.get('/', (c) => {
  return c.html(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>もしかしてドクター</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50">
        <div class="min-h-screen flex items-center justify-center">
          <div class="max-w-2xl mx-auto p-8">
            <h1 class="text-4xl font-bold mb-4 text-gray-800">
              もしかしてドクター
            </h1>
            <p class="text-lg mb-8 text-gray-600">
              AIが症状をヒアリングし、診察時に役立つ要約を作成します
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div class="bg-white p-4 rounded-lg shadow">
                <div class="text-2xl mb-2">💬</div>
                <h3 class="font-bold mb-1">対話形式</h3>
                <p class="text-sm text-gray-600">
                  チャット形式で症状を詳しくヒアリング
                </p>
              </div>
              <div class="bg-white p-4 rounded-lg shadow">
                <div class="text-2xl mb-2">📋</div>
                <h3 class="font-bold mb-1">要約作成</h3>
                <p class="text-sm text-gray-600">
                  医師に伝わりやすい形式で整理
                </p>
              </div>
              <div class="bg-white p-4 rounded-lg shadow">
                <div class="text-2xl mb-2">🏥</div>
                <h3 class="font-bold mb-1">診療科提案</h3>
                <p class="text-sm text-gray-600">
                  症状に適した診療科をご提案
                </p>
              </div>
            </div>
            
            <div class="text-center">
              <a 
                href="/chat" 
                class="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              >
                相談を開始する
              </a>
            </div>
            
            <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="text-sm text-yellow-800">
                <strong>⚠️ ご注意</strong><br />
                このサービスは医療アドバイスではありません。
                緊急の場合は119番へご連絡ください。
                実際の診断は必ず医師の診察を受けてください。
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
});

// Routes
app.route('/chat', chatRoute);
app.route('/summary', summaryRoute);
app.route('/api', apiRoute);

export default app;
```

### 9.2 チャットインターフェース（src/components/ChatInterface.tsx）

```typescript
import { jsx } from 'hono/jsx';
import type { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  sessionId: string;
}

export const ChatInterface = ({ messages, sessionId }: ChatInterfaceProps) => {
  return (
    <div class="flex flex-col h-screen bg-gray-50">
      <header class="bg-white shadow-sm px-4 py-3">
        <h1 class="text-xl font-semibold">もしかしてドクター</h1>
      </header>
      
      <div class="flex-1 flex">
        {/* Chat messages */}
        <div class="flex-1 overflow-y-auto p-4">
          <div class="max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                class={`mb-4 flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  class={`max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Side panel with collected info */}
        <div class="w-80 bg-white border-l border-gray-200 p-4">
          <h2 class="font-semibold mb-4">収集された情報</h2>
          <div class="space-y-3">
            {/* Display collected information */}
          </div>
        </div>
      </div>
      
      {/* Input area */}
      <div class="bg-white border-t border-gray-200 p-4">
        <form 
          action={`/api/sessions/${sessionId}/messages`}
          method="POST"
          class="max-w-3xl mx-auto flex gap-2"
        >
          <input
            type="text"
            name="message"
            placeholder="症状について入力してください..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autofocus
          />
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            送信
          </button>
        </form>
      </div>
    </div>
  );
};
```

## 10. テスト戦略

### 10.1 単体テスト
- プロンプト生成ロジック
- データ変換処理
- バリデーション

### 10.2 統合テスト
- API エンドポイント
- セッション管理
- AI レスポンス処理

### 10.3 E2Eテスト
- ユーザーフロー全体
- エラーケース
- タイムアウト処理

### 10.4 テストシナリオ例
1. 通常の症状相談フロー
2. 緊急症状の検出
3. セッションタイムアウト
4. 不適切な入力への対応
5. PDF生成とダウンロード

## 11. デプロイメント

### 11.1 環境構成
- Development: ローカル環境
- Staging: Cloudflare Workers (staging.example.com)
- Production: Cloudflare Workers (app.example.com)

### 11.2 環境変数

```toml
# wrangler.toml
name = "maybe-doctor"
main = "src/index.tsx"
compatibility_date = "2024-01-01"

[env.production]
vars = { ENVIRONMENT = "production" }

[[env.production.kv_namespaces]]
binding = "SESSIONS"
id = "xxx"

[env.production.ai]
binding = "AI"

[env.staging]
vars = { ENVIRONMENT = "staging" }

[[env.staging.kv_namespaces]]
binding = "SESSIONS"
id = "yyy"
```

### 11.3 デプロイ手順

```bash
# 依存関係のインストール
pnpm install

# ビルド
pnpm build

# ローカルテスト
pnpm dev

# Staging デプロイ
pnpm deploy:staging

# Production デプロイ
pnpm deploy:production
```

## 12. モニタリング・運用

### 12.1 監視項目
- API レスポンスタイム
- エラー率
- セッション数
- AI API 使用量
- KV ストレージ使用量

### 12.2 アラート設定
- レスポンスタイム > 5秒
- エラー率 > 5%
- AI API エラー
- KV容量 > 80%

### 12.3 メンテナンス
- プロンプトの定期的な見直し
- ユーザーフィードバックの収集
- パフォーマンスチューニング

## 13. 開発スケジュール

### Phase 1: 基本セットアップ（1-2日）
- [ ] プロジェクト初期化
- [ ] 開発環境構築
- [ ] 基本的なルーティング

### Phase 2: チャット機能（2-3日）
- [ ] UIコンポーネント作成
- [ ] セッション管理実装
- [ ] メッセージ送受信

### Phase 3: AI統合（3-4日）
- [ ] Vercel AI SDK セットアップ
- [ ] プロンプト作成・調整
- [ ] 要約生成機能
- [ ] 診療科判定

### Phase 4: 仕上げ（1-2日）
- [ ] PDF生成
- [ ] エラーハンドリング
- [ ] パフォーマンス最適化

### Phase 5: デプロイ（1日）
- [ ] Cloudflare セットアップ
- [ ] 本番環境デプロイ
- [ ] 動作確認

## 14. 今後の拡張可能性

### 14.1 短期（3-6ヶ月）
- 多言語対応（英語、中国語）
- 音声入力機能
- 画像アップロード（症状の写真）
- より詳細な問診ロジック

### 14.2 中期（6-12ヶ月）
- ユーザー登録・ログイン機能
- 過去の相談履歴管理
- 医療機関検索・連携
- 医療従事者向けダッシュボード

### 14.3 長期（1年以上）
- 医療機関API連携
- 予約システム統合
- 健康管理機能
- AIモデルのファインチューニング

## 15. リスクと対策

### 15.1 技術的リスク
| リスク | 影響度 | 対策 |
|-------|--------|------|
| AI APIの障害 | 高 | フォールバック処理、複数プロバイダー |
| レート制限 | 中 | キャッシュ、レート制限実装 |
| データ損失 | 低 | KVレプリケーション |

### 15.2 ビジネスリスク
| リスク | 影響度 | 対策 |
|-------|--------|------|
| 医療法違反 | 高 | 法務確認、免責事項の徹底 |
| 誤情報による被害 | 高 | 医療監修、緊急時の案内強化 |
| プライバシー侵害 | 中 | データ最小化、暗号化 |

## 16. 参考資料

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Hono Documentation](https://hono.dev/)
- [医療情報の取り扱いに関するガイドライン](https://www.mhlw.go.jp/)

## 17. 更新履歴

| 日付 | バージョン | 内容 |
|------|-----------|------|
| 2024-01-XX | 1.0.0 | 初版作成 |

---

**文書作成者**: AI アシスタント  
**最終更新日**: 2024年1月  
**次回レビュー予定**: 2024年2月