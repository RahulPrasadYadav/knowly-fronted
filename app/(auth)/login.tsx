// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import { ActivityIndicator, Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// // ✅ SAHI (Naya Tarika)
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useAuth } from "../../context/AuthContext";

// const COLORS = { bg: "#000", accent: "#00e096", title: "#E7E9EA", text: "#B0B3B8", inputBg: "#1a1a1a", border: "#333" };

// export default function LoginScreen() {
//     const router = useRouter();
//     const { login } = useAuth();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);

//     const handleLogin = async () => {
//         if (!email || !password) {
//             Alert.alert("Error", "Please fill in all fields");
//             return;
//         }

//         setLoading(true);
//         // 🟢 FAKE API CALL
//         setTimeout(() => {
//             const fakeUser = { name: "Rahul", email: email };
//             login(fakeUser); // Automatic Redirect to Home
//             setLoading(false);
//         }, 1500);
//     };

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" />
//             <View style={styles.content}>
//                 <Text style={styles.title}>Welcome Back</Text>
//                 <Text style={styles.subtitle}>Login to your account</Text>

//                 <View style={styles.inputContainer}>
//                     <Text style={styles.label}>Email</Text>
//                     <TextInput
//                         placeholder="example@email.com" placeholderTextColor="#555"
//                         style={styles.input} value={email} onChangeText={setEmail}
//                         keyboardType="email-address" autoCapitalize="none"
//                     />
//                 </View>

//                 <View style={styles.inputContainer}>
//                     <Text style={styles.label}>Password</Text>
//                     <TextInput
//                         placeholder="••••••••" placeholderTextColor="#555"
//                         style={styles.input} value={password} onChangeText={setPassword}
//                         secureTextEntry
//                     />
//                 </View>

//                 <TouchableOpacity onPress={() => router.push("./forgot-password")} style={{ alignSelf: 'flex-end' }}>
//                     <Text style={{ color: COLORS.accent, fontWeight: "600" }}>Forgot Password?</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
//                     {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Log In</Text>}
//                 </TouchableOpacity>

//                 <View style={styles.footer}>
//                     <Text style={styles.footerText}>Don't have an account? </Text>
//                     <TouchableOpacity onPress={() => router.push("./signup")}>
//                         <Text style={styles.linkText}>Sign Up</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: COLORS.bg },
//     content: { flex: 1, justifyContent: "center", padding: 24 },
//     title: { fontSize: 32, fontWeight: "700", color: COLORS.title, marginBottom: 8 },
//     subtitle: { fontSize: 16, color: COLORS.text, marginBottom: 40 },
//     inputContainer: { marginBottom: 20 },
//     label: { color: COLORS.text, fontSize: 14, marginBottom: 8, fontWeight: "600" },
//     input: { backgroundColor: COLORS.inputBg, color: "#fff", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, fontSize: 16 },
//     btn: { backgroundColor: COLORS.accent, paddingVertical: 16, borderRadius: 30, alignItems: "center", marginTop: 20 },
//     btnText: { color: "#000", fontSize: 16, fontWeight: "bold" },
//     footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
//     footerText: { color: COLORS.text, fontSize: 15 },
//     linkText: { color: COLORS.accent, fontWeight: "bold", fontSize: 15 }
// });






// //  with animation image 
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     Animated,
//     Dimensions,
//     Platform,
//     StatusBar,
//     StyleSheet,
//     Text, TextInput, TouchableOpacity,
//     View
// } from "react-native";
// import { useAuth } from "../../context/AuthContext";

// const { width, height } = Dimensions.get("window");

// // ✅ THEME CONFIG (Tech Green Style)
// const COLORS = {
//     bg: "#000000",
//     card: "#121212",
//     accent: "#00e096", // ✅ Tech Green
//     textMain: "#E7E9EA",
//     textSec: "#9ca3af",
//     inputBg: "#1f1f1f",
//     border: "#333"
// };

// // 🤖 TECH WALLPAPERS (AI, Code, Cyberpunk)
// const TECH_IMAGES = [
//     "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop", // Chip
//     "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop", // Coding
//     "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop", // AI Brain
//     "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop", // Cyberpunk City
//     "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop", // Matrix Code
// ];

// export default function LoginScreen() {
//     const router = useRouter();
//     const { login } = useAuth();

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);

