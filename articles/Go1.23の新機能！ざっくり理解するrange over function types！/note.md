# Go1.23の新機能！ざっくり理解するrange over function types

ref: <https://zenn.dev/nanaonanika/articles/b289821bf48c4d>

```go
package main

import (
 "fmt"
 "iter"
)

func main() {
    // Set型: 重複しない要素の集合を表すコンテナ型
 mySet := NewSet()

    // 要素を追加
 mySet.Add(1)
 mySet.Add(2)
 mySet.Add(3)

    // mySetの要素を2倍して出力するループ処理
 for value := range mySet.All() {
  fmt.Println(value * 2)
 }
}

// イテレータ関数を返すメソッドの実装
func (s *Set) All() iter.Seq[int] {
    return func(yield func(int) bool) {
        for v := range s.elements {
            if !yield(v) {
                return
            }
        }
    }
}

type Set struct {
    elements map[int]struct{}
}

func NewSet() *Set {
    return &Set{
        elements: make(map[int]struct{}),
    }
}

func (s *Set) Add(value int) {
    s.elements[value] = struct{}{}
}

```
