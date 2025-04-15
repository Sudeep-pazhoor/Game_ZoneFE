import React, { createContext, useState, useEffect } from 'react';
import { getAllGames } from '../services/allApi';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [games, setGames] = useState([]);

    const fetchGames = async () => {
        try {
            const data = await getAllGames();
            setGames(data);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    return (
        <GameContext.Provider value={{ games, fetchGames }}>
            {children}
        </GameContext.Provider>
    );
};