

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

// const { width } = Dimensions.get("window");

// // ---------------- API CONFIGURATION ----------------
// const BASE_URL = Device.isDevice
//     ? process.env.EXPO_PUBLIC_API_URL_PHONE
//     : process.env.EXPO_PUBLIC_API_URL_EMULATOR;

// const API_SIGNUP = `${BASE_URL}/auth/signup`;

// // ✅ THEME CONFIG
// const COLORS = {
//     bg: "#00e096",
//     card: "#000000",
//     textMain: "#FFFFFF",
//     textSec: "#9ca3af",
//     inputBg: "#1a1a1a",
//     accent: "#00e096",
//     border: "#333"
// };

// export default function SignupScreen() {
//     const router = useRouter();
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);

//     // ✅ State for Custom Modal
//     const [showSuccessModal, setShowSuccessModal] = useState(false);
//     const [modalMessage, setModalMessage] = useState("");
//     const [isError, setIsError] = useState(false);

//     // ✅ Custom Scrollbar Logic
//     const [contentHeight, setContentHeight] = useState(1);
//     const [visibleHeight, setVisibleHeight] = useState(0);
//     const [scrollY, setScrollY] = useState(0);

//     const handleSignup = async () => {
//         if (!name || !email || !password) {
//             setModalMessage("Please fill in all fields.");
//             setIsError(true);
//             setShowSuccessModal(true);
//             return;
//         }
//         setLoading(true);

//         const parts = name.trim().split(/\s+/);
//         const first_name = parts[0];
//         const last_name = parts.length > 1 ? parts[parts.length - 1] : "";
//         const middle_name = parts.length > 2 ? parts.slice(1, -1).join(" ") : "";

//         const payload = {
//             first_name: first_name,
//             middle_name: middle_name,
//             last_name: last_name,
//             email: email,
//             password: password,
//             confirm_password: password
//         };

//         try {
//             console.log("🚀 Signup Request to:", API_SIGNUP);

//             const response = await fetch(API_SIGNUP, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(payload),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 setLoading(false);
//                 setIsError(false);
//                 setModalMessage(data.message || "Account Created Successfully!");
//                 setShowSuccessModal(true);
//             } else {
//                 setLoading(false);
//                 setIsError(true);
//                 const errorMessage = data.detail ? JSON.stringify(data.detail) : (data.message || "Signup failed");
//                 setModalMessage(errorMessage);
//                 setShowSuccessModal(true);
//             }
//         } catch (error) {
//             setLoading(false);
//             setIsError(true);
//             setModalMessage("Network Error: Could not connect to server.");
//             setShowSuccessModal(true);
//         }
//     };

//     // ✅ FIXED SIZE SCROLLBAR (Approx 1 inch / 40px)
//     const SCROLLBAR_HEIGHT = 40;
//     const indicatorSize = contentHeight > visibleHeight ? SCROLLBAR_HEIGHT : 0;
//     const indicatorPosition = contentHeight > visibleHeight
//         ? (scrollY / (contentHeight - visibleHeight)) * ((visibleHeight - indicatorSize - 40) * 0.6)
//         : 0;

//     return (
//         <View style={styles.mainContainer}>
//             <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

//             {/* --- 1. HEADER --- */}
//             <View style={styles.topSection}>
//                 <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
//                     keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 100}
//                     style={{ flex: 1 }}
//                 >
//                     <View style={{ flex: 1 }}>
//                         <ScrollView
//                             showsVerticalScrollIndicator={false}
//                             contentContainerStyle={{
//                                 paddingHorizontal: 24,
//                                 paddingBottom: 200
//                             }}
//                             keyboardShouldPersistTaps="handled"
//                             onContentSizeChange={(w, h) => setContentHeight(h)}
//                             onLayout={(e) => setVisibleHeight(e.nativeEvent.layout.height)}
//                             onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
//                             scrollEventThrottle={16}
//                         >
//                             <Text style={styles.title}>Ready to Learn?</Text>
//                             <Text style={styles.subtitle}>Create an account to unlock Knowly!</Text>

