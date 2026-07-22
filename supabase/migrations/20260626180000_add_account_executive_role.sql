-- This role existed in the legacy database but was missing from the checked-in
-- migration history. Keep it in its own migration so PostgreSQL commits the
-- enum value before later functions reference it.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'account_executive';
