import {View, Text} from "react-native";
import {useEffect, useState} from "react";
import {useUser} from "@/context/UserContext";

export default function Details() {
  const [response, setResponse] = useState([]);
  const {fetchEmployeeTasksToday} = useUser();
useEffect(() => {
    fetchEmployeeTasksToday().then((res) => {
      console.log(res)
      setResponse(res);
    });
  }, []);
  return (
    <View>
      {
        response && response.map((user) => <Text key={user.id}>{user.name}</Text>)
      }
    </View>
  );
}