//                             {/* Name Input */}
//                             <Text style={styles.label}>Full Name</Text>
//                             <View style={styles.inputWrapper}>
//                                 <Ionicons name="person-outline" size={20} color={COLORS.textSec} style={styles.icon} />
//                                 <TextInput
//                                     placeholder="Rahul Prasad Yadav"
//                                     placeholderTextColor="#555"
//                                     style={styles.input}
//                                     value={name}
//                                     onChangeText={setName}
//                                 />
//                             </View>

//                             {/* Email Input */}
//                             <Text style={styles.label}>Email Address</Text>
//                             <View style={styles.inputWrapper}>
//                                 <Ionicons name="mail-outline" size={20} color={COLORS.textSec} style={styles.icon} />
//                                 <TextInput
//                                     placeholder="example@gmail.com"
//                                     placeholderTextColor="#555"
//                                     style={styles.input}
//                                     value={email}
//                                     onChangeText={setEmail}
//                                     keyboardType="email-address"
//                                     autoCapitalize="none"
//                                 />
//                             </View>

//                             {/* Password Input */}
//                             <Text style={styles.label}>Password</Text>
//                             <View style={styles.inputWrapper}>
//                                 <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSec} style={styles.icon} />
//                                 <TextInput
//                                     placeholder="••••••••"
//                                     placeholderTextColor="#555"
//                                     style={styles.input}
//                                     value={password}
//                                     onChangeText={setPassword}
//                                     secureTextEntry
//                                 />
//                             </View>

//                             {/* Signup Button */}
//                             <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={loading}>
//                                 {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Sign Up</Text>}
//                             </TouchableOpacity>

//                             {/* Footer */}
//                             <View style={styles.footer}>
//                                 <Text style={styles.footerText}>Already have an account? </Text>
//                                 <TouchableOpacity onPress={() => router.push("/login1")}>
//                                     <Text style={styles.linkText}>Log In</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </ScrollView>

//                         {/* ✅ CUSTOM SCROLLBAR */}
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

//             {/* ✅ 3. DYNAMIC MODAL (With Login Button for Error) */}
//             <Modal
//                 animationType="fade"
//                 transparent={true}
//                 visible={showSuccessModal}
//                 onRequestClose={() => setShowSuccessModal(false)}
//             >
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContainer}>
//                         {/* Dynamic Icon */}
//                         <View style={[styles.modalIconContainer, isError && { backgroundColor: '#ff4757' }]}>
//                             <Ionicons
//                                 name={isError ? "alert-outline" : "checkmark-sharp"}
//                                 size={40}
//                                 color={isError ? "#fff" : "#000"}
//                             />
//                         </View>

//                         {/* Dynamic Title */}
//                         <Text style={styles.modalTitle}>
//                             {isError ? "Oops!" : "Verification Sent!"}
//                         </Text>

//                         {/* Dynamic Message */}
//                         <Text style={styles.modalMessage}>
//                             {isError
//                                 ? modalMessage
//                                 : <Text>We've sent a One-Time Password (OTP) to <Text style={{ color: COLORS.accent }}>{email}</Text>. Please verify.</Text>
//                             }
//                         </Text>

//                         {/* ✅ ACTION BUTTONS */}
//                         {isError ? (
//                             // Error State: Show "Log In" AND "Try Again"
//                             <View style={{ width: '100%', gap: 12 }}>
//                                 {/* LOG IN BUTTON (Green) */}
//                                 <TouchableOpacity
//                                     style={styles.modalBtn}
//                                     onPress={() => { setShowSuccessModal(false); router.push("/login1"); }}
//                                 >
//                                     <Text style={styles.modalBtnText}>Log In</Text>
//                                     <Ionicons name="log-in-outline" size={20} color="#000" style={{ marginLeft: 5 }} />
//                                 </TouchableOpacity>

