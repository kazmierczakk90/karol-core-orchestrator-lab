
CREATE TABLE public.idfc_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fuko_module text NOT NULL,
  owner_id uuid,
  status text NOT NULL DEFAULT 'active',
  ttl_seconds integer,
  started_at timestamptz NOT NULL DEFAULT now(),
  stopped_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.idfc_descriptors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  value text NOT NULL,
  category text NOT NULL CHECK (category IN ('style','intent','context','risk','env','owner')),
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (key, value)
);

CREATE TABLE public.idfc_bindings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id uuid NOT NULL REFERENCES public.idfc_instances(id) ON DELETE CASCADE,
  descriptor_id uuid NOT NULL REFERENCES public.idfc_descriptors(id) ON DELETE CASCADE,
  weight numeric NOT NULL DEFAULT 1.0,
  bound_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (instance_id, descriptor_id)
);

CREATE TABLE public.idfc_provenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id uuid REFERENCES public.idfc_instances(id) ON DELETE CASCADE,
  descriptor_snapshot jsonb DEFAULT '[]'::jsonb,
  action text NOT NULL,
  payload jsonb DEFAULT '{}'::jsonb,
  ts timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.idfc_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idfc_descriptors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idfc_bindings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idfc_provenance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read idfc_instances" ON public.idfc_instances FOR SELECT USING (true);
CREATE POLICY "Auth can insert idfc_instances" ON public.idfc_instances FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can update idfc_instances" ON public.idfc_instances FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth can delete idfc_instances" ON public.idfc_instances FOR DELETE TO authenticated USING (true);

CREATE POLICY "Anyone can read idfc_descriptors" ON public.idfc_descriptors FOR SELECT USING (true);
CREATE POLICY "Auth can insert idfc_descriptors" ON public.idfc_descriptors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can update idfc_descriptors" ON public.idfc_descriptors FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth can delete idfc_descriptors" ON public.idfc_descriptors FOR DELETE TO authenticated USING (true);

CREATE POLICY "Anyone can read idfc_bindings" ON public.idfc_bindings FOR SELECT USING (true);
CREATE POLICY "Auth can insert idfc_bindings" ON public.idfc_bindings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can delete idfc_bindings" ON public.idfc_bindings FOR DELETE TO authenticated USING (true);

CREATE POLICY "Anyone can read idfc_provenance" ON public.idfc_provenance FOR SELECT USING (true);
CREATE POLICY "Auth can insert idfc_provenance" ON public.idfc_provenance FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX idx_idfc_bindings_instance ON public.idfc_bindings(instance_id);
CREATE INDEX idx_idfc_bindings_descriptor ON public.idfc_bindings(descriptor_id);
CREATE INDEX idx_idfc_provenance_instance ON public.idfc_provenance(instance_id);
CREATE INDEX idx_idfc_instances_module ON public.idfc_instances(fuko_module);
