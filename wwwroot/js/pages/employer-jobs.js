// Employer Jobs List Page
export async function render(container) {
    requireAuth(async () => {
        if (!auth.isEmployer()) {
            showToast('Bạn không có quyền truy cập', 'error');
            router.navigate('/');
            return;
        }

        const params = router.getQueryParams();
        const page = parseInt(params.page) || 1;
        const pageSize = 10;
        const status = params.status;

        const queryParams = {
            companyId: auth.user?.companyId,
            pageNumber: page,
            pageSize: pageSize,
            sortBy: 'CreatedAt',
            sortDirection: 'desc'
        };
        if (status) queryParams.status = status;

        const result = await api.getJobs(queryParams);
        const jobs = result.data?.items || result.data || [];
        const totalCount = result.data?.totalCount || 0;
        const totalPages = Math.ceil(totalCount / pageSize);

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý việc làm</h1>
                        <p class="text-gray-500 mt-1">Tạo, chỉnh sửa và theo dõi tin tuyển dụng</p>
                    </div>
                    <a href="#/employer/jobs/create" class="px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors inline-flex items-center" data-link>
                        <i class="fas fa-plus mr-2"></i>Đăng việc mới
                    </a>
                </div>

                <!-- Status Tabs -->
                <div class="bg-white rounded-2xl border border-gray-100 p-2 mb-6">
                    <div class="flex flex-wrap gap-2" id="status-tabs">
                        ${['', 'Draft', 'Open', 'Closed', 'Paused', 'Expired'].map(s => `
                            <a href="#/employer/jobs${s ? `?status=${s}` : ''}" 
                               class="px-4 py-2 rounded-xl text-sm font-medium transition-all ${!status && !s ? 'bg-primary-600 text-white' : status === s ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}" 
                               data-link>
                                ${s ? getJobStatusLabel(s) : 'Tất cả'}
                                ${s && totalCount ? `<span class="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">${getStatusCount(jobs, s)}</span>` : ''}
                            </a>
                        `).join('')}
                    </div>
                </div>

                <!-- Jobs Table -->
                ${jobs.length > 0 ? `
                <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Việc làm</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Loại</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lương</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Đơn</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Xem</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                ${jobs.map(job => renderEmployerJobTableRow(job)).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    ${totalPages > 1 ? renderPagination(page, totalPages, params) : ''}
                </div>
                ` : `
                <div class="text-center py-16">
                    <i class="fas fa-briefcase text-5xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">${status ? `Không có việc làm ở trạng thái "${getJobStatusLabel(status)}"` : 'Chưa có việc làm nào'}</h3>
                    <p class="text-gray-500 mb-6">${status ? 'Thử chọn trạng thái khác' : 'Tạo tin tuyển dụng đầu tiên của bạn'}</p>
                    <a href="#/employer/jobs/create" class="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 inline-flex items-center" data-link>
                        <i class="fas fa-plus mr-2"></i>${status ? 'Tạo việc mới' : 'Đăng việc ngay'}
                    </a>
                </div>
                `}
            </div>
        `;
    });
}

function renderEmployerJobTableRow(job) {
    const status = job.status || 'Draft';
    const applicationsCount = job.applicationsCount || 0;
    const viewCount = job.viewCount || 0;
    const isHot = job.isHot;
    
    return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4">
                <div>
                    <p class="font-medium text-gray-900 truncate max-w-xs">${job.title}</p>
                    <p class="text-sm text-gray-500">${getJobTypeLabel(job.jobType)} • ${job.location || 'Chưa cập nhật'}</p>
                    ${isHot ? '<span class="inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium mt-1"><i class="fas fa-fire mr-1"></i>Hot</span>' : ''}
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">${getJobTypeLabel(job.jobType)}</span>
            </td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 ${getJobStatusColor(status)} rounded-full text-xs font-medium">${getJobStatusLabel(status)}</span>
            </td>
            <td class="px-6 py-4 text-gray-900 font-medium">${formatSalary(job.salaryMin, job.salaryMax, job.salaryType)}</td>
            <td class="px-6 py-4">
                <a href="#/employer/applications?jobId=${job.id}" class="text-primary-600 hover:text-primary-700 font-medium" data-link>${applicationsCount}</a>
            </td>
            <td class="px-6 py-4 text-gray-500">${viewCount}</td>
            <td class="px-6 py-4 text-gray-500">${formatDate(job.createdAt)}</td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                    <a href="#/employer/jobs/${job.id}/edit" class="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" data-link>Sửa</a>
                    <a href="#/jobs/${job.id}" class="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors" target="_blank" data-link>Xem</a>
                    ${status === 'Draft' ? `
                        <button onclick="publishJob('${job.id}')" class="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Xuất bản</button>
                    ` : status === 'Open' ? `
                        <button onclick="pauseJob('${job.id}')" class="px-3 py-1.5 text-sm border border-yellow-200 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors">Tạm dừng</button>
                        <button onclick="closeJob('${job.id}')" class="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">Đóng</button>
                    ` : status === 'Paused' ? `
                        <button onclick="publishJob('${job.id}')" class="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Mở lại</button>
                        <button onclick="closeJob('${job.id}')" class="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">Đóng</button>
                    ` : `
                        <button onclick="duplicateJob('${job.id}')" class="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Nhân bản</button>
                    `}
                    <button onclick="deleteJob('${job.id}')" class="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">Xóa</button>
                </div>
            </td>
        </tr>
    `;
}

function renderPagination(currentPage, totalPages, params) {
    const buildUrl = (page) => {
        const newParams = { ...params, page };
        return `#/employer/jobs?${new URLSearchParams(newParams).toString()}`;
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

// Global action functions
window.publishJob = async function(jobId) {
    if (!confirm('Xuất bản tin tuyển dụng này?')) return;
    await updateJobStatus(jobId, 'Open');
};

window.pauseJob = async function(jobId) {
    if (!confirm('Tạm dừng tin tuyển dụng này?')) return;
    await updateJobStatus(jobId, 'Paused');
};

window.closeJob = async function(jobId) {
    if (!confirm('Đóng tin tuyển dụng này?')) return;
    await updateJobStatus(jobId, 'Closed');
};

window.duplicateJob = async function(jobId) {
    const result = await api.post(`/jobs/${jobId}/duplicate`);
    if (result.error) showToast(result.error, 'error');
    else { showToast('Đã nhân bản', 'success'); router.handleRouteChange(); }
};

window.deleteJob = async function(jobId) {
    if (!confirm('Xóa vĩnh viễn tin tuyển dụng này?')) return;
    const result = await api.delete(`/jobs/${jobId}`);
    if (result.error) showToast(result.error, 'error');
    else { showToast('Đã xóa', 'success'); router.handleRouteChange(); }
};

async function updateJobStatus(jobId, status) {
    const result = await api.put(`/jobs/${jobId}/status`, { status });
    if (result.error) showToast(result.error, 'error');
    else { showToast(`Đã ${status === 'Open' ? 'xuất bản' : status === 'Paused' ? 'tạm dừng' : 'đóng'}`, 'success'); router.handleRouteChange(); }
}

function getStatusCount(jobs, status) {
    return jobs.filter(j => j.status === status).length;
}

// Format helpers
function formatDate(dateString) { return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
function getJobTypeLabel(type) { const labels = { 'FullTime': 'Toàn thời gian', 'PartTime': 'Bán thời gian', 'Contract': 'Hợp đồng', 'Internship': 'Thực tập', 'Freelance': 'Freelance', 'Remote': 'Từ xa' }; return labels[type] || type; }
function getJobStatusLabel(status) { const labels = { 'Draft': 'Nháp', 'Open': 'Đang tuyển', 'Closed': 'Đã đóng', 'Paused': 'Tạm dừng', 'Expired': 'Hết hạn' }; return labels[status] || status; }
function getJobStatusColor(status) { const colors = { 'Draft': 'bg-gray-100 text-gray-700', 'Open': 'bg-green-100 text-green-700', 'Closed': 'bg-red-100 text-red-700', 'Paused': 'bg-yellow-100 text-yellow-700', 'Expired': 'bg-gray-100 text-gray-500' }; return colors[status] || 'bg-gray-100 text-gray-700'; }
function formatSalary(min, max, type = 'Monthly') { if (!min && !max) return 'Thương lượng'; const format = (num) => { if (num >= 1e9) return (num / 1e9).toFixed(1).replace('.0', '') + ' tỷ'; if (num >= 1e6) return (num / 1e6).toFixed(1).replace('.0', '') + ' triệu'; return num.toLocaleString('vi-VN'); }; if (min && max) return `${format(min)} - ${format(max)}/${type === 'Monthly' ? 'tháng' : 'năm'}`; if (min) return `Từ ${format(min)}/${type === 'Monthly' ? 'tháng' : 'năm'}`; return `Đến ${format(max)}/${type === 'Monthly' ? 'tháng' : 'năm'}`; }
