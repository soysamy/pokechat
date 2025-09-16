// src/screens/LoginScreen.tsx
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import type { RootStackParamList } from "../../App";

export const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // fake login just for the sake of the example project
    navigation.replace("Chat");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
      style={styles.container}
    >
      {/* Pokémon logo */}
      <Image
        source={{
          uri: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png",
        }}
        style={styles.logo}
      />

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Welcome Trainer!
          </Text>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Gotta Catch 'em All
          </Button>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    padding: 16,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 10,
  },
  card: {
    width: "100%",
    borderRadius: 16,
    elevation: 4,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    color: "#FF1C1C",
    fontWeight: "bold",
  },
  input: {
    marginBottom: 12,
    width: "100%",
  },
  button: {
    marginTop: 8,
    borderRadius: 50,
  },
});
