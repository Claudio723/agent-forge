-- ============================================================================
-- Phase 2: Full Database Schema
-- Tables: notes, skills_mcps, projects, api_vault, project_skills
-- ============================================================================

-- Enable pgcrypto for encrypted key storage
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- notes — flexible notes/journal with tags, category, mood
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  mood TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notes"
  ON public.notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON public.notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON public.notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON public.notes FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ---------------------------------------------------------------------------
-- skills_mcps — unified library for skills and MCPs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills_mcps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('skill', 'mcp')),
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.skills_mcps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skills"
  ON public.skills_mcps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON public.skills_mcps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON public.skills_mcps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON public.skills_mcps FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- api_vault — encrypted API key storage (never plaintext)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.api_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  encrypted_key BYTEA NOT NULL,
  service TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.api_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vault entries"
  ON public.api_vault FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vault entries"
  ON public.api_vault FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vault entries"
  ON public.api_vault FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vault entries"
  ON public.api_vault FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- project_skills — join table linking projects to skills
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_skills (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills_mcps(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);

ALTER TABLE public.project_skills ENABLE ROW LEVEL SECURITY;

-- Users can view join rows for their own projects
CREATE POLICY "Users can view own project_skills"
  ON public.project_skills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_skills.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can insert into their own projects
CREATE POLICY "Users can insert own project_skills"
  ON public.project_skills FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_skills.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can delete from their own projects
CREATE POLICY "Users can delete own project_skills"
  ON public.project_skills FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_skills.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Helper functions: encrypt / decrypt API keys (pgcrypto)
-- ---------------------------------------------------------------------------

-- Encrypt and store an API key
CREATE OR REPLACE FUNCTION public.encrypt_and_store_key(
  p_user_id UUID,
  p_alias TEXT,
  p_service TEXT,
  p_plain_key TEXT,
  p_encryption_password TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.api_vault (user_id, alias, encrypted_key, service)
  VALUES (
    p_user_id,
    p_alias,
    pgp_sym_encrypt(p_plain_key, p_encryption_password),
    p_service
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrypt a stored API key (returns plaintext)
CREATE OR REPLACE FUNCTION public.decrypt_vault_key(
  p_entry_id UUID,
  p_user_id UUID,
  p_encryption_password TEXT
) RETURNS TEXT AS $$
DECLARE
  v_encrypted BYTEA;
  v_plain TEXT;
BEGIN
  SELECT encrypted_key INTO v_encrypted
  FROM public.api_vault
  WHERE id = p_entry_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Key not found or access denied';
  END IF;

  v_plain := pgp_sym_decrypt(v_encrypted, p_encryption_password);
  RETURN v_plain;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
