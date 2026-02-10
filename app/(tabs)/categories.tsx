

// import { Ionicons } from "@expo/vector-icons";
// import * as Device from "expo-device";
// import React, { useEffect, useState } from 'react';
// import {
//     ActivityIndicator,
//     Dimensions,
//     FlatList,
//     Image,
//     StatusBar,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient'; // 🔥 Make sure to install this

// // --- PRODUCTION CONFIG ---
// const URL_PHONE = process.env.EXPO_PUBLIC_API_URL_PHONE || "http://192.168.0.13:8000";
// const URL_ANDROID = process.env.EXPO_PUBLIC_API_URL_ANDROID || "http://10.0.2.2:8000";
// const URL_PROD = process.env.EXPO_PUBLIC_API_URL_PROD;

// const getBaseUrl = () => {
//     if (!__DEV__ && URL_PROD) return URL_PROD;
//     return Device.isDevice ? URL_PHONE : URL_ANDROID;
// };

// const BASE_URL = getBaseUrl();
// const CATEGORIES_API = `${BASE_URL}/categories`;

// const { width } = Dimensions.get('window');

// // 🔥 THEME: High Contrast Purple
// const THEME = {
//     background: "#000000",
//     cardBg: "#0F0F0F",
//     accent: "#7F5AF0",      // Bright Startup Purple
//     textMain: "#FFFFFF",
//     textSec: "#94A1B2",
//     border: "#1F1F1F",
// };

// interface Category {
//     id: number;
//     name: string;
//     image_url: string;
// }

// export default function CategoriesScreen() {
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Changed to handle selection better
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     const fetchCategories = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(CATEGORIES_API);
//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//             const data = await response.json();
//             setCategories(data);
//         } catch (error) {
//             console.error("Fetch Error:", error);
//             setCategories([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const renderItem = ({ item }: { item: Category }) => {
//         // Simple logic: If name matches, it's selected
//         const isSelected = selectedCategory === item.name;

