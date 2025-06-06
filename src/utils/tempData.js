// tempData.js

// 專案列表數據
export const projects = [
  {
    year: "2025.04",
    title: "Interro 模擬面試機器人｜互動式網站",
    subtitle: "“不是展示作品，而是設計給面試官的產品。”",
    description: "反轉傳統作品集展示方式，設計對話式體驗流程，引導面試官一步步探索我的角色與價值。",
    tags: ["0到1設計", "開發上線", "聊天機器人"],
    img: "src/assets/images/Interro_2_1_@1x.png",
    template: "interro-project",
    content: {
      carousel: {
        items: [
          {
            type: "image",
            src: "src/assets/images/Interro_2_1_@1x.png",
            caption: "首頁設計"
          },
          {
            type: "image",
            src: "src/assets/images/Interro-chat_2_1_@1x.png",
            caption: "聊天室介面"
          },
          {
            type: "image",
            src: "src/assets/images/Interro-timeline_2_1_@1x.png",
            caption: "專案時間軸介面"
          },
          {
            type: "image",
            src: "src/assets/images/Interro-project_2_1_@1x.png",
            caption: "個別專案介面"
          }
        ]
      },
      sections: [
        {
          type: "header",
          title: "✨ Interro：一場讓面試官不用開口的模擬面試"
        },
        {
          type: "table",
          headers: ["類型", "角色", "技術", "成果"],
          rows: [
            ["個人主動設計專案（作品集互動體驗）", "UI/UX 設計師、前端開發", "原生 HTML / CSS / JS、SCSS 模組、Firebase", "上線網站，透過 GA 分析互動轉換行為"]
          ]
        },
        {
          type: "text",
          content: `
            <h3>🧠 這是什麼作品？它解決什麼問題？</h3>
            <p>這是一個互動式作品集網站，<strong>模擬面試對話的形式</strong>，引導訪客一步步探索我<h>作為 UI/UX 設計師的能力與特質</h>。<br>它的核心目的，是解決面試官在短時間內無法快速理解設計師價值的問題。</p>
            <p>透過導引式對話，幫助使用者依照自己的需求提問、探索不同面向的資訊，<br>讓<h>「閱讀作品集」的過程像一次有節奏的交流，而不只是單方面的資訊堆疊</h>。</p>`,
          image:{
            src: "src/assets/images/Interro_2_1_@1x.png",
            caption: "對話流程設計"
          }
        },
        {
          type: "text",
          content: `
            <h3>💡 為什麼我要做這個？動機與思考</h3>
            <p>在設計這個作品集前，我思考一個根本問題：</p>
            <blockquote>面試官真正需要什麼？他們會怎麼使用一份作品集？</blockquote>
            <p>我從訪談與網路資料中整理出幾個痛點：</p>
            <ul>
              <li>沒時間細看完整作品，卻想知道設計師的「解題能力」與「角色貢獻」</li>
              <li>需要快速理解對方擅長什麼、能解決什麼問題</li>
              <li>常見作品集過度包裝成果，卻缺乏清晰邏輯與過程脈絡</li>
            </ul>
          `,
          image:{
            src: "src/assets/images/Interro_2_1_@1x.png",
            caption: "用戶研究與需求分析"
          }
        },
        {
          type: "text",
          content: `
            <h3>🛠 我的角色與實作內容</h3>
            <p>這是一個從 0 開始的個人專案，所有設計與開發皆由我獨立完成。</p>
            <h4>✏️ 設計層面</h4>
            <ul>
              <li>以<strong>面試者的探索流程</strong>為主軸，設計出多分支對話樹與互動邏輯</li>
              <li>透過問卷、使用者回饋與內容卡片設計，不斷微調訊息層級與導引方式</li>
              <li>建立清晰的模組化資訊結構，對應真實面試常見問題</li>
            </ul>
            <h4>🧩 技術與架構</h4>
            <ul>
              <li>使用原生 HTML / SCSS / JS 製作</li>
              <li>採用 SPA 架構，實作自訂 Router 與互動快取（sessionStorage）</li>
              <li>以 Firebase 作為資料後台，讓對話內容與建議選項可以動態更新</li>
              <li>自行整合 GA 分析事件，追蹤互動熱點與使用流程，驗證體驗假設</li>
            </ul>
          `,
          image:{
            src: "src/assets/images/Interro_2_1_@1x.png",
            caption: "技術架構圖"
          }
        },
        {
          type: "text",
          content: `
            <h3>🔁 我做過哪些重要決策？又如何驗證？</h3>
            <h4>1. 資訊設計：模擬「逐步探索」的面試節奏</h4>
            <p>傳統作品集資訊堆疊不易閱讀，我將內容打散成對話節點，每個問題對應一段設計或經歷的回答，
            並設計標籤與導引選項，讓訪客可依據興趣選擇要繼續追問還是探索其他主題。</p>
            <h4>2. 資料結構：從內容設計出發建後台</h4>
            <p>不是先做功能再填資料，而是先從面試官想問什麼開始設計，再反推資料結構。
            我規劃出「問題－回答－延伸選項」三層關係，並搭配 Firebase 架構對應管理，讓之後能快速擴充內容。</p>
            <h4>3. 驗證機制：從體驗假設到數據追蹤</h4>
            <p>我假設：如果設計有效，引導互動應該能降低跳出、提高深度探索。
            因此在對話每一步都埋設 GA 事件，觀察使用者停留在哪些段落、是否有完成導覽、是否點擊延伸介紹或履歷。</p>
          `,
          image:{
            src: "src/assets/images/Interro_2_1_@1x.png",
            caption: "GA 數據分析"
          }
        },
        {
          type: "text",
          content: `
            <h3>📅 專案進度規劃與測試階段</h3>
            <p>這個專案從「需求假設」出發，分成三個主要階段進行：</p>
            <ol>
              <li><strong>設計規劃階段</strong>
                <ul>
                  <li>定義目標使用者（面試官）、建立對話架構與資訊模組</li>
                  <li>草擬互動邏輯與初版原型，並與設計前輩訪談驗證方向</li>
                </ul>
              </li>
              <li><strong>前端開發與內容撰寫階段</strong>
                <ul>
                  <li>同步進行 UI 實作與資訊內容撰寫，確保語氣一致、結構清晰</li>
                  <li>完成 SPA 架構、自訂 router、Firebase 串接與 GA 事件追蹤</li>
                </ul>
              </li>
              <li><strong>上線測試與回饋優化階段（目前）</strong>
                <ul>
                  <li>網站已正式上線，進入針對目標用戶（HR / 面試主管）進行測試的階段</li>
                  <li>透過使用者訪談與 GA 數據追蹤，分析互動流程與資訊理解程度，持續優化語句、節點與建議選項</li>
                </ul>
              </li>
            </ol>
          `
        },
        {
          type: "text",
          content: `
            <h3>📈 收穫與學習</h3>
            <p>這個專案是我第一次把「作品集」當作「產品」來設計。</p>
            <p>我不再只是展示過去做過什麼，而是以一位設計師的角色，從「目標用戶」的角度出發，
            設計資訊架構、互動流程與視覺表現，並實作、上線、分析數據、進行測試與調整。</p>
            <p>在這個過程中，我學會如何把模糊的設計思維具體化為可用的產品，也更有信心面對跨部門溝通與產品開發的實務挑戰。</p>
          `
        },
        {
          type: "text",
          content: `
            <h3>🎯 我希望面試官一眼看見什麼？</h3>
            <p>不是視覺風格，也不是技術堆疊，而是：</p>
            <blockquote>我能觀察需求、理解痛點、設計解法，並親手把它做出來。</blockquote>
            <p>這個網站不只是作品集，更是我作為 UI/UX 設計師的角色縮影。</p>
          `
        }
      ]
    }
  },
  {
    year: "2024.11",
    title: "Hahow 線上課程平台｜情感化體驗設計",
    subtitle: "“設計不只要做得好看，還要讓人願意持續使用。”",
    description: "我們挑戰的不是操作流程，而是學生的學習動力。透過問題拆解和團隊協作，打造具互動、情感化的系統性改版。",
    tags: ["問題拆解", "產品再設計", "榮獲Top 3"],
    img: "src/assets/images/hahow_2_1_@3x.png",
    template: "hahow-project",
    content: {
      table: {
        headers: ["問題", "分析", "解決方案"],
        rows: [
          ["用戶流失率高", "課程頁面資訊過多，用戶難以快速找到所需資訊", "重新設計資訊架構，突出重要內容"],
          ["轉換率低", "購買流程複雜，需要多步驟完成", "簡化購買流程，減少必要步驟"],
          ["用戶反饋不佳", "介面設計過時，不符合現代審美", "更新視覺設計，提升整體質感"]
        ]
      },
      carousel: {
        items: [
          {
            type: "image",
            src: "src/assets/images/hahow_2_1_@3x.png",
            caption: "首頁改版前後對比"
          },
          {
            type: "image",
            src: "src/assets/images/interro_2_1_@1x.png",
            caption: "課程頁面優化"
          },
          {
            type: "image",
            src: "src/assets/images/六角專案_2_1_@3x.png",
            caption: "購買流程簡化"
          }
        ]
      }
    }
  },
  {
    year: "2024.08",
    title: "六角學院 專題UI｜RWD設計",
    subtitle: "接案性質",
    description: "・了解學生需求的風格，轉化為視覺UI<br>・交稿主視覺設計 ＋ RWD畫面 + Guideline<br>・與對方溝通、並按需求調整設計稿<br>・與對方確定好主視覺後，延續風格設計其他頁面<br>",
    tags: ["RWD設計", "工程交付", "設計系統"],
    img: "src/assets/images/六角專案_2_1_@3x.png",
    template: "interro-project",
    content: {
      carousel: {
        items: [
          {
            type: "image",
            src: "src/assets/images/Interro_2_1_@1x.png",
            caption: "首頁設計"
          },
          {
            type: "image",
            src: "src/assets/images/Interro-chat_2_1_@1x.png",
            caption: "聊天室介面"
          },
          {
            type: "image",
            src: "src/assets/images/Interro-timeline_2_1_@1x.png",
            caption: "專案時間軸介面"
          },
          {
            type: "image",
            src: "src/assets/images/Interro-project_2_1_@1x.png",
            caption: "個別專案介面"
          }
        ]
      },
      text: `
        <h3>設計系統</h3>
        <p>建立了一套完整的設計系統，包括：</p>
        <ul>
          <li>色彩系統：定義主色、輔色和功能色</li>
          <li>字體系統：建立標題和內文的字體層級</li>
          <li>間距系統：統一的間距規範</li>
          <li>組件庫：可重用的UI組件</li>
        </ul>
      `
    }
  },
  {
    year: "2024.7",
    title: "京都散策 APP",
    subtitle: "旅遊應用",
    description: "為日本京都旅遊設計的移動應用，整合了景點導覽、行程規劃和本地文化體驗等功能。",
    tags: ["0到1設計", "產品定位", "實戰營 佳作"],
    img: "src/assets/images/hahow_2_1_@3x.png",
    template: "coming-soon",
    content: {
      images: [
        {
          src: "src/assets/images/kyoto_1_@3x.png",
          caption: "主頁設計"
        },
        {
          src: "src/assets/images/kyoto_2_@3x.png",
          caption: "景點詳情頁"
        }
      ],
      text: `
        <h3>功能特點</h3>
        <ul>
          <li>景點導覽：提供詳細的景點資訊和歷史背景</li>
          <li>行程規劃：根據用戶偏好推薦最佳路線</li>
          <li>文化體驗：整合當地特色活動和體驗</li>
        </ul>
      `
    }
  },
  {
    year: "2024.11",
    title: "Ｅ起購APP｜為您處理團購大小事",
    subtitle: "全端專案",
    description: "從零開始設計和開發的響應式網站，通過數據分析和用戶測試持續優化產品體驗。",
    tags: ["0到1設計", "上線專案", "測試數據分析"],
    img: "src/assets/images/hahow_2_1_@3x.png",
    template: "coming-soon",
    content: {
      sections: [
        {
          type: "text",
          content: `
            <h3>專案內容即將更新</h3>
            <p>這個專案的詳細內容正在整理中，敬請期待！</p>
          `
        }
      ]
    }
  }
];

