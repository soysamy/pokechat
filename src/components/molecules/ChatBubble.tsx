// components/molecules/ChatBubble.tsx
import React from "react";
import { Image, View } from "react-native";
import { Text } from "../atoms/Text";
import styles from "../molecules/style";

export const ChatBubble = ({
  text,
  role,
  image,
}: {
  text: string;
  role: "user" | "ai";
  image?: string;
}) => {
  console.log("Rendering ChatBubble with image:", image);
  return (
    <View
      style={[
        styles.chatBubble,
        {
          alignSelf: role === "user" ? "flex-end" : "flex-start",
          backgroundColor: role === "user" ? "#0B84FF" : "#E5E5EA",
        },
      ]}
    >
      <Text>{text}</Text>
      {image && (
        <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
      )}
    </View>
  );
};
