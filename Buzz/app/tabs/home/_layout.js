import { Stack } from "expo-router";
import Theme from "@/assets/theme";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
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
          headerStyle: { backgroundColor: Theme.colors.backgroundPrimary },
          headerTintColor: Theme.colors.textPrimary,
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          headerTitle: "Comments",
          presentation: "card",
          headerShown: true,
          headerStyle: {
            backgroundColor: Theme.colors.backgroundPrimary,
          },
          headerTintColor: "white",
          headerBackTitle: "Back",
          headerBackTitleVisible: true,
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="newpost"
        options={{
          headerTitle: "New Post",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
