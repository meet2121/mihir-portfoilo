// Source of truth: /portfolio-content.md §5 and /interactive-demo-plan.md.
// Only verified facts. No metrics beyond those approved in portfolio-content.md.

/** Kind of work a pipeline stage does; drives colour and iconography in the pipeline visual. */
export type StageKind = 'input' | 'process' | 'ai' | 'validate' | 'human' | 'output';

export interface PipelineStage {
  key: string;
  label: string;
  kind: StageKind;
  /** One-line explanation shown when a stage is inspected (safe, production-level wording). */
  summary: string;
  input: string;
  output: string;
  concept: string;
}

export interface Project {
  slug: 'accounting-ai' | 'finsight-ai' | 'ledger-flash' | 'scrapeforge';
  name: string;
  tier: 'flagship' | 'featured';
  category: string;
  tagline: string;
  shortDescription: string;
  keyCapability: string;
  coreTech: string[];
  problem: string;
  demoFocus: string;
  /** System-level pipeline shown in the showcase and project pages. */
  pipeline: PipelineStage[];
  /** Optional screenshots, added later. Paths are relative to /assets/<slug>/. */
  media?: { src: string; alt: string }[];
}

export const ROLE_STATEMENT =
  'Designed and implemented the system end-to-end, including the AI logic, backend, frontend, data processing and automation workflows.';

export const CONFIDENTIALITY_NOTE =
  'This interactive demonstration is a simplified, synthetic representation inspired by an enterprise project. Production systems, company data and proprietary implementation details are not publicly exposed.';

