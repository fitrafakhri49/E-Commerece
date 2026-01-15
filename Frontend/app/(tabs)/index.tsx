import { api } from "@/src/services/api";
import { indexStyles } from "@/src/styles/user/indexStyle";
import { Product } from "@/src/types/product";
import { getAccessToken } from "@/src/utils/authToken";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Dashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAccessToken();
      if (!token) {
        router.replace("/login");
      } else {
        setCheckingAuth(false);
        fetchProducts(token, sort);
      }
    };
    checkAuth();
  }, []);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // refetch products when search or sort changes
  useEffect(() => {
    const refetch = async () => {
      const token = await getAccessToken();
      if (token) fetchProducts(token, sort, debouncedSearch);
    };
    refetch();
  }, [debouncedSearch, sort]);

  const fetchProducts = async (
    token: string,
    sortType: string,
    searchQuery: string = ""
  ) => {
    try {
      setLoading(true);
      const res = await api.get("/user/products", {
        headers: { Authorization: `Bearer ${token}` },
        params: { sort: sortType, search: searchQuery },
      });
      setProducts(res.data);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (value: string) => setSort(value);

  const handleRefresh = async () => {
    setRefreshing(true);
    const token = await getAccessToken();
    if (token) await fetchProducts(token, sort, debouncedSearch);
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/detail_product_user/[id]",
          params: { id: item.id },
        })
      }
      style={{ flex: 1 }}
    >
      <View style={indexStyles.productCard}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={indexStyles.productImage}
          />
        ) : (
          <View style={[indexStyles.productImage, indexStyles.noImage]}>
            <Text>No Image</Text>
          </View>
        )}
        <Text style={indexStyles.productName}>{item.name}</Text>
        <Text style={indexStyles.productPrice}>
          Rp {item.price.toLocaleString("id-ID")}
        </Text>
        <Text style={indexStyles.productStock}>Stock: {item.stock}</Text>
      </View>
    </TouchableOpacity>
  );

  if (checkingAuth) return null;

  return (
    <View style={indexStyles.container}>
      {/* HEADER */}
      <View style={indexStyles.header}>
        <Text style={indexStyles.title}>Soundscapes</Text>
        <Text style={indexStyles.subtitle}>
          Curated Music Albums Collection
        </Text>
      </View>

      {/* SEARCH */}
      <TextInput
        placeholder="Search album..."
        placeholderTextColor="#94a3b8"
        value={search}
        onChangeText={setSearch}
        style={indexStyles.searchInput}
      />

      {/* SORT */}
      <View style={indexStyles.sortContainer}>
        <Text style={indexStyles.sortLabel}>Sort Album</Text>
        <View style={indexStyles.pickerWrapper}>
          <Picker
            selectedValue={sort}
            onValueChange={handleSortChange}
            style={{ color: "#e5e7eb" }}
            dropdownIconColor="#e5e7eb"
          >
            <Picker.Item label="Terbaru" value="newest" />
            <Picker.Item label="Terlama" value="oldest" />
            <Picker.Item label="Harga Terendah" value="price_asc" />
            <Picker.Item label="Harga Tertinggi" value="price_desc" />
          </Picker>
        </View>
      </View>

      {/* PRODUCT GRID */}
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#38bdf8" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing} // harus boolean, jangan undefined
              onRefresh={handleRefresh}
              tintColor="#38bdf8"
              colors={["#38bdf8"]}
            />
          }
        />
      )}
    </View>
  );
}
