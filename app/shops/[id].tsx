import { View, Text, FlatList, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { getShopById, deleteShop as deleteShopService } from "../../src/services/shopService";
import { getBillsByShop } from "../../src/services/billService";
import { Card, Button, CustomHeader } from "../../src/components";
import { useFocusEffect } from "@react-navigation/native";
import { generateAndShareBillPdf } from "../../src/services/pdfService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShopDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [shop, setShop] = useState<any>(null);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    const [s, b] = await Promise.all([
        getShopById(Number(id)),
        getBillsByShop(Number(id))
    ]);
    setShop(s);
    setBills(b);
    setLoading(false);
  };

  const deleteShop = async (id: number) => {
    try {
        await deleteShopService(id);
        router.back();
    } catch (error) {
        console.error("Error deleting shop:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
        loadData();
    }, [id])
  );

  const handleEditShop = () => {
    router.push({pathname: '/shops/edit', params: {
      id: shop.id,
      shopNumber: shop.shopNumber,
      tenantName: shop.tenantName,
      meterId: shop.meterId,
      contactNumber: shop.contactNumber,
    }});
  };

  const handleDeleteShop = () => {
    Alert.alert(
        "Delete Shop.",
        "This will delete all the bills generated for this shop. Are you sure?",
        [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => deleteShop(Number(id)) }
        ]
    );
  };

  const handleSharePdf = async (bill: any) => {
      try {
          await generateAndShareBillPdf(shop, bill);
      } catch (e) {
          Alert.alert("Error", "Could not share PDF");
      }
  };

  if (!shop && !loading) return <View className="flex-1 p-4"><Text>Shop not found</Text></View>;

  return (
    <SafeAreaView className="flex-1">
      <CustomHeader title="Shop Details" />
      <View className="p-4">
      <Card className="mb-6 bg-white">
        <Text className="text-2xl font-bold text-gray-900 mb-1">{shop?.tenantName}</Text>
        <Text className="text-lg text-gray-600 mb-4">Shop #{shop?.shopNumber}</Text>
        
        <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500">Meter ID</Text>
            <Text className="font-medium">{shop?.meterId}</Text>
        </View>
        <View className="flex-row justify-between">
            <Text className="text-gray-500">Contact</Text>
            <Text className="font-medium">{shop?.contactNumber || 'N/A'}</Text>
        </View>
      </Card>

      <View className="flex-row gap-2">
        <Button 
          label="Edit Shop" 
          onPress={handleEditShop}
          className="mb-6 flex-1"
          size="lg"
        />
        <Button 
          label="Delete Shop" 
          onPress={handleDeleteShop}
          className="mb-6 flex-1"
          size="lg"
          variant="destructive"
        />
      </View>

      <Button 
        label="Generate New Bill" 
        onPress={() => router.push({ pathname: '/bills/create', params: { shopId: shop.id } })}
        className="mb-6"
        size="lg"
      />

      <Text className="text-lg font-bold text-gray-800 mb-3">Billing History</Text>
      
      <FlatList
        data={bills}
        keyExtractor={item => item.id.toString()}
        refreshing={loading}
        onRefresh={loadData}
        ListEmptyComponent={
            <View className="items-center justify-center py-10">
                <Text className="text-gray-400">No bills generated yet.</Text>
            </View>
        }
        renderItem={({ item }) => (
            <Card className="mb-3 p-3">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-bold text-gray-800">
                        {new Date(item.readingDate).toLocaleDateString()}
                    </Text>
                    <Text className="font-bold text-lg text-blue-600">₹ {item.totalAmount.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between mb-3">
                    <Text className="text-xs text-gray-500">Units: {item.unitsConsumed} | Fixed: {item.fixedCharges}</Text>
                </View>
                <View className="flex-row gap-2">
                    <Button 
                        label="Share Bill" 
                        size="sm" 
                        variant="outline" 
                        className="py-1 px-3"
                        onPress={() => handleSharePdf(item)}
                    />
                </View>
            </Card>
        )}
      />
      </View>
    </SafeAreaView>
  );
}
