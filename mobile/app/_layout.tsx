import { Stack } from "expo-router";
import {useLocationTracking} from "@/hooks/useLocationTracking";
import {UserProvider} from "@/context/UserContext";

export default function RootLayout() {
  useLocationTracking();
  return (
    <UserProvider>
      <Stack >
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      </Stack>
    </UserProvider>

  );
}
