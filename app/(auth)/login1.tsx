




// import { Ionicons } from "@expo/vector-icons";
// import * as Device from "expo-device";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//     ActivityIndicator,
//     Dimensions,
//     Image,
//     KeyboardAvoidingView,
//     Modal,
//     Platform,
//     ScrollView,
//     StatusBar,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View
// } from "react-native";
// import { useAuth } from "../../context/AuthContext";

// const { width } = Dimensions.get("window");

// // ---------------- API CONFIGURATION ----------------
// const BASE_URL = Device.isDevice
//     ? process.env.EXPO_PUBLIC_API_URL_PHONE
//     : process.env.EXPO_PUBLIC_API_URL_EMULATOR;

// const API_LOGIN = `${BASE_URL}/auth/login`;

// // ✅ THEME CONFIG
// const COLORS = {
//     bg: "#00e096",
//     card: "#000000",
//     textMain: "#FFFFFF",
//     textSec: "#9ca3af",
//     inputBg: "#1a1a1a",
//     accent: "#00e096",
//     border: "#333",
//     error: "#ff4757" // Red color for errors
// };

// export default function Login1Screen() {
//     const router = useRouter();
//     const { login } = useAuth();

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);

//     // ✅ Error States (Inline Errors ke liye)
//     const [emailError, setEmailError] = useState("");
//     const [passwordError, setPasswordError] = useState("");

//     // ✅ Modal States (Sirf Success ke liye)
//     const [showSuccessModal, setShowSuccessModal] = useState(false);

//     // ✅ Custom Scrollbar Logic
//     const [contentHeight, setContentHeight] = useState(1);
//     const [visibleHeight, setVisibleHeight] = useState(0);
//     const [scrollY, setScrollY] = useState(0);

//     const handleLogin = async () => {
//         // Reset old errors
//         setEmailError("");
//         setPasswordError("");

//         let isValid = true;
//         if (!email) {
//             setEmailError("Email is required");
//             isValid = false;
//         }
//         if (!password) {
//             setPasswordError("Password is required");
//             isValid = false;
//         }

//         if (!isValid) return;

//         setLoading(true);

//         const payload = {
//             email: email,
//             password: password
//         };

//         try {
//             console.log("🚀 Login Request to:", API_LOGIN);

//             const response = await fetch(API_LOGIN, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(payload),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 setLoading(false);
//                 // Success Modal Show karein
//                 setShowSuccessModal(true);

//                 // Thodi der baad navigate karein (Optional, but looks good)
//                 setTimeout(() => {
//                     login(data); // Context update
//                 }, 1000);

//             } else {
//                 setLoading(false);
//                 // ❌ Popup Hata diya -> Inline Error Set karenge
//                 const errorMsg = data.detail || "Invalid credentials";

//                 // Agar backend se specific error pata chale to wahan dikhao, nahi to password ke niche
//                 if (errorMsg.toLowerCase().includes("email") || errorMsg.toLowerCase().includes("user")) {
//                     setEmailError("Invalid Email Address");
//                 } else {
//                     setPasswordError("Incorrect Email or Password");
//                 }
//             }
//         } catch (error) {
//             setLoading(false);
//             console.error("Login Error:", error);
//             // Network error ko global dikha sakte hain ya password ke niche
//             setPasswordError("Network Error. Please try again.");
//         }
//     };

//     // ✅ FIXED SIZE SCROLLBAR (Approx 1 inch / 40px)
//     const SCROLLBAR_HEIGHT = 40;
//     const indicatorSize = contentHeight > visibleHeight ? SCROLLBAR_HEIGHT : 0;
//     // Slow Speed (0.6 factor)
//     const indicatorPosition = contentHeight > visibleHeight
//         ? (scrollY / (contentHeight - visibleHeight)) * ((visibleHeight - indicatorSize - 40) * 0.6)
//         : 0;

//     return (
//         <View style={styles.mainContainer}>
//             <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

