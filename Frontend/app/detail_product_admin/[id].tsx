import { api } from "@/src/services/api";
import { styles } from "@/src/styles/admin/detail_product_adminStyle";
import { Product } from "@/src/types/product";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";

export default function AdminProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/admin/products/${id}`);
      const data = res.data;

      // Pastikan trackList berupa array
      if (data.trackList) {
        if (typeof data.trackList === "string") {
          try {
            data.trackList = JSON.parse(data.trackList || "[]");
          } catch (err) {
            console.warn("Gagal parse trackList:", err);
            data.trackList = [];
          }
        } else if (!Array.isArray(data.trackList)) {
          data.trackList = [];
        }
      } else {
        data.trackList = [];
      }

      if (!Array.isArray(data.trackList)) {
        data.trackList = [];
      }

      setProduct(data);
    } catch (err) {
      console.error("Error fetching admin product detail:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Product tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Images */}
      {product.images?.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}

      {/* Product Info */}
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>Rp {product.price.toLocaleString()}</Text>
      <Text style={styles.stock}>Stock: {product.stock}</Text>

      {/* Artist */}
      {product.artist && (
        <>
          <Text style={styles.section}>Artist</Text>
          <Text style={styles.description}>{product.artist}</Text>
        </>
      )}

      {/* Release Year */}
      {product.releaseYear && (
        <>
          <Text style={styles.section}>Release Year</Text>
          <Text style={styles.description}>{product.releaseYear}</Text>
        </>
      )}

      {/* Tracklist */}
      {/* Tracklist */}
      {(product.trackList ?? []).length > 0 && (
        <>
          <Text style={styles.section}>Tracklist</Text>
          {(product.trackList ?? []).map((track: string, index: number) => (
            <Text key={index} style={styles.description}>
              {index + 1}. {track}
            </Text>
          ))}
        </>
      )}

      {/* Description */}
      {product.description && (
        <>
          <Text style={styles.section}>Deskripsi</Text>
          <Text style={styles.description}>{product.description}</Text>
        </>
      )}
    </ScrollView>
  );
}
