import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "My Profile",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
