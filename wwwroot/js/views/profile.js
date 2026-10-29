// Profile View - Hồ sơ cá nhân
class JobHubProfileView {
    constructor() {
        this.user = null;
        this.resumes = [];
    }

    async render() {
        return `
            <div class="profile-container">
                <div class="page-header">
                    <h1 class="h1">Hồ sơ cá nhân</h1>
                    <p class="text-muted">Quản lý hồ sơ ứng viên của bạn</p>
                </div>

                <div class="profile-grid">
                    <!-- Profile header -->
                    <div class="profile-header card">
                        <div class="profile-avatar">
                            <img src="${this.user?.avatarUrl || 'https://via.placeholder.com/150'}" alt="Ảnh đại diện">
                            <div class="avatar-edit">
                                <i class="fas fa-camera"></i>
                            </div>
                        </div>
                        <div class="profile-info">
                            <h2 class="h3">${this.user?.fullName || 'Chưa cập nhật'}</h2>
                            <p class="text-muted">${this.user?.email || ''}</p>
                            <div class="profile-tags">
                                <span class="badge badge-primary">${this.user?.roles?.join(', ') || 'Candidate'}</span>
                            </div>
                        </div>
                        <div class="profile-actions">
                            <button class="btn btn-outline btn-sm">
                                <i class="fas fa-edit"></i> Sửa hồ sơ
                            </button>
                            <button class="btn btn-outline btn-sm">
                                <i class="fas fa-download"></i> Tải CV
                            </button>
                        </div>
                    </div>

                    <!-- Profile details -->
                    <div class="profile-details">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="h4">Thông tin liên hệ</h3>
                            </div>
                            <div class="card-body">
                                <div class="detail-row">
                                    <div class="detail-label">
                                        <i class="fas fa-envelope"></i> Email
                                    </div>
                                    <div class="detail-value">${this.user?.email || 'Chưa cập nhật'}</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">
                                        <i class="fas fa-phone"></i> Số điện thoại
                                    </div>
                                    <div class="detail-value">${this.user?.phoneNumber || 'Chưa cập nhật'}</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">
                                        <i class="fas fa-map-marker-alt"></i> Địa chỉ
                                    </div>
                                    <div class="detail-value">${this.user?.address || 'Chưa cập nhật'}</div>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <h3 class="h4">Kinh nghiệm làm việc</h3>
                            </div>
                            <div class="card-body">
                                <div class="experience-item">
                                    <div class="experience-company">ABC Tech</div>
                                    <div class="experience-role">Senior .NET Developer</div>
                                    <div class="experience-dates">2020 - Hiện tại</div>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <h3 class="h4">Kỹ năng</h3>
                            </div>
                            <div class="card-body">
                                <div class="skill-tags">
                                    <span class="badge badge-primary">C#</span>
                                    <span class="badge badge-primary">.NET Core</span>
                                    <span class="badge badge-primary">SQL Server</span>
                                    <span class="badge badge-primary">Azure</span>
                                    <span class="badge badge-primary">Docker</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Resumes -->
                    <div class="resumes-section">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="h4">Hồ sơ công khai</h3>
                                <a href="#/resume/new" class="btn btn-sm btn-primary">
                                    <i class="fas fa-plus"></i> Thêm hồ sơ
                                </a>
                            </div>
                            <div class="card-body">
                                <div class="resume-list">
                                    <div class="resume-item card">
                                        <div class="resume-item-icon bg-green-100">
                                            <i class="fas fa-file-alt text-green-600"></i>
                                        </div>
                                        <div class="resume-item-body">
                                            <h4 class="resume-item-title">Senior .NET Developer</h4>
                                            <p class="resume-item-desc">3 năm kinh nghiệm .NET Core, Azure, Microservices</p>
                                            <div class="resume-item-meta">
                                                <span class="text-muted text-xs"><i class="fas fa-map-marker-alt"></i> Hà Nội</span>
                                                <span class="text-muted text-xs"><i class="fas fa-dollar-sign"></i> 25 triệu/tháng</span>
                                            </div>
                                            <div class="resume-item-actions">
                                                <button class="btn btn-sm btn-outline">
                                                    <i class="fas fa-eye"></i> Xem
                                                </button>
                                                <button class="btn btn-sm btn-outline">
                                                    <i class="fas fa-edit"></i> Sửa
                                                </button>
                                                <button class="btn btn-sm btn-outline">
                                                    <i class="fas fa-download"></i> Tải
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        this.loadProfile();
        this.loadResumes();
    }

    async loadProfile() {
        try {
            const result = await api.getProfile();
            if (result.data) {
                this.user = result.data;
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    async loadResumes() {
        try {
            const result = await api.getResumes();
            if (result.data) {
                this.resumes = result.data;
            }
        } catch (error) {
            console.error('Error loading resumes:', error);
        }
    }
}
