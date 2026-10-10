// Admin Companies Page
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
        const search = params.search;
        const verified = params.verified;

        const queryParams = { pageNumber: page, pageSize, sortBy: 'CreatedAt', sortDirection: 'desc' };
        if (search) queryParams.search = search;
        if (verified !== undefined) queryParams.isVerified = verified === 'true';

        const result = await api.get('/admin/companies', queryParams);
        const companies = result.data?.items || result.data || [];
        const totalCount = result.data?.totalCount || 0;
        const totalPages = Math.ceil(totalCount / pageSize);

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý công ty</h1>
                        <p class="text-gray-500 mt-1">Xem, tìm kiếm, xác thực công ty</p>
                    </div>
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
                    <form id="filter-form" class="flex flex-col md:flex-row gap-4">
                        <div class="flex-1">
                            <input type="text" name="search" value="${search || ''}" placeholder="Tìm kiếm tên, email..."
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        </div>
                        <div>
                            <select name="verified" class="w-full md:w-40 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                <option value="">Tất cả</option>
                                <option value="true" ${verified === 'true' ? 'selected' : ''}>Đã xác thực</option>
                                <option value="false" ${verified === 'false' ? 'selected' : ''}>Chưa xác thực</option>
                            </select>
                        </div>
                        <button type="submit" class="px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
                            <i class="fas fa-filter mr-1"></i>Lọc
                        </button>
                        <a href="#/admin/companies" class="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">Xóa lọc</a>
                    </form>
                </div>

                <!-- Companies Table -->
                ${companies.length > 0 ? `
                <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Công ty</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngành / Quy mô</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Xác thực</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Việc làm</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                ${companies.map(company => renderCompanyRow(company)).join('')}
                            </tbody>
                        </table>
                    </div>
                    ${totalPages > 1 ? renderPagination(page, totalPages, params) : ''}
                </div>
                ` : `
                <div class="text-center py-16">
                    <i class="fas fa-building text-5xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy công ty</h3>
                </div>
                `}
            </div>
        `;

        attachFilterHandler();
    });
}

function renderCompanyRow(company) {
    const isVerified = company.isVerified;
    const jobsCount = company.jobsCount || 0;

    return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mr-3 overflow-hidden">
                        ${company.logoUrl ? `<img src="${company.logoUrl}" alt="${company.name}" class="w-full h-full object-cover">` : `<i class="fas fa-building text-xl text-gray-400"></i>`}
                    </div>
                    <div>
                        <p class="font-medium text-gray-900">${company.name}</p>
                        <p class="text-sm text-gray-500">${company.email || 'Chưa có email'}</p>
                        ${company.website ? `<p class="text-xs text-gray-400"><i class="fas fa-globe mr-1"></i>${company.website}</p>` : ''}
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <p class="text-sm text-gray-600">${company.industry || 'Chưa cập nhật'}</p>
                <p class="text-xs text-gray-400">${company.size || 'Chưa cập nhật'} nhân viên</p>
            </td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium ${isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                    ${isVerified ? '<i class="fas fa-check-circle mr-1"></i>Đã xác thực' : '<i class="fas fa-clock mr-1"></i>Chờ xác thực'}
                </span>
            </td>
            <td class="px-6 py-4 text-gray-600">${jobsCount} việc làm</td>
            <td class="px-6 py-4 text-gray-500">${formatDate(company.createdAt)}</td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                    ${!isVerified ? `
                        <button onclick="verifyCompany(${company.id})" class="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <i class="fas fa-check mr-1"></i>Xác thực
                        </button>
                    ` : ''}
                    <a href="#/admin/companies/${company.id}" class="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors" data-link>
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
        return `#/admin/companies?${new URLSearchParams(newParams).toString()}`;
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

window.verifyCompany = async function(companyId) {
    if (!confirm('Xác thực công ty này?')) return;
    const result = await api.put(`/admin/companies/${companyId}/verify`, { isVerified: true });
    if (result.error) showToast(result.error, 'error');
    else { showToast('Đã xác thực công ty', 'success'); router.handleRouteChange(); }
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
        for (const [key, value] of formData.entries()) if (value) params.set(key, value);
        router.navigate(`/admin/companies?${params.toString()}`);
    });
}
