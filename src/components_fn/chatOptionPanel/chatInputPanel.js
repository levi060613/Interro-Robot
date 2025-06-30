// components_fn/chatInputPanel.js

// ========== 聊天输入面板组件 ==========
// 这个组件负责处理聊天界面的输入区域，包括建议选项的显示、用户输入处理和消息展示

// ========== 导入工具与数据处理函数 ==========
// 导入格式化消息、输入监听、建议选项过滤、聊天状态管理、以及从远程获取数据的函数
import { formatReplyText, typeTextWithHTML } from '../../utils/formatters.js';
import {
  getSuggestionsByKeyword,
  attachInputListeners,
  showComposingHint
} from '../../utils/handleInput.js';
import {
  markOptionClicked,
  markQuestionClicked,
  getClickedOptions,
  getClickedQuestionIds,
  saveMessage
} from '../../utils/chatState.js';
import { fetchOptions, fetchQuestions, fetchQuestionsByIds, fetchIntroductionInfo, fetchTags, fetchQuestionsByTag } from '../../utils/fetchData.js';
import { all_tags } from '../../utils/tempData.js';
import { createProjectModal } from '../projectDetail/modal.js';
import { projects as localProjects } from '../../utils/tempData.js';
import { fetchProjectList } from '../../utils/fetchData.js';

