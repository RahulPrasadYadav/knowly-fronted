




// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from '@react-navigation/native';
// import * as Device from "expo-device";
// import { LinearGradient } from "expo-linear-gradient"; // 🔥 Gradient Import
// import React, { useEffect, useState } from 'react';
// import {
//     ActivityIndicator,
//     Dimensions,
//     FlatList,
//     Image,
//     Platform,
//     Share,
//     StatusBar,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View
// } from 'react-native';
// import { useAuth } from '../context/AuthContext';

// const { width } = Dimensions.get("window");

// /* ================= API CONFIGURATION ================= */
// const ENV = process.env.EXPO_PUBLIC_ENV || 'development';
// const URL_PROD = process.env.EXPO_PUBLIC_API_URL_PROD;
// const URL_PHONE = process.env.EXPO_PUBLIC_API_URL_PHONE;
// const URL_ANDROID = process.env.EXPO_PUBLIC_API_URL_ANDROID;

// const getBaseUrl = () => {
//     if (ENV === 'production' && URL_PROD) return URL_PROD;
//     if (Device.isDevice) return URL_PHONE;
//     return URL_ANDROID;
// };

// const BASE_URL = getBaseUrl();

// // 🔥 THEME (Startup Purple)
// const THEME = {
//     background: "#000000",
//     accent: "#7F5AF0",      // Startup Purple
//     textMain: "#FFFFFF",
//     textSec: "#94A1B2",
//     border: "#1F1F1F",
// };

// export default function UserProfile() {
//     const route = useRoute<any>();
//     const navigation = useNavigation<any>();
//     const { token } = useAuth() as any;
//     const { userId } = route.params || {};

//     const [profileData, setProfileData] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [isSubscribed, setIsSubscribed] = useState(false);
//     const [toast, setToast] = useState({ show: false, message: '' });

//     useEffect(() => {
//         if (userId) fetchUserProfile();
//     }, [userId]);

//     const showToast = (message: string) => {
//         setToast({ show: true, message });
//         setTimeout(() => setToast({ show: false, message: '' }), 3000);
//     };

//     const fetchUserProfile = async () => {
//         try {
//             const response = await fetch(`${BASE_URL}/users/${userId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             const data = await response.json();
//             setProfileData(data);
//             setIsSubscribed(data.is_subscribed);
//         } catch (error) {
//             console.error("Error fetching profile:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const toggleSubscribe = async () => {
//         if (!token) return;
//         const originalStatus = isSubscribed;
//         setIsSubscribed(!originalStatus);

//         const endpoint = originalStatus ? `/unsubscribe/${userId}` : `/subscribe/${userId}`;
//         const method = originalStatus ? "DELETE" : "POST";

//         try {
//             const response = await fetch(`${BASE_URL}${endpoint}`, {
//                 method: method,
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 },
//             });
//             if (!response.ok) throw new Error("Failed");

//             if (!originalStatus) showToast(`Subscribed to ${profileData.user.name} 🚀`);
//             else showToast(`Unsubscribed`);
//         } catch (error) {
//             setIsSubscribed(originalStatus);
//             showToast("Something went wrong!");
//         }
//     };

//     const onShare = async (title: string, content: string) => {
//         await Share.share({ title: title, message: `${title}\n\n${content}` });
//     };

//     const openPostDetails = (post: any) => {
//         navigation.navigate("PostDetails", { post: post });
//     };

//     const timeAgo = (date: string) => {
//         const diff = Date.now() - new Date(date).getTime();
//         const hrs = Math.floor(diff / (1000 * 60 * 60));
//         if (hrs < 24) return `${hrs}h ago`;
//         return `${Math.floor(hrs / 24)}d ago`;
//     };

