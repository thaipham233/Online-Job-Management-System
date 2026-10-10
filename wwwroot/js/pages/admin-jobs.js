// Admin Jobs Page
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
        const status = params.status;

        const queryParams = { pageNumber: page, pageSize, sortBy: 'CreatedAt', sortDirection: 'desc' };
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;

        const result = await api.get('/admin/jobs', queryParams);
        const jobs = result.data?.items || result.data || [];
        const totalCount = result.data?.totalCount || 0;
        const totalPages = Math.ceil(totalCount / pageSize);

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý việc làm</h1>
                        <p class="text-gray-500 mt-1">Duyệt, ẩn, xóa tin tuyển dụng</p>
                    </div>
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
                    <form id="filter-form" class="flex flex-col md:flex-row gap-4">
                        <div class="flex-1">
                            <input type="text" name="search" value="${search || ''}" placeholder="Tìm kiếm tiêu đề, công ty..."
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        </div>
                        <div>
                            <select name="status" class="w-full md:w-48 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                <option value="">Tất cả trạng thái</option>
                                <option value="Draft" ${status === 'Draft' ? 'selected' : ''}>Nháp</option>
                                <option value="Open" ${status === 'Open' ? 'selected' : ''}>Đang tuyển</option>
                                <option value="Closed" ${status === 'Closed' ? 'selected' : ''}>Đã đóng</option>
                                <option value="Paused" ${status === 'Paused' ? 'selected' : ''}>Tạm dừng</option>
                                <option value="Expired" ${status === 'Expired' ? 'selected' : ''}>Hết hạn</option>
                            </select>
                        </div>
                        <button type="submit" class="px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
                            <i class="fas fa-filter mr-1"></i>Lọc
                        </button>
                        <a href="#/admin/jobs" class="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">Xóa lọc</a>
                    </form>
                </div>

                <!-- Jobs Table -->
                ${jobs.length > 0 ? `
                <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Việc làm</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Công ty</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Loại / Cấp độ</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lương</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Đơn / Xem</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                ${jobs.map(job => renderJobRow(job)).join('')}
                            </tbody>
                        </table>
                    </div>
                    ${totalPages > 1 ? renderPagination(page, totalPages, params) : ''}
                </div>
                ` : `
                <div class="text-center py-16">
                    <i class="fas fa-briefcase text-5xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy việc làm</h3>
                </div>
                `}
            </div>
        `;

        attachFilterHandler();
    });
}

function renderJobRow(job) {
    const statusColors = {
        'Draft': 'bg-gray-100 text-gray-700',
        'Open': 'bg-green-100 text-green-700',
        'Closed': 'bg-red-100 text-red-700',
        'Paused': 'bg-yellow-100 text-yellow-700',
        'Expired': 'bg-orange-100 text-orange-700'
    };
    const statusColor = statusColors[job.status] || 'bg-gray-100 text-gray-700';
    const salary = job.salaryMin || job.salaryMax ? `${formatSalary(job.salaryMin, job.salaryMax)}/${job.salaryType === 'Yearly' ? 'năm' : 'tháng'}` : 'Thương lượng';
    const applicationsCount = job.applicationsCount || 0;
    const viewsCount = job.viewsCount || 0;

    return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4">
                <div>
                    <p class="font-medium text-gray-900 truncate max-w-xs">${job.title}</p>
                    ${job.isHot ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 mt-1"><i class="fas fa-fire mr-1"></i>Hot</span>' : ''}
                </div>
            </td>
            <td class="px-6 py-4">
                <p class="text-sm text-gray-600">${job.companyName || 'N/A'}</p>
            </td>
            <td class="px-6 py-4">
                <p class="text-sm text-gray-600">${job.jobType || 'N/A'}</p>
                <p class="text-xs text-gray-400">${job.experienceLevel || 'N/A'}</p>
            </td>
            <td class="px-6 py-4 text-gray-600 whitespace-nowrap">${salary}</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 ${statusColor} rounded-full text-xs font-medium">${job.status}</span>
            </td>
            <td class="px-6 py-4 text-gray-500 text-sm">${applicationsCount} đơn / ${viewsCount} xem</td>
            <td class="px-6 py-4 text-gray-500">${formatDate(job.createdAt)}</td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                    <a href="#/jobs/${job.id}" class="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors" data-link target="_blank">
                        <i class="fas fa-eye mr-1"></i>Xem
                    </a>
                    ${job.status === 'Open' ? `
                        <button onclick="changeJobStatus(${job.id}, 'Paused')" class="px-3 py-1.5 text-sm border border-yellow-200 text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors">
                            <i class="fas fa-pause mr-1"></i>Tạm dừng
                        </button>
                    ` : job.status === 'Paused' ? `
                        <button onclick="changeJobStatus(${job.id}, 'Open')" class="px-3 py-1.5 text-sm border border-green-200 text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                            <i class="fas fa-play mr-1"></i>Mở lại
                        </button>
                    ` : ''}
                    <button onclick="deleteJob(${job.id})" class="px-3 py-1.5 text-sm border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <i class="fas fa-trash mr-1"></i>Xóa
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function renderPagination(currentPage, totalPages, params) {
    const buildUrl = (page) => {
        const newParams = { ...params, page };
        return `#/admin/jobs?${new URLSearchParams(newParams).toString()}`;
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

window.changeJobStatus = async function(jobId, newStatus) {
    const result = await api.put(`/admin/jobs/${jobId}/status`, { status: newStatus });
    if (result.error) showToast(result.error, 'error');
    else { showToast(`Đã cập nhật trạng thái thành ${newStatus}`, 'success'); router.handleRouteChange(); }
};

window.deleteJob = async function(jobId) {
    if (!confirm('Xóa việc làm này? Hành động không thể hoàn tác.')) return;
    const result = await api.delete(`/admin/jobs/${jobId}`);
    if (result.error) showToast(result.error, 'error');
    else { showToast('Đã xóa việc làm', 'success'); router.handleRouteChange(); }
};

function formatSalary(min, max, type = 'Monthly') {
    if (!min && !max) return 'Thương lượng';
    const format = (num) => {
        if (num >= 1e9) return (num / 1e9).toFixed(1).replace('.0', '') + ' tỷ';
        if (num >= 1e6) return (num / 1e6).toFixed(1).replace('.0', '') + ' triệu';
        return num.toLocaleString('vi-VN');
    };
    if (min && max) return `${format(min)} - ${format(max)}`;
    if (min) return `Từ ${format(min)}`;
    return `Đến ${format(max)}`;
}

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
        router.navigate(`/admin/jobs?${params.toString()}`);
    });
}
