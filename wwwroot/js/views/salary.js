// Salary View - Bảng lương
class JobHubSalaryView {
    render() {
        return `
            <div class="salary-page">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-money-bill text-primary"></i> Bảng lương
                    </h1>
                    <p class="text-muted">Thông tin lương thực tế từ các công ty trên JobHub</p>
                </div>

                <!-- Salary filters -->
                <div class="filters-card card">
                    <div class="card-body">
                        <div class="filters-row">
                            <div class="filter-group">
                                <label class="form-label" for="salary-min">
                                    <i class="fas fa-dollar-sign"></i> Từ
                                </label>
                                <input
                                    type="number"
                                    id="salary-min"
                                    class="form-control"
                                    placeholder="0"
                                    min="0"
                                    oninput="jobHubSalaryView.applySalaryFilters()"
                                >
                            </div>
                            <div class="filter-group">
                                <label class="form-label" for="salary-max">
                                    <i class="fas fa-dollar-sign"></i> Đến
                                </label>
                                <input
                                    type="number"
                                    id="salary-max"
                                    class="form-control"
                                    placeholder="50000000"
                                    min="0"
                                    oninput="jobHubSalaryView.applySalaryFilters()"
                                >
                            </div>
                            <div class="filter-group">
                                <label class="form-label" for="salary-type">
                                    <i class="fas fa-exchange-alt"></i> Đơn vị
                                </label>
                                <select
                                    id="salary-type"
                                    class="form-control"
                                    onchange="jobHubSalaryView.applySalaryFilters()"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="monthly">Tháng</option>
                                    <option value="yearly">Năm</option>
                                    <option value="hourly">Giờ</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <button
                                    class="btn btn-primary"
                                    onclick="jobHubSalaryView.applySalaryFilters()"
                                >
                                    <i class="fas fa-filter"></i> Lọc
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Salary ranges -->
                <div class="salary-grid">
                    <div class="salary-card card">
                        <div class="salary-card-icon bg-red-100">
                            <i class="fas fa-hand-pointer text-red-600"></i>
                        </div>
                        <div class="salary-card-body">
                            <h3 class="h4"><span class="salary-amount">2 - 5</span> triệu/tháng</h3>
                            <p class="text-muted text-sm">Vị trí entry-level, fresher</p>
                            <span class="badge badge-primary">Nhập triển</span>
                        </div>
                    </div>
                    <div class="salary-card card">
                        <div class="salary-card-icon bg-orange-100">
                            <i class="fas fa-hand-pointer text-orange-600"></i>
                        </div>
                        <div class="salary-card-body">
                            <h3 class="h4"><span class="salary-amount">5 - 10</span> triệu/tháng</h3>
                            <p class="text-muted text-sm">Junior, mid-level</p>
                            <span class="badge badge-primary">Trung bình</span>
                        </div>
                    </div>
                    <div class="salary-card card">
                        <div class="salary-card-icon bg-yellow-100">
                            <i class="fas fa-hand-pointer text-yellow-600"></i>
                        </div>
                        <div class="salary-card-body">
                            <h3 class="h4"><span class="salary-amount">10 - 20</span> triệu/tháng</h3>
                            <p class="text-muted text-sm">Senior, team lead</p>
                            <span class="badge badge-primary">Khá tốt</span>
                        </div>
                    </div>
                    <div class="salary-card card">
                        <div class="salary-card-icon bg-green-100">
                            <i class="fas fa-hand-pointer text-green-600"></i>
                        </div>
                        <div class="salary-card-body">
                            <h3 class="h4"><span class="salary-amount">20 - 40</span> triệu/tháng</h3>
                            <p class="text-muted text-sm">Lead, quản lý</p>
                            <span class="badge badge-primary">Tốt</span>
                        </div>
                    </div>
                    <div class="salary-card card">
                        <div class="salary-card-icon bg-blue-100">
                            <i class="fas fa-hand-pointer text-blue-600"></i>
                        </div>
                        <div class="salary-card-body">
                            <h3 class="h4"><span class="salary-amount">40 - 100</span> triệu/tháng</h3>
                            <p class="text-muted text-sm">Đồng đội, giám đốc</p>
                            <span class="badge badge-primary">Rất tốt</span>
                        </div>
                    </div>
                </div>

                <!-- Salary stats -->
                <div class="salary-stats">
                    <div class="card">
                        <div class="card-body">
                            <h3 class="h4">Thống kê mảng lương</h3>
                            <div class="stats-list">
                                <p><strong class="text-primary">Lập trình</strong> - Trung bình 12 triệu/tháng</p>
                                <p><strong class="text-primary">Thiết kế</strong> - Trung bình 8 triệu/tháng</p>
                                <p><strong class="text-primary">DevOps</strong> - Trung bình 18 triệu/tháng</p>
                                <p><strong class="text-primary">Data Science</strong> - Trung bình 22 triệu/tháng</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

const jobHubSalaryView = {
    applySalaryFilters() {
        // Filter logic here
        console.log('Applying salary filters');
    }
};
