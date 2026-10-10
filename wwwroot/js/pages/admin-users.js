// Admin Users Page
export async function render(container) {
    requireAuth(async () => {
        if (!auth.hasRole('Admin')) {
            showToast('Bạn không có quyền truy cập', 'error');
            router.navigate('/');
            return;
        }

        const params = router.getQueryParams();
        const page = parseInt(params.page) || 1;
        const pageSize = 15;
        const role = params.role;
        const search = params.search;
        const status = params.status;

        const queryParams = { pageNumber: page, pageSize, sortBy: 'CreatedAt', sortDirection: 'desc' };
        if (role) queryParams.role = role;
        if (search) queryParams.search = search;
        if (status) queryParams.isActive = status === 'Active';

        const result = await api.get('/admin/users', queryParams);
        const users = result.data?.items || result.data || [];
        const totalCount = result.data?.totalCount || 0;
        const totalPages = Math.ceil(totalCount / pageSize);

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
                        <p class="text-gray-500 mt-1">Xem, tìm kiếm, khóa/mở tài khoản, phân quyền</p>
                    </div>
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
                    <form id="filter-form" class="flex flex-col md:flex-row gap-4">
                        <div class="flex-1">
                            <input type="text" name="search" value="${search || ''}" placeholder="Tìm kiếm email, tên..."
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        </div>
                        <div>
                            <select name="role" class="w-full md:w-48 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                <option value="">Tất cả vai trò</option>
                                <option value="Candidate" ${role === 'Candidate' ? 'selected' : ''}>Ứng viên</option>
                                <option value="Employer" ${role === 'Employer' ? 'selected' : ''}>Nhà tuyển dụng</option>
                                <option value="Admin" ${role === 'Admin' ? 'selected' : ''}>Admin</option>
                            </select>
                        </div>
                        <div>
                            <select name="status" class="w-full md:w-40 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                <option value="">Tất cả</option>
                                <option value="Active" ${status === 'Active' ? 'selected' : ''}>Hoạt động</option>
                                <option value="Inactive" ${status === 'Inactive' ? 'selected' : ''}>Đã khóa</option>
                            </select>
                        </div>
                        <button type="submit" class="px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
                            <i class="fas fa-filter mr-1"></i>Lọc
                        </button>
                        <a href="#/admin/users" class="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                            Xóa lọc
                        </a>
                    </form>
                </div>

                <!-- Users Table -->
                ${users.length > 0 ? `
                <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Người dùng</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vai trò</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cập nhật</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                ${users.map(user => renderUserRow(user)).join('')}
                            </tbody>
                        </table>
                    </div>
                    ${totalPages > 1 ? renderPagination(page, totalPages, params) : ''}
                </div>
                ` : `
                <div class="text-center py-16">
                    <i class="fas fa-users text-5xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy người dùng</h3>
                    <p class="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
                </div>
                `}
            </div>
        `;

        attachFilterHandler();
    });
}

function renderUserRow(user) {
    const roles = user.roles || [];
    const roleLabels = roles.map(r => {
        const colors = { 'Admin': 'bg-red-100 text-red-700', 'Employer': 'bg-purple-100 text-purple-700', 'Candidate': 'bg-blue-100 text-blue-700' };
        return `<span class="px-2 py-1 ${colors[r] || 'bg-gray-100 text-gray-700'} rounded-full text-xs font-medium mr-1">${r}</span>`;
    }).join('');

    const isActive = user.isActive !== false;
    const statusClass = isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    const statusLabel = isActive ? 'Hoạt động' : 'Đã khóa';

    return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <img src="${user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email)}&background=0ea5e9&color=fff&size=32`}" alt="" class="w-10 h-10 rounded-full mr-3" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email)}&background=0ea5e9&color=fff&size=32'">
                    <div>
                        <p class="font-medium text-gray-900">${user.fullName || 'Chưa cập nhật'}</p>
                        <p class="text-sm text-gray-500">${user.email}</p>
                        ${user.phone ? `<p class="text-xs text-gray-400"><i class="fas fa-phone mr-1"></i>${user.phone}</p>` : ''}
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">${roleLabels}</div>
            </td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 ${statusClass} rounded-full text-xs font-medium">${statusLabel}</span>
            </td>
            <td class="px-6 py-4 text-gray-500">${formatDate(user.createdAt)}</td>
            <td class="px-6 py-4 text-gray-500">${user.updatedAt ? formatDate(user.updatedAt) : '-'}</td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                    <button onclick="toggleUserStatus(${user.id}, ${!isActive})" 
                            class="px-3 py-1.5 text-sm ${isActive ? 'border border-red-200 text-red-600 hover:bg-red-50' : 'border border-green-200 text-green-600 hover:bg-green-50'} rounded-lg transition-colors">
                        ${isActive ? '<i class="fas fa-lock mr-1"></i>Khóa' : '<i class="fas fa-unlock mr-1"></i>Mở'}
                    </button>
                    <button onclick="changeUserRole(${user.id})" 
                            class="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <i class="fas fa-user-tag mr-1"></i>Phân quyền
                    </button>
                    <a href="#/admin/users/${user.id}" class="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors" data-link>
                        <i class="fas fa-eye mr-1"></i>Chi tiết
                    </a>
                </div>
            </td>
        </tr>
    `;
}

function renderPagination(currentPage, totalPages, params) {
    const buildUrl = (page) => {
        const newParams = { ...params, page };
        return `#/admin/users?${new URLSearchParams(newParams).toString()}`;
    };

    let pages = [];
    if (totalPages <= 7) {
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
        pages = [1];
        if (currentPage > 3) pages.push('...');
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push('...');
        pages.push(totalPages);
    }

    return `
        <div class="px-6 py-4 border-t border-gray-100">
            <nav class="flex items-center justify-center gap-2" aria-label="Pagination">
                <a href="${buildUrl(currentPage - 1)}" class="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}" data-link ${currentPage === 1 ? 'tabindex="-1"' : ''}><i class="fas fa-chevron-left"></i></a>
                ${pages.map(p => p === '...' ? '<span class="px-3 py-2 text-gray-400">...</span>' : `<a href="${buildUrl(p)}" class="px-4 py-2 rounded-lg ${p === currentPage ? 'bg-primary-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}" data-link>${p}</a>`).join('')}
                <a href="${buildUrl(currentPage + 1)}" class="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}" data-link ${currentPage === totalPages ? 'tabindex="-1"' : ''}><i class="fas fa-chevron-right"></i></a>
            </nav>
        </div>
    `;
}

