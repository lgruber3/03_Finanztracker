import React from "react";
import Axios from "axios";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const handleLogin = async () => {
        console.log("Attempting login...");
        console.log("Email:", email);
        console.log("Password:", password);

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            console.log("Sending request to:", "https://localhost:7285/api/auth/login");
            console.log("Request Headers:", config.headers);
            console.log("Request Body:", { email, password });

            const response = await Axios.post(
                "https://172.20.10.2:7285/api/auth/login",
                { email, password },
                config
            );

            console.log("Login Successful");
            console.log("Response Status:", response.status);
            console.log("Response Headers:", response.headers);
            console.log("Response Data:", response.data);

        } catch (error:any) {
            console.error("Login Failed");

            if (error.response) {
                console.error("Server responded with an error:");
                console.error("Status Code:", error.response.status);
                console.error("Response Data:", error.response.data);
                console.error("Response Headers:", error.response.headers);
            } else if (error.request) {
                console.error("No response received from server:");
                console.error("Request Details:", error.request);
            } else {
                console.error("Request Setup Error:", error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/images/businessman-outdoors-smiling-walking.jpg')}
                style={styles.image}
            />

            <View style={styles.contentContainer}>
                <Text style={styles.title}>Finance Tracker</Text>
                <Text style={styles.subtitle}>Login to your account to continue</Text>

                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(text) => setEmail(text)}
                />

                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    placeholderTextColor="#999"
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                />

                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>LOG IN</Text>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <Text style={styles.signupLink}>Sign up</Text>
                    </TouchableOpacity>
                </View>

                <Image
                    source={require('../../assets/images/stock_bottom.jpg')}
                    style={styles.bottomImage}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "flex-start", // Ensure everything starts from the top
        alignItems: "center", // Center everything horizontally
    },
    image: {
        width: "100%",
        height: "30%",
    },
    contentContainer: {
        flex: 1, // Makes content container take up available space
        width: "100%",
        backgroundColor: "#ffffff", // White container
        padding: 20,
        alignItems: "center",
        justifyContent: "flex-start", // Content stays at the top
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#25a18e",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: "black",
        marginBottom: 20,
        textAlign: "center",
        fontStyle: "italic",
    },
    input: {
        width: "100%",
        backgroundColor: "#9fffcb",
        padding: 15,
        borderRadius: 100,
        marginBottom: 15,
        fontSize: 16,
        color: "#333",
        fontWeight: "bold",
    },
    forgotPassword: {
        alignSelf: "flex-start",
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: "black",
        fontSize: 14,
    },
    loginButton: {
        width: "55%",
        backgroundColor: "#7ae582",
        padding: 15,
        borderRadius: 100,
        alignItems: "center",
        marginBottom: 10,
    },
    loginButtonText: {
        color: "black",
        fontSize: 20,
        fontWeight: "bold",
    },
    signupContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    signupText: {
        color: "#666",
        fontSize: 14,
    },
    signupLink: {
        color: "#004e64",
        fontSize: 14,
        fontWeight: "bold",
    },
    bottomContainer: {
        alignItems: "center", // Center everything inside the bottom container
        width: "100%",
        backgroundColor: "red",
    },
    bottomImage: {
        width: "100%",
        height: "22%",
    },
});

export default Login;
