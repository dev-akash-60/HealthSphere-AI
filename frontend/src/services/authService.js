import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";

import { auth } from "../firebase/firebase";

// Register user
export const registerUser = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    await updateProfile(userCredential.user, {
        displayName: name
    });

    return userCredential.user;
};

// Login user
export const loginUser = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    return userCredential.user;
};

// Logout user
export const logoutUser = async () => {
    await signOut(auth);
};