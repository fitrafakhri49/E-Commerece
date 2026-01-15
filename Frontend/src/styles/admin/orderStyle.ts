import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#020617",
  },

  center: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: 14,
  },

  card: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  email: {
    color: "#e5e7eb",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },

  status: {
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },

  date: {
    color: "#64748b",
    fontSize: 11,
    marginBottom: 12,
  },

  itemList: {
    marginBottom: 10,
  },

  itemText: {
    color: "#cbd5f5",
    fontSize: 13,
    marginBottom: 2,
  },

  total: {
    color: "#e5e7eb",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  approve: {
    backgroundColor: "#38bdf8",
  },

  reject: {
    backgroundColor: "#ef4444",
  },

  disabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#020617",
    fontWeight: "700",
    fontSize: 13,
  },
});
