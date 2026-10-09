// Router - Simple hash-based SPA router
class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.beforeHooks = [];
        this.afterHooks = [];
        
        window.addEventListener('hashchange', () => this.handleRouteChange());
        window.addEventListener('load', () => this.handleRouteChange());
    }

    // Register a route
    add(path, handler) {
        // Convert path to regex
        const regexPath = path
            .replace(/:(\w+)/g, '(?<$1>[^/]+)')
            .replace(/\*/g, '.*');
        const regex = new RegExp(`^${regexPath}$`);
        this.routes.set(path, { regex, handler, path });
        return this;
    }

    // Add middleware
    before(hook) {
        this.beforeHooks.push(hook);
    }

    after(hook) {
        this.afterHooks.push(hook);
    }

    // Navigate to a path
    navigate(path) {
        window.location.hash = path;
    }

    // Get current path
    getCurrentPath() {
        return window.location.hash.slice(1) || '/';
    }

    // Handle route change
    async handleRouteChange() {
        const path = this.getCurrentPath();
        
        // Run before hooks
        for (const hook of this.beforeHooks) {
            const result = await hook(path);
            if (result === false) return; // Cancel navigation
        }

        // Find matching route
        let matchedRoute = null;
        let params = {};

        for (const [routePath, route] of this.routes) {
            const match = path.match(route.regex);
            if (match) {
                matchedRoute = route;
                params = match.groups || {};
                break;
            }
        }

        // Default to 404
        if (!matchedRoute) {
            matchedRoute = this.routes.get('*') || { handler: () => this.render404() };
        }

        this.currentRoute = { path, params, route: matchedRoute };

        try {
            // Render the route
            await matchedRoute.handler(params, path);
            
            // Run after hooks
            for (const hook of this.afterHooks) {
                await hook(path);
            }
            
            // Scroll to top
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Route error:', error);
            this.renderError(error);
        }
    }

    // Get route params
    getParams() {
        return this.currentRoute?.params || {};
    }

    // Render 404
    render404() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="min-h-[60vh] flex items-center justify-center">
                <div class="text-center fade-in">
                    <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Trang không tồn tại</h1>
                    <p class="text-gray-500 mb-6">Không tìm thấy trang bạn đang tìm kiếm.</p>
                    <a href="#/" class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors" data-link>
                        <i class="fas fa-home mr-2"></i>Về trang chủ
                    </a>
                </div>
            </div>
        `;
    }

    // Render error
    renderError(error) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="min-h-[60vh] flex items-center justify-center">
                <div class="text-center fade-in">
                    <i class="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Đã có lỗi xảy ra</h1>
                    <p class="text-gray-500 mb-6">${error.message || 'Không thể tải trang'}</p>
                    <a href="#/" class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors" data-link>
                        <i class="fas fa-home mr-2"></i>Về trang chủ
                    </a>
                </div>
            </div>
        `;
    }

    // Helper to get query params
    getQueryParams() {
        const hash = window.location.hash;
        const queryIndex = hash.indexOf('?');
        if (queryIndex === -1) return {};
        
        const queryString = hash.slice(queryIndex + 1);
        const params = new URLSearchParams(queryString);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }
}

// Global instance
const router = new Router();
