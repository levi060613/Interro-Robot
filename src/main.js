import "./components_fn/sidebar/sidebar.js"
import "./components_fn/chatInputPanel/chatInputPanel.js"
import router from "./router/index.js";          // 匯入 router 函式（負責根據 pathname 載入對應頁面）
import { routes } from "./router/index.js";          // 匯入 routes 函式
// import tempData from '.../src/utils/tempData.js';   // 匯入問題資料

window.addEventListener("DOMContentLoaded", () => {
  const pathname = window.location.pathname;
  router(pathname);
});

/**
 * 根據目前的路徑（pathname），設定導覽列中對應的連結為「active」狀態
 * - 支援首頁同時使用 "/" 與 "/index.html"
 */
export function setActiveLink(pathname) {
  const links = document.querySelectorAll("[data-link]");

  links.forEach((link) => {
    const href = link.getAttribute("href");

    // 判斷是否為首頁（把 "/" 和 "/index.html" 當作同一頁）
    const isHomePage =
      (pathname === "/" || pathname === "/index.html") &&
      (href === "/" || href === "/index.html");

    // 符合當前路徑，就加入 active class，否則移除
    if (isHomePage || href === pathname) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/**
 * 導航功能：
 * - 使用 pushState 改變網址但不重新載入頁面
 * - 呼叫 router 根據新路徑載入內容
 * - 更新 active 樣式
 */
function navigate(path) {
  history.pushState({}, "", path);
  router(path);
  setActiveLink(path);
}

/**
 * 頁面初次載入時觸發：
 * - 監聽 DOMContentLoaded 確保所有元素都可操作後再執行
 * - 綁定所有帶有 [data-link] 的 a 標籤點擊事件（阻止預設跳轉並用 navigate 控制）
 * - 使用 closest 確保能找到最接近的 [data-link] 元素
 * - 載入當前網址對應頁面
 * - 設定對應的 active 導覽樣式
 */

// ✨ 判斷是否為開發環境（localhost 或 127.0.0.1）
function isDevEnvironment() {
  return location.hostname === "localhost" || location.hostname === "127.0.0.1";
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-link]");
    if (link) {
      e.preventDefault();
      const href = link.getAttribute("href");
      navigate(href);
    }
  });

  let currentPath = location.pathname;

  // 🧹 如果是開發環境，且路徑不合法，自動導回首頁
  if (isDevEnvironment() && !Object.keys(routes).includes(currentPath)) {
    console.warn(`⚠️ [開發模式] 無效路徑 "${currentPath}"，自動導回首頁`);
    history.replaceState({}, "", "/");
    currentPath = "/";
  }
  
  router(currentPath);         // 初次進入頁面時載入對應內容
  setActiveLink(currentPath);  // 設定正確的 active 導覽樣式
});

/**
 * popstate 事件：當使用者點「上一頁 / 下一頁」時觸發
 * - 確保也能正確切換頁面內容
 * - 也可以加上 setActiveLink(location.pathname)（建議加）
 */
window.addEventListener("popstate", () => {
  const currentPath = location.pathname;
  router(currentPath);
  setActiveLink(currentPath); // ← 加上這行，確保返回時樣式也跟著切換
});


// ✅ 載入 Sidebar 的 HTML + 功能
async function loadSidebar() {
    const container = document.getElementById('sidebar-container');
  
    try {
      const response = await fetch('src/components_fn/sidebar/sidebar.html');
      const html = await response.text();
      container.innerHTML = html;
  
      // 載入功能腳本
      const module = await import('./components_fn/sidebar/sidebar.js');
      module.initSidebar(); // 在 DOM 載入完成後才執行

      // ⭐️ Sidebar 載入完成後，設定 active 樣式
      setActiveLink(location.pathname);

    } catch (err) {
      console.error('載入 Sidebar 失敗：', err);
    }
}
  
loadSidebar();
  