//     // 🎢 Image Animation State
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);
//     const fadeAnim = useRef(new Animated.Value(1)).current;

//     // ✅ AUTO CHANGE IMAGE EVERY 4 SECONDS
//     useEffect(() => {
//         const interval = setInterval(() => {
//             Animated.timing(fadeAnim, {
//                 toValue: 0,
//                 duration: 800,
//                 useNativeDriver: true,
//             }).start(() => {
//                 setCurrentImageIndex((prev) => (prev + 1) % TECH_IMAGES.length);
//                 Animated.timing(fadeAnim, {
//                     toValue: 1,
//                     duration: 800,
//                     useNativeDriver: true,
//                 }).start();
//             });
//         }, 4000);

//         return () => clearInterval(interval);
//     }, []);

//     const handleLogin = async () => {
//         if (!email || !password) {
//             Alert.alert("Missing Info", "Please enter email & password");
//             return;
//         }
//         setLoading(true);
//         setTimeout(() => {
//             login({ name: "Tech User", email });
//             setLoading(false);
//         }, 1500);
//     };

//     return (
//         <View style={styles.container}>
//             <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

//             {/* --- 1. TOP WALLPAPER SECTION --- */}
//             <View style={styles.imageContainer}>
//                 <Animated.Image
//                     source={{ uri: TECH_IMAGES[currentImageIndex] }}
//                     style={[styles.heroImage, { opacity: fadeAnim }]}
//                     resizeMode="cover"
//                 />
//                 {/* Dark Gradient Overlay */}
//                 <View style={styles.darkOverlay} />

//                 <View style={styles.branding}>
//                     <Text style={styles.brandTitle}>Knowly</Text>
//                     <Text style={styles.brandSubtitle}>Unlock the power of knowledge.</Text>
//                 </View>
//             </View>

//             {/* --- 2. BOTTOM CARD SECTION --- */}
//             <View style={styles.bottomSheet}>

//                 <Text style={styles.loginTitle}>Login or Sign up</Text>

//                 <View style={styles.divider}>
//                     <View style={styles.line} />
//                     <Text style={styles.orText}>or</Text>
//                     <View style={styles.line} />
//                 </View>

//                 {/* INPUTS */}
//                 <View style={styles.inputWrapper}>
//                     <Ionicons name="mail-outline" size={20} color={COLORS.textSec} style={styles.icon} />
//                     <TextInput
//                         placeholder="Email Address"
//                         placeholderTextColor={COLORS.textSec}
//                         style={styles.input}
//                         value={email}
//                         onChangeText={setEmail}
//                         keyboardType="email-address"
//                         autoCapitalize="none"
//                     />
//                 </View>

//                 <View style={styles.inputWrapper}>
//                     <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSec} style={styles.icon} />
//                     <TextInput
//                         placeholder="Password"
//                         placeholderTextColor={COLORS.textSec}
//                         style={styles.input}
//                         value={password}
//                         onChangeText={setPassword}
//                         secureTextEntry
//                     />
//                 </View>

//                 {/* FORGOT PASSWORD */}
//                 <TouchableOpacity
//                     onPress={() => router.push("./forgot-password")}
//                     style={styles.forgotPassword}
//                 >
//                     <Text style={styles.forgotText}>Forgot Password?</Text>
//                 </TouchableOpacity>

//                 {/* BUTTON */}
//                 <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
//                     {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Continue</Text>}
//                 </TouchableOpacity>

//                 {/* SOCIAL OPTIONS */}
//                 <View style={styles.socialRow}>
//                     <TouchableOpacity style={styles.socialBtn}>
//                         <Ionicons name="logo-google" size={20} color="#fff" />
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.socialBtn}>
//                         <Ionicons name="logo-apple" size={22} color="#fff" />
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.socialBtn} onPress={() => router.push("/signup")}>
//                         <Ionicons name="mail" size={20} color="#fff" />
//                     </TouchableOpacity>
//                 </View>

//                 {/* FOOTER */}
//                 <View style={styles.footer}>
//                     <Text style={styles.footerText}>New to Knowly? </Text>
//                     <TouchableOpacity onPress={() => router.push("/signup")}>
//                         <Text style={styles.linkText}>Create account</Text>
//                     </TouchableOpacity>
//                 </View>

//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#000" },

