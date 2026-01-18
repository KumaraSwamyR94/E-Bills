import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Link, useRouter } from "expo-router";
import { Card, Button, CustomHeader } from "../src/components";
import { Settings as SettingsIcon } from "lucide-react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getDashboardStats } from "../src/services/billService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    currentMonthRevenue: 0,
    currentMonthBills: 0,
    pendingAmount: 0,
    pendingBills: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    const data = await getDashboardStats();
    setStats(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
        loadStats();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <CustomHeader
      showBackButton={false}
      title="Dashboard"
      rightIcon={
          <Link href="/settings" asChild>
            <TouchableOpacity>
              <SettingsIcon size={24} color="#1F2937" />
            </TouchableOpacity>
          </Link>} />

      <ScrollView 
        className="flex-1 p-4"
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Stats Carousel */}
        <View className="flex-row gap-4 mb-8">
          <Card className="flex-1 bg-primary border-primary">
            <Text className="text-blue-100 text-sm font-medium">This Month</Text>
            <Text className="text-white text-3xl font-bold mt-1">₹ {stats.currentMonthRevenue.toFixed(0)}</Text>
            <Text className="text-blue-200 text-xs mt-2">{stats.currentMonthBills} Bills Generated</Text>
          </Card>
          <Card className="flex-1 bg-white">
            <Text className="text-secondary text-sm font-medium">Pending</Text>
            <Text className="text-dark text-3xl font-bold mt-1">₹ {stats.pendingAmount.toFixed(0)}</Text>
            <Text className="text-gray-400 text-xs mt-2">{stats.pendingBills} Unpaid Bills</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <Text className="text-lg font-bold text-dark mb-4">Quick Actions</Text>
        
        <View className="gap-3">
          <Button 
            label="New Bill" 
            variant="primary" 
            size="lg"
            onPress={() => router.push('/bills/create')}
            className="w-full"
          />
          
          <View className="flex-row gap-3">
              <Button 
              label="Manage Shops" 
              variant="secondary" 
              className="flex-1"
              onPress={() => router.push('/shops')}
              />
              <Button 
              label="History" 
              variant="outline" 
              className="flex-1"
              onPress={() => router.push('/bills')}
              />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
