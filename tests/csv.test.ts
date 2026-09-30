import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFinanceCsv, parseLedgerCsv } from '../src/demos/csv.ts';

test('FinSight parses valid numeric rows', () => {
  const rows = parseFinanceCsv('month,revenue,expense,budget,category\n2026-01,100000,70000,75000,Operations');
  assert.deepEqual(rows[0], { month: '2026-01', revenue: 100000, expense: 70000, budget: 75000, category: 'Operations' });
});

test('FinSight rejects missing columns, empty data and invalid numbers', () => {
  assert.throws(() => parseFinanceCsv('month,revenue\n2026-01,100000'), /Required columns/);
  assert.throws(() => parseFinanceCsv('month,revenue,expense,budget'), /no data rows/);
  assert.throws(() => parseFinanceCsv('month,revenue,expense,budget\n2026-01,100000,nope,75000'), /invalid number/);
});

test('Ledger Flash parses valid rows and rejects incomplete uploads', () => {
  const rows = parseLedgerCsv('Transaction ID,Date,Narration,Amount\nT-1,2026-09-01,Internet bill,2400');
  assert.equal(rows[0].amount, 2400);
  assert.equal(rows[0].narration, 'Internet bill');
  assert.throws(() => parseLedgerCsv('Transaction ID,Date,Narration\nT-1,2026-09-01,Internet bill'), /Required columns/);
  assert.throws(() => parseLedgerCsv('Transaction ID,Date,Narration,Amount'), /no transaction rows/);
});
