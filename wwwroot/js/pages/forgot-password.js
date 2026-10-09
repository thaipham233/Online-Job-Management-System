// Forgot Password Page
export async function render(container) {
    if (auth.isAuthenticated) {
        router.navigate('/');
        return;
    }

    container.innerHTML = `
        <div class="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
            <div class="w-full max-w-md">
                <!-- Logo -->
                <div class="text-center mb-8">
                    <a href="#/" class="inline-flex items-center space-x-2" data-link>
                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                            <i class="fas fa-briefcase text-white text-xl"></i>
                        </div>
                        <span class="text-2xl font-bold text-gray-900">JobHub</span>
                    </a>
                    <h1 class="text-2xl font-bold text-gray-900 mt-4">Quên mật khẩu</h1>
                    <p class="text-gray-500 mt-2">Nhập email để nhận link đặt lại mật khẩu</p>
                </div>

                <!-- Form -->
                <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                    <form id="forgot-form" class="space-y-6">
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <div class="relative">
                                <i class="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input type="email" id="email" name="email" required autocomplete="email"
                                    class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="you@example.com">
                            </div>
                        </div>

                        <button type="submit" id="submit-btn" class="w-full py-3 px-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center">
                            <i class="fas fa-paper-plane mr-2"></i>Gửi link đặt lại
                        </button>
                    </form>

                    <div class="mt-6 text-center">
                        <p class="text-gray-600">Nhớ mật khẩu? <a href="#/login" class="text-primary-600 font-medium hover:text-primary-700" data-link>Đăng nhập ngay</a></p>
                    </div>

                    <!-- Info -->
                    <div class="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <div class="flex">
                            <i class="fas fa-info-circle text-blue-500 mt-0.5 mr-3"></i>
                            <div class="text-sm text-blue-800">
                                <p class="font-medium mb-1">Lưu ý:</p>
                                <p>Link đặt lại mật khẩu sẽ được gửi đến email của bạn. Link có hiệu lực trong 1 giờ.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    attachForgotPasswordHandlers();
}

function attachForgotPasswordHandlers() {
    const form = document.getElementById('forgot-form');
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('submit-btn');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Đang gửi...';

        const formData = new FormData(form);
        const result = await api.post('/auth/forgot-password', { email: formData.get('email') });

        btn.disabled = false;
        btn.innerHTML = originalText;

        if (result.error) {
            showToast(result.error, 'error');
        } else {
            showToast('Nếu email tồn tại, link đặt lại mật khẩu đã được gửi', 'success');
            router.navigate('/login');
        }
    });
}
