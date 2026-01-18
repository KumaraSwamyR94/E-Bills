import { View, Text, ScrollView } from "react-native";
import { Controller } from "react-hook-form";
import { useLocalSearchParams } from "expo-router";
import { Input, CustomHeader, Button, Card } from "../../src/components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCreateBill } from "../../src/hooks";

export default function CreateBill() {
  const { shopId } = useLocalSearchParams();
  const { 
    shop, 
    loading, 
    submitting, 
    form: { control, formState: { errors } },
    calc, 
    submit 
  } = useCreateBill(shopId);

  if (loading) return <View className="p-4"><Text>Loading details...</Text></View>;

  return (
    <SafeAreaView className="flex-1" edges={['bottom', 'top']}>
      <CustomHeader title="Create Bill" />
    <ScrollView className="flex-1 p-4 bg-gray-50">
       <Card className="mb-6 bg-blue-50 border-blue-200">
        <Text className="text-sm font-bold text-blue-800 uppercase mb-1">Billing For</Text>
        <Text className="text-xl font-bold text-gray-900">{shop?.tenantName}</Text>
        <Text className="text-gray-600">Shop #{shop?.shopNumber}</Text>
      </Card>

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

      <Card className="my-4 bg-gray-900">
        <View className="flex-row justify-between mb-2">
            <Text className="text-gray-400">Units Consumed</Text>
            <Text className="text-white font-bold">{calc.units.toFixed(1)}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
            <Text className="text-gray-400">Energy Charges</Text>
            <Text className="text-white font-bold">₹ {calc.amount.toFixed(2)}</Text>
        </View>
        <View className="h-[1px] bg-gray-700 my-2" />
        <View className="flex-row justify-between">
            <Text className="text-lg text-white font-bold">Total Bill</Text>
            <Text className="text-2xl text-green-400 font-bold">₹ {calc.total.toFixed(2)}</Text>
        </View>
      </Card>

      <Button 
        label="Generate & Save Bill" 
        onPress={submit} 
        loading={submitting} 
        size="lg"
      />
    </ScrollView>
    </SafeAreaView>
  );
}
