const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;  
  let win = Number(req.query.win) || 0;  // 勝利数
  let total = Number(req.query.total) || 0;  // 総試合数
  console.log( {hand, win, total});
  
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';

  // ここに勝敗の判定を入れる
  let judgement = '';  // 勝敗の結果

  if (hand === cpu) {
    judgement = '引き分け';
  } else if (
    (hand === 'グー' && cpu === 'チョキ') ||
    (hand === 'チョキ' && cpu === 'パー') ||
    (hand === 'パー' && cpu === 'グー')
  ) {
    judgement = '勝ち';
    win += 1;
  } else {
    judgement = '負け';
  }
  total += 1;

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }

  res.render( 'janken', display );
});

app.get("/lottery", (req, res) => {
  const num = Math.floor( Math.random() * 9999 + 1 );
  let item = '';
  if( num>=1 &num<=100 ) item  = '1等賞!おめでとう！';
  else if( num>=100 & num<=1000 ) item  = '2等賞!素晴らしい！';
  else if( num>=1000 & num<=5000  ) item = '3等賞!いいね！';
  else if( num>=5000 & num<=10000 ) item = '4等賞!まぁまぁやね';

  res.render( 'lottery', {number:num, item:item} );
});

app.get("/gatya", (req, res) => {
  const times = req.query.times === "10" ? 10 : 1;  // デフォルトは1連
  let results = [];

  for (let i = 0; i < times; i++) {
    const num = Math.floor(Math.random() * 9999 + 1);
    let item = '';

    if (num >= 1 && num <= 100) {
      item = '1等賞!おめでとう！';
    } else if (num > 100 && num <= 1000) {
      item = '2等賞!素晴らしい！';
    } else if (num > 1000 && num <= 5000) {
      item = '3等賞!いいね！';
    } else if (num > 5000 && num <= 10000) {
      item = '4等賞!まぁまぁやね';
    }

    results.push({ number: num, item: item });
  }
  console.log

  res.render('gatya', { results: results });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
