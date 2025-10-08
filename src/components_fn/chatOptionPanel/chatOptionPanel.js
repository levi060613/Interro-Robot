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
    const introductionButton = document.getElementById('introductionButton');
    const menuButton = document.querySelector('.menuButton');
    const carousel = document.querySelector('.chatOptionPanel__carousel');
    const carouselContainer = document.querySelector('.carouselBlock__container');
    const dotsContainer = document.querySelector('.carouselBlock__dots');
    const chatWindow = document.getElementById('chatWindow');

    console.log('[DEBUG] 檢查元素是否存在:');
    console.log('[DEBUG] chatOptionPanel:', !!chatOptionPanel);
    console.log('[DEBUG] switchButton:', !!switchButton);
    console.log('[DEBUG] introductionButton:', !!introductionButton);
    console.log('[DEBUG] menuButton:', !!menuButton);
    console.log('[DEBUG] carousel:', !!carousel);
    console.log('[DEBUG] carouselContainer:', !!carouselContainer);

    if (!chatOptionPanel || !switchButton || !introductionButton || !menuButton || !carousel || !carouselContainer) {
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
    let isFromQuestionClick = false; // 新增：是否從問題點擊進入

    // ========== 檢查是否從問題點擊進入 ==========
    const fromQuestionClick = sessionStorage.getItem('fromQuestionClick') === 'true';
    if (fromQuestionClick) {
        console.log('[DEBUG] 檢測到從問題點擊進入聊天室');
        isFromQuestionClick = true;
        
        // 檢查按鈕是否已經被預先設置了狀態
        const isButtonPreSet = introductionButton.style.display === 'block' && switchButton.style.display === 'none';
        
        if (!isButtonPreSet) {
            // 如果按鈕沒有被預先設置，檢查是否已經顯示過自我介紹
            const chatWindow = document.getElementById('chatWindow');
            if (chatWindow) {
                const chatBubbles = chatWindow.querySelectorAll('.chatBubble--bot');
                const hasShownIntroduction = Array.from(chatBubbles).some(bubble => {
                    const message = bubble.querySelector('.chatBubbleMessage');
                    return message && message.textContent.includes('嗨！歡迎你進來這個聊天室');
                });
                
                if (!hasShownIntroduction) {
                    showIntroductionButton();
                } else {
                    console.log('[DEBUG] 已經顯示過自我介紹，跳過顯示 introductionButton');
                    isFromQuestionClick = false;
                }
            } else {
                // 如果找不到 chatWindow，直接顯示 introductionButton
                showIntroductionButton();
            }
        } else {
            console.log('[DEBUG] 按鈕狀態已被預先設置，跳過重複設置');
        }
        
        // 清除標記，避免重複觸發
        sessionStorage.removeItem('fromQuestionClick');
    }

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
            isFromQuestionClick = state.isFromQuestionClick || false;

            // 如果快取數據存在但沒有 groupsData 或 Step 1 數據，則用初始 options 填充
            if (groupsData.length === 0 || !groupsData[0]) {
                const step1Options = initialOptions.map(opt => ({
                    text: opt.text,
                    reply: opt.reply,
                    questions_id: opt.questions_id || [],
                    id: opt.id,
                    label: opt.label || "其他",
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

            // 恢復按鈕狀態
            if (isFromQuestionClick) {
                // 檢查按鈕是否已經被預先設置了狀態
                const isButtonPreSet = introductionButton.style.display === 'block' && switchButton.style.display === 'none';
                
                if (!isButtonPreSet) {
                    // 檢查是否已經顯示過自我介紹
                    const chatWindow = document.getElementById('chatWindow');
                    if (chatWindow) {
                        const chatBubbles = chatWindow.querySelectorAll('.chatBubble--bot');
                        const hasShownIntroduction = Array.from(chatBubbles).some(bubble => {
                            const message = bubble.querySelector('.chatBubbleMessage');
                            return message && message.textContent.includes('嗨！歡迎你進來這個聊天室');
                        });
                        
                        if (!hasShownIntroduction) {
                            showIntroductionButton();
                        } else {
                            console.log('[DEBUG] 狀態恢復時已經顯示過自我介紹，跳過顯示 introductionButton');
                            isFromQuestionClick = false;
                        }
                    } else {
                        // 如果找不到 chatWindow，直接顯示 introductionButton
                        showIntroductionButton();
                    }
                } else {
                    console.log('[DEBUG] 狀態恢復時按鈕已被預先設置，跳過重複設置');
                }
            }

        } catch (e) {
            console.error("解析 chatOptionPanelState 快取失敗:", e);
            // 解析失敗，使用初始狀態
            currentStep = 1;
            groupsData = [];
            lastActiveStep = 1;
            hasNewStep = false;
            isFromQuestionClick = false;
            const step1Options = initialOptions.map(opt => ({
                text: opt.text,
                reply: opt.reply,
                questions_id: opt.questions_id || [],
                id: opt.id,
                label: opt.label || "其他",
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
            id: opt.id,
            label: opt.label || "其他",
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
        
        // 確保第一步的 suggestionGroup 是 active 狀態
        const firstGroup = carouselContainer.querySelector('.suggestionGroup[data-step="1"]');
        if (firstGroup) {
            firstGroup.classList.add('active');
            firstGroup.classList.remove('left', 'right');
            console.log(`[DEBUG] 初始化後第一步 suggestionGroup 狀態:`, firstGroup.classList.toString());
        }
        
        // 更新指示點
        updateDots();
        
        // 設定第一個建議組為 active 狀態
        scrollToStep(currentStep);
        
        // 保存初始狀態到 sessionStorage
        saveChatOptionPanelState();
        
        // 最終檢查所有 suggestionGroup 的狀態
        const allGroups = carouselContainer.querySelectorAll('.suggestionGroup');
        console.log(`[DEBUG] 初始化完成，共有 ${allGroups.length} 個 suggestionGroup:`);
        allGroups.forEach((group, index) => {
            console.log(`[DEBUG] Group ${index + 1}:`, {
                step: group.dataset.step,
                classes: group.classList.toString(),
                pointerEvents: window.getComputedStyle(group).pointerEvents,
                children: group.children.length
            });
        });
        
    } catch (error) {
        console.error('初始化資料失敗:', error);
    }

    // ========== 事件監聽器 ==========
    
    // 點擊 introductionButton 顯示自我介紹
    introductionButton.addEventListener('click', async (e) => {
        e.stopPropagation();
        console.log('[DEBUG] introductionButton 被點擊');
        
        // 隱藏 introductionButton，顯示 switchButton
        hideIntroductionButton();
        
        // 顯示自我介紹
        await showIntroductionMessage();
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    });
    
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

    // 點擊"其他面試主題"選項
    const otherInterviewTopicsItem = document.querySelector('.menu__item');
    if (otherInterviewTopicsItem) {
        otherInterviewTopicsItem.addEventListener('click', async (e) => {
            e.stopPropagation();
            console.log('[DEBUG] "其他面試主題"被點擊');
            
            // 關閉選單
            closeMenu();
            
            // 自動開啟carousel顯示
            if (!isActive) {
                console.log('[DEBUG] 自動開啟carousel顯示');
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
            }
            
            // 檢測最新一個suggestionGroup是否是標籤建議組
            const groups = carouselContainer.querySelectorAll('.suggestionGroup');
            const lastGroup = groups[groups.length - 1];
            
            if (lastGroup && lastGroup.querySelector('.tagContainer')) {
                // 如果最新的是標籤建議組，跳轉到最新的suggestionGroup
                console.log('[DEBUG] 最新的是標籤建議組，跳轉到最新組');
                const lastStep = parseInt(lastGroup.dataset.step);
                scrollToStep(lastStep);
            } else {
                // 如果不是，新增一個標籤建議組
                console.log('[DEBUG] 最新的不是標籤建議組，新增標籤建議組');
                await addNewTagSuggestionGroup();
            }
            
            // 保存狀態到 sessionStorage
            saveChatOptionPanelState();
        });
    }

    // 點擊"重新聊天"選項
    const restartChatItem = document.getElementById('restartChatBtn');
    if (restartChatItem) {
        restartChatItem.addEventListener('click', async (e) => {
            e.stopPropagation();
            console.log('[DEBUG] "重新聊天"被點擊');
            
            // 關閉選單
            closeMenu();
            
            // 重置聊天室到初始狀態
            await restartChat();
            
            // 保存狀態到 sessionStorage
            saveChatOptionPanelState();
        });
        console.log('[DEBUG] 重新聊天按鈕事件監聽器已綁定');
    } else {
        console.warn('[DEBUG] 找不到重新聊天按鈕元素');
    }

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

    // Dots 點擊切換
    if (dotsContainer) {
        dotsContainer.addEventListener('click', (e) => {
            const dot = e.target.closest('.carouselBlock__dots--dot');
            if (!dot) return;
            
            const targetStep = parseInt(dot.dataset.step);
            if (!isNaN(targetStep) && targetStep !== currentStep) {
                console.log(`[DEBUG] Dot 被點擊，跳轉到步驟 ${targetStep}`);
                scrollToStep(targetStep);
                
                // 如果跳轉到最新步驟，清除新 step 標誌
                const groups = carouselContainer.querySelectorAll('.suggestionGroup');
                const validSteps = Array.from(groups)
                    .map(group => parseInt(group.dataset.step))
                    .filter(step => !isNaN(step));
                const maxStep = Math.max(...validSteps);
                
                if (targetStep === maxStep && hasNewStep) {
                    hasNewStep = false;
                    stopNextButtonAnimation();
                }
                
                saveChatOptionPanelState();
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
        const isDefaultOption = item.dataset.isDefaultOption === 'true';

        // 如果是預設選項，不觸發訊息泡泡，直接處理延伸問題
        if (isDefaultOption) {
            console.log('[DEBUG] 預設選項被點擊，不觸發訊息泡泡');
            
            // 直接處理下一層問題，不關閉 carousel
            if (questionsId.length > 0) {
                await handleDefaultOptionClick(questionsId, text);
            }
            return;
        }

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

    // 處理預設選項點擊的函數
    async function handleDefaultOptionClick(questionsId, parentText) {
        try {
            console.log('[DEBUG] 處理預設選項點擊，questionsId:', questionsId);
            
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

            // 添加被點擊的預設選項作為第一個選項（不觸發訊息）
            nextOptions.unshift({
                text: `「${parentText.substring(0, 8)}${parentText.length > 10 ? '...' : ''}」的延伸：`,
                reply: '',
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
                
                // 自動滾動到新創建的 suggestionGroup
                scrollToStep(newStep);
                
                // 保存狀態到 sessionStorage
                saveChatOptionPanelState();
                
                console.log(`[DEBUG] 預設選項點擊後創建了第 ${newStep} 層選項並自動滾動到該層`);
            }
            
        } catch (error) {
            console.error('處理預設選項點擊時發生錯誤:', error);
        }
    }

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
        switchButton.innerHTML = '<p class="md text-neutral-black text-center">想直接看重點嗎？那點開看看吧。</p>';
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
        console.log(`[DEBUG] 創建 suggestionGroup，步驟: ${step}`);
        
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
        }

        // 清空现有内容
        group.innerHTML = '';

        // 設定初始狀態 - 确保第一步是 active 状态
        if (step === 1) {
            group.classList.add('active');
            group.classList.remove('left', 'right');
            console.log(`[DEBUG] 第一步 suggestionGroup 設置為 active 狀態`);
        } else {
            group.classList.add('right');
            group.classList.remove('active', 'left');
        }

        console.log(`[DEBUG] suggestionGroup 狀態:`, group.classList.toString());

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
            renderNormalSuggestions(group, optionList);
        }
        
        // 保存狀態到 sessionStorage
        saveChatOptionPanelState();
    }

    // 渲染正常建議選項的輔助函數
    function renderNormalSuggestions(group, optionList) {
        console.log(`[DEBUG] 渲染正常建議選項，步驟: ${group.dataset.step}, 選項數量: ${optionList.length}`);
        
        const step = parseInt(group.dataset.step);
        
        // 如果是第一步，添加附注文字
        if (step === 1) {
            const addText = document.createElement('div');
            addText.className = 'suggestionGroup__item add-text';
            addText.style.pointerEvents = 'none';
            addText.innerHTML = '<p>你可以選擇想了解的層面：</p>';
            group.appendChild(addText);
        }
        
        // 如果是第一步，為預設選項創建容器
        let optionContainer = null;
        if (step === 1) {
            optionContainer = document.createElement('div');
            optionContainer.className = 'suggestionGroup__optionContainer';
            group.appendChild(optionContainer);
        }
        
        // 普通建議選項
        optionList.forEach((opt, index) => {
            const item = document.createElement('div');
            item.className = 'suggestionGroup__item';
            
            // 如果是第一步的預設選項，添加特殊類別和標識
            if (step === 1) {
                item.classList.add('suggestionGroup__option');
                item.dataset.isDefaultOption = 'true';
            }
            
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
                // 如果是預設選項，添加 icon
                if (step === 1) {
                    // 根據索引選擇對應的圖片
                    const imageNumber = (index % 4) + 1; // 循環使用 1-4
                    item.innerHTML = `
                        <div class="suggestionGroup__option-content">
                            <div class="suggestionGroup__option-icon">
                                <img src="/src/assets/images/option_img${imageNumber}.png" alt="選項圖標" width="20" height="20">
                            </div>
                            <p class="md text-neutral-black">${opt.text}</p>
                        </div>
                    `;
                } else {
                    item.innerHTML = `<p class="md text-neutral-black">${opt.text}</p>`;
                }
            }
            item.dataset.reply = opt.reply;
            item.dataset.questionsId = JSON.stringify(opt.questions_id || []);
            item.dataset.id = opt.id; // 添加id屬性
            item.dataset.label = opt.label || "其他"; // 添加label屬性
            
            console.log(`[DEBUG] 創建建議選項:`, {
                text: opt.text,
                className: item.className,
                dataset: item.dataset,
                pointerEvents: item.style.pointerEvents,
                isDefaultOption: step === 1
            });
            
            // 如果是第一步的預設選項，添加到容器中；否則直接添加到 group
            if (step === 1 && optionContainer) {
                optionContainer.appendChild(item);
            } else {
                group.appendChild(item);
            }
        });
        
        console.log(`[DEBUG] 渲染完成，group 中的項目數量: ${group.children.length}`);
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
            questions_id: q.questions_id || [],
            id: q.id,
            label: q.label || "其他"
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
            item.dataset.id = opt.id;
            item.dataset.label = opt.label || "其他";
            container.appendChild(item);
        });

        // 更新當前步驟的數據
        const currentStep = parseInt(container.dataset.step);
        if (currentStep) {
            groupsData[currentStep - 1] = nextOptions;
            // 保存狀態到 sessionStorage
            saveChatOptionPanelState();
        }

        // 为这些问题添加点击事件处理，支持延伸选项
        await addClickHandlersToQuestions(container, nextOptions);
    }

    // ========== 为动态创建的问题添加点击事件处理 ==========
    async function addClickHandlersToQuestions(container, options) {
        // 为每个问题添加点击事件
        const questionItems = container.querySelectorAll('.suggestionGroup__item:not(.add-text)');
        
        questionItems.forEach(async (item) => {
            // 移除可能存在的旧事件监听器
            item.removeEventListener('click', item._questionClickHandler);
            
            // 创建新的事件处理函数
            item._questionClickHandler = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // 检查是否已经点击过
                if (item.classList.contains('suggestionGroup__item--clicked')) {
                    return;
                }

                // 添加clicked样式
                item.classList.add('suggestionGroup__item--clicked');

                const text = item.textContent.trim();
                const reply = item.dataset.reply;
                const questionsId = JSON.parse(item.dataset.questionsId || '[]');

                // 记录问题点击（包含 label）
                if (item.dataset.id && item.dataset.id !== 'parent') {
                    const questionLabel = item.dataset.label || "其他";
                    markQuestionClicked(item.dataset.id, questionLabel);
                }

                // 發送用戶訊息
                appendMessage(text, 'user', true);
                await saveMessage(text, 'user');

                // 發送bot回覆
                appendMessage(reply, 'bot', true);
                await saveMessage(reply, 'bot');

                // 點擊選項後重置面板狀態
                resetPanel();

                // 处理延伸选项（添加深度限制）
                if (questionsId.length > 0) {
                    await handleExtensionQuestions(questionsId, text, reply, container);
                } else {
                    // 如果没有延伸问题，显示标签建议
                    await showTagSuggestionsForContainer(container);
                }
            };
            
            // 添加事件监听器
            item.addEventListener('click', item._questionClickHandler);
        });
    }

    // ========== 处理延伸选项的辅助函数 ==========
    async function handleExtensionQuestions(questionsId, parentText, parentReply, container) {
        try {
            // 获取下一层问题
            const nextQuestions = await fetchQuestionsByIds(questionsId);
            
            if (nextQuestions.length === 0) {
                console.log('没有找到延伸问题');
                return;
            }

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
                text: `「${parentText.substring(0, 8)}${parentText.length > 10 ? '...' : ''}」的延伸：`,
                reply: parentReply,
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
                
                console.log(`创建了第 ${newStep} 层延伸选项`);
            }
            
        } catch (error) {
            console.error('处理延伸选项时发生错误:', error);
        }
    }

    // ========== 为容器显示标签建议的辅助函数 ==========
    async function showTagSuggestionsForContainer(container) {
        try {
            // 检查最后一个建议组是否已经是标签建议组
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
            
        } catch (error) {
            console.error('显示标签建议时发生错误:', error);
        }
    }

    // ========== 新增標籤建議組的函數 ==========
    async function addNewTagSuggestionGroup() {
        try {
            // 找到最後一個非空的步驟
            let lastStep = groupsData.length;
            while (lastStep > 0 && (!groupsData[lastStep - 1] || groupsData[lastStep - 1].length === 0)) {
                lastStep--;
            }
            
            const nextStep = lastStep + 1;
            
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
            groupsData[nextStep - 1] = tagOptions;
            
            // 建立標籤建議組
            createSuggestionGroup(tagOptions, nextStep);
            
            // 更新指示點
            updateDots();
            
            // 設置有新 step 的標誌
            hasNewStep = true;
            
            // 自動跳轉到新建立的標籤建議組
            scrollToStep(nextStep);
            
            // 保存狀態到 sessionStorage
            saveChatOptionPanelState();
            
            console.log(`[DEBUG] 已新增標籤建議組，步驟: ${nextStep}`);
            
        } catch (error) {
            console.error('新增標籤建議組失敗:', error);
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
        // 保存 currentStep、groupsData、lastActiveStep、hasNewStep 和 isFromQuestionClick
        sessionStorage.setItem('chatOptionPanelState', JSON.stringify({
            currentStep: currentStep,
            groupsData: groupsData,
            lastActiveStep: lastActiveStep,
            hasNewStep: hasNewStep,
            isFromQuestionClick: isFromQuestionClick
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

    // ========== 顯示自我介紹函數 ==========
    async function showIntroductionMessage() {
        try {
            // 導入 showIntroductionMessage 函數
            const { showIntroductionMessage: showIntro } = await import('../../utils/chatState.js');
            
            // 調用外部的自我介紹函數
            await showIntro(chatWindow);
            
            // 自我介紹完成後，恢復正常流程
            isFromQuestionClick = false;
            
        } catch (error) {
            console.error('顯示自我介紹失敗:', error);
            // 如果導入失敗，使用備用方案
            const introductionText = `嗨！歡迎你進來這個聊天室，接下來我們會模擬一個面試場合的互動。  
那在開始之前，先讓我簡單介紹一下自己吧！

### 👋 關於我 ###
我是 Levi，目前有 **一年的 UI/UX 設計經驗**。
> 目前作為六角學院的簽約UI設計師，負責根據學生的專案需求設計網站視覺與 UX 流程，並交付設計稿給工程師同學實作。

### 🎯 設計強項 ###
- 擅長 **使用者研究** 與 **需求分析** ，能挖掘問題並提出對應設計方案
- 習慣 **從多方角度思考**，在使用者體驗與實作成本間找到平衡
- 熟練使用 Figma 製作 wireframe、UI 與 prototype，並能彈性配合專案時程
- 熟悉頁面結構與操作流程規劃，讓資訊更清晰易懂、利於團隊溝通

### 🛠 自學開發的動機與進展 ###
目前也在**自學前端開發（以切版為主）**，希望能進一步理解開發與設計的接軌，探索更多優化 UX 體驗的方式。
目前已能處理：
- HTML/CSS 切版
- JavaScript 基本元件化操作

### 🚀 進行中的個人專案 ###
我正在開發一個互動式的 **模擬面試聊天網站** （目前已進入上線階段），
希望透過這個專案，讓我整合：
- 用戶研究分析的能力
- UI 設計
- 前端開發實作
- 後續數據測試、迭代優化
> 專案目標是完整體驗一次從 0 到 1 的產品開發流程，包含使用者測試與數據分析，並作為我作品集中的代表作。`;
            
            appendMessage(introductionText, 'bot', true);
            await saveMessage(introductionText, 'bot');
            isFromQuestionClick = false;
        }
    }

    // ========== 顯示 introductionButton 函數 ==========
    function showIntroductionButton() {
        introductionButton.style.display = 'block';
        switchButton.style.display = 'none';
        console.log('[DEBUG] introductionButton 已顯示，switchButton 已隱藏');
    }

    // ========== 隱藏 introductionButton 函數 ==========
    function hideIntroductionButton() {
        introductionButton.style.display = 'none';
        switchButton.style.display = 'block';
        console.log('[DEBUG] introductionButton 已隱藏，switchButton 已顯示');
    }

    // ========== 重新聊天函數 ==========
    async function restartChat() {
        try {
            console.log('[DEBUG] 開始重新聊天流程');
            
            // 清空聊天窗口
            if (chatWindow) {
                chatWindow.innerHTML = '';
                console.log('[DEBUG] 已清空聊天窗口');
            }
            
            // 重置聊天選項面板狀態
            resetPanel();
            
            // 重置所有狀態變數
            currentStep = 1;
            lastActiveStep = 1;
            hasNewStep = false;
            isFromQuestionClick = false;
            
            // 清空 groupsData，只保留第一步的初始選項
            groupsData = [];
            const step1Options = initialOptions.map(opt => ({
                text: opt.text,
                reply: opt.reply,
                questions_id: opt.questions_id || [],
                id: opt.id,
                label: opt.label || "其他",
                clicked: false
            }));
            groupsData[0] = step1Options;
            
            // 清空 carousel 容器，重新創建第一步的 suggestionGroup
            if (carouselContainer) {
                carouselContainer.innerHTML = '';
                createSuggestionGroup(step1Options, 1);
                console.log('[DEBUG] 已重新創建第一步 suggestionGroup');
            }
            
            // 更新指示點
            updateDots();
            
            // 重置按鈕狀態
            if (introductionButton) {
                introductionButton.style.display = 'none';
            }
            if (switchButton) {
                switchButton.style.display = 'block';
                switchButton.classList.remove('active');
                switchButton.innerHTML = '<p class="md text-neutral-black text-center">想直接看重點嗎？那點開看看吧。</p>';
            }
            if (menuButton) {
                menuButton.classList.remove('hidden');
            }
            
            // 顯示 modalLookBtn
            const modalLookBtn = document.querySelector('.modal-lookBtn');
            if (modalLookBtn) {
                modalLookBtn.classList.remove('hidden');
                console.log('[DEBUG] chatOptionPanel: 已顯示 modalLookBtn');
            }
            
            // 清除相關的 sessionStorage
            sessionStorage.removeItem('chatOptionPanelState');
            sessionStorage.removeItem('chatHistory');
            sessionStorage.removeItem('clickedOptions');
            sessionStorage.removeItem('clickedQuestionIds');
            
            // 重置後自動顯示自我介紹
            await showIntroductionMessage();
            
            console.log('[DEBUG] 重新聊天完成，聊天室已恢復初始狀態，並顯示自我介紹');
            
        } catch (error) {
            console.error('重新聊天時發生錯誤:', error);
        }
    }

    // 返回控制函數供外部使用
    return {
        show: () => togglePanel(),
        hide: () => resetPanel(),
        isActive: () => isActive
    };
}