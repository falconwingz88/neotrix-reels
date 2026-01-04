-- Create a table for client logos
CREATE TABLE public.client_logos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  scale TEXT DEFAULT 'normal',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active client logos" 
ON public.client_logos 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage client logos" 
ON public.client_logos 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_client_logos_updated_at
BEFORE UPDATE ON public.client_logos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the existing logos as seed data
INSERT INTO public.client_logos (name, url, scale, sort_order) VALUES
('BCA', '/client-logos/BCA_white.png', 'normal', 1),
('BNI Mobile', '/client-logos/BNI-MOBILE_white.png', 'normal', 2),
('BNI', '/client-logos/BNI_white.png', 'normal', 3),
('JT Express', '/client-logos/JT-Express_logo_white.png', 'normal', 4),
('Fatigon Spirit', '/client-logos/Logo_fatigon_spirit_white.png', 'normal', 5),
('RWS Sentosa', '/client-logos/RWS-Sentosa_white.png', 'normal', 6),
('Smartfren', '/client-logos/Smartfren_white.png', 'normal', 7),
('BBL', '/client-logos/bbl_white.png', 'normal', 8),
('Bibit', '/client-logos/bibit-logo_brandlogos.net_mdpay_white.png', '2x', 9),
('Caplang', '/client-logos/caplang_white.png', 'normal', 10),
('Fibe Mini', '/client-logos/fibe-mini_white.png', '2x', 11),
('Flimty', '/client-logos/flimty_white.png', 'normal', 12),
('Free Fire', '/client-logos/freefire_white.png', 'small', 13),
('Garuda', '/client-logos/garuda_white.png', 'normal', 14),
('Indofood Kulkuil', '/client-logos/indofood-kulkuil_white.png', 'small', 15),
('Indomilk', '/client-logos/indomilk_white.png', 'normal', 16),
('Kelaya', '/client-logos/kelaya_white.png', 'normal', 17),
('Livin by Mandiri', '/client-logos/livin-by-mandiri_white.png', 'normal', 18),
('Lucky Strike', '/client-logos/luvky-strikes_white.png', 'normal', 19),
('Miranda', '/client-logos/miranda_white.png', '2x', 20),
('Mobile Legends', '/client-logos/mobile-legends_white.png', 'normal', 21),
('Nature E', '/client-logos/nature-e_white.png', 'normal', 22),
('Oppo', '/client-logos/oppo_white.png', '2x', 23),
('Paddle Pop', '/client-logos/paddle-pop_white.png', 'normal', 24),
('Permata Bank', '/client-logos/permata-bank_white.png', 'normal', 25),
('Pertamina', '/client-logos/pertamina_white.png', 'normal', 26),
('Procold', '/client-logos/procold_white.png', 'normal', 27),
('Rejoice', '/client-logos/rejoice_white.png', 'normal', 28),
('Siladex', '/client-logos/siladex_white.png', 'normal', 29),
('Siloam Hospital', '/client-logos/siloam-hospital_white.png', '2x', 30),
('Skinmology', '/client-logos/skinmology_white.png', 'normal', 31),
('Skintific', '/client-logos/skintific_white.png', '3x', 32),
('Softex', '/client-logos/softex_white.png', 'normal', 33),
('Telkomsel', '/client-logos/telkomsel_white.png', 'normal', 34),
('Tomoro', '/client-logos/tomoro_white.png', 'normal', 35),
('Tri', '/client-logos/tri_white.png', 'normal', 36),
('Ultima II', '/client-logos/ultima-II_white.png', 'normal', 37),
('Valorant', '/client-logos/valo_white.png', 'normal', 38),
('Vivo', '/client-logos/vivo_white.png', 'normal', 39),
('Wardah', '/client-logos/wardah_white.png', 'normal', 40),
('Wuling', '/client-logos/wuling_white.png', 'small', 41),
('Wyeth', '/client-logos/wyeth_white.png', 'normal', 42),
('XL', '/client-logos/xl_white.png', '2x', 43),
('Lilac Post Pro', '/lovable-uploads/73f5e109-5a65-4fca-9511-3f9077bead37.png', 'normal', 44),
('Lieve', '/lovable-uploads/5ada6f74-27f7-415c-9050-858b791223aa.png', 'normal', 45);