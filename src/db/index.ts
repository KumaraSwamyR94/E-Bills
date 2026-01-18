import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
// import migrations from "./migrations/migrations"; // We will generate this or use a manual pull

// For simplicity in this agentic context without running external generation commands easily, 
// I will use a simple "synchronize" approach or just basic SQL execution if migrations fail, 
// but let's try to stick to standard Drizzle if possible or use a manual table creation helper for the "Plan B".

// actually, for this environment, pure SQL table creation on startup is often more robust 
// than trying to get drizzle-kit generated migrations working without a separate process.
// But let's try to do it right.
// Since I cannot run `drizzle-kit generate` easily to produce the json/sql files needed for `useMigrations` 
// without the user installing the CLI and running it, I will create a helper to ensure tables exist.

import { shops, bills, settings } from './schema';
import { sql } from "drizzle-orm";

const expoDb = openDatabaseSync("billing.db");
export const db = drizzle(expoDb);

export const initializeDb = async () => {
    // Manually create tables if they don't exist to avoid needing 'drizzle-kit generate' in this restricted env
    // This is a "poor man's migration" for the agent context
    
    await expoDb.execAsync(`
        CREATE TABLE IF NOT EXISTS shops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shop_number TEXT NOT NULL UNIQUE,
            tenant_name TEXT NOT NULL,
            meter_id TEXT NOT NULL,
            contact_number TEXT,
            created_at INTEGER
        );
        CREATE TABLE IF NOT EXISTS bills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shop_id INTEGER NOT NULL REFERENCES shops(id),
            reading_date INTEGER NOT NULL,
            previous_reading REAL NOT NULL,
            current_reading REAL NOT NULL,
            units_consumed REAL NOT NULL,
            rate_per_unit REAL NOT NULL,
            fixed_charges REAL DEFAULT 0,
            total_amount REAL NOT NULL,
            bill_pdf_path TEXT,
            status TEXT DEFAULT 'pending',
            created_at INTEGER
        );
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT NOT NULL UNIQUE,
            value TEXT NOT NULL
        );
    `);

    // Migration for existing tables
    try {
        await expoDb.execAsync("ALTER TABLE bills ADD COLUMN status TEXT DEFAULT 'pending'");
        console.log("Migration: Added status column to bills");
    } catch (e: any) {
        // Ignore error if column already exists
        if (!e.message.includes("duplicate column name")) {
            console.log("Migration skipped or failed (likely already exists):", e.message);
        }
    }
    
    console.log("Database initialized");
};

export const resetDb = async () => {
    await expoDb.execAsync(`
        DROP TABLE IF EXISTS bills;
        DROP TABLE IF EXISTS shops;
        DROP TABLE IF EXISTS settings;
    `);
    await initializeDb();
    console.log("Database reset");
};
