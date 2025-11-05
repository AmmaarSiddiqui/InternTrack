import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Ctx = React.createContext(null);
export const useAuth = () => React.useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
 // profile: undefined=loading, null=missing, object=exists
 const [profile, setProfile] = React.useState(undefined);
 const [syncedOnce, setSyncedOnce] = React.useState(false); // first server snapshot arrived

React.useEffect(() => {
  let unsubAuth, unsubProfile;

  unsubAuth = onAuthStateChanged(auth, async (u) => {
    setUser(u);

    if (unsubProfile) { unsubProfile(); unsubProfile = undefined; }

    if (!u) {
  setProfile(null);
  return;
}

  // apply cache immediately; no "undefined" gap
  let cached = null;
  try {
    const raw = await AsyncStorage.getItem(`profile:${u.uid}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") cached = parsed;
    }
  } catch {}
  setProfile(cached ?? null);

      // Realtime (no includeMetadataChanges)
      const ref = doc(db, "profiles", u.uid);
      unsubProfile = onSnapshot(
        ref,
        async (snap) => {
          const data = snap.exists() ? snap.data() : null;
          setProfile(data);   // object or null — never undefined
          try {
            if (data) await AsyncStorage.setItem(`profile:${u.uid}`, JSON.stringify(data));
            else await AsyncStorage.removeItem(`profile:${u.uid}`);
          } catch {}
        },
        (err) => {
          console.warn("[AuthProvider] profile listen error:", err);
          // keep current profile; don't set undefined
        }
      );

    // optional: warm server once (non-blocking)
    (async () => {
      try {
        const { getDocFromServer } = await import("firebase/firestore");
        await getDocFromServer(ref);
      } catch {}
    })();
  });

  return () => { if (unsubProfile) unsubProfile(); if (unsubAuth) unsubAuth(); };
}, []);


   const value = React.useMemo(() => ({
  user,
  profile,                                  // null | object
  profileLoading: !!user && profile === undefined, // only pre-first cache read
  setProfile,
}), [user, profile]);


  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
