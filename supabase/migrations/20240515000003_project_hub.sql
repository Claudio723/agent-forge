-- Phase 5: Project hub — link notes and vault entries to projects

CREATE TABLE IF NOT EXISTS public.project_notes (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, note_id)
);

ALTER TABLE public.project_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own project_notes"
  ON public.project_notes FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_notes.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can insert own project_notes"
  ON public.project_notes FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_notes.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can delete own project_notes"
  ON public.project_notes FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_notes.project_id AND projects.user_id = auth.uid()));

CREATE TABLE IF NOT EXISTS public.project_vault (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  vault_id UUID NOT NULL REFERENCES public.api_vault(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, vault_id)
);

ALTER TABLE public.project_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own project_vault"
  ON public.project_vault FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_vault.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can insert own project_vault"
  ON public.project_vault FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_vault.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can delete own project_vault"
  ON public.project_vault FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_vault.project_id AND projects.user_id = auth.uid()));
