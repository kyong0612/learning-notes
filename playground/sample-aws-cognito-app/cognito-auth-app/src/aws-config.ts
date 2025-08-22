export const awsConfig = {
  Auth: {
    Cognito: {
      // Cognitoユーザープールの設定
      // 実際の値はAWSコンソールから取得してください
      userPoolId: 'YOUR_USER_POOL_ID', // 例: us-east-1_xxxxxxxxx
      userPoolClientId: 'YOUR_USER_POOL_CLIENT_ID', // 例: 1234567890abcdefghijklmnop
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
        username: false
      }
    }
  }
};

// 注意: 本番環境では環境変数を使用してください
// userPoolId: process.env.REACT_APP_USER_POOL_ID
// userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID