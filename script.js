// ⚾ 卡池 (維持你原本擴充的設定)
const mockPool = [
  { id: 'L-001', name: '陳金鋒', team: 'La New熊', rarity: 'Legend', pos: 'DH' },
  { id: 'L-002', name: '彭政閔', team: '兄弟象', rarity: 'Legend', pos: '1B' },
  { id: 'L-003', name: '潘威倫', team: '統一獅', rarity: 'Legend', pos: 'SP' },
  { id: 'S-001', name: '徐若熙', team: '味全龍', rarity: 'Special', pos: 'SP', award: '台灣大賽MVP' },
  { id: 'S-002', name: '江坤宇', team: '中信兄弟', rarity: 'Special', pos: 'SS', award: '金手套' },
  { id: 'S-003', name: '羅力', team: '富邦悍將', rarity: 'Special', pos: 'SP', award: '兩度三冠王' },
  { id: 'A-001', name: '陳傑憲', team: '統一獅', rarity: 'Ace', pos: 'OF' },
  { id: 'A-002', name: '古林睿煬', team: '統一獅', rarity: 'Ace', pos: 'SP' },
  { id: 'R-001', name: '王溢正', team: '台鋼雄鷹', rarity: 'Rare', pos: 'SP' },
  { id: 'R-002', name: '曾峻岳', team: '富邦悍將', rarity: 'Rare', pos: 'CP' },
  { id: 'C-001', name: '戴培峰', team: '富邦悍將', rarity: 'Common', pos: 'C' },
  { id: 'C-002', name: '岳東華', team: '中信兄弟', rarity: 'Common', pos: '2B' }
];

// 🏆 稀有度排序權重 (分數越高排越前面)
const rarityWeight = {
  'Legend': 5,
  'Special': 4,
  'Ace': 3,
  'Rare': 2,
  'Common': 1
};

const rarityMap = {
  'Legend': { text: '傳奇', color: '#d35400', weight: 5 },
  'Special': { text: '特殊', color: '#8e44ad', weight: 4 },
  'Ace': { text: '王牌', color: '#c0392b', weight: 3 },
  'Rare': { text: '稀有', color: '#2980b9', weight: 2 },
  'Common': { text: '普卡', color: '#7f8c8d', weight: 1 }
};

let myBag = JSON.parse(localStorage.getItem('cpbl_bag')) || [];

// 🌟 支援傳入抽卡張數 (count)
function startDraw(count) {
  // 抽卡期間鎖定所有抽卡按鈕，防止連點重複觸發
  const drawBtns = document.querySelectorAll('.draw-btn');
  drawBtns.forEach(btn => btn.disabled = true);
  
  document.getElementById('loading').style.display = 'block';
  document.getElementById('cardContainer').innerHTML = '';
  document.getElementById('sectionTitle').innerText = '';

  setTimeout(() => {
    let drawnCards = [];
    // 依照傳入的 count 決定抽幾張 (1 或 10)
    for (let i = 0; i < count; i++) {
      let randomIndex = Math.floor(Math.random() * mockPool.length);
      drawnCards.push(mockPool[randomIndex]);
    }
    
    // 存進背包 ('cpbl_bag')
    myBag = myBag.concat(drawnCards);
    localStorage.setItem('cpbl_bag', JSON.stringify(myBag));

    // 恢復按鈕點擊
    drawBtns.forEach(btn => btn.disabled = false);

    // 顯示卡片 (蓋著的狀態)
    renderCards(drawnCards, `✨ 本次 ${count} 連抽結果 (點擊翻牌)`, true);

    // 💡 貼心小功能：如果是十連抽，在標題旁加一顆「一鍵全翻」按鈕
    if (count > 1) {
      const titleEl = document.getElementById('sectionTitle');
      titleEl.innerHTML += ` <button onclick="flipAllCards()" style="padding: 4px 10px; font-size: 12px; margin-left: 8px; background: #f1c40f; color: #2c3e50;">⚡ 全部翻開</button>`;
    }
  }, 600);
}

// ⚡ 一鍵翻開所有卡片
function flipAllCards() {
  const allCards = document.querySelectorAll('.card-scene');
  allCards.forEach((card, index) => {
    // 加上一點時間差，讓卡片像波浪一樣依序翻開，視覺效果超爽！
    setTimeout(() => {
      card.classList.add('flipped');
    }, index * 80); 
  });
}

    
    myBag = myBag.concat(drawnCards);
    localStorage.setItem('cpbl_bag', JSON.stringify(myBag));

    // 🌟 抽卡時，傳入 isDrawing = true，代表卡片要蓋著
    renderCards(drawnCards, "👉 請點擊卡背來翻開球員卡！", true);
  }, 800);
}

