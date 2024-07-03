import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import * as Location from 'expo-location';
import {LocationObject} from "expo-location";

const SOCKET_SERVER_URL = 'https://www.workbee.dev';

// Custom hook for location tracking
export const useLocationTracking = () => {
  const socketRef = useRef<Socket | null>(null);
  const [location, setLocation] = useState<LocationObject | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_SERVER_URL);

    // Request location permissions and start location updates
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      // Start sending location every 2 seconds (change interval as needed)
      const intervalId = setInterval(async () => {
        try {
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);

          if (socketRef.current) {
            socketRef.current.emit('send_location', {
              deviceId: 'blabla',
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }
        } catch (error) {
          console.error('Error getting location:', error);
        }
      }, 2000);

      return () => clearInterval(intervalId);
    })();


    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);
};
