# What is mutation testing?

ref: <https://stryker-mutator.io/docs/>

- ミューテーション・テストは、コードを変更し、ユニットテストを実行して失敗を確認することで、テストの有効性を示すものです。
- コードに対して行われる変更は「ミューテント」と呼ばれ、自動的に本番コードに挿入されます。
- ミューテントに対して少なくとも1つのユニットテストが失敗した場合、そのミューテントは「殺された」と見なされます。テストに合格した場合、ミューテントは生き残ります。
- テストの有効性は、殺されたミューテントの割合で測られ、この割合が高いほど、テストカバレッジが良いことを示します。
- コードカバレッジだけでは、テストの有効性を正確に反映しない可能性があります。テストに適切なアサーションがないと誤解を招くことがあります。
- Strykerは、複数のプラットフォームに対応し、偽陽性を回避するように設計された、ユーザーフレンドリーなミューテーション・テストツールを提供しています。
- 簡単な年齢チェック機能を例に、Strykerがどのようにミューテントを作成してテストするかを示しています。
- ミューテーション・テストの結果は、さまざまな形式で報告されますが、プレーンテキストレポーターが最も分かりやすい形式の1つです。
- レポートには、コードがどのように変更されたか、ミューテントが殺されたか生き残ったかが詳細に記載されており、テストカバレッジの欠陥を特定するのに役立ちます。
- この文書は、コード品質の向上とテストカバレッジの確保にミューテーション・テストの重要性を強調しています。