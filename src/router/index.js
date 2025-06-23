// js/router/index.js
// import renderHomePagePage from "../pages/homePage.js";
import renderProjectListPage from "../pages/projectList.js";
import renderStudyPlanPage from "../pages/studyPlan.js";
import renderChatRoomPage from "../pages/chatRoom.js";
import bindImgCarousel from "../components_fn/imgCarousel/imgCarousel.js";

// 路由對應表
export const routes = {
  // "/": renderHomePagePage, // 已靜態化，移除
  // "/index.html": renderHomePagePage, // 已靜態化，移除
  "/projectList": renderProjectListPage,
  "/plan": renderStudyPlanPage,
  "/chatRoom": renderChatRoomPage,
};

let homePageHTML = null; // 用來暫存首頁原始內容

function renderNotFoundPage(pathname) {
    const container = document.createElement("div");
  
    const title = document.createElement("h2");
    title.textContent = "找不到這個頁面";
    title.style.color = "red";
  
    const msg = document.createElement("p");
    msg.textContent = `無法識別的路徑：${pathname}`;
  
    container.appendChild(title);
    container.appendChild(msg);
  
    return container;
  }
  
  export default async function router(pathname) {
    const view = document.getElementById("mainContent");
  
    // 首次進入時，暫存首頁內容
    if (homePageHTML === null) {
      homePageHTML = view.innerHTML;
    }
  
    // 判斷是否為首頁
    if (pathname === "/" || pathname === "/index.html") {
      // 還原首頁內容
      view.innerHTML = homePageHTML;
      bindImgCarousel();
      return;
    }
  
    // 其他分頁
    const render = routes[pathname];
    let pageContent;
  
    if (render) {
      pageContent = await render();
      view.innerHTML = ""; // 清空
      view.appendChild(pageContent);
      console.log("✅ 成功載入 route function:", render.name);
    } else {
      pageContent = renderNotFoundPage(pathname);
      view.innerHTML = "";
      view.appendChild(pageContent);
      console.warn("❌ 找不到路徑:", pathname);
    }
  }
  