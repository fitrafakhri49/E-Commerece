import { api } from "@/src/services/api";
import { add_productStyles } from "@/src/styles/admin/add_productStyles";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function AddProduct() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [artist, setArtist] = useState(""); // artist
  const [year, setYear] = useState(""); // release year
  const [tracklist, setTracklist] = useState(""); // tracklist as comma separated
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* =======================
     MOBILE IMAGE PICKER
  ======================= */
  const pickImagesMobile = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages(result.assets);
    }
  };

  /* =======================
     WEB FILE INPUT
  ======================= */
  const handleWebImageChange = (e: any) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  /* =======================
     SUBMIT
  ======================= */
  const handleSubmit = async () => {
    if (!name || !price || !stock) {
      Alert.alert("Error", "Semua field wajib diisi");
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

    images.forEach((img: any) => {
      if (Platform.OS === "web") {
        formData.append("images", img);
      } else {
        formData.append("images", {
          uri: img.uri,
          name: img.uri.split("/").pop(),
          type: "image/jpeg",
        } as any);
      }
    });

    try {
      setLoading(true);
      await api.post("/admin/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Success", "Product berhasil ditambahkan");
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Gagal menambahkan product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={add_productStyles.container}>
      <Text style={add_productStyles.title}>Tambah Product</Text>

      {/* Nama */}
      <Text style={add_productStyles.label}>Nama Product</Text>
      <TextInput
        placeholderTextColor="#64748b"
        style={add_productStyles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nama Product"
      />

      {/* Deskripsi */}
      <Text style={add_productStyles.label}>Deskripsi Product</Text>
      <TextInput
        style={[
          add_productStyles.input,
          { height: 100, textAlignVertical: "top" },
        ]}
        placeholderTextColor="#64748b"
        value={description}
        onChangeText={setDescription}
        placeholder="Deskripsi Product"
        multiline
      />

      {/* Artist */}
      <Text style={add_productStyles.label}>Artist</Text>
      <TextInput
        style={add_productStyles.input}
        placeholderTextColor="#64748b"
        value={artist}
        onChangeText={setArtist}
        placeholder="Nama Artist"
      />

      {/* Release Year */}
      <Text style={add_productStyles.label}>Release Year</Text>
      <TextInput
        style={add_productStyles.input}
        placeholderTextColor="#64748b"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        placeholder="Tahun Rilis"
      />

      {/* Tracklist */}
      <Text style={add_productStyles.label}>
        Tracklist (pisahkan dengan koma)
      </Text>
      <TextInput
        style={[
          add_productStyles.input,
          { height: 80, textAlignVertical: "top" },
        ]}
        placeholderTextColor="#64748b"
        value={tracklist}
        onChangeText={setTracklist}
        placeholder="Track 1, Track 2, Track 3..."
        multiline
      />

      {/* Harga */}
      <Text style={add_productStyles.label}>Harga</Text>
      <TextInput
        placeholderTextColor="#64748b"
        style={add_productStyles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="Harga"
      />

      {/* Stock */}
      <Text style={add_productStyles.label}>Stock</Text>
      <TextInput
        placeholderTextColor="#64748b"
        style={add_productStyles.input}
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
        placeholder="Stock"
      />

      {/* Image Picker */}
      <Text style={add_productStyles.label}>Gambar</Text>
      {Platform.OS === "web" ? (
        <View style={{ marginBottom: 16 }}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleWebImageChange}
          />
        </View>
      ) : (
        <TouchableOpacity
          style={add_productStyles.imagePicker}
          onPress={pickImagesMobile}
        >
          <Text style={add_productStyles.imagePlaceholder}>Pilih Gambar</Text>
        </TouchableOpacity>
      )}

      {/* Preview */}
      {images.length > 0 && (
        <ScrollView horizontal style={add_productStyles.previewContainer}>
          {images.map((img, idx) => (
            <Image
              key={idx}
              source={{
                uri: Platform.OS === "web" ? URL.createObjectURL(img) : img.uri,
              }}
              style={add_productStyles.previewImage}
            />
          ))}
        </ScrollView>
      )}

      {/* Submit */}
      <TouchableOpacity
        style={add_productStyles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={add_productStyles.buttonText}>Tambah Product</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
