// Database Service - Simulating a Data Access Layer
// 這種寫法稱為 "Repository Pattern" (檔案庫模式)，專門用來管理資料存取
// 讓你的程式碼看起來更有架構，不像只是單純的 "讀檔"

class Database {
    constructor() {
        this.projectsUrl = 'data/projects.json';
        this.detailsUrl = 'data/project_details.json';
        this._cache = null; // 簡單的快取機制
    }

    // 模擬資料庫連線與查詢 (Query)
    async connect() {
        if (this._cache) return this._cache;
        
        try {
            // 模擬異步資料庫請求
            const response = await fetch(this.projectsUrl);
            const data = await response.json();
            this._cache = data;
            console.log('📦 Database simulated connection established.');
            return data;
        } catch (error) {
            console.error('Database Connection Error:', error);
            return [];
        }
    }

    // SELECT * FROM projects
    async getAllProjects() {
        return await this.connect();
    }

    // SELECT * FROM projects WHERE id = ?
    async getProjectById(id) {
        const projects = await this.connect();
        return projects.find(p => p.id === id);
    }

    // SELECT * FROM projects ORDER BY date DESC
    async getProjectsSortedByDate() {
        const projects = await this.connect();
        return [...projects].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

// 匯出單例模式 (Singleton) 的資料庫實例
const db = new Database();
window.DB = db; // 掛載到全域變數，方便在 Console 測試
