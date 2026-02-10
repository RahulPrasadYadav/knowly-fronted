// @/constants/Config.ts
import { Platform } from 'react-native';

// 1. .env se value uthao
const ENV_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// 2. Logic to handle Android Emulator
const getBaseUrl = () => {
    if (__DEV__) {
        // Agar Android hai aur localhost detected hai, to 10.0.2.2 karo
        if (Platform.OS === 'android' && (ENV_URL.includes('127.0.0.1') || ENV_URL.includes('localhost'))) {
            return ENV_URL.replace('127.0.0.1', '10.0.2.2').replace('localhost', '10.0.2.2');
        }
    }
    // Production ya iOS ke liye .env wala URL hi rahega
    return ENV_URL;
};

export const API_BASE_URL = getBaseUrl();