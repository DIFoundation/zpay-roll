-- =====================================================
-- zPay Row Level Security (RLS)
-- =====================================================

--------------------------------------------------------
-- Enable RLS
--------------------------------------------------------

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table organization_members enable row level security;
alter table employees enable row level security;
alter table wallets enable row level security;
alter table payroll_batches enable row level security;
alter table payroll_items enable row level security;
alter table transactions enable row level security;
alter table wallet_transactions enable row level security;

--------------------------------------------------------
-- Helper Functions
--------------------------------------------------------

create or replace function public.is_organization_member(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
select exists (
    select 1
    from organization_members om
    where om.organization_id = org_id
      and om.profile_id = auth.uid()
);
$$;

create or replace function public.is_organization_admin(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
select exists (
    select 1
    from organization_members om
    where om.organization_id = org_id
      and om.profile_id = auth.uid()
      and om.role in ('owner', 'admin')
);
$$;

--------------------------------------------------------
-- Profiles
--------------------------------------------------------

create policy "Users can view their profile"
on profiles
for select
using (id = auth.uid());

create policy "Users can update their profile"
on profiles
for update
using (id = auth.uid());

--------------------------------------------------------
-- Organizations
--------------------------------------------------------

create policy "Members can view organization"
on organizations
for select
using (
    is_organization_member(id)
);

--------------------------------------------------------
-- Organization Members
--------------------------------------------------------

create policy "Members can view organization members"
on organization_members
for select
using (
    is_organization_member(organization_id)
);

--------------------------------------------------------
-- Employees
--------------------------------------------------------

create policy "Members can view employees"
on employees
for select
using (
    is_organization_member(organization_id)
);

create policy "Admins manage employees"
on employees
for all
using (
    is_organization_admin(organization_id)
)
with check (
    is_organization_admin(organization_id)
);

--------------------------------------------------------
-- Wallets
--------------------------------------------------------

create policy "Members can view wallets"
on wallets
for select
using (
    is_organization_member(organization_id)
);

create policy "Admins manage wallets"
on wallets
for all
using (
    is_organization_admin(organization_id)
)
with check (
    is_organization_admin(organization_id)
);

--------------------------------------------------------
-- Payroll Batches
--------------------------------------------------------

create policy "Members can view payroll batches"
on payroll_batches
for select
using (
    is_organization_member(organization_id)
);

create policy "Admins manage payroll batches"
on payroll_batches
for all
using (
    is_organization_admin(organization_id)
)
with check (
    is_organization_admin(organization_id)
);

--------------------------------------------------------
-- Payroll Items
--------------------------------------------------------

create policy "Members can view payroll items"
on payroll_items
for select
using (
    exists (
        select 1
        from payroll_batches pb
        where pb.id = batch_id
        and is_organization_member(pb.organization_id)
    )
);

create policy "Admins manage payroll items"
on payroll_items
for all
using (
    exists (
        select 1
        from payroll_batches pb
        where pb.id = batch_id
        and is_organization_admin(pb.organization_id)
    )
)
with check (
    exists (
        select 1
        from payroll_batches pb
        where pb.id = batch_id
        and is_organization_admin(pb.organization_id)
    )
);

--------------------------------------------------------
-- Transactions
--------------------------------------------------------

create policy "Members can view transactions"
on transactions
for select
using (
    exists (
        select 1
        from payroll_items pi
        join payroll_batches pb
            on pb.id = pi.batch_id
        where pi.id = payroll_item_id
        and is_organization_member(pb.organization_id)
    )
);

--------------------------------------------------------
-- Wallet Transactions
--------------------------------------------------------

create policy "Members can view wallet transactions"
on wallet_transactions
for select
using (
    exists (
        select 1
        from transactions t
        join payroll_items pi
            on pi.id = t.payroll_item_id
        join payroll_batches pb
            on pb.id = pi.batch_id
        where t.id = transaction_id
        and is_organization_member(pb.organization_id)
    )
);