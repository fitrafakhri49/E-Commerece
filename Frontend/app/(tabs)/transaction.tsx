import { api } from "@/src/services/api";
import { transactionStyles } from "@/src/styles/user/transactionStyle";
import { UserTransaction } from "@/src/types/userTransaction";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionHistoryScreen() {
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/user/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.log("Fetch transactions error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  if (loading) {
    return (
      <View style={transactionStyles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View style={transactionStyles.emptyContainer}>
        <Text style={transactionStyles.emptyText}>
          Belum ada transaksi album
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={transactionStyles.safe}>
      <View style={transactionStyles.header}>
        <Text style={transactionStyles.title}>Transactions</Text>
        <Text style={transactionStyles.subtitle}>
          Your Soundscapes Purchase History
        </Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#38bdf8"
          />
        }
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={transactionStyles.card}>
            {/* HEADER TRANSAKSI */}
            <View style={transactionStyles.transactionHeader}>
              <Text style={transactionStyles.transactionDate}>
                {new Date(item.createdAt).toLocaleDateString("id-ID")}
              </Text>

              <View
                style={[
                  transactionStyles.statusBadge,
                  item.status === "SUCCESS"
                    ? transactionStyles.success
                    : transactionStyles.pending,
                ]}
              >
                <Text style={transactionStyles.statusText}>{item.status}</Text>
              </View>
            </View>

            <Text style={transactionStyles.total}>
              Total: Rp {item.grossAmount.toLocaleString("id-ID")}
            </Text>

            {/* PRODUK */}
            <View style={transactionStyles.productList}>
              {item.items.map((it) => {
                const image = it.product.images[0]?.url;

                return (
                  <View key={it.id} style={transactionStyles.productRow}>
                    {image && (
                      <Image
                        source={{ uri: image }}
                        style={transactionStyles.productImage}
                      />
                    )}

                    <View style={transactionStyles.productInfo}>
                      <Text style={transactionStyles.productName}>
                        {it.product.name}
                      </Text>

                      <Text style={transactionStyles.productQty}>
                        Qty: {it.quantity}
                      </Text>

                      <Text style={transactionStyles.productPrice}>
                        Rp {(it.price * it.quantity).toLocaleString("id-ID")}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
