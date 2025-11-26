// Database-enabled contact form (for when backend is deployed)
// This will replace the simple mailto version

// Auto-detect if we're running locally or with deployed backend
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://your-railway-app.railway.app'; // Replace with your Railway URL

// Enhanced contact form with database support
function setupDatabaseContactForm() {
    document.getElementById('contactForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        const statusDiv = document.getElementById('formStatus');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        // Show loading state
        statusDiv.innerHTML = '<div style="color: #4a9eff;">Sending message...</div>';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                statusDiv.innerHTML = '<div style="color: #4ade80; padding: 10px; background: rgba(74, 222, 128, 0.1); border-radius: 5px; margin-top: 10px;">✅ Message sent successfully! I\'ll get back to you soon.</div>';
                e.target.reset();
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (error) {
            // Fallback to mailto if backend is not available
            console.log('Database backend not available, falling back to mailto');
            const name = data.name;
            const email = data.email;
            const message = data.message;
            
            const subject = `Portfolio Contact from ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            const mailtoLink = `mailto:your.email@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            window.location.href = mailtoLink;
            statusDiv.innerHTML = '<div style="color: #ffc107; padding: 10px; background: rgba(255, 193, 7, 0.1); border-radius: 5px; margin-top: 10px;">📧 Email client opened! Please send the email to complete your message.</div>';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = currentLanguage === 'zh' ? '發送訊息' : 'Send Message';
        }
    });
}