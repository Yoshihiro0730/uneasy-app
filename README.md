# ①課題番号-プロダクト名

予約アプリ

## ②課題内容（どんな作品か）

- ユーザー登録することでお客様番号が払い出される
- お客様番号を用いて、予約ができる

## ③DEMO

デプロイしている場合はURLを記入（任意）
https://challenge-netsu.sakura.ne.jp/reserve-app/
## ④作ったアプリケーション用のIDまたはPasswordがある場合

- ID: なし
- PW: なし

## ⑤工夫した点・こだわった点

- DB操作をクラス化して各ソース上でインスタンスを作ってクエリを実行させた
- フロント側からapiで呼び出してサーバサイドを実行
- 作成日時、更新日時を各テーブルに設け、current_timestamp()	を設定することでSQLを書かずに格納時間を登録させた
- ユーザーIDと予約日時でインデックスを貼ってみた（そんなにデータがないので、特に処理時間は変わらず）

## ⑥難しかった点・次回トライしたいこと(又は機能)

- DB操作をクラス化して動かしてみた
- カレンダーでFullCalendarライブラリを使ってカレンダーを表現
- 月表示が切り替わるタイミングで表示月の予約データのみを取得して表示させるようにした
- php側も.envでローカルは実装できたが、実装までに時間がかかったのとロジックを正確にまだ理解できていない

## ⑦質問・疑問・感想、シェアしたいこと等なんでも

- [質問]
- [感想]クラス化が思ったより難しかった。php側で環境変数の設定方法がわからず、苦戦した。フロントはだいぶ慣れたのかサクサクかけるようになった。
- [参考記事]
  - 1. https://qiita.com/cokemaniaIIDX/items/32676eacf4d6f5413d81
  - 2. https://watsunblog.com/php-reservation-calender/#ps
  - 3. https://fumiononaka.com/Business/html5/FN2107001.html
  - 4. https://job-info.hateblo.jp/entry/2024/09/03/224234
  - 5. https://www.mitsue.co.jp/knowledge/blog/frontend/202012/08_0900.html
  - 6. https://labo.kon-ruri.co.jp/php-dotenv/#phpdotenv%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB