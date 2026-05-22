# ⚡ Team Task Manager — Ethara.AI Assignment

A full-stack Team Task Manager with role-based access control, built with **ASP.NET Core 8 (C#) + PostgreSQL + React + Tailwind CSS**.

---

## 🔗 Links

| | |
|---|---|
| **Live URL** | `https://your-app.up.railway.app` |
| **GitHub** | `https://github.com/yourusername/taskmanager` |
| **Demo Video** | `https://loom.com/your-video` |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core 8 (C#) |
| ORM | Entity Framework Core 8 |
| Database | PostgreSQL (Railway) |
| Auth | JWT Bearer Tokens |
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Deployment | Railway (backend + DB) + Vercel (frontend) |

---

## 🚀 Features

- **Authentication** — Signup/Login with JWT, role-based (Admin / Member)
- **Projects** — Admin can create, delete projects; add members
- **Tasks** — Create, assign, update status (Todo → In Progress → Done), delete (Admin only)
- **Kanban Board** — Visual 3-column board per project
- **Dashboard** — Stats: total, by status, overdue tasks highlighted
- **Role-based UI** — Admins see all controls; members see only assigned tasks

---

## ⚙️ Local Setup

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)
- PostgreSQL running locally (or Railway DB)

### Backend

```bash
cd Backend

# Copy env config
cp appsettings.json appsettings.Development.json
# Edit DefaultConnection string with your PostgreSQL credentials

# Install EF tools (once)
dotnet tool install --global dotnet-ef

# Run migrations (auto-seeds demo data)
dotnet ef migrations add InitialCreate
dotnet ef database update

# Start server (runs on http://localhost:5000)
dotnet run
```

### Frontend

```bash
cd Frontend
npm install

# Create .env.local
echo "VITE_API_URL=http://localhost:5000" > .env.local

npm run dev
# Runs on http://localhost:5173
```

---

## 🌐 Deploy to Railway (Backend)

1. Push backend folder to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add a **PostgreSQL** service in the same project
4. Set environment variables in Railway:

| Variable | Value |
|---|---|
| `ConnectionStrings__DefaultConnection` | (copy from Railway PostgreSQL service) |
| `Jwt__Secret` | any 32+ char random string |
| `Jwt__Issuer` | `TaskManagerAPI` |
| `Jwt__Audience` | `TaskManagerClient` |
| `AllowedOrigins` | your Vercel frontend URL |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

5. Railway auto-detects .NET and builds/deploys

---

## 🌐 Deploy Frontend to Vercel

```bash
# In Frontend folder
npm run build

# Or connect GitHub to vercel.com
# Set env var: VITE_API_URL = https://your-app.up.railway.app
```

---

## 📮 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | None | Register user |
| POST | `/api/auth/login` | None | Login, returns JWT |

### Projects
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/projects` | Any | List your projects |
| POST | `/api/projects` | Admin | Create project |
| GET | `/api/projects/:id` | Member | Get project details |
| POST | `/api/projects/:id/members` | Admin | Add member |
| DELETE | `/api/projects/:id` | Admin | Delete project |

### Tasks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/projects/:id/tasks` | Member | List tasks |
| POST | `/api/projects/:id/tasks` | Member | Create task |
| PATCH | `/api/tasks/:id` | Member* | Update status/fields |
| DELETE | `/api/tasks/:id` | Admin | Delete task |

*Members can only update status of their own tasks

### Dashboard
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard` | Any | Stats + overdue tasks |

---

## 🧪 Demo Credentials (pre-seeded)

| Role | Email | Password |
|---|---|---|
| Admin | admin@ethara.ai | Admin@123 |
| Member | alice@ethara.ai | Member@123 |
| Member | bob@ethara.ai | Member@123 |

---

## 📁 Project Structure

```
TaskManager/
├── Backend/
│   ├── Controllers/       # AuthController, ProjectsController, TasksController, DashboardController
│   ├── Models/            # User, Project, ProjectMember, TaskItem
│   ├── DTOs/              # Request/Response shapes
│   ├── Data/              # AppDbContext + seed
│   ├── Services/          # JwtService
│   ├── Program.cs         # App configuration
│   ├── TaskManager.csproj
│   └── appsettings.json
└── Frontend/
    ├── src/
    │   ├── context/       # AuthContext
    │   ├── pages/         # Login, Signup, Dashboard, Projects, ProjectDetail
    │   ├── components/    # Navbar
    │   ├── services/      # axios api.js
    │   └── App.jsx
    └── package.json
```
