package main

import (
	"fmt"
	"net/http"
)

func isHandler(data interface{}) {
	// fmt.Printf("%T\n", data)
	_, ok := data.(http.Handler)
	if ok {
		fmt.Println("a http.Handler")
	} else {
		fmt.Println("NOT a http.Handler")
	}
}

func isHandlerFunc(data interface{}) {
	// fmt.Printf("%T\n", data)
	_, ok := data.(http.HandlerFunc)
	if ok {
		fmt.Println("a http.HandlerFunc")
	} else {
		fmt.Println("NOT a http.HandlerFunc")
	}
}

type MyHandleFunc func(http.ResponseWriter, *http.Request)

func isMyHandlerFunc(data interface{}) {
	// fmt.Printf("%v\n", data)
	// fmt.Printf("%T\n", data)
	_, ok := data.(MyHandleFunc)
	if ok {
		fmt.Println("a my HandleFunc")
	} else {
		fmt.Println("NOT a my HandleFunc")
	}
}

// 単一メソッドインターフェイス
type T struct{}

func (T) ServeHTTP(http.ResponseWriter, *http.Request) {}

func ServeHTTP(http.ResponseWriter, *http.Request) {}

type ServeHTTPType = func(http.ResponseWriter, *http.Request)

type N struct{}

func (N) ServeDebugHandler(http.ResponseWriter, *http.Request) {}

func main() {
	// メソッドのレシーバーがあるので実際には func(T, http.ResponseWriter, *http.Request) となっている
	sh := (T{}).ServeHTTP
	// 実装のまま func(http.ResponseWriter, *http.Request) として見られている
	sh2 := ServeHTTP

	sh3 := ServeHTTP
	var sh4 MyHandleFunc = ServeHTTP

	fmt.Println("########## sh ##########")
	isHandler(sh)
	isHandlerFunc(sh)
	isMyHandlerFunc(sh)

	fmt.Println("########## sh2 ##########")
	isHandler(sh2)
	isHandlerFunc(sh2)
	isMyHandlerFunc(sh2)

	fmt.Println("########## sh3 ##########")
	isHandler(sh3)
	isHandlerFunc(sh3)
	isMyHandlerFunc(sh3)

	fmt.Println("########## sh4 ##########")
	isHandler(sh4)
	isHandlerFunc(sh4)
	isMyHandlerFunc(sh4)

	/*
		########## sh ##########
		NOT a http.Handler
		NOT a http.HandlerFunc
		NOT a my HandleFunc
		########## sh2 ##########
		NOT a http.Handler
		NOT a http.HandlerFunc
		NOT a my HandleFunc
		########## sh3 ##########
		NOT a http.Handler
		NOT a http.HandlerFunc
		NOT a my HandleFunc
		########## sh4 ##########
		NOT a http.Handler
		NOT a http.HandlerFunc
		a my HandleFunc
	*/

	// 型変換をする場合
	var (
		t T
		n N
	)

	// インターフェースはメソッド名まで合っていないといけない
	var _ http.Handler = t
	// var _ http.Handler = n // 動作しない

	// 関数型は関数シグネチャだけ合っていれば型変換できる
	var _ http.HandlerFunc = t.ServeHTTP
	var _ http.HandlerFunc = n.ServeDebugHandler

}
