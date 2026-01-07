# 網站技術實現指南 (Website Technical Implementation Guide)

本指南詳細解釋了作品集網站中關鍵視覺效果和互動功能的技術實現方式。內容適合開發者或維護者參考，了解特定視覺風格和功能的達成方法。

## 1. 混合星空背景系統 (Hybrid Starry Background System)

星空背景效果採用混合方法：**CSS 漸層 (CSS Gradients)** 用於基礎層（效能較佳），而 **JavaScript 生成 (JavaScript Generation)** 用於動態深度（特定頁面）。

### A. CSS 實現（基礎層）
*   **檔案：** `style.css`
*   **類別：** `.starry-bg`

基礎的無限星空不使用任何圖片檔或複雜的 Canvas 渲染。它在 `::before` 和 `::after` 偽元素上使用多個 CSS `radial-gradient` (放射狀漸層) 層堆疊而成。

```css
/* style.css */
.starry-bg::before,
.starry-bg::after {
    background-image: 
        radial-gradient(1px 1px at 20px 30px, white, transparent),
        radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
        /* ...數十個座標點... */
    background-size: 600px 300px; /* 重複圖樣 */
    animation: twinkle-stars 4s ease-in-out infinite alternate;
}
```

**為什麼使用 `::before` 與 `::after`？**
在 CSS 中，這些是 *偽元素 (pseudo-elements)*。它們允許我們在 `.starry-bg` div 內部創建兩個「虛擬」層，而無需編寫額外的 HTML 代碼。
*   **`::before` 層：** 創建第一層星星圖案。
*   **`::after` 層：** 創建第二層重疊的圖案。關鍵在於它具有不同的 **動畫延遲 (animation-delay)** 和 **透明度 (opacity)**。
**結果：** 通過疊加這兩個圖案並使其動畫不同步，我們僅使用一個 HTML 元素就創造出了複雜、不重複的閃爍效果。

### B. JavaScript 實現（動態粒子）
*   **檔案：** `scripts/starry-bg.js`
*   **方法：** `createStar()`
*   **使用於：** 專案詳情頁面 (Project Detail Pages)

在詳情頁面上，我們生成獨立的 DOM 節點來增加視差深度和不同的移動速度。

```javascript
/* scripts/starry-bg.js */
function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    
    // 隨機大小 (Randomized Size)
    // 透過添加不同的 class 來控制大小
    if (Math.random() > 0.8) star.classList.add('large');
    
    // 隨機位置與速度 (Randomized Position & Speed)
    star.style.left = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    
    document.getElementById('starry-bg').appendChild(star);
}
```

## 2. 3D Hero 場景 (Three.js)

首頁的互動式 3D 模型使用 **Three.js** 渲染。

*   **檔案：** `scripts/three-scene.js`
*   **模型格式：** `.glb` (GL Transmission Format) - 網頁效能最佳化格式。

### 關鍵配置 (Key Configuration)
場景使用透明背景 (`alpha: true`)，使其能與 CSS 星空背景完美融合。

```javascript
// scripts/three-scene.js
const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true,           // 透明背景的關鍵
    antialias: true        // 反鋸齒，讓邊緣平滑
});
renderer.setClearColor(0x000000, 0); // alpha 值為 0
```

### 燈光設置 (Lighting Setup)
使用三點打光法來凸顯模型結構：
1.  **Ambient Light (環境光)**：提供基礎亮度。
2.  **Point Lights (點光源)**：位於 `(10, 10, 10)` 和 `(-10, -10, 10)`，創造邊緣光和陰影定義。

### 互動控制 (Interaction)
透過監聽滑鼠移動事件，計算 X 和 Y 軸的旋轉角度，並設定限制範圍，防止模型翻轉過度。

