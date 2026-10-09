// API Client - Wrapper cho fetch với JWT authentication
class ApiClient {
    constructor() {
        this.baseURL = '/api';
        this.token = localStorage.getItem('access_token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('access_token', token);
        } else {
            localStorage.removeItem('access_token');
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options,
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            
            // Handle 401 - token expired
            if (response.status === 401) {
                auth.logout();
                router.navigate('/login');
                return { error: 'Unauthorized' };
            }

            const data = await response.json().catch(() => ({}));
            
            if (!response.ok) {
                return { error: data.message || data.title || `HTTP ${response.status}`, status: response.status, details: data };
            }

            return { data };
        } catch (error) {
            console.error('API Error:', error);
            return { error: 'Network error. Please check your connection.' };
        }
    }

    // HTTP Methods
    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    post(endpoint, body) {
        return this.request(endpoint, { method: 'POST', body });
    }

    put(endpoint, body) {
        return this.request(endpoint, { method: 'PUT', body });
    }

    patch(endpoint, body) {
        return this.request(endpoint, { method: 'PATCH', body });
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Auth endpoints
    async login(email, password) {
        const result = await this.post('/auth/login', { email, password });
        if (result.data?.token) {
            this.setToken(result.data.token);
            auth.setUser(result.data.user);
        }
        return result;
    }

    async register(userData) {
        const result = await this.post('/auth/register', userData);
        if (result.data?.token) {
            this.setToken(result.data.token);
            auth.setUser(result.data.user);
        }
        return result;
    }

    async getProfile() {
        return this.get('/auth/profile');
    }

    async refreshToken() {
        const result = await this.post('/auth/refresh');
        if (result.data?.token) {
            this.setToken(result.data.token);
        }
        return result;
    }

    // Jobs endpoints
    getJobs(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.get(`/jobs${query ? `?${query}` : ''}`);
    }

    getJob(id) {
        return this.get(`/jobs/${id}`);
    }

    createJob(data) {
        return this.post('/jobs', data);
    }

    updateJob(id, data) {
        return this.put(`/jobs/${id}`, data);
    }

    deleteJob(id) {
        return this.delete(`/jobs/${id}`);
    }

    // Companies endpoints
    getCompanies(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.get(`/companies${query ? `?${query}` : ''}`);
    }

    getCompany(id) {
        return this.get(`/companies/${id}`);
    }

    createCompany(data) {
        return this.post('/companies', data);
    }

    updateCompany(id, data) {
        return this.put(`/companies/${id}`, data);
    }

    // Categories endpoints
    getCategories() {
        return this.get('/categories');
    }

    // Applications endpoints
    getApplications(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.get(`/applications${query ? `?${query}` : ''}`);
    }

    applyJob(jobId, data) {
        return this.post(`/jobs/${jobId}/apply`, data);
    }

    updateApplicationStatus(id, status, data = {}) {
        return this.put(`/applications/${id}/status`, { status, ...data });
    }

    // Resume endpoints
    getResumes() {
        return this.get('/resumes');
    }

    getResume(id) {
        return this.get(`/resumes/${id}`);
    }

    createResume(data) {
        return this.post('/resumes', data);
    }

    updateResume(id, data) {
        return this.put(`/resumes/${id}`, data);
    }

    // User endpoints
    getUsers(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.get(`/users${query ? `?${query}` : ''}`);
    }

    getUser(id) {
        return this.get(`/users/${id}`);
    }

    updateUser(id, data) {
        return this.put(`/users/${id}`, data);
    }
}

// Global instance
const api = new ApiClient();
