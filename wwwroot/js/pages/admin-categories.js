// Admin Categories Page
export async function render(container) {
    requireAuth(async () => {
        if (!auth.hasRole('Admin')) {
            showToast('Bạn không có quyền truy cập', 'error');
            router.navigate('/');
            return;
        }

        const params = router.getQueryParams();
        const page = parseInt(params.page) || 1;
        const pageSize = 20;
        const search = params.search;

        const queryParams = { pageNumber: page, pageSize, sortBy: 'Name', sortDirection: 'asc' };
        if (search) queryParams.search = search;

        const result = await api.get('/admin/categories', queryParams);
        const categories = result.data?.items || result.data || [];
        const totalCount = result.data?.totalCount || 0;
        const totalPages = Math.ceil(totalCount / pageSize);

        container.innerHTML = `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
                        <p class="text-gray-500 mt-1">Thêm, sửa, xóa danh mục việc làm</p>
                    </div>
                    <button onclick="showCategoryModal()" class="px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center gap-2">
                        <i class="fas fa-plus"></i> Thêm danh mục
                    </button>
                </div>

                <!-- Search -->
                <div class="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
                    <form id="search-form" class="flex gap-4">
                        <div class="flex-1">
                            <input type="text" name="search" value="${search || ''}" placeholder="Tìm kiếm tên danh mục..."
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        </div>
                        <button type="submit" class="px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
                            <i class="fas fa-search mr-1"></i>Tìm
                        </button>
                        <a href="#/admin/categories" class="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">Xóa lọc</a>
                    </form>
                </div>

                <!-- Categories Grid -->
                ${categories.length > 0 ? `
                <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div class="p-4 border-b border-gray-100">
                        <p class="text-sm text-gray-500">Tổng cộng: <span class="font-medium text-gray-900">${totalCount}</span> danh mục</p>
                    </div>
                    <div class="divide-y divide-gray-100">
                        ${categories.map(cat => renderCategoryRow(cat)).join('')}
                    </div>
                    ${totalPages > 1 ? renderPagination(page, totalPages, params) : ''}
                </div>
                ` : `
                <div class="text-center py-16">
                    <i class="fas fa-tags text-5xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy danh mục</h3>
                    <button onclick="showCategoryModal()" class="mt-4 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
                        <i class="fas fa-plus mr-2"></i>Tạo danh mục đầu tiên
                    </button>
                </div>
                `}
            </div>

            <!-- Category Modal -->
            <div id="category-modal-root"></div>
        `;

        attachSearchHandler();
    });
}

