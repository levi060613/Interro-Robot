// 上傳 coming-soon 項目示例數據
import { db } from './firebase.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// coming-soon 項目的數據結構
const comingSoonProjectData = {
  template: "coming-soon",
  content: {
    firstImage: {
      images: [
        {
          src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1754363930/projectModal-01_00_yxldia.png",
          caption: "即將推出"
        }
      ]
    },
    sections: [
      {
        type: "text",
        content: `
          <div class="coming-soon-content">
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
    // 上傳 project_03 作為 coming-soon 示例
    await setDoc(doc(db, "projectDetail", "project_03"), comingSoonProjectData);
    console.log("project_03 (coming-soon) 資料已成功寫入 Firestore！");
    
    // 也可以上傳其他項目作為 coming-soon
    await setDoc(doc(db, "projectDetail", "project_04"), comingSoonProjectData);
    console.log("project_04 (coming-soon) 資料已成功寫入 Firestore！");
    
    await setDoc(doc(db, "projectDetail", "project_05"), comingSoonProjectData);
    console.log("project_05 (coming-soon) 資料已成功寫入 Firestore！");
    
  } catch (error) {
    console.error("寫入失敗：", error);
  }
}

// 執行上傳
uploadComingSoonProject(); 