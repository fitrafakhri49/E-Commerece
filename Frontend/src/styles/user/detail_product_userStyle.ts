import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
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
  },

  image: {
    width,
    height: width,
    resizeMode: "cover",
  },

  noImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
  },

  noImageText: {
    color: "#64748b",
  },

  content: {
    padding: 20,
  },

  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#e5e7eb",
    marginBottom: 8,
  },

  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#38bdf8",
    marginBottom: 4,
  },

  stock: {
    color: "#94a3b8",
    marginBottom: 20,
  },

  section: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 6,
  },

  description: {
    color: "#cbd5f5",
    lineHeight: 22,
    marginBottom: 24,
  },

  button: {
    backgroundColor: "#38bdf8",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#020617",
  },

  outOfStock: {
    backgroundColor: "#1e293b",
  },

  outOfStockText: {
    color: "#94a3b8",
    fontWeight: "600",
  },
});
