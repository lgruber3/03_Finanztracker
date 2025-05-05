import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./components/login";
import Register from "./components/register";
import AppDrawer from "@/app/appDrawer";
import ChooseMode from "./components/ChooseMode";
import SetCash from "@/app/components/SetCash";

const Stack = createNativeStackNavigator();

export default function Index() {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ChooseMode" component={ChooseMode} />
            <Stack.Screen name="SetCash" component={SetCash} />
            <Stack.Screen name="MainApp" component={AppDrawer} />
        </Stack.Navigator>
    );
}