# ⚡ Rapid Run — Online IDE

A full-featured web-based IDE with support for Java, C, C++, and Python.

## Tech Stack
- **Frontend**: React 18 + Vite + Monaco Editor
- **Backend**: Spring Boot + Spring Security + JWT (separate repo)
- **Database**: MySQL
- **Code Execution**: Judge0 CE (via RapidAPI) / Self-hosted

## Getting Started

```bash
npm install
npm run dev
```

## Features
- 🔐 User Registration & Login
- 📁 Multiple Projects per User
- 📄 Multiple Files per Project (Java, C, C++, Python)
- ✏️ Monaco Editor (same as VSCode)
- 🎨 Dark/Light theme toggle
- 📏 Resizable panels (sidebar, editor, output)
- 🔤 Font size control
- 💾 Auto-save (every 800ms of inactivity)
- 🖥️ stdin support for programs
- 🏃 Code execution via Judge0
- 🔄 Rename/Delete projects and files
- ⌨️ Ctrl+S to save, Ctrl+Enter to run