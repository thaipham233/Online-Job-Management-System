// Jobs List Page
export async function render(container) {
    const params = router.getQueryParams();
    const page = parseInt(params.page) || 1;
    const pageSize = 12;
    
    // Build query params
    const queryParams = {
        pageNumber: page,
        pageSize: pageSize,
        sortBy: params.sortBy || 'CreatedAt',
        sortDirection: params.sortDirection || 'desc'
    };
    
    if (params.keyword) queryParams.keyword = params.keyword;
    if (params.location) queryParams.location = params.location;
    if (params.categoryId) queryParams.categoryId = params.categoryId;
    if (params.jobType) queryParams.jobType = params.jobType;
    if (params.experienceLevel) queryParams.experienceLevel = params.experienceLevel;
    if (params.minSalary) queryParams.minSalary = params.minSalary;
    if (params.maxSalary) queryParams.maxSalary = params.maxSalary;

    const [jobsResult, categoriesResult] = await Promise.all([
        api.getJobs(queryParams),
        api.getCategories()
    ]);

    const result = jobsResult.data;
    const jobs = result?.items || result || [];
    const totalCount = result?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / pageSize);
    const categories = categoriesResult.data || [];

    container.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header & Filters -->
            <div class="mb-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Tìm kiếm việc làm</h1>
                        <p class="text-gray-500 mt-1">${totalCount} vị trí việc làm</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <select id="sort-select" class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white">
                            <option value="CreatedAt_desc" ${queryParams.sortBy === 'CreatedAt' && queryParams.sortDirection === 'desc' ? 'selected' : ''}>Mới nhất</option>
                            <option value="CreatedAt_asc" ${queryParams.sortBy === 'CreatedAt' && queryParams.sortDirection === 'asc' ? 'selected' : ''}>Cũ nhất</option>
                            <option value="SalaryMax_desc" ${queryParams.sortBy === 'SalaryMax' && queryParams.sortDirection === 'desc' ? 'selected' : ''}>Lương cao nhất</option>
                            <option value="SalaryMax_asc" ${queryParams.sortBy === 'SalaryMax' && queryParams.sortDirection === 'asc' ? 'selected' : ''}>Lương thấp nhất</option>
                            <option value="ViewCount_desc" ${queryParams.sortBy === 'ViewCount' && queryParams.sortDirection === 'desc' ? 'selected' : ''}>Xem nhiều nhất</option>
                        </select>
                    </div>
                </div>

                <!-- Filter Sidebar Toggle (Mobile) -->
                <button id="filter-toggle" class="md:hidden flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <i class="fas fa-filter mr-2"></i>Bộ lọc
                </button>
            </div>

            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar Filters -->
                <aside id="filter-sidebar" class="lg:w-64 flex-shrink-0 hidden lg:block">
                    <div class="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="font-semibold text-gray-900">Bộ lọc</h3>
                            <button id="clear-filters" class="text-sm text-primary-600 hover:text-primary-700">Xóa tất cả</button>
                        </div>

                        <!-- Category -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-3">Danh mục</label>
                            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                                ${categories.map(cat => `
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" name="categoryId" value="${cat.id}" ${params.categoryId == cat.id ? 'checked' : ''} class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                                        <span class="ml-2 text-sm text-gray-700 flex-1 truncate">${cat.name}</span>
                                        <span class="text-xs text-gray-400">${cat.jobsCount || 0}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Job Type -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-3">Loại hình</label>
                            <div class="space-y-2">
                                ${['FullTime', 'PartTime', 'Contract', 'Internship', 'Freelance', 'Remote'].map(type => `
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" name="jobType" value="${type}" ${params.jobType === type ? 'checked' : ''} class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                                        <span class="ml-2 text-sm text-gray-700">${getJobTypeLabel(type)}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Experience Level -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-3">Cấp bậc</label>
                            <div class="space-y-2">
                                ${['Fresher', 'Junior', 'Mid', 'Senior', 'Lead', 'Manager'].map(level => `
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" name="experienceLevel" value="${level}" ${params.experienceLevel === level ? 'checked' : ''} class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                                        <span class="ml-2 text-sm text-gray-700">${getExperienceLevelLabel(level)}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Salary Range -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-3">Mức lương (triệu/tháng)</label>
                            <div class="space-y-2">
                                ${[
                                    { min: 0, max: 10, label: 'Dưới 10 triệu' },
                                    { min: 10, max: 20, label: '10 - 20 triệu' },
                                    { min: 20, max: 30, label: '20 - 30 triệu' },
                                    { min: 30, max: 50, label: '30 - 50 triệu' },
                                    { min: 50, max: null, label: 'Trên 50 triệu' }
                                ].map(range => `
                                    <label class="flex items-center cursor-pointer">
                                        <input type="radio" name="salaryRange" value="${range.min}-${range.max || ''}" 
                                            ${(params.minSalary == range.min || !params.minSalary && range.min === 0) && (!params.maxSalary || params.maxSalary == range.max || !range.max) ? 'checked' : ''} 
                                            class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500">
                                        <span class="ml-2 text-sm text-gray-700">${range.label}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <button id="apply-filters" class="w-full py-3 px-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                            Áp dụng bộ lọc
                        </button>
                    </div>
                </aside>

                <!-- Mobile Filter Modal -->
                <div id="filter-modal" class="fixed inset-0 z-50 hidden lg:hidden">
                    <div class="fixed inset-0 bg-black/50" data-filter-close></div>
                    <div class="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto" style="max-height: 100vh;">
                        <div class="p-6">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="font-semibold text-gray-900">Bộ lọc</h3>
                                <button data-filter-close class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
                            </div>
                            <div id="mobile-filter-content" class="space-y-6">
                                <!-- Category -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-3">Danh mục</label>
                                    <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                                        ${categories.map(cat => `
                                            <label class="flex items-center cursor-pointer">
                                                <input type="checkbox" name="categoryId" value="${cat.id}" ${params.categoryId == cat.id ? 'checked' : ''} class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                                                <span class="ml-2 text-sm text-gray-700 flex-1 truncate">${cat.name}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                                <!-- Job Type -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-3">Loại hình</label>
                                    <div class="space-y-2">
                                        ${['FullTime', 'PartTime', 'Contract', 'Internship', 'Freelance', 'Remote'].map(type => `
                                            <label class="flex items-center cursor-pointer">
                                                <input type="checkbox" name="jobType" value="${type}" ${params.jobType === type ? 'checked' : ''} class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                                                <span class="ml-2 text-sm text-gray-700">${getJobTypeLabel(type)}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                                <!-- Experience -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-3">Cấp bậc</label>
                                    <div class="space-y-2">
                                        ${['Fresher', 'Junior', 'Mid', 'Senior', 'Lead', 'Manager'].map(level => `
                                            <label class="flex items-center cursor-pointer">
                                                <input type="checkbox" name="experienceLevel" value="${level}" ${params.experienceLevel === level ? 'checked' : ''} class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                                                <span class="ml-2 text-sm text-gray-700">${getExperienceLevelLabel(level)}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                                <!-- Salary -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-3">Mức lương (triệu/tháng)</label>
                                    <div class="space-y-2">
                                        ${[
                                            { min: 0, max: 10, label: 'Dưới 10 triệu' },
                                            { min: 10, max: 20, label: '10 - 20 triệu' },
                                            { min: 20, max: 30, label: '20 - 30 triệu' },
                                            { min: 30, max: 50, label: '30 - 50 triệu' },
                                            { min: 50, max: null, label: 'Trên 50 triệu' }
                                        ].map(range => `
                                            <label class="flex items-center cursor-pointer">
                                                <input type="radio" name="salaryRange" value="${range.min}-${range.max || ''}" 
                                                    ${(params.minSalary == range.min || !params.minSalary && range.min === 0) && (!params.maxSalary || params.maxSalary == range.max || !range.max) ? 'checked' : ''} 
                                                    class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500">
                                                <span class="ml-2 text-sm text-gray-700">${range.label}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                            <div class="mt-6 flex gap-3">
                                <button id="mobile-clear-filters" class="flex-1 py-3 px-4 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">Xóa tất cả</button>
                                <button id="mobile-apply-filters" class="flex-1 py-3 px-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">Áp dụng</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Jobs List -->
                <main class="flex-1">
                    ${jobs.length > 0 ? `
                        <div id="jobs-grid" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            ${jobs.map(job => renderJobCard(job)).join('')}
                        </div>
                        
                        <!-- Pagination -->
                        ${totalPages > 1 ? renderPagination(page, totalPages, params) : ''}
                    ` : renderEmptyJobs(params)}
                </main>
            </div>
        </div>
    `;

    // Event handlers
    attachFilterHandlers(params);
    attachSortHandler(params);
    attachPaginationHandlers(params);
}

function renderJobCard(job) {
    const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryType);
    const location = job.location || 'Chưa cập nhật';
    const companyName = job.company?.name || 'Công ty riêng tư';
    const companyLogo = job.company?.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=0ea5e9&color=fff&size=120`;
    const postedDate = formatRelativeTime(job.createdAt);
    const isUrgent = job.expiredDate && new Date(job.expiredDate) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    
    return `
        <article class="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-primary-100 transition-all duration-300 group">
            ${isUrgent ? '<div class="absolute -top-3 -right-3 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">Sắp hết hạn</div>' : ''}
            <div class="flex items-start space-x-4 mb-4">
                <img src="${companyLogo}" alt="${companyName}" class="w-12 h-12 rounded-xl object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=0ea5e9&color=fff&size=120'">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <h3 class="font-semibold text-gray-900 truncate">${job.title}</h3>
                        ${job.isHot ? '<span class="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">Hot</span>' : ''}
                    </div>
                    <p class="text-sm text-gray-500 truncate">${companyName}</p>
                </div>
            </div>
            <div class="flex flex-wrap gap-2 mb-4">
                <span class="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">${getJobTypeLabel(job.jobType)}</span>
                <span class="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs">${getExperienceLevelLabel(job.experienceLevel)}</span>
                ${job.salaryType === 'Negotiable' ? '<span class="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">Thương lượng</span>' : ''}
            </div>
            <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-500">
                    <i class="fas fa-map-marker-alt mr-2 text-primary-500 w-5"></i>
                    <span class="truncate">${location}</span>
                </div>
                <div class="flex items-center text-sm text-gray-500">
                    <i class="fas fa-calendar-alt mr-2 text-gray-400 w-5"></i>
                    <span>${postedDate} • Hạn nộp: ${job.expiredDate ? formatDate(job.expiredDate) : 'Chưa xác định'}</span>
                </div>
                ${job.skills ? `
                    <div class="flex flex-wrap gap-1">
                        ${job.skills.split(',').slice(0, 4).map(skill => `
                            <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">${skill.trim()}</span>
                        `).join('')}
                        ${job.skills.split(',').length > 4 ? `<span class="px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded">+${job.skills.split(',').length - 4} hơn</span>` : ''}
                    </div>
                ` : ''}
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

function renderEmptyJobs(params) {
    const hasFilters = params.keyword || params.location || params.categoryId || params.jobType || params.experienceLevel || params.minSalary || params.maxSalary;
    
    return `
        <div class="text-center py-16">
            <i class="fas ${hasFilters ? 'fa-search-minus' : 'fa-briefcase'} text-5xl text-gray-300 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">${hasFilters ? 'Không tìm thấy việc làm phù hợp' : 'Chưa có việc làm nào'}</h3>
            <p class="text-gray-500 mb-6">${hasFilters ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm' : 'Hiện tại chưa có vị trí nào được đăng tải.'}</p>
            ${hasFilters ? `
                <button id="clear-all-filters" class="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                    <i class="fas fa-times mr-2"></i>Xóa tất cả bộ lọc
                </button>
            ` : ''}
        </div>
    `;
}

function renderPagination(currentPage, totalPages, params) {
    const buildUrl = (page) => {
        const newParams = { ...params, page };
        return `#/jobs?${new URLSearchParams(newParams).toString()}`;
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
            <a href="${buildUrl(currentPage - 1)}" class="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}" data-link ${currentPage === 1 ? 'tabindex="-1"' : ''}>
                <i class="fas fa-chevron-left"></i>
            </a>
            ${pages.map(p => {
                if (p === '...') return '<span class="px-3 py-2 text-gray-400">...</span>';
                return `<a href="${buildUrl(p)}" class="px-4 py-2 rounded-lg ${p === currentPage ? 'bg-primary-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}" data-link>${p}</a>`;
            }).join('')}
            <a href="${buildUrl(currentPage + 1)}" class="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}" data-link ${currentPage === totalPages ? 'tabindex="-1"' : ''}>
                <i class="fas fa-chevron-right"></i>
            </a>
        </nav>
    `;
}

function attachFilterHandlers(params) {
    // Desktop filters
    const sidebar = document.getElementById('filter-sidebar');
    if (sidebar) {
        const form = sidebar.querySelectorAll('input[type="checkbox"], input[type="radio"]');
        form.forEach(input => {
            input.addEventListener('change', debounce(() => applyFilters(sidebar), 300));
        });

        document.getElementById('clear-filters')?.addEventListener('click', () => {
            sidebar.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => input.checked = false);
            applyFilters(sidebar);
        });

        document.getElementById('apply-filters')?.addEventListener('click', () => applyFilters(sidebar));
    }

    // Mobile filters
    const modal = document.getElementById('filter-modal');
    const toggle = document.getElementById('filter-toggle');
    
    toggle?.addEventListener('click', () => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });

    modal?.querySelector('[data-filter-close]')?.addEventListener('click', closeFilterModal);
    modal?.querySelector('[data-filter-close]')?.addEventListener('click', closeFilterModal);

    const mobileForm = document.getElementById('mobile-filter-content');
    if (mobileForm) {
        mobileForm.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
            input.addEventListener('change', debounce(() => applyFilters(mobileForm, true), 300));
        });

        document.getElementById('mobile-clear-filters')?.addEventListener('click', () => {
            mobileForm.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => input.checked = false);
            applyFilters(mobileForm, true);
        });

        document.getElementById('mobile-apply-filters')?.addEventListener('click', () => {
            applyFilters(mobileForm, true);
            closeFilterModal();
        });
    }
}

function closeFilterModal() {
    const modal = document.getElementById('filter-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function applyFilters(formContainer, isMobile = false) {
    const params = new URLSearchParams();
    
    // Keyword from URL
    const currentParams = router.getQueryParams();
    if (currentParams.keyword) params.append('keyword', currentParams.keyword);
    if (currentParams.location) params.append('location', currentParams.location);

    // Category checkboxes
    formContainer.querySelectorAll('input[name="categoryId"]:checked').forEach(cb => {
        params.append('categoryId', cb.value);
    });

    // Job type checkboxes
    formContainer.querySelectorAll('input[name="jobType"]:checked').forEach(cb => {
        params.append('jobType', cb.value);
    });

    // Experience checkboxes
    formContainer.querySelectorAll('input[name="experienceLevel"]:checked').forEach(cb => {
        params.append('experienceLevel', cb.value);
    });

    // Salary radio
    const salaryRadio = formContainer.querySelector('input[name="salaryRange"]:checked');
    if (salaryRadio) {
        const [min, max] = salaryRadio.value.split('-');
        if (min) params.append('minSalary', min * 1000000);
        if (max) params.append('maxSalary', max * 1000000);
    }

    router.navigate(`/jobs?${params.toString()}`);
}

function attachSortHandler(params) {
    const select = document.getElementById('sort-select');
    if (select) {
        select.addEventListener('change', () => {
            const [sortBy, sortDirection] = select.value.split('_');
            const newParams = { ...params, sortBy, sortDirection, page: 1 };
            router.navigate(`/jobs?${new URLSearchParams(newParams).toString()}`);
        });
    }
}

function attachPaginationHandlers(params) {
    document.querySelectorAll('nav a[data-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href) router.navigate(href.slice(1));
        });
    });
    
    document.getElementById('clear-all-filters')?.addEventListener('click', () => {
        const currentParams = router.getQueryParams();
        const { keyword, location, ...rest } = currentParams;
        const newParams = {};
        if (keyword) newParams.keyword = keyword;
        if (location) newParams.location = location;
        router.navigate(`/jobs?${new URLSearchParams(newParams).toString()}`);
    });
}

// Format helpers (duplicated from app.js for module independence)
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
function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}
