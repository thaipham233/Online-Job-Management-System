// Saved Jobs Page
export async function render(container) {
    requireAuth(async () => {
        const params = router.getQueryParams();
        const page = parseInt(params.page) || 1;
        const pageSize = 12;

        const result = await api.get('/users/saved-jobs', { 
            pageNumber: page, 
            pageSize: pageSize,
            sortBy: 'SavedAt',
            sortDirection: 'desc'
        });
        
        const savedJobs = result.data?.items || result.data || [];
        const totalCount = result.data?.totalCount || 0;
        const totalPages = Math.ceil(totalCount / pageSize);

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Việc làm đã lưu</h1>
                        <p class="text-gray-500 mt-1">${totalCount} vị trí</p>
                    </div>
                </div>

                ${savedJobs.length > 0 ? `
                <div id="saved-jobs-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    ${savedJobs.map(item => renderSavedJobCard(item)).join('')}
                </div>
                
                ${totalPages > 1 ? renderPagination(page, totalPages, params) : ''}
                ` : `
                <div class="text-center py-16">
                    <i class="fas fa-bookmark text-5xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Chưa lưu việc làm nào</h3>
                    <p class="text-gray-500 mb-6">Nhấn biểu tượng bookmark trên việc làm để lưu lại</p>
                    <a href="#/jobs" class="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 inline-flex" data-link>
                        <i class="fas fa-search mr-2"></i>Tìm việc để lưu
                    </a>
                </div>
                `}
            </div>
        `;

        attachUnsaveHandlers();
    });
}

function renderSavedJobCard(item) {
    const job = item.job || item;
    const company = job.company || {};
    const savedAt = item.savedAt || job.createdAt;
    const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryType);
    const location = job.location || 'Chưa cập nhật';
    const companyName = company.name || 'Công ty riêng tư';
    const companyLogo = company.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=0ea5e9&color=fff&size=120`;
    
    return `
        <article class="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-primary-100 transition-all duration-300 group relative" data-job-id="${job.id}">
            <button class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-gray-400 transition-colors unsave-btn" data-job-id="${job.id}" title="Bỏ lưu">
                <i class="fas fa-bookmark text-lg"></i>
            </button>
            <div class="flex items-start space-x-4 mb-4">
                <img src="${companyLogo}" alt="${companyName}" class="w-12 h-12 rounded-xl object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=0ea5e9&color=fff&size=120'">
                <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 truncate">${job.title}</h3>
                    <p class="text-sm text-gray-500 truncate">${companyName}</p>
                </div>
            </div>
            <div class="flex flex-wrap gap-2 mb-4">
                <span class="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">${getJobTypeLabel(job.jobType)}</span>
                <span class="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs">${getExperienceLevelLabel(job.experienceLevel)}</span>
            </div>
            <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-500">
                    <i class="fas fa-map-marker-alt mr-2 text-primary-500 w-5"></i>
                    <span class="truncate">${location}</span>
                </div>
                <div class="flex items-center text-sm text-gray-500">
                    <i class="fas fa-calendar-alt mr-2 text-gray-400 w-5"></i>
                    <span>Đã lưu: ${formatRelativeTime(savedAt)}</span>
                </div>
            </div>
            <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span class="text-lg font-bold text-primary-600">${salary}</span>
                <a href="#/jobs/${job.id}" class="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm" data-link>
                    Xem chi tiết
                </a>
            </div>
        </article>
    `;
}

function renderPagination(currentPage, totalPages, params) {
    const buildUrl = (page) => {
        const newParams = { ...params, page };
        return `#/saved-jobs?${new URLSearchParams(newParams).toString()}`;
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
    `;
}

function attachUnsaveHandlers() {
    document.querySelectorAll('.unsave-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            const jobId = btn.dataset.jobId;
            if (!confirm('Bỏ lưu việc làm này?')) return;
            
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            const result = await api.delete(`/users/saved-jobs/${jobId}`);
            
            if (result.error) {
                showToast(result.error, 'error');
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-bookmark text-lg"></i>';
            } else {
                showToast('Đã bỏ lưu', 'success');
                // Remove card with animation
                const card = btn.closest('article');
                card.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    card.remove();
                    // Check if grid is empty
                    const grid = document.getElementById('saved-jobs-grid');
                    if (grid && grid.children.length === 0) {
                        router.handleRouteChange(); // Refresh to show empty state
                    }
                }, 300);
            }
        });
    });
}

// Format helpers
function formatSalary(min, max, type = 'Monthly') {
    if (!min && !max) return 'Thương lượng';
    const format = (num) => {
        if (num >= 1e9) return (num / 1e9).toFixed(1).replace('.0', '') + ' tỷ';
        if (num >= 1e6) return (num / 1e6).toFixed(1).replace('.0', '') + ' triệu';
        return num.toLocaleString('vi-VN');
    };
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
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
    return `${Math.floor(diffDays / 365)} năm trước`;
}
function getJobTypeLabel(type) {
    const labels = { 'FullTime': 'Toàn thời gian', 'PartTime': 'Bán thời gian', 'Contract': 'Hợp đồng', 'Internship': 'Thực tập', 'Freelance': 'Freelance', 'Remote': 'Từ xa' };
    return labels[type] || type;
}
function getExperienceLevelLabel(level) {
    const labels = { 'Fresher': 'Mới tốt nghiệp', 'Junior': 'Junior (1-3 năm)', 'Mid': 'Mid-level (3-5 năm)', 'Senior': 'Senior (5+ năm)', 'Lead': 'Team Lead', 'Manager': 'Quản lý', 'Director': 'Giám đốc' };
    return labels[level] || level;
}
