# Online Job Management System

Hệ thống quản lý tuyển dụng trực tuyến được xây dựng với ASP.NET Core 8.0, Dapper, PostgreSQL và Vanilla JavaScript (SPA với Tailwind CSS).

## 🚀 Tính năng chính

### 👤 Người dùng (Candidate)
- Đăng ký, đăng nhập, quên mật khẩu
- Tìm kiếm việc làm với bộ lọc nâng cao
- Lưu việc làm yêu thích
- Quản lý hồ sơ cá nhân và CV
- Nộp đơn ứng tuyển và theo dõi trạng thái

### 🏢 Nhà tuyển dụng (Employer)
- Dashboard tổng quan thống kê
- Quản lý tin tuyển dụng (CRUD, xuất bản, tạm dừng, đóng)
- Quản lý đơn ứng tuyển (xem CV, cập nhật trạng thái)
- Quản lý hồ sơ công ty (logo, ảnh bìa, thông tin, mạng xã hội)

### 👑 Quản trị viên (Admin)
- Dashboard thống kê hệ thống
- Quản lý người dùng (khóa/mở, phân quyền)
- Quản lý công ty (xác thực)
- Quản lý việc làm (duyệt, ẩn, xóa)
- Quản lý danh mục việc làm

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | ASP.NET Core 8.0, C# 12 |
| **Database** | PostgreSQL 16 |
| **ORM** | Dapper (Micro-ORM) |
| **Auth** | ASP.NET Core Identity + JWT Bearer |
| **Validation** | FluentValidation |
| **Mapping** | AutoMapper |
| **Logging** | Serilog |
| **Testing** | xUnit, Moq, FluentAssertions |
| **Frontend** | Vanilla JS (ES6 Modules), Tailwind CSS CDN, Font Awesome |
| **Architecture** | Clean Architecture, Repository Pattern, Unit of Work |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |

## 📁 Cấu trúc dự án

```
Online Job Management System/
├── Controllers/           # API Controllers
├── Data/                  # DbContext, SeedData
├── Database/              # SQL scripts, migrations
├── DTOs/                  # Data Transfer Objects
├── Mapping/               # AutoMapper Profiles
├── Middleware/            # Custom Middlewares
├── Models/                # Domain Models
├── Repositories/          # Repository Pattern Implementation
├── Services/              # Business Logic Services
├── Validators/            # FluentValidation Validators
├── Tests/                 # Unit & Integration Tests
├── wwwroot/               # Static Files (SPA Frontend)
│   ├── index.html         # Entry point
│   ├── css/               # Custom styles
│   └── js/                # JavaScript Modules
│       ├── app.js         # Main app, router, auth
│       ├── api.js         # API client
│       ├── auth.js        # Auth state management
│       └── pages/         # Page components (23 files)
├── Dockerfile             # Multi-stage Docker build
├── docker-compose.yml     # Local development stack
└── .github/workflows/     # CI/CD Pipeline
```

## 🏃‍♂️ Khởi chạy nhanh

### Yêu cầu
- .NET 8.0 SDK
- PostgreSQL 16+ (hoặc Docker)
- Node.js (optional, cho development)

### Chạy với Docker (Khuyến nghị)

```bash
# Clone repo
git clone <repo-url>
cd "Online Job Management System"

# Khởi động stack
docker-compose up -d

# Truy cập ứng dụng
# http://localhost:8080 (HTTP)
# http://localhost:8081 (HTTPS)
```

### Chạy Local Development

```bash
# 1. Khởi động PostgreSQL
docker run -d --name postgres \
  -e POSTGRES_DB=jobportal \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine

# 2. Cập nhật connection string trong appsettings.Development.json

# 3. Chạy migration & seed
dotnet run --project "Online Job Management System.csproj"

# 4. Truy cập http://localhost:5000
```

## 🔧 Cấu hình

### Environment Variables

