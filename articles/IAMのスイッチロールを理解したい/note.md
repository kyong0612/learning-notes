# IAMのスイッチロールを理解したい

ref: <https://dev.classmethod.jp/articles/iam-switchrole-for-beginner/>

## 記事要約: IAMのスイッチロールを理解したい

### スイッチロールとは

* 複数のAWSアカウント間で作業する際に、アカウントの切り替えを容易にするIAMの機能。
* 詳細なIAMの説明は [AWS初心者にIAM Policy/User/Roleについてざっくり説明する](https://dev.classmethod.jp/cloud/aws/iam-policy-user-role-for-primary-of-aws/) を参照。

### 実装の手順

**スイッチ先アカウントでの作業:**

1. IAMコンソールで「ロール」を選択し、「ロールの作成」をクリック。
    ![](https://devio2023-media.developers.io/wp-content/uploads/2020/02/b64d01d52671ae4d03f6007245f596dd-960x525.png)
2. 信頼できるエンティティとして「別のAWSアカウント」を選択し、スイッチ元のAWSアカウントIDを入力。
    ![](https://devio2023-media.developers.io/wp-content/uploads/2020/02/bc90ac5e2036a35c9356509c9c4536d5-960x522.png)
3. ロールにアタッチするポリシーを選択（例: `AdministratorAccess`）。
    ![](https://devio2023-media.developers.io/wp-content/uploads/2020/02/cc56f095345c2a11d7a09d914509bc06-960x526.png)
4. （任意）タグを設定。
    ![](https://devio2023-media.developers.io/wp-content/uploads/2020/02/eb3b825441c0a97593ce902cc63076b9-960x526.png)
5. ロール名を入力し、「ロールの作成」をクリック。
    ![](https://devio2023-media.developers.io/wp-content/uploads/2020/02/70c861da3b768723ca35a8fdf3f04f1f-960x527.png)

**スイッチ元アカウントでの作業:**

1. IAMコンソールで「ポリシー」を選択し、「ポリシーの作成」をクリック。
    ![](https://devio2023-media.developers.io/wp-content/uploads/2020/02/4cb1cee201801f0cd5e21953b4d31543-960x551.png)
2. JSON形式でポリシーを記述。`sts:AssumeRole` アクションを許可し、`Resource` にスイッチ先で作成したロールのARNを指定する。
    ![](https://devio2023-media.developers.io/wp-content/uploads/2020/02/3070055232461929b5f7710c4fb9dba4-960x547.png)
3. ポリシー名を入力し、「ポリシーの作成」をクリック。
    ![](https://devio2023-media.developers.io/wp-content/uploads/2020/02/e6130fa8d894e6391ec73d7d7a95476f-960x525.png)
4. **スイッチロールの実行:**
    * 画面右上のアカウント情報から「スイッチロール」をクリック。
        ![](https://devio2023-media.developers.io/wp-content/uploads/2020/02/926f3bf6e2f082b08411165d2ba80a3f-960x525.png)
    * スイッチ先のアカウントID、作成したロール名、表示名、色を選択し、「ロールの切り替え」をクリック。
        ![](https://devio2023-media.developers.io/wp-content/uploads/2020/02/c351d053169b0117f8d07980d4d8bdce-960x528.png)
    * アカウント情報がスイッチ先の情報に変わっていることを確認。
        ![](https://devio2023-media.developers.io/wp-content/uploads/2020/02/80f93e589b025bebafc278e180218d28-960x522.png)

### まとめ

**スイッチ先アカウントでの準備:**

* スイッチ元アカウントが引き受けるためのIAMロールを作成。
* 作成したロールに必要な権限を付与するIAMポリシーをアタッチ。

**スイッチ元アカウントでの準備:**

* スイッチ先のロールを引き受ける (`sts:AssumeRole`) ことを許可するIAMポリシーを作成。ポリシー例:

    ```json
    {
        "Version": "2012-10-17",
        "Statement": {
            "Effect": "Allow",
            "Action": "sts:AssumeRole",
            "Resource": "arn:aws:iam::<スイッチ先のAWSアカウントID>:role/<スイッチ先で作成したロール名>"
        }
    }
    ```

**スイッチロールのメリット:**

* スイッチ元アカウントにログインしたまま、スイッチ先アカウントのリソースを操作できる（別途ログイン/ログアウト不要）。
* アカウント間の切り替えが容易になる。

**必要な操作の要点:**

1. **スイッチ先:** スイッチ元が引き受けるロールを作成し、ポリシーを付与する。
2. **スイッチ元:** スイッチ先のロールを引き受ける許可ポリシーを作成する。

### 最後に

* 実際に手を動かすことで、スイッチロールの仕組みが深く理解できた。
* この記事がスイッチロールの理解に役立つことを期待。

### 参考記事

* [Swith Roleで複数のAWSアカウント間を切替える](https://qiita.com/yoshidashingo/items/d13a9b17f111d5d91a2e)
* [【小ネタ】AWS CLIでスイッチロールして作業を行うための設定をやってみた](https://dev.classmethod.jp/etc/cli-switch-role/)
* [\\[小ネタ\\]ディレクトリ移動した際に自動で一時クレデンシャルを取得・設定する](https://dev.classmethod.jp/cloud/aws/assumerole-with-direnv/)
