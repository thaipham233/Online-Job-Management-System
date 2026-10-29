// Employer Dashboard View - Bảng điều khiển nhà tuyển dụng
class JobHubEmployerDashboardView {
    constructor() {
        this.stats = {
            totalJobs: 0,
            published: 0,
            drafts: 0,
            applications: 0
        };
    }

    async render() {
        return `
            <div class="employer-dashboard">
                <!-- Page header -->
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-briefcase text-primary"></i> Tổng quan Nhà tuyển dụng
                    </h1>
                    <div class="page-header-actions">
                        <a href="#/employer/post-job" class="btn btn-primary btn-sm">
                            <i class="fas fa-plus"></i> Đăng tuyển dụng
                        </a>
                    </div>
                </div>

                <!-- Stats -->
                <div class="stats-grid">
                    <div class="stat-card card">
                        <div class="stat-icon bg-blue-100">
                            <i class="fas fa-list text-blue-600"></i>
                        </div>
                        <div class="stat-body">
                            <h3 class="stat-value">${this.stats.totalJobs}</h3>
                            <p class="stat-label">Tổng tuyển dụng</p>
                            <span class="stat-change text-success">
                                <i class="fas fa-arrow-up"></i> +2 hôm nay
                            </span>
                        </div>
                    </div>
                    <div class="stat-card card">
                        <div class="stat-icon bg-green-100">
                            <i class="fas fa-check-circle text-green-600"></i>
                        </div>
                        <div class="stat-body">
                            <h3 class="stat-value">${this.stats.published}</h3>
                            <p class="stat-label">Đang công khai</p>
                            <span class="stat-change text-success">
                                <i class="fas fa-arrow-up"></i> +1
                            </span>
                        </div>
                    </div>
                    <div class="stat-card card">
                        <div class="stat-icon bg-yellow-100">
                            <i class="fas fa-edit text-yellow-600"></i>
                        </div>
                        <div class="stat-body">
                            <h3 class="stat-value">${this.stats.drafts}</h3>
                            <p class="stat-label">Bản nháp</p>
                            <span class="stat-change text-warning">
                                <i class="fas fa-clock"></i> Cần hoàn thiện
                            </span>
                        </div>
                    </div>
                    <div class="stat-card card">
                        <div class="stat-icon bg-purple-100">
                            <i class="fas fa-file-alt text-purple-600"></i>
                        </div>
                        <div class="stat-body">
                            <h3 class="stat-value">${this.stats.applications}</h3>
                            <p class="stat-label">Đơn ứng tuyển</p>
                            <span class="stat-change text-info">
                                <i class="fas fa-ellipsis-h"></i> 7đơn hôm nay
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Quick actions -->
                <div class="quick-actions">
                    <div class="card">
                        <div class="card-body">
                            <h3 class="h4">Tài nguyên nhà tuyển dụng</h3>
                            <div class="resource-grid">
                                <a href="#/employer/branding" class="resource-card card">
                                    <div class="resource-icon bg-blue-100">
                                        <i class="fas fa-paint-brush text-blue-600"></i>
                                    </div>
                                    <div class="resource-body">
                                        <h4 class="h5">Employer Branding</h4>
                                        <p class="text-muted">Xây dựng thương hiệu thu hút ứng viên tốt nhất</p>
                                    </div>
                                </a>
                                <a href="#/employer/pricing" class="resource-card card">
                                    <div class="resource-icon bg-green-100">
                                        <i class="fas fa-tag text-green-600"></i>
                                    </div>
                                    <div class="resource-body">
                                        <h4 class="h5">Bảng giá</h4>
                                        <p class="text-muted">Các gói dịch vụ và ưu đãi</p>
                                    </div>
                                </a>
                                <a href="#/employer/resources" class="resource-card card">
                                    <div class="resource-icon bg-yellow-100">
                                        <i class="fas fa-book text-yellow-600"></i>
                                    </div>
                                    <div class="resource-body">
                                        <h4 class="h5">Tài nguyên tuyển dụng</h4>
                                        <p class="text-muted">Hướng dẫn, template, bài viết hữu ích</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent jobs -->
                <div class="recent-actions">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="h4">Việc làm gần đây</h3>
                            <a href="#/employer/job/form" class="btn btn-sm btn-outline">
                                <i class="fas fa-plus"></i> Đăng tuyển dụng
                            </a>
                        </div>
                        <div class="card-body">
                            <div class="job-list">
                                <div class="job-item">
                                    <div class="job-item-status bg-gray-100 text-gray-600">
                                        <i class="fas fa-edit"></i> Bản nháp
                                    </div>
                                    <div class="job-item-content">
                                        <h4 class="job-item-title">Frontend Developer</h4>
                                        <p class="job-item-desc">React, TypeScript, Redux</p>
                                    </div>
                                    <div class="job-item-actions">
                                        <a href="#/employer/job/form" class="btn btn-sm btn-outline">
                                            <i class="fas fa-cog"></i>
                                        </a>
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
        // Load data
        this.loadJobs();
    }

    async loadJobs() {
        try {
            // Placeholder for actual API call
            // const response = await api.get('/jobs/my-jobs');
            // if (response.data) { this.stats = response.data; }
        } catch (error) {
            console.error('Error loading jobs:', error);
        }
    }
}
