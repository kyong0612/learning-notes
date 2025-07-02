---
title: "用語集 | Yarn"
source: "https://yarnpkg.com/advanced/lexicon#hoisting"
author:
published:
created: 2025-07-02
description: "このドキュメント全体で使用される一般的な用語の定義。"
tags:
  - "clippings"
  - "translation"
---
### ビルドスクリプト (Build Scripts)

パッケージがインストールされた直後に実行されるタスクを指します。通常、`manifest` の `[scripts](https://yarnpkg.com/configuration/manifest#scripts)` フィールドで設定される `postinstall` スクリプトです。

ビルドスクリプトはネイティブ依存関係に限定すべきであり、純粋なJavaScriptパッケージがそれらを使用する理由はほとんどありません。ビルドスクリプトはユーザーのプロジェクトに[重大な副作用](https://yarnpkg.com/advanced/lifecycle-scripts#a-note-about-postinstall)をもたらす可能性があるため、本当に必要かどうかを慎重に検討してください。

参照: [ライフサイクルスクリプト](https://yarnpkg.com/advanced/lifecycle-scripts)

### 依存関係 (Dependency)

依存関係（`manifest` の `[dependencies](https://yarnpkg.com/configuration/manifest#dependencies)` フィールドに記載）は、2つのパッケージ間の関係を記述します。

パッケージAが依存関係Bを持つ場合、Yarnはインストールが成功すればAがBにアクセスできることを保証します。これが通常の依存関係に関してYarnが行う唯一の約束であることに注意してください。特に、パッケージBがアプリケーションの他の部分で使用されているものと同じバージョンであるという保証はありません。

参照: [開発依存関係](https://yarnpkg.com/advanced/#development-dependency), [ピア依存関係](https://yarnpkg.com/advanced/#peer-dependency)

### デスクリプタ (Descriptor)

デスクリプタは、パッケージ名（例：`lodash`）とパッケージ範囲（例：`^1.0.0`）の組み合わせです。デスクリプタは、単一のユニークなパッケージではなく、パッケージのセットを識別するために使用されます。

### 開発依存関係 (Development Dependency)

依存関係（`manifest` の `[devDependencies](https://yarnpkg.com/configuration/manifest#devDependencies)` フィールドに記載）は、2つのパッケージ間の関係を記述します。

開発依存関係は通常の依存関係と非常によく似ていますが、ローカルパッケージに対してのみ意味を持つ点が異なります。npmなどのリモートレジストリから取得されたパッケージは、その開発依存関係にアクセスできませんが、ローカルソース（[ワークスペース](https://yarnpkg.com/advanced/#workspaces)や[`portal:`プロトコル](https://yarnpkg.com/advanced/#portals)など）からインストールされたパッケージはアクセスできます。

参照: [依存関係](https://yarnpkg.com/advanced/#dependency), [ピア依存関係](https://yarnpkg.com/advanced/#peer-dependency)

### フェッチャー (Fetcher)

フェッチャーは、参照から完全なパッケージデータを抽出するタスクを担うコンポーネントです。例えば、npmフェッチャーはnpmレジストリからパッケージのtarballをダウンロードします。

参照: [アーキテクチャ](https://yarnpkg.com/advanced/architecture), [Fetcherインターフェース](https://github.com/yarnpkg/berry/blob/master/packages/yarnpkg-core/sources/Fetcher.ts#L34)

### 巻き上げ (Hoisting)

巻き上げ（Hoisting）は、依存関係ツリーを変換して、できるだけ多くのノードを削除することで最適化する行為です。ツリーをどのように変換するかを決定する単一の方法はなく、異なるパッケージマネージャは異なるトレードオフを行います（パッケージの人気度、パッケージサイズ、最新バージョンなどで最適化するものもあります）。このため、最終的な巻き上げのレイアウトに関して保証はできません。ただし、パッケージは常に[マニフェスト](https://yarnpkg.com/advanced/#Manifest)に記載した依存関係にアクセスできるという点だけは保証されます。

巻き上げはファイルシステムとNodeの解決（resolution）に密接に関連しているため、その設計上、誤って依存関係として適切に定義されていないパッケージにアクセスしてしまうエラーを犯しやすくなります。その結果、それらのパッケージの存在は予測不可能になります。この理由やその他の理由から、Yarn 2以降では巻き上げは[Plug'n'Play解決](https://yarnpkg.com/advanced/#plugnplay)に取って代わられました。

### リンカー (Linker)

リンカーは、依存関係ツリーとパッケージデータのストアの両方を消費し、ターゲットとする環境に固有のディスクアーティファクトを生成するコンポーネントです。例えば、Plug'n'Playリンカーは単一の`.pnp.cjs`ファイルを生成します。

参照: [アーキテクチャ](https://yarnpkg.com/advanced/architecture), [Installerインターフェース](https://github.com/yarnpkg/berry/blob/master/packages/yarnpkg-core/sources/Installer.ts#L18), [Linkerインターフェース](https://github.com/yarnpkg/berry/blob/master/packages/yarnpkg-core/sources/Linker.ts#L28)

### ローカルキャッシュ (Local Cache)

ローカルキャッシュ、またはオフラインミラーは、パッケージレジストリがダウンした場合にプロジェクトを保護する方法です。

ローカルキャッシュが有効になっていると、Yarnはインストールするすべてのパッケージのコピーを`.yarn/cache`フォルダに生成し、それをリポジトリに追加できます。その後のインストールでは、新たにダウンロードするのではなく、このフォルダからパッケージを再利用します。

常に実用的というわけではありませんが（リポジトリのサイズが大きくなる原因となりますが、それを大幅に緩和する方法はあります）、いくつかの興味深い特性があります：

- [Verdaccioプロキシ](https://verdaccio.org/)のような追加のインフラを必要としません。
- レジストリ認証のような追加の設定を必要としません。
- インストールのフェッチステップは、データ転送が一切なく、可能な限り高速です。
- PnPリンカーも使用すれば、[ゼロインストール](https://yarnpkg.com/features/caching#zero-installs)を達成できます。

ローカルキャッシュを有効にするには、`[enableGlobalCache](https://yarnpkg.com/configuration/yarnrc#enableGlobalCache)`を`false`に設定し、インストールを実行して、新しいアーティファクトをリポジトリに追加します（[gitignoreを更新する](https://yarnpkg.com/getting-started/qa#which-files-should-be-gitignored)とよいでしょう）。

### ロケーター (Locator)

ロケーターは、パッケージ名（例：`lodash`）とパッケージ参照（例：`1.2.3`）の組み合わせです。ロケーターは、単一のユニークなパッケージを識別するために使用されます（興味深いことに、すべての有効なロケーターは有効なデスクリプタでもあります）。

### マニフェスト (Manifest)

マニフェストは、パッケージに関連するメタデータ（名前、バージョン、依存関係など）を定義するファイルです。JavaScriptエコシステムでは、`package.json`ファイルがこれにあたります。

### モノレポ (Monorepo)

モノレポは、複数のパッケージを含むリポジトリです。[Babel](https://github.com/babel/babel/tree/master/packages)、[Jest](https://github.com/facebook/jest/tree/master/packages)、そして[Yarn自体](https://github.com/yarnpkg/yarn/tree/master/packages)もそのようなリポジトリの例です。これらはそれぞれ、互いに依存し合う数十の小さなパッケージを含んでいます。

Yarnは「ワークスペース」を介してモノレポをネイティブにサポートしています。これにより、単一のインストールを実行するだけで複数のローカルパッケージの依存関係を簡単にインストールでき、それらをすべて接続して、変更をプロジェクトの他の部分で再利用する前に公開する必要がなくなります。

参照: [ワークスペース（機能）](https://yarnpkg.com/features/workspaces), [ワークスペース（用語）](https://yarnpkg.com/advanced/#workspace)

### パッケージ (Package)

パッケージは依存関係ツリーのノードです。簡単に言えば、パッケージは通常、そのルートに`package.json`を持つソースコードのバンドルです。パッケージは、正しく機能するために利用可能にする必要がある他のパッケージである依存関係を定義できます。

### ピア依存関係 (Peer Dependency)

依存関係（`manifest`の`[peerDependencies](https://yarnpkg.com/configuration/manifest#peerDependencies)`フィールドに記載）は、2つのパッケージ間の関係を記述します。

通常の依存関係とは異なり、パッケージAがBに対するピア依存関係を持つ場合、AがBにアクセスできることは保証されません。Aからの要求と互換性のあるBのバージョンを手動で提供するのは、Aに依存するパッケージ次第です。この欠点には良い面もあります。AがアクセスするBのパッケージインスタンスは、Aの祖先が使用するものと全く同じであることが保証されます。これは、Bが`instanceof`チェックやシングルトンを使用する場合に非常に重要です。

参照: [開発依存関係](https://yarnpkg.com/advanced/#development-dependency), [シングルトンパッケージ](https://yarnpkg.com/advanced/#singleton-package)

### ピア依存パッケージ (Peer-Dependent Package)

ピア依存パッケージは、ピア依存関係をリストするパッケージです。

参照: [仮想パッケージ](https://yarnpkg.com/advanced/#virtual-package)

### プラグイン (Plugin)

プラグインはYarn 2+で導入された新しい概念です。プラグインを使用することで、Yarnを拡張し、さらに強力にすることができます。新しいリゾルバ、フェッチャー、リンカーの追加などが可能です。

参照: [プラグイン](https://yarnpkg.com/features/extensibility), [Pluginインターフェース](https://github.com/yarnpkg/berry/blob/master/packages/yarnpkg-core/sources/Plugin.ts#L67)

### プラグアンドプレイ (Plug'n'Play)

Plug'n'Playは、典型的な`node_modules`ディレクトリを生成する代わりに、単一のファイルを生成し、それをNodeに注入してインストールされたパッケージの場所を知らせる代替のインストール戦略です。v2からは、Plug'n'PlayがJavaScriptプロジェクトのデフォルトのインストール戦略になります。

参照: [Plug'n'Play](https://yarnpkg.com/features/pnp)

### PnP

[Plug'n'Play](https://yarnpkg.com/advanced/#plugnplay) を参照してください。

### ポータル (Portal)

ポータルは、`portal:`プロトコルを使用する依存関係で、ディスク上のパッケージを指します。

`link:`プロトコル（任意の場所を指せるが依存関係を持つことはできない）とは異なり、Yarnは依存パッケージがポータルを介して参照されるファイルにアクセスできるだけでなく、ポータル自体も自身の依存関係にアクセスできるように依存関係マップを設定します。ピア依存関係でさえもです！

### プロジェクト (Project)

プロジェクトという用語は、同じ依存関係ツリーに属するすべてのワークツリーを包含するために使用されます。

参照: [ワークスペース](https://yarnpkg.com/features/workspaces)

### 範囲 (Range)

範囲は、パッケージ名と組み合わせることで、単一パッケージの複数のバージョンを選択するために使用できる文字列です。範囲は通常semverに従いますが、サポートされているYarnプロトコルのいずれかを使用できます。

参照: [プロトコル](https://yarnpkg.com/protocols)

### 参照 (Reference)

参照は、パッケージ名と組み合わせることで、単一パッケージの単一バージョンを選択するために使用できる文字列です。参照は通常semverに従いますが、サポートされているYarnプロトコルのいずれかを使用できます。

参照: [プロトコル](https://yarnpkg.com/protocols)

### リゾルバ (Resolver)

リゾルバは、デスクリプタをロケーターに変換し、パッケージロケーターからパッケージマニフェストを抽出するタスクを担うコンポーネントです。例えば、npmリゾルバはnpmレジストリで利用可能なバージョンをチェックし、semver要件を満たすすべての候補を返し、その後npmレジストリにクエリして選択された解決策に関連する完全なメタデータを取得します。

参照: [アーキテクチャ](https://yarnpkg.com/advanced/architecture), [Resolverインターフェース](https://github.com/yarnpkg/berry/blob/master/packages/yarnpkg-core/sources/Resolver.ts#L45)

### スコープ (Scope)

スコープはnpmレジストリから継承された用語です。すべて同じエンティティに属するパッケージのセットを記述するために使用されます。例えば、v2に関連するすべてのYarnパッケージは、npmレジストリ上の`berry`スコープに属します。スコープは伝統的に`@`記号で接頭辞が付けられます。

### シングルトンパッケージ (Singleton Package)

シングルトンパッケージは、依存関係ツリー全体で一度だけインスタンス化されるパッケージです。

シングルトンパッケージは第一級の市民ではありませんが、[ピア依存関係](https://yarnpkg.com/advanced/#peer-dependency)の特性を利用して簡単に作成できます。ピア依存関係によって依存されるパッケージは、その直接の祖先が使用するものと全く同じインスタンスであることが保証されるため、依存関係ブランチ全体で最も近いワークスペースまでピア依存関係を使用することで、パッケージの単一のインスタンスのみが作成されることが保証され、事実上のシングルトンパッケージになります。

参照: [ピア依存関係](https://yarnpkg.com/advanced/#peer-dependency)

### 推移的依存関係 (Transitive Dependency)

推移的依存関係は、あなたが依存しているパッケージの依存関係です。

`react`のケースを想像してみてください。あなたのアプリケーションはそれに依存しているため（マニフェストで自分でリストした）、それは直接の依存関係です。しかし、`react`も`prop-types`に依存しています！これにより、`prop-types`は推移的依存関係になります。つまり、あなたはそれを直接宣言していません。

### アンプラグドパッケージ (Unplugged Package)

Yarn PnPでは、ほとんどのパッケージはディスクに展開されるのではなく、zipアーカイブ内に保持されます。これらのアーカイブは実行時にファイルシステムにマウントされ、透過的にアクセスされます。マウントは読み取り専用なので、何かが書き込もうとしてもアーカイブが破損することはありません。

しかし、場合によってはパッケージを読み取り専用に保つのが難しいことがあります（パッケージがpostinstallスクリプトをリストしている場合など。ビルドステップではしばしばビルドアーティファクトを生成する必要があり、読み取り専用フォルダは非現実的です）。このような状況のために、Yarnは特定のパッケージを展開し、それらを個別のフォルダに保持することができます。そのようなパッケージは「アンプラグド」と呼ばれます。

パッケージはいくつかのシナリオでアンプラグドになります：

- `dependenciesMeta[].unplugged`フィールドを`true`に設定することで明示的に
- パッケージが`[preferUnplugged](https://yarnpkg.com/configuration/manifest#preferUnplugged)`フィールドを`true`に設定した場合に明示的に
- パッケージがpostinstallスクリプトをリストしている場合に暗黙的に
- パッケージがネイティブファイルを含んでいる場合に暗黙的に

### 仮想パッケージ (Virtual Package)

[ピア依存パッケージ](https://yarnpkg.com/advanced/#peer-dependent-package)は、単一の静的な依存関係セットではなく、可能な依存関係セットの*範囲*を効果的に定義するため、ピア依存パッケージは複数の依存関係セットを持つことがあります。これが発生した場合、パッケージはそのようなセットごとに少なくとも一度インスタンス化される必要があります。

Nodeの世界ではJSモジュールはそのパスに基づいてインスタンス化されるため（特定のパスに対してファイルが二度インスタンス化されることはありません）、そしてPnPによってパッケージは特定のプロジェクト内で一度しかインストールされないため、これらのパッケージを複数回インスタンス化する唯一の方法は、同じディスク上の場所を参照しながら複数のパスを与えることです。そこで仮想パッケージが役立ちます。

仮想パッケージは、この特定のインスタンスが使用すべき依存関係のセットをエンコードするピア依存パッケージの特殊なインスタンスです。各仮想パッケージには一意のファイルシステムパスが与えられ、それが参照するスクリプトが適切な依存関係セットでインスタンス化されることを保証します。

過去には仮想パッケージはシンボリックリンクを使用して実装されていましたが、最近変更され、現在は仮想ファイルシステム層を介して実装されています。これにより、何百もの紛らわしいシンボリックリンクを作成する必要がなくなり、Windowsとの互換性が向上し、サードパーティツールが`realpath`を呼び出すことで発生する問題が防止されます。

### ワークスペース (Workspace)

一般的に言えば、ワークスペースは、同じリポジトリ内に保存された複数のプロジェクトで作業するために使用されるYarnの機能です。

Yarnの語彙の文脈では、ワークスペースはプロジェクトに直接属するローカルパッケージです。

参照: [ワークスペース](https://yarnpkg.com/features/workspaces)

### ワークツリー (Worktree)

ワークツリーは、現在のプロジェクトに新しい子ワークスペースを追加するプライベートワークスペースです。

参照: [ワークスペース](https://yarnpkg.com/features/workspaces)

### Yarn

Yarnは、プログラミング環境を管理するために使用されるコマンドラインツールです。JavaScriptで書かれており、主に他のJavaScriptプロジェクトと一緒に使用されますが、さまざまな状況で使用するのに適した機能を備えています。

### ゼロインストール (Zero-Install)

参照: [ゼロインストール](https://yarnpkg.com/features/caching#zero-installs)
