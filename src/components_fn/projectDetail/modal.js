import { templates } from './templates.js';
import { components } from './components.js';
import { projects } from '../../utils/tempData.js';
import { ImagePreloader } from '../../utils/imagePreloader.js';

// 統一的錯誤處理函數，當專案資料載入或顯示失敗時，回傳一個標準化的錯誤資料物件
function handleProjectError(error, title = '載入失敗') {
  return {
    template: 'coming-soon', // 使用預設的 coming-soon 模板顯示錯誤
    basicInfo: {
      title: title,
      subtitle: '請稍後再試',
      tags: ['Error']
    },
    content: {
      sections: [
        {
          type: 'text',
          content: `
            <h3>${title}</h3>
            <p>請稍後再試，或聯繫管理員。</p>
            <p>錯誤詳情：${error.message}</p>
          `
        }
      ]
    }
  };
}

// 建立專案細節的模態框（Modal）元件
export function createProjectModal() {
  // 建立最外層的模態框容器
  const modal = document.createElement('div');
  modal.className = 'project-modal';
  
  // 建立模態框內容區塊
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  // 建立關閉按鈕
  const closeButton = document.createElement('button');
  closeButton.className = 'modal-close';
  closeButton.innerHTML = '&times;';
  // 綁定點擊事件，點擊後關閉模態框
  closeButton.addEventListener('click', () => {
    console.log('[DEBUG] modal-close 按鈕被點擊');
    modal.classList.remove('active');
    console.log('[DEBUG] 已移除 modal 的 active 類');
    // 立即禁用 modalLookBtn
    disableModalLookBtn();
    setTimeout(() => {
      modal.remove();
      cleanupModalLookBtn();
    }, 300); // 延遲移除以配合動畫
  });
  
  // 建立目錄條
  const tableOfContents = document.createElement('div');
  tableOfContents.className = 'table-of-contents';
  tableOfContents.style.display = 'none'; // 初始隱藏
  
  // 建立 modal-panel
  const buttonPanel = document.createElement('div');
  buttonPanel.className = 'modal-panel';

  const button = document.createElement('button');
  button.className = 'question-switchBtn';
  button.innerHTML = '看到這裡，也許你會想問⋯⋯';
  buttonPanel.appendChild(button);

  // 建立問題列表容器
  const questionList = document.createElement('ul');
  questionList.className = 'question-list';
  questionList.style.display = 'none';
  buttonPanel.appendChild(questionList);

  // 將關閉按鈕加入內容區
  modalContent.appendChild(closeButton);
  // 將內容區加入模態框容器
  modal.appendChild(modalContent);
  // 將目錄條加入模態框容器
  modal.appendChild(tableOfContents);
  // 將 modal-panel 加入模態框容器
  modal.appendChild(buttonPanel);
  
  // 點擊模態框外部區域時也能關閉模態框
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      console.log('[DEBUG] 點擊模態框外部區域');
      modal.classList.remove('active');
      console.log('[DEBUG] 已移除 modal 的 active 類');
      // 立即禁用 modalLookBtn
      disableModalLookBtn();
      setTimeout(() => {
        modal.remove();
        cleanupModalLookBtn();
      }, 300);
    }
  });

  // 添加視窗大小變化監聽器
  const handleResize = () => {
    const isDesktop = window.innerWidth >= 768;
    const isChatRoom = modal.classList.contains('chatRoom');
    
    if (isDesktop && isChatRoom && modal.parentElement === document.getElementById('mainContent')) {
      // 如果從手機版切換到桌面版，且 modal 還在 mainContent 中，則移動到 body
      console.log('[DEBUG] 視窗大小變化：從手機版切換到桌面版，移動 modal 到 body');
      document.body.appendChild(modal);
    }
    // 注意：手機版時不再自動將 modal 移動回 mainContent，因為切換路徑時已經移動到 body
    
    // 檢查 modalLookBtn 是否存在（用於調試）
    const modalLookBtn = document.querySelector('.modal-lookBtn');
    if (modalLookBtn) {
      console.log('[DEBUG] 視窗大小變化：modalLookBtn 存在，當前寬度:', window.innerWidth, '是否桌面版:', isDesktop);
    }
  };

  window.addEventListener('resize', handleResize);
  
  // 回傳一個物件，提供 show 方法用來顯示專案細節
  return {
    show: async (projectData) => {
      try {
        // 清空現有內容（保留關閉按鈕）
        const closeButton = modalContent.querySelector('.modal-close');
        modalContent.innerHTML = '';
        if (closeButton) {
          modalContent.appendChild(closeButton);
        }

        // 先显示loading状态
        const loadingTemplate = templates['loading'];
        if (loadingTemplate) {
          const loadingContent = loadingTemplate.render({
            template: 'loading',
            basicInfo: projectData.basicInfo || {},
            content: {
              sections: [{
                type: 'loading',
                content: `
                  <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p class="loading-text">正在載入專案詳細內容...</p>
                    <p class="loading-progress" id="loading-progress">準備中...</p>
                  </div>
                `
              }]
            }
          });
          modalContent.appendChild(loadingContent);
        }

        // 将模态框加入DOM并显示
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
          mainContent.appendChild(modal);
          setTimeout(() => {
            modal.classList.add('active');
          }, 10);
        } else {
          document.body.appendChild(modal);
          setTimeout(() => {
            modal.classList.add('active');
          }, 10);
        }

        // 预加载所有图片
        const imagePreloader = new ImagePreloader();
        console.log('[Modal] 开始预加载图片...');
        
        // 进度更新函数
        const updateProgress = (completed, total, currentSrc) => {
          const progressElement = document.getElementById('loading-progress');
          if (progressElement) {
            const percentage = Math.round((completed / total) * 100);
            progressElement.textContent = `載入中... ${completed}/${total} (${percentage}%)`;
          }
        };
        
        const preloadResult = await imagePreloader.preloadProjectImages(projectData, updateProgress);
        console.log('[Modal] 图片预加载结果:', preloadResult);

        // 图片预加载完成后，清空loading内容并显示实际内容
        modalContent.innerHTML = '';
        if (closeButton) {
          modalContent.appendChild(closeButton);
        }
        
        // 根據 projectData.template 取得對應的模板
        const template = templates[projectData.template];
        if (!template) {
          console.error(`Template ${projectData.template} not found`);
          throw new Error(`找不到模板：${projectData.template}`);
        }
        
        // 使用模板的 render 方法渲染專案內容
        const content = template.render(projectData);
        modalContent.appendChild(content);
        
        // 設置目錄條
        setupTableOfContents(tableOfContents, projectData, modalContent);
        
        // 設置問題面板功能
        setupQuestionPanel(button, questionList, projectData, buttonPanel);
        
        // 設置滾動監聽
        setupScrollListener(modalContent, questionList, projectData);
        
      } catch (error) {
        // 若渲染過程發生錯誤，顯示錯誤訊息內容
        console.error('顯示專案內容時發生錯誤:', error);
        
        // 显示错误内容
        modalContent.innerHTML = '';
        if (closeButton) {
          modalContent.appendChild(closeButton);
        }
        
        const errorTemplate = templates['coming-soon'];
        if (errorTemplate) {
          const errorContent = errorTemplate.render(handleProjectError(error, '載入失敗'));
          modalContent.appendChild(errorContent);
        }
      }
    }
  };
}

