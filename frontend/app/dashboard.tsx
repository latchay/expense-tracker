import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
const API_URL = "https://expense-tracker-1-wucy.onrender.com";

export default function Dashboard() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  // 🔐 Load expenses
  const loadExpenses = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const res = await fetch(`${API_URL}/api/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setExpenses(data);
  };

  // ➕ Add expense
  const addExpense = async () => {
    if (!amount || !category) return;

    const token = await AsyncStorage.getItem("token");

    await fetch(`${API_URL}/api/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount,
        category,
      }),
    });

    setAmount("");
    setCategory("");
    loadExpenses();
  };

  // ❌ Delete expense
  const deleteExpense = async (id: string) => {
    const token = await AsyncStorage.getItem("token");

    await fetch(`${API_URL}/api/expenses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.heading}>Dashboard</Text>
      <Text style={styles.sub}>Track your spending smartly 💡</Text>

      {/* TOTAL CARD */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Expense</Text>
        <Text style={styles.totalValue}>₹ {total}</Text>
      </View>

      {/* ADD EXPENSE CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add Expense</Text>

        <TextInput
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Category (Food, Travel...)"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />

        <Pressable style={styles.addBtn} onPress={addExpense}>
          <Text style={styles.addText}>ADD EXPENSE</Text>
        </Pressable>
      </View>

      {/* EXPENSE LIST */}
      <Text style={styles.listTitle}>Your Expenses</Text>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No expenses added yet</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.expenseRow}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
  },

  sub: {
    color: "#64748b",
    marginBottom: 20,
  },

  totalCard: {
    backgroundColor: "#2563eb",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },

  totalLabel: {
    color: "#dbeafe",
    fontSize: 16,
  },

  totalValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  addBtn: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 8,
  },

  addText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  listTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },

  expenseRow: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
  },

  expenseCategory: {
    fontSize: 16,
    fontWeight: "500",
  },

  expenseAmount: {
    color: "#475569",
  },

  delete: {
    color: "#dc2626",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 20,
  },

  logoutBtn: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#0f172a",
  },

  logoutText: {
    color: "#fff",
    textAlign: "center",
  },
});
