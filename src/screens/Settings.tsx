import { View, Text, ScrollView } from "react-native";
import { Controller } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Application from 'expo-application';
import { Input, Button, Card, CustomHeader } from "../components";
import { useSettings } from "../hooks";

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
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="p-4 flex-grow">
      <Card className="mb-6 bg-white">
        <Text className="text-lg font-bold mb-4 text-gray-900">Default Billing Configuration</Text>
        <Controller
            control={control}
            name="unitThreshold"
            render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    label="Base Unit(s)"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.unitThreshold?.message}
                    keyboardType="numeric"
                />
            )}
        />

        <Controller
            control={control}
            name="lowUnitRate"
            render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    label={`Rate below Base Unit(s)`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.lowUnitRate?.message}
                    keyboardType="numeric"
                />
            )}
        />
        
        <Controller
            control={control}
            name="highUnitRate"
            render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    label={`Rate above Base Unit(s)`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.highUnitRate?.message}
                    keyboardType="numeric"
                />
            )}
        />
        
        <Controller
            control={control}
            name="fixed"
            render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    label={`Fixed Charge`}
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
      
      <Card className="bg-white mt-8">
        <Text className="text-sm font-bold text-red-600 uppercase mb-4">Danger Zone</Text>
        <Text className="text-gray-500 mb-4">
            This action will permanently delete all billing history and shop data. Use with caution.
        </Text>
        
        <Button 
            label="Reset Database" 
            variant="destructive"
            onPress={handleReset}
        />
      </Card>
      
      <View className="mt-8 items-center">
        <Text className="text-sm text-gray-500">{`Version: ${Application.nativeApplicationVersion}(${Application.nativeBuildVersion})`}</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