//     /* ================= RENDER POST ITEM (Gradient Style) ================= */
//     const renderPostItem = ({ item }: { item: any }) => {
//         return (
//             <TouchableOpacity
//                 style={styles.cardContainer}
//                 activeOpacity={0.9}
//                 onPress={() => openPostDetails(item)}
//             >
//                 {/* 🔥 PURPLE GRADIENT CARD */}
//                 <LinearGradient
//                     colors={['rgba(20, 0, 30, 1)', '#000000', '#000000']}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 0, y: 0.6 }}
//                     style={styles.card}
//                 >
//                     <View style={styles.imageContainer}>
//                         <Image
//                             source={{ uri: item.media_url || "https://picsum.photos/600/400" }}
//                             style={styles.image}
//                             resizeMode="cover"
//                         />
//                     </View>
//                     <View style={styles.content}>
//                         <View style={styles.metaRow}>
//                             <Text style={styles.metaText}>
//                                 {timeAgo(item.created_at)} • {item.category || "General"}
//                             </Text>
//                             <View style={styles.rightIcons}>
//                                 <TouchableOpacity>
//                                     <Ionicons name="bookmark-outline" size={22} color={THEME.textSec} />
//                                 </TouchableOpacity>
//                                 <TouchableOpacity onPress={() => onShare(item.title, item.content)}>
//                                     <Ionicons name="share-social-outline" size={22} color={THEME.textSec} />
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                         <Text style={styles.title}>{item.title}</Text>
//                         <Text style={styles.text} numberOfLines={3}>{item.content}</Text>
//                     </View>
//                 </LinearGradient>
//             </TouchableOpacity>
//         );
//     };

//     if (loading) return <View style={styles.center}><ActivityIndicator color={THEME.accent} /></View>;
//     if (!profileData) return <View style={styles.center}><Text style={{ color: '#fff' }}>User not found</Text></View>;

//     const { user, posts } = profileData;

//     return (
//         <View style={styles.container}>
//             <StatusBar barStyle="light-content" backgroundColor="#000" />

//             {toast.show && (
//                 <View style={styles.toastContainer}>
//                     <Text style={styles.toastText}>{toast.message}</Text>
//                 </View>
//             )}

//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//                     <Ionicons name="arrow-back" size={24} color="#fff" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Profile</Text>
//                 <View style={{ width: 24 }} />
//             </View>

//             <FlatList
//                 data={posts}
//                 keyExtractor={(item) => item.id.toString()}
//                 renderItem={renderPostItem}
//                 showsVerticalScrollIndicator={false} // Scrollbar Hidden

//                 ListHeaderComponent={() => (
//                     <View style={styles.profileHeader}>
//                         <Image
//                             source={{ uri: user.profile_image ? `${BASE_URL}${user.profile_image}` : "https://via.placeholder.com/100" }}
//                             style={styles.avatar}
//                         />
//                         <Text style={styles.name}>{user.name}</Text>
//                         <Text style={styles.subText}>@{user.name.replace(/\s/g, '').toLowerCase()}</Text>

//                         <TouchableOpacity
//                             style={[
//                                 styles.bigButton,
//                                 { backgroundColor: isSubscribed ? '#1a1a1a' : THEME.accent }
//                             ]}
//                             onPress={toggleSubscribe}
//                         >
//                             <Text style={[
//                                 styles.btnText,
//                                 { color: isSubscribed ? '#fff' : '#000' }
//                             ]}>
//                                 {isSubscribed ? "Subscribed" : "Subscribe"}
//                             </Text>
//                         </TouchableOpacity>

//                         <View style={styles.divider} />
//                         <Text style={styles.sectionTitle}>Posts ({posts.length})</Text>
//                     </View>
//                 )}
//                 contentContainerStyle={{ paddingBottom: 40 }}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: THEME.background },
//     center: { flex: 1, backgroundColor: THEME.background, justifyContent: 'center', alignItems: 'center' },

//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//         paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 60,
//         paddingBottom: 10,
//         backgroundColor: '#000',
//         zIndex: 10
//     },
//     headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//     backButton: { padding: 5 },

//     toastContainer: {
//         position: 'absolute', top: 100, zIndex: 100, alignSelf: 'center',
//         backgroundColor: '#111', paddingHorizontal: 20, paddingVertical: 12,
//         borderRadius: 30, borderWidth: 1, borderColor: '#333',
//     },
//     toastText: { color: THEME.accent, fontWeight: 'bold', fontSize: 14 },

//     profileHeader: { alignItems: 'center', paddingTop: 10 },
//     avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12, borderWidth: 2, borderColor: THEME.accent },
//     name: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
//     subText: { color: '#888', marginBottom: 20 },
//     bigButton: { paddingHorizontal: 40, paddingVertical: 12, borderRadius: 30 },
//     btnText: { fontWeight: 'bold', fontSize: 16 },

//     divider: { width: '100%', height: 1, backgroundColor: '#1a1a1a', marginTop: 25, marginBottom: 15 },
//     sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: 16, marginBottom: 10 },

