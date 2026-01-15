import { api } from "@/src/services/api";
import { styles } from "@/src/styles/user/detail_product_userStyle";
import { Product } from "@/src/types/product";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
//Nambah Deskripsi Buat git pull
export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/user/products/${id}`);
      const data = res.data;

      // pastikan trackList berupa array
      if (data.trackList && typeof data.trackList === "string") {
        try {
          data.trackList = JSON.parse(data.trackList);
        } catch (err) {
          console.warn("Gagal parse trackList:", err);
          data.trackList = [];
        }
      }

      setProduct(data);
    } catch (err) {
      console.error("Error fetching product detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAdding(true);
      await api.post("/user/cart", {
        productId: product.id,
        quantity: 1,
      });

      Alert.alert("Success", "Album berhasil ditambahkan ke cart");
    } catch (err: any) {
      if (err.response?.status === 400) {
        Alert.alert("Info", err.response.data.message);
      } else {
        Alert.alert("Error", "Gagal menambahkan ke cart");
      }
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Album tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE SLIDER */}
        {product.images.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {product.images.map((img) => (
              <Image
                key={img.id}
                source={{ uri: img.url }}
                style={styles.image}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Text style={styles.noImageText}>No Cover</Text>
          </View>
        )}

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>
            Rp {product.price.toLocaleString("id-ID")}
          </Text>
          <Text style={styles.stock}>
            {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
          </Text>

          {/* Artist & Release Year */}
          {(product.artist || product.releaseYear) && (
            <View style={{ marginVertical: 8 }}>
              {product.artist && (
                <Text style={styles.section}>Artist: {product.artist}</Text>
              )}
              {product.releaseYear && (
                <Text style={styles.section}>
                  Release Year: {product.releaseYear}
                </Text>
              )}
            </View>
          )}

          {/* Tracklist */}
          {product.trackList && product.trackList.length > 0 && (
            <View style={{ marginVertical: 8 }}>
              <Text style={styles.section}>Tracklist:</Text>
              {product.trackList.map((track: string, index: number) => (
                <Text key={index} style={styles.description}>
                  {index + 1}. {track}
                </Text>
              ))}
            </View>
          )}

          {/* Description */}
          {product.description && (
            <>
              <Text style={styles.section}>About This Album</Text>
              <Text style={styles.description}>{product.description}</Text>
            </>
          )}

          {/* BUTTON */}
          {product.stock === 0 ? (
            <View style={[styles.button, styles.outOfStock]}>
              <Text style={styles.outOfStockText}>Album Sold Out</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, adding && { opacity: 0.6 }]}
              disabled={adding}
              onPress={handleAddToCart}
            >
              {adding ? (
                <ActivityIndicator color="#020617" />
              ) : (
                <Text style={styles.buttonText}>Add to Cart</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
