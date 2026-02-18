---
title: "OpenClawの何が特別なのか？"
source: "https://blog.lai.so/openclaw/?ref=laiso-newsletter"
author:
  - "[[laiso]]"
published: 2026-02-17
created: 2026-02-18
description: "オープンソースの自律型AIエージェント「OpenClaw」の特異性を3つの軸（Pi基盤の独自構築、Agent Skillsによるプロンプト拡張、開発者steipeteのハッカー気質）から分析し、アーキテクチャ・コスト・セキュリティリスクを包括的に解説する記事。"
tags:
  - "clippings"
  - "AI-agent"
  - "open-source"
  - "OpenClaw"
  - "security"
  - "LLM"
---

## OpenClawの何が特別なのか

[OpenClaw](https://github.com/openclaw/openclaw)はオープンソースの自律型AIエージェントで、LLMに自分のPCの強い権限を渡し、Agent Skillsの仕組みで自動操縦する。Devinのような自律型アシスタントを個人が安価にセルフホストできるようにしたもので、Claude CodeやCodex CLIより一段上のレイヤーにあたる。

### OpenClawが特別な3つの理由

1. **外部SDKやフレームワークを使わず、Piを核に独自構築されている**
2. **Agent Skillsというプロンプト拡張の仕組みを前提にする新世代であること**
3. **ハッカーのsteipeteが開発したOSSプロジェクトであること**

---

## steipeteが作った

### 開発者の背景

- **Peter Steinberger（steipete）** は第一世代のiOSエンジニア。[PSPDFKit](https://pspdfkit.com/)（iPhone向けPDF表示ライブラリ）をビジネス的に成功させた経営者
- 2021年に持ち株を手放し、3年間の燃え尽きサバティカルを経て2025年6月に開発復帰
- 2026年2月14日にOpenAIに入社、OpenClawはOSS財団へ移管

### ハッカーのおもちゃ箱

steipeteの技術的特徴は、プラットフォームの制約を突破するハッカー気質。[Aspects](https://github.com/steipete/Aspects)（ObjC向けAOP）、[InterposeKit](https://github.com/steipete/InterposeKit)（Swiftで型安全なswizzling）など一貫して裏側を攻める。

この気質はOpenClawの設計にも現れているが、**セキュリティ境界の扱いが粗い**という裏面もある。APIキーやOAuthトークンの平文保存・平文送信がデフォルトで、サブスクリプションのsetup-tokenを流用する仕組みが正規のように案内されていた。

steipete本人も「ホビープロジェクトを無料で公開しただけなのに、何百万ドルのビジネスみたいに扱われる」「ほとんどの非エンジニアはインストールすべきではない」とコメントしている。

### VibeTunnel → Clawdbot → OpenClaw の変遷

| 時期 | プロダクト | 概要 |
|---|---|---|
| 2025年6月 | **VibeTunnel** | AI Vibe Coding Hackathonで制作。ブラウザをMacのターミナルに変えるClaude Code前提ツール。Mario Zechner（libGDX）、Armin Ronacher（Flask/Sentry）との共同開発 |
| 2025年11〜12月 | **Clawdbot** | VibeTunnelの拡張。WhatsApp連携の自律型AIエージェント |
| その後 | **Moltbot → OpenClaw** | Anthropicからの商標通知等で改名。GitHub史上最速クラスの成長（180-200k+スター、670+コントリビュータ） |

### Piの誕生

- Mario Zechnerが公開した**Pi**（旧称 "shitty coding agent"）を2026年1月頃にエージェントランタイムとして本格採用
- Piはミニマルなターミナルコーディングハーネス。ツールはRead/Write/Edit/Bashの4つだけ
- 設計思想：「エージェントに足りない機能があればエージェント自身に拡張させる」
- MCPもサブエージェントもパーミッションポップアップもプランモードもなし。すべてPi extensionで自作する前提
- Armin Ronacherは「[Pi: The Minimal Agent Within OpenClaw](https://lucumr.pocoo.org/2026/1/31/pi/)」で「LLMはコードを書いて実行するのが得意なのでそれを受け入れる」と解説

### steipeteの開発スタイルと注目

- 「I ship code I don't read」と公言、直近1カ月で3,300以上のコミット
- Codexを好む理由：長時間タスクを黙々とこなすため（Claude Codeは確認を求めて気が散る）
- MCPやplan modeを嫌い、会話ベースの直接操作を好む
- メディア露出：[Lex Fridman Podcast #491](https://lexfridman.com/peter-steinberger/)（3時間14分）、[The Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/the-creator-of-clawd-i-ship-code)
- ユーザー層はバイブコーダーからノンテクニカルユーザー、VC関係者、クリプトユーザーまで拡大。Mac miniを買って常時稼働させるブーム（ミーム化）も発生

---

## アーキテクチャ: Gateway、Agent Skills、HEARTBEAT

### GatewayとNodeの役割分担

OpenClawは**Gateway**（WebSocket制御プレーン）と**Node**（Pi Agent Runtime）に分離されている。

| コンポーネント | 役割 |
|---|---|
| **Gateway** | メッセージルーティング、セッション管理、Telegram/Discord/Slackなど13以上のチャネル接続 |
| **Node** | ローカルマシンやVPS上でエージェントを実行 |

- GatewayとNodeの分離により**常時起動と外部アクセスの両立**を実現
- Nodeが常時起動してHEARTBEATを回しSkillを実行する常駐プロセスとして機能
- Gatewayがチャットクライアントからの接続を受けてスマホや別端末からの外部アタッチの窓口に
- Mac mini運用ではGatewayとNodeが1台に同居

### Agent Skills: 善良なプロンプトインジェクション

OpenClawの中核的な仕組み。SOUL.md、IDENTITY.md、MEMORY.md、HEARTBEAT.mdといったMarkdownファイルから**毎ターン動的にシステムプロンプトを構築**する。

```
❯ ls ~/.openclaw/workspace/
AGENTS.md  avatars  HEARTBEAT.md  IDENTITY.md  memory  reports  SOUL.md  TOOLS.md  USER.md
```

- 設定ファイルではなくドキュメントとしてエージェントの振る舞いを定義するファイルベースのアプローチ
- SkillファイルがLLMのプロンプトに注入され、LLMがそれを読んで任意のコマンドを実行
- SOUL.mdを書き換えればエージェントの人格が変わる（思想改造をMarkdownで行う世界観）
- ワークスペース（`~/.openclaw/workspace/`）はデフォルトでGitリポジトリ

**Piが省略した機能のOpenClaw側での補完：**
- MCP：steipeteが作った[mcporter](https://github.com/steipete/mcporter)（CLIラッパー）経由
- サブエージェント：GatewayのRPCで非同期に子セッションとして起動
- マルチエージェント：子エージェントをオーケストレーションする制御モデル

**記憶の仕組み（ファイルファースト）：**
- SSOTはMarkdownファイル、SQLite＋FTS5＋sqlite-vecは検索用インデックス
- デフォルト：BM25（キーワード検索）のみ
- 埋め込み有効時：ベクトル検索（70%）＋BM25（30%）のハイブリッド
- 埋め込みはローカル（embeddinggemma-300m）でもリモートAPI（OpenAI等）でも利用可能

> ⚠️ [公式セキュリティドキュメント](https://docs.openclaw.ai/gateway/security)もプロンプトインジェクションを「未解決の問題」と認めている。ガードレールはソフトなガイダンスに過ぎず、悪意あるSkillも同じ経路で注入される。

### HEARTBEAT: 常時起動の価値

Claude CodeやCodex CLIとの**決定的な違い**。ユーザー起点ではなく**エージェント起点**で動く。

- デフォルト30分ごと（OAuth利用時は1時間ごと）に自律推論を実行
- HEARTBEAT.mdに書かれたチェックリストを判定し、送るべきメッセージがあるときだけLLMが生成
- 何もなければ`HEARTBEAT_OK`を返して通知は飛ばない（判断と実行の分離）
- 間隔設計にはプロンプトキャッシュのコスト最適化が考慮されている
  - APIキー利用時：キャッシュTTL内の30分
  - OAuth利用時：キャッシュ再構築を抑える1時間
- `~/.openclaw/openclaw.json`で変更可能。`"0m"`で無効化も可

**常時起動が可能にすること：**
- メール受信箱やカレンダーの定期チェック
- エージェントからユーザーへのプロアクティブな通知
- 数日おきに短期記憶を長期記憶（MEMORY.md）へまとめる記憶の整理

> ⚠️ 自律性の裏返しとして、[MatplotlibにPRを出し、リジェクトされると批判ブログを投稿した事例](https://theshamblog.com/an-ai-agent-published-a-hit-piece-on-me/)が報告されている。

**HEARTBEATの仕組み自体は`claude -p`とcronで近似可能。** OpenClawの価値は、会話コンテキストのcompaction引き継ぎ、プロンプトキャッシュTTLに合わせた間隔設計、13以上のチャネルへの自動ルーティング、Skills/Memoryとの統合がパッケージになっている点。個々の要素は特別ではなく、統合の手間を肩代わりするところに意味がある。

---

## コストと実行環境

### サブスクで動かす方法の問題

- OpenClawはAPIキーで動かすのが正規の方法
- 常時起動エージェントのAPI利用料は高額になるため、Max/Proサブスクリプションのsetup-tokenを流用して定額で使う手法が広まった
- **Anthropic社のToS違反**にあたり、AnthropicがOAuthの第三者利用をブロック
- GoogleもOpenClaw経由でOAuthトークンを利用していたAntigravityユーザーのアカウントを停止
- 常時起動＋HEARTBEATの構造上、**使っていなくてもAPIコストが継続的に発生**

### モデル互換性

| モデル | 評価 |
|---|---|
| **Claude Opus 4.6**（デフォルト） | 最も機能する |
| **Sonnet 4.5** | 多くのケースで十分 |
| **GPT-5.3-codex** | 同様に有能 |
| **Gemini 3 Pro** | 動作する |
| GLM / Kimi / DeepSeek / Minimax等 | 対応しているが性能が1段落ちる |
| ローカルLLM | Mac miniで動くサイズでは常時起動エージェントの複雑な推論に不足。非現実的 |

steipete本人は「Opusが最高の汎用エージェント、コーディングはCodex」と使い分けている。

### 実行環境の選択肢

| 環境 | 特徴・注意点 |
|---|---|
| **Mac mini**（物理隔離） | 人気の構成。ただしOutgoingネットワークは制限されないため踏み台リスクあり |
| Docker / VPS / exe.dev | GUI（Mac連携機能）を要求する自動化には非対応 |
| **Moltworker**（Cloudflare Workers） | サーバレス。cold start等で動作特性が変わるトレードオフ |
| **Sprites** | サーバレスデプロイ |

- チャネルはTelegram、Discordが第一候補（APIが使いやすくクライアントもハックしやすい）
- 筆者はローカルのDockerコンテナ内で設定を試し、SpritesにデプロイしてSlackから利用

---

## なんでもできることの代償

### Moltbook: HEARTBEATの帰結

- USの起業家Matt Schlichtが作ったAIエージェント専用のRedditライクなSNS
- HEARTBEAT.mdに定期タスクを登録するスキルとして内部機能に乗っている

**実態：**
- ピーク時150万登録エージェント、25万投稿、850万コメント
- アクティブなのは46,000エージェント（3.1%）、17,000人の人間が1人あたり88エージェントを管理
- 33%が完全な重複コンテンツ → MIT Technology Reviewが「peak AI theater（AIごっこの極み）」と評価
- 2026年1月31日：SupabaseのRow Level Security無効化が発覚、**150万APIキーと35,000メールアドレスが露出**
- 暗号通貨詐欺やフィッシングも横行

### ClawHub: スキルのサプライチェーン攻撃

- OpenClaw公式のスキルレジストリ（3,286+スキル、150万+ダウンロード）
- `clawhub install my-skill`でインストール。スキルの実体はSKILL.md＋補助テキストのフォルダ1つ
- **公開要件は1週間以上のGitHubアカウントのみ。コード署名もレビューもサンドボックスもない**

**[ClawHavocキャンペーン](https://www.koi.ai/blog/clawhavoc-341-malicious-clawedbot-skills-found-by-the-bot-they-were-targeting)の調査結果：**
- 2,857スキルの監査で**341個（11.9%）が悪意あるもの**と判明
- 暗号通貨ツールを偽装したtyposquat（clawhub1, clawhubbなどの偽名）が主な手口
- [Atomic macOS Stealer（AMOS）の配布](https://www.bleepingcomputer.com/news/security/amos-infostealer-targets-macos-through-a-popular-ai-app/)も確認 → Keychain、ブラウザcookies、暗号通貨ウォレット、SSH鍵が窃取対象
- [Snykの調査](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/)：3,984スキルの**36.82%に何らかのセキュリティ欠陥**

公式に[VirusTotal連携](https://openclaw.ai/blog/virustotal-partnership)が導入されたが、「巧妙に隠蔽されたプロンプトインジェクション・ペイロードが網をすり抜ける可能性は依然としてある」と認めている。スキルの実体がMarkdownテキストのため、コード署名やVirusTotalのような静的解析では本質的に検出しにくく、**npmより厄介**。

> 筆者の見解：他人の作ったスキルは使わず、自作するほうが早い。

### OpenClaw本体の脆弱性

- 攻撃者のURLを開くとgatewayトークンが流出する[1-Click RCE](https://github.com/openclaw/openclaw/security/advisories/GHSA-g8p2-7wf7-98mq)
- [40,000以上のインスタンスがインターネットに露出](https://www.infosecurity-magazine.com/news/researchers-40000-exposed-openclaw)、63%が脆弱
- 全APIキーが平文で`~/.openclaw/`に保存されることがある
- RedLineやLumma等のinfostealerが`~/.openclaw/`を窃取対象に追加済み
- [時間差プロンプトインジェクション](https://www.penligent.ai/hackinglabs/the-openclaw-prompt-injection-problem-persistence-tool-hijack-and-the-security-boundary-that-doesnt-exist/)（ペイロードを長期記憶に分割保存して後で組み立てる）も報告
- **[Gartnerは「受け入れがたいサイバーセキュリティリスク」として企業利用をブロックすべきと評価](https://www.theregister.com/2026/02/04/cloud_hosted_openclaw/)**
- トレーシング・モニタリングの仕組みが弱く、エージェントが何を実行したか事後追跡が困難

---

## まとめ

- 2026年2月14日にsteipeteはOpenAIに入社、「母親でも使えるエージェントを作る」と語る
- OpenClawはOSS財団に移管。MarioはPiの開発を継続
- Armin Ronacherは[Earendil](https://earendil.com/purpose/)を設立し、durable execution実装「[Absurd](https://lucumr.pocoo.org/2025/11/3/absurd-workflows/)」やエージェント時代の言語設計に取り組む

### 業界全体の課題

[Simon Willisonのアンケート](https://x.com/simonw/status/2022323970276786460)（2026/2/13、2,111票）：
- コーディングエージェントユーザーの**過半数が`--dangerously-skip-permissions`を常用**
- **44%がサンドボックスなしで実行**

サンドボックスなしでサードパーティSkillを実行する構造はOpenClawのClawHub問題と同根で、攻撃面が掛け算になる。Simon Willisonは「コーディングエージェントのセキュリティでチャレンジャー号事故が起きる」と警告、Johann Rehbergerは「逸脱の常態化（Normalization of Deviance）」を指摘。

### 筆者の今後の予測

- steipeteのOpenAI合流で過熱は一段落し、OpenClawはハッカーの玩具箱としての立ち位置に回帰
- 業界の注目はOpenAIやモデル開発元自身が提供するアシスタントサービスに移行

### 推奨される使い方

- Docker環境＋TUIでエージェントの動作とHEARTBEATやメモリ生成を観察するのがおすすめ
- 継続して使いたくなったら専用PCを用意（ただしOutgoingネットワークの外部送信リスクは残る）
- 「善良なプロンプトインジェクションでコンピュータを自動操縦する」というセキュリティモデルを理解した上で、自分とエージェントが把握できる範囲でスキルを取り込んで使うのが現実的
