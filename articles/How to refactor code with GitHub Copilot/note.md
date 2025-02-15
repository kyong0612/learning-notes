# How to Refactor Code with GitHub Copilot

ref: <https://github.blog/ai-and-ml/github-copilot/how-to-refactor-code-with-github-copilot/>

私たちは皆、こんな経験をしたことがあるはずです。深夜3時に、まるで過剰にカフェインを摂取したゴブリン（あるいはあなた自身のもう一つの顔）が書いたかのような、読みにくい関数を目の前にして、途方に暮れる――存在しないふりをするか、リファクタリングするかのどちらかです。  
幸いなことに、GitHub Copilot を使えば、後者の選択肢も痛みが少なくなります。

さあ、始めましょう。

## コードのリファクタリングとは？ What is Code Refactoring?

もし既にリファクタリングに必要な作業内容をご存知なら、このセクションはサッと流しても構いませんが、今回は今日取り上げる内容を簡単に説明しておきます。

リファクタリングとは、プロジェクトにデジタルな春の大掃除を施すようなもので、関数、クラス、モジュールが輝きを取り戻す「グロウアップ」のようなものです。  
ただ単に整理整頓するだけではなく、コードの効率性、保守性、可読性を向上させつつ、外部から見た動作は変えないようにする作業です。

リファクタリングの一般的な方法としては、以下が挙げられます：  

- 複雑な条件分岐の単純化（誰も if 文を読むのに博士号は要らないはず）  
- 重複したロジックの抽出（同じコードを十箇所で管理するのは避けるため）  
- 変数名や関数名の改善（doThing() なんて人道に反する名前は避けるべき）  
- 巨大な関数を小さくモジュール化する（「画面をまたいで表示される長大な関数」になるのを防ぐため）

リファクタリングは単なる整理整頓にとどまらず、コードベースをより堅牢でスケーラブル、そして扱いやすくするためのものです。  
では、GitHub Copilot がどのようにこの作業を迅速かつストレスフリーにしてくれるのか、見ていきましょう.

### コードの動作を理解してからリファクタリングを始める  

Know What Your Code Does Before You Refactor Anything

一見当たり前のように思えるかもしれませんが、リファクタリングを行う前にはコードがどのように動作しているかを理解する必要があります。  
コードの動作が分からなければ、行っている「改善」が本質的な機能を変えてしまっていないか判断できません。

たとえば、次のメソッドを考えてみてください。

```js
public String getSound(String animal) {
  if (animal == null) {
      System.out.println("Oops! A null animal?");
  } else if (animal.equalsIgnoreCase("Dog")) {
      return "Bark";
  } else if (animal.equalsIgnoreCase("Cat")) {
      return "Meow";
  } else if (animal.equalsIgnoreCase("Bird")) {
      return "Tweet";
  }
  return "Unknown";
}
```

このコードを見たとき、「switch 文を使ったほうがいいのでは？」と直感的に思うかもしれません。  
これこそがコードのリファクタリングの一例です。しかし、そのような反応をするためには、if 文と switch 文がどのように動作するかを理解している必要があります。  
さもなければ、このコードが適切な一致が見つかるまで if 文を順次評価し、見つからなかった場合に Unknown を返すという仕組みを把握できないでしょう。

コードベースが大きくなり、複数のファイル間で呼び出しが行われると、この理解は（さらに）複雑になります。  
ここで GitHub Copilot が役立つのです。

Copilot Chat にコードの動作を平易な言葉や `/explain` スラッシュコマンドで質問すれば、コードの説明を得ることができます。  
質問する際は、IDE上で対象のコードを選択するか、`#file` を使って特定のファイルを指定することで、Copilot が見る範囲を絞ることができます。  
また、将来（または他の開発者が）コードを読む際に助けになるよう、コメントの追加を依頼することも可能です.

以下は、いくつかのサンプルプロンプトです：  

- Explain what this code does.  
- What is this code doing?  
- Add comments to this code to make it more understandable.

まずは、Copilot Chat を使ってコードベースを解析し、リファクタリング対象のコードを十分に理解しましょう.

### 一括での改善案を試してみる  

Try Some Blanket Improvements to Refactor Your Code

多くの物事と同様、リファクタリングも最初は小さなステップから始めるのが基本です。  
リファクタリング初心者の方は、まずプロジェクト内で Copilot Chat を開き、「どう改善すればいい？」と尋ねてみましょう。  
コードの説明を求めるときと同様、対象のコードを選択するか、`#file` を用いて特定のファイルを指定することで、範囲を絞ることができます.

