// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, View, TextInput, Text, FlatList, TouchableOpacity } from 'react-native';
import { FAB } from 'react-native-paper';

// Screens
const CodeEntryScreen = ({ navigation }) => {
  const [code, setCode] = useState('');

  const saveCode = async () => {
    try {
      await AsyncStorage.setItem('userCode', code);
      navigation.replace('Main');
    } catch (e) {
      // saving error
    }
  };

  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextInput placeholder="Enter Code" value={code} onChangeText={setCode} />
        <Button title="Submit" onPress={saveCode} />
      </View>
  );
};

const ChatScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Chat Screen</Text>
    </View>
);

const TaskDetailsScreen = ({ route }) => {
  const { task } = route.params;
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Task Details Screen</Text>
        <Text>{task.title}</Text>
        <Text>{task.details}</Text>
      </View>
  );
};

const TasksScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Task 1', details: 'Details of Task 1' },
    { id: '2', title: 'Task 2', details: 'Details of Task 2' },
    // Add more tasks
  ]);

  return (
      <View style={{ flex: 1 }}>
        <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('TaskDetails', { task: item })}>
                  <View style={{ padding: 20, borderBottomWidth: 1 }}>
                    <Text>{item.title}</Text>
                  </View>
                </TouchableOpacity>
            )}
        />
        <FAB style={{ position: 'absolute', right: 16, bottom: 16 }} icon="plus" onPress={() => {}} />
      </View>
  );
};

// Navigation Setup
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
    <Tab.Navigator>
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
    </Tab.Navigator>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCode, setHasCode] = useState(false);

  useEffect(() => {
    const checkCode = async () => {
      const userCode = await AsyncStorage.getItem('userCode');
      if (userCode) {
        setHasCode(true);
      }
      setIsLoading(false);
    };
    checkCode();
  }, []);

  if (isLoading) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
      <NavigationContainer>
        <Stack.Navigator>
          {hasCode ? (
              <>
                <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
              </>
          ) : (
              <Stack.Screen name="CodeEntry" component={CodeEntryScreen} options={{ headerShown: false }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;