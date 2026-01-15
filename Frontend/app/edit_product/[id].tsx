import { api } from "@/src/services/api";
import { styles } from "@/src/styles/admin/edit_productStyle";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const showAlert = (title: string, message: string) => {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function EditProduct() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [artist, setArtist] = useState(""); // artist
  const [year, setYear] = useState(""); // releaseYear
  const [tracklist, setTracklist] = useState(""); // trackList comma separated
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/products/${id}`);
      const product = res.data;

      setName(product.name);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setDescription(product.description || "");
      setArtist(product.artist || "");
      setYear(product.releaseYear?.toString() || "");
      let trackListArray: string[] = [];
      if (product.trackList) {
        try {
          trackListArray = JSON.parse(product.trackList);
          if (!Array.isArray(trackListArray)) trackListArray = [];
        } catch (err) {
          console.warn("Gagal parse trackList:", err);
          trackListArray = [];
        }
      }

      setTracklist(trackListArray.join(", "));
    } catch (err) {
      console.error(err);
      showAlert("Error", "Gagal mengambil data product");
    } finally {
      setLoading(false);
    }
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImages(result.assets);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !stock) {
      showAlert("Error", "Nama, harga, dan stock wajib diisi");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description || "");
    formData.append("artist", artist || "");
    formData.append("releaseYear", year ? Number(year).toString() : "");
    formData.append(
      "trackList",
      JSON.stringify(
        tracklist
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      )
    );

    if (images.length > 0) {
      images.forEach((img) =>
        formData.append("images", {
          uri: img.uri,
          name: img.uri.split("/").pop(),
          type: "image/jpeg",
        } as any)
      );
    }

    try {
      setSubmitting(true);
      await api.patch(`/admin/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showAlert("Success", "Product berhasil diupdate");
      router.back();
    } catch (err) {
      console.error(err);
      showAlert("Error", "Gagal mengupdate product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Product</Text>

      <Text style={styles.label}>Nama Product</Text>
      <TextInput
        placeholder="Nama Product"
        placeholderTextColor="#64748b"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text style={styles.label}>Artist</Text>
      <TextInput
        placeholder="Nama Artist"
        placeholderTextColor="#64748b"
        value={artist}
        onChangeText={setArtist}
        style={styles.input}
      />

      <Text style={styles.label}>Release Year</Text>
      <TextInput
        placeholder="Tahun Rilis"
        placeholderTextColor="#64748b"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Tracklist (pisahkan koma)</Text>
      <TextInput
        placeholder="Track 1, Track 2..."
        placeholderTextColor="#64748b"
        value={tracklist}
        onChangeText={setTracklist}
        multiline
        style={[styles.input, { height: 80, textAlignVertical: "top" }]}
      />

      <Text style={styles.label}>Harga</Text>
      <TextInput
        placeholder="Harga"
        placeholderTextColor="#64748b"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Stock</Text>
      <TextInput
        placeholder="Stock"
        placeholderTextColor="#64748b"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Deskripsi</Text>
      <TextInput
        placeholder="Deskripsi"
        placeholderTextColor="#64748b"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <Text style={styles.label}>Gambar</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
        {images.length > 0 ? (
          <ScrollView horizontal>
            {images.map((img, i) => (
              <Image
                key={i}
                source={{ uri: img.uri }}
                style={styles.previewImage}
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={16} color="#94a3b8" /> Pilih
            Gambar
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#38bdf8" />
        ) : (
          <Text style={styles.buttonText}>Update Product</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
