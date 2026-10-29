// Admin Categories View
class JobHubAdminCategoriesView {
    constructor() {
        this.categories = [];
    }

    render() {
        return `
            <div class="admin-categories-page">
                <div class="page-header">
                    <h1 class="h1">
                        <i class="fas fa-folder text-primary"></i> Danh mục
                    </h1>
                </div>

                <div class="card">
                    <div class="card-body">
                        <div class="d-flex gap-sm mb-md">
                            <input type="text" class="form-control" placeholder="Tìm kiếm danh mục...">
                            <button class="btn btn-primary">
                                <i class="fas fa-plus"></i> Thêm danh mục
                            </button>
                        </div>
                        <div class="categories-grid">
                            <div class="category-card card">
                                <div class="category-card-icon"><i class="fas fa-code"></i></div>
                                <div class="category-card-body">
                                    <h4 class="h5">Lập trình & Phát triển</h4>
                                    <p class="text-muted">Các vị trí lập trình viên</p>
                                    <div class="category-card-actions">
                                        <button class="btn btn-sm btn-outline"><i class="fas fa-edit"></i> Sửa</button>
                                        <button class="btn btn-sm btn-outline"><i class="fas fa-trash"></i> Xóa</button>
                                    </div>
                                </div>
                            </div>
                            <div class="category-card card">
                                <div class="category-card-icon"><i class="fas fa-palette"></i></div>
                                <div class="category-card-body">
                                    <h4 class="h5">Thiết kế & Creative</h4>
                                    <p class="text-muted">UI/UX, Graphic Design</p>
                                    <div class="category-card-actions">
                                        <button class="btn btn-sm btn-outline"><i class="fas fa-edit"></i> Sửa</button>
                                        <button class="btn btn-sm btn-outline"><i class="fas fa-trash"></i> Xóa</button>
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
        this.loadCategories();
    }

    async loadCategories() {
        try {
            const result = await api.getCategories();
            if (result.data) {
                this.categories = result.data;
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }
}

const jobHubAdminCategoriesView = new JobHubAdminCategoriesView();
