// chatRoom.js
// 匯入與聊天室狀態管理相關的工具函式
import {
  loadChatHistory,        // 載入快取中的聊天紀錄（sessionStorage / localStorage）
  renderChatHistory,      // 將載入的歷史紀錄渲染成訊息泡泡加入聊天室
  saveMessage,            // 將新訊息儲存到快取中
  saveMessageWithButton,  // 儲存帶按鈕的訊息
  showIntroductionMessage, // 顯示自我介紹訊息
 } from '../utils/chatState.js';
 // 匯入建議資料（初始選項與延伸問題題庫）
 import { fetchOptions, fetchQuestions, fetchQuestionsByIds } from '../utils/fetchData.js';
 // 匯入對話選項面板的初始化邏輯
 import initChatOptionPanel from '../components_fn/chatOptionPanel/chatOptionPanel.js';
 
 
 // 匯入文字格式化及打字機效果函式
 import { formatReplyText, typeTextWithHTML } from '../utils/formatters.js';
 // 渲染聊天室頁面主函式（供 SPA 路由系統載入）
 export default async function renderChatRoomPage() {
  // ========= 建立聊天室畫面主要容器區塊 =========

  // 創建一個新的容器來裝載頁面內容
  const pageContentContainer = document.createElement("div");
  pageContentContainer.className = "chatRoomContent"; // 可以給一個新的 class 方便樣式控制

  // 建立聊天室視窗（顯示訊息泡泡的區域）
  const chatWindow = document.createElement("div");
  chatWindow.className = "chatWindow";
  chatWindow.id = "chatWindow";

  // 建立輸入面板容器（裝載輸入欄與建議選項）
  const chatInputPanel = document.createElement('div');
  chatInputPanel.className = 'chatOptionPanel';

  // 將聊天室與輸入面板依序放進新的頁面內容容器中
  pageContentContainer.appendChild(chatWindow);
  pageContentContainer.appendChild(chatInputPanel);

  // ========= 非同步載入輸入面板 HTML 並初始化互動邏輯 =========
  try {
    // 從外部載入 chatInputPanel 的 HTML 模板（通常包含輸入欄與 suggestions 容器）
    const response = await fetch('src/components_fn/chatOptionPanel/chatOptionPanel.html');
    const html = await response.text();
    chatInputPanel.innerHTML = html;
    // 等待下一畫面更新循環再執行初始化，確保 DOM 元素已完全插入
    requestAnimationFrame(async () => {
    
      // 1. 載入聊天歷史紀錄並渲染到聊天室泡泡中
      const history = await loadChatHistory();
      renderChatHistory(chatWindow, history);

      // 2. 檢查是否為從問題點擊進入的聊天室
      const isFromQuestionClick = sessionStorage.getItem('fromQuestionClick') === 'true';
      console.log('[DEBUG] 是否從問題點擊進入:', isFromQuestionClick);

      // 3. 如果是第一次進入聊天室（歷史紀錄為空）且不是從問題點擊進入，顯示引導語句
      if (history.length === 0 && !isFromQuestionClick){
        // 取得引導語句資料
        // 直接定義引導語句文字，不再從 fetchIntroductionInfo 獲取
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
        // 確認資料存在且為字串格式
        if (introductionInfo && typeof introductionInfo === 'string'){
          // 將引導語句儲存為 bot 訊息到快取
          await saveMessage(introductionInfo,'bot');
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
        } else {
          // 若引導語句為空或格式錯誤，發出警告
          console.warn('introduction info 為空，未顯示');
        }
      }

      // 4. 如果是從問題點擊進入的，4秒後顯示帶按鈕的訊息
      if (isFromQuestionClick) {
        console.log('[DEBUG] 從問題點擊進入，4秒後顯示帶按鈕的訊息');
        setTimeout(async () => {
          // 檢查是否已經顯示過自我介紹
          const hasShownIntroduction = history.some(msg => 
            msg.sender === 'bot' && 
            typeof msg.text === 'string' && 
            msg.text.includes('嗨！歡迎你進來這個聊天室')
          );
          
          if (hasShownIntroduction) {
            console.log('[DEBUG] 已經顯示過自我介紹，跳過顯示按鈕訊息');
            return;
          }
          
          // 儲存帶按鈕的訊息
          await saveMessageWithButton(
            '想了解一下設計師嗎？', 
            '顯示介紹', 
            'showIntroduction'
          );
          
          // 創建並顯示帶按鈕的訊息泡泡
          const bubbleWrapper = document.createElement('div');
          bubbleWrapper.className = 'chatBubble chatBubble--bot';
          const message = document.createElement('div');
          message.className = 'chatBubbleMessage chatBubbleMessage--extraMessage';
          
          // 顯示文字
          message.innerHTML = formatReplyText('想了解一下設計師嗎？');
          
          // 創建按鈕容器
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'chatBubbleMessage__buttonContainer';
          
          // 創建按鈕
          const button = document.createElement('button');
          button.className = 'chatBubbleMessage__button primaryButton--fill';
          button.textContent = '顯示介紹';
          button.onclick = () => {
            console.log('[DEBUG] 顯示介紹按鈕被點擊');
            showIntroductionMessage(chatWindow);
          };
          
          // 將按鈕添加到容器中
          buttonContainer.appendChild(button);
          message.appendChild(buttonContainer);
          bubbleWrapper.appendChild(message);
          chatWindow.appendChild(bubbleWrapper);
          
          // 滾動到聊天室底部顯示最新訊息
          chatWindow.scrollTop = chatWindow.scrollHeight;
          
          console.log('[DEBUG] 帶按鈕的訊息已顯示');
        }, 4000); // 4秒後顯示
        
        // 清除標記，避免重複觸發
        sessionStorage.removeItem('fromQuestionClick');
      }

      // 🚀 新增這兩行：取得建議資料並初始化面板
      const options = await fetchOptions();          // Step 1 選項
      await fetchQuestions();                        // 預先抓 questions 資料，供後續查詢

      initChatOptionPanel(options);                  // 初始化面板與互動
    });
  } catch (err) {
    // 若 HTML 載入失敗，顯示錯誤訊息於 console
    console.error('載入 InputPanel 失敗：', err);
  }
  // 回傳新的頁面 DOM 元素，供 SPA 載入顯示
  return pageContentContainer; // 回傳 pageContentContainer
 }
 
 
 
 