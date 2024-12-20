# npm package をオフラインでインストールする

ref: <https://blog.kyanny.me/entry/2021/08/01/022423#gsc.tab=0>

インターネットに接続していないホストにnpmパッケージをインストールするには、以下の手順を実行します。

 1. インターネットに接続しているホストで、対象パッケージのソースコードを取得する:

```bash
git clone <https://github.com/github/ghec-audit-log-cli>
cd ghec-audit-log-cli/
```

 2. package.jsonにbundledDependenciesを追加する:
dependenciesに列挙されているパッケージ名をコピーし、bundledDependenciesフィールドに追加します。以下のPythonスクリプトを使用して自動化できます。

```bash
python3 -c 'import json; f=open("package.json", "r"); data=json.loads(f.read()); data["bundledDependencies"]=list(data["dependencies"].keys()); f.close(); f=open("package.json", "w"); f.write(json.dumps(data, indent=2)); f.close()'
```

変更後のpackage.jsonの差分は次のとおりです。

```diff
diff --git a/package.json b/package.json
index 46e680a..d318b16 100644
--- a/package.json
+++ b/package.json
@@ -45,5 +45,15 @@
   },
   "devDependencies": {
     "standard": "^16.0.3"

- }
-}

- },

- "bundledDependencies": [
- "@octokit/plugin-enterprise-cloud",
- "@octokit/plugin-retry",
- "@octokit/plugin-throttling",
- "@octokit/rest",
- "commander",
- "json-hash",
- "validate.js",
- "yaml"
- ]
+}
```

 3. 依存パッケージをインストールする:

npm install

 4. パッケージをパックする:

```bash
npm pack
```

これにより、ghec-audit-log-cli-2.0.0.tgzというファイルが作成されます。

 5. 作成された.tgzファイルを、インターネットに接続していないホストにコピーする:
scpやUSBメモリなどを使用して、ファイルを転送します。
 6. オフライン環境のホストで、パッケージをインストールする:

```bash
npm install ghec-audit-log-cli-2.0.0.tgz
```

これで、オフライン環境でもパッケージが正常にインストールされ、コマンドも実行できるようになります。

```bash
npx ghec-audit-log-cli --help
```

上記のコマンドで、ヘルプ情報が表示されれば成功です。
