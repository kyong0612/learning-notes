package main

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"fmt"
	"math/big"
	"os"
	"time"
)

func generateSelfSignedCert(commonName string, daysValid int) ([]byte, []byte, error) {
	// 秘密鍵の生成
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return nil, nil, err
	}

	// 証明書のテンプレート作成
	template := x509.Certificate{
		SerialNumber: big.NewInt(1),
		Subject: pkix.Name{
			CommonName: commonName,
		},
		NotBefore:             time.Now(),
		NotAfter:              time.Now().Add(time.Duration(daysValid) * 24 * time.Hour),
		KeyUsage:              x509.KeyUsageKeyEncipherment | x509.KeyUsageDigitalSignature,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		BasicConstraintsValid: true,
	}

	// 証明書の生成
	derBytes, err := x509.CreateCertificate(rand.Reader, &template, &template, &privateKey.PublicKey, privateKey)
	if err != nil {
		return nil, nil, err
	}

	// 証明書をPEM形式にエンコード
	certPem := pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: derBytes})

	// 秘密鍵をPEM形式にエンコード
	privKeyPem := pem.EncodeToMemory(&pem.Block{Type: "RSA PRIVATE KEY", Bytes: x509.MarshalPKCS1PrivateKey(privateKey)})

	return certPem, privKeyPem, nil
}

func writeToFile(filename string, data []byte) error {
	return os.WriteFile(filename, data, 0600)
}

func main() {
	commonName := "example.com"
	daysValid := 365
	certFile := "cert.pem"
	keyFile := "key.pem"

	certPem, keyPem, err := generateSelfSignedCert(commonName, daysValid)
	if err != nil {
		fmt.Println("証明書の生成エラー:", err)
		os.Exit(1)
	}

	// 証明書をファイルに書き込み
	err = writeToFile(certFile, certPem)
	if err != nil {
		fmt.Println("証明書の保存エラー:", err)
		os.Exit(1)
	}

	// 秘密鍵をファイルに書き込み
	err = writeToFile(keyFile, keyPem)
	if err != nil {
		fmt.Println("秘密鍵の保存エラー:", err)
		os.Exit(1)
	}

	fmt.Printf("証明書が %s に保存されました\n", certFile)
	fmt.Printf("秘密鍵が %s に保存されました\n", keyFile)
}
