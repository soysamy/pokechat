// screens/ChatScreen.tsx
import React, { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
} from "react-native";
import "react-native-get-random-values";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatWindow } from "../components/organisms/ChatWindow";
import { useChatStore } from "../features/chat/store/pokeChatStore";

export const ChatScreen = () => {
  const [input, setInput] = useState("");
  const { loading, sendPrompt } = useChatStore();

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <View style={{ flex: 1 }}>
        <ChatWindow />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
        style={{ flexDirection: "row", gap: 8 }}
      >
        <TextInput
          placeholder="Type a message"
          value={input}
          onChangeText={setInput}
          placeholderTextColor={"#888"}
          style={{ flex: 1, borderWidth: 1, padding: 8, borderRadius: 8 }}
        />
        <Button
          title="Send"
          onPress={() => {
            if (!input.trim()) return;
            sendPrompt(input);
            setInput("");
          }}
          disabled={loading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
