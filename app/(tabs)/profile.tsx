


// import { Ionicons } from "@expo/vector-icons";
// import * as Clipboard from "expo-clipboard";
// import * as Device from "expo-device"; // 👈 IMPORT ADDED
// import * as ImagePicker from "expo-image-picker";
// import { useFocusEffect, useRouter } from "expo-router";
// import React, { useCallback, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     Animated,
//     Dimensions,
//     Easing,
//     FlatList,
//     Image,
//     Modal,
//     Platform,
//     RefreshControl,
//     SafeAreaView,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { useAuth } from "../../context/AuthContext";

// const { width } = Dimensions.get("window");

// /* ================= API CONFIGURATION (FIXED) ================= */
// const ENV = process.env.EXPO_PUBLIC_ENV || 'development';
// const URL_PROD = process.env.EXPO_PUBLIC_API_URL_PROD;
// const URL_PHONE = process.env.EXPO_PUBLIC_API_URL_PHONE;   // Ngrok URL yahan aayega
// const URL_ANDROID = process.env.EXPO_PUBLIC_API_URL_ANDROID; // 10.0.2.2 yahan aayega

// const getBaseUrl = () => {
//     if (ENV === 'production' && URL_PROD) return URL_PROD;
//     if (Device.isDevice) return URL_PHONE;
//     return URL_ANDROID;
// };

// const BASE_URL = getBaseUrl();

// // Debugging
// console.log("🔗 Profile API Base URL:", BASE_URL);

// const API_ME = `${BASE_URL}/me`;
// const API_PROFILE = `${BASE_URL}/profile`;
// const API_PROFILE_IMAGE = `${BASE_URL}/profile-image`;
// const API_MY_POSTS = `${BASE_URL}/my-posts`;
// const API_MY_SUBSCRIBERS = `${BASE_URL}/my-subscriptions`;
// const API_DELETE_POST = (id: string) => `${BASE_URL}/posts/${id}`;

// /* ================= UPDATED THEME (PURPLE STARTUP) ================= */
// const THEME = {
//     bg: "#000000",      // Pitch Black
//     card: "#0F0F0F",    // Slightly lighter black for cards
//     accent: "#7F5AF0",  // 🔥 Startup Purple (Changed from Green)
//     text: "#FFFFFF",
//     sub: "#94A1B2",     // Cool Gray
//     border: "#1F1F1F",  // Subtle Border
//     danger: "#ef4444",
//     success: "#00C851",
//     buttonGrey: "#1A1A1A",
// };

// export default function ProfileScreen() {
//     const router = useRouter();
//     const { token, logout } = useAuth() as any;
//     const cleanToken = token ? token.replace(/^"|"$/g, '') : null;

//     const [user, setUser] = useState<any>(null);
//     const [myPosts, setMyPosts] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [isUploading, setIsUploading] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);
//     const [imageHash, setImageHash] = useState(Date.now());

//     // UI States
//     const [editVisible, setEditVisible] = useState(false);
//     const [settingsVisible, setSettingsVisible] = useState(false);
//     const [activeTab, setActiveTab] = useState<"activity" | "saved">("activity");
//     const [confirmVisible, setConfirmVisible] = useState(false);

//     // 👇 SUBSCRIBERS STATE
//     const [subscribersVisible, setSubscribersVisible] = useState(false);
//     const [subscribersList, setSubscribersList] = useState<any[]>([]);
//     const [loadingSubs, setLoadingSubs] = useState(false);

//     // 👇 SCROLLBAR STATES (NEW LOGIC)
//     const scrollIndicator = useRef(new Animated.Value(0)).current;
//     const [completeScrollBarHeight, setCompleteScrollBarHeight] = useState(1);
//     const [visibleScrollBarHeight, setVisibleScrollBarHeight] = useState(0);

//     // Calculation for Scrollbar Size
//     const scrollIndicatorSize = completeScrollBarHeight > visibleScrollBarHeight
//         ? (visibleScrollBarHeight * visibleScrollBarHeight) / completeScrollBarHeight
//         : visibleScrollBarHeight;

//     const difference = visibleScrollBarHeight > scrollIndicatorSize
//         ? visibleScrollBarHeight - scrollIndicatorSize
//         : 1;

//     // Calculation for Scrollbar Position
//     const scrollIndicatorPosition = Animated.multiply(
//         scrollIndicator,
//         visibleScrollBarHeight / completeScrollBarHeight
//     ).interpolate({
//         inputRange: [0, difference],
//         outputRange: [0, difference],
//         extrapolate: 'clamp'
//     });

//     // 👇 POST OPTIONS STATES
//     const [optionsVisible, setOptionsVisible] = useState(false);
//     const [selectedPost, setSelectedPost] = useState<any>(null);

//     const [editData, setEditData] = useState({
//         first_name: "",
//         last_name: "",
//         phone: "",
//     });

//     // TOAST NOTIFICATION STATE
//     const [toastMessage, setToastMessage] = useState("");
//     const [toastType, setToastType] = useState<"success" | "normal">("normal");
//     const toastAnim = useRef(new Animated.Value(-100)).current;

//     /* ================= TOAST HELPER ================= */
//     const showToast = (message: string, type: "success" | "normal" = "normal") => {
//         setToastMessage(message);
//         setToastType(type);
//         toastAnim.setValue(-100);
//         Animated.timing(toastAnim, {
//             toValue: 0,
//             duration: 300,
//             useNativeDriver: true,
//             easing: Easing.out(Easing.ease),
//         }).start();

//         setTimeout(() => {
//             Animated.timing(toastAnim, {
//                 toValue: -100,
//                 duration: 300,
//                 useNativeDriver: true,
//                 easing: Easing.in(Easing.ease),
//             }).start();
//         }, 2500);
//     };

//     /* ================= FETCH PROFILE & POSTS ================= */
//     const fetchProfile = async (isRefresh = false) => {
//         if (!cleanToken) {
//             setLoading(false);
//             return;
//         }
//         try {
//             const res = await fetch(API_ME, {
//                 method: "GET",
//                 headers: { "Authorization": `Bearer ${cleanToken}`, "Content-Type": "application/json" },
//             });

//             if (!res.ok) {
//                 if (res.status === 401) logout();
//                 return;
//             }

//             const data = await res.json();
//             setUser(data);
//             setEditData({
//                 first_name: data.first_name || "",
//                 last_name: data.last_name || "",
//                 phone: data.phone || "",
//             });

//             const postRes = await fetch(API_MY_POSTS, {
//                 method: "GET",
//                 headers: { "Content-Type": "application/json", "Authorization": `Bearer ${cleanToken}` },
//             });

