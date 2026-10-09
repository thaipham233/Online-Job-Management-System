// Company Detail Page
export async function render(container, companyId) {
    const companyResult = await api.getCompany(companyId);
    
    if (companyResult.error) {
        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <i class="fas fa-exclamation-triangle text-5xl text-red-400 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy công ty</h2>
                <p class="text-gray-500 mb-6">${companyResult.error}</p>
                <a href="#/companies" class="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors inline-flex" data-link>
                    <i class="fas fa-arrow-left mr-2"></i>Quay lại danh sách
                </a>
            </div>
        `;
        return;
    }

    const company = companyResult.data;
    const logo = company.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0ea5e9&color=fff&size=300`;
    const cover = company.coverUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop';
    const sizeLabel = getCompanySizeLabel(company.size);
    const jobCount = company.jobsCount || 0;

    container.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Breadcrumb -->
            <nav class="mb-6" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-2 text-sm text-gray-500">
                    <li><a href="#/" class="hover:text-primary-600" data-link>Trang chủ</a></li>
                    <li><i class="fas fa-chevron-right text-xs"></i></li>
                    <li><a href="#/companies" class="hover:text-primary-600" data-link>Công ty</a></li>
                    <li><i class="fas fa-chevron-right text-xs"></i></li>
                    <li class="text-gray-900 truncate max-w-xs">${company.name}</li>
                </ol>
            </nav>

            <!-- Hero -->
            <div class="relative rounded-2xl overflow-hidden mb-8">
                <img src="${cover}" alt="${company.name}" class="w-full h-64 md:h-80 object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div class="flex items-start gap-6">
                            <img src="${logo}" alt="${company.name}" class="w-20 h-20 md:w-24 md:h-24 rounded-xl border-4 border-white object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0ea5e9&color=fff&size=200'">
                            <div>
                                <h1 class="text-3xl md:text-4xl font-bold text-white">${company.name}</h1>
                                <div class="flex flex-wrap gap-4 mt-2 text-white/90">
                                    ${company.industry ? `<span class="flex items-center"><i class="fas fa-industry mr-1"></i>${company.industry}</span>` : ''}
                                    ${sizeLabel ? `<span class="flex items-center"><i class="fas fa-users mr-1"></i>${sizeLabel}</span>` : ''}
                                    ${company.location ? `<span class="flex items-center"><i class="fas fa-map-marker-alt mr-1"></i>${company.location}</span>` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-3">
                            ${company.website ? `
                                <a href="${company.website}" target="_blank" class="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center">
                                    <i class="fas fa-globe mr-2"></i>Website
                                </a>
                            ` : ''}
                            <button id="follow-company" class="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center">
                                <i class="fas fa-plus mr-2"></i>Theo dõi
                            </button>
                            ${auth.isEmployer() && auth.user?.companyId === company.id ? `
                                <a href="#/employer/company" class="px-4 py-2 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors" data-link>
                                    <i class="fas fa-cog mr-2"></i>Quản lý
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Main Content -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- About -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-info-circle text-primary-500 mr-2"></i>
                            Giới thiệu
                        </h2>
                        <div class="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                            ${company.description ? company.description.replace(/\n/g, '<br>') : '<p class="text-gray-500">Công ty chưa cung cấp thông tin giới thiệu.</p>'}
                        </div>
                    </section>

                    <!-- Details Grid -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <i class="fas fa-building text-primary-500 mr-2"></i>
                            Thông tin chi tiết
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            ${company.foundedYear ? `
                            <div>
                                <p class="text-sm text-gray-500">Năm thành lập</p>
                                <p class="font-medium text-gray-900">${company.foundedYear}</p>
                            </div>` : ''}
                            ${sizeLabel ? `
                            <div>
                                <p class="text-sm text-gray-500">Quy mô</p>
                                <p class="font-medium text-gray-900">${sizeLabel}</p>
                            </div>` : ''}
                            ${company.industry ? `
                            <div>
                                <p class="text-sm text-gray-500">Ngành nghề</p>
                                <p class="font-medium text-gray-900">${company.industry}</p>
                            </div>` : ''}
                            ${company.location ? `
                            <div>
                                <p class="text-sm text-gray-500">Địa chỉ</p>
                                <p class="font-medium text-gray-900">${company.location}</p>
                            </div>` : ''}
                            ${company.website ? `
                            <div>
                                <p class="text-sm text-gray-500">Website</p>
                                <a href="${company.website}" target="_blank" class="font-medium text-primary-600 hover:text-primary-700">${company.website.replace(/^https?:\/\//, '')}</a>
                            </div>` : ''}
                            ${company.email ? `
                            <div>
                                <p class="text-sm text-gray-500">Email</p>
                                <a href="mailto:${company.email}" class="font-medium text-primary-600 hover:text-primary-700">${company.email}</a>
                            </div>` : ''}
                            ${company.phone ? `
                            <div>
                                <p class="text-sm text-gray-500">Điện thoại</p>
                                <a href="tel:${company.phone}" class="font-medium text-primary-600 hover:text-primary-700">${company.phone}</a>
                            </div>` : ''}
                            <div>
                                <p class="text-sm text-gray-500">Việc làm đang tuyển</p>
                                <p class="font-medium text-gray-900">${jobCount}</p>
                            </div>
                        </div>
                    </section>

                    <!-- Benefits/Culture -->
                    ${company.benefits ? `
                    <section class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-gift text-primary-500 mr-2"></i>
                            Phúc lợi & Văn hóa
                        </h2>
                        <div class="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                            ${company.benefits.replace(/\n/g, '<br>')}
                        </div>
                    </section>
                    ` : ''}
                </div>

                <!-- Sidebar - Jobs -->
                <aside class="lg:col-span-1">
                    <div class="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-bold text-gray-900 flex items-center">
                                <i class="fas fa-briefcase text-primary-500 mr-2"></i>
                                Việc làm đang tuyển (${jobCount})
                            </h3>
                            <a href="#/jobs?companyId=${company.id}" class="text-sm text-primary-600 hover:text-primary-700 font-medium" data-link>Xem tất cả</a>
                        </div>
                        <div id="company-jobs" class="space-y-3">
                            <div class="flex items-center justify-center py-4">
                                <div class="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-4">Thống kê</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div class="flex items-center">
                                    <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                                        <i class="fas fa-briefcase text-primary-600"></i>
                                    </div>
                                    <span class="ml-3 text-gray-700">Tổng việc làm</span>
                                </div>
                                <span class="text-2xl font-bold text-gray-900">${jobCount}</span>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div class="flex items-center">
                                    <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                        <i class="fas fa-users text-green-600"></i>
                                    </div>
                                    <span class="ml-3 text-gray-700">Nhân viên</span>
                                </div>
                                <span class="text-2xl font-bold text-gray-900">${sizeLabel || 'Chưa cập nhật'}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    `;

    loadCompanyJobs(companyId);
    attachFollowHandler();
}

async function loadCompanyJobs(companyId) {
    const result = await api.getJobs({ companyId, pageSize: 10, pageNumber: 1, sortBy: 'CreatedAt', sortDirection: 'desc' });
    const jobs = result.data?.items || result.data || [];
    
    const container = document.getElementById('company-jobs');
    if (container) {
        if (jobs.length > 0) {
            container.innerHTML = jobs.slice(0, 5).map(job => `
                <a href="#/jobs/${job.id}" class="flex items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-primary-200 transition-colors" data-link>
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-gray-900 truncate">${job.title}</p>
                        <p class="text-sm text-gray-500 truncate">${formatSalary(job.salaryMin, job.salaryMax, job.salaryType)}</p>
                    </div>
                    <span class="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">${getJobTypeLabel(job.jobType)}</span>
                </a>
            `).join('');
            
            if (jobs.length > 5) {
                container.innerHTML += `
                    <a href="#/jobs?companyId=${companyId}" class="block text-center py-3 text-primary-600 font-medium hover:text-primary-700" data-link>
                        Xem thêm ${jobs.length - 5} việc làm khác <i class="fas fa-arrow-right ml-1"></i>
                    </a>
                `;
            }
        } else {
            container.innerHTML = '<p class="text-gray-500 text-sm text-center py-4">Công ty này chưa đăng tuyển vị trí nào</p>';
        }
    }
}

function attachFollowHandler() {
    const btn = document.getElementById('follow-company');
    if (btn) {
        btn.addEventListener('click', () => {
            if (!auth.isAuthenticated) {
                showToast('Vui lòng đăng nhập để theo dõi', 'warning');
                router.navigate('/login');
                return;
            }
            // TODO: API call to follow company
            btn.innerHTML = '<i class="fas fa-check mr-2"></i>Đang theo dõi';
            btn.classList.remove('bg-primary-600', 'hover:bg-primary-700');
            btn.classList.add('bg-gray-300', 'text-gray-600', 'cursor-default');
            btn.disabled = true;
            showToast('Đã theo dõi công ty', 'success');
        });
    }
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
function getJobTypeLabel(type) {
    const labels = { 'FullTime': 'Toàn thời gian', 'PartTime': 'Bán thời gian', 'Contract': 'Hợp đồng', 'Internship': 'Thực tập', 'Freelance': 'Freelance', 'Remote': 'Từ xa' };
    return labels[type] || type;
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
