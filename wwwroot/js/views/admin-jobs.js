// Admin Jobs View
class JobHubAdminJobsView {
    render() {
        return `
            <div class="admin-jobs-page">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-list text-primary"></i> Quản lý việc làm
                    </h1>
                </div>

                <div class="card">
                    <div class="card-body">
                        <div class="search-box">
                            <div class="input-group">
                                <i class="fas fa-search"></i>
                                <input type="text" class="form-control" placeholder="Tìm việc làm...">
                            </div>
                        </div>
                        <div class="jobs-table-wrap">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Vị trí</th>
                                        <th>Công ty</th>
                                        <th>Thể loại</th>
                                        <th>Mức lương</th>
                                        <th>Trạng thái</th>
                                        <th>Đơn ứng tuyển</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <strong>Frontend Developer</strong><br>
                                            <small class="text-muted">React, TypeScript</small>
                                        </td>
                                        <td>ABC Tech</td>
                                        <td>Lập trình</td>
                                        <td>15 - 25 triệu</td>
                                        <td>
                                            <span class="badge badge-success">Đang công khai</span>
                                        </td>
                                        <td>8</td>
                                        <td>
                                            <button class="btn btn-sm btn-outline">
                                                <i class="fas fa-edit"></i> Sửa
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Backend Developer (.NET)</td>
                                        <td>ABC Tech</td>
                                        <td>Lập trình</td>
                                        <td>18 - 30 triệu</td>
                                        <td>
                                            <span class="badge badge-success">Đang công khai</span>
                                        </td>
                                        <td>5</td>
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
        // Load jobs
        this.loadJobs();
    }

    async loadJobs() {
        try {
            const result = await api.getJobs({ page: 1, pageSize: 10 });
            if (result.data) {
                // Render jobs
            }
        } catch (error) {
            console.error('Error loading jobs:', error);
        }
    }
}

const jobHubAdminJobsView = new JobHubAdminJobsView();