// 設置問題面板功能
function setupQuestionPanel(button, questionList, projectData, buttonPanel) {
  let isExpanded = false;
  
  // 清空問題列表內容，移除舊的事件監聽器
  questionList.innerHTML = '';
  
  // 移除可能存在的舊事件監聽器
  const oldListener = questionList._questionClickListener;
  if (oldListener) {
    questionList.removeEventListener('click', oldListener);
  }
  
  // 關閉問題列表的函數
  const closeQuestionList = () => {
    isExpanded = false;
    questionList.style.display = 'none';
    button.innerHTML = '看到這裡，也許你會想問⋯⋯';
    button.classList.remove('active');
    buttonPanel.classList.remove('add-mask');
    
    // 顯示 modalLookBtn
    const modalLookBtn = document.querySelector('.modal-lookBtn');
    if (modalLookBtn) {
      modalLookBtn.classList.remove('hidden');
      console.log('[DEBUG] 已顯示 modalLookBtn');
    }
  };
  
  // 開啟問題列表的函數
  const openQuestionList = () => {
    isExpanded = true;
    questionList.style.display = 'block';
    button.innerHTML = '× 收起問題';
    button.classList.add('active');
    buttonPanel.classList.add('add-mask');
    
    // 隱藏 modalLookBtn
    const modalLookBtn = document.querySelector('.modal-lookBtn');
    if (modalLookBtn) {
      modalLookBtn.classList.add('hidden');
      console.log('[DEBUG] 已隱藏 modalLookBtn');
    }
  };
  
  // 切換問題列表顯示狀態的函數
  const toggleQuestionList = () => {
    if (isExpanded) {
      closeQuestionList();
    } else {
      openQuestionList();
    }
  };
  

  
  // 為按鈕添加點擊事件
  button.addEventListener('click', (e) => {
    e.stopPropagation(); // 防止事件冒泡
    toggleQuestionList();
  });
  
  // 為問題列表添加點擊事件，防止點擊問題列表時關閉
  questionList.addEventListener('click', (e) => {
    e.stopPropagation(); // 防止事件冒泡到按鈕
  });
  
  // 為問題項目添加點擊事件，點擊後關閉問題列表
  const handleQuestionItemClickEvent = (e) => {
    const questionItem = e.target.closest('.question-item');
    if (questionItem) {
      console.log('[DEBUG] 問題項目被點擊，開始處理');
      
      // 關閉問題列表
      closeQuestionList();
      
      // 手機版邏輯：移除 modal-look 樣式
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        const modal = document.querySelector('.project-modal');
        if (modal && modal.classList.contains('modal-look')) {
          modal.classList.remove('modal-look');
          console.log('[DEBUG] 手機版：已移除 modal-look 樣式');
          
          // 同時移除 modalLookBtn 的 active 狀態
          const modalLookBtn = document.querySelector('.modal-lookBtn');
          if (modalLookBtn) {
            modalLookBtn.classList.remove('active');
            console.log('[DEBUG] 手機版：已移除 modalLookBtn active 狀態');
          }
        }
      }
      
      // 從 dataset 中獲取完整的問題資料
      let question;
      try {
        question = JSON.parse(questionItem.dataset.questionData);
      } catch (error) {
        // 如果解析失敗，使用備用方法
        const questionText = questionItem.querySelector('.question-text').textContent;
        question = {
          text: questionText,
          reply: questionItem.dataset.reply || ''
        };
      }
      
      // 調用原有的問題處理邏輯
      console.log('[DEBUG] 即將調用 handleQuestionItemClick');
      handleQuestionItemClick(question, projectData);
    }
  };
  
  // 保存事件監聽器引用以便後續移除
  questionList._questionClickListener = handleQuestionItemClickEvent;
  
  // 監聽問題列表的點擊事件
  questionList.addEventListener('click', handleQuestionItemClickEvent);
  
  // 點擊遮罩關閉問題列表
  const handleMaskClick = (e) => {
    // 檢查是否點擊的是遮罩區域（buttonPanel 本身，但不是按鈕或問題列表）
    if (e.target === buttonPanel && isExpanded) {
      console.log('[DEBUG] 點擊遮罩，關閉問題列表');
      closeQuestionList();
    }
  };
  
  // 為 buttonPanel 添加點擊事件監聽器
  buttonPanel.addEventListener('click', handleMaskClick);
}

