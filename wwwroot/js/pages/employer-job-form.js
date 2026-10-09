// Employer Job Create/Edit Page
export async function render(container, jobId = null) {
    requireAuth(async () => {
        if (!auth.isEmployer()) {
            showToast('Bạn không có quyền truy cập', 'error');
            router.navigate('/');
            return;
        }

        const isEdit = !!jobId;
        let job = {
            title: '',
            description: '',
            requirements: '',
            benefits: '',
            salaryMin: '',
            salaryMax: '',
            salaryType: 'Monthly',
            jobType: 'FullTime',
            experienceLevel: 'Junior',
            location: '',
            categoryId: '',
            skills: '',
            isHot: false,
            expiredDate: '',
            status: isEdit ? 'Draft' : 'Draft'
        };

        let categories = [];

        if (isEdit) {
            const [jobResult, categoriesResult] = await Promise.all([
                api.getJob(jobId),
                api.getCategories()
            ]);
            if (jobResult.error) {
                showToast(jobResult.error, 'error');
                router.navigate('/employer/jobs');
                return;
            }
            job = jobResult.data;
            categories = categoriesResult.data || [];
        } else {
            const categoriesResult = await api.getCategories();
            categories = categoriesResult.data || [];
        }

        // Format expiredDate for input
        const expiredDateValue = job.expiredDate ? job.expiredDate.split('T')[0] : '';

        container.innerHTML = `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">${isEdit ? 'Chỉnh sửa việc làm' : 'Đăng việc mới'}</h1>
                        <p class="text-gray-500 mt-1">${isEdit ? 'Cập nhật thông tin tin tuyển dụng' : 'Tạo tin tuyển dụng để thu hút ứng viên'}</p>
                    </div>
                    <a href="#/employer/jobs" class="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors" data-link>
                        <i class="fas fa-arrow-left mr-2"></i>Quay lại
                    </a>
                </div>

                <form id="job-form" class="space-y-8" novalidate>
                    <!-- Basic Info -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <i class="fas fa-info-circle text-primary-500 mr-2"></i>
                            Thông tin cơ bản
                        </h2>
                        <div class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề việc làm <span class="text-red-500">*</span></label>
                                <input type="text" name="title" required value="${job.title}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="VD: Senior Frontend Developer (React/TypeScript)">
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Danh mục <span class="text-red-500">*</span></label>
                                    <select name="categoryId" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="">Chọn danh mục</option>
                                        ${categories.map(c => `<option value="${c.id}" ${job.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Loại hình <span class="text-red-500">*</span></label>
                                    <select name="jobType" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="FullTime" ${job.jobType === 'FullTime' ? 'selected' : ''}>Toàn thời gian</option>
                                        <option value="PartTime" ${job.jobType === 'PartTime' ? 'selected' : ''}>Bán thời gian</option>
                                        <option value="Contract" ${job.jobType === 'Contract' ? 'selected' : ''}>Hợp đồng</option>
                                        <option value="Internship" ${job.jobType === 'Internship' ? 'selected' : ''}>Thực tập</option>
                                        <option value="Freelance" ${job.jobType === 'Freelance' ? 'selected' : ''}>Freelance</option>
                                        <option value="Remote" ${job.jobType === 'Remote' ? 'selected' : ''}>Từ xa</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Cấp bậc <span class="text-red-500">*</span></label>
                                    <select name="experienceLevel" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="Fresher" ${job.experienceLevel === 'Fresher' ? 'selected' : ''}>Mới tốt nghiệp</option>
                                        <option value="Junior" ${job.experienceLevel === 'Junior' ? 'selected' : ''}>Junior (1-3 năm)</option>
                                        <option value="Mid" ${job.experienceLevel === 'Mid' ? 'selected' : ''}>Mid-level (3-5 năm)</option>
                                        <option value="Senior" ${job.experienceLevel === 'Senior' ? 'selected' : ''}>Senior (5+ năm)</option>
                                        <option value="Lead" ${job.experienceLevel === 'Lead' ? 'selected' : ''}>Team Lead</option>
                                        <option value="Manager" ${job.experienceLevel === 'Manager' ? 'selected' : ''}>Quản lý</option>
                                        <option value="Director" ${job.experienceLevel === 'Director' ? 'selected' : ''}>Giám đốc</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Địa điểm <span class="text-red-500">*</span></label>
                                    <input type="text" name="location" required value="${job.location}"
                                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="VD: Hà Nội, TP.HCM, Từ xa, Hybrid">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Lương từ (VNĐ)</label>
                                    <input type="number" name="salaryMin" value="${job.salaryMin}" min="0"
                                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="15000000">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Lương đến (VNĐ)</label>
                                    <input type="number" name="salaryMax" value="${job.salaryMax}" min="0"
                                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="25000000">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Đơn vị lương</label>
                                    <select name="salaryType" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="Monthly" ${job.salaryType === 'Monthly' ? 'selected' : ''}>Tháng</option>
                                        <option value="Yearly" ${job.salaryType === 'Yearly' ? 'selected' : ''}>Năm</option>
                                        <option value="Hourly" ${job.salaryType === 'Hourly' ? 'selected' : ''}>Giờ</option>
                                        <option value="Daily" ${job.salaryType === 'Daily' ? 'selected' : ''}>Ngày</option>
                                        <option value="Negotiable" ${job.salaryType === 'Negotiable' ? 'selected' : ''}>Thương lượng</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Kỹ năng yêu cầu</label>
                                <input type="text" name="skills" value="${job.skills}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="React, TypeScript, Node.js, AWS (cách nhau bởi dấu phẩy)">
                                <p class="text-sm text-gray-500 mt-1">Các kỹ năng cách nhau bởi dấu phẩy</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Hạn nộp đơn</label>
                                <input type="date" name="expiredDate" value="${expiredDateValue}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    min="${new Date().toISOString().split('T')[0]}">
                            </div>

                            <div class="flex items-center">
                                <input type="checkbox" name="isHot" id="isHot" ${job.isHot ? 'checked' : ''} class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                                <label for="isHot" class="ml-2 text-sm text-gray-600">Đánh dấu là việc làm "Hot" (hiển thị nổi bật)</label>
                            </div>
                        </div>
                    </section>

                    <!-- Description -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <i class="fas fa-file-alt text-primary-500 mr-2"></i>
                            Mô tả chi tiết
                        </h2>
                        <div class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Mô tả công việc <span class="text-red-500">*</span></label>
                                <textarea name="description" required rows="6"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                    placeholder="Mô tả chi tiết về công việc, trách nhiệm chính...">${job.description}</textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Yêu cầu công việc <span class="text-red-500">*</span></label>
                                <textarea name="requirements" required rows="6"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                    placeholder="Kỹ năng, kinh nghiệm, bằng cấp, chứng chỉ yêu cầu...">${job.requirements}</textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Quyền lợi được hưởng</label>
                                <textarea name="benefits" rows="5"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                    placeholder="Bảo hiểm, du lịch, training, flexible hours, remote work...">${job.benefits}</textarea>
                            </div>
                        </div>
                    </section>

                    ${isEdit ? `
                    <!-- Status (only for edit) -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-toggle-on text-primary-500 mr-2"></i>
                            Trạng thái
                        </h2>
                        <div class="flex flex-wrap gap-4">
                            ${['Draft', 'Open', 'Paused', 'Closed'].map(s => `
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="status" value="${s}" ${job.status === s ? 'checked' : ''} class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500">
                                    <span class="ml-2 text-sm font-medium text-gray-700 capitalize">${getJobStatusLabel(s)}</span>
                                </label>
                            `).join('')}
                        </div>
                    </section>
                    ` : ''}

                    <!-- Actions -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-end">
                        <a href="#/employer/jobs" class="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center" data-link>
                            Hủy
                        </a>
                        ${isEdit ? `
                        <button type="submit" name="action" value="save" class="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center justify-center">
                            <i class="fas fa-save mr-2"></i>Cập nhật
                        </button>
                        <button type="submit" name="action" value="publish" class="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center">
                            <i class="fas fa-rocket mr-2"></i>Cập nhật & Xuất bản
                        </button>
                        ` : `
                        <button type="submit" name="action" value="draft" class="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                            <i class="fas fa-file-alt mr-2"></i>Lưu nháp
                        </button>
                        <button type="submit" name="action" value="publish" class="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center justify-center">
                            <i class="fas fa-rocket mr-2"></i>Đăng ngay
                        </button>
                        `}
                    </div>
                </form>
            </div>
        `;

        attachJobFormHandlers(isEdit, jobId);
    });
}

function attachJobFormHandlers(isEdit, jobId) {
    const form = document.getElementById('job-form');
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const action = formData.get('action') || 'draft';
        
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            requirements: formData.get('requirements'),
            benefits: formData.get('benefits'),
            salaryMin: formData.get('salaryMin') ? parseInt(formData.get('salaryMin')) : null,
            salaryMax: formData.get('salaryMax') ? parseInt(formData.get('salaryMax')) : null,
            salaryType: formData.get('salaryType'),
            jobType: formData.get('jobType'),
            experienceLevel: formData.get('experienceLevel'),
            location: formData.get('location'),
            categoryId: formData.get('categoryId') ? parseInt(formData.get('categoryId')) : null,
            skills: formData.get('skills'),
            isHot: formData.get('isHot') === 'on',
            expiredDate: formData.get('expiredDate') || null,
            status: action === 'publish' ? 'Open' : (formData.get('status') || 'Draft')
        };

        // Validation
        if (!data.title || !data.description || !data.requirements || !data.location || !data.categoryId || !data.jobType || !data.experienceLevel) {
            showToast('Vui lòng điền đầy đủ các trường bắt buộc', 'error');
            return;
        }

        const btn = form.querySelector('button[type="submit"][name="action"][value="${action}"]') || form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Đang lưu...';

        let result;
        if (isEdit) {
            result = await api.put(`/jobs/${jobId}`, data);
        } else {
            result = await api.post('/jobs', data);
        }

        btn.disabled = false;
        btn.innerHTML = originalText;

        if (result.error) {
            showToast(result.error, 'error');
        } else {
            const newJobId = result.data?.id || jobId;
            showToast(action === 'publish' ? 'Đăng việc thành công' : 'Lưu nháp thành công', 'success');
            router.navigate(`/employer/jobs${isEdit ? '/' + newJobId : ''}`);
        }
    });
}

function getJobStatusLabel(status) {
    const labels = { 'Draft': 'Nháp', 'Open': 'Đang tuyển', 'Paused': 'Tạm dừng', 'Closed': 'Đã đóng' };
    return labels[status] || status;
}
