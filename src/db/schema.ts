import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const shops = sqliteTable('shops', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  shopNumber: text('shop_number').notNull().unique(),
  tenantName: text('tenant_name').notNull(),
  meterId: text('meter_id').notNull(),
  contactNumber: text('contact_number'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const bills = sqliteTable('bills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  shopId: integer('shop_id').references(() => shops.id).notNull(),
  readingDate: integer('reading_date', { mode: 'timestamp' }).notNull(),
  previousReading: real('previous_reading').notNull(),
  currentReading: real('current_reading').notNull(),
  unitsConsumed: real('units_consumed').notNull(),
  ratePerUnit: real('rate_per_unit').notNull(),
  fixedCharges: real('fixed_charges').default(0),
  totalAmount: real('total_amount').notNull(),
  billPdfPath: text('bill_pdf_path'),
  status: text('status').default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value').notNull(), // Store as string, parse as needed
});
