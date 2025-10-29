// app/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../state/useAuthContext";
import HomeScreen from "../screens/HomeScreen";
import ProfileCreateScreen from "../screens/ProfileCreateScreen";
import PumpNowScreen from "../screens/PumpNowScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { profile } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!profile ? (
          <Stack.Screen
            name="ProfileCreate"
            component={ProfileCreateScreen}
            options={{ title: "Create Profile" }}
          />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="PumpNow"
              component={PumpNowScreen}
              options={{ title: "Find a Partner" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
