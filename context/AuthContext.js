import { useContext, createContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (res) => {
      const allowed_acc = process.env.NEXT_PUBLIC_ALLOWED_EMAIL;
      console.log("logged email", res.user.email);
      console.log("allowed email", process.env.NEXT_PUBLIC_ALLOWED_EMAIL);
      if (allowed_acc === res.user.email) {
        const userId = res.user.uid;
        const newUserRef = doc(db, "admin", userId);

        try {
          await setDoc(newUserRef, {
            id: userId,
            username: res.user.displayName,
            email: res.user.email,
            profileURL: res.user.photoURL,
            created_at: res.user.metadata.creationTime,
          });
          window.location.href = "/";
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("This user is not allowed to access the admin dashboard.");
        window.location.href = "/access-denied";
      }
    });
  };
  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
