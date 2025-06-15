import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    StatusBar, ViewStyle
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, addDays, startOfWeek, getHours, getMinutes } from 'date-fns';
import Constants from "expo-constants";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TIME_SLOT_HEIGHT = 80;
const HEADER_HEIGHT = 60;
const WEEK_SELECTOR_HEIGHT = 70;
const DATE_HEADER_HEIGHT = 40;
const BOTTOM_NAV_HEIGHT = 60;
// @ts-ignore
const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};
// @ts-ignore
export default function CalendarScheduler({ navigation }) {
    const initialDate = new Date();
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [transactions, setTransactions] = useState([]);
    const [userId, setUserId] = useState("");

    const getUserId = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            const user = await AsyncStorage.getItem('user');
            if (user !== null) {
                const parsedUser = JSON.parse(user);
                setUserId(parsedUser.userId);
            }
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    };

    useEffect(() => {
        getUserId();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchTransactions = async () => {
            try {
                const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
                const end = addDays(start, 7);

                const ipAddress = Constants.expoConfig?.hostUri?.split(':').shift();

                if (!ipAddress) {
                    console.error("Could not determine host IP address from Expo Go.");
                    return;
                }

                const apiBaseUrl = `http://${ipAddress}:5242`;
                const url = `${apiBaseUrl}/api/transactions/${userId}`;
                console.log('Fetching transactions from:', url);

                try {
                    const res = await axios.get(url);
                    // @ts-ignore
                    setTransactions(res.data || []);
                    console.log('Fetched transactions:', res.data);
                } catch (error) {
                    console.log('Error fetching transactions:', error);
                }
            } catch (err) {
                console.error('Failed to fetch transactions:', err);
            }
        };

        fetchTransactions();

    }, [selectedDate, userId]);


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const currentHour = getHours(currentTime);
    const currentMinute = getMinutes(currentTime);
    const currentTimeIndicatorTop =
        (currentHour + currentMinute / 60) * TIME_SLOT_HEIGHT;


    const weekDates = useMemo(() => {
        const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
        return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    }, [selectedDate]);

    const hours = Array.from({ length: 24 }, (_, i) => i);

    const formattedDateHeader = useMemo(() => {
        const dayName = format(selectedDate, 'EEEE');
        const monthName = format(selectedDate, 'MMMM').toLowerCase();
        const dayOfMonth = format(selectedDate, 'd');
        const year = format(selectedDate, 'yyyy');
        return `${dayName} - ${monthName} ${dayOfMonth}${getOrdinalSuffix(
            parseInt(dayOfMonth)
        )} ${year}`;
    }, [selectedDate]);

    const transactionsForDay = useMemo(() => {
        return transactions.filter(tx => {
             // @ts-ignore
            const txDate = new Date(tx.date);
            return format(txDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
        });
    }, [transactions, selectedDate]);

    const groupedTx = useMemo(() => groupTransactionsByTime(transactionsForDay, 20), [transactionsForDay]);

    function groupTransactionsByTime(transactions, thresholdMinutes = 60) {
        const groups = [];

        const sorted = transactions.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

        sorted.forEach(tx => {
            const txTime = new Date(tx.date).getTime();
            let placed = false;

            for (const group of groups) {
                if (group.some(t => Math.abs(new Date(t.date).getTime() - txTime) <= thresholdMinutes * 60 * 1000)) {
                    group.push(tx);
                    placed = true;
                    break;
                }
            }

            if (!placed) {
                groups.push([tx]);
            }
        });

        return groups;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#00FF7F" />
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.headerMonthYearContainer}>
                    <Text style={styles.headerMonthYear}>{format(selectedDate, 'MMMM, yyyy')}</Text>
                </TouchableOpacity>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="spinner"
                    onChange={(e, date) => {
                        setShowDatePicker(false);
                        if (date) setSelectedDate(date);
                    }}
                />
            )}

            <View style={styles.weekContainer}>
                <FlatList
                    data={weekDates}
                    keyExtractor={(d) => d.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.weekList}
                    renderItem={({ item }) => {
                        const dayStr = format(item, 'yyyy-MM-dd');
                        const selectedDayStr = format(selectedDate, 'yyyy-MM-dd');
                        const isSelected = dayStr === selectedDayStr;
                        return (
                            <TouchableOpacity onPress={() => setSelectedDate(item)} style={styles.dayContainer}>
                                <Text style={[styles.weekday, isSelected && styles.selectedWeekday]}>
                                    {format(item, 'EE').substring(0, 2)}
                                </Text>
                                <View style={[styles.dateCircle, isSelected && styles.selectedCircle]}>
                                    <Text style={[styles.dateNumber, isSelected && styles.selectedDateNumber]}>
                                        {format(item, 'd')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            <View style={styles.scheduleHeader}>
                <Text style={styles.headerText}>{formattedDateHeader}</Text>
            </View>

            <ScrollView style={styles.schedule} contentContainerStyle={styles.scheduleContent}>
                <View style={styles.timelineContainer}>
                    {hours.map((h) => (
                        <View key={h} style={[styles.timeSlot, { height: TIME_SLOT_HEIGHT }]}>
                            <Text style={styles.timeText}>{`${h}:00`}</Text>
                            <View style={styles.timeLine} />
                        </View>
                    ))}

                    {groupedTx.map((group, groupIndex) => {
                        const baseTxDate = new Date(group[0].date);
                        const hour = getHours(baseTxDate);
                        const minute = getMinutes(baseTxDate);
                        const topOffset = hour * TIME_SLOT_HEIGHT + (minute / 60) * TIME_SLOT_HEIGHT;

                        const containerLeft = 80;
                        const gap = 4;
                        const totalWidth = SCREEN_WIDTH - containerLeft;
                        const groupLength = group.length;
                        const widthPx = (totalWidth / groupLength) - gap;
                        const widthPercent = (widthPx / totalWidth) * 100;

                        return group.map((tx, i) => {
                            const leftPx = containerLeft + i * (widthPx + gap);
                            const categoryColors = {
                                Investments: '#FF6B6B',
                                Salary: '#4ECDC4',
                                Freelance: '#FFD93D',
                                default: '#0047AB',
                            };

                            const backgroundColor = categoryColors[tx.category] || categoryColors.default;

                            const inlineStyle = {
                                top: topOffset,
                                left: leftPx,
                                width: widthPx,
                                position: 'absolute',
                                backgroundColor:  tx.type === 'Income' ? 'limegreen' : 'crimson',
                                borderColor: backgroundColor,
                                borderWidth: 2,
                            } as ViewStyle;

                            return (
                                <View
                                    key={tx.id}
                                    style={[styles.transactionBox, inlineStyle]}
                                >
                                    <Text style={styles.transactionText}>
                                       {tx.category} / €{tx.amount}
                                    </Text>

                                </View>
                            );
                        });
                    })}


                    {format(selectedDate, 'yyyy-MM-dd') === format(currentTime, 'yyyy-MM-dd') && (
                        <>
                            {/* The 1px Red Line */}
                            <View style={[styles.actualRedLine, { top: currentTimeIndicatorTop }]} />
                            {/* The Time Text, positioned relative to the line */}
                            <Text style={[
                                styles.timeAnnotationText,
                                {
                                    top: currentTimeIndicatorTop - (styles.timeAnnotationText.fontSize / 2) + 0.5, // Vertically centers text on the 1px line
                                    left: 16, // Indent from the left edge of the screen
                                }
                            ]}>
                                {format(currentTime, 'HH:mm')}
                            </Text>
                        </>
                    )}
                </View>
            </ScrollView>

            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navTextToday}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Text style={[styles.navText, styles.navTextSelected]}>Calendar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navText}>Incoming</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({actualRedLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'red',
        zIndex: 1,
        marginTop: 2,
        marginLeft: 16,
        marginRight: 16,
    },
    timeAnnotationText: {
        position: 'absolute',
        color: 'red',
        fontSize: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 4,
        borderRadius: 3,
        zIndex: 2,
    },

    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topHeader: {
        height: HEADER_HEIGHT,
        backgroundColor: '#00FF7F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: StatusBar.currentHeight,
    },
    backButton: {
        backgroundColor: 'black',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        paddingBottom: 7,
    },
    headerMonthYearContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerMonthYear: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'right',
    },
    currentDateTime: {
        textAlign: 'center',
        marginVertical: 5,
        color: '#555',
    },
    weekContainer: {
        height: WEEK_SELECTOR_HEIGHT,
        backgroundColor: '#00FF7F',
        paddingBottom: 5,
    },
    weekList: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    dayContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: SCREEN_WIDTH / 7.5,
        height: '100%',
    },
    weekday: {
        fontSize: 13,
        color: '#000',
        marginBottom: 5,
        fontWeight: '500',
    },
    selectedWeekday: {},
    dateCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateNumber: {
        fontSize: 15,
        color: '#000',
        fontWeight: 'bold',
    },
    selectedCircle: {
        backgroundColor: '#0047AB',
    },
    selectedDateNumber: {
        color: '#fff',
    },
    scheduleHeader: {
        height: DATE_HEADER_HEIGHT,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerText: {
        fontSize: 14,
        color: '#333',
    },
    schedule: {
        flex: 1,
    },
    scheduleContent: {
        paddingBottom: 60,
    },
    timelineContainer: {
        position: 'relative',
        minHeight: (24-4) * TIME_SLOT_HEIGHT,
    },
    timeSlot: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    timeText: {
        width: 60,
        fontSize: 14,
        color: '#999',
    },
    timeLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    currentTimeLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
    },
    currentTimeText: {
        color: 'red',
        fontSize: 12,
        marginRight: 8,
    },
    bottomNav: {
        height: BOTTOM_NAV_HEIGHT,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
    },
    navText: {
        fontSize: 14,
        color: '#666',
    },
    navTextSelected: {
        color: '#0047AB',
        fontWeight: 'bold',
    },
    navTextToday: {
        fontSize: 14,
        color: '#00FF7F',
        fontWeight: 'bold',
    },
    transactionBox: {
        backgroundColor: '#0047AB',
        borderRadius: 6,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 1,
        position: 'absolute',
    },
    transactionText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },

});