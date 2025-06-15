import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorBoundary from "react-native-error-boundary";
import {TouchableOpacity, View} from "react-native";

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

    const ErrorFallback = ({ error, resetErrorBoundary }) => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'red', fontSize: 18 }}>Something went wrong:</Text>
                <Text style={{ color: 'red', fontSize: 16 }}>{error.message}</Text>
                <TouchableOpacity onPress={resetErrorBoundary} style={{ marginTop: 20 }}>
                    <Text style={{ color: 'blue' }}>Try again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ErrorBoundary onError={(error, resetErrorBoundary) => {
            console.error('ErrorBoundary caught an error:', error);
        } } FallbackComponent={ErrorFallback}>
            <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, hasSetupCash, setHasSetupCash, hasChosenMode, setHasChosenMode, isLoading, loadUser }}>
                {children}
            </AppContext.Provider>
        </ErrorBoundary>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
