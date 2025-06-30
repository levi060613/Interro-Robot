import { createProjectModal } from '../components_fn/projectDetail/modal.js';
// 引入本地小卡資料（只含基本資訊，不含詳細內容）
import { projectCards as localProjectCards } from '../utils/tempData.js';
// 引入本地詳細內容模擬資料
import { projectDetail } from '../utils/tempData.js';
// 引入（未來用於）firebase 取得詳細內容的函式
import { fetchProjectList, fetchProjectDetailFromFirebase } from '../utils/fetchData.js';

// 專案列表頁面渲染主函式
export default async function renderProjectListPage() {
  // 創建一個新的容器來裝載頁面內容
  const pageContentContainer = document.createElement("div");
  pageContentContainer.className = "projectListContent";

  // 創建標題與英文說明
  const mainTitle = document.createElement("h4");
  const enText = document.createElement("p");
  mainTitle.innerHTML = "我的專案歷程";
  enText.innerHTML = "2023.08～Now";
  enText.className = "enText";

  // 創建時間線容器
  const container = document.createElement("div");
  container.className = "container";

  // 直接使用本地小卡資料渲染（不需等待遠端資料，提升初次渲染速度）
  try {
    // 逐一渲染每個小卡
    localProjectCards.forEach((project, index) => {
      console.log('[DEBUG] 小卡 project:', project);
      // 建立 timeline 區塊
      const timelineBlock = document.createElement("div");
      // position 可用於左右交錯顯示（如有設計需求）
      timelineBlock.className = `timeline-block timeline-block-${project.position}`;
      
      // 時間軸標記
      const marker = document.createElement("div");
      marker.className = "marker";
      
      // 小卡內容區塊
      const timelineContent = document.createElement("div");
      timelineContent.className = "timeline-content";
      
      // 小卡 HTML 結構（只顯示基本資訊）
      const contentHTML = `
        <h6>${project.year}</h6>
        <h4>${project.title}</h4>
        <p class="md">${project.subtitle}</p>
        <p class="label">${project.description}</p>
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <img src="${project.img}" alt="${project.title}" class="project-image">
      `;
      
      timelineContent.innerHTML = contentHTML;
      
      // 點擊小卡時，顯示詳細內容（先用本地 projectDetail 模擬）
      timelineContent.addEventListener('click', async () => {
        try {
          const modal = createProjectModal();

          // 1. 先顯示 loading
          modal.show({
            template: 'coming-soon',
            basicInfo: {
              title: project.title,
              subtitle: '載入中...',
              tags: project.tags
            },
            content: { sections: [{ type: 'text', content: '<h4>載入詳細內容中...</h4>' }] }
          });

          // 2. 從 Firebase 取得 content
          const remoteDetail = await fetchProjectDetailFromFirebase(project.document_id);

          // 3. 組合資料
          modal.show({
            template: remoteDetail.template || 'interro-project',
            basicInfo: {
              title: project.title,
              subtitle: project.subtitle,
              tags: project.tags
            },
            content: remoteDetail.content
          });
        } catch (error) {
          // 失敗時 fallback
          modal.show({
            template: 'coming-soon',
            basicInfo: {
              title: project.title,
              subtitle: project.subtitle,
              tags: project.tags
            },
            content: { sections: [{ type: 'text', content: `<h4>載入失敗：${error.message}</h4>` }] }
          });
        }
      });
      
      // 組裝 timeline 區塊
      timelineBlock.appendChild(marker);
      timelineBlock.appendChild(timelineContent);
      container.appendChild(timelineBlock);
    });
  } catch (error) {
    // 若渲染過程發生錯誤，顯示錯誤訊息
    console.error('載入專案列表失敗:', error);
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.textContent = "載入專案列表時發生錯誤，請稍後再試。";
    container.appendChild(errorMessage);
  }

  // 組裝整個頁面內容
  pageContentContainer.appendChild(mainTitle);
  pageContentContainer.appendChild(enText);
  pageContentContainer.appendChild(container);

  // 回傳頁面 DOM 給 router 或主程式插入
  return pageContentContainer;
}