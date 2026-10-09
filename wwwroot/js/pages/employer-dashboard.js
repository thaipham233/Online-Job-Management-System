// Employer Dashboard Page
export async function render(container) {
    requireAuth(async () => {
        if (!auth.isEmployer()) {
            showToast('Bạn không có quyền truy cập', 'error');
            router.navigate('/');
            return;
        }

        const [statsResult, jobsResult, applicationsResult, companyResult] = await Promise.all([
            api.get('/employer/stats'),
            api.getJobs({ companyId: auth.user?.companyId, pageSize: 5, sortBy: 'CreatedAt', sortDirection: 'desc' }),
            api.get('/employer/applications', { pageSize: 10, sortBy: 'AppliedAt', sortDirection: 'desc' }),
            api.getCompany(auth.user?.companyId)
        ]);

        const stats = statsResult.data || { totalJobs: 0, activeJobs: 0, totalApplications: 0, pendingApplications: 0, totalViews: 0 };
        const jobs = jobsResult.data?.items || jobsResult.data || [];
        const applications = applicationsResult.data?.items || applicationsResult.data || [];
        const company = companyResult.data || {};

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Bảng điều khiển nhà tuyển dụng</h1>
                        <p class="text-gray-500 mt-1">Quản lý việc làm, ứng viên và công ty</p>
                    </div>
                    <div class="flex gap-3">
                        <a href="#/employer/jobs/create" class="px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors" data-link>
                            <i class="fas fa-plus mr-2"></i>Đăng việc mới
                        </a>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    ${renderStatCard('Tổng việc làm', stats.totalJobs || 0, 'fas fa-briefcase', 'bg-blue-50 text-blue-600', '#/employer/jobs')}
                    ${renderStatCard('Đang tuyển', stats.activeJobs || 0, 'fas fa-check-circle', 'bg-green-50 text-green-600', '#/employer/jobs?status=Open')}
                    ${renderStatCard('Tổng đơn ứng tuyển', stats.totalApplications || 0, 'fas fa-file-alt', 'bg-purple-50 text-purple-600', '#/employer/applications')}
                    ${renderStatCard('Chờ duyệt', stats.pendingApplications || 0, 'fas fa-clock', 'bg-yellow-50 text-yellow-600', '#/employer/applications?status=Pending')}
                    ${renderStatCard('Lượt xem', stats.totalViews || 0, 'fas fa-eye', 'bg-indigo-50 text-indigo-600', '#/employer/jobs')}
                </div>

                <div class="grid lg:grid-cols-2 gap-8">
                    <!-- Recent Jobs -->
                    <div class="bg-white rounded-2xl border border-gray-100 p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-bold text-gray-900 flex items-center">
                                <i class="fas fa-briefcase text-primary-500 mr-2"></i>
                                Việc làm gần đây
                            </h3>
                            <a href="#/employer/jobs" class="text-sm text-primary-600 hover:text-primary-700 font-medium" data-link>Xem tất cả</a>
                        </div>
                        ${jobs.length > 0 ? `
                        <div class="space-y-3">
                            ${jobs.map(job => renderEmployerJobRow(job)).join('')}
                        </div>
                        ` : `
                        <div class="text-center py-8">
                            <i class="fas fa-briefcase text-3xl text-gray-300 mb-2"></i>
                            <p class="text-gray-500">Chưa có việc làm nào</p>
                            <a href="#/employer/jobs/create" class="mt-3 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700" data-link>
                                <i class="fas fa-plus mr-2"></i>Đăng việc đầu tiên
                            </a>
                        </div>
                        `}
                    </div>

                    <!-- Recent Applications -->
                    <div class="bg-white rounded-2xl border border-gray-100 p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-bold text-gray-900 flex items-center">
                                <i class="fas fa-file-alt text-primary-500 mr-2"></i>
                                Đơn ứng tuyển mới
                            </h3>
                            <a href="#/employer/applications" class="text-sm text-primary-600 hover:text-primary-700 font-medium" data-link>Xem tất cả</a>
                        </div>
                        ${applications.length > 0 ? `
                        <div class="space-y-3">
                            ${applications.map(app => renderEmployerApplicationRow(app)).join('')}
                        </div>
                        ` : `
                        <div class="text-center py-8">
                            <i class="fas fa-file-alt text-3xl text-gray-300 mb-2"></i>
                            <p class="text-gray-500">Chưa có đơn ứng tuyển nào</p>
                        </div>
                        `}
                    </div>
                </div>

                <!-- Company Quick Actions -->
                <div class="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <i class="fas fa-building text-primary-500 mr-2"></i>
                        Quản lý công ty
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a href="#/employer/company" class="p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all" data-link>
                            <i class="fas fa-edit text-2xl text-primary-500 mb-2"></i>
                            <h4 class="font-semibold text-gray-900">Chỉnh sửa hồ sơ</h4>
                            <p class="text-sm text-gray-500 mt-1">Cập nhật thông tin, logo, ảnh bìa</p>
                        </a>
                        <a href="#/employer/jobs/create" class="p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all" data-link>
                            <i class="fas fa-plus-circle text-2xl text-primary-500 mb-2"></i>
                            <h4 class="font-semibold text-gray-900">Đăng việc mới</h4>
                            <p class="text-sm text-gray-500 mt-1">Tạo tin tuyển dụng nhanh chóng</p>
                        </a>
                        <a href="#/employer/applications" class="p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all" data-link>
                            <i class="fas fa-users text-2xl text-primary-500 mb-2"></i>
                            <h4 class="font-semibold text-gray-900">Quản lý ứng viên</h4>
                            <p class="text-sm text-gray-500 mt-1">Xem, lọc, cập nhật trạng thái đơn</p>
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
}

function renderStatCard(title, value, icon, colorClass, link) {
    return `
        <a href="${link}" class="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-primary-100 transition-all" data-link>
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center">
                    <i class="${icon} text-xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-500">${title}</p>
                    <p class="text-2xl font-bold text-gray-900">${value.toLocaleString('vi-VN')}</p>
                </div>
            </div>
        </a>
    `;
}

function renderEmployerJobRow(job) {
    const status = job.status || 'Draft';
    const applicationsCount = job.applicationsCount || 0;
    const viewCount = job.viewCount || 0;
    
    return `
        <a href="#/employer/jobs/${job.id}" class="flex items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors" data-link>
            <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate">${job.title}</p>
                <p class="text-sm text-gray-500">
                    <span class="px-2 py-0.5 ${getJobStatusColor(status)} rounded-full text-xs font-medium mr-2">${getJobStatusLabel(status)}</span>
                    ${applicationsCount} đơn • ${viewCount} xem
                </p>
            </div>
            <span class="text-sm font-medium text-primary-600">${formatSalary(job.salaryMin, job.salaryMax, job.salaryType)}</span>
        </a>
    `;
}

function renderEmployerApplicationRow(app) {
    const job = app.job || {};
    const candidate = app.candidate || app.user || {};
    const status = app.status || 'Pending';
    const resume = app.resume || {};
    
    return `
        <a href="#/employer/applications/${app.id}" class="flex items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors" data-link>
            <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate">${job.title || 'Việc làm'}</p>
                <p class="text-sm text-gray-500">${candidate.fullName || candidate.email || 'Ứng viên'} • ${resume.title || 'CV'}</p>
            </div>
            <span class="px-3 py-1 ${getApplicationStatusColor(status)} rounded-full text-xs font-medium">${getApplicationStatusLabel(status)}</span>
            <span class="ml-3 text-sm text-gray-500">${formatRelativeTime(app.appliedAt)}</span>
        </a>
    `;
}

function getJobStatusLabel(status) {
    const labels = { 'Draft': 'Nháp', 'Open': 'Đang tuyển', 'Closed': 'Đã đóng', 'Paused': 'Tạm dừng', 'Expired': 'Hết hạn' };
    return labels[status] || status;
}
function getJobStatusColor(status) {
    const colors = { 'Draft': 'bg-gray-100 text-gray-700', 'Open': 'bg-green-100 text-green-700', 'Closed': 'bg-red-100 text-red-700', 'Paused': 'bg-yellow-100 text-yellow-700', 'Expired': 'bg-gray-100 text-gray-500' };
    return colors[status] || 'bg-gray-100 text-gray-700';
}
function getApplicationStatusLabel(status) {
    const labels = { 'Pending': 'Chờ duyệt', 'UnderReview': 'Đang xem xét', 'Shortlisted': 'Đã lọc', 'InterviewScheduled': 'Đã lên lịch PV', 'Interviewed': 'Đã phỏng vấn', 'Offered': 'Đã đề nghị', 'Accepted': 'Đã chấp nhận', 'Rejected': 'Đã từ chối', 'Withdrawn': 'Đã rút đơn' };
    return labels[status] || status;
}
function getApplicationStatusColor(status) {
    const colors = { 'Pending': 'bg-yellow-100 text-yellow-800', 'UnderReview': 'bg-blue-100 text-blue-800', 'Shortlisted': 'bg-purple-100 text-purple-800', 'InterviewScheduled': 'bg-indigo-100 text-indigo-800', 'Interviewed': 'bg-teal-100 text-teal-800', 'Offered': 'bg-green-100 text-green-800', 'Accepted': 'bg-emerald-100 text-emerald-800', 'Rejected': 'bg-red-100 text-red-800', 'Withdrawn': 'bg-gray-100 text-gray-800' };
    return colors[status] || 'bg-gray-100 text-gray-800';
}
function formatSalary(min, max, type = 'Monthly') {
    if (!min && !max) return 'Thương lượng';
    const format = (num) => { if (num >= 1e9) return (num / 1e9).toFixed(1).replace('.0', '') + ' tỷ'; if (num >= 1e6) return (num / 1e6).toFixed(1).replace('.0', '') + ' triệu'; return num.toLocaleString('vi-VN'); };
    if (min && max) return `${format(min)} - ${format(max)}/${type === 'Monthly' ? 'tháng' : 'năm'}`;
    if (min) return `Từ ${format(min)}/${type === 'Monthly' ? 'tháng' : 'năm'}`;
    return `Đến ${format(max)}/${type === 'Monthly' ? 'tháng' : 'năm'}`;
}
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
