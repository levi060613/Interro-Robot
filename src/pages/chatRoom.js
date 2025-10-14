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
 // 引入用戶職位資訊
 import { sendInteractionEvent } from '../utils/positionAnalytics.js';
 
 
// 匯入文字格式化及打字機效果函式
import { formatReplyText, typeTextWithHTML } from '../utils/formatters.js';
// 匯入專案模態框創建函式
import { createProjectModal } from '../components_fn/projectDetail/modal.js';
// 匯入專案資料
import { projectCards } from '../utils/tempData.js';
import { fetchProjectDetailFromFirebase } from '../utils/fetchData.js';

// 創建專案按鈕的函數
function createProjectButton(projectId, buttonText) {
  const button = document.createElement('button');
  button.className = 'startButton';
  button.innerHTML = buttonText;
  // button.style.cssText = `
  //   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  //   color: white;
  //   border: none;
  //   padding: 12px 24px;
  //   border-radius: 25px;
  //   font-size: 14px;
  //   font-weight: 500;
  //   cursor: pointer;
  //   margin: 10px 0;
  //   transition: all 0.3s ease;
  //   box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  // `;
  
  // 添加懸停效果
  // button.addEventListener('mouseenter', () => {
  //   button.style.transform = 'translateY(-2px)';
  //   button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
  // });
  
  // button.addEventListener('mouseleave', () => {
  //   button.style.transform = 'translateY(0)';
  //   button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
  // });
  
  // 點擊事件處理
  button.addEventListener('click', async () => {
    try {
      const project = projectCards.find(p => p.document_id === projectId);
      if (!project) {
        console.error('找不到專案:', projectId);
        return;
      }
      
      // 發送 GA 事件：追踪聊天室中的项目按钮点击
      sendInteractionEvent('chatroom_project_button_click', {
        project_id: projectId,
        project_title: project.title,
        button_text: buttonText
      });
      console.log('[GA] 已發送聊天室項目按鈕點擊事件:', {
        project_id: projectId,
        project_title: project.title
      });
      
      // 在創建新 modal 之前，先清除已存在的 project-modal
      const existingModal = document.querySelector('.project-modal');
      if (existingModal) {
        console.log('[DEBUG] 發現已存在的 project-modal，正在清除');
        existingModal.remove();
      }
      
      // 同時清除可能存在的 modal-lookBtn
      const existingModalLookBtn = document.querySelector('.modal-lookBtn');
      if (existingModalLookBtn) {
        console.log('[DEBUG] 清除已存在的 modal-lookBtn');
        existingModalLookBtn.remove();
      }
      
      const modal = createProjectModal();
      
      // 從 Firebase 獲取詳細內容
      let projectDetail = null;
      try {
        projectDetail = await fetchProjectDetailFromFirebase(projectId);
      } catch (error) {
        console.error('從 Firebase 獲取專案詳情失敗:', error);
        // 使用本地資料作為備用
        const { projectDetail: localProjectDetail } = await import('../utils/tempData.js');
        projectDetail = localProjectDetail.find(detail => detail.document_id === projectId);
      }
      
      if (projectDetail) {
        modal.show({
          template: projectDetail.template || 'coming-soon',
          basicInfo: projectDetail.basicInfo || {
            title: project.title,
            subtitle: project.subtitle || '',
            tags: project.tags || []
          },
          content: projectDetail.content || projectDetail
        });
      }
    } catch (error) {
      console.error('顯示專案詳情失敗:', error);
    }
  });
  
  return button;
}

