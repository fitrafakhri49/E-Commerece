import { StyleSheet } from "react-native";

export const add_productStyles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#020617", // dark background
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc",
    textAlign: "center",
    marginBottom: 24,
  },

  label: {
    color: "#94a3b8",
    fontSize: 13,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 10,
    padding: 12,
    color: "#f8fafc",
    marginBottom: 16,
  },

  imagePicker: {
    borderWidth: 1,
    borderColor: "#334155",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  imagePlaceholder: {
    color: "#94a3b8",
    fontSize: 14,
  },

  previewContainer: {
    marginBottom: 16,
  },

  previewImage: {
    width: 96,
    height: 96,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
