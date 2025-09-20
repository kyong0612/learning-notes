#!/bin/bash

echo "🆕 新しいマイグレーションファイルを作成"

# 説明を引数から取得
DESCRIPTION="$1"

if [ -z "$DESCRIPTION" ]; then
    echo "使用法: $0 <説明>"
    echo "例: $0 add_user_age_constraint"
    exit 1
fi

# タイムスタンプを生成 (YYYYMMDDHHmmss形式)
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# ファイル名を生成
FILENAME="migrations/${TIMESTAMP}__${DESCRIPTION}.cypher"

# テンプレート内容
cat > "$FILENAME" << EOF
// $(date '+%Y-%m-%d %H:%M:%S') - ${DESCRIPTION}
// このマイグレーションは ${DESCRIPTION} を実行します

// ここにCypherコマンドを記述してください
// 例:
// CREATE CONSTRAINT example_constraint IF NOT EXISTS
// FOR (n:Example) REQUIRE n.property IS UNIQUE;

EOF

echo "✅ マイグレーションファイルを作成しました: $FILENAME"
echo ""
echo "ファイルを編集してCypherコマンドを追加してください。"
echo "完了したら 'make migrate' を実行してマイグレーションを適用してください。"