# Firebase 串接設置說明

## 🎉 完成的功能

您的項目現在已經成功串接 Firebase API，可以從 Firebase 的 `projectDetail` collection 獲取項目詳情數據！

### ✅ 主要改進

1. **智能數據獲取**: 從 Firebase `projectDetail` collection 獲取項目詳情，失敗時自動降級到本地數據
2. **多項目支持**: 支持 project_01~05 所有項目的 Firebase 串接
3. **模板系統**: 根據 `template` 欄位自動選擇對應模板（如 `coming-soon`、`behance-project`）
4. **快取機制**: 5分鐘快取，提升載入速度
5. **錯誤處理**: 完善的錯誤處理和用戶友好的錯誤提示
6. **測試工具**: 開發環境中的測試功能

## 🧪 測試方法

### 1. 在瀏覽器控制台測試

打開瀏覽器控制台，可以使用以下命令：

```javascript
// 測試 Firebase projectDetail 連接和數據獲取
await testFirebaseConnection();

// 測試特定項目
await testSpecificProject('project_01');

// 測試所有項目詳情（project_01~05）
await testAllProjectDetails();

// 測試特定模板類型的項目
await testTemplateProjects('coming-soon');
```

### 2. 測試輸出示例

```
🧪 開始測試 Firebase projectDetail 連接...

📄 測試 1: 獲取 project_01 詳細內容
✅ project_01 詳細內容獲取成功
詳細內容結構: { template: "behance-project", content: "存在", sections: 5 }

📊 內容區塊分析:
  區塊 1: { type: "imgBlock", name: "專案背景介紹", step: 1, questions: 3, images: 1 }
  區塊 2: { type: "imgBlock", name: "研究解方與設計", step: 2, questions: 3, images: 2 }
  區塊 3: { type: "imgBlock", name: "設計系統", step: 3, questions: 3, images: 1 }
  區塊 4: { type: "imgBlock", name: "Onboarding 流程設計", step: 4, questions: 3, images: 2 }
  區塊 5: { type: "imgBlock", name: "版本迭代設計", step: 5, questions: 3, images: 3 }

🏷️ 問題標籤分析:
發現的問題標籤: ["技術能力評估", "專案開發細節"]

🏁 Firebase projectDetail 連接測試完成
```

## 📊 數據流程

### 項目列表載入
1. 使用本地項目列表數據（基本資訊）
2. 項目卡片顯示基本資訊（標題、描述、標籤等）

### 項目詳情載入
1. 點擊項目卡片
2. 顯示載入狀態
3. 從 Firebase `projectDetail` collection 獲取詳細內容
4. 根據 `template` 欄位選擇對應模板
5. 如果失敗，使用本地數據
6. 更新模態框內容

## 🏗️ Firebase 數據結構

### projectDetail Collection

#### project_01 (behance-project 模板)
```javascript
{
  template: "behance-project",
  content: {
    firstImage: { images: [...] },
    sections: [
      {
        type: "imgBlock",
        step: 1,
        name: "專案背景介紹",
        images: [...],
        questions: [
          {
            id: "q500",
            label: "技術能力評估",
            text: "你所說的技術具體掌握到什麼程度？",
            reply: "..."
          }
        ]
      }
    ]
  }
}
```

#### project_03~05 (coming-soon 模板)
```javascript
{
  template: "coming-soon",
  content: {
    firstImage: {
      images: [
        {
          src: "...",
          caption: "即將推出"
        }
      ]
    },
    sections: [
      {
        type: "text",
        content: `
          <div class="coming-soon-content">
            <h2>🚧 專案正在準備中</h2>
            <p>這個專案的詳細內容正在整理中，很快就會與大家見面！</p>
            <p>敬請期待...</p>
          </div>
        `
      }
    ]
  }
}
```

## 🔧 文件修改說明

### 修改的文件

1. **`src/utils/fetchData.js`**
   - 增強了 `fetchProjectDetailFromFirebase` 函數
   - 添加了快取機制
   - 改進了錯誤處理

2. **`src/pages/projectList.js`**
   - 專注於從 `projectDetail` collection 獲取詳細內容
   - 根據 `template` 欄位自動選擇模板
   - 改進了錯誤處理和載入狀態
   - 添加了降級機制

3. **`src/utils/testFirebase.js`** (新增)
   - 測試 `projectDetail` collection 連接
   - 驗證項目詳情數據獲取
   - 分析內容結構和問題標籤
   - 支持測試特定模板類型

4. **`src/utils/uploadComingSoonProject.js`** (新增)
   - 上傳 coming-soon 模板的示例數據
   - 支持 project_03~05 的 coming-soon 內容

5. **`src/main.js`**
   - 引入測試功能

6. **`index.html`**
   - 添加 coming-soon 項目上傳腳本

## 🎨 支持的模板類型

### 1. behance-project
- 用於完整的項目展示
- 包含多個內容區塊和問題
- 適合詳細的項目介紹

### 2. coming-soon
- 用於尚未完成的項目
- 顯示"即將推出"的提示
- 簡潔的等待頁面

### 3. interro-project
- 用於 Interro 項目的特殊模板
- 包含特定的組件組合

### 4. hahow-project
- 用於 Hahow 項目的特殊模板
- 包含特定的組件組合

## 🚀 下一步

1. **測試連接**: 在開發環境中測試 Firebase `projectDetail` 連接
2. **檢查數據**: 確認所有項目詳情正確顯示
3. **上傳更多數據**: 使用上傳腳本上傳更多項目到 `projectDetail` collection
4. **監控性能**: 使用瀏覽器開發者工具監控載入性能
5. **自定義模板**: 根據需要創建新的模板類型

## 🛠️ 故障排除

### 常見問題

1. **Firebase 連接失敗**
   - 檢查網絡連接
   - 確認 Firebase 配置正確
   - 檢查 Firebase 項目權限

2. **數據不顯示**
   - 確認 `document_id` 正確（如 "project_01"）
   - 檢查 Firebase 中 `projectDetail` collection 是否有對應文檔
   - 使用測試功能驗證

3. **模板不正確**
   - 確認 `template` 欄位設置正確
   - 檢查模板是否在 `templates.js` 中定義
   - 使用 `testTemplateProjects()` 測試特定模板

4. **快取問題**
   - 清除瀏覽器快取
   - 重新載入頁面

### 調試命令

```javascript
// 清除快取
clearProjectDetailCache();

// 手動獲取項目詳情
const detail = await fetchProjectDetailFromFirebase('project_01');
console.log(detail);

// 測試所有項目
await testAllProjectDetails();

// 測試特定模板
await testTemplateProjects('coming-soon');
```

## 📝 注意事項

- 測試功能只在開發環境中可用
- 快取時間為 5 分鐘，可根據需要調整
- 錯誤處理會自動降級到本地數據
- 所有 Firebase 操作都有詳細的日誌輸出
- 主要數據來源是 `projectDetail` collection，不是 `projects` collection
- 模板選擇基於 Firebase 數據中的 `template` 欄位
- 支持 project_01~05 所有項目的 Firebase 串接

現在您的項目已經完全支持從 Firebase `projectDetail` collection 串接數據，並支持多種模板類型了！🎉 