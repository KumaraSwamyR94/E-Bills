import { useState, useEffect } from "react";
import { getShops } from "../services/shopService";
import { getAllBills } from "../services/billService";

interface BillsHook {
    bills: any[];
    shopsMap: Record<number, string>;
    refreshing: boolean;
    loading: boolean;
    filter: string;
    onRefresh: () => void;
    onFilterChange: (filter: string) => void;
    loadData: (filter?: string) => void;
}

export const useBills = (): BillsHook => {
    const [bills, setBills] = useState<any[]>([]);
    const [shopsMap, setShopsMap] = useState<Record<number, string>>({});
    const [refreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const loadData = async (filter?: string) => {
        try {
      const [fetchedBills, fetchedShops] = await Promise.all([
        getAllBills(filter),
        getShops()
      ]);
      
      const shopsMapping: Record<number, string> = {};
      fetchedShops.forEach(shop => {
        shopsMapping[shop.id] = shop.shopNumber;
      });
      setShopsMap(shopsMapping);
      setBills(fetchedBills);
    } catch (error) {
      console.error("Failed to load history data", error);
    } finally {
      setLoading(false);
    }
    };
    
    const onRefresh = () => {
        loadData(filter);
    };
    
    const onFilterChange = (filter: string) => {
        setFilter(filter);
        loadData(filter);
    };

    useEffect(() => {
        loadData(filter);
    }, []);
    
    return {
        bills,
        shopsMap,
        refreshing,
        loading,
        filter,
        loadData,
        onRefresh,
        onFilterChange,
    };
}