// Employer Post Job Page - Đăng tuyển dụng
export async function render(container) {
    container.innerHTML = `
        <!-- Header -->
        <section class="py-16 px-4 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
            <div class="max-w-4xl mx-auto text-center">
                <i class="fas fa-briefcase text-6xl text-yellow-300 mb-6"></i>
                <h1 class="text-4xl font-bold mb-4">Đăng tuyển dụng</h1>
                <p class="text-white/90 text-lg">Tạo tin tuyển dụng của bạn ngay hôm nay</p>
            </div>
        </section>

        <div class="max-w-7xl mx-auto px-4 py-16">
            <div class="max-w-4xl mx-auto">
                <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-xl">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Thông tin công ty</h2>
                    <form id="post-job-form" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tên công ty *</label>
                                <input type="text" id="company-name" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Mã số thuế</label>
                                <input type="text" id="tax-code" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                                <input type="text" id="address" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                <input type="url" id="website" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                        </div>

                        <div class="border-t border-gray-100 pt-6">
                            <h2 class="text-2xl font-bold text-gray-900 mb-6">Thông tin tuyển dụng</h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Chức danh việc làm *</label>
                                    <input type="text" id="job-title" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Loại hình làm việc</label>
                                    <select id="job-type" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="FullTime">Toàn thời gian</option>
                                        <option value="PartTime">Bán thời gian</option>
                                        <option value="Contract">Hợp đồng</option>
                                        <option value="Remote">Từ xa</option>
                                        <option value="Internship">Thực tập</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Kinh nghiệm</label>
                                    <select id="experience" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="Fresher">Mới tốt nghiệp</option>
                                        <option value="Junior">Junior (1-3 năm)</option>
                                        <option value="Mid">Mid-level (3-5 năm)</option>
                                        <option value="Senior">Senior (5+ năm)</option>
                                        <option value="Lead">Team Lead</option>
                                        <option value="Manager">Quản lý</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Số lượng tuyển</label>
                                    <input type="number" id="quantity" min="1" value="1" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                </div>
                            </div>

                            <div class="mt-6">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả công việc *</label>
                                <textarea id="description" rows="4" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
                            </div>
                            <div class="mt-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Yêu cầu</label>
                                <textarea id="requirements" rows="3" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
                            </div>
                            <div class="mt-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Phúc lợi</label>
                                <textarea id="benefits" rows="3" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
                            </div>
                        </div>

                        <div class="border-t border-gray-100 pt-6">
                            <h2 class="text-2xl font-bold text-gray-900 mb-6">Mức lương</h2>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Lương tối thiểu (VNĐ)</label>
                                    <input type="number" id="salary-min" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Lương tối đa (VNĐ)</label>
                                    <input type="number" id="salary-max" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Tỷ lệ lương</label>
                                    <select id="salary-type" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="Monthly">Tháng</option>
                                        <option value="Yearly">Năm</option>
                                        <option value="Daily">Ngày</option>
                                        <option value="Hourly">Giờ</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 flex gap-4">
                            <button type="submit" class="flex-1 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                                <i class="fas fa-paper-plane mr-2"></i>Đăng tuyển dụng
                            </button>
                            <button type="button" class="px-6 py-4 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                                <i class="fas fa-times mr-2"></i>Hủy
                            </button>
                        </div>
                    </form>
                </div>

                <div class="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 class="font-semibold text-gray-900 mb-4">Lợi ích đăng tuyển</h3>
                    <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${['<i class="fas fa-bullhorn text-primary-500 mr-3"></i>Truy cập hàng triệu ứng viên','<i class="fas fa-check text-success-500 mr-3"></i>Giới thiệu công ty','<i class="fas fa-star text-warning-500 mr-3"></i>Tối ưu vị trí','<i class="fas fa-clock text-primary-500 mr-3"></i>Thông báo ngay lập tức'].map(item => `
                            <li class="flex items-center py-2 border-b border-gray-50 last:border-0">${item}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>

        <style>
            #post-job-form input, #post-job-form select, #post-job-form textarea {
                width: 100%;
            }
        </style>
    `;

    const form = container.querySelector('#post-job-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                companyName: form.companyName.value,
                taxCode: form.taxCode.value,
                address: form.address.value,
                website: form.website.value,
                jobTitle: form.jobTitle.value,
                jobType: form.jobType.value,
                experience: form.experience.value,
                quantity: parseInt(form.quantity.value) || 1,
                description: form.description.value,
                requirements: form.requirements.value,
                benefits: form.benefits.value,
                salaryMin: parseInt(form.salaryMin.value) || 0,
                salaryMax: parseInt(form.salaryMax.value) || 0,
                salaryType: form.salaryType.value
            };
            const result = await api.createJob(data);
            if (result.data) {
                showToast('Đăng tuyển dụng thành công!', 'success');
                router.navigate('/employer/jobs');
            } else {
                showToast(result.error || 'Có lỗi xảy ra!', 'error');
            }
        });
    }
}
