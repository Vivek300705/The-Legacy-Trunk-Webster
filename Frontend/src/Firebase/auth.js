import { auth } from "./fireBase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
} from "firebase/auth";

// ✅ Register new user
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// ✅ Sign in with email/password
export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// ✅ Sign in with Google
export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// ✅ Sign out
export const doSignOut = () => {
  return auth.signOut();
};

// ✅ Send password reset email (OTP link to email)
export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// ✅ Change current user password
export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

// ✅ Send email verification (OTP to email)
export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`, // redirect after verification
  });
};
