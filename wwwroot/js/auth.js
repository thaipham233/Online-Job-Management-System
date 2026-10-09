// Auth Module - Quản lý authentication state
class AuthManager {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');
        
        if (storedUser && token) {
            try {
                this.user = JSON.parse(storedUser);
                this.isAuthenticated = true;
                api.setToken(token);
            } catch (e) {
                this.clear();
            }
        }
        this.updateUI();
    }

    setUser(user) {
        this.user = user;
        this.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(user));
        this.updateUI();
    }

    clear() {
        this.user = null;
        this.isAuthenticated = false;
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        api.setToken(null);
        this.updateUI();
    }

    logout() {
        this.clear();
        showToast('Đã đăng xuất', 'success');
        router.navigate('/');
    }

    hasRole(...roles) {
        if (!this.user) return false;
        return roles.some(role => this.user.roles?.includes(role));
    }

    isEmployer() {
        return this.hasRole('Employer', 'Admin');
    }

    isAdmin() {
        return this.hasRole('Admin');
    }

    isCandidate() {
        return this.hasRole('Candidate');
    }

    updateUI() {
        const guestMenu = document.getElementById('guest-menu');
        const userMenu = document.getElementById('user-menu');
        const mobileAuth = document.getElementById('mobile-auth');
        const mobileUser = document.getElementById('mobile-user');
        const userName = document.getElementById('user-name');
        const employerLink = document.getElementById('employer-link');
        const adminLink = document.getElementById('admin-link');
        const mobileEmployerLink = document.getElementById('mobile-employer-link');
        const mobileAdminLink = document.getElementById('mobile-admin-link');

        if (this.isAuthenticated) {
            if (guestMenu) guestMenu.classList.add('hidden');
            if (userMenu) userMenu.classList.remove('hidden');
            if (mobileAuth) mobileAuth.classList.add('hidden');
            if (mobileUser) mobileUser.classList.remove('hidden');
            if (userName) userName.textContent = this.user.fullName || this.user.email || 'User';

            // Show/hide role-based links
            const isEmployer = this.isEmployer();
            const isAdmin = this.isAdmin();

            [employerLink, mobileEmployerLink].forEach(el => {
                if (el) el.style.display = isEmployer ? 'block' : 'none';
            });
            [adminLink, mobileAdminLink].forEach(el => {
                if (el) el.style.display = isAdmin ? 'block' : 'none';
            });
        } else {
            if (guestMenu) guestMenu.classList.remove('hidden');
            if (userMenu) userMenu.classList.add('hidden');
            if (mobileAuth) mobileAuth.classList.remove('hidden');
            if (mobileUser) mobileUser.classList.add('hidden');
        }

        // Close dropdown on auth change
        const dropdown = document.getElementById('dropdown-menu');
        if (dropdown) {
            dropdown.classList.add('opacity-0', 'invisible', 'translate-y-2');
            dropdown.classList.remove('opacity-100', 'visible', 'translate-y-0');
        }
    }

    async refreshUser() {
        if (!this.isAuthenticated) return;
        
        const result = await api.getProfile();
        if (result.data) {
            this.setUser(result.data);
        } else if (result.error) {
            // Try refresh token
            const refreshResult = await api.refreshToken();
            if (refreshResult.error) {
                this.logout();
            } else {
                // Retry get profile
                const retryResult = await api.getProfile();
                if (retryResult.data) {
                    this.setUser(retryResult.data);
                } else {
                    this.logout();
                }
            }
        }
    }
}

// Global instance
const auth = new AuthManager();
