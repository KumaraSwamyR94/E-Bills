import { db } from "../db";
import { shops, bills } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { Shop } from "../utils/types";

export const getShops = async () => {
    try {
        const allShops = await db.select().from(shops).orderBy(desc(shops.createdAt));
        return allShops;
    } catch (error) {
        console.error("Error fetching shops:", error);
        return [];
    }
};

export const addShop = async (data: typeof shops.$inferInsert) => {
    try {
        const result = await db.insert(shops).values(data).returning();
        return result[0];
    } catch (error) {
        console.error("Error adding shop:", error);
        throw error;
    }
};

export const updateShop = async (id: number, data: Partial<Shop>) => {
    try {
        const result = await db.update(shops).set(data).where(eq(shops.id, id)).returning();
        return result[0];
    } catch (error) {
        console.error("Error editing shop:", error);
        throw error;
    }
};

export const deleteShop = async (id: number) => {
    try {
        await db.delete(bills).where(eq(bills.shopId, id));
        const result = await db.delete(shops).where(eq(shops.id, id)).returning();
        return result[0];
    } catch (error) {
        console.error("Error deleting shop:", error);
        throw error;
    }
};

export const getShopById = async (id: number) => {
    try {
        const shop = await db.select().from(shops).where(eq(shops.id, id));
        return shop[0];
    } catch (error) {
        console.error("Error fetching shop:", error);
        return null;
    }
};