//     // --- Image Section ---
//     imageContainer: {
//         height: height * 0.5, // 50% screen height
//         width: width,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     heroImage: {
//         width: "100%",
//         height: "100%",
//         position: "absolute",
//     },
//     darkOverlay: {
//         ...StyleSheet.absoluteFillObject,
//         backgroundColor: 'rgba(0,0,0,0.5)', // Thoda dark kiya text padhne ke liye
//     },
//     branding: {
//         alignItems: 'center',
//         marginBottom: 40,
//     },
//     brandTitle: {
//         fontSize: 48, // Thoda bada kiya
//         fontWeight: "900",
//         color: "#fff",
//         letterSpacing: 2,
//         fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium'
//     },
//     brandSubtitle: {
//         color: COLORS.accent, // Green Subtitle for Tech Feel
//         fontSize: 16,
//         marginTop: 5,
//         fontWeight: "600",
//         letterSpacing: 0.5
//     },

//     // --- Bottom Sheet ---
//     bottomSheet: {
//         flex: 1,
//         backgroundColor: COLORS.card,
//         borderTopLeftRadius: 30,
//         borderTopRightRadius: 30,
//         padding: 24,
//         marginTop: -30,
//         alignItems: 'center',
//     },
//     loginTitle: {
//         fontSize: 22,
//         fontWeight: "700",
//         color: COLORS.textMain,
//         marginBottom: 20,
//     },

//     // --- Divider ---
//     divider: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 20,
//         width: '100%',
//     },
//     line: {
//         flex: 1,
//         height: 1,
//         backgroundColor: COLORS.border,
//     },
//     orText: {
//         color: COLORS.textSec,
//         paddingHorizontal: 10,
//         fontSize: 12,
//     },

//     // --- Inputs ---
//     inputWrapper: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: COLORS.inputBg,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//         marginBottom: 16,
//         paddingHorizontal: 14,
//         height: 54,
//         width: '100%',
//     },
//     icon: { marginRight: 10 },
//     input: {
//         flex: 1,
//         color: "#fff",
//         fontSize: 16,
//     },

//     // --- Forgot Password ---
//     forgotPassword: {
//         alignSelf: 'flex-end',
//         marginBottom: 20,
//         marginTop: -8,
//     },
//     forgotText: {
//         color: COLORS.accent,
//         fontSize: 14,
//         fontWeight: "600",
//     },

//     // --- Main Button ---
//     btn: {
//         backgroundColor: COLORS.accent,
//         width: '100%',
//         height: 52,
//         borderRadius: 12,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: 10,
//         marginBottom: 24,
//         shadowColor: COLORS.accent,
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 10,
//         elevation: 5
//     },
//     btnText: {
//         color: "#000", // Black text on Green Button looks better
//         fontSize: 17,
//         fontWeight: "bold",
//     },

//     // --- Social Login ---
//     socialRow: {
//         flexDirection: 'row',
//         gap: 20,
//         marginBottom: 30,
//     },
//     socialBtn: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         backgroundColor: '#333',
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderWidth: 1,
//         borderColor: '#444'
//     },

//     // --- Footer ---
//     footer: { flexDirection: 'row' },
//     footerText: { color: COLORS.textSec, fontSize: 14 },
//     linkText: { color: COLORS.accent, fontWeight: "600", fontSize: 14 }
// });




import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const { width, height } = Dimensions.get("window");

