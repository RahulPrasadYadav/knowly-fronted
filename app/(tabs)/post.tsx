



// import { Ionicons } from "@expo/vector-icons";
// import * as Device from "expo-device";
// import * as ImagePicker from "expo-image-picker";
// import { useFocusEffect, useRouter } from "expo-router";
// import React, { useCallback, useRef, useState } from "react";
// import {
//     Animated,
//     Easing,
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
//     View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useAuth } from "../../context/AuthContext";

// /* ---------------- CONFIG ---------------- */
// const URL_LOCAL = Device.isDevice
//     ? process.env.EXPO_PUBLIC_API_URL_PHONE
//     : process.env.EXPO_PUBLIC_API_URL_ANDROID;

// const URL_PROD = process.env.EXPO_PUBLIC_API_URL_PROD;
// const BASE_URL = !__DEV__ && URL_PROD ? URL_PROD : URL_LOCAL || URL_PROD;
// const API_URL = `${BASE_URL}/user/post`;
// const API_ME = `${BASE_URL}/me`;

// const IMAGE_BASE_URL = BASE_URL ? BASE_URL.replace(/\/$/, "") : "";

// // 🔥 UPDATED THEME: Startup Purple
// const THEME = {
//     bg: "#000000",
//     accent: "#7F5AF0",      // Startup Purple (Changed from Green)
//     textMain: "#FFFFFF",
//     textSub: "#94A1B2",     // Cool Gray
//     divider: "#1F1F1F",
// };

// // 🔥 UPDATED: Full List of Categories (IDs 2-22)
// const CATEGORIES = [
//     { id: 2, name: "AI & ML" },
//     { id: 3, name: "Data Science" },
//     { id: 4, name: "CS & Engineering" },
//     { id: 5, name: "Data Structures" },
//     { id: 6, name: "DBMS" },
//     { id: 7, name: "System Design" },
//     { id: 8, name: "Frontend" },
//     { id: 9, name: "Backend" },
//     { id: 10, name: "Full Stack" },
//     { id: 11, name: "Mobile Dev" },
//     { id: 12, name: "Cloud Computing" },
//     { id: 13, name: "DevOps" },
//     { id: 14, name: "Cyber Security" },
//     { id: 15, name: "Python" },
//     { id: 16, name: "Java" },
//     { id: 17, name: "C++" },
//     { id: 18, name: ".NET Core" },
//     { id: 19, name: "Blockchain" },
//     { id: 20, name: "Startups" },
//     { id: 21, name: "Gadgets" },
//     { id: 22, name: "Tech News" }
// ];

// export default function CreatePostScreen() {
//     const router = useRouter();
//     const { token } = useAuth() as any;

//     /* ---------------- STATE ---------------- */
//     const [title, setTitle] = useState("");
//     const [content, setContent] = useState("");
//     const [mediaUrl, setMediaUrl] = useState<string | null>(null);
//     const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
//     const [selectedCategory, setSelectedCategory] = useState<any>(null);
//     const [loading, setLoading] = useState(false);
//     const [popup, setPopup] = useState({ visible: false, text: "" });

//     // 🔥 Real User Data State
//     const [currentUser, setCurrentUser] = useState<any>(null);

//     const progressAnim = useRef(new Animated.Value(0)).current;

//     /* ---------------- 🔥 AUTO REFRESH LOGIC ---------------- */
//     useFocusEffect(
//         useCallback(() => {
//             if (token) {
//                 fetchUserData();
//             }
//         }, [token])
//     );

//     const fetchUserData = async () => {
//         try {
//             const res = await fetch(API_ME, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             const data = await res.json();
//             setCurrentUser(data);
//         } catch (e) {
//             console.error("Failed to fetch user", e);
//         }
//     };

//     /* ---------------- HELPERS ---------------- */
//     const wordCount = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
//     const words = wordCount(content);

//     const isReady = title.trim().length > 0 && words >= 10 && words <= 55 && selectedCategory && mediaUrl;

//     // 🔥 Name & Image Logic
//     const userName = currentUser
//         ? `${currentUser.first_name} ${currentUser.last_name}`
//         : "Loading...";

//     let userAvatarUrl = null;
//     if (currentUser?.profile_image) {
//         if (currentUser.profile_image.startsWith("http")) {
//             userAvatarUrl = currentUser.profile_image;
//         } else {
//             const cleanPath = currentUser.profile_image.replace(/^\//, "");
//             userAvatarUrl = `${IMAGE_BASE_URL}/${cleanPath}`;
//         }
//     }