//             {/* --- 1. HEADER --- */}
//             <View style={styles.topSection}>
//                 <TouchableOpacity onPress={() => router.push("/login")} style={styles.backButton}>
//                     <Ionicons name="arrow-back" size={24} color="#000" />
//                 </TouchableOpacity>

//                 <Image
//                     source={require('../../assets/images/boys2.png')}
//                     style={styles.boyImage}
//                     resizeMode="contain"
//                 />
//             </View>

//             {/* --- 2. BOTTOM CARD --- */}
//             <View style={styles.bottomCard}>
//                 <KeyboardAvoidingView
//                     behavior={Platform.OS === "ios" ? "padding" : "height"}
//                     keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
//                     style={{ flex: 1 }}
//                 >
//                     <View style={{ flex: 1 }}>
//                         <ScrollView
//                             showsVerticalScrollIndicator={false} // System scrollbar hidden
//                             contentContainerStyle={{ paddingBottom: 150 }}
//                             keyboardShouldPersistTaps="handled"
//                             // ✅ Scroll Props
//                             onContentSizeChange={(w, h) => setContentHeight(h)}
//                             onLayout={(e) => setVisibleHeight(e.nativeEvent.layout.height)}
//                             onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
//                             scrollEventThrottle={16}
//                         >

//                             <Text style={styles.title}>Hello Again!</Text>
//                             <Text style={styles.subtitle}>Ready to dive back into knowledge?</Text>

//                             {/* Email Input */}
//                             <Text style={styles.label}>Email Address</Text>
//                             <View style={[styles.inputWrapper, emailError ? { borderColor: COLORS.error } : null]}>
//                                 <Ionicons name="mail-outline" size={20} color={COLORS.textSec} style={styles.icon} />
//                                 <TextInput
//                                     placeholder="example@gmail.com"
//                                     placeholderTextColor="#555"
//                                     style={styles.input}
//                                     value={email}
//                                     onChangeText={(text) => { setEmail(text); setEmailError(""); }} // Clear error on type
//                                     keyboardType="email-address"
//                                     autoCapitalize="none"
//                                 />
//                             </View>
//                             {/* ✅ Inline Error Text for Email */}
//                             {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

//                             {/* Password Input */}
//                             <Text style={styles.label}>Password</Text>
//                             <View style={[styles.inputWrapper, passwordError ? { borderColor: COLORS.error } : null]}>
//                                 <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSec} style={styles.icon} />
//                                 <TextInput
//                                     placeholder="••••••••"
//                                     placeholderTextColor="#555"
//                                     style={styles.input}
//                                     value={password}
//                                     onChangeText={(text) => { setPassword(text); setPasswordError(""); }} // Clear error on type
//                                     secureTextEntry
//                                 />
//                             </View>
//                             {/* ✅ Inline Error Text for Password */}
//                             {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

//                             {/* Forgot Password */}
//                             <TouchableOpacity onPress={() => router.push("/forgot-password")} style={styles.forgotBtn}>
//                                 <Text style={styles.forgotText}>Forgot Password?</Text>
//                             </TouchableOpacity>

//                             {/* Login Button */}
//                             <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
//                                 {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Log In</Text>}
//                             </TouchableOpacity>

//                         </ScrollView>

//                         {/* ✅ CUSTOM SMALL SCROLLBAR */}
//                         {indicatorSize > 0 && (
//                             <View style={styles.customTrack}>
//                                 <View
//                                     style={[
//                                         styles.customThumb,
//                                         {
//                                             height: indicatorSize,
//                                             transform: [{ translateY: indicatorPosition }]
//                                         }
//                                     ]}
//                                 />
//                             </View>
//                         )}
//                     </View>
//                 </KeyboardAvoidingView>
//             </View>

//             {/* ✅ 3. SUCCESS MODAL ONLY (No Error Popup) */}
//             <Modal
//                 animationType="fade"
//                 transparent={true}
//                 visible={showSuccessModal}
//                 onRequestClose={() => { }} // Block back button close
//             >
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContainer}>
//                         <View style={styles.modalIconContainer}>
//                             <Ionicons name="checkmark-sharp" size={40} color="#000" />
//                         </View>

