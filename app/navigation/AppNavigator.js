// app/navigation/AppNavigator.js
import React from "react";
import { 
  NavigationContainer, 
  DarkTheme
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../state/useAuthContext";
import { Ionicons } from "@expo/vector-icons"; 
import { useTheme } from "@react-navigation/native";

import HomeScreen from "../screens/HomeScreen";
import ProfileCreateScreen from "../screens/ProfileCreateScreen";
import AuthScreen from "../screens/AuthScreen";
import MatchScreen from "../screens/MatchScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Custom dark theme
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#3b6cff", // Your active color
    background: "#121212", // A standard dark background
    card: "#1E1E1E",      // For headers and tab bars
  },
};

function MainAppTabs() {
  // 5. Use the theme's colors
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // ... (your icon logic remains the same)
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Match") {
            iconName = focused ? "link" : "link-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: colors.primary, // Active color from theme
        tabBarInactiveTintColor: "white",       // Inactive color
        
        tabBarStyle: { 
          backgroundColor: colors.card, // Set tab bar background
          borderTopColor: colors.border,  // Style the border
        },
        headerStyle: {
          backgroundColor: colors.card, // Set header background
        },
        headerTintColor: colors.text,     // Set header text color
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Match"
        component={MatchScreen}
        options={{ title: "Match" }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, profile } = useAuth();

  return (
    <NavigationContainer theme={CustomDarkTheme}>
      <Stack.Navigator
        // Apply theme styles to the Stack Navigator headers too
        screenOptions={{
          headerStyle: {
            backgroundColor: CustomDarkTheme.colors.card,
          },
          headerTintColor: CustomDarkTheme.colors.text,
        }}
      >
        {!user ? (
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        ) : !profile ? (
          <Stack.Screen
            name="ProfileCreate"
            component={ProfileCreateScreen}
            options={{ title: "Create Profile", headerBackVisible: false }}
          />
        ) : (
          <Stack.Screen
            name="MainApp"
            component={MainAppTabs}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