function showBag() {
  if (myBag.length === 0) {
    document.getElementById('sectionTitle').innerText = "🎒 背包是空的，快去抽卡吧！";
    document.getElementById('cardContainer').innerHTML = '';
    return;
  }
  
  // 🌟 自動依照稀有度權重排序 (高的排前面)
  myBag.sort((a, b) => rarityMap[b.rarity].weight - rarityMap[a.rarity].weight);

  // 🌟 打開背包時，傳入 isDrawing = false，代表卡片已經是翻開的
  renderCards(myBag, `🎒 我的背包 (共 ${myBag.length} 張卡)`, false);
}
function renderCards(cards, titleText, isDrawing) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('sectionTitle').innerText = titleText;

  const container = document.getElementById('cardContainer');
  container.innerHTML = '';
  
  cards.forEach(card => {
    const flippedClass = isDrawing ? '' : 'flipped';
    const rInfo = rarityMap[card.rarity];
    const awardHtml = card.award ? `<div class="award-banner">${card.award}</div>` : '';
    
    // 🌟 動態生成數值表 (判斷打者 B 還是投手 P)
    let statsHtml = '';
    if (card.type === 'B') {
      statsHtml = `
        <div class="stats-grid">
          <div class="stat-item"><span>擊</span> ${card.con || 0}</div>
          <div class="stat-item"><span>力</span> <div class="${card.pow >= 90 ? 'high' : ''}">${card.pow || 0}</div></div>
          <div class="stat-item"><span>選</span> ${card.eye || 0}</div>
          <div class="stat-item"><span>跑</span> ${card.spd || 0}</div>
          <div class="stat-item"><span>守</span> ${card.def || 0}</div>
        </div>
      `;
    } else if (card.type === 'P') {
      statsHtml = `
        <div class="stats-grid">
          <div class="stat-item"><span>控</span> <div class="${card.ctrl >= 90 ? 'high' : ''}">${card.ctrl || 0}</div></div>
          <div class="stat-item"><span>速</span> ${card.vel || 0}</div>
          <div class="stat-item"><span>變</span> ${card.brk || 0}</div>
          <div class="stat-item"><span>威</span> ${card.stf || 0}</div>
          <div class="stat-item"><span>體</span> ${card.sta || 0}</div>
          <div class="stat-item"><span>牽</span> ${card.pkf || 0}</div>
        </div>
      `;
    }

    const cardWrap = document.createElement('div');
    cardWrap.className = `card-scene ${flippedClass}`;
    cardWrap.onclick = function() {
      this.classList.add('flipped');
    };
    
    // 把 statsHtml 塞進卡片排版中
    cardWrap.innerHTML = `
      <div class="card-inner">
        <!-- 卡背 -->
        <div class="card-face card-cover">
          <div>CPBL</div>
        </div>
        <!-- 卡面 -->
        <div class="card-face card-player ${card.rarity}">
          ${awardHtml}
          <div class="team-text">${card.team}</div>
          <div class="name-text">${card.name}</div>
          ${statsHtml} <!-- 顯示數值區塊 -->
          <div class="bottom-row">
            <span class="pos-badge">${card.pos}</span>
            <span class="rarity-text" style="color:${rInfo.color}">${rInfo.text}</span>
          </div>
        </div>
      </div>
    `;
    container.appendChild(cardWrap);
  });
  
  // ✨ 整理背包功能
function sortInventory() {
  // 1. 從 localStorage 讀取目前的背包資料 (假設你的儲存鍵名是 'myCards')
  let savedCards = JSON.parse(localStorage.getItem('myCards')) || [];
  
  if (savedCards.length === 0) {
    alert('你的背包是空的，先去抽幾張卡吧！');
    return;
  }

  // 2. 執行排序 (先比稀有度，再比隊伍，最後比 ID)
  savedCards.sort((a, b) => {
    const weightA = rarityWeight[a.rarity] || 0;
    const weightB = rarityWeight[b.rarity] || 0;
    
    if (weightB !== weightA) {
      return weightB - weightA; // 稀有度高的排前面
    }
    if (a.team !== b.team) {
      return a.team.localeCompare(b.team); // 稀有度一樣時，按隊伍名稱排序
    }
    return a.id.localeCompare(b.id); // 隊伍一樣時，按球員 ID 排序
  });

  // 3. 把排好序的陣列存回 localStorage
  localStorage.setItem('myCards', JSON.stringify(savedCards));
  
  // 4. 重新呼叫 renderCards 來顯示整理後的畫面
  // (這裡最後一個參數 true 代表是看背包，不需要翻牌動畫)
  renderCards(savedCards, `🎒 我的背包 (共 ${savedCards.length} 張) - 已排序`, true);
}

// 🗑️ 清空背包功能
function clearInventory() {
  // 加入防呆確認，避免手滑按到
  const confirmClear = confirm('確定要清空背包嗎？這會把所有抽到的心血全部刪除喔！');
  
  if (confirmClear) {
    // 清除 localStorage 裡的紀錄
    localStorage.removeItem('myCards');
    
    // 清空畫面
    const container = document.getElementById('cardContainer');
    container.innerHTML = '';
    document.getElementById('sectionTitle').innerText = '背包已清空';
    
    alert('背包已經乾乾淨淨了！');
  }
}



     