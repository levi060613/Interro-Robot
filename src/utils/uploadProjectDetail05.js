// src/utils/uploadProjectDetail05.js
import { db } from './firebase.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


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
async function upload() {
  try {
    await setDoc(doc(db, "projectDetail", "project_05"), projectDetailData05);
    console.log("project_05 資料已成功寫入 Firestore！");
  } catch (error) {
    console.error("寫入失敗：", error);
  }
}

// 執行上傳
upload(); 