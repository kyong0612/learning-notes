# OpenAIの文字起こしAI「Whisper」、医療現場での利用に研究者らが警鐘

ref: <https://www.itmedia.co.jp/news/articles/2410/27/news070.html>

OpenAIの音声テキスト変換AI「Whisper」に関する重要な問題点が報告されています。

## 主要な問題点

Whisperには文章を捏造してしまう「幻覚」という重大な欠陥があることが、多数の研究者やエンジニアの調査で明らかになりました[1]。

## 具体的な事例と研究結果

**研究による発見**

- ミシガン大学の研究では、10件中8件の文字起こしに幻覚が発見されました[1]
- コーネル大学とバージニア大学の研究では、幻覚の約40%が話者の誤解や歪曲につながる可能性があると判断されました[1]

**問題のある事例**
実際の会話で「他の2人の女の子と1人の女性」という発言に対し、Whisperは「その人は黒人だった」という存在しない人種に関するコメントを追加してしまいました[1][3]。

## 医療分野での懸念

**現状の利用状況**

- 3万人以上の臨床医
- 40の医療システム
がNabla社開発のWhisperベースのツールを使用しています[1][2]。

**深刻な問題点**

- 患者のプライバシー保護のため、元の音声録音は削除される
- 文字起こしの正確性を検証できない
- 医療診断や治療に影響を与える可能性がある[1][2]

## 対応策

OpenAIは以下の問題点を認識しています：

- データセット固有の癖の反映
- 言語識別精度の低さ[1]

特に医療現場など重要な意思決定の場面では、Whisperの出力を慎重に確認する必要があり、AIの潜在的なリスクを認識し適切な対策を講じることが重要とされています[1]。

Sources
[1] news070.html <https://www.itmedia.co.jp/news/articles/2410/27/news070.html>
[2] Concerns Over AI Transcription Tool Whisper's Accuracy in Medical ... <https://www.speakaccounting.com/ai-transcription-tool-whisper-flaws-medical-use/>
[3] AI-powered transcription tool used in hospitals invents things no one ... <https://www.pressherald.com/2024/10/26/ai-powered-transcription-tool-used-in-hospitals-invents-things-no-one-ever-said-researchers-say/>
[4] OpenAIの文字起こしAI「Whisper」、医療現場での利用に研究者らが警鐘 <https://www.itmedia.co.jp/news/articles/2410/27/news070.html>
[5] OpenAI's Whisper model is reportedly 'hallucinating' in high-risk situations <https://www.tomsguide.com/ai/openais-whisper-model-is-reportedly-hallucinating-in-high-risk-situations>
[6] OpenAI's Whisper Experiencing 'AI Hallucinations' Despite ... - PCMag <https://www.pcmag.com/news/openais-whisper-experiencing-ai-hallucinations-despite-high-risk-applications>
