# Backend Setup for Local Development

This folder contains the Node.js backend for the contact form system with database storage. 

## 🚨 Important Notes

- **GitHub Pages doesn't support Node.js** - This backend is for local development only
- The main portfolio uses a simple mailto contact form for GitHub Pages compatibility
- This backend can be deployed separately to services like Heroku, Railway, or Vercel

## 🛠️ Local Development Setup

### Prerequisites
- Node.js installed on your system

### Installation
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **IMPORTANT: Change the admin credentials in `server.js`:**
   ```javascript
   const ADMIN_USERNAME = 'your_username';
   const ADMIN_PASSWORD = 'your_secure_password';
   ```

4. Start the server:
   ```bash
   node server.js
   ```

5. Access the application:
   - Portfolio: http://localhost:3000
   - Admin Login: http://localhost:3000/admin
   - Admin Dashboard: http://localhost:3000/admin/dashboard (after login)

## 📊 Features

- **SQLite Database** - Stores contact form submissions
- **Admin Authentication** - Protected dashboard access
- **Session Management** - 24-hour login sessions
- **Real-time Dashboard** - View/manage contact messages
- **Export Functionality** - Download messages as JSON

## 🚀 Deployment Options

To make the database contact form work online, deploy the backend to:

### Option 1: Railway.app (Recommended)
1. Create account at railway.app
2. Connect GitHub repo
3. Deploy from `/backend` folder
4. Update frontend to point to Railway URL

### Option 2: Heroku
1. Create Heroku app
2. Deploy backend code
3. Use Heroku Postgres for database
4. Update frontend URLs

### Option 3: Vercel
1. Deploy backend as Vercel functions
2. Use Vercel's database solutions
3. Update API endpoints

## 🔧 File Structure

```
backend/
├── server.js          # Main Express server
├── admin.html         # Admin dashboard
├── login.html         # Admin login page
├── package.json       # Dependencies
├── contact_messages.db # SQLite database (created automatically)
└── node_modules/      # Installed packages
```

## 📝 API Endpoints

- `POST /api/contact` - Submit contact form
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/messages` - Get all messages (protected)
- `PUT /api/admin/messages/:id/read` - Mark message as read (protected)
- `GET /api/admin/count` - Get message statistics (protected)

## 🛡️ Security

- Admin routes are protected with session authentication
- Sessions expire after 24 hours
- Passwords should be changed from defaults
- Consider using environment variables for credentials in production