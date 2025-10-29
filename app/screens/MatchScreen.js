// app/screens/MatchScreen.js
// Match Screen (UI-Only)
// lets users toggle between "Pump Now" and "Long-Term"
// all front-end visuals only, no backend or data yet.

import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";

export default function MatchScreen() {
  // keep track of which mode we're on like "pumpNow" or "longTerm"
  const [mode, setMode] = useState("pumpNow");

  // mock categories for display only
  const categories = [
    { label: "Push", icon: "💪" },
    { label: "Legs", icon: "🦵" },
    { label: "Sports", icon: "⚽" },
    { label: "Cardio", icon: "❤️" },
    { label: "Full Body", icon: "🏋️" },
    { label: "Yoga", icon: "🧘" },
  ];

  // render title text based on selected mode
  const titleText = mode === "pumpNow" ? "Pump Now" : "Long-Term";

  return (
    <View style={styles.container}>
      {/* main header */}
      <Text style={styles.title}>MATCH</Text>

      {/* toggle between Pump Now and Long-Term */}
      <View style={styles.toggleRow}>
        <Pressable
          onPress={() => setMode("pumpNow")}
          style={[styles.toggleBtn, mode === "pumpNow" && styles.activeToggle]}
        >
          <Text
            style={[styles.toggleText, mode === "pumpNow" && styles.activeText]}
          >
            Pump Now
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setMode("longTerm")}
          style={[styles.toggleBtn, mode === "longTerm" && styles.activeToggle]}
        >
          <Text
            style={[styles.toggleText, mode === "longTerm" && styles.activeText]}
          >
            Long-Term
          </Text>
        </Pressable>
      </View>

      {/* section label (changes with toggle) */}
      <Text style={styles.sectionTitle}>
        {titleText === "Pump Now" ? "Same-Day Sessions" : "Ongoing Partnerships"}
      </Text>

      {/* categories grid */}
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((cat) => (
          <Pressable key={cat.label} style={styles.box}>
            <Text style={styles.icon}>{cat.icon}</Text>
            <Text style={styles.boxText}>{cat.label}</Text>
          </Pressable>
        ))}

        {/* back button placeholder */}
        <Pressable style={[styles.box, styles.backBox]}>
          <Text style={styles.boxText}>Back</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// 🧠 styles — all dark mode, consistent with rest of app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f10",
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1,
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#1a1b1e",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  toggleBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  activeToggle: {
    backgroundColor: "#3b6cff",
  },
  toggleText: {
    color: "#9aa0a6",
    fontWeight: "600",
    fontSize: 14,
  },
  activeText: {
    color: "#fff",
  },
  sectionTitle: {
    color: "#9aa0a6",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 60,
  },
  box: {
    width: "47%",
    backgroundColor: "#1a1b1e",
    borderRadius: 16,
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2b2f36",
  },
  backBox: {
    backgroundColor: "#2b2f36",
  },
  icon: {
    fontSize: 28,
    marginBottom: 10,
  },
  boxText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

