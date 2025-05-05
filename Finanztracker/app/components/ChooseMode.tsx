import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {descriptions} from "jest-config"; // Expo-Icons für das Retour-Symbol
import { useAppContext } from '../appContext'; // Correct path

export default function ChooseMode({navigation}) {
    const { setHasChosenMode } = useAppContext();

    return (
        <View style={{ flex: 1 }}>
            {/* Grün-Schwarzer Hintergrund */}
            <View style={{ flex: 4, backgroundColor: "#00FF7F" }} />
            <View style={{ flex: 6, backgroundColor: "#222222" }} />

            {/* Weißer Container darüber */}
            <View style={styles.whiteContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                {/* Überschrift und Beschreibung */}
                <Text style={styles.title}>Choose Your Mode</Text>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.firstDescription}>
                        A finance tracker app helps manage income and expenses, either individually or in a group.
                    </Text>

                    <View style={styles.descriptionSection}>
                        <Text style={styles.description}>
                            In <Text style={styles.bold}>single mode</Text>, users can set budgets, view statistics, and manage bills.
                        </Text>
                    </View>

                    <View style={styles.descriptionSection}>
                        <Text style={styles.description}>
                            In <Text style={styles.bold}>group mode</Text>, shared expenses can be recorded, debts are automatically calculated, and real-time synchronization keeps everyone updated. A chat and notes feature makes communication easier.
                        </Text>
                        <Text style={styles.description}>
                            Additional features like cloud storage, multi-currency support, and dark mode make the app versatile and user-friendly.
                        </Text>
                    </View>
                </ScrollView>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => setHasChosenMode(true)}>
                        <Text style={styles.buttonText}>Single</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => setHasChosenMode(true)}>
                        <Text style={styles.buttonText}>Group Finance</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    whiteContainer: {
        position: 'absolute',
        top: '10%',
        left: 20,
        right: 20,
        bottom: '10%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    backButton: {
        position: "absolute",
        top: 15,
        left: 15,
        zIndex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    firstDescription: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 22,
    },
    descriptionSection: {
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: "#666",
        lineHeight: 22,
        marginBottom: 10,
    },
    bold: {
        fontWeight: "bold",
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    button: {
        width: "80%",
        padding: 15,
        backgroundColor: "#1e90ff",
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 8,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
    },
});