// ✅ THEME CONFIG (Updated to Green Theme)
const COLORS = {
    bg: "#000000",
    accent: "#00e096", // ✅ Changed from Orange to your Green
    textMain: "#FFFFFF",
    textSec: "#9ca3af",
    buttonBg: "#1f1f1f",
    border: "#333"
};

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* --- TOP BOOKMARK ICON --- */}
            <View style={styles.topIcon}>
                <Ionicons name="bookmark" size={40} color={COLORS.accent} />
            </View>

            {/* --- ANIMATED ICONS GRID --- */}
            {/* --- ANIMATED ICONS GRID --- */}
            <View style={styles.iconsGrid}>
                {/* Row 1: Tech & AI Focus */}
                <View style={styles.iconRow}>
                    {/* Brain/AI */}
                    <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/brain.png' }} style={styles.icon} />
                    {/* Chip/Processor */}
                    <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/microchip.png' }} style={styles.icon} />
                    {/* Laptop/Computer */}
                    <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/laptop.png' }} style={styles.icon} />
                </View>

                {/* Row 2: Learning Tools */}
                <View style={styles.iconRow}>
                    {/* Books Stack */}
                    <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/books.png' }} style={styles.icon} />
                    {/* Fountain Pen (Writing) */}
                    <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/fountain-pen.png' }} style={styles.icon} />
                    {/* Graduation Cap (Achievement) */}
                    <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/graduation-cap.png' }} style={styles.icon} />
                </View>

                {/* Row 3: Ideas & Discovery */}
                <View style={styles.iconRow}>
                    {/* Lightbulb (Idea) */}
                    <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/idea.png' }} style={styles.icon} />
                    {/* Telescope (Explore) */}
                    <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/telescope.png' }} style={styles.icon} />
                    {/* Rocket (Growth/Speed) */}
                    <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/rocket.png' }} style={styles.icon} />
                </View>

                {/* Row 4: Data & World Knowledge */}
                <View style={styles.iconRow}>
                    {/* Globe (World knowledge) */}
                    <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/globe.png' }} style={styles.icon} />
                    {/* Scroll/Diploma */}
                    <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/scroll.png' }} style={styles.icon} />
                    {/* Target/Goal */}
                    <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/target.png' }} style={styles.icon} />
                </View>
            </View>

            {/* --- WELCOME TEXT --- */}
            <View style={styles.textSection}>
                <Text style={styles.welcomeTitle}>Get Smarter with Knowly</Text>
                <Text style={styles.welcomeSubtitle}>Your daily dose of knowledge starts here.</Text>
            </View>

            {/* --- BUTTONS SECTION --- */}
            <View style={styles.buttonsSection}>

                {/* Login Button - ✅ Fixed Navigation */}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => router.push("/(auth)/login1")} // ✅ Ensure correct path
                    activeOpacity={0.8}
                >
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                {/* Sign Up Button */}
                <TouchableOpacity
                    style={styles.signupButton}
                    onPress={() => router.push("/(auth)/signup")} // ✅ Ensure correct path
                    activeOpacity={0.8}
                >
                    <Text style={styles.signupButtonText}>Sign up free</Text>
                </TouchableOpacity>

                {/* Continue with Google */}
                <TouchableOpacity
                    style={styles.googleButton}
                    activeOpacity={0.8}
                >
                    <Ionicons name="logo-google" size={22} color="#fff" />
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                {/* Terms & Privacy */}
                <Text style={styles.termsText}>
                    By signing up, you agree to Knowly's{' '}
                    <Text style={styles.linkText}>Terms of Use</Text>
                    {' '}and{' '}
                    <Text style={styles.linkText}>Privacy Policy</Text>.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingTop: 60,
    },

    // --- Top Bookmark Icon ---
    topIcon: {
        alignItems: 'center',
        marginBottom: 30,
    },

    // --- Icons Grid ---
    iconsGrid: {
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 25,
    },
    icon: {
        width: 80,
        height: 80,
    },

    // --- Welcome Text ---
    textSection: {
        alignItems: 'center',
        marginBottom: 50,
        paddingHorizontal: 20,
    },
    welcomeTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: COLORS.textMain,
        textAlign: 'center',
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: COLORS.textSec,
        textAlign: 'center',
    },

    // --- Buttons Section ---
    buttonsSection: {
        paddingHorizontal: 30,
        marginTop: 'auto',
        paddingBottom: 40,
    },

    // Login Button (Outlined Green)
    loginButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.accent, // ✅ Green Border
        height: 54,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    loginButtonText: {
        color: COLORS.accent, // ✅ Green Text
        fontSize: 17,
        fontWeight: '700',
    },

    // Sign Up Button (Solid Green)
    signupButton: {
        backgroundColor: COLORS.accent, // ✅ Green Background
        height: 54,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    signupButtonText: {
        color: '#000', // ✅ Black text on Green looks better
        fontSize: 17,
        fontWeight: '700',
    },

    // Google Button
    googleButton: {
        backgroundColor: COLORS.buttonBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        height: 54,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20, // Adjusted margin since Apple btn removed
    },
    googleButtonText: {
        color: COLORS.textMain,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },

    // Terms Text
    termsText: {
        color: COLORS.textSec,
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
    },
    linkText: {
        color: COLORS.accent, // ✅ Green Link
        fontWeight: '600',
    },
});