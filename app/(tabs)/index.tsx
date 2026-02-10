









import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../../context/AuthContext";

/* ================= TYPES ================= */
type Author = {
  id: number;
  name: string;
  profile_image: string | null;
  is_subscribed?: boolean;
};

type FeedPost = {
  id: string;
  title: string;
  content: string;
  media_url: string | null;
  created_at: string;
  category: string | null;
  author: Author | null;
  is_subscribed?: boolean;
};

type CategoryFeedState = {
  posts: FeedPost[];
  cursor: string | null;
  loaded: boolean;
};

/* ================= CONSTANTS ================= */
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80";
const { width, height } = Dimensions.get("window");

// 🔥 HEADER & ITEM CONFIG
const HEADER_HEIGHT = Platform.OS === 'android' ? 90 : 100;

// 🔥 FULL SCREEN ITEM (InShorts/Reels Style)
const ITEM_HEIGHT = height;
const IMAGE_HEIGHT = height * 0.35; // 40% Image, 60% Content

const URL_PHONE = process.env.EXPO_PUBLIC_API_URL_PHONE;
const URL_ANDROID = process.env.EXPO_PUBLIC_API_URL_ANDROID;
const URL_PROD = process.env.EXPO_PUBLIC_API_URL_PROD;
const ENV_MODE = process.env.EXPO_PUBLIC_ENV;

const getBaseUrl = () => {
  if (ENV_MODE === 'production' && URL_PROD) return URL_PROD;
  if (Device.isDevice) return URL_PHONE;
  return URL_ANDROID;
};

const BASE_URL = getBaseUrl();
const API_HOME = `${BASE_URL}/feed/home`;
const API_CATEGORY = (id: number) => `${BASE_URL}/feed/category/${id}`;

// 🔥 THEME - DARKER & SOFTER (Eye Friendly Tech)
const THEME = {
  // Pure Black top to Deep Matte Navy bottom (Less harsh blue)
  bgGradientTop: "#000000",
  bgGradientBottom: "#0b1021",
  accent: "#64ffda",          // Cyan / Electric Green (Tech Glow)
  textMain: "#e6f1ff",        // Soft White
  textSec: "#8892b0",         // Muted Slate
};

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<FeedPost>);

const CATEGORY_LIST = [
  { id: 1, name: "For You" },
  { id: 2, name: "AI & ML" },
  { id: 3, name: "Startups" },
  { id: 4, name: "Data Science" },
  { id: 5, name: "Web Dev" },
  { id: 6, name: "Mobile" },
  { id: 7, name: "Gadgets" },
  { id: 8, name: "Cyber Security" },
  { id: 9, name: "Blockchain" },
];

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const hrs = Math.floor(diff / (1000 * 60 * 60));
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