//                         <Text style={styles.modalTitle}>Login Successful!</Text>
//                         <Text style={styles.modalMessage}>Welcome back, Redirecting to home...</Text>

//                         {/* Button hataya kyunki auto-redirect hai, lekin agar user fas jaye to: */}
//                         <TouchableOpacity
//                             style={styles.modalBtn}
//                             onPress={() => { setShowSuccessModal(false); router.replace("/(tabs)"); }}
//                         >
//                             <Text style={styles.modalBtnText}>Continue</Text>
//                             <Ionicons name="arrow-forward" size={18} color="#000" style={{ marginLeft: 5 }} />
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>

//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     mainContainer: { flex: 1, backgroundColor: COLORS.bg },
//     topSection: { height: 350, justifyContent: 'flex-end', alignItems: 'center', position: 'relative', zIndex: 1 },
//     backButton: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', zIndex: 20 },
//     boyImage: { width: 660, height: 650, marginBottom: -200, zIndex: 10 },
//     bottomCard: { flex: 1, backgroundColor: COLORS.card, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 24, marginTop: -80, paddingTop: 80 },
//     title: { fontSize: 28, fontWeight: "800", color: COLORS.textMain, textAlign: 'center', marginBottom: 8 },
//     subtitle: { fontSize: 16, color: COLORS.textSec, textAlign: 'center', marginBottom: 30 },
//     label: { color: COLORS.textMain, fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 },

//     // ✅ Input Wrapper with logic for Border Color
//     inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, height: 54, marginBottom: 5 }, // Margin kam kiya taaki error text pass rahe
//     icon: { marginRight: 10 },
//     input: { flex: 1, color: "#fff", fontSize: 16 },

//     // ✅ New Error Text Style
//     errorText: { color: COLORS.error, fontSize: 13, marginBottom: 15, marginLeft: 4, fontWeight: '500' },

//     forgotBtn: { alignSelf: 'flex-end', marginBottom: 24, marginTop: 5 },
//     forgotText: { color: COLORS.accent, fontWeight: "600", fontSize: 14 },
//     btn: { backgroundColor: COLORS.accent, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
//     btnText: { color: "#000", fontSize: 18, fontWeight: "bold" },
//     footer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
//     footerText: { color: COLORS.textSec, fontSize: 15 },
//     linkText: { color: COLORS.accent, fontWeight: "bold", fontSize: 15 },

//     // ✅ CUSTOM SCROLLBAR STYLES
//     customTrack: {
//         position: 'absolute',
//         right: 6,
//         top: 20,
//         bottom: 20,
//         width: 4,
//         backgroundColor: 'transparent',
//         zIndex: 999
//     },
//     customThumb: {
//         width: 4,
//         backgroundColor: COLORS.accent,
//         borderRadius: 4,
//         opacity: 0.8
//     },

//     // ✅ MODAL STYLES
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.85)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     modalContainer: {
//         width: '85%',
//         backgroundColor: '#1a1a1a',
//         borderRadius: 25,
//         padding: 30,
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#333',
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 10 },
//         shadowOpacity: 0.5,
//         shadowRadius: 20,
//         elevation: 10,
//     },
//     modalIconContainer: {
//         width: 70,
//         height: 70,
//         backgroundColor: COLORS.accent,
//         borderRadius: 35,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 20,
//         shadowColor: COLORS.accent,
//         shadowOpacity: 0.4,
//         shadowRadius: 10,
//         elevation: 10
//     },
//     modalTitle: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         color: '#fff',
//         marginBottom: 10,
//         textAlign: 'center'
//     },
//     modalMessage: {
//         fontSize: 15,
//         color: '#ccc',
//         textAlign: 'center',
//         marginBottom: 25,
//         lineHeight: 22
//     },
//     modalBtn: {
//         backgroundColor: COLORS.accent,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 14,
//         paddingHorizontal: 30,
//         borderRadius: 12,
//         width: '100%'
//     },
//     modalBtnText: {
//         color: '#000',
//         fontSize: 16,
//         fontWeight: 'bold'
//     }
// });

