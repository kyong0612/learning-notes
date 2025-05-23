# Two Heads are Better Than One: Test-time Scaling of Multi-agent Collaborative Reasoning

ref: <https://arxiv.org/abs/2504.09772>

## 概要

マルチエージェントシステム（MAS）は、大規模言語モデル（LLM）を基盤として構築され、単一エージェントシステムでは対応が難しい複雑な実世界のタスクを解決するための有望なアプローチです。テスト時スケーリング（TTS）の最近の進歩により、単一エージェントの推論タスクのパフォーマンスは大幅に向上しましたが、MASにおける協調と推論を効果的にスケールする方法は未解決の課題でした。

本研究では、モデルレベルのトレーニングとシステムレベルの調整の両方を通じて協調的推論を強化するための適応型マルチエージェントフレームワークを提案しています。

## 主な貢献

1. **M500データセット**: 500の高品質なマルチエージェント協調推論トレースを含むデータセットを構築
2. **M1-32Bモデル**: Qwen2.5-32B-Instructをマルチエージェント協調のために最適化したモデル
3. **CEOエージェント**: 議論プロセスを動的に管理し、エージェント協調と推論の深さを調整する新しいメカニズム

## 評価結果

様々なタスク（一般理解、数学的推論、コーディングなど）でオープンソースMASを評価した結果、強力なベースラインを大幅に上回るパフォーマンスを達成:

- GPQA-Diamondで12%の改善
- AIME2024で41%の改善
- MBPP-Sanitizedで10%の改善

これらの結果は、マルチエージェント推論をスケールする上で、学習された協調と適応型調整の両方が重要であることを示しています。

## 技術的アプローチ

システムは以下の主要コンポーネントで構成されています：

1. **モデルレベルの協調学習**: M500データセットを使用したモデルの微調整
2. **システムレベルの適応型調整**: CEOエージェントによる議論の管理と推論深度の調整
3. **オープンソースMASフレームワーク**: AgentVerseをベースに拡張したシステム

## 実装詳細

システムは公開リポジトリで提供されており、以下のリソースが利用可能です：

- M1-32Bモデル: <https://huggingface.co/Can111/m1-32b>
- M500データセット: <https://huggingface.co/datasets/Can111/m500>
- コードリポジトリ: <https://github.com/jincan333/MAS-TTS>

## 制限事項

明示的な制限事項は記載されていませんが、以下の点が考慮されるべきです：

1. 性能評価はモデルとタスクの特定の組み合わせに依存
2. マルチエージェントアプローチは計算コストが高い可能性がある
3. 特定のドメインやタスクに対する適応が必要になる場合がある

![パフォーマンスグラフ](https://github.com/jincan333/MAS-TTS/raw/main/documentation/performance.png)

注：s1.1-32Bの結果は予算強制を使用せずに得られたものです。
