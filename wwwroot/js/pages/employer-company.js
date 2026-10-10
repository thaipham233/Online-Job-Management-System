// Employer Company Page - Quản lý hồ sơ công ty
export async function render(container) {
    requireAuth(async () => {
        if (!auth.isEmployer()) {
            showToast('Bạn không có quyền truy cập', 'error');
            router.navigate('/');
            return;
        }

        const companyId = auth.user?.companyId;
        if (!companyId) {
            showToast('Bạn chưa có công ty. Vui lòng tạo công ty trước.', 'warning');
            router.navigate('/employer/dashboard');
            return;
        }

        const result = await api.getCompany(companyId);
        const company = result.data || {};

        container.innerHTML = `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Hồ sơ công ty</h1>
                        <p class="text-gray-500 mt-1">Quản lý thông tin, logo và ảnh bìa</p>
                    </div>
                    <a href="#/employer/dashboard" class="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors" data-link>
                        <i class="fas fa-arrow-left mr-2"></i>Quay lại
                    </a>
                </div>

                <form id="company-form" class="space-y-8" novalidate>
                    <!-- Logo & Cover -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <i class="fas fa-image text-primary-500 mr-2"></i>
                            Logo & Ảnh bìa
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">Logo công ty</label>
                                <div class="flex items-center gap-4">
                                    <div class="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 relative overflow-hidden">
                                        ${company.logoUrl ? `
                                            <img src="${company.logoUrl}" alt="Logo" class="w-full h-full object-cover">
                                        ` : `
                                            <i class="fas fa-building text-3xl text-gray-300"></i>
                                        `}
                                        <input type="file" name="logoFile" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Kích thước khuyến nghị: 200x200px</p>
                                        <p class="text-sm text-gray-500">Định dạng: JPG, PNG, SVG</p>
                                    </div>
                                </div>
                                ${company.logoUrl ? `<p class="mt-2 text-sm text-primary-600">Đã có logo: <a href="${company.logoUrl}" target="_blank" class="underline">Xem</a></p>` : ''}
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">Ảnh bìa</label>
                                <div class="flex items-center gap-4">
                                    <div class="w-48 h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 relative overflow-hidden">
                                        ${company.coverUrl ? `
                                            <img src="${company.coverUrl}" alt="Cover" class="w-full h-full object-cover">
                                        ` : `
                                            <i class="fas fa-image text-3xl text-gray-300"></i>
                                        `}
                                        <input type="file" name="coverFile" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Kích thước khuyến nghị: 1200x400px</p>
                                        <p class="text-sm text-gray-500">Định dạng: JPG, PNG</p>
                                    </div>
                                </div>
                                ${company.coverUrl ? `<p class="mt-2 text-sm text-primary-600">Đã có ảnh bìa: <a href="${company.coverUrl}" target="_blank" class="underline">Xem</a></p>` : ''}
                            </div>
                        </div>
                    </section>

                    <!-- Thông tin cơ bản -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <i class="fas fa-info-circle text-primary-500 mr-2"></i>
                            Thông tin cơ bản
                        </h2>
                        <div class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Tên công ty <span class="text-red-500">*</span></label>
                                    <input type="text" name="name" required value="${company.name || ''}"
                                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Slug (URL)</label>
                                    <input type="text" name="slug" value="${company.slug || ''}"
                                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="ten-cong-ty (để trống để tự động tạo)">
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                                    <input type="url" name="website" value="${company.website || ''}"
                                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="https://company.com">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Email liên hệ</label>
                                    <input type="email" name="email" value="${company.email || ''}"
                                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="hr@company.com">
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                                    <input type="tel" name="phone" value="${company.phone || ''}"
                                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Quy mô</label>
                                    <select name="size" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="">Chọn quy mô</option>
                                        <option value="1-10" ${company.size === '1-10' ? 'selected' : ''}>1-10 nhân viên</option>
                                        <option value="11-50" ${company.size === '11-50' ? 'selected' : ''}>11-50 nhân viên</option>
                                        <option value="51-200" ${company.size === '51-200' ? 'selected' : ''}>51-200 nhân viên</option>
                                        <option value="201-500" ${company.size === '201-500' ? 'selected' : ''}>201-500 nhân viên</option>
                                        <option value="501-1000" ${company.size === '501-1000' ? 'selected' : ''}>501-1000 nhân viên</option>
                                        <option value="1000+" ${company.size === '1000+' ? 'selected' : ''}>1000+ nhân viên</option>
                                    </select>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Ngành nghề</label>
                                    <input type="text" name="industry" value="${company.industry || ''}"
                                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Công nghệ thông tin, Tài chính, ...">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Năm thành lập</label>
                                    <input type="number" name="foundedYear" value="${company.foundedYear || ''}"
                                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        min="1900" max="${new Date().getFullYear()}">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ</label>
                                <input type="text" name="address" value="${company.address || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Số nhà, đường, phường, quận, thành phố">
                            </div>
                        </div>
                    </section>

                    <!-- Mô tả & Lợi ích -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <i class="fas fa-align-left text-primary-500 mr-2"></i>
                            Mô tả & Quyền lợi
                        </h2>
                        <div class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Mô tả công ty</label>
                                <textarea name="description" rows="5"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                    placeholder="Giới thiệu về công ty, văn hóa, tầm nhìn, sứ mệnh...">${company.description || ''}</textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Quyền lợi làm việc</label>
                                <textarea name="benefits" rows="4"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                    placeholder="Bảo hiểm, du lịch, training, flexible hours, remote work, ăn trưa...">${company.benefits || ''}</textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Video giới thiệu (YouTube URL)</label>
                                <input type="url" name="videoUrl" value="${company.videoUrl || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://youtube.com/watch?v=...">
                            </div>
                        </div>
                    </section>

                    <!-- Mạng xã hội -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <i class="fas fa-share-alt text-primary-500 mr-2"></i>
                            Mạng xã hội
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                                    <i class="fab fa-facebook text-blue-600 mr-2"></i>Facebook
                                </label>
                                <input type="url" name="facebookUrl" value="${company.facebookUrl || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://facebook.com/company">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                                    <i class="fab fa-linkedin text-blue-700 mr-2"></i>LinkedIn
                                </label>
                                <input type="url" name="linkedinUrl" value="${company.linkedinUrl || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://linkedin.com/company/company">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                                    <i class="fab fa-twitter text-sky-500 mr-2"></i>Twitter/X
                                </label>
                                <input type="url" name="twitterUrl" value="${company.twitterUrl || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://twitter.com/company">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                                    <i class="fab fa-github text-gray-800 mr-2"></i>GitHub
                                </label>
                                <input type="url" name="githubUrl" value="${company.githubUrl || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://github.com/company">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                                    <i class="fab fa-youtube text-red-600 mr-2"></i>YouTube
                                </label>
                                <input type="url" name="youtubeUrl" value="${company.youtubeUrl || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://youtube.com/@company">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                                    <i class="fas fa-globe text-green-600 mr-2"></i>Website khác
                                </label>
                                <input type="url" name="otherUrl" value="${company.otherUrl || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://other.com">
                            </div>
                        </div>
                    </section>

                    <!-- Actions -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-end">
                        <a href="#/employer/dashboard" class="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center" data-link>
                            Hủy
                        </a>
                        <button type="submit" class="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center justify-center">
                            <i class="fas fa-save mr-2"></i>Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        `;

        attachCompanyFormHandlers();
    });
}

