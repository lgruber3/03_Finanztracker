import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Navbar from './components/navbar';
import CalendarScheduler from './components/calenderScheduler';
import Budget from './components/Budget';
import StartScreen from './components/start';
import Currency from "@/app/components/Currency";
import NotificationPage from './components/NotficationsPage';
import income from './components/income';
import InvoiceScanner from "./components/InvoiceScanner";
import withBottomNav from "@/app/components/withBottomNav";

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
    return (
        // @ts-ignore
        <Drawer.Navigator
            drawerContent={(props) => <Navbar {...props} />}
            screenOptions={{ headerShown: false, drawerType: 'front', drawerStyle: { width: '80%' } }}
        >
            <Drawer.Screen name="Start" component={withBottomNav(StartScreen)} />
            <Drawer.Screen name="CalendarScheduler" component={withBottomNav(CalendarScheduler)} />
            <Drawer.Screen name="Budget" component={withBottomNav(Budget)} />
            <Drawer.Screen name="Currency" component={withBottomNav(Currency)} />
            <Drawer.Screen name="NotificationPage" component={withBottomNav(NotificationPage)} />
            <Drawer.Screen name="income" component={withBottomNav(income)} />
            <Drawer.Screen name="InvoiceScanner" component={withBottomNav(InvoiceScanner)} />
        </Drawer.Navigator>
    );
}
