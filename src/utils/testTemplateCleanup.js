// 測試模板清理結果
import { templates } from '../components_fn/projectDetail/templates.js';
import { components } from '../components_fn/projectDetail/components.js';

/**
 * 測試模板清理結果
 */
export function testTemplateCleanup() {
  console.log('🧪 測試模板清理結果...');
  
  // 檢查可用的模板
  console.log('\n📋 可用的模板:');
  Object.keys(templates).forEach(templateName => {
    console.log(`  ✅ ${templateName}`);
  });
  
  // 檢查可用的組件
  console.log('\n🔧 可用的組件:');
  Object.keys(components).forEach(componentName => {
    console.log(`  ✅ ${componentName}`);
  });
  
  // 驗證模板組件依賴
  console.log('\n🔗 模板組件依賴檢查:');
  Object.entries(templates).forEach(([templateName, template]) => {
    console.log(`\n📄 ${templateName} 模板:`);
    if (template.components) {
      template.components.forEach(componentName => {
        if (components[componentName]) {
          console.log(`  ✅ ${componentName} - 存在`);
        } else {
          console.log(`  ❌ ${componentName} - 不存在`);
        }
      });
    }
  });
  
  // 檢查是否還有舊模板的引用
  const oldTemplates = ['interro-project', 'hahow-project', 'default-project'];
  const foundOldTemplates = oldTemplates.filter(template => templates[template]);
  
  if (foundOldTemplates.length > 0) {
    console.log('\n⚠️  發現舊模板引用:');
    foundOldTemplates.forEach(template => {
      console.log(`  ❌ ${template}`);
    });
  } else {
    console.log('\n✅ 沒有發現舊模板引用');
  }
  
  console.log('\n🏁 模板清理測試完成');
}

/**
 * 測試專案模板設定
 */
export function testProjectTemplates() {
  console.log('🧪 測試專案模板設定...');
  
  // 模擬專案數據
  const testProjects = [
    {
      id: 'project_01',
      template: 'behance-project',
      expected: 'behance-project'
    },
    {
      id: 'project_02', 
      template: 'behance-project',
      expected: 'behance-project'
    },
    {
      id: 'project_03',
      template: 'coming-soon',
      expected: 'coming-soon'
    },
    {
      id: 'project_04',
      template: 'coming-soon', 
      expected: 'coming-soon'
    },
    {
      id: 'project_05',
      template: 'coming-soon',
      expected: 'coming-soon'
    }
  ];
  
  console.log('\n📊 專案模板設定檢查:');
  testProjects.forEach(project => {
    const templateExists = templates[project.template];
    const status = templateExists ? '✅' : '❌';
    console.log(`${status} ${project.id}: ${project.template} (期望: ${project.expected})`);
  });
  
  console.log('\n🏁 專案模板設定測試完成');
}

// 在瀏覽器控制台中運行測試
if (typeof window !== 'undefined') {
  window.testTemplateCleanup = testTemplateCleanup;
  window.testProjectTemplates = testProjectTemplates;
  
  console.log('🚀 模板清理測試功能已載入，可在控制台中使用：');
  console.log('  - testTemplateCleanup()');
  console.log('  - testProjectTemplates()');
} 