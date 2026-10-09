// Home Page
export async function render(container) {
    // Fetch featured jobs and companies
    const [jobsResult, companiesResult, categoriesResult] = await Promise.all([
        api.getJobs({ pageSize: 6, sortBy: 'CreatedAt', sortDirection: 'desc' }),
        api.getCompanies({ pageSize: 6 }),
        api.getCategories()
    ]);

    const jobs = jobsResult.data?.items || jobsResult.data || [];
    const companies = companiesResult.data?.items || companiesResult.data || [];
    const categories = categoriesResult.data || [];

    container.innerHTML = `
        <!-- Hero Section -->
        <section class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
            <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 36v-4H0v4H0v2h4v4h2v-4h4v-2H6zM6 6V0H0v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-primary-900/50 to-transparent"></div>
            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
                <div class="max-w-3xl">
                    <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6 fade-in">
                        <i class="fas fa-fire text-yellow-300 mr-2"></i>
                        <span class="text-sm font-medium">10,000+ việc làm mới mỗi tháng</span>
                    </div>
                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 slide-up">
                        Tìm việc làm mơ ước <br class="hidden sm:block">tại <span class="text-yellow-300">JobHub</span>
                    </h1>
                    <p class="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl slide-up" style="animation-delay: 100ms;">
                        Kết nối nhân tài với các công ty hàng đầu Việt Nam. Tìm kiếm việc làm phù hợp với kỹ năng, mức lương và địa điểm mong muốn của bạn.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 slide-up" style="animation-delay: 200ms;">
                        <a href="#/jobs" class="w-full sm:w-auto px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold text-center hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl" data-link>
                            <i class="fas fa-search mr-2"></i>Tìm việc ngay
                        </a>
                        <a href="#/companies" class="w-full sm:w-auto px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-center hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20" data-link>
                            <i class="fas fa-building mr-2"></i>Khám phá công ty
                        </a>
                    </div>
                </div>
            </div>
            <!-- Floating stats -->
            <div class="absolute bottom-0 left-0 right-0 -mb-6 px-4">
                <div class="max-w-7xl mx-auto">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        ${[
                            { icon: 'fa-briefcase', label: 'Việc làm', value: '25,000+' },
                            { icon: 'fa-building', label: 'Công ty', value: '3,500+' },
                            { icon: 'fa-users', label: 'Ứng viên', value: '150,000+' },
                            { icon: 'fa-star', label: 'Đánh giá', value: '4.9/5' }
                        ].map((stat, i) => `
                            <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center slide-up" style="animation-delay: ${300 + i * 100}ms;">
                                <i class="fas ${stat.icon} text-3xl text-yellow-300 mb-3"></i>
                                <div class="text-3xl font-bold">${stat.value}</div>
                                <div class="text-white/70 text-sm">${stat.label}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>

        <!-- Search Bar -->
        <section class="relative -mt-6 mb-16 px-4">
            <div class="max-w-7xl mx-auto">
                <div class="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
                    <form id="hero-search-form" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Từ khóa / Chức danh / Kỹ năng</label>
                            <div class="relative">
                                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input type="text" name="keyword" placeholder="VD: Laravel, React, Sales, Marketing..." class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Địa điểm</label>
                            <select name="location" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-white">
                                <option value="">Tất cả địa điểm</option>
                                <option value="Hà Nội">Hà Nội</option>
                                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                <option value="Đà Nẵng">Đà Nẵng</option>
                                <option value="Remote">Làm từ xa</option>
                            </select>
                        </div>
                        <div class="flex items-end">
                            <button type="submit" class="w-full py-3 px-6 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center">
                                <i class="fas fa-search mr-2"></i>Tìm kiếm
                            </button>
                        </div>
                    </form>
                    <div class="mt-4 flex flex-wrap gap-2">
                        <span class="text-sm text-gray-500">Tìm kiếm phổ biến:</span>
                        ${['React', 'Node.js', 'Python', 'Sales', 'Marketing', 'Kế toán', 'Nhân sự', 'Thiết kế'].map(kw => `
                            <a href="#/jobs?keyword=${encodeURIComponent(kw)}" class="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition-colors" data-link>${kw}</a>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured Jobs -->
        <section class="py-16 px-4">
            <div class="max-w-7xl mx-auto">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Việc làm nổi bật</h2>
                        <p class="text-gray-500 mt-1">Các vị trí hot nhất tuần này</p>
                    </div>
                    <a href="#/jobs" class="text-primary-600 font-medium hover:text-primary-700 flex items-center" data-link>
                        Xem tất cả <i class="fas fa-arrow-right ml-1"></i>
                    </a>
                </div>
                <div id="featured-jobs" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${jobs.length > 0 ? jobs.map(job => renderJobCard(job)).join('') : renderEmptyJobs()}
                </div>
            </div>
        </section>

        <!-- Top Companies -->
        <section class="py-16 px-4 bg-gray-50">
            <div class="max-w-7xl mx-auto">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Công ty tuyển dụng nhiều</h2>
                        <p class="text-gray-500 mt-1">Khám phá môi trường làm việc tuyệt vời</p>
                    </div>
                    <a href="#/companies" class="text-primary-600 font-medium hover:text-primary-700 flex items-center" data-link>
                        Xem tất cả <i class="fas fa-arrow-right ml-1"></i>
                    </a>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    ${companies.length > 0 ? companies.map(company => renderCompanyCard(company)).join('') : renderEmptyCompanies()}
                </div>
            </div>
        </section>

        <!-- Categories -->
        <section class="py-16 px-4">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Tìm việc theo ngành nghề</h2>
                    <p class="text-gray-500 mt-1">Khám phá các danh mục việc làm phổ biến</p>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    ${categories.length > 0 ? categories.map(cat => renderCategoryCard(cat)).join('') : renderDefaultCategories()}
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-16 px-4 bg-gradient-to-r from-primary-600 to-primary-800">
            <div class="max-w-4xl mx-auto text-center text-white">
                <h2 class="text-3xl sm:text-4xl font-bold mb-4">Sẵn sàng tìm việc mơ ước?</h2>
                <p class="text-lg text-white/90 mb-8">Đăng ký miễn phí và nhận thông báo việc làm phù hợp nhất với bạn</p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="#/register" class="px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors" data-link>
                        <i class="fas fa-user-plus mr-2"></i>Đăng ký ứng viên
                    </a>
                    <a href="#/register?role=employer" class="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/30" data-link>
                        <i class="fas fa-building mr-2"></i>Tuyển dụng cho công ty
                    </a>
                </div>
            </div>
        </section>

        <!-- Features -->
        <section class="py-16 px-4 bg-white">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Tại sao chọn JobHub?</h2>
                    <p class="text-gray-500 mt-1">Platform tuyển dụng hiện đại, minh bạch, hiệu quả</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    ${[
                        { icon: 'fa-magic', title: 'AI Matching', desc: 'Công nghệ AI khớp hồ sơ ứng viên với việc làm chính xác nhất' },
                        { icon: 'fa-shield-alt', title: 'Xác thực doanh nghiệp', desc: 'Mọi công ty đều được kiểm duyệt thủ công trước khi đăng tuyển' },
                        { icon: 'fa-chart-line', title: 'Thông tin lương thực', desc: 'Công bố minh bạch mức lương, phúc lợi, môi trường làm việc' },
                        { icon: 'fa-comments', title: 'Chat trực tiếp', desc: 'Nhắn tin real-time với nhà tuyển dụng, phản hồi nhanh chóng' },
                        { icon: 'fa-file-alt', title: 'CV Builder', desc: 'Tạo CV chuyên nghiệp mẫu ATS, tải PDF miễn phí' },
                        { icon: 'fa-bell', title: 'Job Alert', desc: 'Nhận email/notification khi có việc làm phù hợp mong muốn' }
                    ].map((feat, i) => `
                        <div class="p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors text-center fade-in" style="animation-delay: ${i * 100}ms;">
                            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                <i class="fas ${feat.icon} text-white text-2xl"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">${feat.title}</h3>
                            <p class="text-gray-600">${feat.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;

    // Attach search form handler
    const form = container.querySelector('#hero-search-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const params = new URLSearchParams();
            for (const [key, value] of formData) {
                if (value) params.append(key, value);
            }
            router.navigate(`/jobs?${params.toString()}`);
        });
    }
}

function renderJobCard(job) {
    const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryType);
    const location = job.location || 'Chưa cập nhật';
    const companyName = job.company?.name || 'Công ty riêng tư';
    const companyLogo = job.company?.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=0ea5e9&color=fff&size=120`;
    const postedDate = formatRelativeTime(job.createdAt);
    
    return `
        <article class="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-primary-100 transition-all duration-300 fade-in group">
            <div class="flex items-start space-x-4 mb-4">
                <img src="${companyLogo}" alt="${companyName}" class="w-12 h-12 rounded-xl object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=0ea5e9&color=fff&size=120'">
                <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 truncate">${job.title}</h3>
                    <p class="text-sm text-gray-500 truncate">${companyName}</p>
                </div>
            </div>
            <div class="flex flex-wrap gap-3 mb-4">
                <span class="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">${getJobTypeLabel(job.jobType)}</span>
                <span class="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs">${getExperienceLevelLabel(job.experienceLevel)}</span>
            </div>
            <div class="flex items-center justify-between text-sm mb-4">
                <div class="flex items-center text-gray-500">
                    <i class="fas fa-map-marker-alt mr-1.5 text-primary-500"></i>
                    <span class="truncate">${location}</span>
                </div>
                <span class="text-gray-400">${postedDate}</span>
            </div>
            <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span class="text-lg font-bold text-primary-600">${salary}</span>
                <a href="#/jobs/${job.id}" class="text-primary-600 font-medium hover:text-primary-700 text-sm flex items-center group" data-link>
                    Xem chi tiết <i class="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
                </a>
            </div>
        </article>
    `;
}

function renderEmptyJobs() {
    return `
        <div class="col-span-full text-center py-12">
            <i class="fas fa-briefcase text-5xl text-gray-300 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Chưa có việc làm nào</h3>
            <p class="text-gray-500">Hiện tại chưa có vị trí nào được đăng tải.</p>
        </div>
    `;
}

function renderCompanyCard(company) {
    const logo = company.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0ea5e9&color=fff&size=120`;
    const jobCount = company.jobsCount || 0;
    
    return `
        <a href="#/companies/${company.id}" class="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-primary-200 transition-all text-center group" data-link>
            <img src="${logo}" alt="${company.name}" class="w-20 h-20 rounded-xl mx-auto mb-4 object-cover group-hover:scale-105 transition-transform" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0ea5e9&color=fff&size=120'">
            <h3 class="font-semibold text-gray-900 mb-1 truncate">${company.name}</h3>
            <p class="text-sm text-gray-500 mb-2">${company.industry || 'Chưa cập nhật ngành'}</p>
            <div class="flex items-center justify-center text-sm text-gray-500">
                <i class="fas fa-briefcase mr-1"></i>
                <span>${jobCount} việc làm</span>
            </div>
        </a>
    `;
}