// ========== 主要初始化函数 ==========
export default async function initChatInputPanel(initialOptions) {
  // 获取必要的DOM元素
  const suggestionButton = document.getElementById('suggestionButton'); // 替换 input 为按钮
  const carouselEl = document.querySelector('.chatInputPanel__carousel'); // 轮播容器
  const dotsEl = document.querySelector('.chatInputPanel__carousel--dots'); // 轮播指示点
  const chatWindow = document.getElementById('chatWindow'); // 聊天窗口

  // ========== 状态管理变量 ==========
  let currentStep = 1; // 当前显示的步骤
  let groupsData = []; // 存储每个步骤的建议数据
  let extraMessageShown = new Set(); // 记录已显示的额外消息
  let isCarouselVisible = false; // 新增：追踪轮播显示状态

  // ========== 状态恢复逻辑 ==========
  // 从sessionStorage中恢复之前的状态
  const cachedState = sessionStorage.getItem('chatInputState');
  const cachedExtraMessages = sessionStorage.getItem('extraMessages');
  if (cachedExtraMessages) {
    extraMessageShown = new Set(JSON.parse(cachedExtraMessages));
  }

  if (cachedState) {
    try {
      const state = JSON.parse(cachedState);
      currentStep = state.currentStep || 1;
      groupsData = state.groupsData || [];

      // 如果缓存数据存在但没有groupsData或Step 1数据，则用初始options填充
      if (groupsData.length === 0 || !groupsData[0]) {
        const step1Options = initialOptions.map(opt => ({
          text: opt.text,
          reply: opt.reply,
          questions_id: opt.questions_id || [],
          clicked: false
        }));
        groupsData[0] = step1Options;
      }

      // 根据缓存的groupsData重新渲染所有suggestion groups
      groupsData.forEach((options, index) => {
        if (options) {
          createOrReplaceSuggestionGroup(options, index + 1);
        }
      });

    } catch (e) {
      console.error("解析 chatInputState 缓存失败:", e);
      // 解析失败，使用初始状态
      currentStep = 1;
      groupsData = [];
      const step1Options = initialOptions.map(opt => ({
        text: opt.text,
        reply: opt.reply,
        questions_id: opt.questions_id || [],
        clicked: false
      }));
      groupsData[0] = step1Options;
      createOrReplaceSuggestionGroup(step1Options, 1);
    }
  } else {
    // ========== 如果没有缓存，初始化Step 1 Suggestions ==========
    const step1Options = initialOptions.map(opt => ({
      text: opt.text,
      reply: opt.reply,
      questions_id: opt.questions_id || [],
      clicked: false
    }));
    groupsData[0] = step1Options;
    createOrReplaceSuggestionGroup(step1Options, 1);
  }

  // 确保groupsData中每个步骤的数据都是有效的数组
  groupsData = groupsData.map(group => (Array.isArray(group) ? group : []));

  // ========== 初始化UI状态 ==========
  updateDots(); // 初始化指示点
  scrollToStep(currentStep); // 滚动到当前步骤

  // 初始隐藏轮播和指示点（聚焦时显示）
  carouselEl.style.display = 'none';
  dotsEl.style.display = 'none';

  // ========== 按钮点击事件处理 ==========
  suggestionButton.addEventListener('click', () => {
    isCarouselVisible = !isCarouselVisible;
    carouselEl.style.display = isCarouselVisible ? 'flex' : 'none';
    dotsEl.style.display = isCarouselVisible ? 'flex' : 'none';
    
    if (isCarouselVisible) {
      scrollToStep(currentStep);
    }
  });

  // 点击轮播外部时关闭轮播
  document.addEventListener('click', (e) => {
    if (isCarouselVisible && 
        !carouselEl.contains(e.target) && 
        e.target !== suggestionButton) {
      isCarouselVisible = false;
      carouselEl.style.display = 'none';
      dotsEl.style.display = 'none';
    }
  });

  // 让点击carousel内部元素时不会关闭轮播
  carouselEl.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  // ========== 建议选项点击处理 ==========
  carouselEl.addEventListener('click', async (e) => {
    // 检查是否点击了 tag
    const tag = e.target.closest('.carousel__tag');
    if (tag) {
      e.preventDefault();
      e.stopPropagation();
      
      const questionsId = JSON.parse(tag.dataset.questionsId || '[]');
      const tagName = tag.querySelector('p').textContent;
      
      // 获取该标签相关的问题
      let questions;
      try {
        questions = await fetchQuestionsByIds(questionsId);
      } catch (error) {
        const container = tag.closest('.carousel__suggestionGroup');
        if (container) {
          container.innerHTML = '<p class="text-neutral-black">显示问题时发生错误，请稍后再试。</p>';
        }
        return;
      }
      
      // 显示相关问题
      const container = tag.closest('.carousel__suggestionGroup');
      if (container) {
        showTagQuestions(container, questions, tagName);
      }
      return;
    }

    // 检查是否点击了 suggestionItem
    const item = e.target.closest('.carousel__suggestionItem');
    if (!item) return;

    // 检查是否已经点击过
    if (item.classList.contains('carousel__suggestionItem--clicked')) {
      return;
    }

    // 添加clicked样式
    item.classList.add('carousel__suggestionItem--clicked');

    // 更新groupsData中的点击状态
    const currentGroup = groupsData[currentStep - 1];
    const clickedIndex = Array.from(item.parentElement.children).indexOf(item);
    if (currentGroup && currentGroup[clickedIndex]) {
      currentGroup[clickedIndex].clicked = true;
    }

    // 保存状态到sessionStorage
    saveChatInputState();

    // 重置輪播狀態並隱藏輪播
    isCarouselVisible = false;
    carouselEl.style.display = 'none';
    dotsEl.style.display = 'none';

    const text = item.textContent.trim();
    const reply = item.dataset.reply;
    const questionsId = JSON.parse(item.dataset.questionsId || '[]');

    // 用户消息从顶部开始显示
    appendMessage(text, 'user', true);
    await saveMessage(text, 'user');

    // bot回复也从顶部开始显示
    appendMessage(reply, 'bot', true);
    await saveMessage(reply, 'bot');

    // 记录最后的问题ID
    if (item.dataset.id) {
      sessionStorage.setItem('lastQuestionId', item.dataset.id);
    }

    // 检查是否是特定问题，如果是则显示额外消息
    if (item.dataset.id === 'q001' || item.dataset.id === 'q002' || item.dataset.id === 'q003') {
      console.log('检测到特定问题ID:', item.dataset.id);
      handleProjectButtonClick(item);
    }

    // ========== 处理下一层问题 ==========
    if (questionsId.length > 0) {
      // 如果有下一层问题id，就建立下一层suggestions
      const nextQuestions = await fetchQuestionsByIds(questionsId);

      // 将question数据转成{text, reply, questions_id}结构
      const nextOptions = nextQuestions.map(q => ({
        text: q.question,
        reply: q.answer,
        questions_id: q.questions_id || [],
        id: q.id // 添加id属性
      }));

      // 添加被点击的问题作为第一个选项
      nextOptions.unshift({
        text: `「${text.substring(0, 8)}${text.length > 10 ? '...' : ''}」的延伸：`, // 被点击的问题文本
        reply: reply, // 被点击的问题回复
        questions_id: questionsId, // 保持原有的问题ID
        isParentQuestion: true, // 标记这是父问题
        id: 'parent' // 添加父问题的id
      });

      // 只有当新产生的下一层有内容时才增加步骤和储存
      if (nextOptions.length > 0) {
        // 找到最后一个非空的步骤
        let lastStep = groupsData.length;
        while (lastStep > 0 && (!groupsData[lastStep - 1] || groupsData[lastStep - 1].length === 0)) {
          lastStep--;
        }
       
        // 在最后一个非空步骤后添加新的步骤
        currentStep = lastStep + 1;
        groupsData[currentStep - 1] = nextOptions;
        createOrReplaceSuggestionGroup(nextOptions, currentStep);
        updateDots();
        scrollToStep(currentStep);
        saveChatInputState();
      }
    } else {
      // ========== 如果没有延伸问题ID，显示标签建议 ==========
      console.log('没有延伸问题ID，准备显示标签建议');
      
      // 检查最后一个建议组是否已经是标签建议组
      const container = carouselEl.querySelector('.carousel__container');
      const groups = container.querySelectorAll('.carousel__suggestionGroup');
      const lastGroup = groups[groups.length - 1];
      
      if (lastGroup && lastGroup.querySelector('.carousel__tagContainer')) {
        return;
      }
      
      const nextStep = currentStep + 1;
      const nextGroup = document.createElement('ul');
      nextGroup.className = 'carousel__suggestionGroup';
      nextGroup.dataset.step = nextStep;
      carouselEl.querySelector('.carousel__container').appendChild(nextGroup);
      
      await showTagSuggestions(nextGroup);
      
      currentStep = nextStep;
      updateDots();
      scrollToStep(currentStep);
      saveChatInputState();
    }
  });

  // 修改点击事件监听器，只在点击问题选项时清除标签建议组
  carouselEl.addEventListener('click', (e) => {
    const suggestionItem = e.target.closest('.carousel__suggestionItem');
    const tag = e.target.closest('.carousel__tag');
  });

  // ========== 输入监听和搜索处理 ==========
  attachInputListeners(suggestionButton, {
    onSearch: async (keyword) => {
      if (keyword === '#' || keyword === '＃') {
        // 创建一个临时的搜索结果组
        createOrReplaceSuggestionGroup([{
          text: 'loading',
          reply: '',
          questions_id: [],
          clicked: false
        }], 'search');
        
        const searchGroup = carouselEl.querySelector('.carousel__suggestionGroup[data-step="search"]');
        
        if (searchGroup) {
          searchGroup.style.transform = 'translateX(0)';
          // 隐藏其他组
          carouselEl.querySelectorAll('.carousel__suggestionGroup').forEach(group => {
            if (group !== searchGroup) {
              group.style.display = 'none';
            }
          });
          // 显示loading spinner
          searchGroup.innerHTML = '<div class="carousel__spinner"></div>';
          await showTagSuggestions(searchGroup);
          // 搜索模式下不需要更新导航点
        }
        return;
      }
      
      try {
        // 创建一个临时的搜索结果组并显示加载动画
        console.log('创建搜索结果组并显示加载动画');
        createOrReplaceSuggestionGroup([{
          text: 'loading',
          reply: '',
          questions_id: [],
          clicked: false
        }], 'search');
        
        const searchGroup = carouselEl.querySelector('.carousel__suggestionGroup[data-step="search"]');
        console.log('搜索组元素:', searchGroup);
        
        if (searchGroup) {
          searchGroup.style.transform = 'translateX(0)';
          // 隐藏其他组
          carouselEl.querySelectorAll('.carousel__suggestionGroup').forEach(group => {
            if (group !== searchGroup) {
              group.style.display = 'none';
            }
          });
          // 显示加载动画
          console.log('调用showComposingHint');
          showComposingHint(searchGroup);
        }

        console.log('开始从Firebase获取问题');
        // 从Firebase获取所有问题
        const allQuestions = await fetchQuestions();
        console.log('获取到的问题数量:', allQuestions.length);
        
        // 按关键字过滤问题
        const filteredQuestions = allQuestions.filter(q => 
          q.question.toLowerCase().includes(keyword.toLowerCase())
        );
        
        console.log('过滤后的问题数量:', filteredQuestions.length);

        // 将过滤后的问题转换为建议选项格式
        const searchResults = filteredQuestions.map(q => ({
          text: q.question,
          reply: q.answer,
          questions_id: q.questions_id || [],
          clicked: false
        }));

        // 更新搜索结果组
        if (searchResults.length > 0) {
          createOrReplaceSuggestionGroup(searchResults, 'search');
        } else {
          createOrReplaceSuggestionGroup([{
            text: '抱歉，目前尚未更新到這個問題 🥲 ',
            reply: '',
            questions_id: [],
            clicked: false
          }], 'search');
        }
      } catch (error) {
        // 显示错误提示
        createOrReplaceSuggestionGroup([{
          text: '搜索過程發生錯誤，請稍候在試。',
          reply: '',
          questions_id: [],
          clicked: false
        }], 'search');
      }
    },
    onEmpty: () => {
      // 如果关键字为空，恢复显示原始建议组
      carouselEl.querySelectorAll('.carousel__suggestionGroup').forEach(group => {
        group.style.display = 'block';
      });
      scrollToStep(currentStep);
    },
    onComposingStart: () => {
      // 在开始注音输入时显示加载动画
      createOrReplaceSuggestionGroup([{
        text: 'loading',
        reply: '',
        questions_id: [],
        clicked: false
      }], 'search');
      
      const searchGroup = carouselEl.querySelector('.carousel__suggestionGroup[data-step="search"]');
      
      if (searchGroup) {
        searchGroup.style.transform = 'translateX(0)';
        // 隐藏其他组
        carouselEl.querySelectorAll('.carousel__suggestionGroup').forEach(group => {
          if (group !== searchGroup) {
            group.style.display = 'none';
          }
        });
        // 显示加载动画
        showComposingHint(searchGroup);
      }
    }
  });

  // ========== 轮播控制函数 ==========
  function scrollToStep(step) {
    const container = carouselEl.querySelector('.carousel__container');
    const groups = container.querySelectorAll('.carousel__suggestionGroup');
    const slideWidth = container.querySelector('.carousel__suggestionGroup').getBoundingClientRect().width;
    
    // 移动所有group到正确位置
    groups.forEach((group) => {
      const groupStep = parseInt(group.dataset.step);
      if (groupStep === step) {
        group.style.transform = `translateX(0)`;
      } else if (groupStep < step) {
        group.style.transform = `translateX(-${slideWidth}px)`;
      } else {
        group.style.transform = `translateX(${slideWidth}px)`;
      }
    });
    
    // 更新当前步骤
    currentStep = step;
    
    // 更新导航点状态
    updateDots();
  }

  // ========== 轮播拖曳功能 ==========
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;
  let currentIndex = 0;
  let lastDragTime = 0;
  let dragVelocity = 0;

  const container = carouselEl.querySelector('.carousel__container');

  // 检测是否为移动设备
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // 只在移动设备上添加触摸事件
  if (isMobile) {
    container.addEventListener('touchstart', touchStart);
    container.addEventListener('touchmove', touchMove);
    container.addEventListener('touchend', touchEnd);
  }

  // 防止拖曳时选中文本
  container.addEventListener('dragstart', (e) => e.preventDefault());

  // 开始拖曳
  function touchStart(event) {
    isDragging = true;
    startPos = getPositionX(event);
    currentTranslate = 0;
    prevTranslate = 0;
    lastDragTime = Date.now();
    dragVelocity = 0;
    animationID = requestAnimationFrame(animation);
    container.style.cursor = 'grabbing';
  }

  // 拖曳中
  function touchMove(event) {
    if (!isDragging) return;
    
    const currentPosition = getPositionX(event);
    const currentTime = Date.now();
    const timeDiff = currentTime - lastDragTime;
    
    // 提高拖曳灵敏度
    const diff = (currentPosition - startPos) * 0.8; // 原本是1
    dragVelocity = diff / timeDiff; // 像素/毫秒
    currentTranslate = diff;
    
    const slideWidth = container.querySelector('.carousel__suggestionGroup').getBoundingClientRect().width;
    
    // 减少阻尼效果，让拖曳更流畅
    let boundedDiff = diff;
    if (currentStep === 1 && diff > 0) {
      boundedDiff = diff * 0.3; // 从0.15提高到0.25
    } else if (currentStep === groupsData.length && diff < 0) {
      boundedDiff = diff * 0.3; // 从0.15提高到0.25
    }
    
    // 更新所有group的位置
    const groups = container.querySelectorAll('.carousel__suggestionGroup');
    groups.forEach((group, index) => {
      const groupStep = parseInt(group.dataset.step);
      const baseTranslate = groupStep === currentStep ? 0 :
                          groupStep < currentStep ? -slideWidth : slideWidth;
      group.style.transform = `translateX(${baseTranslate + boundedDiff}px)`;
    });
    
    lastDragTime = currentTime;
  }

  // 结束拖曳
  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    container.style.cursor = 'grab';
    
    const slideWidth = container.querySelector('.carousel__suggestionGroup').getBoundingClientRect().width;
    const diff = currentTranslate;
    
    // 降低切换阈值，使其更容易触发切换
    const shouldSwitch = Math.abs(diff) > slideWidth * 0.2 || // 从0.25降低到0.2
                        Math.abs(dragVelocity) > 0.5; // 从0.65降低到0.5
    
    if (shouldSwitch) {
      if (diff > 0 && currentStep > 1) {
        currentStep--;
      } else if (diff < 0 && currentStep < groupsData.length) {
        currentStep++;
      }
    }
    
    // 回到正确位置
    scrollToStep(currentStep);
    saveChatInputState();
  }

  // 获取事件位置
  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  // 动画循环
  function animation() {
    if (isDragging) {
      requestAnimationFrame(animation);
    }
  }

  // ========== 轮播导航按钮事件 ==========
  const leftNav = carouselEl.querySelector('.carousel__nav--left');
  const rightNav = carouselEl.querySelector('.carousel__nav--right');

  leftNav.addEventListener('click', () => {
    if (currentStep > 1) {
      scrollToStep(currentStep - 1);
      saveChatInputState();
    }
  });

  rightNav.addEventListener('click', () => {
    const maxStep = Math.max(...Array.from(carouselEl.querySelectorAll('.carousel__suggestionGroup'))
      .map(group => parseInt(group.dataset.step))
      .filter(step => !isNaN(step)));
    
    if (currentStep < maxStep) {
      scrollToStep(currentStep + 1);
      saveChatInputState();
    }
  });

  // ========== 指示点管理函数 ==========
  function updateDots() {
    dotsEl.innerHTML = ''; // 清空现有的指示点
    
    // 获取所有建议组
    const groups = carouselEl.querySelectorAll('.carousel__suggestionGroup');
    
    // 收集所有有效的 step
    const validSteps = new Set();
    groups.forEach((group) => {
      const step = parseInt(group.dataset.step);
      // 跳过搜索组和无效的 step
      if (step !== 'search' && !isNaN(step)) {
        validSteps.add(step);
      }
    });
    
    // 为每个有效的 step 创建一个导航点
    Array.from(validSteps).sort((a, b) => a - b).forEach(step => {
      const dot = document.createElement('div');
      dot.className = 'chatInputPanel__carousel--dot';
      
      // 检查这个 step 是否包含标签建议组
      const group = carouselEl.querySelector(`.carousel__suggestionGroup[data-step="${step}"]`);
      if (group && group.querySelector('.carousel__tagContainer')) {
        dot.classList.add('chatInputPanel__carousel--dot--tag');
      }
      
      dot.dataset.step = step;
      dotsEl.appendChild(dot);
    });
    
    // 设置当前步骤的导航点为active
    const targetDot = dotsEl.querySelector(`.chatInputPanel__carousel--dot[data-step="${currentStep}"]`);
    if (targetDot) {
      dotsEl.querySelectorAll('.chatInputPanel__carousel--dot').forEach(dot => dot.classList.remove('active'));
      targetDot.classList.add('active');
    }

    // 更新导航按钮的禁用状态
    const leftNav = carouselEl.querySelector('.carousel__nav--left');
    const rightNav = carouselEl.querySelector('.carousel__nav--right');
    
    // 如果是第一步，禁用左导航按钮
    leftNav.disabled = currentStep === 1;
    
    // 如果是最后一步，禁用右导航按钮
    const maxStep = Math.max(...Array.from(validSteps));
    rightNav.disabled = currentStep === maxStep;
  }

  // ========== 建议组创建函数 ==========
  function createOrReplaceSuggestionGroup(optionList, step) {
    const container = carouselEl.querySelector('.carousel__container');
    
    // 清理重复的 step
    const existingGroups = container.querySelectorAll('.carousel__suggestionGroup');
    const stepGroups = Array.from(existingGroups).filter(group => parseInt(group.dataset.step) === step);
    
    // 如果存在重复的 step，保留第一个，删除其他的
    if (stepGroups.length > 1) {
      stepGroups.slice(1).forEach(group => {
        group.remove();
      });
    }
    
    let group = container.querySelector(`.carousel__suggestionGroup[data-step="${step}"]`);

    if (!group) {
      group = document.createElement('ul');
      group.className = 'carousel__suggestionGroup';
      group.dataset.step = step;
      container.appendChild(group);
    }

    group.innerHTML = '';

    // 检查是否是标签建议组
    const isTagGroup = optionList.length > 0 && optionList[0].isTag;
    
    if (isTagGroup) {
      // 创建标签容器
      const tagContainer = document.createElement('div');
      tagContainer.className = 'carousel__tagContainer';
      
      // 添加标签
      optionList.forEach((opt, index) => {
        const tagEl = document.createElement('div');
        tagEl.className = 'carousel__tag';
        tagEl.innerHTML = `<p>${opt.text}</p>`;
        tagEl.dataset.questionsId = JSON.stringify(opt.questions_id || []);
        tagContainer.appendChild(tagEl);
      });
      
      group.appendChild(tagContainer);
      
      // 添加标签点击事件
      tagContainer.addEventListener('click', async (e) => {
        const tag = e.target.closest('.carousel__tag');
        if (!tag) return;
        
        const questionsId = JSON.parse(tag.dataset.questionsId || '[]');
        const tagName = tag.querySelector('p').textContent;
        
        // 获取该标签相关的问题
        let questions;
        try {
          questions = await fetchQuestionsByIds(questionsId);
        } catch (error) {
          group.innerHTML = '<p class="text-neutral-black">顯示問題時發生錯誤，請稍後再試。</p>';
          return;
        }
        
        // 显示相关问题
        showTagQuestions(group, questions, tagName);
      });
    } else {
      // 如果是第一步，添加附注文字
      if (step === 1) {
        const addText = document.createElement('li');
        addText.className = 'carousel__suggestionItem add-text';
        addText.style.pointerEvents = 'none';
        addText.innerHTML = '<p>你可以選擇想了解的層面：</p>';
        group.appendChild(addText);
      }
      
      // 普通建议选项
      optionList.forEach((opt, index) => {
        const item = document.createElement('li');
        item.className = 'carousel__suggestionItem';
        if (opt.clicked) {
          item.classList.add('carousel__suggestionItem--clicked');
          item.style.pointerEvents = 'none';
        }
        // 如果是父问题，添加特殊类名
        if (opt.isParentQuestion) {
          item.classList.add('add-text');
          item.style.pointerEvents = 'none'; // 禁用点击
        }
        item.innerHTML = `<p class="md text-neutral-black">${opt.text}</p>`;
        item.dataset.reply = opt.reply;
        item.dataset.questionsId = JSON.stringify(opt.questions_id || []);
        item.dataset.id = opt.id; // 添加id属性
        group.appendChild(item);
      });
    }
  }

  // ========== 消息显示函数 ==========
  function appendMessage(text, role = 'bot', scrollToTop = false) {
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.className = `chatBubble chatBubble--${role}`;

    const message = document.createElement('div');
    message.className = 'chatBubbleMessage';

    if (role === 'bot') {
      // 检查是否是带有按钮的消息
      if (typeof text === 'object' && text.hasButton) {
        // 显示文本
        typeTextWithHTML(formatReplyText(text.text), message, 100, 5);
        
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'chatBubbleMessage__buttonContainer';

        // 创建按钮
        const button = document.createElement('button');
        button.className = 'chatBubbleMessage__button';
        button.textContent = text.buttonText;
        button.onclick = () => {
          console.log('按钮被点击');
          window.location.href = text.buttonLink;
        };

        // 将按钮添加到容器中
        buttonContainer.appendChild(button);
        message.appendChild(buttonContainer);
      } else {
        // 普通消息
        typeTextWithHTML(formatReplyText(text), message, 100, 5);
      }
    } else {
      message.innerHTML = formatReplyText(text);
    }

    bubbleWrapper.appendChild(message);
    chatWindow.appendChild(bubbleWrapper);

    // 控制滚动位置
    if (scrollToTop) {
      // 插入完后，让这个消息对齐窗口上方
      bubbleWrapper.scrollIntoView({ behavior: 'instant', block: 'start' });
    } else {
      // 一般情况（如bot回复）继续滚到底
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }

  // ========== 状态保存函数 ==========
  function saveChatInputState() {
    // 只储存currentStep和groupsData
    sessionStorage.setItem('chatInputState', JSON.stringify({
      currentStep: currentStep,
      groupsData: groupsData
    }));
  }

  // ========== 滚动到底部按钮功能 ==========
  // 添加滚动到底部按钮
  const scrollToBottomBtn = document.createElement('button');
  scrollToBottomBtn.className = 'scroll-to-bottom-btn';
  scrollToBottomBtn.innerHTML = '↓';
  document.querySelector('.chatInputPanel').appendChild(scrollToBottomBtn);

  // 监听滚动事件
  chatWindow.addEventListener('scroll', () => {
    const isAtBottom = chatWindow.scrollHeight - chatWindow.scrollTop <= chatWindow.clientHeight + 100;
    if (!isAtBottom) {
      scrollToBottomBtn.classList.add('visible');
    } else {
      scrollToBottomBtn.classList.remove('visible');
    }
  });

  // 点击按钮滚动到底部
  scrollToBottomBtn.addEventListener('click', () => {
    chatWindow.scrollTo({
      top: chatWindow.scrollHeight,
      behavior: 'smooth'
    });
    // 滚动完成后淡出按钮
    setTimeout(() => {
      scrollToBottomBtn.classList.remove('visible');
    }, 1000);
  });

  // ========== 标签相关函数 ==========
  async function showTagSuggestions(container, message = '') {
    console.log('开始显示标签建议组');
    console.log('容器元素:', container);
    console.log('提示消息:', message);
    
    try {
      // 显示loading spinner
      container.innerHTML = '<div class="carousel__spinner"></div>';
      
      // 获取所有标签
      let tags;
      try {
        console.log('尝试从 API 获取标签');
        tags = await fetchTags();
        console.log('API 返回的标签:', tags);
        
        // 如果 API 返回空数组，使用临时数据
        if (!tags || tags.length === 0) {
          console.log('API 返回空数据，使用临时数据');
          tags = all_tags;
        }
      } catch (error) {
        console.log('API 获取失败，使用临时数据');
        tags = all_tags;
      }
      
      console.log('最终使用的标签数据:', tags);
      
      // 将标签数据转换为建议选项格式并保存到 groupsData
      const tagOptions = tags.map(tag => ({
        text: tag.name,
        reply: '',
        questions_id: tag.questions_id || [],
        isTag: true, // 标记这是一个标签选项
        clicked: false
      }));

      // 获取当前步骤
      const currentStep = parseInt(container.dataset.step);
      
      // 保存标签数据到 groupsData
      if (currentStep) {
        groupsData[currentStep - 1] = tagOptions;
        saveChatInputState();
      }
      
      // 创建标签容器
      const tagContainer = document.createElement('div');
      tagContainer.className = 'carousel__tagContainer';
      
      // 如果有提示消息，添加消息元素
      if (message) {
        const messageEl = document.createElement('p');
        messageEl.className = 'text-neutral-black mb-4';
        messageEl.textContent = message;
        tagContainer.appendChild(messageEl);
      }
      
      // 添加标签
      tags.forEach((tag, index) => {
        const tagEl = document.createElement('div');
        tagEl.className = 'carousel__tag';
        tagEl.innerHTML = `<p>${tag.name}</p>`;
        tagEl.dataset.questionsId = JSON.stringify(tag.questions_id || []);
        tagContainer.appendChild(tagEl);
      });
      
      // 清空容器并添加标签容器
      container.innerHTML = '';
      container.appendChild(tagContainer);
      
      // 添加标签点击事件
      tagContainer.addEventListener('click', async (e) => {
        const tag = e.target.closest('.carousel__tag');
        if (!tag) return;
        
        console.log('点击标签:', tag);
        const questionsId = JSON.parse(tag.dataset.questionsId || '[]');
        const tagName = tag.querySelector('p').textContent;
        
        // 获取该标签相关的问题
        let questions;
        try {
          questions = await fetchQuestionsByIds(questionsId);
        } catch (error) {
          container.innerHTML = '<p class="text-neutral-black">顯示問題時發生錯誤，請稍後再試。</p>';
          return;
        }
        
        // 显示相关问题
        showTagQuestions(container, questions, tagName);
      });
    } catch (error) {
      container.innerHTML = '<p class="text-neutral-black">顯示tag時發生錯誤，請稍後再試。</p>';
    }
  }

  async function showTagQuestions(container, questions, tagName) {
    // 显示loading spinner
    container.innerHTML = '<div class="carousel__spinner"></div>';
    
    // 将问题数据转换为建议选项格式
    const nextOptions = questions.map(q => ({
      text: q.question,
      reply: q.answer,
      questions_id: q.questions_id || []
    }));

    // 清空当前容器
    container.innerHTML = '';

    // 添加标签文本作为第一个选项
    const tagOption = {
      text: `以下是關於"${tagName}"的問題`,
      reply: '',
      questions_id: [],
      isParentQuestion: true
    };
    nextOptions.unshift(tagOption);

    // 添加所有选项
    nextOptions.forEach(opt => {
      const item = document.createElement('li');
      item.className = 'carousel__suggestionItem';
      if (opt.isParentQuestion) {
        item.classList.add('add-text');
        item.style.pointerEvents = 'none';
      }
      item.innerHTML = `<p class="md text-neutral-black">${opt.text}</p>`;
      item.dataset.reply = opt.reply;
      item.dataset.questionsId = JSON.stringify(opt.questions_id || []);
      container.appendChild(item);
    });

    // 更新当前步骤的数据
    const currentStep = parseInt(container.dataset.step);
    if (currentStep) {
      groupsData[currentStep - 1] = nextOptions;
      saveChatInputState();
    }
  }

  // ========== 页面加载时恢复额外消息 ==========
  async function restoreExtraMessages() {
    const chatHistory = JSON.parse(sessionStorage.getItem('chatHistory') || '[]');
    const lastMessage = chatHistory[chatHistory.length - 1];
    
    if (lastMessage && lastMessage.sender === 'bot') {
      // 检查最后一条消息是否来自特定问题
      const lastQuestionId = sessionStorage.getItem('lastQuestionId');
      if (lastQuestionId && (lastQuestionId === 'q001' || lastQuestionId === 'q002' || lastQuestionId === 'q003')) {
        if (!extraMessageShown.has(lastQuestionId)) {
          const extraMessage = '如果您想更進一步了解，可點擊作品列表瀏覽細節。';
          
          const bubbleWrapper = document.createElement('div');
          bubbleWrapper.className = 'chatBubble chatBubble--bot';

          const message = document.createElement('div');
          message.className = 'chatBubbleMessage';
          message.style.minHeight = '0';

          const messageText = document.createElement('p');
          messageText.textContent = extraMessage;
          message.appendChild(messageText);

          bubbleWrapper.appendChild(message);
          chatWindow.appendChild(bubbleWrapper);

          extraMessageShown.add(lastQuestionId);
          sessionStorage.setItem('extraMessages', JSON.stringify([...extraMessageShown]));
        }
      }
    }
  }

  // 修改原有的按鈕點擊處理邏輯
  function handleProjectButtonClick(item) {
    // 建立額外提示訊息的泡泡容器
    const extraMessage = '如果您想更進一步瞭解，可點擊下方按鈕瀏覽：';
    
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.className = 'chatBubble chatBubble--bot';

    const message = document.createElement('div');
    message.className = 'chatBubbleMessage';
    message.style.minHeight = '0';

    const messageText = document.createElement('p');
    messageText.textContent = extraMessage;
    message.appendChild(messageText);

    // 建立按鈕容器和按鈕
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'chatBubbleMessage__buttonContainer';

    const button = document.createElement('button');
    button.className = 'primaryButton--fill';
    button.textContent = '查看專案細節';
    
    // 設定按鈕點擊事件
    button.onclick = async (event) => {
      event.preventDefault();
      event.stopPropagation();
      
      console.log('按鈕被點擊');
      
      try {
        // 嘗試從快取中獲取專案列表
        let projects = cachedProjects;
        if (!projects) {
          // 如果快取中沒有，則從 API 獲取
          projects = await fetchProjectList();
          if (!projects) {
            console.log('使用本地專案數據');
            projects = localProjects;
          }
          cachedProjects = projects;
        }
        
        console.log('當前專案列表:', projects);
        
        let projectData;
        // 根據問題 ID 決定要顯示哪個專案的詳細資訊
        switch(item.dataset.id) {
          // Interro 專案組（q001-q003）
          case 'q001':
          case 'q002':
          case 'q003':
            projectData = projects.find(p => p.template === 'interro-project');
            console.log('找到 Interro 專案:', projectData);
            break;
          // Hahow 專案組（q007-q009）
          case 'q007':
          case 'q008':
          case 'q009':
            projectData = projects.find(p => p.template === 'hahow-project');
            console.log('找到 Hahow 專案:', projectData);
            break;
          // 其他專案顯示預設的「即將更新」內容
          default:
            projectData = {
              template: 'coming-soon',
              basicInfo: {
                title: '專案內容更新中',
                subtitle: '敬請期待',
                tags: ['Coming Soon']
              },
              content: {
                sections: [
                  {
                    type: 'text',
                    content: `
                      <h3>專案內容即將更新</h3>
                      <p>這個專案的詳細內容正在整理中，敬請期待！</p>
                    `
                  }
                ]
              }
            };
        }

        // 檢查是否為 Interro 或 Hahow 專案組的按鈕
        const isInterroButton = ['q001', 'q002', 'q003'].includes(item.dataset.id);
        const isHahowButton = ['q007', 'q008', 'q009'].includes(item.dataset.id);

        // 如果是這些按鈕，則顯示對應的專案資料
        if (isInterroButton || isHahowButton) {
          if (!projectData) {
            throw new Error('找不到對應的專案數據');
          }
          // 建立並顯示專案詳情 modal
          const modal = createProjectModal();
          modal.show({
            template: projectData.template,
            basicInfo: {
              title: projectData.title,
              subtitle: projectData.subtitle,
              tags: projectData.tags
            },
            content: projectData.content
          });
        }
      } catch (error) {
        // 錯誤處理：顯示錯誤訊息的 modal
        console.error('載入專案數據時發生錯誤:', error);
        const modal = createProjectModal();
        modal.show(handleProjectError(error, '載入專案數據時發生錯誤'));
      }
    };

    // 將按鈕加入容器，並將容器加入訊息泡泡中
    buttonContainer.appendChild(button);
    message.appendChild(buttonContainer);
    bubbleWrapper.appendChild(message);
    chatWindow.appendChild(bubbleWrapper);

    // 記錄已顯示的額外訊息，避免重複顯示
    extraMessageShown.add(item.dataset.id);
    sessionStorage.setItem('extraMessages', JSON.stringify([...extraMessageShown]));
  }

  // 修改原有的問題點擊處理邏輯
  function handleQuestionClick(item) {
    if (item.dataset.id === 'q001' || item.dataset.id === 'q002' || item.dataset.id === 'q003') {
      console.log('检测到特定问题ID:', item.dataset.id);
      handleProjectButtonClick(item);
    } else {
      // 其他问题的处理逻辑
      console.log('处理其他问题:', item.dataset.id);
    }
  }

  // 在初始化时调用恢复函数
  restoreExtraMessages();
}

// 用於存儲專案數據
let cachedProjects = null;

// 預先載入專案數據
async function preloadProjectData() {
  try {
    cachedProjects = await fetchProjectList();
    if (!cachedProjects) {
      console.log('使用本地專案數據');
      cachedProjects = localProjects;
    }
  } catch (error) {
    console.error('預先載入專案數據失敗:', error);
    cachedProjects = localProjects;
  }
}

// 在頁面載入時預先載入數據
preloadProjectData();

// 修改打字效果函數
function typeWriter(element, text, speed = 50) {
  let i = 0;
  const maxTime = 3000; // 最大顯示時間 3 秒
  const startTime = Date.now();
  
  function type() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    
    if (i < text.length && elapsedTime < maxTime) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (i < text.length) {
      // 如果超過 3 秒但文字還沒顯示完，直接顯示剩餘文字
      element.textContent = text;
    }
  }
  
  type();
}
