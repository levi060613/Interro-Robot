// 上傳 coming-soon 項目示例數據
import { db } from './firebase.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// project_03 的 coming-soon 模板資料結構
const projectDetailData03 = {
  template: 'coming-soon',
  basicInfo: {
    title: 'Hahow 線上課程平台｜情感化體驗設計',
    subtitle: '團隊競賽專案',
    tags: ['問題拆解', '產品再設計', '榮獲Top 3']
  },
  content: {
    sections: [
      {
        type: 'text',
        content: `
          <div class="coming-soon-wrapper">
            <h2>🚧 專案正在準備中</h2>
            <p>這個專案的詳細內容正在整理中，很快就會與大家見面！</p>
            <p>敬請期待...</p>
          </div>
        `
      }
    ]
  }
};

// project_04 的 coming-soon 模板資料結構
const projectDetailData04 = {
  template: 'coming-soon',
  basicInfo: {
    title: '京都散策 APP',
    subtitle: '旅遊應用',
    tags: ['0到1設計', '產品定位', '實戰營 佳作']
  },
  content: {
    sections: [
      {
        type: 'text',
        content: `
          <div class="coming-soon-wrapper">
            <h2>🚧 專案正在準備中</h2>
            <p>這個專案的詳細內容正在整理中，很快就會與大家見面！</p>
            <p>敬請期待...</p>
          </div>
        `
      }
    ]
  }
};

// project_05 的 coming-soon 模板資料結構
const projectDetailData05 = {
  template: 'coming-soon',
  basicInfo: {
    title: 'Ｅ起購APP｜為您處理團購大小事',
    subtitle: '全端專案',
    tags: ['0到1設計', '上線專案', '測試數據分析']
  },
  content: {
    sections: [
      {
        type: 'text',
        content: `
          <div class="coming-soon-wrapper">
            <h2>🚧 專案正在準備中</h2>
            <p>這個專案的詳細內容正在整理中，很快就會與大家見面！</p>
            <p>敬請期待...</p>
          </div>
        `
      }
    ]
  }
};

// 寫入 Firestore
async function uploadComingSoonProject() {
  try {
    // 上傳 project_03 作為 coming-soon
    await setDoc(doc(db, "projectDetail", "project_03"), projectDetailData03);
    console.log("project_03 (coming-soon) 資料已成功寫入 Firestore！");
    
    // 上傳 project_04 作為 coming-soon
    await setDoc(doc(db, "projectDetail", "project_04"), projectDetailData04);
    console.log("project_04 (coming-soon) 資料已成功寫入 Firestore！");
    
    // 上傳 project_05 作為 coming-soon
    await setDoc(doc(db, "projectDetail", "project_05"), projectDetailData05);
    console.log("project_05 (coming-soon) 資料已成功寫入 Firestore！");
    
  } catch (error) {
    console.error("寫入失敗：", error);
  }
}

// 執行上傳
uploadComingSoonProject(); 