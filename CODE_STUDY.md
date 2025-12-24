# 網站程式碼讀書筆記（給作業測驗用）


## 檔案總覽

- 網頁：`index.html`（含數段內嵌 script）
- scripts/
  - `loading.js`
  - `language.js`
  - `slider.js`
  - `contact.js`
  - `eye.js`
  - `three-scene.js` (type=module, 使用 three.js)
  - `enhancements.js` (額外互動效果)

---

## 1. index.html（內嵌 script）

### 功能：基本互動與入場動畫
頁面底部有幾段輕量的 script，負責 Mobile 選單、Navbar 滾動效果、平滑滾動與簡易入場動畫。

#### A. Mobile Menu Toggle
```javascript
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});
```
- **解釋**：點擊漢堡選單按鈕時，切換選單的 `active` class。CSS 會根據這個 class 顯示或隱藏選單。
- **考點**：為什麼用 `classList.toggle`？因為它能自動判斷：有就移除，沒有就加入，適合做開關。

#### B. Navbar Scroll Effect
```javascript
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
```
- **解釋**：監聽視窗滾動。當滾動超過 100px 時，給導覽列加上 `scrolled` 樣式（通常是變深色背景或加陰影），增加閱讀性。

#### C. Intersection Observer (進場動畫)
```javascript
const observerOptions = {
    threshold: 0.1, // 元素出現 10% 時觸發
    rootMargin: '0px 0px -100px 0px' // 視窗底部內縮 100px 處為觸發線
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.about, .projects, .contact').forEach(el => {
    // 初始狀態：透明且下移
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
```
- **解釋**：這是一種效能較好的滾動偵測方式。一開始把區塊隱藏並下移，當區塊進入視窗（Intersecting）時，透過 CSS transition 還原位置與透明度，產生「浮現」效果。
- **考點**：為什麼不用 `scroll` 事件做這個？`scroll` 事件觸發頻率極高，計算量大；`IntersectionObserver` 是瀏覽器優化過的 API，效能更好。

---

## 2. scripts/loading.js

### 功能：載入畫面與文字故障效果
控制全螢幕載入遮罩，並製作 Cyberpunk 風格的文字閃爍特效。

#### A. Glitch Text Effect
```javascript
function glitchText() {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    const originalText = loadingText.dataset.text || 'LOADING';
    
    // 70% 機率觸發閃爍
    if (Math.random() > 0.7) {
        let glitched = '';
        for (let i = 0; i < originalText.length; i++) {
            // 每個字元有 20% 機率變亂碼
            if (Math.random() > 0.8) {
                glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitched += originalText[i];
            }
        }
        loadingText.textContent = glitched;
        
        // 50ms 後還原，產生短暫閃爍感
        setTimeout(() => {
            loadingText.textContent = originalText;
        }, 50);
    }
}
setInterval(glitchText, 100);
```
- **解釋**：透過定時器不斷隨機替換文字內容，製造數位故障（Glitch）的視覺風格。

#### B. 全域控制函式
```javascript
window.updateLoadingProgress = function(percent) {
    if (loadingBar) {
        loadingBar.style.width = percent + '%';
    }
};

window.hideLoadingScreen = function() {
    if (loadingBar) loadingBar.style.width = '100%';
    setTimeout(() => {
        clearInterval(glitchInterval); // 停止閃爍運算，節省效能
        if (loadingScreen) loadingScreen.classList.add('hidden');
    }, 500);
};
```
- **解釋**：這兩個函式掛載在 `window` 物件上，是為了讓其他模組（如 `three-scene.js`）可以呼叫它們。
- **考點**：為什麼要掛在 `window`？因為 `three-scene.js` 是 module (`type="module"`)，有自己的作用域，無法直接存取 `loading.js` 的變數，透過 `window` 全域物件溝通是最簡單的方法。

---

## 3. scripts/language.js

### 功能：中英文切換
不依賴後端，純前端透過 `data-attribute` 替換文字。

#### 核心邏輯
```javascript
const translations = {
    zh: { name: 'Max Liu', currentLang: '中文' },
    en: { name: 'Max Liu', currentLang: 'English' }
};

function switchLanguage(lang) {
    currentLanguage = lang;
    
    // 1. 更新 Hero 標題
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && translations[lang]) {
        heroTitle.textContent = translations[lang].name;
    }
    
    // 2. 更新所有帶有 data-zh / data-en 的元素
    const elementsToTranslate = document.querySelectorAll('[data-zh][data-en]');
    elementsToTranslate.forEach(element => {
        if (lang === 'zh') {
            element.textContent = element.getAttribute('data-zh');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });
}
```
- **解釋**：HTML 中預先寫好 `<p data-zh="你好" data-en="Hello">Hello</p>`，JS 負責讀取對應屬性並塞回 `textContent`。
- **優點**：簡單、直觀，適合小型靜態網站。
- **缺點**：文字量大時 HTML 會變很雜，維護困難。

