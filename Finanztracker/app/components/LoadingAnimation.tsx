import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const LoadingAnimation = () => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <FontAwesome5 name="wallet" size={60} color="#00ff88" />
            </Animated.View>
            <Text style={styles.text}>Loading your finances...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: "bold",
        color: "#00ff88",
    },
});

export default LoadingAnimation;
