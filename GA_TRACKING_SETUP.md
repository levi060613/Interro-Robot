# Google Analytics 項目追踪設置指南

## 已實現的追踪事件

本專案已經實現了以下 GA 事件追踪功能：

### 1. 首頁開始面試按鈕點擊追踪
**事件名稱**: `start_interview_click`

**追踪數據**:
- `event`: "start_interview_click"
- `button_location`: 按鈕位置 ("homepage")
- `button_text`: 按鈕文字 ("開始面試")
- `target_path`: 目標路徑 ("/chatRoom")

**觸發時機**: 當用戶在首頁點擊 "開始面試" 按鈕時

---

### 2. 首頁輪播卡片點擊追踪
**事件名稱**: `homepage_carousel_click`

**追踪數據**:
- `event`: "homepage_carousel_click"
- `carousel_index`: 卡片索引位置 (0-4)
- `project_title`: 項目標題

**觸發時機**: 當用戶在首頁點擊任何一個輪播卡片時

---

### 3. 項目列表卡片點擊追踪
**事件名稱**: `project_card_click`

**追踪數據**:
- `event`: "project_card_click"
- `project_id`: 項目文檔 ID (例如: "project_01")
- `project_title`: 項目標題
- `project_year`: 項目年份

**觸發時機**: 當用戶在項目列表頁面點擊任何一個項目卡片時

---

### 4. 聊天室項目按鈕點擊追踪
**事件名稱**: `chatroom_project_button_click`

**追踪數據**:
- `event`: "chatroom_project_button_click"
- `project_id`: 項目文檔 ID (例如: "project_02")
- `project_title`: 項目標題
- `button_text`: 按鈕文字 (例如: "查看六角學院 UI專題")

**觸發時機**: 當用戶在聊天室的自介訊息中點擊項目按鈕時

---

### 5. 聊天室選項面板切換按鈕點擊追踪
**事件名稱**: `switch_button_click`

**追踪數據**:
- `event`: "switch_button_click"
- `button_action`: 按鈕動作 ("open" 或 "close")
- `button_location`: 按鈕位置 ("chatroom_option_panel")
- `button_text`: 按鈕文字

**觸發時機**: 當用戶在聊天室點擊選項面板的切換按鈕時

---

### 6. 項目詳情問題按鈕點擊追踪
**事件名稱**: `question_switch_button_click`

**追踪數據**:
- `event`: "question_switch_button_click"
- `button_action`: 按鈕動作 ("open" 或 "close")
- `button_location`: 按鈕位置 ("project_modal")
- `project_title`: 所屬項目標題

**觸發時機**: 當用戶在項目詳情 Modal 中點擊 "看到這裡，也許你會想問⋯⋯" 按鈕時

---

### 7. 項目 Modal 打開追踪
**事件名稱**: `project_modal_open`

**追踪數據**:
- `event`: "project_modal_open"
- `project_title`: 項目標題
- `project_template`: 使用的模板類型 (例如: "behance-project", "coming-soon")
- `project_tags`: 項目標籤 (逗號分隔)

**觸發時機**: 當項目詳情 Modal 成功打開並顯示內容時

**注意**: 為避免錯誤追踪，此事件會自動排除 `error` 模板，只追踪實際的項目內容展示

---

### 8. 項目 Modal 停留時長追踪
**事件名稱**: `project_modal_duration`

**追踪數據**:
- `event`: "project_modal_duration"
- `project_title`: 項目標題
- `project_template`: 使用的模板類型
- `duration_seconds`: 停留秒數 (整數)
- `duration_category`: 停留時長分類
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

## Google Tag Manager 配置步驟

### 步驟 1: 創建數據層變量 (Data Layer Variables)

在 GTM 中創建以下變量：

1. **carousel_index**
   - 變數類型: 資料層變數
   - 資料層變數名稱: `carousel_index`

2. **project_id**
   - 變數類型: 資料層變數
   - 資料層變數名稱: `project_id`

3. **project_title**
   - 變數類型: 資料層變數
   - 資料層變數名稱: `project_title`

4. **project_year**
   - 變數類型: 資料層變數
   - 資料層變數名稱: `project_year`

5. **project_template**
   - 變數類型: 資料層變數
   - 資料層變數名稱: `project_template`

6. **project_tags**
   - 變數類型: 資料層變數
   - 資料層變數名稱: `project_tags`

7. **button_text**
   - 變數類型: 資料層變數
   - 資料層變數名稱: `button_text`

8. **duration_seconds**
   - 變數類型: 資料層變數
   - 資料層變數名稱: `duration_seconds`

