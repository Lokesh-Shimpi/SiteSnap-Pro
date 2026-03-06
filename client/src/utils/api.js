import axios from 'axios';

const resolveBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // In production, prefer same-origin instead of localhost fallback.
    if (import.meta.env.PROD && typeof window !== 'undefined') {
        return window.location.origin;
    }

    return 'http://localhost:3000';
};

const api = axios.create({
    baseURL: resolveBaseUrl(),
});
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
export default api;