//             if (postRes.ok) {
//                 const postsData = await postRes.json();
//                 if (Array.isArray(postsData)) {
//                     setMyPosts(postsData);
//                 } else if (postsData.posts && Array.isArray(postsData.posts)) {
//                     setMyPosts(postsData.posts);
//                 } else {
//                     setMyPosts([]);
//                 }
//             }
//         } catch (e: any) {
//             console.error("🔥 Error in Profile Fetch:", e);
//         } finally {
//             if (!isRefresh) setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     /* ================= FETCH SUBSCRIBERS ================= */
//     const handleOpenSubscribers = async () => {
//         setSubscribersVisible(true);
//         setLoadingSubs(true);
//         try {
//             const res = await fetch(API_MY_SUBSCRIBERS, {
//                 method: "GET",
//                 headers: { "Authorization": `Bearer ${cleanToken}` }
//             });

//             if (res.ok) {
//                 const data = await res.json();
//                 setSubscribersList(Array.isArray(data) ? data : data.subscribers || []);
//             } else {
//                 showToast("Failed to fetch subscribers");
//             }
//         } catch (e) {
//             console.error(e);
//             showToast("Error loading subscribers");
//         } finally {
//             setLoadingSubs(false);
//         }
//     };

//     const handleNavigateToUser = (userId: number) => {
//         setSubscribersVisible(false);
//         router.push({
//             pathname: "/UserProfile",
//             params: { userId: userId }
//         });
//     };

//     useFocusEffect(
//         useCallback(() => {
//             fetchProfile();
//         }, [cleanToken])
//     );

//     /* ================= POST ACTIONS ================= */
//     const handleOpenOptions = (post: any) => {
//         setSelectedPost(post);
//         setOptionsVisible(true);
//     };

//     const handleCopyText = async () => {
//         if (selectedPost?.content) {
//             await Clipboard.setStringAsync(selectedPost.content);
//             setOptionsVisible(false);
//             showToast("Text copied to clipboard");
//         }
//     };

//     const handleEditPost = () => {
//         setOptionsVisible(false);
//         Alert.alert("Info", "Edit feature coming soon!");
//     };

//     const handleDeletePost = () => {
//         Alert.alert(
//             "Delete Post",
//             "Are you sure you want to delete this post?",
//             [
//                 { text: "Cancel", style: "cancel" },
//                 {
//                     text: "Delete",
//                     style: "destructive",
//                     onPress: async () => {
//                         if (!selectedPost) return;
//                         setOptionsVisible(false);
//                         try {
//                             const res = await fetch(API_DELETE_POST(selectedPost.id), {
//                                 method: "DELETE",
//                                 headers: { "Authorization": `Bearer ${cleanToken}` }
//                             });
//                             if (!res.ok) throw new Error("Failed to delete");
//                             setMyPosts(prev => prev.filter(p => p.id !== selectedPost.id));
//                             showToast("Post deleted successfully", "success");
//                         } catch (e) {
//                             Alert.alert("Error", "Could not delete post.");
//                         }
//                     }
//                 }
//             ]
//         );
//     };

//     /* ================= IMAGE ACTIONS ================= */
//     const pickImage = async () => {
//         const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (!perm.granted) {
//             Alert.alert("Permission required", "Please allow access to photos.");
//             return;
//         }
//         const result = await ImagePicker.launchImageLibraryAsync({
//             allowsEditing: true, aspect: [1, 1], quality: 0.7,
//         });
//         if (!result.canceled) uploadImage(result.assets[0]);
//     };

//     const uploadImage = async (img: any) => {
//         if (!cleanToken) return;
//         setIsUploading(true);
//         const formData = new FormData();
//         const filename = img.uri.split('/').pop();
//         const match = /\.(\w+)$/.exec(filename);
//         const type = match ? `image/${match[1]}` : `image/jpeg`;

//         formData.append("image", {
//             uri: img.uri, name: filename || "profile.jpg", type: type,
//         } as any);

//         try {
//             const res = await fetch(API_PROFILE_IMAGE, {
//                 method: "POST",
//                 headers: { "Authorization": `Bearer ${cleanToken}`, "Content-Type": "multipart/form-data" },
//                 body: formData,
//             });
//             if (!res.ok) throw new Error("Upload Failed");
//             await fetchProfile(true);
//             setImageHash(Date.now());
//             showToast("Image updated successfully");
//         } catch (e: any) {
//             Alert.alert("Upload Failed", "Could not upload image.");
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     const handleRemoveRequest = () => setConfirmVisible(true);

