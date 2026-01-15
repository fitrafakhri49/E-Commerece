import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#020617",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: 14,
  },

  image: {
    width: 240,
    height: 240,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  noImage: {
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },

  noImageText: {
    color: "#64748b",
    fontSize: 14,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc",
    marginTop: 20,
    marginBottom: 6,
  },

  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#38bdf8",
    marginBottom: 6,
  },

  stock: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 16,
  },

  section: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: "#cbd5f5",
    lineHeight: 20,
  },
});
