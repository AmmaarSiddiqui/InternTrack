// app/screens/MatchListScreen.js
import React, { useLayoutEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import UserCard from "../components/UserCard";

// Mock data based on your screenshot
const MOCK_BY_MODE_AND_CATEGORY = {
  pumpNow: {
    Push: [
      { id: "pn-push-1", name: "Alex Rivera", age: 24, bio: "Dedicated to strength training and staying fit.", tags: ["Goals"] },
      { id: "pn-push-2", name: "Maya Patel", age: 26, bio: "Bench and overhead press day fanatic.", tags: ["Push"] },
      { id: "pn-push-3", name: "Ethan Brooks", age: 28, bio: "Loves chest/shoulder supersets.", tags: ["Push"] },
    ],
    Legs: [
      { id: "pn-legs-1", name: "Jordan Kim", age: 25, bio: "Big on squats and lunges.", tags: ["Legs"] },
      { id: "pn-legs-2", name: "Sara Nguyen", age: 23, bio: "Chasing a 2xBW squat.", tags: ["Legs"] },
      { id: "pn-legs-3", name: "Diego Torres", age: 29, bio: "Quad pump enthusiast.", tags: ["Legs"] },
    ],
    Sports: [
      { id: "pn-sports-1", name: "Priya Shah", age: 22, bio: "Pickup soccer after lifts.", tags: ["Sports"] },
      { id: "pn-sports-2", name: "Noah Williams", age: 30, bio: "Basketball + mobility.", tags: ["Sports"] },
    ],
    Cardio: [
      { id: "pn-cardio-1", name: "Ava Chen", age: 27, bio: "Intervals and incline walks.", tags: ["Cardio"] },
      { id: "pn-cardio-2", name: "Liam Park", age: 24, bio: "Row + assault bike mix.", tags: ["Cardio"] },
    ],
    "Full Body": [
      { id: "pn-full-1", name: "Marcus Lee", age: 27, bio: "Compound circuits, minimal rest.", tags: ["Full Body"] },
      { id: "pn-full-2", name: "Sofia Alvarez", age: 23, bio: "EMOM style sessions.", tags: ["Full Body"] },
    ],
    Yoga: [
      { id: "pn-yoga-1", name: "Nina Gupta", age: 25, bio: "Vinyasa and deep stretch.", tags: ["Yoga"] },
      { id: "pn-yoga-2", name: "Owen Davis", age: 31, bio: "Recovery flows post-lift.", tags: ["Yoga"] },
    ],
  },

  longTerm: {
    "Push/Pull/Legs": [
      { id: "lt-ppl-1", name: "Alex Rivera", age: 24, bio: "3-day PPL rotation focused on progression.", tags: ["PPL"] },
      { id: "lt-ppl-2", name: "Hannah Moore", age: 26, bio: "Waves volume across P/P/L.", tags: ["PPL"] },
    ],
    "Upper/Lower": [
      { id: "lt-ul-1", name: "Jordan Kim", age: 25, bio: "ULUL 4x/week strength split.", tags: ["Upper", "Lower"] },
      { id: "lt-ul-2", name: "Theo Wright", age: 28, bio: "Powerbuilding upper/lower plan.", tags: ["Upper/Lower"] },
    ],
    "Full Body": [
      { id: "lt-full-1", name: "Priya Shah", age: 22, bio: "FB 3x/week minimalist strength.", tags: ["Full Body"] },
      { id: "lt-full-2", name: "Miles Carter", age: 29, bio: "Daily undulating FB program.", tags: ["Full Body"] },
    ],
    "Bro Split": [
      { id: "lt-bro-1", name: "Marcus Lee", age: 27, bio: "Classic chest/back/legs/arms/shoulders.", tags: ["Bro Split"] },
      { id: "lt-bro-2", name: "Sofia Alvarez", age: 23, bio: "Hypertrophy-focused 5-day split.", tags: ["Bro Split"] },
    ],
  },
};


export default function MatchListScreen({ route, navigation }) {
  const { colors } = useTheme();
  
  // Get the category and mode passed from the previous screen
  const { category, mode } = route.params;

  // Set the header title dynamically
  useLayoutEffect(() => {
    const modeText = mode === "pumpNow" ? "Same-Day" : "Long-Term";
    navigation.setOptions({
      title: `${category} — ${modeText}`,
    });
  }, [navigation, category, mode]);

  const data =
  MOCK_BY_MODE_AND_CATEGORY[mode]?.[category] ??
  []; // empty list if not found

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
        <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => ( 
            <UserCard
                name={item.name}
                age={item.age}
                bio={item.bio}
                tags={item.tags}
                onMatch={() => console.log("Match with", item.name)}
            />
            )}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 20,
  },
});