//                                 {/* TRY AGAIN BUTTON (Dark) */}
//                                 <TouchableOpacity
//                                     style={[styles.modalBtn, { backgroundColor: '#333' }]}
//                                     onPress={() => setShowSuccessModal(false)}
//                                 >
//                                     <Text style={[styles.modalBtnText, { color: '#fff' }]}>Try Again</Text>
//                                     <Ionicons name="refresh" size={18} color="#fff" style={{ marginLeft: 5 }} />
//                                 </TouchableOpacity>
//                             </View>
//                         ) : (
//                             // Success State: Show "Verify Now"
//                             <TouchableOpacity
//                                 style={styles.modalBtn}
//                                 onPress={() => { setShowSuccessModal(false); router.push({ pathname: "/verify-otp", params: { email: email } }); }}
//                             >
//                                 <Text style={styles.modalBtnText}>Verify Now</Text>
//                                 <Ionicons name="arrow-forward" size={18} color="#000" style={{ marginLeft: 5 }} />
//                             </TouchableOpacity>
//                         )}
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

//     bottomCard: {
//         flex: 1,
//         backgroundColor: COLORS.card,
//         borderTopLeftRadius: 30,
//         borderTopRightRadius: 30,
//         marginTop: -80,
//         paddingTop: 80
//     },

//     title: { fontSize: 28, fontWeight: "800", color: COLORS.textMain, textAlign: 'center', marginBottom: 8 },
//     subtitle: { fontSize: 16, color: COLORS.textSec, textAlign: 'center', marginBottom: 30 },
//     label: { color: COLORS.textMain, fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
//     inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, height: 54, marginBottom: 20 },
//     icon: { marginRight: 10 },
//     input: { flex: 1, color: "#fff", fontSize: 16 },
//     btn: { backgroundColor: COLORS.accent, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 20, shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
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




// import { Ionicons } from "@expo/vector-icons";
// import * as Device from "expo-device";
// import { useRouter } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     Animated,
//     Dimensions,
//     Easing,
//     Keyboard,
//     KeyboardAvoidingView,
//     Modal,
//     Platform,
//     SafeAreaView,
//     ScrollView,
//     StatusBar,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     TouchableWithoutFeedback,
//     View
// } from "react-native";

// const { width, height } = Dimensions.get("window");

// // ---------------- API CONFIGURATION ----------------
// const BASE_URL = Device.isDevice
//     ? process.env.EXPO_PUBLIC_API_URL_PHONE
//     : process.env.EXPO_PUBLIC_API_URL_EMULATOR;
// const API_SIGNUP = `${BASE_URL}/auth/signup`;

// // ✅ THEME CONFIG (Same as Login)
// const COLORS = {
//     bgMain: "#050505",
//     cardBg: "#0f0f0f",
//     textMain: "#FFFFFF",
//     textSec: "#888888",
//     inputBg: "#1a1a1a",
//     accent: "#00E096",
//     border: "#333333",
//     error: "#ff4757"
// };

// export default function SignupRealWorldScreen() {
//     const router = useRouter();

//     // --- State ---
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);

//     // Modal State
//     const [showSuccessModal, setShowSuccessModal] = useState(false);
//     const [modalMessage, setModalMessage] = useState("");
//     const [isError, setIsError] = useState(false);

//     // --- Animation Logic (Breathing Effect) ---
//     const scaleValue = useRef(new Animated.Value(1)).current;

//     useEffect(() => {
//         Animated.loop(
//             Animated.sequence([
//                 Animated.timing(scaleValue, { toValue: 1.1, duration: 10000, easing: Easing.linear, useNativeDriver: true }),
//                 Animated.timing(scaleValue, { toValue: 1, duration: 10000, easing: Easing.linear, useNativeDriver: true }),
//             ])
//         ).start();
//     }, []);

//     // --- Signup Logic ---
//     const handleSignup = async () => {
//         if (!name || !email || !password) {
//             setModalMessage("Please fill in all fields.");
//             setIsError(true);
//             setShowSuccessModal(true);
//             return;
//         }
//         setLoading(true);

//         const parts = name.trim().split(/\s+/);
//         const first_name = parts[0];
//         const last_name = parts.length > 1 ? parts[parts.length - 1] : "";
//         const middle_name = parts.length > 2 ? parts.slice(1, -1).join(" ") : "";

