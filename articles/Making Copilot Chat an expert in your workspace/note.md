# Making Copilot Chat an expert in your workspace

Copilot Chatで`@workspace`を参照すると、コードベース全体に関する質問が可能になります。質問に基づき、Copilotは関連するファイルやシンボルを賢く取得し、それらをリンクやコード例として回答に参照します。`@workspace`の参照を土台とすることで、Copilot Chatは以下のようなタスクにおいてドメインの専門家として機能します：

- コードベース内の既存コードの検索:
  - `"@workspace where is database connecting string configured?"`  
    \- データベース接続文字列がどこで、どのように設定されているかを説明します
  - `"@workspace how can I validate a date?"`  
    \- コードベース内の既存の日付検証ヘルパーを探し出します
  - `"@workspace where are tests defined?"`  
    \- テストスイート、テストケース、関連する参照および設定の位置を提供します
- 複雑なコード編集の計画作成:
  - `"@workspace how can I add a rich tooltip to a button?"`  
    \- 既存のツールチップコンポーネントをボタン要素に適用する計画を提供します
  - `"@workspace add date validation to #selection"`  
    \- 選択されたコードに既存の日付検証をどのように適用するか計画を立てます
  - `"@workspace add a new API route for the forgot password form"`  
    \- 新しいルートを追加する場所と、既存のコードにどのように接続するかを概説します
- コードベース内の高レベルな概念の説明:
  - `"@workspace how is authentication implemented?"`  
    \- 認証フローの概要と関連するコードの参照を示します
  - `"@workspace which API routes depend on this service?"`  
    \- 選択されたコードでこのサービスに依存しているルートの一覧を示します
  - `"How do I build this #codebase?"`  
    \- ドキュメント、スクリプト、設定に基づいてプロジェクトをビルドする手順の一覧を示します

## [@workspaceがコンテキストに利用するソースは何ですか？](https://code.visualstudio.com/docs/copilot/workspace-context#_what-sources-does-workspace-use-for-context)

あなたの質問に答えるため、`@workspace`はVS Codeでコードベースをナビゲートする際に開発者が利用するのと同じソースを検索します：

