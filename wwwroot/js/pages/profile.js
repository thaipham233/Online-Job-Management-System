// Profile Page
export async function render(container) {
    requireAuth(async () => {
        // Fetch user profile and related data
        const [profileResult, applicationsResult, resumesResult, savedJobsResult] = await Promise.all([
            api.getProfile(),
            api.getApplications({ pageSize: 5, sortBy: 'AppliedAt', sortDirection: 'desc' }),
            api.getResumes(),
            api.get('/users/saved-jobs') // Assuming endpoint exists
        ]);

        const user = profileResult.data || auth.user;
        const applications = applicationsResult.data?.items || applicationsResult.data || [];
        const resumes = resumesResult.data || [];
        const savedJobs = savedJobsResult.data?.items || savedJobsResult.data || [];

        const avatar = user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email)}&background=0ea5e9&color=fff&size=200`;
        const memberSince = user.createdAt ? formatDate(user.createdAt) : 'N/A';

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Hồ sơ của tôi</h1>
                        <p class="text-gray-500 mt-1">Quản lý thông tin cá nhân, đơn ứng tuyển và CV</p>
                    </div>
                    <a href="#/profile/edit" class="px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors" data-link>
                        <i class="fas fa-edit mr-2"></i>Chỉnh sửa hồ sơ
                    </a>
                </div>

                <div class="grid lg:grid-cols-4 gap-8">
                    <!-- Sidebar -->
                    <aside class="lg:col-span-1">
                        <!-- Profile Card -->
                        <div class="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                            <div class="text-center mb-6">
                                <img src="${avatar}" alt="${user.fullName}" class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary-100" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email)}&background=0ea5e9&color=fff&size=200'">
                                <h2 class="text-xl font-bold text-gray-900">${user.fullName || 'Chưa cập nhật'}</h2>
                                <p class="text-gray-500 mt-1">${user.email}</p>
                                ${user.phone ? `<p class="text-gray-500 text-sm"><i class="fas fa-phone mr-1"></i>${user.phone}</p>` : ''}
                                <div class="mt-3 flex justify-center gap-2">
                                    <span class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium capitalize">${user.role?.toLowerCase() || 'candidate'}</span>
                                </div>
                            </div>

                            <div class="border-t border-gray-100 pt-4 mb-4">
                                <div class="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p class="text-2xl font-bold text-gray-900">${applications.length}</p>
                                        <p class="text-xs text-gray-500">Đơn ứng tuyển</p>
                                    </div>
                                    <div>
                                        <p class="text-2xl font-bold text-gray-900">${resumes.length}</p>
                                        <p class="text-xs text-gray-500">CV</p>
                                    </div>
                                    <div>
                                        <p class="text-2xl font-bold text-gray-900">${savedJobs.length}</p>
                                        <p class="text-xs text-gray-500">Đã lưu</p>
                                    </div>
                                </div>
                            </div>

                            <nav class="space-y-1" id="profile-nav">
                                <a href="#/profile" class="flex items-center px-3 py-2 rounded-lg text-primary-600 bg-primary-50 font-medium" data-link>
                                    <i class="fas fa-user mr-3 w-5"></i>Tổng quan
                                </a>
                                <a href="#/applications" class="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900" data-link>
                                    <i class="fas fa-file-alt mr-3 w-5"></i>Đơn ứng tuyển
                                </a>
                                <a href="#/saved-jobs" class="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900" data-link>
                                    <i class="fas fa-bookmark mr-3 w-5"></i>Việc đã lưu
                                </a>
                                <a href="#/resumes" class="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900" data-link>
                                    <i class="fas fa-file-word mr-3 w-5"></i>CV của tôi
                                </a>
                                ${auth.isEmployer() ? `
                                <a href="#/employer/dashboard" class="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-t border-gray-100 pt-2 mt-2" data-link>
                                    <i class="fas fa-building mr-3 w-5"></i>Trang nhà tuyển dụng
                                </a>
                                ` : ''}
                            </nav>
                        </div>
                    </aside>

                    <!-- Main Content -->
                    <main class="lg:col-span-3 space-y-6">
                        <!-- Overview Tab -->
                        <section id="overview-tab" class="space-y-6">
                            <!-- Personal Info -->
                            <div class="bg-white rounded-2xl border border-gray-100 p-6">
                                <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <i class="fas fa-id-card text-primary-500 mr-2"></i>
                                    Thông tin cá nhân
                                </h3>
                                <dl class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <dt class="text-sm text-gray-500">Họ tên</dt>
                                        <dd class="font-medium text-gray-900 mt-1">${user.fullName || '<span class="text-gray-400">Chưa cập nhật</span>'}</dd>
                                    </div>
                                    <div>
                                        <dt class="text-sm text-gray-500">Email</dt>
                                        <dd class="font-medium text-gray-900 mt-1">${user.email}</dd>
                                    </div>
                                    <div>
                                        <dt class="text-sm text-gray-500">Số điện thoại</dt>
                                        <dd class="font-medium text-gray-900 mt-1">${user.phone || '<span class="text-gray-400">Chưa cập nhật</span>'}</dd>
                                    </div>
                                    <div>
                                        <dt class="text-sm text-gray-500">Ngày sinh</dt>
                                        <dd class="font-medium text-gray-900 mt-1">${user.dateOfBirth ? formatDate(user.dateOfBirth) : '<span class="text-gray-400">Chưa cập nhật</span>'}</dd>
                                    </div>
                                    <div>
                                        <dt class="text-sm text-gray-500">Giới tính</dt>
                                        <dd class="font-medium text-gray-900 mt-1">${getGenderLabel(user.gender) || '<span class="text-gray-400">Chưa cập nhật</span>'}</dd>
                                    </div>
                                    <div>
                                        <dt class="text-sm text-gray-500">Địa chỉ</dt>
                                        <dd class="font-medium text-gray-900 mt-1">${user.address || '<span class="text-gray-400">Chưa cập nhật</span>'}</dd>
                                    </div>
                                </dl>
                            </div>

                            <!-- Recent Applications -->
                            <div class="bg-white rounded-2xl border border-gray-100 p-6">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-bold text-gray-900 flex items-center">
                                        <i class="fas fa-file-alt text-primary-500 mr-2"></i>
                                        Đơn ứng tuyển gần đây
                                    </h3>
                                    <a href="#/applications" class="text-sm text-primary-600 hover:text-primary-700 font-medium" data-link>Xem tất cả</a>
                                </div>
                                ${applications.length > 0 ? `
                                <div class="space-y-3">
                                    ${applications.slice(0, 5).map(app => renderApplicationRow(app)).join('')}
                                </div>
                                ` : `
                                <div class="text-center py-8">
                                    <i class="fas fa-file-alt text-3xl text-gray-300 mb-2"></i>
                                    <p class="text-gray-500">Bạn chưa nộp đơn nào</p>
                                    <a href="#/jobs" class="mt-3 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium" data-link>
                                        <i class="fas fa-search mr-1"></i>Tìm việc ngay
                                    </a>
                                </div>
                                `}
                            </div>

                            <!-- Resumes -->
                            <div class="bg-white rounded-2xl border border-gray-100 p-6">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-bold text-gray-900 flex items-center">
                                        <i class="fas fa-file-word text-primary-500 mr-2"></i>
                                        CV của tôi
                                    </h3>
                                    <a href="#/resumes" class="text-sm text-primary-600 hover:text-primary-700 font-medium" data-link>Xem tất cả</a>
                                </div>
                                ${resumes.length > 0 ? `
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    ${resumes.map(resume => renderResumeCard(resume)).join('')}
                                </div>
                                ` : `
                                <div class="text-center py-8">
                                    <i class="fas fa-file-word text-3xl text-gray-300 mb-2"></i>
                                    <p class="text-gray-500">Bạn chưa có CV nào</p>
                                    <a href="#/resumes/create" class="mt-3 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700" data-link>
                                        <i class="fas fa-plus mr-2"></i>Tạo CV đầu tiên
                                    </a>
                                </div>
                                `}
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        `;
    });
}

