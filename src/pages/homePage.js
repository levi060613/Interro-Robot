// src/pages/homePage.js

import createImgCarousel from "../components_fn/imgCarousel/imgCarousel.js";

export default async function renderHomePage() {
  // 創建一個新的容器來裝載頁面內容
  const pageContentContainer = document.createElement("div");
  pageContentContainer.className = "homePageContent"; // 可以給一個新的 class 方便樣式控制

  // 圖片輪播區塊
  const imgBlock = document.createElement("div");
  imgBlock.className = "imgBlock";
  // 插入元件
  const { carousel,dotsContainer }  = createImgCarousel();
  imgBlock.appendChild(carousel);
  imgBlock.appendChild(dotsContainer);

  // 下方資訊區塊
  const infoBlock = document.createElement("div");
  infoBlock.className = "infoBlock";

  const title = document.createElement("p");
  title.className = "info__title";
  title.id = "responsiveTitle";

  const subtitle = document.createElement("p");
  subtitle.className = "info__subtitle";
  subtitle.id = "responsiveSubtitle";

  const bottomLine = document.createElement("div");
  bottomLine.className = "spacer-line";

  // 添加響應式文字處理
  const handleResponsiveText = () => {
    const isMobile = window.innerWidth <= 576;
    
    if (isMobile) {
      title.innerHTML = `嗨！我是Levi，<br>一名 UIUX 設計師。`;
      subtitle.innerHTML = `"我在意的不只是好看的UI，<br>還要 <b> 好懂、好用、好傳達 </b>。"`;
    } else {
      title.innerHTML = `嗨！我是Levi，一名 UIUX 設計師。`;
      subtitle.innerHTML = `"我在意的不只是好看的UI，還要 <b> 好懂、好用、好傳達 </b>。"`;
    }
  };

  // 初始設置
  handleResponsiveText();

  // 監聽視窗大小變化
  window.addEventListener('resize', handleResponsiveText);

  const introText = document.createElement("p");
  introText.className = "info__introText";
  introText.innerHTML = `
    Interro是我設計來模擬面試互動的對話機器人，<br>
    讓你在<b>三分鐘內</b>，了解<h>我的角色與價值</h>！
  `;

  const a = document.createElement("a");
  a.href = "/chatRoom";
  a.className = "startButton m-2";
  a.setAttribute("data-link", "");
  a.textContent = "開始面試";

  infoBlock.appendChild(title);
  infoBlock.appendChild(subtitle);
  infoBlock.appendChild(bottomLine);
  infoBlock.appendChild(introText);
  infoBlock.appendChild(a);

  // 將 imgBlock 和 infoBlock 加到新的頁面內容容器中
  pageContentContainer.appendChild(imgBlock);
  pageContentContainer.appendChild(infoBlock);

  // 回傳新的頁面內容容器
  return pageContentContainer; // 回傳 pageContentContainer
}