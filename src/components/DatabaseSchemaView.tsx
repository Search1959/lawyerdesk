import React, { useState } from 'react';
import {
  Database,
  Table,
  Terminal,
  Code,
  Layers,
  CheckCircle2,
  Play,
  Copy,
  Check,
  Server,
  FileCode,
} from 'lucide-react';

export const DatabaseSchemaView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tables' | 'prisma' | 'sql_runner'>('tables');
  const [queryInput, setQueryInput] = useState<string>(
    `SELECT m.id, m."caseNumber", m.title, m."riskScore", d."fileName", o."ocrEngineUsed"
FROM "Matters" m
JOIN "Documents" d ON d."matterId" = m.id
JOIN "OCRText" o ON o."documentId" = d.id
WHERE m."riskScore" > 30
ORDER BY m."riskScore" DESC;`
  );
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedPrisma, setCopiedPrisma] = useState(false);

  const prismaSchemaCode = `// LAWYER DESK AI - Enterprise Normalized PostgreSQL Schema
datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector]
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

enum Role {
  SUPER_ADMIN
  FIRM_ADMIN
  SENIOR_LAWYER
  ASSOCIATE
  JUNIOR
  STAFF
  RECEPTION
  ACCOUNTS
  CLIENT
  EXTERNAL_COUNSEL
}

model LawFirm {
  id             String       @id @default(uuid())
  name           String
  code           String       @unique
  plan           String
  storageQuotaGB Float
  storageUsedGB  Float
  branches       Branch[]
  departments    Department[]
  users          User[]
  clients        Client[]
  matters        Matter[]
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model Branch {
  id             String    @id @default(uuid())
  firmId         String
  firm           LawFirm   @relation(fields: [firmId], references: [id])
  name           String
  city           String
  address        String
  isHeadquarters Boolean   @default(false)
  users          User[]
  matters        Matter[]
}

model User {
  id              String      @id @default(uuid())
  name            String
  email           String      @unique
  role            Role
  firmId          String
  firm            LawFirm     @relation(fields: [firmId], references: [id])
  branchId        String
  branch          Branch      @relation(fields: [branchId], references: [id])
  barCouncilRegNo String?
  auditLogs       AuditLog[]
  createdAt       DateTime    @default(now())
}

model Client {
  id           String               @id @default(uuid())
  firmId       String
  firm         LawFirm              @relation(fields: [firmId], references: [id])
  name         String
  type         String
  email        String
  phone        String
  panNumber    String
  gstin        String?
  kycVerified  Boolean              @default(true)
  family       ClientFamilyMember[]
  matters      Matter[]
  createdAt    DateTime             @default(now())
}

model ClientFamilyMember {
  id        String   @id @default(uuid())
  clientId  String
  client    Client   @relation(fields: [clientId], references: [id])
  name      String
  relation  String
  phone     String
}

model Matter {
  id                String          @id @default(uuid())
  firmId            String
  firm              LawFirm         @relation(fields: [firmId], references: [id])
  branchId          String
  branch            Branch          @relation(fields: [branchId], references: [id])
  caseNumber        String          @unique
  title             String
  category          String
  court             String
  judgeName         String
  riskScore         Int             @default(0)
  clientId          String
  client            Client          @relation(fields: [clientId], references: [id])
  documents         Document[]
  hearings          Hearing[]
  courtOrders       CourtOrder[]
  timelineEvents    TimelineEvent[]
  createdAt         DateTime        @default(now())
}

model Document {
  id           String        @id @default(uuid())
  matterId     String
  matter       Matter        @relation(fields: [matterId], references: [id])
  fileName     String
  fileSize     String
  category     String
  ocrStatus    String        @default("Completed")
  pageCount    Int           @default(1)
  ocrText      OCRText?
  chunks       TextChunk[]
  createdAt    DateTime      @default(now())
}

model OCRText {
  id              String    @id @default(uuid())
  documentId      String    @unique
  document        Document  @relation(fields: [documentId], references: [id])
  extractedText   String
  confidenceScore Float
  ocrEngine       String    @default("PaddleOCR")
  language        String    @default("English")
}

model TextChunk {
  id              String         @id @default(uuid())
  documentId      String
  document        Document       @relation(fields: [documentId], references: [id])
  pageNumber      Int
  paragraphNumber Int
  text            String
  vectorEmbedding VectorEmbedding?
}

model VectorEmbedding {
  id        String    @id @default(uuid())
  chunkId   String    @unique
  chunk     TextChunk @relation(fields: [chunkId], references: [id])
  vector    Unsupported("vector(1536)")
}

model Hearing {
  id               String   @id @default(uuid())
  matterId         String
  matter           Matter   @relation(fields: [matterId], references: [id])
  date             DateTime
  courtName        String
  courtHallNo      String
  judgeName        String
  stage            String
  synopsis         String
}

model CourtOrder {
  id             String   @id @default(uuid())
  matterId       String
  matter         Matter   @relation(fields: [matterId], references: [id])
  orderDate      DateTime
  type           String
  summary        String
}

model AuditLog {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  action    String
  resource  String
  ipAddress String
  details   String
  timestamp DateTime @default(now())
}`;

  const databaseTables = [
    { name: 'LawFirms', category: 'Firm Management', records: 1, columns: ['id', 'name', 'code', 'plan', 'storageQuotaGB'] },
    { name: 'Branches', category: 'Firm Management', records: 3, columns: ['id', 'firmId', 'name', 'city', 'isHeadquarters'] },
    { name: 'Departments', category: 'Firm Management', records: 5, columns: ['id', 'name', 'code'] },
    { name: 'Users', category: 'RBAC Auth', records: 4, columns: ['id', 'name', 'email', 'role', 'barCouncilRegNo'] },
    { name: 'Roles', category: 'RBAC Auth', records: 10, columns: ['id', 'roleName', 'permissions'] },
    { name: 'Clients', category: 'Client CRM', records: 3, columns: ['id', 'name', 'type', 'panNumber', 'gstin'] },
    { name: 'ClientFamilyMembers', category: 'Client CRM', records: 2, columns: ['id', 'clientId', 'name', 'relation'] },
    { name: 'Matters', category: 'Litigation Core', records: 3, columns: ['id', 'caseNumber', 'title', 'court', 'riskScore'] },
    { name: 'CaseCategories', category: 'Litigation Core', records: 9, columns: ['id', 'categoryName', 'code'] },
    { name: 'CaseStatuses', category: 'Litigation Core', records: 5, columns: ['id', 'statusName', 'description'] },
    { name: 'Hearings', category: 'Cause List', records: 3, columns: ['id', 'matterId', 'date', 'courtHallNo', 'stage'] },
    { name: 'Judges', category: 'Court Directory', records: 8, columns: ['id', 'judgeName', 'courtName', 'designation'] },
    { name: 'Courts', category: 'Court Directory', records: 10, columns: ['id', 'courtName', 'jurisdiction', 'state'] },
    { name: 'Acts', category: 'Legal Knowledge', records: 24, columns: ['id', 'actName', 'year', 'category'] },
    { name: 'Sections', category: 'Legal Knowledge', records: 140, columns: ['id', 'actId', 'sectionNumber', 'summary'] },
    { name: 'Documents', category: 'Document Vault', records: 4, columns: ['id', 'matterId', 'fileName', 'category'] },
    { name: 'OCRText', category: 'PaddleOCR Engine', records: 4, columns: ['id', 'documentId', 'extractedText', 'confidenceScore'] },
    { name: 'TextChunks', category: 'RAG Vector Index', records: 12, columns: ['id', 'documentId', 'pageNumber', 'text'] },
    { name: 'VectorEmbeddings', category: 'RAG Vector Index', records: 12, columns: ['id', 'chunkId', 'vector'] },
    { name: 'TimelineEvents', category: 'Litigation Core', records: 5, columns: ['id', 'matterId', 'date', 'title'] },
    { name: 'CourtOrders', category: 'Orders Locker', records: 2, columns: ['id', 'matterId', 'orderDate', 'type'] },
    { name: 'Witnesses', category: 'Evidence Directory', records: 2, columns: ['id', 'matterId', 'name', 'role'] },
    { name: 'Tasks', category: 'Task Engine', records: 3, columns: ['id', 'matterId', 'title', 'priority'] },
    { name: 'Invoices', category: 'Financials & GST', records: 3, columns: ['id', 'invoiceNo', 'amountINR', 'gstAmountINR'] },
    { name: 'AuditLogs', category: 'Security & Audit', records: 3, columns: ['id', 'userId', 'action', 'resource', 'ipAddress'] },
  ];

  const handleExecuteSQL = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setQueryResult([
        {
          id: 'matter-1',
          caseNumber: 'CS(COMM) 420/2024',
          title: 'M/s Apex Infrastructure Ltd v. Union of India',
          riskScore: 32,
          fileName: 'Plaint_Commercial_Suit_Apex_v_UOI_Signed.pdf',
          ocrEngineUsed: 'PaddleOCR (Primary)',
        },
        {
          id: 'matter-2',
          caseNumber: 'CRA-S-1092/2023',
          title: 'State (NCT of Delhi) v. Dr. Ramesh K. Malhotra',
          riskScore: 68,
          fileName: 'FIR_CBI_RC_0042021A0012_Scanned.pdf',
          ocrEngineUsed: 'PaddleOCR (Primary)',
        },
      ]);
    }, 600);
  };

  const handleCopyPrisma = () => {
    navigator.clipboard.writeText(prismaSchemaCode);
    setCopiedPrisma(true);
    setTimeout(() => setCopiedPrisma(false), 2000);
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">PostgreSQL & Prisma ORM Schema Engine</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            28 Normalized Enterprise Tables • pgvector Hybrid Vector Store • SQL Query Execution Simulator
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-mono font-bold">
            PostgreSQL 16 + pgvector
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        {[
          { id: 'tables', label: `Normalized Tables (${databaseTables.length})`, icon: Table },
          { id: 'prisma', label: 'schema.prisma Model File', icon: FileCode },
          { id: 'sql_runner', label: 'SQL Query Console', icon: Terminal },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                activeTab === t.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Database Tables Grid */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {databaseTables.map((tbl, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-indigo-500 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                  {tbl.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{tbl.records} Rows</span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm font-mono flex items-center gap-1.5">
                <Table className="w-4 h-4 text-indigo-600" />
                <span>{tbl.name}</span>
              </h3>

              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                <strong>Columns:</strong> {tbl.columns.join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Prisma Schema Code Inspector */}
      {activeTab === 'prisma' && (
        <div className="p-6 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-mono text-xs font-bold text-indigo-400">/prisma/schema.prisma</span>
            <button
              onClick={handleCopyPrisma}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              {copiedPrisma ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrisma ? 'Copied' : 'Copy Prisma Schema'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-900 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto text-emerald-300/90 select-text">
            {prismaSchemaCode}
          </pre>
        </div>
      )}

      {/* Tab 3: SQL Console */}
      {activeTab === 'sql_runner' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-600" />
              <span>PostgreSQL SQL Query Execution Engine</span>
            </h2>
            <button
              onClick={handleExecuteSQL}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Execute Query</span>
            </button>
          </div>

          <textarea
            rows={5}
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            className="w-full p-4 font-mono text-xs rounded-xl bg-slate-950 text-emerald-400 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {queryResult && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Query Output ({queryResult.length} Rows Returned)</div>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-indigo-400">
                      {Object.keys(queryResult[0] || {}).map((k) => (
                        <th key={k} className="p-2">{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.map((row, i) => (
                      <tr key={i} className="border-b border-slate-900 hover:bg-slate-900/60">
                        {Object.values(row).map((val: any, idx) => (
                          <td key={idx} className="p-2">{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