function attachCompanyFormHandlers() {
    const form = document.getElementById('company-form');
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        
        const data = {
            name: formData.get('name'),
            slug: formData.get('slug') || null,
            website: formData.get('website') || null,
            email: formData.get('email') || null,
            phone: formData.get('phone') || null,
            size: formData.get('size') || null,
            industry: formData.get('industry') || null,
            foundedYear: formData.get('foundedYear') ? parseInt(formData.get('foundedYear')) : null,
            address: formData.get('address') || null,
            description: formData.get('description') || null,
            benefits: formData.get('benefits') || null,
            videoUrl: formData.get('videoUrl') || null,
            facebookUrl: formData.get('facebookUrl') || null,
            linkedinUrl: formData.get('linkedinUrl') || null,
            twitterUrl: formData.get('twitterUrl') || null,
            githubUrl: formData.get('githubUrl') || null,
            youtubeUrl: formData.get('youtubeUrl') || null,
            otherUrl: formData.get('otherUrl') || null
        };

        // Validation
        if (!data.name) {
            showToast('Vui lòng nhập tên công ty', 'error');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Đang lưu...';

        const result = await api.put(`/companies/${auth.user?.companyId}`, data);

        btn.disabled = false;
        btn.innerHTML = originalText;

        if (result.error) {
            showToast(result.error, 'error');
        } else {
            showToast('Cập nhật thông tin công ty thành công', 'success');
        }
    });
}
