// tempData.js

// 專案列表數據
export const projects = [
  {
    year: "2025.04 ~ Now",
    title: "Interro 模擬面試機器人｜互動式網站",
    subtitle: "“不是展示作品，而是設計給面試官的產品。”",
    description: "反轉傳統作品集展示方式，設計對話式體驗流程，引導面試官一步步探索我的角色與價值。",
    tags: ["0到1設計", "開發上線", "聊天機器人"],
    img: "src/assets/images/project-01_projectCard.webp",
    template: "behance-project",
    document_id: "project_01"
  },
  {
    year: "2024.08 ~ Now",
    title: "六角學院 專題UI｜RWD設計",
    subtitle: "接案性質",
    description: "・了解學生需求的風格，轉化為視覺UI<br>・交稿主視覺設計 ＋ RWD畫面 + Guideline<br>・與對方溝通、並按需求調整設計稿<br>・與對方確定好主視覺後，延續風格設計其他頁面<br>",
    tags: ["RWD設計", "工程交付", "設計系統"],
    img: "src/assets/images/project-02_projectCard.webp",
    template: "coming-soon",
    document_id: "project_02"
  },
  {
    year: "2024.11",
    title: "Hahow 線上課程平台｜情感化體驗設計",
    subtitle: "“設計不只要做得好看，還要讓人願意持續使用。”",
    description: "我們挑戰的不是操作流程，而是學生的學習動力。透過問題拆解和團隊協作，打造具互動、情感化的系統性改版。",
    tags: ["問題拆解", "產品再設計", "榮獲Top 3"],
    img: "src/assets/images/project-03_projectCard.webp",
    template: "behance-project",
    document_id: "project_03"
  },
  {
    year: "2024.7",
    title: "京都散策 APP",
    subtitle: "旅遊應用",
    description: "為日本京都旅遊設計的移動應用，整合了景點導覽、行程規劃和本地文化體驗等功能。",
    tags: ["0到1設計", "產品定位", "實戰營 佳作"],
    img: "src/assets/images/project-04_projectCard.webp",
    template: "coming-soon",
    document_id: "project_04"
  },
  {
    year: "2024.11",
    title: "Ｅ起購APP｜為您處理團購大小事",
    subtitle: "全端專案",
    description: "從零開始設計和開發的響應式網站，通過數據分析和用戶測試持續優化產品體驗。",
    tags: ["0到1設計", "上線專案", "測試數據分析"],
    img: "src/assets/images/project-05_projectCard.webp",
    template: "coming-soon",
    document_id: "project_05"
  }
];

export const projectCards = projects.map(({ year, title, subtitle, description, tags, img, template, document_id }) => ({
  year, title, subtitle, description, tags, img, template, document_id
}));

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
  },
  {
    id: "q002",
    question: "你說擅長 UX 研究與團隊溝通，有沒有實際例子可以分享？",
    answer: `002-answer`,
  },
  {
    id: "q003",
    question: "你提到最近完成一個模擬面試的 SPA 作品，可以介紹一下嗎？",
    answer: `003-answer`,
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
  }
];

// 標籤分類系統
export const all_tags = [
  {
    // 01_ 開頭
    name:"💼 工作經驗與角色",
    questions_id: ["q010", "q011", "q012"]
  },
  {
    // 02_ 開頭
    name:"🛠️ 技術能力與工具",
    questions_id: ["q020", "q021", "q022"]
  },
  {
    // 03_ 開頭
    name:"🎯 專案管理與流程",
    questions_id: ["q030", "q031", "q032"]
  },
  {
    // 04_ 開頭
    name:"🤝 團隊協作與溝通",
    questions_id: ["q040", "q041", "q042"]
  },
  {
    // 05_ 開頭
    name:"📚 學習成長與規劃",
    questions_id: ["q050", "q051", "q052"]
  },
  {
    // 06_ 開頭
    name:"💡 創意思維與解決方案",
    questions_id: ["q060", "q061", "q062"]
  },
  {
    // 07_ 開頭
    name:"💢 困境與衝突",
    questions_id: ["q070", "q071"]
  }
];

// 本地详细内容模拟数据（Firebase 失败时的备用方案）
export const projectDetail = [
  {
    document_id: "project_01",
    template: "behance-project",
    basicInfo: {
      title: "Interro 模拟面试机器人｜互动式网站",
      subtitle: "2025.04 - 个人项目",
      tags: ["0到1设计", "开发上线", "聊天机器人"]
    },
    content: {
      firstImage: {
        images: [
          {
            src: "src/assets/images/project-01_imgCarousel.jpg",
            caption: "首页设计"
          }
        ]
      },
      sections: [
        {
          type: "text",
          content: `
            <h3>🚧 项目内容正在准备中</h3>
            <p>这个项目的详细内容正在整理中，很快就会与大家见面！</p>
            <p>敬请期待...</p>
          `
        }
      ]
    }
  },
  {
    document_id: "project_02",
    template: "behance-project",
    basicInfo: {
      title: "Hahow 线上课程平台｜情感化体验设计",
      subtitle: "2024.11 - 团队项目",
      tags: ["问题拆解", "产品再设计", "荣获Top 3"]
    },
    content: {
      firstImage: {
        images: [
          {
            src: "src/assets/images/project-02_imgCarousel.jpg",
            caption: "平台设计"
          }
        ]
      },
      sections: [
        {
          type: "text",
          content: `
            <h3>🚧 项目内容正在准备中</h3>
            <p>这个项目的详细内容正在整理中，很快就会与大家见面！</p>
            <p>敬请期待...</p>
          `
        }
      ]
    }
  },
  {
    document_id: "project_03",
    template: "coming-soon",
    basicInfo: {
      title: "六角学院 专题UI｜RWD设计",
      subtitle: "2024.08 - 接案性质",
      tags: ["RWD设计", "工程交付", "设计系统"]
    },
    content: {
      sections: [
        {
          type: "text",
          content: `
            <div class="coming-soon-wrapper">
              <h2>🚧 项目正在准备中</h2>
              <p>这个项目的详细内容正在整理中，很快就会与大家见面！</p>
              <p>敬请期待...</p>
            </div>
          `
        }
      ]
    }
  },
  {
    document_id: "project_04",
    template: "coming-soon",
    basicInfo: {
      title: "京都散策 APP",
      subtitle: "2024.7 - 旅游应用",
      tags: ["0到1设计", "产品定位", "实战营 佳作"]
    },
    content: {
      sections: [
        {
          type: "text",
          content: `
            <div class="coming-soon-wrapper">
              <h2>🚧 项目正在准备中</h2>
              <p>这个项目的详细内容正在整理中，很快就会与大家见面！</p>
              <p>敬请期待...</p>
            </div>
          `
        }
      ]
    }
  },
  {
    document_id: "project_05",
    template: "coming-soon",
    basicInfo: {
      title: "Ｅ起购APP｜为您处理团购大小事",
      subtitle: "2024.11 - 全端项目",
      tags: ["0到1设计", "上线项目", "测试数据分析"]
    },
    content: {
      sections: [
        {
          type: "text",
          content: `
            <div class="coming-soon-wrapper">
              <h2>🚧 项目正在准备中</h2>
              <p>这个项目的详细内容正在整理中，很快就会与大家见面！</p>
              <p>敬请期待...</p>
            </div>
          `
        }
      ]
    }
  }
];