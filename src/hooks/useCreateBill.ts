import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getLastBill, createBill } from "../services/billService";
import { getSettings } from "../services/settingsService";
import { getShopById } from "../services/shopService";

const createBillSchema = z.object({
  previousReading: z.string(),
  currentReading: z.string().min(1, "Current reading is required"),
  lowUnitRate: z.string().min(1, "Low rate is required"),
  highUnitRate: z.string().min(1, "High rate is required"),
  unitThreshold: z.string().min(1, "Threshold is required"),
  fixedCharges: z.string(),
}).refine((data) => {
    const prev = parseFloat(data.previousReading) || 0;
    const curr = parseFloat(data.currentReading) || 0;
    return curr >= prev;
}, {
    message: "Current reading cannot be less than previous reading",
    path: ["currentReading"]
});

export type CreateBillFormValues = z.infer<typeof createBillSchema>;

export const useCreateBill = (shopId: string | string[] | undefined) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [shop, setShop] = useState<any>(null);
  
  const form = useForm<CreateBillFormValues>({
    resolver: zodResolver(createBillSchema),
    defaultValues: {
      previousReading: "0",
      currentReading: "",
      lowUnitRate: "5",
      highUnitRate: "8",
      unitThreshold: "100",
      fixedCharges: "0",
    },
    mode: "onChange"
  });

  const { control, reset, handleSubmit: hookFormSubmit } = form;
  const formValues = useWatch({ control });

  const [calc, setCalc] = useState({
    units: 0,
    amount: 0,
    total: 0,
    activeTier: 'low' as 'low' | 'high'
  });

  useEffect(() => {
    const loadData = async () => {
        if (!shopId) {
            setLoading(false);
            return;
        }
        try {
            const [shopData, lastBill, settings] = await Promise.all([
                getShopById(Number(shopId)),
                getLastBill(Number(shopId)),
                getSettings()
            ]);
            
            setShop(shopData);
            
            reset({
                previousReading: lastBill ? lastBill.currentReading.toString() : "0",
                currentReading: "",
                lowUnitRate: settings.lowUnitRate.toString(),
                highUnitRate: settings.highUnitRate.toString(),
                unitThreshold: settings.unitThreshold.toString(),
                fixedCharges: settings.fixedCharges.toString(),
            });
        } catch (e) {
            console.error("Error loading data:", e);
            Alert.alert("Error", "Failed to load initial data");
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [shopId, reset]);

  useEffect(() => {
    const prev = parseFloat(formValues.previousReading || "0") || 0;
    const curr = parseFloat(formValues.currentReading || "0") || 0;
    const lowRate = parseFloat(formValues.lowUnitRate || "0") || 0;
    const highRate = parseFloat(formValues.highUnitRate || "0") || 0;
    const threshold = parseFloat(formValues.unitThreshold || "100") || 100;
    const fixed = parseFloat(formValues.fixedCharges || "0") || 0;

    const units = Math.max(0, curr - prev);
    
    let amount = 0;
    let activeTier: 'low' | 'high' = 'low';

    if (units <= threshold) {
        amount = units * lowRate;
        activeTier = 'low';
    } else {
        amount = units * highRate;
        activeTier = 'high';
    }

    const total = amount + fixed;

    setCalc({ units, amount, total, activeTier });
  }, [formValues]);

  const onSubmit = async (data: CreateBillFormValues) => {
    setSubmitting(true);
    try {
        const prev = parseFloat(data.previousReading);
        const curr = parseFloat(data.currentReading);
        const lowRate = parseFloat(data.lowUnitRate);
        const highRate = parseFloat(data.highUnitRate);
        const threshold = parseFloat(data.unitThreshold);
        const fixed = parseFloat(data.fixedCharges);

        await createBill({
            shopId: Number(shopId),
            readingDate: new Date(),
            previousReading: prev,
            currentReading: curr,
            unitsConsumed: calc.units,
            unitThreshold: threshold,
            lowUnitRate: lowRate,
            highUnitRate: highRate,
            fixedCharges: fixed,
            totalAmount: calc.total,
            status: 'pending'
        });
        
        Alert.alert("Success", "Bill generated successfully!", [
            { text: "OK", onPress: () => router.back() }
        ]);
        
    } catch {
        Alert.alert("Error", "Failed to generate bill");
    } finally {
        setSubmitting(false);
    }
  };

  return {
    shop,
    loading,
    submitting,
    form, // Exporting full form object for Controller usage
    calc,
    submit: hookFormSubmit(onSubmit)
  };
};
