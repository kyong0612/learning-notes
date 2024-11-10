# 解雇された米国ディズニー元従業員による不正アクセスについてまとめてみた

ref: <https://piyolog.hatenadiary.jp/entry/2024/11/09/041408>

## 事件の概要

米国ディズニーの元従業員Michael Scheuerが、解雇後に同社のレストランメニューシステムに不正アクセスし、様々な妨害行為を行った事件です[1]。

## 主な不正行為

**メニューシステムの改ざん**

- フォントを記号に変更してシステムを使用不能に[1]
- アレルギー情報の危険な改ざん（ピーナッツアレルギー情報の誤った変更）[1][2]
- QRコードを反イスラエルサイトに誘導するよう改ざん[1]

**従業員への攻撃**

- 14名の従業員アカウントに対するDoS攻撃[1]
- 従業員の個人情報収集と自宅訪問[1]

## 技術的手法

- Mullvad VPNを使用して接続[1]
  - プライバシー保護機能が高い
- 仮想マシンを利用（Windows 10など3台）[1]
- 管理者アカウントを使用して架空アカウントを作成[1]
- 自動化スクリプトによるDoS攻撃[1]

## 被害状況

- システム停止により1-2週間の手動対応を強いられる[1]
- 被害総額は少なくとも15万ドル[1][4]
- 幸いにも改ざんされたメニューは配布前に発見[2][3]

## 容疑者について

- メニュープロダクションマネージャーとして勤務[1]
- 2024年6月に解雇[1]
- 精神障害があり、職場でのパニック発作が解雇の一因[1][2]
- 解雇に関して雇用機会均等委員会へ苦情申し立て[1]

Sources
[1] 041408 <https://piyolog.hatenadiary.jp/entry/2024/11/09/041408>
[2] Former Disney employee accused of hacking menu system and ... <https://www.cbsnews.com/news/disney-employee-michael-scheuer-hacking-menus-peanut-allergy/>
[3] Fired Disney worker accused of hacking into restaurant menus ... <https://www.bitdefender.com/en-gb/blog/hotforsecurity/fired-disney-worker-hacking-restaurant-menus-replacing-false-peanut-allergy/>
[4] Fired Disney worker allegedly hacked restaurant menus to remove ... <https://www.fox10phoenix.com/news/michael-scheuer-disney-menu-hacking>
[5] Ex-Disney worker accused of hacking computer menus to add ... <https://apnews.com/article/disney-arrest-florida-orlando-theme-parks-0c075b6ff23f3d57fe44be6ea1a85407>
[6] Fired Disney employee allegedly hacked into company system to ... <https://www.cnn.com/2024/10/30/business/fired-disney-employee-allegedly-hacked-into-company-system-to-change-allergy-info-on-menus/index.html>
[7] Fired Disney Employee Allegedly Changed Allergen Info on Park's ... <https://people.com/fired-disney-employee-allegedly-changed-allergen-info-on-park-menus-8737760>
[8] Former Disney employee arrested for hacking menus - Fast Company <https://www.fastcompany.com/91220993/employee-charge-disneys-menus-arrested-hacking-servers>
[9] Ex-Disney Worker Allegedly Added Profanities and Mistakes to ... <https://www.newsweek.com/disney-world-worker-hack-computer-menus-1978306>
