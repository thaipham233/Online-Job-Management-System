// Employer Resources View
class JobHubEmployerResourcesView {
    render() {
        return `
            <div class="employer-resources-page">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-book text-primary"></i> Tài nguyên tuyển dụng
                    </h1>
                    <p class="text-muted">Tài liệu, hướng dẫn và công cụ hỗ trợ doanh nghiệp tuyển dụng</p>
                </div>

                <div class="resources-grid">
                    <div class="resource-card card">
                        <div class="resource-icon bg-blue-100">
                            <i class="fas fa-file-pdf text-blue-600"></i>
                        </div>
                        <div class="resource-body">
                            <h3 class="h4">Hướng dẫn tuyển dụng</h3>
                            <p class="text-muted">Các bước cơ bản để tuyển dụng hiệu quả</p>
                            <a href="#" class="btn btn-sm btn-outline">Xem tài liệu</a>
                        </div>
                    </div>
                    <div class="resource-card card">
                        <div class="resource-icon bg-green-100">
                            <i class="fas fa-file-excel text-green-600"></i>
                        </div>
                        <div class="resource-body">
                            <h3 class="h4">Template CV</h3>
                            <p class="text-muted">Đa dạng mẫu CV để ứng viên tham khảo</p>
                            <a href="#" class="btn btn-sm btn-outline">Tải xuống</a>
                        </div>
                    </div>
                    <div class="resource-card card">
                        <div class="resource-icon bg-yellow-100">
                            <i class="fas fa-bullhorn text-yellow-600"></i>
                        </div>
                        <div class="resource-body">
                            <h3 class="h4">Blog tuyển dụng</h3>
                            <p class="text-muted">Bài viết về xu hướng tuyển dụng 2024</p>
                            <a href="#" class="btn btn-sm btn-outline">Đọc ngay</a>
                        </div>
                    </div>
                    <div class="resource-card card">
                        <div class="resource-icon bg-purple-100">
                            <i class="fas fa-video text-purple-600"></i>
                        </div>
                        <div class="resource-body">
                            <h3 class="h4">Webinar</h3>
                            <p class="text-muted">Buổi học trực tuyến về tuyển dụng nhân sự</p>
                            <a href="#" class="btn btn-sm btn-outline">Xem tất cả</a>
                        </div>
                    </div>
                </div>

                <div class="resources-stats">
                    <div class="card">
                        <div class="card-body">
                            <h3 class="h4">Thống kê tài nguyên</h3>
                            <div class="stats-list">
                                <p><strong class="text-primary">12</strong> - Hướng dẫn</p>
                                <p><strong class="text-primary">25</strong> - Template CV</p>
                                <p><strong class="text-primary">8</strong> - Webinar</p>
                                <p><strong class="text-primary">30</strong> - Bài viết</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

const jobHubEmployerResourcesView = new JobHubEmployerResourcesView();
