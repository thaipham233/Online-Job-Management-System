// Admin Dashboard Page
export async function render(container) {
    requireAuth(async () => {
        if (!auth.hasRole('Admin')) {
            showToast('Bạn không có quyền truy cập', 'error');
            router.navigate('/');
            return;
        }

        const [usersResult, companiesResult, jobsResult, applicationsResult] = await Promise.all([
            api.get('/admin/stats/users'),
            api.get('/admin/stats/companies'),
            api.get('/admin/stats/jobs'),
            api.get('/admin/stats/applications')
        ]);

        const userStats = usersResult.data || { total: 0, candidates: 0, employers: 0, admins: 0, newThisMonth: 0 };
        const companyStats = companiesResult.data || { total: 0, verified: 0, pending: 0, newThisMonth: 0 };
        const jobStats = jobsResult.data || { total: 0, open: 0, closed: 0, draft: 0, newThisMonth: 0 };
        const appStats = applicationsResult.data || { total: 0, pending: 0, processed: 0, newThisMonth: 0 };

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="mb-8">
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Bảng điều khiển Admin</h1>
                    <p class="text-gray-500 mt-1">Tổng quan hệ thống & Quản trị</p>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    ${renderStatCard('Người dùng', userStats.total, 'fas fa-users', 'bg-blue-50 text-blue-600', '#/admin/users', `+${userStats.newThisMonth} tháng này`)}
                    ${renderStatCard('Công ty', companyStats.total, 'fas fa-building', 'bg-green-50 text-green-600', '#/admin/companies', `${companyStats.verified} đã xác thực`)}
                    ${renderStatCard('Việc làm', jobStats.total, 'fas fa-briefcase', 'bg-purple-50 text-purple-600', '#/admin/jobs', `${jobStats.open} đang tuyển`)}
                    ${renderStatCard('Đơn ứng tuyển', appStats.total, 'fas fa-file-alt', 'bg-orange-50 text-orange-600', '#/admin/applications', `${appStats.pending} chờ duyệt`)}
                </div>

                <div class="grid lg:grid-cols-2 gap-8">
                    <!-- Quick Actions -->
                    <div class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-bolt text-primary-500 mr-2"></i>
                            Thao tác nhanh
                        </h3>
                        <div class="grid grid-cols-2 gap-4">
                            <a href="#/admin/users" class="p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all" data-link>
                                <i class="fas fa-user-plus text-2xl text-primary-500 mb-2"></i>
                                <h4 class="font-semibold text-gray-900">Quản lý người dùng</h4>
                                <p class="text-sm text-gray-500 mt-1">Xem, khóa/mở, phân quyền</p>
                            </a>
                            <a href="#/admin/companies" class="p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all" data-link>
                                <i class="fas fa-building text-2xl text-primary-500 mb-2"></i>
                                <h4 class="font-semibold text-gray-900">Quản lý công ty</h4>
                                <p class="text-sm text-gray-500 mt-1">Xác thực, xem chi tiết</p>
                            </a>
                            <a href="#/admin/jobs" class="p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all" data-link>
                                <i class="fas fa-briefcase text-2xl text-primary-500 mb-2"></i>
                                <h4 class="font-semibold text-gray-900">Quản lý việc làm</h4>
                                <p class="text-sm text-gray-500 mt-1">Duyệt, ẩn, xóa tin</p>
                            </a>
                            <a href="#/admin/categories" class="p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all" data-link>
                                <i class="fas fa-tags text-2xl text-primary-500 mb-2"></i>
                                <h4 class="font-semibold text-gray-900">Quản lý danh mục</h4>
                                <p class="text-sm text-gray-500 mt-1">Thêm, sửa, xóa category</p>
                            </a>
                        </div>
                    </div>

                    <!-- Recent Activity / System Health -->
                    <div class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-chart-line text-primary-500 mr-2"></i>
                            Hoạt động gần đây
                        </h3>
                        <div class="space-y-4">
                            <div class="flex items-center p-3 bg-gray-50 rounded-xl">
                                <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3">
                                    <i class="fas fa-user-plus"></i>
                                </div>
                                <div class="flex-1">
                                    <p class="font-medium text-gray-900">${userStats.newThisMonth} người dùng mới đăng ký tháng này</p>
                                    <p class="text-sm text-gray-500">Tổng ${userStats.total} người dùng</p>
                                </div>
                            </div>
                            <div class="flex items-center p-3 bg-gray-50 rounded-xl">
                                <div class="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3">
                                    <i class="fas fa-building"></i>
                                </div>
                                <div class="flex-1">
                                    <p class="font-medium text-gray-900">${companyStats.newThisMonth} công ty mới tháng này</p>
                                    <p class="text-sm text-gray-500">${companyStats.pending} chờ xác thực</p>
                                </div>
                            </div>
                            <div class="flex items-center p-3 bg-gray-50 rounded-xl">
                                <div class="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-3">
                                    <i class="fas fa-briefcase"></i>
                                </div>
                                <div class="flex-1">
                                    <p class="font-medium text-gray-900">${jobStats.newThisMonth} việc làm mới tháng này</p>
                                    <p class="text-sm text-gray-500">${jobStats.draft} nháp, ${jobStats.closed} đã đóng</p>
                                </div>
                            </div>
                            <div class="flex items-center p-3 bg-gray-50 rounded-xl">
                                <div class="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mr-3">
                                    <i class="fas fa-file-alt"></i>
                                </div>
                                <div class="flex-1">
                                    <p class="font-medium text-gray-900">${appStats.newThisMonth} đơn ứng tuyển mới tháng này</p>
                                    <p class="text-sm text-gray-500">${appStats.processed} đã xử lý</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function renderStatCard(title, value, icon, colorClass, link, subtitle) {
    return `
        <a href="${link}" class="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-primary-100 transition-all" data-link>
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center">
                    <i class="${icon} text-xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-500">${title}</p>
                    <p class="text-2xl font-bold text-gray-900">${value.toLocaleString('vi-VN')}</p>
                    <p class="text-xs text-gray-400 mt-1">${subtitle}</p>
                </div>
            </div>
        </a>
    `;
}