//     const getInitials = (name: string) => {
//         if (!name || name === "Loading...") return "..";
//         const parts = name.split(" ");
//         if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
//         return name.slice(0, 2).toUpperCase();
//     };

//     /* ---------------- MEDIA PICK ---------------- */
//     const pickMedia = async (type: "image" | "video") => {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//             setPopup({ visible: true, text: "Permission needed" });
//             return;
//         }
//         const res = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: type === "image" ? ['images'] : ['videos'],
//             allowsEditing: false,
//             quality: 1,
//         });
//         if (!res.canceled) {
//             setMediaUrl(res.assets[0].uri);
//             setMediaType(type);
//         }
//     };

//     /* ---------------- SUBMIT ---------------- */
//     const handleSubmit = async () => {
//         if (!isReady) {
//             setPopup({ visible: true, text: "Please fill all fields" });
//             setTimeout(() => setPopup({ visible: false, text: "" }), 2000);
//             return;
//         }
//         if (!token) {
//             setPopup({ visible: true, text: "Please login first!" });
//             return;
//         }

//         setLoading(true);
//         Animated.timing(progressAnim, { toValue: 1, duration: 1500, easing: Easing.linear, useNativeDriver: false }).start();

//         // 🔥 Construct Payload exactly as requested
//         const payload = {
//             title: title,
//             content: content,
//             category_id: selectedCategory.id,
//             author_name: userName,
//             media_type: mediaType,
//             media_url: mediaUrl,
//         };

//         console.log("🚀 Submitting Payload:", payload);

//         try {
//             await fetch(API_URL, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`
//                 },
//                 body: JSON.stringify(payload),
//             });

//             // 🔥 CUSTOM MESSAGE HERE
//             setPopup({
//                 visible: true,
//                 text: "Post submitted! Please wait 5 to 10 mins. If Admin approves, you'll get a notification."
//             });

//             // Reset Form
//             setTitle(""); setContent(""); setMediaUrl(null); setMediaType(null); setSelectedCategory(null);
//             setLoading(false); progressAnim.setValue(0);

//             setTimeout(() => {
//                 setPopup({ visible: false, text: "" });
//                 router.replace("/(tabs)");
//             }, 3000);

//         } catch (e) {
//             setPopup({ visible: true, text: "Server error" });
//             setLoading(false);
//             setTimeout(() => setPopup({ visible: false, text: "" }), 2000);
//         }
//     };

//     /* ================= UI ================= */
//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" />

//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => router.back()}>
//                     <Ionicons name="close" size={28} color="#fff" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Create a post</Text>
//                 <TouchableOpacity onPress={handleSubmit} disabled={loading}>
//                     <Text style={[styles.postBtn, !isReady && { opacity: 0.4 }]}>Post</Text>
//                 </TouchableOpacity>
//             </View>

//             {loading && (
//                 <Animated.View style={[styles.loadingBar, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }]} />
//             )}

//             <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
//                 <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>

//                     {/* 🔥 REAL USER ROW */}
//                     <View style={styles.userRow}>
//                         {userAvatarUrl ? (
//                             <Image source={{ uri: userAvatarUrl }} style={styles.avatarImage} />
//                         ) : (
//                             <View style={styles.avatar}>
//                                 <Text style={{ color: THEME.accent, fontWeight: 'bold' }}>{getInitials(userName)}</Text>
//                             </View>
//                         )}
//                         <Text style={{ color: "#fff", fontWeight: '600' }}>{userName}</Text>
//                     </View>

//                     {/* 🔥 CATEGORIES SCROLL - Updated with full list */}
//                     <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
//                         {CATEGORIES.map((c) => (
//                             <TouchableOpacity
//                                 key={c.id}
//                                 onPress={() => setSelectedCategory(c)}
//                                 style={[styles.catChip, selectedCategory?.id === c.id && styles.catChipActive]}
//                             >
//                                 <Text style={{ color: selectedCategory?.id === c.id ? THEME.accent : THEME.textSub, fontWeight: selectedCategory?.id === c.id ? "600" : "400" }}>
//                                     {c.name}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))}
//                     </ScrollView>

//                     <View style={styles.titleWrapper}>
//                         <TextInput
//                             style={styles.title}
//                             placeholder="Post title"
//                             placeholderTextColor="#444"
//                             value={title}
//                             onChangeText={setTitle}
//                             maxLength={80}
//                         />
//                         <View style={styles.titleUnderline} />
//                     </View>

