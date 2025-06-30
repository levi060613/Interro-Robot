// utils/fetchData.js

import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    orderBy
  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
  import { db } from "./firebase.js";
  
  // 問題快取（避免每次都重抓）
  let questionsCache = [];
  
  // 用於存儲快取的數據
  let projectsCache = null;
  let lastFetchTime = null;
  const CACHE_DURATION = 5 * 60 * 1000; // 快取有效期為 5 分鐘
  
  /**
   * 抓初始選項（Step 1）
   * Firestore Collection: options
   */
  export async function fetchOptions() {
    const querySnapshot = await getDocs(collection(db, "options"));
    return querySnapshot.docs.map(doc => doc.data());
  }
  
  /**
   * 抓所有問題資料（Step 2+）
   * Firestore Collection: questions
   */
  export async function fetchQuestions() {
    const querySnapshot = await getDocs(collection(db, "questions"));
    const questions = querySnapshot.docs.map(doc => doc.data());
    questionsCache = questions;  // 快取下來供後續查找
    return questions;
  }
  
  /**
   * 根據指定 ID 陣列，從快取中找出對應問題
   */
  export function fetchQuestionsByIds(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) return [];
  
    return questionsCache.filter(q => ids.includes(q.id));
  }
  
  /**
   * 抓自介資訊（如你首頁需要呈現 intro）
   * 修改為直接回傳硬寫的文字
   */
  export async function fetchIntroductionInfo() {
    // const querySnapshot = await getDocs(collection(db, "introduction"));
    // const infos = querySnapshot.docs.map(doc => doc.data().info);
    // return infos.length > 0 ? infos[0] : '';

    // 直接回傳硬寫的引導語句文字
    return `
    嗨！歡迎來到這個模擬面試互動的聊天室!
    我是 Levi，一名 UI/UX 設計師，目前有一年左右的 UI/UX 設計經驗，
    過去在六角學院擔任協作設計師，負責依據學生的專案需求設計網站視覺與 UX 流程，並協作交付設計給工程師同學實作。\n
    我的設計強項在於 **使用者研究與資訊架構**，擅長換位思考並設計出流程清晰、操作直覺的產品原型。
    我熟悉使用 Figma 設計 wireframe／UI／prototype 製作，並在團隊合作中多次擔任組長角色，統整時程與分工。\n
    為了更深入理解 UI 設計的實作流程，我目前也在自學前端開發， 目前已能處理__ HTML/CSS 切版與元件化的 JavaScript 基本操作__。
    最近我正在進行一個個人專案，嘗試獨立完成一個 **模擬面試聊天** 的 互動網站。
    這個專案預計會整合 UI 設計、前端開發，以及後續的使用數據分析，
    讓我能實際體驗從設計到測試的完整流程，並作為我的作品集之一。`;
  }
  
  /**
   * 獲取所有標籤數據
   * Firestore Collection: tags
   */
  export async function fetchTags() {
    console.log('開始從 Firebase 獲取標籤...');
    const querySnapshot = await getDocs(collection(db, "tags"));
    console.log('Firebase 返回的標籤數據:', querySnapshot.docs.map(doc => doc.data().name));
    return querySnapshot.docs.map(doc => doc.data().name);
  }
  
  /**
   * 根據標籤 ID 獲取相關問題
   */
  export async function fetchQuestionsByTag(tagId) {
    const tagDoc = await getDoc(doc(db, "tags", tagId));
    if (!tagDoc.exists()) return [];
    
    const tagData = tagDoc.data();
    const questionIds = tagData.questions_id || [];
    
    return questionsCache.filter(q => questionIds.includes(q.id));
  }
  
  /**
   * 從 Firebase 獲取專案數據
   * Firestore Collection: projects
   */
  export async function fetchProjects() {
    try {
      console.log('開始從 Firebase 獲取專案數據...');
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projects = querySnapshot.docs.map(doc => doc.data());
      console.log('Firebase 返回的專案數據:', projects);
      return projects;
    } catch (error) {
      console.error('從 Firebase 獲取專案數據失敗:', error);
      return null;
    }
  }
  
  /**
   * 從 Firebase 獲取專案列表
   * @returns {Promise<Array|null>} 專案列表數據，如果發生錯誤則返回 null
   */
  export async function fetchProjectList() {
    try {
      console.log('開始從 Firebase 獲取專案列表');
      const projectsRef = collection(db, "projects");
      const q = query(projectsRef, orderBy("year", "desc")); // 依照年份降序排序
      const querySnapshot = await getDocs(q);
      
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('獲取到的專案列表:', projects);
      return projects;
    } catch (error) {
      console.error('獲取專案列表時發生錯誤:', error);
      return null;
    }
  }
  
  export async function fetchProjectDetailFromFirebase(documentId) {
    const docRef = doc(db, "projectDetail", documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("找不到該專案內容");
    }
  }
  