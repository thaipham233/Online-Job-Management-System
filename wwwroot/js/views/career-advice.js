// Career Advice View - Tư vấn nghề nghiệp
class JobHubCareerAdviceView {
    render() {
        return `
            <div class="career-advice-page">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-lightbulb text-primary"></i> Tư vấn nghề nghiệp
                    </h1>
                    <p class="text-muted">Hướng dẫn phát triển sự nghiệp và lựa chọn ngành nghề đúng đắn</p>
                </div>

                <!-- Career tips -->
                <div class="career-grid">
                    <div class="career-card card">
                        <div class="career-card-icon bg-blue-100">
                            <i class="fas fa-graduation-cap text-blue-600"></i>
                        </div>
                        <div class="career-card-body">
                            <h3 class="h4">Xác định điểm mạnh</h3>
                            <p class="text-muted">Tìm hiểu kỹ năng, sở thích và giá trị của bạn để lựa chọn đúng hướng phát triển.</p>
                            <a href="#/jobs" class="btn btn-sm btn-outline">Khám phá</a>
                        </div>
                    </div>
                    <div class="career-card card">
                        <div class="career-card-icon bg-green-100">
                            <i class="fas fa-bullseye text-green-600"></i>
                        </div>
                        <div class="career-card-body">
                            <h3 class="h4">Lên kế hoạch phát triển</h3>
                            <p class="text-muted">Đặt mục tiêu rõ ràng và lập lộ trình học tập nghề nghiệp chi tiết.</p>
                            <a href="#/jobs" class="btn btn-sm btn-outline">Khám phá</a>
                        </div>
                    </div>
                    <div class="career-card card">
                        <div class="career-card-icon bg-yellow-100">
                            <i class="fas fa-search text-yellow-600"></i>
                        </div>
                        <div class="career-card-body">
                            <h3 class="h4">Mối quan hệ mạng lưới</h3>
                            <p class="text-muted">Xây dựng mạng lưới quan hệ chuyên nghiệp để mở ra cơ hội mới.</p>
                            <a href="#/jobs" class="btn btn-sm btn-outline">Khám phá</a>
                        </div>
                    </div>
                    <div class="career-card card">
                        <div class="career-card-icon bg-purple-100">
                            <i class="fas fa-gem text-purple-600"></i>
                        </div>
                        <div class="career-card-body">
                            <h3 class="h4">Công nghệ và kỹ năng</h3>
                            <p class="text-muted">Định hướng kỹ năng cần có cho từng ngành nghề phát triển.</p>
                            <a href="#/jobs" class="btn btn-sm btn-outline">Khám phá</a>
                        </div>
                    </div>
                </div>

                <!-- Popular careers -->
                <div class="career-stats">
                    <div class="card">
                        <div class="card-body">
                            <h3 class="h4">Nghề nghiệp hot nhất 2024</h3>
                            <div class="career-list">
                                <div class="career-item">
                                    <span class="career-rank">#1</span>
                                    <div class="career-info">
                                        <h4 class="h5">Lập trình phần mềm</h4>
                                        <p class="text-muted">Lương 12-40 triệu/tháng, tăng trưởng nhanh</p>
                                    </div>
                                </div>
                                <div class="career-item">
                                    <span class="career-rank">#2</span>
                                    <div class="career-info">
                                        <h4 class="h5">Data Science & AI</h4>
                                        <p class="text-muted">Lương 20-50 triệu/tháng, nhu cầu cao</p>
                                    </div>
                                </div>
                                <div class="career-item">
                                    <span class="career-rank">#3</span>
                                    <div class="career-info">
                                        <h4 class="h5">DevOps Engineer</h4>
                                        <p class="text-muted">Lương 18-35 triệu/tháng</p>
                                    </div>
                                </div>
                                <div class="career-item">
                                    <span class="career-rank">#4</span>
                                    <div class="career-info">
                                        <h4 class="h5">UX/UI Designer</h4>
                                        <p class="text-muted">Lương 8-20 triệu/tháng</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

const jobHubCareerAdviceView = new JobHubCareerAdviceView();
