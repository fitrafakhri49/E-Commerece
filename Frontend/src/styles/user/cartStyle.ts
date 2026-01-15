import { StyleSheet } from "react-native";

export const cartStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0f172a", // dark vinyl
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#e5e7eb",
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 4,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#94a3b8",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#020617",
  },

  info: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
  },

  price: {
    marginTop: 6,
    color: "#38bdf8",
    fontWeight: "600",
  },

  quantity: {
    marginTop: 6,
    color: "#cbd5f5",
    fontSize: 13,
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
  },

  qtyButton: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 10,
    borderRadius: 8,
  },

  checkoutContainer: {
    borderTopWidth: 1,
    borderColor: "#1e293b",
    paddingTop: 16,
    marginTop: 10,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  totalLabel: {
    fontSize: 14,
    color: "#94a3b8",
  },

  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e5e7eb",
  },

  checkoutButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  qtyText: {
    color: "#e5e7eb",
    fontSize: 18,
    fontWeight: "bold",
  },
  
});
