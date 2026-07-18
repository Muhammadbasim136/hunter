import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { getToken, setToken, getErrorMessage } from "../lib/api";
import { connectSocket, disconnectSocket } from "../lib/socket";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken());
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (!token) {
        setReady(true);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        if (cancelled) return;
        setUser(data.user);
        connectSocket();
      } catch {
        setToken(null);
        setTokenState(null);
        disconnectSocket();
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const applyToken = useCallback((newToken) => {
    setToken(newToken);
    setTokenState(newToken);
    if (newToken) connectSocket();
    else {
      setUser(null);
      disconnectSocket();
    }
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      const { data } = await api.post("/auth/login", { email, password });
      applyToken(data.token);
      setUser(data.user);
      return data;
    },
    [applyToken]
  );

  const signup = useCallback(async ({ email, password }) => {
    const { data } = await api.post("/auth/signup", { email, password });
    return data;
  }, []);

  const verifySignup = useCallback(
    async ({ email, code }) => {
      const { data } = await api.post("/auth/signup/verify", { email, code });
      if (data.token) {
        applyToken(data.token);
        setUser(data.user);
      }
      return data;
    },
    [applyToken]
  );

  const resendSignupCode = useCallback(async ({ email }) => {
    const { data } = await api.post("/auth/signup/resend-code", { email });
    return data;
  }, []);

  const forgotPassword = useCallback(async ({ email }) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  }, []);

  const resetPassword = useCallback(async ({ email, code, password }) => {
    const { data } = await api.post("/auth/reset-password", {
      email,
      code,
      newPassword: password,
    });
    return data;
  }, []);

  const logout = useCallback(() => {
    applyToken(null);
  }, [applyToken]);

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    isAdmin: user?.role === "admin",
    ready,
    login,
    signup,
    verifySignup,
    resendSignupCode,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { getErrorMessage };
