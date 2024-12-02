import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Theme from "@/assets/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.iconHighlighted,
        tabBarInactiveTintColor: Theme.colors.iconSecondary,
        tabBarStyle: { backgroundColor: Theme.colors.backgroundPrimary },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Feed",
          headerShown: false,
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="bee"
                size={45}
                color={Theme.colors.iconHighlighted}
                style={{ marginRight: 4 }}
              />
              <Text
                style={{
                  color: Theme.colors.textPrimary,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Buzz
              </Text>
            </View>
          ),
          headerStyle: {
            backgroundColor: Theme.colors.backgroundPrimary,
          },
          headerTintColor: Theme.colors.textPrimary,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="beehive-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile",
          headerShown: true,
          headerTitle: () => (
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              My Profile
            </Text>
          ),
          headerStyle: {
            backgroundColor: Theme.colors.backgroundPrimary,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: "white",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
