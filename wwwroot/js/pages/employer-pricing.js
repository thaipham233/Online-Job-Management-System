// Employer Pricing Page - Bảng giá
export async function render(container) {
    container.innerHTML = `
        <!-- Header -->
        <section class="py-16 px-4 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
            <div class="max-w-4xl mx-auto text-center">
                <i class="fas fa-tag text-6xl text-yellow-300 mb-6"></i>
                <h1 class="text-4xl font-bold mb-4">Bảng Giá</h1>
                <p class="text-white/90 text-lg">Dịch vụ tuyển dụng cho nhà tuyển dụng</p>
            </div>
        </section>

        <div class="max-w-7xl mx-auto px-4 py-16">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Pricing Tiers -->
                <div class="space-y-8">
                    <div class="bg-white rounded-2xl border border-gray-100 p-8">
                        <h3 class="font-bold text-gray-900 mb-6">Gói cơ bản</h3>
                        <div class="mb-6">
                            <span class="text-4xl font-bold text-gray-900">500.000<span class="text-lg font-normal text-gray-500">đ</span></span>
                            <span class="text-sm text-gray-500">/tháng</span>
                        </div>
                        <ul class="space-y-4">
                            ${['<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Đăng tuyển dụng','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Hiển thị 30 ngày','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Đội ngũ 2 thành viên','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Tư vấn cơ bản'].map(item => item).join('')}
                        </ul>
                        <button class="w-full mt-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors" data-link>
                            Chọn gói
                        </button>
                    </div>

                    <div class="bg-white rounded-2xl border-2 border-gray-100 p-8">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="font-bold text-gray-900">Gói tiêu biểu</h3>
                            <i class="fas fa-star text-warning-500 text-sm"></i>
                        </div>
                        <div class="mb-6">
                            <span class="text-4xl font-bold text-gray-900">1.200.000<span class="text-lg font-normal text-gray-500">đ</span></span>
                            <span class="text-sm text-gray-500">/tháng</span>
                        </div>
                        <ul class="space-y-4">
                            ${['<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Tất cả tính năng Gói Cơ bản','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Hiển thị 90 ngày','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Đội ngũ 5 thành viên','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Tư vấn chuyên sâu','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Tối ưu vị trí bằng AI','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Báo cáo phân tích chi tiết'].map(item => item).join('')}
                        </ul>
                        <button class="w-full mt-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors" data-link>
                            Chọn gói
                        </button>
                    </div>

                    <div class="bg-white rounded-2xl border border-gray-100 p-8">
                        <h3 class="font-bold text-gray-900 mb-6">Gói doanh nghiệp</h3>
                        <div class="mb-6">
                            <span class="text-4xl font-bold text-gray-900">3.500.000<span class="text-lg font-normal text-gray-500">đ</span></span>
                            <span class="text-sm text-gray-500">/tháng</span>
                        </div>
                        <ul class="space-y-4">
                            ${['<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Tất cả tính năng Gói Tiêu biểu','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Hiển thị 180 ngày','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Đội ngũ 20 thành viên','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Tư vấn nhân sự tiêu điểm','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Phân tích cơ cấu tiền công','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Vận chấm công chuyển đổi','<li class="flex items-center py-2 border-b border-gray-50 last:border-0"><i class="fas fa-check text-success-500 mr-3"></i>Tổng hợp lịch sử tuyển dụng'].map(item => item).join('')}
                        </ul>
                        <button class="w-full mt-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors" data-link>
                            Chọn gói
                        </button>
                    </div>
                </div>

                <!-- FAQ -->
                <div class="space-y-6">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-6">Câu hỏi thường gặp</h3>
                    </div>

                    <div class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h4 class="font-semibold text-gray-900 mb-2">1. Tôi có thể dùng thử miễn phí không?</h4>
                        <p class="text-gray-500 text-sm">Có, chúng tôi cung cấp 14 ngày thử nghiệm miễn phí cho tất cả các gói.</p>
                    </div>
                    <div class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h4 class="font-semibold text-gray-900 mb-2">2. Cách thức thanh toán là gì?</h4>
                        <p class="text-gray-500 text-sm">Thanh toán qua chuyển khoản ngân hàng hoặc thẻ TI. Tất cả các gói đều tính theo tháng.</p>
                    </div>
                    <div class="bg-white rounded-2xl border border-gray-100 p-6">
                        <h4 class="font-semibold text-gray-900 mb-2">3. Tôi có thể hủy bất cứ lúc nào không?</h4>
                        <p class="text-gray-500 text-sm">Có, bạn hoàn toàn có thể hủy bất cứ lúc nào trước khi hết tháng.</p>
                    </div>
                </div>
            </div>

            <!-- CTA -->
            <div class="mt-12 bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Cần thông tin chi tiết?</h3>
                <p class="text-gray-500 mb-6 max-w-2xl mx-auto">Đội ngũ của chúng tôi sẵn sàng hỗ trợ bạn chọn gói phù hợp nhất.</p>
                <a href="mailto:support@jobhub.vn" class="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors" data-link>
                    <i class="fas fa-envelope mr-2"></i>Email hỗ trợ
                </a>
            </div>
        </div>
    `;
}
