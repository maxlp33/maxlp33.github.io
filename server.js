var express = require("express");
var server = express();
var bodyParser = require("body-parser");
var fileUpload = require("express-fileupload");
var DB = require("nedb-promises");
var path = require("path");
var fs = require("fs");

// 設定視圖引擎 (用於顯示 msg.ejs，若無此檔案可忽略，主要用於 api 回傳)
server.set("view engine", 'ejs');
server.set("views", __dirname + "/view");

// 設定靜態檔案路徑
server.use(express.static(__dirname + "/Assets"));
server.use("/public", express.static(__dirname + "/public")); // 開放上傳檔案資料夾

// Middleware 設定
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(fileUpload({ limits: { fileSize: 2 * 1024 * 1024 } })); // 限制 2MB

// 初始化資料庫
var IndexDB = DB.create(__dirname + "/index.db");
var ContactDB = DB.create(__dirname + "/Contact.db");

// Seed Database if empty
IndexDB.count({}).then(count => {
    if (count === 0) {
        console.log("Projects DB is empty. Seeding from projects.json...");
        const projectsPath = path.join(__dirname, "Assets", "data", "projects.json");
        if (fs.existsSync(projectsPath)) {
            try {
                const projectsContent = fs.readFileSync(projectsPath, "utf8");
                const projects = JSON.parse(projectsContent);
                IndexDB.insert(projects).then((newDocs) => {
                    console.log(`Seeding complete. Inserted ${newDocs.length} projects.`);
                }).catch(err => {
                    console.error("Seeding failed during insert:", err);
                });
            } catch (err) {
                 console.error("Error reading or parsing projects.json:", err);
            }
        } else {
            console.error("projects.json not found at:", projectsPath);
        }
    } else {
        console.log(`DB already has ${count} projects.`);
    }
});


// 首頁路由：指向 Assets 內的 index.html
server.get("/", (req, res) => {
    res.sendFile(__dirname + "/Assets/index.html");
});

// API：取得首頁資料
server.get("/index", (req, res) => {
    IndexDB.find({}, { "_id": 0 }).then(results => {
        res.json(results);
    }).catch(err => {
        res.status(500).json({ error: "DB Error" });
    });
});

// API：查看所有聯絡訊息 (用於確認資料)
server.get("/contact", (req, res) => {
    // 找出資料庫所有資料，並且依照新增時間新->舊排序
    ContactDB.find({}).sort({ _id: -1 }).then(messages => {
        res.setHeader('Content-Type', 'application/json');
        // 以好看的縮排 (pretty print) 格式回傳
        res.send(JSON.stringify(messages, null, 2));
    }).catch(err => {
        res.status(500).json({ error: "讀取資料庫失敗" });
    });
});

// API：接收聯絡表單
server.post("/contact", async (req, res) => {
    try {
        await ContactDB.insert(req.body); // 存入資料庫
        
        // 定義 helper function
        const successScript = (msg) => `<script>alert("${msg}"); window.location.href="/#contact";</script>`;
        const errorScript = (msg) => `<script>alert("Error: ${msg}"); window.location.href="/#contact";</script>`;

        // 處理檔案上傳
        if (req.files && req.files.myFile1) {
            var upFile = req.files.myFile1;
            // 加入時間戳記，避免檔名重複被覆蓋
            var fileName = Date.now() + "_" + upFile.name;
            
            // 確保資料夾存在
            const uploadPath = path.join(__dirname, "public", "upload");
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            upFile.mv(path.join(uploadPath, fileName), function(err) {
                if (err) {
                    console.error("File Upload Error:", err);
                    res.send(errorScript("檔案上傳失敗: " + err));
                } else {
                    res.send(successScript("表單提交成功！我們已收到您的訊息與檔案"));
                }
            });
        } else {
            res.send(successScript("表單提交成功！(無檔案)"));
        }
    } catch (error) {
        console.error("Contact Form Error:", error);
        res.status(500).send(`<script>alert("Server Error: ${error.message}"); window.location.href="/#contact";</script>`);
    }
});

// 啟動伺服器
const PORT = process.env.PORT || 8080;
const http = server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
http.on('error', (e) => {
    console.error("Server Error:", e);
});
