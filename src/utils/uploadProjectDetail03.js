// src/utils/uploadProjectDetail03.js
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


// 寫入 Firestore
async function upload() {
    try {
      await setDoc(doc(db, "projectDetail", "project_03"), projectDetailData03);
      console.log("project_03 資料已成功寫入 Firestore！");
    } catch (error) {
      console.error("寫入失敗：", error);
    }
  }
  
  // 執行上傳
  upload(); 