import { templates } from './templates.js';
import { components } from './components.js';
import { projects } from '../../utils/tempData.js';

// 統一的錯誤處理函數，當專案資料載入或顯示失敗時，回傳一個標準化的錯誤資料物件
function handleProjectError(error, title = '載入失敗') {
  return {
    template: 'coming-soon', // 使用預設的 coming-soon 模板顯示錯誤
    basicInfo: {
      title: title,
      subtitle: '請稍後再試',
      tags: ['Error']
    },
    content: {
      sections: [
        {
          type: 'text',
          content: `
            <h3>${title}</h3>
            <p>請稍後再試，或聯繫管理員。</p>
            <p>錯誤詳情：${error.message}</p>
          `
        }
      ]
    }
  };
}

// 建立專案細節的模態框（Modal）元件
export function createProjectModal() {
  // 建立最外層的模態框容器
  const modal = document.createElement('div');
  modal.className = 'project-modal';
  
  // 建立模態框內容區塊
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  // 建立關閉按鈕
  const closeButton = document.createElement('button');
  closeButton.className = 'modal-close';
  closeButton.innerHTML = '&times;';
  // 綁定點擊事件，點擊後關閉模態框
  closeButton.addEventListener('click', () => {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300); // 延遲移除以配合動畫
  });
  
  // 將關閉按鈕加入內容區
  modalContent.appendChild(closeButton);
  // 將內容區加入模態框容器
  modal.appendChild(modalContent);
  
  // 點擊模態框外部區域時也能關閉模態框
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  });
  
  // 回傳一個物件，提供 show 方法用來顯示專案細節
  return {
    show: (projectData) => {
      try {
        // 清空現有內容（保留關閉按鈕）
        const closeButton = modalContent.querySelector('.modal-close');
        modalContent.innerHTML = '';
        if (closeButton) {
          modalContent.appendChild(closeButton);
        }
        
        // 根據 projectData.template 取得對應的模板
        const template = templates[projectData.template];
        if (!template) {
          console.error(`Template ${projectData.template} not found`);
          throw new Error(`找不到模板：${projectData.template}`);
        }
        
        // 使用模板的 render 方法渲染專案內容
        const content = template.render(projectData);
        modalContent.appendChild(content);
        
        // 將模態框加入 body，並啟動顯示動畫
        document.body.appendChild(modal);
        setTimeout(() => {
          modal.classList.add('active');
        }, 10);
      } catch (error) {
        // 若渲染過程發生錯誤，顯示錯誤訊息內容
        console.error('顯示專案內容時發生錯誤:', error);
      }
    }
  };
} 