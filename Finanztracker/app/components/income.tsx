import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, KeyboardAvoidingView, Platform, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Transaction = {
    id: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    note: string;
    date: string;
};

const ExpenseTrackerScreen = ( {navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [inputModalVisible, setInputModalVisible] = useState(false);
    const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const expenseCategories = [
        { name: 'Car expenses', icon: 'car-outline', color: '#800080' },
        { name: 'Rent/loan', icon: 'home-outline', color: '#ffa500' },
        { name: 'Food expenses', icon: 'fast-food-outline', color: '#ff0000' },
        { name: 'Clothing expenses', icon: 'shirt-outline', color: '#00b300' },
        { name: 'Different', icon: 'ellipsis-horizontal-outline', color: '#666' }
    ];

    const incomeCategories = [
        { name: 'Salary', icon: 'cash-outline', color: '#009688' },
        { name: 'Freelance', icon: 'laptop-outline', color: '#3F51B5' },
        { name: 'Investments', icon: 'trending-up-outline', color: '#4CAF50' },
        { name: 'Gifts', icon: 'gift-outline', color: '#E91E63' },
        { name: 'Other income', icon: 'wallet-outline', color: '#FF9800' }
    ];

    const handleTypeSelect = (type: 'income' | 'expense') => {
        setTransactionType(type);
        setModalVisible(true);
    };

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setModalVisible(false);
        setInputModalVisible(true);
    };

    const handleSubmit = () => {
        if (!amount) return;

        const newTransaction: Transaction = {
            id: Math.random().toString(36).substr(2, 9),
            type: transactionType,
            category: selectedCategory,
            amount: parseFloat(amount),
            note: note,
            date: new Date().toLocaleString()
        };

        setTransactions([...transactions, newTransaction]);
        setAmount('');
        setNote('');
        setInputModalVisible(false);
    };

    const renderTransactionItem = ({ item }: { item: Transaction }) => (
        <View style={[
            styles.transactionItem,
            { borderLeftColor: item.type === 'income' ? '#4CAF50' : '#F44336' }
        ]}>
            <View style={styles.transactionInfo}>
                <Text style={styles.transactionCategory}>{item.category}</Text>
                <Text style={styles.transactionNote}>{item.note || 'No description'}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <Text style={[
                styles.transactionAmount,
                { color: item.type === 'income' ? '#4CAF50' : '#F44336' }
            ]}>
                {item.type === 'income' ? '+' : '-'}{item.amount.toFixed(2)} €
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Hauptinhalt mit Transaktionsliste */}
            <View style={styles.content}>
                <View style={styles.nav}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Income/Expenses</Text>
                </View>


                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceLabel}>Current Balance:</Text>
                    <Text style={styles.balanceAmount}>
                        {transactions.reduce((sum, t) => (
                            t.type === 'income' ? sum + t.amount : sum - t.amount
                        ), 0).toFixed(2)} €
                    </Text>
                </View>

                <FlatList
                    data={transactions}
                    renderItem={renderTransactionItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No transactions yet</Text>
                    }
                />
            </View>

            {/* Auswahl-Buttons für Einnahmen/Ausgaben */}
            <View style={styles.typeSelector}>
                <TouchableOpacity
                    style={[styles.typeButton, { backgroundColor: '#F44336' }]}
                    onPress={() => handleTypeSelect('expense')}
                >
                    <Ionicons name="remove-circle-outline" size={24} color="white" />
                    <Text style={styles.typeButtonText}>Add Expense</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.typeButton, { backgroundColor: '#4CAF50' }]}
                    onPress={() => handleTypeSelect('income')}
                >
                    <Ionicons name="add-circle-outline" size={24} color="white" />
                    <Text style={styles.typeButtonText}>Add Income</Text>
                </TouchableOpacity>
            </View>

            {/* Modal für Typauswahl (entfernt, da jetzt direkte Buttons) */}

            {/* Modal für Kategorieauswahl */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Select {transactionType === 'income' ? 'Income' : 'Expense'} Category
                        </Text>

                        {(transactionType === 'income' ? incomeCategories : expenseCategories).map((category) => (
                            <TouchableOpacity
                                key={category.name}
                                style={styles.categoryItem}
                                onPress={() => handleCategorySelect(category.name)}
                            >
                                <Ionicons
                                    name={category.icon as any}
                                    size={24}
                                    color={category.color}
                                    style={styles.categoryIcon}
                                />
                                <Text style={styles.categoryText}>{category.name}</Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal für Betrags- und Notiz-Eingabe */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={inputModalVisible}
                onRequestClose={() => setInputModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.inputModalContent}>
                        <View style={styles.transactionTypeIndicator}>
                            <Ionicons
                                name={transactionType === 'income' ? 'add-circle' : 'remove-circle'}
                                size={24}
                                color={transactionType === 'income' ? '#4CAF50' : '#F44336'}
                            />
                            <Text style={[
                                styles.inputModalTitle,
                                { color: transactionType === 'income' ? '#4CAF50' : '#F44336' }
                            ]}>
                                {selectedCategory}
                            </Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Amount (€)</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="decimal-pad"
                                placeholder="0.00"
                                value={amount}
                                onChangeText={setAmount}
                                autoFocus={true}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Note (optional)</Text>
                            <TextInput
                                style={[styles.input, styles.noteInput]}
                                placeholder="Add description..."
                                value={note}
                                onChangeText={setNote}
                                multiline
                            />
                        </View>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={() => setInputModalVisible(false)}
                            >
                                <Text style={styles.actionButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, styles.submitButton,
                                    { backgroundColor: transactionType === 'income' ? '#4CAF50' : '#F44336' }]}
                                onPress={handleSubmit}
                                disabled={!amount}
                            >
                                <Text style={styles.actionButtonText}>
                                    {transactionType === 'income' ? 'Add Income' : 'Add Expense'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    nav:{
        width: "auto",
        height: 80,
        backgroundColor:'#00ff7f',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        paddingTop: 20,
        paddingLeft: 70,
    },
    balanceContainer: {
        marginBottom: 20,
        padding: 25,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    balanceLabel: {
        fontSize: 16,
        color: '#666',
    },
    balanceAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    listContent: {
        paddingBottom: 100,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionCategory: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    transactionNote: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    transactionDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    typeSelector: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    typeButtonText: {
        color: 'white',
        fontWeight: '500',
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 30,
        maxHeight: '80%',
    },
    inputModalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 30,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    transactionTypeIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    inputModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    categoryIcon: {
        marginRight: 15,
    },
    categoryText: {
        fontSize: 16,
        color: '#333',
    },
    closeButton: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#666',
        fontWeight: '500',
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    noteInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    actionButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    submitButton: {
        backgroundColor: '#00C853',
        opacity: 1,
    },
    actionButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    backButton: {
        position: "absolute",
        top: 25,
        left: 15,
        zIndex: 1,
    }
});

export default ExpenseTrackerScreen;