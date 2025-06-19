import axios from 'axios';
import cookie from 'js-cookie';

const API_REQUEST = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
});

API_REQUEST.interceptors.request.use(
    async (config) => {
        const accessToken = cookie.get('access_token');
        const language = 'en'
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        config.headers['Accept-Language'] = language;
        return config;
    },
    (error) => Promise.reject(error)
);


API_REQUEST.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = cookie.get('refresh_token');
            if(refreshToken) {
                try {
                    const { data } = await API_REQUEST.get('/auth/refresh-token', { headers: { Authorization: `Bearer ${refreshToken}` } });
                    cookie.set('access_token', data.access_token, { expires: 1 });
                    cookie.set('refresh_token', data.refresh_token, { expires: 2 });
                    API_REQUEST.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
                    return API_REQUEST(originalRequest);
                } catch (refreshError) {
                    await fetch('/login/api', {
                        method: 'DELETE'
                    })
                    window.location.href = '/login';
                }
            } else {
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);
export default API_REQUEST;