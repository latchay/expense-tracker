import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
const API_URL = "https://expense-tracker-1-wucy.onrender.com";

export default function Dashboard() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const loadExpenses = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return router.replace("/login");

    const res = await fetch(`${API_URL}/api/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setExpenses(data);
  };

  const addExpense = async () => {
    if (!amount || !category) return;

    const token = await AsyncStorage.getItem("token");

    await fetch(`${API_URL}/api/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, category }),
    });

    setAmount("");
    setCategory("");
    loadExpenses();
  };

  const deleteExpense = async (id: string) => {
    const token = await AsyncStorage.getItem("token");

    await fetch(`${API_URL}/api/expenses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadExpenses();
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.total}>Total Expense: ₹ {total}</Text>

      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <Pressable style={styles.addBtn} onPress={addExpense}>
        <Text style={styles.btnText}>Add Expense</Text>
      </Pressable>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.category} - ₹{item.amount}</Text>
            <Pressable onPress={() => deleteExpense(item.id)}>
              <Text style={{ color: "red" }}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, marginBottom: 10 },
  total: { fontSize: 18, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  addBtn: { backgroundColor: "#2563eb", padding: 12, marginBottom: 20 },
  btnText: { color: "#fff", textAlign: "center" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
});
