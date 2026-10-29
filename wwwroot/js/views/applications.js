// Applications View - Đơn ứng tuyển
class JobHubApplicationsView {
    render() {
        return `
            <div class="applications-page">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-file-alt text-primary"></i> Đơn ứng tuyển
                    </h1>
                    <p class="text-muted">Quản lý các đơn ứng tuyển của bạn</p>
                </div>

                <div class="applications-grid">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fas fa-inbox"></i></div>
                        <div class="empty-state-title">Chưa có đơn ứng tuyển</div>
                        <div class="empty-state-desc">
                            <a href="#/jobs" class="btn btn-primary btn-sm">
                                <i class="fas fa-search"></i> Tìm việc làm
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

const jobHubApplicationsView = new JobHubApplicationsView();
