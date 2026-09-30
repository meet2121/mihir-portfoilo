export interface InvoiceItem { description: string; quantity: number; rate: number }
export interface InvoiceSample {
  id: string; label: string; vendor: string; invoiceNumber: string; invoiceDate: string;
  gstin: string; items: InvoiceItem[]; taxRate: number; statedSubtotal: number; statedTax: number; statedTotal: number;
}

export const invoiceSamples: InvoiceSample[] = [
  { id: 'inv-01', label: 'Sample Invoice 01 · Facilities', vendor: 'Northstar Facilities', invoiceNumber: 'NSF-2408-118', invoiceDate: '2026-08-18', gstin: '29ABCDE1234F1Z5', items: [{ description: 'Common area cleaning', quantity: 1, rate: 18500 }, { description: 'Cleaning supplies', quantity: 4, rate: 825 }], taxRate: 18, statedSubtotal: 21800, statedTax: 3924, statedTotal: 25724 },
  { id: 'inv-02', label: 'Sample Invoice 02 · Electrical', vendor: 'Bluegrid Electricals', invoiceNumber: 'BGE-0926-044', invoiceDate: '2026-09-04', gstin: '29PQRSX6789L1Z2', items: [{ description: 'LED fixtures', quantity: 12, rate: 460 }, { description: 'Installation', quantity: 1, rate: 2400 }], taxRate: 18, statedSubtotal: 7920, statedTax: 1425.6, statedTotal: 9345.6 },
  { id: 'inv-03', label: 'Sample Invoice 03 · Repair warning', vendor: 'Civic Plumbing Works', invoiceNumber: '', invoiceDate: '2026-09-14', gstin: '29LMNOP4567Q1Z8', items: [{ description: 'Pump repair', quantity: 1, rate: 7800 }, { description: 'Replacement valve', quantity: 2, rate: 1250 }], taxRate: 18, statedSubtotal: 10300, statedTax: 1800, statedTotal: 12100 },
];

export interface FinanceRow { month: string; revenue: number; expense: number; budget: number; category: string }
export const financeRows: FinanceRow[] = Array.from({ length: 12 }, (_, i) => {
  const revenue = 218000 + i * 3100 + (i % 3) * 2600;
  const base = 164000 + i * 1900 + (i % 4) * 3200;
  return { month: `2026-${String(i + 1).padStart(2, '0')}`, revenue, expense: i === 8 ? base + 46000 : base, budget: 178000 + i * 1200, category: i === 8 ? 'Repairs' : 'Operations' };
});

export const ledgerNames = ['Electricity Expense', 'Security Services', 'Water Expense', 'Repairs & Maintenance', 'Office Supplies', 'Housekeeping', 'Internet & Communication', 'Maintenance Income'] as const;
export interface LedgerExample { narration: string; ledger: string }
export const ledgerHistory: LedgerExample[] = [
  { narration: 'electricity bill july', ledger: 'Electricity Expense' }, { narration: 'bescom electricity charges june', ledger: 'Electricity Expense' },
  { narration: 'security guard salary july', ledger: 'Security Services' }, { narration: 'security agency monthly bill', ledger: 'Security Services' },
  { narration: 'water tanker payment block a', ledger: 'Water Expense' }, { narration: 'water supply tanker charges', ledger: 'Water Expense' },
  { narration: 'plumbing repair clubhouse', ledger: 'Repairs & Maintenance' }, { narration: 'lift repair service', ledger: 'Repairs & Maintenance' },
  { narration: 'office stationery purchase', ledger: 'Office Supplies' }, { narration: 'printer paper and pens', ledger: 'Office Supplies' },
  { narration: 'cleaning supplies purchase', ledger: 'Housekeeping' }, { narration: 'housekeeping monthly service', ledger: 'Housekeeping' },
  { narration: 'internet bill office', ledger: 'Internet & Communication' }, { narration: 'broadband charges august', ledger: 'Internet & Communication' },
  { narration: 'maintenance charge flat a101', ledger: 'Maintenance Income' }, { narration: 'monthly maintenance received', ledger: 'Maintenance Income' },
];
export const ledgerTransactions = [
  { id: 'TX-1001', date: '2026-08-05', narration: 'Electricity bill August', amount: 28450 },
  { id: 'TX-1002', date: '2026-08-07', narration: 'Security guard salary August', amount: 62000 },
  { id: 'TX-1003', date: '2026-08-11', narration: 'Water tanker payment Block B', amount: 8400 },
  { id: 'TX-1004', date: '2026-08-18', narration: 'Emergency pipe leakage work', amount: 5300 },
  { id: 'TX-1005', date: '2026-08-22', narration: 'A4 sheets and marker pens', amount: 1860 },
];
