package main

import (
	"bufio"
	"fmt"
	"io"
	"net"
	"net/http"
)

func main() {
	// TCP サーバを起動
	listener, err := net.Listen("tcp", ":10800")
	if err != nil {
		fmt.Println("Error starting TCP server:", err)
		return
	}
	defer listener.Close()
	fmt.Println("TCP server listening on port 10800")

	for {
		// クライアントからの接続を待機
		conn, err := listener.Accept()
		if err != nil {
			fmt.Println("Error accepting connection:", err)
			continue
		}
		// クライアントごとに新しいゴルーチンを開始
		go handleConnection(conn)
	}
}

func handleConnection(clientConn net.Conn) {
	defer clientConn.Close()
	fmt.Println("Client connected:", clientConn.RemoteAddr().String())

	// クライアントからの HTTP リクエストを受け取る
	reader := bufio.NewReader(clientConn)
	req, err := http.ReadRequest(reader)
	if err != nil {
		fmt.Println("Error reading request:", err)
		return
	}

	fmt.Println("Request received!")

	switch req.Method {
	case http.MethodConnect:
		// サーバに接続
		fmt.Println("Connect to server: ", req.URL.Host)
		serverConn, err := net.Dial("tcp", req.URL.Host)
		if err != nil {
			fmt.Println("Error connecting to server:", err)
			return
		}
		defer serverConn.Close()

		// クライアントに 200 を送信
		response := &http.Response{
			StatusCode: http.StatusOK,
			ProtoMajor: 1,
			ProtoMinor: 1,
		}
		if err := response.Write(clientConn); err != nil {
			fmt.Println("Error writing response:", err)
			return
		}

		isClosed := make(chan bool, 2)

		// client -> server
		go func() {
			_, err := io.Copy(serverConn, clientConn)
			if err != nil {
				fmt.Println("Failed to copy data from client to server", err)
			}
			isClosed <- true
		}()

		// server -> client
		go func() {
			_, err := io.Copy(clientConn, serverConn)
			if err != nil {
				fmt.Println("Failed to copy data from server to client", err)
			}
			isClosed <- true
		}()

		// どちらかのゴルーチンが終了するまで待機
		<-isClosed

		// どちらかが終了したら handleConnection 関数は終了する
		// その際、defer によって両方のコネクションが閉じられる

	default:
		fmt.Println("Unsupported method:", req.Method)
	}
}
