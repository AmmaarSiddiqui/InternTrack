import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../state/useAuthContext";

export default function HomeScreen({ navigation }) {
  const { profile } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Welcome, {profile?.name || "Lifter"} 👋</Text>
      <Text style={styles.sub}>Goal: {profile?.goal}</Text>
      <Text style={styles.sub}>Gym: {profile?.gym}</Text>

      <View style={{ height: 16 }} />
      <Button
        title="Find a partner (Pump Now)"
        onPress={() => navigation.navigate("PumpNow")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  h1: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  sub: { fontSize: 16, color: "#444" },
});
