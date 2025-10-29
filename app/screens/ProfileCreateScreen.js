import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../state/useAuthContext";

export default function ProfileCreateScreen() {
  const { setProfile } = useAuth();
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("strength"); // strength | endurance | aesthetics
  const [gym, setGym] = useState("");

  const onSave = () => {
    if (!name.trim() || !gym.trim()) {
      Alert.alert("Missing info", "Please fill out your name and gym.");
      return;
    }
    setProfile({ name: name.trim(), goal: goal.trim(), gym: gym.trim() });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Create your profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g., Yasir"
        style={styles.input}
      />

      <Text style={styles.label}>Primary Goal</Text>
      <TextInput
        value={goal}
        onChangeText={setGoal}
        placeholder="strength | endurance | aesthetics"
        style={styles.input}
      />

      <Text style={styles.label}>Primary Gym</Text>
      <TextInput
        value={gym}
        onChangeText={setGym}
        placeholder="e.g., LA Fitness - Downtown"
        style={styles.input}
      />

      <Button title="Save & Continue" onPress={onSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  h1: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12 },
});