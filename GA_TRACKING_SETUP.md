# Google Analytics 項目追踪設置指南

## 統一的數據結構

本專案使用 **Firebase Analytics SDK** 直接發送事件到 GA4，所有追踪事件都通過 `sendInteractionEvent()` 函數統一處理。

### 事件發送方式

```javascript
import { sendInteractionEvent } from './utils/positionAnalytics.js';

// 發送事件
sendInteractionEvent('event_name', {
  param1: "value1",
  param2: "value2"
  // 自定義參數
});
```

### 自動添加的通用參數

`sendInteractionEvent()` 函數會自動為所有事件添加以下參數：

- **timestamp**: ISO 8601 格式的時間戳，記錄事件發生的精確時間
- **user_position**: 用戶選擇的職位（從 localStorage 獲取），未選擇時為 "未選擇"

**注意**：使用 Firebase Analytics SDK 後，事件會直接發送到 GA4，**不需要通過 GTM 配置**。

## 已實現的追踪事件

本專案已經實現了以下 GA 事件追踪功能：

### 1. 首頁開始面試按鈕點擊追踪
**事件名稱**: `start_interview_click`

**代碼實現**:
```javascript
sendInteractionEvent('start_interview_click', {
  button_location: 'homepage',
  button_text: '開始面試',
  target_path: '/chatRoom'
});
```

**發送到 GA4 的完整數據**:
```javascript
{
  button_location: "homepage",
  button_text: "開始面試",
  target_path: "/chatRoom",
  timestamp: "2025-10-14T14:11:29.082Z",  // 自動添加
  user_position: "未選擇"  // 自動添加
}
```

**觸發時機**: 當用戶在首頁點擊 "開始面試" 按鈕時

---

### 2. 首頁輪播卡片點擊追踪
**事件名稱**: `homepage_carousel_click`

**代碼實現**:
```javascript
sendInteractionEvent('homepage_carousel_click', {
  carousel_index: 0,
  project_title: '項目標題'
});
```

**觸發時機**: 當用戶在首頁點擊任何一個輪播卡片時

---

### 3. 項目列表卡片點擊追踪
**事件名稱**: `project_card_click`

**代碼實現**:
```javascript
sendInteractionEvent('project_card_click', {
  project_id: 'project_01',
  project_title: '項目標題',
  project_year: '2024'
});
```

**觸發時機**: 當用戶在項目列表頁面點擊任何一個項目卡片時

---

### 4. 聊天室項目按鈕點擊追踪
**事件名稱**: `chatroom_project_button_click`

**代碼實現**:
```javascript
sendInteractionEvent('chatroom_project_button_click', {
  project_id: 'project_02',
  project_title: '項目標題',
  button_text: '查看六角學院 UI專題'
});
```

**觸發時機**: 當用戶在聊天室的自介訊息中點擊項目按鈕時

---

### 5. 聊天室選項面板切換按鈕點擊追踪
**事件名稱**: `switch_button_click`

**代碼實現**:
```javascript
sendInteractionEvent('switch_button_click', {
  button_action: 'open',
  button_location: 'chatroom_option_panel',
  button_text: '按鈕文字'
});
```

**觸發時機**: 當用戶在聊天室點擊選項面板的切換按鈕時

---

### 6. 項目詳情問題按鈕點擊追踪
**事件名稱**: `question_switch_button_click`

**代碼實現**:
```javascript
sendInteractionEvent('question_switch_button_click', {
  button_action: 'open',
  button_location: 'project_modal',
  project_title: '項目標題'
});
```

**觸發時機**: 當用戶在項目詳情 Modal 中點擊 "看到這裡，也許你會想問⋯⋯" 按鈕時

---

### 7. 項目 Modal 打開追踪
**事件名稱**: `project_modal_open`

**代碼實現**:
```javascript
sendInteractionEvent('project_modal_open', {
  project_title: '項目標題',
  project_template: 'behance-project',
  project_tags: 'UI設計, UX研究'
});
```

**觸發時機**: 當項目詳情 Modal 成功打開並顯示內容時

**注意**: 為避免錯誤追踪，此事件會自動排除 `error` 模板，只追踪實際的項目內容展示

---

### 8. 項目 Modal 停留時長追踪
**事件名稱**: `project_modal_duration`

**代碼實現**:
```javascript
sendInteractionEvent('project_modal_duration', {
  project_title: '項目標題',
  project_template: 'behance-project',
  duration_seconds: 45,
  duration_category: '30-60秒'
});
```

**停留時長分類**:
  - "0-5秒"
  - "5-15秒"
  - "15-30秒"
  - "30-60秒"
  - "1-2分鐘"
  - "2-5分鐘"
  - "5分鐘以上"

**觸發時機**: 當用戶關閉項目詳情 Modal 時（點擊關閉按鈕或點擊外部區域）

**用途**: 了解用戶對不同項目的興趣程度和參與度

---

## 測試追踪

### 1. 使用瀏覽器控制台檢查 Firebase Analytics 事件
打開瀏覽器開發者工具（F12），查看控制台日誌：
代碼中已經添加了 console.log，您可以在控制台中看到類似以下的訊息：
- `[GA] 已發送開始面試按鈕點擊事件:`
- `[GA] 已發送首頁輪播點擊事件:`
- `[GA] 已發送項目卡片點擊事件:`
- `[GA] 已發送聊天室項目按鈕點擊事件:`
- `[GA] 已發送 SwitchButton 點擊事件:`
- `[GA] 已發送項目問題按鈕點擊事件:`
- `[GA] 已發送 Modal 打開事件:`
- `[Modal] 已記錄打開時間:`
- `[GA] 已發送 Modal 停留時長事件:`

