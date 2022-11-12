import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GiftedChat } from "react-native-gifted-chat";

const demoMessage = {
  _id: 1,
  text: "Hello there!",
  createdAt: new Date(),
  user: {
    _id: 2,
    name: "Demo person",
    avatar: "https://placeimg.com/140/140/any",
  },
};

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    // if logged in, user is true-thy
    // of not logging in, user is false-y
    onAuthStateChanged(auth, (user) => {
      if (user) navigation.navigate("Chat", { id: user.id, email: user.email });
      else navigation.navigate("Login");
    });

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout}>
          <MaterialCommunityIcons name="logout" size={30} color="grey" />
        </TouchableOpacity>
      ),
    });

    setMessages([demoMessage]);
  }, []);

  const logout = () => signOut(auth);

  function sendMessages(newMessages) {
    console.log(newMessages);
    setMessages([...messages, ...newMessages]);
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={sendMessages}
      listViewProps={{ style: { backgroundColor: "grey" } }}
      user={{ _id: 1 }}
    />
  );
}
