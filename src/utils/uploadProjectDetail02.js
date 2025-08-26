import { db } from './firebase.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// project_02 的正確資料結構
const projectDetailData02 = {
  content: {
    firstImage: {
      images: [
        {
          src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1752220647/project-01__img-00_e2rloc.png"
        }
      ]
    },
    sections: [
      {
        type: "imgBlock",
        step: 1,
        name: "專案背景介紹",
        images: [
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1752220650/project-01__img-01_fxp4gd.png"
          },
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1752220644/project-01__img-02_xqrbly.png"
          },
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1752220648/project-01__img-03_xwb73y.png"
          }
        ]
      },
      {
        type: "imgBlock",
        step: 2,
        name: "研究解方與設計",
        images: [
          {
            src: "src/assets/images/color-blue.jpg"
          },
          {
            src: "src/assets/images/color-blue.jpg"
          },
          {
            src: "src/assets/images/color-blue.jpg"
          },
          {
            src: "src/assets/images/color-blue.jpg"
          }
        ]
      },
      {
        type: "imgBlock",
        step: 3,
        name: "開發進行中",
        images: [
          {
            src: "src/assets/images/color-brown.jpg"
          },
          {
            src: "src/assets/images/color-brown.jpg"
          },
          {
            src: "src/assets/images/color-brown.jpg"
          }
        ]
      }
    ]
  },
  template: "behance-project"
};

// 寫入 Firestore
async function upload() {
  try {
    await setDoc(doc(db, "projectDetail", "project_02"), projectDetailData02);
    console.log("project_02 資料已成功寫入 Firestore！");
  } catch (error) {
    console.error("寫入失敗：", error);
  }
}

// 執行上傳
upload(); 