以下は、いくつかのサンプルプロンプトです：  

- How would you improve this?  
- Improve the variable names in this function.  
- `#file:pageInit.js, #file:socketConnector.js` Offer suggestions to simplify this code.

Copilot は指定された内容に沿って、コード改善の提案を行ってくれます。  
これはあくまで「出発点」として非常に有用ですが、より具体的な指示を与えることで、さらに精度の高い提案を得ることも可能です.

### コードベースのリファクタリング計画を立てる  

Make a Plan for Refactoring Your Codebase

あなたのコードに対して、具体的に何を行いたいのでしょうか？  
可読性を向上させたいのか、冗長なコードを見つけて取り除きたいのか。  
改善したい点の計画を立てることが、目標達成への近道となります。  
これも、コードの動作を十分に理解していることが前提です。  
コードの仕組みが分かれば、どのような改善が可能か、またその計画を立てることができます.

たとえば、コードベース内に同じような機能を持つ複数のスクリプトがある場合、共通モジュールにまとめて各スクリプトからインポートできるようにすると、変更や保守が容易になります。

この場合、Copilot に対して、これらの共通コード部分を見つけ出し、一つのモジュールにまとめるよう指示することができます。

サンプルプロンプト例：

Inspect all my js files for GitHub API calls and create a new class that will manage all the GitHub API calls.

ここで、より具体的な文脈や指示を与えると、Copilot はその特定の改善案に焦点を当てた提案をしてくれます。

また、タスクリストを列挙したり、リファクタリング中に注意すべき点を念頭に置くよう指示することも可能です。

例として、以下のプロンプトを考えてみてください：

Can you refactor the GitHubController class to:

- remove nested logic structures
- make the code more concise
- while doing this, check if the code is safe and add comments if not

大切なのは、Copilot は与えた指示に従って動作するため、具体的な指示ほど、意図に沿ったアウトプットを得られるという点です。

リファクタリングにおける良いプロンプトの作成については、GitHub Copilot のプロンプトエンジニアリング のドキュメントも参照してください。

## 実際の例：GitHub Copilot を使ったコードリファクタリング  

A Real-World Example: Using GitHub Copilot to Refactor Code

実際の使用例を見るのが理解を深める一番の方法です。  
ここでは、私たち自身が GitHub Copilot を使ってコードリファクタリングを行った経験と、そこから得た一般的なアドバイスやポイントを共有します。

まず、いくつかの組織から、大規模なマイグレーションプロジェクト（他のデータセンターから GitHub 上の数万のリポジトリへ移行する作業）の支援依頼が個別に寄せられました。  
プロトタイプを作成した後、各顧客のニーズに合わせた個別システムを作り始めました。  
すると、三つ目の組織からも似たような依頼があり、これは共通のニーズであると気づいたのです。

その時点では、大規模なマイグレーションに適したシステムが2種類ありましたが、どちらも依頼元企業向けに大幅にカスタマイズされていました。  
そこで、複数の組織で再利用可能な共通モジュールを作成するために、コードのモジュール性を向上させるリファクタリングが最適な解決策であると判断しました。  
これは容易な作業ではなく、複数のスクリプトや多くの可動部分からなるコードベースの再構築が求められました。  
そこで、私たちは Copilot に助けを求めることにしました。

まずは計画を立てました。高レベルの目標を設定し、それに沿ってリファクタリングを進めることにしました。  
私たちが目指したのは、コードが以下の点を満たすことでした：  

- モジュール化され、複数の組織で再利用可能であること： コードは小さく自己完結したモジュールに整理され、新たな機能の追加や組み合わせが容易であること。  
- 保守性の向上： コードは簡単に保守・拡張できるよう、整理整頓され、十分にドキュメント化され、理解しやすいものであること。  
- 各組織向けのカスタマイズが可能であること： 各組織の固有のニーズに応じて柔軟に対応できること。  
- コーディング標準とベストプラクティスに則っていること： コードは一貫性があり、読みやすく、理解しやすいものであること。

この計画を元に、Copilot に支援を依頼しました。

### ステップ 1: 初期モジュールの作成  

Step 1: Creating the Initial Module

