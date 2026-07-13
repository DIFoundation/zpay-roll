-- =====================================================
-- zPay Tables
-- =====================================================

--------------------------------------------------------
-- Organizations
--------------------------------------------------------

create table organizations (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug citext not null unique,
    created_by uuid not null
        references auth.users(id)
        on delete cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

--------------------------------------------------------
-- Profiles
--------------------------------------------------------

create table profiles (
    id uuid primary key
        references auth.users(id)
        on delete cascade,
    full_name text not null,
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

--------------------------------------------------------
-- Organization Members
--------------------------------------------------------

create table organization_members (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null
        references organizations(id)
        on delete cascade,
    profile_id uuid not null
        references profiles(id)
        on delete cascade,
    role member_role not null default 'employee',
    created_at timestamptz not null default now(),
    unique (organization_id, profile_id)
);

--------------------------------------------------------
-- Wallets
--------------------------------------------------------

create table wallets (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null
        references organizations(id)
        on delete cascade,

    address text not null unique,
    network blockchain_network not null default 'zcash_testnet',
    status wallet_status not null default 'connected',
    last_synced_at timestamptz,
    created_by uuid
        references profiles(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

--------------------------------------------------------
-- Employees
--------------------------------------------------------

create table employees (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null
        references organizations(id)
        on delete cascade,
    employee_code text not null,
    first_name text not null,
    middle_name text,
    last_name text not null,
    email citext,
    department text,
    position text,
    wallet_address text not null,
    base_salary numeric(18,2) not null check (base_salary >= 0),
    currency currency_type not null default 'ZEC',
    status employee_status not null default 'active',
    created_by uuid
        references profiles(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz,
    unique (organization_id, employee_code),
    unique (organization_id, email)
);

--------------------------------------------------------
-- Payroll Batches
--------------------------------------------------------

create table payroll_batches (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null
        references organizations(id)
        on delete cascade,
    title text not null,
    pay_period date not null,
    employee_count integer not null default 0,
    total_amount numeric(18,2)
        not null
        default 0
        check (total_amount >= 0),
    status payroll_batch_status
        not null
        default 'draft',
    created_by uuid not null
        references profiles(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz,
    unique (organization_id, pay_period)
);

--------------------------------------------------------
-- Payroll Items
--------------------------------------------------------

create table payroll_items (
    id uuid primary key default gen_random_uuid(),
    batch_id uuid not null
        references payroll_batches(id)
        on delete cascade,
    employee_id uuid not null
        references employees(id)
        on delete cascade,
    amount numeric(18,2)
        not null
        check (amount >= 0),
    wallet_address text not null,
    status payroll_item_status
        not null
        default 'pending',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (batch_id, employee_id)
);

--------------------------------------------------------
-- Transactions
--------------------------------------------------------

create table transactions (
    id uuid primary key default gen_random_uuid(),
    payroll_item_id uuid not null
        references payroll_items(id)
        on delete cascade,
    amount numeric(18,2)
        not null
        check (amount >= 0),
    status transaction_status
        not null
        default 'pending',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

--------------------------------------------------------
-- Wallet Transactions
--------------------------------------------------------

create table wallet_transactions (
    id uuid primary key default gen_random_uuid(),
    transaction_id uuid not null
        references transactions(id)
        on delete cascade,
    tx_hash text unique,
    network blockchain_network
        not null
        default 'zcash_testnet',
    confirmations integer
        not null
        default 0
        check (confirmations >= 0),
    network_fee numeric(18,8)
        default 0
        check (network_fee >= 0),
    status transaction_status
        not null
        default 'broadcasting',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);