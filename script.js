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

const rarityMap = {
  'Legend': { text: '傳奇', color: '#d35400', weight: 5 },
  'Special': { text: '特殊', color: '#8e44ad', weight: 4 },
  'Ace': { text: '王牌', color: '#c0392b', weight: 3 },
  'Rare': { text: '稀有', color: '#2980b9', weight: 2 },
  'Common': { text: '普卡', color: '#7f8c8d', weight: 1 }
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

// 核心渲染函數 (加入 isDrawing 參數判斷是否要蓋牌)
function renderCards(cards, titleText, isDrawing) {
  document.getElementById('drawBtn').disabled = false;
  document.getElementById('loading').style.display = 'none';
  document.getElementById('sectionTitle').innerText = titleText;

  const container = document.getElementById('cardContainer');
  container.innerHTML = '';
  
  cards.forEach(card => {
    // 如果不是在抽卡(而是在背包)，就直接加上 flipped 類別讓卡片翻過來
    const flippedClass = isDrawing ? '' : 'flipped';
    const rInfo = rarityMap[card.rarity];
    const awardHtml = card.award ? `<div class="award-banner">${card.award}</div>` : '';
    
    const cardWrap = document.createElement('div');
    // 點擊時加上 flipped 類別，觸發 3D 旋轉
    cardWrap.className = `card-scene ${flippedClass}`;
    cardWrap.onclick = function() {
      this.classList.add('flipped');
    };
    
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
          <div class="bottom-row">
            <span class="pos-badge">${card.pos}</span>
            <span class="rarity-text" style="color:${rInfo.color}">${rInfo.text}</span>
          </div>
        </div>
      </div>
    `;
    container.appendChild(cardWrap);
  });
}