9. **duration_category**
   - 變數類型: 資料層變數
   - 資料層變數名稱: `duration_category`

### 步驟 2: 創建觸發條件 (Triggers)

#### 觸發條件 1: 首頁輪播點擊
- 觸發條件類型: 自訂事件
- 事件名稱: `homepage_carousel_click`

#### 觸發條件 2: 項目卡片點擊
- 觸發條件類型: 自訂事件
- 事件名稱: `project_card_click`

#### 觸發條件 3: 聊天室項目按鈕點擊
- 觸發條件類型: 自訂事件
- 事件名稱: `chatroom_project_button_click`

#### 觸發條件 4: Modal 打開
- 觸發條件類型: 自訂事件
- 事件名稱: `project_modal_open`

#### 觸發條件 5: Modal 停留時長
- 觸發條件類型: 自訂事件
- 事件名稱: `project_modal_duration`

### 步驟 3: 創建 GA4 事件代碼 (Tags)

#### 代碼 1: 追踪首頁輪播點擊
- 代碼類型: GA4 事件
- 配置代碼: [您的 GA4 配置代碼]
- 事件名稱: `homepage_carousel_click`
- 事件參數:
  - `carousel_index`: {{carousel_index}}
  - `project_title`: {{project_title}}
- 觸發條件: 首頁輪播點擊

#### 代碼 2: 追踪項目卡片點擊
- 代碼類型: GA4 事件
- 配置代碼: [您的 GA4 配置代碼]
- 事件名稱: `project_card_click`
- 事件參數:
  - `project_id`: {{project_id}}
  - `project_title`: {{project_title}}
  - `project_year`: {{project_year}}
- 觸發條件: 項目卡片點擊

#### 代碼 3: 追踪聊天室項目按鈕點擊
- 代碼類型: GA4 事件
- 配置代碼: [您的 GA4 配置代碼]
- 事件名稱: `chatroom_project_button_click`
- 事件參數:
  - `project_id`: {{project_id}}
  - `project_title`: {{project_title}}
  - `button_text`: {{button_text}}
- 觸發條件: 聊天室項目按鈕點擊

#### 代碼 4: 追踪 Modal 打開
- 代碼類型: GA4 事件
- 配置代碼: [您的 GA4 配置代碼]
- 事件名稱: `project_modal_open`
- 事件參數:
  - `project_title`: {{project_title}}
  - `project_template`: {{project_template}}
  - `project_tags`: {{project_tags}}
- 觸發條件: Modal 打開

#### 代碼 5: 追踪 Modal 停留時長
- 代碼類型: GA4 事件
- 配置代碼: [您的 GA4 配置代碼]
- 事件名稱: `project_modal_duration`
- 事件參數:
  - `project_title`: {{project_title}}
  - `project_template`: {{project_template}}
  - `duration_seconds`: {{duration_seconds}}
  - `duration_category`: {{duration_category}}
- 觸發條件: Modal 停留時長

---

## 測試追踪

### 1. 使用 GTM 預覽模式
1. 在 GTM 中點擊「預覽」按鈕
2. 輸入您的網站 URL
3. 在預覽視窗中執行以下操作：
   - 點擊首頁輪播卡片
   - 點擊項目列表中的項目卡片
   - 在聊天室中點擊項目按鈕
   - 等待 Modal 打開
4. 在 GTM 預覽面板中檢查事件是否被正確觸發

### 2. 使用瀏覽器控制台
打開瀏覽器開發者工具（F12），在控制台中輸入：
```javascript
dataLayer
```
查看所有推送到 dataLayer 的事件

### 3. 檢查控制台日誌
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
2. 確認 `window.dataLayer` 存在（在控制台輸入 `window.dataLayer`）
3. 確認 GTM 代碼已正確安裝
4. 使用 GTM 預覽模式檢查觸發條件

### 問題 2: 數據在 GTM 預覽中顯示但在 GA4 中看不到
**解決方案**:
1. 確認 GA4 代碼配置正確
2. 等待 24-48 小時數據處理延遲
3. 檢查 GA4 即時報表（數據應該立即顯示）
4. 確認 GA4 測量 ID 正確

### 問題 3: 部分事件參數缺失
**解決方案**:
1. 檢查代碼中 `projectData` 或 `project` 物件的結構
2. 確認 GTM 變量名稱與 dataLayer 中的鍵名完全一致
3. 使用可選鏈運算符 `?.` 處理可能為空的數據

---

## 更新日誌

**2024-10-14**
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
- [Google Tag Manager 說明文件](https://support.google.com/tagmanager/)


