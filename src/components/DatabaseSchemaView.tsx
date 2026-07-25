import React, { useState } from 'react';
import {
  Database,
  Code2,
  Copy,
  Check,
  ShieldCheck,
  Server,
  Layers,
  FileCode,
  Key,
  List,
  Terminal,
} from 'lucide-react';

export const DatabaseSchemaView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'postgres' | 'prisma' | 'middleware' | 'endpoints'>('postgres');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const postgresDDL = `-- =========================================================
-- LAWYERDESK AI - ENTERPRISE TENANT ISOLATION & RBAC DDL SCHEMA
-- Target Database: PostgreSQL 15+ / Cloud SQL / CockroachDB
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. LAW FIRMS (TENANTS) TABLE
CREATE TABLE law_firms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    plan VARCHAR(50) NOT NULL DEFAULT 'Enterprise Unlimited',
    storage_quota_gb INT NOT NULL DEFAULT 500,
    storage_used_gb NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended', 'Terminated')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for tenant queries
CREATE INDEX idx_law_firms_status ON law_firms(status) WHERE is_deleted = FALSE;

-- 2. BRANCHES TABLE
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID NOT NULL REFERENCES law_firms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    is_headquarters BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_branches_firm_id ON branches(firm_id);

-- 3. USERS & ADVOCATES TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID NOT NULL REFERENCES law_firms(id) ON DELETE RESTRICT,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    client_id UUID, -- For Client Portal users
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    bar_council_reg_no VARCHAR(100),
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'System Owner', 'System Administrator', 'Super Admin', 'Demo User',
        'Law Firm', 'Firm Admin', 'Senior Advocate', 'Senior Lawyer',
        'Associate Advocate', 'Associate', 'Junior Advocate', 'Junior',
        'Accounts Staff', 'Accounts', 'Office Staff', 'Staff',
        'Reception', 'Client Portal User', 'Client', 'External Counsel'
    )),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Deleted', 'Suspended', 'Locked')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID,
    is_demo_user BOOLEAN NOT NULL DEFAULT FALSE,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    lockout_until TIMESTAMPTZ,
    password_expired BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_firm_id ON users(firm_id);
CREATE INDEX idx_users_email ON users(email);

-- 4. ROLES & PERMISSIONS
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL
);

CREATE TABLE role_permissions (
    role VARCHAR(50) NOT NULL,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role, permission_id)
);

-- 5. SESSIONS TABLE
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    firm_id UUID NOT NULL REFERENCES law_firms(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45) NOT NULL,
    browser VARCHAR(100),
    os VARCHAR(100),
    device VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Terminated', 'Expired')),
    login_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_sessions_user_status ON sessions(user_id, status);

-- 6. REFRESH TOKENS TABLE
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL,
    performed_by UUID NOT NULL REFERENCES users(id),
    performed_by_name VARCHAR(255) NOT NULL,
    firm_id UUID REFERENCES law_firms(id),
    target_user_id UUID,
    target_user_name VARCHAR(255),
    ip_address VARCHAR(45) NOT NULL,
    details TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('SUCCESS', 'WARNING', 'FAILED')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_firm ON audit_logs(firm_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
`;

  const prismaSchema = `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserRole {
  SYSTEM_OWNER
  SYSTEM_ADMINISTRATOR
  DEMO_USER
  LAW_FIRM
  SENIOR_ADVOCATE
  ASSOCIATE_ADVOCATE
  JUNIOR_ADVOCATE
  ACCOUNTS_STAFF
  OFFICE_STAFF
  RECEPTION
  CLIENT_PORTAL_USER
}

enum AccountStatus {
  Active
  Inactive
  Deleted
  Suspended
  Locked
}

model LawFirm {
  id             String      @id @default(uuid()) @db.Uuid
  name           String
  code           String      @unique
  logoUrl        String?
  plan           String      @default("Enterprise Unlimited")
  storageQuotaGB Int         @default(500)
  storageUsedGB  Float       @default(0.0)
  status         String      @default("Active")
  isActive       Boolean     @default(true) @map("is_active")
  isDeleted      Boolean     @default(false) @map("is_deleted")
  deletedAt      DateTime?   @map("deleted_at")
  deletedBy      String?     @map("deleted_by") @db.Uuid
  createdAt      DateTime    @default(now()) @map("created_at")
  updatedAt      DateTime    @updatedAt @map("updated_at")

  users          User[]
  branches       Branch[]
  sessions       Session[]
  auditLogs      AuditLog[]

  @@map("law_firms")
}

model Branch {
  id             String    @id @default(uuid()) @db.Uuid
  firmId         String    @map("firm_id") @db.Uuid
  name           String
  city           String
  address        String
  isHeadquarters Boolean   @default(false) @map("is_headquarters")

  firm           LawFirm   @relation(fields: [firmId], references: [id], onDelete: Cascade)
  users          User[]

  @@map("branches")
}

model User {
  id                  String        @id @default(uuid()) @db.Uuid
  firmId              String        @map("firm_id") @db.Uuid
  branchId            String?       @map("branch_id") @db.Uuid
  clientId            String?       @map("client_id") @db.Uuid
  name                String
  email               String        @unique
  passwordHash        String        @map("password_hash")
  phone               String?
  barCouncilRegNo     String?       @map("bar_council_reg_no")
  role                UserRole
  status              AccountStatus @default(Active)
  isActive            Boolean       @default(true) @map("is_active")
  isDeleted           Boolean       @default(false) @map("is_deleted")
  deletedAt           DateTime?     @map("deleted_at")
  deletedBy           String?       @map("deleted_by") @db.Uuid
  isDemoUser          Boolean       @default(false) @map("is_demo_user")
  failedLoginAttempts Int           @default(0) @map("failed_login_attempts")
  lockoutUntil        DateTime?     @map("lockout_until")
  createdAt           DateTime      @default(now()) @map("created_at")
  updatedAt           DateTime      @updatedAt @map("updated_at")

  firm                LawFirm       @relation(fields: [firmId], references: [id])
  branch              Branch?       @relation(fields: [branchId], references: [id])
  sessions            Session[]
  auditLogs           AuditLog[]    @relation("PerformedBy")

  @@map("users")
}

model Session {
  id         String    @id @default(uuid()) @db.Uuid
  userId     String    @map("user_id") @db.Uuid
  firmId     String    @map("firm_id") @db.Uuid
  tokenHash  String    @unique @map("token_hash")
  ipAddress  String    @map("ip_address")
  browser    String?
  os         String?
  device     String?
  status     String    @default("Active")
  loginTime  DateTime  @default(now()) @map("login_time")
  logoutTime DateTime? @map("logout_time")

  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  firm       LawFirm   @relation(fields: [firmId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model AuditLog {
  id              String   @id @default(uuid()) @db.Uuid
  eventType       String   @map("event_type")
  performedBy     String   @map("performed_by") @db.Uuid
  performedByName String   @map("performed_by_name")
  firmId          String?  @map("firm_id") @db.Uuid
  ipAddress       String   @map("ip_address")
  details         String
  status          String
  timestamp       DateTime @default(now())

  performer       User     @relation("PerformedBy", fields: [performedBy], references: [id])
  firm            LawFirm? @relation(fields: [firmId], references: [id])

  @@map("audit_logs")
}
`;

  const middlewareCode = `// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    firmId: string;
    isDemoUser: boolean;
  };
}

// 1. JWT Authentication Guard
export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing or expired' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Check database to ensure account was NOT deactivated / soft-deleted after token issuance
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, isActive: true, isDeleted: true, status: true, firmId: true, role: true, isDemoUser: true }
    });

    if (!user || user.isDeleted || !user.isActive || user.status !== 'Active') {
      return res.status(403).json({
        error: 'Your account has been deactivated. Please contact the System Administrator.'
      });
    }

    req.user = {
      id: user.id,
      email: payload.email,
      role: user.role,
      firmId: user.firmId,
      isDemoUser: user.isDemoUser
    };

    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired authentication session token' });
  }
}

// 2. Strict Tenant Data Isolation Filter Middleware
export function enforceTenantIsolation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthenticated session' });
  }

  // System Owners & Admins can access all tenants
  if (['SYSTEM_OWNER', 'SYSTEM_ADMINISTRATOR'].includes(req.user.role)) {
    return next();
  }

  // Attach strict firm tenant filter parameter to database query contexts
  (req as any).tenantFilter = {
    firmId: req.user.firmId,
    isDeleted: false,
    isDemo: req.user.isDemoUser
  };

  next();
}

// 3. RBAC Role Requirement Guard
export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions for this legal action' });
    }
    next();
  };
}
`;

  const apiEndpointsCode = `// src/routes/authRoutes.ts
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { validatePasswordPolicy } from '../lib/authEngine';

const router = Router();

// PUBLIC REGISTRATION IS PERMANENTLY DISABLED
router.post('/register', (req, res) => {
  return res.status(403).json({
    error: 'Public account self-registration is disabled. Accounts must be provisioned by System Administrator.'
  });
});

// LOGIN ENDPOINT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  // Check Account Status & Deactivation
  if (user.isDeleted || !user.isActive || user.status === 'Deleted') {
    return res.status(403).json({
      error: 'Your account has been deactivated. Please contact the System Administrator.'
    });
  }

  if (user.status === 'Suspended') {
    return res.status(403).json({
      error: 'Your Law Firm account or advocate access is currently suspended.'
    });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    // Increment failed login counter
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: { increment: 1 } }
    });
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  // Reset failed login counter on success
  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0 }
  });

  // Issue Access & Refresh Tokens
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email, role: user.role, firmId: user.firmId },
    process.env.JWT_SECRET!,
    { expiresIn: '12h' }
  );

  return res.json({
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      firmId: user.firmId,
      isDemoUser: user.isDemoUser
    }
  });
});

export default router;
`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(label);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-black tracking-tight">Enterprise Database Schema & Auth Architecture</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Complete PostgreSQL DDL, Prisma ORM Schema, JWT Authentication Middleware, and Tenant Isolation Guards for LawyerDesk AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-800">
            PostgreSQL 15+ Schema Ready
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('postgres')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'postgres'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>PostgreSQL DDL Schema</span>
        </button>

        <button
          onClick={() => setActiveTab('prisma')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'prisma'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Prisma ORM Models</span>
        </button>

        <button
          onClick={() => setActiveTab('middleware')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'middleware'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Auth & Tenant Middleware</span>
        </button>

        <button
          onClick={() => setActiveTab('endpoints')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'endpoints'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Express Login Endpoints</span>
        </button>
      </div>

      {/* Code Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="flex items-center justify-between bg-slate-900/90 px-4 py-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>
              {activeTab === 'postgres' && 'schema.sql (PostgreSQL DDL)'}
              {activeTab === 'prisma' && 'schema.prisma (Prisma ORM)'}
              {activeTab === 'middleware' && 'authMiddleware.ts (Express Guard)'}
              {activeTab === 'endpoints' && 'authRoutes.ts (Login & Auth Endpoints)'}
            </span>
          </div>

          <button
            onClick={() => {
              const content =
                activeTab === 'postgres'
                  ? postgresDDL
                  : activeTab === 'prisma'
                  ? prismaSchema
                  : activeTab === 'middleware'
                  ? middlewareCode
                  : apiEndpointsCode;
              copyToClipboard(content, activeTab);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-mono transition-all"
          >
            {copiedTab === activeTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTab === activeTab ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="p-6 text-xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed max-h-[600px]">
          {activeTab === 'postgres' && postgresDDL}
          {activeTab === 'prisma' && prismaSchema}
          {activeTab === 'middleware' && middlewareCode}
          {activeTab === 'endpoints' && apiEndpointsCode}
        </pre>
      </div>
    </div>
  );
};
