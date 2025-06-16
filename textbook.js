// textbook.js

// パンくずリスト用の変数
let currentTextbookBreadcrumb = [];

/**
 * 教科書画面を表示する
 */
function showTextbook() {
  showScreen('textbook-container'); // utils.jsのshowScreenを使用
  currentTextbookBreadcrumb = []; // 教科書トップに遷移する際にパンくずリストをリセット
  updateTextbookBreadcrumb();
  renderTextbookChapterList(); // 章リストの表示
}

/**
 * パンくずリストを更新する
 */
function updateTextbookBreadcrumb() {
  const breadcrumbDiv = document.getElementById('textbook-breadcrumb');
  breadcrumbDiv.innerHTML = '';

  const homeSpan = document.createElement('span');
  homeSpan.textContent = 'メニュー';
  homeSpan.classList.add('home');
  homeSpan.onclick = () => {
    backToMenuFromTextbook(); // main.jsの関数を呼び出す
  };
  breadcrumbDiv.appendChild(homeSpan);

  currentTextbookBreadcrumb.forEach((item, index) => {
    const separator = document.createElement('span');
    separator.textContent = ' > ';
    separator.classList.add('separator');
    breadcrumbDiv.appendChild(separator);

    const itemSpan = document.createElement('span');
    itemSpan.textContent = item.name;

    if (index === currentTextbookBreadcrumb.length - 1) {
      itemSpan.classList.add('current');
    } else {
      // 過去の階層に戻れるようにクリックイベントを追加
      itemSpan.onclick = () => {
        // クリックされた階層までパンくずリストを戻す
        currentTextbookBreadcrumb = currentTextbookBreadcrumb.slice(0, index + 1);
        updateTextbookBreadcrumb();

        if (item.type === 'chapter') {
          renderTextbookSectionList(item.key);
        } else if (item.type === 'section') {
          renderTextbookLearningItemList(item.chapterKey, item.key);
        } else if (item.type === 'learningItem') {
          renderTextbookContent(item.chapterKey, item.sectionKey, item.itemIndex);
        }
      };
    }
    breadcrumbDiv.appendChild(itemSpan);
  });
}

/**
 * 章リストをレンダリングする
 */
function renderTextbookChapterList() {
  document.getElementById('textbook-chapter-list').style.display = 'block';
  document.getElementById('textbook-section-list').style.display = 'none';
  document.getElementById('textbook-learning-item-list').style.display = 'none';
  document.getElementById('textbook-content-display').style.display = 'none';

  const chapterListDiv = document.querySelector('#textbook-chapter-list .button-grid');
  chapterListDiv.innerHTML = '';

  for (const chapterKey in textbookContent) {
    const chapter = textbookContent[chapterKey];
    const button = document.createElement('button');
    button.classList.add('menu-button');
    button.textContent = chapter.name;
    button.onclick = () => {
      currentTextbookBreadcrumb.push({
        name: chapter.name,
        type: 'chapter',
        key: chapterKey
      });
      updateTextbookBreadcrumb();
      renderTextbookSectionList(chapterKey);
    };
    chapterListDiv.appendChild(button);
  }
}

/**
 * 中項目リストをレンダリングする
 * @param {string} chapterKey - 章のキー
 */
function renderTextbookSectionList(chapterKey) {
  document.getElementById('textbook-chapter-list').style.display = 'none';
  document.getElementById('textbook-section-list').style.display = 'block';
  document.getElementById('textbook-learning-item-list').style.display = 'none';
  document.getElementById('textbook-content-display').style.display = 'none';

  const sectionListDiv = document.querySelector('#textbook-section-list .button-grid');
  sectionListDiv.innerHTML = '';

  const sections = textbookContent[chapterKey].sections;
  for (const sectionKey in sections) {
    const section = sections[sectionKey];
    const button = document.createElement('button');
    button.classList.add('menu-button');
    button.textContent = section.name;
    button.onclick = () => {
      currentTextbookBreadcrumb.push({
        name: section.name,
        type: 'section',
        chapterKey: chapterKey,
        key: sectionKey
      });
      updateTextbookBreadcrumb();
      renderTextbookLearningItemList(chapterKey, sectionKey);
    };
    sectionListDiv.appendChild(button);
  }
}

/**
 * 学習項目リストをレンダリングする
 * @param {string} chapterKey - 章のキー
 * @param {string} sectionKey - 中項目のキー
 */