function renderCategoryRow(category) {
    const jobsCount = category.jobsCount || 0;
    const iconColor = category.iconColor || 'primary';
    const iconClass = category.iconClass || 'fas fa-tag';

    return `
        <div class="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-4 flex-1 min-w-0">
                <div class="w-12 h-12 rounded-xl bg-${iconColor}-100 text-${iconColor}-600 flex items-center justify-center flex-shrink-0">
                    <i class="${iconClass} text-xl"></i>
                </div>
                <div class="min-w-0">
                    <p class="font-medium text-gray-900 truncate">${category.name}</p>
                    ${category.description ? `<p class="text-sm text-gray-500 truncate">${category.description}</p>` : ''}
                </div>
            </div>
            <div class="flex items-center gap-4 flex-shrink-0">
                <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">${jobsCount} việc làm</span>
                <div class="flex items-center gap-2">
                    <button onclick="showCategoryModal(${JSON.stringify(category).replace(/"/g, '"')})" 
                            class="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <i class="fas fa-edit mr-1"></i>Sửa
                    </button>
                    <button onclick="deleteCategory(${category.id})" 
                            class="px-3 py-1.5 text-sm border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <i class="fas fa-trash mr-1"></i>Xóa
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderPagination(currentPage, totalPages, params) {
    const buildUrl = (page) => {
        const newParams = { ...params, page };
        return `#/admin/categories?${new URLSearchParams(newParams).toString()}`;
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

function showCategoryModal(category = null) {
    const isEdit = !!category;
    const modalRoot = document.getElementById('category-modal-root');
    
    const iconOptions = [
        { class: 'fas fa-tag', label: 'Tag' },
        { class: 'fas fa-code', label: 'Code' },
        { class: 'fas fa-laptop-code', label: 'Laptop Code' },
        { class: 'fas fa-server', label: 'Server' },
        { class: 'fas fa-database', label: 'Database' },
        { class: 'fas fa-cloud', label: 'Cloud' },
        { class: 'fas fa-mobile-alt', label: 'Mobile' },
        { class: 'fas fa-desktop', label: 'Desktop' },
        { class: 'fas fa-network-wired', label: 'Network' },
        { class: 'fas fa-robot', label: 'AI/Robot' },
        { class: 'fas fa-chart-line', label: 'Chart' },
        { class: 'fas fa-briefcase', label: 'Briefcase' },
        { class: 'fas fa-graduation-cap', label: 'Education' },
        { class: 'fas fa-hospital', label: 'Healthcare' },
        { class: 'fas fa-store', label: 'Retail' },
        { class: 'fas fa-industry', label: 'Industry' }
    ];

    const colorOptions = [
        { value: 'primary', label: 'Xanh dương', preview: 'bg-primary-100 text-primary-600' },
        { value: 'green', label: 'Xanh lá', preview: 'bg-green-100 text-green-600' },
        { value: 'purple', label: 'Tím', preview: 'bg-purple-100 text-purple-600' },
        { value: 'pink', label: 'Hồng', preview: 'bg-pink-100 text-pink-600' },
        { value: 'red', label: 'Đỏ', preview: 'bg-red-100 text-red-600' },
        { value: 'orange', label: 'Cam', preview: 'bg-orange-100 text-orange-600' },
        { value: 'yellow', label: 'Vàng', preview: 'bg-yellow-100 text-yellow-600' },
        { value: 'teal', label: 'Xanh ngọc', preview: 'bg-teal-100 text-teal-600' },
        { value: 'indigo', label: 'Chàm', preview: 'bg-indigo-100 text-indigo-600' },
        { value: 'gray', label: 'Xám', preview: 'bg-gray-100 text-gray-600' }
    ];

    modalRoot.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" id="category-modal">
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" data-modal-close></div>
            <div class="relative w-full max-w-md bg-white rounded-2xl shadow-xl animate-scale-in">
                <div class="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 class="text-lg font-bold text-gray-900">${isEdit ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
                    <button class="text-gray-400 hover:text-gray-600" data-modal-close><i class="fas fa-times text-xl"></i></button>
                </div>
                <form id="category-form" class="p-4 space-y-4">
                    <input type="hidden" name="id" value="${category?.id || ''}">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Tên danh mục <span class="text-red-500">*</span></label>
                        <input type="text" name="name" required value="${category?.name || ''}"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Ví dụ: Frontend, Backend, DevOps...">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                        <textarea name="description" rows="3"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                            placeholder="Mô tả ngắn về danh mục...">${category?.description || ''}</textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Icon <span class="text-red-500">*</span></label>
                        <div class="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-xl">
                            ${iconOptions.map(icon => `
                                <button type="button" class="icon-option w-full h-12 rounded-lg border-2 ${category?.iconClass === icon.class ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'} transition-colors flex items-center justify-center"
                                        data-icon="${icon.class}" title="${icon.label}">
                                    <i class="${icon.class} text-xl"></i>
                                </button>
                            `).join('')}
                        </div>
                        <input type="hidden" name="iconClass" value="${category?.iconClass || 'fas fa-tag'}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Màu icon <span class="text-red-500">*</span></label>
                        <div class="flex flex-wrap gap-2">
                            ${colorOptions.map(color => `
                                <button type="button" class="color-option w-10 h-10 rounded-lg border-2 ${category?.iconColor === color.value ? 'border-primary-500 scale-110' : 'border-gray-200 hover:border-primary-300'} transition-all flex items-center justify-center ${color.preview}"
                                        data-color="${color.value}" title="${color.label}">
                                    ${category?.iconColor === color.value ? '<i class="fas fa-check text-white text-sm"></i>' : ''}
                                </button>
                            `).join('')}
                        </div>
                        <input type="hidden" name="iconColor" value="${category?.iconColor || 'primary'}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự hiển thị</label>
                        <input type="number" name="displayOrder" value="${category?.displayOrder || 0}" min="0"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="button" class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors" data-modal-close>Hủy</button>
                        <button type="submit" class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
                            <i class="fas fa-save mr-2"></i>${isEdit ? 'Cập nhật' : 'Tạo mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Setup icon selection
    document.querySelectorAll('.icon-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.icon-option').forEach(b => b.classList.remove('border-primary-500', 'bg-primary-50'));
            btn.classList.add('border-primary-500', 'bg-primary-50');
            document.querySelector('input[name="iconClass"]').value = btn.dataset.icon;
        });
    });

    // Setup color selection
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(b => {
                b.classList.remove('border-primary-500', 'scale-110');
                b.innerHTML = '';
            });
            btn.classList.add('border-primary-500', 'scale-110');
            btn.innerHTML = '<i class="fas fa-check text-white text-sm"></i>';
            document.querySelector('input[name="iconColor"]').value = btn.dataset.color;
        });
    });

    // Setup form submit
    const form = document.getElementById('category-form');
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            description: formData.get('description') || null,
            iconClass: formData.get('iconClass'),
            iconColor: formData.get('iconColor'),
            displayOrder: parseInt(formData.get('displayOrder')) || 0
        };

        const id = formData.get('id');
        const result = id ? await api.put(`/admin/categories/${id}`, data) : await api.post('/admin/categories', data);

        if (result.error) showToast(result.error, 'error');
        else {
            showToast(isEdit ? 'Đã cập nhật danh mục' : 'Đã tạo danh mục mới', 'success');
            document.getElementById('category-modal').remove();
            router.handleRouteChange();
        }
    });

    // Close modal handlers
    document.querySelectorAll('[data-modal-close]').forEach(el => {
        el.addEventListener('click', () => document.getElementById('category-modal')?.remove());
    });
}

window.deleteCategory = async function(categoryId) {
    if (!confirm('Xóa danh mục này? Các việc làm thuộc danh mục sẽ không bị xóa.')) return;
    const result = await api.delete(`/admin/categories/${categoryId}`);
    if (result.error) showToast(result.error, 'error');
    else { showToast('Đã xóa danh mục', 'success'); router.handleRouteChange(); }
};

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function attachSearchHandler() {
    const form = document.getElementById('search-form');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const params = new URLSearchParams();
        for (const [key, value] of formData.entries()) if (value) params.set(key, value);
        router.navigate(`/admin/categories?${params.toString()}`);
    });
}

// Make showCategoryModal global
window.showCategoryModal = showCategoryModal;
