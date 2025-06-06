// imgCarousel.js
import router from "../../router/index.js";
import { setActiveLink } from "../../main.js";

let dots = [];
let dotsContainer;

export default function createImgCarousel() {
  const carousel = document.createElement("div");
  carousel.className = "imgCarousel";

  const cardData = [
    { title: "Ｅ起購 APP", tags: ["UI/UX設計", "用戶研究", "需求分析"], bg: "src/assets/images/E起購_1_1_@3x.png" },
    { title: "六角學院 UI專案", tags: ["RWD設計", "工程交付", "設計系統"], bg: "src/assets/images/六角專案_1_1_@3x.png" },
    { title: "Hahow-Redesign", tags: ["問題拆解", "產品再設計", "團隊溝通"], bg: "src/assets/images/hahow_1_1_@3x.png" },
    { title: "Interro RWD專案", tags: ["0到1設計", "上線專案", "數據分析"], bg: "src/assets/images/Interro_1_1_@3x.png" },
    { title: "京都散策 APP", tags: ["0到1設計", "團隊溝通", "專案管理"], bg: "src/assets/images/京都散策_1_1_@3x.png" },
  ];

  // 如果要只留三個，要將上方資料註解，並把 let activeIndex = 1

  let activeIndex = 2;
  const cardContainers = [];

  const update = () => {
    cardContainers.forEach((container, i) => {
      const offset = (activeIndex - i) / 3;
      const direction = Math.sign(activeIndex - i);
      const absOffset = Math.abs(offset);

      container.style.setProperty("--active", i === activeIndex ? 1 : 0);
      container.style.setProperty("--offset", offset);
      container.style.setProperty("--direction", direction);
      container.style.setProperty("--abs-offset", absOffset);
      container.style.pointerEvents = i === activeIndex ? "auto" : "none";
      container.style.opacity = absOffset >= 3 ? "0" : "1";
      container.style.display = absOffset > 3 ? "none" : "block";
    });

    // 更新 dots 狀態
    if (dots.length) {
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === activeIndex);
      });
    }
  };

  const init = () => {
    // 左側按鈕
    const btnLeft = document.createElement("button");
    btnLeft.className = "nav left";
    btnLeft.innerHTML = "‹";
    btnLeft.addEventListener("click", () => {
      if (activeIndex > 0) {
        activeIndex--;
        update();
      }
    });
    carousel.appendChild(btnLeft);

    // 卡片們
    cardData.forEach((data) => {
      const container = document.createElement("div");
      container.className = "card-container";
      
      // 添加点击事件
      container.addEventListener("click", () => {
        // 直接使用 navigate 函数处理路由
        const path = "/projectList";
        history.pushState({}, "", path);
        router(path);
        setActiveLink(path);
      });
      container.style.cursor = "pointer";

      const card = document.createElement("div");
      card.className = "card";
      card.style.backgroundImage = `url(${data.bg})`;
      card.style.backgroundSize = "cover";
      card.style.backgroundPosition = "center";

      const h4 = document.createElement("h4");
      h4.textContent = data.title;

      const tagsContainer = document.createElement("div");
      tagsContainer.className = "tags-container";
      data.tags.forEach(tag => {
        const tagElement = document.createElement("span");
        tagElement.className = "tag";
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
      });

      const overlay = document.createElement("div");
      overlay.className = "card-overlay";

      card.appendChild(h4);
      card.appendChild(tagsContainer);
      card.appendChild(overlay);
      container.appendChild(card);
      carousel.appendChild(container);

      cardContainers.push(container);
    });

    // 右側按鈕
    const btnRight = document.createElement("button");
    btnRight.className = "nav right";
    btnRight.innerHTML = "›";
    btnRight.addEventListener("click", () => {
      if (activeIndex < cardData.length - 1) {
        activeIndex++;
        update();
      }
    });
    carousel.appendChild(btnRight);

    // dots 導覽
    dotsContainer = document.createElement("div");
    dotsContainer.className = "imgCarousel--dots";
    dots = cardData.map((_, i) => {
      const dot = document.createElement("span");
      dot.className = "imgCarousel--dot";
      dot.addEventListener("click", () => {
        activeIndex = i;
        update();
      });
      dotsContainer.appendChild(dot);
      return dot;
    });

    // 拖曳/滑動相關變數
    let startX = 0;
    let isDragging = false;
    let deltaX = 0;

    // 滑鼠事件
    carousel.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      deltaX = 0;
      carousel.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      deltaX = e.clientX - startX;
    });

    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.cursor = "";
      if (deltaX > 50 && activeIndex > 0) {
        activeIndex--;
        update();
      } else if (deltaX < -50 && activeIndex < cardData.length - 1) {
        activeIndex++;
        update();
      }
      deltaX = 0;
    });

    // 觸控事件（手機）
    carousel.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) return;
      isDragging = true;
      startX = e.touches[0].clientX;
      deltaX = 0;
    });

    carousel.addEventListener("touchmove", (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      deltaX = e.touches[0].clientX - startX;
    });

    carousel.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;
      if (deltaX > 50 && activeIndex > 0) {
        activeIndex--;
        update();
      } else if (deltaX < -50 && activeIndex < cardData.length - 1) {
        activeIndex++;
        update();
      }
      deltaX = 0;
    });
  };

  init();
  update();

  return { carousel, dotsContainer };
}
