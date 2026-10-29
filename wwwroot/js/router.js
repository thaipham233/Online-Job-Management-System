// SPA Router - Hash-based router for Single Page Application
// Routes:
//   #/            -> Home (jobs listing)
//   #/login       -> Login
//   #/admin       -> Admin Dashboard (requires Admin role)
//   #/employer    -> Employer Dashboard (requires Employer role)
//   #/profile     -> Profile (requires any authenticated user)
//   #/register    -> Registration
class Router {
    constructor() {
        this.routes = new Map();
        this.beforeHooks = [];
        this.notFound = null;
        window.addEventListener('hashchange', () => this.handleRouteChange());
        window.addEventListener('load', () => this.handleRouteChange());
        this.currentPath = window.location.hash.slice(1) || '/';
    }

    // Register a route
    route(path, view) {
        this.routes.set(path, view);
    }

    // Register a before hook (called on every navigation)
    before(hook) {
        this.beforeHooks.push(hook);
    }

    // Set 404 page
    notFound(view) {
        this.notFound = view;
    }

    // Navigate to a path (updates the hash URL)
    navigate(path) {
        if (window.location.hash === '#' + path) return;
        window.location.hash = path;
    }

    // Handle route change (auth check, before hooks)
    async handleRouteChange() {
        const path = this.getCurrentPath();
        this.currentPath = path;
        window.scrollTo(0, 0);

        // Run before hooks
        for (const hook of this.beforeHooks) {
            const result = await hook(path);
            if (result === false) return;
        }

        const view = this.routes.get(path) || this.notFound;
        if (view) {
            const app = document.getElementById('app');
            if (app) {
                app.innerHTML = '';
                const viewInstance = new view();
                const html = await viewInstance.render();
                app.innerHTML = html;
                this.afterRender(path);
            }
        }
    }

    // Get current path
    getCurrentPath() {
        return this.currentPath || window.location.hash.slice(1) || '/';
    }

    // Hook called after rendering
    afterRender(path) {
        switch (path) {
            case '/':
                if (typeof JobHubHomeView !== 'undefined') {
                    setTimeout(() => new JobHubHomeView().loadJobs(), 100);
                }
                break;
            case '/login':
                if (typeof JobHubLoginView !== 'undefined') {
                    setTimeout(() => new JobHubLoginView().init(), 100);
                }
                break;
            case '/register':
                if (typeof JobHubRegisterView !== 'undefined') {
                    setTimeout(() => new JobHubRegisterView().init(), 100);
                }
                break;
            case '/admin':
                if (typeof JobHubAdminView !== 'undefined') {
                    setTimeout(() => new JobHubAdminView().init(), 100);
                }
                break;
            case '/employer':
                if (typeof JobHubEmployerDashboardView !== 'undefined') {
                    setTimeout(() => new JobHubEmployerDashboardView().init(), 100);
                }
                break;
            case '/profile':
                if (typeof JobHubProfileView !== 'undefined') {
                    setTimeout(() => new JobHubProfileView().init(), 100);
                }
                break;
        }
    }
}

// Global router instance
const router = new Router();
