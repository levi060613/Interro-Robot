// 測試 Firebase 連接
import { fetchProjectDetailFromFirebase } from './fetchData.js';

/**
 * 測試 Firebase projectDetail collection 連接和數據獲取
 */
export async function testFirebaseConnection() {
  console.log('🧪 開始測試 Firebase projectDetail 連接...');
  
  try {
    // 測試 1: 獲取 project_01 的詳細內容
    console.log('\n📄 測試 1: 獲取 project_01 詳細內容');
    const detail = await fetchProjectDetailFromFirebase('project_01');
    
    if (detail) {
      console.log('✅ project_01 詳細內容獲取成功');
      console.log('詳細內容結構:', {
        template: detail.template,
        content: detail.content ? '存在' : '不存在',
        sections: detail.content?.sections?.length || 0
      });
      
      // 檢查內容結構
      if (detail.content && detail.content.sections) {
        console.log('\n📊 內容區塊分析:');
        detail.content.sections.forEach((section, index) => {
          console.log(`  區塊 ${index + 1}:`, {
            type: section.type,
            name: section.name,
            step: section.step,
            questions: section.questions?.length || 0,
            images: section.images?.length || 0
          });
        });
      }
      
      // 檢查問題標籤
      if (detail.content && detail.content.sections) {
        console.log('\n🏷️ 問題標籤分析:');
        const allQuestions = detail.content.sections.flatMap(section => section.questions || []);
        const labels = [...new Set(allQuestions.map(q => q.label).filter(Boolean))];
        console.log('發現的問題標籤:', labels);
      }
      
    } else {
      console.log('❌ project_01 詳細內容獲取失敗');
    }
    
  } catch (error) {
    console.error('❌ Firebase projectDetail 連接測試失敗:', error);
  }
  
  console.log('\n🏁 Firebase projectDetail 連接測試完成');
}

/**
 * 測試特定項目的詳細內容
 * @param {string} documentId - 項目文檔ID
 */
export async function testSpecificProject(documentId) {
  console.log(`🧪 測試特定項目: ${documentId}`);
  
  try {
    const detail = await fetchProjectDetailFromFirebase(documentId);
    console.log('✅ 項目詳細內容:', detail);
    
    // 檢查模板類型
    console.log(`📋 模板類型: ${detail.template || '未指定'}`);
    
    // 檢查內容結構
    if (detail.content && detail.content.sections) {
      console.log('📊 內容結構分析:');
      detail.content.sections.forEach((section, index) => {
        console.log(`  區塊 ${index + 1}:`, {
          type: section.type,
          name: section.name,
          step: section.step,
          questions: section.questions?.length || 0,
          images: section.images?.length || 0
        });
        
        // 顯示問題詳情
        if (section.questions && section.questions.length > 0) {
          console.log(`    問題列表:`);
          section.questions.forEach((q, qIndex) => {
            console.log(`      ${qIndex + 1}. [${q.label || '無標籤'}] ${q.text}`);
          });
        }
      });
    } else if (detail.content) {
      console.log('📊 內容結構分析: 非區塊結構內容');
      console.log('內容類型:', typeof detail.content);
    }
    
  } catch (error) {
    console.error('❌ 獲取項目詳細內容失敗:', error);
  }
}

/**
 * 測試所有可用的項目詳情
 */
