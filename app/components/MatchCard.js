import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";

export default function MatchCard({ name, gym, goal, score }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.line}>Gym: {gym}</Text>
      <Text style={styles.line}>Goal: {goal}</Text>
      <Text style={styles.score}>Compatibility: {score}%</Text>
      <View style={{ height: 8 }} />
      <Button title="Send Request" onPress={() => Alert.alert("Request sent")} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 14 },
  name: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  line: { color: "#444" },
  score: { marginTop: 8, fontWeight: "700" },
});
