import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CashAccountSetup = ({navigation}) => {
    const [amount, setAmount] = useState('0');
    const [currency] = useState('EUR');

    const handleNumberPress = ({num}: { num: any }) => {
        if (amount === '0') {
            setAmount(num);
        } else {
            setAmount(prev => prev + num);
        }
    };

    const handleCommaPress = () => {
        if (!amount.includes('.')) {
            setAmount(prev => prev + '.');
        }
    };

    const handleBackspace = () => {
        if (amount.length === 1) {
            setAmount('0');
        } else {
            setAmount(prev => prev.slice(0, -1));
        }
    };

    const handleSubmit = () => {
        navigation.navigate('MainApp');
    };

    return (
        <View style={styles.container}>
            <View style={styles.aboveheader}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("MainApp")}>
                    <Text style={styles.skip}>skip</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.header}>Set up your cash account</Text>
            <Text style={styles.subheader}>How much money do you have in your physical wallet?</Text>

            <View style={styles.amountContainer}>
                <Text style={styles.amountText}>{amount}</Text>
                <Text style={styles.currencyText}>{currency}</Text>
            </View>

            <View style={styles.keypad}>
                <View style={styles.keypadRow}>
                    <TouchableOpacity style={styles.key} onPress={() => handleNumberPress({num: '1'})}>
                        <Text style={styles.keyText}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.key} onPress={() => handleNumberPress({num: '2'})}>
                        <Text style={styles.keyText}>2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.key} onPress={() => handleNumberPress({num: '3'})}>
                        <Text style={styles.keyText}>3</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.keypadRow}>
                    <TouchableOpacity style={styles.key} onPress={() => handleNumberPress({num: '4'})}>
                        <Text style={styles.keyText}>4</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.key} onPress={() => handleNumberPress({num: '5'})}>
                        <Text style={styles.keyText}>5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.key} onPress={() => handleNumberPress({num: '6'})}>
                        <Text style={styles.keyText}>6</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.keypadRow}>
                    <TouchableOpacity style={styles.key} onPress={() => handleNumberPress({num: '7'})}>
                        <Text style={styles.keyText}>7</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.key} onPress={() => handleNumberPress({num: '8'})}>
                        <Text style={styles.keyText}>8</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.key} onPress={() => handleNumberPress({num: '9'})}>
                        <Text style={styles.keyText}>9</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.keypadRow}>
                    <TouchableOpacity style={styles.key} onPress={handleCommaPress}>
                        <Text style={styles.keyText}>,</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.key} onPress={() => handleNumberPress({num: '0'})}>
                        <Text style={styles.keyText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.key]} onPress={handleBackspace}>
                        <Ionicons name="backspace" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.submitButton]} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Bestätigen</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
    },
    aboveheader:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        textDecorationLine: 'underline',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    skip:{
      color: 'blue',
        fontSize: 18,
    },
    subheader: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        color: '#666',
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: 40,
    },
    amountText: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    currencyText: {
        fontSize: 24,
        marginLeft: 5,
        color: '#666',
    },
    keypad: {
        marginHorizontal: 20,
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    key: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyText: {
        fontSize: 24,
    },

    submitButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    submitText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 5,
    },
});

export default CashAccountSetup;