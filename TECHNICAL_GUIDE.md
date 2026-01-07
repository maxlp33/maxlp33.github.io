# Website Technical Implementation Guide

This guide explains the technical implementation of key visual effects and interactive features in the portfolio website. It is intended for developers or maintainers looking to understand how specific looks were achieved.

## 1. Hybrid Starry Background System

The starry background effect uses a hybrid approach: **CSS Gradients** for the base layer (performance) and **JavaScript Generation** for dynamic depth (on specific pages).

### A. CSS Implementation (Base Layer)
*   **File:** `style.css`
*   **Class:** `.starry-bg`

The base infinite star field is created without a single image file or complex canvas render. It uses multiple CSS `radial-gradient` layers on `::before` and `::after` pseudo-elements.

```css
/* style.css lines 185-207 */
.starry-bg::before,
.starry-bg::after {
    background-image: 
        radial-gradient(1px 1px at 20px 30px, white, transparent),
        radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
        /* ... dozens of coordinates ... */
    background-size: 600px 300px; /* Repeats the pattern */
    animation: twinkle-stars 4s ease-in-out infinite alternate;
}
```

**Why use `::before` and `::after`?**
In CSS, these are *pseudo-elements*. They allow us to create two "virtual" layers inside the `.starry-bg` div without writing extra HTML code.
*   **`::before` Layer:** Creates the first pattern of stars.
*   **`::after` Layer:** Creates a second, overlapping pattern. Crucially, it has a different **animation-delay** and **opacity** (see `style.css` line 210).
**Result:** By layering these two patterns and animating them out of sync, we create a complex, non-repetitive twinkling effect using only a single HTML element.

### B. JavaScript Implementation (Dynamic Particles)
*   **Used In:** Project Detail Pages (e.g., `project-mech.html`)
*   **Method:** `createStar()`

On detail pages, individual DOM nodes are generated to add parallax depth and varying speeds.

```javascript
function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Randomized Size
    if (Math.random() > 0.8) star.classList.add('large');
    
    // Randomized Position & Speed
    star.style.left = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    
    document.getElementById('starry-bg').appendChild(star);
}
```

## 2. 3D Hero Scene (Three.js)

The interactive 3D model on the homepage is rendered using **Three.js**.

*   **File:** `scripts/three-scene.js`
*   **Model Format:** `.glb` (GL Transmission Format) - efficient for web.

### Key Configuration
The scene uses a transparent background (`alpha: true`) to blend seamlessly with the CSS starry background.

```javascript
// scripts/three-scene.js
const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true,           // Critical for transparency
    antialias: true 
});
renderer.setClearColor(0x000000, 0); // 0 alpha value
```

### Lighting Setup
A 3-point lighting setup is used to highlight the model structure:
1.  **Ambient Light**: General fill.
2.  **Point Lights**: Positioned at `(10, 10, 10)` and `(-10, -10, 10)` to create rim lighting and definition.

## 3. Glassmorphism UI (Frosted Glass)

The modern, translucent UI look is achieved using the CSS `backdrop-filter` property. This creates a blur effect on the content *behind* the element, mimicking frosted glass.

*   **Files:** `style.css`, `project.css`
*   **Properties:**

```css
.navbar, .project-card, .overlay {
    background: rgba(255, 255, 255, 0.05); /* Very low opacity white */
    backdrop-filter: blur(10px);           /* The blur magic */
    border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle edge definition */
}
```

**Note:** The `.navbar` uses a slightly darker gradient (`rgba(255, 255, 255, 0.03)`) to maintain legibility while keeping the header unobtrusive.

## 4. Scroll Animations (Intersection Observer)

Instead of listening to the heavy `scroll` event, the site uses the **Intersection Observer API** for performance-friendly "reveal on scroll" animations.

*   **File:** `scripts/enhancements.js`

```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed'); // Triggers CSS transition
        }
    });
});
```

Elements start with `opacity: 0` and `transform: translateY(30px)`. When the class `.revealed` is added by JS, CSS transitions smoothly animate them to their final position.

## 5. Dynamic Data Loading

To separate content from structure, project data is stored in JSON files.

*   **Data Source:** `data/projects.json` & `data/project_details.json`
*   **Loader:** `scripts/projects.js` & `scripts/project-detail.js`

This allows adding new portfolio pieces solely by editing the JSON file, without touching HTML code.

```javascript
// Example Data Structure
{
    "id": "mech",
    "title": "Heavy Assault Mech",
    "images": ["img/projects/mech/mech1.jpg", ...],
    "specs": {
        "polys": "45k",
        "software": "Maya, Substance"
    }
}
```

## 6. Interactive "Eye" Cursor Follower

The navigation bar contains a procedural eye animation that tracks the cursor.

*   **File:** `scripts/eye.js`

It calculates the angle between the eye's center and the mouse coordinates using `Math.atan2`, then applies a CSS rotation and translation to the pupil element.

```javascript
const angle = Math.atan2(e.pageY - eyeY, e.pageX - eyeX);
const rotate = angle * (180 / Math.PI) * -1 + 270;
eye.style.transform = `rotate(${rotate}deg)`;
```
