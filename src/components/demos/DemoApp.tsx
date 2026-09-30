import { useMemo, useRef, useState } from 'preact/hooks';
import { invoiceSamples, financeRows, ledgerHistory, ledgerNames, ledgerTransactions, type FinanceRow, type LedgerExample } from '../../data/demoData';
import { analyseFinance, classifyLedger, money, runReconciliation, validateInvoice } from '../../demos/logic';
import { parseFinanceCsv, parseLedgerCsv } from '../../demos/csv';
import './demo.css';

type Slug = 'accounting-ai' | 'finsight-ai' | 'ledger-flash' | 'scrapeforge';
const stageMap: Record<Slug, string[]> = {
  'accounting-ai': ['Document', 'Extraction', 'Field detection', 'Validation', 'Accounting output'],
  'finsight-ai': ['Financial data', 'Normalise', 'Metrics', 'Risk rules', 'Explain'],
  'ledger-flash': ['Transaction', 'Normalise', 'Memory', 'Classify', 'Human review'],
  scrapeforge: ['Session ready', 'Navigate', 'Paginate', 'Normalise', 'Reconcile', 'Validate'],
};
const descriptions: Record<Slug, string[]> = {
  'accounting-ai': ['Select a safe synthetic document.', 'The sample text and table regions are read.', 'Values are converted to typed fields.', 'Arithmetic and required fields are checked.', 'A review-ready accounting record is produced.'],
  'finsight-ai': ['Load the sample or a valid CSV.', 'Dates and numeric values are standardised.', 'Revenue, expense, surplus and variance are computed.', 'Transparent thresholds generate risk findings.', 'Every finding shows its inputs and rule.'],
  'ledger-flash': ['Read id, date, narration and amount.', 'Clean case and punctuation for comparison.', 'Search previously approved examples first.', 'Use local features when memory has no strong match.', 'Approve or correct; the decision joins session memory.'],
  scrapeforge: ['Create a synthetic browser session.', 'Apply and verify the selected date range.', 'Extract 25-row pages with checkpoints.', 'Standardise dates, units and amounts.', 'Match old and new ERP records.', 'Check counts and assign a readiness grade.'],
};

function Pipeline({ slug, active, onSelect }: { slug: Slug; active: number; onSelect: (i: number) => void }) {
  return <div class="demo-pipeline" aria-label="Processing pipeline">
    {stageMap[slug].map((stage, i) => <button key={stage} type="button" class={`demo-pipeline__node ${i <= active ? 'is-done' : ''} ${i === active ? 'is-active' : ''}`} onClick={() => onSelect(i)} aria-current={i === active ? 'step' : undefined}>
      <span>{String(i + 1).padStart(2, '0')}</span>{stage}
    </button>)}
  </div>;
}

function Shell({ slug, active, setActive, children }: { slug: Slug; active: number; setActive: (i: number) => void; children: preact.ComponentChildren }) {
  return <div class="demo-app">
    <Pipeline slug={slug} active={active} onSelect={setActive} />
    <div class="stage-inspector" role="status"><span class="status-dot" data-status={active >= stageMap[slug].length - 1 ? 'ok' : 'live'}></span><div><strong>{stageMap[slug][active]}</strong><p>{descriptions[slug][active]}</p></div></div>
    {children}
  </div>;
}

