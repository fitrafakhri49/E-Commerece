import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeJWT } from "./jwt";

const TOKEN_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export async function saveSession(session: {
  access_token: string;
  refresh_token: string;
}) {
  await AsyncStorage.setItem(TOKEN_KEY, session.access_token);
  await AsyncStorage.setItem(REFRESH_KEY, session.refresh_token);
}

export async function getAccessToken() {
  return await AsyncStorage.getItem(TOKEN_KEY);
}
export async function getUserFromSession() {
  const token = await getAccessToken();
  if (!token) return null;

  const decoded = decodeJWT(token);

  return {
    id: decoded?.sub,
    email: decoded?.email,
    name:
      decoded?.user_metadata?.name ||
      decoded?.user_metadata?.full_name ||
      "-",
    role: decoded?.app_metadata?.role ?? "USER",
  };
}
export async function getUserRole() {
  const token = await getAccessToken();
  if (!token) return null;

  const decoded = decodeJWT(token);
  return decoded?.app_metadata?.role ?? "USER";
}

export async function clearSession() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_KEY);
}
