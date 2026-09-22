-- Anantha Real Estate production data architecture foundation
-- This migration is additive and keeps the existing property_listings workflow compatible.

CREATE TABLE IF NOT EXISTS property_owners (
  id BIGSERIAL PRIMARY KEY,
  owner_ref TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  consent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS property_media (
  id BIGSERIAL PRIMARY KEY,
  property_public_id TEXT NOT NULL,
  storage_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image',
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS property_audit_logs (
  id BIGSERIAL PRIMARY KEY,
  property_public_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  previous_verification_status TEXT,
  new_verification_status TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enquiries (
  id BIGSERIAL PRIMARY KEY,
  enquiry_ref TEXT UNIQUE NOT NULL,
  property_public_id TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'NEW',
  consent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_visits (
  id BIGSERIAL PRIMARY KEY,
  visit_ref TEXT UNIQUE NOT NULL,
  enquiry_ref TEXT,
  property_public_id TEXT,
  scheduled_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'SCHEDULED',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS property_media_property_idx ON property_media(property_public_id);
CREATE INDEX IF NOT EXISTS property_audit_property_idx ON property_audit_logs(property_public_id);
CREATE INDEX IF NOT EXISTS enquiries_property_idx ON enquiries(property_public_id);
CREATE INDEX IF NOT EXISTS enquiries_phone_idx ON enquiries(phone);
CREATE INDEX IF NOT EXISTS site_visits_property_idx ON site_visits(property_public_id);

-- Next migration will backfill property_owners from the legacy owner_name/phone
-- fields and introduce explicit VERIFIED vs PUBLISHED lifecycle states.
