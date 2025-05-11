import React, {useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { ProgressBar } from "react-native-paper";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StartScreen = () => {
    const [name, setName] = React.useState("Anonymous");
    const [amount, setAmount] = React.useState("0,00");
    const [month, setMonth] = React.useState("");

    const getCurrentMonth = () => {
        const date = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        setMonth(monthNames[date.getMonth()]);
    }

    const getUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem("user");
            if (userData) {
                const parsedData = JSON.parse(userData);
                setName(parsedData.firstName + " " + parsedData.lastName);

                const accountData = await AsyncStorage.getItem("account");
                if (accountData) {
                    const parsedAccountData = JSON.parse(accountData);
                    setAmount(parsedAccountData.balance);
                } else {
                    console.error("No account data found");
                }
            }
        } catch (error) {
            console.error("Error retrieving user data:", error);
        }
    }

    useEffect(() => {
        getCurrentMonth();
        getUserData();
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="options" size={28} color="black" />
                </TouchableOpacity>
                <View style={styles.headerIcons}>
                    <Ionicons name="notifications" size={26} color="black" style={styles.iconSpacing} />
                    <Ionicons name="settings" size={26} color="black" />
                </View>
            </View>

            <View style={styles.budgetCard}>
                <View style={styles.budgetTextContainer}>
                    <Text style={styles.userName}>{name}</Text>
                    <Text style={styles.amount}>{amount} €</Text>
                    <Text style={styles.budgetLabel}>Budget <Text style={{ fontStyle: 'italic' }}>{month}</Text></Text>
                    <ProgressBar progress={0.7} color="#2196f3" style={styles.progressBar} />
                </View>
                <FontAwesome5 name="wallet" size={40} color="#888" />
            </View>

            <View style={styles.topExpenses}>
                <Text style={styles.sectionTitle}>Top-expenses</Text>
                <Text style={styles.subTitle}>THIS MONTH</Text>
                <ScrollView>
                    <View style={styles.expenseRow}><MaterialIcons name="home" size={24} color="#ffa500" /><Text style={styles.expenseLabel}>Rent/Loan</Text><Text style={styles.expenseAmount}>-433,23 €</Text></View>
                    <View style={styles.expenseRow}><MaterialIcons name="directions-car" size={24} color="#800080" /><Text style={styles.expenseLabel}>Car expenses</Text><Text style={styles.expenseAmount}>-187,43 €</Text></View>
                    <View style={styles.expenseRow}><MaterialIcons name="fastfood" size={24} color="#ff0000" /><Text style={styles.expenseLabel}>Food expenses</Text><Text style={styles.expenseAmount}>-89,43 €</Text></View>
                    <View style={styles.expenseRow}><MaterialIcons name="checkroom" size={24} color="#00b300" /><Text style={styles.expenseLabel}>Clothing expenses</Text><Text style={styles.expenseAmount}>-63,23 €</Text></View>
                </ScrollView>
            </View>

            <View style={styles.bottomNav}>
                <TouchableOpacity><Ionicons name="home" size={28} color="white" /></TouchableOpacity>
                <TouchableOpacity><Ionicons name="bar-chart" size={28} color="black" /></TouchableOpacity>
                <TouchableOpacity><Ionicons name="add-circle" size={48} color="white" /></TouchableOpacity>
                <TouchableOpacity><Ionicons name="cash" size={28} color="black" /></TouchableOpacity>
                <TouchableOpacity><Ionicons name="logo-euro" size={28} color="black" /></TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        paddingTop: 50,
        paddingHorizontal: 20,
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
        backgroundColor: "#00ff88",
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
        backgroundColor: "#00ff88",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
});

export default StartScreen;