//                     <TextInput
//                         style={styles.content}
//                         placeholder="What's happening? (10-55 words)"
//                         placeholderTextColor="#555"
//                         multiline
//                         value={content}
//                         onChangeText={setContent}
//                     />

//                     <Text style={[styles.wordCount, (words < 10 || words > 55) && { color: "#ff4444" }]}>
//                         {words}/55 words
//                     </Text>

//                     {mediaUrl && (
//                         <View style={styles.mediaContainer}>
//                             <Image source={{ uri: mediaUrl }} style={styles.image} resizeMode="cover" />
//                             <TouchableOpacity style={styles.removeBtn} onPress={() => { setMediaUrl(null); setMediaType(null); }}>
//                                 <Ionicons name="close" size={20} color="#fff" />
//                             </TouchableOpacity>
//                         </View>
//                     )}
//                 </ScrollView>

//                 <View style={styles.toolbar}>
//                     <TouchableOpacity onPress={() => pickMedia("image")}>
//                         <Ionicons name="image-outline" size={28} color={THEME.accent} />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => pickMedia("video")}>
//                         <Ionicons name="videocam-outline" size={30} color={THEME.accent} />
//                     </TouchableOpacity>
//                 </View>
//             </KeyboardAvoidingView>

//             <Modal transparent visible={popup.visible} animationType="fade">
//                 <View style={styles.popupOverlay}>
//                     <View style={styles.popup}>
//                         <Ionicons name={popup.text.includes("error") || popup.text.includes("fill") || popup.text.includes("login") ? "alert-circle" : "checkmark-circle"} size={36} color={THEME.accent} />
//                         <Text style={styles.popupText}>{popup.text}</Text>
//                     </View>
//                 </View>
//             </Modal>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: THEME.bg },
//     header: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center', padding: 16, borderBottomWidth: 0.5, borderBottomColor: THEME.divider },
//     headerTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
//     postBtn: { color: THEME.accent, fontWeight: "bold", fontSize: 16 },
//     loadingBar: { height: 2, backgroundColor: THEME.accent },
//     userRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
//     avatar: { width: 36, height: 36, borderRadius: 18, borderColor: THEME.accent, borderWidth: 1, alignItems: "center", justifyContent: "center", backgroundColor: '#111' },
//     avatarImage: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: THEME.accent },
//     catRow: { paddingLeft: 16, marginBottom: 12 },
//     catChip: { borderWidth: 1, borderColor: "#333", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 10 },
//     // 🔥 Updated active color to Purple transparent
//     catChipActive: { borderColor: THEME.accent, backgroundColor: 'rgba(127, 90, 240, 0.1)' },
//     titleWrapper: { paddingHorizontal: 16, marginTop: 10 },
//     title: { fontSize: 22, fontWeight: "bold", color: "#fff" },
//     titleUnderline: { height: 1, backgroundColor: THEME.divider, marginTop: 8 },
//     content: { color: "#ccc", fontSize: 18, paddingHorizontal: 16, minHeight: 120, marginTop: 16, textAlignVertical: 'top' },
//     wordCount: { color: "#666", textAlign: "right", paddingRight: 16, fontSize: 12, marginBottom: 10 },
//     mediaContainer: { margin: 16, height: 280, borderRadius: 16, overflow: 'hidden', backgroundColor: '#1a1a1a', position: 'relative', borderWidth: 0.5, borderColor: '#333' },
//     image: { width: '100%', height: '100%' },
//     removeBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
//     toolbar: { flexDirection: "row", gap: 30, borderTopWidth: 0.5, borderTopColor: THEME.divider, padding: 16, paddingBottom: Platform.OS === 'ios' ? 0 : 16, backgroundColor: THEME.bg },
//     popupOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
//     popup: { backgroundColor: "#1c1c1c", padding: 24, borderRadius: 16, alignItems: "center", width: "80%", borderWidth: 1, borderColor: '#333' },
//     popupText: { color: "#fff", textAlign: "center", marginTop: 12, fontSize: 15, lineHeight: 22 },
// });


import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    Animated,
    Easing,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

/* ---------------- CONFIG ---------------- */
const URL_LOCAL = Device.isDevice
    ? process.env.EXPO_PUBLIC_API_URL_PHONE
    : process.env.EXPO_PUBLIC_API_URL_ANDROID;

