// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useState } from "react";
// import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const COLORS = { bg: "#000", accent: "#00e096", title: "#E7E9EA", text: "#B0B3B8", inputBg: "#1a1a1a", border: "#333" };

// export default function ResetPasswordScreen() {
//     const router = useRouter();
//     const { email } = useLocalSearchParams();
//     const [otp, setOtp] = useState("");
//     const [newPassword, setNewPassword] = useState("");
//     const [loading, setLoading] = useState(false);

//     const handleReset = () => {
//         setLoading(true);
//         setTimeout(() => {
//             setLoading(false);
//             Alert.alert("Success", "Password changed successfully!");
//             router.replace("/login");
//         }, 1500);
//     };

//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.content}>
//                 <Text style={styles.title}>Reset Password</Text>
//                 <Text style={styles.subtitle}>Enter the code sent to {email} and your new password.</Text>

//                 <TextInput placeholder="OTP Code" placeholderTextColor="#555" style={styles.input} value={otp} onChangeText={setOtp} keyboardType="number-pad" />
//                 <TextInput placeholder="New Password" placeholderTextColor="#555" style={styles.input} value={newPassword} onChangeText={setNewPassword} secureTextEntry />

//                 <TouchableOpacity style={styles.btn} onPress={handleReset} disabled={loading}>
//                     {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Reset Password</Text>}
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: COLORS.bg },
//     content: { flex: 1, justifyContent: "center", padding: 24 },
//     title: { fontSize: 30, fontWeight: "700", color: COLORS.title, marginBottom: 10 },
//     subtitle: { fontSize: 16, color: COLORS.text, marginBottom: 40 },
//     input: { backgroundColor: COLORS.inputBg, color: "#fff", padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border, fontSize: 16 },
//     btn: { backgroundColor: COLORS.accent, paddingVertical: 16, borderRadius: 30, alignItems: "center" },
//     btnText: { color: "#000", fontSize: 16, fontWeight: "bold" }
// });





import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

// ✅ THEME CONFIG
const COLORS = {
    bg: "#000000", // Full Black
    textMain: "#FFFFFF",
    textSec: "#9ca3af",
    inputBg: "#1a1a1a",
    accent: "#00e096", // Green Accent
    border: "#333"
};

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams();
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = () => {
        if (!otp || !newPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            Alert.alert("Success", "Password changed successfully!");
            router.replace("/login");
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

                    {/* Title */}
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                        Enter the code sent to <Text style={{ color: COLORS.accent }}>{email}</Text> and your new password.
                    </Text>

                    {/* OTP Input */}
                    <Text style={styles.label}>OTP Code</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="chatbox-ellipses-outline" size={20} color={COLORS.textSec} style={styles.icon} />
                        <TextInput
                            placeholder="123456"
                            placeholderTextColor="#555"
                            style={styles.input}
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                    </View>

                    {/* New Password Input */}
                    <Text style={styles.label}>New Password</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSec} style={styles.icon} />
                        <TextInput
                            placeholder="New Password"
                            placeholderTextColor="#555"
                            style={styles.input}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />
                    </View>

                    {/* Reset Button */}
                    <TouchableOpacity style={styles.btn} onPress={handleReset} disabled={loading}>
                        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Reset Password</Text>}
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
        backgroundColor: COLORS.inputBg,
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
        marginBottom: 20,
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
        marginTop: 10,
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