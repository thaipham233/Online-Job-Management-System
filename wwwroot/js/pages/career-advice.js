// Career Advice Page - Tư vấn nghề nghiệp
export async function render(container) {
    container.innerHTML = `
        <!-- Header -->
        <section class="py-16 px-4 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <div class="max-w-4xl mx-auto text-center">
                <i class="fas fa-lightbulb text-6xl text-yellow-300 mb-6"></i>
                <h1 class="text-4xl font-bold mb-4">Tư Vấn Nghề Nghiệp</h1>
                <p class="text-white/90 text-lg">Hướng dẫn phát triển sự nghiệp và đi chứng kiến mô hình succeess</p>
            </div>
        </section>

        <div class="max-w-7xl mx-auto px-4 py-16">
            <!-- Career Advice -->
            <div class="space-y-12">
                <div>
                    <h2 class="text-3xl font-bold text-gray-900 mb-6">Cách phát triển sự nghiệp hiệu quả</h2>
                    <p class="text-gray-500 mb-8 max-w-3xl">
                        Sự nghiệp của bạn là hành trình dài, cần có kế hoạch rõ ràng và thực thi đều đặn.
                        Dưới đây là các bước quan trọng giúp bạn đi đúng hướng.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                        <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary-100 flex items-center justify-center">
                            <i class="fas fa-briefcase text-4xl text-primary-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-4">1. Xác định định hướng</h3>
                        <p class="text-gray-500">
                            Tìm hiểu chính mình: điểm mạnh, sở thích, giá trị. Xác định ngành nghề phù hợp.
                        </p>
                    </div>
                    <div class="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                        <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary-100 flex items-center justify-center">
                            <i class="fas fa-rocket text-4xl text-primary-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-4">2. Học tập liên tục</h3>
                        <p class="text-gray-500">
                            Công nghệ thay đổi nhanh. Luôn cập nhật kiến thức mới, học thêm kỹ năng cần thiết.
                        </p>
                    </div>
                    <div class="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                        <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary-100 flex items-center justify-center">
                            <i class="fas fa-network-wired text-4xl text-primary-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-4">3. Mở rộng mạng lưới</h3>
                        <p class="text-gray-500">
                            Kết nối với chuyên gia, tham gia các sự kiện công nghiệp. Mạng lưới quan trọng.
                        </p>
                    </div>
                </div>

                <!-- Skills -->
                <div>
                    <h2 class="text-3xl font-bold text-gray-900 mb-8">Kỹ năng cần có</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="font-semibold text-gray-900 mb-4">Kỹ năng mềm (Soft Skills)</h3>
                            <ul class="space-y-3">
                                ${['Giao tiếp hiệu quả', 'Làm việc nhóm', 'Quản lý thời gian', 'Giải quyết vấn đề', 'Tư duy phản biện', 'Lãnh đạo'].map(skill => `
                                    <li class="flex items-center py-2 border-b border-gray-50 last:border-0">
                                        <i class="fas fa-check-circle text-success-500 mr-3 text-sm"></i>
                                        <span class="text-gray-700">${skill}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900 mb-4">Kỹ năng cứng (Hard Skills)</h3>
                            <ul class="space-y-3">
                                ${['Python/JavaScript/Java', 'SQL/Database', 'Cloud (AWS/Azure)', 'DevOps/CI/CD', 'Data Analysis', 'Project Management'].map(skill => `
                                    <li class="flex items-center py-2 border-b border-gray-50 last:border-0">
                                        <i class="fas fa-check-circle text-success-500 mr-3 text-sm"></i>
                                        <span class="text-gray-700">${skill}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- CTA -->
                <div class="mt-12 bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Cần tư vấn cá nhân?</h3>
                    <p class="text-gray-500 mb-6 max-w-2xl mx-auto">
                        Team JobHub sẵn sàng hỗ trợ bạn đánh giá định hướng và lập lộ trình phát triển.
                    </p>
                    <a href="#/register" class="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors" data-link>
                        <i class="fas fa-comment-discussion mr-2"></i>Liên hệ tư vấn miễn phí
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Helper function for rendering
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
