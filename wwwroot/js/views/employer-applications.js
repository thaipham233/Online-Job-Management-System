// Employer Applications View - Đơn ứng tuyển của công ty
class JobHubEmployerApplicationsView {
    render() {
        return `
            <div class="employer-applications-page">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-file-alt text-primary"></i> Đơn ứng tuyển
                    </h1>
                    <p class="text-muted">Quản lý các ứng tuyển từ ứng viên</p>
                </div>

                <div class="applications-table-wrap">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ứng viên</th>
                                <th>Ngày nộp</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>Nguyễn Văn A</strong><br>
                                    <small class="text-muted">candidate1@email.com</small>
                                </td>
                                <td>12 Th10</td>
                                <td>
                                    <span class="badge badge-warning">Đang xem xét</span>
                                </td>
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
                                <td>10 Th10</td>
                                <td>
                                    <span class="badge badge-success">Đã phỏng vấn</span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-outline">
                                        <i class="fas fa-eye"></i> Xem
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Lê Văn C</strong><br>
                                    <small class="text-muted">candidate3@email.com</small>
                                </td>
                                <td>8 Th10</td>
                                <td>
                                    <span class="badge badge-primary">Đang chờ</span>
                                </td>
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
        `;
    }

    init() {
        // Load applications data
        this.loadApplications();
    }

    async loadApplications() {
        try {
            const result = await api.getApplications({ page: 1, pageSize: 10 });
            if (result.data) {
                // Render applications table
                const tableBody = document.querySelector('.employer-applications-page tbody');
                if (tableBody && result.data.items) {
                    tableBody.innerHTML = result.data.items.map(app => `
                        <tr>
                            <td><strong>${app.user?.fullName || 'N/A'}</strong><br><small class="text-muted">${app.user?.email || ''}</small></td>
                            <td>${formatDate(app.appliedAt)}</td>
                            <td><span class="badge badge-warning">${app.statusName || 'Chờ duyệt'}</span></td>
                            <td>
                                <button class="btn btn-sm btn-outline">
                                    <i class="fas fa-eye"></i> Xem
                                </button>
                            </td>
                        </tr>
                    `).join('');
                }
            }
        } catch (error) {
            console.error('Error loading applications:', error);
        }
    }
}

const jobHubEmployerApplicationsView = new JobHubEmployerApplicationsView();
