---
title: "大規模 Node.js サーバーに潜むパフォーマンス上のリスクを Event Loop から理解する"
source: "https://zenn.dev/dinii/articles/f09d21542871ae"
author:
  - "whatasoda"
published: 2025-06-16
created: 2025-06-17
description: |
  Node.jsのシングルスレッド特性による処理干渉問題をEvent Loopの仕組みから解説。重たい処理が軽い処理を妨害してタイムアウトを引き起こすメカニズムと、実行環境分離・Event Loop特性活用・処理軽量化の3つの対策方法を実験データとともに紹介。
tags:
  - nodejs
  - javascript
  - typescript
  - performance
  - event-loop
  - thread
  - optimization
---

# 大規模 Node.js サーバーに潜むパフォーマンス上のリスクを Event Loop から理解する

## 概要

Node.js のシングルスレッド特性により、大規模サーバーにおいて異なる性質の処理が干渉し合い、レイテンシやエラー率に影響を与える問題について、Event Loop の仕組みから解説します。

## 背景

モノリシックなサービスでは、成長とともに1つのアプリケーション内に様々な性質の処理が混在します：

- **リアルタイム性が求められる処理**（注文受付・会計処理）
- **重たい処理**（売上集計・CSVファイル生成）
- **バッチ系処理**

Node.jsのシングルスレッド特性により、これらの処理が同じスレッドを取り合い、相互に待機させ合う問題が発生します。

## スレッド占有によるタイムアウト問題の実験

### 実験設計

実際の問題を再現するため、以下の要素を含む実験を実施：

1. Google のトップページへの HEAD リクエスト
2. `setTimeout` によるタイムアウトと socket タイムアウト設定
3. `setImmediate` を使った Event Loop の check フェーズへの重たい処理挿入

```typescript
import * as https from "https";

type Result =
  | { status: "success"; data: { date: string | undefined } }
  | { status: "failure"; reason: string };

/**
 * https://www.google.com/ に HEAD リクエストを送りヘッダーからサーバー側の日時を取得する。
 *
 * setTimeout によるタイムアウトと socket のタイムアウトをそれぞれ設定できる。
 */
const fetchDateFromGoogle = ({ timeout }: { timeout: { timer: number; socket: number } }) =>
  new Promise<Result>((resolve) => {
    let timeoutTimer: ReturnType<typeof setTimeout> | null = null;
    timeoutTimer = setTimeout(() => {
      timeoutTimer = null;
      console.log("timeout");
      resolve({ status: "failure", reason: "setTimeout" });
    }, timeout.timer);

    const req = https.request(
      "https://www.google.com/",
      { method: "HEAD", timeout: timeout.socket },
      (res) => {
        if (timeoutTimer) {
          clearTimeout(timeoutTimer);
          timeoutTimer = null;
        }

        const data = { date: res.headers.date };
        console.log("response");
        resolve({ status: "success", data });

        res.resume();
      },
    );

    req.on("error", (error) => {
      console.log(error);
      req.destroy();
    });

    req.on("timeout", () => {
      console.log("socket hang up, destroying request...");
      req.destroy();
    });

    req.end();
  });

/**
 * setImmediate が event loop の check で実行されることを利用し、
 * event loop 毎にログを出したり処理を割り込ませたりしている。
 */
const startCheckLoop = (callback: () => void) => {
  const next = () => {
    setImmediate(() => {
      console.log("[check]");
      callback();
      next();
    }).unref();
  };

  next();
};

/**
 * 長い配列を作成する処理によってスレッドを占有させる。 weight は雰囲気で調整する。
 */
const blockThread = ({ weight }: { weight: number }) => {
  for (let i = 0; i < weight; i++) {
    Array.from({ length: 65536 });
  }
};

const main = async () => {
  console.log("Experiment Started!");

  // NOTE: ハンドシェイクが終わる前にスレッドがブロックされすぎると
  //       socket が hang しやすくなるのでタイミングを調整している。
  let checkCount = 0;
  startCheckLoop(() => {
    checkCount++;
    if (checkCount > 1) {
      blockThread({ weight: 100 });
    }
  });

  console.log(
    await fetchDateFromGoogle({
      timeout: {
        timer: 1000,
        socket: 10000,
      },
    }),
  );
};

void main();
```

### 実験結果の重要な発見

DevTools の Performance タブによる分析で以下を確認：

