// Lightbox 組件：實現圖片放大縮小功能
export class Lightbox {
  constructor() {
    this.isOpen = false;
    this.currentImage = null;
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
        <img class="lightbox-image" alt="">
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
    
    // 鍵盤事件
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          this.close();
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
    // 觸控裝置上支援雙指縮放切換
    let startDistance = 0;
    
    this.content.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        startDistance = this.getDistance(e.touches[0], e.touches[1]);
      }
    });
    
    this.content.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
        const scaleChange = currentDistance / startDistance;
        
        // 如果縮放變化足夠大，切換縮放狀態
        if (scaleChange > 1.2) {
          this.zoomToFit();
        } else if (scaleChange < 0.8) {
          this.resetZoom();
        }
      }
    });
  }

  getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  open(imageSrc, caption = '') {
    this.currentImage = imageSrc;
    this.isOpen = true;
    this.isZoomed = false;
    this.currentScale = 1;
    
    // 設置圖片和說明
    this.image.src = imageSrc;
    this.caption.textContent = caption;
    this.caption.style.display = caption ? 'block' : 'none';
    
    // 顯示 Lightbox
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // 重置縮放
    this.resetZoom();
  }

  close() {
    this.isOpen = false;
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
    this.resetZoom();
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
    this.image.style.height = 'auto';
    this.image.style.maxWidth = 'none';
    this.image.style.maxHeight = 'none';
    this.image.style.margin = '0';
    this.image.style.borderRadius = '0';
    
    // 添加 full-width 類以移除 padding
    this.content.classList.add('full-width');
    
    // 重置滾動位置，確保圖片頂部可見
    this.content.scrollTop = 0;
  }

  resetZoom() {
    this.isZoomed = false;
    this.currentScale = 1;
    
    // 移除缩放类
    this.image.classList.remove('zoomed');
    
    // 重置图片样式
    this.image.style.width = 'auto';
    this.image.style.height = 'auto';
    this.image.style.maxWidth = '90vw';
    this.image.style.maxHeight = '90vh';
    this.image.style.transform = 'scale(1)';
    this.image.style.margin = 'auto';
    this.image.style.borderRadius = '';
    
    // 移除 full-width 類以恢復 padding
    this.content.classList.remove('full-width');
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
        
        lightbox.open(src, caption);
      }
    };
    
    // 使用事件委托，确保能捕获到动态添加的图片
    document.addEventListener('click', handleImageClick, true);
    
    console.log('[Lightbox] 初始化完成，事件监听器已绑定');
    return lightbox;
  }
}

// 导出初始化函数，供外部调用
export function initLightbox() {
  return Lightbox.init();
} 