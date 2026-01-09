import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "http://localhost:5000/api";

export default function AddExpense() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const saveExpense = async () => {
    const token = await AsyncStorage.getItem("token");

    await fetch(`${API}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, category }),
    });

    router.replace("/dashboard");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>

      <TextInput placeholder="Amount" onChangeText={setAmount} style={styles.input} />
      <TextInput placeholder="Category" onChangeText={setCategory} style={styles.input} />

      <Button title="Save" onPress={saveExpense} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
});