1. **スレッド占有中は他の処理が完全停止**（Event Loop も停止）
2. **スレッド解放後の処理順序が重要**
3. **`setTimeout` の callback が実行されるフェーズ（timers）** が **HTTP レスポンス処理フェーズ（poll）** より先に実行される
4. **データがプロセスに届いていてもタイムアウトになることがある**

## Node.js Event Loop の仕組み

### Event Loop の基本概念

Event Loop は Node.js が non-blocking I/O を実現する中核システムで、以下のフェーズを順番に処理：

```
┌───────────────────────────┐
┌─>│           timers          │  ← setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  ← I/O callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  ← 内部使用
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  ← I/O イベント取得・コールバック実行
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  ← setImmediate
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

### 重要なフェーズ

- **timers**: `setTimeout()` と `setInterval()` のコールバック実行
- **poll**: I/O イベント取得、I/O 関連コールバック実行
- **check**: `setImmediate()` のコールバック実行

## 実験結果の分析

### Event Loop の処理順序と問題の発生メカニズム

バックエンド API サーバーでは、多くの処理が外部との通信を含むため、**処理の大部分が poll フェーズ後に集中**します。

簡略化した処理順序：

```
check → timers → poll
```

**問題の核心**：
「poll と timers の間に実行される処理によってスレッドが占有されていると、スレッド占有中にレスポンスが来ていても、スレッド解放後は先に timers が実行されるためリクエストがタイムアウトしたものとしてアプリケーションが解釈してしまう」

### 実世界での影響

ダイニーでの実例：

- 軽い処理でのデータベース接続タイムアウト発生
- 同じインスタンスで大量データ取得クエリが同時実行
- データ読み込み処理によるスレッド占有
- データベース接続確立処理のブロック

## 対策方法

### 1. 実行環境の分離（推奨）

**最もシンプルで効果的な方法**

**実装方針**：

- API をグループに分類し、NestJS モジュールとしてまとめ
- 環境変数で読み込みモジュールを切り替え
- Cloud Run サービス単位で分割
- クライアント側で呼び出し先を切り替え

**分離基準**：

- **リクエスト量の多い処理**: インフラスケーリング戦略との整合性
- **リアルタイム性の有無**: サービス利用者への影響度
- **明らかにスレッドを長く占有する処理**: バッチ処理・データ分析系

### 2. Event Loop 特性を活用したタイムアウト回避

**Event Loop の順序を利用した方法**

```typescript
timeoutTimer = setTimeout(() => {
  timeoutTimer = null;
  console.log("timeout");
  immediateTimer = setImmediate(() => {
    immediateTimer = null;
    resolve({ status: "failure", reason: "setTimeout" });
  });
}, timeout.timer);
```

タイムアウトエラーの発行タイミングを check フェーズに後回しすることで、poll フェーズでの処理完了を待つ時間を確保。

### 3. 重たい処理の軽量化

根本的な解決として、処理自体の最適化を実施：

- プロファイラーを使った重い処理の特定
- アルゴリズムの改善
- データ処理の分割・非同期化

## まとめと教訓

### 重要な発見

1. **Node.js のシングルスレッド特性**により、重い処理が他の処理の遅延・タイムアウトを引き起こす
2. **重い処理は poll フェーズ後に集中**しやすい
3. **Event Loop の処理順序**により、レスポンスが届いていてもタイムアウトが発生する
4. **timers が poll より先に評価**されることが問題の根本原因

### 対策の優先順位

1. **実行環境分離**（インフラ・アプリケーション両方）
2. **Event Loop 特性に合わせた迂回**
3. **重い処理の根本的改善**

### 結論

Event Loop の特性を理解することは、Node.js アプリケーションの安定性向上に不可欠です。普段意識することは少ないものの、大規模サーバーにおけるパフォーマンス問題の解決には重要な知識となります。

## おしらせ

ダイニーの Platform Team では Node.js アプリケーションがより安定して実行できるようにすることで、飲食業界の未来を支えています。そんなダイニーのエンジニアリング組織について知りたい方は以下のページをご覧ください。

- [Dinii Company Deck for Engineering](https://speakerdeck.com/diniiofficial/dinii-company-deck-for-engineering-2025ver)
- [Engineering Entrance Book](https://diniinote.notion.site/Dinii-Engineering-EntranceBook-1df71045ad748062afe9c672363bdcab)

53

22

この記事に贈られたバッジ

![Thank you](https://static.zenn.studio/images/badges/paid/badge-frame-5.svg)
