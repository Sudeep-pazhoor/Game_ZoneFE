import { getRequest, postRequest, putRequest, deleteRequest } from './commonApi';
import BASE_URL from './base_url';
import axios from 'axios';

export const registerUser = (userData) => postRequest(`${BASE_URL}/auth/register`, userData);
export const loginUser = (userData) => postRequest(`${BASE_URL}/auth/login`, userData);
export const loginAdmin = (adminData) => postRequest(`${BASE_URL}/auth/admin/login`, adminData);

export const getAllGames = () => getRequest(`${BASE_URL}/games`);
export const addGame = (gameData) => postRequest(`${BASE_URL}/games`, gameData);
export const editGame = (id, gameData) => putRequest(`${BASE_URL}/games/${id}`, gameData);
export const deleteGame = (id) => deleteRequest(`${BASE_URL}/games/${id}`);

export const getPaidGames = () => getRequest(`${BASE_URL}/user/paid-games`);
export const payForGame = (gameData) => {
    const token = localStorage.getItem('token');
    return postRequest(`${BASE_URL}/user/pay`, gameData, token ? { Authorization: `Bearer ${token}` } : {});
};
export const getPurchaseHistory = () => getRequest(`${BASE_URL}/user/purchase-history`);
export const removePurchase = (purchaseData) => {
    const token = localStorage.getItem('token');
    return postRequest(`${BASE_URL}/user/remove-purchase`, purchaseData, token ? { Authorization: `Bearer ${token}` } : {});
};

export const getUserProfile = () => getRequest(`${BASE_URL}/user/profile`);
export const uploadProfileImage = async (formData) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    console.log('Uploading to:', `${BASE_URL}/user/upload-profile-image`);
    try {
        const response = await axios.post(`${BASE_URL}/user/upload-profile-image`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Upload Profile Image Error:', error);
        throw error;
    }
};

export const deleteProfileImage = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    return deleteRequest(`${BASE_URL}/user/delete-profile-image`);
};