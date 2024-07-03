import { Tabs } from 'expo-router';
import {AntDesign, Entypo, FontAwesome, FontAwesome6} from "@expo/vector-icons";
import {useUser} from "@/context/UserContext";
import {useEffect} from "react";

export default function TabLayout() {
  const {user} = useUser();
  useEffect(() => {
    console.log(user)
  }, []);
  return (
    <Tabs screenOptions={{headerShown: false, tabBarActiveBackgroundColor: '#EA580C', tabBarInactiveBackgroundColor: '#292524'}}>
      <Tabs.Screen name="(home)/index" options={{href: null}}/>
      <Tabs.Screen name="(home)/details" options={user.name != '' ? {title: 'Chats', tabBarIcon: ({color}) =><Entypo name="message" size={26} color={color} />} : {href: null}} />
      <Tabs.Screen name="settings" options={user.name != '' ? {title: 'Settings', tabBarIcon: ({color}) => <FontAwesome size={26} name={'cog'} color={color}/>} : {href: null}}/>
    </Tabs>
  );
}