---

## GA4 報表查看

設置完成後，您可以在 GA4 中查看以下報表：

### 1. 即時報表
路徑: GA4 → 報表 → 即時
- 查看即時的事件觸發情況

### 2. 事件報表
路徑: GA4 → 報表 → 參與 → 事件
- 查看所有自訂事件的總覽
- 點擊特定事件名稱查看詳細數據

### 3. 自訂報表
建議創建自訂報表來分析：
- **最受歡迎的項目**：按 `project_title` 統計 `project_modal_open` 事件
- **用戶瀏覽路徑**：分析從首頁輪播到項目列表再到 Modal 打開的完整路徑
- **輪播卡片效能**：按 `carousel_index` 統計點擊率

---

## 建議追踪的指標

1. **項目瀏覽率**
   - 計算: `project_modal_open` 事件數 / `project_card_click` 事件數
   - 意義: 了解有多少用戶在點擊項目卡片後真正查看了項目詳情

2. **最受歡迎的項目**
   - 按 `project_title` 排序 `project_modal_open` 事件數
   - 意義: 了解哪些項目最吸引訪客

3. **首頁輪播效能**
   - 按 `carousel_index` 統計點擊次數
   - 意義: 了解輪播中哪個位置的卡片最容易被點擊

4. **項目類型分析**
   - 按 `project_template` 或 `project_tags` 分組
   - 意義: 了解訪客對不同類型項目的興趣

5. **項目停留時長分析** ⭐ 新增
   - 按 `project_title` 查看平均 `duration_seconds`
   - 按 `duration_category` 統計分布
   - 意義: 
     - **停留時間越長 = 用戶對該項目越感興趣**
     - 0-5秒：可能只是誤點或內容不吸引人
     - 5-30秒：快速瀏覽
     - 30-120秒：認真閱讀
     - 2分鐘以上：深度參與

6. **用戶參與度組合分析**
   - 結合 `project_modal_duration` 和 `question_switch_button_click`
   - 意義: 停留時間長 + 點擊問題按鈕 = 高度感興趣的用戶

---

## 注意事項

1. **數據收集延遲**: GA4 數據通常會有 24-48 小時的延遲，即時報表除外
2. **隱私合規**: 確保您的網站有適當的隱私政策和 Cookie 同意機制
3. **事件命名**: 建議使用小寫字母和底線，符合 GA4 命名規範
4. **數據保留**: 檢查 GA4 的數據保留設置，確保設置為適當的時間長度

---

## 故障排除

### 問題 1: 事件沒有被追踪
**解決方案**:
1. 檢查瀏覽器控制台是否有錯誤訊息
2. 確認 Firebase SDK 已正確初始化
3. 檢查 Firebase 配置（firebaseConfig）是否正確
4. 查看控制台日誌，確認是否有 `[Position Analytics] 交互事件已发送:` 的訊息

### 問題 2: 事件在控制台顯示但在 GA4 即時報表中看不到
**解決方案**:
1. 確認 Firebase 項目已正確連結到 GA4
2. 等待 1-2 分鐘（即時報表有短暫延遲）
3. 檢查 GA4 測量 ID 是否與 Firebase 配置一致
4. 確認沒有使用廣告攔截器（可能會阻擋 Analytics 請求）

### 問題 3: 部分事件參數缺失或顯示 undefined
**解決方案**:
1. 檢查代碼中傳遞給 `sendInteractionEvent()` 的參數是否正確
2. 確認數據來源（如 `projectData` 或 `project` 物件）的結構完整
3. 使用可選鏈運算符 `?.` 處理可能為空的數據
4. 在 GA4 中檢查自定義維度是否已正確註冊

---

## 更新日誌

**2025-10-14 (v2.0) - 重大更新**
- ✅ **改用 Firebase Analytics SDK 直接發送事件**，不再使用 GTM dataLayer
- ✅ 統一使用 `sendInteractionEvent()` 函數處理所有事件
- ✅ 自動添加 `timestamp` 和 `user_position` 參數
- ✅ 簡化事件追踪邏輯，減少配置複雜度
- ✅ 更新文檔，移除 GTM 相關配置說明

**2024-10-14 (v1.0) - 初始版本**
- ✅ 新增首頁開始面試按鈕點擊追踪
- ✅ 新增首頁輪播卡片點擊追踪
- ✅ 新增項目列表卡片點擊追踪
- ✅ 新增聊天室項目按鈕點擊追踪
- ✅ 新增聊天室選項面板切換按鈕追踪
- ✅ 新增項目詳情問題按鈕追踪
- ✅ 新增項目 Modal 打開追踪
- ✅ 新增項目 Modal 停留時長追踪（含時長分類）
- ✅ 添加控制台日誌以便調試
- ✅ 優化 Modal 追踪邏輯：排除 error 模板，避免錯誤追踪
- ✅ 移除 Loading 狀態：直接顯示項目內容，提升用戶體驗
- ✅ 修復首頁輪播重複綁定問題：防止 GA 事件重複觸發

---

## 聯絡支援

如有任何問題，請參考：
- [Google Analytics 4 說明文件](https://support.google.com/analytics/)
- [Firebase Analytics 說明文件](https://firebase.google.com/docs/analytics)


