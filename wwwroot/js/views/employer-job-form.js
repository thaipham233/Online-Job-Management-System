// Employer Job Form View - Form chỉnh sửa công ty
class JobHubEmployerJobFormView {
    render() {
        return `
            <div class="employer-job-form">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-edit text-primary"></i> Quản lý công ty
                    </h1>
                    <p class="text-muted">Cập nhật thông tin công ty của bạn</p>
                </div>

                <div class="card">
                    <div class="card-body">
                        <form id="company-form" class="form">
                            <div class="form-group">
                                <label class="form-label" for="company-name">
                                    <i class="fas fa-building"></i> Tên công ty
                                </label>
                                <input
                                    type="text"
                                    id="company-name"
                                    class="form-control"
                                    placeholder="Tên công ty của bạn"
                                    value="Công ty TNHH ABC Technology"
                                >
                            </div>
                            <div class="form-row">
                                <div class="form-group col">
                                    <label class="form-label" for="company-website">
                                        <i class="fas fa-globe"></i> Website
                                    </label>
                                    <input
                                        type="url"
                                        id="company-website"
                                        class="form-control"
                                        placeholder="https://yourcompany.com"
                                        value="https://abctech.vn"
                                    >
                                </div>
                                <div class="form-group col">
                                    <label class="form-label" for="company-location">
                                        <i class="fas fa-map-marker-alt"></i> Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        id="company-location"
                                        class="form-control"
                                        placeholder="Hà Nội, Việt Nam"
                                        value="Hà Nội"
                                    >
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="company-description">
                                    <i class="fas fa-align-left"></i> Mô tả
                                </label>
                                <textarea
                                    id="company-description"
                                    class="form-control"
                                    rows="4"
                                    placeholder="Mô tả về công ty của bạn..."
                                ></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="company-logo">
                                    <i class="fas fa-image"></i> Logo
                                </label>
                                <div class="input-group">
                                    <input type="file" id="company-logo" class="form-control" accept="image/*">
                                    <button type="button" class="btn btn-secondary btn-sm">
                                        <i class="fas fa-upload"></i> Tải lên
                                    </button>
                                </div>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary btn-lg w-full">
                                    <i class="fas fa-save"></i> Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        const form = document.getElementById('company-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Cập nhật công ty thành công!', 'success');
        });
    }
}

const jobHubEmployerJobFormView = new JobHubEmployerJobFormView();
