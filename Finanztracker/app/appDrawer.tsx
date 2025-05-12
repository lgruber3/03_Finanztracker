import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Navbar from './components/navbar';
import CalendarScheduler from './components/calenderScheduler';
import Budget from './components/Budget';
import StartScreen from './components/start';
import Currency from "@/app/components/Currency";
import NotificationPage from './components/NotficationsPage';
import InvoiceScanner from "./components/InvoiceScanner";

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <Navbar {...props} />}
            screenOptions={{ headerShown: false, drawerType: 'front', drawerStyle: { width: '80%' } }}
        >
            <Drawer.Screen name="Start" component={StartScreen} />
            <Drawer.Screen name="CalendarScheduler" component={CalendarScheduler} />
            <Drawer.Screen name="Budget" component={Budget} />
            <Drawer.Screen name="Currency" component={Currency} />
            <Drawer.Screen name="NotificationPage" component={NotificationPage} />
            <Drawer.Screen name="InvoiceScanner" component={InvoiceScanner} />
        </Drawer.Navigator>
    );
}
