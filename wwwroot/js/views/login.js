// Login View - Form đăng nhập
class JobHubLoginView {
    constructor() {
        this.showPassword = false;
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

                <!-- Right: Login form -->
                <div class="auth-right">
                    <div class="auth-card card">
                        <div class="card-header">
                            <h2 class="h2">
                                <i class="fas fa-sign-in-alt text-primary"></i>
                                Đăng nhập
                            </h2>
                            <p class="text-muted">Đăng nhập để tiếp tục khám phá cơ hội</p>
                        </div>
                        <div class="card-body">
                            <form id="login-form" class="form">
                                <div class="form-group">
                                    <label class="form-label" for="login-email">
                                        <i class="fas fa-envelope"></i> Email
                                    </label>
                                    <input
                                        type="email"
                                        id="login-email"
                                        class="form-control"
                                        placeholder="your@email.com"
                                        required
                                    >
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="login-password">
                                        <i class="fas fa-lock"></i> Mật khẩu
                                    </label>
                                    <div class="input-group">
                                        <input
                                            type="password"
                                            id="login-password"
                                            class="form-control"
                                            placeholder="Mật khẩu của bạn"
                                            required
                                        >
                                        <button
                                            type="button"
                                            class="btn btn-outline btn-sm toggle-password"
                                            onclick="document.getElementById('login-password').type = document.getElementById('login-password').type === 'password' ? 'text' : 'password'"
                                        >
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-check">
                                        <input type="checkbox" id="remember-me">
                                        <span class="form-check-label">Ghi nhớ tôi</span>
                                    </label>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary btn-lg w-full">
                                        <i class="fas fa-sign-in-alt"></i> Đăng nhập
                                    </button>
                                </div>
                            </form>

                            <div class="auth-links">
                                <a href="#/forgot-password" class="auth-link">Quên mật khẩu?</a>
                                <span class="divider">Hoặc</span>
                                <a href="#/register" class="auth-link">
                                    <i class="fas fa-user-plus"></i> Đăng ký tài khoản miễn phí
                                </a>
                            </div>

                            <!-- Demo credentials hint (optional) -->
                            <div class="demo-creds">
                                <small class="text-muted">
                                    <i class="fas fa-info-circle"></i>
                                    Sử dụng tài khoản demo: admin@jobsystem.com / admin123!
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        const form = document.getElementById('login-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;

            if (!email || !password) {
                showToast('Vui lòng điền đầy đủ email và mật khẩu', 'error');
                return;
            }

            showToast('Đang đăng nhập...', 'info', 2000);

            try {
                const result = await auth.login(email, password);
                if (result.error) {
                    showToast(result.error, 'error');
                } else {
                    showToast('Đăng nhập thành công!', 'success');
                    // Router will handle redirect via redirectAfterLogin()
                }
            } catch (error) {
                showToast('Đã xảy ra lỗi. Vui lòng thử lại.', 'error');
            }
        });

        // Password toggle
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }
}
