// handleInput.js
import { options, questionsData } from './tempData.js';


// 判斷輸入關鍵字的相關項目
export function getSuggestionsByKeyword(keyword) {
    const trimmed = keyword.trim();
    if (!trimmed) return [];
  
    const matchedOptions = options.filter(opt =>
      opt.text.includes(trimmed)
    );
  
    const matchedQuestions = questionsData
      .filter(q => q.question.includes(trimmed))
      .map(q => ({
        text: q.question,
        reply: q.answer,
        questions_id: q.questions_id || []
      }));
  
    return [...matchedOptions, ...matchedQuestions];
}
  
// 綁定輸入欄位，並在完成組字後才觸發搜尋


// ========== 注音輸入友善：事件註冊 ==========
export function attachInputListeners(input, {
    onSearch,
    onEmpty,
    onComposingStart,
  }) {
    let isComposing = false;
  
    input.addEventListener('compositionstart', () => {
      isComposing = true;
      if (typeof onComposingStart === 'function') {
        onComposingStart(); // 顯示提示或動畫
      }
    });
  
    input.addEventListener('compositionend', () => {
      isComposing = false;
      const keyword = input.value.trim();
  
      if (keyword === '') {
        onEmpty(); // 回到初始建議
      } else {
        onSearch(keyword); // 執行關鍵字搜尋
      }
    });
  
    input.addEventListener('input', () => {
      if (isComposing) return;
  
      const keyword = input.value.trim();
      if (keyword === '') {
        onEmpty();
      } else {
        onSearch(keyword);
      }
    });
  }


  //未來想用圖片動畫顯示，可以在這邊替換html
export function showComposingHint(suggestionsEl) {
suggestionsEl.innerHTML = `
    <div class="carousel__spinner"></div>
`;
}