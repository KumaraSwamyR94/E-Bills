import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getSettings, saveSetting } from "../services/settingsService";
import { exportToExcel } from "../services/excelService";
import { resetDb } from "../db";

const settingsSchema = z.object({
    rate: z.string().min(1, "Rate is required"),
    fixed: z.string().min(1, "Fixed charges are required"),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export const useSettings = () => {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<SettingsFormValues>({
      resolver: zodResolver(settingsSchema),
      defaultValues: {
          rate: "10",
          fixed: "0"
      }
  });

  const { reset, handleSubmit: hookFormSubmit } = form;

  const loadSettings = useCallback(async () => {
    const s = await getSettings();
    reset({
        rate: s.ratePerUnit.toString(),
        fixed: s.fixedCharges.toString()
    });
  }, [reset]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const onSubmit = async (data: SettingsFormValues) => {
    setLoading(true);
    await saveSetting('rate_per_unit', data.rate);
    await saveSetting('fixed_charges', data.fixed);
    setLoading(false);
    Alert.alert("Success", "Settings saved");
  };

  const handleExport = async () => {
    try {
        await exportToExcel();
    } catch {
        Alert.alert("Error", "Export failed");
    }
  };

  const handleReset = () => {
    Alert.alert(
        "Reset Database",
        "Are you sure? This will delete ALL data (shops, bills, settings). This action cannot be undone.",
        [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Reset Everything", 
                style: "destructive", 
                onPress: async () => {
                    try {
                        await resetDb();
                        Alert.alert("Success", "Database has been reset.");
                        // Optionally reload settings
                        loadSettings();
                    } catch {
                        Alert.alert("Error", "Failed to reset database.");
                    }
                }
            }
        ]
    );
  };

  return {
    loading,
    form,
    save: hookFormSubmit(onSubmit),
    handleExport,
    handleReset
  };
};