/* ================= SCREEN ================= */
export default function Index() {
  const { token, user } = useAuth() as any;
  const navigation = useNavigation<any>();
  const flatListRef = useRef<FlatList>(null);

  // Main State
  const [feeds, setFeeds] = useState<Record<number, CategoryFeedState>>({});
  const [activeCategoryId, setActiveCategoryId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [following, setFollowing] = useState<Record<number, boolean>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const scrollOffsets = useRef<Record<number, number>>({});
  const currentFeed = feeds[activeCategoryId] || { posts: [], cursor: null, loaded: false };
  const posts = currentFeed.posts;

  // Load Saved Following
  useEffect(() => {
    const loadSaved = async () => {
      const saved = await AsyncStorage.getItem(`following_${user?.id}`);
      if (saved) setFollowing(JSON.parse(saved));
    };
    if (user?.id) loadSaved();
  }, [user?.id]);

  // Fetch Logic (UNCHANGED)
  const fetchPosts = async (reset = false, categoryId = activeCategoryId) => {
    if (!token) return;

    const feedState = feeds[categoryId] || { posts: [], cursor: null, loaded: false };
    const cursor = reset ? null : feedState.cursor;

    if (reset) setLoading(true);

    const baseUrl = categoryId === 1 ? API_HOME : API_CATEGORY(categoryId);
    const url = cursor ? `${baseUrl}?cursor=${cursor}` : baseUrl;

    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();

      if (Array.isArray(data.posts)) {
        setFeeds(prev => {
          const prevFeed = prev[categoryId] || { posts: [], cursor: null, loaded: false };
          const newPosts = reset ? data.posts : [...prevFeed.posts, ...data.posts];

          return {
            ...prev,
            [categoryId]: {
              ...prevFeed,
              posts: newPosts,
              cursor: data.next_cursor || null,
              loaded: true,
            }
          };
        });

        setFollowing(prev => {
          const updated = { ...prev };
          data.posts.forEach((p: FeedPost) => {
            if (p.author?.id && (p.is_subscribed || p.author.is_subscribed)) {
              updated[p.author.id] = true;
            }
          });
          return updated;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!feeds[1]?.loaded) {
      fetchPosts(true, 1);
    }
  }, [token]);

  const handleCategoryPress = (newId: number) => {
    if (activeCategoryId === newId) return;
    setActiveCategoryId(newId);
    if (!feeds[newId]?.loaded) {
      fetchPosts(true, newId);
    }
  };

  const onScroll = (e: any) => {
    scrollOffsets.current[activeCategoryId] = e.nativeEvent.contentOffset.y;
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts(true);
  };

  const onShare = async (post: FeedPost) => {
    await Share.share({ title: post.title, message: `${post.title}\n\n${post.content}` });
  };

  const showCustomToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const toggleSubscribe = async (authorId: number, authorName: string) => {
    if (!token) return;
    const isSub = !!following[authorId];
    setFollowing(prev => ({ ...prev, [authorId]: !isSub }));
    AsyncStorage.setItem(`following_${user?.id}`, JSON.stringify({ ...following, [authorId]: !isSub }));

    const endpoint = isSub ? `/unsubscribe/${authorId}` : `/subscribe/${authorId}`;
    try {
      await fetch(`${BASE_URL}${endpoint}`, { method: isSub ? "DELETE" : "POST", headers: { Authorization: `Bearer ${token}` } });
      const msg = !isSub ? `Following ${authorName}` : `Unfollowed`;
      showCustomToast(msg);
    } catch (e) {
      setFollowing(prev => ({ ...prev, [authorId]: isSub }));
    }
  };

  const goToProfile = (userId: number) => navigation.navigate("UserProfile", { userId });

  /* ================= RENDER ITEM ================= */
  const renderItem = ({ item }: { item: FeedPost }) => {
    const isMyPost = user?.id === item.author?.id;
    const avatarUrl = isMyPost && user?.profile_image ? `${BASE_URL}${user.profile_image}` : (item.author?.profile_image ? `${BASE_URL}${item.author.profile_image}` : DEFAULT_AVATAR);
    const isSubscribed = !!following[item.author?.id || 0];

    return (
      <View style={styles.postContainer}>

        {/* 1. IMAGE AREA - Rounded & Floating */}
        <View style={styles.imageWrapper}>
          <View style={styles.imageInner}>
            {item.media_url ? (
              <Image source={{ uri: item.media_url }} style={styles.postImage} resizeMode="cover" />
            ) : (
              <View style={[styles.postImage, { backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="code-slash-outline" size={50} color={THEME.textSec} />
              </View>
            )}

            {/* Tech Overlay */}
            <LinearGradient colors={['transparent', 'rgba(11, 16, 33, 0.8)']} style={styles.imgOverlay} />

            {/* Tag on Image */}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category || "TECH"}</Text>
            </View>
          </View>
        </View>

        {/* 2. CONTENT AREA */}
        <View style={styles.contentContainer}>

          {/* Main Text Area */}
          <View style={styles.textArea}>
            <View style={styles.metaRowTop}>
              <Text style={styles.metaAuthor}>{item.author?.name || "DevBytes"}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaTime}>{timeAgo(item.created_at)}</Text>
            </View>

            <Text style={styles.title}>{item.title}</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
              <Text style={styles.body}>{item.content}</Text>
              {/* Spacing for bottom scrolling */}
              <View style={{ height: 100 }} />
            </ScrollView>
          </View>

          {/* SIDEBAR (Kept exactly as requested) */}
          <View style={styles.rightSidebar}>
            <View style={styles.sidebarItem}>
              <TouchableOpacity onPress={() => goToProfile(item.author?.id || 0)}>
                <Image source={{ uri: avatarUrl }} style={styles.sidebarAvatar} />
              </TouchableOpacity>

              {!isSubscribed && (
                <TouchableOpacity style={styles.plusBadge} onPress={() => toggleSubscribe(item.author?.id || 0, item.author?.name || "User")}>
                  <Ionicons name="add" size={14} color="#000" />
                </TouchableOpacity>
              )}
              {isSubscribed && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={10} color="#000" />
                </View>
              )}
            </View>

            <TouchableOpacity onPress={() => onShare(item)} style={styles.sidebarBtn}>
              <Ionicons name="share-social-outline" size={28} color={THEME.textMain} />
              <Text style={styles.sidebarLabel}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarBtn}>
              <Ionicons name="bookmark-outline" size={28} color={THEME.textMain} />
              <Text style={styles.sidebarLabel}>Save</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  };

  return (
    // 🔥 Background Gradient - Soft Dark Tech
    <LinearGradient
      colors={[THEME.bgGradientTop, THEME.bgGradientBottom]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* HEADER - CLEAN (Categories Only) */}
      <View style={styles.categoryHeader}>
        <LinearGradient
          colors={['rgba(0,0,0, 0.9)', 'rgba(0,0,0, 0.0)']}
          style={StyleSheet.absoluteFillObject}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScrollContent}>
          {CATEGORY_LIST.map((c) => {
            const isActive = activeCategoryId === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => handleCategoryPress(c.id)}
                style={styles.catItemContainer}
              >
                <Text style={[styles.catText, isActive && styles.catTextActive]}>{c.name}</Text>
                {isActive && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {toastMsg && (
        <View style={styles.customToast}>
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      )}











      {/* MAIN FEED - SNAP CARD BY CARD */}
      <AnimatedFlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={following}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.accent} />}

        // 🔥 STRICT SNAP PROPERTIES
        pagingEnabled={true}
        decelerationRate="fast"
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        disableIntervalMomentum={true} // Forces stop on next card

        onScroll={onScroll}
        scrollEventThrottle={16}

        // No padding here, we handle spacing inside item
        contentContainerStyle={{ paddingBottom: 0 }}

        ListEmptyComponent={!loading ? (
          <View style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: THEME.textSec }}>No posts yet.</Text>
          </View>
        ) : null}
      />

      {loading && posts.length === 0 && (
        <View style={styles.centerLoader}><ActivityIndicator color={THEME.accent} size="large" /></View>
      )}
    </LinearGradient>
  );
}