function AccountingDemo() {
  const [sampleIndex, setSampleIndex] = useState(0), [active, setActive] = useState(0), [ran, setRan] = useState(false);
  const sample = invoiceSamples[sampleIndex], result = validateInvoice(sample);
  const run = () => { setRan(true); setActive(stageMap['accounting-ai'].length - 1); };
  return <Shell slug="accounting-ai" active={active} setActive={setActive}>
    <div class="demo-controls"><label>Demo document<select value={sampleIndex} onChange={(e) => { setSampleIndex(Number((e.currentTarget as HTMLSelectElement).value)); setRan(false); setActive(0); }}>{invoiceSamples.map((s, i) => <option key={s.id} value={i}>{s.label}</option>)}</select></label><button class="demo-button" type="button" onClick={run}>Process document</button><button class="demo-button secondary" type="button" onClick={() => { setSampleIndex(0); setRan(false); setActive(0); }}>Reset</button></div>
    <div class="demo-grid">
      <article class="document-preview" aria-label="Synthetic invoice preview"><div class="document-preview__top"><strong>{sample.vendor}</strong><span>SYNTHETIC INVOICE</span></div><dl><div><dt>Invoice</dt><dd>{sample.invoiceNumber || '—'}</dd></div><div><dt>Date</dt><dd>{sample.invoiceDate}</dd></div><div><dt>GSTIN</dt><dd>{sample.gstin}</dd></div></dl><table><caption class="visually-hidden">Synthetic invoice line items</caption><thead><tr><th scope="col">Item</th><th scope="col">Qty</th><th scope="col">Rate</th><th scope="col">Amount</th></tr></thead><tbody>{sample.items.map((item) => <tr key={item.description}><td>{item.description}</td><td>{item.quantity}</td><td>{money(item.rate)}</td><td>{money(item.quantity * item.rate)}</td></tr>)}</tbody></table><p class="document-total">Written total <strong>{money(sample.statedTotal)}</strong></p></article>
      <div class="result-panel" aria-live="polite">{ran ? <><div class={`verdict ${result.status === 'PASS' ? 'ok' : 'warn'}`}><span>{result.status}</span><strong>{result.checks.filter((c) => c.pass).length}/{result.checks.length} checks passed</strong></div><dl class="metrics"><div><dt>Vendor</dt><dd>{sample.vendor}</dd></div><div><dt>Subtotal</dt><dd>{money(result.subtotal)}</dd></div><div><dt>Tax</dt><dd>{money(result.tax)}</dd></div><div><dt>Total</dt><dd>{money(result.total)}</dd></div></dl><ul class="check-list">{result.checks.map((c) => <li class={c.pass ? 'ok' : 'warn'}><span>{c.pass ? '✓' : '!'}</span><div><strong>{c.label}</strong><p>{c.detail}</p></div></li>)}</ul></> : <Empty text="Choose a document and process it. The arithmetic checks are calculated in your browser." />}</div>
    </div>
  </Shell>;
}

function FinSightDemo() {
  const [rows, setRows] = useState<FinanceRow[]>(financeRows), [active, setActive] = useState(0), [ran, setRan] = useState(false), [error, setError] = useState(''); const input = useRef<HTMLInputElement>(null);
  const result = useMemo(() => analyseFinance(rows), [rows]);
  const upload = async (file?: File) => { if (!file) return; try { const parsed = parseFinanceCsv(await file.text()); setRows(parsed); setError(''); setRan(false); setActive(0); } catch (e) { setError(e instanceof Error ? e.message : 'Could not read the CSV.'); } };
  return <Shell slug="finsight-ai" active={active} setActive={setActive}><div class="demo-controls"><button class="demo-button" type="button" onClick={() => { setRows(financeRows); setRan(true); setActive(4); setError(''); }}>Use sample dataset</button><button class="demo-button secondary" type="button" onClick={() => input.current?.click()}>Upload CSV</button><input ref={input} class="visually-hidden" type="file" accept=".csv,text/csv" onChange={(e) => upload((e.currentTarget as HTMLInputElement).files?.[0])} /><button class="demo-button secondary" type="button" onClick={() => { setRan(true); setActive(4); }}>Analyse {rows.length} months</button><button class="demo-button secondary" type="button" onClick={() => { setRows(financeRows); setRan(false); setActive(0); setError(''); if (input.current) input.current.value = ''; }}>Reset</button></div>{error && <p class="demo-error" role="alert">{error}</p>}
    {ran ? <><div class="metric-grid"><Metric label="Revenue" value={money(result.revenue)} /><Metric label="Expenses" value={money(result.expenses)} /><Metric label="Surplus" value={money(result.surplus)} /><Metric label="Budget variance" value={`${result.variancePct.toFixed(1)}%`} /><Metric label="Surplus margin" value={`${result.margin.toFixed(1)}%`} /><Metric label="Health score" value={`${result.health}/100`} /></div><div class="demo-grid"><div class="bar-chart" role="img" aria-label="Monthly expense bars with budget markers. Values are listed beside each bar.">{rows.map((r) => { const max = Math.max(...rows.map((x) => Math.max(x.expense, x.budget))); return <div class="bar-chart__row" key={r.month}><span>{r.month.slice(5)}</span><div><i style={{ width: `${r.expense / max * 100}%` }}></i><b style={{ left: `${r.budget / max * 100}%` }} title={`Budget ${money(r.budget)}`}></b></div><strong>{money(r.expense)}</strong></div>; })}</div><div class="risk-list"><h3>Explainable risks</h3>{result.risks.length ? result.risks.map((risk) => <details key={risk.title}><summary>{risk.title}</summary><dl><div><dt>Observed</dt><dd>{risk.observed}</dd></div><div><dt>Baseline</dt><dd>{risk.baseline}</dd></div><div><dt>Difference</dt><dd>{risk.difference}</dd></div></dl><p><strong>Rule used:</strong> {risk.rule}</p></details>) : <Empty text="No threshold-based risks detected." />}</div></div></> : <Empty text="Load the synthetic dataset or upload a CSV. Results are calculated locally and every flag exposes its rule." />}
  </Shell>;
}

