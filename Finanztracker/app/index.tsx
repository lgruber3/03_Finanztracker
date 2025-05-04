import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./components/login";
import Register from "./components/register";
import CalendarScheduler from "@/app/components/calenderScheduler";

const Stack = createNativeStackNavigator();

export default function Index() {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="CalendarScheduler" component={CalendarScheduler} />
        </Stack.Navigator>
    );
}