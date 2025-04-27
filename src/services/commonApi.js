import axios from 'axios';
import BASE_URL from './base_url';

// Create an Axios instance with the base URL
const api = axios.create({
    baseURL: BASE_URL,
});

// Interceptor to add token and handle headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Only set Content-Type to JSON if data is not FormData
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Common API functions
export const getRequest = async (url) => {
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('GET Request Error:', error);
        throw error;
    }
};

export const postRequest = async (url, data, headers = {}) => {
    try {
        const response = await api.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error('POST Request Error:', error);
        throw error;
    }
};

export const putRequest = async (url, data) => {
    try {
        const response = await api.put(url, data);
        return response.data;
    } catch (error) {
        console.error('PUT Request Error:', error);
        throw error;
    }
};

export const deleteRequest = async (url) => {
    try {
        const response = await api.delete(url);
        return response.data;
    } catch (error) {
        console.error('DELETE Request Error:', error);
        throw error;
    }
};

export default api;