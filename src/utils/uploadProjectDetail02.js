import { db } from './firebase.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// project_02 的 coming-soon 模板資料結構
const projectDetailData02 = {
    content: {
      firstImage: {
        images: [
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1760363792/RWD_UI_project_firstImg_dplcvg.png"
          }
        ]
      },
      sections: [
        {
          type: "imgBlock",
          step: 1,
          name: "甜甜熊貓｜甜點電商網站",
          images: [
            {
              src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1760363794/RWD_UI_project_tenten_01_a0vevs.png"
            },
            {
              src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1760359872/RWD_UI_project_tenten_02_skh4pp.png"
            },
            {
              src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1760359878/RWD_UI_project_tenten_03_fznc2z.png"
            },
            {
              src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1760359878/RWD_UI_project_tenten_04_hzdawc.png"
            },
            {
              src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1760359877/RWD_UI_project_tenten_05_gfylhs.png"
            },
            {
              src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1760359876/RWD_UI_project_tenten_06_jru9xv.png"
            }
          ]
        },
        {
          type: "imgBlock",
          step: 2,
          name: "I need this.｜生活小物電商網站",
          images: [
            {
              src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1760361991/%E5%BE%85%E6%9B%B4%E6%96%B0_RWD_UI_project_02_isuy4m.png"
            }
          ]
        },
        {
          type: "imgBlock",
          step: 3,
          name: "行旅之境｜旅遊行程網站",
          images: [
            {
              src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1760361990/%E5%BE%85%E6%9B%B4%E6%96%B0_RWD_UI_project_03_sfdl7d.png"
            }
          ]
        },
        {
          type: "imgBlock",
          step: 4,
          name: "STYLEWAVE｜潮流電商網站",
          images: [
            {
              src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1760361991/%E5%BE%85%E6%9B%B4%E6%96%B0_RWD_UI_project_04_a3hf2f.png"
            }
          ]
        },
        {
          type: "imgBlock",
          step: 5,
          name: "溱晨空間設計｜公司官網",
          images: [
            {
              src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1760361992/%E5%BE%85%E6%9B%B4%E6%96%B0_RWD_UI_project_05_dmu8pv.png"
            }
          ]
        },
        {
          type: "imgBlock",
          step: 6,
          name: "動一動｜運動用品電商網站",
          images: [
            {
              src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1760361990/%E5%BE%85%E6%9B%B4%E6%96%B0_RWD_UI_project_06_lpukhi.png"
            }
          ]
        },
        {
          type: "imgBlock",
          step: 7,
          name: "咖啡詮釋學｜咖啡豆電商網站",
          images: [
            {
              src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1760361989/%E5%BE%85%E6%9B%B4%E6%96%B0_RWD_UI_project_07_rep1qu.png"
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