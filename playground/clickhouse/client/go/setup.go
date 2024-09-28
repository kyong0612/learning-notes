package main

import (
	"crypto/tls"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/ClickHouse/clickhouse-go/v2"
	"github.com/ClickHouse/clickhouse-go/v2/lib/driver"
	"github.com/ClickHouse/clickhouse-go/v2/lib/proto"
)

type ClickHouseTestEnvironment struct {
	Port        int
	HttpPort    int
	SslPort     int
	HttpsPort   int
	Host        string
	Username    string
	Password    string
	Database    string
	Version     proto.Version
	ContainerIP string
	// Container   testcontainers.Container `json:"-"`
}

func (env *ClickHouseTestEnvironment) setVersion() {
	useSSL, err := strconv.ParseBool(GetEnv("CLICKHOUSE_USE_SSL", "false"))
	if err != nil {
		panic(err)
	}
	port := env.Port
	var tlsConfig *tls.Config
	if useSSL {
		tlsConfig = &tls.Config{}
		port = env.SslPort
	}
	timeout, err := strconv.Atoi(GetEnv("CLICKHOUSE_DIAL_TIMEOUT", "10"))
	if err != nil {
		panic(err)
	}
	conn, err := clickhouse.Open(&clickhouse.Options{
		Addr:     []string{fmt.Sprintf("%s:%d", env.Host, port)},
		Settings: nil,
		Auth: clickhouse.Auth{
			Database: "default",
			Username: env.Username,
			Password: env.Password,
		},
		TLS:         tlsConfig,
		DialTimeout: time.Duration(timeout) * time.Second,
	})
	if err != nil {
		panic(err)
	}
	v, err := conn.ServerVersion()
	if err != nil {
		panic(err)
	}
	env.Version = v.Version
}

func GetConnection(
	testSet string,
) (driver.Conn, error) {
	env, err := GetExternalTestEnvironment(testSet)
	if err != nil {
		return nil, fmt.Errorf("failed to get test environment: %w", err)
	}

	conn, err := clickhouse.Open(&clickhouse.Options{
		Addr: []string{fmt.Sprintf("%s:%d", env.Host, env.Port)},
		Auth: clickhouse.Auth{
			Database: env.Database,
			Username: env.Username,
			Password: env.Password,
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to open connection: %w", err)
	}
	v, err := conn.ServerVersion()
	fmt.Println(v)
	if err != nil {
		return nil, fmt.Errorf("failed to get server version: %w", err)
	}

	return conn, nil
}

func GetExternalTestEnvironment(testSet string) (ClickHouseTestEnvironment, error) {
	port, err := strconv.Atoi(GetEnv("CLICKHOUSE_PORT", "9000"))
	if err != nil {
		return ClickHouseTestEnvironment{}, nil
	}
	httpPort, err := strconv.Atoi(GetEnv("CLICKHOUSE_HTTP_PORT", "8123"))
	if err != nil {
		return ClickHouseTestEnvironment{}, nil
	}
	sslPort, err := strconv.Atoi(GetEnv("CLICKHOUSE_SSL_PORT", "9440"))
	if err != nil {
		return ClickHouseTestEnvironment{}, nil
	}
	httpsPort, err := strconv.Atoi(GetEnv("CLICKHOUSE_HTTPS_PORT", "8443"))
	if err != nil {
		return ClickHouseTestEnvironment{}, nil
	}
	env := ClickHouseTestEnvironment{
		Port:      port,
		HttpPort:  httpPort,
		SslPort:   sslPort,
		HttpsPort: httpsPort,
		Username:  GetEnv("CLICKHOUSE_USERNAME", "default"),
		Password:  GetEnv("CLICKHOUSE_PASSWORD", ""),
		Host:      GetEnv("CLICKHOUSE_HOST", "localhost"),
		Database:  GetEnv("CLICKHOUSE_DATABASE", testSet),
	}
	env.setVersion()
	return env, nil
}

func GetEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
