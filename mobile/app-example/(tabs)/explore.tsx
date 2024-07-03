
import {StyleSheet, Text, View} from 'react-native';

import io, {Socket} from 'socket.io-client'
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import {useEffect, useRef, useState} from "react";
const SOCKET_SERVER_URL = 'https://www.workbee.dev';
const LOCATION_TASK_NAME = 'background-location-task';
export default function TabTwoScreen() {
  const socketRef = useRef<Socket|null>(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_SERVER_URL);

    // Request location permissions
    const getPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      // Start background location updates
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 45000,
        distanceInterval: 0,
        showsBackgroundLocationIndicator: true,
      });
    };

    getPermissions();

    return () => {
      // Cleanup socket connection
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    };
  }, []);

  return (
    <View>
      <Text>Location Tracking App</Text>
      {location && (
        <Text>Location: {location.coords.latitude}, {location.coords.longitude}</Text>
      )}
    </View>
  );

}
TaskManager.defineTask<Location>(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Error in background task:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const location = locations[0];
    const socket = io(SOCKET_SERVER_URL);

    if (socket) {
      socket.emit('location', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      socket.disconnect();
    }
  }
});

// Register the background fetch task
const registerBackgroundFetch = async () => {
  await BackgroundFetch.registerTaskAsync(LOCATION_TASK_NAME, {
    minimumInterval: 45, // seconds
    stopOnTerminate: false,
    startOnBoot: true,
  });
};
const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
