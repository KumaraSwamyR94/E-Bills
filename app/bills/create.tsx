import { View, Text, ScrollView, Modal, FlatList, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";
import { useLocalSearchParams } from "expo-router";
import { Input, CustomHeader, Button, Card } from "../../src/components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCreateBill } from "../../src/hooks";
import { useState, useEffect } from "react";
import { getShops } from "../../src/services/shopService";
import { ChevronDown, Store, X } from "lucide-react-native";

export default function CreateBill() {
  const { shopId: paramShopId } = useLocalSearchParams();
  const [selectedShopId, setSelectedShopId] = useState<string | undefined>(
    paramShopId ? String(paramShopId) : undefined
  );
  const [shopsData, setShopsData] = useState<any[]>([]);
  const [showShopSelector, setShowShopSelector] = useState(false);

  const fetchShops = async () => {
    const data = await getShops();
    setShopsData(data);
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const { 
    shop, 
    loading, 
    submitting, 
    form: { control, formState: { errors } },
    calc, 
    submit 
  } = useCreateBill(selectedShopId);

  const handleSelectShop = (id: number) => {
      setSelectedShopId(String(id));
      setShowShopSelector(false);
  };

  return (
    <SafeAreaView className="flex-1" edges={['bottom', 'top']}>
      <CustomHeader title="Create Bill" />
      <ScrollView className="flex-1 p-4 bg-gray-50">
        
        {/* Shop Selector */}
        <TouchableOpacity onPress={() => setShowShopSelector(true)}>
            <Card className={`mb-6 flex-row justify-between items-center ${shop ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                <View>
                    <Text className="text-sm font-bold text-gray-500 uppercase mb-1">Billing For</Text>
                    {shop ? (
                        <View>
                            <Text className="text-xl font-bold text-gray-900">{shop.tenantName}</Text>
                            <Text className="text-gray-600">Shop #{shop.shopNumber}</Text>
                        </View>
                    ) : (
                        <Text className="text-lg font-medium text-gray-400">Select a Shop</Text>
                    )}
                </View>
                <ChevronDown size={24} color="#6B7280" />
            </Card>
        </TouchableOpacity>

        {loading && <View className="py-4"><Text className="text-center text-gray-500">Loading details...</Text></View>}

        {/* Form - Only show if shop matches */}
        {shop && !loading && (
            <>
              <View className="flex-row gap-4">
                <View className="flex-1">
                    <Controller
                        control={control}
                        name="previousReading"
                        render={({ field: { value } }) => (
                            <Input
                                label="Prev Reading"
                                value={value}
                                editable={false}
                                className="bg-gray-100 text-gray-500"
                            />
                        )}
                    />
                </View>
                <View className="flex-1">
                    <Controller
                        control={control}
                        name="currentReading"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Curr Reading"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.currentReading?.message}
                                keyboardType="numeric"
                                placeholder="0.0"
                                autoFocus
                            />
                        )}
                    />
                </View>
              </View>

              <View className="flex-row gap-4">
                <View className="flex-1">
                    <Controller
                        control={control}
                        name="ratePerUnit"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Rate / Unit (₹)"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.ratePerUnit?.message}
                                keyboardType="numeric"
                            />
                        )}
                    />
                </View>
                <View className="flex-1">
                    <Controller
                        control={control}
                        name="fixedCharges"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Fixed Charges (₹)"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.fixedCharges?.message}
                                keyboardType="numeric"
                            />
                        )}
                    />
                </View>
              </View>

              <View className="mb-4">
                  <Text className="text-gray-500 font-medium mb-2">Calculation Logic</Text>
                  <Controller
                      control={control}
                      name="calculationMethod"
                      render={({ field: { onChange, value } }) => (
                          <View className="flex-row gap-2">
                              <TouchableOpacity 
                                onPress={() => onChange("ADD")}
                                className={`flex-1 p-3 border rounded-lg ${value === "ADD" ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200"}`}
                              >
                                  <Text className={`text-center font-medium ${value === "ADD" ? "text-blue-700" : "text-gray-600"}`}>Fixed + Energy</Text>
                              </TouchableOpacity>
                              <TouchableOpacity 
                                onPress={() => onChange("MAX")}
                                className={`flex-1 p-3 border rounded-lg ${value === "MAX" ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200"}`}
                              >
                                  <Text className={`text-center font-medium ${value === "MAX" ? "text-blue-700" : "text-gray-600"}`}>Max(Fixed, Energy)</Text>
                              </TouchableOpacity>
                          </View>
                      )}
                  />
              </View>

              <Card className="my-4 bg-purple-50 border-purple-200 border-2 rounded-2xl shadow-2xl">
                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-900">Units Consumed</Text>
                    <Text className="text-gray-900 font-bold">{calc.units.toFixed(1)}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-900">Energy Charges</Text>
                    <Text className="text-gray-900 font-bold">₹ {calc.amount.toFixed(2)}</Text>
                </View>
                <View className="h-[1px] bg-gray-700 my-2" />
                <View className="flex-row justify-between">
                    <Text className="text-lg text-gray-900 font-bold">Total Bill</Text>
                    <Text className="text-2xl text-green-400 font-bold">₹ {calc.total.toFixed(2)}</Text>
                </View>
              </Card>

              <Button 
                label="Generate & Save Bill" 
                onPress={submit} 
                loading={submitting} 
                size="lg"
              />
            </>
        )}

      </ScrollView>

      {/* Shop Selection Modal */}
      <Modal
        transparent
        visible={showShopSelector}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowShopSelector(false)}
      >
        <View className="flex-1 bg-[#00000050]">
          <View className="h-[70%] bg-white rounded-t-2xl absolute bottom-0 w-full">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
                <Text className="text-lg font-bold">Select Shop</Text>
                <TouchableOpacity onPress={() => setShowShopSelector(false)} className="p-2">
                    <X size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <FlatList 
                data={shopsData}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    <View className="py-20 items-center">
                        <Text className="text-gray-500 text-lg">No shops added.</Text>
                        <Text className="text-gray-400 text-sm mt-2">Go to &quot;Manage Shops&quot; to add one.</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelectShop(item.id)}>
                        <Card className={`mb-3 flex-row items-center border border-gray-100 shadow-sm ${selectedShopId === String(item.id) ? 'bg-blue-50 border-blue-200' : ''}`}>
                             <View className="h-10 w-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                                <Store size={20} color="#2563eb" />
                            </View>
                            <View>
                                <Text className="text-lg font-bold text-gray-900">{item.tenantName}</Text>
                                <Text className="text-gray-500">Shop #{item.shopNumber}</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                )}
            />
        </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
