// My Applications Page
export async function render(container) {
    requireAuth(async () => {
        const params = router.getQueryParams();
        const page = parseInt(params.page) || 1;
        const pageSize = 10;
        const status = params.status;

        const queryParams = {
            pageNumber: page,
            pageSize: pageSize,
            sortBy: 'AppliedAt',
            sortDirection: 'desc'
        };
        if (status) queryParams.status = status;

        const result = await api.getApplications(queryParams);
        const applications = result.data?.items || result.data || [];
        const totalCount = result.data?.totalCount || 0;
        const totalPages = Math.ceil(totalCount / pageSize);

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Đơn ứng tuyển của tôi</h1>
                        <p class="text-gray-500 mt-1">Theo dõi tiến trình các đơn đã nộp</p>
                    </div>
                </div>

                <!-- Status Filter Tabs -->
                <div class="bg-white rounded-2xl border border-gray-100 p-2 mb-6">
                    <div class="flex flex-wrap gap-2" id="status-tabs">
                        ${['', 'Pending', 'UnderReview', 'Shortlisted', 'InterviewScheduled', 'Interviewed', 'Offered', 'Accepted', 'Rejected', 'Withdrawn'].map(s => `
                            <a href="#/applications${s ? `?status=${s}` : ''}" 
                               class="px-4 py-2 rounded-xl text-sm font-medium transition-all ${!status && !s ? 'bg-primary-600 text-white' : status === s ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}" 
                               data-link>
                                ${s ? getApplicationStatusLabel(s) : 'Tất cả'}
                            </a>
                        `).join('')}
                    </div>
                </div>

                <!-- Applications List -->
                ${applications.length > 0 ? `
                <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Việc làm</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Công ty</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày nộp</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                ${applications.map(app => renderApplicationTableRow(app)).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    ${totalPages > 1 ? renderPagination(page, totalPages, params) : ''}
                </div>
                ` : `
                <div class="text-center py-16">
                    <i class="fas fa-file-alt text-5xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Chưa có đơn ứng tuyển nào</h3>
                    <p class="text-gray-500 mb-6">${status ? 'Không có đơn nào ở trạng thái này' : 'Bạn chưa nộp đơn cho vị trí nào'}</p>
                    <a href="#/jobs" class="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 inline-flex" data-link>
                        <i class="fas fa-search mr-2"></i>Tìm việc làm ngay
                    </a>
                </div>
                `}
            </div>
        `;
    });
}

function renderApplicationTableRow(app) {
    const job = app.job || {};
    const company = job.company || {};
    const status = app.status || 'Pending';
    
    return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4">
                <a href="#/jobs/${job.id}" class="font-medium text-gray-900 hover:text-primary-600" data-link>${job.title || 'Việc làm'}</a>
                <p class="text-sm text-gray-500">${getJobTypeLabel(job.jobType)} • ${job.location || 'Chưa cập nhật'}</p>
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <img src="${company.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name || 'Company')}&background=0ea5e9&color=fff&size=32`}" alt="" class="w-8 h-8 rounded-full mr-3" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(company.name || 'Company')}&background=0ea5e9&color=fff&size=32'">
                    <span class="text-gray-900">${company.name || 'Công ty riêng tư'}</span>
                </div>
            </td>
            <td class="px-6 py-4 text-gray-500">${formatDate(app.appliedAt)}</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 ${getApplicationStatusColor(status)} rounded-full text-xs font-medium">${getApplicationStatusLabel(status)}</span>
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                    <a href="#/applications/${app.id}" class="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" data-link>Chi tiết</a>
                    ${status === 'Pending' || status === 'UnderReview' ? `
                        <button onclick="withdrawApplication('${app.id}')" class="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">Rút đơn</button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `;
}

function renderPagination(currentPage, totalPages, params) {
    const buildUrl = (page) => {
        const newParams = { ...params, page };
        delete newParams.page; // Remove existing page
        newParams.page = page;
        return `#/applications?${new URLSearchParams(newParams).toString()}`;
    };

    let pages = [];
    if (totalPages <= 7) {
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
        pages = [1];
        if (currentPage > 3) pages.push('...');
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push('...');
        pages.push(totalPages);
    }

    return `
        <div class="px-6 py-4 border-t border-gray-100">
            <nav class="flex items-center justify-center gap-2" aria-label="Pagination">
                <a href="${buildUrl(currentPage - 1)}" class="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}" data-link ${currentPage === 1 ? 'tabindex="-1"' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </a>
                ${pages.map(p => {
                    if (p === '...') return '<span class="px-3 py-2 text-gray-400">...</span>';
                    return `<a href="${buildUrl(p)}" class="px-4 py-2 rounded-lg ${p === currentPage ? 'bg-primary-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}" data-link>${p}</a>`;
                }).join('')}
                <a href="${buildUrl(currentPage + 1)}" class="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}" data-link ${currentPage === totalPages ? 'tabindex="-1"' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </a>
            </nav>
        </div>
    `;
}

// Make withdrawApplication globally accessible
window.withdrawApplication = async function(applicationId) {
    if (!confirm('Bạn có chắc chắn muốn rút đơn ứng tuyển này?')) return;
    
    const result = await api.put(`/applications/${applicationId}/withdraw`);
    if (result.error) {
        showToast(result.error, 'error');
    } else {
        showToast('Đã rút đơn ứng tuyển', 'success');
        router.handleRouteChange(); // Refresh current page
    }
};

// Format helpers
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function getJobTypeLabel(type) {
    const labels = { 'FullTime': 'Toàn thời gian', 'PartTime': 'Bán thời gian', 'Contract': 'Hợp đồng', 'Internship': 'Thực tập', 'Freelance': 'Freelance', 'Remote': 'Từ xa' };
    return labels[type] || type;
}
function getApplicationStatusLabel(status) {
    const labels = { 'Pending': 'Chờ duyệt', 'UnderReview': 'Đang xem xét', 'Shortlisted': 'Đã lọc', 'InterviewScheduled': 'Đã lên lịch PV', 'Interviewed': 'Đã phỏng vấn', 'Offered': 'Đã đề nghị', 'Accepted': 'Đã chấp nhận', 'Rejected': 'Đã từ chối', 'Withdrawn': 'Đã rút đơn' };
    return labels[status] || status;
}
function getApplicationStatusColor(status) {
    const colors = { 'Pending': 'bg-yellow-100 text-yellow-800', 'UnderReview': 'bg-blue-100 text-blue-800', 'Shortlisted': 'bg-purple-100 text-purple-800', 'InterviewScheduled': 'bg-indigo-100 text-indigo-800', 'Interviewed': 'bg-teal-100 text-teal-800', 'Offered': 'bg-green-100 text-green-800', 'Accepted': 'bg-emerald-100 text-emerald-800', 'Rejected': 'bg-red-100 text-red-800', 'Withdrawn': 'bg-gray-100 text-gray-800' };
    return colors[status] || 'bg-gray-100 text-gray-800';
}
