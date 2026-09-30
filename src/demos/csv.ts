import type { FinanceRow } from '../data/demoData';

export interface LedgerUploadRow {
  id: string;
  date: string;
  narration: string;
  amount: number;
}

const linesAndHeaders = (text: string) => {
  const lines = text.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  const headers = lines[0]?.split(',').map((header) => header.trim().toLowerCase()) ?? [];
  return { lines, headers };
};

export function parseFinanceCsv(text: string): FinanceRow[] {
  const { lines, headers } = linesAndHeaders(text);
  const required = ['month', 'revenue', 'expense', 'budget'];
  if (!required.every((header) => headers.includes(header))) {
    throw new Error('Required columns: month, revenue, expense, budget. Category is optional.');
  }

  const rows = lines.slice(1).filter(Boolean).map((line) => {
    const cells = line.split(',').map((cell) => cell.trim());
    const get = (name: string) => cells[headers.indexOf(name)];
    const numeric = ['revenue', 'expense', 'budget'].map(get);
    if (!get('month') || numeric.some((value) => value === '')) {
      throw new Error('CSV contains a missing month or number.');
    }
    const row = {
      month: get('month'),
      revenue: Number(numeric[0]),
      expense: Number(numeric[1]),
      budget: Number(numeric[2]),
      category: get('category') || 'General',
    };
    if ([row.revenue, row.expense, row.budget].some(Number.isNaN)) {
      throw new Error('CSV contains an invalid number.');
    }
    return row;
  });
  if (!rows.length) throw new Error('The CSV has no data rows.');
  return rows;
}

export function parseLedgerCsv(text: string): LedgerUploadRow[] {
  const { lines, headers } = linesAndHeaders(text);
  const required = ['transaction id', 'date', 'narration', 'amount'];
  if (!required.every((header) => headers.includes(header))) {
    throw new Error('Required columns: Transaction ID, Date, Narration, Amount.');
  }

  const rows = lines.slice(1).filter(Boolean).map((line) => {
    const cells = line.split(',').map((cell) => cell.trim());
    const get = (name: string) => cells[headers.indexOf(name)];
    const rawAmount = get('amount');
    const amount = Number(rawAmount);
    if (!get('transaction id') || !get('date') || !get('narration') || rawAmount === '' || Number.isNaN(amount)) {
      throw new Error('CSV contains an incomplete or invalid transaction.');
    }
    return { id: get('transaction id'), date: get('date'), narration: get('narration'), amount };
  });
  if (!rows.length) throw new Error('The CSV has no transaction rows.');
  return rows;
}