function renderEmptyCompanies() {
    return `
        <div class="col-span-full text-center py-12">
            <i class="fas fa-building text-5xl text-gray-300 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Chưa có công ty nào</h3>
        </div>
    `;
}

function renderCategoryCard(category) {
    const icons = {
        'Công nghệ thông tin': 'fa-laptop-code',
        'Kinh doanh': 'fa-chart-line',
        'Marketing': 'fa-bullhorn',
        'Thiết kế': 'fa-palette',
        'Nhân sự': 'fa-users',
        'Kế toán': 'fa-calculator',
        'Bán hàng': 'fa-shopping-cart',
        'Khách sạn': 'fa-concierge-bell',
        'Giáo dục': 'fa-graduation-cap',
        'Y tế': 'fa-heartbeat'
    };
    const icon = icons[category.name] || 'fa-briefcase';
    const jobCount = category.jobsCount || 0;
    
    return `
        <a href="#/jobs?categoryId=${category.id}" class="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg hover:border-primary-200 transition-all group" data-link>
            <div class="w-14 h-14 mx-auto mb-3 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                <i class="fas ${icon} text-primary-600 text-xl group-hover:text-white"></i>
            </div>
            <h3 class="font-medium text-gray-900 mb-1">${category.name}</h3>
            <p class="text-sm text-gray-500">${jobCount} việc làm</p>
        </a>
    `;
}

function renderDefaultCategories() {
    return [
        { name: 'Công nghệ thông tin', icon: 'fa-laptop-code', count: 5000 },
        { name: 'Kinh doanh', icon: 'fa-chart-line', count: 3200 },
        { name: 'Marketing', icon: 'fa-bullhorn', count: 2800 },
        { name: 'Thiết kế', icon: 'fa-palette', count: 1500 },
        { name: 'Nhân sự', icon: 'fa-users', count: 1200 },
        { name: 'Kế toán', icon: 'fa-calculator', count: 2100 }
    ].map(cat => renderCategoryCard(cat)).join('');
}

// Re-export format helpers (they're in app.js but we need them here)
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
