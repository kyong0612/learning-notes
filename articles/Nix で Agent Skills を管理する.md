---
title: "Nix で Agent Skills を管理する"
source: "https://zenn.dev/kyre/articles/46269c831775d9"
author:
  - "Kyure_A"
published: 2025-12-24
created: 2025-12-26
description: |
  Agent SkillsをNixで管理するためのフレームワーク「agent-skills-nix」について説明した記事。Nix Flakeによる環境の固定とhome-managerによる宣言的な設定により、Agent Skillsを安全かつ効率的に管理する方法を提案している。MCP Serverとは異なり、Agent Skillsは単なるテキストファイルとスクリプトで構成されており、複数のリポジトリから提供されるAgent Skillsを統合して管理できる。
tags:
  - "Nix"
  - "Agent Skills"
  - "Claude Code"
  - "Codex"
  - "home-manager"
  - "MCP"
---

## はじめに

Model Context Protocol (MCP) が主流だった時期から状況が変わり、コンテキストウィンドウの関係から多くの MCP Server を入れることは主流ではなくなってきている。

2025年10月に Anthropic から Agent Skills が発表され、12月18日にオープンな規格となった。MCP Server についてはすでに Nix を用いて宣言的に管理する手法が存在するが、Agent Skills について Nix で管理する手法はまだ見当たらなかった。そのため、Nix を用いた Agent Skills 設定のためのフレームワークである [agent-skills-nix](https://github.com/Kyure-A/agent-skills-nix) を作成した。

## なぜ Nix？

Nix で Agent Skills を管理する最大の利点は、以下の通り：

1. **Nix Flake による環境の固定**: どの Agent Skills をどのエージェントに入れるかを設定で固定できるため、環境を増やす・再構築しても同じ状態を再現できる
2. **home-manager による宣言的な設定**: 将来の更新や悪意ある差し替えにも強くなる
3. **セキュリティ**: Nix Flake で commit 単位でロックしておけば、未来の commit において悪意のあるプロンプトに差し替えられたとしても問題がない
4. **統合性**: 複数リポジトリから提供される Agent Skills の統合ができ、エージェントの設定ファイルごとの配置も一箇所で完結する

実際の動機としては、home-manager ですべての設定を管理しているため、Agent Skills についても一元管理したいという要望があった。

## 実装

MCP Server とは違い、Agent Skills は単なるテキストファイルとそれに付随するスクリプトがあるだけである。そのため、各エージェントごとのディレクトリにシンボリックリンクを貼る実装となっている。

最初はすべてのエージェントについてシンボリックリンクですべて配置する想定だったが、Codex については実体がなければ Agent Skills を読み込んでくれないため、実体を配置するオプションも実装した。

## 設定ファイル

[mcp-servers-nix](https://zenn.dev/natsukium/articles/f010c1ec1c51b2#%E8%A8%AD%E5%AE%9A%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%AE%E4%BD%9C%E6%88%90%E3%81%A8%E3%83%93%E3%83%AB%E3%83%89) は NixOS や home-manager などのシステム構成フレームワークに依存していないが、agent-skills-nix については home-manager に依存している。

Agent Skills のリポジトリがたくさん config の Nix Flake の inputs に並ぶのを避けるため、子ディレクトリに `flake.nix` と `default.nix` を作り、子供の Nix Flake を親の Nix Flake が inputs に入れる形式にして依存関係を分離している。

`AGENTS.md` / `CLAUDE.md` などの指示用のファイルについては、Agent Skills ではないため、まだ配置機能は実装していない。

### 設定例

#### flake.nix

```nix
{
  description = "Agent Skills";

  inputs = {
    agent-skills.url = "github:Kyure-A/agent-skills-nix";
    anthropic-skills = {
      url = "github:anthropics/skills";
      flake = false;
    };
    my-skills = {
      url = "github:Kyure-A/skills";
      flake = false;
    };
  };

  outputs =
    {
      self,
      agent-skills,
      anthropic-skills,
      my-skills,
      ...
    }:
    {
      homeManagerModules.default =
        { ... }@args: import ./ (args // { inherit agent-skills anthropic-skills my-skills; });
    };
}
```

#### default.nix

```nix
{
  lib,
  agent-skills,
  anthropic-skills,
  my-skills,
  ...
}:
{
  imports = [
    (import "${agent-skills.outPath}/modules/home-manager/agent-skills.nix" {
      inherit lib;
      inputs = { };
    })
  ];

  programs.agent-skills = {
    enable = true;
    sources = {
      anthropic = {
        path = anthropic-skills;
        subdir = "skills";
      };
      personal = {
        path = my-skills;
      };
    };
    skills.enable = [
      "frontend-design"
      "skill-creator"
    ];
    skills.enableAll = [ "personal" ];
    targets = {
      codex = {
        dest = ".codex/skills";
        structure = "copy-tree";
      };
      claude = {
        dest = ".claude/skills";
        structure = "copy-tree";
      };
    };
  };
}
```

### 設定項目の説明

- **`sources`**: Agent Skills の取得元。`subdir` は SKILL.md が並ぶディレクトリで、anthropics/skills の場合は root からみた `"skills"` ディレクトリを指定する。
- **`skills.enable`**: 許可リスト。有効化する Agent Skills を個別に指定する。
- **`skills.enableAll`**: `true` ですべてのリポジトリについてすべての Agent Skills を有効化できる。あるいは `["personal"]` のようにリポジトリ単位ですべての Skills を有効化するショートカットとしても使用できる。
- **`targets`**: 配置先を決める。`dest` は `$HOME` との相対パスで指定し、`structure` として `link`/`symlink-tree`/`copy-tree` を選ぶ。Codex のように実体が必要なエージェントについては `copy-tree` が無難。

## まとめ

- Agent Skills を Nix Flake でピン留めして、将来の差し替えや悪意ある変更に強くできる
- home-manager で Agent Skills を宣言的に管理できる
- 既存の Agent Skills リポジトリをそのまま束ねられるので、複数ソースの統合が楽
- ただし home-manager 依存であり、`AGENTS.md` の生成/更新は別途行う必要がある

## おわりに

半年前くらいまでは LLM が Nix を書くのは難しそうだったが、今となっては `gpt-5.2-codex xhigh` がほとんど作ってくれて進歩を感じている。まだ執筆時点だと作って 2 日目くらいの発展途上なフレームワークなので、issue や Pull Request を歓迎している。

## 参考リンク

- [Agent Skills 公式ドキュメント](https://platform.claude.com/docs/ja/agents-and-tools/agent-skills/overview)
- [agent-skills-nix リポジトリ](https://github.com/Kyure-A/agent-skills-nix)
- [OpenSkills (非Nixでの手法)](https://github.com/numman-ali/openskills)
