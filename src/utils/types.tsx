export type Shop = {
    id: number,
    shopNumber: string,
    tenantName: string,
    meterId: string,
    contactNumber: string,
}

export type Bill = {
    id: number,
    shopId: number,
    readingDate: Date,
    previousReading: number,
    currentReading: number,
    unitsConsumed: number,
    fixedCharges: number,
    totalAmount: number,
    status: 'pending' | 'paid' | 'cancelled',
}

export type Settings = {
    id: number,
    fixedCharges: number,
    unitsPerKw: number,
}

export type ExcelData = {
    shopNumber: string,
    tenantName: string,
    meterId: string,
    contactNumber: string,
    readingDate: string,
    previousReading: number,
    currentReading: number,
    unitsConsumed: number,
    fixedCharges: number,
    totalAmount: number,
}


