import { getRequest, postRequest, putRequest, deleteRequest } from './commonApi';

export const registerUser = (userData) => postRequest('/api/auth/register', userData);
export const loginUser = (userData) => postRequest('/api/auth/login', userData);
export const loginAdmin = (adminData) => postRequest('/api/auth/admin/login', adminData);

export const getAllGames = () => getRequest('/api/games');
export const addGame = (gameData) => postRequest('/api/games', gameData);
export const editGame = (id, gameData) => putRequest(`/api/games/${id}`, gameData);
export const deleteGame = (id) => deleteRequest(`/api/games/${id}`);

export const getPaidGames = () => getRequest('/api/user/paid-games');
export const payForGame = (gameData) => {
    const token = localStorage.getItem('token');
    return postRequest('/api/user/pay', gameData, token ? { Authorization: `Bearer ${token}` } : {});
};
export const verifyPayment = (paymentData) => postRequest('/api/user/verify-payment', paymentData);
export const getPurchaseHistory = () => getRequest('/api/user/purchase-history');
export const removePurchase = (purchaseData) => {
    const token = localStorage.getItem('token');
    return postRequest('/api/user/remove-purchase', purchaseData, token ? { Authorization: `Bearer ${token}` } : {});
};