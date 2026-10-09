// Job Detail Page
export async function render(container, jobId) {
    const jobResult = await api.getJob(jobId);
    
    if (jobResult.error) {
        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <i class="fas fa-exclamation-triangle text-5xl text-red-400 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy việc làm</h2>
                <p class="text-gray-500 mb-6">${jobResult.error}</p>
                <a href="#/jobs" class="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors inline-flex" data-link>
                    <i class="fas fa-arrow-left mr-2"></i>Quay lại danh sách
                </a>
            </div>
        `;
        return;
    }

    const job = jobResult.data;
    const company = job.company || {};
    const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryType);
    const postedDate = formatDate(job.createdAt);
    const expiredDate = job.expiredDate ? formatDate(job.expiredDate) : 'Chưa xác định';
    const isExpired = job.expiredDate && new Date(job.expiredDate) < new Date();
    const companyLogo = company.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name || 'Company')}&background=0ea5e9&color=fff&size=200`;

    container.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Breadcrumb -->
            <nav class="mb-6" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-2 text-sm text-gray-500">
                    <li><a href="#/" class="hover:text-primary-600" data-link>Trang chủ</a></li>
                    <li><i class="fas fa-chevron-right text-xs"></i></li>
                    <li><a href="#/jobs" class="hover:text-primary-600" data-link>Việc làm</a></li>
                    <li><i class="fas fa-chevron-right text-xs"></i></li>
                    <li class="text-gray-900 truncate max-w-xs">${job.title}</li>
                </ol>
            </nav>

            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Main Content -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Job Header -->
                    <article class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                            <div class="flex items-start space-x-4">
                                <img src="${companyLogo}" alt="${company.name}" class="w-16 h-16 rounded-xl object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(company.name || 'Company')}&background=0ea5e9&color=fff&size=200'">
                                <div>
                                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">${job.title}</h1>
                                    <p class="text-gray-500 mt-1">${company.name || 'Công ty riêng tư'}</p>
                                    <div class="flex flex-wrap gap-2 mt-3">
                                        <span class="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">${getJobTypeLabel(job.jobType)}</span>
                                        <span class="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm">${getExperienceLevelLabel(job.experienceLevel)}</span>
                                        ${job.isHot ? '<span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Hot</span>' : ''}
                                        ${isExpired ? '<span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Hết hạn</span>' : '<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Đang tuyển</span>'}
                                    </div>
                                </div>
                            </div>
                            <div class="text-right sm:text-left">
                                <div class="text-3xl font-bold text-primary-600">${salary}</div>
                                <div class="text-sm text-gray-500 mt-1">${job.salaryType === 'Negotiable' ? 'Thương lượng' : getSalaryTypeLabel(job.salaryType)}</div>
                            </div>
                        </div>

                        <div class="border-t border-b border-gray-100 py-6">
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div class="flex items-center">
                                    <i class="fas fa-map-marker-alt text-primary-500 mr-3 text-lg"></i>
                                    <div>
                                        <p class="text-sm text-gray-500">Địa điểm</p>
                                        <p class="font-medium text-gray-900">${job.location || 'Chưa cập nhật'}</p>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-calendar-alt text-primary-500 mr-3 text-lg"></i>
                                    <div>
                                        <p class="text-sm text-gray-500">Ngày đăng</p>
                                        <p class="font-medium text-gray-900">${postedDate}</p>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-hourglass-half text-primary-500 mr-3 text-lg"></i>
                                    <div>
                                        <p class="text-sm text-gray-500">Hạn nộp</p>
                                        <p class="font-medium text-gray-900">${expiredDate}</p>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-eye text-primary-500 mr-3 text-lg"></i>
                                    <div>
                                        <p class="text-sm text-gray-500">Lượt xem</p>
                                        <p class="font-medium text-gray-900">${job.viewCount || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-wrap gap-3 mt-4" id="job-actions">
                            ${auth.isAuthenticated ? `
                                ${auth.isCandidate() && !isExpired ? `
                                    <button id="apply-btn" class="flex-1 sm:flex-none px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center">
                                        <i class="fas fa-paper-plane mr-2"></i>Nộp đơn ngay
                                    </button>
                                    <button id="save-job-btn" class="flex-1 sm:flex-none px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center">
                                        <i class="fas fa-bookmark mr-2"></i>Lưu việc
                                    </button>
                                ` : ''}
                                ${auth.isEmployer() ? `
                                    <a href="#/employer/jobs/${job.id}/edit" class="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors" data-link>
                                        <i class="fas fa-edit mr-2"></i>Chỉnh sửa
                                    </a>
                                ` : ''}
                            ` : `
                                <a href="#/login" class="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors text-center" data-link>
                                    <i class="fas fa-sign-in-alt mr-2"></i>Đăng nhập để nộp đơn
                                </a>
                            `}
                            <button id="share-btn" class="flex-1 sm:flex-none px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center">
                                <i class="fas fa-share-alt mr-2"></i>Chia sẻ
                            </button>
                        </div>
                    </article>

                    <!-- Job Description -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-file-alt text-primary-500 mr-2"></i>
                            Mô tả công việc
                        </h2>
                        <div class="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                            ${job.description ? job.description.replace(/\n/g, '<br>') : '<p class="text-gray-500">Chưa có mô tả chi tiết.</p>'}
                        </div>
                    </section>

                    <!-- Requirements -->
                    ${job.requirements ? `
                    <section class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-clipboard-check text-primary-500 mr-2"></i>
                            Yêu cầu công việc
                        </h2>
                        <div class="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                            ${job.requirements.replace(/\n/g, '<br>')}
                        </div>
                    </section>
                    ` : ''}

                    <!-- Benefits -->
                    ${job.benefits ? `
                    <section class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-gift text-primary-500 mr-2"></i>
                            Quyền lợi được hưởng
                        </h2>
                        <div class="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                            ${job.benefits.replace(/\n/g, '<br>')}
                        </div>
                    </section>
                    ` : ''}

                    <!-- Skills -->
                    ${job.skills ? `
                    <section class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-tools text-primary-500 mr-2"></i>
                            Kỹ năng yêu cầu
                        </h2>
                        <div class="flex flex-wrap gap-2">
                            ${job.skills.split(',').map(skill => `
                                <span class="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">${skill.trim()}</span>
                            `).join('')}
                        </div>
                    </section>
                    ` : ''}
                </div>

                <!-- Sidebar -->
                <aside class="lg:col-span-1">
                    <!-- Company Info Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-building text-primary-500 mr-2"></i>
                            Về công ty
                        </h3>
                        
                        <a href="#/companies/${company.id}" class="block mb-4" data-link>
                            <img src="${companyLogo}" alt="${company.name}" class="w-full h-40 rounded-xl object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(company.name || 'Company')}&background=0ea5e9&color=fff&size=200'">
                        </a>

                        <h4 class="font-semibold text-gray-900 mb-1">${company.name || 'Công ty riêng tư'}</h4>
                        ${company.industry ? `<p class="text-sm text-gray-500 mb-2">${company.industry}</p>` : ''}
                        ${company.size ? `<p class="text-sm text-gray-500 mb-2"><i class="fas fa-users mr-1"></i>${company.size} nhân viên</p>` : ''}
                        ${company.location ? `<p class="text-sm text-gray-500 mb-2"><i class="fas fa-map-marker-alt mr-1 text-primary-500"></i>${company.location}</p>` : ''}
                        ${company.website ? `<a href="${company.website}" target="_blank" class="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center"><i class="fas fa-globe mr-1"></i>${company.website.replace(/^https?:\/\//, '')}</a>` : ''}

                        <div class="mt-6 pt-6 border-t border-gray-100">
                            <a href="#/companies/${company.id}" class="w-full px-4 py-2 bg-primary-50 text-primary-700 rounded-xl font-medium hover:bg-primary-100 transition-colors text-center block" data-link>
                                <i class="fas fa-building mr-2"></i>Xem hồ sơ công ty
                            </a>
                        </div>
                    </div>

                    <!-- Other Jobs from Company -->
                    ${company.id ? `
                    <div class="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-4">Việc làm khác từ công ty này</h3>
                        <div id="other-jobs" class="space-y-3">
                            <div class="flex items-center justify-center py-4">
                                <div class="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Similar Jobs -->
                    <div class="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-4">Việc làm tương tự</h3>
                        <div id="similar-jobs" class="space-y-3">
                            <div class="flex items-center justify-center py-4">
                                <div class="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    `;

    // Event handlers
    attachJobActionHandlers(job);
    loadOtherJobs(company.id, job.id);
    loadSimilarJobs(job.categoryId, job.id);
}

function attachJobActionHandlers(job) {
    // Apply button
    document.getElementById('apply-btn')?.addEventListener('click', async () => {
        if (!auth.isAuthenticated) {
            showToast('Vui lòng đăng nhập', 'warning');
            router.navigate('/login');
            return;
        }
        
        // Check if user has resume
        const resumesResult = await api.getResumes();
        if (!resumesResult.data || resumesResult.data.length === 0) {
            showModal(`
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Bạn chưa có CV</h3>
                <p class="text-gray-600 mb-6">Để nộp đơn, bạn cần tạo CV trước. Bạn muốn tạo CV ngay bây giờ?</p>
                <div class="flex gap-3 justify-end">
                    <button class="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50" data-modal-close>Để sau</button>
                    <a href="#/resumes/create" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700" data-link data-modal-close>Tạo CV ngay</a>
                </div>
            `);
            return;
        }

        // Show resume selection modal
        showResumeSelectionModal(job.id, resumesResult.data);
    });

    // Save job
    document.getElementById('save-job-btn')?.addEventListener('click', async () => {
        if (!auth.isAuthenticated) {
            showToast('Vui lòng đăng nhập', 'warning');
            router.navigate('/login');
            return;
        }
        // TODO: Implement save job API
        showToast('Đã lưu việc làm', 'success');
    });

    // Share button
    document.getElementById('share-btn')?.addEventListener('click', async () => {
        const url = window.location.href;
        try {
            await navigator.share({
                title: job.title,
                text: `${job.title} tại ${job.company?.name}`,
                url: url
            });
        } catch (e) {
            if (e.name !== 'AbortError') {
                await copyToClipboard(url, 'Đã sao chép link việc làm!');
            }
        }
    });
}

function showResumeSelectionModal(jobId, resumes) {
    showModal(`
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Chọn CV để nộp đơn</h3>
        <p class="text-gray-600 mb-4">Vị trí: <strong class="text-gray-900">${job.title}</strong></p>
        <div class="space-y-3 max-h-60 overflow-y-auto">
            ${resumes.map(resume => `
                <label class="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors">
                    <input type="radio" name="resume" value="${resume.id}" class="w-4 h-4 text-primary-600 focus:ring-primary-500" ${resume.isDefault ? 'checked' : ''}>
                    <div class="ml-3 flex-1">
                        <p class="font-medium text-gray-900">${resume.title}</p>
                        <p class="text-sm text-gray-500">Cập nhật: ${formatDate(resume.updatedAt)}</p>
                    </div>
                    ${resume.isDefault ? '<span class="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">Mặc định</span>' : ''}
                </label>
            `).join('')}
        </div>
        <div class="flex gap-3 justify-end mt-6">
            <button class="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50" data-modal-close>Hủy</button>
            <button id="confirm-apply-btn" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700" data-modal-close>Nộp đơn</button>
        </div>
    `, { onClose: () => {} });

    document.getElementById('confirm-apply-btn')?.addEventListener('click', async () => {
        const selectedResume = document.querySelector('input[name="resume"]:checked');
        if (!selectedResume) {
            showToast('Vui lòng chọn CV', 'warning');
            return;
        }
        await applyJob(jobId, selectedResume.value);
    });
}

async function applyJob(jobId, resumeId) {
    const btn = document.getElementById('apply-btn');
    const originalText = btn?.innerHTML;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Đang nộp...';
    }

    const result = await api.applyJob(jobId, { resumeId, coverLetter: '' });
    
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }

    if (result.error) {
        showToast(result.error, 'error');
    } else {
        showToast('Nộp đơn thành công!', 'success');
        // Update button state
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check mr-2"></i>Đã nộp đơn';
            btn.classList.remove('bg-primary-600', 'hover:bg-primary-700');
            btn.classList.add('bg-green-600', 'hover:bg-green-700');
            btn.disabled = true;
        }
    }
}

