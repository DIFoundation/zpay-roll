-- =====================================================
-- Organizations
-- =====================================================

create index idx_organizations_slug
on organizations(slug);

create index idx_organizations_created_by
on organizations(created_by);

-- =====================================================
-- Profiles
-- =====================================================

create index idx_profiles_full_name
on profiles(full_name);

-- =====================================================
-- Organization Members
-- =====================================================

create index idx_org_members_org
on organization_members(organization_id);

create index idx_org_members_profile
on organization_members(profile_id);

create index idx_org_members_role
on organization_members(role);

-- =====================================================
-- Employees
-- =====================================================

create index idx_employees_org
on employees(organization_id);

create index idx_employees_email
on employees(email);

create index idx_employees_department
on employees(department);

create index idx_employees_status
on employees(status);

create index idx_employees_code
on employees(employee_code);

-- =====================================================
-- Wallets
-- =====================================================

create index idx_wallets_org
on wallets(organization_id);

create index idx_wallets_network
on wallets(network);

-- =====================================================
-- Payroll Batches
-- =====================================================

create index idx_batches_org
on payroll_batches(organization_id);

create index idx_batches_status
on payroll_batches(status);

create index idx_batches_period
on payroll_batches(pay_period);

-- =====================================================
-- Payroll Items
-- =====================================================

create index idx_items_batch
on payroll_items(batch_id);

create index idx_items_employee
on payroll_items(employee_id);

create index idx_items_status
on payroll_items(status);

-- =====================================================
-- Transactions
-- =====================================================

create index idx_transactions_payroll_item
on transactions(payroll_item_id);

create index idx_transactions_status
on transactions(status);

create index idx_transactions_created_at
on transactions(created_at desc);

-- =====================================================
-- Wallet Transactions
-- =====================================================

create index idx_wallet_transactions_transaction
on wallet_transactions(transaction_id);

create index idx_wallet_transactions_hash
on wallet_transactions(tx_hash);

create index idx_wallet_transactions_status
on wallet_transactions(status);