- ワークスペース内のすべての[インデックス可能なファイル](https://code.visualstudio.com/docs/copilot/workspace-context#_what-content-is-included-in-the-workspace-index)（ただし、`.gitignore`ファイルで無視されるファイルは除く）
- ネストされたフォルダー名やファイル名を含むディレクトリ構造
- ワークスペースがGitHubリポジトリであり、[コード検索によってインデックスされている](https://docs.github.com/en/enterprise-cloud@latest/copilot/github-copilot-enterprise/copilot-chat-in-github/using-github-copilot-chat-in-githubcom#asking-a-question-about-a-specific-repository-file-or-symbol)場合のGitHubのコード検索インデックス
- ワークスペース内のシンボルや定義
- アクティブエディター内で現在選択されているテキストまたは表示されているテキスト

注意  
`.gitignore`は、無視対象のファイル内でファイルが開かれている場合やテキストが選択されている場合にはバイパスされます。

## [@workspaceが最も関連性の高いコンテキストをどのように見つけるか](https://code.visualstudio.com/docs/copilot/workspace-context#_how-does-workspace-find-the-most-relevant-context)

あなたのVS Codeワークスペース全体は、GitHub Copilotにチャットプロンプトの回答として渡すには大きすぎる場合があります。そのため、`@workspace`は複数のコンテキストソースから最も関連性の高い情報を抽出し、Copilotの回答の基盤とします。

まず、`@workspace`は会話履歴、ワークスペース構造、現在選択されているコードを含め、質問に答えるためにどの情報が必要かを判断します。

次に、ローカルでの検索や[GitHubのコード検索](https://github.blog/2023-02-06-the-technology-behind-githubs-new-code-search)を利用して関連するコードスニペットを見つけたり、VS Codeの言語インテリセンスを使用して関数シグネチャやパラメーターなどの詳細情報を追加するなど、さまざまなアプローチでコンテキストを収集します。

最後に、このコンテキストはGitHub Copilotによってあなたの質問に回答するために使用されます。もしコンテキストが大きすぎる場合は、最も関連性の高い部分のみが利用されます。回答はファイル、ファイル範囲、シンボルへの参照でマークアップされ、チャットの回答から直接コードベース内の該当情報にリンクできるようになります。Copilotに提供されたコードスニペットは、回答内の参照として一覧表示されます。

## [@workspaceスラッシュコマンドのコンテキスト](https://code.visualstudio.com/docs/copilot/workspace-context#_context-for-workspace-slash-commands)

`@workspace`は、よく使用されるタスクの省略記法としていくつかの_スラッシュコマンド_を提供し、時間と入力の手間を節約します。各コマンドは独自に最適化されたコンテキストを定義しており、追加のプロンプトやチャット変数の必要性をしばしば排除します。利用可能なスラッシュコマンドとそのコンテキストは以下の通りです：

| コマンド | コンテキスト |
| --- | --- |
| `/explain` | - アクティブエディター内のテキスト選択（`#selection`）から開始します。Copilotチャットの回答を最適化するため、関連情報を含むようにテキスト選択を拡大することをお勧めします。<br>- 関数やクラスなど、参照されるシンボルの実装を検索し、より正確で有用な説明につなげます。 |
| `/tests` | - アクティブエディター内の現在のテキスト選択。テキストが選択されていない場合は、現在アクティブなファイルの内容が使用されます。<br>- 既存のテストファイルも参照して、既存のテストやベストプラクティスを理解します。 |
| `/fix` | - アクティブエディター内の現在のテキスト選択。テキストが選択されていない場合は、エディター内で表示されているテキストが使用されます。<br>- 修正すべき内容やその方法を理解するために、エラーや参照されるシンボルが使用されます。 |
| `/new` | - チャットプロンプトのみがコンテキストとして使用されます。 |
| `/newNotebook` | - チャットプロンプトのみがコンテキストとして使用されます。 |

チャットプロンプト内で`#editor`、`#selection`、または`#file`などのチャット変数を使用して、コンテキストを明示的に拡張することもできます。たとえば、別のファイルのパターンに基づいて現在のファイル内のエラーを修正する場合は、以下のようにチャットプロンプトを使用します：  
`@workspace /fix linting error in the style of #file:form.ts`

## [ワークスペースインデックスの管理](https://code.visualstudio.com/docs/copilot/workspace-context#_managing-the-workspace-index)

Copilotは、コードベースから関連するコードスニペットを迅速かつ正確に検索するためにインデックスを使用します。このインデックスはGitHubによって管理される場合もあれば、ローカルマシンに保存される場合もあります。このセクションでは、Copilotが使用可能な異なる種類のインデックス（[リモート](https://code.visualstudio.com/docs/copilot/workspace-context#_remote-index)、[ローカル](https://code.visualstudio.com/docs/copilot/workspace-context#_local-index)、[ベーシック](https://code.visualstudio.com/docs/copilot/workspace-context#_basic-index)）について説明し、それぞれがどのような状況で使用され、どのように切り替えるかを解説します。

現在Copilotが使用しているインデックスの種類を確認するには、ステータスバーの`{}`アイコンを選択して言語ステータスUIをチェックしてください。Copilotのワークスペースインデックスのエントリには、インデックスタイプと、再インデックス化されているファイル数など、このインデックスに関する関連情報が表示されます。

![言語ステータスUIにおけるCopilotインデックスの状況の表示](https://code.visualstudio.com/assets/docs/copilot/copilot-chat/workspace-index-status.png)

### [リモートインデックス](https://code.visualstudio.com/docs/copilot/workspace-context#_remote-index)

GitHubリポジトリの場合、Copilotは[GitHubコード検索](https://docs.github.com/en/enterprise-cloud@latest/copilot/using-github-copilot/asking-github-copilot-questions-in-github#asking-exploratory-questions-about-a-repository)を利用して、コードベースのリモートインデックスを構築できます。これにより、コードベースが非常に大規模であっても、全体を高速に検索することが可能になります。

リモートインデックスを使用するには：

- VS CodeでGitHubアカウントにサインインする
- GitHubのgitリモートが設定されたプロジェクトを開く。コードもGitHubにプッシュしていることを確認する
- リモートインデックスは、GitHubに比較的新しいコードがある場合に最適に動作するため、定期的にコードをGitHubにプッシュすることが重要です
- **Build remote workspace index** コマンドを実行するか、ワークスペースインデックスのステータスUIでBuild Indexボタンを選択してリモートインデックスを構築する

大規模なコードベースの場合、リモートインデックスの構築には時間がかかることがあります。ワークスペースインデックスのステータスUIでリモートインデックスの状態を監視できます。

一度リモートインデックスが構築されると、コード変更がプッシュされるたびにGitHubが自動的に最新の状態に保ちます。同一リポジトリにつき、一度のみ**Build remote workspace index**コマンドを実行すれば十分です。

### [ローカルインデックス](https://code.visualstudio.com/docs/copilot/workspace-context#_local-index)

[リモートインデックス](https://code.visualstudio.com/docs/copilot/workspace-context#_remote-index)が利用できない場合、Copilotは代わりにローカルマシンに保存された高度なセマンティックインデックスを使用できます。このインデックスも迅速で高品質な検索結果を提供しますが、現在は2500個のインデックス可能なファイルに制限されています。リモートインデックスと異なり、ローカルインデックスはユーザーごと、マシンごとに一度構築する必要があります。リモートインデックスでは、同じリポジトリのすべてのユーザーが同じインデックスを共有できます。

プロジェクト内のインデックス可能なファイルが750個未満の場合、Copilotは自動的に高度なローカルインデックスを構築します。750個から2500個のファイルがあるプロジェクトでは、**Build local workspace index** コマンドを実行してインデックスを開始できます。このコマンドは一度実行すれば十分です。

初回のローカルインデックス構築や、多くのファイルが変更された場合（例：gitブランチの切り替え時）には、インデックスの更新に時間がかかることがあります。ワークスペースインデックスのステータスUIで現在のローカルインデックスの状況を確認できます。

### [ベーシックインデックス](https://code.visualstudio.com/docs/copilot/workspace-context#_basic-index)

プロジェクトが[リモートインデックス](https://code.visualstudio.com/docs/copilot/workspace-context#_remote-index)を持たず、かつ2500個以上の[インデックス可能なファイル](https://code.visualstudio.com/docs/copilot/workspace-context#_what-content-is-included-in-the-workspace-index)が存在する場合、Copilotはコードベースの検索にベーシックインデックスを使用します。このインデックスは、より単純なアルゴリズムでコードベースを検索し、大規模なコードベース向けにローカルでの動作が最適化されています。

多くの質問に対してはベーシックインデックスで十分に対応できますが、コードベースに関する質問への回答でCopilotが苦戦している場合は、[リモートインデックス](https://code.visualstudio.com/docs/copilot/workspace-context#_remote-index)へのアップグレードを検討してください。

### [ワークスペースインデックスに含まれるコンテンツ](https://code.visualstudio.com/docs/copilot/workspace-context#_what-content-is-included-in-the-workspace-index)

Copilotは、現在のプロジェクトに含まれる関連するテキストファイルをインデックス化します。これは特定のファイルタイプやプログラミング言語に限定されるものではありませんが、通常`@workspace`の質問に関連性が低いとされる`.tmp`や`.out`などの一般的なファイルタイプは自動的にスキップされます。さらに、VS Codeのfiles.exclude設定で除外されているファイルや、`.gitignore`に含まれるファイルも除外されます。

また、Copilotは現在、画像やPDFなどのバイナリファイルはインデックス化しません。

## [@workspaceの利用に関するヒント](https://code.visualstudio.com/docs/copilot/workspace-context#_tips-for-using-workspace)

質問の表現方法は、`@workspace`が提供する参照の質や回答の正確性に大きな影響を与えます。結果を最適化するため、以下のヒントを参考にしてください：

- 質問は具体的かつ詳細に記述し、「これが何をするのか」といった曖昧な表現は避ける（「これ」が直前の回答、現在のファイル、またはプロジェクト全体などと解釈される可能性があるため）。
- プロンプト内に、コードやそのドキュメントに登場しそうな用語や概念を取り入れる。
- 回答内で使用された参照が関連性の高いファイルであるか確認し、必要に応じて質問を改善する。
- コードを選択するか、`#editor`、`#selection`、`#file`などのチャット変数を明示的に記述して、関連コンテキストを含める。
- 回答は、「catchブロックがない例外を見つける」や「handleErrorがどのように呼び出されるかの例を示す」といった複数の参照から情報を引き出す場合があります。ただし、「この関数が何回呼び出されているか」や「このプロジェクトのすべてのバグを修正する」といった、コード全体の包括的な解析を期待しないようにしてください。
- 現時点では、コード以外の情報（例：「このファイルの貢献者は誰か？」や「このフォルダーのレビューコメントを要約する」など）は仮定しないようにしてください。
