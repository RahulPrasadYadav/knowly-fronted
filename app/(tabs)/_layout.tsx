



// import { Feather } from "@expo/vector-icons";
// import { Tabs } from "expo-router";
// import React from "react";
// import { DeviceEventEmitter, Platform, View } from "react-native"; // 🔥 DeviceEventEmitter Import kiya

// import { HapticTab } from "@/components/haptic-tab";
// import { useColorScheme } from "@/hooks/use-color-scheme";

// // ================= THEME (UPDATED TO PURPLE) =================
// const THEME = {
//   background: "#000000",  // Pitch Black
//   accent: "#7F5AF0",      // Startup Purple
//   inactive: "#666666",    // Darker Gray
//   border: "#1F1F1F",      // Subtle Border
// };

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarButton: HapticTab,

//         tabBarActiveTintColor: THEME.accent,
//         tabBarInactiveTintColor: THEME.inactive,

//         // ================= TAB BAR STYLE =================
//         tabBarStyle: {
//           backgroundColor: THEME.background,
//           borderTopColor: THEME.border,
//           borderTopWidth: 0.5,
//           elevation: 0,

//           // 🔥 HEIGHT FIX
//           height: Platform.select({
//             ios: 90,
//             android: 70,
//           }),

//           paddingTop: 10,

//           // 🔥 GESTURE BAR FIX
//           paddingBottom: Platform.select({
//             ios: 30,
//             android: 12,
//           }),
//         },

//         tabBarLabelStyle: {
//           fontSize: 10,
//           fontWeight: "600",
//           marginTop: 4,
//         },
//       }}
//     >
//       {/* ================= HOME (WITH SCROLL LOGIC) ================= */}
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Home",
//           tabBarIcon: ({ color }) => (
//             <Feather size={24} name="home" color={color} />
//           ),
//         }}
//         // 🔥 LOGIC: Detect Tap on Home Tab for Refresh/Scroll Top
//         listeners={({ navigation }) => ({
//           tabPress: (e) => {
//             if (navigation.isFocused()) {
//               e.preventDefault(); // Default action roko
//               DeviceEventEmitter.emit('scrollToTopHome'); // Event fire karo
//             }
//           },
//         })}
//       />

//       {/* ================= CATEGORIES ================= */}
//       <Tabs.Screen
//         name="categories"
//         options={{
//           title: "Categories",
//           tabBarIcon: ({ color }) => (
//             <Feather size={24} name="grid" color={color} />
//           ),
//         }}
//       />

//       {/* ================= POST (CENTER FLOATING PURPLE) ================= */}
//       <Tabs.Screen
//         name="post"
//         options={{
//           title: "Post",
//           tabBarLabel: () => null,
//           tabBarIcon: () => (
//             <View
//               style={{
//                 alignItems: "center",
//                 justifyContent: "center",
//                 backgroundColor: THEME.accent, // Purple Button

//                 width: 50,
//                 height: 50,
//                 borderRadius: 25,

//                 // 🔥 FLOAT UP
//                 marginBottom: Platform.select({
//                   ios: 26,
//                   android: 18,
//                 }),

//                 // Glow Effect
//                 shadowColor: THEME.accent,
//                 shadowOffset: { width: 0, height: 4 },
//                 shadowOpacity: 0.5,
//                 shadowRadius: 8,
//                 elevation: 6,
//               }}
//             >
//               <Feather size={28} name="plus" color="#FFF" />
//             </View>
//           ),
//         }}
//       />

//       {/* ================= EXPLORE ================= */}
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: "Explore",
//           tabBarIcon: ({ color }) => (
//             <Feather size={24} name="search" color={color} />
//           ),
//         }}
//       />

//       {/* ================= PROFILE ================= */}
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: "Profile",
//           tabBarIcon: ({ color }) => (
//             <Feather size={24} name="user" color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }





import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { DeviceEventEmitter, Platform, StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";

// ================= THEME (Deep Navy Tech) =================
const THEME = {
  background: "#020617",  // Deepest Navy (Matches other screens)
  accent: "#38bdf8",      // Sky Blue
  inactive: "#64748b",    // Muted Slate
  border: "#1e293b",      // Dark Border
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,

        tabBarActiveTintColor: THEME.accent,
        tabBarInactiveTintColor: THEME.inactive,

        // ================= TAB BAR STYLE =================
        tabBarStyle: {
          backgroundColor: THEME.background,
          borderTopColor: THEME.border,
          borderTopWidth: 1,
          elevation: 0, 

          // 🔥 HEIGHT ADJUSTMENT
          height: Platform.select({
            ios: 88,
            android: 65,
          }),

          paddingTop: 8,
          paddingBottom: Platform.select({
            ios: 28,
            android: 8,
          }),
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
          fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier', // 🔥 Tech Font
        },
      }}
    >
      {/* ================= 1. HOME ================= */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather size={22} name="home" color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              e.preventDefault();
              DeviceEventEmitter.emit('scrollToTopHome');
            }
          },
        })}
      />

      {/* ================= 2. CLUBS (Renamed from Search/Explore) ================= */}
      <Tabs.Screen
        name="explore" // Using 'explore.tsx' file logic
        options={{
          title: "Clubs", // 🔥 Renamed to Clubs
          tabBarIcon: ({ color }) => (
            <Feather size={22} name="users" color={color} /> // 🔥 Changed Icon to Users
          ),
        }}
      />

      {/* ================= 3. POST (CENTER FLOATING) ================= */}
      <Tabs.Screen
        name="post"
        options={{
          title: "Post",
          tabBarLabel: () => null, 
          tabBarIcon: () => (
            <View style={styles.floatingButton}>
              <Feather size={28} name="plus" color="#020617" />
            </View>
          ),
        }}
      />

      {/* ================= 4. PROFILE ================= */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Feather size={22} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  floatingButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME.accent, 

    width: 48,  
    height: 48,
    borderRadius: 24,

    // 🔥 FLOAT LOGIC
    marginBottom: Platform.select({
      ios: 30,    
      android: 20, 
    }),

    // Soft Glow
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
});
