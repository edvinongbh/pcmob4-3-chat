import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GiftedChat } from "react-native-gifted-chat";
import { addDoc, collection, onSnapshot } from "firebase/firestore";

const messageCollection = collection(db, "messages");

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onSnapshot(messageCollection, (collectionSnapshot) => {
      const messages = collectionSnapshot.docs.map((doc) => {
        const date = doc.data().createdAt.toDate();
        const newDoc = { ...doc.data(), createdAt: date };
        return newDoc;
      });
      setMessages(messages);
    });

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

    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  function sendMessages(newMessages) {
    console.log(newMessages);
    addDoc(messageCollection, newMessages[0]);
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={sendMessages}
      listViewProps={{ style: { backgroundColor: "grey" } }}
      user={{ _id: auth.currentUser?.uid, name: auth.currentUser?.email }}
    />
  );
}
