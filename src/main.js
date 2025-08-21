// 🚀 核心功能 - 立即加载（首屏必需）
import "./components_fn/positionSelector/positionSelector.js"  // 职业选择器（用户必须点击收集数据）
import "./components_fn/sidebar/sidebar.js"                   // 侧边栏导航
import bindImgCarousel from "./components_fn/imgCarousel/imgCarousel.js"  // 首页轮播图
import router from "./router/index.js";                       // 路由功能
import { routes } from "./router/index.js";                   // 路由配置
import { initPositionAnalytics } from "./utils/positionAnalytics.js";  // 职位分析

// 🔄 非核心功能 - 延迟加载（通过预加载优化）
let chatInputPanelLoaded = false;
let lightboxLoaded = false;
let firebaseLoaded = false;

// 🎯 静默预加载函数
function silentPreloadOtherFeatures() {
  console.log("🚀 [预加载] 开始静默预加载其他功能...");
  
  // 第一阶段：预加载聊天功能（用户最可能使用的）
  preloadChatFeatures();
  
  // 第二阶段：预加载项目详情功能
  setTimeout(() => {
    preloadProjectFeatures();
  }, 300);
  
  // 第三阶段：预加载其他辅助功能
  setTimeout(() => {
    preloadAuxiliaryFeatures();
  }, 600);
}

// 💬 预加载聊天功能
async function preloadChatFeatures() {
  if (chatInputPanelLoaded) return;
  
  try {
    console.log("💬 [预加载] 正在预加载聊天功能...");
    await import("./components_fn/chatInputPanel/chatInputPanel.js");
    chatInputPanelLoaded = true;
    console.log("✅ [预加载] 聊天功能预加载完成");
  } catch (error) {
    console.warn("⚠️ [预加载] 聊天功能预加载失败:", error);
  }
}

// 🖼️ 预加载项目详情功能
async function preloadProjectFeatures() {
  if (lightboxLoaded) return;
  
  try {
    console.log("🖼️ [预加载] 正在预加载项目详情功能...");
    await import("./components_fn/projectDetail/lightbox.js");
    lightboxLoaded = true;
    console.log("✅ [预加载] 项目详情功能预加载完成");
  } catch (error) {
    console.warn("⚠️ [预加载] 项目详情功能预加载失败:", error);
  }
}

// 🔧 预加载辅助功能
async function preloadAuxiliaryFeatures() {
  if (firebaseLoaded) return;
  
  try {
    console.log("🔧 [预加载] 正在预加载辅助功能...");
    await import("./utils/testFirebase.js");
    firebaseLoaded = true;
    console.log("✅ [预加载] 辅助功能预加载完成");
  } catch (error) {
    console.warn("⚠️ [预加载] 辅助功能预加载失败:", error);
  }
}

// 🚀 智能预加载启动函数
function startSmartPreloading() {
  // 使用 requestIdleCallback 在浏览器空闲时预加载
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      silentPreloadOtherFeatures();
    }, { timeout: 2000 }); // 2秒超时，确保不会等待太久
  } else {
    // 降级方案：延迟预加载
    setTimeout(() => {
      silentPreloadOtherFeatures();
    }, 1000);
  }
}

// 🎯 首屏核心功能初始化
window.addEventListener("DOMContentLoaded", () => {
  const pathname = window.location.pathname;
  
  // 如果不是首頁，重整時自動導回首頁
  const isHome = pathname === "/" || pathname === "/index.html";
  if (!isHome) {
    console.log("[重整偵測] 非首頁路徑，將導回首頁。當前路徑:", pathname);
    history.replaceState({}, "", "/");
    location.reload();
    return;
  } else {
    console.log("[重整偵測] 首頁路徑，正常載入。當前路徑:", pathname);
    
    // 🚀 立即执行首屏核心功能
    router(pathname);
    bindImgCarousel();
    handleResponsiveHomeTitle();
    window.addEventListener('resize', handleResponsiveHomeTitle);
    
    // 初始化职位 Analytics
    initPositionAnalytics();
    
    // 🎯 首屏完成后，启动智能预加载
    setTimeout(() => {
      startSmartPreloading();
      addHoverPreloading(); // 启动悬停预加载
    }, 100); // 短暂延迟，确保首屏渲染完成
  }
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
      
      // 🚀 用户点击导航时，确保对应功能已预加载
      ensureFeaturePreloaded(href);
      
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

// 🎯 确保功能预加载的函数
function ensureFeaturePreloaded(path) {
  switch (path) {
    case "/chatRoom":
      if (!chatInputPanelLoaded) {
        console.log("🚀 [即时加载] 用户点击聊天页面，立即加载聊天功能");
        preloadChatFeatures();
      }
      break;
    case "/projectList":
      if (!lightboxLoaded) {
        console.log("🚀 [即时加载] 用户点击项目页面，立即加载项目功能");
        preloadProjectFeatures();
      }
      break;
  }
}

// 🎯 添加hover预加载功能
function addHoverPreloading() {
  const links = document.querySelectorAll("[data-link]");
  
  links.forEach(link => {
    const href = link.getAttribute("href");
    
    // 鼠标悬停时预加载
    link.addEventListener("mouseenter", () => {
      preloadFeatureOnHover(href);
    });
  });
}

// 🚀 悬停预加载功能
function preloadFeatureOnHover(path) {
  switch (path) {
    case "/chatRoom":
      if (!chatInputPanelLoaded) {
        console.log("🖱️ [悬停预加载] 预加载聊天功能");
        preloadChatFeatures();
      }
      break;
    case "/projectList":
      if (!lightboxLoaded) {
        console.log("🖱️ [悬停预加载] 预加载项目功能");
        preloadProjectFeatures();
      }
      break;
  }
}

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
  
function handleResponsiveHomeTitle() {
  const title = document.getElementById("responsiveTitle");
  const subtitle = document.getElementById("responsiveSubtitle");
  if (!title || !subtitle) return;

  const isMobile = window.innerWidth <= 576;
  if (isMobile) {
    title.innerHTML = `嗨！我是Levi，<br>一名 UIUX 設計師。`;
    subtitle.innerHTML = `「想快速知道我是不是你需要的設計師嗎？<br><b>那直接與我來場面試吧！</b> 」`;
  } else {
    title.innerHTML = `嗨！我是Levi，一名 UIUX 設計師。`;
    subtitle.innerHTML = `「想快速知道我是不是你需要的設計師嗎？<b>那直接與我來場面試吧！</b> 」`;
  }
}

// 📊 性能监控 - 显示预加载状态
function showPreloadStatus() {
  const status = {
    "职业选择器": "✅ 已加载",
    "侧边栏": "✅ 已加载", 
    "轮播图": "✅ 已加载",
    "聊天功能": chatInputPanelLoaded ? "✅ 已预加载" : "⏳ 预加载中...",
    "项目功能": lightboxLoaded ? "✅ 已预加载" : "⏳ 预加载中...",
    "辅助功能": firebaseLoaded ? "✅ 已预加载" : "⏳ 预加载中..."
  };
  
  console.log("📊 [性能监控] 当前加载状态:");
  Object.entries(status).forEach(([feature, state]) => {
    console.log(`  ${feature}: ${state}`);
  });
}

// 🎯 在预加载完成后显示状态
function updatePreloadStatus() {
  setTimeout(() => {
    showPreloadStatus();
  }, 2000); // 2秒后显示状态
}

// 启动状态监控
updatePreloadStatus();
  