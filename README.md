# LINE Bot By GAS

Google Apps Script (GAS)を用いたLINE Bot


## 機能

- 機能一覧の表示
- 定型メッセージへの応答
- 指定した範囲の乱数を任意の個数を取得
- 翻訳機能
- Wikipedia検索機能
- Google画像検索機能
- 計算機能
- リマインダー機能
- ログ出力機能


## Requirements

- LINE DevelopersのChannelのアクセストークン
- Google Spreadsheet IDとSheet名
- Google Cloud Platform (GCP)のAPIキー
- Custom Search API の検索エンジンID


## Usage

1. LINE Messaging APIの設定をする
2. Google Spreadsheetにてリマインダーとログ用にシートを作成
3. GCPのAPIキーを取得したり、Custom Search APIの設定をしたりする
4. Google DriveにてGASのプロジェクトを作成する
5. プロジェクトにMomentライブラリを追加する
6. setting.gsを編集する
7. reply_object.gsのgetHelpObj()のヘルプ用の画像URLを編集する
8. 「ウェブアプリケーションとして導入」し、LINE DeveloperのWebhook URLを設定する
9. searchTask()を「時間主導型」のトリガーに設定する
10. LINEから各機能の呼び出し方はトークにて「bot」や「bot help」と送信すると表示されます
