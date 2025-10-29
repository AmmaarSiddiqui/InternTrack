import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../state/useAuthContext";

export default function WelcomeScreen({ navigation, route }) {
  const { setProfile } = useAuth();

  // Data your login flow should pass here:
  // navigation.navigate("Welcome", { user: { name, goal, gym } })
  const user = route?.params?.user;

  // When this screen mounts and we have user info:
  useEffect(() => {
    if (user) {
      // Save the real user profile globally (no dummy data)
      setProfile({
        name: user.name,
        goal: user.goal,
        gym: user.gym,
      });

      // Navigate into the main app stack
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }
  }, [user, setProfile, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Partner & Pump</Text>
      <Text style={styles.sub}>Welcome, {user?.name || "Lifter"} 👋</Text>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => {
          // your logout logic here
        }}
      >
        <Text style={styles.logoutBtnText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f10",
    paddingTop: 100,
    alignItems: "center",
  },
  title: { fontSize: 32, fontWeight: "700", color: "#fff", marginBottom: 8 },
  sub: { fontSize: 18, color: "#999", marginBottom: 32 },
  logoutBtn: {
    backgroundColor: "#1a1a1d",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: "80%",
    borderColor: "#2a2a2e",
    borderWidth: 1,
  },
  logoutBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});