// 渲染所有問題（這個函數保留但不再使用）
function renderAllQuestions(questionList, projectData) {
  questionList.innerHTML = '';
  
  if (!projectData.content || !projectData.content.sections) {
    return;
  }
  
  projectData.content.sections.forEach((section, sectionIndex) => {
    if (section.type === 'imgBlock' && section.questions) {
      section.questions.forEach((question, questionIndex) => {
        const questionItem = document.createElement('li');
        questionItem.className = 'question-item';
        questionItem.innerHTML = `
          <div class="question-text">${question.text}</div>
          <div class="question-reply">${question.reply}</div>
        `;
        questionList.appendChild(questionItem);
      });
    }
  });
}

// 設置滾動監聽
function setupScrollListener(modalContent, questionList, projectData) {
  let currentStep = null;
  
  console.log('[DEBUG] 初始化滾動監聽器');
  console.log('[DEBUG] 專案資料結構:', projectData);
  
  // 獲取 modal-panel 元素
  const modalPanel = modalContent.parentElement.querySelector('.modal-panel');
  
  // 設置 modal-panel 初始狀態為隱藏
  if (modalPanel) {
    modalPanel.style.transform = 'translateY(100%)';
    modalPanel.style.transition = 'transform 0.3s ease';
  }
  
  // 滾動監聽器，使用 step 系統 + 滾動百分比控制滑入滑出
  const scrollHandler = () => {
    if (!modalPanel) return;
    
    // 找到當前在視窗中的 section 並計算滾動百分比
    const sections = modalContent.querySelectorAll('.behance-section[data-step]');
    const modalRect = modalContent.getBoundingClientRect();
    const clientHeight = modalContent.clientHeight;
    
    let currentVisibleStep = null;
    let currentScrollPercentage = 0;
    
    sections.forEach((section) => {
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top - modalRect.top;
      const sectionHeight = section.offsetHeight;
      
      // 檢查 section 是否在視窗內
      if (sectionTop <= clientHeight && sectionTop + sectionHeight >= 0) {
        // 計算滾動百分比 - 基於 section 本身的實際高度
        const sectionScrollTop = Math.max(0, -sectionTop);
        // 使用 section 的實際高度，而不是 modal 視窗高度
        const sectionScrollHeight = sectionHeight;
        let scrollPercentage = (sectionScrollTop / sectionScrollHeight) * 100;
        
        // 限制滾動百分比在 0-100% 之間
        scrollPercentage = Math.max(0, Math.min(100, scrollPercentage));
        
        console.log(`[DEBUG] step ${section.getAttribute('data-step')} 滾動百分比: ${scrollPercentage.toFixed(1)}% (section高度: ${sectionHeight}px, 已滾動: ${sectionScrollTop}px)`);
        
        // 如果滾動百分比在 10%~80% 之間，記錄這個 section
        if (scrollPercentage >= 10 && scrollPercentage <= 80) {
          currentVisibleStep = parseInt(section.getAttribute('data-step'));
          currentScrollPercentage = scrollPercentage;
        }
      }
    });
    
    // 如果找到可見的 step 且與當前不同，更新問題並顯示 modal-panel
    if (currentVisibleStep && currentVisibleStep !== currentStep) {
      currentStep = currentVisibleStep;
      console.log(`[DEBUG] 切換到 step ${currentStep}，滾動百分比: ${currentScrollPercentage.toFixed(1)}%`);
      renderStepQuestions(questionList, projectData, currentStep);
      
      // 滑入 modal-panel
      console.log(`[DEBUG] step ${currentStep} 滑入 modal-panel`);
      modalPanel.style.transform = 'translateY(0)';
    } else if (!currentVisibleStep && currentStep) {
      // 如果沒有可見的 step，滑出 modal-panel
      console.log(`[DEBUG] 滑出 modal-panel`);
      modalPanel.style.transform = 'translateY(100%)';
      currentStep = null;
    }
  };
  
  // 添加滾動監聽器
  modalContent.addEventListener('scroll', scrollHandler);
  
  // 添加視窗大小變化監聽器，重新計算滾動位置
  const resizeHandler = () => {
    console.log('[DEBUG] 視窗大小變化，重新計算滾動位置');
    // 延遲執行，確保 DOM 更新完成
    setTimeout(() => {
      scrollHandler();
    }, 100);
  };
  
  window.addEventListener('resize', resizeHandler);
  
  // 使用 ResizeObserver 監聽 modal 本身的尺寸變化
  const modal = modalContent.closest('.project-modal');
  let resizeObserver = null;
  
  if (modal && window.ResizeObserver) {
    resizeObserver = new ResizeObserver((entries) => {
      console.log('[DEBUG] Modal 尺寸變化，重新計算滾動位置');
      // 延遲執行，確保 DOM 更新完成
      setTimeout(() => {
        scrollHandler();
      }, 100);
    });
    
    resizeObserver.observe(modal);
  }
  
  // 清理函數
  const cleanupAll = () => {
    modalContent.removeEventListener('scroll', scrollHandler);
    window.removeEventListener('resize', resizeHandler);
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  };
  modalContent.setAttribute('data-cleanup', 'true');
  modalContent.addEventListener('close', cleanupAll);
}

// 渲染特定 step 的問題
function renderStepQuestions(questionList, projectData, step) {
  console.log(`[DEBUG] 開始渲染 step ${step} 的問題`);
  
  if (!projectData.content || !projectData.content.sections) {
    console.warn('[DEBUG] 專案資料結構不完整');
    return;
  }
  
  // 找到對應 step 的 section
  const section = projectData.content.sections.find(s => s.step === step);
  console.log(`[DEBUG] 獲取到的 section:`, section);
  
  if (!section) {
    console.warn(`[DEBUG] 找不到 step ${step} 的 section`);
    return;
  }
  
  if (section.type !== 'imgBlock') {
    console.warn(`[DEBUG] step ${step} 的 section 不是 imgBlock 類型`);
    return;
  }
  
  if (!section.questions) {
    console.warn(`[DEBUG] step ${step} 的 section 沒有 questions 資料`);
    return;
  }
  
  console.log(`[DEBUG] step ${step} 的問題資料:`, section.questions);
  
  // 清空現有問題
  questionList.innerHTML = '';
  console.log('[DEBUG] 已清空問題列表');
  
  // 渲染該 step 的問題
  section.questions.forEach((question, questionIndex) => {
    console.log(`[DEBUG] 渲染問題 ${questionIndex}:`, question);
    
    const questionItem = document.createElement('li');
    questionItem.className = 'question-item';
    questionItem.innerHTML = `
      <div class="question-text">${question.text}</div>
    `;
    
    // 將問題資料存儲在 dataset 中，供點擊事件處理器使用
    questionItem.dataset.reply = question.reply;
    questionItem.dataset.questionData = JSON.stringify(question);
    
    questionList.appendChild(questionItem);
  });
  
  console.log(`[DEBUG] 完成渲染 step ${step} 的問題，共 ${section.questions.length} 個問題`);
}

