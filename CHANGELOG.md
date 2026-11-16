## V3.18 — 回復 V3.16 完整內容並加入手機橫向提示
- 還原所有教學照片與 CPE 正式證明。
- 保留 V3.16 的自述故事、Scheme 樹狀圖與練習前邀請。
- 練習開場改成口語文字。
- 手機直向時顯示去背角色及旋轉手機動畫。

## V3.13
- 新增引導練習略過按鈕；桌面版 02/03 下移。
- 將 8 顆可互動個性泡泡移到整個首頁，可隨機分時冒出與點擊爆開。
- 研究方向的動機及未來希望調整至頂端；減少 footer 前的多餘空白。

# Changelog

## V3 — 2026-11-16

- 從零建立可部署的單頁網站，使用奶油白、玫瑰粉與巧克力棕。
- 加入首頁原位影片播放與 Canvas 黑底色鍵去除，影片結束後才啟用人物圖片。
- 將四張漫畫卡片提升至 19%、43% 的 Hero 相對位置（手機改為 2×2）。
- 完成五張去背角色 WebP、四組詳細章節、ReNew 及作品 PDF 圖片與研究互動示範。
- 加入手機版、鍵盤可及性及動態減量設定。

## V3.1
- 修正影片因 `display:none` 無法顯示。
- 直接播放原始影片，移除 Canvas 去背與影格繪製。
- 補充自動播放失敗時可手動播放。

## V3.2
- 替換開場素材為使用者提供的透明 VP9 WebM，驗證 Alpha 通道。
- 取消 mix-blend-mode:screen，直接渲染透明影片。


## V3.3
- 透明影片搭配 5 段 HTML 個人標籤進場特效，使用影片時間而非累積 setTimeout 觸發。
- 影片播放時完全隱藏／停用 01～04 卡片，片尾依序彈入；移除跳過按鈕。
- 自動播放受限制時僅提供「播放我的故事」；保留失敗備援與無障礙閱讀。

## V3.4
- 開場文字改為自述書故事語氣，依左右上下視線方向定位。
- 四則故事泡泡按影片時間單獨顯示，不再逐一累積。

## V3.5
- 卡片往中央收近，首頁背景字下移至腰部視覺高度。
- 眼神泡泡簡化成單句，確保約五秒的開場可以閱讀。
- 保留去背 WebM 與四張卡片播放後進場邏輯。

## V3.6
- Enlarged Lizhen’s World title.
- Added post-intro five-question guided algebra experience and client-side concept tracking.
- Reused interactive demonstration in Research section.

## V3.7
- 精簡教學開場，改以橫條小圖呈現知識點。
- 簡化首頁導覽與裝飾文字，放大 Hello 標題。
- 關於理貞文字列點與重點深色顯示，新增互動特質泡泡。
- 申請動機與未來希望移至研究方向彈窗開頭。

## V3.8 — 溫暖且更精簡的互動人物標籤
- 關於理貞彈窗右側新增四個可戳破泡泡：獨立、責任感、執著、善良。
- 每個泡泡顯示對應的自述實例，不再使用制式履歷標籤。
- 保留圖表式的知識點提示、精簡首頁與大標題。


### V3.9
- 新增「鄉村女孩當年只能靠自己，如今她想成為偏鄉孩子的靠山！」粉色短劇風格戲劇海報字體。
- 交換左側 01／02 框位置，四卡改成順時針的弧形排列；保留 Hover 與彈窗。


## V3.10
- 開場透明影片期間顯示紅果短劇風格大標題，開場後還原首頁主標。
- 01/02 卡片 Hover 圖片交換，並將圓弧卡片向人物收近。
- 關於理貞的特質改成彈窗出場時升起的玻璃泡泡，點擊破裂後顯示故事。
- 補充 ReNew 為三人團隊的大學畢業專題。


## V3.11
- Short-drama intro title raised with a center gap for the character.
- Restored gaze-linked story labels during intro.
- Moved ABOUT ME heading ahead of floating personality bubbles, with staggered entry and independent drift.
- Preserved all four personality examples and click-to-pop stories.


## V3.12
- 移除 A LITTLE MORE ABOUT ME 及 GET TO KNOW LIZHEN 重複頁面區塊。
- ABOUT ME 增加八顆錯時漂浮、點擊顯示經歷的特質泡泡。
- PROJECTS & ACHIEVEMENTS 頂部改為學業與競賽成果儀表板。
- 研究方向補強研究問題、系統流程、技術架構、成效評估與研究動機。


### V3.14
- 修正漂浮特質出現時機：僅 01 ABOUT ME 彈窗開啟後生成；關閉後即清除。
- 泡泡在整個 viewport 隨機分布、錯開出現並逐漸往上飛，點擊仍可閱讀故事。
- 調整泡泡 z-index，使其浮在彈窗之上而非被遮罩遮蔽。

## V3.16
- Remove header; expand About Me narrative and concrete responsibility examples.
- Add six teaching photos and CPE certificate.
- Add pre-guide animated intro.
- Replace Scheme report image with structured textual explanation and HTML tree.


### V3.19
- 修正特質故事視窗至畫面中央，加入縮放進場。
- 修正手機直向旋轉提示的覆蓋範圍。
- 新增手機觸控卡片「人物變身後開啟內容」動效。

## V3.21 — iPhone transparency and landscape fix
- Replace emoji-prone `✦` symbols with monochrome `✦` throughout visible interface.
- Add transparent animated WebP opening for iPhone/iPad; retain WebM Alpha for desktop browsers.
- Pause all opening playback until phone is landscape; returning to portrait restarts the WebP intro on next landscape orientation.
- Fit title, character and four cards inside short landscape phone viewports.

V3.22：手機支援直向閱讀，移除強制旋轉，保留 iOS 透明動畫；全文字星芒符號統一為 ✦。
