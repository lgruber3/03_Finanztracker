import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: (value) => {},
    hasSetupCash: false,
    setHasSetupCash: (value) => {},
    hasChosenMode: false,
    setHasChosenMode: (value) => {}
});

export function AppProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasSetupCash, setHasSetupCash] = useState(false);
    const [hasChosenMode, setHasChosenMode] = useState(false);

    return (
        <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, hasSetupCash, setHasSetupCash, hasChosenMode, setHasChosenMode }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
