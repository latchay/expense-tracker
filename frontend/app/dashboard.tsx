import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

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

  const total = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <Text style={styles.heading}>Expense Tracker</Text>
      <Text style={styles.quote}>
        “Don’t save what is left after spending, spend what is left after saving.”
      </Text>

      {/* TOTAL EXPENSE CARD */}
      <LinearGradient
        colors={["#6366f1", "#4f46e5"]}
        style={styles.totalCard}
      >
        <Text style={styles.cardLabel}>Total Expense</Text>
        <Text style={styles.totalAmount}>₹ {total}</Text>
      </LinearGradient>

      {/* ADD EXPENSE CARD */}
      <LinearGradient
        colors={["#16a34a", "#22c55e"]}
        style={styles.addCard}
      >
        <Text style={styles.cardLabel}>Add New Expense</Text>

        <TextInput
          placeholder="Amount"
          placeholderTextColor="#dcfce7"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
        />

        <TextInput
          placeholder="Category (Food, Travel...)"
          placeholderTextColor="#dcfce7"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />

        <Pressable style={styles.addBtn} onPress={addExpense}>
          <Text style={styles.addText}>ADD EXPENSE</Text>
        </Pressable>
      </LinearGradient>

      {/* EXPENSE LIST */}
      <Text style={styles.sectionTitle}>Your Expenses</Text>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.empty}>No expenses added yet</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.expenseCard}>
            <View>
              <Text style={styles.expenseCategory}>{item.category}</Text>
              <Text style={styles.expenseAmount}>₹ {item.amount}</Text>
            </View>

            <Pressable onPress={() => deleteExpense(item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </Pressable>
          </View>
        )}
      />

      {/* LOGOUT */}
      <Pressable
        style={styles.logoutBtn}
        onPress={async () => {
          await AsyncStorage.removeItem("token");
          router.replace("/login");
        }}
      >
        <Text style={styles.logoutText}>LOGOUT</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
  },

  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 6,
  },

  quote: {
    color: "#475569",
    marginBottom: 20,
    fontStyle: "italic",
  },

  totalCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },

  addCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
  },

  cardLabel: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },

  totalAmount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    marginBottom: 10,
  },

  addBtn: {
    backgroundColor: "#14532d",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
  },

  addText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },

  expenseCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 3,
  },

  expenseCategory: {
    fontSize: 16,
    fontWeight: "600",
  },

  expenseAmount: {
    color: "#475569",
  },

  delete: {
    color: "#dc2626",
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    color: "#94a3b8",
    marginVertical: 20,
  },

  logoutBtn: {
    backgroundColor: "#020617",
    padding: 14,
    borderRadius: 12,
    marginVertical: 30,
  },

  logoutText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
