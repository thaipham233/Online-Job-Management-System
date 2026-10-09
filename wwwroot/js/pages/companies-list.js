// Companies List Page
export async function render(container) {
    const params = router.getQueryParams();
    const page = parseInt(params.page) || 1;
    const pageSize = 12;

    const queryParams = {
        pageNumber: page,
        pageSize: pageSize,
        sortBy: params.sortBy || 'Name',
        sortDirection: params.sortDirection || 'asc'
    };

    if (params.keyword) queryParams.keyword = params.keyword;
    if (params.location) queryParams.location = params.location;
    if (params.industry) queryParams.industry = params.industry;
    if (params.size) queryParams.size = params.size;

    const result = await api.getCompanies(queryParams);
    const companies = result.data?.items || result.data || [];
    const totalCount = result.data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    container.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Khám phá công ty</h1>
                    <p class="text-gray-500 mt-1">${totalCount} công ty đang tuyển dụng</p>
                </div>
                <div class="flex items-center gap-3">
                    <select id="sort-select" class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white">
                        <option value="Name_asc" ${queryParams.sortBy === 'Name' && queryParams.sortDirection === 'asc' ? 'selected' : ''}>Tên A-Z</option>
                        <option value="Name_desc" ${queryParams.sortBy === 'Name' && queryParams.sortDirection === 'desc' ? 'selected' : ''}>Tên Z-A</option>
                        <option value="JobsCount_desc" ${queryParams.sortBy === 'JobsCount' && queryParams.sortDirection === 'desc' ? 'selected' : ''}>Số việc làm nhiều nhất</option>
                        <option value="CreatedAt_desc" ${queryParams.sortBy === 'CreatedAt' && queryParams.sortDirection === 'desc' ? 'selected' : ''}>Mới nhất</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${companies.length > 0 ? companies.map(company => renderCompanyCard(company)).join('') : renderEmptyCompanies()}
            </div>

            ${totalPages > 1 ? renderPagination(page, totalPages, params) : ''}
        </div>
    `;

    attachSortHandler(params);
    attachPaginationHandlers(params);
}

function renderCompanyCard(company) {
    const logo = company.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0ea5e9&color=fff&size=120`;
    const jobCount = company.jobsCount || 0;
    const sizeLabel = getCompanySizeLabel(company.size);
    
    return `
        <a href="#/companies/${company.id}" class="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-primary-200 transition-all group" data-link>
            <div class="text-center mb-4">
                <img src="${logo}" alt="${company.name}" class="w-24 h-24 rounded-xl mx-auto mb-4 object-cover group-hover:scale-105 transition-transform" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0ea5e9&color=fff&size=120'">
                <h3 class="font-semibold text-gray-900 mb-1 truncate">${company.name}</h3>
                ${company.industry ? `<p class="text-sm text-gray-500 mb-2">${company.industry}</p>` : ''}
                ${sizeLabel ? `<p class="text-sm text-gray-500 mb-2"><i class="fas fa-users mr-1"></i>${sizeLabel}</p>` : ''}
                ${company.location ? `<p class="text-sm text-gray-500 mb-3"><i class="fas fa-map-marker-alt mr-1 text-primary-500"></i>${company.location}</p>` : ''}
            </div>
            <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span class="text-sm font-medium text-primary-600">${jobCount} việc làm</span>
                <span class="text-sm text-gray-400">Xem chi tiết <i class="fas fa-arrow-right ml-1"></i></span>
            </div>
        </a>
    `;
}

function renderEmptyCompanies() {
    return `
        <div class="col-span-full text-center py-16">
            <i class="fas fa-building text-5xl text-gray-300 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy công ty</h3>
            <p class="text-gray-500">Thử thay đổi từ khóa tìm kiếm.</p>
        </div>
    `;
}

function renderPagination(currentPage, totalPages, params) {
    const buildUrl = (page) => {
        const newParams = { ...params, page };
        return `#/companies?${new URLSearchParams(newParams).toString()}`;
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
        <nav class="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
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

function getCompanySizeLabel(size) {
    if (!size) return '';
    if (size <= 10) return '1-10 nhân viên';
    if (size <= 50) return '11-50 nhân viên';
    if (size <= 200) return '51-200 nhân viên';
    if (size <= 500) return '201-500 nhân viên';
    if (size <= 1000) return '501-1000 nhân viên';
    return '1000+ nhân viên';
}

function attachSortHandler(params) {
    const select = document.getElementById('sort-select');
    if (select) {
        select.addEventListener('change', () => {
            const [sortBy, sortDirection] = select.value.split('_');
            const newParams = { ...params, sortBy, sortDirection, page: 1 };
            router.navigate(`/companies?${new URLSearchParams(newParams).toString()}`);
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
}
