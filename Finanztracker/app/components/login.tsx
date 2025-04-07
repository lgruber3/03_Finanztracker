import React from "react";
import Axios from "axios";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import Constants from "expo-constants";
import * as Google from 'expo-google-app-auth';

const Login = ({navigation}) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const googleConfig = {
        iosClientId: '1076804646089-j5tal0fsg9hio8mbgcs68ms3i6is5pog.apps.googleusercontent.com',
        androidClientId: '1076804646089-j5tal0fsg9hio8mbgcs68ms3i6is5pog.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await Google.logInAsync(googleConfig);
            if (result.type === 'success') {
                console.log("Google login success:", result);
                // Send token to your backend for verification
            } else {
                console.log("Google login cancelled");
            }
        } catch (error) {
            console.error("Google login error:", error);
        }
    };

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

            const ipAddress = Constants.expoConfig?.hostUri?.split(':').shift();

            if (!ipAddress) {
                console.error("Could not determine host IP address from Expo Go.");
                return;
            }

            const apiBaseUrl = `http://${ipAddress}:5242`; // Use http://

            const uri = `${apiBaseUrl}/api/auth/login`;

            console.log("Sending request to:", uri);
            console.log("Request Headers:", config.headers);
            console.log("Request Body:", { email, password });

            const response = await Axios.post(uri, { email, password }, config);

            console.log("Login Successful");
            console.log("Response Status:", response.status);
            console.log("Response Headers:", response.headers);
            console.log("Response Data:", response.data);

        } catch (error) {
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

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>LOG IN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                    <Text style={styles.socialButtonText}>Login with Google</Text>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <Text style={styles.signupLink}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
                <Image
                    source={require('../../assets/images/stock_bottom.jpg')}
                    style={styles.bottomImage}
                />
r        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "30%",
    },
    contentContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: "#ffffff",
        padding: 20,
        alignItems: "center",
        justifyContent: "flex-start",
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
        alignItems: "center",
        width: "100%",
    },
    bottomImage: {
        width: "100%",
        height: "15%",
    },

    socialButton: {
        width: "55%",
        backgroundColor: "#db4a39",
        padding: 15,
        borderRadius: 100,
        alignItems: "center",
        marginBottom: 10,
    },
    socialButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Login;
