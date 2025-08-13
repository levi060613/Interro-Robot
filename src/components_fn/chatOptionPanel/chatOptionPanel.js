// 匯入工具與數據處理函數
import { formatReplyText, typeTextWithHTML } from '../../utils/formatters.js';
import {
  markOptionClicked,
  markQuestionClicked,
  getClickedOptions,
  getClickedQuestionIds,
  saveMessage
} from '../../utils/chatState.js';
import { fetchOptions, fetchQuestions, fetchQuestionsByIds, fetchTags } from '../../utils/fetchData.js';
import { all_tags } from '../../utils/tempData.js';

export default async function initChatOptionPanel(initialOptions) {
    const chatOptionPanel = document.querySelector('.chatOptionPanel');
    const switchButton = document.getElementById('switchButton');
    const menuButton = document.querySelector('.menuButton');
    const carousel = document.querySelector('.chatOptionPanel__carousel');
    const carouselContainer = document.querySelector('.carouselBlock__container');
    const dotsContainer = document.querySelector('.carouselBlock__dots');
    const chatWindow = document.getElementById('chatWindow');



    console.log('[DEBUG] 檢查元素是否存在:');
    console.log('[DEBUG] chatOptionPanel:', !!chatOptionPanel);
    console.log('[DEBUG] switchButton:', !!switchButton);
    console.log('[DEBUG] menuButton:', !!menuButton);
    console.log('[DEBUG] carousel:', !!carousel);
    console.log('[DEBUG] carouselContainer:', !!carouselContainer);

    if (!chatOptionPanel || !switchButton || !menuButton || !carousel || !carouselContainer) {
        console.error('Required chat option panel elements not found');
        return;
    }

    // ========== 狀態管理變數 ==========
    let isActive = false;
    let currentStep = 1;
    let groupsData = [];
    let isCarouselVisible = false;
    let isMenuActive = false;
    let hasNewStep = false;
    let lastActiveStep = 1;

    // ========== 狀態恢復邏輯 ==========
    // 從 sessionStorage 中恢復之前的狀態
    const cachedState = sessionStorage.getItem('chatOptionPanelState');
    
    if (cachedState) {
        try {
            const state = JSON.parse(cachedState);
            currentStep = state.currentStep || 1;
            groupsData = state.groupsData || [];
            lastActiveStep = state.lastActiveStep || 1;
            hasNewStep = state.hasNewStep || false;

            // 如果快取數據存在但沒有 groupsData 或 Step 1 數據，則用初始 options 填充
            if (groupsData.length === 0 || !groupsData[0]) {
                const step1Options = initialOptions.map(opt => ({
                    text: opt.text,
                    reply: opt.reply,
                    questions_id: opt.questions_id || [],
                    clicked: false
                }));
                groupsData[0] = step1Options;
            }

            // 根據快取的 groupsData 重新渲染所有 suggestion groups
            groupsData.forEach((options, index) => {
                if (options && options.length > 0) {
                    createSuggestionGroup(options, index + 1);
                }
            });

        } catch (e) {
            console.error("解析 chatOptionPanelState 快取失敗:", e);
            // 解析失敗，使用初始狀態
            currentStep = 1;
            groupsData = [];
            lastActiveStep = 1;
            hasNewStep = false;
            const step1Options = initialOptions.map(opt => ({
                text: opt.text,
                reply: opt.reply,
                questions_id: opt.questions_id || [],
                clicked: false
            }));
            groupsData[0] = step1Options;
            createSuggestionGroup(step1Options, 1);
        }
    } else {
        // ========== 如果沒有快取，初始化 Step 1 Suggestions ==========
        const step1Options = initialOptions.map(opt => ({
            text: opt.text,
            reply: opt.reply,
            questions_id: opt.questions_id || [],
            clicked: false
        }));
        groupsData[0] = step1Options;
        createSuggestionGroup(step1Options, 1);
    }

    // 確保 groupsData 中每個步驟的數據都是有效的陣列
    groupsData = groupsData.map(group => (Array.isArray(group) ? group : []));

    // ========== 初始化資料 ==========
    try {
        // 預先載入問題資料
        await fetchQuestions();
        
        // 更新指示點
        updateDots();
        
        // 設定第一個建議組為 active 狀態
        scrollToStep(currentStep);
        
        // 保存初始狀態到 sessionStorage
        saveChatOptionPanelState();
        
    } catch (error) {
        console.error('初始化資料失敗:', error);
    }

    // ========== 事件監聽器 ==========
    
    // 點擊 switchButton 切換狀態
    switchButton.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePanel();
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    });

    // 點擊 menuButton 切換選單狀態
    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    });



    // 點擊面板外的空白處
    document.addEventListener('click', (e) => {
        // 重置 switchButton 狀態
        if (!chatOptionPanel.contains(e.target) && isActive) {
            resetPanel();
        }
        // 關閉選單
        if (isMenuActive) {
            closeMenu();
        }
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    });

    // 點擊面板內部阻止事件冒泡
    chatOptionPanel.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    });

    // 左右切換按鈕
    const previousButton = document.querySelector('.carousel__nav--left');
    const nextButton = document.querySelector('.carousel__nav--right');
    
    if (previousButton) {
        previousButton.addEventListener('click', () => {
            if (currentStep > 1) {
                scrollToStep(currentStep - 1);
                saveChatOptionPanelState();
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const groups = carouselContainer.querySelectorAll('.suggestionGroup');
            const validSteps = Array.from(groups)
                .map(group => parseInt(group.dataset.step))
                .filter(step => !isNaN(step));
            
            if (validSteps.length > 0) {
                const maxStep = Math.max(...validSteps);
                if (currentStep < maxStep) {
                    // 如果有新 step 可用，直接跳轉到最新 step
                    if (hasNewStep) {
                        scrollToStep(maxStep);
                        hasNewStep = false;
                        stopNextButtonAnimation();
                    } else {
                        // 否則按正常順序切換
                        scrollToStep(currentStep + 1);
                    }
                    saveChatOptionPanelState();
                }
            }
        });
    }

    // 建議選項點擊處理
    carouselContainer.addEventListener('click', async (e) => {
        const item = e.target.closest('.suggestionGroup__item');
        if (!item) return;

        // 檢查是否已經點擊過
        if (item.classList.contains('suggestionGroup__item--clicked')) {
            return;
        }

        // 添加clicked樣式
        item.classList.add('suggestionGroup__item--clicked');

        // 更新groupsData中的點擊狀態
        const currentGroup = groupsData[currentStep - 1];
        const clickedIndex = Array.from(item.parentElement.children).indexOf(item);
        if (currentGroup && currentGroup[clickedIndex]) {
            currentGroup[clickedIndex].clicked = true;
        }

        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();

        const text = item.textContent.trim();
        const reply = item.dataset.reply;
        const questionsId = JSON.parse(item.dataset.questionsId || '[]');
        const questionId = item.dataset.id;
        const questionLabel = item.dataset.label || "其他";

        // 記錄問題點擊（包含 label）
        if (questionId && questionId !== 'parent') {
            markQuestionClicked(questionId, questionLabel);
        }

        // 發送用戶訊息
        appendMessage(text, 'user', true);
        await saveMessage(text, 'user');

        // 發送bot回覆
        appendMessage(reply, 'bot', true);
        await saveMessage(reply, 'bot');

        // 點擊選項後重置面板狀態
        resetPanel();

        // ========== 處理下一層問題 ==========
        if (questionsId.length > 0) {
            // 如果有下一層問題id，就建立下一層suggestions
            const nextQuestions = await fetchQuestionsByIds(questionsId);

            // 將question數據轉成{text, reply, questions_id}結構
            const nextOptions = nextQuestions.map(q => ({
                text: q.question,
                reply: q.answer,
                questions_id: q.questions_id || [],
                id: q.id,
                label: q.label || "其他"
            }));

            // 添加被點擊的問題作為第一個選項
            nextOptions.unshift({
                text: `「${text.substring(0, 8)}${text.length > 10 ? '...' : ''}」的延伸：`,
                reply: reply,
                questions_id: questionsId,
                isParentQuestion: true,
                id: 'parent'
            });

            // 只有當新產生的下一層有內容時才增加步驟和儲存
            if (nextOptions.length > 0) {
                // 找到最後一個非空的步驟
                let lastStep = groupsData.length;
                while (lastStep > 0 && (!groupsData[lastStep - 1] || groupsData[lastStep - 1].length === 0)) {
                    lastStep--;
                }
               
                // 在最後一個非空步驟後添加新的步驟
                const newStep = lastStep + 1;
                groupsData[newStep - 1] = nextOptions;
                createSuggestionGroup(nextOptions, newStep);
                updateDots();
                
                // 設置有新 step 的標誌，但不自動切換
                hasNewStep = true;
                
                // 保存狀態到 sessionStorage
                saveChatOptionPanelState();
            }
        } else {
            // ========== 如果沒有延伸問題ID，顯示標籤建議 ==========
            console.log('沒有延伸問題ID，準備顯示標籤建議');
            
            // 檢查最後一個建議組是否已經是標籤建議組
            const groups = carouselContainer.querySelectorAll('.suggestionGroup');
            const lastGroup = groups[groups.length - 1];
            
            if (lastGroup && lastGroup.querySelector('.tagContainer')) {
                return;
            }
            
            // 找到最後一個非空的步驟
            let lastStep = groupsData.length;
            while (lastStep > 0 && (!groupsData[lastStep - 1] || groupsData[lastStep - 1].length === 0)) {
                lastStep--;
            }
            
            const nextStep = lastStep + 1;
            await showTagSuggestions(nextStep);
            
            // 設置有新 step 的標誌，但不自動切換
            hasNewStep = true;
            updateDots();
            
            // 保存狀態到 sessionStorage
            saveChatOptionPanelState();
        }
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    });

    // ========== 核心函數 ==========

    function togglePanel() {
        // 如果選單是開啟狀態，先關閉選單
        if (isMenuActive) {
            closeMenu();
        }
        
        if (!isActive) {
            // 啟動狀態
            switchButton.classList.add('active');
            switchButton.innerHTML = '<p class="md text-neutral-black text-center">× 收合選項</p>';
            menuButton.classList.add('hidden');
            carousel.classList.add('visible');
            isActive = true;
            isCarouselVisible = true;
            
            // 隱藏 modalLookBtn
            const modalLookBtn = document.querySelector('.modal-lookBtn');
            if (modalLookBtn) {
                modalLookBtn.classList.add('hidden');
                console.log('[DEBUG] chatOptionPanel: 已隱藏 modalLookBtn');
            }
            
            // 維持在最後活躍的 step，而不是自動切換到新 step
            scrollToStep(lastActiveStep);
            
            // 每次打開面板時檢查自我介紹狀態
            checkAndUpdateIntroductionOverlay();
            
            // 如果有新 step 可用，為 nextButton 添加微動畫
            if (hasNewStep) {
                animateNextButton();
            }
            
            // 保存狀態到 sessionStorage
            saveChatOptionPanelState();
        } else {
            // 如果已經是active狀態，再次點擊會重置
            resetPanel();
        }
    }

    function resetPanel() {
        // 保存當前活躍的 step
        lastActiveStep = currentStep;
        
        switchButton.classList.remove('active');
        switchButton.innerHTML = '<p class="md text-neutral-black text-center">點擊查看選項</p>';
        menuButton.classList.remove('hidden');
        
        // 顯示 modalLookBtn
        const modalLookBtn = document.querySelector('.modal-lookBtn');
        if (modalLookBtn) {
            modalLookBtn.classList.remove('hidden');
            console.log('[DEBUG] chatOptionPanel: 已顯示 modalLookBtn');
        }
        
        // 一旦switchButton恢復預設狀態，carousel也要恢復隱藏
        carousel.classList.remove('visible');
        isCarouselVisible = false;
        
        isActive = false;
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    }

    function toggleMenu() {
        const menuContainer = document.querySelector('.menuButton__container');
        const menu = menuContainer.querySelector('ul');
        
        // 如果 switchButton 是 active 狀態，先重置面板
        if (isActive) {
            resetPanel();
        }
        
        if (!isMenuActive) {
            // 開啟選單
            menuButton.classList.add('active');
            menu.classList.add('active');
            isMenuActive = true;
            
            // 隱藏 modalLookBtn
            const modalLookBtn = document.querySelector('.modal-lookBtn');
            if (modalLookBtn) {
                modalLookBtn.classList.add('hidden');
                console.log('[DEBUG] chatOptionPanel: menuButton 已隱藏 modalLookBtn');
            }
            
            // 保存狀態到 sessionStorage
            saveChatOptionPanelState();
        } else {
            // 關閉選單
            closeMenu();
        }
    }

    function closeMenu() {
        const menuContainer = document.querySelector('.menuButton__container');
        const menu = menuContainer.querySelector('ul');
        
        menuButton.classList.remove('active');
        menu.classList.remove('active');
        isMenuActive = false;
        
        // 顯示 modalLookBtn
        const modalLookBtn = document.querySelector('.modal-lookBtn');
        if (modalLookBtn) {
            modalLookBtn.classList.remove('hidden');
            console.log('[DEBUG] chatOptionPanel: menuButton 已顯示 modalLookBtn');
        }
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    }

    function animateNextButton() {
        if (nextButton) {
            nextButton.classList.add('pulse-animation');
        }
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    }

    function stopNextButtonAnimation() {
        if (nextButton) {
            nextButton.classList.remove('pulse-animation');
        }
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    }

    function createSuggestionGroup(optionList, step) {
        // 清理重複的 step
        const existingGroups = carouselContainer.querySelectorAll('.suggestionGroup');
        const stepGroups = Array.from(existingGroups).filter(group => parseInt(group.dataset.step) === step);
        
        // 如果存在重複的 step，保留第一個，刪除其他的
        if (stepGroups.length > 1) {
            stepGroups.slice(1).forEach(group => {
                group.remove();
            });
        }
        
        let group = carouselContainer.querySelector(`.suggestionGroup[data-step="${step}"]`);

        if (!group) {
            group = document.createElement('div');
            group.className = 'suggestionGroup';
            group.dataset.step = step;
            carouselContainer.appendChild(group);
            
            // 設定初始狀態
            if (step === 1) {
                group.classList.add('active');
            } else {
                group.classList.add('right');
            }
        }

        group.innerHTML = '';

        // 檢查是否為標籤建議組
        const isTagGroup = optionList.length > 0 && optionList[0].isTag;

        if (isTagGroup) {
            // 標籤建議組的渲染邏輯
            const addText = document.createElement('div');
            addText.className = 'suggestionGroup__item add-text';
            addText.style.pointerEvents = 'none';
            addText.innerHTML = '<p>如果前面已經沒有想了解的問題，也許你可以看看這些主題⋯⋯</p>';
            group.appendChild(addText);
            
            // 創建標籤容器
            const tagContainer = document.createElement('div');
            tagContainer.className = 'tagContainer';
            
            // 添加標籤
            optionList.forEach((opt, index) => {
                const tagEl = document.createElement('div');
                tagEl.className = 'tag';
                tagEl.innerHTML = `<p>${opt.text}</p>`;
                tagEl.dataset.questionsId = JSON.stringify(opt.questions_id || []);
                tagContainer.appendChild(tagEl);
            });
            
            group.appendChild(tagContainer);
            
            // 添加標籤點擊事件（避免重複綁定）
            const existingListener = tagContainer.getAttribute('data-has-listener');
            if (!existingListener) {
                tagContainer.setAttribute('data-has-listener', 'true');
                tagContainer.addEventListener('click', async (e) => {
                    const tag = e.target.closest('.tag');
                    if (!tag) return;
                    
                    const questionsId = JSON.parse(tag.dataset.questionsId || '[]');
                    const tagName = tag.querySelector('p').textContent;
                    
                    // 獲取該標籤相關的問題
                    let questions;
                    try {
                        questions = await fetchQuestionsByIds(questionsId);
                    } catch (error) {
                        group.innerHTML = '<p class="text-neutral-black">顯示問題時發生錯誤，請稍後再試。</p>';
                        return;
                    }
                    
                    // 顯示相關問題
                    showTagQuestions(group, questions, tagName);
                    
                    // 保存狀態到 sessionStorage
                    saveChatOptionPanelState();
                });
            }
        } else {
            // 普通建議選項組的渲染邏輯
            // 直接渲染正常選項，自我介紹檢查會在 togglePanel 時進行
            renderNormalSuggestions(group, optionList);
        }
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    }

    // 新增：檢查並更新自我介紹遮罩的函數
    async function checkAndUpdateIntroductionOverlay() {
        try {
            // 檢查是否已經顯示過自我介紹
            const { loadChatHistory } = await import('../../utils/chatState.js');
            const history = await loadChatHistory();
            const hasShownIntroduction = history.some(msg => 
                msg.sender === 'bot' && 
                typeof msg.text === 'string' && 
                msg.text.includes('嗨！歡迎你進來這個聊天室')
            );
            
            // 找到第一步的建議組
            const step1Group = carouselContainer.querySelector('.suggestionGroup[data-step="1"]');
            if (!step1Group) {
                console.log('[DEBUG] 找不到第一步建議組');
                return;
            }
            
            // 檢查是否已經有遮罩
            const existingOverlay = step1Group.querySelector('.introduction-overlay');
            
            if (!hasShownIntroduction) {
                // 沒有顯示過自我介紹，需要顯示遮罩
                if (!existingOverlay) {
                    console.log('[DEBUG] 顯示自我介紹遮罩');
                    
                    // 清空第一步組的內容
                    step1Group.innerHTML = '';
                    
                    // 創建遮罩
                    const overlay = document.createElement('div');
                    overlay.className = 'introduction-overlay';
                    overlay.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(255, 255, 255, 0.95);
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        z-index: 10;
                        border-radius: 12px;
                        padding: 2rem;
                    `;

                    const overlayText = document.createElement('p');
                    overlayText.className = 'text-neutral-black text-center mb-4';
                    overlayText.style.cssText = `
                        font-size: 1rem;
                        line-height: 1.5;
                        margin-bottom: 1.5rem;
                        max-width: 300px;
                    `;
                    overlayText.textContent = '在開始對話之前，先了解一下設計師吧！';

                    const introButton = document.createElement('button');
                    introButton.className = 'primaryButton--fill';
                    introButton.style.cssText = `
                        min-width: 120px;
                        padding: 0.75rem 1.5rem;
                    `;
                    introButton.textContent = '顯示自我介紹';
                    introButton.onclick = async () => {
                        console.log('[DEBUG] 自我介紹按鈕被點擊');
                        
                        // 顯示自我介紹
                        const { showIntroductionMessage } = await import('../../utils/chatState.js');
                        await showIntroductionMessage(chatWindow);
                        
                        // 關閉 carousel 面板
                        resetPanel();
                        
                        // 保存狀態到 sessionStorage
                        saveChatOptionPanelState();
                    };

                    overlay.appendChild(overlayText);
                    overlay.appendChild(introButton);
                    step1Group.appendChild(overlay);
                    
                    // 設置 group 為相對定位以支持絕對定位的遮罩
                    step1Group.style.position = 'relative';
                }
            } else {
                // 已經顯示過自我介紹，需要移除遮罩並顯示正常選項
                if (existingOverlay) {
                    console.log('[DEBUG] 移除自我介紹遮罩，顯示正常選項');
                    existingOverlay.remove();
                    
                    // 重新渲染正常的建議選項
                    const step1Options = groupsData[0] || [];
                    renderNormalSuggestions(step1Group, step1Options);
                }
            }
        } catch (error) {
            console.error('檢查自我介紹狀態失敗:', error);
        }
    }

    // 新增：渲染正常建議選項的輔助函數
    function renderNormalSuggestions(group, optionList) {
        // 如果是第一步，添加附注文字
        const step = parseInt(group.dataset.step);
        if (step === 1) {
            const addText = document.createElement('div');
            addText.className = 'suggestionGroup__item add-text';
            addText.style.pointerEvents = 'none';
            addText.innerHTML = '<p>你可以選擇想了解的層面：</p>';
            group.appendChild(addText);
        }
        
        // 普通建議選項
        optionList.forEach((opt, index) => {
            const item = document.createElement('div');
            item.className = 'suggestionGroup__item';
            if (opt.clicked) {
                item.classList.add('suggestionGroup__item--clicked');
                item.style.pointerEvents = 'none';
            }
            // 如果是父問題，添加特殊類名
            if (opt.isParentQuestion) {
                item.classList.add('add-text');
                item.style.pointerEvents = 'none'; // 禁用點擊
                item.innerHTML = `<p>${opt.text}</p>`;
            } else {
                item.innerHTML = `<p class="md text-neutral-black">${opt.text}</p>`;
            }
            item.dataset.reply = opt.reply;
            item.dataset.questionsId = JSON.stringify(opt.questions_id || []);
            item.dataset.id = opt.id; // 添加id屬性
            item.dataset.label = opt.label || "其他"; // 添加label屬性
            group.appendChild(item);
        });
    }

    async function showTagSuggestions(step) {
        try {
            // 獲取所有標籤
            let tags;
            try {
                const tagNames = await fetchTags();
                if (!tagNames || tagNames.length === 0) {
                    tags = all_tags;
                } else {
                    // 如果API返回的是標籤名稱，使用本地標籤數據
                    tags = all_tags;
                }
            } catch (error) {
                tags = all_tags;
            }
            
            // 將標籤數據轉換為建議選項格式並保存到 groupsData
            const tagOptions = tags.map(tag => ({
                text: tag.name,
                reply: '',
                questions_id: tag.questions_id || [],
                isTag: true, // 標記這是標籤選項
                clicked: false
            }));

            // 保存標籤數據到 groupsData
            groupsData[step - 1] = tagOptions;
            
            // 保存狀態到 sessionStorage
            saveChatOptionPanelState();
            
            // 建立標籤建議組
            const group = document.createElement('div');
            group.className = 'suggestionGroup';
            group.dataset.step = step;
            carouselContainer.appendChild(group);
            
            // 設定為right狀態（隱藏），等待用戶主動切換
            group.classList.add('right');
            
            // 使用 createSuggestionGroup 來渲染標籤建議組
            createSuggestionGroup(tagOptions, step);
            
        } catch (error) {
            console.error('顯示標籤建議失敗:', error);
        }
    }

    async function showTagQuestions(container, questions, tagName) {
        // 將問題數據轉換為建議選項格式
        const nextOptions = questions.map(q => ({
            text: q.question,
            reply: q.answer,
            questions_id: q.questions_id || []
        }));

        // 清空當前容器
        container.innerHTML = '';

        // 添加標籤文本作為第一個選項
        const tagOption = {
            text: `以下是關於"${tagName}"的問題`,
            reply: '',
            questions_id: [],
            isParentQuestion: true
        };
        nextOptions.unshift(tagOption);

        // 添加所有選項
        nextOptions.forEach(opt => {
            const item = document.createElement('div');
            item.className = 'suggestionGroup__item';
            if (opt.isParentQuestion) {
                item.classList.add('add-text');
                item.style.pointerEvents = 'none';
                item.innerHTML = `<p>${opt.text}</p>`;
            } else {
                item.innerHTML = `<p class="md text-neutral-black">${opt.text}</p>`;
            }
            item.dataset.reply = opt.reply;
            item.dataset.questionsId = JSON.stringify(opt.questions_id || []);
            container.appendChild(item);
        });

        // 更新當前步驟的數據
        const currentStep = parseInt(container.dataset.step);
        if (currentStep) {
            groupsData[currentStep - 1] = nextOptions;
            // 保存狀態到 sessionStorage
            saveChatOptionPanelState();
        }
    }

    function scrollToStep(step) {
        const groups = carouselContainer.querySelectorAll('.suggestionGroup');
        const currentActiveGroup = carouselContainer.querySelector('.suggestionGroup.active');
        
        // 如果有當前活躍的組，先添加淡出效果
        if (currentActiveGroup) {
            currentActiveGroup.classList.add('fade-out');
            
            // 等待淡出完成後再切換
            setTimeout(() => {
                performStepTransition(step);
                
                // 保存狀態到 sessionStorage
                saveChatOptionPanelState();
            }, 300);
        } else {
            // 如果沒有當前活躍的組，直接切換
            performStepTransition(step);
        }
    }
    
    function performStepTransition(step) {
        const groups = carouselContainer.querySelectorAll('.suggestionGroup');
        
        // 移除所有狀態類別
        groups.forEach((group) => {
            group.classList.remove('active', 'left', 'right', 'fade-out', 'fade-in');
        });
        
        // 更新所有group的顯示狀態
        groups.forEach((group) => {
            const groupStep = parseInt(group.dataset.step);
            
            if (groupStep === step) {
                // 當前步驟 - 添加淡入效果
                group.classList.add('active', 'fade-in');
            } else if (groupStep < step) {
                // 左側步驟
                group.classList.add('left');
            } else {
                // 右側步驟
                group.classList.add('right');
            }
        });
        
        // 更新當前步驟
        currentStep = step;
        
        // 更新導航點狀態
        updateDots();
        
        // 更新按鈕狀態
        updateNavigationButtons();
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    }

    function updateDots() {
        dotsContainer.innerHTML = ''; // 清空現有的指示點
        
        // 獲取所有建議組
        const groups = carouselContainer.querySelectorAll('.suggestionGroup');
        
        // 收集所有有效的 step
        const validSteps = new Set();
        groups.forEach((group) => {
            const step = parseInt(group.dataset.step);
            if (!isNaN(step)) {
                validSteps.add(step);
            }
        });
        
        // 為每個有效的 step 創建一個導航點
        Array.from(validSteps).sort((a, b) => a - b).forEach(step => {
            const dot = document.createElement('div');
            dot.className = 'carouselBlock__dots--dot';
            
            // 檢查這個 step 是否包含標籤建議組
            const group = carouselContainer.querySelector(`.suggestionGroup[data-step="${step}"]`);
            if (group && group.querySelector('.tagContainer')) {
                dot.classList.add('carouselBlock__dots--dot--tag');
            }
            
            dot.dataset.step = step;
            dotsContainer.appendChild(dot);
        });
        
        // 設置當前步驟的導航點為active
        const targetDot = dotsContainer.querySelector(`.carouselBlock__dots--dot[data-step="${currentStep}"]`);
        if (targetDot) {
            dotsContainer.querySelectorAll('.carouselBlock__dots--dot').forEach(dot => dot.classList.remove('active'));
            targetDot.classList.add('active');
        }
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    }

    function updateNavigationButtons() {
        const groups = carouselContainer.querySelectorAll('.suggestionGroup');
        const validSteps = Array.from(groups)
            .map(group => parseInt(group.dataset.step))
            .filter(step => !isNaN(step))
            .sort((a, b) => a - b);
        
        const maxStep = Math.max(...validSteps);
        
        // 更新按鈕狀態
        if (previousButton) {
            previousButton.disabled = currentStep === 1;
        }
        
        if (nextButton) {
            nextButton.disabled = currentStep === maxStep;
        }
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    }

    function appendMessage(text, role = 'bot', scrollToTop = false) {
        const bubbleWrapper = document.createElement('div');
        bubbleWrapper.className = `chatBubble chatBubble--${role}`;

        const message = document.createElement('div');
        message.className = 'chatBubbleMessage';

        if (role === 'bot') {
            typeTextWithHTML(formatReplyText(text), message, 100, 5);
        } else {
            message.innerHTML = formatReplyText(text);
        }

        bubbleWrapper.appendChild(message);
        chatWindow.appendChild(bubbleWrapper);

        // 控制滾動位置
        if (scrollToTop) {
            bubbleWrapper.scrollIntoView({ behavior: 'instant', block: 'start' });
        } else {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    }

    // ========== 狀態保存函數 ==========
    function saveChatOptionPanelState() {
        // 保存 currentStep、groupsData、lastActiveStep 和 hasNewStep
        sessionStorage.setItem('chatOptionPanelState', JSON.stringify({
            currentStep: currentStep,
            groupsData: groupsData,
            lastActiveStep: lastActiveStep,
            hasNewStep: hasNewStep
        }));
    }

    // ========== 滾動到底部按鈕功能 ==========
    // 添加滾動到底部按鈕
    const scrollToBottomBtn = document.createElement('button');
    scrollToBottomBtn.className = 'scroll-to-bottom-btn';
    chatOptionPanel.appendChild(scrollToBottomBtn);

    // 監聽滾動事件
    chatWindow.addEventListener('scroll', () => {
        const isAtBottom = chatWindow.scrollHeight - chatWindow.scrollTop <= chatWindow.clientHeight + 100;
        if (!isAtBottom) {
            scrollToBottomBtn.classList.add('visible');
        } else {
            scrollToBottomBtn.classList.remove('visible');
        }
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    });

    // 點擊按鈕滾動到底部
    scrollToBottomBtn.addEventListener('click', () => {
        chatWindow.scrollTo({
            top: chatWindow.scrollHeight,
            behavior: 'smooth'
        });
        // 滾動完成後淡出按鈕
        setTimeout(() => {
            scrollToBottomBtn.classList.remove('visible');
        }, 1000);
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    });





    // 返回控制函數供外部使用
    return {
        show: () => togglePanel(),
        hide: () => resetPanel(),
        isActive: () => isActive
    };
}