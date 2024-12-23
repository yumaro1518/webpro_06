# webpro_06

## このプログラムについて

このプログラムは、Node.jsのExpressフレームワークを使った簡単なウェブアプリケーション。

## 基本設定
- `express`モジュールを使用してサーバーを作成し、EJSをテンプレートエンジンとして設定している。
- `/public`フォルダを静的ファイルの提供ディレクトリとして指定しているため、画像やCSSなどのファイルをこのフォルダ内に配置が可能。

## ルーティング
- **`/hello1` と `/hello2`**：`show`というテンプレートを使って、異なる挨拶メッセージ (`greet1`と`greet2`) を表示。
- **`/icon`**：Appleロゴ画像を表示するためのページ。`filename`に画像ファイルのパス、`alt`に画像の代替テキストを設定。
- **`/luck`**：1から6までの乱数を生成し、ランダムなおみくじ結果を表示。1は「大吉」、2は「中吉」とし、それ以外はログに出力しない。
- **`/janken`**：じゃんけんの結果を表示するページ。
  - ユーザーが選んだ手 (`hand`)、勝利数 (`win`)、総試合数 (`total`) を取得し、コンピューターの手をランダムで決定。
  - 勝敗を判定し、その結果を `judgement` に設定。
  - 結果は `janken` テンプレートに表示され、勝利数と総試合数も表示。
- **`/lottery`**：くじ引きの結果を表示するプログラム
- **`/gatya`**：1連ガチャと10連ガチャを選択して、その結果を表示するページ


## ファイル一覧

| ファイル名           | 説明                        |
|----------------------|-----------------------------|
| `app5.js`            | プログラム本体               |
| `public/index.html` | 案内画面　>>> http://localhost:8080/public/index.html  |
| `public/styles.css` | 案内画面の装飾　       |
| `public/janken.html` | じゃんけんの開始画面        |
| `public/test.html`    | じゃんけんのテンプレートファイル |



### テンプレート一覧

| ファイル名           | 説明                                                                                     |
|----------------------|------------------------------------------------------------------------------------------|
| `views/show.ejs`     | `/hello1` と `/hello2` のエンドポイントに対応し、挨拶メッセージを表示するテンプレート。 |
| `views/icon.ejs`     | `/icon` エンドポイントに対応し、指定された画像ファイルを表示するテンプレート。         |
| `views/luck.ejs`     | `/luck` エンドポイントに対応し、おみくじの結果（運勢）を表示。                      |
| `views/janken.ejs`   | `/janken` エンドポイントに対応し、じゃんけんの結果、勝敗、勝利数、総試合数などを表示。 |
| `views/lottery.ejs`  | `/lottery` エンドポイントに対応し、くじ引きの結果を表示。                           |
| `views/gatya.ejs`    | `/gatya` エンドポイントに対応し、1連または10連ガチャの結果を表示。                 |

###　独自で作成した各ファイルの仕様について

#### `/janken` の仕様について
- **基本的な内部処理**
1. **ユーザーの入力を受け取る**  
   - クエリパラメータから以下を取得する：
     - `hand`: ユーザーが選んだ手（グー、チョキ、パー）。
     - `win`: 勝利数（デフォルトは 0）。
     - `total`: 総試合数（デフォルトは 0）。

2. **CPU の手を決定**  
   - ランダムな値を生成して、以下のように決定する：
     - 1: グー  
     - 2: チョキ  
     - 3: パー  

3. **勝敗を判定**  
   - ユーザーの手と CPU の手を比較する：
     - 同じ手 → 引き分け  
     - 勝利条件に合致 → 勝ち  
     - それ以外 → 負け  

4. **試合結果を更新**  
    勝利数（`win`）と総試合数（`total`）を更新する。

5. **結果を表示**  
    ユーザーの手`hand`、CPU の手`cpu`、勝敗`judgement`、勝利数`win`、総試合数`total`をテンプレートに渡してレンダリングする。