```javascript
// 旋轉限制 (Rotation limits)
const maxRotationY = Math.PI / 4; // Y 軸限制 45 度
const maxRotationX = Math.PI / 9; // X 軸限制約 20 度

// 在 mousemove 事件中計算
targetRotationY += deltaX * 0.01;
// 使用 Math.max 和 Math.min 夾緊數值 (Clamp)
targetRotationY = Math.max(-maxRotationY, Math.min(maxRotationY, targetRotationY));
model.rotation.y = targetRotationY;
```

## 3. 玻璃擬態 UI (Glassmorphism / Frosted Glass)

現代感、半透明的 UI 外觀是使用 CSS `backdrop-filter` 屬性實現的。這會在元素*後方*的內容上產生模糊效果，模仿毛玻璃質感。

*   **檔案：** `style.css`, `project.css`, `slider.css`
*   **屬性：**

```css
.navbar, .project-card, .overlay {
    background: rgba(255, 255, 255, 0.05); /* 極低透明度的白色 */
    backdrop-filter: blur(10px);           /* 模糊魔法 */
    border: 1px solid rgba(255, 255, 255, 0.1); /* 微妙的邊緣定義 */
}
```

**注意：** 導航欄 (`.navbar`) 使用稍深一點的漸層 (`rgba(255, 255, 255, 0.03)`) 以確保文字可讀性，同時保持頂部不突兀。

## 4. 滾動動畫 (Intersection Observer)

網站使用 **Intersection Observer API** 來實現高效能的「滾動顯示」動畫，而不是監聽繁重的 `scroll` 事件。

*   **檔案：** `scripts/gsap-init.js` (雖然命名為 gsap，但可能混合使用了原生 Observer)
*   **優點：** 瀏覽器會自動優化觀察過程，只有元素進入視口時才觸發回調，大幅減少主執行緒負載。

## 5. 動態內容加載與雙語支持 (Dynamic Content & Bilingual Support)

網站採用數據驅動 (Data-Driven) 的方式來管理專案內容，支援中英雙語切換。

### A. 數據結構
*   **檔案：** `data/projects.json` (專案列表), `data/project_details.json` (專案詳細內容)

JSON 結構設計包含雙語欄位：

```json
/* data/projects.json 範例 */
{
    "id": "sten",
    "title": "Sten Submachine Gun",
    "title_zh": "Sten 衝鋒槍",  // 中文標題
    "badge": "🔫 3D MODELING",
    "badge_zh": "🔫 3D 建模",   // 中文標籤
    "description": "...",
    "description_zh": "..."
}
```

### B. 語言切換邏輯
*   **檔案：** `scripts/language.js`

透過 `data-attribute` (數據屬性) 來存儲不同語言的文本，實現即時切換而無需重新加載頁面。

1.  **元素的標記：** 在生成 HTML 時，將兩種語言都寫入屬性中。
    ```html
    <h3 data-zh="Sten 衝鋒槍" data-en="Sten Submachine Gun">Sten Submachine Gun</h3>
    ```
2.  **切換函數：** `switchLanguage(lang)`
    ```javascript
    function switchLanguage(lang) {
        const elements = document.querySelectorAll('[data-zh][data-en]');
        elements.forEach(el => {
            // 根據當前語言設置 textContent
            el.textContent = el.getAttribute(lang === 'zh' ? 'data-zh' : 'data-en');
        });
    }
    ```

### C. 動態專案詳情頁
*   **檔案：** `scripts/project-detail.js`

專案詳情頁面不再是寫死的 HTML，而是透過 JavaScript 讀取 URL 或檔名判斷當前專案，並從 `project_details.json` 抓取對應資料填充。

```javascript
/* scripts/project-detail.js */
// 1. 識別專案
const page = window.location.pathname.split("/").pop();
// ...邏輯判斷 projectId...
```

## 6. 互動式眼睛 (Interactive Eye)

頁腳或特定區域的互動式眼睛會跟隨滑鼠移動，並具有物理慣性效果。

*   **檔案：** `scripts/eye.js`

