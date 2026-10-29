// Saved Jobs View - Việc làm đã lưu
class JobHubSavedJobsView {
    render() {
        return `
            <div class="saved-jobs-page">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-bookmark text-primary"></i> Việc làm đã lưu
                    </h1>
                    <p class="text-muted">Lưu trữ các cơ hội nghề nghiệp quan tâm</p>
                </div>

                <div class="saved-jobs-grid">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fas fa-bookmark"></i></div>
                        <div class="empty-state-title">Chưa có việc làm nào được lưu</div>
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

const jobHubSavedJobsView = new JobHubSavedJobsView();