async function loadOtherJobs(companyId, excludeJobId) {
    if (!companyId) return;
    
    const result = await api.getJobs({ companyId, pageSize: 5, pageNumber: 1 });
    const jobs = result.data?.items || result.data || [];
    const filteredJobs = jobs.filter(j => j.id !== excludeJobId).slice(0, 3);
    
    const container = document.getElementById('other-jobs');
    if (container) {
        if (filteredJobs.length > 0) {
            container.innerHTML = filteredJobs.map(job => `
                <a href="#/jobs/${job.id}" class="flex items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-primary-200 transition-colors" data-link>
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-gray-900 truncate">${job.title}</p>
                        <p class="text-sm text-gray-500 truncate">${formatSalary(job.salaryMin, job.salaryMax, job.salaryType)}</p>
                    </div>
                </a>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-gray-500 text-sm text-center py-4">Không có việc làm khác</p>';
        }
    }
}

async function loadSimilarJobs(categoryId, excludeJobId) {
    if (!categoryId) return;
    
    const result = await api.getJobs({ categoryId, pageSize: 5, pageNumber: 1 });
    const jobs = result.data?.items || result.data || [];
    const filteredJobs = jobs.filter(j => j.id !== excludeJobId).slice(0, 3);
    
    const container = document.getElementById('similar-jobs');
    if (container) {
        if (filteredJobs.length > 0) {
            container.innerHTML = filteredJobs.map(job => `
                <a href="#/jobs/${job.id}" class="flex items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-primary-200 transition-colors" data-link>
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-gray-900 truncate">${job.title}</p>
                        <p class="text-sm text-gray-500 truncate">${job.company?.name || 'Công ty riêng tư'}</p>
                    </div>
                    <span class="text-sm font-medium text-primary-600">${formatSalary(job.salaryMin, job.salaryMax, job.salaryType)}</span>
                </a>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-gray-500 text-sm text-center py-4">Không có việc làm tương tự</p>';
        }
    }
}

// Format helpers
function formatSalary(min, max, type = 'Monthly') {
    if (!min && !max) return 'Thương lượng';
    const format = (num) => {
        if (num >= 1e9) return (num / 1e9).toFixed(1).replace('.0', '') + ' tỷ';
        if (num >= 1e6) return (num / 1e6).toFixed(1).replace('.0', '') + ' triệu';
        return num.toLocaleString('vi-VN');
    };
    if (min && max) return `${format(min)} - ${format(max)}/${type === 'Monthly' ? 'tháng' : 'năm'}`;
    if (min) return `Từ ${format(min)}/${type === 'Monthly' ? 'tháng' : 'năm'}`;
    return `Đến ${format(max)}/${type === 'Monthly' ? 'tháng' : 'năm'}`;
}
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function getJobTypeLabel(type) {
    const labels = { 'FullTime': 'Toàn thời gian', 'PartTime': 'Bán thời gian', 'Contract': 'Hợp đồng', 'Internship': 'Thực tập', 'Freelance': 'Freelance', 'Remote': 'Từ xa' };
    return labels[type] || type;
}
function getExperienceLevelLabel(level) {
    const labels = { 'Fresher': 'Mới tốt nghiệp', 'Junior': 'Junior (1-3 năm)', 'Mid': 'Mid-level (3-5 năm)', 'Senior': 'Senior (5+ năm)', 'Lead': 'Team Lead', 'Manager': 'Quản lý', 'Director': 'Giám đốc' };
    return labels[level] || level;
}
function getSalaryTypeLabel(type) {
    const labels = { 'Monthly': '/tháng', 'Yearly': '/năm', 'Hourly': '/giờ', 'Daily': '/ngày' };
    return labels[type] || '';
}
