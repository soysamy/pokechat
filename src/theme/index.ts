import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FF1C1C", // Poké Red
    secondary: "#FFD700", // Poké Yellow
    background: "#F2F2F2",
    surface: "#FFFFFF",
    text: "#333333",
  },
};
