import React, { useState } from 'react'
import { Text, View, Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Input, Button, CustomHeader } from '../../src/components';
import { updateShop } from '../../src/services/shopService';
import { Shop } from '../../src/utils/types';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditShop = () => {
  const router = useRouter();
  const { id, shopNumber, tenantName, meterId, contactNumber } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Shop>({
    id: Number(id),
    shopNumber: shopNumber as string || '',
    tenantName: tenantName as string || '',
    meterId: meterId as string || '',
    contactNumber: contactNumber as string || '',
  });

  const handleSubmit = async () => {
    if (!form.shopNumber || !form.tenantName || !form.meterId) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    try {
      await updateShop(form.id, form);
      router.back();
    } catch (error) {
      Alert.alert("Error", "Could not update shop, please check the details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <CustomHeader title="Edit Shop" />
    <View className="flex-1 p-4">
      
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
        <Button label="Update Shop" onPress={handleSubmit} loading={loading} />
      </View>
    </View>
    </SafeAreaView>
  );
}

export default EditShop