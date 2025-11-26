const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin credentials (use environment variables in production)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your_secure_password_here';

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://maxlp33.github.io', 'http://localhost:8080'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (your portfolio)
app.use(express.static('.'));

// Simple session storage (in production, use proper session management)
const sessions = new Map();

// Initialize SQLite Database
const db = new sqlite3.Database('./contact_messages.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        
        // Create table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            read_status BOOLEAN DEFAULT FALSE
        )`);
    }
});

// Authentication middleware
function requireAuth(req, res, next) {
    const sessionId = req.headers['x-session-id'] || req.query.session;
    
    if (!sessionId || !sessions.has(sessionId)) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    const session = sessions.get(sessionId);
    if (Date.now() > session.expires) {
        sessions.delete(sessionId);
        return res.status(401).json({ error: 'Session expired' });
    }
    
    next();
}

// Generate session ID
function generateSessionId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// API Routes

// Admin login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const sessionId = generateSessionId();
        const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        
        sessions.set(sessionId, { expires, username });
        
        res.json({ 
            success: true, 
            sessionId, 
            expires 
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
    const sessionId = req.headers['x-session-id'];
    if (sessionId) {
        sessions.delete(sessionId);
    }
    res.json({ success: true });
});

// Submit contact form (public endpoint)
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const stmt = db.prepare(`INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)`);
    stmt.run([name, email, message], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to save message' });
        }
        
        res.json({ 
            success: true, 
            message: 'Message saved successfully!',
            id: this.lastID 
        });
    });
    stmt.finalize();
});

// Get all messages (admin dashboard) - PROTECTED
app.get('/api/admin/messages', requireAuth, (req, res) => {
    db.all(`SELECT * FROM contact_messages ORDER BY timestamp DESC`, (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch messages' });
        }
        
        res.json({ messages: rows });
    });
});

// Mark message as read - PROTECTED
app.put('/api/admin/messages/:id/read', requireAuth, (req, res) => {
    const messageId = req.params.id;
    
    db.run(`UPDATE contact_messages SET read_status = TRUE WHERE id = ?`, [messageId], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to update message' });
        }
        
        res.json({ success: true });
    });
});

// Get message count - PROTECTED
app.get('/api/admin/count', requireAuth, (req, res) => {
    db.get(`SELECT COUNT(*) as total, 
                   SUM(CASE WHEN read_status = FALSE THEN 1 ELSE 0 END) as unread 
            FROM contact_messages`, (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to get count' });
        }
        
        res.json({ 
            total: row.total || 0, 
            unread: row.unread || 0 
        });
    });
});

// Serve admin dashboard - PROTECTED
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve actual admin dashboard after authentication
app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});