- **クエリパラメータを取得する仕組み**
以下はサーバサイドで、クエリパラメータを取得するプログラムである。
```javascript
let hand = req.query.hand;  
let win = Number(req.query.win) || 0;  // 勝利数
let total = Number(req.query.total) || 0;  // 総試合数
```
`req.query.hand`は文字列としてクエリパラメータを取得する。`Number(req.query.win)`は渡された値を数値として変換し、その値を返す。`Number(req.query.total)`も同様に数値として、その値を返す。また、組み込み関数である`Number`が数値に変換できない場合は、`NaN(Not-a-Number)`として返す。

以下は`/janken`におけるクエリパラメータの例である。
```
localhost:8080/janken?hand=グー&win=2&total=5
```
クエリパラメータは、Webサーバに情報を伝えるためにURLの末尾に付け加える文字列である。
この例では、`hand`に"グー"を、`win`に 2を、`total`に 5をクエリパラメータとしてサーバに伝える。

#### `/lottery` の仕様について
- **基本的な内部処理**

1. **宝くじ番号の生成**
ランダムな番号を1から9999の範囲で生成する。
2. **当選結果を判定**
番号の範囲に応じて当選結果を決定：
    - 1～100 → 1等賞(:排出率1%)
    - 101～1000 → 2等賞(:排出率9%)
    - 1001～5000 → 3等賞(:排出率40%)
    - 5001～10000 → 4等賞(:排出率50%)
3. **結果を表示**
生成した番号`number`とその当選結果`item`をテンプレートに渡してレンダリングする。

- **リクエストについて**
`/lottery`では、クエリパラメータを取得せずに、サイトにアクセスすると、Webサーバにリクエストが送信されて、ランダムに番号を生成して、その結果に基づいて当選結果を返す。

#### `/gatya` の仕様について
- **基本的な内部処理**

1. **ガチャを引く回数の決定**
    - クエリパラメータから引く回数を受け取り、デフォルトは1回、最大で10回まで引くことができる。
2. **各ガチャの結果を判定**
    - 各回のガチャで、1～9999のランダムな番号を生成する。
    - 番号に応じて当選結果を判定：
      - 1～100 → 1等賞 (:排出率1%)
      - 101～1000 → 2等賞 (:排出率9%)
      - 1001～5000 → 3等賞 (:排出率40%)
      - 5001～10000 → 4等賞 (:排出率50%)
3. **結果を表示**
    - 複数回引いたガチャの結果を、リストとしてテンプレートに渡してレンダリングする。

- **クエリパラメータを取得する仕組み**

以下はサーバサイドで、クエリパラメータを取得するプログラムである。
```javascript
const times = req.query.times === "10" ? 10 : 1;  
```
   `req.query.times`でガチャを引く回数を取得する。デフォルトでは1回、指定された場合は最大10回まで指定できる。

  - **レンダリングされる内容**
     results（各回のガチャ結果を追加された）を配列として返す。
　
#### 各エンドポイントとそれぞれのパラメータについて
| エンドポイント                    | 主なクエリパラメータ      | レンダリング内容               |
| --------------  | ------------------------- | ---------------------------- |
| `/janken`         | `hand`, `win`, `total`    | `hand`、`cpu`、`judgement`、`win`、`total` |
| `/lottery`      | なし                      | `number`、`item`               |
| `/gatya`        | `times`| `results(リスト変数)`           |



## サーバの起動およびサイトの閲覧(利用者向け)
webpro_06のディレクトリに移動し、以下のコマンドを入力する。
```terminal
node app5.js
```
これによって、app5.jsで設定されたポート番号をもとにサーバを起動する。
また、各ウェブサイトの閲覧をするためには、以下のようにURLを入力する必要がある。
```
localhost:8080/(エンドポイント名)
```
`エンドポイント名`には`/icon`,`show`,`/janken`,`/lottery`,`/gatya`を指定することができる。

## Github　プッシュするまでの流れ(開発者向け)
```terminal
git add .
git commit -am "コメント内容（変更内容）"
git push
```