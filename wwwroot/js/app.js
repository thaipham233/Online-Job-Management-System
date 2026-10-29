// SPA App - Shared initialization for Single Page Application
// In SPA, a single HTML page (index.html) is the shell; all "pages" are
// rendered dynamically by JS views based on hash routes. Shared JS handles
// navbar, modal, toast, and guards - no dynamic routing.
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initUserDropdown();
    initDropdowns();
    initModal();
    initToast();
    // Apply route guards after DOM is ready
    applyRouteGuards();
    // Handle initial hash route
    if (window.location.hash) {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
        router.handleRouteChange();
    }
});

async function applyRouteGuards() {
    // Check if user is trying to access role-protected routes
    const path = window.location.hash.slice(1) || '/';
    if (path === '/admin' && !auth.isAdmin()) {
        showToast('Bạn không có quyền truy cập trang này', 'error');
        router.navigate('/');
        return false;
    }
    if (path === '/employer' && !auth.isEmployer()) {
        showToast('Bạn không có quyền truy cập trang này', 'error');
        router.navigate('/');
        return false;
    }
    if (path === '/profile' && !auth.isAuthenticated()) {
        showToast('Vui lòng đăng nhập để xem hồ sơ', 'error');
        router.navigate('/login');
        return false;
    }
    // Allow navigation
    return true;
}

function initNavbar() {
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

function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
}

function initUserDropdown() {
    const btn = document.getElementById('user-btn');
    const dropdown = document.getElementById('user-dropdown');
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

    document.addEventListener('click', (e) => {
        if (dropdown && !dropdown.contains(e.target) && e.target !== btn) {
            dropdown.classList.add('opacity-0', 'invisible', 'translate-y-2');
            dropdown.classList.remove('opacity-100', 'visible', 'translate-y-0');
        }
    });

    [logoutBtn, mobileLogoutBtn].forEach(el => {
        if (el) {
            el.addEventListener('click', () => auth.logout());
        }
    });
}

function initDropdowns() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const toggle = dropdown.querySelector('[data-dropdown-toggle]');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const target = document.getElementById(toggle.dataset.dropdownToggle);
                if (target) {
                    target.classList.toggle('hidden');
                }
            });
        }
    });
}

function initModal() {
    const modal = document.getElementById('modal-root');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

function initToast() {
    const container = document.getElementById('toast-container');
    if (!container) return;
    window.showToast = showToast;
}

function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type + ' flex items-center gap-sm px-md py-sm rounded-xl shadow-lg transition-all';
    toast.style.display = 'none';

    let icon = '';
    if (type === 'success') icon = 'fas fa-check-circle';
    else if (type === 'error') icon = 'fas fa-exclamation-circle';
    else if (type === 'warning') icon = 'fas fa-exclamation-triangle';
    else icon = 'fas fa-info-circle';

    toast.innerHTML = '<i class="' + icon + ' text-sm"></i><span class="text-sm font-medium">' + message + '</span>';
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.display = 'flex';
        toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) container.removeChild(toast);
        }, 300);
    }, duration);
}

function formatSalary(min, max, type) {
    if (!min && !max) return 'Thương lượng';
    const format = (num) => {
        if (num >= 1e9) return (num / 1e9).toFixed(1).replace('.0', '') + ' tỷ';
        if (num >= 1e6) return (num / 1e6).toFixed(1).replace('.0', '') + ' triệu';
        return num.toLocaleString('vi-VN');
    };
    if (min && max) return format(min) + ' - ' + format(max) + '/' + (type === 'Monthly' ? 'tháng' : 'năm');
    if (min) return 'Từ ' + format(min) + '/' + (type === 'Monthly' ? 'tháng' : 'năm');
    return 'Đến ' + format(max) + '/' + (type === 'Monthly' ? 'tháng' : 'năm');
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
    if (diffDays < 7) return diffDays + ' ngày trước';
    if (diffDays < 30) return Math.floor(diffDays / 7) + ' tuần trước';
    if (diffDays < 365) return Math.floor(diffDays / 30) + ' tháng trước';
    return Math.floor(diffDays / 365) + ' năm trước';
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

async function copyToClipboard(text, successMsg) {
    try {
        await navigator.clipboard.writeText(text);
        showToast(successMsg, 'success');
    } catch (e) {
        showToast('Không thể sao chép', 'error');
    }
}

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
