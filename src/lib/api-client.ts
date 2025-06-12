import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8001',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor for authentication
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors here
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/auth/signin';
        }
        return Promise.reject(error);
    }
);

export default apiClient; 