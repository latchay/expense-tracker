import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
const API_URL = "https://expense-tracker-1-wucy.onrender.com";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      router.replace("/login");
    } catch {
      setError("Server not reachable");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 26, textAlign: "center", marginBottom: 30 },
  input: { borderWidth: 1, padding: 12, marginBottom: 15, borderRadius: 6 },
  button: { backgroundColor: "#16a34a", padding: 14, borderRadius: 6 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
});
