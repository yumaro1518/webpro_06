"use strict";

const express = require("express");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

const upload = multer({ dest: "uploads/" });
let bbs = []; // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える
let backgroundColor = "#ffffff"; // デフォルト背景色

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ルート定義
app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1: message1, greet2: message2 });
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1: "Hello world", greet2: "Bon jour" });
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename: "./public/Apple_logo_black.svg", alt: "Apple Logo" });
});

app.get("/luck", (req, res) => {
  const num = Math.floor(Math.random() * 6 + 1);
  const luck = num === 1 ? '大吉' : num === 2 ? '中吉' : '小吉';
  console.log(`あなたの運勢は${luck}です`);
  res.render('luck', { number: num, luck: luck });
});

app.get("/janken", (req, res) => {
  const hand = req.query.hand;
  let win = Number(req.query.win) || 0;
  let total = Number(req.query.total) || 0;

  const cpuHand = ["グー", "チョキ", "パー"][Math.floor(Math.random() * 3)];
  const judgement = hand === cpuHand ? "引き分け" :
    (hand === "グー" && cpuHand === "チョキ") ||
    (hand === "チョキ" && cpuHand === "パー") ||
    (hand === "パー" && cpuHand === "グー") ? "勝ち" : "負け";

  if (judgement === "勝ち") win++;
  total++;

  res.render('janken', { your: hand, cpu: cpuHand, judgement, win, total });
});

app.get("/lottery", (req, res) => {
  const num = Math.floor(Math.random() * 10000 + 1);
  const item = num <= 100 ? '1等賞!おめでとう！' :
    num <= 1000 ? '2等賞!素晴らしい！' :
    num <= 5000 ? '3等賞!いいね！' : '4等賞!まぁまぁやね';

  res.render('lottery', { number: num, item });
});

app.get("/gatya", (req, res) => {
  const times = req.query.times === "10" ? 10 : 1;
  const results = Array.from({ length: times }, () => {
    const num = Math.floor(Math.random() * 10000 + 1);
    const item = num <= 100 ? '1等賞!おめでとう！' :
      num <= 1000 ? '2等賞!素晴らしい！' :
      num <= 5000 ? '3等賞!いいね！' : '4等賞!まぁまぁやね';
    return { number: num, item };
  });
  res.render('gatya', { results });
});

app.get("/get_test", (req, res) => {
  res.json({
    answer: 0
  })
});

app.get("/add", (req, res) => {
  console.log("GET");
  console.log( req.query );
  const num1 = Number( req.query.num1 );
  const num2 = Number( req.query.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

app.post("/add", (req, res) => {
  console.log("POST");
  console.log( req.body );
  const num1 = Number( req.body.num1 );
  const num2 = Number( req.body.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

// これより下はBBS関係
app.post("/check", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  res.json( {number: bbs.length });
});

app.post("/read", (req, res) => {
  const start = Number(req.body.start) || 0;
  const limit = Number(req.body.limit) || 100;

  const messages = bbs.slice(start, start + limit);
  res.json({ messages, total: bbs.length });
});

// GET /messages エンドポイント
//app.get("/messages", (req, res) => {
  //const messages = bbs.filter(msg => msg.name && msg.message); // 空データの除外
 // res.json({ total: messages.length, messages });
//});

app.post("/post", (req, res) => {
  const name = req.body.name || "名無し"; // デフォルト名
  const message = req.body.message || ""; // デフォルトメッセージ

  if (!message.trim()) {
    // メッセージが空の場合のエラーハンドリング
    return res.status(400).json({ error: "メッセージが空です。" });
  }

  const timestamp = new Date().toISOString(); // 現在時刻をISOフォーマットで取得
  const newMessage = { name, message, timestamp }; // 新しいメッセージオブジェクト

  bbs.push(newMessage); // 配列に追加
  res.json({ number: bbs.length });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));

