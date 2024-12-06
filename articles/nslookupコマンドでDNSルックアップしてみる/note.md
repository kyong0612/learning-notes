# nslookupコマンドでDNSルックアップしてみる

ref: <https://qiita.com/mach555/items/77fd6dca3159ca9ac409>

```bash

nslookup qiita.com -recurse  -debug
Server:  127.0.2.2
Address: 127.0.2.2#53

------------
    QUESTIONS:
 qiita.com, type = A, class = IN
    ANSWERS:
    ->  qiita.com
 internet address = 18.65.207.34
 ttl = 60
    ->  qiita.com
 internet address = 18.65.207.100
 ttl = 60
    ->  qiita.com
 internet address = 18.65.207.93
 ttl = 60
    ->  qiita.com
 internet address = 18.65.207.4
 ttl = 60
    AUTHORITY RECORDS:
    ADDITIONAL RECORDS:
------------
Non-authoritative answer:
Name: qiita.com
Address: 18.65.207.34
Name: qiita.com
Address: 18.65.207.100
Name: qiita.com
Address: 18.65.207.93
Name: qiita.com
Address: 18.65.207.4
```
