// ⚾ 全新分級卡池
const mockPool = [
  // 🏆 傳奇 (Legend)
  { id: 'L-001', name: '陳金鋒', team: 'La New熊', rarity: 'Legend', pos: 'DH' },
  { id: 'L-002', name: '彭政閔', team: '兄弟象', rarity: 'Legend', pos: '1B' },
  { id: 'L-003', name: '潘威倫', team: '統一獅', rarity: 'Legend', pos: 'SP' },

  // ✨ 特殊成就卡 (Special) - 多了一個 award 屬性
  { id: 'S-001', name: '徐若熙', team: '味全龍', rarity: 'Special', pos: 'SP', award: '台灣大賽MVP' },
  { id: 'S-002', name: '江坤宇', team: '中信兄弟', rarity: 'Special', pos: 'SS', award: '金手套四連霸' },
  { id: 'S-003', name: '羅力', team: '富邦悍將', rarity: 'Special', pos: 'SP', award: '兩度三冠王' },
  { id: 'S-004', name: '林立', team: '樂天桃猿', rarity: 'Special', pos: '2B', award: '年度MVP' },

  // 🔥 王牌 (Ace)
  { id: 'A-001', name: '陳傑憲', team: '統一獅', rarity: 'Ace', pos: 'OF' },
  { id: 'A-002', name: '古林睿煬', team: '統一獅', rarity: 'Ace', pos: 'SP' },
  { id: 'A-003', name: '魔鷹', team: '台鋼雄鷹', rarity: 'Ace', pos: '1B' },

  // 💎 稀有 (Rare)
  { id: 'R-001', name: '王溢正', team: '台鋼雄鷹', rarity: 'Rare', pos: 'SP' },
  { id: 'R-002', name: '曾峻岳', team: '富邦悍將', rarity: 'Rare', pos: 'CP' },
  { id: 'R-003', name: '王威晨', team: '中信兄弟', rarity: 'Rare', pos: '3B' },

  // ⚪ 普卡 (Common)
  { id: 'C-001', name: '戴培峰', team: '富邦悍將', rarity: 'Common', pos: 'C' },
  { id: 'C-002', name: '岳東華', team: '中信兄弟', rarity: 'Common', pos: '2B' },
  { id: 'C-003', name: '郭天信', team: '味全龍', rarity: 'Common', pos: 'OF' }
];

// 設定每個稀有度對應的中文與顏色
const rarityMap = {
  'Legend': { text: '傳奇', color: '#d35400' },
  'Special': { text: '特殊', color: '#8e44ad' },
  'Ace': { text: '王牌', color: '#c0392b' },
  'Rare': { text: '稀有', color: '#2980b9' },
  'Common': { text: '普卡', color: '#7f8c8d' }
};

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
    
    myBag = myBag.concat(drawnCards);
    localStorage.setItem('cpbl_bag', JSON.stringify(myBag));

    renderCards(drawnCards, "✨ 本次抽卡結果 ✨");
  }, 800);
}

function showBag() {
  if (myBag.length === 0) {
    document.getElementById('sectionTitle').innerText = "🎒 背包是空的，快去抽卡吧！";
    document.getElementById('cardContainer').innerHTML = '';
    return;
  }
  renderCards(myBag, `🎒 我的背包 (共 ${myBag.length} 張卡)`);
}

function renderCards(cards, titleText) {
  document.getElementById('drawBtn').disabled = false;
  document.getElementById('loading').style.display = 'none';
  document.getElementById('sectionTitle').innerText = titleText;

  const container = document.getElementById('cardContainer');
  container.innerHTML = '';
  
  cards.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card ${card.rarity}`;
    
    // 取得稀有度的中文與顏色設定
    const rInfo = rarityMap[card.rarity];
    
    // 如果這張卡有 special award 屬性，就生成布條的 HTML
    const awardHtml = card.award ? `<div class="award-banner">${card.award}</div>` : '';
    
    cardDiv.innerHTML = `
      ${awardHtml}
      <div style="font-size:12px; color:#555; text-align:left; z-index:1;">${card.team}</div>
      <div style="font-weight:bold; font-size:22px; margin-top:5px; z-index:1;">${card.name}</div>
      <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:flex-end; z-index:1;">
        <span style="background:#34495e; color:white; padding:3px 6px; border-radius:4px; font-size:12px;">${card.pos}</span>
        <span style="font-weight:bold; font-size:16px; color:${rInfo.color}">${rInfo.text}</span>
      </div>
    `;
    container.appendChild(cardDiv);
  });
}
