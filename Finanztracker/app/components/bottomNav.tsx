import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BottomNav = ({ navigation }) => {
    const [isMenuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => setMenuVisible(!isMenuVisible);
    const closeMenu = () => setMenuVisible(false);

    return (
        <>
            <Modal transparent visible={isMenuVisible} animationType="fade">
                <TouchableWithoutFeedback onPress={closeMenu}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.floatingMenu}>
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => {
                                        closeMenu();
                                        navigation.navigate("income");
                                    }}>
                                    <Ionicons name="add-circle-outline" size={20} color="black" />
                                    <Text style={styles.menuText}>Income/Expense</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => {
                                        closeMenu();
                                        navigation.navigate("InvoiceScanner");
                                    }}>
                                    <Ionicons name="receipt-outline" size={20} color="black" />
                                    <Text style={styles.menuText}>Payment Slip</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <View style={styles.bottomNav}>
                <TouchableOpacity onPress={() => navigation.navigate("Start")}>
                    <Ionicons name="home" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("CalendarScheduler")}>
                    <Ionicons name="calendar-outline" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleMenu}>
                    <Ionicons name="add-circle" size={48} color="green" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Budget")}>
                    <Ionicons name="cash" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Currency")}>
                    <Ionicons name="logo-euro" size={28} color="black" />
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
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

export default BottomNav;
