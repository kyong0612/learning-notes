---
title: "mobile-next/mobile-mcp: Model Context Protocol Server for Mobile Automation and Scraping (iOS, Android, Emulators, Simulators and Real Devices)"
source: "https://github.com/mobile-next/mobile-mcp"
author:
  - "mobile-next"
  - "[[gmegidish]]"
published: "2025-03-28"
created: 2026-01-05
description: "iOS・Androidのモバイルアプリケーション自動化を実現するModel Context Protocol (MCP)サーバー。シミュレータ、エミュレータ、実機デバイスに対応し、プラットフォーム固有の知識なしでLLMベースのエージェントがネイティブアプリと連携可能。"
tags:
  - "MCP"
  - "モバイル自動化"
  - "iOS"
  - "Android"
  - "AI Agents"
  - "LLM"
  - "アクセシビリティ"
---

## 要約

mobile-mcpは、iOS・AndroidアプリケーションのテストやデータエントリーをLLMエージェントから自動実行できるModel Context Protocol (MCP)サーバーです。mobile-next組織によって2025年3月にリリースされ、Apache-2.0ライセンスで公開されています（★2.9k、241コミット）。

### 主要機能

- **プラットフォーム非依存**: iOS/Androidの違いを抽象化し、統一インターフェースで操作
- **高速・軽量**: ネイティブアクセシビリティツリーを活用（a11yラベルが無い場合はスクリーンショット座標にフォールバック）
- **LLMフレンドリー**: コンピュータビジョンモデル不要、構造化データで曖昧さを削減
- **包括的デバイス対応**: シミュレータ、エミュレータ、実機（iPhone、Samsung、Google Pixelなど）
- **20種類以上のツール**: デバイス管理、アプリ管理、画面操作、入力・ナビゲーション機能

### 対応プラットフォーム

- **iOS**: Simulator（macOS/Linux）、実機（WebDriverAgent経由）
- **Android**: Emulator（全OS対応）、実機（ADB & UI Automator経由）

### セットアップ例

Claude Code、Cursor、Cline、Windsurf、Codex、Gemini CLI、Goose、Qodo Genなど、多数のMCP対応ツールで利用可能。基本設定：

```json
{
  "mcpServers": {
    "mobile-mcp": {
      "command": "npx",
      "args": ["-y", "@mobilenext/mobile-mcp@latest"]
    }
  }
}
```

### 実用例

- YouTubeで動画を検索し、いいね・コメント・シェアを自動実行
- App Storeからアプリをダウンロードし、登録・設定・レビュー投稿
- 天気予報を取得してWhatsApp/Telegramで共有
- Zoomミーティングをスケジュールし、招待リンクをGmail送信

### 前提要件

- Xcode command line tools（iOS対応時）
- Android Platform Tools（Android対応時）
- Node.js v22+
- MCP対応の基盤モデル/エージェント（Claude、OpenAI Agent SDK、Copilot Studioなど）

