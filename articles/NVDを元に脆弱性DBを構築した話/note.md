# NVDを元に脆弱性DBを構築した話

ref: <https://securesky-plus.com/engineerblog/1774/>

## 前提知識

- NVD
  - `Nationak Vulnerability Database`
  - 既知脆弱性のデータベース
  - 基本的には世界で一番充実している脆弱性データベース
- CVE
  - `Common Vulnerabilities and Exposures`
  - ある製品中の脆弱性に対して付与される一意の番号
  - NVDはCVEを元にデータを提供している
- CPE
  - `Common Platform Enumeration`
  - 製品名やバージョンを一意に識別するための識別子
  - NVDはCPEを元にデータを提供している

## なぜ独自に脆弱性DBを構築するのか

- API経由で都度データを取得しない理由
  - NISTから推奨されている方法だから
    - <https://nvd.nist.gov/developers/start-here>
  - APIのレスおインスが非常に遅いから
