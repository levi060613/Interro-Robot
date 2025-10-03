// src/utils/uploadProjectDetail.js

import { db } from './firebase.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// project_01 的 behance-project 格式資料結構
const projectDetailData = {
  content: {
    firstImage: {
      images: [
        {
          src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1759380123/project_01--img1_oh6a9v.png"
        }
      ]
    },
    sections: [
      {
        type: "imgBlock",
        step: 1,
        name: "研究洞察與發想",
        images: [
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1759461640/project_01--img02_l3vlcp.png"
          },
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1759474374/QA_%E7%A0%94%E7%A9%B6%E6%B4%9E%E5%AF%9F%E8%88%87%E7%99%BC%E6%83%B3_kri3we.png"
          }
        ],
        questions: [
          {
            id: "q500",
            label: "專業能力",
            text: "研究結果是如何幫助你做決策的？",
            reply: `
^^🔴 Obstacle｜挑戰^^
雖然網路上已有許多作品集範例可以參考，但我注意到~-面試官在瀏覽作品集時，仍常遇到資訊冗長、動線不清等問題-~。
因此，我希望以「**產品視角**」切入，~-專注於解決面試官的實際痛點-~，而不是單純複製現有的呈現方式。

^^🟢 Action｜行動^^
- 競品矩陣分析：比較不同作品集的呈現方式（靜態 vs. 互動式）
- 使用者情境示意：模擬面試官從~-「收到履歷 → 打開作品集 → 掃描 → 瀏覽 → 評估」的流程-~
- 從過程中找出靜態作品集常見的斷點，並思考 **設計可以介入改善的切入點**

^^🔵 Result｜成果^^
我歸納出作品集的關鍵不僅是「完整展示」，更在於 **如何透過 UX 設計優化面試官的閱讀動線**，讓他們能更快速地抓到重點。
基於這個發現，我決定採用 **對話式互動** 的形式，讓~-資訊依需求展開，提升瀏覽效率與理解度-~。

^^🔍 Insight｜反思^^
這次研究讓我意識到，設計的價值並不在於模仿競品，而是透過使用者旅程去發現 **尚未被解決的問題**，並將其轉化為差異化的設計解方。`,
          },
          {
            id: "q501",
            label: "專業能力",
            text: "解方有經過目標族群驗證嗎？",
            reply: `
^^🔴 Obstacle｜挑戰^^
設計解方時，為了確保方案可以解決面試官的痛點，避免盲目地資源投入，我也在各階段規劃了驗證測試流程。

^^🟢 Action｜行動^^
- **前期概念驗證**：在研究訪談時，我先提出幾個解方雛形（互動式問答、傳統頁面、精簡長卷式），~-觀察目標族群（面試官與設計師同儕）的反應，確認方向的可行性-~。
- **原型測試**：進一步製作 Lo-fi prototype，進行小規模的可用性測試，~-觀察受測者是否能直覺理解操作方式、是否能快速找到想要的資訊-~。
- **回饋修正**：根據觀察，調整資訊結構與互動流程，~-確保體驗不會因互動方式而變得複雜-~。

^^🔵 Result｜成果^^
透過 Lo-fi 測試，我初步驗證了這個方案相較於傳統靜態作品集，**更能引起使用者的好奇心與專注度**，並初步接收到幾個有待調整的操作細節。
此外，也~-有設計主管對於這種「對話式互動」的呈現方式表達認同-~，並認為它具備創新性。`
          },
          {
            id: "q502",
            label: "專業能力",
            text: "有發想過其他方案比較嗎？",
            reply: `
^^▸ 初期探索｜Initial Ideas^^
一開始我確實有發想過幾個不同的方向：
- 第一個是透過**微互動和滾動視差效果**，打造一個吸睛的作品集；
- 第二個是把視覺設計極度簡化，**強調直覺操作**。

^^▸ 需求洞察｜User Insight^^
但回到面試官真正的需求來看，他們瀏覽作品集的目的，不是要看到最炫的介面，也不是單純操作輕鬆，
而是想要~- 快速判斷設計師的專業能力，確認是不是合適的人選-~。

^^▸ 差異化考量｜Differentiation^^
同時我也思考到**市場的競爭性**。
這個領域裡有很多資深設計師，他們在作品集的視覺呈現與專案的深度會比我成熟許多。
與其在美感上正面競爭，~-我更希望凸顯我的優勢來形成差異化，也更符合我想展示的價值。-~

^^▸ 決策理由｜Why This Approach^^
因此我最後選擇**對話式的互動設計**，讓面試官能在有限時間內快速理解我的專業，同時也~-展現我作為設計師在「產品思維」與「用戶觀點」上的特色-~。`
          }
        ]
      },
      {
        type: "imgBlock",
        step: 2,
        name: "產品設計與功能",
        images: [
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1759389287/project_01--img3-1_dbwtof.png"
          },
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1759385644/project_01--img3-2_zausbx.png"
          },
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1759385645/project_01--img3-3_bskgdi.png"
          },
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1759474374/QA_%E7%94%A2%E5%93%81%E8%A8%AD%E8%A8%88%E8%88%87%E5%8A%9F%E8%83%BD_nt9rn3.png"
          }
        ],
        questions: [
          {
            id: "q503",
            label: "專業能力",
            text: "這個網站初期有規劃時程進度嗎？",
            reply: `
^^🔴 Obstacle｜挑戰^^
有的，在規劃時，為了防止專案陷入「一直修改、一直延後」的循環，因此我首先設立~-目標是在四個月內完成上線-~。
尤其是這是一個我獨立完成的專案，沒有人幫我控管進度，所以如何「取捨」與「時間管理」是一大挑戰。

^^🟢 Action｜行動^^
為了確保專案不會落後，我採取了兩個方向：

### 進度管控與取捨策略
- 優先開發**核心功能**（互動問答與作品展示），確保網站能達到主要設計功能的操作性
- 對於部分進階功能，採用臨時解法或簡化流程，快速驗證可行性
- 把需要~-更多打磨的細節（文案精修、動畫優化），安排到上線後的迭代-~

### 敏捷式開發流程
- 把專案~-拆解成多個短週期目標-~（例如：一週內完成聊天室 MVP、一週完成測試頁面）
- 每個週期結束後檢視與調整，而不是一次性定死所有細節
- 在研究與設計過程中，~-隨時評估「理想體驗」與「可行落地」的平衡-~

^^🔵 Result｜成果^^
透過這樣的推進方式，我成功在八月如期上線，並在 Lo-fi 測試與實際使用者回饋 中得到寶貴的數據。
雖然有些細節仍待優化，但我已經：
- 拿到一個可用版本搜集數據並測試
- 建立持續更新的基礎
- 更清楚理解產品開發中「~-用戶體驗-~」與「~-時程控制-~」的平衡

^^🔍 Insight｜反思^^
這段經驗讓我體會到：
>設計與開發並不是一次到位，而是一種「在限制下不斷迭代」的過程。
敏捷式流程不只是方法，而是一種思維 —— 透過快速驗證、隨時調整，讓我不僅能更有效率地完成一人專案，也~-能模擬真實團隊的挑戰，練習如何在有限資源下推進專案。-~`
          },
          {
            id: "q504",
            label: "專業能力",
            text: "採取SPA架構有帶來什麼優勢或挑戰？",
            reply: `
^^🔴 Obstacle｜挑戰^^
由於我希望作品集能模擬真實面試情境，如 **聊天室的機制**，與面試官透過引導式選項互動，並能即時看到回答。
然而，傳統多頁網站每次切換頁面都會重新載入，~-容易破壞對話流暢性，也不利於維持訊息狀態-~。

^^🟢 Action｜行動^^
- 我採用 SPA 架構，利用前端路由與狀態管理，~-確保聊天室互動順暢，訊息保持即時顯示-~
- 使用**元件化開發**，方便維護與重複利用
- 透過** sessionStorage 管理狀態**，確保對話不會因頁面跳轉而中斷

^^🔵 Result｜成果^^
透過上述技術開發，幫助面試官在瀏覽 Interro 時，可以即時點擊問題並獲得回答，互動流程自然且順暢，訊息狀態也保持完整。
這讓作品集能更貼近聊天室互動的操作流程，提升了使用者的專注度與互動體驗。`
          }
        ]
      },
      {
        type: "imgBlock",
        step: 3,
        name: "目前成效與規劃",
        images: [
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1759380119/project_01--img4_zxecin.png"
          },
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1759474374/QA_%E7%9B%AE%E5%89%8D%E6%88%90%E6%95%88%E8%88%87%E8%A6%8F%E5%8A%83_qiagm3.png"
          }
        ],
        questions: [
          {
            id: "q505",
            label: "專業能力",
            text: "你怎模衡量這個網站的成功？",
            reply: `
^^▸ 產品目標｜Product Goal^^
我對於這個網站的目標願景，主要在於~-能否縮短面試官與設計師之間的距離-~。
因為面試官幾乎沒有太多時間瀏覽作品集，所以我希望藉由**對話式的互動**，
>在有限的時間內，讓他們快速認識我的專業能力與特質，並留下深刻印象。

^^▸ 成功指標｜Success Metrics^^
在衡量上，我會用兩個層面來看：
第一是**量化數據**，透過 GA4 去追蹤互動率、外部連結的點擊率，以及履歷下載的CTA，
來了解網站是否真的~-吸引面試官持續探索，並對設計師產生興趣-~。
第二是**質性回饋**，例如透過問卷或實際面試官的回應，來判斷他們~-對網站內容的理解和滿意度-~。

^^▸ 最終成果｜Outcome^^
最後，我也會觀察是否真的提升了面試邀約率。
因為對我來說，這個作品集的價值不只是展示，而是在於~-能否有效引起面試官的注意，幫助我轉換成實際的面試機會。-~`
          },
          {
            id: "q506",
            label: "專業能力",
            text: "為何選擇透過任務完成率與GA追蹤來衡量？",
            reply: `
^^▸ 資源限制｜Research Constraint^^
專案期間難以持續找到大量相關領域的資深人士協助研究，因此我調整研究方式，透過 GA追蹤 來收集流量數據，~-將網站的每一次點擊與互動轉化成參考資料-~。

^^▸ 前期驗證｜Usability Testing^^
在正式上線前，先進行易用性測試，~-確保主要功能沒有嚴重操作障礙-~，避免後續數據因體驗問題而失真。

^^▸ 上線追蹤｜Google Analytics^^
上線後嵌入 GA 事件追蹤，關注用戶有興趣的選項比例、流失率與跳出點，以建立可量化的行為指標，~-確保能觀察真實使用行為-~。

^^▸ 成效｜Outcome^^
這樣規劃讓我在**資源不足**的情況下，依然能測試到「~-介面的操作易用性是否流暢-~」以及「~-實際使用時流量的數據-~」，幫助我發現哪些地方能留住使用者、哪些地方容易流失，並持續迭代設計。`
          }
        ]
      },
      {
        type: "imgBlock",
        step: 4,
        name: "重點迭代設計",
        images: [
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1759380120/project_01--img5_g04mh7.png"
          }
        ]
      },
      {
        type: "imgBlock",
        step: 5,
        name: "專案總結",
        images: [
          {
            src: "https://res.cloudinary.com/dgp6aecqw/image/upload/v1759380117/project_01--img6_oudnle.png"
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