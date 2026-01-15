import { profileStyles } from "@/src/styles/user/profileStyle";
import {
  clearSession,
  getAccessToken,
  getUserFromSession,
} from "@/src/utils/authToken";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAccessToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      const sessionUser = await getUserFromSession();
      setUser(sessionUser);
      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await clearSession();
    router.replace("/login");
  };

  if (checkingAuth || !user) return null;

  return (
    <SafeAreaView style={profileStyles.safe}>
      {/* HEADER */}
      <View style={profileStyles.header}>
        <Text style={profileStyles.title}>Profile</Text>
        <Text style={profileStyles.subtitle}>Your Soundscapes Account</Text>
      </View>

      {/* PROFILE CARD */}
      <View style={profileStyles.card}>
        <View style={profileStyles.row}>
          <Text style={profileStyles.label}>Name</Text>
          <Text style={profileStyles.value}>
            {user.name || user.full_name || "-"}
          </Text>
        </View>

        <View style={profileStyles.row}>
          <Text style={profileStyles.label}>Email</Text>
          <Text style={profileStyles.value}>{user.email}</Text>
        </View>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={profileStyles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={profileStyles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
