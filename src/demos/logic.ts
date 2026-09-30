import type { FinanceRow, InvoiceSample, LedgerExample } from '../data/demoData';

export const money = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
export const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const tokens = (value: string) => new Set(normalise(value).split(' ').filter(Boolean));
export function similarity(a: string, b: string) {
  const aa = tokens(a), bb = tokens(b); const union = new Set([...aa, ...bb]);
  if (!union.size) return 0;
  return [...aa].filter((t) => bb.has(t)).length / union.size;
}

export function validateInvoice(invoice: InvoiceSample) {
  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const tax = subtotal * invoice.taxRate / 100;
  const total = subtotal + tax;
  const checks = [
    { label: 'Required fields', pass: Boolean(invoice.vendor && invoice.invoiceNumber && invoice.invoiceDate), detail: invoice.invoiceNumber ? 'Vendor, number and date detected' : 'Invoice number is missing' },
    { label: 'Line arithmetic', pass: Math.abs(subtotal - invoice.statedSubtotal) < 0.01, detail: `${money(subtotal)} calculated vs ${money(invoice.statedSubtotal)} stated` },
    { label: 'Tax consistency', pass: Math.abs(tax - invoice.statedTax) < 0.01, detail: `${invoice.taxRate}% produces ${money(tax)}; stated ${money(invoice.statedTax)}` },
    { label: 'Total consistency', pass: Math.abs(total - invoice.statedTotal) < 0.01, detail: `${money(total)} calculated vs ${money(invoice.statedTotal)} stated` },
  ];
  return { subtotal, tax, total, checks, status: checks.every((c) => c.pass) ? 'PASS' : 'WARNING' };
}

export function analyseFinance(rows: FinanceRow[]) {
  const revenue = rows.reduce((s, r) => s + r.revenue, 0), expenses = rows.reduce((s, r) => s + r.expense, 0), budget = rows.reduce((s, r) => s + r.budget, 0);
  const mean = expenses / Math.max(rows.length, 1); const variance = rows.reduce((s, r) => s + (r.expense - mean) ** 2, 0) / Math.max(rows.length, 1); const sd = Math.sqrt(variance);
  const risks = rows.flatMap((r) => {
    const z = sd ? (r.expense - mean) / sd : 0; const budgetVariance = r.budget ? (r.expense - r.budget) / r.budget : 0;
    const out = [] as { title: string; metric: string; observed: string; baseline: string; difference: string; rule: string }[];
    if (z > 2) out.push({ title: `Unusual expense · ${r.month}`, metric: 'Expense', observed: money(r.expense), baseline: money(mean), difference: `${((r.expense / mean - 1) * 100).toFixed(1)}% above average`, rule: 'Flag when z-score exceeds 2.0.' });
    if (budgetVariance > .1) out.push({ title: `Budget variance · ${r.month}`, metric: 'Expense vs budget', observed: money(r.expense), baseline: money(r.budget), difference: `${(budgetVariance * 100).toFixed(1)}% over budget`, rule: 'Flag when expense exceeds budget by more than 10%.' });
    return out;
  });
  const surplus = revenue - expenses, margin = revenue ? surplus / revenue * 100 : 0, variancePct = budget ? (expenses - budget) / budget * 100 : 0;
  const health = Math.max(0, Math.round(100 - Math.max(0, variancePct) * 1.5 - risks.length * 6));
  return { revenue, expenses, surplus, budget, margin, variancePct, health, risks };
}

const keywordMap: Record<string, string[]> = {
  'Electricity Expense': ['electricity', 'bescom', 'power'], 'Security Services': ['security', 'guard', 'agency'], 'Water Expense': ['water', 'tanker', 'supply'],
  'Repairs & Maintenance': ['repair', 'plumbing', 'pipe', 'leakage', 'lift'], 'Office Supplies': ['stationery', 'paper', 'pens', 'marker'], Housekeeping: ['cleaning', 'housekeeping', 'supplies'],
  'Internet & Communication': ['internet', 'broadband', 'wifi'], 'Maintenance Income': ['maintenance', 'received', 'charge'],
};
export function classifyLedger(narration: string, history: LedgerExample[]) {
  const ranked = history.map((h) => ({ ...h, score: similarity(narration, h.narration) })).sort((a, b) => b.score - a.score);
  const best = ranked[0];
  if (best && best.score >= .9) return { ledger: best.ledger, confidence: Math.round(72 + best.score * 27), source: 'review memory', reason: `Closest approved example: “${best.narration}” (${Math.round(best.score * 100)}% token similarity).` };
  const text = normalise(narration); const scores = Object.entries(keywordMap).map(([ledger, words]) => ({ ledger, hits: words.filter((w) => text.includes(w)) })).sort((a, b) => b.hits.length - a.hits.length);
  const picked = scores[0]; const confidence = picked.hits.length ? Math.min(91, 58 + picked.hits.length * 15) : 42;
  return { ledger: picked.hits.length ? picked.ledger : 'Repairs & Maintenance', confidence, source: 'local keyword model', reason: picked.hits.length ? `Matched local features: ${picked.hits.join(', ')}.` : 'No strong feature match; routed with low confidence for human review.' };
}

export interface Receipt { receipt: string; date: string; unit: string; amount: number; member: string }
export function makeLegacyReceipts(count = 125): Receipt[] {
  return Array.from({ length: count }, (_, i) => ({ receipt: `R-${24001 + i}`, date: `2026-${String(1 + (i % 9)).padStart(2, '0')}-${String(1 + (i * 7 % 27)).padStart(2, '0')}`, unit: `${String.fromCharCode(65 + i % 4)}-${101 + (i % 48)}`, amount: 2200 + (i % 7) * 350, member: `Resident ${String(i + 1).padStart(3, '0')}` }));
}
export function runReconciliation(from: string, to: string) {
  const source = makeLegacyReceipts().filter((r) => r.date >= from && r.date <= to);
  const withDuplicates = [...source, ...source.filter((_, i) => i < 3)];
  const unique = [...new Map(withDuplicates.map((r) => [r.receipt, r])).values()];
  const target = unique.filter((_, i) => i % 17 !== 0).map((r, i) => i % 23 === 0 ? { ...r, amount: r.amount + 125 } : r);
  target.push({ receipt: 'R-EXTRA-1', date: from, unit: 'D-404', amount: 3100, member: 'Resident Extra' });
  const targetById = new Map(target.map((r) => [r.receipt, r])); let matched = 0, mismatched = 0, missing = 0;
  unique.forEach((r) => { const found = targetById.get(r.receipt); if (!found) missing++; else if (found.amount !== r.amount || found.date !== r.date) mismatched++; else matched++; });
  const unmatched = mismatched + missing + 1; const rate = unique.length ? matched / unique.length * 100 : 100;
  return { extracted: withDuplicates.length, normalised: withDuplicates.length, duplicates: withDuplicates.length - unique.length, unique: unique.length, matched, mismatched, missing, extra: 1, unmatched, rate, grade: rate >= 96 ? 'Ready' : rate >= 88 ? 'Needs review' : 'High risk', pages: Math.ceil(withDuplicates.length / 25) };
}
