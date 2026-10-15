// Admin Applications Page
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
        const jobId = params.jobId ? parseInt(params.jobId) : null;
        const companyId = params.companyId ? parseInt(params.companyId) : null;

        const queryParams = { pageNumber: page, pageSize, sortBy: 'AppliedAt', sortDirection: 'desc' };
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (jobId) queryParams.jobId = jobId;
        if (companyId) queryParams.companyId = companyId;

        const result = await api.get('/admin/applications', queryParams);
        const applications = result.data?.items || result.data || [];
        const totalCount = result.data?.totalCount || 0;
        const totalPages = Math.ceil(totalCount / pageSize);

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý đơn ứng tuyển</h1>
                        <p class="text-gray-500 mt-1">Xem, tìm kiếm, duyệt/từ chối đơn ứng tuyển</p>
                    </div>
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
                    <form id="filter-form" class="flex flex-col md:flex-row gap-4">
                        <div class="flex-1">
                            <input type="text" name="search" value="${search || ''}" placeholder="Tìm kiếm việc làm, ứng viên, email..."
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        </div>
                        <div>
                            <select name="status" class="w-full md:w-40 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                <option value="">Tất cả trạng thái</option>
                                <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>Chờ duyệt</option>
                                <option value="Reviewed" ${status === 'Reviewed' ? 'selected' : ''}>Đã xem</option>
                                <option value="Interviewing" ${status === 'Interviewing' ? 'selected' : ''}>Phỏng vấn</option>
                                <option value="Accepted" ${status === 'Accepted' ? 'selected' : ''}>Chấp nhận</option>
                                <option value="Rejected" ${status === 'Rejected' ? 'selected' : ''}>Từ chối</option>
                            </select>
                        </div>
                        <button type="submit" class="px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
                            <i class="fas fa-filter mr-1"></i>Lọc
                        </button>
                        <a href="#/admin/applications" class="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">Xóa lọc</a>
                    </form>
                </div>

                <!-- Applications Table -->
                ${applications.length > 0 ? `
                <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Đơn ứng tuyển</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Việc làm</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Công ty</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ứng viên</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày nộp</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                ${applications.map(app => `
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <button onclick="viewApplication(${app.id})" class="text-primary-600 hover:text-primary-800 font-medium">
                                            #${app.id}
                                        </button>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="font-medium text-gray-900">${escapeHtml(app.jobTitle)}</div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="text-gray-700">${escapeHtml(app.companyName)}</div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="font-medium text-gray-900">${escapeHtml(app.candidateName)}</div>
                                        <div class="text-sm text-gray-500">${escapeHtml(app.candidateEmail)}</div>
                                    </td>
                                    <td class="px-6 py-4">
                                        ${renderStatusBadge(app.status)}
                                    </td>
                                    <td class="px-6 py-4 text-gray-600">
                                        ${formatDate(app.appliedAt)}
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="flex items-center space-x-2">
                                            <button onclick="viewApplication(${app.id})" class="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Xem chi tiết">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <div class="relative" id="status-dropdown-${app.id}">
                                                <button onclick="toggleStatusDropdown(${app.id})" class="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Thay đổi trạng thái">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <div class="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible transform translate-y-2 transition-all duration-200 z-20" id="dropdown-content-${app.id}">
                                                    <button onclick="updateApplicationStatus(${app.id}, 'Pending')" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors ${app.status === 'Pending' ? 'text-primary-600 font-medium' : ''}">Chờ duyệt</button>
                                                    <button onclick="updateApplicationStatus(${app.id}, 'Reviewed')" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors ${app.status === 'Reviewed' ? 'text-primary-600 font-medium' : ''}">Đã xem</button>
                                                    <button onclick="updateApplicationStatus(${app.id}, 'Interviewing')" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors ${app.status === 'Interviewing' ? 'text-primary-600 font-medium' : ''}">Phỏng vấn</button>
                                                    <button onclick="updateApplicationStatus(${app.id}, 'Accepted')" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors ${app.status === 'Accepted' ? 'text-primary-600 font-medium' : ''}">Chấp nhận</button>
                                                    <button onclick="updateApplicationStatus(${app.id}, 'Rejected')" class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors ${app.status === 'Rejected' ? 'font-medium' : ''}">Từ chối</button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    ${totalPages > 1 ? `
                    <div class="px-6 py-4 border-t border-gray-100">
                        <div class="flex items-center justify-between">
                            <div class="text-sm text-gray-600">
                                Hiển thị ${(page - 1) * pageSize + 1} - ${Math.min(page * pageSize, totalCount)} của ${totalCount} đơn
                            </div>
                            <div class="flex space-x-2">
                                ${page > 1 ? `<a href="#/admin/applications?page=${page - 1}${search ? '&search=' + search : ''}${status ? '&status=' + status : ''}${jobId ? '&jobId=' + jobId : ''}${companyId ? '&companyId=' + companyId : ''}" class="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors" data-link>Trước</a>` : ''}
                                ${page < totalPages ? `<a href="#/admin/applications?page=${page + 1}${search ? '&search=' + search : ''}${status ? '&status=' + status : ''}${jobId ? '&jobId=' + jobId : ''}${companyId ? '&companyId=' + companyId : ''}" class="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors" data-link>Sau</a>` : ''}
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>
                ` : `
                <div class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <i class="fas fa-file-alt text-5xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-900 mb-1">Không có đơn ứng tuyển</h3>
                    <p class="text-gray-500">Thử điều chỉnh bộ lọc hoặc quay lại sau</p>
                </div>
                `}
            </div>
        `;

        attachFilterHandler();
    });
}

