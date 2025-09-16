import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  chatBubble: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    maxWidth: "80%",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#0B84FF",
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
});

export default styles;
