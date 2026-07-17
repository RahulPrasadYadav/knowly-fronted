// import AsyncStorage from '@react-native-async-storage/async-storage';
// import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// // ✅ Type Define kiya taaki TypeScript gussa na ho
// type AuthContextType = {
//     user: any; // 'any' rakha hai taaki koi bhi user data save ho sake
//     loading: boolean;
//     login: (userData: any) => void;
//     logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// // ✅ Custom Hook
// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };

// // ✅ Provider Component
// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//     const [user, setUser] = useState<any>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         checkLogin();
//     }, []);

//     // 🔹 Check Login Status
//     const checkLogin = async () => {
//         try {
//             const userData = await AsyncStorage.getItem('user');
//             if (userData) {
//                 setUser(JSON.parse(userData));
//             }
//         } catch (e) {
//             console.error("Login check failed", e);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // 🔹 Login Function
//     const login = async (userData: any) => {
//         setLoading(true);
//         await AsyncStorage.setItem('user', JSON.stringify(userData));
//         setUser(userData);
//         setLoading(false);
//     };

//     // 🔹 Logout Function
//     const logout = async () => {
//         setLoading(true);
//         await AsyncStorage.removeItem('user');
//         setUser(null);
//         setLoading(false);
//     };

//     return (
//         <AuthContext.Provider value={{ user, loading, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };





import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type AuthContextType = {
    user: any;
    token: string | null;
    loading: boolean;
    login: (user: any, token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        restoreSession();
    }, []);

    const restoreSession = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");
            const storedToken = await AsyncStorage.getItem("token");

            if (storedUser && storedToken) {
                try {
                    setUser(JSON.parse(storedUser));
                    setToken(storedToken);
                } catch {
                    // A previous app version may have stored a token or plain
                    // text in the `user` key. Clear that invalid session so it
                    // cannot crash the app during startup.
                    console.warn("Invalid saved session removed from storage.");
                    await AsyncStorage.multiRemove(["user", "token"]);
                    setUser(null);
                    setToken(null);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    // 🔐 LOGIN
    const login = async (userData: any, jwtToken: string) => {
        setLoading(true);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        await AsyncStorage.setItem("token", jwtToken);

        setUser(userData);
        setToken(jwtToken);
        setLoading(false);
    };

    // 🚪 LOGOUT
    const logout = async () => {
        setLoading(true);
        await AsyncStorage.multiRemove(["user", "token"]);

        setUser(null);
        setToken(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