function renderTextbookLearningItemList(chapterKey, sectionKey) {
  document.getElementById('textbook-chapter-list').style.display = 'none';
  document.getElementById('textbook-section-list').style.display = 'none';
  document.getElementById('textbook-learning-item-list').style.display = 'block';
  document.getElementById('textbook-content-display').style.display = 'none';

  const learningItemListDiv = document.querySelector('#textbook-learning-item-list .button-grid');
  learningItemListDiv.innerHTML = '';

  const learningItems = textbookContent[chapterKey].sections[sectionKey].learningItems;
  learningItems.forEach((item, index) => {
    const button = document.createElement('button');
    button.classList.add('menu-button');
    button.textContent = item.title;
    button.onclick = () => {
      currentTextbookBreadcrumb.push({
        name: item.title,
        type: 'learningItem',
        chapterKey: chapterKey,
        sectionKey: sectionKey,
        itemIndex: index
      });
      updateTextbookBreadcrumb();
      renderTextbookContent(chapterKey, sectionKey, index);
    };
    learningItemListDiv.appendChild(button);
  });
}

/**
 * 学習項目コンテンツをレンダリングする
 * @param {string} chapterKey - 章のキー
 * @param {string} sectionKey - 中項目のキー
 * @param {number} itemIndex - 学習項目のインデックス
 */
function renderTextbookContent(chapterKey, sectionKey, itemIndex) {
  document.getElementById('textbook-chapter-list').style.display = 'none';
  document.getElementById('textbook-section-list').style.display = 'none';
  document.getElementById('textbook-learning-item-list').style.display = 'none';
  document.getElementById('textbook-content-display').style.display = 'block';

  const contentArea = document.getElementById('textbook-content-area');
  contentArea.innerHTML = '';

  const learningItem = textbookContent[chapterKey].sections[sectionKey].learningItems[itemIndex];

  const title = document.createElement('h3');
  title.textContent = learningItem.title;
  contentArea.appendChild(title);

  learningItem.paragraphs.forEach(paragraphText => {
    const p = document.createElement('p');
    p.innerHTML = paragraphText; // HTMLタグを解釈するためにinnerHTMLを使用
    contentArea.appendChild(p);
  });
}

// パンくずリストからの戻る処理 (各階層)
function backToTextbookChapterList() {
  currentTextbookBreadcrumb = []; // パンくずリストをクリアして章リストに戻る
  updateTextbookBreadcrumb();
  renderTextbookChapterList();
}

function backToTextbookSectionList() {
  // パンくずリストを章の階層まで戻す
  while(currentTextbookBreadcrumb.length > 0 && currentTextbookBreadcrumb[currentTextbookBreadcrumb.length - 1].type !== 'chapter') {
    currentTextbookBreadcrumb.pop();
  }
  updateTextbookBreadcrumb();
  // 章のキーを取得してセクションリストを再描画
  const lastCrumb = currentTextbookBreadcrumb[currentTextbookBreadcrumb.length - 1];
  if (lastCrumb && lastCrumb.type === 'chapter') {
    renderTextbookSectionList(lastCrumb.key);
  } else {
    // 章のパンくずがない場合は章リストに戻る
    renderTextbookChapterList();
  }
}

function backToTextbookLearningItemList() {
  // パンくずリストをセクションの階層まで戻す
  while(currentTextbookBreadcrumb.length > 0 && currentTextbookBreadcrumb[currentTextbookBreadcrumb.length - 1].type !== 'section') {
    currentTextbookBreadcrumb.pop();
  }
  updateTextbookBreadcrumb();
  // 章とセクションのキーを取得して学習項目リストを再描画
  const lastCrumb = currentTextbookBreadcrumb[currentTextbookBreadcrumb.length - 1];
  if (lastCrumb && lastCrumb.type === 'section') {
    renderTextbookLearningItemList(lastCrumb.chapterKey, lastCrumb.key);
  } else if (currentTextbookBreadcrumb.length > 0 && currentTextbookBreadcrumb[currentTextbookBreadcrumb.length - 1].type === 'chapter') {
    // セクションのパンくずがないが章のパンくずはある場合、セクションリストに戻る
    renderTextbookSectionList(currentTextbookBreadcrumb[currentTextbookBreadcrumb.length - 1].key);
  } else {
    // それ以外の場合は章リストに戻る
    renderTextbookChapterList();
  }
}