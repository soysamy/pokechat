// components/organisms/ChatWindow.tsx
import React from "react";
import { FlatList, View } from "react-native";
import { useChatStore } from "../../features/chat/store/pokeChatStore";
import { ChatBubble } from "../molecules/ChatBubble";

export const ChatWindow = () => {
  const messages = useChatStore((s) => s.messages);
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <ChatBubble text={item.text} role={item.role} />
        )}
      />
    </View>
  );
};