// Global functions
window.toggleUserStatus = async function(userId, activate) {
    const action = activate ? 'mở khóa' : 'khóa';
    if (!confirm(`Bạn có chắc chắn muốn ${action} người dùng này?`)) return;
    
    const result = await api.put(`/admin/users/${userId}/status`, { isActive: activate });
    if (result.error) showToast(result.error, 'error');
    else { showToast(`Đã ${action} người dùng`, 'success'); router.handleRouteChange(); }
};

window.changeUserRole = async function(userId) {
    const roles = ['Candidate', 'Employer', 'Admin'];
    const selected = prompt('Nhập vai trò (Candidate, Employer, Admin) - cách nhau bằng dấu phẩy nếu nhiều:');
    if (!selected) return;
    
    const roleList = selected.split(',').map(r => r.trim()).filter(r => roles.includes(r));
    if (roleList.length === 0) { showToast('Vai trò không hợp lệ', 'error'); return; }
    
    const result = await api.put(`/admin/users/${userId}/roles`, { roles: roleList });
    if (result.error) showToast(result.error, 'error');
    else { showToast('Đã cập nhật vai trò', 'success'); router.handleRouteChange(); }
};

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function attachFilterHandler() {
    const form = document.getElementById('filter-form');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const params = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            if (value) params.set(key, value);
        }
        router.navigate(`/admin/users?${params.toString()}`);
    });
}
