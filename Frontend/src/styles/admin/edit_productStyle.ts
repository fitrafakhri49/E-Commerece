import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#020617",
  },

  loading: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e5e7eb",
    textAlign: "center",
    marginBottom: 24,
  },

  label: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 6,
    marginTop: 14,
  },

  input: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#e5e7eb",
    fontSize: 14,
  },

  imagePicker: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    justifyContent: "center",
    marginTop: 8,
  },

  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  button: {
    backgroundColor: "#38bdf8",
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#020617",
    fontSize: 15,
    fontWeight: "700",
  },
  imagePlaceholder: {
    color: "#94a3b8", // abu-abu terang (terlihat di dark)
    fontSize: 14,
    textAlign: "center",
  },
  
});
