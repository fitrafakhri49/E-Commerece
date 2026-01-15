//cart.tsx
import { api } from "@/src/services/api";
import { cartStyles } from "@/src/styles/user/cartStyle";
import { Cart } from "@/src/types/cart";
import * as Linking from "expo-linking";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await api.get("/user/cart");
      setCart(res.data);
    } catch (error) {
      console.log("Fetch cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCart();
    setRefreshing(false);
  };

  const handleCheckout = async () => {
    try {
      setIsRedirecting(true);

      const res = await api.post("/user/checkout");
      const { redirect_url } = res.data;

      if (!redirect_url) {
        Alert.alert("Error", "Gagal mendapatkan link pembayaran");
        setIsRedirecting(false);
        return;
      }

      // Kosongkan cart di frontend sesuai backend
      setCart(null);

      await Linking.openURL(redirect_url);
      setIsRedirecting(false);
    } catch (error: any) {
      Alert.alert(
        "Checkout Gagal",
        error.response?.data?.message || "Terjadi kesalahan"
      );
      setIsRedirecting(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  const updateQtyOptimistic = async (
    productId: string,
    action: "increase" | "decrease"
  ) => {
    if (!cart) return;

    const prevCart = cart;

    const updatedItems = cart.items
      .map((item) => {
        if (item.productId !== productId) return item;

        const newQty =
          action === "increase" ? item.quantity + 1 : item.quantity - 1;

        return { ...item, quantity: newQty };
      })
      .filter((item) => item.quantity > 0);

    setCart({ ...cart, items: updatedItems });

    try {
      await api.patch(`/user/cart/${productId}`, { action });
    } catch (err) {
      console.log("Update cart error:", err);
      setCart(prevCart);
    }
  };

  if (loading) {
    return (
      <View style={cartStyles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <View style={cartStyles.container}>
        <Text style={cartStyles.title}>Cart</Text>
        <Text style={cartStyles.emptyText}>Keranjang kosong</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={cartStyles.container}>
      <Text style={cartStyles.title}>Cart</Text>

      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => {
          const product = item.product;
          const image = product.images[0]?.url;

          return (
            <View style={cartStyles.card}>
              {image && (
                <Image source={{ uri: image }} style={cartStyles.image} />
              )}

              <View style={cartStyles.info}>
                <Text style={cartStyles.name}>{product.name}</Text>
                <Text style={cartStyles.price}>
                  Rp {product.price.toLocaleString("id-ID")}
                </Text>
                <Text style={cartStyles.quantity}>Qty: {item.quantity}</Text>

                <View style={cartStyles.actions}>
                  <TouchableOpacity
                    style={cartStyles.qtyButton}
                    onPress={() =>
                      updateQtyOptimistic(item.product.id, "decrease")
                    }
                  >
                    <Text style={cartStyles.qtyText}>−</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={cartStyles.qtyButton}
                    onPress={() =>
                      updateQtyOptimistic(item.product.id, "increase")
                    }
                  >
                    <Text style={cartStyles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />

      <View style={cartStyles.checkoutContainer}>
        <View style={cartStyles.totalRow}>
          <Text style={cartStyles.totalLabel}>Total</Text>
          <Text style={cartStyles.totalText}>
            Rp{" "}
            {cart.items
              .reduce(
                (total, item) => total + item.product.price * item.quantity,
                0
              )
              .toLocaleString("id-ID")}
          </Text>
        </View>

        <TouchableOpacity
          style={[cartStyles.checkoutButton, isRedirecting && { opacity: 0.7 }]}
          onPress={handleCheckout}
          disabled={isRedirecting}
        >
          {isRedirecting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={cartStyles.checkoutText}>Checkout Album</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
