import { createProjectModal } from '../components_fn/projectDetail/modal.js';
// 引入本地小卡資料（只含基本資訊，不含詳細內容）
import { projectCards as localProjectCards } from '../utils/tempData.js';
// 引入本地詳細內容模擬資料
import { projectDetail } from '../utils/tempData.js';
// 引入 Firebase 取得詳細內容的函式
import { fetchProjectDetailFromFirebase } from '../utils/fetchData.js';
// 引入用戶職位資訊
import { sendInteractionEvent } from '../utils/positionAnalytics.js';

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

  // 使用本地項目列表數據（因為我們主要關注的是從 Firebase 獲取詳細內容）
  const projects = localProjectCards;

  try {
    // 逐一渲染每個小卡
    projects.forEach((project, index) => {
      console.log('[DEBUG] 小卡 project:', project);
      // 建立 timeline 區塊
      const timelineBlock = document.createElement("div");
      // position 可用於左右交錯顯示（如有設計需求）
      timelineBlock.className = `timeline-block timeline-block-${project.position || 'left'}`;
      
      // 時間軸標記
      const marker = document.createElement("div");
      marker.className = "marker";
      
      // 小卡內容區塊
      const timelineContent = document.createElement("div");
      timelineContent.className = "timeline-content";
      
      // 小卡 HTML 結構（只顯示基本資訊）
      const contentHTML = `
        <h6>${project.year || '2024'}</h6>
        <h4>${project.title}</h4>
        <p class="md">${project.subtitle || ''}</p>
        <p class="label">${project.description}</p>
        <div class="project-tags">
          ${(project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <img src="${project.img}" alt="${project.title}" class="project-image">
      `;
      
      timelineContent.innerHTML = contentHTML;
      
      // 點擊小卡時，顯示詳細內容
      timelineContent.addEventListener('click', async () => {
        try {
          // 發送 GA 事件：追踪用户点击了哪个项目
          sendInteractionEvent('project_card_click', {
            project_id: project.document_id,
            project_title: project.title,
            project_year: project.year
          });
          console.log('[GA] 已發送項目卡片點擊事件:', {
            project_id: project.document_id,
            project_title: project.title
          });

          const modal = createProjectModal();

          // 從 Firebase 的 projectDetail collection 取得詳細內容
          let remoteDetail = null;
          let isFromFirebase = false;
          
          if (project.document_id) {
            try {
              console.log(`[DEBUG] 嘗試從 Firebase projectDetail 獲取專案詳細內容: ${project.document_id}`);
              remoteDetail = await fetchProjectDetailFromFirebase(project.document_id);
              console.log('[DEBUG] Firebase projectDetail 內容:', remoteDetail);
              isFromFirebase = true;
            } catch (error) {
              console.error(`[DEBUG] 從 Firebase projectDetail 獲取失敗: ${project.document_id}`, error);
            }
          }

          // 如果 Firebase 数据获取失败，使用本地数据
          if (!remoteDetail) {
            console.log('[DEBUG] Firebase 数据获取失败，使用本地项目详细内容');
            // 根据项目 ID 找到对应的本地资料
            const localDetail = projectDetail.find(detail => detail.document_id === project.document_id);
            if (localDetail) {
              remoteDetail = localDetail;
              console.log('[DEBUG] 找到对应的本地资料:', localDetail);
            } else {
              // 如果找不到对应的本地资料，使用默认的 coming-soon 资料
              remoteDetail = {
                document_id: project.document_id,
                template: 'coming-soon',
                basicInfo: {
                  title: project.title,
                  subtitle: project.subtitle || '',
                  tags: project.tags || []
                },
                content: {
                  sections: [
                    {
                      type: 'text',
                      content: `
                        <div class="coming-soon-wrapper">
                          <h2>🚧 项目正在准备中</h2>
                          <p>这个项目的详细内容正在整理中，很快就会与大家见面！</p>
                          <p>敬请期待...</p>
                        </div>
                      `
                    }
                  ]
                }
              };
              console.log('[DEBUG] 使用默认 coming-soon 资料');
            }
            isFromFirebase = false;
          }

          // 确保 remoteDetail 有正确的结构
          if (!remoteDetail.basicInfo) {
            remoteDetail.basicInfo = {
              title: project.title,
              subtitle: project.subtitle || '',
              tags: project.tags || []
            };
          }

          // 根据 template 字段决定使用哪个模板
          const template = remoteDetail.template || 'coming-soon';
          console.log(`[DEBUG] 数据来源: ${isFromFirebase ? 'Firebase' : '本地'}`);
          console.log(`[DEBUG] 使用模板: ${template}`);
          console.log(`[DEBUG] 完整数据结构:`, remoteDetail);

          // 更新 modal 内容为真实资料
          modal.show({
            template: template,
            basicInfo: remoteDetail.basicInfo,
            content: remoteDetail.content || remoteDetail
          });
        } catch (error) {
          console.error('[DEBUG] 顯示專案詳細內容失敗:', error);
          // 失敗時顯示錯誤狀態
          const modal = createProjectModal();
          modal.show({
            template: 'error',
            basicInfo: {
              title: project.title,
              subtitle: '載入失敗',
              tags: project.tags || []
            },
            content: { 
              sections: [{ 
                type: 'error', 
                content: `
                  <div class="error-container">
                    <h3>載入失敗</h3>
                    <p>無法載入專案詳細內容，請稍後再試。</p>
                    <p>錯誤詳情：${error.message}</p>
                  </div>
                ` 
              }] 
            }
          });
        }
      });
      
      // 將小卡加入時間線容器
      timelineBlock.appendChild(marker);
      timelineBlock.appendChild(timelineContent);
      container.appendChild(timelineBlock);
    });
  } catch (error) {
    console.error('[DEBUG] 渲染專案列表失敗:', error);
    // 顯示錯誤訊息
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.innerHTML = `
      <h3>載入失敗</h3>
      <p>無法載入專案列表，請稍後再試。</p>
      <p>錯誤詳情：${error.message}</p>
    `;
    container.appendChild(errorMessage);
  }

  // 將所有元素加入頁面容器
  pageContentContainer.appendChild(mainTitle);
  pageContentContainer.appendChild(enText);
  pageContentContainer.appendChild(container);

  return pageContentContainer;
}