import { useState, useEffect } from "react";
import { View, Text, ScrollView, Modal, FlatList, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronDown, Store, X } from "lucide-react-native";
import { Input, CustomHeader, Button, Card } from "../../components";
import { useCreateBill } from "../../hooks";
import { getShops } from "../../services/shopService";

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
            <Card className={`mb-6 flex-row justify-between items-center ${shop ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`} onPress={() => {
            setShowShopSelector(true);
            }}>
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
                        name="lowUnitRate"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Rate ≤ Threshold (₹)"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.lowUnitRate?.message}
                                keyboardType="numeric"
                                editable={false}
                                className="bg-gray-100 text-gray-500"
                            />
                        )}
                    />
                </View>
                <View className="flex-1">
                    <Controller
                        control={control}
                        name="highUnitRate"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Rate > Threshold (₹)"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.highUnitRate?.message}
                                keyboardType="numeric"
                                editable={false}
                                className="bg-gray-100 text-gray-500"
                            />
                        )}
                    />
                </View>
              </View>

              <View className="flex-row gap-4">
                <View className="flex-1">
                    <Controller
                        control={control}
                        name="unitThreshold"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Unit Threshold"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.unitThreshold?.message}
                                keyboardType="numeric"
                                editable={false}
                                className="bg-gray-100 text-gray-500"
                            />
                        )}
                    />
                </View>
                {/* <View className="flex-1">
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
                </View> */}
              </View>

              <Card className="my-4 bg-purple-50 border-purple-200 border-2 rounded-2xl shadow-sm">
                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-900 font-medium">Units Consumed</Text>
                    <Text className="text-gray-900 font-bold">{calc.units.toFixed(1)}</Text>
                </View>
                
                <View className="flex-row justify-between mb-2 items-center">
                    <View className="flex-row items-center">
                        <Text className="text-gray-900 font-medium">Energy Charges</Text>
                        <View className={`ml-2 px-2 py-0.5 rounded ${calc.activeTier === 'low' ? 'bg-green-100' : 'bg-blue-100'}`}>
                            <Text className={`text-[10px] font-bold ${calc.activeTier === 'low' ? 'text-green-700' : 'text-blue-700'}`}>
                                {calc.activeTier === 'low' ? '≤ THRESHOLD' : '> THRESHOLD'}
                            </Text>
                        </View>
                    </View>
                    <Text className="text-gray-900 font-bold">₹ {calc.amount.toFixed(2)}</Text>
                </View>

                {calc.units > 0 && (
                    <Text className="text-[10px] text-gray-500 italic mb-2">
                        Applied rate: ₹ {calc.activeTier === 'low' ? control._defaultValues.lowUnitRate : control._defaultValues.highUnitRate} per unit
                    </Text>
                )}

                <View className="h-[1px] bg-purple-200 my-2" />
                <View className="flex-row justify-between items-center">
                    <Text className="text-lg text-purple-900 font-bold">Total Bill</Text>
                    <Text className="text-2xl text-purple-700 font-extrabold">₹ {calc.total.toFixed(2)}</Text>
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
                        <Card className={`mb-3 flex-row items-center border border-gray-100 shadow-sm ${selectedShopId === String(item.id) ? 'bg-blue-50 border-blue-200' : ''}`} onPress={() => handleSelectShop(item.id)}>
                             <View className="h-10 w-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                                <Store size={20} color="#2563eb" />
                            </View>
                            <View>
                                <Text className="text-lg font-bold text-gray-900">{item.tenantName}</Text>
                                <Text className="text-gray-500">Shop #{item.shopNumber}</Text>
                            </View>
                        </Card>
                )}
            />
        </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
