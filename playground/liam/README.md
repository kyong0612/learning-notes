# Liam Playground

## setup

```bash
docker compose up -d
```

- テーブルの内容を確認

```bash
docker exec -it local_postgres psql -U testuser -d testdb
```

```bash
testdb-# \dt
               List of relations
 Schema |       Name        | Type  |  Owner   
--------+-------------------+-------+----------
 public | clients           | table | testuser
 public | departments       | table | testuser
 public | employee_projects | table | testuser
 public | employees         | table | testuser
 public | job_history       | table | testuser
 public | projects          | table | testuser
 public | tasks             | table | testuser
(7 rows)
```

## generate ER chart

- [tbls](https://github.com/k1LoW/tbls)


```bash
npx @liam-hq/cli erd build --input tbls/dbdoc/schema.json --format tbls
npx http-server dist/
```

## cleanup

```bash
docker compose down --volumes
```
