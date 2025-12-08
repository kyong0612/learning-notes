---
title: "Anthropic Sandbox Runtime (srt)と次世代のAIエージェントのアーキテクチャ"
source: "https://blog.lai.so/srt/?ref=laiso-newsletter"
author:
  - "[[laiso]]"
published: 2025-12-07
created: 2025-12-08
description: "Anthropic Sandbox Runtime (srt)は、AIエージェントの自律性とセキュリティのジレンマを解決するための軽量サンドボックス技術のPoC。OSレベルでネットワークとファイルシステムへのアクセスを制御し、LLMが生成した未知のコードを安全に実行できる基盤を提供する。"
tags:
  - "Claude Code"
  - "Anthropic"
  - "AIエージェント"
  - "サンドボックス"
  - "セキュリティ"
  - "srt"
  - "MCP"
---

## 概要

Anthropic Sandbox Runtime (srt) は、Claude Code on the web などクラウド環境向けに Anthropic が開発した**軽量サンドボックスのPoC（概念実証）**です。コンテナを必要とせず、OSレベルでファイルシステムとネットワークの制限を任意のプロセスに適用できます。

## 背景：AIエージェントのセキュリティジレンマ

### 現状の課題

多くの Claude Code ユーザーは `--dangerously-skip-permissions` オプションで承認フローをバイパスしています。これにより開発体験は向上しますが、以下のリスクが生じます：

- **破壊的な操作**のリスク
- **データ漏洩**のリスク
- エンタープライズ環境での導入障壁

> **組織向け対策**: `managed-settings.json` で `disableBypassPermissionsMode` を設定することでバイパスを無効化可能

### Dev Containers の限界

コンテナによる隔離方法もありますが、以下の問題が残ります：

- 現時点では少数派
- コンテナ内でも**プロンプトインジェクション**や**ブラウザツール悪用**によるリスクは残る
- ファイル改竄や外部送信のリスクは完全には排除できない

### ジレンマの本質

> **「自律性を高めたいのに権限が与えられない」**
>
> 権限を与えるほど危険度が上がる従来のアプローチでは解決できない

## Anthropic の新しいアプローチ

Anthropic はエージェント実行をクラウドに寄せる方向で開発を進めており、srt はその**基盤技術**です。

**設計思想**:

- ユーザーの自己責任だけに頼らない
- エージェントレイヤーで安全機構を設ける
- ユーザーにはその設計の自由を与える

## プラットフォーム別の実装

| プラットフォーム | 使用技術 | 備考 |
|---|---|---|
| **macOS** | [Seatbelt](https://reverse.put.as/wp-content/uploads/2011/09/Apple-Sandbox-Guide-v1.0.pdf) | macOS 10.5から導入されたOS標準のサンドボックス機構 |
| **Linux** | [bubblewrap](https://github.com/containers/bubblewrap) | Flatpak等で使われる低レベルサンドボックスツール。Linux Namespace + seccomp |
| **Windows** | - | 対象外（WSL経由で利用可能と思われる） |

### bubblewrap の技術詳細

- **Linux Namespace機能**: ファイルシステムやネットワークを隔離
- **seccomp**: システムコールを制限

## srt の使用方法

### 1. CLI での使用

```bash
npm install -g @anthropic-ai/sandbox-runtime

# 通常実行（成功）
curl https://example.com
# <!doctype html><html lang="en"><head><title>Example Domain</title><

# サンドボックス内実行（ネットワークブロック）
srt --debug curl https://example.com
# curl: (6) Could not resolve host: example.com

# サンドボックス内実行（ファイル書き込みブロック）
srt "echo 1 > a.txt"
# /bin/bash: a.txt: Operation not permitted
```

### 2. Node.js ライブラリとしての使用

```javascript
import { SandboxManager } from '@anthropic-ai/sandbox-runtime'
import { spawn } from 'child_process'

const config = {
  network: { allowedDomains: ['example.com'], deniedDomains: [] },
  filesystem: { denyRead: ['~/.ssh'], allowWrite: ['.', '/tmp'], denyWrite: ['.env'] },
}

await SandboxManager.initialize(config)

// 許可されたドメイン → 成功
const allowed = await SandboxManager.wrapWithSandbox('curl https://example.com')
spawn(allowed, { shell: true, stdio: 'inherit' })
// <!doctype html><html lang="en">...

// 許可されていないドメイン → ブロック
const blocked = await SandboxManager.wrapWithSandbox('curl https://google.com')
spawn(blocked, { shell: true, stdio: 'inherit' })
// curl: (6) Could not resolve host: google.com
```

## srt のアクセス制御モデル

### 2段階の制限

srt はOSレベルで**ネットワーク**と**ファイルシステム**へのアクセスを個別に細かく制限します。

| 制御対象 | 制御方式 |
|---|---|
| **ネットワーク** | すべての通信はプロキシ経由に強制、許可ドメイン以外は遮断 |
| **ファイルシステム** | 読み込みは禁止リスト、書き込みは許可リスト＋禁止リストで制御 |

### 従来のClaude Codeとの違い

| 項目 | 従来のClaude Code | srt |
|---|---|---|
| 制御単位 | **コマンド名**でマッチング（`rm`を許可、`git push`を許可など） | **リソース単位**で制御（どのドメインに通信できるか、どのパスに書き込めるか） |
| 未知のコマンド | 想定外のコマンドに対応できない | 未知のコマンドでも安全に実行可能 |

### 保証される安全境界

> エージェントの振る舞いの中で**「読めない・書けない・送れない」**という状態がOSレベルで保証される

これにより：

- Home ディレクトリを消されない
- 機密ファイルは読めない
- 外部にデータを送れない

→ **「安全だから権限を与えられる」**という発想の転換

## srt 公開の意義

### フェーズの移行

| 現在 | 次のフェーズ |
|---|---|
| LLMによるツールの自律的な実行 | **LLMが生成した未知のコードを実行** |

### Claude Skills との関連

その場で生成したスクリプトを実行する技術が当たり前になると、このサンドボックスが効いてきます。

### Anthropic の戦略

MCPアーキテクチャの普及と同様に、この**デザインごと業界内へ広げたい**という意図があります。

## 注意事項

> ⚠️ **srt自体はPoCであり、自前のサンドボックス実装の参考にするもので、そのまま使うものではない**

## 関連リンク

- [GitHub - anthropic-experimental/sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime)
- [Anthropic Engineering Blog - Making Claude Code more secure and autonomous with sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing)
- [Claude Code Docs - Sandboxing](https://code.claude.com/docs/en/sandboxing)
- [Claude Code on the Web](https://docs.claude.com/en/docs/claude-code/claude-code-on-the-web)

## 重要な結論

1. **ジレンマの解消**: srtのようなサンドボックスレイヤーは「自律性vs安全性」のジレンマを一部解消する
2. **OSレベルの強制**: 安全境界をOSが強制することで、より自由にエージェントを動かせる
3. **未来への基盤**: LLMが生成した未知のコードを安全に実行するフェーズへの土台作り
4. **業界標準化の意図**: MCPと同様、このデザインを業界標準として広げる狙いがある