export async function testAllProjectDetails() {
  console.log('🧪 測試所有項目詳情...');
  
  // 測試所有項目（project_01~05）
  const projectIds = ['project_01', 'project_02', 'project_03', 'project_04', 'project_05'];
  
  for (const projectId of projectIds) {
    try {
      console.log(`\n📄 測試 ${projectId}...`);
      const detail = await fetchProjectDetailFromFirebase(projectId);
      console.log(`✅ ${projectId} 獲取成功`);
      console.log(`   模板: ${detail.template || '未指定'}`);
      
      if (detail.content) {
        if (detail.content.sections) {
          console.log(`   內容區塊: ${detail.content.sections.length} 個`);
        } else {
          console.log(`   內容類型: ${typeof detail.content}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ ${projectId} 不存在或獲取失敗:`, error.message);
    }
  }
  
  console.log('\n🏁 所有項目詳情測試完成');
}

/**
 * 測試特定模板類型的項目
 * @param {string} templateType - 模板類型，如 'coming-soon', 'behance-project'
 */
export async function testTemplateProjects(templateType) {
  console.log(`🧪 測試 ${templateType} 模板的項目...`);
  
  const projectIds = ['project_01', 'project_02', 'project_03', 'project_04', 'project_05'];
  const matchingProjects = [];
  
  for (const projectId of projectIds) {
    try {
      const detail = await fetchProjectDetailFromFirebase(projectId);
      if (detail.template === templateType) {
        matchingProjects.push(projectId);
        console.log(`✅ ${projectId} 使用 ${templateType} 模板`);
      }
    } catch (error) {
      // 忽略不存在的項目
    }
  }
  
  if (matchingProjects.length > 0) {
    console.log(`\n📋 使用 ${templateType} 模板的項目:`, matchingProjects);
  } else {
    console.log(`\n❌ 沒有找到使用 ${templateType} 模板的項目`);
  }
  
  console.log(`\n🏁 ${templateType} 模板測試完成`);
}

/**
 * 詳細檢查 coming-soon 模板的數據
 */
export async function testComingSoonDetails() {
  console.log('🧪 詳細檢查 coming-soon 模板數據...');
  
  const projectIds = ['project_03', 'project_04', 'project_05'];
  
  for (const projectId of projectIds) {
    try {
      console.log(`\n📄 檢查 ${projectId}...`);
      const detail = await fetchProjectDetailFromFirebase(projectId);
      
      if (detail.template === 'coming-soon') {
        console.log(`✅ ${projectId} 正確使用 coming-soon 模板`);
        console.log('📋 模板數據結構:');
        console.log('  - template:', detail.template);
        console.log('  - content:', detail.content ? '存在' : '不存在');
        
        if (detail.content && detail.content.sections) {
          console.log('  - sections:', detail.content.sections.length, '個區塊');
          detail.content.sections.forEach((section, index) => {
            console.log(`    區塊 ${index + 1}:`, {
              type: section.type,
              content: section.content ? '有內容' : '無內容'
            });
          });
        }
        
        if (detail.content && detail.content.firstImage) {
          console.log('  - firstImage:', detail.content.firstImage.images ? detail.content.firstImage.images.length + ' 張圖片' : '無圖片');
        }
        
      } else {
        console.log(`❌ ${projectId} 模板不正確: ${detail.template || '未指定'}`);
      }
      
    } catch (error) {
      console.log(`❌ ${projectId} 獲取失敗:`, error.message);
    }
  }
  
  console.log('\n🏁 coming-soon 詳細檢查完成');
}

/**
 * 驗證 Firebase 數據是否正確上傳
 */
export async function validateFirebaseData() {
  console.log('🔍 驗證 Firebase 數據是否正確上傳...');
  
  const projectIds = ['project_01', 'project_02', 'project_03', 'project_04', 'project_05'];
  const results = {};
  
  for (const projectId of projectIds) {
    try {
      const detail = await fetchProjectDetailFromFirebase(projectId);
      results[projectId] = {
        exists: true,
        template: detail.template || '未指定',
        hasContent: !!detail.content,
        sections: detail.content?.sections?.length || 0
      };
      console.log(`✅ ${projectId}: ${detail.template || '未指定'} 模板`);
    } catch (error) {
      results[projectId] = {
        exists: false,
        error: error.message
      };
      console.log(`❌ ${projectId}: 不存在或獲取失敗`);
    }
  }
  
  console.log('\n📊 驗證結果摘要:');
  console.table(results);
  
  return results;
}

// 在瀏覽器控制台中運行測試
if (typeof window !== 'undefined') {
  window.testFirebaseConnection = testFirebaseConnection;
  window.testSpecificProject = testSpecificProject;
  window.testAllProjectDetails = testAllProjectDetails;
  window.testTemplateProjects = testTemplateProjects;
  window.testComingSoonDetails = testComingSoonDetails;
  window.validateFirebaseData = validateFirebaseData;
  
  console.log('🚀 Firebase projectDetail 測試功能已載入，可在控制台中使用：');
  console.log('  - await testFirebaseConnection()');
  console.log('  - await testSpecificProject("project_01")');
  console.log('  - await testAllProjectDetails()');
  console.log('  - await testTemplateProjects("coming-soon")');
  console.log('  - await testComingSoonDetails()');
  console.log('  - await validateFirebaseData()');
} 