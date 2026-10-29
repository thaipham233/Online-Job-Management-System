// Employer Pricing View
class JobHubEmployerPricingView {
    render() {
        return `
            <div class="employer-pricing-page">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-tag text-primary"></i> Bảng giá
                    </h1>
                    <p class="text-muted">Các gói dịch vụ tuyển dụng phù hợp với nhu cầu của bạn</p>
                </div>

                <div class="pricing-grid">
                    <div class="pricing-card card">
                        <div class="pricing-card-header">
                            <h3 class="h4">Gói Cơ bản</h3>
                            <div class="pricing-price">
                                <h1>0đ</h1>
                                <p>tháng</p>
                            </div>
                        </div>
                        <div class="pricing-card-body">
                            <ul class="pricing-features">
                                <li><i class="fas fa-check text-success"></i> Tích hợp với JobHub</li>
                                <li><i class="fas fa-check text-success"></i> Hiển thị tối đa 5 việc làm</li>
                                <li><i class="fas fa-check text-success"></i> Tổng quan đơn ứng tuyển</li>
                                <li><i class="fas fa-check text-success"></i> Hỗ trợ cơ bản</li>
                            </ul>
                            <button class="btn btn-outline btn-sm">
                                <i class="fas fa-info-circle"></i> Xem chi tiết
                            </button>
                        </div>
                    </div>

                    <div class="pricing-card card featured">
                        <div class="pricing-card-header">
                            <h3 class="h4">Gói Nền tảng</h3>
                            <div class="pricing-price">
                                <h1>150.000đ</h1>
                                <p>tháng</p>
                            </div>
                        </div>
                        <div class="pricing-card-body">
                            <ul class="pricing-features">
                                <li><i class="fas fa-check text-success"></i> Tất cả tính năng của Gói Cơ bản</li>
                                <li><i class="fas fa-check text-success"></i> Hiển thị tối đa 20 việc làm</li>
                                <li><i class="fas fa-check text-success"></i> Nổi bật việc làm</li>
                                <li><i class="fas fa-check text-success"></i> Thống kê chi tiết</li>
                                <li><i class="fas fa-check text-success"></i> Hỗ trợ 24/7</li>
                            </ul>
                            <button class="btn btn-primary btn-sm">
                                <i class="fas fa-bolt"></i> Đăng ký
                            </button>
                        </div>
                    </div>

                    <div class="pricing-card card">
                        <div class="pricing-card-header">
                            <h3 class="h4">Gói Nâng cao</h3>
                            <div class="pricing-price">
                                <h1>450.000đ</h1>
                                <p>tháng</p>
                            </div>
                        </div>
                        <div class="pricing-card-body">
                            <ul class="pricing-features">
                                <li><i class="fas fa-check text-success"></i> Tất cả tính năng của Gói Nền tảng</li>
                                <li><i class="fas fa-check text-success"></i> Hiển thị không giới hạn</li>
                                <li><i class="fas fa-check text-success"></i> Mã tìm kiếm nâng cao</li>
                                <li><i class="fas fa-check text-success"></i> Tư vấn tuyển dụng chuyên sâu</li>
                                <li><i class="fas fa-check text-success"></i> Hỗ trợ 24/7 ưu tiên</li>
                            </ul>
                            <button class="btn btn-primary btn-sm">
                                <i class="fas fa-bolt"></i> Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

const jobHubEmployerPricingView = new JobHubEmployerPricingView();
