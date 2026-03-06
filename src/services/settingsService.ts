import { db } from "../db";
import { settings } from "../db/schema";
import { eq } from "drizzle-orm";

const DEFAULT_LOW_RATE = "5";
const DEFAULT_HIGH_RATE = "8";
const DEFAULT_THRESHOLD = "100";
const DEFAULT_FIXED = "0";

export const getSettings = async () => {
    try {
        const allSettings = await db.select().from(settings);
        const map: Record<string, string> = {};
        allSettings.forEach(s => map[s.key] = s.value);
        
        return {
            lowUnitRate: parseFloat(map['low_unit_rate'] || DEFAULT_LOW_RATE),
            highUnitRate: parseFloat(map['high_unit_rate'] || DEFAULT_HIGH_RATE),
            unitThreshold: parseFloat(map['unit_threshold'] || DEFAULT_THRESHOLD),
            fixedCharges: parseFloat(map['fixed_charges'] || DEFAULT_FIXED),
        };
    } catch (error) {
        console.error("Error fetching settings:", error);
        return { 
            lowUnitRate: 5, 
            highUnitRate: 8, 
            unitThreshold: 100, 
            fixedCharges: 0 
        };
    }
};

export const saveSetting = async (key: string, value: string) => {
    try {
        // Upsert logic manually since sqlite upsert syntax varies or use simple check
        const existing = await db.select().from(settings).where(eq(settings.key, key));
        if (existing.length > 0) {
            await db.update(settings).set({ value }).where(eq(settings.key, key));
        } else {
            await db.insert(settings).values({ key, value });
        }
    } catch (error) {
        console.error("Error saving setting:", error);
    }
};
