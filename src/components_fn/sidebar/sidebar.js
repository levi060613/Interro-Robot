// components_fn/sidebar.js

export function initSidebar() {
  const toggleBtn = document.getElementById('toggle-btn');
  const sidebar = document.getElementById('sidebar');
  const main = document.querySelector('.mainContainer');
  const mainContent = document.querySelector('.mainContent');
  const overlay = document.querySelector('.sidebar-overlay');

  // 拖曳/滑動相關變數
  let startX = 0;
  let isDragging = false;
  let deltaX = 0;

  // 關閉 sidebar 的函式
  function closeSidebar() {
    sidebar.classList.remove('collapsed');
    main.classList.remove('collapsed');
    mainContent.classList.remove('collapsed');
    overlay.classList.remove('is-visible');
  }

  // 切換 sidebar 開關
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    main.classList.toggle('collapsed');
    mainContent.classList.toggle('collapsed');
    overlay.classList.toggle('is-visible');
    main.appendChild(overlay);
});

  // 1. 點擊 sidebar 內的 data-link 連結自動關閉 sidebar
  sidebar.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if (link) {
      closeSidebar();
    }
  });

  // 2. 點擊 overlay 也會關閉 sidebar
  overlay.addEventListener('click', () => {
    closeSidebar();
  });

  // 滑鼠拖曳 sidebar
  sidebar.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    deltaX = 0;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    deltaX = e.clientX - startX;
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    if (deltaX < -50) { // 向左拖曳超過 50px
      closeSidebar();
    }
    deltaX = 0;
  });

  // 觸控拖曳 sidebar（手機）
  sidebar.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    isDragging = true;
    startX = e.touches[0].clientX;
    deltaX = 0;
  });

  sidebar.addEventListener("touchmove", (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    deltaX = e.touches[0].clientX - startX;
  });

  sidebar.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;
    if (deltaX < -50) { // 向左滑超過 50px
      closeSidebar();
    }
    deltaX = 0;
  });
}