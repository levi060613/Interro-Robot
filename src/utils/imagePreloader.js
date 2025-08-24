// 图片预加载工具 - 增强版
export class ImagePreloader {
  constructor() {
    this.loadedImages = new Set();
    this.failedImages = new Set();
    this.observer = null;
    this.initIntersectionObserver();
  }

  // 初始化 Intersection Observer 用于懒加载
  initIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            this.observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px', // 提前50px开始加载
        threshold: 0.1
      });
    }
  }

  // 懒加载图片
  lazyLoadImage(img) {
    if (this.observer) {
      this.observer.observe(img);
    } else {
      // 降级方案：直接加载
      this.loadImage(img);
    }
  }

  // 加载单张图片（带渐进式效果）
  loadImage(img) {
    if (img.dataset.src) {
      const src = img.dataset.src;
      
      // 添加加载状态
      img.classList.add('loading');
      
      // 创建新图片对象进行预加载
      const tempImg = new Image();
      
      tempImg.onload = () => {
        // 移除加载状态，显示图片
        img.classList.remove('loading');
        img.classList.add('loaded');
        img.src = src;
        img.removeAttribute('data-src');
        
        // 记录成功加载
        this.loadedImages.add(src);
        
        // 触发加载完成事件
        img.dispatchEvent(new CustomEvent('imageLoaded', { detail: { src } }));
      };
      
      tempImg.onerror = () => {
        img.classList.remove('loading');
        img.classList.add('error');
        this.failedImages.add(src);
        console.warn(`图片加载失败: ${src}`);
      };
      
      tempImg.src = src;
    }
  }

  // 预加载单张图片
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.loadedImages.add(src);
        resolve(src);
      };
      
      img.onerror = () => {
        this.failedImages.add(src);
        reject(new Error(`图片加载失败: ${src}`));
      };
      
      img.src = src;
    });
  }

  // 预加载多张图片，支持进度回调和优先级
  async preloadImages(imageSources, onProgress, priority = 'normal') {
    if (!Array.isArray(imageSources) || imageSources.length === 0) {
      return { success: true, loaded: [], failed: [] };
    }

    // 根据优先级排序图片
    const sortedSources = this.sortByPriority(imageSources, priority);
    
    const results = [];
    let completed = 0;
    
    const promises = sortedSources.map((src, index) => {
      return this.preloadImage(src).then(result => {
        completed++;
        if (onProgress) {
          onProgress(completed, sortedSources.length, src);
        }
        return result;
      }).catch(error => {
        completed++;
        if (onProgress) {
          onProgress(completed, sortedSources.length, src);
        }
        throw error;
      });
    });
    
    try {
      const settledResults = await Promise.allSettled(promises);
      
      const loaded = settledResults
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
      
      const failed = settledResults
        .filter(result => result.status === 'rejected')
        .map(result => result.reason.message);

      return {
        success: failed.length === 0,
        loaded,
        failed
      };
    } catch (error) {
      return {
        success: false,
        loaded: [],
        failed: [error.message]
      };
    }
  }

  // 根据优先级排序图片
  sortByPriority(imageSources, priority) {
    if (priority === 'high') {
      // 高优先级：首屏图片优先
      return imageSources.sort((a, b) => {
        const aIsFirstScreen = a.includes('imgCarousel') || a.includes('project-0');
        const bIsFirstScreen = b.includes('imgCarousel') || b.includes('project-0');
        if (aIsFirstScreen && !bIsFirstScreen) return -1;
        if (!aIsFirstScreen && bIsFirstScreen) return 1;
        return 0;
      });
    }
    return imageSources;
  }

  // 从项目数据中提取所有图片源
  extractImageSources(projectData) {
    const imageSources = [];
    
    if (!projectData || !projectData.content) {
      return imageSources;
    }

    // 提取首图
    if (projectData.content.firstImage && projectData.content.firstImage.images) {
      const images = Array.isArray(projectData.content.firstImage.images) 
        ? projectData.content.firstImage.images 
        : [projectData.content.firstImage.images];
      
      images.forEach(image => {
        if (image.src) {
          imageSources.push(image.src);
        }
      });
    }

    // 提取sections中的图片
    if (projectData.content.sections) {
      projectData.content.sections.forEach(section => {
        if (section.images) {
          const images = Array.isArray(section.images) 
            ? section.images 
            : [section.images];
          
          images.forEach(image => {
            if (image.src) {
              imageSources.push(image.src);
            }
          });
        }
      });
    }

    return imageSources;
  }

  // 批量懒加载页面中的图片
  lazyLoadPageImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => this.lazyLoadImage(img));
  }

  // 预加载项目所有图片，支持进度回调
  async preloadProjectImages(projectData, onProgress) {
    const imageSources = this.extractImageSources(projectData);
    console.log('[ImagePreloader] 需要预加载的图片:', imageSources);
    
    if (imageSources.length === 0) {
      console.log('[ImagePreloader] 没有找到需要预加载的图片');
      return { success: true, loaded: [], failed: [] };
    }

    return await this.preloadImages(imageSources, onProgress, 'high');
  }

  // 获取加载统计
  getStats() {
    return {
      total: this.loadedImages.size + this.failedImages.size,
      loaded: this.loadedImages.size,
      failed: this.failedImages.size,
      successRate: this.loadedImages.size / (this.loadedImages.size + this.failedImages.size) * 100
    };
  }

  // 清理资源
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.loadedImages.clear();
    this.failedImages.clear();
  }
}