//         const payload = {
//             first_name,
//             middle_name,
//             last_name,
//             email,
//             password,
//             confirm_password: password
//         };

//         try {
//             const response = await fetch(API_SIGNUP, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(payload),
//             });
//             const data = await response.json();

//             if (response.ok) {
//                 setLoading(false);
//                 setIsError(false);
//                 setModalMessage(data.message || "Account Created Successfully!");
//                 setShowSuccessModal(true);
//             } else {
//                 setLoading(false);
//                 setIsError(true);
//                 const errorMessage = data.detail ? JSON.stringify(data.detail) : (data.message || "Signup failed");
//                 setModalMessage(errorMessage);
//                 setShowSuccessModal(true);
//             }
//         } catch (error) {
//             setLoading(false);
//             setIsError(true);
//             setModalMessage("Network Error: Could not connect to server.");
//             setShowSuccessModal(true);
//         }
//     };

//     return (
//         <View style={styles.mainContainer}>
//             <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

//             {/* ✅ Full Screen Handling for Keyboard */}
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === "ios" ? "padding" : "height"}
//                 style={{ flex: 1 }}
//                 keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
//             >
//                 <ScrollView
//                     contentContainerStyle={{ flexGrow: 1 }}
//                     bounces={false}
//                     showsVerticalScrollIndicator={false}
//                     keyboardShouldPersistTaps="handled"
//                 >
//                     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//                         <View>
//                             {/* ---------------- 1. TOP SECTION (Animated Image) ---------------- */}
//                             <View style={styles.topSection}>
//                                 <Animated.Image
//                                     // Using a slightly different 'Connecting Nodes' image for Signup
//                                     source={require('../../assets/images/tech1.png')}

//                                     style={[
//                                         styles.headerImage,
//                                         { transform: [{ scale: scaleValue }] }
//                                     ]}
//                                     resizeMode="cover"
//                                 />
//                                 <View style={styles.overlay} />

//                                 <SafeAreaView style={styles.safeArea}>
//                                     <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//                                         <Ionicons name="arrow-back" size={24} color="#fff" />
//                                     </TouchableOpacity>
//                                 </SafeAreaView>

//                                 <View style={styles.taglineContainer}>
//                                     <Text style={styles.brandName}>Join Knowly</Text>
//                                     <Text style={styles.tagline}>Start your journey today.</Text>
//                                 </View>
//                             </View>

//                             {/* ---------------- 2. BOTTOM SECTION (Form) ---------------- */}
//                             <View style={styles.bottomSection}>
//                                 <View style={styles.dragIndicatorCenter}>
//                                     <View style={styles.dragIndicator} />
//                                 </View>

//                                 <Text style={styles.titleText}>Create Account</Text>
//                                 <Text style={styles.subtitleText}>Sign up to unlock personalized learning.</Text>

//                                 {/* FORM FIELDS */}
//                                 <View style={styles.inputContainer}>

//                                     {/* Name Input */}
//                                     <Text style={styles.label}>Full Name</Text>
//                                     <View style={styles.inputWrapper}>
//                                         <Ionicons name="person-outline" size={20} color={COLORS.textSec} />
//                                         <TextInput
//                                             placeholder="Rahul Prasad Yadav"
//                                             placeholderTextColor="#555"
//                                             style={styles.input}
//                                             value={name}
//                                             onChangeText={setName}
//                                         />
//                                     </View>

//                                     {/* Email Input */}
//                                     <Text style={styles.label}>Email Address</Text>
//                                     <View style={styles.inputWrapper}>
//                                         <Ionicons name="mail-outline" size={20} color={COLORS.textSec} />
//                                         <TextInput
//                                             placeholder="student@knowly.com"
//                                             placeholderTextColor="#555"
//                                             style={styles.input}
//                                             value={email}
//                                             onChangeText={setEmail}
//                                             autoCapitalize="none"
//                                             keyboardType="email-address"
//                                         />
//                                     </View>

