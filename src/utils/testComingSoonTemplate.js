// 測試 Coming Soon 模板效果
import { createProjectModal } from '../components_fn/projectDetail/modal.js';

/**
 * 測試 Coming Soon 模板效果
 */
export function testComingSoonTemplate() {
  console.log('🧪 測試 Coming Soon 模板效果...');
  
  try {
    const modal = createProjectModal();
    
    // 模擬 coming-soon 專案數據
    const comingSoonData = {
      template: 'coming-soon',
      basicInfo: {
        title: '京都散策 APP',
        subtitle: '旅遊應用',
        tags: ['0到1設計', '產品定位', '實戰營 佳作']
      },
      content: {
        sections: [
          {
            type: 'text',
            content: `
              <div class="coming-soon-wrapper">
                <h2>🚧 專案正在準備中</h2>
                <p>這個專案的詳細內容正在整理中，很快就會與大家見面！</p>
                <p>敬請期待...</p>
              </div>
            `
          }
        ]
      }
    };
    
    // 顯示 modal
    modal.show(comingSoonData);
    
    console.log('✅ Coming Soon 模板已顯示');
    
  } catch (error) {
    console.error('❌ 顯示 Coming Soon 模板失敗:', error);
  }
}

/**
 * 測試不同專案的 Coming Soon 效果
 */
export function testMultipleComingSoonProjects() {
  console.log('🧪 測試多個 Coming Soon 專案...');
  
  const testProjects = [
    {
      title: '六角學院 專題UI',
      subtitle: 'RWD設計',
      tags: ['RWD設計', '工程交付', '設計系統']
    },
    {
      title: '京都散策 APP',
      subtitle: '旅遊應用',
      tags: ['0到1設計', '產品定位', '實戰營 佳作']
    },
    {
      title: 'Ｅ起購APP',
      subtitle: '全端專案',
      tags: ['0到1設計', '上線專案', '測試數據分析']
    }
  ];
  
  let currentIndex = 0;
  
  function showNextProject() {
    if (currentIndex >= testProjects.length) {
      console.log('🏁 所有專案測試完成');
      return;
    }
    
    const project = testProjects[currentIndex];
    console.log(`📄 顯示專案 ${currentIndex + 1}: ${project.title}`);
    
    const modal = createProjectModal();
    const comingSoonData = {
      template: 'coming-soon',
      basicInfo: project,
      content: {
        sections: [
          {
            type: 'text',
            content: `
              <div class="coming-soon-wrapper">
                <h2>🚧 專案正在準備中</h2>
                <p>這個專案的詳細內容正在整理中，很快就會與大家見面！</p>
                <p>敬請期待...</p>
              </div>
            `
          }
        ]
      }
    };
    
    modal.show(comingSoonData);
    
    // 3秒後顯示下一個專案
    setTimeout(() => {
      currentIndex++;
      showNextProject();
    }, 3000);
  }
  
  showNextProject();
}

/**
 * 測試 Coming Soon 模板的響應式效果
 */
export function testComingSoonResponsive() {
  console.log('🧪 測試 Coming Soon 模板響應式效果...');
  
  const modal = createProjectModal();
  const comingSoonData = {
    template: 'coming-soon',
    basicInfo: {
      title: '響應式測試專案',
      subtitle: '測試不同螢幕尺寸的顯示效果',
      tags: ['響應式設計', '測試', 'Coming Soon']
    },
    content: {
      sections: [
        {
          type: 'text',
          content: `
            <div class="coming-soon-wrapper">
              <h2>🚧 專案正在準備中</h2>
              <p>這個專案的詳細內容正在整理中，很快就會與大家見面！</p>
              <p>請嘗試調整瀏覽器視窗大小來測試響應式效果。</p>
              <p>敬請期待...</p>
            </div>
          `
        }
      ]
    }
  };
  
  modal.show(comingSoonData);
  
  console.log('✅ 響應式測試模板已顯示，請調整瀏覽器視窗大小測試');
}

// 在瀏覽器控制台中運行測試
if (typeof window !== 'undefined') {
  window.testComingSoonTemplate = testComingSoonTemplate;
  window.testMultipleComingSoonProjects = testMultipleComingSoonProjects;
  window.testComingSoonResponsive = testComingSoonResponsive;
  
  console.log('🚀 Coming Soon 模板測試功能已載入，可在控制台中使用：');
  console.log('  - testComingSoonTemplate() - 測試基本 Coming Soon 效果');
  console.log('  - testMultipleComingSoonProjects() - 測試多個專案效果');
  console.log('  - testComingSoonResponsive() - 測試響應式效果');
} 