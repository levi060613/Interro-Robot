// Lightbox 組件：實現圖片放大縮小功能
export class Lightbox {
  constructor() {
    this.isOpen = false;
    this.currentImage = null;
    this.currentIndex = 0;
    this.imageList = [];
    this.isZoomed = false;
    this.initialScale = 1;
    this.currentScale = 1;
    this.initialDistance = 0;
    this.currentDistance = 0;
    
    this.createLightbox();
    this.bindEvents();
  }

  createLightbox() {
    // 創建 Lightbox 容器
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox';
    this.lightbox.innerHTML = `
      <div class="lightbox-overlay"></div>
      <div class="lightbox-content">
        <button class="lightbox-nav lightbox-prev" aria-label="上一張"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg></button>
        <img class="lightbox-image" alt="">
        <button class="lightbox-nav lightbox-next" aria-label="下一張"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg></button>
        <div class="lightbox-caption"></div>
      </div>
      <button class="lightbox-close" aria-label="關閉">×</button>
    `;
    
    document.body.appendChild(this.lightbox);
    
    // 獲取元素引用
    this.overlay = this.lightbox.querySelector('.lightbox-overlay');
    this.content = this.lightbox.querySelector('.lightbox-content');
    this.image = this.lightbox.querySelector('.lightbox-image');
    this.caption = this.lightbox.querySelector('.lightbox-caption');
    this.closeBtn = this.lightbox.querySelector('.lightbox-close');
    this.prevBtn = this.lightbox.querySelector('.lightbox-prev');
    this.nextBtn = this.lightbox.querySelector('.lightbox-next');
  }

