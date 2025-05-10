import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppContext } from '../appContext';

// @ts-ignore
const Navbar = ({navigation}) => {
    const [username, setUsername] = React.useState("Anonymus");
    const { setIsLoggedIn } = useAppContext();

    const getUserName = async () => {
        try {
            const user = await AsyncStorage.getItem('user');
            if (user !== null) {
                const parsedUser = JSON.parse(user);
                setUsername(parsedUser.firstName + " " + parsedUser.lastName);
            }
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('user');
        setUsername("Anonymus");
        setIsLoggedIn(false);
    };

    React.useEffect(() => {
        getUserName();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/100' }}
                    style={styles.profileImage}
                />
                <Text style={styles.profileName}>{username}</Text>
                <Text style={styles.profileSubtitle}>Me</Text>
            </View>

            <ScrollView style={styles.menuSection}>
                {/*
                <MenuItem icon={<Ionicons name="time-outline" size={24} color="black" />} label="History" />
                <MenuItem icon={<Ionicons name="stats-chart" size={24} color="black" />} label="Statistics" />
                <MenuItem icon={<FontAwesome5 name="money-bill-wave" size={24} color="black" />} label="Budgets" />
                <MenuItem icon={<FontAwesome5 name="bullseye" size={24} color="black" />} label="Goals & Savings" />
                <MenuItem icon={<Entypo name="export" size={24} color="black" />} label="Export Data" />
                <MenuItem icon={<MaterialIcons name="security" size={24} color="black" />} label="Security & Privacy" />
                <MenuItem icon={<Entypo name="help-with-circle" size={24} color="black" />} label="Help & Support" />
                <MenuItem icon={<Ionicons name="information-circle-outline" size={24} color="black" />} label="About & Legal" />
                */}
                <MenuItem icon={<Ionicons name="home-outline" size={24} color="black" />} label="Start" onPress={() => navigation.navigate("Start")}/>
                <MenuItem icon={<Ionicons name="calendar-outline" size={24} color="black" />} label="Kalender" onPress={() => navigation.navigate("CalendarScheduler")}/>
                <MenuItem icon={<Ionicons name="card-outline" size={24} color="black" />} label="Budget" onPress={() => navigation.navigate("Budget")}/>
                <MenuItem icon={<Ionicons name="cash-outline" size={24} color="black" />} label="Currency" onPress={() => navigation.navigate("Currency")}/>
                <MenuItem icon={<Ionicons name="cash-outline" size={24} color="black" />} label="Notifcations" onPress={() => navigation.navigate("NotificationPage")}/>
            </ScrollView>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Ionicons name="log-out-outline" size={24} color="black" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const MenuItem = ({ icon, label, onPress }: { icon: React.ReactNode, label: string, onPress?: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        {icon}
        <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    profileSection: {
        backgroundColor: '#00ff88', // Dein hellgrüner Header
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ccc', // Platzhalter-Hintergrund
    },
    profileName: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    profileSubtitle: {
        fontSize: 14,
        color: '#555',
    },
    menuSection: {
        flex: 1,
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuLabel: {
        marginLeft: 15,
        fontSize: 16,
        color: '#000',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    logoutText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#000',
    },
});

export default Navbar;
