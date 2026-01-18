import { View, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Input, Button, CustomHeader } from "../../src/components";
import { addShop } from "../../src/services/shopService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddShop() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shopNumber: "",
    tenantName: "",
    meterId: "",
    contactNumber: "",
  });

  const handleSubmit = async () => {
    if (!form.shopNumber || !form.tenantName || !form.meterId) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    try {
      await addShop(form);
      router.back();
    } catch (error) {
      Alert.alert("Error", "Could not create shop. Shop number might be duplicate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <CustomHeader title="Add Shop" />
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-6 text-gray-800">Shop Details</Text>
      
      <Input
        label="Shop Number *"
        placeholder="e.g. A-101"
        value={form.shopNumber}
        onChangeText={(text) => setForm({ ...form, shopNumber: text })}
      />
      
      <Input
        label="Tenant Name *"
        placeholder="e.g. John Doe"
        value={form.tenantName}
        onChangeText={(text) => setForm({ ...form, tenantName: text })}
      />

      <Input
        label="Meter ID *"
        placeholder="e.g. M-88291"
        value={form.meterId}
        onChangeText={(text) => setForm({ ...form, meterId: text })}
      />

      <Input
        label="Contact Number"
        placeholder="e.g. 9876543210"
        keyboardType="phone-pad"
        value={form.contactNumber}
        onChangeText={(text) => setForm({ ...form, contactNumber: text })}
      />

      <View className="mt-4">
        <Button label="Save Shop" onPress={handleSubmit} loading={loading} />
      </View>
    </View>
    </SafeAreaView>
  );
}
