.PHONY intall:
install:
	curl https://clickhouse.com/ | sh

.PHONY start.server:
start.server:
	./clickhouse server

.PHONY start.client:
start.client:
	./clickhouse client

.PHONY run.client.go:
run.client.go:
	cd client/go && make run
