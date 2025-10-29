import React from "react";
import { View, Text, Image, StyleSheet, FlatList, ScrollView } from "react-native";

const mockProfile = {
  displayName: "Mohamed M.",
  profilePictureUrl: "https://placehold.co/200x200/png?text=MM",
  bio: "Trying to get stronger & stay consistent. Push/Pull/Legs, evenings. Not super serious but I show up.",
  fitnessLevel: "Intermediate",
  primaryGoal: "Strength / Aesthetics",
  primaryGym: {
    name: "LA Fitness - West Seattle",
    address: "1900 SW Something St, Seattle, WA",
  },
  workoutSplit: "Push / Pull / Legs (PPL)",
  weeklySchedule: [
    { day: "Mon", startTime: "18:00", endTime: "20:00", workoutType: "Push" },
    { day: "Wed", startTime: "18:30", endTime: "20:00", workoutType: "Pull" },
    { day: "Fri", startTime: "17:00", endTime: "19:00", workoutType: "Legs" },
  ],
  matchPreference: "long_term",
};

export default function ProfileScreen() {
  const profile = mockProfile;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* header: pic + name + goal */}
      <View style={styles.headerRow}>
        <Image source={{ uri: profile.profilePictureUrl }} style={styles.avatar} />
        <View style={styles.headerTextCol}>
          <Text style={styles.name}>{profile.displayName}</Text>
          <Text style={styles.goalText}>{profile.primaryGoal}</Text>
          <Text style={styles.matchPref}>
            {profile.matchPreference === "same_day"
              ? "Looking for same-day partners"
              : profile.matchPreference === "long_term"
              ? "Looking for long-term partner"
              : "Open to both"}
          </Text>
        </View>
      </View>

      {/* stats */}
      <Card title="Stats">
        <Row label="Fitness Level" value={profile.fitnessLevel} />
        <Row label="Workout Split" value={profile.workoutSplit} />
      </Card>

      {/* gym */}
      <Card title="Home Gym">
        <Text style={styles.valueText}>{profile.primaryGym.name}</Text>
        <Text style={styles.subValueText}>{profile.primaryGym.address}</Text>
      </Card>

      {/* schedule */}
      <Card title="Weekly Availability">
        <FlatList
          data={profile.weeklySchedule}
          keyExtractor={(item, idx) => idx.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleDay}>{item.day}</Text>
              <Text style={styles.scheduleTime}>
                {formatTime(item.startTime)}–{formatTime(item.endTime)}
              </Text>
              <Text style={styles.scheduleType}>{item.workoutType}</Text>
            </View>
          )}
        />
      </Card>

      {/* bio */}
      <Card title="About Me">
        <Text style={styles.bioText}>{profile.bio}</Text>
      </Card>
    </ScrollView>
  );
}

function Card({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
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

// "18:00" -> "6:00 PM"
function formatTime(t) {
  const [h, m] = t.split(":");
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${hour}:${m} ${ampm}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f10" },
  content: { padding: 16, paddingBottom: 48 },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#2a2a2e" },
  headerTextCol: { flex: 1, marginLeft: 16 },

  name: { color: "white", fontSize: 20, fontWeight: "600" },
  goalText: { color: "#aaa", fontSize: 14, marginTop: 4 },
  matchPref: { color: "#6fe388", fontSize: 12, marginTop: 4 },

  card: {
    backgroundColor: "#1a1a1d",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a2e",
  },
  cardTitle: { color: "white", fontSize: 16, fontWeight: "600", marginBottom: 12 },

  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  rowLabel: { color: "#aaa", fontSize: 14 },
  rowValue: { color: "white", fontSize: 14, fontWeight: "500" },

  valueText: { color: "white", fontSize: 15, fontWeight: "500" },
  subValueText: { color: "#888", fontSize: 13, marginTop: 4 },

  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2a2a2e",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  scheduleDay: { color: "white", fontWeight: "600", width: 44 },
  scheduleTime: { color: "white", fontSize: 13, flex: 1, textAlign: "center" },
  scheduleType: {
    color: "#6fe388",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "right",
    width: 60,
  },

  bioText: { color: "white", fontSize: 14, lineHeight: 20 },
});