最初のステップは、各スクリプトでインポート可能な共通モジュールを作成することでした。  
これにより、同じコードを複数のスクリプトで再利用でき、保守性や拡張性が向上します。  
私たちは、gh-migrations というモジュールのスケルトンを作成し、その詳細を Copilot に埋めてもらいました。

Copilot へのプロンプト例：

I am creating a module, gh-migrations, which will hold common functionality to be used through out my project. I have already created an index.js for the module. Please inspect the other js files for GitHub API calls, create a new class for the module which will manage all GitHub API calls. This class should also account for rate limiting and errors. Do not make edits to the javascript files, rather identify the API calls, and add the functionality to the new GitHub API class.

Copilot の応答例：

I'll help create a GitHub API management class based on the API calls found in the provided files. Here's a step-by-step solution:

1. From analyzing the files, I identified these common GitHub API operations:

- Issues creation and updates
- Issue search
- Rate limit handling (403 errors)
- Common error handling patterns

2. I'll create a class that encapsulates these operations with proper error handling and rate limiting.

.github/lib/gh-migrations/index.js
Here's the GitHub API management class implementation:

<code>

This implementation:

1. Creates a GitHubApiManager class that handles all GitHub API interactions
2. Implements automatic rate limiting retry logic in withRateLimit
3. Provides methods for common operations:

- createIssue: Creates a new issue
- updateIssue: Updates an existing issue
- searchIssues: Searches for issues using GitHub's search API
- findIssueByTitle: Helper method to find issues by title
- getIssue: Gets a specific issue by number

Usage example:

<code>

The class handles:

- Automatic retry on rate limits
- Consistent error handling
- Repository context management
- Common GitHub API operations used across the codebase

This centralizes all GitHub API interactions and makes the code more maintainable and consistent.

コードを確認した上で、次のステップとして、これらの変更を別ファイルに分割し、index.js から参照できるようにしました。

次のプロンプト例：

Rename the class GitHubApiManager to GHApi and put it in a separate file that is referenced in the index.js file.

Copilot の応答例：

I'll help you split the code into two files. Here's the step by step solution:

1. Create a new file gh-api.js for the GHApi class
2. Update index.js to export the renamed class from the new file

.github/lib/gh-migrations/gh-api.js
Create a new file containing the renamed class:

<code>

.github/lib/gh-migrations/index.js
Update the index file to export the renamed class from the new file:

<code>

The changes:

1. Created a new file gh-api.js with the renamed class
2. Moved all the class implementation to the new file
3. Updated the class name from GitHubApiManager to GHApi
4. Modified index.js to require and export the class from the new file

Now consumers of this module can continue to import it the same way, but the implementation is better organized.

これらの変更を加えた後、GitHub API 呼び出しが含まれる各ファイルに対して同じプロセスを繰り返しました。  
ここでは、コード自体を直接リファクタリングするのではなく、後のリファクタリングに活用できる共通モジュールを作成することが目的でした。

さらに次のプロンプト例：

The gh-api.js file is a new class that will be used to manage all GitHub API calls. Please review the other javascript files for GitHub API calls to be added to gh-api.js. Do not edit the javascript files, only add new functionality to gh-api.js.

Copilot の応答例：

I'll analyze the JavaScript files and add the missing API functionality to the GHApi class.

.github/lib/gh-migrations/gh-api.js
Add methods for issue operations, searching, and deletion based on the API calls found in migration.js and application.js:

<code>

This implementation adds all the GitHub API functionality found in the other files:

1. From migration.js:

- createComment for updating issues with comments
- getIssue and isMigrationIssue for checking migration status

2. From application.js:

- searchIssues and searchIssuesByTitle for finding issues
- getIssueNodeId and deleteIssue for issue deletion via GraphQL
- findJiraIssue helper method to get Jira ticket information

The methods maintain the same rate limiting and error handling patterns while providing a cleaner interface for the API operations.

### ステップ 2: 新たなクラスの追加  

Step 2: Adding New Classes

新しく作成した GHApi クラスで GitHub API の管理ができるようになったので、次にアプリケーション内の各エンティティに対して再利用可能なクラスを作成したいと考えました。  
私たちのアプリケーションは GitHub Issues を使ったマイグレーションツールであるため、以下のエンティティのクラスを作成することにしました：  

