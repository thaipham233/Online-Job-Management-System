// Main App - Route definitions and initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initNavbar();
    initMobileMenu();
    initUserDropdown();
    
    // Define routes
    setupRoutes();
    
    // Start router
    router.handleRouteChange();
});

// Navbar initialization
function initNavbar() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[data-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                router.navigate(href.slice(1));
            }
        });
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
}

// User dropdown
function initUserDropdown() {
    const btn = document.getElementById('user-btn');
    const dropdown = document.getElementById('dropdown-menu');
    const logoutBtn = document.getElementById('logout-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    
    if (btn && dropdown) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('opacity-0');
            dropdown.classList.toggle('invisible');
            dropdown.classList.toggle('translate-y-2');
            dropdown.classList.toggle('opacity-100');
            dropdown.classList.toggle('visible');
            dropdown.classList.toggle('translate-y-0');
        });
    }
    
    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (dropdown && !dropdown.contains(e.target) && e.target !== btn) {
            dropdown.classList.add('opacity-0', 'invisible', 'translate-y-2');
            dropdown.classList.remove('opacity-100', 'visible', 'translate-y-0');
        }
    });
    
    // Logout handlers
    [logoutBtn, mobileLogoutBtn].forEach(el => {
        if (el) {
            el.addEventListener('click', () => auth.logout());
        }
    });
}

// Toast notification system
function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const icons = {
        success: 'fa-check-circle text-green-500',
        error: 'fa-exclamation-circle text-red-500',
        warning: 'fa-exclamation-triangle text-yellow-500',
        info: 'fa-info-circle text-blue-500'
    };
    
    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        warning: 'bg-yellow-50 border-yellow-200',
        info: 'bg-blue-50 border-blue-200'
    };
    
    const toast = document.createElement('div');
    toast.className = `flex items-center p-4 rounded-lg shadow-lg border min-w-[300px] max-w-md animate-slide-right ${bgColors[type]}`;
    toast.innerHTML = `
        <i class="fas ${icons[type]} mr-3 text-lg"></i>
        <span class="text-gray-800 flex-1">${message}</span>
        <button class="ml-4 text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
    `;
    
    toast.querySelector('button').addEventListener('click', () => toast.remove());
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Modal system
function showModal(content, options = {}) {
    const root = document.getElementById('modal-root');
    const { size = 'md', closable = true, onClose } = options;
    
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4'
    };
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" data-modal-backdrop></div>
        <div class="relative w-full ${sizes[size]} bg-white rounded-2xl shadow-xl animate-scale-in">
            ${closable ? `
                <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10" data-modal-close>
                    <i class="fas fa-times text-xl"></i>
                </button>
            ` : ''}
            <div class="p-6">${content}</div>
        </div>
    `;
    
    const closeModal = () => {
        modal.querySelector('.animate-scale-in').classList.replace('animate-scale-in', 'animate-scale-out');
        setTimeout(() => {
            modal.remove();
            if (onClose) onClose();
        }, 200);
    };
    
    modal.querySelector('[data-modal-backdrop]')?.addEventListener('click', closeModal);
    modal.querySelector('[data-modal-close]')?.addEventListener('click', closeModal);
    
    root.appendChild(modal);
    return { close: closeModal };
}

function closeModal() {
    const modal = document.querySelector('#modal-root > div');
    if (modal) {
        modal.querySelector('.animate-scale-in')?.classList.replace('animate-scale-in', 'animate-scale-out');
        setTimeout(() => modal.remove(), 200);
    }
}

// Loading state helper
function showLoading(container, message = 'Đang tải...') {
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-12">
            <div class="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gray-500">${message}</p>
        </div>
    `;
}