const URL_PROD = process.env.EXPO_PUBLIC_API_URL_PROD;
const BASE_URL = !__DEV__ && URL_PROD ? URL_PROD : URL_LOCAL || URL_PROD;
const API_URL = `${BASE_URL}/user/post`;
const API_ME = `${BASE_URL}/me`;

const IMAGE_BASE_URL = BASE_URL ? BASE_URL.replace(/\/$/, "") : "";

// 🔥 THEME: Deep Dark Navy Tech
const THEME = {
    bg: "#020617",       // 🔥 Darkest Navy (Almost Black)
    editorBg: "#0f172a", // Slightly lighter for inputs
    accent: "#38bdf8",   // Sky Blue Glow
    textMain: "#f1f5f9", // Bright White
    textSub: "#94a3b8",  // Slate Gray
    border: "#1e293b",   // Dark Tech Border
};

// 🔥 Categories
const CATEGORIES = [
    { id: 2, name: "AI & ML" },
    { id: 3, name: "Data Science" },
    { id: 4, name: "CS & Eng" },
    { id: 5, name: "DSA" },
    { id: 6, name: "DBMS" },
    { id: 7, name: "Sys Design" },
    { id: 8, name: "Frontend" },
    { id: 9, name: "Backend" },
    { id: 10, name: "Full Stack" },
    { id: 11, name: "Mobile" },
    { id: 12, name: "Cloud" },
    { id: 13, name: "DevOps" },
    { id: 14, name: "Cyber Sec" },
    { id: 15, name: "Python" },
    { id: 16, name: "Java" },
    { id: 17, name: "C++" },
    { id: 18, name: ".NET" },
    { id: 19, name: "Blockchain" },
    { id: 20, name: "Startups" },
    { id: 21, name: "Gadgets" },
    { id: 22, name: "Tech News" }
];