//                                     {/* Password Input */}
//                                     <Text style={styles.label}>Password</Text>
//                                     <View style={styles.inputWrapper}>
//                                         <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSec} />
//                                         <TextInput
//                                             placeholder="••••••••"
//                                             placeholderTextColor="#555"
//                                             style={styles.input}
//                                             value={password}
//                                             onChangeText={setPassword}
//                                             secureTextEntry
//                                         />
//                                     </View>
//                                 </View>

//                                 {/* BUTTONS */}
//                                 <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} disabled={loading}>
//                                     {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.signupBtnText}>Sign Up</Text>}
//                                 </TouchableOpacity>

//                                 <View style={styles.footer}>
//                                     <Text style={styles.footerText}>Already have an account? </Text>
//                                     <TouchableOpacity onPress={() => router.push("/login1")}>
//                                         <Text style={styles.linkText}>Log In</Text>
//                                     </TouchableOpacity>
//                                 </View>

//                                 {/* Extra padding for scroll */}
//                                 <View style={{ height: 60 }} />
//                             </View>
//                         </View>
//                     </TouchableWithoutFeedback>
//                 </ScrollView>
//             </KeyboardAvoidingView>

//             {/* ---------------- 3. MODAL (Dynamic) ---------------- */}
//             <Modal animationType="fade" transparent={true} visible={showSuccessModal} onRequestClose={() => setShowSuccessModal(false)}>
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContainer}>
//                         <Ionicons
//                             name={isError ? "alert-circle" : "checkmark-circle"}
//                             size={50}
//                             color={isError ? COLORS.error : COLORS.accent}
//                             style={{ marginBottom: 15 }}
//                         />
//                         <Text style={styles.modalTitle}>{isError ? "Oops!" : "Account Created!"}</Text>
//                         <Text style={styles.modalMessage}>
//                             {isError ? modalMessage : `Verification OTP sent to ${email}.`}
//                         </Text>