// 渲染分段式自我介紹的函數
async function renderIntroductionWithProjects(chatWindow) {
  // 第一段：基本介紹
  const introPart1 = `
嗨！歡迎你進來這個聊天室，接下來我們會模擬一個面試場合的互動。  
那在開始之前，先讓我簡單介紹一下自己吧！

### 👋 關於我 ###
我是 Levi，目前有 **一年的 UI/UX 設計經驗**。
> 曾在六角學院擔任協作UI設計師，負責根據學生的專案需求設計網站視覺與 UX 流程，並交付設計稿給工程師同學實作。`;

  // 第二段：自學開發
  const introPart2 = 
`### 🎯 設計強項 ###
- 擅長 **使用者研究** 與 **需求分析** ，能挖掘問題並提出對應設計方案
- 習慣 **從多方角度思考**，在使用者體驗與實作成本間找到平衡
- 熟練使用 Figma 製作 wireframe、UI 與 prototype，並能彈性配合專案時程
- 熟悉頁面結構與操作流程規劃，讓資訊更清晰易懂、利於團隊溝通`;
  // 第三段：個人專案
  const introPart3 = 
`### 🛠 自學開發的動機與進展 ###
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
> 專案目標是完整體驗一次從 0 到 1 的產品開發流程，包含使用者測試與數據分析，並作為我作品集中的代表作。`;

  // 渲染第一段
  const bubble1 = document.createElement('div');
  bubble1.className = 'chatBubble chatBubble--bot';
  const message1 = document.createElement('div');
  message1.className = 'chatBubbleMessage';
  typeTextWithHTML(formatReplyText(introPart1), message1, 100, 5);
  bubble1.appendChild(message1);
  chatWindow.appendChild(bubble1);
  
  // 待添加第一個專案按鈕，當六角學院專案更新後再補上按鈕（已補上）
  await new Promise(resolve => setTimeout(resolve, 1800));
  const button1 = createProjectButton('project_02', '查看六角學院 UI專題');
  const buttonContainer1 = document.createElement('div');
  buttonContainer1.className = 'project-button-container';
  buttonContainer1.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  `;
  buttonContainer1.appendChild(button1);
  chatWindow.appendChild(buttonContainer1);
  
  // 立即渲染第二段（立即顯示，無打字機效果）
  const bubble2 = document.createElement('div');
  bubble2.className = 'chatBubble chatBubble--bot';
  const message2 = document.createElement('div');
  message2.className = 'chatBubbleMessage';
  message2.style.minHeight = '100px';
  message2.innerHTML = formatReplyText(introPart2);
  bubble2.appendChild(message2);
  chatWindow.appendChild(bubble2);
  
  // 待添加第二個專案按鈕，當hahow專案更新後再補上按鈕（先不補上）
  // const button2 = createProjectButton('project_03', '查看 Hahow UX專案');
  // const buttonContainer2 = document.createElement('div');
  // buttonContainer2.className = 'project-button-container';
  // buttonContainer2.style.cssText = `
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   width: 100%;
  // `;
  // buttonContainer2.appendChild(button2);
  // chatWindow.appendChild(buttonContainer2);
  
  // 渲染第三段（立即顯示，無打字機效果）
  const bubble3 = document.createElement('div');
  bubble3.className = 'chatBubble chatBubble--bot';
  const message3 = document.createElement('div');
  message3.className = 'chatBubbleMessage';
  message3.innerHTML = formatReplyText(introPart3);
  bubble3.appendChild(message3);
  chatWindow.appendChild(bubble3);
  
  // 立即添加第三個專案按鈕
  const button3 = createProjectButton('project_01', '查看 模擬面試網站專案');
  const buttonContainer3 = document.createElement('div');
  buttonContainer3.className = 'project-button-container';
  buttonContainer3.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 72px;
  `;
  buttonContainer3.appendChild(button3);
  chatWindow.appendChild(buttonContainer3);
}

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
  const chatOptionPanelContainer = document.createElement('div');
  chatOptionPanelContainer.className = 'chatOptionPanel';

  // 將聊天室與輸入面板依序放進新的頁面內容容器中
  pageContentContainer.appendChild(chatWindow);
  pageContentContainer.appendChild(chatOptionPanelContainer);

  // ========= 非同步載入輸入面板 HTML 並初始化互動邏輯 =========
  try {
    // 從外部載入 chatOptionPanel 的 HTML 模板（通常包含輸入欄與 suggestions 容器）
    const response = await fetch('src/components_fn/chatOptionPanel/chatOptionPanel.html');
    const html = await response.text();
    chatOptionPanelContainer.innerHTML = html;
    // 等待下一畫面更新循環再執行初始化，確保 DOM 元素已完全插入
    requestAnimationFrame(async () => {
    
      // 1. 載入聊天歷史紀錄並渲染到聊天室泡泡中
      const history = await loadChatHistory();
      renderChatHistory(chatWindow, history);

      // 2. 檢查是否為從問題點擊進入的聊天室
      const isFromQuestionClick = sessionStorage.getItem('fromQuestionClick') === 'true';
      console.log('[DEBUG] 是否從問題點擊進入:', isFromQuestionClick);

      // 3. 如果是從問題點擊進入，檢查是否顯示過自我介紹，再決定按鈕狀態
      if (isFromQuestionClick) {
        console.log('[DEBUG] 從問題點擊進入，檢查是否顯示過自我介紹');
        
        // 檢查是否已經顯示過自我介紹
        const hasShownIntroduction = history.some(msg => 
          msg.sender === 'bot' && 
          typeof msg.text === 'string' && 
          msg.text.includes('嗨！歡迎你進來這個聊天室')
        );
        
        if (!hasShownIntroduction) {
          console.log('[DEBUG] 未顯示過自我介紹，預先設置 introductionButton');
          
          // 找到按鈕元素並預先設置狀態
          const introductionButton = chatOptionPanelContainer.querySelector('#introductionButton');
          const switchButton = chatOptionPanelContainer.querySelector('#switchButton');
          
          if (introductionButton && switchButton) {
            introductionButton.style.display = 'block';
            switchButton.style.display = 'none';
            console.log('[DEBUG] 按鈕狀態已預先設置');
          }
        } else {
          console.log('[DEBUG] 已經顯示過自我介紹，保持 switchButton 顯示');
          // 已經顯示過自我介紹，不需要顯示 introductionButton
          // 清除標記，避免 chatOptionPanel 重複處理
          sessionStorage.removeItem('fromQuestionClick');
        }
      }

      // 4. 如果是第一次進入聊天室（歷史紀錄為空）且不是從問題點擊進入，顯示分段式自我介紹
      if (history.length === 0 && !isFromQuestionClick){
        // 使用新的分段式自我介紹渲染函數
        await renderIntroductionWithProjects(chatWindow);
        
        // 將完整的自我介紹內容儲存到快取中（用於歷史記錄）
        //當這兩個更新完畢後再補上文字： > 六角學院 專題UI｜RWD設計 / Hahow 線上課程平台｜情感化體驗設計
        const fullIntroductionText = `
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
^^💡 若想進一步瞭解，可前往專案列表 > Interro 模擬面試機器人｜互動式網站^^
`;
        // 將完整的自我介紹儲存為 bot 訊息到快取
        await saveMessage(fullIntroductionText, 'bot');
      }

      // 5. 檢查是否有待顯示的問題訊息
      const pendingQuestionData = sessionStorage.getItem('pendingQuestionData');
      if (pendingQuestionData && isFromQuestionClick) {
        try {
          const questionData = JSON.parse(pendingQuestionData);
          console.log('[DEBUG] 發現待顯示的問題訊息:', questionData);
          
          // 顯示問題訊息
          await showPendingQuestionMessage(questionData, chatWindow);
          
          // 清除待顯示的問題數據
          sessionStorage.removeItem('pendingQuestionData');
          console.log('[DEBUG] 問題訊息已顯示，數據已清除');
        } catch (error) {
          console.error('[DEBUG] 顯示問題訊息失敗:', error);
          // 清除無效的數據
          sessionStorage.removeItem('pendingQuestionData');
        }
      }

      // 6. 從問題點擊進入的邏輯現在由 chatOptionPanel 處理
      // 不再需要在這裡處理，因為 chatOptionPanel 會自動檢測並顯示 introductionButton

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

// ========== 顯示待顯示問題訊息的函數 ==========
async function showPendingQuestionMessage(questionData, chatWindow) {
  try {
    // 導入必要的函數
    const { saveMessage } = await import('../utils/chatState.js');
    const { formatReplyText, typeTextWithHTML } = await import('../utils/formatters.js');
    
    console.log('[DEBUG] 開始顯示問題訊息');
    
    // 保存用戶訊息到快取
    await saveMessage(questionData.text, 'user');
    console.log('[DEBUG] 用戶訊息已保存');
    
    // 保存 bot 回覆到快取
    await saveMessage(questionData.reply, 'bot');
    console.log('[DEBUG] Bot 回覆已保存');
    
    // 創建並添加用戶訊息泡泡
    const userBubbleWrapper = document.createElement('div');
    userBubbleWrapper.className = 'chatBubble chatBubble--user';
    const userMessage = document.createElement('div');
    userMessage.className = 'chatBubbleMessage';
    userMessage.innerHTML = formatReplyText(questionData.text);
    userBubbleWrapper.appendChild(userMessage);
    chatWindow.appendChild(userBubbleWrapper);
    console.log('[DEBUG] 用戶訊息泡泡已添加');
    
    // 創建並添加 bot 訊息泡泡（使用打字機效果）
    const botBubbleWrapper = document.createElement('div');
    botBubbleWrapper.className = 'chatBubble chatBubble--bot';
    const botMessage = document.createElement('div');
    botMessage.className = 'chatBubbleMessage';
    typeTextWithHTML(formatReplyText(questionData.reply), botMessage, 100, 5);
    botBubbleWrapper.appendChild(botMessage);
    chatWindow.appendChild(botBubbleWrapper);
    console.log('[DEBUG] Bot 訊息泡泡已添加');
    
    // 滾動到聊天室底部顯示最新訊息
    chatWindow.scrollTop = chatWindow.scrollHeight;
    console.log('[DEBUG] 聊天室已滾動到底部');
    console.log('[DEBUG] 問題訊息已成功顯示');
    
  } catch (error) {
    console.error('[DEBUG] 顯示問題訊息時發生錯誤:', error);
    throw error;
  }
}
 
 
 
 