// My Resumes Page
export async function render(container) {
    requireAuth(async () => {
        const result = await api.getResumes();
        const resumes = result.data || [];

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">CV của tôi</h1>
                        <p class="text-gray-500 mt-1">Quản lý các CV để nộp đơn ứng tuyển</p>
                    </div>
                    <a href="#/resumes/create" class="px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors inline-flex items-center" data-link>
                        <i class="fas fa-plus mr-2"></i>Tạo CV mới
                    </a>
                </div>

                ${resumes.length > 0 ? `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${resumes.map(resume => renderResumeCard(resume)).join('')}
                </div>
                ` : `
                <div class="text-center py-16">
                    <i class="fas fa-file-word text-5xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Bạn chưa có CV nào</h3>
                    <p class="text-gray-500 mb-6">Tạo CV đầu tiên để bắt đầu ứng tuyển</p>
                    <a href="#/resumes/create" class="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 inline-flex items-center" data-link>
                        <i class="fas fa-plus mr-2"></i>Tạo CV ngay
                    </a>
                </div>
                `}
            </div>
        `;
    });
}

function renderResumeCard(resume) {
    const isDefault = resume.isDefault;
    const updatedAt = resume.updatedAt ? formatDate(resume.updatedAt) : 'Chưa cập nhật';
    const template = resume.template || 'Modern';
    
    return `
        <div class="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-primary-100 transition-all duration-300 relative group">
            ${isDefault ? `
                <div class="absolute top-4 right-4 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    <i class="fas fa-star mr-1"></i>Mặc định
                </div>
            ` : ''}
            
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 truncate">${resume.title}</h3>
                    <p class="text-sm text-gray-500">Mẫu: ${template}</p>
                </div>
                <div class="flex items-center gap-2 ml-4">
                    ${!isDefault ? `
                        <button onclick="setDefaultResume('${resume.id}')" class="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary-600 hover:border-primary-200 transition-colors flex items-center justify-center" title="Đặt làm mặc định">
                            <i class="fas fa-star"></i>
                        </button>
                    ` : ''}
                    <button onclick="previewResume('${resume.id}')" class="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary-600 hover:border-primary-200 transition-colors flex items-center justify-center" title="Xem trước">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>

            <div class="space-y-2 mb-4 text-sm text-gray-500">
                <div class="flex items-center">
                    <i class="fas fa-calendar-alt mr-2 w-5"></i>
                    <span>Cập nhật: ${updatedAt}</span>
                </div>
                ${resume.desiredPosition ? `
                <div class="flex items-center">
                    <i class="fas fa-briefcase mr-2 w-5"></i>
                    <span>Vị trí mong muốn: ${resume.desiredPosition}</span>
                </div>
                ` : ''}
                ${resume.desiredSalaryMin || resume.desiredSalaryMax ? `
                <div class="flex items-center">
                    <i class="fas fa-money-bill-wave mr-2 w-5"></i>
                    <span>Mức lương: ${formatSalary(resume.desiredSalaryMin, resume.desiredSalaryMax, resume.desiredSalaryType)}</span>
                </div>
                ` : ''}
            </div>

            <div class="pt-4 border-t border-gray-100 flex items-center gap-2">
                <a href="#/resumes/${resume.id}" class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors text-center text-sm" data-link>
                    <i class="fas fa-eye mr-1"></i>Xem
                </a>
                <a href="#/resumes/${resume.id}/edit" class="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center text-sm" data-link>
                    <i class="fas fa-edit mr-1"></i>Sửa
                </a>
                <button onclick="deleteResume('${resume.id}')" class="flex-1 px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors text-center text-sm">
                    <i class="fas fa-trash mr-1"></i>Xóa
                </button>
            </div>
        </div>
    `;
}

// Global functions for event handlers
window.setDefaultResume = async function(resumeId) {
    const result = await api.put(`/resumes/${resumeId}/default`);
    if (result.error) {
        showToast(result.error, 'error');
    } else {
        showToast('Đã đặt CV mặc định', 'success');
        router.handleRouteChange();
    }
};

window.previewResume = function(resumeId) {
    router.navigate(`/resumes/${resumeId}`);
};

window.deleteResume = async function(resumeId) {
    if (!confirm('Bạn có chắc chắn muốn xóa CV này? Hành động này không thể hoàn tác.')) return;
    
    const result = await api.delete(`/resumes/${resumeId}`);
    if (result.error) {
        showToast(result.error, 'error');
    } else {
        showToast('Đã xóa CV', 'success');
        router.handleRouteChange();
    }
};

// Format helpers
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
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
