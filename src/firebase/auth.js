import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import { auth } from "./config";

// REGISTER
export const registerUser = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// LOGIN
export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// LOGOUT
export const logoutUser = async () => {
  return await signOut(auth);
};


// AUTH STATE LISTENER
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};