// formatters.js

/**
 * 將純文字轉換為帶有豐富樣式的 HTML
 * @param {string} text - 需要格式化的文字
 * @returns {string} 格式化後的 HTML 字串
 */
export function formatReplyText(text) {
  // console.log(text); // 檢視用
  return text
    /* ------------------------------- */
    /* 區塊級元素 (Block Elements) */
    /* ------------------------------- */
    
    // 1. 程式碼區塊：以 ``` 開頭與結尾的區段（支援多行）
    .replace(/```(?:\w+)?\n([\s\S]*?)```/g, (_, code) =>
      `<pre class="rich-text__code-block"><code>${escapeHtml(code)}</code></pre>`
    )
    // 📌 樣式：rich-text__code-block
    // ✅ 使用方式：將 Markdown 程式碼區塊轉為 <pre><code>
    // 範例輸入：
    // ```js
    // console.log("hello");
    // ```

    // 2. 引言段落：以 "> " 開頭的句子
    .replace(/^> (.*)$/gm, '<blockquote class="rich-text__quote">$1</blockquote>')
    // 📌 樣式：rich-text__quote
    // ✅ 使用方式：轉換 Markdown blockquote
    // 範例輸入：> 這是一段引言

    // 3. 標題：以 ### 開頭和結尾的段落
    .replace(/^###\s*(.*?)\s*###$/gm, '<h3 class="rich-text__heading">$1</h3>')
    // 📌 樣式：rich-text__heading
    // ✅ 使用方式：用於小標題
    // 範例輸入：###小標題###

    // 4. 重點標題：以 "【重點】" 開頭的段落
    .replace(/【重點】(.*?)(\n|$)/g, '<p class="rich-text__highlight-title">$1</p>')
    // 📌 樣式：rich-text__highlight-title
    // ✅ 使用方式：用於顯示特別提醒段落
    // 範例輸入：【重點】請特別注意此段落

    // 5. 清單區塊：以 - 開頭的連續段落
    .replace(/(?:^|\n)(- .+(?:\n- .+)*)/g, (_, listBlock) => {
      const listItems = listBlock
        .trim()
        .split('\n')
        .map(item => item.replace(/^- (.*)$/, '<li class="rich-text__list-item">$1</li>'))
        .join('');
      return `<ul class="rich-text__list">${listItems}</ul>`;
    })
    // 📌 樣式：rich-text__list, rich-text__list-item
    // ✅ 使用方式：自動將連續的 - 開頭段落轉換為有序清單
    // 範例輸入：
    // - 項目一
    // - 項目二

    /* ------------------------------- */
    /* 行內元素 (Inline Elements) */
    /* ------------------------------- */

    // 6. 行內程式碼：用 `包起來`
    .replace(/`([^`\n]+?)`/g, '<code class="rich-text__inline-code">$1</code>')
    // 📌 樣式：rich-text__inline-code
    // ✅ 使用方式：標記小段程式碼或變數名稱
    // 範例輸入：請使用 `myFunction()`

    // 7. 粗體文字：使用 **雙星號**
    .replace(/\*\*(.+?)\*\*/g, '<strong class="rich-text__bold">$1</strong>')
    // 📌 樣式：rich-text__bold
    // ✅ 使用方式：語氣強調
    // 範例輸入：**請注意**

    // 8. 斜體文字：使用 *單星號*
    .replace(/(^|[^*])\*(?!\*)([^*\n]+)\*(?!\*)/g, '$1<em class="rich-text__italic">$2</em>')
    // 📌 樣式：rich-text__italic
    // ✅ 使用方式：表示重點、外語等
    // 範例輸入：*提示*

    // 9. 刪除線文字：使用 ~~刪除~~
    .replace(/~~(.*?)~~/g, '<s class="rich-text__strike">$1</s>')
    // 📌 樣式：rich-text__strike
    // ✅ 使用方式：表示過期或無效內容
    // 範例輸入：~~已刪除~~

    // 10. 底線文字：使用 ~-底線-~
    .replace(/~-(.*?)-~/g, '<u class="rich-text__underline">$1</u>')
    // 📌 樣式：rich-text__underline
    // ✅ 使用方式：標示底線強調
    // 範例輸入：~-底線-~

    // 11. 高亮文字：使用 ==高亮==
    .replace(/==(.*?)==/g, '<mark class="rich-text__highlight">$1</mark>')
    // 📌 樣式：rich-text__highlight
    // ✅ 使用方式：標示重點或高亮提示
    // 範例輸入：==重點==

    // 12. 附註文字：使用 ^^附註^^
    .replace(/\^\^(.*?)\^\^/g, '<small class="rich-text__footnote">$1</small>')
    // 📌 樣式：rich-text__footnote
    // ✅ 使用方式：用於顯示附註或補充說明
    // 範例輸入：^^這是一個附註^^

    // 13. 作品連結：使用 [[作品名稱]]
    .replace(/\[\[(.*?)\]\]/g, (_, workName) => {
      // 先清理掉可能的HTML标签
      const cleanName = workName.replace(/<[^>]*>/g, '').trim();
      return `<a href="javascript:void(0)" class="rich-text__work-link" data-work="${cleanName}">${cleanName}</a>`;
    })
    // 📌 樣式：rich-text__work-link
    // ✅ 使用方式：將文字轉換為可點擊的作品連結
    // 範例輸入：[[作品名稱]]

    /* ------------------------------- */
    /* 其他格式處理 */
    /* ------------------------------- */

    // 14. 換行符號處理
    .replace(/\n/g, '<br class="rich-text__line-break">')
    // 📌 樣式：rich-text__line-break
    // ✅ 使用方式：保留換行格式

    // 添加清理步骤
    .replace(/<span class="[^"]*rich-text__underline[^"]*">/g, '')
    .replace(/<\/span>/g, '')
    .replace(/"&gt;/g, '"')
    .replace(/<span class="[^"]*rich-text__list[^"]*">/g, '')
    .replace(/<span class="[^"]*rich-text__list-item[^"]*">/g, '')
    .replace(/<span class="[^"]*rich-text__bold[^"]*">/g, '')
    .replace(/<span class="[^"]*rich-text__heading[^"]*">/g, '');
}


export function typeTextWithHTML(html, container, speed = 300, chunkSize = 20) {
  const temp = document.createElement('div');
  temp.innerHTML = html;

  const nodes = Array.from(temp.childNodes);
  let i = 0;
  const maxTime = 3000; // 最大顯示時間 3 秒
  const startTime = Date.now();

  function typeNextNode() {
    if (i >= nodes.length) return;

    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;

    if (elapsedTime >= maxTime) {
      // 如果超過 3 秒，直接顯示所有剩餘內容
      while (i < nodes.length) {
        const node = nodes[i];
        const cloned = node.cloneNode(true);
        container.appendChild(cloned);
        i++;
      }
      return;
    }

    const node = nodes[i];
    const cloned = node.cloneNode(true);

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      let j = 0;
      const span = document.createElement('span');
      container.appendChild(span);

      const interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime >= maxTime) {
          // 如果超過 3 秒，直接顯示剩餘文字
          span.textContent = text;
          clearInterval(interval);
          i++;
          typeNextNode();
          return;
        }

        span.textContent += text.slice(j, j + chunkSize);
        j += chunkSize;
        if (j >= text.length) {
          clearInterval(interval);
          i++;
          typeNextNode();
        }
      }, speed);
    } else {
      container.appendChild(cloned);
      i++;
      typeNextNode();
    }
  }

  typeNextNode();
}


// 工具：避免程式碼區塊出現 HTML 注入
function escapeHtml(code) {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('rich-text__work-link')) {
    e.preventDefault();
    const workName = e.target.dataset.work;
    // 使用 hash 進行頁面跳轉
    window.location.hash = 'projectList';
  }
});