//     /* 🔥 UPDATED CARD STYLES */
//     cardContainer: { width: width, alignItems: "center", marginBottom: 20 },
//     card: {
//         width: width - 24,
//         // Gradient applied here directly via LinearGradient component
//         borderRadius: 16,
//         borderWidth: 1,
//         borderColor: "#1a1a1a",
//         overflow: "hidden"
//     },
//     imageContainer: { width: "100%", height: 220, backgroundColor: '#111' },
//     image: { width: "100%", height: "100%" },
//     content: { padding: 16 },

//     metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
//     metaText: { color: THEME.textSec, fontSize: 12, fontWeight: '500' },
//     rightIcons: { flexDirection: "row", gap: 16 },

//     title: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 8, lineHeight: 28 },
//     text: { color: "#ccc", fontSize: 15, lineHeight: 22, fontWeight: '400', paddingBottom: 4 },
// });





import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Platform,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get("window");

/* ================= API CONFIGURATION ================= */
const ENV = process.env.EXPO_PUBLIC_ENV || 'development';
const URL_PROD = process.env.EXPO_PUBLIC_API_URL_PROD;
const URL_PHONE = process.env.EXPO_PUBLIC_API_URL_PHONE;
const URL_ANDROID = process.env.EXPO_PUBLIC_API_URL_ANDROID;

const getBaseUrl = () => {
    if (ENV === 'production' && URL_PROD) return URL_PROD;
    if (Device.isDevice) return URL_PHONE;
    return URL_ANDROID;
};

const BASE_URL = getBaseUrl();

// 🔥 THEME: Deep Dark Navy Tech (Consistent)
const THEME = {
    bg: "#020617",       // 🔥 Darkest Navy
    card: "#0f172a",     // Lighter Navy for Cards
    accent: "#38bdf8",   // Sky Blue Glow
    textMain: "#f1f5f9", // Bright White
    textSec: "#94a3b8",  // Slate Gray
    border: "#1e293b",   // Tech Border
};

