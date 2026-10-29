// Jobs View - Danh sách việc làm với tìm kiếm và lọc
class JobHubJobsView {
    constructor() {
        this.jobs = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.filters = {
            keyword: '',
            categoryId: null,
            jobType: null,
            experienceLevel: null,
            location: null,
            status: 3 // Published
        };
    }

    render() {
        return `
            <div class="jobs-page">
                <!-- Page header -->
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-search text-primary"></i> Tìm việc làm
                    </h1>
                    <p class="text-muted">Khám phá các cơ hội nghề nghiệp từ các công ty hàng đầu</p>
                </div>

                <!-- Filters -->
                <div class="filters-card card">
                    <div class="card-body">
                        <div class="filters-row">
                            <div class="filter-group">
                                <label class="form-label" for="filter-keyword">
                                    <i class="fas fa-search"></i> Từ khóa
                                </label>
                                <input
                                    type="text"
                                    id="filter-keyword"
                                    class="form-control"
                                    placeholder="Ví dụ: Frontend Developer, Java..."
                                    value="${this.filters.keyword}"
                                    oninput="jobHubJobsView.updateFilters()"
                                >
                            </div>
                            <div class="filter-group">
                                <label class="form-label" for="filter-category">
                                    <i class="fas fa-folder"></i> Danh mục
                                </label>
                                <select
                                    id="filter-category"
                                    class="form-control"
                                    onchange="jobHubJobsView.updateFilters()"
                                >
                                    <option value="">Tất cả danh mục</option>
                                    <option value="1">Lập trình & Phát triển</option>
                                    <option value="2">Thiết kế & Creative</option>
                                    <option value="3">Kiểm thử & QA</option>
                                    <option value="4">DevOps & Infrastructure</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <label class="form-label" for="filter-type">
                                    <i class="fas fa-clock"></i> Loại công việc
                                </label>
                                <select
                                    id="filter-type"
                                    class="form-control"
                                    onchange="jobHubJobsView.updateFilters()"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="1">Toàn thời gian</option>
                                    <option value="2">Bán thời gian</option>
                                    <option value="3">Hợp đồng</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <label class="form-label" for="filter-location">
                                    <i class="fas fa-map-marker-alt"></i> Địa điểm
                                </label>
                                <input
                                    type="text"
                                    id="filter-location"
                                    class="form-control"
                                    placeholder="TP.HCM, Hà Nội..."
                                    value="${this.filters.location || ''}"
                                    oninput="jobHubJobsView.updateFilters()"
                                >
                            </div>
                            <div class="filter-group">
                                <button
                                    class="btn btn-primary"
                                    onclick="jobHubJobsView.applyFilters()"
                                >
                                    <i class="fas fa-filter"></i> Lọc
                                </button>
                                <button
                                    class="btn btn-outline"
                                    onclick="jobHubJobsView.clearFilters()"
                                >
                                    <i class="fas fa-times"></i> Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Job grid -->
                <div id="job-grid" class="job-grid">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fas fa-search"></i></div>
                        <div class="empty-state-title">Đang tải việc làm...</div>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="pagination" id="pagination">
                    <!-- Pagination will be rendered here -->
                </div>
            </div>
        `;
    }

    async renderJobs() {
        try {
            const params = {
                page: this.currentPage,
                pageSize: 12,
                keyword: this.filters.keyword || undefined,
                categoryId: this.filters.categoryId || undefined,
                jobType: this.filters.jobType || undefined,
                location: this.filters.location || undefined,
                status: this.filters.status
            };

            const response = await api.getJobs(params);
            if (response.data) {
                this.jobs = response.data.items || [];
                this.totalPages = Math.ceil(response.data.totalCount / 12) || 1;

                const grid = document.getElementById('job-grid');
                if (grid) {
                    if (this.jobs.length === 0) {
                        grid.innerHTML = `
                            <div class="empty-state">
                                <div class="empty-state-icon"><i class="fas fa-inbox"></i></div>
                                <div class="empty-state-title">Không tìm thấy việc làm</div>
                                <div class="empty-state-desc">Thử thay đổi bộ lọc hoặc quay lại sau</div>
                            </div>
                        `;
                    } else {
                        grid.innerHTML = this.jobs.map(job => this.renderJobCard(job)).join('');
                    }
                }

                this.renderPagination();
            }
        } catch (error) {
            console.error('Error loading jobs:', error);
            const grid = document.getElementById('job-grid');
            if (grid) {
                grid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fas fa-exclamation-circle"></i></div>
                        <div class="empty-state-title">Lỗi khi tải việc làm</div>
                    </div>
                `;
            }
        }
    }

    renderJobCard(job) {
        const company = job.company || {};
        return `
            <div class="job-card card">
                <div class="job-card-media">
                    <i class="fas fa-briefcase" style="font-size: 2.5rem; color: var(--color-primary);"></i>
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
                        </span>
                        <span class="salary">
                            <i class="fas fa-money-bill"></i> ${formatSalary(job.salaryMin, job.salaryMax, job.salaryTypeName)}
                        </span>
                    </div>
                    <div class="job-card-actions">
                        <a href="#/jobs/${job.id}" class="btn btn-sm btn-primary">
                            <i class="fas fa-arrow-right"></i> Xem chi tiết
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        let html = '';
        if (this.totalPages > 1) {
            html += `<div class="pagination-buttons">`;
            for (let i = 1; i <= this.totalPages; i++) {
                html += `<button class="btn btn-sm ${i === this.currentPage ? 'btn-primary' : 'btn-outline'}" onclick="jobHubJobsView.goToPage(${i})">${i}</button>`;
            }
            html += `</div>`;
        }
        pagination.innerHTML = html;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderJobs();
    }

    updateFilters() {
        this.filters.keyword = document.getElementById('filter-keyword')?.value || '';
        this.filters.categoryId = document.getElementById('filter-category')?.value || null;
        this.filters.jobType = document.getElementById('filter-type')?.value || null;
        this.filters.location = document.getElementById('filter-location')?.value || '';
        this.currentPage = 1;
        this.renderJobs();
    }

    applyFilters() {
        this.updateFilters();
    }

    clearFilters() {
        const keywordInput = document.getElementById('filter-keyword');
        const categoryInput = document.getElementById('filter-category');
        const typeInput = document.getElementById('filter-type');
        const locationInput = document.getElementById('filter-location');
        if (keywordInput) keywordInput.value = '';
        if (categoryInput) categoryInput.value = '';
        if (typeInput) typeInput.value = '';
        if (locationInput) locationInput.value = '';
        this.filters = {
            keyword: '',
            categoryId: null,
            jobType: null,
            location: null,
            status: 3
        };
        this.currentPage = 1;
        this.renderJobs();
    }
}

// Global instance
const jobHubJobsView = new JobHubJobsView();
