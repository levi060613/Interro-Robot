// utils/chatState.js

import { formatReplyText } from "./formatters.js";

// ========== 聊天狀態快取用的變數 ==========
let chatHistory = [];                  // 儲存聊天訊息泡泡（依序排列）
let clickedOptions = new Set();        // 使用者已點擊的初始建議選項（用文字區分）
let clickedQuestionIds = new Set();    // 已經『點擊過』的延伸問題 ID（避免重複）

// 頁面初始化時還原快取資料
const cachedOptions = sessionStorage.getItem('clickedOptions');
if (cachedOptions) {
  clickedOptions = new Set(JSON.parse(cachedOptions));
}

const cachedClickedQuestions = sessionStorage.getItem('clickedQuestionIds');
if (cachedClickedQuestions) {
  clickedQuestionIds = new Set(JSON.parse(cachedClickedQuestions));
}


/* ========== 聊天訊息管理 ========== */

// 儲存一筆訊息（加入陣列並快取進 sessionStorage）
// sender 預設為 'user'，表示使用者發送的訊息
export async function saveMessage(text, sender = 'user') {
  const msg = { text, sender };
  chatHistory.push(msg);
  sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// 載入聊天歷史紀錄
export async function loadChatHistory() {
  const cached = sessionStorage.getItem('chatHistory');
  if (cached) {
    chatHistory = JSON.parse(cached);
  }
  return chatHistory;
}

// 清除所有聊天資料
export function clearChatHistory() {
  chatHistory = [];
  clickedOptions.clear();
  clickedQuestionIds.clear();
  sessionStorage.removeItem('chatHistory');
  sessionStorage.removeItem('clickedOptions');
  sessionStorage.removeItem('clickedQuestionIds');
}


/* ========== 點擊選項紀錄（初始建議 options） ========== */

export function markOptionClicked(text) {
  clickedOptions.add(text);
  sessionStorage.setItem('clickedOptions', JSON.stringify([...clickedOptions]));
}

export function getClickedOptions() {
  return clickedOptions;
}


/* ========== 已點擊問題紀錄（延伸問題 questions） ========== */

export function markQuestionClicked(id) {
  clickedQuestionIds.add(id);
  sessionStorage.setItem('clickedQuestionIds', JSON.stringify([...clickedQuestionIds]));
}

export function getClickedQuestionIds() {
  return clickedQuestionIds;
}


/* ========== 渲染聊天泡泡到畫面上 ========== */

export function renderChatHistory(chatWindow, history) {
  history.forEach(msg => {
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.className = `chatBubble chatBubble--${msg.sender}`;

    const message = document.createElement('div');
    message.className = 'chatBubbleMessage';

    if (msg.sender === 'bot') {
      // 检查是否是带有按钮的消息
      if (typeof msg.text === 'object' && msg.text.hasButton) {
        // 显示文本
        message.innerHTML = formatReplyText(msg.text.text);
        
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'chatBubbleMessage__buttonContainer';

        // 创建按钮
        const button = document.createElement('button');
        button.className = 'chatBubbleMessage__button';
        button.textContent = msg.text.buttonText;
        button.onclick = () => {
          console.log('按钮被点击');
          window.location.href = msg.text.buttonLink;
        };

        // 将按钮添加到容器中
        buttonContainer.appendChild(button);
        message.appendChild(buttonContainer);
      } else {
        // 普通消息
        message.innerHTML = formatReplyText(msg.text);
      }
    } else {
      message.innerHTML = formatReplyText(msg.text);
    }

    bubbleWrapper.appendChild(message);
    chatWindow.appendChild(bubbleWrapper);
  });
  
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
