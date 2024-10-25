# Daily2

- room
  - <https://tryhackme.com/r/room/basicpentestingjt>

## nmapでポートスキャンしてみる

- ポートを番号順に調べていく

```bash
brew install nmap
```

```bash
nmap -sV -Pn -oN nmap.txt -v 10.10.97.157
```

- -sV: 開いているポートのサービスバージョンを自動的に特定してくれる。これにより、特定のポートで動作しているサービスの詳細情報(例えば、そのソフトウェアの名前やバージョンなど)を取得できる
- -Pn: 事前にICMPリクエストを送信して確認することなく、直接ポートスキャンやその他のスキャンを実行するオプション。ターゲットホストがICMPリクエストをブロックしているとスキャンせずに終わってしまう可能性があるため付与
- oN:スキャン結果をファイルに保存
- -v: 詳細な情報を表示

```bash
nmap -sV -Pn -oN nmap.txt -v 10.10.97.157
Starting Nmap 7.95 ( https://nmap.org ) at 2024-10-25 21:02 JST
NSE: Loaded 47 scripts for scanning.
Initiating Parallel DNS resolution of 1 host. at 21:02
Completed Parallel DNS resolution of 1 host. at 21:02, 13.01s elapsed
Initiating Connect Scan at 21:02
Scanning 10.10.97.157 [1000 ports]
Connect Scan Timing: About 7.75% done; ETC: 21:09 (0:06:09 remaining)
Connect Scan Timing: About 15.05% done; ETC: 21:09 (0:05:44 remaining)
Connect Scan Timing: About 22.75% done; ETC: 21:09 (0:05:09 remaining)
Connect Scan Timing: About 30.00% done; ETC: 21:09 (0:04:42 remaining)
Connect Scan Timing: About 37.50% done; ETC: 21:09 (0:04:12 remaining)
Connect Scan Timing: About 45.00% done; ETC: 21:09 (0:03:41 remaining)
Connect Scan Timing: About 52.50% done; ETC: 21:09 (0:03:11 remaining)
Connect Scan Timing: About 60.00% done; ETC: 21:09 (0:02:41 remaining)
Connect Scan Timing: About 67.50% done; ETC: 21:09 (0:02:10 remaining)
Connect Scan Timing: About 75.00% done; ETC: 21:09 (0:01:40 remaining)
Connect Scan Timing: About 82.25% done; ETC: 21:09 (0:01:11 remaining)
Connect Scan Timing: About 89.75% done; ETC: 21:09 (0:00:41 remaining)
Completed Connect Scan at 21:09, 402.88s elapsed (1000 total ports)
Initiating Service scan at 21:09
NSE: Script scanning 10.10.97.157.
Initiating NSE at 21:09
Completed NSE at 21:09, 0.00s elapsed
Initiating NSE at 21:09
Completed NSE at 21:09, 0.00s elapsed
Nmap scan report for 10.10.97.157
Host is up.
All 1000 scanned ports on 10.10.97.157 are in ignored states.
Not shown: 1000 filtered tcp ports (no-response)

Read data files from: /opt/homebrew/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 416.07 seconds
```
