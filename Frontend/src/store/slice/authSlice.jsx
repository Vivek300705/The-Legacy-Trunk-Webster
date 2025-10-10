import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firebaseUser: null, // Firebase Auth user (with uid)
  mongoUser: null, // MongoDB user (with _id and familyCircle)
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setFirebaseUser: (state, action) => {
      state.firebaseUser = action.payload;
    },
    setMongoUser: (state, action) => {
      state.mongoUser = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearAuth: (state) => {
      state.firebaseUser = null;
      state.mongoUser = null;
      state.loading = false;
    },
    // Update familyCircle in mongoUser
    updateFamilyCircle: (state, action) => {
      if (state.mongoUser) {
        state.mongoUser.familyCircle = action.payload;
      }
    },
  },
});

export const {
  setFirebaseUser,
  setMongoUser,
  setLoading,
  clearAuth,
  updateFamilyCircle,
} = authSlice.actions;

export default authSlice.reducer;