  bindEvents() {
    // 關閉按鈕事件
    this.closeBtn.addEventListener('click', () => this.close());
    
    // 點擊背景關閉
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });
    
    // 圖片點擊事件 - 切換縮放狀態
    this.image.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleZoom();
    });
    
    // 導航按鈕事件
    this.prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prevImage();
    });
    
    this.nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.nextImage();
    });
    
    // 鍵盤事件
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          this.prevImage();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
      }
    });
    
    // 觸控縮放事件
    this.setupTouchEvents();
    
    // 滑鼠滾輪事件 - 支援圖片滾動檢視
    this.content.addEventListener('wheel', (e) => {
      // 當圖片高度超出容器時，允許滾動
      if (this.image.scrollHeight > this.content.clientHeight) {
        e.preventDefault();
        this.content.scrollTop += e.deltaY;
      }
    });
  }

  setupTouchEvents() {
    // 觸控狀態變數
    this.touchState = {
      isTouching: false,
      touches: [],
      lastDistance: 0,
      lastCenter: { x: 0, y: 0 },
      startCenter: { x: 0, y: 0 },
      startDistance: 0,
      isScaling: false,
      isPanning: false,
      lastPan: { x: 0, y: 0 },
      imageTransform: { scale: 1, translateX: 0, translateY: 0 }
    };

    // 觸控開始事件
    this.content.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        // 單指觸控 - 準備拖拽
        this.touchState.isTouching = true;
        this.touchState.isPanning = true;
        this.touchState.touches = Array.from(e.touches);
        this.touchState.lastPan = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      } else if (e.touches.length === 2) {
        // 雙指觸控 - 準備縮放
        e.preventDefault();
        this.touchState.isTouching = true;
        this.touchState.isScaling = true;
        this.touchState.touches = Array.from(e.touches);
        
        const distance = this.getDistance(e.touches[0], e.touches[1]);
        const center = this.getCenter(e.touches[0], e.touches[1]);
        
        this.touchState.startDistance = distance;
        this.touchState.lastDistance = distance;
        this.touchState.startCenter = center;
        this.touchState.lastCenter = center;
        
        // 如果圖片還沒放大，先放大
        if (!this.isZoomed) {
          this.zoomToFit();
        }
      }
    });

    // 觸控移動事件
    this.content.addEventListener('touchmove', (e) => {
      if (!this.touchState.isTouching) return;
      
      if (e.touches.length === 2 && this.touchState.isScaling) {
        // 雙指縮放
        e.preventDefault();
        const distance = this.getDistance(e.touches[0], e.touches[1]);
        const center = this.getCenter(e.touches[0], e.touches[1]);
        
        const scale = distance / this.touchState.startDistance;
        const deltaScale = distance / this.touchState.lastDistance;
        
        // 限制縮放範圍
        const newScale = Math.max(0.5, Math.min(3, this.touchState.imageTransform.scale * deltaScale));
        
        // 計算中心點偏移
        const deltaX = center.x - this.touchState.lastCenter.x;
        const deltaY = center.y - this.touchState.lastCenter.y;
        
        // 更新變換
        this.touchState.imageTransform.scale = newScale;
        this.touchState.imageTransform.translateX += deltaX;
        this.touchState.imageTransform.translateY += deltaY;
        
        // 應用變換
        this.applyImageTransform();
        
        // 更新狀態
        this.touchState.lastDistance = distance;
        this.touchState.lastCenter = center;
        
      } else if (e.touches.length === 1 && this.touchState.isPanning && this.isZoomed) {
        // 單指拖拽（僅在放大狀態下）
        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - this.touchState.lastPan.x;
        const deltaY = touch.clientY - this.touchState.lastPan.y;
        
        // 更新位移
        this.touchState.imageTransform.translateX += deltaX;
        this.touchState.imageTransform.translateY += deltaY;
        
        // 應用變換
        this.applyImageTransform();
        
        // 更新位置
        this.touchState.lastPan = {
          x: touch.clientX,
          y: touch.clientY
        };
      }
    });

    // 觸控結束事件
    this.content.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        // 所有手指離開
        this.touchState.isTouching = false;
        this.touchState.isScaling = false;
        this.touchState.isPanning = false;
        this.touchState.touches = [];
      } else if (e.touches.length === 1) {
        // 從雙指變為單指
        this.touchState.isScaling = false;
        this.touchState.isPanning = true;
        this.touchState.touches = Array.from(e.touches);
        this.touchState.lastPan = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
    });
  }

  getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  getCenter(touch1, touch2) {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  }

  applyImageTransform() {
    const transform = this.touchState.imageTransform;
    this.image.style.transform = `scale(${transform.scale}) translate(${transform.translateX}px, ${transform.translateY}px)`;
  }

  open(imageSrc, caption = '', imageList = []) {
    // 設置圖片列表和當前索引
    this.imageList = imageList.length > 0 ? imageList : [{ src: imageSrc, caption }];
    this.currentIndex = this.imageList.findIndex(img => img.src === imageSrc);
    if (this.currentIndex === -1) {
      this.currentIndex = 0;
    }
    
    this.isOpen = true;
    this.isZoomed = false;
    this.currentScale = 1;
    
    // 顯示 Lightbox
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // 顯示當前圖片
    this.showCurrentImage();
    
    // 重置縮放
    this.resetZoom();
  }

  close() {
    this.isOpen = false;
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
    this.resetZoom();
  }

  // 顯示當前圖片
  showCurrentImage() {
    if (this.imageList.length === 0) return;
    
    const currentImg = this.imageList[this.currentIndex];
    this.currentImage = currentImg.src;
    
    // 設置圖片和說明
    this.image.src = currentImg.src;
    this.caption.textContent = currentImg.caption || '';
    this.caption.style.display = currentImg.caption ? 'block' : 'none';
    
    // 更新導航按鈕狀態
    this.updateNavigationButtons();
  }

  // 更新導航按鈕狀態
  updateNavigationButtons() {
    if (this.imageList.length <= 1) {
      // 只有一張圖片時隱藏導航按鈕
      this.prevBtn.style.display = 'none';
      this.nextBtn.style.display = 'none';
    } else {
      // 顯示導航按鈕
      this.prevBtn.style.display = 'flex';
      this.nextBtn.style.display = 'flex';
      
      // 更新按鈕禁用狀態
      this.prevBtn.disabled = this.currentIndex === 0;
      this.nextBtn.disabled = this.currentIndex === this.imageList.length - 1;
    }
  }

  // 切換到上一張圖片
  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.showCurrentImage();
      this.resetZoom(); // 切換圖片時重置縮放
    }
  }

  // 切換到下一張圖片
  nextImage() {
    if (this.currentIndex < this.imageList.length - 1) {
      this.currentIndex++;
      this.showCurrentImage();
      this.resetZoom(); // 切換圖片時重置縮放
    }
  }

  toggleZoom() {
    if (this.isZoomed) {
      this.resetZoom();
    } else {
      this.zoomToFit();
    }
  }

  zoomToFit() {
    this.isZoomed = true;
    this.currentScale = 1;
    
    // 添加缩放类
    this.image.classList.add('zoomed');
    
    // 设置图片为全屏显示
    this.image.style.width = '100vw';
    this.image.style.zIndex = '899';
    this.image.style.height = 'auto';
    this.image.style.maxWidth = 'none';
    this.image.style.maxHeight = 'none';
    this.image.style.margin = '0';
    this.image.style.borderRadius = '0';
    this.image.style.transformOrigin = 'center center';
    this.image.style.transition = 'transform 0.1s ease-out';
    
    // 添加 full-width 類以移除 padding
    this.content.classList.add('full-width');
    
    // 重置滾動位置，確保圖片頂部可見
    this.content.scrollTop = 0;
    
    // 重置觸控狀態
    this.touchState.imageTransform = { scale: 1, translateX: 0, translateY: 0 };
  }

  resetZoom() {
    this.isZoomed = false;
    this.currentScale = 1;
    
    // 移除缩放类
    this.image.classList.remove('zoomed');
    
    // 重置图片样式
    this.image.style.width = 'auto';
    this.image.style.zIndex = 'none';
    this.image.style.height = 'auto';
    this.image.style.maxWidth = '90vw';
    this.image.style.maxHeight = '90vh';
    this.image.style.transform = 'scale(1) translate(0px, 0px)';
    this.image.style.margin = 'auto';
    this.image.style.borderRadius = '';
    this.image.style.transformOrigin = '';
    this.image.style.transition = '';
    
    // 移除 full-width 類以恢復 padding
    this.content.classList.remove('full-width');
    
    // 重置觸控狀態
    this.touchState.imageTransform = { scale: 1, translateX: 0, translateY: 0 };
  }

  // 移除滾輪縮放相關方法，因為現在只支援滾動檢視

  // 為所有圖片添加 Lightbox 功能
  static init() {
    console.log('[Lightbox] 开始初始化...');
    const lightbox = new Lightbox();
    
    // 為所有圖片添加點擊事件
    const handleImageClick = (e) => {
      if (e.target.matches('img[data-lightbox]') || 
          e.target.matches('.behance-image') ||
          e.target.matches('.carousel-slide img') ||
          e.target.matches('.gallery-item img') ||
          e.target.matches('.text-image-wrapper img') ||
          e.target.matches('.test-image img')) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('[Lightbox] 图片被点击:', e.target.src);
        
        const img = e.target;
        const src = img.src;
        const caption = img.alt || img.getAttribute('data-caption') || '';
        
        // 收集所有可用的图片
        const imageList = lightbox.collectAllImages();
        
        lightbox.open(src, caption, imageList);
      }
    };
    
    // 使用事件委托，确保能捕获到动态添加的图片
    document.addEventListener('click', handleImageClick, true);
    
    console.log('[Lightbox] 初始化完成，事件监听器已绑定');
    return lightbox;
  }

  // 收集頁面中所有可用的圖片
  collectAllImages() {
    const imageList = [];
    
    // 查找所有可能的圖片元素
    const imageSelectors = [
      'img[data-lightbox]',
      '.behance-image',
      '.carousel-slide img',
      '.gallery-item img',
      '.text-image-wrapper img',
      '.test-image img'
    ];
    
    imageSelectors.forEach(selector => {
      const images = document.querySelectorAll(selector);
      images.forEach(img => {
        // 避免重複添加
        if (!imageList.find(item => item.src === img.src)) {
          imageList.push({
            src: img.src,
            caption: img.alt || img.getAttribute('data-caption') || ''
          });
        }
      });
    });
    
    console.log('[Lightbox] 收集到的图片列表:', imageList);
    return imageList;
  }
}

// 导出初始化函数，供外部调用
export function initLightbox() {
  return Lightbox.init();
} 