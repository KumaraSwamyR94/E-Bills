import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { getBillById, updateBillStatus } from "../services/billService";
import { getShopById } from "../services/shopService";
import { generateAndShareBillPdf } from "../services/pdfService";

export const useBillDetails = (id: string | string[] | undefined) => {
  const [bill, setBill] = useState<any>(null);
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    if(!id) return;
    try {
        const fetchedBill = await getBillById(Number(id));
        if (fetchedBill) {
            setBill(fetchedBill);
            const fetchedShop = await getShopById(fetchedBill.shopId);
            setShop(fetchedShop);
        }
    } catch (error) {
        console.error("Error loading details:", error);
    } finally {
        setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateStatus = async (status: 'paid' | 'cancelled') => {
    setActionLoading(true);
    try {
        await updateBillStatus(Number(id), status);
        Alert.alert("Success", `Bill marked as ${status}`);
        loadData(); // Reload to reflect changes
    } catch {
        Alert.alert("Error", "Could not update status");
    } finally {
        setActionLoading(false);
    }
  };

  const handleShare = async () => {
    if (!bill || !shop) return;
    setActionLoading(true);
    try {
        await generateAndShareBillPdf(shop, bill);
    } catch {
        Alert.alert("Error", "Failed to share PDF");
    } finally {
        setActionLoading(false);
    }
  };

  return {
    bill,
    shop,
    loading,
    actionLoading,
    handleUpdateStatus,
    handleShare
  };
};
