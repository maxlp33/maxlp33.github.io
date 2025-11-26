# 3D 立方體設置指南

## 你的個人化立方體

目前的立方體設置顯示你的姓名縮寫：
- **前面（Front）**: "M"  
- **後面（Back）**: "L"

### 如何自訂立方體內容

1. **修改字母內容：**
   在 `index.html` 第 47-52 行，你可以修改立方體各面的內容：
   ```html
   <div class="cube">
       <div class="cube-face front">M</div>      <!-- 前面 -->
       <div class="cube-face back">L</div>       <!-- 後面 -->
       <div class="cube-face right"></div>       <!-- 右面（目前空白） -->
       <div class="cube-face left"></div>        <!-- 左面（目前空白） -->
       <div class="cube-face top"></div>         <!-- 上面（目前空白） -->
       <div class="cube-face bottom"></div>      <!-- 下面（目前空白） -->
   </div>
   ```

2. **加上更多內容：**
   ```html
   <!-- 例如：全部面都有字母 -->
   <div class="cube-face front">M</div>
   <div class="cube-face back">L</div>
   <div class="cube-face right">A</div>
   <div class="cube-face left">X</div>
   <div class="cube-face top">⭐</div>
   <div class="cube-face bottom">🎯</div>
   ```

### 如何調整立方體樣式

在 `style.css` 中找到 `.cube-face` 並修改：

```css
.cube-face {
    /* 調整字體大小 */
    font-size: 4rem;          /* 桌面版字體 */
    
    /* 調整顏色 */
    color: #e5e5e5;
    
    /* 調整邊框 */
    border: 2px solid #e5e5e5;
    
    /* 調整背景 */
    background: rgba(229, 229, 229, 0.1);
}
```

### 動畫選項

目前使用的動畫是 `rotate`（10秒完整旋轉），你可以：

1. **調整速度：**
   ```css
   .cube {
       animation: rotate 15s infinite linear; /* 改為15秒 */
   }
   ```

2. **暫停動畫：**
   ```css
   .cube {
       animation: none; /* 停止旋轉 */
   }
   ```

3. **修改動畫方向：**
   ```css
   @keyframes rotate {
       from { transform: rotateX(0deg) rotateY(0deg); }
       to { transform: rotateX(0deg) rotateY(360deg); } /* 只Y軸旋轉 */
   }
   ```

### 顏色主題自訂

你可以建立不同顏色的立方體面：

```css
.cube-face.front { 
    color: #ff6b6b; /* 紅色 */
    border-color: #ff6b6b;
}
.cube-face.back { 
    color: #4ecdc4; /* 藍綠色 */
    border-color: #4ecdc4;
}
```

現在你的立方體會顯示 "M" 和 "L"，並且會持續旋轉！