//                         {isError ? (
//                             <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#333' }]} onPress={() => setShowSuccessModal(false)}>
//                                 <Text style={[styles.modalBtnText, { color: '#fff' }]}>Try Again</Text>
//                             </TouchableOpacity>
//                         ) : (
//                             <TouchableOpacity style={styles.modalBtn} onPress={() => { setShowSuccessModal(false); router.push({ pathname: "/verify-otp", params: { email: email } }); }}>
//                                 <Text style={styles.modalBtnText}>Verify OTP</Text>
//                                 <Ionicons name="arrow-forward" size={18} color="#000" style={{ marginLeft: 5 }} />
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     mainContainer: {
//         flex: 1,
//         backgroundColor: COLORS.bgMain,
//     },

//     // --- TOP SECTION ---
//     topSection: {
//         height: height * 0.5,
//         width: '100%',
//         position: 'relative',
//     },
//     headerImage: { width: '100%', height: '100%' },
//     overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' }, // Thoda dark kiya text ke liye
//     safeArea: { position: 'absolute', top: 0, left: 0, zIndex: 10 },
//     backButton: {
//         marginTop: Platform.OS === 'android' ? 40 : 10,
//         marginLeft: 20,
//         width: 40, height: 40, borderRadius: 20,
//         backgroundColor: 'rgba(255,255,255,0.1)',
//         alignItems: 'center', justifyContent: 'center',
//         borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'
//     },
//     taglineContainer: { position: 'absolute', bottom: 40, left: 24 },
//     brandName: { fontSize: 49, fontWeight: '800', color: '#fff', letterSpacing: 1 },
//     tagline: { fontSize: 20, marginTop: 4, color: '#fff', fontWeight: '600', letterSpacing: 0.5 },

//     // --- BOTTOM SECTION ---
//     bottomSection: {
//         backgroundColor: COLORS.cardBg,
//         borderTopLeftRadius: 30,
//         borderTopRightRadius: 30,
//         marginTop: -25,
//         paddingHorizontal: 24,
//         paddingTop: 10,
//         minHeight: height * 0.6, // Thoda extra height kyunki signup form bada hai
//     },
//     dragIndicatorCenter: { alignItems: 'center', marginBottom: 10, marginTop: 10 },
//     dragIndicator: { width: 40, height: 4, backgroundColor: '#333', borderRadius: 2 },

//     titleText: { fontSize: 24, fontWeight: '700', color: COLORS.textMain, marginTop: 5 },
//     subtitleText: { fontSize: 14, color: COLORS.textSec, marginTop: 5, marginBottom: 25 },

//     inputContainer: { marginBottom: 10 },
//     label: { fontSize: 14, color: COLORS.textMain, marginBottom: 8, fontWeight: '600', marginLeft: 4 },
//     inputWrapper: {
//         flexDirection: 'row', alignItems: 'center',
//         backgroundColor: COLORS.inputBg, borderRadius: 12, height: 50,
//         paddingHorizontal: 15, marginBottom: 15,
//         borderWidth: 1, borderColor: COLORS.border,
//     },
//     input: { flex: 1, marginLeft: 10, color: '#fff', fontSize: 16 },

//     signupBtn: {
//         backgroundColor: COLORS.accent, height: 52, borderRadius: 12,
//         alignItems: 'center', justifyContent: 'center', marginBottom: 20, marginTop: 5
//     },
//     signupBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },

//     footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
//     footerText: { color: COLORS.textSec, fontSize: 14 },
//     linkText: { color: COLORS.accent, fontWeight: 'bold', fontSize: 14 },

//     // Modal
//     modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
//     modalContainer: {
//         width: '80%', backgroundColor: COLORS.inputBg, padding: 24,
//         borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
//     },
//     modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 10, marginBottom: 8 },
//     modalMessage: { fontSize: 16, color: COLORS.textSec, textAlign: 'center', marginBottom: 20 },
//     modalBtn: {
//         backgroundColor: COLORS.accent, paddingVertical: 12, paddingHorizontal: 24,
//         borderRadius: 10, flexDirection: 'row', alignItems: 'center'
//     },
//     modalBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' }
// });

import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device"; // 👈 Ye add karo
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

const { width, height } = Dimensions.get("window");

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
const API_SIGNUP = `${BASE_URL}/auth/signup`;

console.log("🚀 Signup API URL:", API_SIGNUP); // Debug log

async function parseApiResponse(response: Response) {
    const body = await response.text();

    try {
        return JSON.parse(body);
    } catch {
        console.error("Non-JSON signup response:", response.status, body);
        throw new Error(`Server returned an invalid response (${response.status}): ${body.slice(0, 160)}`);
    }
}

// ✅ THEME CONFIG
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

export default function SignupRealWorldScreen() {
    const router = useRouter();

    // --- State ---
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ FIXED: Added <any> to prevent TypeScript errors
    const [errors, setErrors] = useState<any>({});

    // Modal State
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isError, setIsError] = useState(false);

    // --- Animation Logic ---
    const scaleValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleValue, { toValue: 1.1, duration: 10000, easing: Easing.linear, useNativeDriver: true }),
                Animated.timing(scaleValue, { toValue: 1, duration: 10000, easing: Easing.linear, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    // --- Signup Logic ---
    const handleSignup = async () => {
        let newErrors: any = {};

        if (!name.trim()) newErrors.name = true;
        if (!email.trim()) newErrors.email = true;
        if (!password.trim()) newErrors.password = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        // Name Split Logic
        const parts = name.trim().split(/\s+/);
        const first_name = parts[0];
        const last_name = parts.length > 1 ? parts[parts.length - 1] : "";
        const middle_name = parts.length > 2 ? parts.slice(1, -1).join(" ") : "";

        const payload = {
            first_name,
            middle_name,
            last_name,
            email,
            password,
            confirm_password: password
        };

        console.log("📡 Sending Request to:", API_SIGNUP);
        console.log("📦 Payload:", JSON.stringify(payload, null, 2));

        try {
            const response = await fetch(API_SIGNUP, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            console.log("🔄 Response Status:", response.status);

            const data = await parseApiResponse(response);
            console.log("✅ Response Data:", data);

            if (response.ok) {
                setLoading(false);
                setIsError(false);
                setModalMessage(data.message || "Account Created Successfully!");
                setShowSuccessModal(true);
            } else {
                setLoading(false);
                setIsError(true);
                // Handle Pydantic Validation Errors (Detail array)
                const errorMessage = data.detail
                    ? (Array.isArray(data.detail) ? data.detail[0].msg : JSON.stringify(data.detail))
                    : (data.message || "Signup failed");

                setModalMessage(errorMessage);
                setShowSuccessModal(true);
            }
        } catch (error: any) {
            console.error("❌ Network Error:", error);
            setLoading(false);
            setIsError(true);
            setModalMessage(error.message || "Could not connect to the server. Check the API URL and backend.");
            setShowSuccessModal(true);
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
                            {/* ---------------- 1. TOP SECTION ---------------- */}
                            <View style={styles.topSection}>
                                <Animated.Image
                                    source={require('../../assets/images/tech1.png')}
                                    style={[
                                        styles.headerImage,
                                        { transform: [{ scale: scaleValue }] }
                                    ]}
                                    resizeMode="cover"
                                />
                                <View style={styles.overlay} />

                                <SafeAreaView style={styles.safeArea}>
                                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                        <Ionicons name="arrow-back" size={24} color="#fff" />
                                    </TouchableOpacity>
                                </SafeAreaView>

                                <View style={styles.taglineContainer}>
                                    <Text style={styles.brandName}>Join Knowly</Text>
                                    <Text style={styles.tagline}>Start your journey today.</Text>
                                </View>
                            </View>

                            {/* ---------------- 2. BOTTOM SECTION ---------------- */}
                            <View style={styles.bottomSection}>
                                <View style={styles.dragIndicatorCenter}>
                                    <View style={styles.dragIndicator} />
                                </View>

                                <Text style={styles.titleText}>Create Account</Text>
                                <Text style={styles.subtitleText}>Sign up to unlock personalized learning.</Text>

                                {/* FORM FIELDS */}
                                <View style={styles.inputContainer}>

                                    {/* Name Input */}
                                    <Text style={styles.label}>Full Name</Text>
                                    <View style={[
                                        styles.inputWrapper,
                                        errors.name && { borderColor: COLORS.error, borderWidth: 1.5 }
                                    ]}>
                                        <Ionicons name="person-outline" size={20} color={errors.name ? COLORS.error : COLORS.textSec} />
                                        <TextInput
                                            placeholder="Rahul Prasad Yadav"
                                            placeholderTextColor="#555"
                                            style={styles.input}
                                            value={name}
                                            onChangeText={(text) => {
                                                setName(text);
                                                if (text) setErrors((prev: any) => ({ ...prev, name: false }));
                                            }}
                                        />
                                    </View>

                                    {/* Email Input */}
                                    <Text style={styles.label}>Email Address</Text>
                                    <View style={[
                                        styles.inputWrapper,
                                        errors.email && { borderColor: COLORS.error, borderWidth: 1.5 }
                                    ]}>
                                        <Ionicons name="mail-outline" size={20} color={errors.email ? COLORS.error : COLORS.textSec} />
                                        <TextInput
                                            placeholder="student@knowly.com"
                                            placeholderTextColor="#555"
                                            style={styles.input}
                                            value={email}
                                            onChangeText={(text) => {
                                                setEmail(text);
                                                if (text) setErrors((prev: any) => ({ ...prev, email: false }));
                                            }}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                        />
                                    </View>

                                    {/* Password Input */}
                                    <Text style={styles.label}>Password</Text>
                                    <View style={[
                                        styles.inputWrapper,
                                        errors.password && { borderColor: COLORS.error, borderWidth: 1.5 }
                                    ]}>
                                        <Ionicons name="lock-closed-outline" size={20} color={errors.password ? COLORS.error : COLORS.textSec} />
                                        <TextInput
                                            placeholder="••••••••"
                                            placeholderTextColor="#555"
                                            style={styles.input}
                                            value={password}
                                            onChangeText={(text) => {
                                                setPassword(text);
                                                if (text) setErrors((prev: any) => ({ ...prev, password: false }));
                                            }}
                                            secureTextEntry
                                        />
                                    </View>
                                </View>

                                {/* BUTTONS */}
                                <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} disabled={loading}>
                                    {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.signupBtnText}>Sign Up</Text>}
                                </TouchableOpacity>

                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>Already have an account? </Text>
                                    <TouchableOpacity onPress={() => router.push("/login1")}>
                                        <Text style={styles.linkText}>Log In</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ height: 60 }} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* ---------------- 3. MODAL (Bigger) ---------------- */}
            <Modal animationType="fade" transparent={true} visible={showSuccessModal} onRequestClose={() => setShowSuccessModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Ionicons
                            name={isError ? "alert-circle" : "checkmark-circle"}
                            size={55}
                            color={isError ? COLORS.error : COLORS.accent}
                            style={{ marginBottom: 20 }}
                        />
                        <Text style={styles.modalTitle}>{isError ? "Oops!" : "Account Created!"}</Text>
                        <Text style={styles.modalMessage}>
                            {isError ? modalMessage : `Verification OTP sent to ${email}.`}
                        </Text>

                        {isError ? (
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#333' }]} onPress={() => setShowSuccessModal(false)}>
                                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Try Again</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.modalBtn} onPress={() => { setShowSuccessModal(false); router.push({ pathname: "/verify-otp", params: { email: email } }); }}>
                                <Text style={styles.modalBtnText}>Verify OTP</Text>
                                <Ionicons name="arrow-forward" size={20} color="#000" style={{ marginLeft: 8 }} />
                            </TouchableOpacity>
                        )}
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
        height: height * 0.5,
        width: '100%',
        position: 'relative',
    },
    headerImage: { width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
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
    brandName: { fontSize: 49, fontWeight: '800', color: '#fff', letterSpacing: 1 },
    tagline: { fontSize: 20, marginTop: 4, color: '#fff', fontWeight: '600', letterSpacing: 0.5 },

    // --- BOTTOM SECTION ---
    bottomSection: {
        backgroundColor: COLORS.cardBg,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -25,
        paddingHorizontal: 24,
        paddingTop: 10,
        minHeight: height * 0.6,
    },
    dragIndicatorCenter: { alignItems: 'center', marginBottom: 10, marginTop: 10 },
    dragIndicator: { width: 40, height: 4, backgroundColor: '#333', borderRadius: 2 },

    titleText: { fontSize: 24, fontWeight: '700', color: COLORS.textMain, marginTop: 5 },
    subtitleText: { fontSize: 14, color: COLORS.textSec, marginTop: 5, marginBottom: 25 },

    inputContainer: { marginBottom: 10 },
    label: { fontSize: 14, color: COLORS.textMain, marginBottom: 8, fontWeight: '600', marginLeft: 4 },
    inputWrapper: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.inputBg, borderRadius: 12, height: 50,
        paddingHorizontal: 15, marginBottom: 15,
        borderWidth: 1, borderColor: COLORS.border,
    },
    input: { flex: 1, marginLeft: 10, color: '#fff', fontSize: 16 },

    signupBtn: {
        backgroundColor: COLORS.accent, height: 52, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center', marginBottom: 20, marginTop: 5
    },
    signupBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },

    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    footerText: { color: COLORS.textSec, fontSize: 14 },
    linkText: { color: COLORS.accent, fontWeight: 'bold', fontSize: 14 },

    // --- MODAL STYLES ---
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: {
        width: '85%',
        backgroundColor: COLORS.inputBg,
        paddingVertical: 35,
        paddingHorizontal: 25,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 10, marginBottom: 10 },
    modalMessage: { fontSize: 16, color: COLORS.textSec, textAlign: 'center', marginBottom: 25, lineHeight: 22 },
    modalBtn: {
        backgroundColor: COLORS.accent, paddingVertical: 14, paddingHorizontal: 35,
        borderRadius: 12, flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center'
    },
    modalBtnText: { color: '#000', fontSize: 17, fontWeight: 'bold' }
});
