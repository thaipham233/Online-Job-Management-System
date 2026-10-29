// Admin Dashboard View - Bảng điều khiển quản trị
class JobHubAdminView {
    constructor() {
        this.stats = {
            users: { total: 0, candidates: 0, employers: 0, admins: 0 },
            companies: { total: 0, verified: 0, pending: 0 },
            jobs: { total: 0, open: 0, closed: 0, draft: 0 },
            applications: { total: 0, pending: 0, processed: 0 }
        };
    }

    async render() {
        return `
            <div class="admin-dashboard">
                <!-- Page header -->
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-cog text-primary"></i> Bảng điều khiển Admin
                    </h1>
                    <div class="page-header-actions">
                        <a href="#/admin/users" class="btn btn-outline btn-sm">
                            <i class="fas fa-users"></i> Quản lý người dùng
                        </a>
                        <a href="#/admin/jobs" class="btn btn-outline btn-sm">
                            <i class="fas fa-list"></i> Quản lý việc làm
                        </a>
                        <a href="#/admin/companies" class="btn btn-outline btn-sm">
                            <i class="fas fa-building"></i> Quản lý công ty
                        </a>
                    </div>
                </div>

                <!-- Stats -->
                <div class="stats-grid">
                    <div class="stat-card card">
                        <div class="stat-icon bg-blue-100">
                            <i class="fas fa-users text-blue-600"></i>
                        </div>
                        <div class="stat-body">
                            <h3 class="stat-value">${this.stats.users.total}</h3>
                            <p class="stat-label">Tổng người dùng</p>
                            <span class="stat-change text-success">
                                <i class="fas fa-arrow-up"></i> +${this.stats.users.candidates + this.stats.users.employers + this.stats.users.admins}
                            </span>
                        </div>
                    </div>
                    <div class="stat-card card">
                        <div class="stat-icon bg-green-100">
                            <i class="fas fa-briefcase text-green-600"></i>
                        </div>
                        <div class="stat-body">
                            <h3 class="stat-value">${this.stats.companies.total}</h3>
                            <p class="stat-label">Công ty đã đăng ký</p>
                            <span class="stat-change text-warning">
                                <i class="fas fa-clock"></i> ${this.stats.companies.verified} đã xác minh
                            </span>
                        </div>
                    </div>
                    <div class="stat-card card">
                        <div class="stat-icon bg-yellow-100">
                            <i class="fas fa-briefcase text-yellow-600"></i>
                        </div>
                        <div class="stat-body">
                            <h3 class="stat-value">${this.stats.jobs.total}</h3>
                            <p class="stat-label">Tổng việc làm</p>
                            <span class="stat-change text-info">
                                <i class="fas fa-ellipsis-h"></i> ${this.stats.jobs.open} đang công khai
                            </span>
                        </div>
                    </div>
                    <div class="stat-card card">
                        <div class="stat-icon bg-purple-100">
                            <i class="fas fa-file-alt text-purple-600"></i>
                        </div>
                        <div class="stat-body">
                            <h3 class="stat-value">${this.stats.applications.total}</h3>
                            <p class="stat-label">Đơn ứng tuyển</p>
                            <span class="stat-change text-success">
                                <i class="fas fa-check-circle"></i> ${this.stats.applications.processed} đã xử lý
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Quick actions -->
                <div class="quick-actions">
                    <div class="card">
                        <div class="card-body">
                            <h3 class="h4">Thống kê chi tiết</h3>
                            <div class="stats-detail">
                                <p><strong class="text-primary">${this.stats.users.candidates}</strong> - Người dùng Cơ hội</p>
                                <p><strong class="text-primary">${this.stats.users.employers}</strong> - Nhà tuyển dụng</p>
                                <p><strong class="text-primary">${this.stats.users.admins}</strong> - Quản trị viên</p>
                                <p><strong class="text-primary">${this.stats.companies.verified}</strong> - Công ty đã xác minh</p>
                                <p><strong class="text-primary">${this.stats.jobs.open}</strong> - Việc làm đang công khai</p>
                                <p><strong class="text-primary">${this.stats.applications.pending}</strong> - Đơn chờ duyệt</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent activity placeholder -->
                <div class="recent-activity">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="h4">Hoạt động gần đây</h3>
                        </div>
                        <div class="card-body">
                            <div class="activity-list">
                                <div class="activity-item">
                                    <span class="activity-badge bg-success"><i class="fas fa-check"></i></span>
                                    <div class="activity-content">
                                        <p class="activity-text">Đã đăng tuyển dụng mới</p>
                                        <p class="activity-time">5 phút trước</p>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <span class="activity-badge bg-info"><i class="fas fa-envelope"></i></span>
                                    <div class="activity-content">
                                        <p class="activity-text">Đã nhận được đơn ứng tuyển mới</p>
                                        <p class="activity-time">15 phút trước</p>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <span class="activity-badge bg-warning"><i class="fas fa-exclamation"></i></span>
                                    <div class="activity-content">
                                        <p class="activity-text">Công ty cần xác minh</p>
                                        <p class="activity-time">1 giờ trước</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        // Load stats here
        this.loadStats();
    }

    async loadStats() {
        try {
            // Placeholder for actual API call
            // const response = await api.get('/admin/stats/dashboard');
            // if (response.data) { this.stats = response.data; }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }
}