// 處理問題項目點擊事件
async function handleQuestionItemClick(question, projectData) {
  // 防重複觸發機制
  const clickKey = `${question.text}-${Date.now()}`;
  if (handleQuestionItemClick._processing) {
    console.log('[DEBUG] 問題點擊處理中，忽略重複觸發');
    return;
  }
  
    handleQuestionItemClick._processing = true;
  
  try {
    // 記錄問題點擊（包含 label）
    const { markQuestionClicked } = await import('../../utils/chatState.js');
    if (question.id) {
      markQuestionClicked(question.id, question.label || "其他");
    }
    
    console.log('[DEBUG] 問題項目被點擊:', question);
    console.log('[DEBUG] 當前頁面滾動位置:', window.scrollY);
    console.log('[DEBUG] 當前頁面 URL:', window.location.href);

    // 檢查當前視窗寬度來決定使用哪種邏輯
    const isDesktop = window.innerWidth >= 768;
    console.log('[DEBUG] 當前視窗寬度:', window.innerWidth, '是否為桌面版:', isDesktop);

    if (isDesktop) {
      // 桌面版邏輯（768px以上）：使用原本的插入body流程
      await handleDesktopLogic(question, projectData);
    } else {
      // 手機版邏輯（768px以下）：維持在mainContent中，加上chevron-down樣式
      await handleMobileLogic(question, projectData);
    }

    console.log('[DEBUG] handleQuestionItemClick 函數執行完成');

  } catch (error) {
    console.error('[DEBUG] 處理問題點擊時發生錯誤:', error);
  } finally {
    // 重置處理標記
    setTimeout(() => {
      handleQuestionItemClick._processing = false;
    }, 1000); // 1秒後重置，防止卡死
  }
}