---

## 4. scripts/slider.js

### 功能：作品集輪播 (Slider)
自製的輪播功能，支援滑鼠拖曳、觸控滑動、鍵盤方向鍵與點擊切換。

#### A. 立即函式 (IIFE)
```javascript
(() => {
  // ... 程式碼 ...
})();
```
- **解釋**：使用 `(() => { ... })();` 包裹程式碼，避免變數（如 `current`, `cards`）汙染全域環境。

#### B. 核心切換邏輯
```javascript
function center(i) {
    const card = cards[i];
    // 判斷手機版還是桌面版
    const axis = isMobile() ? "top" : "left";
    const size = isMobile() ? "clientHeight" : "clientWidth";
    const start = isMobile() ? card.offsetTop : card.offsetLeft;
    
    // 計算置中位置：卡片起始點 - (容器一半 - 卡片一半)
    wrap.scrollTo({
      [axis]: start - (wrap[size] / 2 - card[size] / 2),
      behavior: "smooth",
    });
}
```
- **解釋**：這是讓當前卡片永遠置中的數學公式。`wrap[size]/2` 是視窗中心，`card[size]/2` 是卡片中心，兩者相減就是修正量。

#### C. 觸控滑動 (Swipe)
```javascript
track.addEventListener("touchstart", (e) => {
    sx = e.touches[0].clientX; // 紀錄起始點
});

track.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - sx; // 計算位移
    if (Math.abs(dx) > 60) // 如果滑動超過 60px
        go(dx > 0 ? -1 : 1); // 判斷方向並切換
});
```
- **解釋**：實作基本的 Touch Event，讓手機使用者能滑動切換。

---

## 5. scripts/three-scene.js

### 功能：3D 模型展示
使用 Three.js 載入並渲染 GLB 模型，包含燈光與互動旋轉。

#### A. 場景設定
```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
// 透視攝影機：視角 35度
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
// WebGL 渲染器：alpha: true 代表背景透明
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
```

#### B. 模型載入與處理
```javascript
loader.load('models/scene.glb', (gltf) => {
    model = gltf.scene;
    model.scale.set(150, 150, 150); // 放大模型
    
    // 自動置中模型
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center); // 將模型位置減去中心點偏移量
    
    scene.add(model);
    if (window.hideLoadingScreen) window.hideLoadingScreen(); // 載入完成，隱藏 Loading
});
```
- **考點**：為什麼要 `model.position.sub(center)`？
  - 因為 3D 模型製作時原點（Origin）可能不在幾何中心，這行程式碼能強制把模型幾何中心移到世界座標 (0,0,0)，旋轉時才不會歪一邊。

#### C. 互動旋轉 (限制角度)
```javascript
canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.x;
    
    // 累加旋轉量
    targetRotationY += deltaX * 0.01;
    
    // 限制角度 (Clamp)：不讓它轉超過 45度 (maxRotationY)
    targetRotationY = Math.max(-maxRotationY, Math.min(maxRotationY, targetRotationY));
    
    model.rotation.y = targetRotationY;
});
```
- **解釋**：透過 `Math.max` 和 `Math.min` 夾住數值，實現「可互動但有範圍限制」的效果，避免使用者轉到模型背面或穿幫視角。

---

## 6. scripts/eye.js

### 功能：物理眼球互動
讓眼球跟隨滑鼠，並在點擊時產生帶有物理慣性的旋轉。

#### 物理模擬迴圈
```javascript
function updatePupilPosition() {
    if (isSpinning) {
        // 鐘擺物理模擬
        const restoreForce = Math.sin(currentAngle + Math.PI / 2) * gravity; // 回復力
        angularVelocity += restoreForce; // 速度受力影響
        angularVelocity *= friction;     // 速度受摩擦力衰減 (0.985)
        currentAngle += angularVelocity; // 更新角度
        
        // ... 更新 DOM 位置 ...
        
        requestAnimationFrame(updatePupilPosition); // 下一幀繼續
    }
}
```
- **解釋**：這是一個簡易的物理引擎。
  - **Gravity (重力)**：讓眼球傾向回到下方。
  - **Friction (摩擦力)**：讓旋轉慢慢停下來。
  - **Velocity (速度)**：持續累加位置。