export const projects: Project[] = [
  {
    slug: 'accounting-ai',
    name: 'Accounting AI',
    tier: 'flagship',
    category: 'Document Intelligence',
    tagline:
      'Document intelligence that turns invoices, handwritten registers and bank statements into verified, ERP-ready accounting data.',
    shortDescription:
      'Reads scanned and digital accounting documents, extracts transactions under strict contracts, validates the arithmetic and routes uncertainty to a human reviewer.',
    keyCapability: 'Zero-drop candidate ledger: every source region ends in exactly one state, so nothing is silently dropped.',
    coreTech: ['LangGraph', 'Gemini 2.5 Flash', 'RapidOCR · PaddleOCR', 'FastAPI', 'OpenPyXL'],
    problem:
      'Housing-society accounting runs on messy documents: handwritten petty-cash registers, scanned ledgers, bank statements, vendor bills. Keying them into the ERP is slow and error-prone, and naïve OCR-plus-LLM pipelines silently drop rows or invent numbers, which accounting can’t tolerate.',
    demoFocus: 'Invoice → accounting-ready record: real text extraction, field detection, line items, GST and arithmetic validation.',
    pipeline: [
      {
        key: 'document',
        label: 'Document',
        kind: 'input',
        summary: 'Scanned, handwritten or digital PDFs and images enter the pipeline with type, size and page checks.',
        input: 'PDF / JPG / PNG',
        output: 'Validated file + SHA-256 manifest',
        concept: 'Ingestion & validation',
      },
      {
        key: 'route',
        label: 'Route',
        kind: 'process',
        summary: 'Digital PDFs are read from their text layer; scanned pages are rendered once to a canonical image.',
        input: 'Validated file',
        output: 'Text layer or canonical page image',
        concept: 'Digital vs scanned routing',
      },
      {
        key: 'ocr',
        label: 'OCR ensemble',
        kind: 'ai',
        summary: 'The primary OCR engine always runs; a second engine and an enhancement variant run only on difficult pages.',
        input: 'Canonical page image',
        output: 'Lines, boxes, confidences (all kept as evidence)',
        concept: 'Selective OCR escalation',
      },
      {
        key: 'extract',
        label: 'Extraction',
        kind: 'ai',
        summary: 'Candidate rows are built from OCR evidence, then an LLM extracts fields under a strict per-purpose contract.',
        input: 'OCR evidence + candidate ledger',
        output: 'Structured rows with row ids',
        concept: 'Contract-based LLM extraction',
      },
      {
        key: 'verify',
        label: 'Verification',
        kind: 'validate',
        summary: 'Rows are verified by id against the source; a model can downgrade a row but never upgrade it.',
        input: 'Structured rows + page image',
        output: 'Verified / needs-review rows',
        concept: 'Evidence-grounded verification',
      },
      {
        key: 'reconcile',
        label: 'Reconciliation',
        kind: 'validate',
        summary: 'Amounts and dates are parsed strictly; written totals are checked against calculated ones and differences reported, never “fixed”.',
        input: 'Verified rows',
        output: 'Reconciliation checks',
        concept: 'Deterministic accounting',
      },
      {
        key: 'review',
        label: 'Human review',
        kind: 'human',
        summary: 'Low-confidence values are routed to a reviewer; approval is gated on resolved blocking items.',
        input: 'Review items',
        output: 'Approved record',
        concept: 'Human-in-the-loop',
      },
      {
        key: 'excel',
        label: 'Excel',
        kind: 'output',
        summary: 'A formula-safe workbook with evidence, reconciliation and audit sheets.',
        input: 'Approved record',
        output: 'ERP-ready XLSX',
        concept: 'Formula-safe export',
      },
    ],
  },
  {
    slug: 'finsight-ai',
    name: 'FinSight AI',
    tier: 'featured',
    category: 'Financial Intelligence',
    tagline: 'Explainable financial intelligence: statement validation, variance, risk and plain-language insights.',
    shortDescription:
      'Analyses financial statements for imbalances, material movements and risk, and explains every flag with its formula, inputs and threshold.',
    keyCapability: 'Every flag is explainable: formula, inputs and threshold travel with each finding.',
    coreTech: ['FastAPI', 'Pandas', 'Gemini 2.5 Flash', 'Rule engine', 'SheetJS · jsPDF'],
    problem:
      'Reviewing financial statements for imbalances, suspense balances, unusual movements and risk is manual, and findings are hard to explain to committees and non-accountants.',
    demoFocus: '24 months of synthetic data → real metrics, variance, anomaly detection, risk flags and insights.',
    pipeline: [
      {
        key: 'data',
        label: 'Financial data',
        kind: 'input',
        summary: 'Trial balance, balance sheet, P&L or income & expense statements as Excel/CSV.',
        input: 'XLSX / CSV',
        output: 'Raw rows',
        concept: 'Statement ingestion',
      },
      {
        key: 'parse',
        label: 'Parse',
        kind: 'process',
        summary: 'Rows are normalised and the statement type is detected from headers and content.',
        input: 'Raw rows',
        output: 'Typed rows + statement type',
        concept: 'Statement detection',
      },
      {
        key: 'classify',
        label: 'Classify',
        kind: 'ai',
        summary: 'Accounts are classified with weighted signals: name, parent group, siblings and normal balance.',
        input: 'Typed rows',
        output: 'Account categories + confidence',
        concept: 'Confidence-scored classification',
      },
      {
        key: 'validate',
        label: 'Validate',
        kind: 'validate',
        summary: 'Debit = credit, assets = liabilities + funds, and rule-based exceptions with severity.',
        input: 'Classified accounts',
        output: 'Checks + exceptions',
        concept: 'Accounting-equation & rule engine',
      },
      {
        key: 'risk',
        label: 'Risk',
        kind: 'process',
        summary: 'Materiality-aware variance, explainable ratios, risk level and a health score.',
        input: 'Checks + balances',
        output: 'Risk flags + health score',
        concept: 'Materiality & ratios',
      },
      {
        key: 'insights',
        label: 'Insights',
        kind: 'output',
        summary: 'An LLM summary in plain language, with a deterministic fallback.',
        input: 'Computed findings',
        output: 'Dashboard + report',
        concept: 'Explainable summary',
      },
    ],
  },
  {
    slug: 'ledger-flash',
    name: 'Ledger Flash',
    tier: 'featured',
    category: 'Intelligent Classification',
    tagline: 'Ledger classification that learns from reviewers, reusing known decisions and calling the LLM only for what’s new.',
    shortDescription:
      'Flags transactions posted to the wrong ledger, recommends the right one with confidence and reasoning, and learns from every review.',
    keyCapability: 'Retrieval before generation: narrations >90% similar to a reviewed decision are resolved without an LLM call.',
    coreTech: ['FastAPI', 'Gemini 2.5 Flash', 'Similarity matching', 'Google Sheets API'],
    problem:
      'Transactions often land in the wrong ledger head. Reviewing every posting by hand is slow, and sending every transaction to an LLM is costly and repeats decisions reviewers have already made.',
    demoFocus: 'Narration → ledger: normalisation, similarity search, local classifier, confidence, approve / change, learning memory.',
    pipeline: [
      {
        key: 'transactions',
        label: 'Transactions',
        kind: 'input',
        summary: 'Ledger master and transactions per society, as CSV, Excel or tabular PDF.',
        input: 'CSV / XLSX / PDF',
        output: 'Transactions with current ledger',
        concept: 'Tenant-isolated ingestion',
      },
      {
        key: 'match',
        label: 'Memory match',
        kind: 'process',
        summary: 'Each narration is compared with reviewer-confirmed decisions; a match above 90% similarity is reused.',
        input: 'Narration + current ledger',
        output: 'Reused decision or miss',
        concept: 'Similarity retrieval',
      },
      {
        key: 'classify',
        label: 'Classify',
        kind: 'ai',
        summary: 'Only novel transactions go to the LLM, in batches, with throttling, retries and a deterministic fallback.',
        input: 'Unmatched transactions',
        output: 'Suggested ledger + reason',
        concept: 'Resilient batch inference',
      },
      {
        key: 'confidence',
        label: 'Confidence',
        kind: 'validate',
        summary: 'Each suggestion carries a 0–100 confidence and a status: correct, possible misposting or low confidence.',
        input: 'Suggestion',
        output: 'Scored decision',
        concept: 'Confidence scoring',
      },
      {
        key: 'review',
        label: 'Human review',
        kind: 'human',
        summary: 'Reviewers approve, reject or correct; every action is audited.',
        input: 'Scored decisions',
        output: 'Confirmed ledger',
        concept: 'Human-in-the-loop',
      },
      {
        key: 'learn',
        label: 'Learning',
        kind: 'output',
        summary: 'Confirmed decisions become new memory, so repeated patterns skip the model next time.',
        input: 'Confirmed ledger',
        output: 'Updated memory',
        concept: 'Active learning',
      },
    ],
  },
  {
    slug: 'scrapeforge',
    name: 'ScrapeForge',
    tier: 'featured',
    category: 'Automation & Reconciliation',
    tagline: 'ERP-migration automation: reliable multi-year data extraction from legacy systems, then reconciliation you can trust.',
    shortDescription:
      'Automates extraction of multi-year financial reports from legacy ERPs with checkpoints and count validation, then reconciles them against the new system.',
    keyCapability: 'Extraction you can audit: verified filters, every page, row counts checked against the source’s own total.',
    coreTech: ['Playwright · Chromium', 'FastAPI', 'Pandas · RapidFuzz', 'WebSockets · noVNC'],
    problem:
      'When housing societies move to NoBrokerHood, years of financial records sit in legacy ERPs. Extracting them by hand is slow, and without systematic reconciliation nobody can be sure the migrated books agree.',
    demoFocus: 'Simulated legacy ERP → real filtering, pagination, extraction, normalisation, de-duplication and reconciliation.',
    pipeline: [
      {
        key: 'source',
        label: 'Source ERP',
        kind: 'input',
        summary: 'An authenticated session on the legacy system; the operator logs in, the automation adopts the session.',
        input: 'Legacy ERP session',
        output: 'Adopted browser session',
        concept: 'One browser, one session',
      },
      {
        key: 'automate',
        label: 'Automation',
        kind: 'process',
        summary: 'Navigation, financial year and date selection through the UI, with filters read back and verified.',
        input: 'Report + date range',
        output: 'Loaded, filtered report',
        concept: 'Browser automation',
      },
      {
        key: 'extract',
        label: 'Extraction',
        kind: 'process',
        summary: 'Every page is scraped and checkpointed; the row count must match the ERP’s own total.',
        input: 'Paginated table',
        output: 'Raw dataset + checkpoints',
        concept: 'Count-validated extraction',
      },
      {
        key: 'normalise',
        label: 'Normalise',
        kind: 'process',
        summary: 'Both systems’ reports are parsed into one canonical financial model.',
        input: 'Raw datasets',
        output: 'Canonical records',
        concept: 'Canonical financial model',
      },
      {
        key: 'reconcile',
        label: 'Reconcile',
        kind: 'validate',
        summary: 'Positions are matched and each difference classified: migration, system variation, presentation, roll-up or data error.',
        input: 'Canonical records (old vs new)',
        output: 'Matches + difference categories',
        concept: 'Explainable reconciliation',
      },
      {
        key: 'report',
        label: 'Readiness',
        kind: 'output',
        summary: 'A migration-readiness grade: Ready, Needs review or High risk.',
        input: 'Reconciliation results',
        output: 'Readiness report',
        concept: 'Migration readiness scoring',
      },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
