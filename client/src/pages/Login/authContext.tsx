import { createContext, useState, ReactNode, useEffect, useCallback } from "react";

interface AuthContextType {
    token: string | null;
    login: (token: string, refreshToken?: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    refreshAuthToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Secure token storage utilities
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const TOKEN_EXPIRY_KEY = "token_expiry";

// Simple XOR encryption for additional security layer (not production-grade, but better than plain text)
const encryptToken = (token: string): string => {
    const key = "SDC_SECURE_KEY_2025"; // In production, use environment variable
    let encrypted = "";
    for (let i = 0; i < token.length; i++) {
        encrypted += String.fromCharCode(token.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(encrypted); // Base64 encode
};

const decryptToken = (encrypted: string): string | null => {
    try {
        const key = "SDC_SECURE_KEY_2025";
        const decoded = atob(encrypted);
        let decrypted = "";
        for (let i = 0; i < decoded.length; i++) {
            decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return decrypted;
    } catch {
        return null;
    }
};

// JWT token parser
const parseJWT = (token: string): any => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => {
        const encryptedToken = localStorage.getItem(TOKEN_KEY);
        if (encryptedToken) {
            const decrypted = decryptToken(encryptedToken);
            if (decrypted) {
                const payload = parseJWT(decrypted);
                // Only reject if expired by more than 5 minutes
                if (payload?.exp) {
                    const timeUntilExpiry = (payload.exp * 1000) - Date.now();
                    if (timeUntilExpiry < -300000) {
                        localStorage.removeItem(TOKEN_KEY);
                        localStorage.removeItem(REFRESH_TOKEN_KEY);
                        localStorage.removeItem(TOKEN_EXPIRY_KEY);
                        return null;
                    }
                }
                return decrypted;
            }
        }
        return null;
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

    const login = useCallback((newToken: string, refreshToken?: string) => {
        if (!newToken) return;

        const payload = parseJWT(newToken);
        if (payload?.exp) {
            localStorage.setItem(TOKEN_EXPIRY_KEY, payload.exp.toString());
        }

        const encryptedToken = encryptToken(newToken);
        localStorage.setItem(TOKEN_KEY, encryptedToken);
        
        if (refreshToken) {
            const encryptedRefresh = encryptToken(refreshToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, encryptedRefresh);
        }

        setToken(newToken);
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        setToken(null);
        setIsAuthenticated(false);
    }, []);

    const refreshAuthToken = useCallback(async () => {
        const encryptedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!encryptedRefresh) {
            logout();
            return;
        }

        const refreshToken = decryptToken(encryptedRefresh);
        if (!refreshToken) {
            logout();
            return;
        }

        // TODO: Implement refresh token API call
        // const newToken = await refreshTokenAPI(refreshToken);
        // login(newToken);
    }, [logout, login]);

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated, refreshAuthToken }}>
            {children}
        </AuthContext.Provider>
    );
};