// suggestionItem 預設初始的三個選項
export const options = [
  {
    text: "你可以做一下自我介紹嗎？",
    reply: `當然沒問題！大家可以叫我Levi，\n
    我目前有 1 年的 UI/UX 設計經驗，過去在六角學院擔任協作的 UI 設計師，
    聆聽學生的需求設計網站視覺、檢視 UX 流程，並產出設計稿交付給工程師學生開發。\n
    我熟悉 Figma 與 Prototype 操作，其中也特別擅長 * UX 思維* 與 *跨角色溝通* 。\n
    在過去參與的團體競賽中，也常擔任組長角色，協調團隊分工與管理專案時程。\n
    近期我則開始學習前端開發，能進行基本的 HTML/CSS 切版，並能使用 JavaScript 處理簡單的互動功能。\n
    目前已經上線了一個 SPA 網站專案，是由我從用戶研究到發想設計、開發測試，\n
    獨自完成的一個模擬面試互動的個人作品集，嘗試結合我的 UIUX 設計與專案實作能力。`,
    questions_id: ["q001", "q002", "q003"]
  },
  {
    text: "你平常設計會用哪些工具？你們團隊是怎麼協作的？",
    reply: `
    我主要使用 Figma 進行 UI 設計與原型製作，前期則會視需求透過手繪或 Figma 繪製線稿，與團隊快速溝通對齊初步想法。\n
    過去參與團隊競賽時，由於賽程限制，為求短時間內需完成整體專案，我們多採用敏捷式流程，\n
    先定義 MVP 快速建立雛形，並根據使用者回饋持續調整設計方向，確保最終成果貼近使用需求並具備可執行性。`,
    questions_id: ["q004", "q005", "q006"]
  },
  {
    text: "可以分享一下你最近參與的專案嗎？你擔任的角色是？",
    reply: `
    最近我完成了一個以模擬面試為主題的 SPA 互動網站，這是我個人獨立設計與開發的作品集專案。\n
    我在專案中負責整體的 UX 規劃、介面設計與前端開發，目的是讓使用者透過點選選項進行模擬對話，快速了解我的工作背景與能力。\n
    設計上我從使用者流程出發，規劃對話節點與建議選項，並以 Figma 製作 UI 與 Prototype；\n
    在開發方面，我使用 HTML、SCSS 與 JavaScript 建構 SPA 架構，透過 sessionStorage 保留對話狀態，確保互動體驗流暢不中斷。\n
    這個專案也幫助我整合了設計與程式的雙重視角，更能站在使用者與工程實作之間找到平衡。`,
    questions_id: ["q007", "q008", "q009"]
  }
];