// 桌面版邏輯（768px以上）
async function handleDesktopLogic(question, projectData) {
  console.log('[DEBUG] 執行桌面版邏輯');
  
  // 保存當前滾動位置
  const currentScrollY = window.scrollY;
  console.log('[DEBUG] 保存當前滾動位置:', currentScrollY);

  // 禁用滾動以防止DOM操作期間的滾動重置
  const originalOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  
  // 保存滾動容器的滾動位置
  const modalContent = document.querySelector('.project-modal .modal-content');
  let modalScrollTop = 0;
  if (modalContent) {
    modalScrollTop = modalContent.scrollTop;
    console.log('[DEBUG] 保存 modal 內容滾動位置:', modalScrollTop);
  }

  // 將 project-modal 移動到 body 並設置 position: static
  const modal = document.querySelector('.project-modal');
  console.log('[DEBUG] 找到 modal:', !!modal);

  if (modal) {
    console.log('[DEBUG] 開始移動 modal 到 body');
    console.log('[DEBUG] Modal 當前位置:', modal.parentElement);

    // 使用 requestAnimationFrame 確保操作在合適的時機執行
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        // 移動到 body
        document.body.appendChild(modal);
        console.log('[DEBUG] Modal 已移動到 body');

        // 添加 chatRoom 類別來觸發CSS樣式
        modal.classList.add('chatRoom');
        
        // 移除 modal 相關的樣式類別
        modal.classList.add('active');

        // 清理事件監聽器的函數
        const cleanupEventListeners = () => {
          window.removeEventListener('popstate', handlePathChange);
          document.removeEventListener('click', handleLinkClick);
        };

        // 監聽路徑變化，當路徑變化時清除modal
        const handlePathChange = () => {
          console.log('[DEBUG] 偵測到路徑變化，清除project-modal');
          if (modal && modal.parentElement) {
            modal.remove();
          }
          cleanupModalLookBtn();
          cleanupEventListeners();
        };

        // 監聽瀏覽器的前進/後退按鈕
        window.addEventListener('popstate', handlePathChange);

        // 監聽導航連結點擊
        const handleLinkClick = (e) => {
          const link = e.target.closest('a[data-link]');
          if (link) {
            console.log('[DEBUG] 偵測到導航連結點擊，清除project-modal');
            if (modal && modal.parentElement) {
              modal.remove();
            }
            cleanupModalLookBtn();
            cleanupEventListeners();
          }
        };
        document.addEventListener('click', handleLinkClick);

        // 當modal被移除時也清理事件監聽器
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => {
              if (node === modal) {
                console.log('[DEBUG] Modal 被移除，清理事件監聽器');
                cleanupModalLookBtn();
                cleanupEventListeners();
                observer.disconnect();
              }
            });
          });
        });
        
        observer.observe(document.body, { childList: true });

        console.log('[DEBUG] Modal 樣式設置完成');

        // 恢復 modal 內容的滾動位置
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
          modalContent.scrollTop = modalScrollTop;
          console.log('[DEBUG] 恢復 modal 內容滾動位置:', modalScrollTop);
        }

        console.log('[DEBUG] Modal 移動和樣式設置完成');
        
        // 立即恢復頁面滾動位置
        window.scrollTo(0, currentScrollY);
        console.log('[DEBUG] 立即恢復頁面滾動位置:', currentScrollY);
        
        resolve();
      });
    });
  }
  
  // 重新啟用滾動
  document.body.style.overflow = originalOverflow;

  // 只在不是 /chatRoom 時才切換路徑
  const isAlreadyChatRoom = window.location.pathname === '/chatRoom';
  console.log('[DEBUG] 當前路徑:', window.location.pathname);
  console.log('[DEBUG] 是否需要切換路徑:', !isAlreadyChatRoom);

  const showMessage = async () => {
    console.log('[DEBUG] 開始處理訊息泡泡，當前滾動位置:', window.scrollY);
    const chatWindow = document.getElementById('chatWindow');
    console.log('[DEBUG] 找到 chatWindow:', !!chatWindow);
    if (chatWindow) {
      // 導入必要的函數
      const { saveMessage } = await import('../../utils/chatState.js');
      const { formatReplyText, typeTextWithHTML } = await import('../../utils/formatters.js');
      console.log('[DEBUG] 函數導入完成');
      // 保存用戶訊息到快取
      await saveMessage(question.text, 'user');
      console.log('[DEBUG] 用戶訊息已保存');
      // 保存 bot 回覆到快取
      await saveMessage(question.reply, 'bot');
      console.log('[DEBUG] Bot 回覆已保存');
      // 創建並添加用戶訊息泡泡
      const userBubbleWrapper = document.createElement('div');
      userBubbleWrapper.className = 'chatBubble chatBubble--user';
      const userMessage = document.createElement('div');
      userMessage.className = 'chatBubbleMessage';
      userMessage.innerHTML = formatReplyText(question.text);
      userBubbleWrapper.appendChild(userMessage);
      chatWindow.appendChild(userBubbleWrapper);
      console.log('[DEBUG] 用戶訊息泡泡已添加');
      // 創建並添加 bot 訊息泡泡（使用打字機效果）
      const botBubbleWrapper = document.createElement('div');
      botBubbleWrapper.className = 'chatBubble chatBubble--bot';
      const botMessage = document.createElement('div');
      botMessage.className = 'chatBubbleMessage';
      typeTextWithHTML(formatReplyText(question.reply), botMessage, 100, 5);
      botBubbleWrapper.appendChild(botMessage);
      chatWindow.appendChild(botBubbleWrapper);
      console.log('[DEBUG] Bot 訊息泡泡已添加');
      // 滾動到聊天室底部顯示最新訊息
      chatWindow.scrollTop = chatWindow.scrollHeight;
      console.log('[DEBUG] 聊天室已滾動到底部');
      console.log('[DEBUG] 訊息泡泡已觸發並保存');
    } else {
      console.warn('[DEBUG] 找不到 chatWindow 元素');
    }
  };

  if (!isAlreadyChatRoom) {
    // 只在不是 chatRoom 時才切換路徑
    const navigate = (path) => {
      console.log('[DEBUG] 執行 navigate 函數，路徑:', path);
      
      // 設置標記，表示是從問題點擊進入聊天室
      if (path === '/chatRoom') {
        sessionStorage.setItem('fromQuestionClick', 'true');
        // 保存問題數據，讓聊天室在初始化完成後顯示
        sessionStorage.setItem('pendingQuestionData', JSON.stringify({
          text: question.text,
          reply: question.reply,
          id: question.id,
          label: question.label || "其他"
        }));
        console.log('[DEBUG] 設置 fromQuestionClick 標記和問題數據');
      }
      
      // 在路由切換前再次保存滾動位置
      const scrollY = window.scrollY;
      console.log('[DEBUG] Navigate 前保存滾動位置:', scrollY);
      
      history.pushState({}, "", path);
      const router = (async () => {
        const { default: routerFunc } = await import('../../router/index.js');
        return routerFunc;
      })();
      router.then(async (routerFunc) => {
        console.log('[DEBUG] Router 函數載入完成，開始執行');
        routerFunc(path);
        console.log('[DEBUG] Router 函數執行完成');
        
        // 更新 sidebar 的 active 狀態
        const { setActiveLink } = await import('../../main.js');
        setActiveLink(path);
        console.log('[DEBUG] Sidebar active 狀態已更新');
        
        // 使用多次嘗試來確保滾動位置恢復
        const restoreScroll = () => {
          console.log('[DEBUG] 嘗試恢復滾動位置到:', scrollY);
          window.scrollTo(0, scrollY);
          
          // 檢查滾動位置是否正確設置
          setTimeout(() => {
            const actualScrollY = window.scrollY;
            console.log('[DEBUG] 實際滾動位置:', actualScrollY, '期望位置:', scrollY);
            if (Math.abs(actualScrollY - scrollY) > 5) {
              console.log('[DEBUG] 滾動位置不正確，再次嘗試恢復');
              window.scrollTo(0, scrollY);
            }
          }, 50);
        };
        
        // 多次嘗試恢復滾動位置
        setTimeout(restoreScroll, 50);
        setTimeout(restoreScroll, 100);
        setTimeout(() => {
          restoreScroll();
          // 不再在這裡調用 showMessage，讓聊天室在初始化完成後處理問題訊息
          console.log('[DEBUG] 路由切換完成，問題訊息將由聊天室處理');
        }, 150);
        
        // 路徑切換完成後，創建並插入 modalLookBtn
        setTimeout(() => {
          const modal = document.querySelector('.project-modal');
          console.log('[DEBUG] 桌面版路徑切換完成後檢查 modal:', !!modal);
          if (modal) {
            const modalLookBtn = createModalLookBtn(modal);
            document.body.appendChild(modalLookBtn);
            console.log('[DEBUG] 桌面版路徑切換完成後創建 modalLookBtn，當前視窗寬度:', window.innerWidth);
            console.log('[DEBUG] modalLookBtn 已插入到 body，元素:', modalLookBtn);
          } else {
            console.log('[DEBUG] 桌面版路徑切換完成後未找到 modal');
          }
        }, 200);
      });
    };
    navigate('/chatRoom');
    console.log('[DEBUG] Navigate 函數調用完成');
  } else {
    showMessage(); // 直接顯示訊息
    
    // 如果已經在 chatRoom，也要創建 modalLookBtn
    setTimeout(() => {
      const modal = document.querySelector('.project-modal');
      console.log('[DEBUG] 桌面版已在 chatRoom 檢查 modal:', !!modal);
      if (modal) {
        const modalLookBtn = createModalLookBtn(modal);
        document.body.appendChild(modalLookBtn);
        console.log('[DEBUG] 桌面版已在 chatRoom，創建 modalLookBtn，當前視窗寬度:', window.innerWidth);
        console.log('[DEBUG] modalLookBtn 已插入到 body，元素:', modalLookBtn);
      } else {
        console.log('[DEBUG] 桌面版已在 chatRoom 但未找到 modal');
      }
    }, 100);
  }
}

