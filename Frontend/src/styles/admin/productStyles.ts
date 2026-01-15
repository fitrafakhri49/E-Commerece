import { StyleSheet } from "react-native";

export const productStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  loading: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  image: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#020617",
  },

  noImage: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e5e7eb",
    marginBottom: 4,
  },

  price: {
    fontSize: 14,
    color: "#38bdf8",
    fontWeight: "600",
    marginBottom: 2,
  },

  stock: {
    fontSize: 12,
    color: "#94a3b8",
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 8,
  },

  actionBtn: {
    flex: 1,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    gap: 4,
  },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#38bdf8",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#38bdf8",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  productCard: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 8,
    flex: 1, // supaya menyesuaikan lebar kolom
    marginBottom: 16,
    alignItems: "center",
    marginHorizontal: 4, // jarak antar kolom
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  productImage: {
    width: "100%",
    height: 100, // lebih proporsional
    borderRadius: 10,
    marginBottom: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e5e7eb",
    textAlign: "center",
  },
  
  productPrice: {
    fontSize: 13,
    fontWeight: "500",
    color: "#38bdf8",
    marginTop: 4,
  },
  
  productStock: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  
  

});
