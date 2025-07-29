// 职位 Analytics 工具函数
import { getAnalytics, logEvent, setUserProperties } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { firebaseConfig } from "./firebase.js";

// 初始化 Firebase Analytics
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 职位映射表
const POSITION_MAP = {
  'design_manager': '設計主管',
  'senior_designer': '資深設計師',
  'engineer': '工程師',
  'other': '其他'
};

// 获取用户职位信息
export function getUserPosition() {
  return localStorage.getItem('user_position');
}

// 获取职位显示名称
export function getPositionLabel(positionId) {
  return POSITION_MAP[positionId] || '未知職位';
}

// 发送页面浏览事件（包含职位信息）
export function sendPageViewWithPosition(pageName, pagePath) {
  const userPosition = getUserPosition();
  
  try {
    logEvent(analytics, 'page_view', {
      page_name: pageName,
      page_path: pagePath,
      user_position: userPosition || '未選擇',
      timestamp: new Date().toISOString()
    });
    
    console.log('[Position Analytics] 页面浏览事件已发送:', {
      pageName,
      pagePath,
      userPosition: userPosition || '未選擇'
    });
  } catch (error) {
    console.error('[Position Analytics] 页面浏览事件发送失败:', error);
  }
}

// 发送用户交互事件（包含职位信息）
export function sendInteractionEvent(eventName, eventData = {}) {
  const userPosition = getUserPosition();
  
  try {
    logEvent(analytics, eventName, {
      ...eventData,
      user_position: userPosition || '未選擇',
      timestamp: new Date().toISOString()
    });
    
    console.log('[Position Analytics] 交互事件已发送:', {
      eventName,
      eventData,
      userPosition: userPosition || '未選擇'
    });
  } catch (error) {
    console.error('[Position Analytics] 交互事件发送失败:', error);
  }
}



// 设置用户属性（用于 Google Analytics 4 自定义维度）
export function setUserPositionProperty() {
  const userPosition = getUserPosition();
  
  if (userPosition) {
    try {
      setUserProperties(analytics, {
        user_position: userPosition,
        position_label: getPositionLabel(userPosition)
      });
      
      console.log('[Position Analytics] 用户属性已设置:', {
        user_position: userPosition,
        position_label: getPositionLabel(userPosition)
      });
    } catch (error) {
      console.error('[Position Analytics] 用户属性设置失败:', error);
    }
  }
}

// 初始化职位 Analytics
export function initPositionAnalytics() {
  // 设置用户属性
  setUserPositionProperty();
  
  // 监听职位选择事件
  document.addEventListener('positionSelected', (event) => {
    const { positionId, positionLabel } = event.detail;
    
    // 设置用户属性
    setUserPositionProperty();
    
    console.log('[Position Analytics] 职位选择事件触发:', { positionId, positionLabel });
  });
  
  console.log('[Position Analytics] 职位 Analytics 已初始化');
} 