// 手機版邏輯（768px以下）
async function handleMobileLogic(question, projectData) {
  console.log('[DEBUG] 執行手機版邏輯');
  
  const modal = document.querySelector('.project-modal');
  if (!modal) {
    console.warn('[DEBUG] 找不到 project-modal');
    return;
  }

  // 添加 chatRoom 類別（如果還沒有的話）
  if (!modal.classList.contains('chatRoom')) {
    modal.classList.add('chatRoom');
  }

  // 保存當前滾動位置
  const currentScrollY = window.scrollY;
  console.log('[DEBUG] 保存當前滾動位置:', currentScrollY);

  // 只在不是 /chatRoom 時才切換路徑
  const isAlreadyChatRoom = window.location.pathname === '/chatRoom';
  console.log('[DEBUG] 當前路徑:', window.location.pathname);
  console.log('[DEBUG] 是否需要切換路徑:', !isAlreadyChatRoom);

  if (!isAlreadyChatRoom) {
    // 在切換路徑前，先將 modal 移動到 body 以避免被 mainContent 重新渲染清除
    console.log('[DEBUG] 切換路徑前移動 modal 到 body');
    document.body.appendChild(modal);
    
    // 清理事件監聽器的函數
    const cleanupEventListeners = () => {
      window.removeEventListener('popstate', handlePathChange);
      document.removeEventListener('click', handleLinkClick);
    };

    // 監聽路徑變化，當路徑變化時清除modal
    const handlePathChange = () => {
      console.log('[DEBUG] 偵測到路徑變化，清除project-modal');
      if (modal && modal.parentElement) {
        modal.remove();
      }
      cleanupModalLookBtn();
      cleanupEventListeners();
    };

    // 監聽瀏覽器的前進/後退按鈕
    window.addEventListener('popstate', handlePathChange);

    // 監聽導航連結點擊
    const handleLinkClick = (e) => {
      const link = e.target.closest('a[data-link]');
      if (link) {
        console.log('[DEBUG] 偵測到導航連結點擊，清除project-modal');
        if (modal && modal.parentElement) {
          modal.remove();
        }
        cleanupModalLookBtn();
        cleanupEventListeners();
      }
    };
    document.addEventListener('click', handleLinkClick);

    // 當modal被移除時也清理事件監聽器
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === modal) {
            console.log('[DEBUG] Modal 被移除，清理事件監聽器');
            cleanupModalLookBtn();
            cleanupEventListeners();
            observer.disconnect();
          }
        });
      });
    });
    
    observer.observe(document.body, { childList: true });
    
    // 只在不是 chatRoom 時才切換路徑
    const navigate = (path) => {
      console.log('[DEBUG] 執行 navigate 函數，路徑:', path);
      
      // 設置標記，表示是從問題點擊進入聊天室
      if (path === '/chatRoom') {
        sessionStorage.setItem('fromQuestionClick', 'true');
        // 保存問題數據，讓聊天室在初始化完成後顯示
        sessionStorage.setItem('pendingQuestionData', JSON.stringify({
          text: question.text,
          reply: question.reply,
          id: question.id,
          label: question.label || "其他"
        }));
        console.log('[DEBUG] 設置 fromQuestionClick 標記和問題數據');
      }
      
      // 在路由切換前再次保存滾動位置
      const scrollY = window.scrollY;
      console.log('[DEBUG] Navigate 前保存滾動位置:', scrollY);
      
      history.pushState({}, "", path);
      const router = (async () => {
        const { default: routerFunc } = await import('../../router/index.js');
        return routerFunc;
      })();
      router.then(async (routerFunc) => {
        console.log('[DEBUG] Router 函數載入完成，開始執行');
        routerFunc(path);
        console.log('[DEBUG] Router 函數執行完成');
        
        // 更新 sidebar 的 active 狀態
        const { setActiveLink } = await import('../../main.js');
        setActiveLink(path);
        console.log('[DEBUG] Sidebar active 狀態已更新');
        
        // 使用多次嘗試來確保滾動位置恢復
        const restoreScroll = () => {
          console.log('[DEBUG] 嘗試恢復滾動位置到:', scrollY);
          window.scrollTo(0, scrollY);
          
          // 檢查滾動位置是否正確設置
          setTimeout(() => {
            const actualScrollY = window.scrollY;
            console.log('[DEBUG] 實際滾動位置:', actualScrollY, '期望位置:', scrollY);
            if (Math.abs(actualScrollY - scrollY) > 5) {
              console.log('[DEBUG] 滾動位置不正確，再次嘗試恢復');
              window.scrollTo(0, scrollY);
            }
          }, 50);
        };
        
        // 多次嘗試恢復滾動位置
        setTimeout(restoreScroll, 50);
        setTimeout(restoreScroll, 100);
        setTimeout(() => {
          restoreScroll();
          // 不再在這裡調用 showMessageInChatRoom，讓聊天室在初始化完成後處理問題訊息
          console.log('[DEBUG] 路由切換完成，問題訊息將由聊天室處理');
        }, 150);
        
        // 路徑切換完成後，創建並插入 modalLookBtn
        setTimeout(() => {
          const modal = document.querySelector('.project-modal');
          if (modal) {
            const modalLookBtn = createModalLookBtn(modal);
            document.body.appendChild(modalLookBtn);
            console.log('[DEBUG] 路徑切換完成後創建 modalLookBtn');
          }
        }, 200);
      });
    };
    navigate('/chatRoom');
    console.log('[DEBUG] Navigate 函數調用完成');
  } else {
    // 如果已經在 chatRoom，也保存問題數據並直接顯示訊息
    sessionStorage.setItem('pendingQuestionData', JSON.stringify({
      text: question.text,
      reply: question.reply,
      id: question.id,
      label: question.label || "其他"
    }));
    console.log('[DEBUG] 已在 chatRoom，保存問題數據並直接顯示訊息');
    await showMessageInChatRoom(question);
    
    // 如果已經在 chatRoom，也要創建 modalLookBtn
    setTimeout(() => {
      const modal = document.querySelector('.project-modal');
      if (modal) {
        const modalLookBtn = createModalLookBtn(modal);
        document.body.appendChild(modalLookBtn);
        console.log('[DEBUG] 已在 chatRoom，創建 modalLookBtn');
      }
    }, 100);
    
    // 為已在 chatRoom 的情況也添加路徑切換監聽器
    // 清理事件監聽器的函數
    const cleanupEventListeners = () => {
      window.removeEventListener('popstate', handlePathChange);
      document.removeEventListener('click', handleLinkClick);
    };

    // 監聽路徑變化，當路徑變化時清除modal
    const handlePathChange = () => {
      console.log('[DEBUG] 偵測到路徑變化，清除project-modal');
      if (modal && modal.parentElement) {
        modal.remove();
      }
      cleanupModalLookBtn();
      cleanupEventListeners();
    };

    // 監聽瀏覽器的前進/後退按鈕
    window.addEventListener('popstate', handlePathChange);

    // 監聽導航連結點擊
    const handleLinkClick = (e) => {
      const link = e.target.closest('a[data-link]');
      if (link) {
        console.log('[DEBUG] 偵測到導航連結點擊，清除project-modal');
        if (modal && modal.parentElement) {
          modal.remove();
        }
        cleanupModalLookBtn();
        cleanupEventListeners();
      }
    };
    document.addEventListener('click', handleLinkClick);

    // 當modal被移除時也清理事件監聽器
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === modal) {
            console.log('[DEBUG] Modal 被移除，清理事件監聽器');
            cleanupModalLookBtn();
            cleanupEventListeners();
            observer.disconnect();
          }
        });
      });
    });
    
    observer.observe(document.body, { childList: true });
  }
}

