-- Add project_id and is_sub_event columns to calendar_events
ALTER TABLE public.calendar_events 
ADD COLUMN project_id text DEFAULT 'default',
ADD COLUMN is_sub_event boolean DEFAULT false;

-- Create site_settings table for global configuration (like glassmorphism opacity)
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to site_settings
CREATE POLICY "Site settings are publicly readable" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- Only admins can modify site_settings
CREATE POLICY "Only admins can modify site settings" 
ON public.site_settings 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default glassmorphism opacity setting
INSERT INTO public.site_settings (key, value) 
VALUES ('glassmorphism_opacity', '0.1')
ON CONFLICT (key) DO NOTHING;