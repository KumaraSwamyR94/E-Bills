import { View, Text, ScrollView } from "react-native";
import { Controller } from "react-hook-form";
import { Input, Button, Card, CustomHeader } from "../../src/components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettings } from "../../src/hooks";

export default function Settings() {
  const {
    loading,
    form: { control, formState: { errors } },
    save,
    handleExport,
    handleReset
  } = useSettings();

  return (
    <SafeAreaView className="flex-1">
      <CustomHeader title="Settings" />
    <ScrollView className="flex-1 p-4 bg-gray-50">
      <Card className="mb-6 bg-white">
        <Text className="text-lg font-bold mb-4 text-gray-900">Default Billing Configuration</Text>
        
        <Controller
            control={control}
            name="rate"
            render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    label="Default Rate Per Unit (₹)"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.rate?.message}
                    keyboardType="numeric"
                />
            )}
        />
        
        <Controller
            control={control}
            name="fixed"
            render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    label="Default Fixed Charges (₹)"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.fixed?.message}
                    keyboardType="numeric"
                />
            )}
        />

        <Button label="Save Configuration" onPress={save} loading={loading} />
      </Card>

      <Card className="bg-white">
        <Text className="text-lg font-bold mb-4 text-gray-900">Data Management</Text>
        <Text className="text-gray-500 mb-4">
            Export all billing history and shop data to an Excel file for backup or analysis.
        </Text>
        
        <Button 
            label="Export Data to Excel" 
            variant="secondary" 
            onPress={handleExport}
        />
      </Card>
      
      <View className="mt-8 pt-6 border-t border-gray-200">
        <Text className="text-sm font-bold text-red-600 uppercase mb-4">Danger Zone</Text>
        
        <Button 
            label="Reset Database" 
            variant="destructive"
            onPress={handleReset}
        />
      </View>
      
      <View className="mt-8 items-center">
        <Text className="text-gray-400 text-xs">Version 1.0.0</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
