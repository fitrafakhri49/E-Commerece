import { api } from "@/src/services/api";
import { registerStyles } from "@/src/styles/registerStyle";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !fullName || !email || !password) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name,
        full_name: fullName,
        email,
        password,
      });

      Alert.alert("Registrasi berhasil", "Silakan login menggunakan akun kamu");

      router.replace("/login");
    } catch (err: any) {
      Alert.alert(
        "Registrasi gagal",
        err.response?.data?.error || "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={registerStyles.container}>
      <Image
        source={require("@/assets/images/splash-gambar.png")}
        style={registerStyles.logo} // gunakan style logo dari registerStyles
        resizeMode="contain"
      />

      <Text style={registerStyles.title}>Register</Text>

      <TextInput
        placeholder="Name"
        selectionColor="#6366f1"
        placeholderTextColor="#9ca3af"
        value={name}
        onChangeText={setName}
        style={registerStyles.input}
      />

      <TextInput
        selectionColor="#6366f1"
        placeholder="Full Name"
        placeholderTextColor="#9ca3af"
        value={fullName}
        onChangeText={setFullName}
        style={registerStyles.input}
      />

      <TextInput
        selectionColor="#6366f1"
        placeholder="Email"
        placeholderTextColor="#9ca3af"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={registerStyles.input}
      />

      <TextInput
        selectionColor="#6366f1"
        placeholder="Password"
        placeholderTextColor="#9ca3af"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={registerStyles.input}
      />

      <TouchableOpacity
        style={[
          registerStyles.button,
          loading && registerStyles.buttonDisabled,
        ]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={registerStyles.buttonText}>
          {loading ? "Loading..." : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={registerStyles.linkText}>Sudah punya akun? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
