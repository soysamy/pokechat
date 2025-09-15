// screens/ChatScreen.tsx
import React, { useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import "react-native-get-random-values";
import { streamAnthropicResponse as streamMessage } from "../features/chat/services/anthropic";

export const ChatScreen = () => {
  //const addMessage = useChatStore((s) => s.addMessage);
  //const updateMessage = useChatStore((s) => s.updateMessage);
  const [text, setText] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, "You: " + input]);
    setAiReply("");
    const userMsg = input;
    setInput("");

    await streamMessage(
      userMsg,
      (chunk) => setAiReply((prev) => prev + chunk),
      () => setMessages((prev) => [...prev, "Claude: " + aiReply]),
      (err) => console.error("Streaming error:", err)
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* ChatWindow organism */}
      <View style={{ flex: 1 }}>
        {/* place ChatWindow component here in your app */}
      </View>
      <ScrollView style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <Text key={idx} style={styles.message}>
            {msg}
          </Text>
        ))}
        {aiReply ? <Text style={styles.message}>Claude: {aiReply}</Text> : null}
      </ScrollView>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          placeholder="Type a message"
          value={text}
          onChangeText={setText}
          style={{ flex: 1, borderWidth: 1, padding: 8 }}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  chatBox: { flex: 1, marginBottom: 10 },
  message: { marginVertical: 4 },
  input: { marginBottom: 8 },
});
