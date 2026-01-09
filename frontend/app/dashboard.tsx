import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const API_URL = "https://expense-tracker-1-wucy.onrender.com"; // ⚠️ CHANGE ONLY IF YOUR IP CHANGES

export default function Dashboard() {
  const router = useRouter();

  const [expenses, setExpenses] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const totalExpense = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  // 🔹 Load expenses
  const loadExpenses = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return router.replace("/login");

    const res = await fetch(`${API_URL}/api/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setExpenses(data);
  };

  // 🔹 Add expense
  const addExpense = async () => {
    if (!amount || !category) return;

    setLoading(true);
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
    setLoading(false);
    loadExpenses();
  };

  // 🔹 Delete expense
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

  // 🔹 Logout
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.heading}>Expense Tracker</Text>

      {/* TOTAL BOX */}
      <View style={styles.totalBox}>
        <Text style={styles.totalText}>Total Expense</Text>
        <Text style={styles.totalAmount}>₹ {totalExpense}</Text>
      </View>

      {/* ADD EXPENSE BOX */}
      <View style={styles.addBox}>
        <Text style={styles.sectionTitle}>Add Expense</Text>

        <TextInput
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
        />

        <TextInput
          placeholder="Category (food, travel, etc.)"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />

        <Pressable style={styles.addBtn} onPress={addExpense}>
          <Text style={styles.addBtnText}>
            {loading ? "Adding..." : "ADD EXPENSE"}
          </Text>
        </Pressable>
      </View>

      {/* EXPENSE LIST */}
      <Text style={styles.sectionTitle}>Your Expenses</Text>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No expenses yet. Start tracking 💸
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.expenseCard}>
            <View>
              <Text style={styles.expenseAmount}>₹ {item.amount}</Text>
              <Text style={styles.expenseCategory}>{item.category}</Text>
            </View>

            <Pressable onPress={() => deleteExpense(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />

      {/* LOGOUT */}
      <Pressable style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>LOGOUT</Text>
      </Pressable>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#38bdf8",
    textAlign: "center",
    marginBottom: 20,
  },

  totalBox: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  totalText: {
    color: "#94a3b8",
    fontSize: 14,
  },

  totalAmount: {
    color: "#22c55e",
    fontSize: 26,
    fontWeight: "bold",
  },

  addBox: {
    backgroundColor: "#020617",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },

  sectionTitle: {
    color: "#e5e7eb",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 12,
    color: "white",
    marginBottom: 10,
  },

  addBtn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  addBtnText: {
    color: "white",
    fontWeight: "bold",
  },

  expenseCard: {
    backgroundColor: "#1e293b",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  expenseAmount: {
    color: "white",
    fontSize: 16,
  },

  expenseCategory: {
    color: "#38bdf8",
    fontSize: 13,
  },

  deleteText: {
    color: "#ef4444",
    fontWeight: "bold",
  },

  emptyText: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 20,
  },

  logoutBtn: {
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});
