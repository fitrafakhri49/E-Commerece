import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1020",
    justifyContent: "flex-start", // mulai dari atas
    paddingHorizontal: 24,
    paddingTop: 20, // dikurangi agar lebih ke atas
  },

  logo: {
    width: 220,      
    height: 220,
    marginTop: 10, // beri sedikit jarak dari atas
    marginBottom: 12, // jarak ke judul
    alignSelf: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#e5e7eb",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.5,
  },

  subtitle: {
    fontSize: 15,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 24, // jarak ke input
  },

  input: {
    backgroundColor: "#111827",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#e5e7eb",
    marginBottom: 14, 
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 18,
    shadowColor: "#6366f1",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.4,
  },

  linkText: {
    color: "#8b5cf6",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});
