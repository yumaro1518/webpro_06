"use strict";

const bbs = document.querySelector('#bbs');
const totalMessagesElement = document.createElement('div');
totalMessagesElement.className = 'total-messages';
document.body.appendChild(totalMessagesElement);

document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value.trim();
    const message = document.querySelector('#message').value.trim();

    if (!name || !message) {
        alert("名前とメッセージを入力してください！");
        return;
    }

    const params = {
        method: "POST",
        body: `name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    fetch('/post', params)
        .then(response => {
            if (!response.ok) throw new Error('投稿に失敗しました');
            return response.json();
        })
        .then(() => {
            document.querySelector('#name').value = "";
            document.querySelector('#message').value = "";
            alert("投稿が完了しました！");
            loadMessages();  // 新しい投稿後にメッセージを再読み込み
        })
        .catch(error => alert(error.message));
});

document.addEventListener('DOMContentLoaded', () => {
    const themeMenu = document.querySelector('#theme-menu');
    
    // デフォルトテーマを設定
    document.body.classList.add('default-theme');

    themeMenu.addEventListener('change', (event) => {
        // すべてのテーマクラスを削除
        document.body.className = '';
        
        // 選択されたテーマを適用
        const selectedTheme = event.target.value + '-theme';
        document.body.classList.add(selectedTheme);
    });

    // 初回メッセージロード
    loadMessages();
});

function loadMessages() {
    const params = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    };

    fetch("/read", params)
        .then(response => response.json())
        .then(data => {
            displayMessages(data.messages);
            displayTotalMessages(data.total);
        })
        .catch(error => alert(error.message));
}

function displayMessages(messages) {
    bbs.innerHTML = ""; // 初期化
    messages.forEach(mes => {
        const cover = document.createElement('div');
        cover.className = 'cover';

        const name = document.createElement('span');
        name.className = 'name';
        name.innerText = mes.name;

        const message = document.createElement('span');
        message.className = 'mes';
        message.innerText = mes.message;

        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.innerText = new Date(mes.timestamp).toLocaleString(); // 時刻をフォーマット

        cover.appendChild(name);
        cover.appendChild(message);
        cover.appendChild(timestamp);
        bbs.appendChild(cover);
    });
}

function displayTotalMessages(total) {
    totalMessagesElement.innerText = `全投稿件数: ${total}`;
}

function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'  // スムーズにスクロール
    });
}

function scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'  // スムーズにスクロール
    });
}