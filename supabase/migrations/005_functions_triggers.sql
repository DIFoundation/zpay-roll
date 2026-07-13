-- =====================================================
-- zPay Functions & Triggers
-- =====================================================

--------------------------------------------------------
-- Automatically update updated_at
--------------------------------------------------------

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

--------------------------------------------------------
-- Organizations
--------------------------------------------------------

drop trigger if exists trg_organizations_updated_at on organizations;
create trigger trg_organizations_updated_at
before update on organizations
for each row
execute function public.handle_updated_at();

--------------------------------------------------------
-- Profiles
--------------------------------------------------------

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at
before update on profiles
for each row
execute function public.handle_updated_at();

--------------------------------------------------------
-- Wallets
--------------------------------------------------------

drop trigger if exists trg_wallets_updated_at on wallets;
create trigger trg_wallets_updated_at
before update on wallets
for each row
execute function public.handle_updated_at();

--------------------------------------------------------
-- Employees
--------------------------------------------------------

drop trigger if exists trg_employees_updated_at on employees;
create trigger trg_employees_updated_at
before update on employees
for each row
execute function public.handle_updated_at();

--------------------------------------------------------
-- Payroll Batches
--------------------------------------------------------

drop trigger if exists trg_payroll_batches_updated_at on payroll_batches;
create trigger trg_payroll_batches_updated_at
before update on payroll_batches
for each row
execute function public.handle_updated_at();

--------------------------------------------------------
-- Payroll Items
--------------------------------------------------------

drop trigger if exists trg_payroll_items_updated_at on payroll_items;
create trigger trg_payroll_items_updated_at
before update on payroll_items
for each row
execute function public.handle_updated_at();

--------------------------------------------------------
-- Transactions
--------------------------------------------------------

drop trigger if exists trg_transactions_updated_at on transactions;
create trigger trg_transactions_updated_at
before update on transactions
for each row
execute function public.handle_updated_at();

--------------------------------------------------------
-- Wallet Transactions
--------------------------------------------------------

drop trigger if exists trg_wallet_transactions_updated_at on wallet_transactions;
create trigger trg_wallet_transactions_updated_at
before update on wallet_transactions
for each row
execute function public.handle_updated_at();

--------------------------------------------------------
-- Automatically create profile after signup
--------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin

    insert into public.profiles (
        id,
        full_name,
        avatar_url
    )
    values (
        new.id,
        coalesce(
            new.raw_user_meta_data->>'full_name',
            ''
        ),
        new.raw_user_meta_data->>'avatar_url'
    );

    return new;

end;
$$;

--------------------------------------------------------
-- Trigger Auth User
--------------------------------------------------------

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created

after insert on auth.users

for each row

execute procedure public.handle_new_user();