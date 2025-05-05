import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/login';
import Register from './components/register';
import ChooseMode from './components/ChooseMode';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ChooseMode" component={ChooseMode} />
        </Stack.Navigator>
    );
}
