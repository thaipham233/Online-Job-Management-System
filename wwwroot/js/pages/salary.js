// Salary Page - Bảng lương
export async function render(container) {
    container.innerHTML = `
        <!-- Header -->
        <section class="py-16 px-4 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <div class="max-w-4xl mx-auto text-center">
                <i class="fas fa-dollar-sign text-6xl text-yellow-300 mb-6"></i>
                <h1 class="text-4xl font-bold mb-4">Bảng Lương</h1>
                <p class="text-white/90 text-lg">Mức lương thực tế tại các công ty tại Việt Nam</p>
            </div>
        </section>

        <div class="max-w-7xl mx-auto px-4 py-16">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Salary Guidelines -->
                <div class="space-y-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">Mức lương tham khảo</h2>
                        <p class="text-gray-500 mb-6">Giá trị lương thực tế tại các vị trí phổ biến</p>
                    </div>

                    <div class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 class="font-semibold text-gray-900 mb-4">Việc làm phổ biến</h3>
                        <div class="space-y-4">
                            ${['Mới tốt nghiệp', 'Junior (1-3 năm)', 'Mid-level (3-5 năm)', 'Senior (5+ năm)'].map(level => `
                                <div class="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                    <div>
                                        <span class="font-medium text-gray-800">${level}</span>
                                        <span class="text-xs text-gray-400 ml-2">(1-5 năm)</span>
                                    </div>
                                    <span class="text-right">
                                        <span class="font-bold text-gray-900">2.500.000</span> <span class="text-xs text-gray-500">đ/tháng</span>
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 class="font-semibold text-gray-900 mb-4">Mức lương theo công việc phổ biến</h3>
                        <div class="grid grid-cols-1 gap-3">
                            ${[
                                ['Phát triển phần mềm (React)', '15.000.000 - 35.000.000'],
                                ['Phát triển phần mềm (Backend)', '18.000.000 - 40.000.000'],
                                ['Quản lý dự án', '20.000.000 - 45.000.000'],
                                ['Thiết kế UI/UX', '12.000.000 - 25.000.000'],
                                ['Marketing digital', '8.000.000 - 18.000.000'],
                                ['Kế toán', '8.000.000 - 15.000.000']
                            ].map(([job, salary]) => `
                                <div class="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                    <span class="text-gray-700">${job}</span>
                                    <span class="font-semibold text-gray-900">${salary}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Salary Factors -->
                <div class="space-y-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">Yếu tố ảnh hưởng đến mức lương</h2>
                        <p class="text-gray-500 mb-6">Cần biết những yếu tố nào để đàm phán lương tốt hơn?</p>
                    </div>

                    <div class="grid grid-cols-1 gap-4">
                        <div class="bg-white rounded-2xl border border-gray-100 p-6">
                            <i class="fas fa-star text-primary-500 text-2xl mb-4"></i>
                            <h3 class="font-semibold text-gray-900 mb-2">Năng lực & Kỹ năng</h3>
                            <p class="text-gray-500 text-sm">Kỹ năng chuyên môn, ngôn ngữ lập trình, công nghệ sử dụng</p>
                        </div>
                        <div class="bg-white rounded-2xl border border-gray-100 p-6">
                            <i class="fas fa-chart-line text-primary-500 text-2xl mb-4"></i>
                            <h3 class="font-semibold text-gray-900 mb-2">Kinh nghiệm</h3></p>
                            <p class="text-gray-500 text-sm">Số năm làm trong ngành, thành tích đạt được</p>
                        </div>
                        <div class="bg-white rounded-2xl border border-gray-100 p-6">
                            <i class="fas fa-building text-primary-500 text-2xl mb-4"></i>
                            <h3 class="font-semibold text-gray-900 mb-2">Công ty & Ngành nghề</h3>
                            <p class="text-gray-500 text-sm">Mức lương khác nhau giữa các ngành: IT, Fintech, E-commerce, v.v.</p>
                        </div>
                        <div class="bg-white rounded-2xl border border-gray-100 p-6">
                            <i class="fas fa-globe text-primary-500 text-2xl mb-4"></i>
                            <h3 class="font-semibold text-gray-900 mb-2">Vị trí & Phạm vi</h3>
                            <p class="text-gray-500 text-sm">Vị trí công việc, quy mô công ty, mức độ phụ trách</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CTA -->
            <div class="mt-12 bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Bạn đang tìm việc có mức lương hợp lý?</h3>
                <p class="text-gray-500 mb-6 max-w-2xl mx-auto">Thử nghiệm để nhận được đề xuất lương phù hợp với qualifications của bạn ngay hôm nay.</p>
                <a href="#/register" class="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors" data-link>
                    <i class="fas fa-user-plus mr-2"></i>Đăng ký ngay
                </a>
            </div>
        </div>
    `;
}

// Salary format helpers
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