function renderStatusBadge(status) {
    const badges = {
        'Pending': '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><i class="fas fa-clock mr-1"></i>Chờ duyệt</span>',
        'Reviewed': '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><i class="fas fa-eye mr-1"></i>Đã xem</span>',
        'Interviewing': '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><i class="fas fa-user-tie mr-1"></i>Phỏng vấn</span>',
        'Accepted': '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><i class="fas fa-check mr-1"></i>Chấp nhận</span>',
        'Rejected': '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><i class="fas fa-times mr-1"></i>Từ chối</span>',
    };
    return badges[status] || `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">${escapeHtml(status)}</span>`;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
        router.navigate(`/admin/applications?${params.toString()}`);
    });
}

// Global functions
window.viewApplication = async function(applicationId) {
    const result = await api.get(`/admin/applications/${applicationId}`);
    if (result.error) {
        showToast(result.error, 'error');
        return;
    }
    
    const app = result.data;
    showApplicationModal(app);
};

window.toggleStatusDropdown = function(applicationId) {
    // Close all other dropdowns
    document.querySelectorAll('[id^="dropdown-content-"]').forEach(d => {
        if (d.id !== `dropdown-content-${applicationId}`) {
            d.classList.add('opacity-0', 'invisible', 'translate-y-2');
            d.classList.remove('opacity-100', 'visible', 'translate-y-0');
        }
    });
    
    const dropdown = document.getElementById(`dropdown-content-${applicationId}`);
    if (dropdown) {
        const isOpen = !dropdown.classList.contains('opacity-0');
        if (isOpen) {
            dropdown.classList.add('opacity-0', 'invisible', 'translate-y-2');
            dropdown.classList.remove('opacity-100', 'visible', 'translate-y-0');
        } else {
            dropdown.classList.remove('opacity-0', 'invisible', 'translate-y-2');
            dropdown.classList.add('opacity-100', 'visible', 'translate-y-0');
        }
    }
};

window.updateApplicationStatus = async function(applicationId, status) {
    let rejectionReason = '';
    let note = '';
    
    if (status === 'Rejected') {
        rejectionReason = prompt('Lý do từ chối (tùy chọn):') || '';
        if (rejectionReason === null) return; // User cancelled
    }
    
    note = prompt('Ghi chú (tùy chọn):') || '';
    if (note === null) return; // User cancelled
    
    const result = await api.put(`/admin/applications/${applicationId}/status`, { 
        status, 
        rejectionReason, 
        note 
    });
    
    // Close dropdown
    const dropdown = document.getElementById(`dropdown-content-${applicationId}`);
    if (dropdown) {
        dropdown.classList.add('opacity-0', 'invisible', 'translate-y-2');
        dropdown.classList.remove('opacity-100', 'visible', 'translate-y-0');
    }
    
    if (result.error) {
        showToast(result.error, 'error');
    } else {
        showToast(`Đã cập nhật trạng thái: ${getStatusLabel(status)}`, 'success');
        router.handleRouteChange();
    }
};

function getStatusLabel(status) {
    const labels = {
        'Pending': 'Chờ duyệt',
        'Reviewed': 'Đã xem',
        'Interviewing': 'Phỏng vấn',
        'Accepted': 'Chấp nhận',
        'Rejected': 'Từ chối',
    };
    return labels[status] || status;
}

