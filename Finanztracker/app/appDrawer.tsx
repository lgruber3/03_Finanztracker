import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Navbar from './components/navbar';
import CalendarScheduler from './components/calenderScheduler';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <Navbar {...props} />}
            screenOptions={{ headerShown: false, drawerType: 'front', drawerStyle: { width: '80%' }} }
        >
            <Drawer.Screen name="CalendarScheduler" component={CalendarScheduler} />
        </Drawer.Navigator>
    );
}
