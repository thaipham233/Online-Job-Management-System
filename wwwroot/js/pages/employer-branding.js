// Employer Branding Page - Employer Branding
export async function render(container) {
    container.innerHTML = `
        <!-- Header -->
        <section class="py-16 px-4 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <div class="max-w-4xl mx-auto text-center">
                <i class="fas fa-eye text-6xl text-yellow-300 mb-6"></i>
                <h1 class="text-4xl font-bold mb-4">Employer Branding</h1>
                <p class="text-white/90 text-lg">Xây dựng thương hiệu doanh nghiệp thu hút tốt nghiệp nhất</p>
            </div>
        </section>

        <div class="max-w-7xl mx-auto px-4 py-16">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Benefits -->
                <div class="space-y-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">Tại sao cần Employer Branding?</h2>
                        <p class="text-gray-500 mb-6">Đăng trình doanh nghiệp như một nhà tuyển dụng muốn thu hút nhất</p>
                    </div>

                    <div class="space-y-6">
                        ${[
                            { icon: 'fa-gem', title: 'Thu hút ứng viên chất lượng', desc: 'Xây dựng hình ảnh doanh nghiệp quyến rũ, thu hút ứng viên giỏi nhất' },
                            { icon: 'fa-bullseye', title: 'Giảm chi phí tuyển dụng', desc: 'Ứng viêncore ưu đãi doanh nghiệp sẽ chủ động ứng tuyển' },
                            { icon: 'fa-heart', title: 'Tăng tỷ lệ giữ chân nhân viên', desc: 'Đội ngũ ổn định hơn, giảm chi phí nhân sự' },
                            { icon: 'fa-chart-line', title: 'Cao hiệu suất sản phẩm', desc: 'Nhân viên trung thành đóng góp nhiều hơn' },
                            { icon: 'fa-handshake', title: 'Tăng uy tín thương hiệu', desc: 'Doanh nghiệp được trải diện tốt trước khách hàng và đối tác' },
                            { icon: 'fa-rocket', title: 'Nhận thử nghiệm', desc: 'Bình lượng hấp dẫn hơn cho ứng viên' }
                        ].map((item, i) => `
                            <div class="flex items-start space-x-4 p-4 rounded-xl hover:bg-primary-50 transition-colors" style="animation-delay: ${i * 100}ms;">
                                <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <i class="fas ${item.icon} text-primary-600 text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-gray-900 mb-1">${item.title}</h4>
                                    <p class="text-sm text-gray-500">${item.desc}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Steps -->
                <div class="space-y-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">Các bước xây dựng thương hiệu tuyển dụng</h2>
                        <p class="text-gray-500 mb-6">Lộ trình triển khai cho nhà tuyển dụng</p>
                    </div>

                    <div class="space-y-6">
                        ${[
                            { step: '01', title: 'Định nghĩa chính sách lao động', desc: 'Mức lương, phúc lợi, thời gian làm việc, văn hóa công ty' },
                            { step: '02', title: 'Xây dựng đề xuất hấp dẫn', desc: 'Tạo giá trị nhất quán với ứng viên mục tiêu' },
                            { step: '03', title: 'Quản lý trải nghiệm ứng tuyển', desc: 'Phản hồi nhanh, tư vấn chuyên nghiệp trong suốt quá trình' },
                            { step: '04', title: 'Đo lường và cải tiến', desc: 'Theo dõi nguồn lực, tỷ lệ ứng tuyển, tỷ lệ chuyển đổi' }
                        ].map((item, i) => `
                            <div class="flex items-start space-x-4 p-4 rounded-xl hover:bg-primary-50 transition-colors" style="animation-delay: ${i * 100}ms;">
                                <div class="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <span class="text-2xl font-bold text-primary-600">${item.step}</span>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-gray-900 mb-1">${item.title}</h4>
                                    <p class="text-sm text-gray-500">${item.desc}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- CTA -->
            <div class="mt-12 bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Xây dựng thương hiệu tuyển dụng?</h3>
                <p class="text-gray-500 mb-6 max-w-xl mx-auto">Đăng ký kiểm duyệt công ty của bạn để đăng tuyển và quảng bá thương hiệu.</p>
                <a href="#/employer/company" class="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors" data-link>
                    <i class="fas fa-building mr-2"></i>Xác thực công ty của bạn
                </a>
            </div>
        </div>
    `;
}
