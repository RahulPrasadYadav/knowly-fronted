import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device"; // 👈 Ye add karo
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert, // Fallback ke liye
    KeyboardAvoidingView,
    Modal, // ✅ Modal Import kiya
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

// ---------------- API CONFIGURATION (UPDATED) ----------------
const ENV = process.env.EXPO_PUBLIC_ENV || 'development';
const URL_PROD = process.env.EXPO_PUBLIC_API_URL_PROD;
const URL_PHONE = process.env.EXPO_PUBLIC_API_URL_PHONE;   // Ngrok URL
const URL_ANDROID = process.env.EXPO_PUBLIC_API_URL_ANDROID; // Emulator URL

const getBaseUrl = () => {
    // 1. Production Mode
    if (ENV === 'production' && URL_PROD) return URL_PROD;

    // 2. Physical Device (Phone) -> Ngrok
    if (Device.isDevice) {
        return URL_PHONE;
    }

    // 3. Emulator -> Android Localhost
    return URL_ANDROID;
};

const BASE_URL = getBaseUrl();
const API_VERIFY = `${BASE_URL}/auth/verify-email`;

console.log("🚀 Verify API URL:", API_VERIFY); // Debug log

async function parseApiResponse(response: Response) {
    const body = await response.text();

    try {
        return JSON.parse(body);
    } catch {
        console.error("Non-JSON verification response:", response.status, body);
        throw new Error(`Server returned an invalid response (${response.status}): ${body.slice(0, 160)}`);
    }
}

// ✅ THEME CONFIG
const COLORS = {
    bg: "#00e096",      // Green Background
    card: "#000000",    // Dark Card
    textMain: "#FFFFFF",
    textSec: "#9ca3af",
    inputBg: "#1a1a1a",
    accent: "#00e096",
    border: "#333"
};

export default function VerifyOtpScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Modal States
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isError, setIsError] = useState(false); // Track success or error

    const handleVerify = async () => {
        if (!otp || otp.length < 6) {
            setModalMessage("Please enter a valid 6-digit OTP.");
            setIsError(true);
            setShowModal(true);
            return;
        }
        setLoading(true);

        const payload = {
            email: email,
            otp: otp
        };

        try {
            console.log("🚀 Verifying at:", API_VERIFY);

            const response = await fetch(API_VERIFY, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await parseApiResponse(response);

            if (response.ok) {
                setLoading(false);
                setIsError(false); // SUCCESS
                setModalMessage("Your email has been successfully verified. You can now log in.");
                setShowModal(true);
            } else {
                setLoading(false);
                setIsError(true); // ERROR
                const errorMessage = data.detail ? JSON.stringify(data.detail) : "Invalid Code. Please check and try again.";
                setModalMessage(errorMessage);
                setShowModal(true);
            }
        } catch (error: any) {
            setLoading(false);
            setIsError(true);
            console.error("Verification Error:", error);
            setModalMessage(error.message || "Could not connect to the server. Check the API URL and backend.");
            setShowModal(true);
        }
    };

    // ✅ Handle Button Click inside Modal
    const handleModalAction = () => {
        setShowModal(false);
        if (!isError) {
            // Agar Success hai to Login page par bhejo
            router.replace("/login1");
        }
        // Agar Error hai to bas modal band hoga, user wapis OTP dalega
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

            {/* --- 1. HEADER --- */}
            <View style={styles.topSection}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* --- 2. BOTTOM CARD --- */}
            <View style={styles.bottomCard}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }}>

                        <Text style={styles.title}>Verify Email</Text>
                        <Text style={styles.subtitle}>
                            Enter the <Text style={{ fontWeight: 'bold', color: '#fff' }}>6-digit code</Text> sent to {email || "your email"}
                        </Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="000000"
                                placeholderTextColor="#555"
                                style={styles.otpInput}
                                value={otp}
                                onChangeText={setOtp}
                                keyboardType="number-pad"
                                maxLength={6}
                                autoFocus={true}
                            />
                        </View>

                        <TouchableOpacity style={styles.btn} onPress={handleVerify} disabled={loading}>
                            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Verify Code</Text>}
                        </TouchableOpacity>

                        {/* Resend Option */}
                        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => Alert.alert("Resend", "Resend feature implementation pending.")}>
                            <Text style={styles.footerText}>Didn't receive code? <Text style={styles.linkText}>Resend</Text></Text>
                        </TouchableOpacity>

                    </ScrollView>
                </KeyboardAvoidingView>
            </View>

            {/* ✅ 3. PROFESSIONAL POPUP MODAL */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        {/* Dynamic Icon: Checkmark (Success) or Alert (Error) */}
                        <View style={[styles.modalIconContainer, isError && { backgroundColor: '#ff4757' }]}>
                            <Ionicons
                                name={isError ? "alert-outline" : "checkmark-sharp"}
                                size={40}
                                color={isError ? "#fff" : "#000"}
                            />
                        </View>

                        {/* Dynamic Title */}
                        <Text style={styles.modalTitle}>
                            {isError ? "Verification Failed" : "Success!"}
                        </Text>

                        {/* Message */}
                        <Text style={styles.modalMessage}>
                            {modalMessage}
                        </Text>

                        {/* Button */}
                        <TouchableOpacity
                            style={[styles.modalBtn, isError && { backgroundColor: '#333' }]}
                            onPress={handleModalAction}
                        >
                            <Text style={[styles.modalBtnText, isError && { color: '#fff' }]}>
                                {isError ? "Try Again" : "Log In Now"}
                            </Text>
                            {!isError && <Ionicons name="log-in-outline" size={20} color="#000" style={{ marginLeft: 5 }} />}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.bg, // Green Background
    },
    topSection: {
        height: 200,
        backgroundColor: COLORS.bg,
        justifyContent: 'flex-start',
        paddingTop: 50,
        paddingLeft: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomCard: {
        flex: 1,
        backgroundColor: COLORS.card, // Black Card
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 24,
        marginTop: -40, // Overlap effect
        paddingTop: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: COLORS.textMain,
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSec,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    inputContainer: {
        marginBottom: 30,
    },
    otpInput: {
        backgroundColor: COLORS.inputBg,
        color: "#fff",
        paddingVertical: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        fontSize: 32,
        textAlign: 'center',
        letterSpacing: 10,
        fontWeight: 'bold',
    },
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
    footerText: {
        color: COLORS.textSec,
        textAlign: 'center',
        fontSize: 15,
    },
    linkText: {
        color: COLORS.accent,
        fontWeight: "bold",
    },

    // ✅ MODAL STYLES (Professional Look)
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#1a1a1a',
        borderRadius: 25,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    modalIconContainer: {
        width: 70,
        height: 70,
        backgroundColor: COLORS.accent, // Green for Success, Red for Error
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: COLORS.accent,
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center'
    },
    modalMessage: {
        fontSize: 15,
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22
    },
    modalBtn: {
        backgroundColor: COLORS.accent,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
        width: '100%'
    },
    modalBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
