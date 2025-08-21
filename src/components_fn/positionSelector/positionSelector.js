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
    label: '設計主管 / 資深設計師',
    description: '＃帶領團隊進行決策<br>＃具面試設計師的經驗<br>＃擁有設計背景'
  },
  {
    id: 'hr_recruiter',
    label: '人資 / 招募相關',
    description: '＃負責徵才與面試<br>＃非設計領域的佔大多數<br>＃以找到符合需求的設計師為目標'
  },
  {
    id: 'uiux_designer',
    label: 'UIUX設計師',
    description: '＃正在或曾經從事 UI/UX 領域工作'
  },
  {
    id: 'other',
    label: '其他類型',
    description: '＃不屬於上述類型的訪客'
  }
];

// 全局变量存储选中的职位
let selectedPosition = null;

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
  const title = document.createElement('p');
  title.className = 'position-modal-title';
  title.textContent = '嗨！我是Levi。';
  
  // 创建副标题
  const subtitle = document.createElement('p');
  subtitle.className = 'position-modal-subtitle';
  subtitle.innerHTML = '首先歡迎您來到我開發的<strong>互動式作品集</strong>網站。 <br>在開始之前，希望能先了解<strong>您的職位類型</strong>，<br> 讓我可以針對數據迭代，提供給各位更流暢、友善的使用體驗。';

  // 创建选项容器
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'position-options';
  
  // 创建职位选项
  POSITION_OPTIONS.forEach(option => {
    const optionElement = document.createElement('div');
    optionElement.className = 'position-option';
    optionElement.setAttribute('data-position', option.id);
    
    // 根据职位ID设置对应的图片
    let imageSrc = '';
    switch(option.id) {
      case 'design_manager':
        imageSrc = 'src/assets/images/manager.png';
        break;
      case 'hr_recruiter':
        imageSrc = 'src/assets/images/HR.png';
        break;
      case 'uiux_designer':
        imageSrc = 'src/assets/images/UIUX_designer.png';
        break;
      case 'other':
        imageSrc = 'src/assets/images/other.png';
        break;
      default:
        imageSrc = 'src/assets/images/other.png';
    }
    
    optionElement.innerHTML = `
      <div class="position-option-image">
        <img src="${imageSrc}" alt="${option.label}" />
      </div>
      <div class="position-option-content">
        <p class="position-option-title">${option.label}</p>
        <p class="position-option-description">${option.description}</p>
      </div>
    `;
    
    // 添加点击事件
    optionElement.addEventListener('click', () => {
      selectPositionOption(option.id, option.label);
    });
    
    optionsContainer.appendChild(optionElement);
  });

  // 创建确认按钮
  const confirmButton = document.createElement('button');
  confirmButton.className = 'primaryButton--fill position-confirm-btn';
  confirmButton.textContent = '確認選擇';
  confirmButton.disabled = true; // 默认禁用状态
  
  // 添加按钮点击事件
  confirmButton.addEventListener('click', () => {
    if (selectedPosition) {
      confirmPositionSelection();
    }
  });
  
  // 创建按钮容器并添加上方阴影
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'position-confirm-btn-container';
  buttonContainer.appendChild(confirmButton);
  
  // 组装模态框内容
  modalContent.appendChild(title);
  modalContent.appendChild(subtitle);
  modalContent.appendChild(optionsContainer);
  modalContent.appendChild(buttonContainer);
  modal.appendChild(modalContent);
  
  return modal;
}

// 处理职位选项选择（不立即确认）
function selectPositionOption(positionId, positionLabel) {
  console.log('[Position Selector] 用户选择了职位选项:', positionId, positionLabel);
  
  // 清除之前的选择状态和隐藏所有description
  document.querySelectorAll('.position-option').forEach(option => {
    option.classList.remove('selected');
    option.style.opacity = '0.5'; // 设置所有选项透明度为0.5
    const description = option.querySelector('.position-option-description');
    if (description) {
      description.classList.remove('visible');
    }
  });
  
  // 设置当前选择状态
  const selectedOption = document.querySelector(`[data-position="${positionId}"]`);
  if (selectedOption) {
    selectedOption.classList.add('selected');
    selectedOption.style.opacity = '1'; // 选中选项透明度为1（完全不透明）
    
    // 显示当前选中选项的description
    const description = selectedOption.querySelector('.position-option-description');
    if (description) {
      description.classList.add('visible');
    }
  }
  
  // 存储选中的职位
  selectedPosition = { id: positionId, label: positionLabel };
  
  // 启用确认按钮
  const confirmBtn = document.querySelector('.position-confirm-btn');
  if (confirmBtn) {
    confirmBtn.disabled = false;
  }
}

// 确认职位选择
function confirmPositionSelection() {
  if (!selectedPosition) return;
  
  console.log('[Position Selector] 用户确认了职位选择:', selectedPosition.id, selectedPosition.label);
  
  // 保存用户选择
  saveUserPosition(selectedPosition.id);
  
  // 发送 Analytics 事件
  sendPositionAnalytics(selectedPosition.id);
  
  // 隐藏模态框
  hidePositionModal();
  
  // 触发自定义事件，通知其他组件
  const event = new CustomEvent('positionSelected', {
    detail: {
      positionId: selectedPosition.id,
      positionLabel: selectedPosition.label
    }
  });
  document.dispatchEvent(event);
  
  // 重置选择状态
  selectedPosition = null;
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
  
  // 移除点击外部关闭功能 - 用户必须通过选择职位并点击确认按钮才能继续
  
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