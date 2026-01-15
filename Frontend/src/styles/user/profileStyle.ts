import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#e5e7eb",
  },

  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },

  row: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    color: "#e5e7eb",
    fontWeight: "600",
  },

  logoutButton: {
    marginTop: 32,
    marginHorizontal: 16,
    backgroundColor: "#dc2626",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
