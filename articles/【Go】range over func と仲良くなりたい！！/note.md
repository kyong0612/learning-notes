# 【Go】range over func と仲良くなりたい

ref: <https://zenn.dev/foxtail88/articles/range-over-func-beginner>

<https://github.com/golang/go/blob/c9940fe2a9f2eb77327efca860abfbae8d94bf28/doc/go_spec.html#L6664-L6673>

```
Range expression                                       1st value                2nd value

array or slice      a  [n]E, *[n]E, or []E             index    i  int          a[i]       E
string              s  string type                     index    i  int          see below  rune
map                 m  map[K]V                         key      k  K            m[k]       V
channel             c  chan E, &lt;-chan E                element  e  E
integer value       n  integer type, or untyped int    value    i  see below
function, 0 values  f  func(func() bool)
function, 1 value   f  func(func(V) bool)              value    v  V
function, 2 values  f  func(func(K, V) bool)           key      k  K            v          V
```

- range func(func() bool)は値を何も返さない。for range ...みたいな感じで使うんだね。
- range func(func(V) bool)はVを返す。for x := range ...みたいな感じで使うんだね。
- range func(func(K, V) bool)はK, Vを返す。for i, x := range ...みたいな感じで使うんだね。

### for rangeが中断されたのにf(yield)内の処理が続いているのはダメ

```go
package main

import (
 "fmt"
 "time"
)

func main() {
 for x := range f {
  fmt.Printf("loop=%d, begin\n", x)
  time.Sleep(3 * time.Second)
  fmt.Printf("loop=%d, end\n", x)
  break
 }
}

func f(yield func(int) bool) {
 fmt.Println("start...")
 yield(1)
 fmt.Println("midway...")
 yield(2)
 fmt.Println("finish!")
}
```

- 正しくは以下

```go
package main

import (
 "fmt"
 "time"
)

func main() {
 for x := range f {
  fmt.Printf("loop=%d, begin\n", x)
  time.Sleep(3 * time.Second)
  fmt.Printf("loop=%d, end\n", x)
  break
 }
}

func f(yield func(int) bool) {
 fmt.Println("start...")
 yield(1)
 if !yield(1) {
  fmt.Println("break!")
  return
 }
 fmt.Println("midway...")
 yield(2)
 fmt.Println("finish!")
}
```

- for rangeのループがbreakなどで中断されるとyield=falseになる
