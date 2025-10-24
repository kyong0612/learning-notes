---
title: "デコレートコマンド - Martin Fowler's Bliki (ja)"
source: "https://bliki-ja.github.io/DecoratedCommand"
author:
  - "Martin Fowler"
  - "bliki-ja (翻訳)"
published: 2004-01-24
created: 2025-10-24
description: "DecoratorパターンをCommandパターンに適用したシンプルなデザインパターン。コマンド指向インターフェイスで広く使われ、アスペクト指向プログラミングではinterceptorsと呼ばれる。トランザクションやセキュリティチェックなどの横断的関心事を動的に追加できる。"
tags:
  - "design-pattern"
  - "decorator-pattern"
  - "command-pattern"
  - "API-design"
  - "AOP"
---

## 概要

**デコレートコマンド (Decorated Command)** は、Decoratorパターンをコマンドに適用した単純なデザインパターンです。コマンド指向インターフェイスで広く使用されており、アスペクト指向プログラミング (AOP) では**interceptors**として知られています。

## 基本概念

### コマンドの基本構造

コマンドは通常、基本的な機能を持ち、後から機能を追加できる形式で構成されます。

```csharp
class PayInvoiceCommand : Command {
  void Execute() {
    // ドメインロジックを実行
  }
}
```

### デコレータによる機能追加

#### 1. トランザクション処理

コマンドをトランザクション内で実行するためのデコレータ:

```csharp
class TransactionalDecorator : CommandDecorator {
  void Execute() {
    Transaction t = TransactionManager.beginTransaction();
    try {
      Component.Execute();
      t.commit();
    } catch (Exception) {
      t.rollback();
    }
  }
}
```

#### 2. セキュリティチェック

セキュリティ検証を追加するデコレータ:

```csharp
class SecurityDecorator : CommandDecorator {
  void Execute() {
    if (passesSecurityCheck())
      Component.Execute();
  }
}
```

## デコレータの組み合わせ

複数のデコレータを組み合わせることで、柔軟に振る舞いを追加できます:

```csharp
// 請求書支払いトランザクション
Command c = new TransactionalDecorator(new PayInvoiceCommand(invoice));
c.Execute();

// トランザクションとセキュリティの両方を適用
Command c = new SecurityDecorator(
                new TransactionalDecorator(
                    new PayInvoiceCommand(invoice)));
c.Execute();
```

## コマンド指向インターフェイスとの関係

動的に振る舞いを追加できる能力は、コマンド指向インターフェイスの大きな利点の一つです。

## アスペクト指向プログラミングとの比較

### 共通点

- デコレータはドメインコマンドの実行メソッドに**advice**を提供する
- 横断的関心事（トランザクション、セキュリティなど）を分離できる

### 相違点

- このパターンでは、実行メソッドのみを通知するために、コマンド全体をラップする必要がある
- AspectJのような高度なAOPツールでは、任意のメソッド呼び出しやフィールドアクセスにも介入できる、より柔軟なアプローチが可能

## まとめ

デコレートコマンドパターンは、以下の特徴を持つシンプルで実用的なパターンです:

- **単純性**: DecoratorパターンとCommandパターンの組み合わせ
- **柔軟性**: 実行時に動的に機能を追加できる
- **再利用性**: デコレータを組み合わせることで様々な振る舞いを実現
- **関心事の分離**: ドメインロジックと横断的関心事を分離

AOPほど高度ではありませんが、多くの実用的なシナリオで十分に機能する効果的なアプローチです。
