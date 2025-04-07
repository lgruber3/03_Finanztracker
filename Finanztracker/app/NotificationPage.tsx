import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Switch, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

function NotificationsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="NotificationsMain" component={NotificationsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

function NotificationsScreen({ navigation }) {
    const [notifications, setNotifications] = useState([
        { id: "1", icon: "wallet-outline", text: "Welcome to our Finance Tracker A..", date: "10.03.2025" },
        { id: "2", icon: "cash-outline", text: "Reminder: Your Netflix subscript..", date: "14.04.2025" },
        { id: "3", icon: "alert-circle-outline", text: "Large expense detected!", date: "03.05.2025" },
        { id: "4", icon: "calendar-outline", text: "Budget update: You're at 75%!", date: "03.05.2025" }
    ]);

    const [newNotification, setNewNotification] = useState("");

    const addNotification = () => {
        if (newNotification.trim() === "") return;
        const newEntry = {
            id: Math.random().toString(),
            icon: "notifications-outline",
            text: newNotification,
            date: new Date().toLocaleDateString()
        };
        setNotifications([newEntry, ...notifications]);
        setNewNotification("");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Notifications</Text>
                <TouchableOpacity onPress={() => navigation.navigate("SettingsScreen")}>
                    <Ionicons name="settings-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Ionicons name={item.icon} size={24} color="gray" style={styles.icon}></Ionicons>
                        <View style={styles.textContainer}>
                            <Text numberOfLines={1} style={styles.text}>{item.text}</Text>
                            <Text style={styles.dateText}>{item.date}</Text>
                        </View>
                    </View>
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter new notification"
                    value={newNotification}
                    onChangeText={setNewNotification}
                />
                <TouchableOpacity onPress={addNotification}>
                    <Ionicons name="send" size={24} color="#00FF80" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function SettingsScreen({ navigation }) {
    const [settings, setSettings] = useState({
        import: true,
        alert: true,
        update: true,
        notify: false,
        reminder: true,
        confirm: true,
    });

    const toggleSwitch = (key) => {
        setSettings({ ...settings, [key]: !settings[key] });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Notification Settings</Text>
                <View style={{ width: 24 }} /> {/* Empty view for spacing */}
            </View>
            {Object.keys(settings).map((key) => (
                <View key={key} style={styles.listItem}>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                        <Text style={styles.dateText}>Notification for {key}</Text>
                    </View>
                    <Switch
                        value={settings[key]}
                        onValueChange={() => toggleSwitch(key)}
                        trackColor={{ false: "#767577", true: "#00FF80" }}
                        thumbColor={settings[key] ? "#f4f3f4" : "#f4f3f4"}
                    />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        padding: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd"
    },
    icon: { marginRight: 15 },
    textContainer: { flex: 1 },
    text: { fontSize: 16 },
    dateText: { color: "gray", fontSize: 12 },
    inputContainer: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        alignItems: "center"
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 8,
        marginRight: 10,
        borderRadius: 5
    }
});

export default NotificationsStack;