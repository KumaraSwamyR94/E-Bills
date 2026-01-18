import { File, Directory, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { db } from "../db";
import { bills, shops } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export const exportToExcel = async () => {
  try {
    // 1. Fetch all data
    const data = await db.select({
        billId: bills.id,
        shopNumber: shops.shopNumber,
        tenantName: shops.tenantName,
        readingDate: bills.readingDate,
        prevReading: bills.previousReading,
        currReading: bills.currentReading,
        units: bills.unitsConsumed,
        rate: bills.ratePerUnit,
        fixed: bills.fixedCharges,
        amount: bills.totalAmount,
        isPaid: bills.status
    })
    .from(bills)
    .innerJoin(shops, eq(bills.shopId, shops.id))
    .orderBy(desc(bills.readingDate));

    // 2. Format for Excel
    const formattedData = data.map(item => ({
        "Bill ID": item.billId,
        "Shop No": item.shopNumber,
        "Tenant": item.tenantName,
        "Date": new Date(item.readingDate).toLocaleDateString(),
        "Prev Reading": item.prevReading,
        "Curr Reading": item.currReading,
        "Units": item.units,
        "Rate": item.rate,
        "Fixed Charges": item.fixed,
        "Total Amount": item.amount,
        "Payment Status": item.isPaid
    }));

    // 3. Create Workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(wb, ws, "Bills");

    // 4. Write to file
    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    const cacheDirectory = new Directory(Paths.cache, "e-billing");
    const file = new File(cacheDirectory, `billing_history_${new Date().toISOString().split('T')[0]}.xlsx`);
    file.create({overwrite: true, intermediates: true});
    file.write(wbout, {encoding: 'base64'});

    // 5. Share
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Export Billing Data'
    });

  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};
