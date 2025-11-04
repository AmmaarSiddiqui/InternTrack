import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../state/useAuthContext";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { profile, setProfile } = useAuth(); 

  const [name, setName] = useState(profile?.name || "");
  const [goal, setGoal] = useState(profile?.goal || "strength"); // strength | endurance | aesthetics
  const [gym, setGym] = useState(profile?.gym || "");

  const save = () => {
    setProfile({
      ...(profile || {}),
      name: name.trim(),
      goal: goal.trim(),
      gym: gym.trim(),
    });
    navigation.goBack();
  };

  return (
    <View style={s.container}>
      <Text style={s.header}>Edit Profile</Text>

      <Label>Display name</Label>
      <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor="#6b7280" />

      <Label>Primary goal</Label>
      <TextInput style={s.input} value={goal} onChangeText={setGoal} placeholder="strength | endurance | aesthetics" placeholderTextColor="#6b7280" />

      <Label>Primary gym</Label>
      <TextInput style={s.input} value={gym} onChangeText={setGym} placeholder="LA Fitness - Downtown" placeholderTextColor="#6b7280" />

      <TouchableOpacity style={s.save} onPress={save}>
        <Text style={s.saveText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.cancel} onPress={() => navigation.goBack()}>
        <Text style={s.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

function Label({ children }) {
  return <Text style={s.label}>{children}</Text>;
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  header: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 12 },
  label: { color: "#9ca3af", marginTop: 12, marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "#111827", color: "#fff",
    paddingVertical: 12, paddingHorizontal: 14,
    borderRadius: 12, borderWidth: 1, borderColor: "#1f2937",
  },
  save: { marginTop: 18, backgroundColor: "#3b6cff", paddingVertical: 14, borderRadius: 16 },
  saveText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  cancel: { marginTop: 10, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: "#374151" },
  cancelText: { color: "#9ca3af", textAlign: "center", fontWeight: "600" },
});
