// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import * as Device from "expo-device";
// import React from "react";
// import {
//     Dimensions,
//     Image,
//     Platform,
//     SafeAreaView,
//     ScrollView,
//     Share,
//     StatusBar,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";

// const { width } = Dimensions.get("window");

// // URL Setup
// const URL_PHONE = process.env.EXPO_PUBLIC_API_URL_PHONE || "http://192.168.0.13:8000";
// const URL_ANDROID = process.env.EXPO_PUBLIC_API_URL_ANDROID || "http://10.0.2.2:8000";
// const URL_PROD = process.env.EXPO_PUBLIC_API_URL_PROD;

// const getBaseUrl = () => {
//     if (!__DEV__ && URL_PROD) return URL_PROD;
//     return Device.isDevice ? URL_PHONE : URL_ANDROID;
// };

// const BASE_URL = getBaseUrl();

// const THEME = {
//     background: "#000000",
//     cardBg: "#121212",
//     accent: "#00e096", // Green
//     textMain: "#E7E9EA",
//     textSec: "#71767B",
//     border: "#1a1a1a",
// };

// export default function PostDetails() {
//     const route = useRoute<any>();
//     const navigation = useNavigation();

//     // Route params se Post ka data nikala
//     const { post } = route.params || {};

//     // Agar galti se post data nahi aaya
//     if (!post) {
//         return (
//             <View style={styles.center}>
//                 <Text style={{ color: THEME.textMain }}>Post not found</Text>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
//                     <Text style={{ color: THEME.accent }}>Go Back</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     // Helper Functions
//     const timeAgo = (date: string) => {
//         const diff = Date.now() - new Date(date).getTime();
//         const hrs = Math.floor(diff / (1000 * 60 * 60));
//         if (hrs < 24) return `${hrs}h ago`;
//         return `${Math.floor(hrs / 24)}d ago`;
//     };

//     const onShare = async () => {
//         try {
//             await Share.share({
//                 title: post.title,
//                 message: `${post.title}\n\n${post.content}\n\nRead more on TechSharthi.`,
//             });
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // 🔥 1. FIXED IMAGE LOGIC (Slash Handling & Multiple Checks)

//     // Post Image Logic
//     const postImage = post.media_url || "https://picsum.photos/600/400";

//     // Author Name
//     const authorName = post.author_name || post.author?.name || post.user?.name || "Unknown Author";

//     // Author Image Logic (Robust)
//     let rawAuthorPath =
//         post.author_image ||          // Flat structure
//         post.author?.profile_image || // Nested author
//         post.user?.profile_image;     // User object

//     let authorImage = "https://via.placeholder.com/50"; // Default Fallback

//     if (rawAuthorPath) {
//         if (rawAuthorPath.startsWith("http")) {
//             // Agar full URL hai (Google login etc)
//             authorImage = rawAuthorPath;
//         } else {
//             // Agar relative path hai, to Slash (/) check karke join karo
//             const cleanBase = BASE_URL.replace(/\/$/, ""); // End ka slash hatao
//             const cleanPath = rawAuthorPath.replace(/^\//, ""); // Start ka slash hatao
//             authorImage = `${cleanBase}/${cleanPath}`; // Beech me ek slash lagao
//         }
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" backgroundColor="#000" />

//             {/* HEADER */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//                     <Ionicons name="arrow-back" size={24} color="#fff" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle} numberOfLines={1}>Post Details</Text>
//                 <TouchableOpacity onPress={onShare} style={styles.backButton}>
//                     <Ionicons name="share-outline" size={24} color="#fff" />
//                 </TouchableOpacity>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>

//                 {/* BIG IMAGE */}
//                 <View style={styles.imageContainer}>
//                     <Image source={{ uri: postImage }} style={styles.image} resizeMode="cover" />
//                 </View>

//                 {/* CONTENT SECTION */}
//                 <View style={styles.content}>

//                     {/* META DATA (Category & Time) */}
//                     <View style={styles.metaRow}>
//                         <View style={styles.tag}>
//                             <Text style={styles.tagText}>{post.category || "General"}</Text>
//                         </View>
//                         <Text style={styles.dateText}>{timeAgo(post.created_at)}</Text>
//                     </View>

//                     {/* TITLE */}
//                     <Text style={styles.title}>{post.title}</Text>

