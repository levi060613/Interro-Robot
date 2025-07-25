// src/utils/uploadProjectDetail.js

import { db } from './firebase.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 你的 JSON 資料
const projectDetailData = {
  content: {
        carousel: {
          items: [
            {
              type: "image",
              src: "src/assets/images/Interro_2_1_@1x.png",
              caption: "首頁設計"
            },
            {
              type: "image",
              src: "src/assets/images/Interro-chat_2_1_@1x.png",
              caption: "聊天室介面"
            }
          ]
        },
        table: {
          headers: ["類型", "角色", "技術", "成果"],
          rows: [
            {
              col1: "個人主動設計專案",
              col2: "UI/UX 設計師",
              col3: "HTML/CSS/JS",
              col4: "上線網站"
            }
          ]
        },
        sections: [
          {
            type: "text",
            content: `
            <h3>👀 你是否也有這樣的感覺？</h3>
            <p>
            「每天都有上百份履歷和作品集要看，但時間有限，根本無法仔細看每一份資料。」<br>
            「畫面好看、數據也好看，但我看不出設計師的決策邏輯和背後的關鍵考量。」<br>
            「看完整份作品集，還是不確定設計師擅長什麼。」
            </p>
            `
          },
          {
            type: "text",
            content: `
            <h3>💡 為了解決這些問題，我設計了 Interro</h3>
            <p>
            我設計了一個互動式的作品集網站，模擬面試對話情境，訪客可以像面試時一樣點選問題選項來提問，網站則以對話形式逐步揭露資訊，讓「了解設計師」變成一場有節奏的交流，而不是花時間在一堆文字與圖片中尋找線索。<br>
            這個網站的核心目的，是幫助面試官能更快、更準確地看了解我作為設計師的個人價值與潛力。
            </p>
            `
          },
          {
            type: "text",
            content: `
            <h3>🔍 為什麼想到要做這個？</h3>
            <p>
            在開始設計這份作品集之前，我先從問題源頭出發：
            作品集的讀者是誰？他們真正關心的是什麼？
            為了釐清這件事，我瀏覽了大量 UIUX 相關的分享文章，並訪談了三位在 UIUX 領域擔任不同職位的專業人士。
            藉此理解他們在收到履歷、瀏覽作品集、決定是否邀請面試的整個流程中，是怎麼思考與做出判斷的。
            而我發現，不同職位的角色，視角其實不一樣：
  
            🗣️ HR 想快速篩選：
            「這份作品集看起來是否清楚易懂？他有團隊合作經驗嗎？職位跟我們開的職缺相符嗎？」
            🗣️ 設計主管則想深入挖掘：
            「他為什麼這樣設計？做這個決策是基於什麼考量？遇到限制時是怎麼協調的？」
            一個在追求速度與整齊劃一，另一個則在尋找細節與獨立思考。
  
            但以傳統作品集的格式來展示我的專案作品，
            往往只能照一條線展示資訊，難以同時滿足這兩種需求。
            尤其我僅有一年 UIUX 工作經驗的設計師，沒有太多可以量化展示的數據成效，很難在短時間內讓面試官留下深刻印象。
  
            因此我開始思考：
            能不能換一種方式，讓每個人都能依照自己的關注點，主動探索他想知道的內容？
            </p>
            `
          },
          {
            type: "text",
            content: `
            <h3>🧠 時間有限，直接提問最快速</h3>
            <p>
            為了讓每個人都能了解各自想知道的內容，
            所以我做了一個關鍵決定：讓用戶自己提問。
            這就是 Interro 的起點 —— 
            讓作品集不再是一份從頭滑到底的簡報，也不是翻頁式的靜態履歷。
            訪客不再被動地從頭讀到尾，而是可以像面試一樣，直接點選他真正好奇的問題：
            「你在這個專案的角色是什麼？」
  
            「這個設計改動是誰提的？怎麼決定的？」
  
            「你遇過 PM 一直改需求嗎？怎麼處理？」
            每一個點選的問題，網站都會以對話形式回應，條理清晰、逐步展開，並根據提問深入更多細節。
            不再只是被動接受，而是根據每個人想暸解的內容，主動展開探索。
            </p>
            `
          },
          {
            type: "text",
            content: `
            <h3>✨ 具體解法：將作品集當作一場面試互動</h3>
            <p>
            為了讓這種體驗成立，我重新思考了整份作品集的結構與形式，並用三個核心邏輯來貫穿整體設計：
            模擬「面試流程」的節奏來呈現內容
            在真實的面試裡，對話總是從一個提問開始，不是照著簡報一頁頁講完。
            所以我刻意打破傳統作品集的線性架構，改用「即問即答」的方式設計內容。
            每個問題都是一個切入點，讓閱讀節奏跟著好奇心走。
            這不只是提升互動性，也更貼近面試時的流程——用問題帶出深入的交流，而不是單方面的資訊堆疊。
  
            提高資訊密度，減少閱讀負擔
            不需要從頭看到尾、也不會被大量圖片與冗長敘述淹沒。
            每次提問都會獲得精簡而具深度的回答，用更有效率的方式，帶出專案核心與我的設計價值。
  
            聚焦決策與價值，而非僅是成果展示
            我將每個回答都設計成面試常見的提問角度，引導讀者理解我的設計思考、問題解決與溝通能力。
            不是只展示我「做了哪些設計」，而是說明我怎麼做決策、如何面對限制，以及我在團隊中扮演的角色與貢獻。
            </p>
            `
          },
          {
            type: "text",
            content: `
            <h3>💬 成果反饋</h3>
            <p>
            目前已進入QA測試階段，
            並且同步邀請兩位不同背景的使用者進行初步易用性觀察 ——
            一位是沒有設計背景的一般使用者，一位是具有豐富經驗的設計主管。
            從他們的回饋中，我整理出以下三個調整方向：
            1. 操作引導不夠清楚
            對於非設計背景的使用者而言，一開始可能不太確定這個網站要做什麼、要怎麼操作。
            → 解法方向：在進入互動前提供一段快速引導，或設計一個「摘要總覽」入口，讓人資也能快速掌握脈絡與亮點。
  
            2. 選項操作的互動設計仍有遲疑
            目前的選項輪播方式需要花一點時間理解，易用性尚未達到直覺點選的程度。
            → 解法方向：調整選項互動的節奏安排，提升在面試互動的操作易用性，降低使用門檻。
  
            3. 讓回應內容有更清楚的「應答結構」
            設計主管提到，目前問答回應的部分內容篇幅過長，像是在閱讀文章，若是趕時間的訪客可能會想直接略過。
            → 解法方向：提升易讀性，將回應的長段文字改成有結構性的內容（例如：star法則），就像面試情境有結構性的應答，讓文字內容更聚焦，可以快速抓到重點。
  
            這些回饋不僅幫助我看見盲點，也讓我意識到：一個好的設計，就算再創新，也要能讓每一位使用者理解、上手。
            </p>
            `
          },
          {
            type: "text",
            content: `
            <h3>🌱 個人反思與學習：學的不只是設計，而是整個流程</h3>
            <p>
            在做這個互動式作品集之前，我對「做網站」的想像，其實停留在很淺層的表層操作。
            🎯 過去的學習方式：片段與自我導向
            我做作品集時，總是在想要不要加動畫、文案要怎麼寫才能在 7 秒內吸引面試官注意。
            學東西也比較零碎：想著要學哪個流行的架站工具、研究漂亮的風格視覺，做出一個「看起來吸睛」的畫面就算完成。
            但對於網站從 0 到 1 的完整過程，幾乎沒有概念，更沒想過從使用者角度回推整體體驗。
            🚀 這次的轉變：從使用者出發、以設計視角看待產品
            這個作品集讓我第一次把自己當成一個產品來設計。
            我學會了從使用者的角度出發，規劃內容架構與互動模式、進行MVP的概念驗證，也第一次經歷實際的 QA 測試、串接 GA 數據、觀察使用行為。
            過去我重視的是外顯的吸引力；這次我開始理解，一個設計能不能被理解、被使用，才是真正的關鍵。
            </p>
            `
          }
        ]
  },
  template: "default-project"
};

// 寫入 Firestore
async function upload() {
  try {
    await setDoc(doc(db, "projectDetail", "project_01"), projectDetailData);
    console.log("資料已成功寫入 Firestore！");
  } catch (error) {
    console.error("寫入失敗：", error);
  }
}

// 你可以直接呼叫 upload()，或在頁面上加個按鈕觸發
upload();