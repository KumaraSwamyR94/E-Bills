import { View, Text, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card, Button, CustomHeader } from "../../src/components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBillDetails } from "../../src/hooks";

export default function BillDetails() {
  const { id } = useLocalSearchParams();
  const { 
    bill, 
    shop, 
    loading, 
    actionLoading, 
    handleUpdateStatus, 
    handleShare 
  } = useBillDetails(id);

  if (loading) return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
  );

  if (!bill) return (
      <View className="flex-1 items-center justify-center">
        <Text>Bill not found</Text>
      </View>
  );

  const StatusBadge = ({ status }: { status: string }) => {
     let color = 'bg-yellow-100 text-yellow-800';
     if(status === 'paid') color = 'bg-green-100 text-green-800';
     if(status === 'cancelled') color = 'bg-red-100 text-red-800';
     
     return (
         <View className={`self-start px-3 py-1 rounded-full ${color.split(' ')[0]} mb-4`}>
             <Text className={`font-bold capitalize ${color.split(' ')[1]}`}>{status}</Text>
         </View>
     );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom', 'top']}>
        <CustomHeader title="Bill Details" />
        <ScrollView className="flex-1 p-4">
            <StatusBadge status={bill.status} />
            
            <Card className="mb-4 bg-gray-50 border-gray-200">
                <Text className="text-sm font-bold text-gray-500 uppercase">Tenant Details</Text>
                <Text className="text-xl font-bold text-gray-900 mt-1">{shop?.tenantName}</Text>
                <Text className="text-gray-600">Shop #{shop?.shopNumber}</Text>
                <Text className="text-gray-600 mt-1">{shop?.contactNumber || 'No Contact Info'}</Text>
            </Card>

            <Card className="mb-6">
                <Text className="text-sm font-bold text-gray-500 uppercase mb-3">Bill Summary</Text>
                
                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Bill Date</Text>
                    <Text className="font-medium text-dark">{new Date(bill.readingDate).toLocaleDateString()}</Text>
                </View>

                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Units Consumed</Text>
                    <Text className="font-medium text-dark">{bill.unitsConsumed} Units</Text>
                </View>

                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Rate / Unit</Text>
                    <Text className="font-medium text-dark">₹ {bill.ratePerUnit}</Text>
                </View>

                <View className="h-[1px] bg-gray-100 my-2" />

                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Energy Charges</Text>
                    <Text className="font-medium text-dark">₹ {(bill.unitsConsumed * bill.ratePerUnit).toFixed(2)}</Text>
                </View>

                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Fixed Charges</Text>
                    <Text className="font-medium text-dark">₹ {bill.fixedCharges}</Text>
                </View>

                <View className="mt-2 pt-2 border-t border-dashed border-gray-300 flex-row justify-between items-center">
                    <Text className="text-lg font-bold text-gray-900">Total Amount</Text>
                    <Text className="text-2xl font-bold text-primary">₹ {bill.totalAmount.toFixed(0)}</Text>
                </View>
            </Card>

            <View className="gap-3 mb-10">
                <Button 
                    label="Share / Print Bill" 
                    variant="outline" 
                    onPress={handleShare}
                    loading={actionLoading}
                />
                
                {bill.status === 'pending' && (
                    <>
                        <Button 
                            label="Mark as Paid" 
                            variant="primary" 
                            className="bg-green-600"
                            onPress={() => handleUpdateStatus('paid')}
                            loading={actionLoading}
                        />

                        <Button 
                            label="Cancel Bill" 
                            variant="destructive" 
                            onPress={() => {
                                Alert.alert("Cancel Bill", "Are you sure? This cannot be undone.", [
                                    { text: "No", style: "cancel" },
                                    { text: "Yes, Cancel", style: "destructive", onPress: () => handleUpdateStatus('cancelled') }
                                ]);
                            }}
                            loading={actionLoading}
                        />
                    </>
                )}
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}