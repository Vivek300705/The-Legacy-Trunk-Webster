import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase/fireBase";
import { store } from "./store/store";
import { setUser } from "./store/slice/authSlice";
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

const App = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      store.dispatch(setUser(user));
    });

    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        {" "}
        {/* ✅ Add this */}
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
              <Route path="/story-detail" element={<StoryDetail />} />
              <Route path="/search" element={<SearchResults />} />
              <Route
                path="/family-circle/:circleId"
                element={<FamilyCircle />}
              />
              <Route path="/family-circle/new" element={<FamilyCircle />} />
              <Route
                path="/family-tree/:circleId"
                element={<FamilyTreeBuilder />}
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
