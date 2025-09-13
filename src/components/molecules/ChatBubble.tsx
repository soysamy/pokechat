// components/molecules/ChatBubble.tsx
import React from "react";
import { View } from "react-native";
import { Text } from "../atoms/Text";

export const ChatBubble = ({
  text,
  role,
}: {
  text: string;
  role: "user" | "ai";
}) => {
  return (
    <View
      style={{
        alignSelf: role === "user" ? "flex-end" : "flex-start",
        backgroundColor: role === "user" ? "#0B84FF" : "#E5E5EA",
        padding: 12,
        borderRadius: 12,
        marginVertical: 6,
        maxWidth: "80%",
      }}
    >
      <Text>{text}</Text>
    </View>
  );
};
