// 模板系統：定義各個專案頁面所使用的 UI 組件與渲染邏輯

// 匯入組件定義，每個 component 都應包含 render(data) 方法
import { components } from './components.js';

// 定義不同專案頁面所需的模板
export const templates = {
  // 「behance-project」專案的頁面模板設定
  "behance-project": {
    components: [
      "behance-section"   // Behance 風格的垂直圖片展示區塊
    ],

    render: function(data) {
      const container = document.createElement('div');
      container.className = 'project-detail behance-project';

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
      "coming-soon-content"  // 即將推出內容
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
  },

  // 「loading」載入狀態的頁面模板設定
  "loading": {
    components: [
      "loading-content" // 只顯示載入動畫內容
    ],

    render: function(data) {
      const container = document.createElement('div');
      container.className = 'project-detail loading';

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
