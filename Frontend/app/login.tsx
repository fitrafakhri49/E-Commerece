import { api } from "@/src/services/api";
import { loginStyles } from "@/src/styles/loginStyle";
import { getUserRole, saveSession } from "@/src/utils/authToken";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", { email, password });

      const accessToken = res.data.session.access_token;
      const refreshToken = res.data.session.refresh_token;

      // tampilkan token
      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);

      await saveSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      const role = await getUserRole();
      if (role === "ADMIN") {
        router.replace("/");
      } else {
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      Alert.alert(
        "Login gagal",
        err.response?.data?.error || "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={loginStyles.container}>
      {/* LOGO */}
      <Image
        source={require("@/assets/images/splash-gambar.png")}
        style={loginStyles.logo} // tambahkan style di loginStyles
        resizeMode="contain"
      />

      <Text style={loginStyles.title}>Welcome Back</Text>
      <Text style={loginStyles.subtitle}>Login to your account</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#9ca3af"
        selectionColor="#6366f1"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={loginStyles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#9ca3af"
        selectionColor="#6366f1"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={loginStyles.input}
      />

      <TouchableOpacity
        style={[loginStyles.button, loading && loginStyles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={loginStyles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={loginStyles.linkText}>
          Don't have an account? Register here
        </Text>
      </TouchableOpacity>
    </View>
  );
}
