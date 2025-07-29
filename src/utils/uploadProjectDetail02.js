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
        ],
        questions: [
          {
            text: "你所說的技術具體掌握到什麼程度？",
            reply: `
              A1(imgBlock-1)`
          },
          {
            text: "這個專案在初期有建立計畫嗎？",
            reply: `
              A2(imgBlock-1)`
          },
          {
            text: "為何選擇採用敏捷式（alige）開發流程？",
            reply: `
              A3(imgBlock-1)`
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
        ],
        questions: [
          {
            text: "如何從研究中發現、統整出這些洞察？",
            reply: `
              A1(imgBlock-2)`
          },
          {
            text: "解方設計有經過目標用戶驗證嗎？",
            reply: `
              A2(imgBlock-2)`
          },
          {
            text: "為何選擇開發 SPA 架構網站？有什麼取捨？",
            reply: `
              A3(imgBlock-2)`
          }
        ]
      },
      {
        type: "imgBlock",
        step: 3,
        name: "設計系統",
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
        ],
        questions: [
          {
            text: "UI 設計有遵循什麼原則？",
            reply: `
              A1(imgBlock-3)`
          },
          {
            text: "關於配色、grid設計、字型⋯⋯等等，有考量什麼嗎？",
            reply: `
              A2(imgBlock-3)`
          },
          {
            text: "你有建立元件庫嗎？是怎麼管理元件重複與共用問題？",
            reply: `
              A3(imgBlock-3)`
          }
        ]
      },
      {
        type: "imgBlock",
        step: 4,
        name: "Onboarding 流程設計",
        images: [
          {
            src: "src/assets/images/color-pink.jpg"
          },
          {
            src: "src/assets/images/color-pink.jpg"
          },
          {
            src: "src/assets/images/color-pink.jpg"
          },
          {
            src: "src/assets/images/color-pink.jpg"
          },
          {
            src: "src/assets/images/color-pink.jpg"
          },
          {
            src: "src/assets/images/color-pink.jpg"
          }
        ],
        questions: [
          {
            text: "你怎麼確定這些問題是面試官想了解的？",
            reply: `
              A1(imgBlock-4)`
          },
          {
            text: "Q2(imgBlock-4)",
            reply: `
              A2(imgBlock-4)`
          },
          {
            text: "Q3(imgBlock-4)",
            reply: `
              A3(imgBlock-4)`
          }
        ]
      },
      {
        type: "imgBlock",
        step: 5,
        name: "版本迭代設計",
        images: [
          {
            src: "src/assets/images/color-pink.jpg"
          },
          {
            src: "src/assets/images/color-pink.jpg"
          },
          {
            src: "src/assets/images/color-pink.jpg"
          },
          {
            src: "src/assets/images/color-pink.jpg"
          },
          {
            src: "src/assets/images/color-pink.jpg"
          }
        ],
        questions: [
          {
            text: "Q1(imgBlock-5)",
            reply: `
              A1(imgBlock-5)`
          },
          {
            text: "Q2(imgBlock-5)",
            reply: `
              A2(imgBlock-5)`
          },
          {
            text: "Q3(imgBlock-5)",
            reply: `
              A3(imgBlock-5)`
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