import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Easing,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { useAuth } from "../../context/AuthContext";

const { width, height } = Dimensions.get("window");

const URL_PHONE = process.env.EXPO_PUBLIC_API_URL_PHONE;
const URL_ANDROID = process.env.EXPO_PUBLIC_API_URL_ANDROID;
const URL_PROD = process.env.EXPO_PUBLIC_API_URL_PROD; // Real Domain (HTTPS)

const getBaseUrl = () => {
    if (!__DEV__ && URL_PROD) return URL_PROD;
    return Device.isDevice ? URL_PHONE : URL_ANDROID;
};

const BASE_URL = getBaseUrl();
const API_LOGIN = `${BASE_URL}/auth/login`;

const COLORS = {
    bgMain: "#050505",
    cardBg: "#0f0f0f",
    textMain: "#FFFFFF",
    textSec: "#888888",
    inputBg: "#1a1a1a",
    accent: "#00E096",
    border: "#333333",
    error: "#ff4757"
};

export default function LoginRealWorldScreen() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Animation Logic
    const scaleValue = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleValue, { toValue: 1.1, duration: 10000, easing: Easing.linear, useNativeDriver: true }),
                Animated.timing(scaleValue, { toValue: 1, duration: 10000, easing: Easing.linear, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const handleLogin = async () => {
        setEmailError(""); setPasswordError("");
        let isValid = true;
        if (!email) { setEmailError("Email is required"); isValid = false; }
        if (!password) { setPasswordError("Password is required"); isValid = false; }
        if (!isValid) return;

        setLoading(true);
        try {
            const response = await fetch(API_LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                setLoading(false);
                setShowSuccessModal(true);

                // 👇 FIXED: Passing (User Data, Token) explicitly
                setTimeout(() => {
                    login(data, data.access_token || data.token);
                }, 1000);

            } else {
                setLoading(false);
                const errorMsg = data.detail || "Invalid credentials";
                if (errorMsg.toLowerCase().includes("email")) setEmailError("Invalid Email Address");
                else setPasswordError("Incorrect Email or Password");
            }
        } catch (error) {
            setLoading(false);
            setPasswordError("Network Error. Please try again.");
        }
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View>
                            {/* ---------------- 1. TOP SECTION (Fixed Height) ---------------- */}
                            <View style={styles.topSection}>
                                <Animated.Image
                                    source={{ uri: 'https://cdn.pixabay.com/photo/2023/02/07/18/56/rocket-7774875_1280.png' }}
                                    style={[styles.headerImage, { transform: [{ scale: scaleValue }] }]}
                                    resizeMode="cover"
                                />
                                <View style={styles.overlay} />

                                <SafeAreaView style={styles.safeArea}>
                                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                        <Ionicons name="arrow-back" size={24} color="#fff" />
                                    </TouchableOpacity>
                                </SafeAreaView>

                                <View style={styles.taglineContainer}>
                                    <Text style={styles.brandName}>Knowly</Text>
                                    <Text style={styles.tagline}>Knowledge, Reimagined.</Text>
                                </View>
                            </View>

                            {/* ---------------- 2. BOTTOM SECTION (Form) ---------------- */}
                            <View style={styles.bottomSection}>
                                <View style={styles.dragIndicatorCenter}>
                                    <View style={styles.dragIndicator} />
                                </View>

                                <Text style={styles.titleText}>Welcome Back</Text>
                                <Text style={styles.subtitleText}>Enter your details below to access your courses.</Text>

                                {/* FORM FIELDS */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Email</Text>
                                    <View style={[styles.inputWrapper, emailError && styles.inputError]}>
                                        <Ionicons name="mail-outline" size={20} color={COLORS.textSec} />
                                        <TextInput
                                            placeholder="student@knowly.com"
                                            placeholderTextColor="#555"
                                            style={styles.input}
                                            value={email}
                                            onChangeText={(t) => { setEmail(t); setEmailError("") }}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                        />
                                    </View>
                                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                                    <Text style={styles.label}>Password</Text>
                                    <View style={[styles.inputWrapper, passwordError && styles.inputError]}>
                                        <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSec} />
                                        <TextInput
                                            placeholder="••••••••"
                                            placeholderTextColor="#555"
                                            style={styles.input}
                                            value={password}
                                            onChangeText={(t) => { setPassword(t); setPasswordError("") }}
                                            secureTextEntry
                                        />
                                    </View>
                                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                                    <TouchableOpacity onPress={() => router.push("/forgot-password")} style={styles.forgotBtn}>
                                        <Text style={styles.forgotText}>Forgot Password?</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* BUTTONS */}
                                <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
                                    {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.loginBtnText}>Log In</Text>}
                                </TouchableOpacity>

                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>Don't have an account? </Text>
                                    <TouchableOpacity onPress={() => router.push("/signup")}>
                                        <Text style={styles.signupText}>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Extra padding for scrolling space at bottom */}
                                <View style={{ height: 50 }} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Success Modal */}
            <Modal animationType="fade" transparent={true} visible={showSuccessModal}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Ionicons name="checkmark-circle" size={50} color={COLORS.accent} />
                        <Text style={styles.modalTitle}>Welcome!</Text>
                        <Text style={styles.modalMessage}>Logging you in...</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.bgMain,
    },
    // --- TOP SECTION ---
    topSection: {
        height: height * 0.5, // 50% height
        width: '100%',
        position: 'relative',
    },
    headerImage: { width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
    safeArea: { position: 'absolute', top: 0, left: 0, zIndex: 10 },
    backButton: {
        marginTop: Platform.OS === 'android' ? 40 : 10,
        marginLeft: 20,
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'
    },
    taglineContainer: { position: 'absolute', bottom: 40, left: 24 },
    brandName: { fontSize: 40, fontWeight: '800', color: '#fff', letterSpacing: 1 },
    tagline: { fontSize: 20, color: '#ddd', marginTop: 4, fontWeight: '500' },

    // --- BOTTOM SECTION ---
    bottomSection: {
        backgroundColor: COLORS.cardBg,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -25, // Overlap effect maintain kiya hai
        paddingHorizontal: 24,
        paddingTop: 10,
        minHeight: height * 0.5, // Min height di hai taaki scroll karne pe bhi content dikhe
        paddingBottom: 20
    },
    dragIndicatorCenter: { alignItems: 'center', marginBottom: 10, marginTop: 10 },
    dragIndicator: { width: 40, height: 4, backgroundColor: '#333', borderRadius: 2 },

    titleText: { fontSize: 24, fontWeight: '700', color: COLORS.textMain, marginTop: 5 },
    subtitleText: { fontSize: 14, color: COLORS.textSec, marginTop: 5, marginBottom: 20 },

    inputContainer: { marginBottom: 10 },
    label: { fontSize: 14, color: COLORS.textMain, marginBottom: 8, fontWeight: '600', marginLeft: 4 },
    inputWrapper: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.inputBg, borderRadius: 12, height: 50,
        paddingHorizontal: 15, marginBottom: 15,
        borderWidth: 1, borderColor: COLORS.border,
    },
    inputError: { borderColor: COLORS.error },
    input: { flex: 1, marginLeft: 10, color: '#fff', fontSize: 16 },
    errorText: { color: COLORS.error, fontSize: 12, marginTop: -10, marginBottom: 10, marginLeft: 4 },

    forgotBtn: { alignSelf: 'flex-end', marginBottom: 20 },
    forgotText: { color: COLORS.accent, fontWeight: '600', fontSize: 14 },

    loginBtn: {
        backgroundColor: COLORS.accent, height: 52, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    },
    loginBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },

    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    footerText: { color: COLORS.textSec, fontSize: 14 },
    signupText: { color: COLORS.accent, fontWeight: 'bold', fontSize: 14 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: {
        width: '80%', backgroundColor: COLORS.inputBg, padding: 24,
        borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
    },
    modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 15, marginBottom: 8 },
    modalMessage: { fontSize: 16, color: COLORS.textSec, textAlign: 'center' }
});