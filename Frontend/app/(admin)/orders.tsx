import { api } from "@/src/services/api";
import { styles } from "@/src/styles/admin/orderStyle";
import { Transaction } from "@/src/types/adminTransaction";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdminTransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/admin/transactions");
      setTransactions(res.data);
    } catch {
      Alert.alert("Error", "Gagal mengambil data transaksi");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setIsProcessing(id);
      await api.patch(`/admin/transactions/${id}/approve`);
      Alert.alert("Sukses", "Transaksi berhasil di-ACC");
      fetchTransactions();
    } catch (error: any) {
      Alert.alert(
        "Gagal ACC",
        error.response?.data?.message || "Terjadi kesalahan"
      );
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setIsProcessing(id);
      await api.patch(`/admin/transactions/${id}/reject`);
      Alert.alert("Sukses", "Transaksi berhasil ditolak");
      fetchTransactions();
    } catch {
      Alert.alert("Error", "Gagal menolak transaksi");
    } finally {
      setIsProcessing(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Belum ada transaksi</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchTransactions();
          }}
        />
      }
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {/* HEADER */}
          <Text style={styles.email}>{item.user.email}</Text>
          <Text style={styles.status}>Status: {item.status}</Text>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleString("id-ID")}
          </Text>

          {/* PRODUK */}
          <View style={styles.itemList}>
            {item.items.map((it) => (
              <Text key={it.id} style={styles.itemText}>
                • {it.product.name} x {it.quantity}
              </Text>
            ))}
          </View>

          {/* TOTAL */}
          <Text style={styles.total}>
            Total: Rp {item.grossAmount.toLocaleString("id-ID")}
          </Text>

          {/* ACTION */}
          {item.status === "PENDING" && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.approve,
                  isProcessing === item.id && styles.disabled,
                ]}
                onPress={() => handleApprove(item.id)}
                disabled={isProcessing === item.id}
              >
                <Text style={styles.buttonText}>
                  {isProcessing === item.id ? "Processing..." : "ACC"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.reject,
                  isProcessing === item.id && styles.disabled,
                ]}
                onPress={() => handleReject(item.id)}
                disabled={isProcessing === item.id}
              >
                <Text style={styles.buttonText}>
                  {isProcessing === item.id ? "Processing..." : "Tolak"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    />
  );
}
