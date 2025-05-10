import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppContext } from './appContext';
import AuthStack from './authStack';
import ChooseMode from './components/ChooseMode';
import SetCash from './components/SetCash';
import AppDrawer from './appDrawer';
import LoadingAnimation from './components/LoadingAnimation';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { isLoggedIn, hasChosenMode, hasSetupCash, isLoading } = useAppContext();

    if (isLoading) {
        return <LoadingAnimation />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isLoggedIn ? (
                <Stack.Screen name="Auth" component={AuthStack} />
            ) : !hasChosenMode ? (
                <Stack.Screen name="ChooseMode" component={ChooseMode} />
            ) : !hasSetupCash ? (
                <Stack.Screen name="SetCash" component={SetCash} />
            ) : (
                <Stack.Screen name="AppDrawer" component={AppDrawer} />
            )}
        </Stack.Navigator>
    );
}