//                     {/* AUTHOR ROW */}
//                     <View style={styles.authorRow}>
//                         <Image
//                             source={{ uri: authorImage }}
//                             style={styles.avatar}
//                             // Agar image load fail ho to default dikhao
//                             defaultSource={{ uri: "https://via.placeholder.com/50" }}
//                         />
//                         <View>
//                             <Text style={styles.authorName}>{authorName}</Text>
//                             <Text style={styles.authorSub}>Author</Text>
//                         </View>
//                     </View>

//                     {/* DIVIDER */}
//                     <View style={styles.divider} />

//                     {/* MAIN BODY TEXT */}
//                     <Text style={styles.bodyText}>{post.content}</Text>

//                 </View>
//             </ScrollView>

//             {/* BOTTOM ACTION BAR */}
//             <View style={styles.bottomBar}>
//                 <TouchableOpacity style={styles.actionBtn}>
//                     <Ionicons name="heart-outline" size={24} color={THEME.textMain} />
//                     <Text style={styles.actionText}>Like</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.actionBtn}>
//                     <Ionicons name="chatbubble-outline" size={24} color={THEME.textMain} />
//                     <Text style={styles.actionText}>Comment</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.actionBtn} onPress={onShare}>
//                     <Ionicons name="share-social-outline" size={24} color={THEME.textMain} />
//                     <Text style={styles.actionText}>Share</Text>
//                 </TouchableOpacity>
//             </View>

//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: THEME.background },
//     center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: THEME.background },

//     // Header
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//         paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 10,
//         paddingBottom: 15,
//         backgroundColor: '#000',
//         borderBottomWidth: 1,
//         borderBottomColor: '#1a1a1a'
//     },
//     backButton: { padding: 5 },
//     headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center', marginHorizontal: 10 },

//     // Image
//     imageContainer: { width: width, height: 300, backgroundColor: '#111' },
//     image: { width: '100%', height: '100%' },

//     // Content
//     content: { padding: 20 },

//     metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
//     tag: { backgroundColor: 'rgba(0, 224, 150, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: THEME.accent },
//     tagText: { color: THEME.accent, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
//     dateText: { color: THEME.textSec, fontSize: 13 },

//     title: { color: THEME.textMain, fontSize: 24, fontWeight: '800', lineHeight: 32, marginBottom: 20 },

//     // Author
//     authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
//     avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12, borderWidth: 1, borderColor: '#333', backgroundColor: '#222' },
//     authorName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//     authorSub: { color: THEME.textSec, fontSize: 12 },

//     divider: { height: 1, backgroundColor: '#1a1a1a', marginVertical: 20 },

//     // Body
//     bodyText: { color: '#d1d1d1', fontSize: 17, lineHeight: 28, fontWeight: '400' },

//     // Bottom Bar
//     bottomBar: {
//         flexDirection: 'row',
//         borderTopWidth: 1,
//         borderTopColor: '#1a1a1a',
//         paddingVertical: 15,
//         paddingHorizontal: 30,
//         justifyContent: 'space-between',
//         backgroundColor: '#000'
//     },
//     actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//     actionText: { color: THEME.textMain, fontSize: 14, fontWeight: '500' }
// });





import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

// URL Setup (UNCHANGED)
const URL_PHONE = process.env.EXPO_PUBLIC_API_URL_PHONE || "http://192.168.0.13:8000";
const URL_ANDROID = process.env.EXPO_PUBLIC_API_URL_ANDROID || "http://10.0.2.2:8000";
const URL_PROD = process.env.EXPO_PUBLIC_API_URL_PROD;

const getBaseUrl = () => {
    if (!__DEV__ && URL_PROD) return URL_PROD;
    return Device.isDevice ? URL_PHONE : URL_ANDROID;
};

const BASE_URL = getBaseUrl();

// 🔥 THEME: Deep Dark Navy Tech
const THEME = {
    bg: "#020617",       // 🔥 Darkest Navy
    cardBg: "#0f172a",   // Lighter Navy
    accent: "#38bdf8",   // Sky Blue Glow
    textMain: "#f1f5f9", // Bright White
    textSec: "#94a3b8",  // Slate Gray
    border: "#1e293b",   // Dark Tech Border
};