//         return (
//             <TouchableOpacity
//                 onPress={() => setSelectedCategory(item.name)}
//                 activeOpacity={0.8}
//                 style={styles.cardWrapper}
//             >
//                 {/* 🔥 GRADIENT BACKGROUND */}
//                 <LinearGradient
//                     // Active: Purple to Black | Inactive: Dark Grey to Black
//                     colors={isSelected 
//                         ? ['#4c3a7a', '#000000']  // Visible Purple Glow
//                         : ['#161616', '#0a0a0a']  // Subtle Dark
//                     }
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={[
//                         styles.categoryCard,
//                         isSelected && styles.categoryCardActive
//                     ]}
//                 >
//                     <View style={[
//                         styles.iconContainer,
//                         isSelected && styles.iconContainerActive
//                     ]}>
//                         {item.image_url ? (
//                             <Image
//                                 source={{ uri: item.image_url }}
//                                 style={styles.categoryImage}
//                                 resizeMode="cover"
//                             />
//                         ) : (
//                             <Ionicons
//                                 name="grid-outline"
//                                 size={24}
//                                 // Icon color: White if selected, Grey if not
//                                 color={isSelected ? "#FFF" : THEME.textSec}
//                             />
//                         )}
//                     </View>

//                     <Text style={[
//                         styles.categoryText,
//                         isSelected && styles.categoryTextActive
//                     ]} numberOfLines={1}>
//                         {item.name}
//                     </Text>

//                     {/* Active Dot (Purple) */}
//                     {isSelected && <View style={styles.activeDot} />}

//                 </LinearGradient>
//             </TouchableOpacity>
//         );
//     };

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

//             {/* HEADER */}
//             <View style={styles.header}>
//                 <TouchableOpacity style={styles.iconButton}>
//                     <Ionicons name="arrow-back" size={24} color={THEME.textMain} />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Discover</Text>
//                 <TouchableOpacity style={styles.iconButton}>
//                     <Ionicons name="search" size={24} color={THEME.textMain} />
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.contentContainer}>
//                 <Text style={styles.sectionTitle}>Browse Categories</Text>

//                 {loading ? (
//                     <View style={styles.loaderContainer}>
//                         <ActivityIndicator size="large" color={THEME.accent} />
//                         <Text style={{ color: THEME.textSec, marginTop: 10 }}>Loading...</Text>
//                     </View>
//                 ) : (
//                     <FlatList
//                         data={categories}
//                         renderItem={renderItem}
//                         keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
//                         numColumns={2}
//                         showsVerticalScrollIndicator={false}
//                         contentContainerStyle={styles.listContent}
//                         columnWrapperStyle={styles.columnWrapper}
//                         ListEmptyComponent={
//                             <View style={styles.emptyContainer}>
//                                 <Ionicons name="alert-circle-outline" size={40} color="#444" />
//                                 <Text style={styles.emptyText}>No categories found.</Text>
//                             </View>
//                         }
//                     />
//                 )}
//             </View>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: THEME.background },
//     loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

//     header: { 
//         flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
//         paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 
//     },
//     headerTitle: { fontSize: 20, fontWeight: '700', color: THEME.textMain },
//     iconButton: { padding: 8, backgroundColor: '#111', borderRadius: 20, borderWidth: 1, borderColor: '#222' },

//     contentContainer: { flex: 1, paddingHorizontal: 16 },
//     sectionTitle: { 
//         fontSize: 12, fontWeight: '700', color: THEME.accent, // Purple Title
//         textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16, marginLeft: 4 
//     },

//     listContent: { paddingBottom: 40 },
//     columnWrapper: { justifyContent: 'space-between' },

//     cardWrapper: {
//         width: (width - 48) / 2,
//         marginBottom: 16,
//     },

//     categoryCard: {
//         width: '100%',
//         borderRadius: 24,
//         padding: 16,
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderWidth: 1,
//         borderColor: THEME.border,
//         aspectRatio: 1.1,
//         position: 'relative',
//         // Default Shadow
//     },
//     categoryCardActive: { 
//         borderColor: THEME.accent, // Solid Purple Border
//         borderWidth: 2,            // Thoda mota border taaki dikhe
//         shadowColor: THEME.accent,
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//         elevation: 5
//     },

//     iconContainer: { 
//         width: 56, height: 56, borderRadius: 28, 
//         backgroundColor: '#16161a', 
//         justifyContent: 'center', alignItems: 'center', 
//         marginBottom: 12, borderWidth: 1, borderColor: '#333', overflow: 'hidden' 
//     },
//     iconContainerActive: { 
//         borderColor: '#fff', 
//         backgroundColor: THEME.accent // Solid Purple Background inside icon
//     },  

//     categoryImage: { width: '100%', height: '100%' },

//     categoryText: { fontSize: 14, fontWeight: '600', color: THEME.textSec, textAlign: 'center' },
//     categoryTextActive: { color: '#fff', fontWeight: '800' },

//     activeDot: { 
//         position: 'absolute', top: 12, right: 12, 
//         width: 10, height: 10, borderRadius: 5, 
//         backgroundColor: THEME.accent, // Purple Dot
//         borderWidth: 1, borderColor: '#fff'
//     },

//     emptyContainer: { flex: 1, alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
//     emptyText: { color: THEME.textSec, textAlign: 'center', marginTop: 12, lineHeight: 20 }
// });




import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Platform, // Added Platform for font logic
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- PRODUCTION CONFIG (UNCHANGED) ---
const URL_PHONE = process.env.EXPO_PUBLIC_API_URL_PHONE || "http://192.168.0.13:8000";
const URL_ANDROID = process.env.EXPO_PUBLIC_API_URL_ANDROID || "http://10.0.2.2:8000";
const URL_PROD = process.env.EXPO_PUBLIC_API_URL_PROD;

const getBaseUrl = () => {
    if (!__DEV__ && URL_PROD) return URL_PROD;
    return Device.isDevice ? URL_PHONE : URL_ANDROID;
};

const BASE_URL = getBaseUrl();
const CATEGORIES_API = `${BASE_URL}/categories`;

const { width } = Dimensions.get('window');

// 🔥 THEME: Deep Dark Navy Tech
const THEME = {
    bg: "#020617",       // 🔥 Darkest Navy
    cardBg: "#0f172a",   // Lighter Navy
    accent: "#38bdf8",   // Sky Blue Glow
    textMain: "#f1f5f9", // Bright White
    textSec: "#94a3b8",  // Slate Gray
    border: "#1e293b",   // Tech Border
};

interface Category {
    id: number;
    name: string;
    image_url: string;
}

export default function CategoriesScreen() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(CATEGORIES_API);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Fetch Error:", error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Category }) => {
        const isSelected = selectedCategory === item.name;

        return (
            <TouchableOpacity
                onPress={() => setSelectedCategory(item.name)}
                activeOpacity={0.8}
                style={styles.cardWrapper}
            >
                {/* 🔥 TECH CARD GRADIENT */}
                <LinearGradient
                    // Active: Dark Blue to Black | Inactive: Slate to Black
                    colors={isSelected
                        ? ['rgba(56, 189, 248, 0.2)', '#020617']  // Blue Tint
                        : [THEME.cardBg, '#020617']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.categoryCard,
                        isSelected && styles.categoryCardActive
                    ]}
                >
                    <View style={[
                        styles.iconContainer,
                        isSelected && styles.iconContainerActive
                    ]}>
                        {item.image_url ? (
                            <Image
                                source={{ uri: item.image_url }}
                                style={styles.categoryImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <Ionicons
                                name="grid-outline"
                                size={24}
                                color={isSelected ? "#FFF" : THEME.textSec}
                            />
                        )}
                    </View>

                    <Text style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextActive
                    ]} numberOfLines={1}>
                        {item.name.toUpperCase()}
                    </Text>

                    {/* Active Dot (Tech Style) */}
                    {isSelected && <View style={styles.activeDot} />}

                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color={THEME.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>// DISCOVER</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="search" size={24} color={THEME.textMain} />
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.sectionTitle}>&gt; BROWSE_NODES</Text>

                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={THEME.accent} />
                        <Text style={styles.loadingText}>INITIALIZING...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={categories}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        columnWrapperStyle={styles.columnWrapper}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="code-slash-outline" size={40} color={THEME.border} />
                                <Text style={styles.emptyText}>NO_DATA_FOUND</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.bg },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: THEME.textSec, marginTop: 10, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier', fontSize: 12 },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20,
        borderBottomWidth: 1, borderBottomColor: THEME.border
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: THEME.textMain, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier', letterSpacing: 1 },
    iconButton: { padding: 8, backgroundColor: THEME.cardBg, borderRadius: 8, borderWidth: 1, borderColor: THEME.border },

    contentContainer: { flex: 1, paddingHorizontal: 16 },
    sectionTitle: {
        fontSize: 12, fontWeight: 'bold', color: THEME.accent,
        marginTop: 20, marginBottom: 16, marginLeft: 4,
        fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier', letterSpacing: 1
    },

    listContent: { paddingBottom: 40 },
    columnWrapper: { justifyContent: 'space-between' },

    cardWrapper: {
        width: (width - 48) / 2,
        marginBottom: 16,
    },

    categoryCard: {
        width: '100%',
        borderRadius: 12, // Tech style (less rounded)
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: THEME.border,
        aspectRatio: 1.1,
        position: 'relative',
    },
    categoryCardActive: {
        borderColor: THEME.accent, // Sky Blue Border
        borderWidth: 1,
        shadowColor: THEME.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5
    },

    iconContainer: {
        width: 50, height: 50, borderRadius: 8, // Square-ish icons
        backgroundColor: '#020617',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 12, borderWidth: 1, borderColor: THEME.border, overflow: 'hidden'
    },
    iconContainerActive: {
        borderColor: THEME.accent,
        backgroundColor: 'rgba(56, 189, 248, 0.1)'
    },

    categoryImage: { width: '100%', height: '100%' },

    categoryText: {
        fontSize: 12, fontWeight: '600', color: THEME.textSec, textAlign: 'center',
        fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier'
    },
    categoryTextActive: { color: THEME.textMain, fontWeight: 'bold' },

    activeDot: {
        position: 'absolute', top: 10, right: 10,
        width: 6, height: 6, borderRadius: 0, // Square dot
        backgroundColor: THEME.accent,
        shadowColor: THEME.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4
    },

    emptyContainer: { flex: 1, alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
    emptyText: { color: THEME.textSec, textAlign: 'center', marginTop: 12, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' }
}); 