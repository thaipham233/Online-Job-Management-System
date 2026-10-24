// Employer Resources Page - Tài nguyên tuyển dụng
export async function render(container) {
    container.innerHTML = `
        <!-- Header -->
        <section class="py-16 px-4 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <div class="max-w-4xl mx-auto text-center">
                <i class="fas fa-book-open text-6xl text-yellow-300 mb-6"></i>
                <h1 class="text-4xl font-bold mb-4">Tài Nguyên Tuyển Dụng</h1>
                <p class="text-white/90 text-lg">Tài liệu, công cụ và hướng dẫn cho nhà tuyển dụng</p>
            </div>
        </section>

        <div class="max-w-7xl mx-auto px-4 py-16">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Resource Categories -->
                <div class="space-y-6">
                    <div class="bg-white rounded-2xl border border-gray-100 p-8">
                        <div class="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-6">
                            <i class="fas fa-file-alt text-3xl text-primary-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-4">Tài liệu chính</h3>
                        <ul class="space-y-3">
                            ${['<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-chevron-right text-primary-500 mr-3"></i>Hướng dẫn tuyển dụng','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-chevron-right text-primary-500 mr-3"></i>Mẫu CV tốt nghiệp','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-chevron-right text-primary-500 mr-3"></i>Hướng dẫn phỏng vấn','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-chevron-right text-primary-500 mr-3"></i>Đánh giá ứng viên hiệu quả'].map(item => item).join('')}
                        </ul>
                    </div>
                    <div class="bg-white rounded-2xl border border-gray-100 p-8">
                        <div class="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-6">
                            <i class="fas fa-tools text-3xl text-primary-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-4">Công cụ hỗ trợ</h3>
                        <ul class="space-y-3">
                            ${['<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-chevron-right text-primary-500 mr-3"></i>Carrer Planner','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-chevron-right text-primary-500 mr-3"></i>Job Sitemap','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-chevron-right text-primary-500 mr-3"></i>Hình thức tuyển dụng','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-chevron-right text-primary-500 mr-3"></i>Workbook tuyển dụng'].map(item => item).join('')}
                        </ul>
                    </div>
                    <div class="bg-white rounded-2xl border border-gray-100 p-8">
                        <div class="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-6">
                            <i class="fas fa-handshake text-3xl text-primary-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-4">Hướng dẫn phỏng vấn</h3>
                        <ul class="space-y-3">
                            ${['<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-chevron-right text-primary-500 mr-3"></i>Phỏng vấn hành vi','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-chevron-right text-primary-500 mr-3"></i>Phỏng vấn kỹ năng','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-chevron-right text-primary-500 mr-3"></i>Xây dựng câu hỏi phỏng vấn','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-chevron-right text-primary-500 mr-3"></i>Đánh giá ứng viên mẫu'].map(item => item).join('')}
                        </ul>
                    </div>
                </div>

                <!-- Templates & Guides -->
                <div class="space-y-6">
                    <div class="bg-white rounded-2xl border border-gray-100 p-8">
                        <h3 class="text-xl font-bold text-gray-900 mb-6">Hướng dẫn chi tiết</h3>
                        <div class="space-y-6">
                            <div class="p-6 rounded-xl bg-gray-50 border border-gray-100">
                                <h4 class="font-semibold text-gray-900 mb-3">1. Xây dựng thương hiệu tuyển dụng</h4>
                                <p class="text-sm text-gray-500">
                                    Tìm hiểu cách xây dựng hình ảnh doanh nghiệp thu hút ứng viên chất lượng.
                                    <a href="#/employer/branding" class="text-primary-600 font-medium">Xem thêm →</a>
                                </p>
                            </div>
                            <div class="p-6 rounded-xl bg-gray-50 border border-gray-100">
                                <h4 class="font-semibold text-gray-900 mb-3">2. Tối ưu tuyển dụng bằng AI</h4>
                                <p class="text-sm text-gray-500">
                                    Hướng dẫn sử dụng công cụ AI để lọc ứng viên cho bạn. 
                                    Tối ưu quy trình tuyển dụng hiệu quả.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl border border-gray-100 p-8">
                        <h3 class="text-xl font-bold text-gray-900 mb-6">Tài liệu tải về</h3>
                        <div class="space-y-4">
                            ${['<div class="p-4 rounded-xl bg-gray-50"><span class="font-medium text-gray-900">Hướng dẫn tuyển dụng công ty</span><span class="text-sm text-gray-500">(PDF, 1,5 MB)</span></div>', '<div class="p-4 rounded-xl bg-gray-50"><span class="font-medium text-gray-900">Checklist phỏng vấn sản phẩm</span><span class="text-sm text-gray-500">(PDF, 850 KB)</span></div>', '<div class="p-4 rounded-xl bg-gray-50"><span class="font-medium text-gray-900">Mẫu đánh giá ứng viên hàng đầu</span><span class="text-sm text-gray-500">(PDF, 620 KB)</span></div>'].map(item => item).join('')}
                        </div>
                    </div>
                </div>

                <!-- Tips -->
                <div class="space-y-6">
                    <div class="bg-white rounded-2xl border border-gray-100 p-8">
                        <h3 class="text-xl font-bold text-gray-900 mb-6">Mẹo tuyển dụng</h3>
                        <div class="space-y-6">
                            <div class="p-6 rounded-xl bg-primary-50 border border-primary-100">
                                <i class="fas fa-lightbulb text-primary-600 mb-3"></i>
                                <h4 class="font-semibold text-gray-900 mb-2">Sử dụng công nghệ</h4>
                                <p class="text-sm text-gray-500">
                                    Học được sớm các công cụ AI và tự động hóa trong tuyển dụng nhân sự.
                                    Nâng cao hiệu suất tuyển dụng của bạn.
                                </p>
                            </div>
                            <div class="p-6 rounded-xl bg-primary-50 border border-primary-100">
                                <i class="fas fa-hand-pointer text-primary-600 mb-3"></i>
                                <h4 class="font-semibold text-gray-900 mb-2">Phân tích dữ liệu</h4>
                                <p class="text-sm text-gray-500">
                                    Xây dựng quy trình phân tích dữ liệu tuyển dụng giúp bạn ra quyết định dựa trên số liệu.
                                </p>
                            </div>
                            <div class="p-6 rounded-xl bg-primary-50 border border-primary-100">
                                <i class="fas fa-users text-primary-600 mb-3"></i>
                                <h4 class="font-semibold text-gray-900 mb-2">Kết nối mạng</h4>
                                <p class="text-sm text-gray-500">
                                    Xây dựng mạng lưới kết nối với các chuyên gia phỏng vấn, đào tạo và tuyển dụng.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CTA -->
            <div class="mt-12 bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Cần hỗ trợ thêm?</h3>
                <p class="text-gray-500 mb-6 max-w-xl mx-auto">Công cụ và hướng dẫn miễn phí từ JobHub dành cho nhà tuyển dụng.</p>
                <a href="#/employer/dashboard" class="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors" data-link>
                    <i class="fas fa-briefcase mr-2"></i>Vào Trang nhà tuyển dụng
                </a>
            </div>
        </div>
    `;
}
