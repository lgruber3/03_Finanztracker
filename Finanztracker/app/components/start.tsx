import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    TouchableWithoutFeedback,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Axios from "axios/index";
import {useFinanceStore} from "@/app/components/Store";
import { RefreshControl } from "react-native";

const StartScreen = ({navigation}) => {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [refreshing, setRefreshing] = useState(false);

    const toggleMenu = () => setMenuVisible(!isMenuVisible);
    const closeMenu = () => setMenuVisible(false);

    const [name, setName] = React.useState("Anonymous");
    const { balance, setBalance } = useFinanceStore();
    const [month, setMonth] = React.useState("");

    const getCurrentMonth = () => {
        const date = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        setMonth(monthNames[date.getMonth()]);
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await getUserData();
        await fetchTransactions();
        setRefreshing(false);
    };


    const getUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem("user");
            if (userData) {
                const parsedData = JSON.parse(userData);
                setName(parsedData.firstName + " " + parsedData.lastName);

                const ipAddress = Constants.expoConfig?.hostUri?.split(':').shift();

                if (!ipAddress) {
                    console.error("Could not determine host IP address from Expo Go.");
                    return;
                }

                const apiBaseUrl = `http://${ipAddress}:5242`;

                const accountResponse = await Axios.get(`${apiBaseUrl}/api/accounts/${parsedData.userId}`);
                await AsyncStorage.setItem("account", JSON.stringify(accountResponse.data));
                console.log("Account data saved to AsyncStorage:", JSON.stringify(accountResponse.data));
                console.log("Account response:", accountResponse.data);
                const accountData = accountResponse.data;
                setBalance(accountData.balance);
            }
        } catch (error) {
            console.error("Error retrieving user data:", error);
        }
    }

    const fetchTransactions = async () => {
        const user = await AsyncStorage.getItem('user');
        if (user !== null) {
            const parsedUser = JSON.parse(user);
            setUserId(parsedUser.userId);

            const ipAddress = Constants.expoConfig?.hostUri?.split(':').shift();
            if (!ipAddress) {
                console.error("Could not determine host IP address from Expo Go.");
                return;
            }

            const apiBaseUrl = `http://${ipAddress}:5242`;
            const uri = `${apiBaseUrl}/api/transactions/${parsedUser.userId}`;

            try {
                const response = await Axios.get(uri);
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        }
    };

    useEffect(() => {
        getCurrentMonth();
        getUserData();
        fetchTransactions();
    }, []);

    return (
        <View style={styles.container}>
            {/* Grün-Schwarzer Hintergrund */}
            <View style={{ flex: 4, backgroundColor: "#00FF7F" }} />
            <View style={{ flex: 6, backgroundColor: "#222222" }} />

            {/* Hauptinhalt (absolut positioniert über dem Hintergrund) */}
            <View style={styles.contentContainer}>
                {/* Green header section */}
                <View style={styles.greenHeader}>
                    <View style={styles.header}>
                        <TouchableOpacity>
                            <Ionicons name="options" size={28} color="white" />
                        </TouchableOpacity>
                        <View style={styles.headerIcons}>
                            <Ionicons
                                name="notifications"
                                size={26}
                                color="white"
                                style={styles.iconSpacing}
                            />
                            <Ionicons name="settings" size={26} color="white" />
                        </View>
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.budgetCard}>
                        <View style={styles.budgetTextContainer}>
                            <Text style={styles.userName}>{name}</Text>
                            <Text style={styles.amount}>{balance} €</Text>
                            <Text style={styles.budgetLabel}>
                                Budget <Text style={{ fontStyle: "italic" }}>{month}</Text>
                            </Text>
                            <ProgressBar progress={0.7} color="#2196f3" style={styles.progressBar} />
                        </View>
                        <FontAwesome5 name="wallet" size={40} color="#888" />
                    </View>

                    <View style={styles.topExpenses}>
                        <Text style={styles.sectionTitle}>Top-expenses</Text>
                        <Text style={styles.subTitle}>THIS MONTH</Text>
                        <ScrollView
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                        >
                            {transactions
                                .filter(tx => tx.type == '1')
                                .map((tx, index) => (
                                    <View key={tx.id ?? index} style={styles.expenseRow}>
                                        <MaterialIcons name="money-off" size={24} color="#ff6347" />
                                        <Text style={styles.expenseLabel}>{tx.category}</Text>
                                        <Text style={styles.expenseAmount}>-{tx.amount.toFixed(2)} €</Text>
                                    </View>
                                ))
                            }
                        </ScrollView>

                    </View>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    greenHeader: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerIcons: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconSpacing: {
        marginRight: 15,
    },
    budgetCard: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 16,
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    budgetTextContainer: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: "600",
    },
    amount: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#0a5f00",
    },
    budgetLabel: {
        fontSize: 14,
        marginTop: 4,
        marginBottom: 6,
    },
    progressBar: {
        height: 10,
        borderRadius: 8,
        backgroundColor: "#ccc",
    },
    topExpenses: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        marginTop: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    subTitle: {
        fontSize: 12,
        color: "#888",
        marginBottom: 10,
    },
    expenseRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    expenseLabel: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    expenseAmount: {
        color: "red",
        fontWeight: "bold",
    },
    bottomNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 90,
    },
    floatingMenu: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 16,
        width: 220,
        elevation: 5,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    menuText: {
        marginLeft: 10,
        fontSize: 16,
        color: "black",
    },
});

export default StartScreen;