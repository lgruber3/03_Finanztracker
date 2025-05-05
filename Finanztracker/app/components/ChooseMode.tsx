import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {descriptions} from "jest-config"; // Expo-Icons für das Retour-Symbol

// @ts-ignore
export default function ChooseMode({navigation}) {
    return (
        <View style={styles.container}>
            {/* Weißer Container mit Inhalt */}
            <View style={styles.overlayContainer}>
                {/* Retour-Icon */}
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                {/* Überschrift und Beschreibung */}
                <Text style={styles.title}>Choose Your Mode</Text>
                <Text style={styles.first_descriptions}>
                    A finance tracker app helps manage income and expenses, either individually or in a group.
                </Text>
                <Text style={styles.description}>
                    In <Text style={styles.bold}>single mode</Text>, users can set budgets, view statistics, and manage bills.
                </Text>
                <Text style={styles.description}>
                    In <Text style={styles.bold}>group mode</Text>, shared expenses can be recorded, debts are automatically calculated, and real-time synchronization keeps everyone updated. A chat and notes feature makes communication easier.
                    Additional features like cloud storage, multi-currency support, and dark mode make the app versatile and user-friendly
                </Text>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SetCash")}>
                        <Text style={styles.buttonText}>Single</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SetCash")}>
                        <Text style={styles.buttonText}>Group Finance</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#00FF7F",
        justifyContent: "center",
        alignItems: "center",
    },
    overlayContainer: {
        width: "90%",
        height: "90%",
        backgroundColor: "#ffffff", // Weißer Container
        borderRadius: 25, // Abgerundete Ecken
        padding: 20,
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 5, // Schatten für Android
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },

    bold: {
        fontWeight: "bold",
    },

    backButton: {
        position: "absolute",
        top: 20,
        left: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginTop: 40,
    },
    first_descriptions: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    description: {
        fontSize: 16,
        color: "#666",
        marginTop: -40,
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    button: {
        width: "70%",
        padding: 15,
        backgroundColor: "#1e90ff",
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 10,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