function showApplicationModal(app) {
    const modalHtml = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" id="application-modal">
            <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <div class="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
                    <h2 class="text-xl font-bold text-gray-900">Chi tiết đơn ứng tuyển #${app.id}</h2>
                    <button onclick="closeApplicationModal()" class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="p-6 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Việc làm</label>
                            <p class="font-medium text-gray-900">${escapeHtml(app.jobTitle)}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Công ty</label>
                            <p class="font-medium text-gray-900">${escapeHtml(app.companyName)}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Ứng viên</label>
                            <p class="font-medium text-gray-900">${escapeHtml(app.candidateName)}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Email</label>
                            <p class="font-medium text-gray-900">${escapeHtml(app.candidateEmail)}</p>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-500">Số điện thoại</label>
                            <p class="font-medium text-gray-900">${escapeHtml(app.candidatePhone || 'Chưa cung cấp')}</p>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-500">Địa chỉ</label>
                            <p class="font-medium text-gray-900">${escapeHtml(app.candidateAddress || 'Chưa cung cấp')}</p>
                        </div>
                    </div>
                    
                    <div class="border-t border-gray-100 pt-4">
                        <div class="flex items-center justify-between">
                            <label class="block text-sm font-medium text-gray-500">Trạng thái</label>
                            ${renderStatusBadge(app.status)}
                        </div>
                    </div>
                    
                    <div class="border-t border-gray-100 pt-4">
                        <label class="block text-sm font-medium text-gray-500 mb-2">Thư xin việc</label>
                        <div class="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
                            <pre class="whitespace-pre-wrap text-gray-700">${escapeHtml(app.coverLetter || 'Không có thư xin việc')}</pre>
                        </div>
                    </div>
                    
                    ${app.resumeUrl ? `
                    <div class="border-t border-gray-100 pt-4">
                        <label class="block text-sm font-medium text-gray-500 mb-2">CV/Resume</label>
                        <a href="${escapeHtml(app.resumeUrl)}" target="_blank" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                            <i class="fas fa-download mr-2"></i>Tải xuống CV
                        </a>
                    </div>
                    ` : ''}
                    
                    ${app.expectedSalary ? `
                    <div class="border-t border-gray-100 pt-4">
                        <label class="block text-sm font-medium text-gray-500">Mức lương mong muốn</label>
                        <p class="font-medium text-gray-900">${escapeHtml(app.expectedSalary)}</p>
                    </div>
                    ` : ''}
                    
                    ${app.note ? `
                    <div class="border-t border-gray-100 pt-4">
                        <label class="block text-sm font-medium text-gray-500">Ghi chú</label>
                        <p class="font-medium text-gray-900">${escapeHtml(app.note)}</p>
                    </div>
                    ` : ''}
                    
                    ${app.rejectionReason ? `
                    <div class="border-t border-gray-100 pt-4 bg-red-50 rounded-xl p-4">
                        <label class="block text-sm font-medium text-red-700">Lý do từ chối</label>
                        <p class="text-red-600">${escapeHtml(app.rejectionReason)}</p>
                    </div>
                    ` : ''}
                    
                    <div class="border-t border-gray-100 pt-4 flex justify-end space-x-3">
                        <button onclick="closeApplicationModal()" class="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">Đóng</button>
                        <button onclick="closeApplicationModal(); updateApplicationStatus(${app.id}, 'Accepted')" class="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">Chấp nhận</button>
                        <button onclick="closeApplicationModal(); updateApplicationStatus(${app.id}, 'Rejected')" class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">Từ chối</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existing = document.getElementById('application-modal');
    if (existing) existing.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Close on backdrop click
    document.getElementById('application-modal').addEventListener('click', (e) => {
        if (e.target.id === 'application-modal') {
            closeApplicationModal();
        }
    });
}

window.closeApplicationModal = function() {
    const modal = document.getElementById('application-modal');
    if (modal) {
        modal.querySelector('.bg-white').classList.add('animate-scale-out');
        setTimeout(() => modal.remove(), 200);
    }
};

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('[id^="status-dropdown-"]')) {
        document.querySelectorAll('[id^="dropdown-content-"]').forEach(d => {
            d.classList.add('opacity-0', 'invisible', 'translate-y-2');
            d.classList.remove('opacity-100', 'visible', 'translate-y-0');
        });
    }
});
