// Admin Companies View
class JobHubAdminCompaniesView {
    render() {
        return `
            <div class="admin-companies-page">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-building text-primary"></i> Quản lý công ty
                    </h1>
                </div>

                <div class="card">
                    <div class="card-body">
                        <div class="search-box">
                            <div class="input-group">
                                <i class="fas fa-search"></i>
                                <input type="text" class="form-control" placeholder="Tìm công ty...">
                            </div>
                        </div>
                        <div class="companies-table-wrap">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Công ty</th>
                                        <th>Ngành nghề</th>
                                        <th>Địa chỉ</th>
                                        <th>Trạng thái</th>
                                        <th>Việc làm</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <strong>ABC Tech</strong><br>
                                            <small class="text-muted">Công ty TNHH ABC Technology</small>
                                        </td>
                                        <td>Công nghệ thông tin</td>
                                        <td>Hà Nội</td>
                                        <td>
                                            <span class="badge badge-success">Đã xác minh</span>
                                        </td>
                                        <td>12</td>
                                        <td>
                                            <button class="btn btn-sm btn-outline">
                                                <i class="fas fa-eye"></i> Xem
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>XYZ Corporation</td>
                                        <td>Tài chính / Công nghệ</td>
                                        <td>TP.HCM</td>
                                        <td>
                                            <span class="badge badge-primary">Đang chờ</span>
                                        </td>
                                        <td>8</td>
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
        // Load companies
        this.loadCompanies();
    }

    async loadCompanies() {
        try {
            const result = await api.getCompanies({ page: 1, pageSize: 10 });
            if (result.data) {
                // Render companies
            }
        } catch (error) {
            console.error('Error loading companies:', error);
        }
    }
}

const jobHubAdminCompaniesView = new JobHubAdminCompaniesView();