### 實作細節
1.  **跟隨游標：** 計算滑鼠位置與眼睛中心的角度 (`Math.atan2`)。
2.  **物理模擬：** 
    *   **摩擦力 (Friction)**: `0.985`
    *   **重力 (Gravity)**: `0.12` (用於擺動效果)
    *   瞳孔位置並非直接設為滑鼠角度，而是透過速度 (`angularVelocity`) 和角度 (`currentAngle`) 的物理公式計算，創造出滑順且帶有微小彈性的自然感。
3.  **旋轉模式：** 點擊眼睛時觸發快速旋轉 (`isSpinning = true`)，此時物理計算會改變，加入旋轉力 (`spinForce`)。

```javascript
/* scripts/eye.js */
function updatePupilPosition() {
     // ...
     const restoreForce = Math.sin(currentAngle + Math.PI / 2) * gravity;
     angularVelocity += restoreForce;
     angularVelocity *= friction;
     // ...
}
```

## 7. 專案滑塊 (Project Slider)

首頁的作品滑塊 (`.projects-slider`) 是一個完全客製化的組件，不依賴任何外部庫（如 Swiper），以確保最大的靈活性和輕量化。

*   **檔案：** `scripts/slider.js`, `slider.css`

### A. 響應式結構 (Responsive Structure)
為了同時支援桌面版和行動版，滑塊結構在不同設備上有根本的變化：

*   **桌面版 (Desktop):**
    *   **佈局：** `flex-direction: row`，但視覺表現更像是一個水平卷軸。
    *   **互動：** 點擊導航箭頭會驅動 `scrollLeft` 屬性，配合 CSS `scroll-behavior: smooth` 實現平滑滾動。
    *   **卡片寬度：** 變動寬度。未選中時窄 (`80px`)，滑鼠懸停 (Hover) 或選中 (`active`) 時展開 (`400px`)。

*   **行動版 (Mobile):**
    *   **佈局：** 透過媒體查詢 (`@media (max-width: 767px)`) 強制為水平滾動容器。
    *   **邏輯更新：** `slider.js` 會檢測設備寬度。在行動版上，導航箭頭和自動置中邏輯會切換為計算水平偏移量 (`offsetLeft`)，確保被選中的卡片總是位於螢幕中央。
    *   **觸控支援：** 監聽 `touchstart` 和 `touchend` 事件，計算滑動距離 (`dx`) 來切換上下張卡片。

### B. 雙語屬性注入
滑塊在渲染卡片時，會將中英文標題同時注入到 HTML 屬性中，例如 `data-title` 和 `data-short`。
CSS 的 `::after` 內容屬性 (`content: attr(data-title)`) 用於在卡片未展開時顯示直排標題，這是一種純 CSS 的高效技巧。

## 8. 文字分割動畫 (Text Splitting Animation)

聯絡區塊 (`.contact`) 的文字懸停效果使用了文字分割技術。

*   **檔案：** `scripts/contact.js`, `contact.css`

腳本會將每個超連結內的文字拆解為單獨的 `<span>` 字符，並為每個字符分配一個 CSS 變數 `--char` (對應索引值)。

```css
/* contact.css */
.contact-nav a span {
    display: inline-block;
    transition-delay: calc(40ms + var(--char) * 20ms); /* 階梯式延遲 */
}
```

當滑鼠懸停時，每個字符會依序向上移動，創造出海浪般的波浪動畫效果。

## 9. 圖片故障載入效果 (Glitch Loading)

專案詳情頁的大圖展示使用了故障藝術 (Glitch) 風格的載入效果。

*   **檔案：** `enhancements.js`, `enhancements.css`

當圖片加載時，會動態添加一系列的 `<div>` 切片覆蓋在圖片上。透過 CSS `clip-path` 和 `transform` 屬性，這些切片會隨機錯位並快速閃爍，模擬數位訊號不穩定的視覺效果，最後才穩定顯示原圖。這增強了網站的 Cyberpunk / Tech 風格。

## 10. 高級交互與視覺效果 (Advanced Interaction & Visual Effects)

除了基礎功能外，網站還包含許多細节上的互動增強。

