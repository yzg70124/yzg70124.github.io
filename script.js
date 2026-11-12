const mockPool = [
  { id: 'P-001', name: '徐若熙', team: '味全龍', rarity: 'SSR', pos: 'SP' },
  { id: 'B-001', name: '陳傑憲', team: '統一獅', rarity: 'SSR', pos: 'OF' },
  { id: 'B-002', name: '江坤宇', team: '中信兄弟', rarity: 'SR', pos: 'SS' },
  { id: 'B-003', name: '林立', team: '樂天桃猿', rarity: 'SR', pos: '2B' },
  { id: 'P-002', name: '古林睿煬', team: '統一獅', rarity: 'R', pos: 'SP' },
  { id: 'B-004', name: '戴培峰', team: '富邦悍將', rarity: 'N', pos: 'C' }
];

// 🌟 1. 遊戲一打開，先從保險箱 (localStorage) 拿出背包資料
// 如果沒有資料，就給他一個空的陣列 []
let myBag = JSON.parse(localStorage.getItem('cpbl_bag')) || [];

function startDraw() {
  document.getElementById('drawBtn').disabled = true;
  document.getElementById('loading').style.display = 'block';
  document.getElementById('cardContainer').innerHTML = '';
  document.getElementById('sectionTitle').innerText = '';

  setTimeout(() => {
    let drawnCards = [];
    for(let i = 0; i < 5; i++) {
      let randomIndex = Math.floor(Math.random() * mockPool.length);
      drawnCards.push(mockPool[randomIndex]);
    }
    
    // 🌟 2. 把這次抽到的 5 張卡，塞進我們的背包裡
    myBag = myBag.concat(drawnCards);
    
    // 🌟 3. 把更新後的背包，存回保險箱 (轉成文字格式)
    localStorage.setItem('cpbl_bag', JSON.stringify(myBag));

    // 顯示這次抽到的卡
    renderCards(drawnCards, "✨ 本次抽卡結果 ✨");
  }, 800);
}

// 🌟 4. 查看背包功能
function showBag() {
  if (myBag.length === 0) {
    document.getElementById('sectionTitle').innerText = "🎒 背包是空的，快去抽卡吧！";
    document.getElementById('cardContainer').innerHTML = '';
    return;
  }
  
  // 把整個背包的卡牌丟給畫面顯示
  renderCards(myBag, `🎒 我的背包 (共 ${myBag.length} 張卡)`);
}

// 統一把卡牌畫到螢幕上的函數 (抽卡結果和背包都共用這個函數)
function renderCards(cards, titleText) {
  document.getElementById('drawBtn').disabled = false;
  document.getElementById('loading').style.display = 'none';
  document.getElementById('sectionTitle').innerText = titleText;

  const container = document.getElementById('cardContainer');
  container.innerHTML = '';
  
  cards.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card ${card.rarity}`;
    
    cardDiv.innerHTML = `
      <div style="font-size:12px; color:#555; text-align:left;">${card.team}</div>
      <div style="font-weight:bold; font-size:22px; margin-top:5px;">${card.name}</div>
      <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:flex-end;">
        <span style="background:#34495e; color:white; padding:3px 6px; border-radius:4px; font-size:12px;">${card.pos}</span>
        <span style="font-weight:bold; font-size:16px; color:${card.rarity === 'SSR' ? 'red' : (card.rarity === 'SR' ? 'purple' : 'black')}">${card.rarity}</span>
      </div>
    `;
    container.appendChild(cardDiv);
  });
}
