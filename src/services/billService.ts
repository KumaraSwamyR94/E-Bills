import { db } from "../db";
import { bills } from "../db/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export const getLastBill = async (shopId: number) => {
    try {
        const lastBill = await db.select()
            .from(bills)
            .where(eq(bills.shopId, shopId))
            .orderBy(desc(bills.readingDate))
            .limit(1);
        return lastBill[0];
    } catch (error) {
        console.error("Error fetching last bill:", error);
        return null;
    }
};

export const createBill = async (data: typeof bills.$inferInsert) => {
    try {
        const result = await db.insert(bills).values(data).returning();
        return result[0];
    } catch (error) {
        console.error("Error creating bill:", error);
        throw error;
    }
};

export const getBillsByShop = async (shopId: number) => {
    try {
        return await db.select()
            .from(bills)
            .where(eq(bills.shopId, shopId))
            .orderBy(desc(bills.readingDate));
    } catch (error) {
        console.error("Error fetching bills:", error);
        return [];
    }
};

export const getDashboardStats = async () => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Current Month Revenue
        const currentMonthData = await db.select({
            totalRevenue: sql<number>`sum(${bills.totalAmount})`,
            billCount: sql<number>`count(${bills.id})`
        })
        .from(bills)
        .where(
            and(
                gte(bills.readingDate, startOfMonth),
                lte(bills.readingDate, endOfMonth)
            )
        );

        // Pending Bills
        const pendingData = await db.select({
            pendingAmount: sql<number>`sum(${bills.totalAmount})`,
            pendingCount: sql<number>`count(${bills.id})`
        })
        .from(bills)
        .where(eq(bills.status, 'pending'));

        return {
            currentMonthRevenue: currentMonthData[0]?.totalRevenue || 0,
            currentMonthBills: currentMonthData[0]?.billCount || 0,
            pendingAmount: pendingData[0]?.pendingAmount || 0,
            pendingBills: pendingData[0]?.pendingCount || 0,
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            currentMonthRevenue: 0,
            currentMonthBills: 0,
            pendingAmount: 0,
            pendingBills: 0,
        };
    }
};

export const getAllBills = async (filter?: string) => {
    try {
        if (!filter || filter === 'all') {
            return await db.select()
                .from(bills)
                .orderBy(desc(bills.readingDate));
        }
        return await db.select()
            .from(bills)
            .where(eq(bills.status, filter))
            .orderBy(desc(bills.readingDate));
    } catch (error) {
        console.error("Error fetching all bills:", error);
        return [];
    }
};

export const getBillById = async (id: number) => {
    try {
        const bill = await db.select().from(bills).where(eq(bills.id, id));
        return bill[0];
    } catch (error) {
        console.error("Error fetching bill:", error);
        return null;
    }
};

export const updateBillStatus = async (id: number, status: string) => {
    try {
        const result = await db.update(bills)
            .set({ status })
            .where(eq(bills.id, id))
            .returning();
        return result[0];
    } catch (error) {
        console.error("Error updating bill status:", error);
        throw error;
    }
};
