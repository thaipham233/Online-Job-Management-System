// Register View - Form đăng ký tài khoản
class JobHubRegisterView {
    constructor() {
        this.showPassword = false;
        this.showConfirmPassword = false;
    }

    render() {
        return `
            <div class="auth-container">
                <!-- Left: Brand panel -->
                <div class="auth-left">
                    <div class="auth-brand">
                        <div class="auth-logo">
                            <i class="fas fa-briefcase"></i>
                            <h1>JobHub</h1>
                            <p>Kết nối cơ hội - Mở rộng tiềm năng</p>
                        </div>
                        <div class="auth-features">
                            <div class="feature">
                                <i class="fas fa-shield-alt"></i>
                                <span>Xác thực an toàn</span>
                            </div>
                            <div class="feature">
                                <i class="fas fa-bullseye"></i>
                                <span>Tìm kiếm chính xác</span>
                            </div>
                            <div class="feature">
                                <i class="fas fa-briefcase"></i>
                                <span>Hồ sơ rõ ràng</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right: Register form -->
                <div class="auth-right">
                    <div class="auth-card card">
                        <div class="card-header">
                            <h2 class="h2">
                                <i class="fas fa-user-plus text-primary"></i>
                                Đăng ký tài khoản
                            </h2>
                            <p class="text-muted">Tạo tài khoản miễn phí để ứng tuyển và quản lý hồ sơ</p>
                        </div>
                        <div class="card-body">
                            <form id="register-form" class="form">
                                <div class="form-row">
                                    <div class="form-group col">
                                        <label class="form-label" for="reg-fullname">
                                            <i class="fas fa-user"></i> Họ tên
                                        </label>
                                        <input
                                            type="text"
                                            id="reg-fullname"
                                            class="form-control"
                                            placeholder="Nguyễn Văn An"
                                            required
                                        >
                                    </div>
                                    <div class="form-group col">
                                        <label class="form-label" for="reg-email">
                                            <i class="fas fa-envelope"></i> Email
                                        </label>
                                        <input
                                            type="email"
                                            id="reg-email"
                                            class="form-control"
                                            placeholder="your@email.com"
                                            required
                                        >
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col">
                                        <label class="form-label" for="reg-username">
                                            <i class="fas fa-at"></i> Username
                                        </label>
                                        <input
                                            type="text"
                                            id="reg-username"
                                            class="form-control"
                                            placeholder="username"
                                            required
                                        >
                                    </div>
                                    <div class="form-group col">
                                        <label class="form-label" for="reg-phone">
                                            <i class="fas fa-phone"></i> Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            id="reg-phone"
                                            class="form-control"
                                            placeholder="0901234567"
                                            maxlength="11"
                                        >
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="reg-password">
                                        <i class="fas fa-lock"></i> Mật khẩu
                                    </label>
                                    <div class="input-group">
                                        <input
                                            type="password"
                                            id="reg-password"
                                            class="form-control"
                                            placeholder="Ít nhất 8 ký tự"
                                            required
                                            minlength="8"
                                        >
                                        <button
                                            type="button"
                                            class="btn btn-outline btn-sm toggle-password"
                                            onclick="document.getElementById('reg-password').type = document.getElementById('reg-password').type === 'password' ? 'text' : 'password'"
                                        >
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="reg-confirm">
                                        <i class="fas fa-lock"></i> Xác nhận mật khẩu
                                    </label>
                                    <div class="input-group">
                                        <input
                                            type="password"
                                            id="reg-confirm"
                                            class="form-control"
                                            placeholder="Nhập lại mật khẩu"
                                            required
                                            minlength="8"
                                        >
                                        <button
                                            type="button"
                                            class="btn btn-outline btn-sm toggle-password"
                                            onclick="document.getElementById('reg-confirm').type = document.getElementById('reg-confirm').type === 'password' ? 'text' : 'password'"
                                        >
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-check">
                                        <input type="checkbox" id="agree-terms" required>
                                        <span class="form-check-label">
                                            Tôi đồng ý với <a href="#" class="text-primary">điều khoản sử dụng</a> và <a href="#" class="text-primary">chính sách bảo mật</a>
                                        </span>
                                    </label>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary btn-lg w-full">
                                        <i class="fas fa-user-plus"></i> Đăng ký tài khoản
                                    </button>
                                </div>
                            </form>

                            <div class="auth-links">
                                <span class="auth-link">Bạn đã có tài khoản? <a href="#/login" class="text-primary">Đăng nhập</a></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        const form = document.getElementById('register-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName = document.getElementById('reg-fullname').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const username = document.getElementById('reg-username').value.trim();
            const phone = document.getElementById('reg-phone').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm').value;
            const agreeTerms = document.getElementById('agree-terms').checked;

            // Validation
            if (!fullName || !email || !username || !password || !confirmPassword || !agreeTerms) {
                showToast('Vui lòng điền đầy đủ thông tin', 'error');
                return;
            }
            if (password !== confirmPassword) {
                showToast('Mật khẩu và xác nhận mật khẩu không khớp', 'error');
                return;
            }
            if (password.length < 8) {
                showToast('Mật khẩu phải có ít nhất 8 ký tự', 'error');
                return;
            }

            showToast('Đang đăng ký...', 'info', 2000);

            try {
                const userData = {
                    fullName,
                    email,
                    userName: username,
                    phoneNumber: phone || undefined,
                    password,
                    confirmPassword,
                    role: 'Candidate'
                };

                const result = await api.register(userData);
                if (result.error) {
                    showToast(result.error, 'error');
                } else {
                    showToast('Đăng ký thành công! Đang chuyển hướng...', 'success');
                    // Auto-redirect to login after a short delay
                    setTimeout(() => {
                        router.navigate('/login');
                    }, 1500);
                }
            } catch (error) {
                showToast('Đã xảy ra lỗi. Vui lòng thử lại.', 'error');
            }
        });

        // Password toggles
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }
}
