// 模板系統：定義各個專案頁面所使用的 UI 組件與渲染邏輯

// 匯入組件定義，每個 component 都應包含 render(data) 方法
import { components } from './components.js';

// 定義不同專案頁面所需的模板
export const templates = {
  // 「interro-project」專案的頁面模板設定
  "interro-project": {
    // 指定此模板將會依序使用哪些組件（來自 components 模組）
    components: [
      "header",         // 頁面標題與摘要
      "carousel",       // 圖片輪播
      "table",          // 資訊表格（如角色職責、流程、工具等）
      "text-content"    // 文字段落（可用於補充說明或結語）
    ],

    // 定義如何渲染整體頁面
    render: function(data) {
      // 建立一個容器元素作為整體專案頁的根節點
      const container = document.createElement('div');
      container.className = 'project-detail interro-project';

      // 根據 `components` 陣列定義的順序，逐一渲染並加入對應的組件
      this.components.forEach(componentType => {
        const component = components[componentType]; // 從元件庫中取得指定組件
        if (component && component.render) {
          // 若組件存在且有 render 方法，則執行 render 並加入 container 中
          container.appendChild(component.render(data));
        }
      });

      // 回傳完整組裝好的 DOM 結構，可插入頁面使用
      return container;
    }
  },

  // 「hahow-project」專案的頁面模板設定
  "hahow-project": {
    // 指定此模板需要用到的 UI 組件
    components: [
      "header",   // 頁面標題與摘要
      "carousel", // 圖片或段落輪播元件（適合展示案例、成果等）
      "table"     // 資訊表格
    ],

    // 與 interro-project 相同的渲染流程
    render: function(data) {
      const container = document.createElement('div');
      container.className = 'project-detail hahow-project';

      this.components.forEach(componentType => {
        const component = components[componentType];
        if (component && component.render) {
          container.appendChild(component.render(data));
        }
      });

      return container;
    }
  },

  // 「coming-soon」專案的頁面模板設定
  "coming-soon": {
    components: [
      "header",         // 頁面標題與摘要
      "carousel",       // 圖片輪播
    ],

    render: function(data) {
      const container = document.createElement('div');
      container.className = 'project-detail coming-soon';

      this.components.forEach(componentType => {
        const component = components[componentType];
        if (component && component.render) {
          container.appendChild(component.render(data));
        }
      });

      return container;
    }
  }
};
