// indexStyle.ts
import { StyleSheet } from "react-native";

export const indexStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617", // dark background
    paddingHorizontal: 16,
    paddingTop: 48,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#e5e7eb", // PUTIH
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 4,
  },

  /* SORTING */
  sortContainer: {
    marginBottom: 16,
  },

  sortLabel: {
    color: "#e5e7eb", // ⭐ FIX: teks terlihat
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
  },

  pickerWrapper: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 10,
    overflow: "hidden",
  },

  /* PRODUCT CARD */
  productCard: {
    backgroundColor: "#020617",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
    overflow: "hidden",
  },

  productImage: {
    width: "100%",
    height: 200,
  },

  noImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
  },

  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
    marginHorizontal: 12,
    marginTop: 10,
  },

  productPrice: {
    fontSize: 14,
    color: "#38bdf8",
    marginHorizontal: 12,
    marginTop: 4,
  },

  productStock: {
    fontSize: 12,
    color: "#94a3b8",
    marginHorizontal: 12,
    marginBottom: 12,
    marginTop: 2,
  },
  searchContainer: {
    marginBottom: 16,
  },
  
  searchInput: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#e5e7eb",
    fontSize: 14,
  },
  
});