function showEmptyState(container, icon, title, message, action = null) {
    container.innerHTML = `
        <div class="text-center py-12 fade-in">
            <i class="fas ${icon} text-5xl text-gray-300 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">${title}</h3>
            <p class="text-gray-500 mb-6">${message}</p>
            ${action ? `<a href="${action.href}" class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors" data-link>${action.label}</a>` : ''}
        </div>
    `;
}

// Format helpers
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

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
    return `${Math.floor(diffDays / 365)} năm trước`;
}

function getJobTypeLabel(type) {
    const labels = {
        'FullTime': 'Toàn thời gian',
        'PartTime': 'Bán thời gian',
        'Contract': 'Hợp đồng',
        'Internship': 'Thực tập',
        'Freelance': 'Freelance',
        'Remote': 'Từ xa'
    };
    return labels[type] || type;
}

function getExperienceLevelLabel(level) {
    const labels = {
        'Fresher': 'Mới tốt nghiệp',
        'Junior': 'Junior (1-3 năm)',
        'Mid': 'Mid-level (3-5 năm)',
        'Senior': 'Senior (5+ năm)',
        'Lead': 'Team Lead',
        'Manager': 'Quản lý',
        'Director': 'Giám đốc'
    };
    return labels[level] || level;
}

function getSalaryTypeLabel(type) {
    const labels = {
        'Monthly': '/tháng',
        'Yearly': '/năm',
        'Hourly': '/giờ',
        'Daily': '/ngày'
    };
    return labels[type] || '';
}

function getApplicationStatusLabel(status) {
    const labels = {
        'Pending': 'Chờ duyệt',
        'UnderReview': 'Đang xem xét',
        'Shortlisted': 'Đã lọc',
        'InterviewScheduled': 'Đã lên lịch PV',
        'Interviewed': 'Đã phỏng vấn',
        'Offered': 'Đã đề nghị',
        'Accepted': 'Đã chấp nhận',
        'Rejected': 'Đã từ chối',
        'Withdrawn': 'Đã rút đơn'
    };
    return labels[status] || status;
}

function getApplicationStatusColor(status) {
    const colors = {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'UnderReview': 'bg-blue-100 text-blue-800',
        'Shortlisted': 'bg-purple-100 text-purple-800',
        'InterviewScheduled': 'bg-indigo-100 text-indigo-800',
        'Interviewed': 'bg-teal-100 text-teal-800',
        'Offered': 'bg-green-100 text-green-800',
        'Accepted': 'bg-emerald-100 text-emerald-800',
        'Rejected': 'bg-red-100 text-red-800',
        'Withdrawn': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

// Debounce helper
function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

// Copy to clipboard
async function copyToClipboard(text, successMsg = 'Đã sao chép!') {
    try {
        await navigator.clipboard.writeText(text);
        showToast(successMsg, 'success');
    } catch (e) {
        showToast('Không thể sao chép', 'error');
    }
}

// Setup all routes
function setupRoutes() {
    // Public routes
    router.add('/', () => loadPage('home'));
    router.add('/jobs', () => loadPage('jobs-list'));
    router.add('/jobs/:id', (params) => loadPage('job-detail', params.id));
    router.add('/companies', () => loadPage('companies-list'));
    router.add('/companies/:id', (params) => loadPage('company-detail', params.id));
    router.add('/login', () => loadPage('login'));
    router.add('/register', () => loadPage('register'));
    router.add('/forgot-password', () => loadPage('forgot-password'));
    
    // Protected routes (require auth)
    router.add('/profile', () => requireAuth(() => loadPage('profile')));
    router.add('/applications', () => requireAuth(() => loadPage('my-applications')));
    router.add('/saved-jobs', () => requireAuth(() => loadPage('saved-jobs')));
    router.add('/resumes', () => requireAuth(() => loadPage('my-resumes')));
    router.add('/resumes/create', () => requireAuth(() => loadPage('resume-form')));
    router.add('/resumes/:id/edit', (params) => requireAuth(() => loadPage('resume-form', params.id)));
    
    // Employer routes
    router.add('/employer/dashboard', () => requireRole(['Employer', 'Admin'], () => loadPage('employer-dashboard')));
    router.add('/employer/jobs', () => requireRole(['Employer', 'Admin'], () => loadPage('employer-jobs')));
    router.add('/employer/jobs/create', () => requireRole(['Employer', 'Admin'], () => loadPage('employer-job-form')));
    router.add('/employer/jobs/:id/edit', (params) => requireRole(['Employer', 'Admin'], () => loadPage('employer-job-form', params.id)));
    router.add('/employer/applications', () => requireRole(['Employer', 'Admin'], () => loadPage('employer-applications')));
    router.add('/employer/company', () => requireRole(['Employer', 'Admin'], () => loadPage('employer-company')));
    
    // Admin routes
    router.add('/admin/dashboard', () => requireRole(['Admin'], () => loadPage('admin-dashboard')));
    router.add('/admin/users', () => requireRole(['Admin'], () => loadPage('admin-users')));
    router.add('/admin/companies', () => requireRole(['Admin'], () => loadPage('admin-companies')));
    router.add('/admin/jobs', () => requireRole(['Admin'], () => loadPage('admin-jobs')));
    router.add('/admin/categories', () => requireRole(['Admin'], () => loadPage('admin-categories')));
    
    // 404 fallback
    router.add('*', () => router.render404());
}

// Auth middleware
function requireAuth(callback) {
    if (!auth.isAuthenticated) {
        showToast('Vui lòng đăng nhập để tiếp tục', 'warning');
        router.navigate('/login');
        return;
    }
    callback();
}

function requireRole(roles, callback) {
    if (!auth.isAuthenticated) {
        showToast('Vui lòng đăng nhập để tiếp tục', 'warning');
        router.navigate('/login');
        return;
    }
    if (!auth.hasRole(...roles)) {
        showToast('Bạn không có quyền truy cập trang này', 'error');
        router.navigate('/');
        return;
    }
    callback();
}

// Dynamic page loader
async function loadPage(pageName, param = null) {
    const app = document.getElementById('app');
    showLoading(app);
    
    try {
        // Import page module dynamically
        const module = await import(`./pages/${pageName}.js`);
        if (module.default) {
            await module.default(app, param);
        } else if (module.render) {
            await module.render(app, param);
        }
    } catch (error) {
        console.error(`Failed to load page ${pageName}:`, error);
        // Fallback to inline rendering
        await renderPageInline(pageName, app, param);
    }
    
    // Re-attach link handlers
    document.querySelectorAll('a[data-link]').forEach(link => {
        link.onclick = (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                router.navigate(href.slice(1));
            }
        };
    });
}

// Inline page rendering (fallback)
async function renderPageInline(pageName, container, param) {
    const pages = {
        'home': renderHomePage,
        'jobs-list': renderJobsListPage,
        'job-detail': renderJobDetailPage,
        'companies-list': renderCompaniesListPage,
        'company-detail': renderCompanyDetailPage,
        'login': renderLoginPage,
        'register': renderRegisterPage,
        'forgot-password': renderForgotPasswordPage,
        'profile': renderProfilePage,
        'my-applications': renderMyApplicationsPage,
        'saved-jobs': renderSavedJobsPage,
        'my-resumes': renderMyResumesPage,
        'resume-form': renderResumeFormPage,
        'employer-dashboard': renderEmployerDashboardPage,
        'employer-jobs': renderEmployerJobsPage,
        'employer-job-form': renderEmployerJobFormPage,
        'employer-applications': renderEmployerApplicationsPage,
        'employer-company': renderEmployerCompanyPage,
        'admin-dashboard': renderAdminDashboardPage,
        'admin-users': renderAdminUsersPage,
        'admin-companies': renderAdminCompaniesPage,
        'admin-jobs': renderAdminJobsPage,
        'admin-categories': renderAdminCategoriesPage,
    };
    
    const renderer = pages[pageName];
    if (renderer) {
        await renderer(container, param);
    } else {
        router.render404();
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideRight {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    @keyframes scaleOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.95); }
    }
    .animate-slide-right { animation: slideRight 0.3s ease-out; }
    .animate-scale-in { animation: scaleIn 0.2s ease-out; }
    .animate-scale-out { animation: scaleOut 0.2s ease-in; }
`;
document.head.appendChild(style);
