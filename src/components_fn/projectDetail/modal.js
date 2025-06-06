import { templates } from './templates.js';
import { components } from './components.js';
import { projects } from '../../utils/tempData.js';

// 統一的錯誤處理函數
function handleProjectError(error, title = '載入失敗') {
  return {
    template: 'coming-soon',
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

export function createProjectModal() {
  const modal = document.createElement('div');
  modal.className = 'project-modal';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'modal-close';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  });
  
  modalContent.appendChild(closeButton);
  modal.appendChild(modalContent);
  
  // 點擊模態框外部關閉
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  });
  
  return {
    show: (projectData) => {
      try {
        // 獲取對應的模板
        const template = templates[projectData.template];
        if (!template) {
          console.error(`Template ${projectData.template} not found`);
          throw new Error(`找不到模板：${projectData.template}`);
        }
        
        // 渲染專案內容
        const content = template.render(projectData);
        modalContent.appendChild(content);
        
        // 顯示模態框
        document.body.appendChild(modal);
        setTimeout(() => {
          modal.classList.add('active');
        }, 10);
      } catch (error) {
        console.error('顯示專案內容時發生錯誤:', error);
        const errorData = handleProjectError(error, '顯示專案內容時發生錯誤');
        const errorTemplate = templates[errorData.template];
        const errorContent = errorTemplate.render(errorData);
        modalContent.appendChild(errorContent);
        
        document.body.appendChild(modal);
        setTimeout(() => {
          modal.classList.add('active');
        }, 10);
      }
    }
  };
} 