import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../state/useAuthContext";
import HomeScreen from "../screens/HomeScreen";
import ProfileCreateScreen from "../screens/ProfileCreateScreen";
import PumpNowScreen from "../screens/PumpNowScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Text } from "react-native";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { profile } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTransparent: false,
          headerBlurEffect: "none",
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#000",
          headerTitleStyle: { color: "#000" },
        }}
      >
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
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={({ navigation }) => ({
                title: "My Profile",
                headerRight: () => (
                  <Text
                    onPress={() => navigation.navigate("ProfileCreate")}
                    style={{
                      color: "#000",
                      fontWeight: "600",
                      fontSize: 16,
                      marginRight: 10,
                    }}
                  >
                    Edit
                  </Text>
                ),
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
