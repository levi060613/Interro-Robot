// 图片预加载工具
export class ImagePreloader {
  constructor() {
    this.loadedImages = new Set();
    this.failedImages = new Set();
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

  // 预加载多张图片，支持进度回调
  async preloadImages(imageSources, onProgress) {
    if (!Array.isArray(imageSources) || imageSources.length === 0) {
      return { success: true, loaded: [], failed: [] };
    }

    const results = [];
    let completed = 0;
    
    const promises = imageSources.map((src, index) => {
      return this.preloadImage(src).then(result => {
        completed++;
        if (onProgress) {
          onProgress(completed, imageSources.length, src);
        }
        return result;
      }).catch(error => {
        completed++;
        if (onProgress) {
          onProgress(completed, imageSources.length, src);
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
        if (section.type === 'imgBlock' && section.images) {
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

  // 预加载项目所有图片，支持进度回调
  async preloadProjectImages(projectData, onProgress) {
    const imageSources = this.extractImageSources(projectData);
    console.log('[ImagePreloader] 需要预加载的图片:', imageSources);
    
    if (imageSources.length === 0) {
      console.log('[ImagePreloader] 没有找到需要预加载的图片');
      return { success: true, loaded: [], failed: [] };
    }

    return await this.preloadImages(imageSources, onProgress);
  }

  // 清除缓存
  clearCache() {
    this.loadedImages.clear();
    this.failedImages.clear();
  }
}
