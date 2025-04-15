import axios from 'axios';
import BASE_URL from './base_url';

// Create an Axios instance with the base URL
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(//Interceptors are a feature of axios, allow us to intercept and modify HTTP requests 
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;/* bearer insterted here firstly by help of interseptor (adds heaader bearer)*/
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

export const postRequest = async (url, data) => {
    try {
        const response = await api.post(url, data);
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