- Migration issues（マイグレーション・イシュー）： 各リポジトリのマイグレーションに関する設定やメタデータを保持する。  
- Batch issues（バッチ・イシュー）： 個々のマイグレーション・イシューのグループに関する、カスタムアプリケーションIDやバッチの状態などの高レベルなメタデータを保持する。  
- Team issues（チーム・イシュー）： ユーザーグループや関連リポジトリ、リポジトリへのアクセス権限に関するマイグレーションを管理する。  
- Rewire issues（リワイヤー・イシュー）： マイグレーション完了後に、Azure DevOps パイプラインを新しい GitHub リポジトリに向けるための再設定操作を管理する。

Copilot へのプロンプト例：

Review the create-migration-issue.js and develop a new class called MigrationIssue that contains the properties associated with a migration. This shoud be added to the gh-migrations module where index.js is located.

Copilot の応答例：

I'll help create a new MigrationIssue class based on the migration configuration and status shown in the code. Here's the step-by-step solution:

1. Create a new file migration-issue.js in the gh-migrations directory
2. Update the index.js file to expose the new class
3. Extract configuration and status properties from the create-migration-issues.js file into the new class

migration-issue.js
Create a new class to represent a migration issue with all necessary properties and methods.

<code>

index.js
Update the index.js to expose the new MigrationIssue class.

<code>

The new MigrationIssue class encapsulates all the properties that were previously spread across various objects in the create-migration-issues.js file.  
It provides a clean interface for creating and managing migration issues, with helper methods for generating issue titles and source types.

You can now use this class in create-migration-issues.js by replacing the manual object creation with the MigrationIssue class.  
For example, the createMigrationConfig function could be replaced with:

<code>

同様に、BatchIssues、TeamIssues、RewireIssues についても各々のプロパティとメソッドを持つ新たなクラスを作成しました。

### ステップ 3: カプセル化  

Step 3: Encapsulation

エンティティクラスを構築した後、それぞれが自分自身の状態を管理すべきだと考えました。  
これはオブジェクト指向プログラミングにおいて一般的なパターンであり、クラス自身がその状態と振る舞いを管理する責任を持ちます。  
良いコーディング標準に則るという私たちの目標を念頭に置いてください。

クラスには、オブジェクトの状態を取得・設定するメソッドや、オブジェクトに対して何らかの処理を行うメソッドを含めるべきです。  
また、GitHub API を利用してオブジェクトの状態を管理する責任もクライアントコードではなくクラス自身に持たせることで、オブジェクトの状態が統一的かつ安全に管理され、クライアントコードはよりシンプルなインターフェースで操作できるようになります。

Copilot へのプロンプト例：

The MigrationIssue class should contain a initializer that uses the gh-api.js to create the resulting GitHub Issue. The initializer should take in an optional parameter called issueNumber, if the issueNumber is omitted the initializer should create a new Migration Issue and return the issue number created, if the issueNumber is passed to the initializer, the gh-api.js should be used to return the title and body of the issue which the class will parse to create the properties of the MigrationIssue.

Copilot の応答例：

I'll help you modify the code to add initialization logic to the MigrationIssue class. Here's the step-by-step solution:

1. Add a static method to parse issue body into configuration
2. Add initialization methods to handle both new and existing issues
3. Modify constructor to accept GHApi instance
4. Add method to generate issue body
5. Add method to create or load issue

migration-issue.js
Update the MigrationIssue class to handle initialization from GHApi.

<code>

The main changes include:

1. Constructor now accepts a GHApi instance as first parameter
2. Added parseIssueBody static method to parse configuration from issue body
3. Added generateIssueBody method to create the issue body format
4. Added initialize async method that either creates a new issue or loads an existing one
5. The initialize method returns the issue number in both cases

To use this updated class:

<code>

しかし、Copilot の提案では、initialize メソッドがコンストラクタに組み込まれていないという問題がありました。  
そこで、私たちは以下のように、反復的なプロンプトを使って改善を依頼しました。

再度のプロンプト例：

The MigrationIssue class has an initialize function that encapsulates functionality that should be included in the constructor. Rewire the constuctor method to include the initialzie function.

Copilot の応答例：

Let's modify the class to move the initialization logic into the constructor. Here's the step-by-step solution:

1. Make constructors async
2. Move initialization logic into constructor
3. Remove separate initialize method
4. Keep static parseIssueBody method

migration-issue.js
Move initialization logic into constructor.

<code>

The main changes:

1. Removed initialize method from the class
2. Added static create and load factory methods
3. Added save method to handle issue creation
4. Constructor remains synchronous but now only handles property initialization

