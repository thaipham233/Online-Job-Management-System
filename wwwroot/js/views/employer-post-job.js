// Employer Post Job View - Đăng tuyển dụng
class JobHubEmployerPostJobView {
    render() {
        return `
            <div class="employer-post-job">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-plus-circle text-primary"></i> Đăng tuyển dụng
                    </h1>
                    <p class="text-muted">Tạo vị trí việc làm mới cho công ty</p>
                </div>

                <div class="post-job-form card">
                    <div class="card-body">
                        <form id="post-job-form" class="form">
                            <div class="form-group">
                                <label class="form-label" for="job-title">
                                    <i class="fas fa-heading"></i> Tên vị trí
                                </label>
                                <input
                                    type="text"
                                    id="job-title"
                                    class="form-control"
                                    placeholder="Ví dụ: Frontend Developer"
                                    required
                                >
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="job-description">
                                    <i class="fas fa-align-left"></i> Mô tả công việc
                                </label>
                                <textarea
                                    id="job-description"
                                    class="form-control"
                                    rows="6"
                                    placeholder="Mô tả chi tiết về công việc, trách nhiệm..."
                                    required
                                ></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="job-requirements">
                                    <i class="fas fa-check-circle"></i> Yêu cầu
                                </label>
                                <textarea
                                    id="job-requirements"
                                    class="form-control"
                                    rows="4"
                                    placeholder="Kỹ năng, kinh nghiệm cần thiết..."
                                ></textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group col">
                                    <label class="form-label" for="job-location">
                                        <i class="fas fa-map-marker-alt"></i> Địa điểm
                                    </label>
                                    <input
                                        type="text"
                                        id="job-location"
                                        class="form-control"
                                        placeholder="Hà Nội, TP.HCM..."
                                    >
                                </div>
                                <div class="form-group col">
                                    <label class="form-label" for="job-type">
                                        <i class="fas fa-clock"></i> Loại công việc
                                    </label>
                                    <select
                                        id="job-type"
                                        class="form-control"
                                    >
                                        <option value="1">Toàn thời gian</option>
                                        <option value="2">Bán thời gian</option>
                                        <option value="3">Hợp đồng</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col">
                                    <label class="form-label" for="job-salary-min">
                                        <i class="fas fa-dollar-sign"></i> Mức lương (tối thiểu)
                                    </label>
                                    <input
                                        type="number"
                                        id="job-salary-min"
                                        class="form-control"
                                        placeholder="0"
                                        min="0"
                                    >
                                </div>
                                <div class="form-group col">
                                    <label class="form-label" for="job-salary-max">
                                        <i class="fas fa-dollar-sign"></i> Mức lương (tối đa)
                                    </label>
                                    <input
                                        type="number"
                                        id="job-salary-max"
                                        class="form-control"
                                        placeholder="0"
                                        min="0"
                                    >
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="job-category">
                                    <i class="fas fa-folder"></i> Danh mục
                                </label>
                                <select id="job-category" class="form-control">
                                    <option value="1">Lập trình & Phát triển</option>
                                    <option value="2">Thiết kế & Creative</option>
                                    <option value="3">Kiểm thử & QA</option>
                                    <option value="4">DevOps & Infrastructure</option>
                                </select>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary btn-lg w-full">
                                    <i class="fas fa-check-circle"></i> Đăng tuyển dụng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        const form = document.getElementById('post-job-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            showToast('Đang xử lý...', 'info', 2000);
            showToast('Đăng tuyển dụng thành công!', 'success');
            setTimeout(() => {
                router.navigate('/employer');
            }, 1500);
        });
    }
}

const jobHubEmployerPostJobView = new JobHubEmployerPostJobView();