const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bgGradientTop },
  centerLoader: { position: 'absolute', top: '50%', left: 0, right: 0, alignItems: 'center' },

  /* Header */
  categoryHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 15 : 55,
    paddingBottom: 15,
  },
  catScrollContent: { paddingHorizontal: 20 },
  catItemContainer: {
    marginRight: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  // 🔥 FONT: Monospace for Header
  catText: { color: THEME.textSec, fontWeight: '600', fontSize: 15, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
  catTextActive: { color: THEME.accent, fontWeight: 'bold' },
  activeIndicator: {
    position: 'absolute', bottom: -6, width: 20, height: 3,
    backgroundColor: THEME.accent, borderRadius: 2,
    shadowColor: THEME.accent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 4, elevation: 5
  },

  /* Post Card (Full Screen) */
  postContainer: {
    width: width,
    height: ITEM_HEIGHT,
    paddingTop: HEADER_HEIGHT, // Space for header
  },

  // 1. Image Area
  imageWrapper: {
    width: width,
    height: IMAGE_HEIGHT,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  imageInner: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.15)'
  },
  postImage: { width: '100%', height: '100%' },
  imgOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%' },

  // Tag on Image
  categoryBadge: {
    position: 'absolute', bottom: 12, left: 16,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
    borderWidth: 1, borderColor: THEME.accent
  },
  // 🔥 FONT: Monospace for Category Badge
  categoryText: { color: THEME.accent, fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

  // 2. Content Area
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
  },

  textArea: { flex: 1, paddingLeft: 20, paddingRight: 5 },
  scrollBody: { flex: 1 },

  metaRowTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  // 🔥 FONT: Monospace for Author
  metaAuthor: { color: THEME.accent, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
  metaDot: { color: THEME.textSec, marginHorizontal: 6 },
  // 🔥 FONT: Monospace for Time
  metaTime: { color: THEME.textSec, fontSize: 12, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

  // 🔥 FONT: Monospace for Title
  title: { color: THEME.textMain, fontSize: 24, fontWeight: '700', lineHeight: 30, marginBottom: 10, letterSpacing: -0.5, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

  // 🔥 FONT: Monospace for Body (Tech Editor Feel)
  body: { color: '#ccd6f6', fontSize: 16, lineHeight: 26, fontWeight: '400', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

  // Sidebar (Right)
  rightSidebar: { width: 70, alignItems: 'center', paddingTop: 0, paddingRight: 5 },
  sidebarItem: { alignItems: 'center', marginBottom: 25, position: 'relative' },
  sidebarBtn: { alignItems: 'center', marginBottom: 25 },

  sidebarAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: THEME.accent },
  plusBadge: {
    position: 'absolute', bottom: -6, width: 18, height: 18, borderRadius: 9,
    backgroundColor: THEME.accent, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#000'
  },
  checkBadge: {
    position: 'absolute', bottom: -6, width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#64ffda', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#000'
  },
  // 🔥 FONT: Monospace for Sidebar Text
  sidebarLabel: { color: THEME.textSec, fontSize: 10, fontWeight: '500', marginTop: 4, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },

  customToast: {
    position: 'absolute', top: '50%', alignSelf: 'center',
    backgroundColor: THEME.accent, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, zIndex: 999
  },
  toastText: { color: '#000', fontWeight: 'bold', fontSize: 15, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' }
});


