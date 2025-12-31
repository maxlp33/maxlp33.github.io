# 網站設計與技術解析 (Design Breakdown)

本文檔詳細解析了作品集網站的關鍵視覺效果與技術實現細節。我們使用了現代前端技術（Three.js, CSS3, ES6+）來打造沉浸式的用戶體驗。

## 1. 純 CSS 星空背景 (Pure CSS Starry Background)

背景的星空效果完全不使用圖片，而是透過 CSS 的 `radial-gradient`（徑向漸層）技術繪製，這能大幅減少載入時間並保持高解析度。

### 技術原理：
- **多重漸層堆疊**：我們在 `.starry-bg::before` 和 `::after` 偽元素上使用了多個 `radial-gradient`。每一個漸層都代表一顆星星。
- **語法解析**：
  `radial-gradient(1px 1px at 20px 30px, white, transparent)`
  - `1px 1px`：設定星星的大小。
  - `at 20px 30px`：設定星星在螢幕上的座標位置 (X, Y)。
  - `white, transparent`：從中心白色漸變到透明，創造發光感。
- **閃爍動畫**：
  使用 `@keyframes twinkle-stars` 控制透明度（opacity）從 0.5 到 1 的變化。`::after` 偽元素設定了動畫延遲（animation-delay），讓星星的閃爍頻率錯開，看起來更自然。

```css
/* style.css 範例 */
.starry-bg::before {
    background-image: 
        radial-gradient(1px 1px at 20px 30px, white, transparent),
        /* ... 數十個座標點 ... */
    background-size: 600px 300px; /* 設定重複單元的大小 */
    animation: twinkle-stars 4s ease-in-out infinite alternate;
}
```

## 2. Three.js 3D 模型檢視器 (3D Model Viewer)

首頁的核心視覺是一個互動式的 3D 模型，使用 Three.js 函式庫渲染。

### 關鍵設定：
- **攝影機 (Camera)**：
  使用 `PerspectiveCamera`，但將 **FOV (視野)** 設定為 **35**。
  - *為什麼是 35？* 標準 FOV 通常是 75，會產生廣角變形（魚眼效果）。降低 FOV 到 35 類似於攝影中的「長焦鏡頭」，能壓縮空間感，讓模型看起來更平整、更像產品攝影，減少透視變形。
- **燈光配置 (Lighting)**：
  採用類似攝影棚的打光方式：
  - `AmbientLight` (環境光)：提供基礎亮度，避免死黑。
  - `PointLight` (點光源) x3：分別作為主光 (Key Light)、補光 (Fill Light) 和輪廓光 (Rim Light)，立體呈現模型的材質細節。
- **互動控制**：
  監聽 `mousemove` 和 `touchmove` 事件。
  - **限制旋轉 (Clamping)**：使用 `Math.max` 和 `Math.min` 限制旋轉角度（例如 Y 軸限制在 ±45 度），確保使用者不會轉到模型的背面或穿幫的角度。

## 3. 故障風格載入畫面 (Glitch Loading Screen)

載入畫面採用了賽博龐克（Cyberpunk）風格的故障藝術效果。

### 實現細節：
- **文字故障 (Text Glitch)**：
  `scripts/loading.js` 中的 `glitchText()` 函式會定時執行。
  - 邏輯：有 30% 的機率觸發故障。
  - 效果：將 "LOADING" 的部分字元隨機替換為特殊符號（如 `!@#$%`），然後在 50 毫秒後極快地還原，模擬數位訊號不穩定的視覺感。
- **載入進度**：
  利用 Three.js `GLTFLoader` 的 `onProgress` 回調函式，計算 `loaded / total` 的百分比，即時更新進度條寬度。
- **CSS 動畫**：
  三條垂直的 `loading-line` 使用 `scaleY` 進行縮放動畫，並設定不同的 `animation-delay`，創造出波浪般的律動感。

## 4. 毛玻璃擬態設計 (Glassmorphism)

專案頁面（如 `project.css`）大量使用了現代 UI 趨勢——毛玻璃擬態。

### CSS 核心屬性：
- **背景模糊**：`backdrop-filter: blur(10px);`
  這是最關鍵的屬性，它會模糊元素「背後」的內容，而不是元素本身。
- **半透明背景**：`background: rgba(255, 255, 255, 0.03);`
  極低透明度的白色背景，讓模糊效果顯現出來，同時保持深色主題的質感。
- **光邊效果**：`border: 1px solid rgba(255, 255, 255, 0.1);`
  利用半透明的邊框模擬玻璃邊緣的反光，增加立體感。

## 5. 物理慣性眼球追蹤 (Physics-based Eye Tracking)

導覽列中的眼球不僅僅是跟隨滑鼠，還加入了物理慣性運算。

### 數學與物理邏輯：
- **角度計算**：使用 `Math.atan2(deltaY, deltaX)` 計算滑鼠相對於眼球中心的角度。
- **距離限制**：計算滑鼠距離，並限制瞳孔移動的最大半徑，確保瞳孔不會移出眼白範圍。
- **物理模擬**：
  當點擊眼球時，會觸發旋轉模式。這裡模擬了真實物理：
  - **角速度 (Angular Velocity)**：旋轉的速度。
  - **摩擦力 (Friction)**：每次更新時將速度乘以 0.985，讓旋轉慢慢停下來。
  - **重力 (Gravity)**：模擬鐘擺效應，讓瞳孔最終會自然地垂在下方或回到中心。

```javascript
// 物理模擬簡化邏輯
angularVelocity += restoreForce; // 加入回復力
angularVelocity *= friction;     // 摩擦力減速
currentAngle += angularVelocity; // 更新角度
```
