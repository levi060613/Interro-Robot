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

// 儲存帶按鈕的訊息
export async function saveMessageWithButton(text, buttonText, buttonAction, sender = 'bot') {
  const msg = { 
    text: { 
      text, 
      buttonText, 
      buttonAction,
      hasButton: true 
    }, 
    sender 
  };
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
        
        // 為帶按鈕的訊息添加 extraMessage 樣式
        message.classList.add('chatBubbleMessage--extraMessage');
        
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'chatBubbleMessage__buttonContainer';

        // 创建按钮
        const button = document.createElement('button');
        button.className = 'chatBubbleMessage__button primaryButton--fill';
        button.textContent = msg.text.buttonText;
        button.onclick = () => {
          console.log('按钮被点击');
          // 执行按钮动作
          if (msg.text.buttonAction === 'showIntroduction') {
            showIntroductionMessage(chatWindow);
          }
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

// 顯示自我介紹訊息的函數
export async function showIntroductionMessage(chatWindow) {
  const { saveMessage } = await import('./chatState.js');
  const { formatReplyText, typeTextWithHTML } = await import('./formatters.js');
  
  const introductionInfo = `
嗨！歡迎你進來這個聊天室，接下來我們會模擬一個面試場合的互動。  
那在開始之前，先讓我簡單介紹一下自己吧！

### 👋 關於我 ###
我是 Levi，目前有 **一年的 UI/UX 設計經驗**。
> 曾在六角學院擔任協作UI設計師，負責根據學生的專案需求設計網站視覺與 UX 流程，並交付設計稿給工程師同學實作。
### 🎯 設計強項 ###
- 擅長 **使用者研究** 與 **需求分析** ，能挖掘問題並提出對應設計方案
- 習慣 **從多方角度思考**，在使用者體驗與實作成本間找到平衡
- 熟練使用 Figma 製作 wireframe、UI 與 prototype，並能彈性配合專案時程
- 熟悉頁面結構與操作流程規劃，讓資訊更清晰易懂、利於團隊溝通

### 🛠 自學開發的動機與進展 ###
目前也在**自學前端開發（以切版為主）**，希望能進一步理解開發與設計的接軌，探索更多優化 UX 體驗的方式。
目前已能處理：
- HTML/CSS 切版
- JavaScript 基本元件化操作

### 🚀 進行中的個人專案 ###
我正在開發一個互動式的 **模擬面試聊天網站** （目前已進入上線階段），
希望透過這個專案，讓我整合：
- 用戶研究分析的能力
- UI 設計
- 前端開發實作
- 後續數據測試、迭代優化
> 專案目標是完整體驗一次從 0 到 1 的產品開發流程，包含使用者測試與數據分析，並作為我作品集中的代表作。
`;

  // 將引導語句儲存為 bot 訊息到快取
  await saveMessage(introductionInfo, 'bot');
  
  // 在聊天室中建立並顯示 bot 訊息泡泡（使用打字機效果）
  const bubbleWrapper = document.createElement('div');
  bubbleWrapper.className = 'chatBubble chatBubble--bot';
  const message = document.createElement('div');
  message.className = 'chatBubbleMessage';
  
  // 格式化文字後，以打字機效果顯示在訊息區
  typeTextWithHTML(formatReplyText(introductionInfo), message, 100, 5);
  bubbleWrapper.appendChild(message);
  chatWindow.appendChild(bubbleWrapper);
  
  // 滾動到聊天室底部顯示最新訊息
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