Usage example:

<code>

This approach follows better object-oriented principles by:

1. Using factory methods for different creation scenarios
2. Keeping the constructor simple and synchronous
3. Separating issue creation into a distinct operation
4. Making the API more intuitive

Copilot の提案は、私たちが考えていたものとは異なり、factory メソッドを用いるアプローチでしたが、結果として有効に機能し、コンストラクタをシンプルに保つことができました。  
また、save メソッドにより、新規イシューの作成ロジックがカプセル化され、コードがより読みやすくなりました。

この作業は、追加した各クラスに対して同様のプロセスを繰り返すことで完了しました。

### ステップ 4: 最終リファクタリング  

Step 4: Final Refactoring

共通モジュールを作成した後、クライアントコードもより読みやすく、保守しやすいようにリファクタリングする必要がありました。  
その過程で、共通モジュールに不足している機能があれば追加することもできました。

この作業は反復的なプロセスで、クライアントコードと共通モジュールを行き来しながら、全体が正しく動作するように調整していきました。  
プロジェクトの進化に伴い、大規模なコード変更が可能となったのです。  
通常、コードが本番環境で使われている場合は、小さく段階的な変更が一般的ですが、いずれの場合も、コードが期待通りに動作することを確認するためのテストは忘れずに行いましょう。

Copilot へのプロンプト例：

Using the gh-migrations module, refactor the create-migration-issues.js

Copilot の応答例：

I'll help you refactor the create-migration-issues.js file to use the gh-migrations module. Here's the step-by-step solution:

1. Import the gh-migrations module
2. Create GHApi instance
3. Use MigrationIssue class for creating and managing migration issues
4. Simplify the main logic using the new classes

create-migration-issues.js
Refactor to use the gh-migrations module for better code organization and reusability.

<code>

The refactoring:

1. Removes redundant code by using the MigrationIssue class
2. Simplifies issue creation and management
3. Uses GHApi for GitHub API calls with built-in rate limiting
4. Removes duplicate code for different source types
5. Improves code organization and maintainability

The main changes:

- Removed several helper functions as they're now part of the MigrationIssue class
- Simplified the main logic flow
- Added better error handling
- Used structured configuration object
- Maintained the same functionality while reducing code complexity

同様に、残りのスクリプトも同じ手法でリファクタリングしました。  
たとえば、create-team-issues.js についても以下のように Copilot を活用しました。

プロンプト例：

Using the gh-migrations module refactor the create-team-issues.js

Copilot の応答例：

I'll help you refactor the create-team-issues.js file to use the gh-migrations module. Here's the step-by-step solution:

1. Import the gh-migrations module
2. Replace manual issue creation with TeamIssue class
3. Simplify team creation logic using the new class
4. Maintain the same JiraIssue tracking functionality

create-team-issues.js
Refactor to use the gh-migrations module for creating team issues.

<code>

The refactoring:

1. Uses the TeamIssue class to manage team issue creation
2. Simplifies the code by removing redundant config and status objects
3. Uses GHApi for GitHub operations with built-in rate limiting
4. Maintains the same JiraIssue tracking functionality
5. Reduces code duplication by using a loop for team creation

The code is now more maintainable and follows the same pattern as the migration issues implementation.

その後、同様のプロセスを他のスクリプトにも繰り返しました。

共通モジュールを先に作成しておくことで、Copilot に対して具体的な指示を出すことができ、結果として複数の組織で使えるリファクタリング済みのコードベースが完成しました。  
これにより、再利用可能でニーズに合わせたカスタマイズが容易な基盤が整いました。

## 留意点  

Things to Keep in Mind

コードのリファクタリングは、先ほどのシンプルな if 文の例のように簡単な場合もあれば、掘り下げていくと、複数ファイルにまたがる大規模なコードベースのリファクタリングという、ヘラクレスの苦行にも匹敵する作業になることもあります。

実際の経験から言うと、どこから手を付ければよいのかさえ分からなくなることも少なくありません。

まずは一歩引いて、基本から始めましょう。  
最初のステップは、リファクタリング対象のコードベースの理解を深めることです。  
現状を十分に理解すれば、効果的なリファクタリングの方法も見えてきます。  
そして、改善案が浮かんだら、いつでも GitHub Copilot にその実現を手助けしてもらいましょう。  
Copilot はあなたのバックアップ役として、喜んでサポートしてくれます。