### A. 橫向滾動滑塊 (Horizontal Slider)
*   **檔案：** `scripts/slider.js`
*   **功能：** 首頁的專案展示採用自定義的橫向滑動效果。
*   **手機與桌面適配：**
    *   **Desktop:** 同時監聽滑鼠點擊與鍵盤方向鍵 (`ArrowRight`, `ArrowLeft`)。
    *   **Mobile:** 監聽 `touchstart` 與 `touchend` 事件，計算滑動距離 (`dx, dy`) 來判斷是否切換卡片。
    *   當卡片被激活 (`activate`) 時，會自動計算滾動位置 (`center(i)`) 確保該卡片置中顯示。

### B. 文字分割動畫 (Text Splitting)
*   **檔案：** `scripts/contact.js`
*   **效果：** 聯絡區塊的連結在 hover 時會有文字逐個跳動的效果。
*   **實現：** 將字串拆分為單個 `<span>`，並為每個字元設定 CSS 自定義屬性 `--char` (索引值)，配合 CSS 的 `animation-delay` 實現波浪狀動畫。

```javascript
/* scripts/contact.js 降級處理 (Fallback) */
text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.setProperty('--char', i); // 用於 CSS calc() 計算延遲
    link.appendChild(span);
});
```

### C. 滾动顯示 (Scroll Reveal)
*   **檔案：** `scripts/enhancements.js`
*   **機制：** 使用 `IntersectionObserver` 監聽 `.project-card`, `.skill-item` 等元素。
*   **交錯動畫：** 為列表中的每個項目動態添加 `transition-delay`，創造出依序出現的視覺層次感。
    ```javascript
    card.style.transitionDelay = `${index * 0.2}s`;
    ```

### D. 載入畫面故障藝術 (Glitch Loading Screen)
*   **檔案：** `scripts/loading.js`
*   **效果：** 載入文字 ("LOADING") 會隨機變成亂碼符號。
*   **實現：** 設定 `setInterval` 定期替換文字內容為隨機特殊字元 (`!@#$%...`)，然後迅速還原，模擬數位訊號不穩定的 Cyberpunk 風格。

## 10. 資料架構與模擬資料庫 (Data Architecture & Simulated DB)

雖然這是一個靜態網站 (Static Site)，但我們採用了現代化的**資料庫設計模式 (Repository Pattern)** 來管理數據。

*   **檔案：** `scripts/db.js`, `data/projects.json`

### A. JSON 作為 NoSQL 資料庫
我們將 `.json` 檔案視為輕量級的 NoSQL 資料庫集合 (Collections)：
*   `projects.json`: 相當於 `projects` 表，儲存列表視圖所需的輕量資料。
*   `project_details.json`: 儲存完整的頁面內容與規格。

### B. 資料存取層 (Data Access Layer)
為了更有說服力地模擬後端交互，我們封裝了一個 `Database` 類別：

```javascript
/* scripts/db.js */
class Database {
    // 模擬 SELECT * FROM projects
    async getAllProjects() {
        return await this.connect();
    }
    
    // 模擬 SELECT * FROM projects WHERE id = ?
    async getProjectById(id) {
        // ...
    }
}
```

這不僅是讀取檔案，還包含了：
1.  **快取機制 (Caching):** 避免重複請求同一份 JSON。
2.  **異步處理 (Async/Await):** 模擬真實網路請求的等待過程。
3.  **錯誤處理 (Error Handling):** 即使資料遺失也不會讓網站崩潰。

這樣的架構讓你的網站程式碼看起來更專業，符合軟體工程的「關注點分離」(Separation of Concerns) 原則。

---

**技術總結：**
本網站通過原生 JavaScript (Vanilla JS) 和現代 CSS3 特性，實現了兼具效能與視覺衝擊力的作品集體驗。重點在於**模組化開發**、**資料驅動內容**以及**硬體加速的視覺效果** (WebGL/Three.js, CSS Transforms)。
