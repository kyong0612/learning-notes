---
title: "Prepare for Scoring 3.0"
source: "https://support.securityscorecard.com/hc/en-us/articles/16235105523739-Prepare-for-Scoring-3-0"
author:
  - "[[Help Center]]"
published: 2025-07-01
created: 2025-10-08
description: "On April 9, 2024, SecurityScorecard introduced Scoring 3.0, an updated methodology that tightens the correlation of scores to breach..."
tags:
  - "clippings"
---
2024年4月9日、SecurityScorecardはScoring 3.0を導入しました。これは、スコアと[侵害可能性](https://support.securityscorecard.com/hc/en-us/articles/22601556325147-A-Closer-Look-at-Scoring-3-0-Vocabulary-and-Breach-Likelihood)の相関関係を強化した更新された方法論です。

2023年9月13日にScoring 3.0のプレビューを導入し、恒久的な切り替えに備えていただきました。この導入期間中、従来の方法論を反映した以前の公式Scorecardスコアを確認し、今後のScoring 3.0スコアと比較することができました。

新しいスコアリングアルゴリズムの開発方法、変更内容、組織にもたらすメリットについては、以下のビデオまたは**[このウェビナー](https://www.brighttalk.com/webcast/19566/605054?bt_tok={{lead.id}}&utm_medium=owned_email&utm_source=mkto&utm_campaign=20240123_scoring3&utm_content=webinar)**をご覧ください。

## いつ変更されますか？

Scoring 3.0への切り替えは、2024年4月9日に行われました。4月9日にプラットフォーム内でScoring 3.0にアクセスできるよう、**2024年4月8日月曜日午後4時ET**に戦略的に展開を開始しました。このタイミングにより、ユーザーへの影響を最小限に抑えました。

2024年4月9日火曜日にSecurityScorecardにログインすると、切り替えビューが利用できなくなり、スコアが新しいScoring 3.0スコアを反映していることがわかります。

2024年4月9日木曜日の時点で、プラットフォームのすべての領域が新しいスコアリングを反映するように更新されました。

## 3.0の違い

新しい方法論には、いくつかの主要な変更が含まれています:

- 3.0では、全体的なScorecardスコアは、組織のインターネットに面したアセットで発見されたすべてのセキュリティ[問題](https://support.securityscorecard.com/hc/en-us/articles/4410784989083#h_01FMXBTWNN4D89MYRT3HQ92FFW)を直接反映します。これは、全体的なScorecardスコアが10の[ファクター](https://support.securityscorecard.com/hc/en-us/articles/4410784989083#h_01FMXBQHSJXWAMVZTHF12RNAR0)スコアの加重平均である現在のスコアリング方法論とは異なります。
- 3.0のファクターには[重み](https://support.securityscorecard.com/hc/en-us/articles/4410784989083#h_01FMXBRZVC43T6J2DAQ43VNAQM)がなくなりました。0から100の数値スコアを持ちます。3.0の問題タイプには引き続き重みがあります。これにより、スコアリング計算プロセスがより明確で理解しやすくなります。
- 特定の問題タイプは、現在のスコアリング方法論と比較して、3.0では異なる重大度レベルとスコアへの影響を持っています。低いものもあれば高いものもあります。[スコアリング方法論ホワイトペーパー](https://securityscorecard.com/wp-content/uploads/2025/06/MethodologyDeepDive-3.0-Ebook_14.pdf)の*Cybersecurity Signals*を参照して、両方の方法論の重大度レベルを比較できます。
- 3.0のA未満の文字グレードは、[侵害可能性](https://support.securityscorecard.com/hc/en-us/articles/22601556325147-A-Closer-Look-at-Scoring-3-0-Vocabulary-and-Breach-Likelihood)とより高い相関関係があります:  
 | **グレード** | **現在の方法論での侵害可能性** | **3.0での侵害可能性** |
 | --- | --- | --- |
 | A | 1x | 1x |
 | B | 2.6x | 2.9x |
 | C | 4.3x | 5.4x |
 | D | 6x | 9.2x |
 | F | 7.7x | 13.8x |

## 3.0への切り替えに備える方法

Scorecardの問題の発見状況によっては、スコアが大幅に変わる可能性があります。3.0プレビューを使用して、2024年4月の切り替えに先立ち、問題解決の優先順位を適切に調整してください。

- Scorecardの**Issues**タブに移動し、3.0プレビューをオンにします。
- 3.0と現在の方法論の侵害リスクレベルとスコアへの影響を比較します。  

 ![scoring_30_issues.png](https://support.securityscorecard.com/hc/article_attachments/18750757316763)

パートナーの1つであるRed Siftと協力して提供される[この無料トライアル](https://get.ondmarc.redsift.com/ssc/)をご活用ください。Red Siftは、安全でない行動や侵害の可能性が高いことを示すSecurityScorecardの問題に積極的に対処することで、企業のサイバーセキュリティ評価の向上を支援できます。

## 問題タイプの重大度フィードバック

問題タイプの詳細ページでこのフィードバックメカニズムを使用して、フィードバックを提供し、将来のスコアリング決定を推進してください。

**脅威レベル:**

脅威レベルは、SecurityScorecardの脅威専門家によって識別された重大度を、高、中、低、または情報として示します。これらは脅威に対する理解に基づいており、以下のように定義できます:

| **問題** | **影響** | **アクション** |
| --- | --- | --- |
| 情報 | 影響が最小またはなく、重大な損失にはつながらない可能性が高い | 監視; 将来の参照のために記録 |
| 低 | 軽微な影響、重大な損失にはつながらない可能性が高い | レビュー; 軽微な修正を適用 |
| 中 | 顕著な影響、重大な損失につながる可能性が高い | 調査; 是正措置を実施 |
| 高 | 重大または深刻な影響、重大な損失につながる可能性が非常に高い | 即座の調査; 強力な対策を実施 |

**侵害リスク:**

侵害リスクは、侵害との相関関係に関するデータ駆動型アプローチに基づく深刻度レベルを示します。データサイエンスチームは、侵害と問題タイプの相関関係を特定するために15,000件以上の侵害を評価しました。その評価に基づいて、問題タイプには高、中、低、または情報のレベルがあります。

上記の定義に基づいて、スコアへの影響が高い、低い、または適切であるかについてのフィードバックを収集しています。お客様のフィードバックは非常に貴重であり、将来のスコアリング再調整の際に考慮されます。

各問題タイプの詳細ページで以下のフィードバックメカニズムを見つけてください。

- My Scorecard view: 自分のScorecardで問題を表示し、フィードバックを提供できます。

![](https://support.securityscorecard.com/hc/article_attachments/24152798447003)

- Other's Scorecard view: 他者のScorecardの問題のみを表示できます。

![](https://support.securityscorecard.com/hc/article_attachments/24152806084507)

## Scoring 3.0の再調整

Scoring 3.0の改善と洗練を続ける中で、お客様のフィードバックに基づいて問題タイプの重みと侵害リスクレベルが見直されています。

### 2023年12月6日

**推奨される次のステップ:**

近い将来、各CVSSv3問題タイプに実質的な重みと侵害リスクレベルを適用する予定です。現状のCVSSv3問題の修復に注力することをお勧めします。これらの問題が未解決のままの場合、次のScoring 3.0再調整で大きなスコアへの影響が見られます。

## スコアを向上させるための推奨アクション

スコアの改善を開始するには、[これらの推奨事項](https://support.securityscorecard.com/hc/en-us/articles/21213150771355-Recommended-actions-to-Improve-your-Scoring-3-0-score-)に従ってください。

## FAQ

### SecurityScorecardがスコアリング方法論を更新する理由は？

スコアリングアルゴリズムの変更により、侵害の予測可能性が向上します。

さらに、新しい方法論は、問題タイプと全体的なスコアの直接的な相関関係により、スコアリング計算プロセスを明確にします。

サイバーセキュリティの現在の動的な状態を正確に反映するために方法論を常に改善することに取り組んでおり、サイバーリスクの管理方法について最も情報に基づいた決定を下すことができます。

### スコアリングアルゴリズムの変更はどのくらいの頻度で行われますか？

スコアリングアルゴリズムは3〜4年ごとに変更されます。

### Scoring 3.0はHistoryページのスコアデータにどのような影響を与えますか？

2024年4月に3.0への完全な切り替えが行われると、Historyページはプラットフォーム上でScoring 3.0データの表示を開始し、切り替え前のScoring 2.0の履歴データを保持します。

### Scoring 3.0のスキャン頻度は？

頻度は現在の方法論と同じです。頻度については、[スコアリング方法論ホワイトペーパー](https://securityscorecard.com/wp-content/uploads/2025/06/MethodologyDeepDive-3.0-Ebook_14.pdf)の*Cybersecurity Signals*を参照してください。

### プラットフォームの2つのスコアのうち、どちらに注意を払うべきですか？

問題タイプを修復すると両方の方法論のスコアが向上しますが、具体的な影響は、その特定の問題タイプの侵害リスクレベルによって異なります。

### Scorecardの問題の発見を解決すると、両方のスコアが上がりますか？

はい、Scorecardの問題を修復すると、異なる問題の侵害リスクレベルにより、両方の3.0スコアが異なる形で上昇します。

## 詳細はこちら

Scoring 3.0の仕組みに関する詳細情報については、[スコアリング方法論ホワイトペーパー](https://securityscorecard.com/wp-content/uploads/2025/06/MethodologyDeepDive-3.0-Ebook_14.pdf)をご覧ください。