function LedgerDemo() {
  const [memory, setMemory] = useState<LedgerExample[]>(ledgerHistory), [transactions, setTransactions] = useState(ledgerTransactions), [active, setActive] = useState(0), [ran, setRan] = useState(false), [corrections, setCorrections] = useState<Record<string, string>>({}), [message, setMessage] = useState(''), [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const decisions = transactions.map((tx) => ({ ...tx, ...classifyLedger(tx.narration, memory) }));
  const record = (narration: string, ledger: string) => { setMemory((m) => [...m, { narration, ledger }]); setMessage(`Human correction recorded. Session memory now contains ${memory.length + 1} examples.`); };
  const upload = async (file?: File) => { if (!file) return; try { const parsed = parseLedgerCsv(await file.text()); setTransactions(parsed); setError(''); setRan(false); setActive(0); } catch(e) { setError(e instanceof Error ? e.message : 'Could not read the CSV.'); } };
  const reset = () => { setMemory(ledgerHistory); setTransactions(ledgerTransactions); setRan(false); setActive(0); setCorrections({}); setMessage(''); setError(''); if (input.current) input.current.value = ''; };
  return <Shell slug="ledger-flash" active={active} setActive={setActive}><div class="demo-controls"><button class="demo-button" type="button" onClick={() => { setTransactions(ledgerTransactions); setRan(true); setActive(4); setMessage(''); setError(''); }}>Classify sample transactions</button><button class="demo-button secondary" type="button" onClick={() => input.current?.click()}>Upload CSV</button><input ref={input} class="visually-hidden" type="file" accept=".csv,text/csv" onChange={(e) => upload((e.currentTarget as HTMLInputElement).files?.[0])}/><button class="demo-button secondary" type="button" onClick={() => {setRan(true);setActive(4)}}>Classify {transactions.length} rows</button><button class="demo-button secondary" type="button" onClick={reset}>Reset</button><span class="control-note">Session memory: <strong>{memory.length}</strong> approved examples</span></div>
    {error && <p class="demo-error" role="alert">{error}</p>}{message && <p class="demo-success" role="status">{message}</p>}{ran ? <div class="table-wrap"><table class="data-table"><caption class="visually-hidden">Ledger classification recommendations and human-review controls</caption><thead><tr><th scope="col">Transaction</th><th scope="col">Recommendation</th><th scope="col">Confidence</th><th scope="col">Human review</th></tr></thead><tbody>{decisions.map((d) => <tr key={d.id}><td><strong>{d.narration}</strong><small>{d.id} · {money(d.amount)}</small></td><td><strong>{d.ledger}</strong><small>{d.reason}</small><span class="source-tag">{d.source}</span></td><td><span class={`confidence ${d.confidence < 60 ? 'low' : ''}`}><i style={{ width: `${d.confidence}%` }}></i></span><small>{d.confidence}%</small></td><td><div class="review-controls"><button type="button" onClick={() => record(d.narration, d.ledger)}>Approve</button><select aria-label={`Change ledger for ${d.narration}`} value={corrections[d.id] || d.ledger} onChange={(e) => setCorrections({ ...corrections, [d.id]: (e.currentTarget as HTMLSelectElement).value })}>{ledgerNames.map((l) => <option key={l}>{l}</option>)}</select><button type="button" onClick={() => record(d.narration, corrections[d.id] || d.ledger)}>Change</button></div></td></tr>)}</tbody></table></div> : <Empty text="Run the sample or upload CSV. Recommendations come from token similarity and transparent local keyword features—not an external API." />}
  </Shell>;
}

function ScrapeForgeDemo() {
  const [from, setFrom] = useState('2026-01-01'), [to, setTo] = useState('2026-09-30'), [active, setActive] = useState(0), [running, setRunning] = useState(false), [result, setResult] = useState<ReturnType<typeof runReconciliation> | null>(null), [error, setError] = useState('');
  const run = async () => { if (from > to) { setError('Start date must be before the end date.'); return; } setError(''); setRunning(true); setResult(null); for (let i = 0; i < stageMap.scrapeforge.length; i++) { setActive(i); await new Promise((r) => setTimeout(r, 260)); } setResult(runReconciliation(from, to)); setRunning(false); };
  return <Shell slug="scrapeforge" active={active} setActive={setActive}><div class="demo-controls"><label>From<input type="date" value={from} onInput={(e) => setFrom((e.currentTarget as HTMLInputElement).value)} /></label><label>To<input type="date" value={to} onInput={(e) => setTo((e.currentTarget as HTMLInputElement).value)} /></label><button class="demo-button" type="button" onClick={run} disabled={running}>{running ? 'Automation running…' : 'Run automation'}</button><button class="demo-button secondary" type="button" disabled={running} onClick={() => { setFrom('2026-01-01'); setTo('2026-09-30'); setActive(0); setResult(null); setError(''); }}>Reset</button></div>{error && <p class="demo-error" role="alert">{error}</p>}
    <div class="demo-grid"><div class="fake-browser" aria-label="Synthetic legacy ERP"><div class="fake-browser__bar"><i></i><i></i><i></i><span>ledgerlegacy.demo / receipts</span></div><div class="fake-browser__body"><div class="fake-nav">Reports <b>Receipts</b> Reconciliation</div><div class="fake-report"><div><strong>Receipts report</strong><span>{from} → {to}</span></div><p>{running ? `Checkpoint: stage ${active + 1}/${stageMap.scrapeforge.length}` : result ? `${result.extracted} rows collected across ${result.pages} pages` : 'Ready for a synthetic extraction run.'}</p><div class="skeleton-lines">{[1,2,3,4,5].map((n) => <i key={n} style={{ width: `${92 - n * 5}%` }}></i>)}</div></div></div></div><div class="result-panel" aria-live="polite">{result ? <><div class={`verdict ${result.grade === 'Ready' ? 'ok' : 'warn'}`}><span>{result.grade}</span><strong>{result.rate.toFixed(1)}% exact match rate</strong></div><dl class="metrics"><div><dt>Extracted</dt><dd>{result.extracted}</dd></div><div><dt>Normalised</dt><dd>{result.normalised}</dd></div><div><dt>Duplicates</dt><dd>{result.duplicates}</dd></div><div><dt>Matched</dt><dd>{result.matched}</dd></div><div><dt>Unmatched</dt><dd>{result.unmatched}</dd></div><div><dt>Checkpoints</dt><dd>{result.pages}</dd></div></dl><p class="result-note">Unmatched = {result.mismatched} amount mismatch · {result.missing} missing · {result.extra} extra.</p></> : <Empty text={running ? 'Filtering, paginating and processing the synthetic records…' : 'Choose a date range to run real filtering, de-duplication and reconciliation.'} />}</div></div>
  </Shell>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div class="metric"><span>{label}</span><strong>{value}</strong></div>; }
function Empty({ text }: { text: string }) { return <div class="empty-state"><span>◇</span><p>{text}</p></div>; }
export default function DemoApp({ slug }: { slug: Slug }) {
  if (slug === 'accounting-ai') return <AccountingDemo />;
  if (slug === 'finsight-ai') return <FinSightDemo />;
  if (slug === 'ledger-flash') return <LedgerDemo />;
  return <ScrapeForgeDemo />;
}
