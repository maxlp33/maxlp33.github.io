// Eye cursor tracking with physics (moved from index.html)
// Wrapped in DOMContentLoaded to ensure DOM elements exist
document.addEventListener('DOMContentLoaded', () => {
    const eye = document.querySelector('.eye');
    const pupil = document.querySelector('.pupil');
    
    if (eye && pupil) {
        let pupilX = 0;
        let pupilY = 0;
        let angularVelocity = 0;
        let currentAngle = 0;
        let currentRadius = 0;
        let isSpinning = false;
        let isFollowingCursor = true;
        let isMouseOverEye = false;
        let spinTimeout;
        let animationFrame;
        
        const friction = 0.985;
        const gravity = 0.12;
        const spinForce = 15;
        const maxDistanceFromCenter = 25;
        const cursorFollowBoundary = 15;
        const pendulumThreshold = 3;
        
        function updatePupilPosition() {
            if (isSpinning) {
                if (Math.abs(angularVelocity) > pendulumThreshold) {
                    angularVelocity *= friction;
                    currentAngle += angularVelocity;
                    currentRadius = Math.max(currentRadius * 0.999, maxDistanceFromCenter * 0.8);
                } else {
                    const restoreForce = Math.sin(currentAngle + Math.PI / 2) * gravity;
                    angularVelocity += restoreForce;
                    angularVelocity *= friction;
                    currentAngle += angularVelocity;
                    currentRadius *= 0.995;
                }

                pupilX = Math.cos(currentAngle) * currentRadius;
                pupilY = Math.sin(currentAngle) * currentRadius;

                // keep the CSS centering (-50%,-50%) and offset by pixels
                pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;

                if (Math.abs(angularVelocity) < 0.001 && currentRadius < 3) {
                    // restore to perfectly centered when spin ends
                    pupilX = 0;
                    pupilY = 0;
                    pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;

                    clearTimeout(spinTimeout);
                    spinTimeout = setTimeout(() => {
                        isSpinning = false;
                        isFollowingCursor = true;
                        angularVelocity = 0;
                    }, 1000);

                    return;
                }

                animationFrame = requestAnimationFrame(updatePupilPosition);
            }
        }
        
        function startSpin() {
            isFollowingCursor = false;
            currentAngle = -Math.PI / 2;
            currentRadius = maxDistanceFromCenter;
            
            pupilX = Math.cos(currentAngle) * currentRadius;
            pupilY = Math.sin(currentAngle) * currentRadius;
            // ensure transform preserves centering
            pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
            
            const spinDirection = Math.random() > 0.5 ? 1 : -1;
            angularVelocity = spinDirection * spinForce * 0.6;
            
            isSpinning = true;
            
            clearTimeout(spinTimeout);
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            
            updatePupilPosition();
        }
        
        eye.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            startSpin();
        });
        
        eye.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!isSpinning) {
                startSpin();
            }
        });
        
        eye.addEventListener('mouseenter', function() {
            isMouseOverEye = true;
        });
        
        eye.addEventListener('mouseleave', function() {
            isMouseOverEye = false;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isFollowingCursor || isSpinning) return;
            // allow following even when mouse is over the eye element
            
            const eyeRect = eye.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;
            
            const deltaX = e.clientX - eyeCenterX;
            const deltaY = e.clientY - eyeCenterY;
            
            // small deadzone to avoid sub-pixel offsets when cursor is nearly centered
            const deadzone = 4; // pixels
            if (Math.abs(deltaX) < deadzone && Math.abs(deltaY) < deadzone) {
                pupilX = 0;
                pupilY = 0;
                pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
                return;
            }
            
            const angle = Math.atan2(deltaY, deltaX);
            const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 10, cursorFollowBoundary);
            
            pupilX = Math.cos(angle) * distance;
            pupilY = Math.sin(angle) * distance;
            
            // preserve CSS centering when moving the pupil
            pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
        });
    }
});
