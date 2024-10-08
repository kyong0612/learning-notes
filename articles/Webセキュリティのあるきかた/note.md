# Webセキュリティのあるきかた

ref: <https://speakerdeck.com/akiym/websekiyuriteinoarukikata>

## Coolie

### Domain属性

- 指定されたドメインから派生するサブドメインより利用できるようになる
  - 指定しない場合はサブドメインでは利用できない
  - サブドメインからは親ドメインにCookieを書き込める
- 他のドメインには書き込めない
- Domain=.website.testとしてもwebsite.testのCookieとして保存される
  - ただし、Domain=website.testと指定したものとは別に保存される

### Path属性

![alt text](<assets/CleanShot 2024-10-08 at 12.36.56@2x.png>)

### HttpOnly属性

![alt text](<assets/CleanShot 2024-10-08 at 12.38.38@2x.png>)

### Secure属性

![alt text](<assets/CleanShot 2024-10-08 at 12.39.07@2x.png>)

### SameSite属性

![alt text](<assets/CleanShot 2024-10-08 at 12.41.29@2x.png>)

### 「同一のsiteである」とは？

- サブドメインは同一のsite
- ![alt text](<assets/CleanShot 2024-10-08 at 12.42.40@2x.png>)

### Cookieまとめ

![alt text](<assets/CleanShot 2024-10-08 at 12.45.07@2x.png>)
