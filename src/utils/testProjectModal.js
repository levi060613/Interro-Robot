// 测试项目 Modal 功能
import { createProjectModal } from '../components_fn/projectDetail/modal.js';
import { projectDetail } from './tempData.js';

/**
 * 测试所有项目的 Modal 显示
 */
export function testAllProjectModals() {
  console.log('🧪 开始测试所有项目的 Modal 显示...');
  
  const testProjects = [
    'project_01',
    'project_02', 
    'project_03',
    'project_04',
    'project_05'
  ];
  
  testProjects.forEach((projectId, index) => {
    setTimeout(() => {
      testSingleProjectModal(projectId);
    }, index * 2000); // 每2秒测试一个项目
  });
}

/**
 * 测试单个项目的 Modal 显示
 */
export function testSingleProjectModal(projectId) {
  console.log(`🧪 测试项目 ${projectId} 的 Modal 显示...`);
  
  try {
    // 找到项目数据
    const projectData = projectDetail.find(detail => detail.document_id === projectId);
    
    if (!projectData) {
      console.error(`❌ 找不到项目 ${projectId} 的数据`);
      return;
    }
    
    console.log(`✅ 找到项目 ${projectId} 的数据:`, projectData);
    
    // 创建并显示 Modal
    const modal = createProjectModal();
    modal.show(projectData);
    
    console.log(`✅ 项目 ${projectId} 的 Modal 已显示`);
    
    // 5秒后自动关闭（用于测试）
    setTimeout(() => {
      const modalElement = document.querySelector('.project-modal');
      if (modalElement) {
        modalElement.classList.remove('active');
        setTimeout(() => {
          modalElement.remove();
          console.log(`✅ 项目 ${projectId} 的 Modal 已关闭`);
        }, 300);
      }
    }, 5000);
    
  } catch (error) {
    console.error(`❌ 测试项目 ${projectId} 的 Modal 失败:`, error);
  }
}

/**
 * 测试特定项目
 */
export function testProject(projectId) {
  console.log(`🧪 测试项目: ${projectId}`);
  testSingleProjectModal(projectId);
}

/**
 * 测试 Modal 内容渲染
 */
export function testModalContentRendering() {
  console.log('🧪 测试 Modal 内容渲染...');
  
  // 测试数据
  const testData = {
    template: 'behance-project',
    basicInfo: {
      title: '测试项目',
      subtitle: '测试副标题',
      tags: ['测试', '标签']
    },
    content: {
      sections: [
        {
          type: 'text',
          content: `
            <h3>🚧 测试内容</h3>
            <p>这是一个测试项目，用于验证 Modal 渲染功能。</p>
            <p>如果你看到这个内容，说明渲染功能正常！</p>
          `
        }
      ]
    }
  };
  
  try {
    const modal = createProjectModal();
    modal.show(testData);
    
    console.log('✅ 测试 Modal 已显示，请检查内容是否正确渲染');
    
    // 10秒后自动关闭
    setTimeout(() => {
      const modalElement = document.querySelector('.project-modal');
      if (modalElement) {
        modalElement.classList.remove('active');
        setTimeout(() => {
          modalElement.remove();
          console.log('✅ 测试 Modal 已关闭');
        }, 300);
      }
    }, 10000);
    
  } catch (error) {
    console.error('❌ 测试 Modal 失败:', error);
  }
}

// 将测试函数添加到全局作用域
if (typeof window !== 'undefined') {
  window.testAllProjectModals = testAllProjectModals;
  window.testSingleProjectModal = testSingleProjectModal;
  window.testProject = testProject;
  window.testModalContentRendering = testModalContentRendering;
  
  console.log('🚀 项目 Modal 测试功能已加载，可在控制台中使用：');
  console.log('  - testAllProjectModals() - 测试所有项目');
  console.log('  - testSingleProjectModal("project_01") - 测试特定项目');
  console.log('  - testProject("project_02") - 测试特定项目');
  console.log('  - testModalContentRendering() - 测试 Modal 内容渲染');
}
