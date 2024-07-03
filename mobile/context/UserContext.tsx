import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext(null);
type User = {
  name: string;
  email: string;
  id: string;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState<User>({ name: '', email: '', id: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token found');
        return;
      }

      try {
        const response = await fetch(`http://192.168.0.150:3001/api/users/employee-login`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });
        const data = await response.json();
        console.log(token);

        if (response.ok) {
          console.log('User data fetched successfully:', data);
          setUser({ name: data.name, email: data.email, id: data.id });
        } else {
          throw new Error(data.message || 'Unable to fetch user data');
        }
      } catch (error) {
        console.error('Fetching user data failed:', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchEmployeeTasksToday = async () => {
    if (!user.id) {
      console.log('User ID is missing');
      return;
    }
    const getToday = (new Date()).toISOString().split('T')[0]; // Formats to YYYY-MM-DD
    const getTomorrowDate = (new Date()) // Formats to YYYY-MM-DD

    getTomorrowDate.setDate(getTomorrowDate.getDate() + 1);

    try {
      const response = await fetch(`http://192.168.0.150:3001/api/taskinstance/assigned-to-user-dates/${user.id}?startDate=${getToday}&endDate=${getTomorrowDate.toISOString().split('T')[0]}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const tasks = await response.json();
      if (response.ok) {
        console.log('Tasks fetched successfully:', tasks);
        return tasks;
      } else {
        throw new Error(tasks.message || 'Unable to fetch tasks');
      }
    } catch (error) {
      console.error('Fetching tasks failed:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, fetchEmployeeTasksToday }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
