// Employer Applications Page
export async function render(container) {
    requireAuth(async () => {
        if (!auth.isEmployer()) {
            showToast('Bạn không có quyền truy cập', 'error');
            router.navigate('/');
            return;
        }

        const params = router.getQueryParams();
        const page = parseInt(params.page) || 1;
        const pageSize = 15;
        const status = params.status;
        const jobId = params.jobId;

        const queryParams = {
            companyId: auth.user?.companyId,
            pageNumber: page,
            pageSize: pageSize,
            sortBy: 'AppliedAt',
            sortDirection: 'desc'
        };
        if (status) queryParams.status = status;
        if (jobId) queryParams.jobId = jobId;

        const result = await api.get('/employer/applications', queryParams);
        const applications = result.data?.items || result.data || [];
        const totalCount = result.data?.totalCount || 0;
        const totalPages = Math.ceil(totalCount / pageSize);

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý ứng viên</h1>
                        <p class="text-gray-500 mt-1">Xem xét và xử lý đơn ứng tuyển</p>
                    </div>
                </div>

                <!-- Filter Bar -->
                <div class="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
                    <div class="flex flex-col md:flex-row md:items-center gap-4">
                        <div class="flex flex-wrap gap-2">
                            ${['', 'Pending', 'UnderReview', 'Shortlisted', 'InterviewScheduled', 'Interviewed', 'Offered', 'Accepted', 'Rejected', 'Withdrawn'].map(s => `
                                <a href="#/employer/applications${(status || jobId) ? `?${new URLSearchParams({...params, status: s, page: 1}).toString()}` : ''}" 
                                   class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!status && !s ? 'bg-primary-600 text-white' : status === s ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}" 
                                   data-link>
                                    ${s ? getApplicationStatusLabel(s) : 'Tất cả'}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Applications Table -->
                ${applications.length > 0 ? `
                <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ứng viên</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Việc làm</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">CV</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày nộp</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                ${applications.map(app => renderEmployerApplicationTableRow(app)).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    ${totalPages > 1 ? renderPagination(page, totalPages, params) : ''}
                </div>
                ` : `
                <div class="text-center py-16">
                    <i class="fas fa-users text-5xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">${status ? `Không có đơn ở trạng thái "${getApplicationStatusLabel(status)}"` : 'Chưa có đơn ứng tuyển nào'}</h3>
                    <p class="text-gray-500">${jobId ? 'Vị trí này chưa nhận đơn nào' : 'Đơn ứng tuyển sẽ hiển thị ở đây'}</p>
                </div>
                `}
            </div>
        `;
    });
}

function renderEmployerApplicationTableRow(app) {
    const job = app.job || {};
    const candidate = app.candidate || app.user || {};
    const status = app.status || 'Pending';
    const resume = app.resume || {};
    const coverLetter = app.coverLetter;
    
    return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <img src="${candidate.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.fullName || candidate.email || 'User')}&background=0ea5e9&color=fff&size=32`}" alt="" class="w-10 h-10 rounded-full mr-3" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.fullName || candidate.email || 'User')}&background=0ea5e9&color=fff&size=32'">
                    <div>
                        <p class="font-medium text-gray-900">${candidate.fullName || 'Chưa cập nhật'}</p>
                        <p class="text-sm text-gray-500">${candidate.email || ''}</p>
                        ${candidate.phone ? `<p class="text-sm text-gray-400"><i class="fas fa-phone mr-1"></i>${candidate.phone}</p>` : ''}
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <a href="#/employer/jobs/${job.id}" class="font-medium text-gray-900 hover:text-primary-600" data-link>${job.title || 'Việc làm'}</a>
            </td>
            <td class="px-6 py-4">
                <div>
                    <a href="#/resumes/${resume.id}" class="font-medium text-primary-600 hover:text-primary-700" data-link target="_blank">${resume.title || 'CV'}</a>
                    ${coverLetter ? '<p class="text-sm text-gray-500 mt-1"><i class="fas fa-file-alt mr-1"></i>Có thư xin việc</p>' : ''}
                </div>
            </td>
            <td class="px-6 py-4 text-gray-500">${formatDate(app.appliedAt)}</td>
            <td class="px-6 py-4">
                <select class="status-select px-3 py-1.5 rounded-lg text-xs font-medium border ${getApplicationStatusColor(status).replace('bg-', 'border-').replace('text-', 'bg-')}" 
                        data-application-id="${app.id}" 
                        onchange="updateApplicationStatus('${app.id}', this.value)">
                    ${['Pending', 'UnderReview', 'Shortlisted', 'InterviewScheduled', 'Interviewed', 'Offered', 'Accepted', 'Rejected', 'Withdrawn'].map(s => `
                        <option value="${s}" ${status === s ? 'selected' : ''}>${getApplicationStatusLabel(s)}</option>
                    `).join('')}
                </select>
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                    <a href="#/employer/applications/${app.id}" class="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" data-link>Chi tiết</a>
                    ${status === 'InterviewScheduled' ? `
                        <button onclick="viewInterview('${app.id}')" class="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Phỏng vấn</button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `;
}

function renderPagination(currentPage, totalPages, params) {
    const buildUrl = (page) => {
        const newParams = { ...params, page };
        return `#/employer/applications?${new URLSearchParams(newParams).toString()}`;
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

// Global function
window.updateApplicationStatus = async function(applicationId, newStatus) {
    const result = await api.put(`/applications/${applicationId}/status`, { status: newStatus });
    if (result.error) {
        showToast(result.error, 'error');
        router.handleRouteChange(); // Reset select
    } else {
        showToast(`Đã cập nhật trạng thái: ${getApplicationStatusLabel(newStatus)}`, 'success');
    }
};

window.viewInterview = function(applicationId) {
    router.navigate(`/employer/applications/${applicationId}/interview`);
};

// Format helpers
function formatDate(dateString) { return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
function getApplicationStatusLabel(status) { const labels = { 'Pending': 'Chờ duyệt', 'UnderReview': 'Đang xem xét', 'Shortlisted': 'Đã lọc', 'InterviewScheduled': 'Đã lên lịch PV', 'Interviewed': 'Đã phỏng vấn', 'Offered': 'Đã đề nghị', 'Accepted': 'Đã chấp nhận', 'Rejected': 'Đã từ chối', 'Withdrawn': 'Đã rút đơn' }; return labels[status] || status; }
function getApplicationStatusColor(status) { const colors = { 'Pending': 'bg-yellow-100 text-yellow-800', 'UnderReview': 'bg-blue-100 text-blue-800', 'Shortlisted': 'bg-purple-100 text-purple-800', 'InterviewScheduled': 'bg-indigo-100 text-indigo-800', 'Interviewed': 'bg-teal-100 text-teal-800', 'Offered': 'bg-green-100 text-green-800', 'Accepted': 'bg-emerald-100 text-emerald-800', 'Rejected': 'bg-red-100 text-red-800', 'Withdrawn': 'bg-gray-100 text-gray-800' }; return colors[status] || 'bg-gray-100 text-gray-800'; }
