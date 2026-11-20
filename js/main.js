'use strict';
const $ = s => document.querySelector(s);
const state = { phase: 'INTRO_PLAYING', hover: null, modal: null, transitioning: false };
const video = $('#introVideo');
const iosIntroImage = $('#iosIntroImage');
const useIOSIntro = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
let iosStartedAt = 0, iosProgress = 0, iosTimer = null;
const iosDuration = 5163;
function iosCueLoop() {
  if (state.phase !== 'INTRO_PLAYING' || !iosStartedAt) return;
  iosProgress = Math.max(0, Math.min(1, (performance.now() - iosStartedAt) / iosDuration));
  const active = iosProgress >= .10 && iosProgress < .79 ? Math.min(3, Math.floor((iosProgress - .10) / .17)) : -1;
  bubbles.forEach((el, i) => el.classList.toggle('is-visible', i === active));
  endline.classList.toggle('is-visible', iosProgress >= .84 && iosProgress < .97);
  if (iosProgress >= 1) { finishIntro(); return; }
  iosTimer = requestAnimationFrame(iosCueLoop);
}
function startIOSIntro() {
  if (state.phase !== 'INTRO_PLAYING') return;
  video.pause(); video.hidden = true; iosIntroImage.hidden = false;
  // Replacing the animated image restarts it at frame zero after the orientation gate.
  iosIntroImage.removeAttribute('src');
  requestAnimationFrame(() => {
    iosIntroImage.src = 'assets/videos/intro-ios.webp';
    iosStartedAt = performance.now(); iosCueLoop();
  });
}

