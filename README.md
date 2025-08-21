# Personal Cloud Storage

A Dockerized **Personal Cloud Storage** project built with **Flask (backend)** and **HTML/CSS/JavaScript (frontend)**.  
It allows file upload, search/filter, folder management, and analytics for user files.

---

## 🚀 Features
- 📂 **File Upload & Management** – Upload, list, delete files.  
- 🔍 **Search & Filter** – Quickly find files by name or type.  
- 📊 **Analytics Dashboard** – Track upload stats (file types, storage usage).  
- 📁 **Folder Support** – Organize files into folders.  
- 🐳 **Dockerized** – Easily run in a container with persistent storage.  

---

## 📂 Project Structure
project-root/
│── backend/
│ ├── app.py # Main Flask app
│ ├── file_handler.py # File upload/download logic
│ ├── search_filter.py # Search & filter functionality
│ ├── analytics.py # Analytics logic
│ ├── requirements.txt # Python dependencies
│
│── frontend/
│ ├── templates/
│ │ └── index.html # Main UI
│ ├── static/
│ │ ├── script.js # Frontend logic
│ │ └── styles.css # Styling
│
│── Dockerfile # Docker build instructions
│── docker-compose.yml # Volume mounting setup
│── README.md # Project documentation

yaml
Copy
Edit

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone <your-repo-url>
cd project-root
2️⃣ Build and Run with Docker
bash
Copy
Edit
docker-compose up --build
3️⃣ Access the App
Open in your browser:
👉 http://localhost:5000

🐳 Docker Details
A single container runs both frontend + backend (Flask).

A Docker volume is mounted to persist uploaded files.

No files are lost even if the container is stopped/restarted.

📊 Future Enhancements
Multi-container setup (separate frontend + backend services).

Use Chart.js for better visualization in analytics.

User authentication and role-based access.

Cloud deployment (AWS / GCP).

📚 References
Flask Documentation

Docker Documentation

HTML5 File API