- **考點**：`requestAnimationFrame` 是什麼？它是瀏覽器專門用來做動畫的 API，會配合螢幕更新率（通常 60fps）執行，比 `setInterval` 更順暢且省電。

---

## 7. scripts/enhancements.js

### 功能：視覺強化
包含滾動顯現、點擊火花、視差滾動等細節。

#### A. 點擊火花 (Sparks)
```javascript
function createEnhancedSparks(x, y) {
    for (let i = 0; i < 6; i++) {
        const spark = document.createElement('div');
        // ... 設定樣式與動畫 ...
        document.body.appendChild(spark);
        
        // 1秒後移除 DOM，避免記憶體洩漏
        setTimeout(() => {
            spark.remove();
        }, 1000);
    }
}
```
- **解釋**：動態產生 DOM 元素做特效。重點是一定要記得 `remove()`，否則點擊幾千次後網頁會變卡。

#### B. 視差滾動 (Parallax)
```javascript
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (hero && scrolled < window.innerHeight) {
        // 背景移動速度較慢 (0.2)，內容移動速度較快或反向 (-0.1)
        hero.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});
```
- **解釋**：視差滾動原理就是「不同層的元素移動速度不同」，製造出深度的錯覺。

---

## 8. scripts/contact.js

### 功能：文字分割動畫
將文字拆解成單一字母，以便 CSS 可以對每個字母做動畫。

```javascript
const text = link.textContent.trim();
link.textContent = ''; // 清空原本文字

text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.setProperty('--char', i); // 設定 CSS 變數，讓 CSS 可以用 var(--char) 計算延遲
    link.appendChild(span);
});
```
- **解釋**：這是一種常見的文字特效前置處理。CSS 可以利用 `transition-delay: calc(var(--char) * 0.05s)` 來讓字母一個接一個動起來。

---

## 9. 其他 CSS 檔案說明

除了 `style.css`，專案中還有幾個功能性的 CSS 檔案，負責特定的視覺效果。

### A. splash.css (開場與背景)
```css
.splash-section {
    width: 100%;
    height: 100vh;
    /* ... */
    background: transparent; /* 讓 Canvas 可以透出來 */
}
```
- **功能**：定義全螢幕的開場區塊，並確保背景透明，讓 Three.js 的 Canvas 能在後方顯示。

### B. animations.css (微互動)
```css
.skill-item:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}
```
- **功能**：定義滑鼠懸停 (Hover) 時的微動畫，如卡片浮起、按鈕縮放等，增加網站的精緻度。

### C. slider.css (輪播樣式)
- **功能**：專門負責作品集輪播 (Slider) 的排版。包含卡片的尺寸、間距，以及在手機版轉為垂直排列的 RWD 設定。

### D. contact.css (聯絡區塊)
- **功能**：定義頁尾聯絡區塊的特殊排版（如圓形排列或特殊字體效果）。

---

## 總結與準備建議

### 老師可能會問的 Top 3 問題：

1.  **「你的 3D 模型是怎麼載入的？載入很久怎麼辦？」**
    -   **答**：使用 `three.js` 的 `GLTFLoader`。為了處理載入時間，我寫了 `loading.js`，利用 `onProgress` callback 取得百分比並更新畫面上的進度條，載入完成 (`onLoad`) 才隱藏遮罩。

2.  **「為什麼有些動畫用 CSS，有些用 JS？」**
    -   **答**：簡單的過場（如 hover, opacity）用 CSS `transition` 效能最好。複雜的邏輯（如眼球物理、視差滾動、輪播計算）CSS 做不到，所以用 JS。

3.  **「你的網站怎麼做 RWD（響應式）？」**
    -   **答**：CSS 使用 `@media` query 調整排版。JS 部分（如 `slider.js`）使用 `matchMedia` 偵測螢幕寬度，在手機版改為垂直滑動，桌面版為水平滑動。

### 程式碼結構圖
```
index.html
├── style.css (視覺樣式)
└── scripts/
    ├── loading.js (負責開場)
    ├── three-scene.js (負責 3D 背景)
    ├── language.js (負責翻譯)
    ├── slider.js (負責作品輪播)
    ├── eye.js (負責小眼睛互動)
    └── enhancements.js (負責特效)
```