// 在聊天室中顯示訊息的通用函數
async function showMessageInChatRoom(question) {
  console.log('[DEBUG] 開始處理訊息泡泡');
  const chatWindow = document.getElementById('chatWindow');
  console.log('[DEBUG] 找到 chatWindow:', !!chatWindow);
  
  if (chatWindow) {
    try {
      // 導入必要的函數
      const { saveMessage } = await import('../../utils/chatState.js');
      const { formatReplyText, typeTextWithHTML } = await import('../../utils/formatters.js');
      console.log('[DEBUG] 函數導入完成');
      
      // 保存用戶訊息到快取
      await saveMessage(question.text, 'user');
      console.log('[DEBUG] 用戶訊息已保存');
      
      // 保存 bot 回覆到快取
      await saveMessage(question.reply, 'bot');
      console.log('[DEBUG] Bot 回覆已保存');
      
      // 創建並添加用戶訊息泡泡
      const userBubbleWrapper = document.createElement('div');
      userBubbleWrapper.className = 'chatBubble chatBubble--user';
      const userMessage = document.createElement('div');
      userMessage.className = 'chatBubbleMessage';
      userMessage.innerHTML = formatReplyText(question.text);
      userBubbleWrapper.appendChild(userMessage);
      chatWindow.appendChild(userBubbleWrapper);
      console.log('[DEBUG] 用戶訊息泡泡已添加');
      
      // 創建並添加 bot 訊息泡泡（使用打字機效果）
      const botBubbleWrapper = document.createElement('div');
      botBubbleWrapper.className = 'chatBubble chatBubble--bot';
      const botMessage = document.createElement('div');
      botMessage.className = 'chatBubbleMessage';
      typeTextWithHTML(formatReplyText(question.reply), botMessage, 100, 5);
      botBubbleWrapper.appendChild(botMessage);
      chatWindow.appendChild(botBubbleWrapper);
      console.log('[DEBUG] Bot 訊息泡泡已添加');
      
      // 滾動到聊天室底部顯示最新訊息
      chatWindow.scrollTop = chatWindow.scrollHeight;
      console.log('[DEBUG] 聊天室已滾動到底部');
      console.log('[DEBUG] 訊息泡泡已觸發並保存');
    } catch (error) {
      console.error('[DEBUG] 處理訊息泡泡時發生錯誤:', error);
    }
  } else {
    console.warn('[DEBUG] 找不到 chatWindow 元素');
  }
}

// 清理 modalLookBtn 的通用函數
function cleanupModalLookBtn() {
  console.log('[DEBUG] 開始執行 cleanupModalLookBtn');
  const modalLookBtn = document.querySelector('.modal-lookBtn');
  console.log('[DEBUG] 找到 modalLookBtn:', !!modalLookBtn);
  if (modalLookBtn) {
    modalLookBtn.remove();
    console.log('[DEBUG] 已移除 modalLookBtn');
  } else {
    console.log('[DEBUG] 未找到 modalLookBtn，可能已被清理');
  }
}

// 禁用 modalLookBtn 的函數
function disableModalLookBtn() {
  console.log('[DEBUG] 開始執行 disableModalLookBtn');
  const modalLookBtn = document.querySelector('.modal-lookBtn');
  console.log('[DEBUG] 找到 modalLookBtn:', !!modalLookBtn);
  if (modalLookBtn) {
    modalLookBtn.classList.add('disabled');
    console.log('[DEBUG] 已添加 disabled 類到 modalLookBtn');
    console.log('[DEBUG] modalLookBtn 當前類別:', modalLookBtn.className);
  } else {
    console.log('[DEBUG] 未找到 modalLookBtn，可能已被清理或尚未創建');
  }
}

