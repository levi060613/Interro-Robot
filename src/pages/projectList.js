import { createProjectModal } from '../components_fn/projectDetail/modal.js';
import { projects as localProjects } from '../utils/tempData.js';
import { fetchProjectList } from '../utils/fetchData.js';

export default async function renderProjectListPage() {
  // 創建一個新的容器來裝載頁面內容
  const pageContentContainer = document.createElement("div");
  pageContentContainer.className = "projectListContent";

  // 创建标题
  const mainTitle = document.createElement("h4");
  const enText = document.createElement("p");
  mainTitle.innerHTML = "我的專案歷程";
  enText.innerHTML = "2023.08～Now";
  enText.className = "enText";

  // 创建时间线容器
  const container = document.createElement("div");
  container.className = "container";

  try {
    // 嘗試從 Firebase 獲取專案列表
    let projects = await fetchProjectList();
    
    // 如果 Firebase 獲取失敗，使用本地數據
    if (!projects) {
      console.log('使用本地專案數據');
      projects = localProjects;
    }

    // 生成时间线内容
    projects.forEach((project, index) => {
      const timelineBlock = document.createElement("div");
      timelineBlock.className = `timeline-block timeline-block-${project.position}`;
      
      const marker = document.createElement("div");
      marker.className = "marker";
      
      const timelineContent = document.createElement("div");
      timelineContent.className = "timeline-content";
      
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
      
      timelineContent.addEventListener('click', () => {
        try {
          const modal = createProjectModal();
          // 檢查專案是否有完整的內容
          if (!project.content || !project.template) {
            modal.show({
              template: 'coming-soon',
              basicInfo: {
                title: project.title,
                subtitle: '專案內容更新中',
                tags: ['Coming Soon']
              },
              content: {
                sections: [
                  {
                    type: 'text',
                    content: `
                      <h4>專案內容待更新</h4>
                    `
                  }
                ]
              }
            });
          } else {
            modal.show({
              template: project.template,
              basicInfo: {
                title: project.title,
                subtitle: project.subtitle,
                tags: project.tags
              },
              content: project.content
            });
          }
        } catch (error) {
          console.error('顯示專案內容時發生錯誤:', error);
          const modal = createProjectModal();
          modal.show(handleProjectError(error, '顯示專案內容時發生錯誤'));
        }
      });
      
      timelineBlock.appendChild(marker);
      timelineBlock.appendChild(timelineContent);
      container.appendChild(timelineBlock);
    });
  } catch (error) {
    console.error('載入專案列表失敗:', error);
    // 如果發生錯誤，顯示錯誤訊息
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.textContent = "載入專案列表時發生錯誤，請稍後再試。";
    container.appendChild(errorMessage);
  }

  pageContentContainer.appendChild(mainTitle);
  pageContentContainer.appendChild(enText);
  pageContentContainer.appendChild(container);

  return pageContentContainer;
}