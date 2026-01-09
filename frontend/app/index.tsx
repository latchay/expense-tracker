import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.container}>
      <Text style={styles.title}>Expense Tracker</Text>
      <Text style={styles.subtitle}>Track your money. Control your life.</Text>

      <View style={styles.buttonBox}>
        <Pressable style={styles.loginBtn} onPress={() => router.push("/login")}>
          <Text style={styles.loginText}>Login</Text>
        </Pressable>

        <Pressable
          style={styles.registerBtn}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.registerText}>Register</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#eef",
    marginVertical: 10,
  },
  buttonBox: {
    marginTop: 40,
    width: "70%",
  },
  loginBtn: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  loginText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#000",
  },
  registerBtn: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
  },
  registerText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff", // ✅ FIXED
  },
});