export default function UserProfile() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { token } = useAuth() as any;
    const { userId } = route.params || {};

    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '' });

    useEffect(() => {
        if (userId) fetchUserProfile();
    }, [userId]);

    const showToast = (message: string) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setProfileData(data);
            setIsSubscribed(data.is_subscribed);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSubscribe = async () => {
        if (!token) return;
        const originalStatus = isSubscribed;
        setIsSubscribed(!originalStatus);

        const endpoint = originalStatus ? `/unsubscribe/${userId}` : `/subscribe/${userId}`;
        const method = originalStatus ? "DELETE" : "POST";

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            if (!response.ok) throw new Error("Failed");

            if (!originalStatus) showToast(`Subscribed to ${profileData.user.name} 🚀`);
            else showToast(`Unsubscribed`);
        } catch (error) {
            setIsSubscribed(originalStatus);
            showToast("Something went wrong!");
        }
    };

    const onShare = async (title: string, content: string) => {
        await Share.share({ title: title, message: `${title}\n\n${content}` });
    };

    const openPostDetails = (post: any) => {
        navigation.navigate("PostDetails", { post: post });
    };

    const timeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    /* ================= RENDER POST ITEM (Tech Card) ================= */
    const renderPostItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity
                style={styles.cardContainer}
                activeOpacity={0.9}
                onPress={() => openPostDetails(item)}
            >
                <View style={styles.card}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: item.media_url || "https://picsum.photos/600/400" }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        {/* Tech Overlay */}
                        <LinearGradient
                            colors={['transparent', 'rgba(2, 6, 23, 0.9)']}
                            style={styles.imgOverlay}
                        />
                    </View>

                    <View style={styles.content}>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaText}>
                                {timeAgo(item.created_at)} • <Text style={{ color: THEME.accent }}>{item.category || "TECH"}</Text>
                            </Text>
                            <View style={styles.rightIcons}>
                                <TouchableOpacity>
                                    <Ionicons name="bookmark-outline" size={20} color={THEME.textSec} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onShare(item.title, item.content)}>
                                    <Ionicons name="share-social-outline" size={20} color={THEME.textSec} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.text} numberOfLines={3}>{item.content}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) return <View style={styles.center}><ActivityIndicator color={THEME.accent} size="large" /></View>;
    if (!profileData) return <View style={styles.center}><Text style={{ color: THEME.textSec, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' }}>// USER_NOT_FOUND</Text></View>;

    const { user, posts } = profileData;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />

            {toast.show && (
                <View style={styles.toastContainer}>
                    <Text style={styles.toastText}>{toast.message}</Text>
                </View>
            )}

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={THEME.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>USER_PROFILE</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPostItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}

                ListHeaderComponent={() => (
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={{ uri: user.profile_image ? `${BASE_URL}${user.profile_image}` : "https://via.placeholder.com/100" }}
                                style={styles.avatar}
                            />
                        </View>
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.subText}>@{user.name.replace(/\s/g, '').toLowerCase()}</Text>

                        <TouchableOpacity
                            style={[
                                styles.actionBtn,
                                { backgroundColor: isSubscribed ? THEME.card : THEME.accent, borderColor: isSubscribed ? THEME.border : THEME.accent }
                            ]}
                            onPress={toggleSubscribe}
                        >
                            <Text style={[
                                styles.btnText,
                                { color: isSubscribed ? THEME.textSec : '#000' }
                            ]}>
                                {isSubscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />
                        <View style={styles.statsRow}>
                            <Text style={styles.sectionTitle}>POSTS_LOG</Text>
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{posts.length}</Text>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.bg },
    center: { flex: 1, backgroundColor: THEME.bg, justifyContent: 'center', alignItems: 'center' },

    // 🔥 HEADER
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 15 : 60,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: THEME.border,
        backgroundColor: THEME.bg,
        zIndex: 10
    },
    headerTitle: { color: THEME.textMain, fontSize: 16, fontWeight: 'bold', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier', letterSpacing: 1 },
    backButton: { padding: 4 },

    toastContainer: {
        position: 'absolute', top: 100, zIndex: 100, alignSelf: 'center',
        backgroundColor: THEME.card, paddingHorizontal: 20, paddingVertical: 12,
        borderRadius: 4, borderWidth: 1, borderColor: THEME.accent,
    },
    toastText: { color: THEME.textMain, fontWeight: 'bold', fontSize: 12, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

    // 🔥 PROFILE INFO
    profileHeader: { alignItems: 'center', paddingTop: 20, paddingHorizontal: 20 },
    avatarWrapper: {
        padding: 4,
        borderWidth: 1,
        borderColor: THEME.accent,
        borderRadius: 50,
        marginBottom: 12,
        borderStyle: 'dashed' // Tech effect
    },
    avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: THEME.card },
    name: { color: THEME.textMain, fontSize: 20, fontWeight: 'bold', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier', letterSpacing: 0.5 },
    subText: { color: THEME.textSec, fontSize: 14, marginBottom: 20, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

    actionBtn: {
        paddingHorizontal: 32,
        paddingVertical: 10,
        borderRadius: 4,
        borderWidth: 1,
        minWidth: 140,
        alignItems: 'center'
    },
    btnText: { fontWeight: 'bold', fontSize: 14, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier', letterSpacing: 1 },

    divider: { width: '100%', height: 1, backgroundColor: THEME.border, marginTop: 25, marginBottom: 15 },

    statsRow: { flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
    sectionTitle: { color: THEME.textMain, fontSize: 14, fontWeight: 'bold', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier', letterSpacing: 1 },
    countBadge: { backgroundColor: THEME.card, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: THEME.border },
    countText: { color: THEME.accent, fontSize: 12, fontWeight: 'bold', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

    // 🔥 POST CARD (Tech Style)
    cardContainer: { width: width, alignItems: "center", marginTop: 20 },
    card: {
        width: width - 32,
        backgroundColor: THEME.card,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: THEME.border,
        overflow: "hidden"
    },
    imageContainer: { width: "100%", height: 200, backgroundColor: '#000', position: 'relative' },
    image: { width: "100%", height: "100%", opacity: 0.9 },
    imgOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%' },

    content: { padding: 16 },

    metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    metaText: { color: THEME.textSec, fontSize: 11, fontWeight: '500', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    rightIcons: { flexDirection: "row", gap: 16 },

    title: { color: THEME.textMain, fontSize: 18, fontWeight: "bold", marginBottom: 6, lineHeight: 24, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    text: { color: "#cbd5e1", fontSize: 14, lineHeight: 20, fontWeight: '400', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
});