const character = $('.character'), portrait = $('#characterImage'), introLabel = $('#introLabel');
const cardsArea = $('#cardsArea'), playIntroButton = $('#playIntro');
const bubbles = [...document.querySelectorAll('.intro-bubble')];
const endline = $('.intro-endline');
const frames = { default: '05', about: '02', teaching: '01', projects: '03', research: '04' };
Object.values(frames).forEach(n => { const img = new Image(); img.src = `assets/images/${n}.webp`; });
let currentImage = '05', switchToken = 0, ended = false, animationFrame = 0;
function setImage(num) { if (state.phase !== 'INTERACTIVE') return; if (num === currentImage) return; const token = ++switchToken; const pre = new Image(); pre.src = `assets/images/${num}.webp`; pre.onload = () => { if (token !== switchToken) return; portrait.style.opacity = '0'; setTimeout(() => { if (token !== switchToken) return; portrait.src = pre.src; currentImage = num; requestAnimationFrame(() => portrait.style.opacity = '1'); }, 105); }; }
// Cue positions are fractions of the video's actual duration; video time is the single source of truth.
const cuePoints = [.10, .28, .46, .65, .83];
function updateIntroCues() {
  if (state.phase !== 'INTRO_PLAYING') return;
  const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 5.163;
  const progress = Math.max(0, Math.min(1, video.currentTime / duration));
  const active = progress >= cuePoints[0] && progress < .79 ? Math.min(3, Math.floor((progress - cuePoints[0]) / .17)) : -1;
  bubbles.forEach((el, i) => el.classList.toggle('is-visible', i === active));
  endline.classList.toggle('is-visible', progress >= .84 && progress < .97);
  animationFrame = requestAnimationFrame(updateIntroCues);
}
function finishIntro() {
  if (state.phase !== 'INTRO_PLAYING' || ended) return;
  ended = true; state.phase = 'INTRO_TRANSITION'; cancelAnimationFrame(animationFrame);
  video.pause(); if (iosTimer) cancelAnimationFrame(iosTimer); iosStartedAt = 0; playIntroButton.hidden = true; introLabel.textContent = 'EXPLORE MY WORLD ✦';
  document.querySelectorAll('.intro-bubble,.intro-endline').forEach(el => el.classList.remove('is-visible'));
  character.classList.add('is-ready');
  setTimeout(() => {
    state.phase = 'INTERACTIVE'; video.hidden = true; iosIntroImage.hidden = true; portrait.style.opacity = '1';
    document.body.classList.remove('intro-active');
    showPreGuide();
    document.querySelector('#introOverlay')?.setAttribute('aria-hidden', 'true');
  }, 530);
}
video.addEventListener('ended', finishIntro);
video.addEventListener('error', () => { console.warn('開場影片無法載入，顯示人物首頁。'); finishIntro(); });
video.addEventListener('playing', () => { playIntroButton.hidden = true; cancelAnimationFrame(animationFrame); updateIntroCues(); });
video.addEventListener('pause', () => cancelAnimationFrame(animationFrame));
// Browsers can disallow autoplay; only then show a PLAY button (never a skip button).
// Portrait and landscape are both fully supported: intro starts immediately.
async function startIntro() {
  if (useIOSIntro) { startIOSIntro(); return; }
  video.muted = true; video.defaultMuted = true; video.playsInline = true;
  try { await video.play(); } catch (err) {
    console.warn('瀏覽器阻擋自動播放，提供手動啟動按鈕', err);
    if (state.phase === 'INTRO_PLAYING') playIntroButton.hidden = false;
  }
}
playIntroButton.addEventListener('click', async () => {
  if (useIOSIntro) { startIOSIntro(); return; }
  try { await video.play(); } catch (err) { console.warn(err); finishIntro(); }
});
startIntro();
const about = `<p class="highlight-quote">「從獨自尋找答案，到希望幫助更多人找到答案。」</p><h3>在有限資源中，練習主動尋找答案</h3><p>我在彰化偏鄉長大，家裡沒有太多餘裕讓我參加補習。當同學放學後還能到補習班問問題，我常常只能自己回家想辦法。遇到課堂上聽不懂的地方，我會拿著手機搜尋不同老師的教學影片，把題目抄在白紙上，一遍又一遍地試。沒有人能立刻回答時，難免會著急，但當我終於靠自己想通一道題目，那份開心也讓我慢慢相信：即使資源有限，我還是能一步一步往前走。也因為記得這種感覺，後來成為老師的我，特別在意學生面對「不會」時，有沒有一個願意陪他繼續想的人。</p><h3>責任感，是我做事的基本態度</h3><ul class="story-bullets"><li><b>對自己的生活負責：</b>從高中二年級開始打工；高三起自行負擔生活所需，大學期間經常每週工作五至六天，下班後再補上課業，學費則透過就學貸款支付。</li><li><b>對選擇的路負責：</b>從元智資傳轉系到資工，再轉學至中原資工，即使面對課程與學分抵免的調整，仍規劃修課，在四年內完成大學學業。</li><li><b>對學生與家長負責：</b>每個月提前安排家教時段，不輕易請假、調課；親自批改作業、視情況補上詳解。即使暫緩升學，也希望陪原本的學生走到國中教育會考結束，而不是中途突然離開。</li><li><b>對工作團隊負責：</b>在補習班除了輔導課業，也主動協助家長聯繫、招生與宣傳，希望讓同事能更放心地合作。</li></ul><div class="two-cols"><div class="mini-panel"><h3>快速適應與獨立思考</h3><ul class="story-bullets"><li>接觸新工作時，先觀察、做筆記、整理流程，讓自己盡快能獨立處理任務。</li><li>遇到程式錯誤時，先查資料、重現問題，再逐步修正，而不是等待別人處理。</li></ul></div><div class="mini-panel"><h3>合作與反思</h3><p>在大學專題「ReNew 校園二手交易平台」的三人團隊中，我參與前端介面與核心功能開發，也主動協助安排進度、整合與除錯。</p><p class="deep-insight">好的合作，是讓每個人都發揮專長，而不是一個人承擔所有事。</p></div></div>`;
const teaching = `<p class="highlight-quote">「比起讓學生多上一堂課，我更希望他們有一天不需要依賴我，也知道如何自己找到答案。」</p><h3>四年多，從學生的疑惑開始</h3><p>累積四年多補習班、家教與線上課輔經驗，接觸從國小到高中的學生。我會觀察學生答題與反應、找出錯誤的原因，再調整教學方式，而不只是要求多刷題。</p><div class="teaching-reflection"><h3>我如何面對學生的「不會」？</h3><p>我會先問學生想到哪一步、卡在哪個觀念，再用不同例子或提問拆解問題；遇到習慣等待答案的學生，會請他先說出自己的想法，讓學生知道自己其實已經懂了哪些部分。</p><p class="teaching-emphasis">這些教學現場的觀察，成為我想研究「AI 引導式自主學習」的出發點。</p></div><div class="two-cols teaching-cards"><div class="mini-panel"><span class="modal-kicker">01 · CLASSROOM</span><h3>補習班數理輔導老師</h3><p>曾在單學期獨立負責五個國中班級的數學輔導，協助批改、解題、分析學習困難，也參與家長溝通與團隊工作。</p><div class="teaching-gallery"><img loading="lazy" src="assets/teaching/classroom-1.webp" alt="補習班教學現場"><img loading="lazy" src="assets/teaching/classroom-2.webp" alt="補習班學生課堂活動"><img loading="lazy" src="assets/teaching/classroom-3.webp" alt="補習班學生互動"></div></div><div class="mini-panel"><span class="modal-kicker">02 · ONE-ON-ONE</span><h3>一對一家教</h3><p>依學生程度調整進度、手寫詳解與檢查作業。有學生從二、三十分逐步進步至約八十分；更重要的是重新建立學習信心。</p><div class="teaching-gallery"><img loading="lazy" src="assets/teaching/tutoring-1.webp" alt="家教學生的學習與練習情形"></div></div><div class="mini-panel"><span class="modal-kicker">03 · DISTANCE LEARNING</span><h3>遠距課輔志工</h3><p>透過翰林文教遠距課輔，陪伴資源相對有限的學生，理解遠距學習突破地理限制的可能，也注意到志工與維運人力的限制。</p><div class="teaching-gallery"><img loading="lazy" src="assets/teaching/online-1.webp" alt="翰林文教遠距課輔志工證明"><img loading="lazy" src="assets/teaching/online-2.webp" alt="線上課輔實際教學畫面"></div></div><div class="mini-panel"><span class="modal-kicker">04 · REFLECTION</span><h3>從教學到研究</h3><p>我想知道：當老師不在身邊時，怎樣的提示與回饋，才能讓學生知道自己下一步可以如何學習？</p></div></div>`;
const shot = (name, alt) => `<img loading="lazy" src="assets/projects/${name}" alt="${alt}">`;
const gallery = (items) => `<div class="project-images">${items.map(([name, alt]) => shot(name, alt)).join('')}</div>`;
const roleList = (items) => `<ul class="project-points">${items.map(t => `<li>${t}</li>`).join('')}</ul>`;
const works = [
  ['四資迎新 RPG 互動網站', `<p>以 RPG 式互動畫面呈現迎新資訊，讓新生透過劇情場景、任務流程與報名介面快速理解活動內容。</p><h4>我的負責部分</h4>${roleList(['前端互動頁面設計與整體視覺呈現', '部分劇情場景與操作流程製作', '報名表單相關後端處理與功能串接'])}${gallery([['rpg-home.png', '四資迎新 RPG 網站首頁'], ['rpg-dialog.png', '四資迎新 RPG 劇情對話畫面'], ['rpg-form.png', '四資迎新 RPG 報名表單畫面']])}`, 'HTML / CSS / JavaScript / 表單處理'],
  ['UBA 大專籃球聯賽網站', `<p>團隊網站改版作品，整合賽程、球隊與戰績等資訊，提升大專籃球聯賽網站的易讀性與查詢效率。</p><h4>我的負責部分</h4>${roleList(['整體統整與進度規劃', '資料調查與內容整理', '首頁與球隊資訊頁設計'])}${gallery([['uba-schedule.png', 'UBA 賽程頁面'], ['uba-ranking.png', 'UBA 戰績與排行頁面']])}`, 'Web Design / UI / UX / 資訊整理'],
  ['Face Swap 影片換臉', `<p>利用人臉偵測與特徵對齊技術完成影片換臉，並加入影像融合，改善視覺銜接效果。</p><h4>我的負責部分</h4>${roleList(['程式實作與流程整合', '人臉特徵比對', 'Poisson 融合與結果測試'])}${gallery([['face-swap.png', 'Face Swap 換臉成果示意']])}`, 'Python / OpenCV / InsightFace'],
  ['圖片素描化', `<p>個人作品。以 C++ 直接讀寫 BMP 檔，透過灰階、反色、模糊與像素混合，將照片轉為手繪素描風格。</p><h4>我的負責部分</h4>${roleList(['影像處理流程設計', 'BMP 讀寫與像素運算', '素描化效果調整'])}${gallery([['sketch.png', '圖片素描化成果']])}`, 'C++ / Image Processing'],
  ['Scheme Interpreter', `<p>我用 C++ 開發簡易 Scheme 直譯器，練習從「讀懂輸入」走到「真正執行」，而不只是判斷字串對錯。</p><h4>我負責的部分</h4>${roleList(['<b>Lex（詞法分析）：</b>把輸入切成 token，辨識括號、數字、符號等，並記錄行列位置，方便回報錯誤。', '<b>Parse（語法分析）：</b>使用節點將 list、dotted pair 等輸入建立成 S-expression 樹，保留巢狀結構。', '<b>Eval（求值）：</b>依樹狀結構判斷運算與特殊語法，處理環境鏈、變數作用域與 closure。', '<b>測試與除錯：</b>處理錯誤訊息與非法語法，驗證 define、quote、lambda、let、if、cond、begin 等行為。'])}<div class="s-tree"><h4>S-expression 樹，是讓程式讀懂括號裡的層次</h4><p>例如輸入 <code>(+ 1 (* 2 3))</code>，並不是把整行當成文字計算，而是先辨識出最外層的加法和裡面的乘法。</p><div class="sexpr-visual" role="img" aria-label="S-expression 樹：根節點加號，左子節點 1，右子節點乘號，乘號有子節點 2 與 3"><div class="tree-root">＋</div><div class="tree-stems"><i></i><i></i></div><div class="tree-children"><div class="tree-leaf">1</div><div class="tree-sub"><div class="tree-root">×</div><div class="tree-stems"><i></i><i></i></div><div class="tree-children"><div class="tree-leaf">2</div><div class="tree-leaf">3</div></div></div></div></div><div class="scheme-steps"><span><b>01 · Lex</b> 切出括號、+、1、*、2、3</span><span><b>02 · Parse</b> 建立巢狀的 S-expression 樹</span><span><b>03 · Eval</b> 先算 2 × 3 = 6，再算 1 + 6 = 7</span></div><p>在程式中，節點的 left / right 指向不同部分，讓直譯器能沿著樹一步步解析；遇到 lambda 與閉包時，再搭配環境鏈保存變數的作用域。這也是我從這份作業真正學到的核心。</p></div>`, 'C++ / Lex / Parse / Eval / S-expression'],
  ['ARM Assembly — Julia Set', `<p>組合語言與嵌入式系統三人課程專題。透過 ARM Assembly 實作 Julia Set 像素的迭代計算，再由 C 程式將像素寫入 Linux framebuffer，以 640 × 480 畫面呈現碎形圖樣。</p><h4>專題實作內容</h4>${roleList(['使用 ARM 組合語言處理計算流程、暫存器與指令', '將 drawJuliaSet.s 與 C 程式整合，輸出 16-bit 像素', '透過程式觀察數學迭代與低階圖形輸出的關係'])}${gallery([['julia-set.png', 'Julia Set 數學碎形示意圖（非原始程式截圖）']])}`, 'ARM Assembly / C / Framebuffer / Fractal'],
  ['MIPS-Lite CPU', `<p>團隊實作五階段流水線 MIPS-Lite CPU，整合 IF、ID、EX、MEM、WB 等階段，並處理資料冒險與控制訊號。</p><h4>我的參與內容</h4>${roleList(['參與電腦組織架構分析與模組討論', '協助理解與整合 pipeline 資料路徑', '共同完成報告整理與結果驗證'])}${gallery([['mips.png', 'MIPS-Lite CPU pipeline 圖']])}`, 'Verilog / Computer Architecture'],
  ['《愛的告白》互動裝置', `<p>以互動情境引導參與者完成告白體驗的展覽作品，結合對話流程、實體裝置與視覺呈現。</p><h4>我的負責部分</h4>${roleList(['提出互動概念並擔任組長', '協助整體決策與進度安排', '參與硬體製作與展示整合'])}${gallery([['love-photo.png', '《愛的告白》實體展示照片'], ['love-flow.png', '《愛的告白》互動流程圖']])}`, 'Interactive Installation / Teamwork'],
  ['電子沙漏', `<p>雙人合作的數位電路作品，利用 CD4015 與 CD4069 控制 LED 燈號，模擬沙粒自上而下流動的沙漏效果。</p><h4>我的負責部分</h4>${roleList(['電路焊接與材料購買', '作品製作與測試', '結報撰寫'])}${gallery([['hourglass.png', '電子沙漏的初始、下落與結束狀態']])}`, 'Digital Circuit / Soldering'],
  ['五行棋遊戲程式', `<p>個人程式作品，根據五行棋的棋盤狀態計算合法走法，並輸出移動結果供裁判程式對戰。</p><h4>我做的內容</h4>${roleList(['分析五行棋規則與走法限制', '設計資料結構紀錄棋盤狀態', '撰寫判斷與輸出邏輯，讓程式可自動與裁判互動'])}<p>這個作品讓我更熟悉條件判斷、規則轉譯與演算法實作，也練習把遊戲邏輯轉成可執行程式。</p>`, 'C / Algorithm / Rule-based Logic']
];
const workGithub = {
  '四資迎新 RPG 互動網站': 'RPG-Orientation-Website',
  'UBA 大專籃球聯賽網站': 'UBA-Web',
  'Face Swap 影片換臉': 'face-swap-homework1',
  '圖片素描化': 'BMP-Pencil-Sketch',
  'Scheme Interpreter': 'Scheme-Interpreter-CPP',
  'MIPS-Lite CPU': 'Pipelined-MIPS-Lite-CPU',
  'ARM Assembly — Julia Set': 'ARM-Assembly-Julia-Set'
};
const githubProjectLink = (repo) => `<a class="project-github-link" href="https://github.com/Lizhen0425/${repo}" target="_blank" rel="noopener noreferrer" aria-label="查看 ${repo} GitHub 原始碼"><span class="github-link-icon" aria-hidden="true">&lt;/&gt;</span> 在 GitHub 查看原始碼 <span aria-hidden="true">›</span></a>`;
const projectHTML = `<section class="achievement-head"><span class="modal-kicker">HIGHLIGHTS · 學業與競賽</span><h3>先看幾個重要的里程碑</h3><div class="achievement-grid"><div class="achievement-lead"><span class="achievement-icon">✦</span><strong>銀獎</strong><b>微星盃 · 第二名</b><small>ReNew 校園二手交易平台</small></div><div><span class="achievement-icon">⌘</span><strong>19.8<sup>%</sup></strong><b>CPE 程式能力檢定</b><small>3／7 題 · 排名前 19.8%</small></div><div><span class="achievement-icon">✧</span><strong>決賽</strong><b>2023 ITSA 極客挑戰賽</b><small>全國賽晉級決賽</small></div></div><div class="academic-highlight"><div class="academic-highlight-header"><span class="modal-kicker">ACADEMIC PERFORMANCE</span><h4>學業表現</h4><p>元智大學大一下的學業表現，以及兩門課的期末成績。</p></div><div class="academic-metrics"><div class="academic-metric"><strong>2<span>/44</span></strong><span>大一下班級排名</span></div><div class="academic-metric"><strong>3<span>/105</span></strong><span>大一下系排名</span></div><div class="academic-metric"><strong>100<span>分</span></strong><span>程式設計 · 期末成績</span></div><div class="academic-metric"><strong>97<span>分</span></strong><span>電子電路學 · 期末成績</span></div></div></div><div class="achievement-photos">${shot('award-msi.png', '微星盃銀獎頒獎照片')}${shot('award-itsa.png', '2023 ITSA 全國大專校院程式設計極客挑戰賽晉級決賽證明')}${shot('cpe-certificate.webp', 'CPE 程式能力檢定成績證明：3 題，排名前 19.8%')}</div><div class="achievement-extras"><span>物聯網跨領域學分學程 · 修畢</span><span>摩根投信深耕計畫 · 獎助學金</span></div><p class="achievement-history">ReNew 從第三屆微星盃的創意構想，走到第四屆完成實作並獲銀獎。</p></section><div class="project-feature"><span class="modal-kicker">FEATURED PROJECT · TEAM OF THREE</span><h3>ReNew 校園二手交易平台</h3>${githubProjectLink("ReNew-Campus-Marketplace")}<p>以校內學生為使用者的二手交易網站，整合學生信箱驗證、刊登商品、即時聊天、AI 建議回覆、競標與交易流程。由三人團隊共同完成，並非個人獨立開發。</p><div class="chip-row"><span>微星盃銀獎 · 第二名</span><span>上線兩週百位以上使用者</span><span>SUS 90.75 / 100</span></div>${gallery([['renew-home.png', 'ReNew 首頁與商品瀏覽畫面'], ['renew-chat.png', 'ReNew 即時聊天與 AI 建議回覆畫面'], ['renew-arch.png', 'ReNew 系統架構圖']])}<h3>我的主要負責工作</h3>${roleList(['前端 UI／UX 設計', '會員與商品管理功能', 'Socket.IO 即時聊天室', 'Gemini API／Ollama 相關整合', 'Docker 部署與系統整合除錯', '協助部分後端與資料庫整合'])}<p class="project-note">搜尋、競標機制與價格爬蟲等內容由團隊成員共同分工，不列為我個人獨立成果。</p><div class="chip-row"><span>HTML / CSS / JavaScript</span><span>Node.js</span><span>Socket.IO</span><span>Gemini / Ollama</span><span>Docker</span></div></div><h3>更多實作作品</h3>${works.map((w, i) => `<details class="project-accordion"><summary><span>${String(i + 1).padStart(2, '0')}</span>${w[0]}<span>＋</span></summary><div><span class="tag">${w[2]}</span>${w[1]}${workGithub[w[0]] ? githubProjectLink(workGithub[w[0]]) : ""}</div></details>`).join('')}`;
const research = `<div class="research-hero"><span class="modal-kicker">MY RESEARCH PROPOSAL · 未來規劃</span><h3>生成式 AI 輔助自主學習與認知策略能力培養之系統</h3><p>我希望讓 AI 不急著解題，而是先理解學生卡在哪裡，陪他一步一步想清楚。</p></div><h3>為什麼想研究 AI 引導式學習？</h3><p>四年多的教學經驗讓我發現，學生需要的不只是正確答案，更是理解自己卡在哪一步的機會。我希望結合資訊工程背景、學習科學與教育研究方法，將實際教學中的觀察轉化為可設計、可檢驗的學習支持方式，探索生成式 AI 學習同伴、循序提問與認知策略引導，如何幫助學生逐步建立自主解題能力。</p><h3>未來希望</h3><p>研究所畢業後希望投入教育科技軟體開發，實際做出能讓學生使用的 AI 學習工具。長期持續精進軟體工程能力，也希望讓偏鄉或課後資源不足的孩子，即使沒有老師隨時陪伴，仍能找到下一步。</p><h3>研究從哪裡開始？</h3><p>四年多的補習班、家教與偏鄉遠距課輔中，我發現學生遇到困難時常等待老師給答案；即使答對，也可能不清楚自己是否真正理解。我想結合資訊工程背景與教學觀察，把這些真實的疑問轉成可研究的學習系統。</p><div class="research-questions"><article><span>QUESTION 01</span><h3>怎麼引導學生自己想？</h3><p>比較直接提供解答與循序提問、分階段提示等方式，觀察學生能否逐步完成解題，並將策略運用到類似題。</p></article><article><span>QUESTION 02</span><h3>怎麼發現「以為自己會」？</h3><p>結合作答前信心評估、錯誤類型及提示使用紀錄，找出自信程度與實際表現的落差，提供適切複習建議。</p></article></div><h3>我想設計的學習流程</h3><div class="research-flow"><div><b>01</b><strong>上傳題目</strong><small>辨識題型與知識點</small></div><span>›</span><div><b>02</b><strong>先問信心</strong><small>學生預估是否理解</small></div><span>›</span><div><b>03</b><strong>分層引導</strong><small>概念 › 方向 › 步驟</small></div><span>›</span><div><b>04</b><strong>分析紀錄</strong><small>錯誤、提示與作答</small></div><span>›</span><div><b>05</b><strong>個人練習</strong><small>追蹤弱點與進步</small></div></div><h3>系統將怎麼實作？</h3><div class="two-cols"><div class="mini-panel"><h3>學習者介面與後台</h3><p>規劃以 Next.js 建置跨裝置練習網站，使用 PostgreSQL 保存題庫、答題結果與學習歷程，並提供教師端進度摘要。</p></div><div class="mini-panel"><h3>生成式 AI 與驗算</h3><p>透過 LLM API 辨識文字與圖片題目、生成類似練習，搭配程式計算驗證與審核，降低題目及答案出錯風險。</p></div><div class="mini-panel"><h3>認知策略引導</h3><p>作答前先評估信心；遇到困難時逐步提供觀念、解題方向及步驟提示，並提醒學生回顧錯誤原因。</p></div><div class="mini-panel"><h3>學習歷程分析</h3><p>整理正確率、信心、提示次數、錯題知識點及重複練習結果，呈現「可能需要複習」的概念，而非憑一次錯誤就下定論。</p></div></div><h3>教授可以親自體驗</h3><div class="demo"><div class="demo-equation">2(x + 5) = 14</div><p>先問「2 與括號的關係」，再逐步走到等式性質、逆運算與代回檢查。</p><button id="replayGuided" type="button">體驗 5 步解題 ›</button><button id="showLearningLog" type="button">查看練習紀錄</button><div class="demo-result" id="learningLog"><p>完成練習後，呈現本機作答與待複習知識點。</p></div><p class="demo-note">預先設計的教學概念示範，非即時生成。</p></div><h3>如何評估是否真的有幫助？</h3><div class="evaluation-grid"><div><strong>學習成效</strong><p>比較前後測與類似題表現</p></div><div><strong>自主解題</strong><p>觀察提示依賴程度與獨立完成情形</p></div><div><strong>自我辨識</strong><p>檢視信心評估是否逐漸符合實際表現</p></div></div><p class="demo-note">以上為預計研究方向與規劃。</p>`;
const sections = { about: ['ABOUT ME', '關於理貞', about], teaching: ['TEACHING EXPERIENCE', '教學經歷', teaching], projects: ['PROJECTS & ACHIEVEMENTS', '作品成果', projectHTML], research: ['RESEARCH INTERESTS', '研究方向', research] };
const modal = $('#modal'), modalBody = $('#modalBody'), modalPanel = $('.modal-panel'); let previousFocus = null;
function openModal(key) { const sec = sections[key]; if (!sec) return; previousFocus = document.activeElement; state.modal = key; modalBody.innerHTML = `<span class="modal-kicker">${sec[0]}</span><h2 id="modalTitle">${sec[1]} <span style="color:#c98989">✦</span></h2>${sec[2]}`; modal.hidden = false; document.body.style.overflow = 'hidden'; modalPanel.scrollTop = 0; modalPanel.focus(); if (key === 'research') initResearchDemo(); if (key === 'about') showFloatingTraits(); else hideFloatingTraits(); }
const traitExamples = {
  independent: '高二開始打工。大學時，我靠自己的工作收入負擔生活所需，一邊工作、一邊完成課業。',
  duty: '不論是團隊開發或教學，我都希望成為讓人放心的角色。會主動追進度，遇到工作趕不完時也願意多分擔；家教則會提前安排課程，不輕易請假或調課。',
  persistent: '寫程式遇到問題時，我常常想先找出原因、把功能做到一個段落，才願意休息。',
  kind: '在偏鄉遠距課輔時，想到自己也曾缺少學習資源，除了課堂內容，也會關心學生的作業與學習狀況，希望他們能有更多選擇。',
  adaptable: '從元智資傳轉系到資工，再轉學中原資工；面對新的學習與工作環境，我習慣先觀察、整理流程，再逐步適應。',
  thoughtful: '批改家教作業時，我會想學生究竟卡在哪裡，必要時另寫詳解，不只告訴他正確答案。',
  proactive: '在補習班，除了數理輔導，我也主動參與家長聯繫、招生與宣傳，希望團隊的事情都能順利推進。',
  curious: '我喜歡寫程式時從看不懂、反覆嘗試到解決問題的過程；在專題出現錯誤，也會先查資料再動手修正。'
};
// Full-page floating trait bubbles: independent of the About Me dialog.
let traitTimers = [];
const worldTraits = document.querySelector('#worldTraits');
const worldTraitStory = document.querySelector('#worldTraitStory');
const traitNames = [['independent', '獨立'], ['duty', '責任感'], ['persistent', '執著'], ['kind', '善良'], ['adaptable', '適應力'], ['thoughtful', '同理心'], ['proactive', '主動'], ['curious', '愛鑽研']];
function clearTraitTimers() { traitTimers.forEach(clearTimeout); traitTimers = []; }
function hideFloatingTraits() { clearTraitTimers(); if (worldTraits) { worldTraits.hidden = true; worldTraits.innerHTML = ''; } if (worldTraitStory) { worldTraitStory.hidden = true; worldTraitStory.innerHTML = ''; } }
function showFloatingTraits() {
  if (!worldTraits || !worldTraitStory) return;
  clearTraitTimers();
  worldTraits.innerHTML = ''; worldTraits.hidden = false;
  worldTraitStory.hidden = true;
  // Left and right edges leave the middle free for the character and headline.
  const slots = [[4, 26], [84, 27], [6, 56], [84, 61], [3, 76], [83, 77], [8, 41], [83, 45]];
  const shuffled = [...slots].sort(() => Math.random() - .5);
  const ordered = [...traitNames].sort(() => Math.random() - .5);
  ordered.forEach(([id, label], i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'world-orb';
    b.dataset.trait = id; b.textContent = label;
    const [x, y] = shuffled[i];
    b.style.left = `calc(${x}% + ${(Math.random() * 12 - 6).toFixed(1)}px)`;
    b.style.top = `calc(${y}% + ${(Math.random() * 14 - 7).toFixed(1)}px)`;
    b.style.setProperty('--float-time', `${(7.8 + Math.random() * 4.5).toFixed(2)}s`);
    b.style.setProperty('--rise-distance', `${Math.round(95 + Math.random() * 105)}px`);
    b.style.setProperty('--float-offset', `${Math.round(Math.random() * 16 - 8)}px`);
    b.style.setProperty('--bubble-tilt', `${Math.round(Math.random() * 16 - 8)}deg`);
    worldTraits.appendChild(b);
    traitTimers.push(setTimeout(() => b.classList.add('appeared'), 280 + i * 290 + Math.random() * 280));
  });
}
worldTraits?.addEventListener('click', e => {
  const b = e.target.closest('.world-orb'); if (!b) return;
  b.classList.remove('popping'); void b.offsetWidth; b.classList.add('popping');
  const title = b.textContent;
  worldTraitStory.innerHTML = `<button class="world-story-close" type="button" aria-label="關閉故事">×</button><strong>${title}</strong><p>${traitExamples[b.dataset.trait]}</p>`;
  worldTraitStory.hidden = false; worldTraitStory.classList.remove('world-story-show'); void worldTraitStory.offsetWidth; worldTraitStory.classList.add('world-story-show');
  traitTimers.push(setTimeout(() => { if (b.isConnected) b.classList.remove('popping') }, 700));
});
worldTraitStory?.addEventListener('click', e => { if (e.target.closest('.world-story-close')) worldTraitStory.hidden = true });
function closeModal() { clearTouchPreview(); if (isTouchCardMode()) setImage('05'); hideFloatingTraits(); modal.hidden = true; document.body.style.overflow = ''; state.modal = null; previousFocus?.focus(); }
$('#closeModal').addEventListener('click', closeModal); $('.modal-backdrop').addEventListener('click', closeModal); document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); if (e.key === 'Tab' && !modal.hidden) { const focusables = [...modalPanel.querySelectorAll('button,a[href],summary,[tabindex]:not([tabindex="-1"])')].filter(x => !x.hidden); const first = focusables[0], last = focusables.at(-1); if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } });
let touchPreviewTimer = null;
const isTouchCardMode = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;
function clearTouchPreview() { if (touchPreviewTimer) { clearTimeout(touchPreviewTimer); touchPreviewTimer = null; } document.querySelectorAll('.comic-card.touch-preview').forEach(c => c.classList.remove('touch-preview')); character.classList.remove('touch-character'); }
for (const card of document.querySelectorAll('.comic-card')) {
  card.addEventListener('mouseenter', () => { if (state.phase === 'INTERACTIVE' && !isTouchCardMode()) { state.hover = card.dataset.card; setImage(frames[state.hover]); } });
  card.addEventListener('mouseleave', () => { if (state.phase === 'INTERACTIVE' && !isTouchCardMode()) { state.hover = null; setImage('05'); } });
  card.addEventListener('focus', () => { if (state.phase === 'INTERACTIVE' && !isTouchCardMode()) setImage(card.dataset.image); });
  card.addEventListener('blur', () => { if (state.phase === 'INTERACTIVE' && !isTouchCardMode()) setImage('05'); });
  card.addEventListener('click', () => {
    if (state.phase !== 'INTERACTIVE') return;
    if (!isTouchCardMode()) { openModal(card.dataset.card); return; }
    clearTouchPreview(); card.classList.add('touch-preview'); character.classList.add('touch-character'); setImage(card.dataset.image);
    touchPreviewTimer = setTimeout(() => { touchPreviewTimer = null; clearTouchPreview(); openModal(card.dataset.card); }, 660);
  });
}
document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => openModal(b.dataset.open)));
// Guided learning proof of concept: all answers stay on this device.
const GUIDE_STEPS = [
  { q: '括號前面的 2，和 (x + 5) 是什麼關係？', options: ['相加', '相乘', '相減'], correct: 1, concept: '代數式的乘法記號', tip: '2(x + 5) 是 2 × (x + 5)，省略的是乘號；不是加號。', good: '對！括號前面省略的是「乘號」。' },
  { q: '想先把括號外的 2 消掉，等號兩邊該做什麼？', options: ['兩邊都除以 2', '只有左邊除以 2', '兩邊都減 2'], correct: 0, concept: '等式性質與逆運算', tip: '因為左邊是「乘以 2」，要用相反的「除以 2」；而且等號兩邊都要做相同運算。', good: '沒錯！兩邊同除以 2，就得到 x + 5 = 7。' },
  { q: '現在是 x + 5 = 7，要讓 x 單獨留下來，怎麼做？', options: ['兩邊加 5', '兩邊減 5', '兩邊乘 5'], correct: 1, concept: '加減逆運算', tip: 'x 被加上 5；把加法還原，就需要做減法。別忘了兩邊一起減。', good: '做得好！兩邊同減 5，便得到 x = 7 − 5。' },
  { q: '所以你算出的 x 是多少？', options: ['2', '7', '12'], correct: 0, concept: '整數減法運算', tip: '7 − 5 = 2。先算完再決定答案，不必急著猜。', good: '答對了！這題得到 x = 2。' },
  { q: '最後，代回原式驗算，哪一個是正確的？', options: ['2 × (2 + 5) = 14', '2 + (2 + 5) = 14', '2 × (2 + 5) = 9'], correct: 0, concept: '代入驗算與運算順序', tip: '把 x 換成 2，再先算括號內的 2 + 5 = 7，最後乘 2。', good: '完全正確！代回原式左右都是 14。' }
];
const entry = $('#guidedEntry'), stepLabel = $('#guidedStepLabel'), qText = $('#guidedQuestion'), choices = $('#guidedChoices'), feedback = $('#guidedFeedback'), nextBtn = $('#guidedNext'), progressBar = $('#guidedProgress span');
let guideIndex = 0, guideAttempts = [], guideFirstWrong = new Set(), guideAnswered = false, guideInitialized = false;
function persistGuide() { try { localStorage.setItem('lizhen_guided_demo_v1', JSON.stringify({ at: new Date().toISOString(), attempts: guideAttempts, review: [...guideFirstWrong].map(i => GUIDE_STEPS[i].concept) })); } catch (e) { console.warn('本機儲存不可用', e); } }
function readGuide() { try { return JSON.parse(localStorage.getItem('lizhen_guided_demo_v1') || 'null'); } catch { return null; } }
function renderGuideStep() { const s = GUIDE_STEPS[guideIndex]; guideAnswered = false; stepLabel.textContent = `${String(guideIndex + 1).padStart(2, '0')} / 05`; progressBar.style.width = `${guideIndex / GUIDE_STEPS.length * 100}%`; qText.textContent = s.q; feedback.textContent = ''; feedback.className = 'guided-feedback'; nextBtn.hidden = true; choices.innerHTML = ''; s.options.forEach((o, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'guided-choice'; b.textContent = `${String.fromCharCode(65 + i)}　${o}`; b.addEventListener('click', () => answerGuide(i, b)); choices.appendChild(b); }); }
function answerGuide(i, btn) { if (guideAnswered) return; const s = GUIDE_STEPS[guideIndex]; const ok = i === s.correct; guideAttempts.push({ step: guideIndex + 1, concept: s.concept, selected: i, correct: ok }); persistGuide(); if (!ok) { guideFirstWrong.add(guideIndex); persistGuide(); feedback.textContent = `先想一想：${s.tip} 你可以再選一次。`; feedback.className = 'guided-feedback wrong'; btn.disabled = true; btn.classList.add('incorrect'); return; } guideAnswered = true; btn.classList.add('correct'); choices.querySelectorAll('button').forEach(x => x.disabled = true); feedback.textContent = s.good; feedback.className = 'guided-feedback correct'; nextBtn.hidden = false; nextBtn.textContent = guideIndex === GUIDE_STEPS.length - 1 ? '看看我的學習紀錄 ›' : '繼續下一步 ›'; }
function learningChart(review) { return `<div class="knowledge-chart" role="img" aria-label="五項知識點初步提示紀錄">${GUIDE_STEPS.map((s, i) => { const flagged = review.includes(s.concept); return `<div class="knowledge-row"><span>${i + 1}. ${s.concept.replace('代數式的乘法記號', '乘法記號').replace('等式性質與逆運算', '等式與逆運算').replace('加減逆運算', '加減逆運算').replace('整數減法運算', '整數減法').replace('代入驗算與運算順序', '代入驗算')}</span><span class="knowledge-track"><span style="width:${flagged ? '100' : '8'}%;background:${flagged ? '#c98989' : '#dfd5ce'}"></span></span><b>${flagged ? '需複習' : '✓'}</b></div>` }).join('')}</div><small class="chart-disclaimer">僅依本次答題標記，並非能力診斷。</small>`; }
function showGuideSummary() { progressBar.style.width = '100%'; stepLabel.textContent = '完成 ✓'; qText.textContent = '你的學習小地圖'; choices.innerHTML = learningChart([...guideFirstWrong].map(i => GUIDE_STEPS[i].concept)); feedback.className = 'guided-feedback correct'; feedback.textContent = '這是練習線索，不是正式診斷。'; nextBtn.hidden = false; nextBtn.textContent = '認識理貞 ›'; nextBtn.onclick = finishGuidedEntry; persistGuide(); }
function showPreGuide() { const panel = document.querySelector('#preGuide'); if (!panel) { startGuide(); return; } panel.hidden = false; document.body.classList.add('lesson-active'); panel.querySelector('button')?.focus(); }
function startGuide() { const pre = document.querySelector('#preGuide'); if (pre) pre.hidden = true; if (worldTraitStory) worldTraitStory.hidden = true; guideIndex = 0; guideAttempts = []; guideFirstWrong = new Set(); entry.hidden = false; document.body.classList.add('lesson-active'); nextBtn.onclick = null; nextBtn.removeEventListener('click', advanceGuide); nextBtn.addEventListener('click', advanceGuide); renderGuideStep(); entry.querySelector('.guided-shell').focus(); }
function advanceGuide() { if (!guideAnswered) return; if (guideIndex === GUIDE_STEPS.length - 1) { showGuideSummary(); guideAnswered = false; nextBtn.removeEventListener('click', advanceGuide); return; } guideIndex++; renderGuideStep(); }
function finishGuidedEntry() { hideFloatingTraits(); entry.hidden = true; document.body.classList.remove('lesson-active'); document.body.classList.add('intro-complete'); cardsArea.removeAttribute('inert'); cardsArea.setAttribute('aria-hidden', 'false'); state.phase = 'INTERACTIVE'; portrait.style.opacity = '1'; }
$('#skipGuide')?.addEventListener('click', () => { entry.hidden = true; finishGuidedEntry(); });
function renderLearningLog() { const area = $('#learningLog'); if (!area) return; const data = readGuide(); if (!data) { area.innerHTML = '<p>還沒有作答紀錄，先體驗引導練習吧。</p>'; return; } area.innerHTML = learningChart(data.review || []); }

function initResearchDemo() { const replay = $('#replayGuided'), show = $('#showLearningLog'); replay?.addEventListener('click', () => { closeModal(); startGuide(); }); show?.addEventListener('click', renderLearningLog); renderLearningLog(); }

document.querySelector('#preGuideStart')?.addEventListener('click', startGuide);
