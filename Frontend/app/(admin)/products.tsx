import { api } from "@/src/services/api";
import { productStyles } from "@/src/styles/admin/productStyles";
import { Product } from "@/src/types/product";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      if (!refreshing) setLoading(true);
      const res = await api.get("/admin/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    const doDelete = async () => {
      try {
        setActionLoading(`delete-${id}`);

        await api.delete(`/admin/products/${id}`);

        Alert.alert("Success", "Product berhasil dihapus");
        fetchProducts();
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Gagal menghapus product");
      } finally {
        setActionLoading(null);
      }
    };

    // 🌐 WEB
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Apakah anda yakin ingin menghapus product ini?"
      );
      if (confirmed) {
        await doDelete();
      }
      return;
    }

    Alert.alert(
      "Konfirmasi",
      "Apakah anda yakin ingin menghapus product ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: doDelete,
        },
      ]
    );
  };

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  const handleAddImages = async (id: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (result.canceled || result.assets.length === 0) return;

    const formData = new FormData();

    result.assets.forEach((img: any) => {
      if (Platform.OS === "web") {
        formData.append("images", img.file);
      } else {
        formData.append("images", {
          uri: img.uri,
          name: img.uri.split("/").pop(),
          type: img.mimeType || "image/jpeg",
        } as any);
      }
    });

    try {
      setActionLoading(`add-${id}`);

      await api.patch(`/admin/products/${id}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "Gambar berhasil ditambahkan");
      fetchProducts();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Gagal menambahkan gambar");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push({
      pathname: "/edit_product/[id]",
      params: { id },
    });
  };
  const handleDetail = (id: string) => {
    router.push({
      pathname: "/detail_product_admin/[id]",
      params: { id },
    });
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={productStyles.card}>
      {/* AREA DETAIL (BOLEH KLIK) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handleDetail(item.id)}
      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={productStyles.image} />
        ) : (
          <View style={[productStyles.image, productStyles.noImage]}>
            <Text>No Image</Text>
          </View>
        )}

        <Text style={productStyles.name}>{item.name}</Text>
        <Text style={productStyles.price}>{formatRupiah(item.price)}</Text>
        <Text style={productStyles.stock}>Stock: {item.stock}</Text>
      </TouchableOpacity>

      {/* ACTION BUTTONS (AMAN) */}
      <View style={productStyles.actionButtons}>
        <TouchableOpacity
          onPress={() => handleEdit(item.id)}
          style={productStyles.actionBtn}
        >
          <Ionicons name="create-outline" size={20} color="#38bdf8" />
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleAddImages(item.id)}
          style={productStyles.actionBtn}
          disabled={actionLoading === `add-${item.id}`}
        >
          {actionLoading === `add-${item.id}` ? (
            <ActivityIndicator size="small" color="#2563eb" />
          ) : (
            <>
              <Ionicons name="images-outline" size={20} color="#38bdf8" />
              <Text>Add Images</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={productStyles.actionBtn}
          disabled={actionLoading === `delete-${item.id}`}
        >
          {actionLoading === `delete-${item.id}` ? (
            <ActivityIndicator size="small" color="#eb4034" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="#f87171" />
              <Text>Delete</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={productStyles.loading}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  return (
    <View style={productStyles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <TouchableOpacity
        style={productStyles.fab}
        onPress={() => router.push("/add_product")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
