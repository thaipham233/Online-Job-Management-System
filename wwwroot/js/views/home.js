// Home View - Trang chủ với danh sách việc làm
class JobHubHomeView {
    constructor() {
        this.jobs = [];
        this.currentPage = 1;
        this.totalPages = 1;
    }

    async render() {
        return `
            <!-- Hero Section -->
            <section class="hero">
                <div class="container">
                    <div class="hero-content">
                        <span class="badge badge-primary"><i class="fas fa-rocket"></i> Nền tảng tuyển dụng số 1</span>
                        <h1 class="h1">Tìm việc làm <span class="text-primary">hạnh phúc</span> với JobHub</h1>
                        <p class="hero-desc">Hơn 10.000 công ty đang tuyển dụng. Hơn 100.000 thí sinh đã đăng ký. Hãy bắt đầu hành trình nghề nghiệp của bạn hôm nay.</p>
                        <div class="hero-actions">
                            <a href="#/jobs" class="btn btn-primary btn-lg">
                                <i class="fas fa-search"></i> Tìm việc làm ngay
                            </a>
                            <a href="#/register" class="btn btn-outline btn-lg">
                                <i class="fas fa-user-plus"></i> Đăng ký miễn phí
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Jobs Section -->
            <section class="section" style="padding: var(--space-2xl) 0;">
                <div class="container">
                    <div class="section-header">
                        <h2 class="h2">Việc làm <span class="text-primary">đang hot</span></h2>
                        <a href="#/jobs" class="view-all-link">Xem tất cả <i class="fas fa-arrow-right"></i></a>
                    </div>

                    <div id="job-grid" class="job-grid">
                        <!-- Jobs will be rendered here -->
                        <div class="empty-state">
                            <div class="empty-state-icon"><i class="fas fa-search"></i></div>
                            <div class="empty-state-title">Đang tải việc làm...</div>
                            <div class="empty-state-desc">Vui lòng chờ trong giây lát</div>
                        </div>
                    </div>

                    <div class="pagination" id="pagination">
                        <!-- Pagination will be rendered here -->
                    </div>
                </div>
            </section>

            <!-- Categories Section -->
            <section class="section" style="padding: var(--space-2xl) 0; background: var(--color-gray-100);">
                <div class="container">
                    <div class="section-header">
                        <h2 class="h2">Danh mục các <span class="text-primary">ngành nghề</span></h2>
                    </div>
                    <div class="category-grid" id="category-grid">
                        <!-- Categories will be rendered here -->
                        <div class="category-card empty-state">
                            <div class="empty-state-icon"><i class="fas fa-folder-open"></i></div>
                            <div class="empty-state-title">Đang tải danh mục...</div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    async loadJobs() {
        try {
            const response = await api.getJobs({ page: this.currentPage, pageSize: 6, status: 3 });
            if (response.data) {
                this.jobs = response.data.items || [];
                this.totalPages = Math.ceil(response.data.totalCount / 6) || 1;

                const grid = document.getElementById('job-grid');
                if (grid) {
                    if (this.jobs.length === 0) {
                        grid.innerHTML = `
                            <div class="empty-state">
                                <div class="empty-state-icon"><i class="fas fa-inbox"></i></div>
                                <div class="empty-state-title">Không có việc làm nào</div>
                                <div class="empty-state-desc">Thử thay đổi bộ lọc hoặc quay lại sau</div>
                            </div>
                        `;
                    } else {
                        grid.innerHTML = this.jobs.map(job => this.renderJobCard(job)).join('');
                    }
                }
            }
        } catch (error) {
            console.error('Error loading jobs:', error);
            const grid = document.getElementById('job-grid');
            if (grid) {
                grid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fas fa-exclamation-circle"></i></div>
                        <div class="empty-state-title">Lỗi khi tải việc làm</div>
                        <div class="empty-state-desc">Vui lòng thử lại sau</div>
                    </div>
                `;
            }
        }
    }

    renderJobCard(job) {
        const company = job.company || {};
        const category = job.category || {};
        return `
            <div class="job-card card">
                <div class="job-card-media">
                    <i class="fas fa-briefcase" style="font-size: 3rem; color: var(--color-primary);"></i>
                </div>
                <div class="job-card-body">
                    <span class="badge badge-primary">${job.statusName || 'Đang tuyển dụng'}</span>
                    <h3 class="h4">${job.title || 'Tên việc làm không rõ'}</h3>
                    <div class="job-card-meta">
                        <span class="meta-item">
                            <i class="fas fa-building"></i> ${company.name || 'Công ty không rõ'}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-map-marker-alt"></i> ${job.location || 'Hà Nội'}
                        </span>
                    </div>
                    <p class="job-card-desc">${job.shortDescription || 'Mô tả ngắn'}</p>
                    <div class="job-card-footer">
                        <span class="text-muted text-sm">
                            <i class="fas fa-tag"></i> ${job.jobTypeName || 'Full-time'}
                            &nbsp;|&nbsp;
                            <i class="fas fa-user-graduate"></i> ${job.experienceLevelName || 'Mới tốt nghiệp'}
                            &nbsp;|&nbsp;
                            <i class="fas fa-eye"></i> ${job.viewCount || 0} lượt xem
                        </span>
                        <span class="salary">
                            <i class="fas fa-money-bill"></i> ${formatSalary(job.salaryMin, job.salaryMax, job.salaryTypeName)}
                        </span>
                    </div>
                    <div class="job-card-actions">
                        <a href="#/jobs/${job.id}" class="btn btn-sm btn-primary">
                            <i class="fas fa-arrow-right"></i> Xem chi tiết
                        </a>
                        <button class="btn btn-sm btn-outline save-btn" onclick="event.stopPropagation(); toggleSaveJob(${job.id})">
                            <i class="fas fa-bookmark"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async loadCategories() {
        try {
            const response = await api.getCategories();
            const grid = document.getElementById('category-grid');
            if (grid && response.data) {
                grid.innerHTML = response.data.map(cat => `
                    <a href="#/jobs?categoryId=${cat.id}" class="category-card card">
                        <div class="category-card-icon">
                            <i class="fas ${cat.icon || 'fa-folder'}"></i>
                        </div>
                        <div class="category-card-body">
                            <h4 class="h5">${cat.name}</h4>
                            <p class="text-muted text-xs">${cat.description || ''}</p>
                        </div>
                    </a>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }
}
