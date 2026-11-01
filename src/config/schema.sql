-- =====================================================================
-- CODEXNOVA PRODUCTION POSTGRESQL DATABASE SCHEMA
-- Compliance: India DPDP Act 2023 & GDPR
-- Multi-Tenant gVisor Cloud Compiler & Realtime Learning IDE
-- =====================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin', 'superadmin');
CREATE TYPE user_plan AS ENUM ('free', 'student_pro', 'pro', 'campus_license');
CREATE TYPE auth_provider_type AS ENUM ('email', 'google', 'github', 'guest');
CREATE TYPE run_status AS ENUM ('success', 'compile_error', 'runtime_error', 'timeout', 'oom_killed');
CREATE TYPE ai_feature_type AS ENUM ('fix_error', 'explain_concept', 'chat_assistant', 'flowchart_gen', 'quiz_gen');

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Argon2id hash (null for OAuth/Guest)
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'user' NOT NULL,
    plan user_plan DEFAULT 'free' NOT NULL,
    auth_provider auth_provider_type DEFAULT 'email' NOT NULL,
    provider_id VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    is_banned BOOLEAN DEFAULT FALSE NOT NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    two_factor_secret VARCHAR(255),
    country VARCHAR(3) DEFAULT 'IND', -- ISO-3166-1 alpha-3
    device_fingerprint VARCHAR(255),
    total_runs INTEGER DEFAULT 0 NOT NULL,
    ai_credits_used INTEGER DEFAULT 0 NOT NULL,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete for DPDP right to erasure
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_plan ON users(plan);
CREATE INDEX idx_users_last_active ON users(last_active_at DESC);

-- 2. USER SESSIONS & REFRESH TOKENS
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    refresh_token_hash VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(50),     -- 'Chrome', 'Firefox', 'Safari'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(refresh_token_hash);

-- 3. CODE PROJECTS (VIRTUAL FILE SYSTEM)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) DEFAULT 'Untitled Solution' NOT NULL,
    description TEXT,
    primary_language VARCHAR(50) NOT NULL,
    files_json JSONB NOT NULL DEFAULT '[]'::jsonb, -- Virtual multi-file tree
    stdin_content TEXT DEFAULT '',
    is_public BOOLEAN DEFAULT FALSE NOT NULL,
    share_slug VARCHAR(64) UNIQUE,
    view_count INTEGER DEFAULT 0 NOT NULL,
    fork_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_slug ON projects(share_slug);

-- 4. CODE EXECUTION RUNS AUDIT
CREATE TABLE code_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    language VARCHAR(50) NOT NULL,
    runtime_version VARCHAR(50) NOT NULL,
    status run_status NOT NULL,
    exit_code INTEGER NOT NULL,
    execution_time_ms INTEGER NOT NULL,
    memory_kb INTEGER NOT NULL,
    cpu_percent NUMERIC(5,2),
    is_sandboxed BOOLEAN DEFAULT TRUE NOT NULL,
    container_engine VARCHAR(30) DEFAULT 'gVisor-runsc',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_code_runs_user ON code_runs(user_id);
CREATE INDEX idx_code_runs_lang ON code_runs(language);
CREATE INDEX idx_code_runs_time ON code_runs(created_at DESC);

-- 5. AI INTERACTION & TOKEN QUOTA
CREATE TABLE ai_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    feature_type ai_feature_type NOT NULL,
    model_name VARCHAR(100) DEFAULT 'gemini-3.8-flash' NOT NULL,
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    latency_ms INTEGER NOT NULL,
    language VARCHAR(50),
    cached_hit BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_ai_user ON ai_interactions(user_id);

-- 6. ADMIN AUDIT LOGS (Immutable security ledger)
CREATE TABLE admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL NOT NULL,
    target_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g., 'BAN_USER', 'RESET_PLAN', 'DATA_EXPORT'
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_audit_admin ON admin_audit_logs(admin_id);
CREATE INDEX idx_audit_time ON admin_audit_logs(created_at DESC);
