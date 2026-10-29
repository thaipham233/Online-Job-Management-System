// Admin Users View
class JobHubAdminUsersView {
    render() {
        return `
            <div class="admin-users-page">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-users text-primary"></i> Quản lý người dùng
                    </h1>
                </div>

                <div class="card">
                    <div class="card-body">
                        <div class="search-box">
                            <div class="input-group">
                                <i class="fas fa-search"></i>
                                <input type="text" class="form-control" placeholder="Tìm người dùng...">
                            </div>
                        </div>
                        <div class="users-table-wrap">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Người dùng</th>
                                        <th>Email</th>
                                        <th>Vai trò</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày tạo</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <strong>Quản trị hệ thống</strong><br>
                                            <small class="text-muted">admin@jobsystem.com</small>
                                        </td>
                                        <td>admin@jobsystem.com</td>
                                        <td>
                                            <span class="badge badge-primary">Admin</span>
                                        </td>
                                        <td>
                                            <span class="badge badge-success">Kích hoạt</span>
                                        </td>
                                        <td>15 Th9</td>
                                        <td>
                                            <button class="btn btn-sm btn-outline">
                                                <i class="fas fa-edit"></i> Sửa
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Nguyễn Văn An</strong><br>
                                            <small class="text-muted">employer1@company.com</small>
                                        </td>
                                        <td>employer1@company.com</td>
                                        <td>
                                            <span class="badge badge-success">Employer</span>
                                        </td>
                                        <td>
                                            <span class="badge badge-success">Kích hoạt</span>
                                        </td>
                                        <td>10 Th9</td>
                                        <td>
                                            <button class="btn btn-sm btn-outline">
                                                <i class="fas fa-edit"></i> Sửa
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
        // Load users
        this.loadUsers();
    }

    async loadUsers() {
        try {
            const result = await api.getUsers({ page: 1, pageSize: 10 });
            if (result.data) {
                // Render users
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }
}

const jobHubAdminUsersView = new JobHubAdminUsersView();
