import { View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { useRouter, Link } from "expo-router";
import { useState, useCallback } from "react";
import { getShops } from "../../src/services/shopService";
import { Card, CustomHeader } from "../../src/components";
import { Plus, Store } from "lucide-react-native";
import { useFocusEffect } from '@react-navigation/native'; // To refresh when navigating back
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShopList() {
  const router = useRouter();
  const [shopsData, setShopsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShops = async () => {
    setLoading(true);
    const data = await getShops();
    setShopsData(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
        fetchShops();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1">
      <CustomHeader title="Shops" />
      <View className="flex-1 p-4">
      <FlatList
        data={shopsData}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchShops} />}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center justify-center mt-20">
              <Text className="text-gray-500 text-lg">No shops found.</Text>
              <Text className="text-gray-400 text-sm mt-2">Add a shop to get started.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Link href={`/shops/${item.id}`} asChild>
            <TouchableOpacity>
              <Card className="mb-3 flex-row items-center">
                <View className="h-10 w-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                  <Store size={20} color="#2563eb" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">{item.tenantName}</Text>
                  <Text className="text-gray-500">Shop #{item.shopNumber}</Text>
                </View>
                <View>
                    <Text className="text-xs text-gray-400">Meter: {item.meterId}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          </Link>
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push('/shops/add')}
        className="absolute bottom-8 right-6 bg-blue-600 h-16 w-16 rounded-full items-center justify-center shadow-lg active:bg-blue-700"
      >
        <Plus color="white" size={24} />
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
