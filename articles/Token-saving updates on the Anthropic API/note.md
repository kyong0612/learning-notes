# Token-saving updates on the Anthropic API

ref: <https://www.anthropic.com/news/token-saving-updates>

![岩と稲妻のバランスをとる手のイラスト](https://www.anthropic.com/_next/image?url=https%3A%2F%2Fwww-cdn.anthropic.com%2Fimages%2F4zrzovbb%2Fwebsite%2Fe141172784c92b04ec3f44a679923c1da4117899-2880x1620.png&w=3840&q=75)

私たちはAnthropic APIにいくつかの更新を加え、開発者がClaude 3.7 Sonnetでのスループットを大幅に向上させ、トークン使用量を削減できるようにしました。これには、キャッシュ対応のレート制限、よりシンプルなプロンプトキャッシング、トークン効率の良いツール使用が含まれます。

これらの更新により、最小限のコード変更で既存のレート制限内でより多くのリクエストを処理し、コストを削減することができます。

## プロンプトキャッシングでスループットを向上

[プロンプトキャッシング](https://www.anthropic.com/news/prompt-caching)により、開発者はAPI呼び出し間で頻繁にアクセスされるコンテキストを保存して再利用できます。これにより、Claudeは各リクエストで同じ情報を送信することなく、大きなドキュメント、指示、または例の知識を維持できます—長いプロンプトの場合、コストを最大90%、レイテンシーを最大85%削減します。Claude 3.7 Sonnetのプロンプトキャッシングに2つの改善を加え、より効率的にスケーリングできるようにしました。

### キャッシュ対応のレート制限

プロンプトキャッシュの読み取りトークンは、Anthropic API上のClaude 3.7 Sonnetの1分あたりの入力トークン（ITPM）制限にカウントされなくなりました。これにより、プロンプトキャッシングの使用を最適化して、スループットを向上させ、既存のITPMレート制限からより多くの効果を得ることができます。1分あたりの出力トークン（OTPM）のレート制限は変わりません。

![キャッシュ対応ITPMによる追加スループットを示す棒グラフ](https://www.anthropic.com/_next/image?url=https%3A%2F%2Fwww-cdn.anthropic.com%2Fimages%2F4zrzovbb%2Fwebsite%2F3dd27bad67e95c1a25c8330f7e8eab21faf2798c-3840x2160.png&w=3840&q=75)

これにより、Claude 3.7 Sonnetは、広範なコンテキストを維持しながら高スループットを必要とするアプリケーションに特に強力になります：

- 大規模な知識ベースをコンテキストに維持する必要があるドキュメント分析プラットフォーム
- 広範なコードベースを参照するコーディングアシスタント
- 詳細な製品ドキュメントを活用するカスタマーサポートシステム

[キャッシュ対応のITPM制限](https://docs.anthropic.com/en/api/rate-limits#rate-limits)は、Anthropic API上のClaude 3.7 Sonnetで利用可能です。

### よりシンプルなキャッシュ管理

プロンプトキャッシングを使いやすくするために更新しました。現在、キャッシュブレークポイントを設定すると、Claudeは以前にキャッシュされた最長のプレフィックスから自動的に読み取ります。

最も関連性のあるキャッシュされたコンテンツを自動的に識別して使用するため、キャッシュされたセグメントを手動で追跡して指定する必要がなくなりました。これにより、作業負荷が減少するだけでなく、より多くのトークンが解放されます。

![最大キャッシュプレフィックスの自動使用の有無によるプロンプトキャッシングの比較](https://www.anthropic.com/_next/image?url=https%3A%2F%2Fwww-cdn.anthropic.com%2Fimages%2F4zrzovbb%2Fwebsite%2Fe82adfbb319b8970e1e7aefa2a284f0c201463b4-1920x1054.png&w=3840&q=75)

この機能はAnthropic APIとGoogle CloudのVertex AIで利用可能です。詳細は[ドキュメント](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)をご覧ください。

## トークン効率の良いツール使用

Claudeはすでに外部のクライアントサイドツールや機能と対話する能力を持っています。このアップデートでは、非構造化テキストから構造化データを抽出したり、APIを介して単純なタスクを自動化したりするなどのタスクを実行するために、独自のカスタムツールをClaudeに装備できるようになりました。Claude 3.7 Sonnetは現在、出力トークンの消費を最大70%削減する[トークン効率の良い方法でのツール呼び出し](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/token-efficient-tool-use)をサポートしています。初期ユーザーは平均して14%の削減を確認しています。

この機能を使用するには、Claude 3.7 Sonnetのツール使用リクエストにベータヘッダー_token-efficient-tools-2025-02-19_を追加するだけです。SDKを使用している場合は、_anthropic.beta.messages_を使用したベータSDKを使用していることを確認してください。

トークン効率の良いツール使用は現在、Anthropic API、Amazon Bedrock、およびGoogle CloudのVertex AIでベータ版として利用可能です。

### Text_editorツール

また、ユーザーがClaudeとドキュメントで協力するアプリケーション向けに設計された新しい_text_editor_ツールも導入しました。この新しいツールにより、Claudeはソースコード、ドキュメント、または研究レポート内のテキストの特定の部分に対象を絞った編集を行うことができます。これにより、精度を向上させながら、トークン消費とレイテンシーが削減されます。

開発者は、APIリクエストでこのツールを提供し、ツール使用レスポンスを処理することで、簡単にこのツールをアプリケーションに実装できます。

_text_editor_ツールはAnthropic API、Amazon Bedrock、およびGoogle CloudのVertex AIで利用可能です。開始するには[ドキュメント](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/text-editor-tool)をご覧ください。

## カスタマースポットライト：Cognition

Cognitionのような初期ユーザーは、これらの更新を活用してトークン効率とレスポンス品質を向上させています。Cognitionは応用AIラボであり、野心的なエンジニアリングチームがより多くを達成するのを助ける協力的AIチームメイトであるDevinの開発者です。

「プロンプトキャッシングにより、コストとレイテンシーを削減しながら、より高品質な結果を得るためにコードベースについてより多くのコンテキストを提供できます。キャッシュ対応のITPM制限により、プロンプトキャッシングの使用をさらに最適化して、スループットを向上させ、既存のレート制限からより多くの効果を得ることができます」と、Cognitionの共同創設者兼CEOのScott Wu氏は述べています。

## 今すぐ始める

これらの機能は、すべてのAnthropic APIユーザーが今日から利用できます。最小限のコード変更ですぐに実装できます：

1. **キャッシュ対応のレート制限を活用する：** Claude 3.7 Sonnetで[プロンプトキャッシング](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)を使用します。
2. **トークン効率の良いツール使用を実装する：** リクエストにベータヘッダー_token-efficient-tools-2025-02-19_を追加して、トークンの節約を開始します。
3. **_text_editor_ツールを試す：** より効率的なドキュメント編集ワークフローのために、アプリケーションに統合します。
