import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Firebase user objects and MongoDB user objects in Redux
        ignoredActions: ["auth/setFirebaseUser", "auth/setMongoUser"],
        ignoredPaths: ["auth.firebaseUser", "auth.mongoUser"],
      },
    }),
});
