// 組件系統：定義頁面可重用的 UI 組件，每個組件都需實作 render(data) 方法
export const components = {
  // 頁面標題區塊（標題、副標題、標籤）
  "header": {
    render: (data) => {
      const header = document.createElement('div');
      header.className = 'project-header';

      // 檢查 basicInfo 是否存在
      if (!data.basicInfo) {
        console.warn('[DEBUG][header] basicInfo is missing:', data);
        return header;
      }

      // 專案標題
      if (data.basicInfo.title) {
        const title = document.createElement('h2');
        title.textContent = data.basicInfo.title;
        header.appendChild(title);
      }

      // 專案副標題（如時間、角色、專案簡述）
      if (data.basicInfo.subtitle) {
        const subtitle = document.createElement('p');
        subtitle.textContent = data.basicInfo.subtitle;
        subtitle.className = 'project-subtitle';
        header.appendChild(subtitle);
      }

      // 標籤區塊（如 UX、設計系統、Figma 等）
      if (data.basicInfo.tags && Array.isArray(data.basicInfo.tags)) {
        const tags = document.createElement('div');
        tags.className = 'project-tags';
        data.basicInfo.tags.forEach(tag => {
          const tagElement = document.createElement('span');
          tagElement.className = 'tag';
          tagElement.textContent = tag;
          tags.appendChild(tagElement);
        });
        header.appendChild(tags);
      }

      return header;
    }
  },

  // Behance 風格圖片區塊組件：垂直排列圖片，支援滾動觸發問題顯示
  "behance-section": {
    render: (data) => {
      console.log('[DEBUG][behance-section] 開始渲染，data:', data);
      
      const behanceContainer = document.createElement('div');
      behanceContainer.className = 'behance-container';

      // 檢查是否有 firstImage 資料
      if (data.content && data.content.firstImage && data.content.firstImage.images) {
        console.log('[DEBUG][behance-section] 找到 firstImage:', data.content.firstImage);
        
        // 渲染首頁圖片
        const firstImageSection = document.createElement('div');
        firstImageSection.className = 'behance-section first-img-section';
        
        const imagesContainer = document.createElement('div');
        imagesContainer.className = 'behance-images';
        
        let imagesArray = Array.isArray(data.content.firstImage.images) ? data.content.firstImage.images : [data.content.firstImage.images];
        imagesArray.forEach((image, imageIndex) => {
          const imageWrapper = document.createElement('div');
          imageWrapper.className = 'behance-image-wrapper';
          const img = document.createElement('img');
          img.src = image.src;
          img.alt = image.caption || '';
          img.className = 'behance-image loaded'; // 添加 loaded 类
          img.setAttribute('data-caption', image.caption || '');
          // 图片已预加载，无需onload事件
          img.onerror = () => {
            img.style.border = '2px solid red';
            img.alt = `圖片載入失敗: ${image.src}`;
          };
          imageWrapper.appendChild(img);
          if (image.caption) {
            const caption = document.createElement('p');
            caption.className = 'behance-image-caption';
            caption.textContent = image.caption;
            imageWrapper.appendChild(caption);
          }
          imagesContainer.appendChild(imageWrapper);
        });
        firstImageSection.appendChild(imagesContainer);
        behanceContainer.appendChild(firstImageSection);
      }

      // 檢查是否有 sections 資料
      if (data.content && data.content.sections) {
        console.log('[DEBUG][behance-section] 找到 sections:', data.content.sections);
        
        data.content.sections.forEach((section, sectionIndex) => {
          console.log('[DEBUG][behance-section] 處理 section:', sectionIndex, section);
          
          if (section.type === 'imgBlock' && section.images) {
            const sectionElement = document.createElement('div');
            sectionElement.className = 'behance-section';
            sectionElement.setAttribute('data-step', section.step);
            
            // 創建圖片容器
            const imagesContainer = document.createElement('div');
            imagesContainer.className = 'behance-images';
            
            let imagesArray = Array.isArray(section.images) ? section.images : [section.images];
            console.log('[DEBUG][behance-section] 找到 images:', imagesArray);
            
            imagesArray.forEach((image, imageIndex) => {
              console.log('[DEBUG][behance-section] 處理 image:', imageIndex, image);
              
              const imageWrapper = document.createElement('div');
              imageWrapper.className = 'behance-image-wrapper';
              const img = document.createElement('img');
              img.src = image.src;
              img.alt = image.caption || '';
              img.className = 'behance-image loaded'; // 添加 loaded 类
              img.setAttribute('data-caption', image.caption || '');
              // 图片已预加载，无需onload事件
              img.onerror = () => {
                img.style.border = '2px solid red';
                img.alt = `圖片載入失敗: ${image.src}`;
              };
              imageWrapper.appendChild(img);
              if (image.caption) {
                const caption = document.createElement('p');
                caption.className = 'behance-image-caption';
                caption.textContent = image.caption;
                imageWrapper.appendChild(caption);
              }
              imagesContainer.appendChild(imageWrapper);
            });
            
            sectionElement.appendChild(imagesContainer);
            behanceContainer.appendChild(sectionElement);
          } else if (section.type === 'text') {
            // 处理文本类型的内容
            const textSection = document.createElement('div');
            textSection.className = 'behance-section text-section';
            textSection.innerHTML = section.content;
            behanceContainer.appendChild(textSection);
          }
        });
      }

      // 如果没有内容，添加默认提示
      if (behanceContainer.children.length === 0) {
        const emptySection = document.createElement('div');
        emptySection.className = 'behance-section empty-section';
        emptySection.innerHTML = `
          <div class="empty-content">
            <h3>🚧 项目内容正在准备中</h3>
            <p>这个项目的详细内容正在整理中，很快就会与大家见面！</p>
            <p>敬请期待...</p>
          </div>
        `;
        behanceContainer.appendChild(emptySection);
      }

      console.log('[DEBUG][behance-section] 渲染完成，container:', behanceContainer);
      return behanceContainer;
    }
  },

  // Coming Soon 內容組件
  "coming-soon-content": {
    render: (data) => {
      const comingSoonContainer = document.createElement('div');
      comingSoonContainer.className = 'coming-soon-content';

      // 檢查是否有自定義的 coming-soon 內容
      if (data.content && data.content.sections) {
        const comingSoonSection = data.content.sections.find(section => section.type === 'text');
        if (comingSoonSection) {
          comingSoonContainer.innerHTML = comingSoonSection.content;
        } else {
          // 預設 coming-soon 內容
          comingSoonContainer.innerHTML = `
            <div class="coming-soon-wrapper">
              <h2>🚧 專案正在準備中</h2>
              <p>這個專案的詳細內容正在整理中，很快就會與大家見面！</p>
              <p>敬請期待...</p>
            </div>
          `;
        }
      } else {
        // 預設 coming-soon 內容
        comingSoonContainer.innerHTML = `
          <div class="coming-soon-wrapper">
            <h2>🚧 專案正在準備中</h2>
            <p>這個專案的詳細內容正在整理中，很快就會與大家見面！</p>
            <p>敬請期待...</p>
          </div>
        `;
      }

      return comingSoonContainer;
    }
  },

  // 載入動畫內容組件
  "loading-content": {
    render: (data) => {
      const loadingContainer = document.createElement('div');
      loadingContainer.className = 'loading-content';

      // 檢查是否有自定義的載入內容
      if (data.content && data.content.sections) {
        const loadingSection = data.content.sections.find(section => section.type === 'loading');
        if (loadingSection) {
          loadingContainer.innerHTML = loadingSection.content;
        } else {
          // 預設載入動畫
          loadingContainer.innerHTML = `
            <div class="loading-container">
              <div class="loading-spinner"></div>
              <p class="loading-text">正在載入專案詳細內容...</p>
            </div>
          `;
        }
      } else {
        // 預設載入動畫
        loadingContainer.innerHTML = `
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">正在載入專案詳細內容...</p>
          </div>
        `;
      }

      return loadingContainer;
    }
  }
};
