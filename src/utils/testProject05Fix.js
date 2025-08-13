// 測試 project_05 修復
import { createProjectModal } from '../components_fn/projectDetail/modal.js';
import { projectCards } from './tempData.js';

/**
 * 測試 project_05 修復
 */
export function testProject05Fix() {
  console.log('🧪 測試 project_05 修復...');
  
  try {
    // 找到 project_05
    const project05 = projectCards.find(p => p.document_id === 'project_05');
    
    if (!project05) {
      console.error('❌ 找不到 project_05');
      return;
    }
    
    console.log('✅ 找到 project_05:', project05);
    
    const modal = createProjectModal();
    
    // 模擬 project_05 的資料（Firebase 失敗時的情況）
    const project05Data = {
      template: 'coming-soon',
      basicInfo: {
        title: project05.title,
        subtitle: project05.subtitle,
        tags: project05.tags
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
    modal.show(project05Data);
    
    console.log('✅ project_05 Coming Soon 模板已顯示');
    
  } catch (error) {
    console.error('❌ 測試 project_05 修復失敗:', error);
  }
}

/**
 * 測試所有 coming-soon 專案
 */
export function testAllComingSoonProjects() {
  console.log('🧪 測試所有 coming-soon 專案...');
  
  const comingSoonProjects = projectCards.filter(p => p.template === 'coming-soon');
  
  console.log(`📊 找到 ${comingSoonProjects.length} 個 coming-soon 專案:`, comingSoonProjects.map(p => p.document_id));
  
  comingSoonProjects.forEach((project, index) => {
    console.log(`\n📄 專案 ${index + 1}: ${project.title} (${project.document_id})`);
    console.log(`   模板: ${project.template}`);
    console.log(`   標籤: ${project.tags.join(', ')}`);
  });
  
  // 測試第一個 coming-soon 專案
  if (comingSoonProjects.length > 0) {
    const firstProject = comingSoonProjects[0];
    console.log(`\n🎯 測試第一個 coming-soon 專案: ${firstProject.title}`);
    
    const modal = createProjectModal();
    const projectData = {
      template: 'coming-soon',
      basicInfo: {
        title: firstProject.title,
        subtitle: firstProject.subtitle,
        tags: firstProject.tags
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
    
    modal.show(projectData);
  }
}

/**
 * 驗證專案資料完整性
 */
export function validateProjectData() {
  console.log('🔍 驗證專案資料完整性...');
  
  const issues = [];
  
  // 檢查所有專案是否有 document_id
  projectCards.forEach((project, index) => {
    if (!project.document_id) {
      issues.push(`專案 ${index + 1} (${project.title}) 缺少 document_id`);
    }
    
    if (!project.template) {
      issues.push(`專案 ${index + 1} (${project.title}) 缺少 template`);
    }
    
    // 檢查 document_id 格式
    if (project.document_id && project.document_id.includes(' ')) {
      issues.push(`專案 ${index + 1} (${project.title}) document_id 包含空格: "${project.document_id}"`);
    }
  });
  
  if (issues.length > 0) {
    console.log('❌ 發現問題:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  } else {
    console.log('✅ 所有專案資料完整');
  }
  
  // 顯示專案摘要
  console.log('\n📊 專案摘要:');
  projectCards.forEach(project => {
    console.log(`  ${project.document_id}: ${project.title} (${project.template})`);
  });
}

// 在瀏覽器控制台中運行測試
if (typeof window !== 'undefined') {
  window.testProject05Fix = testProject05Fix;
  window.testAllComingSoonProjects = testAllComingSoonProjects;
  window.validateProjectData = validateProjectData;
  
  console.log('🚀 project_05 修復測試功能已載入，可在控制台中使用：');
  console.log('  - testProject05Fix() - 測試 project_05 修復');
  console.log('  - testAllComingSoonProjects() - 測試所有 coming-soon 專案');
  console.log('  - validateProjectData() - 驗證專案資料完整性');
} 