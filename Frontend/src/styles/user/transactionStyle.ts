import { StyleSheet } from "react-native";

export const transactionStyles = StyleSheet.create({
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

  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
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

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
  },

  emptyText: {
    color: "#94a3b8",
  },

  card: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  transactionDate: {
    color: "#94a3b8",
    fontSize: 12,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  success: {
    backgroundColor: "#22c55e33",
  },

  pending: {
    backgroundColor: "#facc1533",
  },

  statusText: {
    color: "#e5e7eb",
    fontSize: 12,
    fontWeight: "600",
  },

  total: {
    fontSize: 16,
    fontWeight: "600",
    color: "#38bdf8",
    marginBottom: 12,
  },

  productList: {
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    paddingTop: 12,
  },

  productRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    color: "#e5e7eb",
    fontWeight: "600",
  },

  productQty: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 2,
  },

  productPrice: {
    color: "#38bdf8",
    fontWeight: "600",
    marginTop: 4,
  },
});