//     const confirmRemoveImage = async () => {
//         setConfirmVisible(false);
//         setIsUploading(true);
//         try {
//             const res = await fetch(API_PROFILE_IMAGE, {
//                 method: "DELETE",
//                 headers: { "Authorization": `Bearer ${cleanToken}` }
//             });
//             if (!res.ok) throw new Error("Delete Failed");
//             await fetchProfile(true);
//             setImageHash(Date.now());
//             showToast("Image removed successfully");
//         } catch (e) {
//             Alert.alert("Error", "Failed to remove photo");
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     const saveProfile = async () => {
//         try {
//             const res = await fetch(API_PROFILE, {
//                 method: "PUT",
//                 headers: { "Authorization": `Bearer ${cleanToken}`, "Content-Type": "application/json" },
//                 body: JSON.stringify(editData),
//             });
//             if (!res.ok) throw new Error("Update Failed");
//             setEditVisible(false);
//             fetchProfile(true);
//             setTimeout(() => showToast("Profile updated successfully"), 300);
//         } catch (e) {
//             Alert.alert("Update failed", "Could not save profile changes.");
//         }
//     };

//     if (loading) {
//         return (
//             <View style={styles.center}>
//                 <ActivityIndicator color={THEME.accent} size="large" />
//             </View>
//         );
//     }

//     if (!user) return null;

//     const imageUrl = user?.profile_image
//         ? `${BASE_URL}${user.profile_image}`
//         : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";

//     // Feed Item Helper
//     const FeedItem = ({ item }: { item: any }) => {
//         const date = new Date(item.created_at);
//         const timeAgo = date.toLocaleDateString();

//         return (
//             <View style={styles.feedItem}>
//                 <Image source={{ uri: `${imageUrl}?v=${imageHash}` }} style={styles.feedAvatar} />
//                 <View style={styles.feedContent}>
//                     <View style={styles.feedHeaderRow}>
//                         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                             <Text style={styles.feedName}>{item.author_name || user.first_name}</Text>
//                             <Text style={styles.feedTime}> • {timeAgo}</Text>
//                         </View>
//                         <TouchableOpacity onPress={() => handleOpenOptions(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
//                             <Ionicons name="ellipsis-horizontal" size={20} color={THEME.sub} />
//                         </TouchableOpacity>
//                     </View>
//                     {item.title && <Text style={styles.feedTitle}>{item.title}</Text>}
//                     <Text style={styles.feedText}>{item.content}</Text>
//                     {item.media_url && (
//                         <Image
//                             source={{ uri: item.media_url }}
//                             style={styles.postImage}
//                             resizeMode="cover"
//                         />
//                     )}
//                     <View style={styles.feedFooter}>
//                         <TouchableOpacity style={styles.footerBtn}>
//                             <Ionicons name="share-social-outline" size={20} color={THEME.sub} />
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>
//         );
//     };

//     const MenuItem = ({ icon, label, onPress, isDestructive = false }: any) => (
//         <TouchableOpacity style={styles.menuItem} onPress={onPress}>
//             <View style={styles.menuItemLeft}>
//                 <Ionicons name={icon} size={22} color={isDestructive ? THEME.danger : THEME.text} />
//                 <Text style={[styles.menuItemText, isDestructive && { color: THEME.danger }]}>{label}</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={18} color={THEME.sub} />
//         </TouchableOpacity>
//     );

//     const ToastComponent = () => (
//         <Animated.View style={[
//             styles.toastContainer,
//             { transform: [{ translateY: toastAnim }] },
//             toastType === "success" && { backgroundColor: "rgba(0, 200, 81, 0.95)", borderColor: THEME.success }
//         ]}>
//             <Ionicons
//                 name={toastType === "success" ? "checkmark-circle" : "information-circle"}
//                 size={22}
//                 color={toastType === "success" ? "#fff" : THEME.accent}
//             />
//             <Text style={[styles.toastText, toastType === "success" && { color: "#fff" }]}>
//                 {toastMessage}
//             </Text>
//         </Animated.View>
//     );

//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
//             {!editVisible && <ToastComponent />}

//             <View style={styles.topNav}>
//                 <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
//                     <Ionicons name="arrow-back" size={24} color={THEME.text} />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => setSettingsVisible(true)} style={styles.iconButton}>
//                     <Ionicons name="settings-outline" size={24} color={THEME.text} />
//                 </TouchableOpacity>
//             </View>

//             <ScrollView
//                 style={{ flex: 1 }}
//                 refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProfile(true); }} tintColor={THEME.accent} />}
//                 stickyHeaderIndices={[1]}
//             >
//                 {/* HEADER */}
//                 <View style={styles.headerContainer}>
//                     <View style={styles.profileRow}>
//                         <View style={styles.profileTextContainer}>
//                             <Text style={styles.fullName}>{user.first_name} {user.last_name}</Text>
//                             <Text style={styles.username}>@{user.email?.split('@')[0]}</Text>
//                             <View style={styles.followsYouBadge}>
//                                 <Text style={styles.followsYouText}>follows you</Text>
//                             </View>
//                         </View>
//                         <View>
//                             <Image source={{ uri: `${imageUrl}?v=${imageHash}` }} style={styles.avatar} />
//                         </View>
//                     </View>

//                     <Text style={styles.sectionTitle}>See subscribers</Text>

//                     <View style={styles.actionButtons}>
//                         <TouchableOpacity style={styles.secondaryBtn} onPress={() => setEditVisible(true)}>
//                             <Text style={styles.secondaryBtnText}>Edit</Text>
//                         </TouchableOpacity>
//                     </View>

//                     <TouchableOpacity style={styles.subscriberBox} onPress={handleOpenSubscribers}>
//                         <View style={styles.subBoxContent}>
//                             <Ionicons name="people" size={18} color={THEME.text} />
//                             <Text style={styles.subBoxText}>My Subscribers</Text>
//                         </View>
//                         <Ionicons name="chevron-forward" size={18} color={THEME.sub} />
//                     </TouchableOpacity>
//                 </View>

//                 {/* TABS */}
//                 <View style={styles.tabContainer}>
//                     <TouchableOpacity
//                         style={[styles.tab, activeTab === "activity" && styles.activeTab]}
//                         onPress={() => setActiveTab("activity")}
//                     >
//                         <Text style={[styles.tabText, activeTab === "activity" && styles.activeTabText]}>Activity</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={[styles.tab, activeTab === "saved" && styles.activeTab]}
//                         onPress={() => setActiveTab("saved")}
//                     >
//                         <Text style={[styles.tabText, activeTab === "saved" && styles.activeTabText]}>Saved</Text>
//                     </TouchableOpacity>
//                 </View>

//                 {/* CONTENT */}
//                 <View style={styles.contentArea}>
//                     {activeTab === "activity" ? (
//                         <View style={styles.feedContainer}>
//                             {myPosts.length > 0 ? (
//                                 myPosts.map((post) => (
//                                     <FeedItem key={post.id} item={post} />
//                                 ))
//                             ) : (
//                                 <View style={styles.emptyState}>
//                                     <Text style={styles.emptySub}>No activity yet.</Text>
//                                 </View>
//                             )}
//                         </View>
//                     ) : (
//                         <View style={styles.emptyState}>
//                             <Ionicons name="bookmark-outline" size={48} color={THEME.sub} style={{ marginBottom: 10 }} />
//                             <Text style={styles.emptyTitle}>Saved Posts</Text>
//                             <Text style={styles.emptySub}>Posts you saved for later.</Text>
//                         </View>
//                     )}
//                 </View>
//             </ScrollView>

//             {/* SUBSCRIBERS LIST MODAL */}
//             <Modal visible={subscribersVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSubscribersVisible(false)}>
//                 <View style={{ flex: 1, backgroundColor: '#000' }}>
//                     <View style={styles.modalHeader}>
//                         <Text style={styles.modalTitle}>Subscribers</Text>
//                         <TouchableOpacity onPress={() => setSubscribersVisible(false)}>
//                             <Ionicons name="close-circle" size={28} color={THEME.sub} />
//                         </TouchableOpacity>
//                     </View>

//                     {loadingSubs ? (
//                         <ActivityIndicator size="large" color={THEME.accent} style={{ marginTop: 50 }} />
//                     ) : (
//                         <View style={{ flex: 1, flexDirection: 'row' }}>
//                             <FlatList
//                                 data={subscribersList}
//                                 keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//                                 contentContainerStyle={{ padding: 20, paddingRight: 30 }}
//                                 showsVerticalScrollIndicator={false}
//                                 onScroll={Animated.event(
//                                     [{ nativeEvent: { contentOffset: { y: scrollIndicator } } }],
//                                     { useNativeDriver: false }
//                                 )}
//                                 scrollEventThrottle={16}
//                                 onContentSizeChange={(_, h) => setCompleteScrollBarHeight(h)}
//                                 onLayout={({ nativeEvent }) => setVisibleScrollBarHeight(nativeEvent.layout.height)}

//                                 ListEmptyComponent={
//                                     <Text style={{ color: THEME.sub, textAlign: 'center', marginTop: 20 }}>
//                                         No subscribers yet.
//                                     </Text>
//                                 }
//                                 renderItem={({ item }) => (
//                                     <TouchableOpacity
//                                         style={styles.subscriberItem}
//                                         onPress={() => handleNavigateToUser(item.id)}
//                                     >
//                                         <Image
//                                             source={{ uri: item.profile_image ? `${BASE_URL}${item.profile_image}` : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" }}
//                                             style={styles.subscriberAvatar}
//                                         />
//                                         <View>
//                                             <Text style={styles.subscriberName}>
//                                                 {item.name || `${item.first_name} ${item.last_name}` || "User"}
//                                             </Text>
//                                             <Text style={{ color: THEME.sub, fontSize: 12 }}>Tap to view profile</Text>
//                                         </View>
//                                         <Ionicons name="chevron-forward" size={16} color={THEME.sub} style={{ marginLeft: 'auto' }} />
//                                     </TouchableOpacity>
//                                 )}
//                             />
//                         </View>
//                     )}
//                 </View>
//             </Modal>

//             {/* OPTIONS MODAL */}
//             <Modal visible={optionsVisible} transparent animationType="fade" onRequestClose={() => setOptionsVisible(false)}>
//                 <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setOptionsVisible(false)}>
//                     <View style={styles.optionsSheet}>
//                         <View style={styles.optionsHandle} />
//                         <TouchableOpacity style={styles.optionItem} onPress={handleEditPost}>
//                             <Ionicons name="create-outline" size={24} color={THEME.text} />
//                             <Text style={styles.optionText}>Edit Post</Text>
//                         </TouchableOpacity>
//                         <View style={styles.optionDivider} />
//                         <TouchableOpacity style={styles.optionItem} onPress={handleCopyText}>
//                             <Ionicons name="copy-outline" size={24} color={THEME.text} />
//                             <Text style={styles.optionText}>Copy Text</Text>
//                         </TouchableOpacity>
//                         <View style={styles.optionDivider} />
//                         <TouchableOpacity style={styles.optionItem} onPress={handleDeletePost}>
//                             <Ionicons name="trash-outline" size={24} color={THEME.danger} />
//                             <Text style={[styles.optionText, { color: THEME.danger }]}>Delete Post</Text>
//                         </TouchableOpacity>
//                         <View style={{ height: 20 }} />
//                     </View>
//                 </TouchableOpacity>
//             </Modal>

//             {/* EDIT PROFILE MODAL */}
//             <Modal visible={editVisible} animationType="slide" transparent={false}>
//                 <SafeAreaView style={styles.editScreenContainer}>
//                     <ToastComponent />
//                     <View style={styles.editHeader}>
//                         <TouchableOpacity onPress={() => setEditVisible(false)}>
//                             <Ionicons name="close" size={28} color={THEME.text} />
//                         </TouchableOpacity>
//                         <Text style={styles.editHeaderTitle}>Edit Profile</Text>
//                         <TouchableOpacity onPress={saveProfile}>
//                             <Text style={{ color: THEME.accent, fontWeight: 'bold', fontSize: 16 }}>Save</Text>
//                         </TouchableOpacity>
//                     </View>
//                     <ScrollView style={{ padding: 20 }}>
//                         <View style={styles.editImageSection}>
//                             <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
//                                 <Image source={{ uri: `${imageUrl}?v=${imageHash}` }} style={styles.editAvatar} />
//                                 {isUploading && (
//                                     <View style={styles.uploadingOverlay}>
//                                         <ActivityIndicator size="small" color={THEME.accent} />
//                                     </View>
//                                 )}
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={pickImage}>
//                                 <Text style={styles.changePhotoText}>Change photo</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={handleRemoveRequest} style={{ marginTop: 15 }}>
//                                 <Text style={{ color: THEME.danger, fontSize: 14 }}>Remove photo</Text>
//                             </TouchableOpacity>
//                         </View>
//                         <View style={styles.inputGroup}>
//                             <Text style={styles.inputLabel}>Name</Text>
//                             <View style={{ flexDirection: 'row', gap: 10 }}>
//                                 <TextInput
//                                     style={[styles.inputField, { flex: 1 }]}
//                                     value={editData.first_name}
//                                     placeholder="First Name"
//                                     placeholderTextColor={THEME.sub}
//                                     onChangeText={(t) => setEditData({ ...editData, first_name: t })}
//                                 />
//                                 <TextInput
//                                     style={[styles.inputField, { flex: 1 }]}
//                                     value={editData.last_name}
//                                     placeholder="Last Name"
//                                     placeholderTextColor={THEME.sub}
//                                     onChangeText={(t) => setEditData({ ...editData, last_name: t })}
//                                 />
//                             </View>
//                         </View>
//                         <View style={styles.inputGroup}>
//                             <Text style={styles.inputLabel}>Phone</Text>
//                             <TextInput
//                                 style={styles.inputField}
//                                 value={editData.phone}
//                                 placeholder="Phone Number"
//                                 placeholderTextColor={THEME.sub}
//                                 keyboardType="phone-pad"
//                                 onChangeText={(t) => setEditData({ ...editData, phone: t })}
//                             />
//                         </View>
//                     </ScrollView>
//                 </SafeAreaView>
//             </Modal>

//             {/* CONFIRM MODAL */}
//             <Modal transparent={true} visible={confirmVisible} animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.customAlertBox}>
//                         <Text style={styles.alertTitle}>Remove Photo?</Text>
//                         <Text style={styles.alertMessage}>Are you sure you want to remove your profile photo?</Text>
//                         <View style={styles.alertButtons}>
//                             <TouchableOpacity style={[styles.alertBtn, styles.alertBtnCancel]} onPress={() => setConfirmVisible(false)}>
//                                 <Text style={styles.alertBtnText}>Cancel</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={[styles.alertBtn, styles.alertBtnDestructive]} onPress={confirmRemoveImage}>
//                                 <Text style={[styles.alertBtnText, { color: THEME.danger }]}>Remove</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>

//             {/* SETTINGS MODAL */}
//             <Modal visible={settingsVisible} animationType="slide" presentationStyle="pageSheet">
//                 <View style={styles.settingsScreen}>
//                     <View style={styles.settingsHeader}>
//                         <TouchableOpacity onPress={() => setSettingsVisible(false)}>
//                             <Ionicons name="arrow-back" size={24} color={THEME.text} />
//                         </TouchableOpacity>
//                         <Text style={styles.settingsTitle}>Settings</Text>
//                         <View style={{ width: 24 }} />
//                     </View>
//                     <ScrollView style={{ flex: 1, padding: 20 }}>
//                         <TouchableOpacity style={styles.settingsProfileCard} onPress={() => { setSettingsVisible(false); setTimeout(() => setEditVisible(true), 300); }}>
//                             <Image source={{ uri: `${imageUrl}?v=${imageHash}` }} style={styles.miniAvatar} />
//                             <View>
//                                 <Text style={styles.settingsName}>{user.first_name} {user.last_name}</Text>
//                                 <Text style={styles.editLink}>Edit Profile</Text>
//                             </View>
//                             <Ionicons name="chevron-forward" size={20} color={THEME.sub} style={{ marginLeft: 'auto' }} />
//                         </TouchableOpacity>
//                         <Text style={styles.sectionHeader}>Analytics</Text>
//                         <MenuItem icon="bar-chart-outline" label="Creator stats" onPress={() => { }} />
//                         <Text style={styles.sectionHeader}>General</Text>
//                         <MenuItem icon="person-outline" label="Account" onPress={() => { }} />
//                         <MenuItem icon="color-palette-outline" label="Display" onPress={() => { }} />
//                         <MenuItem icon="notifications-outline" label="Notifications" onPress={() => { }} />
//                         <MenuItem icon="card-outline" label="Payments" onPress={() => { }} />
//                         <MenuItem icon="bookmark-outline" label="Saved Posts" onPress={() => { setSettingsVisible(false); setActiveTab('saved'); }} />
//                         <Text style={styles.sectionHeader}>Support</Text>
//                         <MenuItem icon="shield-checkmark-outline" label="Privacy & Safety" onPress={() => { }} />
//                         <MenuItem icon="chatbubble-outline" label="Feedback" onPress={() => { }} />
//                         <View style={{ marginTop: 30, marginBottom: 50 }}>
//                             <MenuItem icon="log-out-outline" label="Log Out" isDestructive onPress={logout} />
//                         </View>
//                     </ScrollView>
//                 </View>
//             </Modal>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: THEME.bg },
//     toastContainer: {
//         position: 'absolute', top: Platform.OS === 'android' ? 20 : 50, left: 20, right: 20,
//         backgroundColor: '#1C1C1E', borderRadius: 25, paddingVertical: 12, paddingHorizontal: 20,
//         flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 99999,
//         borderWidth: 1, borderColor: '#333'
//     },
//     toastText: { color: THEME.text, marginLeft: 10, fontWeight: '600', fontSize: 14 },
//     topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 10 },
//     iconButton: { padding: 8 },
//     headerContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, backgroundColor: THEME.bg },
//     profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
//     profileTextContainer: { flex: 1, paddingRight: 20 },
//     fullName: { color: THEME.text, fontSize: 24, fontWeight: '800', lineHeight: 30 },
//     username: { color: THEME.sub, fontSize: 16, marginTop: 2 },
//     followsYouBadge: { backgroundColor: '#202020', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 8 },
//     followsYouText: { color: THEME.sub, fontSize: 12, fontWeight: '500' },
//     avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: THEME.border },
//     sectionTitle: { color: THEME.text, fontSize: 15, fontWeight: '500', marginBottom: 12 },
//     actionButtons: { flexDirection: 'row', gap: 10, marginBottom: 20 },
//     primaryBtn: { flex: 1, backgroundColor: THEME.accent, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
//     primaryBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
//     secondaryBtn: { flex: 1, backgroundColor: THEME.buttonGrey, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
//     secondaryBtnText: { color: THEME.text, fontWeight: '600', fontSize: 16 },
//     subscriberBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: THEME.card, padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: THEME.border },
//     subBoxContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//     subBoxText: { color: THEME.text, fontSize: 16, fontWeight: '600' },
//     tabContainer: { flexDirection: 'row', marginTop: 5, borderBottomWidth: 1, borderBottomColor: THEME.border, backgroundColor: THEME.bg },
//     tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
//     activeTab: { borderBottomWidth: 2, borderBottomColor: THEME.accent },
//     tabText: { color: THEME.sub, fontSize: 15, fontWeight: '600' },
//     activeTabText: { color: THEME.text },
//     contentArea: { minHeight: 400, backgroundColor: THEME.bg },
//     feedContainer: { paddingBottom: 50 },
//     feedItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: THEME.border },
//     feedHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
//     feedAvatar: { width: 40, height: 40, borderRadius: 20, position: 'absolute', left: 16, top: 16 },
//     feedContent: { marginLeft: 52 },
//     feedName: { color: THEME.text, fontWeight: 'bold', fontSize: 15 },
//     feedTime: { color: THEME.sub, fontSize: 12 },
//     feedTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 4 },
//     feedText: { color: '#ccc', fontSize: 15, lineHeight: 22, marginBottom: 8 },
//     postImage: { width: '100%', height: 200, borderRadius: 8, marginTop: 8, backgroundColor: '#1a1a1a' },
//     feedFooter: { marginTop: 10 },
//     footerBtn: { alignSelf: 'flex-start', padding: 4 },
//     emptyState: { alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 50 },
//     emptyTitle: { color: THEME.text, fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
//     emptySub: { color: THEME.sub, fontSize: 14 },
//     optionsSheet: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#1C1C1E', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
//     optionsHandle: { width: 40, height: 4, backgroundColor: '#444', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
//     optionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, gap: 15 },
//     optionText: { color: '#FFF', fontSize: 16, fontWeight: '500' },
//     optionDivider: { height: 1, backgroundColor: '#333', marginVertical: 5 },
//     modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
//     modalTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
//     subscriberItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
//     subscriberAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 15 },
//     subscriberName: { color: '#FFF', fontSize: 16, fontWeight: '600' },
//     editScreenContainer: { flex: 1, backgroundColor: THEME.bg },
//     editHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: THEME.border },
//     editHeaderTitle: { color: THEME.text, fontSize: 18, fontWeight: 'bold' },
//     editImageSection: { alignItems: 'center', marginBottom: 30 },
//     imageWrapper: { position: 'relative', width: 100, height: 100, marginBottom: 15 },
//     editAvatar: { width: 100, height: 100, borderRadius: 50 },
//     uploadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
//     changePhotoText: { color: THEME.accent, fontSize: 16, fontWeight: '500' },
//     inputGroup: { marginBottom: 20 },
//     inputLabel: { color: THEME.sub, fontSize: 13, marginBottom: 8 },
//     inputField: { backgroundColor: THEME.card, color: THEME.text, fontSize: 16, borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, borderWidth: 1, borderColor: THEME.border },
//     settingsScreen: { flex: 1, backgroundColor: '#000' },
//     settingsHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: THEME.border },
//     settingsTitle: { color: THEME.text, fontSize: 20, fontWeight: 'bold', marginLeft: 20 },
//     settingsProfileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.card, padding: 15, borderRadius: 12, marginBottom: 25 },
//     miniAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
//     settingsName: { color: THEME.text, fontSize: 16, fontWeight: 'bold' },
//     editLink: { color: THEME.sub, fontSize: 13, marginTop: 2 },
//     sectionHeader: { color: THEME.sub, fontSize: 14, fontWeight: 'bold', marginTop: 15, marginBottom: 10, textTransform: 'uppercase' },
//     menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
//     menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
//     menuItemText: { color: THEME.text, fontSize: 16, fontWeight: '500' },
//     modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
//     customAlertBox: { width: '80%', backgroundColor: '#1C1C1E', borderRadius: 14, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
//     alertTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
//     alertMessage: { color: '#CCC', fontSize: 15, textAlign: 'center', marginBottom: 20 },
//     alertButtons: { flexDirection: 'row', gap: 15, width: '100%' },
//     alertBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
//     alertBtnCancel: { backgroundColor: '#2C2C2E' },
//     alertBtnDestructive: { backgroundColor: '#3a1212' },
//     alertBtnText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
// });


import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Device from "expo-device";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Easing,
    FlatList,
    Image,
    Modal,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

const { width } = Dimensions.get("window");

/* ================= API CONFIGURATION (UNCHANGED) ================= */
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
const API_ME = `${BASE_URL}/me`;
const API_PROFILE = `${BASE_URL}/profile`;
const API_PROFILE_IMAGE = `${BASE_URL}/profile-image`;
const API_MY_POSTS = `${BASE_URL}/my-posts`;
const API_MY_SUBSCRIBERS = `${BASE_URL}/my-subscriptions`;
const API_DELETE_POST = (id: string) => `${BASE_URL}/posts/${id}`;

/* ================= DARKER NAVY THEME ================= */
const THEME = {
    bg: "#020617",       // 🔥 Darkest Navy
    card: "#0f172a",     // Lighter Navy
    accent: "#38bdf8",   // Sky Blue Glow
    text: "#f1f5f9",     // Bright White
    sub: "#94a3b8",      // Muted Slate
    border: "#1e293b",   // Dark border
    danger: "#ef4444",
    success: "#10b981",
};

export default function ProfileScreen() {
    const router = useRouter();
    const { token, logout } = useAuth() as any;
    const cleanToken = token ? token.replace(/^"|"$/g, '') : null;

    const [user, setUser] = useState<any>(null);
    const [myPosts, setMyPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [imageHash, setImageHash] = useState(Date.now());

    // UI States
    const [editVisible, setEditVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<"activity" | "saved">("activity");
    const [confirmVisible, setConfirmVisible] = useState(false);

    // Subscribers State
    const [subscribersVisible, setSubscribersVisible] = useState(false);
    const [subscribersList, setSubscribersList] = useState<any[]>([]);
    const [loadingSubs, setLoadingSubs] = useState(false);

    // Post Options
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);

    const [editData, setEditData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
    });

    // Toast Notification
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "normal">("normal");
    const toastAnim = useRef(new Animated.Value(-100)).current;

    /* ================= HELPERS & LOGIC (UNCHANGED) ================= */
    const showToast = (message: string, type: "success" | "normal" = "normal") => {
        setToastMessage(message);
        setToastType(type);
        toastAnim.setValue(-100);
        Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true, easing: Easing.out(Easing.ease) }).start();
        setTimeout(() => {
            Animated.timing(toastAnim, { toValue: -100, duration: 300, useNativeDriver: true, easing: Easing.in(Easing.ease) }).start();
        }, 2500);
    };

    const fetchProfile = async (isRefresh = false) => {
        if (!cleanToken) { setLoading(false); return; }
        try {
            const res = await fetch(API_ME, { headers: { "Authorization": `Bearer ${cleanToken}` } });
            if (!res.ok) { if (res.status === 401) logout(); return; }
            const data = await res.json();
            setUser(data);
            setEditData({ first_name: data.first_name || "", last_name: data.last_name || "", phone: data.phone || "" });

            const postRes = await fetch(API_MY_POSTS, { headers: { "Authorization": `Bearer ${cleanToken}` } });
            if (postRes.ok) {
                const postsData = await postRes.json();
                setMyPosts(Array.isArray(postsData) ? postsData : postsData.posts || []);
            }
        } catch (e) { console.error(e); } finally { if (!isRefresh) setLoading(false); setRefreshing(false); }
    };

    const handleOpenSubscribers = async () => {
        setSubscribersVisible(true);
        setLoadingSubs(true);
        try {
            const res = await fetch(API_MY_SUBSCRIBERS, { headers: { "Authorization": `Bearer ${cleanToken}` } });
            if (res.ok) {
                const data = await res.json();
                setSubscribersList(Array.isArray(data) ? data : data.subscribers || []);
            }
        } catch (e) { showToast("Error loading subscribers"); } finally { setLoadingSubs(false); }
    };

    useFocusEffect(useCallback(() => { fetchProfile(); }, [cleanToken]));

    const handleCopyText = async () => {
        if (selectedPost?.content) { await Clipboard.setStringAsync(selectedPost.content); setOptionsVisible(false); showToast("Copied to clipboard"); }
    };

    const handleDeletePost = () => {
        Alert.alert("Delete Post", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive", onPress: async () => {
                    if (!selectedPost) return;
                    setOptionsVisible(false);
                    try {
                        const res = await fetch(API_DELETE_POST(selectedPost.id), { method: "DELETE", headers: { "Authorization": `Bearer ${cleanToken}` } });
                        if (!res.ok) throw new Error();
                        setMyPosts(prev => prev.filter(p => p.id !== selectedPost.id));
                        showToast("Post deleted", "success");
                    } catch (e) { Alert.alert("Error", "Could not delete."); }
                }
            }
        ]);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
        if (!result.canceled) uploadImage(result.assets[0]);
    };

    const uploadImage = async (img: any) => {
        if (!cleanToken) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", { uri: img.uri, name: "profile.jpg", type: "image/jpeg" } as any);
        try {
            const res = await fetch(API_PROFILE_IMAGE, { method: "POST", headers: { "Authorization": `Bearer ${cleanToken}`, "Content-Type": "multipart/form-data" }, body: formData });
            if (!res.ok) throw new Error();
            await fetchProfile(true); setImageHash(Date.now()); showToast("Photo updated");
        } catch (e) { Alert.alert("Error", "Upload failed"); } finally { setIsUploading(false); }
    };

    const confirmRemoveImage = async () => {
        setConfirmVisible(false); setIsUploading(true);
        try {
            const res = await fetch(API_PROFILE_IMAGE, { method: "DELETE", headers: { "Authorization": `Bearer ${cleanToken}` } });
            if (!res.ok) throw new Error();
            await fetchProfile(true); setImageHash(Date.now()); showToast("Photo removed");
        } catch (e) { Alert.alert("Error", "Remove failed"); } finally { setIsUploading(false); }
    };

    const saveProfile = async () => {
        try {
            const res = await fetch(API_PROFILE, { method: "PUT", headers: { "Authorization": `Bearer ${cleanToken}`, "Content-Type": "application/json" }, body: JSON.stringify(editData) });
            if (!res.ok) throw new Error();
            setEditVisible(false); fetchProfile(true); setTimeout(() => showToast("Profile updated"), 300);
        } catch (e) { Alert.alert("Error", "Update failed"); }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator color={THEME.accent} size="large" /></View>;
    if (!user) return null;

    const imageUrl = user?.profile_image ? `${BASE_URL}${user.profile_image}` : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";

    /* ================= COMPONENTS (TECH FONT APPLIED) ================= */
    const FeedItem = ({ item }: { item: any }) => {
        const date = new Date(item.created_at).toLocaleDateString();
        return (
            <View style={styles.feedCard}>
                <View style={styles.feedHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri: `${imageUrl}?v=${imageHash}` }} style={styles.feedAvatar} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.feedName}>{item.author_name || user.first_name}</Text>
                            <Text style={styles.feedTime}>{date}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => { setSelectedPost(item); setOptionsVisible(true); }}>
                        <Ionicons name="ellipsis-horizontal" size={20} color={THEME.sub} />
                    </TouchableOpacity>
                </View>

                {item.title && <Text style={styles.feedTitle}>{item.title}</Text>}
                <Text style={styles.feedText}>{item.content}</Text>

                {item.media_url && (
                    <Image source={{ uri: item.media_url }} style={styles.postImage} resizeMode="cover" />
                )}

                <View style={styles.feedFooter}>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="share-social-outline" size={18} color={THEME.sub} />
                        <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const ToastComponent = () => (
        <Animated.View style={[styles.toast, { transform: [{ translateY: toastAnim }] }, toastType === "success" && { borderColor: THEME.success }]}>
            <Ionicons name={toastType === "success" ? "checkmark-circle" : "alert-circle"} size={20} color={toastType === "success" ? THEME.success : THEME.accent} />
            <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: THEME.bg }}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />

            {!editVisible && <ToastComponent />}

            {/* TOP BAR */}
            <View style={styles.topNav}>
                <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
                    <Ionicons name="arrow-back" size={24} color={THEME.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSettingsVisible(true)} style={styles.navBtn}>
                    <Ionicons name="settings-outline" size={24} color={THEME.text} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProfile(true); }} tintColor={THEME.accent} />}
            >
                {/* PROFILE HEADER CARD */}
                <View style={styles.headerContainer}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: `${imageUrl}?v=${imageHash}` }} style={styles.avatar} />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.fullName}>{user.first_name} {user.last_name}</Text>
                            <Text style={styles.username}>@{user.email?.split('@')[0]}</Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>FOLLOWER</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.editProfileBtn} onPress={() => setEditVisible(true)}>
                        <Text style={styles.editProfileText}>Edit Profile</Text>
                    </TouchableOpacity>

                    {/* SUBSCRIBERS BUTTON */}
                    <TouchableOpacity style={styles.statCard} onPress={handleOpenSubscribers}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <View style={styles.statIconBox}>
                                <Ionicons name="people" size={20} color={THEME.accent} />
                            </View>
                            <Text style={styles.statText}>Subscribers</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={THEME.sub} />
                    </TouchableOpacity>
                </View>

                {/* TABS */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity style={[styles.tab, activeTab === "activity" && styles.activeTab]} onPress={() => setActiveTab("activity")}>
                        <Text style={[styles.tabText, activeTab === "activity" && styles.activeTabText]}>ACTIVITY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tab, activeTab === "saved" && styles.activeTab]} onPress={() => setActiveTab("saved")}>
                        <Text style={[styles.tabText, activeTab === "saved" && styles.activeTabText]}>SAVED</Text>
                    </TouchableOpacity>
                </View>

                {/* FEED CONTENT */}
                <View style={styles.contentArea}>
                    {activeTab === "activity" ? (
                        myPosts.length > 0 ? (
                            myPosts.map((post) => <FeedItem key={post.id} item={post} />)
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="code-slash" size={40} color={THEME.sub} style={{ opacity: 0.5 }} />
                                <Text style={styles.emptySub}>No activity yet.</Text>
                            </View>
                        )
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="bookmark" size={40} color={THEME.sub} style={{ opacity: 0.5 }} />
                            <Text style={styles.emptySub}>No saved posts.</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* SUBSCRIBERS MODAL */}
            <Modal visible={subscribersVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSubscribersVisible(false)}>
                <View style={styles.modalBg}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>SUBSCRIBERS</Text>
                        <TouchableOpacity onPress={() => setSubscribersVisible(false)}>
                            <Ionicons name="close" size={24} color={THEME.text} />
                        </TouchableOpacity>
                    </View>
                    {loadingSubs ? <ActivityIndicator size="large" color={THEME.accent} style={{ marginTop: 50 }} /> : (
                        <FlatList
                            data={subscribersList}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={{ padding: 20 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.subItem} onPress={() => { setSubscribersVisible(false); router.push({ pathname: "/UserProfile", params: { userId: item.id } }) }}>
                                    <Image source={{ uri: item.profile_image ? `${BASE_URL}${item.profile_image}` : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" }} style={styles.subAvatar} />
                                    <View>
                                        <Text style={styles.subName}>{item.name || "User"}</Text>
                                        <Text style={styles.subRole}>Developer</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={16} color={THEME.sub} style={{ marginLeft: 'auto' }} />
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={<Text style={{ color: THEME.sub, textAlign: 'center', marginTop: 20, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' }}>No subscribers yet.</Text>}
                        />
                    )}
                </View>
            </Modal>

            {/* EDIT MODAL */}
            <Modal visible={editVisible} animationType="slide">
                <SafeAreaView style={styles.modalBg}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setEditVisible(false)}><Text style={{ color: THEME.sub, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' }}>Cancel</Text></TouchableOpacity>
                        <Text style={styles.modalTitle}>EDIT PROFILE</Text>
                        <TouchableOpacity onPress={saveProfile}><Text style={{ color: THEME.accent, fontWeight: 'bold', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' }}>Save</Text></TouchableOpacity>
                    </View>
                    <ScrollView style={{ padding: 20 }}>
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                            <TouchableOpacity onPress={pickImage}>
                                <Image source={{ uri: `${imageUrl}?v=${imageHash}` }} style={styles.editBigAvatar} />
                                <View style={styles.editIconOverlay}><Ionicons name="camera" size={20} color="#fff" /></View>
                            </TouchableOpacity>
                            {isUploading && <ActivityIndicator color={THEME.accent} style={{ marginTop: 10 }} />}
                            <TouchableOpacity onPress={() => setConfirmVisible(true)}><Text style={{ color: THEME.danger, marginTop: 15, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' }}>Remove Photo</Text></TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>FIRST NAME</Text>
                            <TextInput style={styles.input} value={editData.first_name} onChangeText={(t) => setEditData({ ...editData, first_name: t })} placeholderTextColor={THEME.sub} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>LAST NAME</Text>
                            <TextInput style={styles.input} value={editData.last_name} onChangeText={(t) => setEditData({ ...editData, last_name: t })} placeholderTextColor={THEME.sub} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>PHONE</Text>
                            <TextInput style={styles.input} value={editData.phone} onChangeText={(t) => setEditData({ ...editData, phone: t })} keyboardType="phone-pad" placeholderTextColor={THEME.sub} />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            {/* SETTINGS MODAL */}
            <Modal visible={settingsVisible} animationType="slide" presentationStyle="formSheet">
                <View style={styles.modalBg}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>SETTINGS</Text>
                        <TouchableOpacity onPress={() => setSettingsVisible(false)}><Text style={{ color: THEME.accent, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' }}>Done</Text></TouchableOpacity>
                    </View>
                    <ScrollView style={{ padding: 20 }}>
                        <TouchableOpacity style={styles.settingItem} onPress={logout}>
                            <Ionicons name="log-out-outline" size={24} color={THEME.danger} />
                            <Text style={{ color: THEME.danger, fontSize: 16, marginLeft: 10, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' }}>Log Out</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>

            {/* POST OPTIONS MODAL */}
            <Modal visible={optionsVisible} transparent animationType="fade" onRequestClose={() => setOptionsVisible(false)}>
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOptionsVisible(false)}>
                    <View style={styles.optionsBox}>
                        <TouchableOpacity style={styles.optionRow} onPress={handleCopyText}>
                            <Ionicons name="copy-outline" size={22} color={THEME.text} />
                            <Text style={styles.optionText}>Copy Text</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.optionRow} onPress={handleDeletePost}>
                            <Ionicons name="trash-outline" size={22} color={THEME.danger} />
                            <Text style={[styles.optionText, { color: THEME.danger }]}>Delete Post</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* CONFIRM DELETE PHOTO */}
            <Modal transparent visible={confirmVisible} animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.alertBox}>
                        <Text style={styles.alertTitle}>Remove Photo?</Text>
                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                            <TouchableOpacity style={styles.alertBtn} onPress={() => setConfirmVisible(false)}><Text style={{ color: THEME.text, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' }}>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.alertBtn, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]} onPress={confirmRemoveImage}><Text style={{ color: THEME.danger, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' }}>Remove</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: THEME.bg },

    // 🔥 TOP NAV MOVED DOWN FOR NOTCH AREA
    topNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 10,
        // Increased padding top to avoid battery/notch
        paddingTop: Platform.OS === 'android' ? 50 : 20,
        alignItems: 'center'
    },
    navBtn: { padding: 8, backgroundColor: THEME.card, borderRadius: 20 },

    // Header
    headerContainer: { paddingHorizontal: 20, marginBottom: 20 },
    profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    avatarContainer: { marginRight: 20, borderWidth: 2, borderColor: THEME.accent, borderRadius: 50, padding: 3 },
    avatar: { width: 80, height: 80, borderRadius: 40 },
    profileInfo: { flex: 1 },

    // 🔥 Tech Fonts for Profile Info
    fullName: { color: THEME.text, fontSize: 22, fontWeight: '800', letterSpacing: 0.5, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    username: { color: THEME.sub, fontSize: 14, marginBottom: 8, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    badge: { backgroundColor: 'rgba(56, 189, 248, 0.1)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.2)' },
    badgeText: { color: THEME.accent, fontSize: 10, fontWeight: 'bold', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

    editProfileBtn: { backgroundColor: THEME.card, paddingVertical: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: THEME.border, marginBottom: 15 },
    editProfileText: { color: THEME.text, fontWeight: '600', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

    statCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: THEME.card, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: THEME.border },
    statIconBox: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(56, 189, 248, 0.1)', alignItems: 'center', justifyContent: 'center' },
    statText: { color: THEME.text, fontSize: 16, fontWeight: '600', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

    // Tabs
    tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: THEME.border },
    tab: { flex: 1, alignItems: 'center', paddingVertical: 14 },
    activeTab: { borderBottomWidth: 2, borderBottomColor: THEME.accent },
    tabText: { color: THEME.sub, fontSize: 13, fontWeight: 'bold', letterSpacing: 1, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    activeTabText: { color: THEME.accent },

    // Feed
    contentArea: { padding: 16 },
    feedCard: { backgroundColor: THEME.card, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: THEME.border },
    feedHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    feedAvatar: { width: 36, height: 36, borderRadius: 18 },
    feedName: { color: THEME.text, fontWeight: '700', fontSize: 14, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    feedTime: { color: THEME.sub, fontSize: 11, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    feedTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 4, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    feedText: { color: '#cbd5e1', fontSize: 14, lineHeight: 22, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    postImage: { width: '100%', height: 180, borderRadius: 8, marginTop: 10 },
    feedFooter: { flexDirection: 'row', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    actionText: { color: THEME.sub, fontSize: 12, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

    emptyState: { alignItems: 'center', marginTop: 50, opacity: 0.7 },
    emptySub: { color: THEME.sub, marginTop: 10, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

    // Modals
    modalBg: { flex: 1, backgroundColor: THEME.bg },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: THEME.border },
    modalTitle: { color: THEME.text, fontSize: 16, fontWeight: '900', letterSpacing: 1, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

    subItem: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: THEME.card, marginBottom: 10, borderRadius: 10 },
    subAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 15 },
    subName: { color: THEME.text, fontSize: 16, fontWeight: '600', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    subRole: { color: THEME.accent, fontSize: 12, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

    // Edit
    editBigAvatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: THEME.border },
    editIconOverlay: { position: 'absolute', bottom: 0, right: 0, backgroundColor: THEME.accent, padding: 8, borderRadius: 20 },
    inputContainer: { marginBottom: 20 },
    label: { color: THEME.sub, fontSize: 11, marginBottom: 8, fontWeight: 'bold', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    input: { backgroundColor: THEME.card, color: '#fff', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: THEME.border, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

    // Settings
    settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: THEME.card, borderRadius: 10 },

    // Options / Alerts
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
    optionsBox: { width: '80%', backgroundColor: THEME.card, borderRadius: 12, padding: 5, borderWidth: 1, borderColor: THEME.border },
    optionRow: { flexDirection: 'row', alignItems: 'center', padding: 15, gap: 12 },
    optionText: { color: THEME.text, fontSize: 16, fontWeight: '500', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    divider: { height: 1, backgroundColor: THEME.border },
    alertBox: { width: '80%', backgroundColor: THEME.card, padding: 20, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: THEME.border },
    alertTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
    alertBtn: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 8, backgroundColor: THEME.border },

    toast: { position: 'absolute', top: 50, alignSelf: 'center', backgroundColor: THEME.card, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: THEME.accent, zIndex: 100 },
    toastText: { color: '#fff', fontWeight: '600', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' }
});