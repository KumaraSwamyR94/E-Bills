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
  ratePerUnit: z.string().min(1, "Rate is required"),
  fixedCharges: z.string(),
  calculationMethod: z.enum(["ADD", "MAX"]),
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
      ratePerUnit: "10",
      fixedCharges: "0",
      calculationMethod: "ADD",
    },
    mode: "onChange"
  });

  const { control, reset, handleSubmit: hookFormSubmit } = form;
  const formValues = useWatch({ control });

  const [calc, setCalc] = useState({
    units: 0,
    amount: 0,
    total: 0
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
                ratePerUnit: settings.ratePerUnit.toString(),
                fixedCharges: settings.fixedCharges.toString(),
                calculationMethod: "ADD",
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
    const rate = parseFloat(formValues.ratePerUnit || "0") || 0;
    const fixed = parseFloat(formValues.fixedCharges || "0") || 0;

    const units = Math.max(0, curr - prev);
    const amount = units * rate;
    
    let total = 0;
    if (formValues.calculationMethod === 'MAX') {
        total = Math.max(amount, fixed);
    } else {
        // Default ADD
        total = amount + fixed;
    }

    setCalc({ units, amount, total });
  }, [formValues]);

  const onSubmit = async (data: CreateBillFormValues) => {
    setSubmitting(true);
    try {
        const prev = parseFloat(data.previousReading);
        const curr = parseFloat(data.currentReading);
        const rate = parseFloat(data.ratePerUnit);
        const fixed = parseFloat(data.fixedCharges);

        await createBill({
            shopId: Number(shopId),
            readingDate: new Date(),
            previousReading: prev,
            currentReading: curr,
            unitsConsumed: calc.units,
            ratePerUnit: rate,
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
