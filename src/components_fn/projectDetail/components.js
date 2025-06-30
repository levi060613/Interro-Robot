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

  // 圖片畫廊組件：用於展示多張圖片與對應說明文字
  "image-gallery": {
    render: (data) => {
      const gallery = document.createElement('div');
      gallery.className = 'image-gallery';

      // 讀取 image 陣列（來自 content.images）
      if (data.content.images) {
        data.content.images.forEach(image => {
          const imgContainer = document.createElement('div');
          imgContainer.className = 'gallery-item';

          const img = document.createElement('img');
          img.src = image.src;
          img.alt = image.caption || '';

          // 若有附加說明，顯示在圖片下方
          if (image.caption) {
            const caption = document.createElement('p');
            caption.className = 'image-caption';
            caption.textContent = image.caption;
            imgContainer.appendChild(caption);
          }

          imgContainer.appendChild(img);
          gallery.appendChild(imgContainer);
        });
      }

      return gallery;
    }
  },

  // 純文字內容段落組件：從 section 中擷取純文字段落內容
  "text-content": {
    render: (data) => {
      const content = document.createElement('div');
      content.className = 'text-content';

      if (data.content.sections) {
        data.content.sections.forEach(section => {
          if (section.type === 'text') {
            const textBlock = document.createElement('div');
            textBlock.className = 'text-block';
            
            const text = document.createElement('div');
            text.className = 'text-content-wrapper';
            text.innerHTML = section.content; // 支援 HTML 格式
            textBlock.appendChild(text);

            // 如果这个段落有对应的图片，添加图片
            if (section.image) {
              const imgContainer = document.createElement('div');
              imgContainer.className = 'text-image-wrapper';

              const img = document.createElement('img');
              img.src = section.image.src;
              img.alt = section.image.caption || '';
              imgContainer.appendChild(img);

              if (section.image.caption) {
                const caption = document.createElement('p');
                caption.className = 'text-image-caption';
                caption.textContent = section.image.caption;
                imgContainer.appendChild(caption);
              }

              textBlock.appendChild(imgContainer);
            }

            content.appendChild(textBlock);
          }
        });
      }

      return content;
    }
  },

  // 影片區塊：顯示影片播放器，並支援 autoplay 選項
  "video-section": {
    render: (data) => {
      const videoSection = document.createElement('div');
      videoSection.className = 'video-section';

      if (data.content.video) {
        const video = document.createElement('video');
        video.src = data.content.video.src;
        video.controls = true;
        video.autoplay = data.content.video.autoplay || false;

        videoSection.appendChild(video);
      }

      return videoSection;
    }
  },

  // 表格組件：用於呈現資料欄位（常見於角色職責、研究結果）
  "table": {
    render: (data) => {
      const tableSection = document.createElement('div');
      tableSection.className = 'table-section';

      // debug log
      console.log('[DEBUG][table] data:', data);
      console.log('[DEBUG][table] data.content:', data.content);
      console.log('[DEBUG][table] data.content.table:', data.content?.table);

      // 直接渲染 content.table
      if (data.content && data.content.table) {
        const { headers, rows } = data.content.table;
        const table = document.createElement('table');

        // 表頭
        if (headers) {
          const thead = document.createElement('thead');
          const headerRow = document.createElement('tr');
          headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);
          table.appendChild(thead);
        }

        // 表格內容
        if (rows) {
          const tbody = document.createElement('tbody');
          rows.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach((cell, index) => {
              const td = document.createElement('td');
              td.textContent = cell;
              if (headers && headers[index]) {
                td.setAttribute('data-label', headers[index]);
              }
              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          });
          table.appendChild(tbody);
        }

        tableSection.appendChild(table);
      }

      return tableSection;
    }
  },

  // 輪播元件（Carousel）：可左右滑動展示圖片或說明內容
  "carousel": {
    render: (data) => {
      const carousel = document.createElement('div');
      carousel.className = 'carousel';

      if (data.content.carousel) {
        const container = document.createElement('div');
        container.className = 'carousel-container';

        // 创建轮播项
        data.content.carousel.items.forEach((item, index) => {
          const slide = document.createElement('div');
          slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;

          if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.caption || '';
            slide.appendChild(img);
          }

          if (item.caption) {
            const caption = document.createElement('p');
            caption.className = 'carousel-caption';
            caption.textContent = item.caption;
            slide.appendChild(caption);
          }

          container.appendChild(slide);
        });

        // 创建导航按钮
        const nav = document.createElement('div');
        nav.className = 'carousel-nav';

        const prevButton = document.createElement('button');
        prevButton.className = 'prev';
        prevButton.innerHTML = '←';
        nav.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.className = 'next';
        nextButton.innerHTML = '→';
        nav.appendChild(nextButton);

        // 创建底部指示器
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';

        data.content.carousel.items.forEach((_, index) => {
          const indicator = document.createElement('div');
          indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
          indicators.appendChild(indicator);
        });

        carousel.appendChild(container);
        carousel.appendChild(nav);
        carousel.appendChild(indicators);

        // 轮播功能
        let currentIndex = 0;
        const slides = container.querySelectorAll('.carousel-slide');
        const dots = indicators.querySelectorAll('.indicator');

        const showSlide = (index, direction = 'next') => {
          // 移除所有活动状态
          slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
          });
          dots.forEach(dot => dot.classList.remove('active'));
          
          // 设置当前幻灯片
          slides[index].classList.add('active');
          dots[index].classList.add('active');

          // 设置前一个幻灯片
          const prevIndex = (index - 1 + slides.length) % slides.length;
          slides[prevIndex].classList.add('prev');

          currentIndex = index;
        };

        const nextSlide = () => {
          const nextIndex = (currentIndex + 1) % slides.length;
          showSlide(nextIndex, 'next');
        };

        const prevSlide = () => {
          const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
          showSlide(prevIndex, 'prev');
        };

        // 初始化显示第一张幻灯片
        showSlide(0);

        // 添加事件监听
        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);
        
        dots.forEach((dot, index) => {
          dot.addEventListener('click', () => {
            const direction = index > currentIndex ? 'next' : 'prev';
            showSlide(index, direction);
          });
        });

        // 自动播放
        let autoplayInterval = setInterval(nextSlide, 5000);

        // 鼠标悬停时暂停自动播放
        carousel.addEventListener('mouseenter', () => {
          clearInterval(autoplayInterval);
        });

        carousel.addEventListener('mouseleave', () => {
          autoplayInterval = setInterval(nextSlide, 5000);
        });
      }

      return carousel;
    }
  }
};
