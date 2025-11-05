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
    let unsubAuth;
    let unsubProfile;
    let bootTimeout;
    const BOOT_TIMEOUT_MS = 4000;
    unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setProfile(undefined); // start loading on every auth change
      setSyncedOnce(false);

      // clean up any previous profile listener
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = undefined;
      }

      if (!u) {
        setProfile(null);
        return;
      }
      let hadCache = false;
      try {
        const cached = await AsyncStorage.getItem(`profile:${u.uid}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") setProfile(parsed);
          hadCache = true;
        }
      } catch {}
      if (!hadCache) {
        bootTimeout = setTimeout(() => {
          setProfile((p) => (p === undefined ? null : p));
        }, BOOT_TIMEOUT_MS);
      }

      const ref = doc(db, "profiles", u.uid);
      unsubProfile = onSnapshot(
  ref,
  { includeMetadataChanges: true },
  async (snap) => {
    // ✅ don't bail on pending writes — we still want to unblock UI
    if (bootTimeout) { clearTimeout(bootTimeout); bootTimeout = undefined; }

    // ✅ mark that we've synced *something* so profileLoading can stop
    setSyncedOnce((was) => was || true);

    const data = snap.exists() ? snap.data() : null;
    setProfile(data);

    // write-through cache
    try {
      if (data) {
        await AsyncStorage.setItem(`profile:${u.uid}`, JSON.stringify(data));
      } else {
        await AsyncStorage.removeItem(`profile:${u.uid}`);
      }
    } catch {}
  },
  (err) => {
    console.warn("[AuthProvider] profile listen error:", err);
    if (bootTimeout) { clearTimeout(bootTimeout); bootTimeout = undefined; }
    setProfile((p) => (p === undefined ? (hadCache ? p : null) : p));
    // also ensure we don't spin forever
    setSyncedOnce((was) => was || true);
  }
);
    });

    return () => {
      if (unsubProfile) unsubProfile();
      if (unsubAuth) unsubAuth();
      if (bootTimeout) clearTimeout(bootTimeout);
    };
  }, []);

    const value = React.useMemo(
      () => ({
        user,
        profile,                      // undefined | null | object
       profileLoading: profile === undefined, // simpler & avoids stalls
        setProfile,
      }),
      [user, profile, syncedOnce]
    );


  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