export default function PostDetails() {
    const route = useRoute<any>();
    const navigation = useNavigation();

    // Route params se Post ka data nikala
    const { post } = route.params || {};

    // Agar galti se post data nahi aaya
    if (!post) {
        return (
            <View style={styles.center}>
                <Text style={{ color: THEME.textMain, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' }}>// ERROR: POST_NOT_FOUND</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
                    <Text style={{ color: THEME.accent, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' }}>&lt; GO_BACK</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Helper Functions
    const timeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    const onShare = async () => {
        try {
            await Share.share({
                title: post.title,
                message: `${post.title}\n\n${post.content}\n\nRead more on TechSharthi.`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    // 🔥 1. FIXED IMAGE LOGIC (Slash Handling & Multiple Checks)

    // Post Image Logic
    const postImage = post.media_url || "https://picsum.photos/600/400";

    // Author Name
    const authorName = post.author_name || post.author?.name || post.user?.name || "Unknown";

    // Author Image Logic (Robust)
    let rawAuthorPath =
        post.author_image ||          // Flat structure
        post.author?.profile_image || // Nested author
        post.user?.profile_image;     // User object

    let authorImage = "https://via.placeholder.com/50"; // Default Fallback

    if (rawAuthorPath) {
        if (rawAuthorPath.startsWith("http")) {
            authorImage = rawAuthorPath;
        } else {
            const cleanBase = BASE_URL.replace(/\/$/, "");
            const cleanPath = rawAuthorPath.replace(/^\//, "");
            authorImage = `${cleanBase}/${cleanPath}`;
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>POST_DETAILS</Text>
                <TouchableOpacity onPress={onShare} style={styles.backButton}>
                    <Ionicons name="share-social-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>

                {/* BIG IMAGE WITH OVERLAY */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: postImage }} style={styles.image} resizeMode="cover" />
                    {/* Tech Overlay Gradient */}
                    <LinearGradient
                        colors={['transparent', THEME.bg]}
                        style={styles.imgOverlay}
                    />
                </View>

                {/* CONTENT SECTION */}
                <View style={styles.content}>

                    {/* META DATA (Category & Time) */}
                    <View style={styles.metaRow}>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{post.category || "TECH"}</Text>
                        </View>
                        <Text style={styles.dateText}>// {timeAgo(post.created_at)}</Text>
                    </View>

                    {/* TITLE */}
                    <Text style={styles.title}>{post.title}</Text>

                    {/* AUTHOR ROW */}
                    <View style={styles.authorRow}>
                        <Image
                            source={{ uri: authorImage }}
                            style={styles.avatar}
                            defaultSource={{ uri: "https://via.placeholder.com/50" }}
                        />
                        <View>
                            <Text style={styles.authorLabel}>AUTHOR</Text>
                            <Text style={styles.authorName}>{authorName}</Text>
                        </View>
                    </View>

                    {/* DIVIDER */}
                    <View style={styles.divider} />

                    {/* MAIN BODY TEXT */}
                    <Text style={styles.bodyText}>{post.content}</Text>

                </View>
            </ScrollView>

            {/* BOTTOM ACTION BAR */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="heart-outline" size={22} color={THEME.textMain} />
                    <Text style={styles.actionText}>LIKE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="chatbubble-outline" size={22} color={THEME.textMain} />
                    <Text style={styles.actionText}>COMMENT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={onShare}>
                    <Ionicons name="share-outline" size={22} color={THEME.textMain} />
                    <Text style={styles.actionText}>SHARE</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.bg },
    center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: THEME.bg },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 10,
        paddingBottom: 15,
        backgroundColor: THEME.bg,
        borderBottomWidth: 1,
        borderBottomColor: THEME.border
    },
    backButton: { padding: 5 },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
        letterSpacing: 1
    },

    // Image
    imageContainer: { width: width, height: 280, backgroundColor: '#000', position: 'relative' },
    image: { width: '100%', height: '100%', opacity: 0.9 },
    imgOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 },

    // Content
    content: { padding: 20 },

    metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    tag: {
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: THEME.accent
    },
    tagText: {
        color: THEME.accent,
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
        textTransform: 'uppercase'
    },
    dateText: {
        color: THEME.textSec,
        fontSize: 12,
        fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier'
    },

    title: {
        color: THEME.textMain,
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 32,
        marginBottom: 20,
        fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
        letterSpacing: -0.5
    },

    // Author
    authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
        borderWidth: 1,
        borderColor: THEME.accent,
        backgroundColor: '#222'
    },
    authorLabel: {
        color: THEME.textSec,
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier'
    },
    authorName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier'
    },

    divider: { height: 1, backgroundColor: THEME.border, marginVertical: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: THEME.border },

    // Body
    bodyText: {
        color: '#cbd5e1',
        fontSize: 17,
        lineHeight: 28,
        fontWeight: '400',
        fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier'
    },

    // Bottom Bar
    bottomBar: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: THEME.border,
        paddingVertical: 15,
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        backgroundColor: THEME.bg
    },
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    actionText: {
        color: THEME.textMain,
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
        letterSpacing: 1
    }
});