// suggestionItem 問題選項個別集合
export const questionsData = [
{
  id: "q001",
  question: "你提到在六角學院擔任協作設計師，可以再多說一些實際合作的流程嗎？",
  answer: `我通常會先聆聽對方的立場與原因，\n然後找出雙方的共識點⋯⋯`,
  tags: ["溝通能力", "團隊合作", "衝突解決"],
  questions_id: ["q002", "q003"]
},
{
  id: "q002",
  question: "你說擅長 UX 研究與團隊溝通，有沒有實際例子可以分享？",
  answer: `002-answer`,
  tags: ["學習能力", "自律", "技術專業"],
  questions_id: ["q001", "q003"]
},
{
  id: "q003",
  question: "你提到最近完成一個模擬面試的 SPA 作品，可以介紹一下嗎？",
  answer: `003-answer`,
  tags: ["領導力", "團隊合作", "專案管理"],
  questions_id: ["q001", "q002"]
},
{
  id: "q004",
  question: "你說參與團隊競賽採用敏捷式流程，可以詳細說說嗎？",
  answer: `004-answer`,
  tags: ["技術專業", "工具熟練度", "持續學習"],
  questions_id: ["q005", "q006"]
},
{
  id: "q005",
  question: "你們團隊怎麼溝通設計與工程之間的交付",
  answer: `005-answer`,
  tags: ["抗壓性", "時間管理", "團隊合作"],
  questions_id: ["q004", "q006"]
},
{
  id: "q006",
  question: "你提到會根據用戶回饋做設計調整，可以分享一次實際案例嗎？",
  answer: `006-answer`,
  tags: ["自我認知", "責任感", "學習能力"],
  questions_id: ["q004", "q005"]
},
{
  id: "q007",
  question: "這個專案的靈感是從哪來的？你為什麼會想做模擬面試的主題？",
  answer: `007-answer`,
  tags: ["問題解決", "學習能力", "溝通能力"],
  questions_id: ["q008", "q009"]
},
{
  id: "q008",
  question: "你怎麼規劃這個對話流程？怎麼決定每個提問和回覆的內容？",
  answer: `008-answer`,
  tags: ["作品展示", "技術實踐", "自我推廣"],
  questions_id: ["q007", "q009"]
},
{
  id: "q009",
  question: "在設計互動流程上，你遇到最大的挑戰是什麼？又是怎麼解決的？",
  answer: `009-answer`,
  tags: ["團隊合作", "彈性應變", "組織能力"],
  questions_id: ["q008", "q009"]
},
{
  id: "q010",
  question: "你的具體設計工作內容是什麼？",
  answer: `010-answer`,
  tags: ["團隊合作", "彈性應變", "組織能力"]
},
{
  id: "q011",
  question: "遇到什麼挑戰？你是怎麼解決的？",
  answer: `011-answer`,
  tags: ["團隊合作", "彈性應變", "組織能力"]
},
{
  id: "q012",
  question: "你在這段經驗中學到什麼？",
  answer: `012-answer`,
  tags: ["團隊合作", "彈性應變", "組織能力"]
}
];

export const all_tags = [
  {
    // 01_ 開頭
    name:"🎨 自我成長與反思",
    questions_id: ["q010", "q011", "q012", "q013"]
  },
  {
    // 02_ 開頭
    name:"🚀 主動性與挑戰",
    questions_id: ["q020", "q021", "q022", "q023"]
  },
  {
    // 03_ 開頭
    name:"🧠 決策與問題解決",
    questions_id: ["q030", "q031", "q032", "q033"]
  },
  {
    // 04_ 開頭
    name:"💬 回饋與影響",
    questions_id: ["q040", "q041", "q042"]
  },
  {
    // 05_ 開頭
    name:"📂 個人價值與角色",
    questions_id: ["q050", "q051", "q052"]
  },
  {
    // 06_ 開頭
    name:"🤝 團隊協作與溝通",
    questions_id: ["q060", "q061", "q062"]
  },
  {
    // 07_ 開頭
    name:"💢 困境與衝突",
    questions_id: ["q070", "q071"]
  }
]