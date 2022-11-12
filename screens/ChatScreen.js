import React, { useEffect } from "react";
import { Button, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ChatScreen() {
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
  }, []);
  const logout = () => signOut(auth);
  return <View></View>;
}
