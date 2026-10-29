// Company Detail View - Chi tiết công ty
class JobHubCompanyDetailView {
    render() {
        return `
            <div class="company-detail-page">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-building text-primary"></i> Chi tiết công ty
                    </h1>
                </div>

                <div class="company-detail-grid">
                    <!-- Company header -->
                    <div class="company-header card">
                        <div class="company-header-logo">
                            <i class="fas fa-building"></i>
                        </div>
                        <div class="company-header-info">
                            <h2 class="h2">Tên công ty</h2>
                            <p class="text-muted">Ngành nghề: Công nghệ thông tin</p>
                            <p class="text-muted">Địa chỉ: Hà Nội, Việt Nam</p>
                            <div class="company-header-stats">
                                <span><i class="fas fa-briefcase"></i> 150 nhân viên</span>
                                <span><i class="fas fa-check-circle"></i> Đã xác minh</span>
                            </div>
                        </div>
                    </div>

                    <!-- Company actions -->
                    <div class="company-actions">
                        <div class="card">
                            <div class="card-body">
                                <h3 class="h4">Hành động</h3>
                                <div class="action-list">
                                    <a href="#/jobs?companyId=1" class="btn btn-outline btn-sm">
                                        <i class="fas fa-search"></i> Việc làm của công ty
                                    </a>
                                    <button class="btn btn-outline btn-sm">
                                        <i class="fas fa-envelope"></i> Liên hệ
                                    </button>
                                    <button class="btn btn-outline btn-sm">
                                        <i class="fas fa-star"></i> Lưu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Company description -->
                    <div class="company-desc">
                        <div class="card">
                            <div class="card-body">
                                <h3 class="h4">Về công ty</h3>
                                <p>Mô tả chi tiết về công ty, văn hóa doanh nghiệp, Sứ mệnh và giá trị cốt lõi.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Jobs -->
                    <div class="company-jobs">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="h4">Việc làm hiện có</h3>
                            </div>
                            <div class="card-body">
                                <div class="job-list">
                                    <div class="job-item">
                                        <div class="job-item-content">
                                            <h4 class="job-item-title">Frontend Developer</h4>
                                            <p class="job-item-desc">React, TypeScript, Redux</p>
                                        </div>
                                        <span class="badge badge-primary">Toàn thời gian</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

const jobHubCompanyDetailView = new JobHubCompanyDetailView();
