import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../state/useAuthContext";
import { getDoc, doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ActivityIndicator } from "react-native";



export default function ProfileScreen() {
  const navigation = useNavigation();
const { user, profile, setProfile } = useAuth();
const [loading, setLoading] = React.useState(true);
const [status, setStatus] = React.useState("Starting…");

  // Header pills
  useLayoutEffect(() => {
  navigation.setOptions({
    headerTitle: "My Profile",
    headerRight: () => (
    <TouchableOpacity
    onPress={() => navigation.navigate("EditProfile")}
    style={[styles.pill, { marginRight: 12 }]}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
    <Text style={styles.pillText}>Edit</Text>
    </TouchableOpacity>
    ),
  });
}, [navigation]);

React.useEffect(() => {
  let canceled = false;
  let unsubAuth, unsubProfile;

  setLoading(true);

  unsubAuth = onAuthStateChanged(auth, (u) => {
    if (!u) {
      if (!canceled) { setProfile?.(null); setLoading(false); }
      return;
    }

    const ref = doc(db, "profiles", u.uid);

    // Single listener; ignore local-pending so we don't clobber optimistic UI
    unsubProfile = onSnapshot(
      ref,
      { includeMetadataChanges: true },
      (snap) => {
        if (canceled) return;

        // Keep optimistic data until server confirms
        if (snap.metadata.hasPendingWrites) {
          setLoading(false);
          return;
        }

        // Apply server-acknowledged data (or null if missing)
        setProfile?.(snap.exists() ? snap.data() : null);
        setLoading(false);
      },
      (err) => {
        console.warn("[Profile] onSnapshot error:", err);
        if (!canceled) setLoading(false);
      }
    );
  });

  return () => {
    canceled = true;
    if (unsubProfile) unsubProfile();
    if (unsubAuth) unsubAuth();
  };
}, [setProfile]);


  if (loading) {
  return (
    <View style={{ flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator color="#fff" />
      <Text style={{ color: "#9ca3af", marginTop: 8 }}>Loading profile…</Text>
    </View>
  );
}

if (!profile) {
  return (
    <View style={{ flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#fff" }}>No profile yet.</Text>
      <Text style={{ color: "#9ca3af", marginTop: 6 }}>Tap “Edit” to create it.</Text>
    </View>
  );
}

  // Map your current keys to what the UI expects
 const DAYS_ORDER = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const mapped = {
  initials: profile.name ? profile.name[0].toUpperCase() : "?",
  name: profile.name || "",
  goal: profile.goal || "",
  about: profile.about || "",
  level: profile.fitnessLevel || "",
  split: profile.split || "",
  gymName: profile.gym?.name || profile.gym || "",
  gymAddr: profile.gym?.address || "",
  time: profile.time || "",
  days: Array.isArray(profile.days) ? profile.days : [],
  // If profile.availability exists use it; else build from days/time
  availability: Array.isArray(profile.availability) && profile.availability.length > 0
    ? profile.availability
    : (Array.isArray(profile.days) ? [...profile.days]
        .sort((a,b) => DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b))
        .map(d => ({
          day: d,
          time: profile.time || "Anytime",
          tag: "preferred", // or profile.goal || "", your call
        }))
      : []),
};


  return (
    <View style={styles.container}>

    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
    {/* Header row with avatar + name block */}
    <View style={styles.headerRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{mapped.initials}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{mapped.name || "—"}</Text>
        <Text style={styles.about}>{mapped.about || " "}</Text>
        {!!mapped.looking && <Text style={styles.looking}>{mapped.looking}</Text>}
      </View>
    </View>

      {/* Stats Card */}
      <Card title="Stats">
        <Row label="Goal" value={mapped.goal || "—"} />
        <Row label="Fitness Level" value={mapped.level || "—"} />
        <Row label="Workout Split" value={mapped.split || "—"} />
       

      </Card>

      {/* Home Gym Card */}
      <Card title="Gym">
        <Text style={styles.cardTitleText}>{mapped.gymName || "—"}</Text>
        {!!mapped.gymAddr && <Text style={styles.cardSubText}>{mapped.gymAddr}</Text>}
      </Card>

      {/* Weekly Availability Card */}
      <Card title="Weekly Availability">
        {mapped.availability.length === 0 ? (
          <Text style={{ color: "#9ca3af" }}>—</Text>
        ) : (
          mapped.availability.map((a, i) => (
            <AvailabilityRow key={i} day={a.day} time={a.time} tag={a.tag} />
          ))
        )}
      </Card>

      {/* About Me Card */}
      <Card title="About Me">
        <Text style={styles.aboutText}>{mapped.about || "—"}</Text>
      </Card>
       </ScrollView>
    </View>
   
  );
  
}

/* ---------- tiny building blocks ---------- */

function Card({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function AvailabilityRow({ day, time, tag }) {
  return (
    <View style={styles.avRow}>
      <Text style={styles.avDay}>{day}</Text>
      <Text style={styles.avTime}>{time}</Text>
      <View style={styles.avTag}>
        <Text style={styles.avTagText}>{tag}</Text>
      </View>
    </View>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  pill: {
    backgroundColor: "#fff",
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pillText: { color: "#111", fontWeight: "600" },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0b0b0b",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
  avatar: {
    width: 64, height: 64, borderRadius: 9999,
    backgroundColor: "#2b2b2b",
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: "#cfcfcf", fontWeight: "700", fontSize: 18 },
  name: { color: "#fff", fontSize: 22, fontWeight: "800" },
  subtitle: { color: "#8e8e93", marginTop: 2 },
  looking: { color: "#22c55e", marginTop: 4, fontWeight: "600" },

  card: {
    backgroundColor: "#121212",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#222",
  },
  cardHeader: { color: "#fff", fontWeight: "800", fontSize: 16, marginBottom: 10 },
  cardTitleText: { color: "#fff", fontWeight: "700", fontSize: 16, marginBottom: 4 },
  cardSubText: { color: "#9ca3af" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: "#1a1a1a",
  },
  rowLabel: { color: "#9ca3af", flex: 1 },
  rowValue: { color: "#fff", fontWeight: "600" },

  avRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1b1b1b",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  avDay: { color: "#fff", width: 48, fontWeight: "800" },
  avTime: { color: "#e5e7eb", flex: 1, textAlign: "center" },
  avTag: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderColor: "#22c55e",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  avTagText: { color: "#22c55e", fontWeight: "700" },

  aboutText: { color: "#e5e7eb", lineHeight: 20 },
});
