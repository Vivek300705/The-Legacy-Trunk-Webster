import React, { useEffect, useState, useContext } from "react";
import { auth } from "../../Firebase/fireBase";
import { onAuthStateChanged } from "firebase/auth";
import { syncUser } from "../../api/services";

// Create Context
const AuthContext = React.createContext();

// Custom hook to use Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // CRITICAL FIX: Wait for the token to be ready before syncing
          await user.getIdToken(true); // Force token refresh to ensure it's available

          // Now sync with backend
          await syncUser({
            name: user.displayName || user.email.split("@")[0],
            email: user.email,
          });

          console.log("✅ User synced successfully with backend");
        } catch (err) {
          console.error("❌ Error syncing user with backend:", err);
          console.error("Error details:", err.response?.data || err.message);
        }

        setCurrentUser({ ...user });
        setUserLoggedIn(true);
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userLoggedIn,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