function renderApplicationRow(app) {
    const job = app.job || {};
    const company = job.company || {};
    const status = app.status || 'Pending';
    
    return `
        <a href="#/applications/${app.id}" class="flex items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors" data-link>
            <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate">${job.title || 'Việc làm'}</p>
                <p class="text-sm text-gray-500 truncate">${company.name || 'Công ty'}</p>
            </div>
            <span class="px-3 py-1 ${getApplicationStatusColor(status)} rounded-full text-xs font-medium">${getApplicationStatusLabel(status)}</span>
            <span class="ml-3 text-sm text-gray-500">${formatRelativeTime(app.appliedAt)}</span>
        </a>
    `;
}

function renderResumeCard(resume) {
    return `
        <div class="border border-gray-100 rounded-xl p-4 hover:border-primary-200 hover:shadow-md transition-colors">
            <div class="flex items-start justify-between mb-2">
                <h4 class="font-semibold text-gray-900">${resume.title}</h4>
                ${resume.isDefault ? '<span class="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">Mặc định</span>' : ''}
            </div>
            <p class="text-sm text-gray-500 mb-3">Cập nhật: ${formatDate(resume.updatedAt)}</p>
            <div class="flex items-center gap-2">
                <a href="#/resumes/${resume.id}" class="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-center text-sm font-medium hover:bg-primary-700" data-link>Xem</a>
                <a href="#/resumes/${resume.id}/edit" class="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg text-center text-sm font-medium hover:bg-gray-50" data-link>Sửa</a>
            </div>
        </div>
    `;
}

function getGenderLabel(gender) {
    const labels = { 'Male': 'Nam', 'Female': 'Nữ', 'Other': 'Khác' };
    return labels[gender] || gender;
}

// Format helpers
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return formatDate(dateString);
}
function getApplicationStatusLabel(status) {
    const labels = { 'Pending': 'Chờ duyệt', 'UnderReview': 'Đang xem xét', 'Shortlisted': 'Đã lọc', 'InterviewScheduled': 'Đã lên lịch PV', 'Interviewed': 'Đã phỏng vấn', 'Offered': 'Đã đề nghị', 'Accepted': 'Đã chấp nhận', 'Rejected': 'Đã từ chối', 'Withdrawn': 'Đã rút đơn' };
    return labels[status] || status;
}
function getApplicationStatusColor(status) {
    const colors = { 'Pending': 'bg-yellow-100 text-yellow-800', 'UnderReview': 'bg-blue-100 text-blue-800', 'Shortlisted': 'bg-purple-100 text-purple-800', 'InterviewScheduled': 'bg-indigo-100 text-indigo-800', 'Interviewed': 'bg-teal-100 text-teal-800', 'Offered': 'bg-green-100 text-green-800', 'Accepted': 'bg-emerald-100 text-emerald-800', 'Rejected': 'bg-red-100 text-red-800', 'Withdrawn': 'bg-gray-100 text-gray-800' };
    return colors[status] || 'bg-gray-100 text-gray-800';
}
