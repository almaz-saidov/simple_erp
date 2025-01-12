import React, { createContext, useState } from 'react';

export const MarketContext = createContext();

export const MarketProvider = ({ children }) => {
    const [value, setValue] = useState({});

    return (
        <MarketContext.Provider value={{ value, setValue }}>
            {children}
        </MarketContext.Provider>
    );
};

