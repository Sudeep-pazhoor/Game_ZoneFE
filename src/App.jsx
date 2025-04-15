import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import PurchaseHistory from './pages/PurchaseHistory';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/auth" />;
};

function App() {
    return (
        <Router>
            <GameProvider>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                    <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
                    <Route path="/purchase-history" element={<PrivateRoute><PurchaseHistory /></PrivateRoute>} />
                </Routes>
            </GameProvider>
        </Router>
    );
}

export default App;