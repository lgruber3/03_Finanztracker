import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from 'react-native-picker-select';

const BudgetSetupScreen = () => {
    const [name, setName] = useState("");
    const [period, setPeriod] = useState(null); // Änderung: null statt leerer String
    const [amount, setAmount] = useState("");
    const [account, setAccount] = useState(null); // Änderung: null statt leerer String
    const [category, setCategory] = useState(null); // Änderung: null statt leerer String


    const isFormComplete = () => name && period && amount && account && category;

    const handleDonePress = () => {
        if (isFormComplete()) {
            console.log("Budget gespeichert:", {
                name,
                period,
                amount: parseFloat(amount),
                account,
                category,

            });
            Alert.alert("Success", "Budget has been saved successfully!");
        } else {
            Alert.alert("Error", "Please fill in all required fields correctly.");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleDonePress}
                        disabled={!isFormComplete()}
                    >
                        <Text style={[styles.doneText, !isFormComplete() && styles.disabledDoneText]}>DONE</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerText}>Set up a Budget</Text>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Budget Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter budget name"
                        />
                        <View style={styles.underline} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Period</Text>
                        <RNPickerSelect
                            onValueChange={(value) => setPeriod(value)}
                            items={[
                                { label: 'Select period...', value: null, color: '#9EA0A4' },
                                { label: 'Weekly', value: 'Weekly' },
                                { label: 'Monthly', value: 'Monthly' },
                                { label: 'Yearly', value: 'Yearly' },
                            ]}
                            style={pickerSelectStyles}
                            value={period}
                            placeholder={{ label: 'Select period...', value: null }}
                        />
                        <View style={styles.underline} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Amount</Text>
                        <TextInput
                            style={styles.input}
                            value={amount}
                            onChangeText={(text) => {
                                // Nur Zahlen und einen Dezimalpunkt erlauben
                                if (/^\d*\.?\d*$/.test(text)) {
                                    setAmount(text);
                                }
                            }}
                            keyboardType="decimal-pad"
                            placeholder="10.00"
                        />
                        <View style={styles.underline} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Account</Text>
                        <RNPickerSelect
                            onValueChange={(value) => setAccount(value)}
                            items={[
                                { label: 'Select account...', value: null, color: '#9EA0A4' },
                                { label: 'Main Account', value: 'Main Account' },
                                { label: 'Savings', value: 'Savings' },
                                { label: 'Credit Card', value: 'Credit Card' },
                            ]}
                            style={pickerSelectStyles}
                            value={account}
                            placeholder={{ label: 'Select account...', value: null }}
                        />
                        <View style={styles.underline} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Category</Text>
                        <RNPickerSelect
                            onValueChange={(value) => setCategory(value)}
                            items={[
                                { label: 'Select category...', value: null, color: '#9EA0A4' },
                                { label: 'Food', value: 'Food' },
                                { label: 'Transport', value: 'Transport' },
                                { label: 'Entertainment', value: 'Entertainment' },
                            ]}
                            style={pickerSelectStyles}
                            value={category}
                            placeholder={{ label: 'Select category...', value: null }}
                        />
                        <View style={styles.underline} />
                    </View>

                </View>
            </ScrollView>
        </View>
    );
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        color: 'black',
        paddingRight: 30, // Platz für das Dropdown-Icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: 'black',
        paddingRight: 30, // Platz für das Dropdown-Icon
    },
    placeholder: {
        color: '#9EA0A4',
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    headerText: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 20,
    },
    formContainer: {
        flex: 1,
        marginTop: 20,
    },
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        color: "#333",
        marginBottom: 5,
        fontWeight: "bold",

    },
    input: {
        fontSize: 16,
        paddingVertical: 8,
        color: "#333",
    },
    underline: {
        height: 1,
        backgroundColor: "#ccc",
    },
    doneText: {
        color: "green",
        fontSize: 16,
        fontWeight: "bold",
    },
    disabledDoneText: {
        color: "#ccc",
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    backButton: {
        padding: 5,
    },
});

export default BudgetSetupScreen;