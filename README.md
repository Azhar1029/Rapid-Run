# ⚡ Rapid Run — Web-Based Online IDE

<div align="center">

![Rapid Run](https://img.shields.io/badge/Rapid%20Run-Online%20IDE-00d4ff?style=for-the-badge&logo=lightning&logoColor=black)
![Java](https://img.shields.io/badge/Java-21-ff9f43?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-6db33f?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479a1?style=for-the-badge&logo=mysql&logoColor=white)

A full-stack, web-based Integrated Development Environment (IDE) that allows users to write, compile, and execute code directly from the browser — no installation required.

**Supports Java • C • C++ • Python**

</div>

---

## 📸 Screenshots

| Login | Dashboard | Editor |
|---|---|---|
| Dark themed login | Project management | 3-panel IDE layout |

---

## 🏗️ Project Structure

```
Rapid-Run/
├── rapid-run-frontend/          # React + Vite frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   └── editor/
│   │   │       ├── FileTree.jsx
│   │   │       ├── OutputPanel.jsx
│   │   │       └── EditorToolbar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ProjectContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── EditorPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── projectService.js
│   │   │   └── executionService.js
│   │   ├── utils/
│   │   │   └── languages.js
│   │   └── styles/
│   │       └── globals.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
└── rapid-run-backend/           # Spring Boot microservices backend
    ├── api-gateway/             # Spring Cloud Gateway (port 8080)
    ├── auth-service/            # Authentication & JWT (port 8081)
    ├── project-service/         # Project & File management (port 8082)
    ├── execution-service/       # Code execution via Judge0 (port 8083)
    └── pom.xml                  # Parent Maven POM
```

---

## ✨ Features

- 🔐 **User Authentication** — Register, Login, Logout with JWT security
- 📁 **Project Management** — Create, rename, delete multiple projects
- 📄 **Multi-File Support** — Multiple files per project (Java, C, C++, Python)
- ✏️ **Monaco Editor** — Same editor engine as Visual Studio Code
- 🎨 **Syntax Highlighting** — Language-specific highlighting for all 4 languages
- 🖥️ **3-Panel IDE Layout** — File tree, editor, and output panel
- 📐 **Resizable Panels** — Drag dividers to customize your workspace
- 🔼 **Collapsible Sidebar** — Hide/show file tree with one click
- ▶️ **Code Execution** — Real compilation and execution via Judge0 CE
- ⌨️ **Stdin Support** — Provide input for interactive programs
- 💾 **Auto-Save** — Code saved automatically after 800ms of inactivity
- 🌙 **Dark/Light Theme** — Toggle between themes instantly
- 🔤 **Font Size Control** — Adjust editor font size with A+/A- buttons
- ⌨️ **Keyboard Shortcuts** — Ctrl+S to save, Ctrl+Enter to run

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Monaco Editor | Code editor |
| React Router DOM v6 | Client-side routing |
| React Resizable Panels | Resizable IDE panels |
| Axios | HTTP client |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot 3.2.5 | Microservices framework |
| Spring Security | Authentication & authorization |
| Spring Cloud Gateway | API routing |
| Spring Data JPA | Database ORM |
| MySQL 8.x | Data persistence |
| JJWT 0.12.5 | JWT token management |
| Lombok | Boilerplate reduction |

### Code Execution
| Technology | Purpose |
|---|---|
| Judge0 CE | Code compilation & execution |

---

## 🚀 Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8.x
- Maven 3.8+

---

### 1️⃣ Database Setup

Open MySQL Workbench or CLI and run:

```sql
CREATE DATABASE IF NOT EXISTS rapidrun_auth;
CREATE DATABASE IF NOT EXISTS rapidrun_projects;
```

---

### 2️⃣ Backend Setup

Open `rapid-run-backend` in IntelliJ IDEA as a Maven project.

Update MySQL credentials in:
- `auth-service/src/main/resources/application.yml`
- `project-service/src/main/resources/application.yml`

```yaml
datasource:
  username: your_mysql_username
  password: your_mysql_password
```

Run all 4 services in IntelliJ (in this order):

| Terminal | Service | Port |
|---|---|---|
| 1 | Auth Service | 8081 |
| 2 | Project Service | 8082 |
| 3 | Execution Service | 8083 |
| 4 | API Gateway | 8080 |

Verify backend is running:
```
http://localhost:8080/api/auth/health
```
Should return: `Auth service is running`

---

### 3️⃣ Frontend Setup

```bash
cd rapid-run-frontend
npm install
npm run dev
```

Open your browser and go to:
```
http://localhost:5173
```

---

### 4️⃣ Environment Variables (Optional)

Create `.env` file in `rapid-run-frontend/`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_RAPIDAPI_KEY=
```

---

## 🌐 API Endpoints

All requests go through the API Gateway on port **8080**.

### Authentication
```
POST /api/auth/register   — Register new account
POST /api/auth/login      — Login and get JWT token
GET  /api/auth/health     — Health check
```

### Projects (🔒 Requires JWT)
```
GET    /api/projects                          — Get all projects
POST   /api/projects                          — Create project
PUT    /api/projects/{id}                     — Rename project
DELETE /api/projects/{id}                     — Delete project
```

### Files (🔒 Requires JWT)
```
POST   /api/projects/{id}/files               — Create file
PUT    /api/projects/{id}/files/{fid}         — Rename file
PATCH  /api/projects/{id}/files/{fid}/code    — Save code
DELETE /api/projects/{id}/files/{fid}         — Delete file
```

### Execution (🔒 Requires JWT)
```
POST /api/execute   — Execute code { code, language, stdin }
```

---

## 🔒 Security

- Passwords hashed with **BCrypt**
- Stateless authentication using **JWT tokens**
- Tokens expire after **24 hours**
- All project/file endpoints protected — users can only access their own data
- Sensitive configuration stored as **environment variables**
- CORS configured to allow only frontend origin

---

## 📋 Supported Languages

| Language | Extension | Judge0 ID |
|---|---|---|
| Java | `.java` | 62 |
| C | `.c` | 50 |
| C++ | `.cpp` | 54 |
| Python | `.py` | 71 |

---

## 🏛️ Architecture

```
React Frontend (port 5173)
         ↓
API Gateway (port 8080)
         ↓
┌────────────────────────────────┐
│  Auth Service      (port 8081) │ → MySQL (rapidrun_auth)
│  Project Service   (port 8082) │ → MySQL (rapidrun_projects)
│  Execution Service (port 8083) │ → Judge0 CE API
└────────────────────────────────┘
```

---

## 👨‍💻 Developer

**Mohammad Azhar Ansari**
BCA Student — IGNOU (Enrollment: 2400303031)

---

## 📄 License

This project is developed as a BCA final year project at IGNOU, New Delhi.

---

<div align="center">
Made with ❤️ by Mohammad Azhar Ansari
</div>
