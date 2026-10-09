// Register Page
export async function render(container) {
    if (auth.isAuthenticated) {
        router.navigate('/');
        return;
    }

    const params = router.getQueryParams();
    const defaultRole = params.role || 'candidate'; // 'candidate' or 'employer'

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
                    <p class="text-gray-500 mt-4">Tạo tài khoản mới</p>
                </div>

                <!-- Role Selector -->
                <div class="mb-6">
                    <div class="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Chọn loại tài khoản">
                        <label class="relative cursor-pointer">
                            <input type="radio" name="role" value="candidate" ${defaultRole === 'candidate' ? 'checked' : ''} class="sr-only peer" id="role-candidate">
                            <div class="p-4 border-2 rounded-xl text-center transition-all peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:shadow-lg">
                                <i class="fas fa-user text-2xl mb-2 ${defaultRole === 'candidate' ? 'text-primary-600' : 'text-gray-400'} peer-checked:text-primary-600"></i>
                                <p class="font-medium text-gray-900">Ứng viên</p>
                                <p class="text-xs text-gray-500 mt-1">Tìm việc làm</p>
                            </div>
                        </label>
                        <label class="relative cursor-pointer">
                            <input type="radio" name="role" value="employer" ${defaultRole === 'employer' ? 'checked' : ''} class="sr-only peer" id="role-employer">
                            <div class="p-4 border-2 rounded-xl text-center transition-all peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:shadow-lg">
                                <i class="fas fa-building text-2xl mb-2 ${defaultRole === 'employer' ? 'text-primary-600' : 'text-gray-400'} peer-checked:text-primary-600"></i>
                                <p class="font-medium text-gray-900">Nhà tuyển dụng</p>
                                <p class="text-xs text-gray-500 mt-1">Tuyển người</p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Register Form -->
                <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                    <form id="register-form" class="space-y-5" novalidate>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1.5">Họ</label>
                                <input type="text" id="firstName" name="firstName" required autocomplete="given-name"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="Nguyễn">
                            </div>
                            <div>
                                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1.5">Tên</label>
                                <input type="text" id="lastName" name="lastName" required autocomplete="family-name"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="Văn A">
                            </div>
                        </div>

                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <div class="relative">
                                <i class="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input type="email" id="email" name="email" required autocomplete="email"
                                    class="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="you@example.com">
                            </div>
                        </div>

                        <div>
                            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                            <div class="relative">
                                <i class="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input type="tel" id="phone" name="phone" autocomplete="tel"
                                    class="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="09x xxx xxxx">
                            </div>
                        </div>

                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <label for="password" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
                                <span class="text-xs text-gray-400">Tối thiểu 8 ký tự</span>
                            </div>
                            <div class="relative">
                                <i class="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input type="password" id="password" name="password" required autocomplete="new-password"
                                    class="w-full pl-12 pr-12 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="••••••••">
                                <button type="button" id="toggle-password" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div id="password-strength" class="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden"></div>
                        </div>

                        <div>
                            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
                            <div class="relative">
                                <i class="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input type="password" id="confirmPassword" name="confirmPassword" required autocomplete="new-password"
                                    class="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="••••••••">
                            </div>
                        </div>

                        <!-- Employer specific fields -->
                        <div id="employer-fields" class="space-y-5 border-t border-gray-100 pt-5 ${defaultRole === 'employer' ? '' : 'hidden'}">
                            <h4 class="text-lg font-semibold text-gray-900">Thông tin công ty</h4>
                            <div>
                                <label for="companyName" class="block text-sm font-medium text-gray-700 mb-1.5">Tên công ty</label>
                                <input type="text" id="companyName" name="companyName" autocomplete="organization"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="Công ty TNHH ABC">
                            </div>
                            <div>
                                <label for="companyWebsite" class="block text-sm font-medium text-gray-700 mb-1.5">Website (tùy chọn)</label>
                                <div class="relative">
                                    <i class="fas fa-globe absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                    <input type="url" id="companyWebsite" name="companyWebsite"
                                        class="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        placeholder="https://company.com">
                                </div>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <input type="checkbox" id="terms" name="terms" required class="w-4 h-4 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                            <label for="terms" class="ml-2 text-sm text-gray-600">
                                Tôi đồng ý với <a href="#/terms" class="text-primary-600 hover:text-primary-700" data-link>Điều khoản dịch vụ</a> và <a href="#/privacy" class="text-primary-600 hover:text-primary-700" data-link>Chính sách bảo mật</a>
                            </label>
                        </div>

                        <button type="submit" id="register-btn" class="w-full py-3 px-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center">
                            <i class="fas fa-user-plus mr-2"></i>Tạo tài khoản
                        </button>
                    </form>

                    <div class="mt-6 text-center">
                        <p class="text-gray-600">Đã có tài khoản? <a href="#/login" class="text-primary-600 font-medium hover:text-primary-700" data-link>Đăng nhập ngay</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;

    attachRegisterHandlers();
}

function attachRegisterHandlers() {
    // Role selector
    document.querySelectorAll('input[name="role"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const employerFields = document.getElementById('employer-fields');
            const companyNameInput = document.getElementById('companyName');
            
            if (e.target.value === 'employer') {
                employerFields.classList.remove('hidden');
                companyNameInput.required = true;
            } else {
                employerFields.classList.add('hidden');
                companyNameInput.required = false;
            }
        });
    });

    // Toggle password visibility
    const toggleBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    
    toggleBtn?.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        toggleBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    // Password strength meter
    passwordInput?.addEventListener('input', () => {
        const strength = calculatePasswordStrength(passwordInput.value);
        updatePasswordStrengthMeter(strength);
    });

    // Form submit
    const form = document.getElementById('register-form');
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        
        if (password !== confirmPassword) {
            showToast('Mật khẩu xác nhận không khớp', 'error');
            return;
        }

        if (password.length < 8) {
            showToast('Mật khẩu phải có ít nhất 8 ký tự', 'error');
            return;
        }

        const btn = document.getElementById('register-btn');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Đang tạo tài khoản...';

        const role = form.role.value;
        const userData = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            phone: form.phone.value,
            password: password,
            role: role === 'employer' ? 'Employer' : 'Candidate'
        };

        if (role === 'employer') {
            userData.companyName = form.companyName.value;
            userData.companyWebsite = form.companyWebsite.value;
        }

        const result = await api.register(userData);

        btn.disabled = false;
        btn.innerHTML = originalText;

        if (result.error) {
            showToast(result.error, 'error');
        } else {
            showToast('Đăng ký thành công! Chào mừng bạn đến với JobHub', 'success');
            router.navigate('/');
        }
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return Math.min(score, 5);
}

function updatePasswordStrengthMeter(score) {
    const meter = document.getElementById('password-strength');
    if (!meter) return;
    
    const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];
    const labels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
    
    meter.style.background = `linear-gradient(90deg, ${colors[score - 1] || colors[0]} ${score * 20}%, #e5e7eb ${score * 20}%)`;
    meter.title = labels[score - 1] || labels[0];
}
