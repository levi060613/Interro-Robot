// src/utils/uploadProjectDetail.js

import { db } from './firebase.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// project_01 的 behance-project 格式資料結構
const projectDetailData = {
  content: {
    firstImage: {
      images: [
        {
          src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1754363930/projectModal-01_00_yxldia.png"
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
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1754363923/projectModal-01_01_bj48np.png"
          }
        ],
        questions: [
          {
            id: "q500",
            label: "技術能力評估",
            text: "你所說的技術具體掌握到什麼程度？",
            reply: `
              A1(imgBlock-1)`,
          },
          {
            id: "q501",
            label: "專案開發細節",
            text: "這個專案在初期有建立計畫嗎？",
            reply: `
              A2(imgBlock-1)
              `
          },
          {
            id: "q502",
            label: "專案開發細節",
            text: "為何選擇採用敏捷式（alige）開發流程？",
            reply: `
### 🚀 進行中的個人專案 ###
我正在開發一個互動式的 **模擬面試聊天網站** （目前已進入上線階段），
希望透過這個專案，讓我整合：
- 用戶研究分析的能力
- UI 設計
- 前端開發實作
- 後續數據測試、迭代優化
> 專案目標是完整體驗一次從 0 到 1 的產品開發流程，包含使用者測試與數據分析，並作為我作品集中的代表作。`
          }
        ]
      },
      {
        type: "imgBlock",
        step: 2,
        name: "研究解方與設計",
        images: [
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1754363928/projectModal-01_02_fhhkmo.png"
          },
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1754363920/projectModal-01_03_pp9ujz.png"
          }
        ],
        questions: [
          {
            id: "q503",
            text: "如何從研究中發現、統整出這些洞察？",
            reply: `
              A1(imgBlock-2)`
          },
          {
            id: "q504",
            text: "解方設計有經過目標用戶驗證嗎？",
            reply: `
              A2(imgBlock-2)`
          },
          {
            id: "q505",
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
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1754363922/projectModal-01_04_lzw1cv.png"
          }
        ],
        questions: [
          {
            id: "q506",
            text: "UI 設計有遵循什麼原則？",
            reply: `
              A1(imgBlock-3)`
          },
          {
            id: "q507",
            text: "關於配色、grid設計、字型⋯⋯等等，有考量什麼嗎？",
            reply: `
              A2(imgBlock-3)`
          },
          {
            id: "q508",
            text: "你有建立元件庫嗎？是怎麼管理元件重複與共用問題？",
            reply: `
              A3(imgBlock-3)`
          }
        ]
      },
      {
        type: "imgBlock",
        step: 4,
        name: "互動功能介紹",
        images: [
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1754366058/projectModal-01_05_zguudw.png"
          },
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1754366058/projectModal-01_06_y9rotn.png"
          }
        ],
        questions: [
          {
            id: "q509",
            text: "為什麼會設計這種「模擬面試」的互動方式？",
            reply: `
              A1(imgBlock-4)`
          },
          {
            id: "q510",
            text: "互動體驗有沒有做過使用者測試？結果如何？",
            reply: `
              A2(imgBlock-4)`
          },
          {
            id: "q511",
            text: "你怎麼衡量這些互動設計是否成功？",
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
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1754366056/projectModal-01_07_lxbgy2.png"
          },
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1754366055/projectModal-01_08_drbicj.png"
          },
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1754366055/projectModal-01_09_xlwggj.png"
          }
        ],
        questions: [
          {
            id: "q512",
            text: "在第一次版本釋出後，你收到的主要回饋是什麼？",
            reply: `
              A1(imgBlock-5)`
          },
          {
            id: "q513",
            text: "你是如何判斷優先要改進的項目？",
            reply: `
              A2(imgBlock-5)`
          },
          {
            id: "q514",
            text: "如果有時間或資源限制，你是怎麼做取捨的？",
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
    await setDoc(doc(db, "projectDetail", "project_01"), projectDetailData);
    console.log("project_01 資料已成功寫入 Firestore！");
  } catch (error) {
    console.error("寫入失敗：", error);
  }
}

// 執行上傳
upload();