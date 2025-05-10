import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: (value) => {},
    hasSetupCash: false,
    setHasSetupCash: (value) => {},
    hasChosenMode: false,
    setHasChosenMode: (value) => {},
    isLoading: true,
    loadUser: () => {},
});

export function AppProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasSetupCash, setHasSetupCash] = useState(false);
    const [hasChosenMode, setHasChosenMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadUser = async () => {
        try {
            let userJSONString = await AsyncStorage.getItem('user');
            // @ts-ignore
            const user = JSON.parse(userJSONString);
            if (user) {
                setIsLoggedIn(true);

                if (user.hasSetupCompleted) {
                    setHasSetupCash(true);
                    setHasChosenMode(true);
                } else {
                    setHasSetupCash(false);
                    setHasChosenMode(false);
                }
            }
        } catch (error) {
            console.error('Error loading token:', error);
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        loadUser();
    }, []);

    return (
        <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, hasSetupCash, setHasSetupCash, hasChosenMode, setHasChosenMode, isLoading, loadUser }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
