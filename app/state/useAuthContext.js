import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../services/firebase";

const Ctx = React.createContext(null);
export const useAuth = () => React.useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  // profile: undefined = loading, null = missing, object = exists
  const [profile, setProfile] = React.useState(undefined);

  React.useEffect(() => {
    let unsubAuth, unsubProfile;

    unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setProfile(undefined); // start loading on every auth change

      if (!u) {
        setProfile(null);
        if (unsubProfile) unsubProfile();
        return;
      }

      const ref = doc(db, "profiles", u.uid);
      unsubProfile = onSnapshot(
        ref,
        { includeMetadataChanges: true },
        (snap) => {
          // keep optimistic UI until server acks
          if (snap.metadata.hasPendingWrites) return;
          setProfile(snap.exists() ? snap.data() : null);
        },
        (err) => {
          console.warn("[AuthProvider] profile listen error:", err);
          setProfile(null);
        }
      );
    });

    return () => {
      if (unsubProfile) unsubProfile();
      if (unsubAuth) unsubAuth();
    };
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      profile,                    // undefined | null | object
      profileLoading: profile === undefined,
      setProfile,                 // for optimistic updates on save
    }),
    [user, profile]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
