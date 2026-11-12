// 模擬棒球卡池資料庫
const mockPool = [
  { id: 'P-001', name: '徐若熙', team: '味全龍', rarity: 'SSR', pos: 'SP' },
  { id: 'B-001', name: '陳傑憲', team: '統一獅', rarity: 'SSR', pos: 'OF' },
  { id: 'B-002', name: '江坤宇', team: '中信兄弟', rarity: 'SR', pos: 'SS' },
  { id: 'B-003', name: '林立', team: '樂天桃猿', rarity: 'SR', pos: '2B' },
  { id: 'P-002', name: '古林睿煬', team: '統一獅', rarity: 'R', pos: 'SP' },
  { id: 'B-004', name: '戴培峰', team: '富邦悍將', rarity: 'N', pos: 'C' }
];

// 點擊按鈕時執行
function startDraw() {
  document.getElementById('drawBtn').disabled = true;
  document.getElementById('loading').style.display = 'block';
  document.getElementById('cardContainer').innerHTML = '';

  // 使用 setTimeout 刻意延遲 0.8 秒，製造「抽卡中」的期待感
  setTimeout(() => {
    let drawnCards = [];
    for(let i = 0; i < 5; i++) {
      let randomIndex = Math.floor(Math.random() * mockPool.length);
      drawnCards.push(mockPool[randomIndex]);
    }
    showCards(drawnCards);
  }, 800);
}

// 將抽到的卡牌渲染到畫面上
function showCards(cards) {
  document.getElementById('drawBtn').disabled = false;
  document.getElementById('loading').style.display = 'none';

  const container = document.getElementById('cardContainer');
  
  cards.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card ${card.rarity}`;
    
    // 設定卡牌內的 HTML 結構
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