---
**[mobile-mcp](https://github.com/mobile-next/mobile-mcp)** Public

Model Context Protocol Server for Mobile Automation and Scraping (iOS, Android, Emulators, Simulators and Real Devices)

[mobilenexthq.com](https://mobilenexthq.com/ "https://mobilenexthq.com")

[Apache-2.0 license](https://github.com/mobile-next/mobile-mcp/blob/main/LICENSE)

[Security policy](https://github.com/mobile-next/mobile-mcp/blob/main/SECURITY.md)

[2.9k stars](https://github.com/mobile-next/mobile-mcp/stargazers) [257 forks](https://github.com/mobile-next/mobile-mcp/forks) [29 watching](https://github.com/mobile-next/mobile-mcp/watchers) [Branches](https://github.com/mobile-next/mobile-mcp/branches) [Tags](https://github.com/mobile-next/mobile-mcp/tags) [Activity](https://github.com/mobile-next/mobile-mcp/activity) [Custom properties](https://github.com/mobile-next/mobile-mcp/custom-properties)

Public repository

[Open in github.dev](https://github.dev/) [Open in a new github.dev tab](https://github.dev/) [Open in codespace](https://github.com/codespaces/new/mobile-next/mobile-mcp?resume=1)

<table><thead><tr><th colspan="2"><span>Name</span></th><th colspan="1"><span>Name</span></th><th><p><span>Last commit message</span></p></th><th colspan="1"><p><span>Last commit date</span></p></th></tr></thead><tbody><tr><td colspan="3"><p><span><a href="https://github.com/mobile-next/mobile-mcp/commit/1ba35525330507c0667e0652467f86be0139f5e3">chore: update server.json to latest schema</a></span></p><p><span><a href="https://github.com/mobile-next/mobile-mcp/commit/1ba35525330507c0667e0652467f86be0139f5e3">1ba3552</a> ·</span></p><p><a href="https://github.com/mobile-next/mobile-mcp/commits/main/"><span><span><span>241 Commits</span></span></span></a></p></td></tr><tr><td colspan="2"><p><a href="https://github.com/mobile-next/mobile-mcp/tree/main/.github">.github</a></p></td><td colspan="1"><p><a href="https://github.com/mobile-next/mobile-mcp/tree/main/.github">.github</a></p></td><td><p><a href="https://github.com/mobile-next/mobile-mcp/commit/e902e91c4790d0a2aa296182fbe373df0a184762">feat: automatic publish versions to github mcp-registry (</a><a href="https://github.com/mobile-next/mobile-mcp/pull/212">#212</a><a href="https://github.com/mobile-next/mobile-mcp/commit/e902e91c4790d0a2aa296182fbe373df0a184762">)</a></p></td><td></td></tr><tr><td colspan="2"><p><a href="https://github.com/mobile-next/mobile-mcp/tree/main/.husky">.husky</a></p></td><td colspan="1"><p><a href="https://github.com/mobile-next/mobile-mcp/tree/main/.husky">.husky</a></p></td><td><p><a href="https://github.com/mobile-next/mobile-mcp/commit/0ccd276f368da8019bc686ec2e07739de0ab4061">feat: new ios simulator support</a></p></td><td></td></tr><tr><td colspan="2"><p><a href="https://github.com/mobile-next/mobile-mcp/tree/main/src">src</a></p></td><td colspan="1"><p><a href="https://github.com/mobile-next/mobile-mcp/tree/main/src">src</a></p></td><td><p><a href="https://github.com/mobile-next/mobile-mcp/commit/6495aff23da06661b2676a61b20b05e4adb52765">feat: add duration parameter to longpress (</a><a href="https://github.com/mobile-next/mobile-mcp/pull/247">#247</a><a href="https://github.com/mobile-next/mobile-mcp/commit/6495aff23da06661b2676a61b20b05e4adb52765">)</a></p></td><td></td></tr><tr><td colspan="2"><p><a href="https://github.com/mobile-next/mobile-mcp/tree/main/test">test</a></p></td><td colspan="1"><p><a href="https://github.com/mobile-next/mobile-mcp/tree/main/test">test</a></p></td><td><p><a href="https://github.com/mobile-next/mobile-mcp/commit/cb0c290b60295a7654ecf6f9bbb839acb0f2f975">feat: move iphone-simulator calls to use mobilecli binary (</a><a href="https://github.com/mobile-next/mobile-mcp/pull/241">#241</a><a href="https://github.com/mobile-next/mobile-mcp/commit/cb0c290b60295a7654ecf6f9bbb839acb0f2f975">)</a></p></td><td></td></tr><tr><td colspan="2"><p><a href="https://github.com/mobile-next/mobile-mcp/blob/main/.editorconfig">.editorconfig</a></p></td><td colspan="1"><p><a href="https://github.com/mobile-next/mobile-mcp/blob/main/.editorconfig">.editorconfig</a></p></td><td><p><a href="https://github.com/mobile-next/mobile-mcp/commit/e0b281de6d37745416fe65f07583f6f9d183fd4a">Initial import</a></p></td><td></td></tr><tr><td colspan="2"><p><a href="https://github.com/mobile-next/mobile-mcp/blob/main/.gitignore">.gitignore</a></p></td><td colspan="1"><p><a href="https://github.com/mobile-next/mobile-mcp/blob/main/.gitignore">.gitignore</a></p></td><td><p><a href="https://github.com/mobile-next/mobile-mcp/commit/d8aac0070b010f40e49ba4aba54bed1803c9247b">feat: added mobile_double_tap tool</a></p></td><td></td></tr><tr><td colspan="2"><p><a href="https://github.com/mobile-next/mobile-mcp/blob/main/.mocharc.yml">.mocharc.yml</a></p></td><td colspan="1"><p><a href="https://github.com/mobile-next/mobile-mcp/blob/main/.mocharc.yml">.mocharc.yml</a></p></td><td><p><a href="https://github.com/mobile-next/mobile-mcp/commit/1760a084ff8380164649c07654052299ab485dcf">fix: stability fixes when fetching screenshot, removed sharp use, ret…</a></p></td><td></td></tr><tr><td colspan="2"><p><a href="https://github.com/mobile-next/mobile-mcp/blob/main/.npmignore">.npmignore</a></p></td><td colspan="1"><p><a href="https://github.com/mobile-next/mobile-mcp/blob/main/.npmignore">.npmignore</a></p></td><td><p><a href="https://github.com/mobile-next/mobile-mcp/commit/a5d9c612f013e0b809c28390951c270d586e806d">Initial import</a></p></td><td></td></tr><tr><td colspan="2"><p><a href="https://github.com/mobile-next/mobile-mcp/blob/main/CHANGELOG.md">CHANGELOG.md</a></p></td><td colspan="1"><p><a href="https://github.com/mobile-next/mobile-mcp/blob/main/CHANGELOG.md">CHANGELOG.md</a></p></td><td><p><a href="https://github.com/mobile-next/mobile-mcp/commit/5879b7fd56cfd2e43ba2669f31a19d28d6d3dc1a">feat: version 0.0.39</a></p></td><td></td></tr><tr><td colspan="2"><p><a href="https://github.com/mobile-next/mobile-mcp/blob/main/LICENSE">LICENSE</a></p></td><td colspan="1"><p><a href="https://github.com/mobile-next/mobile-mcp/blob/main/LICENSE">LICENSE</a></p></td><td><p><a href="https://github.com/mobile-next/mobile-mcp/commit/0467dfc9a7b2090be2dcd10d834f2bbcde205c60">Create LICENSE</a></p></td><td></td></tr><tr><td colspan="3"></td></tr></tbody></table>

This is a [Model Context Protocol (MCP) server](https://github.com/modelcontextprotocol) that enables scalable mobile automation, development through a platform-agnostic interface, eliminating the need for distinct iOS or Android knowledge. You can run it on emulators, simulators, and real devices (iOS and Android). This server allows Agents and LLMs to interact with native iOS/Android applications and devices through structured accessibility snapshots or coordinate-based taps based on screenshots.

Mobile-MCP-Demo-from-Mobile-Next.mp4<video src="https://private-user-images.githubusercontent.com/38224019/428436612-c4e89c4f-cc71-4424-8184-bdbc8c638fa1.mp4?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Njc2MDA3OTYsIm5iZiI6MTc2NzYwMDQ5NiwicGF0aCI6Ii8zODIyNDAxOS80Mjg0MzY2MTItYzRlODljNGYtY2M3MS00NDI0LTgxODQtYmRiYzhjNjM4ZmExLm1wND9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjAxMDUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwMTA1VDA4MDgxNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTFmNmNkNTliODNiMmJhMmIzMTQyZTZlZTJhMjZhYmFkN2YxMzcyYjJiOGU1MjkwNzEzZDE3ZWU0M2Y2YmJhMjEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.dG6mkYepjpx3Qbf2gfMFhgFh6IiGEJuh6rHh0zQOoIs" controls="controls"></video>

[![mobile-mcp](https://raw.githubusercontent.com/mobile-next/mobile-next-assets/refs/heads/main/mobile-mcp-banner.png)](https://github.com/mobile-next/)

Join us on our journey as we continuously enhance Mobile MCP! Check out our detailed roadmap to see upcoming features, improvements, and milestones. Your feedback is invaluable in shaping the future of mobile automation.

👉 [Explore the Roadmap](https://github.com/orgs/mobile-next/projects/3)

How we help to scale mobile automation:

- 📲 Native app automation (iOS and Android) for testing or data-entry scenarios.
- 📝 Scripted flows and form interactions without manually controlling simulators/emulators or real devices (iPhone, Samsung, Google Pixel etc)
- 🧭 Automating multi-step user journeys driven by an LLM
- 👆 General-purpose mobile application interaction for agent-based frameworks
- 🤖 Enables agent-to-agent communication for mobile automation usecases, data extraction

## Main Features

- 🚀 **Fast and lightweight**: Uses native accessibility trees for most interactions, or screenshot based coordinates where a11y labels are not available.
- 🤖 **LLM-friendly**: No computer vision model required in Accessibility (Snapshot).
- 🧿 **Visual Sense**: Evaluates and analyses what’s actually rendered on screen to decide the next action. If accessibility data or view-hierarchy coordinates are unavailable, it falls back to screenshot-based analysis.
- 📊 **Deterministic tool application**: Reduces ambiguity found in purely screenshot-based approaches by relying on structured data whenever possible.
- 📺 **Extract structured data**: Enables you to extract structred data from anything visible on screen.
📱 **Click to expand tool list** - List of Mobile MCP tools for automation and development

> For detailed implementation and parameter specifications, see [`src/server.ts`](https://github.com/mobile-next/mobile-mcp/blob/main/src/server.ts)

### Device Management

- **`mobile_list_available_devices`** - List all available devices (simulators, emulators, and real devices)
- **`mobile_get_screen_size`** - Get the screen size of the mobile device in pixels
- **`mobile_get_orientation`** - Get the current screen orientation of the device
- **`mobile_set_orientation`** - Change the screen orientation (portrait/landscape)

### App Management

- **`mobile_list_apps`** - List all installed apps on the device
- **`mobile_launch_app`** - Launch an app using its package name
- **`mobile_terminate_app`** - Stop and terminate a running app
- **`mobile_install_app`** - Install an app from file (.apk,.ipa,.app,.zip)
- **`mobile_uninstall_app`** - Uninstall an app using bundle ID or package name

### Screen Interaction

- **`mobile_take_screenshot`** - Take a screenshot to understand what's on screen
- **`mobile_save_screenshot`** - Save a screenshot to a file
- **`mobile_list_elements_on_screen`** - List UI elements with their coordinates and properties
- **`mobile_click_on_screen_at_coordinates`** - Click at specific x,y coordinates
- **`mobile_double_tap_on_screen`** - Double-tap at specific coordinates
- **`mobile_long_press_on_screen_at_coordinates`** - Long press at specific coordinates
- **`mobile_swipe_on_screen`** - Swipe in any direction (up, down, left, right)
- **`mobile_type_keys`** - Type text into focused elements with optional submit
- **`mobile_press_button`** - Press device buttons (HOME, BACK, VOLUME\_UP/DOWN, ENTER, etc.)
- **`mobile_open_url`** - Open URLs in the device browser

### Platform Support

- **iOS**: Simulators and real devices via native accessibility and WebDriverAgent
- **Android**: Emulators and real devices via ADB and UI Automator
- **Cross-platform**: Unified API works across both iOS and Android

[![mobile-mcp](https://raw.githubusercontent.com/mobile-next/mobile-next-assets/refs/heads/main/mobile-mcp-arch-1.png)](https://raw.githubusercontent.com/mobile-next/mobile-next-assets/refs/heads/main/mobile-mcp-arch-1.png)

More details in our [wiki page](https://github.com/mobile-next/mobile-mcp/wiki) for setup, configuration and debugging related questions.

**Standard config** works in most of the tools:

```
{
  "mcpServers": {
    "mobile-mcp": {
      "command": "npx",
      "args": ["-y", "@mobilenext/mobile-mcp@latest"]
    }
  }
}
```

Amp

Add via the Amp VS Code extension settings screen or by updating your `settings.json` file:

```
"amp.mcpServers": {
  "mobile-mcp": {
    "command": "npx",
    "args": [
      "@mobilenext/mobile-mcp@latest"
    ]
  }
}
```

**Amp CLI:**

Run the following command in your terminal:

```
amp mcp add mobile-mcp -- npx @mobilenext/mobile-mcp@latest
```

Cline

To setup Cline, just add the json above to your MCP settings file.

[More in our wiki](https://github.com/mobile-next/mobile-mcp/wiki/Cline)

Claude Code

Use the Claude Code CLI to add the Mobile MCP server:

```
claude mcp add mobile-mcp -- npx -y @mobilenext/mobile-mcp@latest
```

Claude Desktop

Follow the [MCP install guide](https://modelcontextprotocol.io/quickstart/user), use json configuration above.

Codex

Use the Codex CLI to add the Mobile MCP server:

```
codex mcp add mobile-mcp npx "@mobilenext/mobile-mcp@latest"
```

Alternatively, create or edit the configuration file `~/.codex/config.toml` and add:

```
[mcp_servers.mobile-mcp]
command = "npx"
args = ["@mobilenext/mobile-mcp@latest"]
```

For more information, see the Codex MCP documentation.

Copilot

Use the Copilot CLI to interactively add the Mobile MCP server:

```
/mcp add
```

You can edit the configuration file `~/.copilot/mcp-config.json` and add:

```
{
  "mcpServers": {
    "mobile-mcp": {
      "type": "local",
      "command": "npx",
      "tools": [
        "*"
      ],
      "args": [
        "@mobilenext/mobile-mcp@latest"
      ]
    }
  }
}
```

For more information, see the Copilot CLI documentation.

Cursor

Go to `Cursor Settings` -> `MCP` -> `Add new MCP Server`. Name to your liking, use `command` type with the command `npx -y @mobilenext/mobile-mcp@latest`. You can also verify config or add command like arguments via clicking `Edit`.

Gemini CLI

Use the Gemini CLI to add the Mobile MCP server:

```
gemini mcp add mobile-mcp npx -y @mobilenext/mobile-mcp@latest
```

Goose

Go to `Advanced settings` -> `Extensions` -> `Add custom extension`. Name to your liking, use type `STDIO`, and set the `command` to `npx -y @mobilenext/mobile-mcp@latest`. Click "Add Extension".

Kiro

Follow the MCP Servers [documentation](https://kiro.dev/docs/mcp/). For example in `.kiro/settings/mcp.json`:

```
{
  "mcpServers": {
    "mobile-mcp": {
      "command": "npx",
      "args": [
        "@mobilenext/mobile-mcp@latest"
      ]
    }
  }
}
```

opencode

Follow the MCP Servers documentation. For example in `~/.config/opencode/opencode.json`:

```
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "mobile-mcp": {
      "type": "local",
      "command": [
        "npx",
        "@mobilenext/mobile-mcp@latest"
      ],
      "enabled": true
    }
  }
}
```

Qodo Gen

Open [Qodo Gen](https://docs.qodo.ai/qodo-documentation/qodo-gen) chat panel in VSCode or IntelliJ → Connect more tools → + Add new MCP → Paste the standard config above.

Click `Save`.

Windsurf

Open Windsurf settings, navigate to MCP servers, and add a new server using the `command` type with:

```
npx @mobilenext/mobile-mcp@latest
```

Or add the standard config under `mcpServers` in your settings as shown above.

[Read more in our wiki](https://github.com/mobile-next/mobile-mcp/wiki)! 🚀

After adding the MCP server to your IDE/Client, you can instruct your AI assistant to use the available tools. For example, in Cursor's agent mode, you could use the prompts below to quickly validate, test and iterate on UI intereactions, read information from screen, go through complex workflows. Be descriptive, straight to the point.

#### Workflows

You can specifiy detailed workflows in a single prompt, verify business logic, setup automations. You can go crazy:

**Search for a video, comment, like and share it.**

```
Find the video called " Beginner Recipe for Tonkotsu Ramen" by Way of
Ramen, click on like video, after liking write a comment " this was
delicious, will make it next Friday", share the video with the first
contact in your whatsapp list.
```

**Download a successful step counter app, register, setup workout and 5-star the app**

```
Find and Download a free "Pomodoro" app that has more than 1k stars.
Launch the app, register with my email, after registration find how to
start a pomodoro timer. When the pomodoro timer started, go back to the
app store and rate the app 5 stars, and leave a comment how useful the
app is.
```

**Search in Substack, read, highlight, comment and save an article**

```
Open Substack website, search for "Latest trends in AI automation 2025",
open the first article, highlight the section titled "Emerging AI trends",
and save article to reading list for later review, comment a random
paragraph summary.
```

**Reserve a workout class, set timer**

```
Open ClassPass, search for yoga classes tomorrow morning within 2 miles,
book the highest-rated class at 7 AM, confirm reservation,
setup a timer for the booked slot in the phone
```

**Find a local event, setup calendar event**

```
Open Eventbrite, search for AI startup meetup events happening this
weekend in "Austin, TX", select the most popular one, register and RSVP
yes to the event, setup a calendar event as a reminder.
```

**Check weather forecast and send a Whatsapp/Telegram/Slack message**

```
Open Weather app, check tomorrow's weather forecast for "Berlin", and
send the summary via Whatsapp/Telegram/Slack to contact "Lauren Trown",
thumbs up their response.
```

- **Schedule a meeting in Zoom and share invite via email**

```
Open Zoom app, schedule a meeting titled "AI Hackathon" for tomorrow at
10AM with a duration of 1 hour, copy the invitation link, and send it via
Gmail to contacts "team@example.com".
```

[More prompt examples can be found here.](https://github.com/mobile-next/mobile-mcp/wiki/Prompt-Example-repo-list)

## Prerequisites

What you will need to connect MCP with your agent and mobile devices:

- [Xcode command line tools](https://developer.apple.com/xcode/resources/)
- [Android Platform Tools](https://developer.android.com/tools/releases/platform-tools)
- [node.js](https://nodejs.org/en/download/) v22+
- [MCP](https://modelcontextprotocol.io/introduction) supported foundational models or agents, like [Claude MCP](https://modelcontextprotocol.io/quickstart/server), [OpenAI Agent SDK](https://openai.github.io/openai-agents-python/mcp/), [Copilot Studio](https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/introducing-model-context-protocol-mcp-in-copilot-studio-simplified-integration-with-ai-apps-and-agents/)

When launched, Mobile MCP can connect to:

- iOS Simulators on macOS/Linux
- Android Emulators on Linux/Windows/macOS
- iOS or Android real devices (requires proper platform tools and drivers)

Make sure you have your mobile platform SDKs (Xcode, Android SDK) installed and configured properly before running Mobile Next Mobile MCP.

When you do not have a real device connected to your machine, you can run Mobile MCP with an emulator or simulator in the background.

For example, on Android:

1. Start an emulator (avdmanager / emulator command).
2. Run Mobile MCP with the desired flags

On iOS, you'll need Xcode and to run the Simulator before using Mobile MCP with that simulator instance.

- `xcrun simctl list`
- `xcrun simctl boot "iPhone 16"`
[![](https://camo.githubusercontent.com/f281e82fa0b490fd19486fc83e4e5d9ca7413e2dde2b5072e9c90dd673dc4fd5/68747470733a2f2f636f6e747269622e726f636b732f696d6167653f7265706f3d6d6f62696c652d6e6578742f6d6f62696c652d6d6370)](https://github.com/mobile-next/mobile-mcp/graphs/contributors)

## Releases 28

[\+ 27 releases](https://github.com/mobile-next/mobile-mcp/releases)

## Languages

- [TypeScript 95.5%](https://github.com/mobile-next/mobile-mcp/search?l=typescript)
- [JavaScript 4.5%](https://github.com/mobile-next/mobile-mcp/search?l=javascript)
