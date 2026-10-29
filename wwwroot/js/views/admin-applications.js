// Admin Applications View - Quản lý ứng tuyển (Admin)
class JobHubAdminApplicationsView {
    render() {
        return `
            <div class="admin-applications-page">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-file-alt text-primary"></i> Quản lý ứng tuyển
                    </h1>
                </div>

                <div class="card">
                    <div class="card-body">
                        <div class="search-box">
                            <div class="input-group">
                                <i class="fas fa-search"></i>
                                <input type="text" class="form-control" placeholder="Tìm ứng viên...">
                            </div>
                        </div>
                        <div class="applications-table-wrap">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>ứng viên</th>
                                        <th>Việc làm</th>
                                        <th>Công ty</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày nộp</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <strong>Nguyễn Văn A</strong><br>
                                            <small class="text-muted">candidate1@email.com</small>
                                        </td>
                                        <td>Frontend Developer</td>
                                        <td>ABC Tech</td>
                                        <td>
                                            <span class="badge badge-warning">Đang xem xét</span>
                                        </td>
                                        <td>12 Th10</td>
                                        <td>
                                            <button class="btn btn-sm btn-outline">
                                                <i class="fas fa-eye"></i> Xem
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Trần Thị B</strong><br>
                                            <small class="text-muted">candidate2@email.com</small>
                                        </td>
                                        <td>Backend Developer</td>
                                        <td>XYZ Corp</td>
                                        <td>
                                            <span class="badge badge-success">Đã phỏng vấn</span>
                                        </td>
                                        <td>10 Th10</td>
                                        <td>
                                            <button class="btn btn-sm btn-outline">
                                                <i class="fas fa-eye"></i> Xem
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        // Load applications
        this.loadApplications();
    }

    async loadApplications() {
        try {
            const result = await api.getApplications({ page: 1, pageSize: 10 });
            if (result.data) {
                // Render applications table
            }
        } catch (error) {
            console.error('Error loading applications:', error);
        }
    }
}

const jobHubAdminApplicationsView = new JobHubAdminApplicationsView();
