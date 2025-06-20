import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


// @ts-nocheck
// Typdefinition für die Icons
type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const Stack = createNativeStackNavigator();

function NotificationsStack() {
    return (
        //@ts-ignore
        <Stack.Navigator>
            <Stack.Screen name="NotificationsMain" component={NotificationsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

// Typdefinition für Notification-Items
interface NotificationItem {
    id: string;
    icon: IoniconsName;
    text: string;
    date: string;
}

const renderItem = ({ item }: { item: NotificationItem }) => (
    <View style={styles.listItem}>
        <Ionicons name={item.icon} size={24} color="gray" style={styles.icon} />
        <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.text}>{item.text}</Text>
            <Text style={styles.dateText}>{item.date}</Text>
        </View>
    </View>
);

function NotificationsScreen({ navigation }: { navigation: any }) {
    const [notifications] = useState<NotificationItem[]>([
        { id: "1", icon: "wallet-outline", text: "Welcome to our Finance Tracker A..", date: "10.03.2025" },
    ]);

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
                renderItem={renderItem}
            />
        </View>
    );
}

// @ts-ignore
function SettingsScreen({ navigation }) {
    const [settings, setSettings] = useState({
        import: true,
        alert: true,
        update: true,
        notify: false,
        reminder: true,
        confirm: true,
    });

    // @ts-ignore
    const toggleSwitch = (key) => {
        // @ts-ignore
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
            <>
                {Object.keys(settings).map((key) => (
                    <View key={key} style={styles.listItem}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>
                                {typeof key === 'string'
                                    ? key.charAt(0).toUpperCase() + key.slice(1)
                                    : 'Unknown'}
                            </Text>
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
            </>
    </View>
);
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        padding: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#00FF7F"
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