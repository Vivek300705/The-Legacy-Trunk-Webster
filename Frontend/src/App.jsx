import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
<<<<<<< HEAD
import { Provider } from "react-redux";
=======
import { Provider, useDispatch } from "react-redux";
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
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
<<<<<<< HEAD
import { getUserProfile } from "./api/services";
import { theme } from "./theme/muiTheme";
=======
import { syncUser } from "./api/services"; // Use syncUser
import { theme } from "./theme/muiTheme";

// Import all your page and component files
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
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
<<<<<<< HEAD
import FamilyTree from "./Pages/FamilyTree"; // ✅ Import the new FamilyTree component
=======
import FamilyTree from "./Pages/FamilyTree";
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
import FamilyCircleDetail from "./Pages/FamilyCircleDetail";
import AcceptInvitation from "./Pages/AcceptInvitation";
import AdminDashboard from "./components/AdminDashboard";

<<<<<<< HEAD
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
=======

// This new component will handle the logic and routing
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        dispatch(setFirebaseUser(firebaseUser.toJSON()));
        dispatch(setLoading(true));
        try {
          const mongoUserData = await syncUser({
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
          });
          dispatch(setMongoUser(mongoUserData));
        } catch (error) {
          console.error("Critical error during user sync:", error);
          dispatch(clearAuth());
        } finally {
          dispatch(setLoading(false));
        }
      } else {
        dispatch(clearAuth());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
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
        <Route path="/story-detail/:storyId" element={<StoryDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/family-circle/new" element={<FamilyCircle />} />
        <Route path="/family-circle/:circleId" element={<FamilyCircleDetail />} />
        <Route path="/family-tree/:circleId" element={<FamilyTreeBuilder />} />
        <Route path="/family-tree-view/:circleId" element={<FamilyTree />} />
        <Route path="/accept-invitation/:token" element={<AcceptInvitation />} />
        <Route path="/admin-dashboard/:circleId" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

// The main App component now only handles the Providers
const App = () => {
  return (
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
<<<<<<< HEAD
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

              {/* Story Detail */}
              <Route path="/story-detail/:storyId" element={<StoryDetail />} />

              {/* Search */}
              <Route path="/search" element={<SearchResults />} />

              {/* Family Circle Routes */}
              <Route path="/family-circle/new" element={<FamilyCircle />} />
              <Route
                path="/family-circle/:circleId"
                element={<FamilyCircleDetail />}
              />

              {/* Family Tree Routes */}
              <Route
                path="/family-tree/:circleId"
                element={<FamilyTreeBuilder />}
              />
              {/* ✅ NEW: Family Tree Visualization Route */}
              <Route
                path="/family-tree-view/:circleId"
                element={<FamilyTree />}
              />

              {/* Invitation */}
              <Route
                path="/accept-invitation/:token"
                element={<AcceptInvitation />}
              />
              <Route
                path="/admin-dashboard/:circleId"
                element={<AdminDashboard />}
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
=======
          <AppContent />
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
};

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 9eb87e72a28587b503058775bf32d11302800ad6
