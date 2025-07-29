// 职位选择模态框组件
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { firebaseConfig } from "../../utils/firebase.js";

// 初始化 Firebase Analytics
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 职位选项配置
const POSITION_OPTIONS = [
  {
    id: 'design_manager',
    label: '設計主管',
    description: '負責設計團隊管理和策略規劃'
  },
  {
    id: 'senior_designer',
    label: '資深設計師',
    description: '具備豐富設計經驗的專業設計師'
  },
  {
    id: 'engineer',
    label: '工程師',
    description: '前端、後端或全端工程師'
  },
  {
    id: 'other',
    label: '其他',
    description: '其他職位或角色'
  }
];

// 检查用户是否已经选择过职位
function hasUserSelectedPosition() {
  return localStorage.getItem('user_position') !== null;
}

// 获取用户已选择的职位
function getUserSelectedPosition() {
  return localStorage.getItem('user_position');
}

// 保存用户选择的职位
function saveUserPosition(position) {
  localStorage.setItem('user_position', position);
}

// 发送 Analytics 事件
function sendPositionAnalytics(position) {
  try {
    logEvent(analytics, 'position_selected', {
      position: position,
      timestamp: new Date().toISOString()
    });
    console.log('[Position Selector] Analytics 事件已发送:', position);
  } catch (error) {
    console.error('[Position Selector] Analytics 事件发送失败:', error);
  }
}

// 创建职位选择模态框
function createPositionModal() {
  const modal = document.createElement('div');
  modal.className = 'position-modal';
  modal.id = 'positionModal';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'position-modal-content';
  
  // 创建标题
  const title = document.createElement('h2');
  title.className = 'position-modal-title';
  title.textContent = '請選擇您的職位';
  
  // 创建副标题
  const subtitle = document.createElement('p');
  subtitle.className = 'position-modal-subtitle';
  subtitle.textContent = '這將幫助我們為您提供更相關的內容';
  
  // 创建选项容器
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'position-options';
  
  // 创建职位选项
  POSITION_OPTIONS.forEach(option => {
    const optionElement = document.createElement('div');
    optionElement.className = 'position-option';
    optionElement.setAttribute('data-position', option.id);
    
    optionElement.innerHTML = `
      <div class="position-option-content">
        <h3 class="position-option-title">${option.label}</h3>
        <p class="position-option-description">${option.description}</p>
      </div>
      <div class="position-option-check">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    `;
    
    // 添加点击事件
    optionElement.addEventListener('click', () => {
      selectPosition(option.id, option.label);
    });
    
    optionsContainer.appendChild(optionElement);
  });
  
  // 组装模态框内容
  modalContent.appendChild(title);
  modalContent.appendChild(subtitle);
  modalContent.appendChild(optionsContainer);
  modal.appendChild(modalContent);
  
  return modal;
}

// 处理职位选择
function selectPosition(positionId, positionLabel) {
  console.log('[Position Selector] 用户选择了职位:', positionId, positionLabel);
  
  // 保存用户选择
  saveUserPosition(positionId);
  
  // 发送 Analytics 事件
  sendPositionAnalytics(positionId);
  
  // 隐藏模态框
  hidePositionModal();
  
  // 触发自定义事件，通知其他组件
  const event = new CustomEvent('positionSelected', {
    detail: {
      positionId: positionId,
      positionLabel: positionLabel
    }
  });
  document.dispatchEvent(event);
}

// 显示职位选择模态框
function showPositionModal() {
  // 检查是否已经选择过
  if (hasUserSelectedPosition()) {
    console.log('[Position Selector] 用户已选择过职位:', getUserSelectedPosition());
    return;
  }
  
  // 创建模态框
  const modal = createPositionModal();
  
  // 添加到页面
  document.body.appendChild(modal);
  
  // 添加显示动画
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // 添加点击外部关闭功能
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      hidePositionModal();
    }
  });
  
  // 添加键盘事件（ESC 关闭）
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      hidePositionModal();
      document.removeEventListener('keydown', handleKeydown);
    }
  };
  document.addEventListener('keydown', handleKeydown);
  
  console.log('[Position Selector] 职位选择模态框已显示');
}

// 隐藏职位选择模态框
function hidePositionModal() {
  const modal = document.getElementById('positionModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      if (modal.parentElement) {
        modal.remove();
      }
    }, 300);
    console.log('[Position Selector] 职位选择模态框已隐藏');
  }
}

// 获取用户职位信息（用于其他组件）
function getUserPositionInfo() {
  const positionId = getUserSelectedPosition();
  if (!positionId) return null;
  
  const position = POSITION_OPTIONS.find(option => option.id === positionId);
  return position ? {
    id: position.id,
    label: position.label,
    description: position.description
  } : null;
}

// 初始化职位选择器
function initPositionSelector() {
  // 在页面加载完成后显示模态框
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(showPositionModal, 500); // 延迟显示，确保页面完全加载
    });
  } else {
    setTimeout(showPositionModal, 500);
  }
  
  console.log('[Position Selector] 职位选择器已初始化');
}

// 导出函数
export {
  initPositionSelector,
  showPositionModal,
  hidePositionModal,
  getUserPositionInfo,
  hasUserSelectedPosition,
  getUserSelectedPosition
};

// 自动初始化
initPositionSelector(); 