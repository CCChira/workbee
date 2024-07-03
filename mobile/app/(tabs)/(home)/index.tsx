import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from "expo-router";
import _ from "lodash";

export default function Login() {

  const [token, setToken] = useState(false);

  useEffect(() => {
    checkToken();
  }, []);


  const checkToken = useCallback(_.debounce(async () => {
    const storedToken = await AsyncStorage.getItem('userToken');
    if (storedToken) {
      router.push('/details')
    }
  }, 1000), []);


  const validateToken = async () => {
    const response = await fetch('http://192.168.0.150:3001/api/users/employee-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
    const isValid = await response.json();
    if (isValid) {
      console.log(isValid);
      await AsyncStorage.setItem('userToken', token);
      router.push('/details')
    } else {
      alert("Invalid token");
    }
  };



  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setToken}
        value={token}
        placeholder="Enter your token"
        keyboardType="numeric"
        placeholderTextColor={'hsl(60 9.1% 97.8%)'}
      />
      <Button
        title="Login"
        onPress={validateToken}
        color={'#EA580C'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'hsl(20 14.3% 4.1%)',
  },
  input: {
    backgroundColor: 'hsl(12 6.5% 15.1%)',
    color: 'hsl(60 9.1% 97.8%)',
    height: 40,
    width: '80%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  loginBtn: {
    backgroundColor: 'hsl(20.5 90.2% 48.2%)',
    padding: 10,
    margin: 10,
  }
});