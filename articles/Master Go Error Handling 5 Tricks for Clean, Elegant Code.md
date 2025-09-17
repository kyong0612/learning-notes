---
title: "Master Go Error Handling: 5 Tricks for Clean, Elegant Code"
source: "https://medium.com/@sonampatel_97163/master-go-error-handling-5-tricks-for-clean-elegant-code-e63730bc7366"
author:
  - "Quantum Tricks"
published: 2025-08-25
created: 2025-09-17
description: |
  Go言語におけるエラーハンドリングを、クリーンでエレガントなコードで実践するための5つのテクニックを紹介します。エラーはバグではなく、システムの脆弱性を示す警告であり、早期に対処することの重要性を説きます。
tags:
  - "Go"
  - "Golang"
  - "Error Handling"
  - "Programming"
---

## Goエラーハンドリング：クリーンでエレガントなコードのための5つの秘訣

この記事は、Go言語におけるエラーハンドリングを、クリーンで、誠実で、実戦的なものにするための5つの習慣を紹介します。

エラーはバグではなく、システムのどこが曲がり、壊れようとしているかを正確に教えてくれる警告です。早期に whispers（ささやき）、次に alarms（警報）、そして無視し続ければ screams（絶叫）となります。これらを無視すると、深夜3時の緊急呼び出しにつながる可能性があります。

Goの設計は、エラーが明示的であることを強制します。しかし、「明示的」は「醜い」を意味する必要はありません。

### 1. 早期にラップし、常にコンテキストを追加する

生のエラーは、どこから来たのかわからない見知らぬ人のようなものです。エラーが最上位レイヤーに到達する頃には、元の意味は失われています。Go 1.13以降、`fmt.Errorf` と `%w` を使うことが推奨されます。

```go
func loadUser(ctx context.Context, id string) (*User, error) {
    user, err := db.FindUser(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("loadUser: could not fetch user %s: %w", id, err)
    }
    return user, nil
}
```

これにより、エラーが発生した操作（`loadUser`）と関連データ（`id`）がエラーメッセージに追加され、デバッグが容易になります。
