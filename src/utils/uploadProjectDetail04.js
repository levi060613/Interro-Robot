
import { db } from './firebase.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


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



// 寫入 Firestore
async function upload() {
  try {
    await setDoc(doc(db, "projectDetail", "project_04"), projectDetailData04);
    console.log("project_04 資料已成功寫入 Firestore！");
  } catch (error) {
    console.error("寫入失敗：", error);
  }
}

// 執行上傳
upload(); 