export default function CreatePostScreen() {
    const router = useRouter();
    const { token } = useAuth() as any;

    /* ---------------- STATE ---------------- */
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState({ visible: false, text: "" });

    // 🔥 Real User Data State
    const [currentUser, setCurrentUser] = useState<any>(null);

    const progressAnim = useRef(new Animated.Value(0)).current;

    /* ---------------- LOGIC ---------------- */
    useFocusEffect(
        useCallback(() => {
            if (token) {
                fetchUserData();
            }
        }, [token])
    );

    const fetchUserData = async () => {
        try {
            const res = await fetch(API_ME, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setCurrentUser(data);
        } catch (e) {
            console.error("Failed to fetch user", e);
        }
    };

    const wordCount = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
    const words = wordCount(content);
    const isReady = title.trim().length > 0 && words >= 10 && words <= 55 && selectedCategory && mediaUrl;

    const userName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "User";
    let userAvatarUrl = null;
    if (currentUser?.profile_image) {
        userAvatarUrl = currentUser.profile_image.startsWith("http") ? currentUser.profile_image : `${IMAGE_BASE_URL}/${currentUser.profile_image.replace(/^\//, "")}`;
    }

    const getInitials = (name: string) => {
        if (!name) return "..";
        const parts = name.split(" ");
        return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
    };

    const pickMedia = async (type: "image" | "video") => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return setPopup({ visible: true, text: "Permission needed" });
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: type === "image" ? ['images'] : ['videos'],
            allowsEditing: false,
            quality: 1,
        });
        if (!res.canceled) {
            setMediaUrl(res.assets[0].uri);
            setMediaType(type);
        }
    };

    const handleSubmit = async () => {
        if (!isReady) {
            setPopup({ visible: true, text: "Fill all fields & Add Media" });
            setTimeout(() => setPopup({ visible: false, text: "" }), 2000);
            return;
        }
        if (!token) return setPopup({ visible: true, text: "Login first!" });

        setLoading(true);
        Animated.timing(progressAnim, { toValue: 1, duration: 1500, easing: Easing.linear, useNativeDriver: false }).start();

        const payload = {
            title: title,
            content: content,
            category_id: selectedCategory.id,
            author_name: userName,
            media_type: mediaType,
            media_url: mediaUrl,
        };

        try {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            setPopup({ visible: true, text: "Submitted for Review!" });
            setTitle(""); setContent(""); setMediaUrl(null); setMediaType(null); setSelectedCategory(null);
            setLoading(false); progressAnim.setValue(0);
            setTimeout(() => {
                setPopup({ visible: false, text: "" });
                router.replace("/(tabs)");
            }, 3000);
        } catch (e) {
            setPopup({ visible: true, text: "Server error" });
            setLoading(false);
            setTimeout(() => setPopup({ visible: false, text: "" }), 2000);
        }
    };

    /* ================= TECH UI RENDER ================= */
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>NEW POST</Text>

                {/* Techy Post Button */}
                <TouchableOpacity onPress={handleSubmit} disabled={loading} style={[styles.postBtn, !isReady && styles.postBtnDisabled]}>
                    <Text style={styles.postBtnText}>PUBLISH</Text>
                    {isReady && <Ionicons name="flash" size={12} color={THEME.bg} style={{ marginLeft: 4 }} />}
                </TouchableOpacity>
            </View>

            {loading && <Animated.View style={[styles.loadingBar, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }]} />}

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

                    {/* USER INFO */}
                    <View style={styles.metaSection}>
                        <View style={styles.userBadge}>
                            {userAvatarUrl ? (
                                <Image source={{ uri: userAvatarUrl }} style={styles.avatarImage} />
                            ) : (
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{getInitials(userName)}</Text>
                                </View>
                            )}
                            <View>
                                <Text style={styles.label}>AUTHOR</Text>
                                <Text style={styles.userName}>{userName}</Text>
                            </View>
                        </View>
                    </View>

                    {/* CATEGORY TAGS */}
                    <View style={styles.section}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
                            {CATEGORIES.map((c) => (
                                <TouchableOpacity
                                    key={c.id}
                                    onPress={() => setSelectedCategory(c)}
                                    style={[styles.catChip, selectedCategory?.id === c.id && styles.catChipActive]}
                                >
                                    <Text style={[styles.catText, selectedCategory?.id === c.id && styles.catTextActive]}>
                                        {c.name.toUpperCase()}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* EDITOR AREA */}
                    <View style={styles.editorContainer}>

                        {/* Title Input */}
                        <TextInput
                            style={styles.titleInput}
                            placeholder="> Enter Title..."
                            placeholderTextColor="#556"
                            value={title}
                            onChangeText={setTitle}
                            maxLength={80}
                        />

                        {/* Content Input (Code Block Style) */}
                        <View style={styles.contentWrapper}>
                            <TextInput
                                style={styles.contentInput}
                                placeholder="> Write your insight here... (10-55 words)"
                                placeholderTextColor="#556"
                                multiline
                                value={content}
                                onChangeText={setContent}
                            />
                            <Text style={[styles.wordCount, (words < 10 || words > 55) ? styles.wordCountError : null]}>
                                {words} / 55 WORDS
                            </Text>
                        </View>
                    </View>

                    {/* MEDIA UPLOAD - Labels removed as requested */}
                    <View style={styles.section}>
                        {mediaUrl ? (
                            <View style={styles.mediaPreview}>
                                <Image source={{ uri: mediaUrl }} style={styles.image} resizeMode="cover" />
                                <View style={styles.mediaOverlay}>
                                    <Text style={styles.mediaTag}>MEDIA_LOADED</Text>
                                    <TouchableOpacity style={styles.removeBtn} onPress={() => { setMediaUrl(null); setMediaType(null); }}>
                                        <Ionicons name="trash-outline" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.emptyMedia}>
                                <Text style={styles.emptyMediaText}>NO MEDIA SELECTED</Text>
                                <Text style={styles.emptyMediaSub}>Tap toolbar below to attach</Text>
                            </View>
                        )}
                    </View>

                </ScrollView>

                {/* TECH TOOLBAR */}
                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.toolBtn} onPress={() => pickMedia("image")}>
                        <Ionicons name="image" size={22} color={THEME.accent} />
                        <Text style={styles.toolText}>IMG</Text>
                    </TouchableOpacity>
                    <View style={styles.toolDivider} />
                    <TouchableOpacity style={styles.toolBtn} onPress={() => pickMedia("video")}>
                        <Ionicons name="videocam" size={22} color={THEME.accent} />
                        <Text style={styles.toolText}>VID</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* POPUP MODAL */}
            <Modal transparent visible={popup.visible} animationType="fade">
                <View style={styles.popupOverlay}>
                    <View style={styles.popup}>
                        <Ionicons name={popup.text.includes("Review") ? "checkmark-done-circle" : "alert-circle"} size={40} color={THEME.accent} />
                        <Text style={styles.popupText}>{popup.text}</Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.bg },

    /* Header */
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: THEME.border },
    headerTitle: { color: THEME.textMain, fontSize: 16, fontWeight: "900", letterSpacing: 1, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    closeBtn: { padding: 4 },

    postBtn: {
        backgroundColor: THEME.accent,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: THEME.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
    },
    postBtnDisabled: { backgroundColor: THEME.border, shadowOpacity: 0 },
    postBtnText: { color: THEME.bg, fontWeight: "900", fontSize: 12, letterSpacing: 0.5 },

    loadingBar: { height: 2, backgroundColor: THEME.accent },

    /* Labels */
    label: { color: THEME.textSub, fontSize: 10, fontWeight: "bold", letterSpacing: 1, marginBottom: 2, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    section: { paddingHorizontal: 16, marginTop: 24 },

    /* User */
    metaSection: { padding: 16, paddingBottom: 0 },
    userBadge: { flexDirection: "row", alignItems: "center", gap: 12 },
    avatar: { width: 40, height: 40, borderRadius: 4, backgroundColor: THEME.editorBg, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: THEME.border },
    avatarImage: { width: 40, height: 40, borderRadius: 4, borderWidth: 1, borderColor: THEME.accent },
    avatarText: { color: THEME.accent, fontWeight: "bold" },
    userName: { color: THEME.textMain, fontWeight: "700", fontSize: 15, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

    /* Categories - Tech Tags */
    catRow: { flexDirection: 'row' },
    catChip: {
        borderWidth: 1,
        borderColor: THEME.border,
        backgroundColor: THEME.editorBg,
        borderRadius: 4, // Square look
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8
    },
    catChipActive: { borderColor: THEME.accent, backgroundColor: 'rgba(56, 189, 248, 0.15)' },
    catText: { color: THEME.textSub, fontWeight: "600", fontSize: 11, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    catTextActive: { color: THEME.accent, fontWeight: "bold" },

    /* Editor */
    editorContainer: { paddingHorizontal: 16, marginTop: 24 },
    titleInput: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: THEME.border,
        paddingVertical: 12,
        marginBottom: 16,
        fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' // Tech font
    },
    contentWrapper: {
        backgroundColor: THEME.editorBg,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: THEME.border,
        padding: 4
    },
    contentInput: {
        color: "#cbd5e1",
        fontSize: 15,
        padding: 12,
        minHeight: 140,
        textAlignVertical: 'top',
        lineHeight: 22,
        fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier'
    },
    wordCount: {
        color: THEME.textSub,
        textAlign: "right",
        padding: 8,
        fontSize: 10,
        fontWeight: 'bold',
        backgroundColor: '#161e2e',
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier'
    },
    wordCountError: { color: "#ff4444" },

    /* Media */
    mediaPreview: { height: 220, borderRadius: 8, overflow: 'hidden', backgroundColor: '#000', borderWidth: 1, borderColor: THEME.border, position: 'relative' },
    image: { width: '100%', height: '100%', opacity: 0.8 },
    mediaOverlay: { position: 'absolute', top: 0, left: 0, right: 0, padding: 10, flexDirection: 'row', justifyContent: 'space-between' },
    mediaTag: { backgroundColor: THEME.accent, color: THEME.bg, fontSize: 10, fontWeight: 'bold', padding: 4, borderRadius: 2 },
    removeBtn: { backgroundColor: 'rgba(0,0,0,0.8)', width: 28, height: 28, borderRadius: 4, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#555' },

    emptyMedia: {
        height: 100,
        borderWidth: 1,
        borderColor: THEME.border,
        borderStyle: 'dashed',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.5)'
    },
    emptyMediaText: { color: THEME.textSub, fontSize: 12, fontWeight: 'bold', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    emptyMediaSub: { color: '#555', fontSize: 10, marginTop: 4, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

    /* Toolbar */
    toolbar: {
        flexDirection: "row",
        alignItems: 'center',
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 20 : 12,
        backgroundColor: THEME.editorBg,
        borderTopWidth: 1,
        borderTopColor: THEME.accent
    },
    toolBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8 },
    toolText: { color: THEME.accent, fontWeight: 'bold', fontSize: 12, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    toolDivider: { width: 1, height: 20, backgroundColor: THEME.border },

    /* Popup */
    popupOverlay: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.9)", justifyContent: "center", alignItems: "center" },
    popup: { backgroundColor: THEME.editorBg, padding: 24, borderRadius: 8, alignItems: "center", width: "70%", borderWidth: 1, borderColor: THEME.accent },
    popupText: { color: "#fff", textAlign: "center", marginTop: 16, fontSize: 14, fontWeight: "bold", letterSpacing: 0.5, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
});