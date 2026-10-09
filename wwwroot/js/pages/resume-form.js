// Resume Create/Edit Page
export async function render(container, resumeId = null) {
    requireAuth(async () => {
        const isEdit = !!resumeId;
        let resume = {
            title: '',
            template: 'Modern',
            personalInfo: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
                dateOfBirth: '',
                gender: '',
                avatarUrl: '',
                website: '',
                linkedin: '',
                github: ''
            },
            summary: '',
            experiences: [],
            educations: [],
            skills: [],
            languages: [],
            certifications: [],
            projects: [],
            desiredPosition: '',
            desiredSalaryMin: '',
            desiredSalaryMax: '',
            desiredSalaryType: 'Monthly',
            isDefault: false
        };

        if (isEdit) {
            const result = await api.getResume(resumeId);
            if (result.error) {
                showToast(result.error, 'error');
                router.navigate('/resumes');
                return;
            }
            resume = result.data;
        }

        container.innerHTML = `
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">${isEdit ? 'Chỉnh sửa CV' : 'Tạo CV mới'}</h1>
                        <p class="text-gray-500 mt-1">${isEdit ? 'Cập nhật thông tin CV của bạn' : 'Tạo CV chuyên nghiệp để ứng tuyển'}</p>
                    </div>
                    <a href="#/resumes" class="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors" data-link>
                        <i class="fas fa-arrow-left mr-2"></i>Quay lại
                    </a>
                </div>

                <form id="resume-form" class="space-y-8" novalidate>
                    <!-- Section 1: Template & Basic Info -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-palette text-primary-500 mr-2"></i>
                            Mẫu CV & Thông tin cơ bản
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Mẫu CV</label>
                                <select name="template" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option value="Modern" ${resume.template === 'Modern' ? 'selected' : ''}>Modern (Hiện đại)</option>
                                    <option value="Classic" ${resume.template === 'Classic' ? 'selected' : ''}>Classic (Kinh điển)</option>
                                    <option value="Minimal" ${resume.template === 'Minimal' ? 'selected' : ''}>Minimal (Tối giản)</option>
                                    <option value="Professional" ${resume.template === 'Professional' ? 'selected' : ''}>Professional (Chuyên nghiệp)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tiêu đề CV <span class="text-red-500">*</span></label>
                                <input type="text" name="title" required value="${resume.title}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="VD: Senior Frontend Developer - 5 năm kinh nghiệm">
                            </div>
                        </div>
                    </section>

                    <!-- Section 2: Personal Info -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-user text-primary-500 mr-2"></i>
                            Thông tin cá nhân
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Họ <span class="text-red-500">*</span></label>
                                <input type="text" name="firstName" required value="${resume.personalInfo?.firstName || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Tên <span class="text-red-500">*</span></label>
                                <input type="text" name="lastName" required value="${resume.personalInfo?.lastName || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Email <span class="text-red-500">*</span></label>
                                <input type="email" name="email" required value="${resume.personalInfo?.email || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                                <input type="tel" name="phone" value="${resume.personalInfo?.phone || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ</label>
                                <input type="text" name="address" value="${resume.personalInfo?.address || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Ngày sinh</label>
                                <input type="date" name="dateOfBirth" value="${resume.personalInfo?.dateOfBirth || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Giới tính</label>
                                <select name="gender" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option value="">Chọn</option>
                                    <option value="Male" ${resume.personalInfo?.gender === 'Male' ? 'selected' : ''}>Nam</option>
                                    <option value="Female" ${resume.personalInfo?.gender === 'Female' ? 'selected' : ''}>Nữ</option>
                                    <option value="Other" ${resume.personalInfo?.gender === 'Other' ? 'selected' : ''}>Khác</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Website/Portfolio</label>
                                <input type="url" name="website" value="${resume.personalInfo?.website || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://your-portfolio.com">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn</label>
                                <input type="url" name="linkedin" value="${resume.personalInfo?.linkedin || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://linkedin.com/in/yourname">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">GitHub</label>
                                <input type="url" name="github" value="${resume.personalInfo?.github || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://github.com/yourname">
                            </div>
                        </div>
                    </section>

                    <!-- Section 3: Professional Summary -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-align-left text-primary-500 mr-2"></i>
                            Tóm tắt chuyên nghiệp
                        </h2>
                        <textarea name="summary" rows="4" 
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                            placeholder="Viết tóm tắt ngắn gọn về kỹ năng, kinh nghiệm và mục tiêu nghề nghiệp của bạn...">${resume.summary || ''}</textarea>
                        <p class="text-sm text-gray-500 mt-2">Mô tả bản thân trong 3-4 câu, làm nổi bật giá trị bạn mang lại cho nhà tuyển dụng.</p>
                    </section>

                    <!-- Section 4: Work Experience -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-bold text-gray-900 flex items-center">
                                <i class="fas fa-briefcase text-primary-500 mr-2"></i>
                                Kinh nghiệm làm việc
                            </h2>
                            <button type="button" id="add-experience" class="px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors flex items-center">
                                <i class="fas fa-plus mr-1"></i>Thêm
                            </button>
                        </div>
                        <div id="experiences-container" class="space-y-4">
                            ${resume.experiences?.length > 0 ? resume.experiences.map((exp, idx) => renderExperienceItem(exp, idx)).join('') : renderExperienceItem({}, 0)}
                        </div>
                    </section>

                    <!-- Section 5: Education -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-bold text-gray-900 flex items-center">
                                <i class="fas fa-graduation-cap text-primary-500 mr-2"></i>
                                Học vấn
                            </h2>
                            <button type="button" id="add-education" class="px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors flex items-center">
                                <i class="fas fa-plus mr-1"></i>Thêm
                            </button>
                        </div>
                        <div id="educations-container" class="space-y-4">
                            ${resume.educations?.length > 0 ? resume.educations.map((edu, idx) => renderEducationItem(edu, idx)).join('') : renderEducationItem({}, 0)}
                        </div>
                    </section>

                    <!-- Section 6: Skills -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-tools text-primary-500 mr-2"></i>
                            Kỹ năng
                        </h2>
                        <div id="skills-container">
                            ${resume.skills?.length > 0 ? renderSkillsTags(resume.skills) : ''}
                        </div>
                        <div class="flex flex-wrap gap-2 mt-4">
                            <input type="text" id="skill-input" placeholder="Nhập kỹ năng (Enter để thêm)" 
                                class="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            <button type="button" id="add-skill" class="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors">Thêm</button>
                        </div>
                        <input type="hidden" name="skills" id="skills-input" value="${resume.skills?.join(',') || ''}">
                    </section>

                    <!-- Section 7: Languages -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-bold text-gray-900 flex items-center">
                                <i class="fas fa-language text-primary-500 mr-2"></i>
                                Ngoại ngữ
                            </h2>
                            <button type="button" id="add-language" class="px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors flex items-center">
                                <i class="fas fa-plus mr-1"></i>Thêm
                            </button>
                        </div>
                        <div id="languages-container" class="space-y-3">
                            ${resume.languages?.length > 0 ? resume.languages.map((lang, idx) => renderLanguageItem(lang, idx)).join('') : renderLanguageItem({}, 0)}
                        </div>
                    </section>

                    <!-- Section 8: Desired Job -->
                    <section class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-target text-primary-500 mr-2"></i>
                            Mong muốn nghề nghiệp
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Vị trí mong muốn</label>
                                <input type="text" name="desiredPosition" value="${resume.desiredPosition || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="VD: Senior React Developer">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Mức lương từ</label>
                                <input type="number" name="desiredSalaryMin" value="${resume.desiredSalaryMin || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="15000000">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Đến</label>
                                <input type="number" name="desiredSalaryMax" value="${resume.desiredSalaryMax || ''}"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="25000000">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Loại lương</label>
                                <select name="desiredSalaryType" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option value="Monthly" ${resume.desiredSalaryType === 'Monthly' ? 'selected' : ''}>Tháng</option>
                                    <option value="Yearly" ${resume.desiredSalaryType === 'Yearly' ? 'selected' : ''}>Năm</option>
                                    <option value="Hourly" ${resume.desiredSalaryType === 'Hourly' ? 'selected' : ''}>Giờ</option>
                                </select>
                            </div>
                            <div>
                                <label class="flex items-center">
                                    <input type="checkbox" name="isDefault" ${resume.isDefault ? 'checked' : ''} class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                                    <span class="ml-2 text-sm text-gray-600">Đặt làm CV mặc định</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    <!-- Actions -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-end">
                        <a href="#/resumes" class="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center" data-link>
                            Hủy
                        </a>
                        <button type="submit" class="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center justify-center">
                            <i class="fas fa-save mr-2"></i>${isEdit ? 'Cập nhật' : 'Tạo CV'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        attachResumeFormHandlers(isEdit, resumeId);
    });
}

function renderExperienceItem(exp, index) {
    return `
        <div class="border border-gray-100 rounded-xl p-4 relative experience-item" data-index="${index}">
            <button type="button" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 remove-exp" title="Xóa">
                <i class="fas fa-times"></i>
            </button>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Chức danh <span class="text-red-500">*</span></label>
                    <input type="text" name="experiences[${index}].title" required value="${exp.title || ''}"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Công ty <span class="text-red-500">*</span></label>
                    <input type="text" name="experiences[${index}].company" required value="${exp.company || ''}"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Địa điểm</label>
                    <input type="text" name="experiences[${index}].location" value="${exp.location || ''}"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Từ tháng/năm <span class="text-red-500">*</span></label>
                        <input type="month" name="experiences[${index}].startDate" required value="${exp.startDate || ''}"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Đến tháng/năm</label>
                        <div class="flex items-center gap-2">
                            <input type="month" name="experiences[${index}].endDate" value="${exp.endDate || ''}"
                                class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            <label class="flex items-center cursor-pointer">
                                <input type="checkbox" name="experiences[${index}].current" ${exp.current ? 'checked' : ''} class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                                <span class="ml-1 text-sm text-gray-600">Đang làm</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Mô tả công việc</label>
                    <textarea name="experiences[${index}].description" rows="3"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="Mô tả trách nhiệm, thành tựu chính...">${exp.description || ''}</textarea>
                </div>
            </div>
        </div>
    `;
}

function renderEducationItem(edu, index) {
    return `
        <div class="border border-gray-100 rounded-xl p-4 relative education-item" data-index="${index}">
            <button type="button" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 remove-edu" title="Xóa">
                <i class="fas fa-times"></i>
            </button>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Trường/Đại học <span class="text-red-500">*</span></label>
                    <input type="text" name="educations[${index}].institution" required value="${edu.institution || ''}"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Chuyên ngành <span class="text-red-500">*</span></label>
                    <input type="text" name="educations[${index}].major" required value="${edu.major || ''}"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Bằng cấp</label>
                    <select name="educations[${index}].degree" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <option value="">Chọn</option>
                        <option value="HighSchool" ${edu.degree === 'HighSchool' ? 'selected' : ''}>Trung cấp/Phổ thông</option>
                        <option value="Certificate" ${edu.degree === 'Certificate' ? 'selected' : ''}>Chứng chỉ</option>
                        <option value="Diploma" ${edu.degree === 'Diploma' ? 'selected' : ''}>Cao đẳng</option>
                        <option value="Bachelor" ${edu.degree === 'Bachelor' ? 'selected' : ''}>Đại học</option>
                        <option value="Master" ${edu.degree === 'Master' ? 'selected' : ''}>Thạc sĩ</option>
                        <option value="Doctorate" ${edu.degree === 'Doctorate' ? 'selected' : ''}>Tiến sĩ</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Từ năm</label>
                        <input type="number" name="educations[${index}].startYear" value="${edu.startYear || ''}"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" min="1950" max="2030">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Đến năm</label>
                        <input type="number" name="educations[${index}].endYear" value="${edu.endYear || ''}"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" min="1950" max="2030">
                    </div>
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú</label>
                    <textarea name="educations[${index}].description" rows="2"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="GPA, giải thưởng, hoạt động...">${edu.description || ''}</textarea>
                </div>
            </div>
        </div>
    `;
}

function renderLanguageItem(lang, index) {
    return `
        <div class="flex flex-col sm:flex-row gap-3 items-start language-item" data-index="${index}">
            <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Ngôn ngữ</label>
                <input type="text" name="languages[${index}].name" value="${lang.name || ''}"
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tiếng Anh, Tiếng Nhật...">
            </div>
            <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Trình độ</label>
                <select name="languages[${index}].proficiency" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">Chọn</option>
                    <option value="Basic" ${lang.proficiency === 'Basic' ? 'selected' : ''}>Cơ bản</option>
                    <option value="Conversational" ${lang.proficiency === 'Conversational' ? 'selected' : ''}>Giao tiếp</option>
                    <option value="Fluent" ${lang.proficiency === 'Fluent' ? 'selected' : ''}>Thành thạo</option>
                    <option value="Native" ${lang.proficiency === 'Native' ? 'selected' : ''}>Bản xứ</option>
                </select>
            </div>
            <button type="button" class="self-end mt-6 mb-1 text-gray-400 hover:text-red-500 remove-lang" title="Xóa">
                <i class="fas fa-times-circle text-xl"></i>
            </button>
        </div>
    `;
}

function renderSkillsTags(skills) {
    return skills.map(skill => `
        <span class="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mr-2 mb-2">
            ${skill}
            <button type="button" class="ml-2 text-primary-500 hover:text-primary-700 remove-skill" data-skill="${skill}">
                <i class="fas fa-times text-xs"></i>
            </button>
        </span>
    `).join('');
}

function attachResumeFormHandlers(isEdit, resumeId) {
    let expIndex = document.querySelectorAll('.experience-item').length;
    let eduIndex = document.querySelectorAll('.education-item').length;
    let langIndex = document.querySelectorAll('.language-item').length;
    let skills = new Set(document.getElementById('skills-input')?.value.split(',').filter(Boolean) || []);

    function updateSkillsInput() {
        document.getElementById('skills-input').value = Array.from(skills).join(',');
        document.getElementById('skills-container').innerHTML = renderSkillsTags(Array.from(skills));
    }

    // Add Experience
    document.getElementById('add-experience')?.addEventListener('click', () => {
        const container = document.getElementById('experiences-container');
        container.insertAdjacentHTML('beforeend', renderExperienceItem({}, expIndex++));
        attachRemoveHandlers();
    });

    // Add Education
    document.getElementById('add-education')?.addEventListener('click', () => {
        const container = document.getElementById('educations-container');
        container.insertAdjacentHTML('beforeend', renderEducationItem({}, eduIndex++));
        attachRemoveHandlers();
    });

    // Add Language
    document.getElementById('add-language')?.addEventListener('click', () => {
        const container = document.getElementById('languages-container');
        container.insertAdjacentHTML('beforeend', renderLanguageItem({}, langIndex++));
        attachRemoveHandlers();
    });

    // Add Skill
    const skillInput = document.getElementById('skill-input');
    document.getElementById('add-skill')?.addEventListener('click', () => {
        const skill = skillInput.value.trim();
        if (skill && !skills.has(skill)) {
            skills.add(skill);
            updateSkillsInput();
            skillInput.value = '';
        }
    });
    skillInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('add-skill').click();
        }
    });

    // Remove handlers (delegated)
    function attachRemoveHandlers() {
        document.querySelectorAll('.remove-exp').forEach(btn => {
            btn.onclick = () => btn.closest('.experience-item').remove();
        });
        document.querySelectorAll('.remove-edu').forEach(btn => {
            btn.onclick = () => btn.closest('.education-item').remove();
        });
        document.querySelectorAll('.remove-lang').forEach(btn => {
            btn.onclick = () => btn.closest('.language-item').remove();
        });
        document.querySelectorAll('.remove-skill').forEach(btn => {
            btn.onclick = () => {
                skills.delete(btn.dataset.skill);
                updateSkillsInput();
            };
        });
    }
    attachRemoveHandlers();

    // Form submit
    document.getElementById('resume-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {};
        
        // Simple fields
        ['title', 'template', 'summary', 'desiredPosition', 'desiredSalaryMin', 'desiredSalaryMax', 'desiredSalaryType', 'isDefault'].forEach(key => {
            const val = formData.get(key);
            if (val !== null) data[key] = val === 'on' ? true : (val === '' ? null : val);
        });

        // Personal info
        data.personalInfo = {};
        ['firstName', 'lastName', 'email', 'phone', 'address', 'dateOfBirth', 'gender', 'website', 'linkedin', 'github'].forEach(key => {
            const val = formData.get(key);
            if (val !== null && val !== '') data.personalInfo[key] = val;
        });

        // Experiences
        data.experiences = [];
        const expTitles = formData.getAll('experiences[0].title'); // This won't work with FormData easily
        // Better: manually construct from DOM
        document.querySelectorAll('.experience-item').forEach((item, idx) => {
            const exp = {
                title: item.querySelector('[name^="experiences["][name$=".title"]')?.value,
                company: item.querySelector('[name^="experiences["][name$=".company"]')?.value,
                location: item.querySelector('[name^="experiences["][name$=".location"]')?.value,
                startDate: item.querySelector('[name^="experiences["][name$=".startDate"]')?.value,
                endDate: item.querySelector('[name^="experiences["][name$=".endDate"]')?.value,
                current: item.querySelector('[name^="experiences["][name$=".current"]')?.checked,
                description: item.querySelector('[name^="experiences["][name$=".description"]')?.value
            };
            if (exp.title && exp.company && exp.startDate) {
                data.experiences.push(exp);
            }
        });

        // Educations
        data.educations = [];
        document.querySelectorAll('.education-item').forEach((item, idx) => {
            const edu = {
                institution: item.querySelector('[name^="educations["][name$=".institution"]')?.value,
                major: item.querySelector('[name^="educations["][name$=".major"]')?.value,
                degree: item.querySelector('[name^="educations["][name$=".degree"]')?.value,
                startYear: item.querySelector('[name^="educations["][name$=".startYear"]')?.value,
                endYear: item.querySelector('[name^="educations["][name$=".endYear"]')?.value,
                description: item.querySelector('[name^="educations["][name$=".description"]')?.value
            };
            if (edu.institution && edu.major) {
                data.educations.push(edu);
            }
        });

        // Languages
        data.languages = [];
        document.querySelectorAll('.language-item').forEach((item, idx) => {
            const lang = {
                name: item.querySelector('[name^="languages["][name$=".name"]')?.value,
                proficiency: item.querySelector('[name^="languages["][name$=".proficiency"]')?.value
            };
            if (lang.name && lang.proficiency) {
                data.languages.push(lang);
            }
        });

        // Skills
        data.skills = Array.from(skills);

        // Convert numbers
        if (data.desiredSalaryMin) data.desiredSalaryMin = parseInt(data.desiredSalaryMin);
        if (data.desiredSalaryMax) data.desiredSalaryMax = parseInt(data.desiredSalaryMax);
        if (data.educations) {
            data.educations.forEach(e => {
                if (e.startYear) e.startYear = parseInt(e.startYear);
                if (e.endYear) e.endYear = parseInt(e.endYear);
            });
        }

        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Đang lưu...';

        let result;
        if (isEdit) {
            result = await api.put(`/resumes/${resumeId}`, data);
        } else {
            result = await api.post('/resumes', data);
        }

        btn.disabled = false;
        btn.innerHTML = originalText;

        if (result.error) {
            showToast(result.error, 'error');
        } else {
            showToast(isEdit ? 'Cập nhật CV thành công' : 'Tạo CV thành công', 'success');
            router.navigate('/resumes');
        }
    });
}
