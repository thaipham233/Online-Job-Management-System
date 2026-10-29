// Companies View - Danh sách công ty
class JobHubCompaniesView {
    constructor() {
        this.companies = [];
        this.currentPage = 1;
        this.totalPages = 1;
    }

    render() {
        return `
            <div class="companies-page">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-building text-primary"></i> Danh sách công ty
                    </h1>
                    <p class="text-muted">Khám phá các tổ chức và cơ hội nghề nghiệp</p>
                </div>

                <!-- Search -->
                <div class="search-box card">
                    <div class="card-body">
                        <div class="input-group">
                            <i class="fas fa-search"></i>
                            <input
                                type="text"
                                class="form-control"
                                id="company-search"
                                placeholder="Tìm công ty theo tên, ngành nghề..."
                                oninput="jobHubCompaniesView.searchCompanies()"
                            >
                        </div>
                    </div>
                </div>

                <!-- Companies grid -->
                <div class="companies-grid">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fas fa-building"></i></div>
                        <div class="empty-state-title">Đang tải công ty...</div>
                    </div>
                </div>
            </div>
        `;
    }

    async renderCompanies() {
        try {
            const params = {
                page: this.currentPage,
                pageSize: 12,
                keyword: document.getElementById('company-search')?.value || undefined
            };

            const response = await api.getCompanies(params);
            if (response.data) {
                this.companies = response.data.items || [];
                this.totalPages = Math.ceil(response.data.totalCount / 12) || 1;

                const grid = document.querySelector('.companies-grid');
                if (grid) {
                    if (this.companies.length === 0) {
                        grid.innerHTML = `
                            <div class="empty-state">
                                <div class="empty-state-icon"><i class="fas fa-inbox"></i></div>
                                <div class="empty-state-title">Không tìm thấy công ty</div>
                            </div>
                        `;
                    } else {
                        grid.innerHTML = this.companies.map(company => `
                            <div class="company-card card">
                                <div class="company-card-header">
                                    <div class="company-card-logo">
                                        <i class="fas fa-building"></i>
                                    </div>
                                    <div class="company-card-info">
                                        <h3 class="h4">${company.name || 'Tên công ty'}</h3>
                                        <p class="text-muted">${company.industry || 'Ngành nghề không rõ'}</p>
                                    </div>
                                    <span class="badge ${company.isVerified ? 'badge-success' : 'badge-warning'}">
                                        ${company.isVerified ? '<i class="fas fa-check-circle"></i> Đã xác minh' : '<i class="fas fa-clock"></i> Chờ xác minh'}
                                    </span>
                                </div>
                                <div class="company-card-body">
                                    <p class="company-card-desc">${company.description || ''}</p>
                                    <div class="company-card-meta">
                                        ${company.location ? `<span class="meta-item"><i class="fas fa-map-marker-alt"></i> ${company.location}</span>` : ''}
                                        <span class="meta-item"><i class="fas fa-user"></i> ${company.size || 0} nhân viên</span>
                                    </div>
                                </div>
                                <div class="company-card-footer">
                                    <a href="#/companies/${company.id}" class="btn btn-sm btn-primary">
                                        <i class="fas fa-arrow-right"></i> Xem chi tiết
                                    </a>
                                </div>
                            </div>
                        `).join('');
                    }
                }
            }
        } catch (error) {
            console.error('Error loading companies:', error);
        }
    }

    searchCompanies() {
        this.currentPage = 1;
        this.renderCompanies();
    }
}

const jobHubCompaniesView = new JobHubCompaniesView();
