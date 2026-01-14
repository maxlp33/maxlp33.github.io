// GSAP �ʵe�]�w
document.addEventListener('DOMContentLoaded', function() {
    
    // ���U ScrollTrigger ����
    gsap.registerPlugin(ScrollTrigger);

    // 1. �M�ץd���ʵe
    // ����Ҧ� .project-card ����
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,          
                start: "top 85%",       
                toggleActions: "play none none reverse" 
            },
            y: 50,                     
            opacity: 0,                 
            duration: 0.8,              
            delay: index * 0.1,        
            ease: "power2.out"          
        });
    });

    // 2. �ޯ�ϼаʵe
    const skills = document.querySelectorAll('.skill-item');
    
    skills.forEach((skill, index) => {
        gsap.from(skill, {
            scrollTrigger: {
                trigger: skill,
                start: "top 90%"
            },
            scale: 0.5,                 // �q 0.5 ���j�p�}�l
            opacity: 0,
            duration: 0.5,
            delay: index * 0.1,
            ease: "back.out(1.7)"       // �ϥΦ^�u�ĪG
        });
    });

    // 3. ���D�ʵe
    const titles = document.querySelectorAll('.section-title');
    
    titles.forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 80%"
            },
            x: -30,                     // �q���� 30px ���i��
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });
});
