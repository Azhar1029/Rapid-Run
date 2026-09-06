# ⚡ Rapid Run — Spring Boot Backend

## Services & Ports
| Service           | Port | Database            |
|-------------------|------|---------------------|
| API Gateway       | 8080 | —                   |
| Auth Service      | 8081 | rapidrun_auth       |
| Project Service   | 8082 | rapidrun_projects   |
| Execution Service | 8083 | —                   |

## Prerequisites
- Java 21
- Maven 3.8+
- MySQL 8.x running on localhost:3306

## MySQL Setup
Run this in MySQL Workbench or CLI:
```sql
CREATE DATABASE IF NOT EXISTS rapidrun_auth;
CREATE DATABASE IF NOT EXISTS rapidrun_projects;
```

## ⚠️ IMPORTANT — Update your MySQL password
In both files below, change `password: root` to your actual MySQL password:
- `auth-service/src/main/resources/application.yml`
- `project-service/src/main/resources/application.yml`

## Running All Services
Open 4 separate terminals and run one command in each:

### Terminal 1 — Auth Service
```
cd auth-service
mvn spring-boot:run
```

### Terminal 2 — Project Service
```
cd project-service
mvn spring-boot:run
```

### Terminal 3 — Execution Service
```
cd execution-service
mvn spring-boot:run
```

### Terminal 4 — API Gateway (start last)
```
cd api-gateway
mvn spring-boot:run
```

## Verify Services Are Running
- Auth:      http://localhost:8081/api/auth/health
- Gateway:   http://localhost:8080/api/auth/health

## Code Execution (Judge0)
1. Go to https://rapidapi.com/judge0-official/api/judge0-ce
2. Sign up for a free account
3. Copy your RapidAPI key
4. Set environment variable before running execution-service:
   - Windows: `set JUDGE0_API_KEY=your_key_here`
   - Then: `mvn spring-boot:run`

## API Endpoints (all via Gateway on port 8080)

### Auth
- POST /api/auth/register  — { name, email, password }
- POST /api/auth/login     — { email, password }

### Projects (requires Bearer token)
- GET    /api/projects
- POST   /api/projects              — { name }
- PUT    /api/projects/{id}         — { name }
- DELETE /api/projects/{id}

### Files (requires Bearer token)
- POST   /api/projects/{id}/files              — { name, language }
- PUT    /api/projects/{id}/files/{fid}        — { name }
- PATCH  /api/projects/{id}/files/{fid}/code   — { code }
- DELETE /api/projects/{id}/files/{fid}

### Execute (requires Bearer token)
- POST /api/execute  — { code, language, stdin }
