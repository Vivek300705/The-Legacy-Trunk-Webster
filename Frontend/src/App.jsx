import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase/fireBase";
import { store } from "./store/store";
import {
  setFirebaseUser,
  setMongoUser,
  setLoading,
  clearAuth,
} from "./store/slice/authSlice";
import { getUserProfile } from "./api/services";
import { theme } from "./theme/muiTheme";
import Navbar from "./components/Navbar";
import Landing from "./Pages/landing";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import NotFound from "./Pages/NotFound";
import { AuthProvider } from "./context/authContext/index";
import Timeline from "./Pages/Timeline";
import StoryEditor from "./Pages/StoryEditor";
import StoryDetail from "./Pages/StoryDetail";
import SearchResults from "./Pages/SearchResults";
import FamilyCircle from "./Pages/FamilyCircle";
import FamilyTreeBuilder from "./Pages/FamilyTreeBuilder";
import FamilyCircleDetail from "./Pages/FamilyCircleDetail";
import AcceptInvitation from "./Pages/AcceptInvitation";

const App = () => {
  useEffect(() => {
    console.log("Setting up Firebase auth listener...");

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Firebase auth state changed:", firebaseUser?.email);

      if (firebaseUser) {
        // User is logged in
        store.dispatch(setFirebaseUser(firebaseUser));

        try {
          console.log("Fetching MongoDB user profile...");
          const mongoUserData = await getUserProfile();
          console.log("MongoDB user fetched:", mongoUserData);
          store.dispatch(setMongoUser(mongoUserData));
        } catch (error) {
          console.error("Error fetching MongoDB user:", error);

          // If user doesn't exist in MongoDB yet, that's okay
          // They might be newly registered
          if (error.response?.status === 404) {
            console.log("User not found in MongoDB (might be new user)");
          }

          store.dispatch(setLoading(false));
        }
      } else {
        // User logged out
        console.log("User logged out");
        store.dispatch(clearAuth());
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/story-editor" element={<StoryEditor />} />

              {/* Fixed: Added :storyId parameter */}
              <Route path="/story-detail/:storyId" element={<StoryDetail />} />

              <Route path="/search" element={<SearchResults />} />

              {/* Family Circle Routes */}
              <Route path="/family-circle/new" element={<FamilyCircle />} />
              <Route
                path="/family-circle/:circleId"
                element={<FamilyCircleDetail />}
              />

              <Route
                path="/family-tree/:circleId"
                element={<FamilyTreeBuilder />}
              />
              <Route
                path="/accept-invitation/:token"
                element={<AcceptInvitation />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
