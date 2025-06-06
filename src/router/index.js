// js/router/index.js
import renderHomePagePage from "../pages/homePage.js";
import renderProjectListPage from "../pages/projectList.js";
import renderStudyPlanPage from "../pages/studyPlan.js";
import renderChatRoomPage from "../pages/chatRoom.js";

// 路由對應表
export const routes = {
  "/": renderHomePagePage,
  "/index.html": renderHomePagePage,
  "/projectList": renderProjectListPage,
  "/plan": renderStudyPlanPage,
  "/chatRoom": renderChatRoomPage,
};


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
  
    const render = routes[pathname];
    let pageContent;
  
    if (render) {
      pageContent = await render();
      console.log("✅ 成功載入 route function:", render.name);
    } else {
      pageContent = renderNotFoundPage(pathname);
      console.warn("❌ 找不到路徑:", pathname);
    }
  
    view.replaceChildren(pageContent);
  }
  