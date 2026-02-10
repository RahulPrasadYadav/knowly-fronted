import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// 🔥 THEME: Deep Dark Navy Tech
const THEME = {
  bg: "#020617",       // Darkest Navy
  card: "#0f172a",     // Lighter Navy
  accent: "#38bdf8",   // Sky Blue Glow
  text: "#f1f5f9",     // Bright White
  sub: "#94a3b8",      // Slate Gray
  border: "#1e293b",   // Dark Border
  success: "#10b981",  // Green for 'Online'
};

// 🔥 MOCK DATA: Tech Communities
const CLUBS_DATA = [
  {
    id: "1",
    name: "AI_WIZARDS",
    topic: "Artificial Intelligence",
    members: "12.5k",
    online: "1.2k",
    desc: "Discussing LLMs, Neural Networks, and the future of AGI.",
    icon: "hardware-chip-outline",
    color: "#8b5cf6", // Violet
  },
  {
    id: "2",
    name: "FIN_TECH_HUB",
    topic: "Finance & Crypto",
    members: "8.4k",
    online: "840",
    desc: "Market analysis, Web3 protocols, and algorithmic trading.",
    icon: "stats-chart-outline",
    color: "#10b981", // Green
  },
  {
    id: "3",
    name: "REACT_NATIVE_DEV",
    topic: "Mobile Development",
    members: "24k",
    online: "3.5k",
    desc: "Building cross-platform apps. Expo, Reanimated, and more.",
    icon: "code-slash-outline",
    color: "#38bdf8", // Blue
  },
  {
    id: "4",
    name: "CYBER_SEC_ELITE",
    topic: "Cyber Security",
    members: "5.1k",
    online: "300",
    desc: "Pen-testing, Zero-day exploits, and network defense.",
    icon: "shield-checkmark-outline",
    color: "#f43f5e", // Red
  },
  {
    id: "5",
    name: "STARTUP_GRIND",
    topic: "Entrepreneurship",
    members: "18k",
    online: "2.1k",
    desc: "Pitch decks, VC funding, and scaling strategies.",
    icon: "rocket-outline",
    color: "#f59e0b", // Amber
  },
];

export default function ClubsScreen() {
  const [search, setSearch] = useState("");

  const renderClubItem = ({ item }: { item: any }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.cardContainer}>
      <LinearGradient
        colors={[THEME.card, "#0b1121"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* HEADER ROW */}
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { borderColor: item.color, backgroundColor: `${item.color}15` }]}>
            <Ionicons name={item.icon} size={24} color={item.color} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.clubName}>{item.name}</Text>
            <Text style={styles.clubTopic}>// {item.topic}</Text>
          </View>
          <View style={styles.badge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>{item.online} ON</Text>
          </View>
        </View>

        {/* DESCRIPTION */}
        <Text style={styles.description}>{item.desc}</Text>

        {/* FOOTER ROW */}
        <View style={styles.footer}>
          <View style={styles.statBox}>
            <Ionicons name="people-outline" size={14} color={THEME.sub} />
            <Text style={styles.statText}>{item.members} MEMBERS</Text>
          </View>

          <TouchableOpacity style={styles.joinBtn}>
            <Text style={styles.joinText}>[ ENTER_CHAT ]</Text>
            <Ionicons name="arrow-forward" size={14} color={THEME.bg} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>COMMUNITY_NODES</Text>
        <TouchableOpacity style={styles.createBtn}>
          <Ionicons name="add" size={20} color={THEME.bg} />
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR (Terminal Style) */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchPrompt}>&gt;</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="SEARCH_CLUBS..."
          placeholderTextColor={THEME.sub}
          value={search}
          onChangeText={setSearch}
        />
        <Ionicons name="search" size={18} color={THEME.sub} />
      </View>

      {/* LIST */}
      <FlatList
        data={CLUBS_DATA}
        renderItem={renderClubItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.sectionLabel}>// ACTIVE_CHANNELS</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  headerTitle: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
    letterSpacing: 1,
  },
  createBtn: {
    backgroundColor: THEME.accent,
    width: 32,
    height: 32,
    borderRadius: 4, // Tech square look
    alignItems: "center",
    justifyContent: "center",
  },

  /* Search */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.card,
    margin: 16,
    paddingHorizontal: 12,
    height: 46,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  searchPrompt: {
    color: THEME.accent,
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
  },
  searchInput: {
    flex: 1,
    color: THEME.text,
    fontSize: 14,
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
  },

  /* Section Label */
  sectionLabel: {
    color: THEME.sub,
    fontSize: 12,
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
    marginBottom: 12,
    marginTop: 4,
  },

  /* Card */
  cardContainer: {
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.border,
    overflow: "hidden",
  },
  card: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  clubName: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
    letterSpacing: 0.5,
  },
  clubTopic: {
    color: THEME.sub,
    fontSize: 11,
    marginTop: 2,
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.success,
    marginRight: 6,
  },
  onlineText: {
    color: THEME.success,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
  },

  description: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
    marginBottom: 16,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingTop: 12,
  },
  statBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    color: THEME.sub,
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
  },
  joinBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    gap: 6,
  },
  joinText: {
    color: THEME.bg,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
  },
});