| Variable | Mô tả | Default |
|----------|-------|---------|
| `ASPNETCORE_ENVIRONMENT` | Môi trường chạy | `Development` |
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection string | - |
| `Jwt__Key` | JWT Secret Key (min 32 chars) | - |
| `Jwt__Issuer` | JWT Issuer | `JobPortal` |
| `Jwt__Audience` | JWT Audience | `JobPortalUsers` |

### appsettings.json example

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=jobportal;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "Key": "your-super-secret-key-with-at-least-32-characters-long",
    "Issuer": "JobPortal",
    "Audience": "JobPortalUsers"
  },
  "Serilog": {
    "Using": ["Serilog.Sinks.Console", "Serilog.Sinks.File"],
    "MinimumLevel": "Information",
    "WriteTo": [
      { "Name": "Console" },
      { "Name": "File", "Args": { "path": "logs/log-.txt", "rollingInterval": "Day" } }
    ]
  }
}
```

## 🧪 Testing

```bash
# Chạy tất cả tests
dotnet test

# Chạy với coverage
dotnet test --collect:"XPlat Code Coverage"

# Chạy test cụ thể
dotnet test --filter "FullyQualifiedName~AuthServiceTests"
```

## 🐳 Docker Commands

```bash
# Build image
docker build -t jobportal/app .

# Run container
docker run -d -p 8080:8080 \
  -e ConnectionStrings__DefaultConnection="Host=host.docker.internal;Port=5432;Database=jobportal;Username=postgres;Password=postgres" \
  -e Jwt__Key="your-secret-key" \
  jobportal/app

# View logs
docker logs -f jobportal_app
```

## 📦 CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci-cd.yml`) thực hiện:

1. **Build & Test** - Restore, Build, Run Tests, Upload Coverage
2. **Docker Build** - Multi-stage build, Push to Docker Hub (main/develop branches)
3. **Deploy Staging** - Auto deploy `develop` branch to staging
4. **Deploy Production** - Manual approval required for `main` branch

### Secrets cần thiết (GitHub Settings → Secrets)

| Secret | Mô tả |
|--------|-------|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |

## 📚 API Documentation

Swagger UI có sẵn tại: `http://localhost:8080/swagger` (Development mode)

### Main Endpoints

| Module | Base Path | Description |
|--------|-----------|-------------|
| Auth | `/api/auth` | Login, Register, Refresh Token, Forgot Password |
| Jobs | `/api/jobs` | CRUD, Search, Filter, Apply |
| Companies | `/api/companies` | CRUD, Verify, Profile |
| Applications | `/api/applications` | Apply, Update Status, Withdraw |
| Resumes | `/api/resumes` | CRUD, Set Default |
| Categories | `/api/categories` | CRUD |
| Admin | `/api/admin` | Stats, Users, Companies, Jobs, Categories Management |

## 🔐 Authentication & Authorization

### Roles
- **Candidate** - Ứng viên tìm việc
- **Employer** - Nhà tuyển dụng
- **Admin** - Quản trị viên hệ thống

### Policies
```csharp
// Trong Program.cs
options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
options.AddPolicy("EmployerOnly", p => p.RequireRole("Employer"));
options.AddPolicy("CandidateOnly", p => p.RequireRole("Candidate"));
options.AddPolicy("EmployerOrAdmin", p => p.RequireRole("Employer", "Admin"));
```

### JWT Token
```http
Authorization: Bearer <access_token>
```

## 🎨 Frontend Architecture

- **SPA Hash-based Router** - `window.location.hash` routing
- **Component-based** - Mỗi trang là 1 ES6 module (`export async function render(container)`)
- **Shared State** - `auth.js` quản lý user, token, roles
- **API Client** - `api.js` wrapper cho fetch với auto token refresh
- **UI Components** - Toast, Modal, Loading, Empty State helpers trong `app.js`
- **Responsive** - Mobile-first với Tailwind CSS

## 📝 License

MIT License - Xem [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📞 Support

- **Email**: support@jobportal.com
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Docs**: [Wiki](https://github.com/your-repo/wiki)

---

**Built with ❤️ using ASP.NET Core 8.0 & Modern Web Technologies**