// 創建 modalLookBtn 函數
function createModalLookBtn(modal) {
  console.log('[DEBUG] 開始創建 modalLookBtn，當前視窗寬度:', window.innerWidth);
  
  // 先移除舊的 modal-lookBtn，避免重複
  const oldModalLookBtns = document.querySelectorAll('.modal-lookBtn');
  oldModalLookBtns.forEach(btn => {
    btn.remove();
    console.log('[DEBUG] 已移除舊的 modalLookBtn');
  });
  
  const modalLookBtn = document.createElement('button');
  modalLookBtn.className = 'modal-lookBtn';
  modalLookBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  console.log('[DEBUG] modalLookBtn 創建完成，類別:', modalLookBtn.className);
  
  // 不自動檢查 modal 狀態，讓外部控制禁用狀態
  
  // 添加點擊事件監聽器
  modalLookBtn.addEventListener('click', () => {
    // 如果按鈕被禁用，不執行任何操作
    if (modalLookBtn.classList.contains('disabled')) {
      return;
    }
    console.log('[DEBUG] modalLookBtn 被點擊');
    toggleModalLook(modal, modalLookBtn);
  });
  
  return modalLookBtn;
}

// 切換 modal-look 樣式的函數
function toggleModalLook(modal, modalLookBtn) {
  // 如果按鈕被禁用，不執行任何操作
  if (modalLookBtn.classList.contains('disabled')) {
    return;
  }
  
  const isModalLook = modal.classList.contains('modal-look');
  
  if (isModalLook) {
    // 如果當前是 modal-look 狀態，移除樣式
    modal.classList.remove('modal-look');
    modalLookBtn.classList.remove('active');
    console.log('[DEBUG] 移除 modal-look 樣式');
  } else {
    // 如果當前不是 modal-look 狀態，添加樣式
    modal.classList.add('modal-look');
    modalLookBtn.classList.add('active');
    console.log('[DEBUG] 添加 modal-look 樣式');
  }
}

// 設置目錄條功能
function setupTableOfContents(tableOfContents, projectData, modalContent) {
  console.log('[DEBUG] 開始設置目錄條');
  
  // 清空現有內容
  tableOfContents.innerHTML = '';
  
  // 檢查是否有 sections 資料
  if (!projectData.content || !projectData.content.sections) {
    console.log('[DEBUG] 沒有 sections 資料，隱藏目錄條');
    tableOfContents.style.display = 'none';
    return;
  }
  
  // 過濾出有 step 和 name 的 sections
  const sectionsWithStep = projectData.content.sections.filter(section => 
    section.step && section.name && section.type === 'imgBlock'
  );
  
  if (sectionsWithStep.length === 0) {
    console.log('[DEBUG] 沒有有效的 sections，隱藏目錄條');
    tableOfContents.style.display = 'none';
    return;
  }
  
  console.log('[DEBUG] 找到有效的 sections:', sectionsWithStep);
  
  // 創建目錄條容器
  const tocContainer = document.createElement('div');
  tocContainer.className = 'toc-container';
  
  // 創建標題
  // const tocTitle = document.createElement('div');
  // tocTitle.className = 'toc-title';
  // tocTitle.textContent = '目錄';
  // tocContainer.appendChild(tocTitle);
  
  // 創建目錄項目列表
  const tocList = document.createElement('ul');
  tocList.className = 'toc-list';
  
  sectionsWithStep.forEach((section, index) => {
    const tocItem = document.createElement('li');
    tocItem.className = 'toc-item';
    tocItem.setAttribute('data-step', section.step);
    
    // 創建圓點指示器
    const indicator = document.createElement('div');
    indicator.className = 'toc-indicator';
    // indicator.textContent = section.step;
    
    // 創建工具提示
    const tooltip = document.createElement('div');
    tooltip.className = 'toc-tooltip';
    tooltip.textContent = section.name;
    
    tocItem.appendChild(indicator);
    tocItem.appendChild(tooltip);
    
    // 添加點擊事件，滾動到對應的 section
    tocItem.addEventListener('click', () => {
      const targetSection = modalContent.querySelector(`.behance-section[data-step="${section.step}"]`);
      if (targetSection) {
        targetSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        console.log(`[DEBUG] 點擊目錄項目，滾動到 step ${section.step}`);
      }
    });
    
    tocList.appendChild(tocItem);
  });
  
  tocContainer.appendChild(tocList);
  tableOfContents.appendChild(tocContainer);
  
  // 顯示目錄條
  tableOfContents.style.display = 'block';
  
  // 設置滾動監聽，更新當前活動的目錄項目
  let currentActiveStep = null;
  
  const updateActiveTocItem = () => {
    const sections = modalContent.querySelectorAll('.behance-section[data-step]');
    const modalRect = modalContent.getBoundingClientRect();
    const clientHeight = modalContent.clientHeight;
    
    let newActiveStep = null;
    
    sections.forEach((section) => {
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top - modalRect.top;
      const sectionHeight = section.offsetHeight;
      
      // 檢查 section 是否在視窗中央附近
      if (sectionTop <= clientHeight / 2 && sectionTop + sectionHeight >= clientHeight / 2) {
        newActiveStep = parseInt(section.getAttribute('data-step'));
      }
    });
    
    // 更新活動狀態
    if (newActiveStep !== currentActiveStep) {
      // 移除舊的活動狀態
      const oldActiveItem = tableOfContents.querySelector('.toc-item.active');
      if (oldActiveItem) {
        oldActiveItem.classList.remove('active');
      }
      
      // 添加新的活動狀態
      if (newActiveStep) {
        const newActiveItem = tableOfContents.querySelector(`.toc-item[data-step="${newActiveStep}"]`);
        if (newActiveItem) {
          newActiveItem.classList.add('active');
        }
      }
      
      currentActiveStep = newActiveStep;
    }
  };
  
  // 添加滾動監聽器
  modalContent.addEventListener('scroll', updateActiveTocItem);
  
  // 初始更新一次
  setTimeout(updateActiveTocItem, 100);
  
  console.log('[DEBUG] 目錄條設置完成');
}