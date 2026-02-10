





import { LogBox } from 'react-native';

// Ignore warnings
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import 'react-native-reanimated';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";

import { AuthProvider, useAuth } from '../context/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

const MyBlackTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    card: '#000000',
    text: '#ffffff',
  },
};

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  useEffect(() => {
    const setBackground = async () => {
      await SystemUI.setBackgroundColorAsync("black");
    };
    setBackground();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      // @ts-ignore
      if (Text.defaultProps == null) Text.defaultProps = {};
      // @ts-ignore
      Text.defaultProps.style = { fontFamily: 'Inter-Regular', ...Text.defaultProps.style };
      // @ts-ignore
      if (TextInput.defaultProps == null) TextInput.defaultProps = {};
      // @ts-ignore
      TextInput.defaultProps.style = { fontFamily: 'Inter-Regular', ...TextInput.defaultProps.style };
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] && (segments[0] as string) === '(auth)';
    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  if (loading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#00e096" />
      </View>
    );
  }

  return (
    <ThemeProvider value={MyBlackTheme}>
      <Stack
        screenOptions={{
          headerShown: false,

          // 🔥 MAGIC SETTINGS FOR INSTAGRAM/X LIKE FEEL 🔥
          animation: 'slide_from_right', // Page right se aayega
          presentation: 'card',          // Card wala feel dega
          gestureEnabled: true,          // Swipe back enable karega
          gestureDirection: 'horizontal',// Side swipe enable karega
          animationDuration: 200,        // Thoda tez (snappy) feel ke liye (Optional)

          contentStyle: { backgroundColor: '#000000' },
        }}
      >

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />

        {/* UserProfile Screen */}
        <Stack.Screen
          name="UserProfile"
          options={{
            headerShown: false,
            // Is page ke liye bhi swipe enable rahega
            gestureEnabled: true,
          }}
        />

        {/* PostDetails Screen */}
        <Stack.Screen
          name="PostDetails"
          options={{
            headerShown: false,
            // Post detail se back aane par smooth slide hoga
            gestureEnabled: true,
          }}
        />

      </Stack>
      <StatusBar style="light" backgroundColor="#000000" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}