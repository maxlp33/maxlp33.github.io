// Contact section text splitting animation using GSAP
document.addEventListener('DOMContentLoaded', () => {
    
    // 選取所有需要拆分文字的連結
    const splitLinks = document.querySelectorAll('.contact-nav a.split');
    
    splitLinks.forEach(link => {
        // 1. 取得原有文字
        const text = link.textContent.trim();
        link.textContent = '';
        
        // 2. 將每個字元包裝成 span
        text.split('').forEach((char) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block'; // 必須設定為 inline-block 才能變形
            link.appendChild(span);
        });

        // 3. 設定滑鼠懸停動畫
        const chars = link.querySelectorAll('span');
        
        link.addEventListener('mouseenter', () => {
            gsap.to(chars, {
                y: -5,
                stagger: 0.05, // 每個字元間隔 0.05 秒
                duration: 0.3,
                ease: "power2.out"
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(chars, {
                y: 0,
                stagger: 0.05,
                duration: 0.3,
                ease: "power2.in"
            });
        });
    });
});

