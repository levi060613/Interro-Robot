// imgCarousel.js
import router from "../../router/index.js";
import { setActiveLink } from "../../main.js";

export default function bindImgCarousel() {
  const carousel = document.querySelector(".imgCarousel");
  if (!carousel) return;

  const cardContainers = Array.from(carousel.querySelectorAll(".card-container"));
  const btnLeft = carousel.querySelector(".nav.left");
  const btnRight = carousel.querySelector(".nav.right");
  const dotsContainer = carousel.parentElement.querySelector(".imgCarousel--dots");

  let activeIndex = 2; // 預設中間那張
  let dots = [];

  // 產生 dots
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    dots = cardContainers.map((_, i) => {
      const dot = document.createElement("span");
      dot.className = "imgCarousel--dot";
      dot.addEventListener("click", () => {
        activeIndex = i;
        update();
      });
      dotsContainer.appendChild(dot);
      return dot;
    });
  }

  // 卡片點擊導頁
  cardContainers.forEach(container => {
    container.style.cursor = "pointer";
    container.addEventListener("click", () => {
      const path = "/projectList";
      history.pushState({}, "", path);
      router(path);
      setActiveLink(path);
    });
  });

  // 更新 3D 樣式
  function update() {
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

    if (dots.length) {
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === activeIndex);
      });
    }
  }

  // 左右按鈕
  btnLeft?.addEventListener("click", () => {
    if (activeIndex > 0) {
      activeIndex--;
      update();
    }
  });
  btnRight?.addEventListener("click", () => {
    if (activeIndex < cardContainers.length - 1) {
      activeIndex++;
      update();
    }
  });

  // 拖曳/滑動
  let startX = 0, isDragging = false, deltaX = 0;
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
    } else if (deltaX < -50 && activeIndex < cardContainers.length - 1) {
      activeIndex++;
      update();
    }
    deltaX = 0;
  });

  // 觸控
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
    } else if (deltaX < -50 && activeIndex < cardContainers.length - 1) {
      activeIndex++;
      update();
    }
    deltaX = 0;
  });

  // 初始化
  update();
}
