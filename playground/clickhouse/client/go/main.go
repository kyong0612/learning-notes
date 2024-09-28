package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/ClickHouse/clickhouse-go/v2"
	"github.com/ClickHouse/clickhouse-go/v2/ext"
)

func main() {
	conn, err := GetConnection("default")
	if err != nil {
		log.Fatal(err)
	}

	table1, err := ext.NewTable("external_table_1",
		ext.Column("col1", "UInt8"),
		ext.Column("col2", "String"),
		ext.Column("col3", "DateTime"),
	)
	if err != nil {
		log.Fatal(err)
	}

	for i := 0; i < 10; i++ {
		if err = table1.Append(uint8(i), fmt.Sprintf("value_%d", i), time.Now()); err != nil {
			log.Fatal(err)
		}
	}

	table2, err := ext.NewTable("external_table_2",
		ext.Column("col1", "UInt8"),
		ext.Column("col2", "String"),
		ext.Column("col3", "DateTime"),
	)

	for i := 0; i < 10; i++ {
		table2.Append(uint8(i), fmt.Sprintf("value_%d", i), time.Now())
	}
	ctx := clickhouse.Context(context.Background(),
		clickhouse.WithExternalTable(table1, table2),
	)
	rows, err := conn.Query(ctx, "SELECT * FROM external_table_1")
	if err != nil {
		log.Fatal(err)
	}
	for rows.Next() {
		var (
			col1 uint8
			col2 string
			col3 time.Time
		)
		rows.Scan(&col1, &col2, &col3)
		fmt.Printf("col1=%d, col2=%s, col3=%v\n", col1, col2, col3)
	}
	rows.Close()

	var count uint64
	if err := conn.QueryRow(ctx, "SELECT COUNT(*) FROM external_table_1").Scan(&count); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("external_table_1: %d\n", count)
	if err := conn.QueryRow(ctx, "SELECT COUNT(*) FROM external_table_2").Scan(&count); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("external_table_2: %d\n", count)
	if err := conn.QueryRow(ctx, "SELECT COUNT(*) FROM (SELECT * FROM external_table_1 UNION ALL SELECT * FROM external_table_2)").Scan(&count); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("external_table_1 UNION external_table_2: %d\n", count)
	log.Println("done")
}
