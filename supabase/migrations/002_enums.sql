-- =====================================================
-- Member Roles
-- =====================================================

create type member_role as enum (
    'owner',
    'admin',
    'finance',
    'hr',
    'employee'
);

-- =====================================================
-- Employee Status
-- =====================================================

create type employee_status as enum (
    'active',
    'inactive',
    'suspended'
);

-- =====================================================
-- Payroll Batch Status
-- =====================================================

create type payroll_batch_status as enum (
    'draft',
    'ready',
    'processing',
    'completed',
    'failed'
);

-- =====================================================
-- Payroll Item Status
-- =====================================================

create type payroll_item_status as enum (
    'pending',
    'paid',
    'failed'
);

-- =====================================================
-- Transaction Status
-- =====================================================

create type transaction_status as enum (
    'pending',
    'broadcasting',
    'confirmed',
    'failed'
);

-- =====================================================
-- Wallet Status
-- =====================================================

create type wallet_status as enum (
    'connected',
    'disconnected',
    'syncing'
);

-- =====================================================
-- Blockchain Network
-- =====================================================

create type blockchain_network as enum (
    'zcash_mainnet',
    'zcash_testnet'
);

-- =====================================================
-- Currency
-- =====================================================

create type currency_type as enum (
    'ZEC',
    'USD',
    'NGN'
);