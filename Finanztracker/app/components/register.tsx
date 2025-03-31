import React from "react";
import Axios from "axios";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";

const Register = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");


    const handleRegister = async () => {
        if (password !== confirmPassword) {
            console.error("Passwords do not match");
            return;
        }

        try {
            const config = {
                headers: { "Content-Type": "application/json" },
            };

            const response = await Axios.post(
                "https://172.20.10.2:7285/api/auth/register",
                { email, password },
                config
            );

            console.log("Registration Successful", response.data);
            navigation.navigate("Login");
        } catch (error) {
            console.error("Registration Failed", error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Image source={require('../../assets/images/businessman-outdoors-smiling-walking.jpg')} style={styles.image} />

            <View style={styles.contentContainer}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Sign up to track your finances</Text>

                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={setEmail}
                />

                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    placeholderTextColor="#999"
                    secureTextEntry
                    onChangeText={setPassword}
                />

                <TextInput
                    placeholder="Confirm Password"
                    style={styles.input}
                    placeholderTextColor="#999"
                    secureTextEntry
                    onChangeText={setConfirmPassword}
                />
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>SIGN UP</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        zIndex: 10,
    },
    image: {
        width: "100%",
        height: "30%",
    },
    contentContainer: {
        flex: 1,
        width: "100%",
        padding: 20,
        alignItems: "center",
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
    registerButton: {
        width: "55%",
        backgroundColor: "#7ae582",
        padding: 15,
        borderRadius: 100,
        alignItems: "center",
    },
    registerButtonText: {
        color: "black",
        fontSize: 20,
        fontWeight: "bold",
    },
    bottomContainer: {
        alignItems: "center",
        width: "100%",
    },
});

export default Register;
