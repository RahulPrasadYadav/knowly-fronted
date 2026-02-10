// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const COLORS = { bg: "#000", accent: "#00e096", title: "#E7E9EA", text: "#B0B3B8", inputBg: "#1a1a1a", border: "#333" };

// export default function ForgotPasswordScreen() {
//     const router = useRouter();
//     const [email, setEmail] = useState("");
//     const [loading, setLoading] = useState(false);

//     const handleSendCode = () => {
//         setLoading(true);
//         setTimeout(() => {
//             setLoading(false);
//             // Reset Password Screen par bhejo
//             router.push({ pathname: "/reset-password", params: { email } });
//         }, 1500);
//     };

//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.content}>
//                 <Text style={styles.title}>Forgot Password?</Text>
//                 <Text style={styles.subtitle}>Don't worry! It happens. Please enter the email associated with your account.</Text>

//                 <TextInput placeholder="Enter your email" placeholderTextColor="#555" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

//                 <TouchableOpacity style={styles.btn} onPress={handleSendCode} disabled={loading}>
//                     {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Send Code</Text>}
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, alignSelf: 'center' }}>
//                     <Text style={{ color: COLORS.text }}>Back to Login</Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: COLORS.bg },
//     content: { flex: 1, justifyContent: "center", padding: 24 },
//     title: { fontSize: 30, fontWeight: "700", color: COLORS.title, marginBottom: 10 },
//     subtitle: { fontSize: 16, color: COLORS.text, marginBottom: 40, lineHeight: 24 },
//     input: { backgroundColor: COLORS.inputBg, color: "#fff", padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border, fontSize: 16 },
//     btn: { backgroundColor: COLORS.accent, paddingVertical: 16, borderRadius: 30, alignItems: "center" },
//     btnText: { color: "#000", fontSize: 16, fontWeight: "bold" }
// });





import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ THEME CONFIG (Same as Login, but BG is Black)
const COLORS = {
    bg: "#000000", // Full Black Background
    textMain: "#FFFFFF",
    textSec: "#9ca3af",
    inputBg: "#1a1a1a",
    accent: "#00e096",
    border: "#333"
};

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendCode = () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email address");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Reset Password Screen par bhejo
            router.push({ pathname: "/reset-password", params: { email } });
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

            {/* --- Header (Back Button) --- */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >

                    {/* Title Section */}
                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subtitle}>
                        Don't worry! It happens. Please enter the email associated with your account.
                    </Text>

                    {/* Email Input (Same Style as Login) */}
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="mail-outline" size={20} color={COLORS.textSec} style={styles.icon} />
                        <TextInput
                            placeholder="example@gmail.com"
                            placeholderTextColor="#555"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Send Code Button */}
                    <TouchableOpacity style={styles.btn} onPress={handleSendCode} disabled={loading}>
                        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Send Code</Text>}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.inputBg, // Light dark circle
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },

    // --- Typography ---
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: COLORS.textMain,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSec,
        marginBottom: 40,
        lineHeight: 24,
    },
    label: {
        color: COLORS.textMain,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },

    // --- Inputs ---
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 14,
        height: 54,
        marginBottom: 30,
    },
    icon: { marginRight: 10 },
    input: {
        flex: 1,
        color: "#fff",
        fontSize: 16,
    },

    // --- Button ---
    btn: {
        backgroundColor: COLORS.accent,
        height: 56,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    btnText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
    },
});