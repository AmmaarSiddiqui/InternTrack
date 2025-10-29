import React, { useMemo } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useAuth } from "../state/useAuthContext";
import MatchCard from "../components/MatchCard";
// If your service exists, import it; else use a tiny fallback:
let compatibilityScore;
try {
  compatibilityScore = require("../services/matching/compatibilityScore").default;
} catch {
  compatibilityScore = (me, candidate) => {
    let s = 0;
    if (me.gym === candidate.gym) s += 50;
    if (me.goal === candidate.goal) s += 30;
    if (candidate.split === "push") s += 20;
    return Math.min(100, s);
  };
}

// demo candidates
const CANDIDATES = [
  { id: "u1", name: "Eshan", goal: "strength", gym: "LA Fitness - Downtown", split: "push" },
  { id: "u2", name: "Mohamed", goal: "aesthetics", gym: "Anytime - North", split: "pull" },
  { id: "u3", name: "John", goal: "endurance", gym: "LA Fitness - Downtown", split: "legs" },
  { id: "u4", name: "Masroor", goal: "strength", gym: "LA Fitness - Downtown", split: "push" },
];

export default function PumpNowScreen() {
  const { profile } = useAuth();

  const ranked = useMemo(() => {
    if (!profile) return [];
    return CANDIDATES
      .map((c) => ({
        ...c,
        score: compatibilityScore(profile, c),
      }))
      .sort((a, b) => b.score - a.score);
  }, [profile]);

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Matches near {profile?.gym}</Text>
      <FlatList
        data={ranked}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MatchCard
            name={item.name}
            gym={item.gym}
            goal={item.goal}
            score={item.score}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  h1: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
});

