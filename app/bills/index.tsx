import { View, Text, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useBills } from "../../src/hooks";
import { Card, CustomHeader } from "../../src/components";

const FILTERS = [
    {
        label: 'All',
        id: 'all'
    },
    {
        label: 'Paid',
        id: 'paid'
    },
    {
        label: 'Unpaid',
        id: 'pending'
    }
]

export default function BillsHistory() {
    const router = useRouter();
    const {bills, shopsMap, refreshing, loading, filter, loadData, onRefresh, onFilterChange} = useBills();

  useFocusEffect(
    useCallback(() => {
        loadData(filter);
    }, [filter])
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card className="mb-3">
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-lg font-bold text-dark">
            Shop {shopsMap[item.shopId] || `#${item.shopId}`}
          </Text>
          <Text className="text-gray-500 text-xs mt-1">
            {formatDate(item.readingDate)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-lg font-bold text-primary">
            ₹ {item.totalAmount.toFixed(0)}
          </Text>
          <View className={`px-2 py-0.5 rounded-full mt-1 ${
            item.status === 'paid' ? 'bg-green-100' : 
            item.status === 'cancelled' ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
             <Text className={`text-xs font-medium ${
                item.status === 'paid' ? 'text-green-700' : 
                item.status === 'cancelled' ? 'text-red-700' : 'text-yellow-700'
             }`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
             </Text>
          </View>
        </View>
      </View>
      <View className="flex-row justify-between mt-3 pt-3 border-t border-gray-100">
         <Text className="text-xs text-gray-500">
            Reading: {item.currentReading}
         </Text>
         <Text className="text-xs text-secondary font-medium">
            {item.unitsConsumed} Units
         </Text>
      </View>
      <View className="flex-row justify-end p-2">
      <Text onPress={() => router.push(`/bills/${item.id}`)} className="text-primary text-xs mt-2 right-0 underline"> View Details</Text>
      </View>
    </Card>
  );

  const renderFilterItem = ({item}: {item: any}) => (
    <TouchableOpacity 
        onPress={() => onFilterChange(item.id)} 
        className={`px-5 py-2 mr-3 rounded-full border ${
            filter === item.id 
            ? 'bg-blue-600 border-blue-600' 
            : 'bg-white border-gray-300'
        }`}
    >
        <Text className={`font-medium ${
            filter === item.id ? 'text-white' : 'text-gray-700'
        }`}>
            {item.label}
        </Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom', 'top']}>
        <CustomHeader title="Bills History" />
        <View className="pb-2">
            <FlatList 
                data={FILTERS} 
                keyExtractor={(item) => item.id} 
                renderItem={renderFilterItem} 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{ paddingHorizontal: 16 }}
                className="max-h-12"
            />
        </View>
      <FlatList
        data={bills}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading ? (
            <View className="flex-1 items-center justify-center p-8 mt-10">
              <Text className="text-gray-500 text-lg">No bills generated yet.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
