-- Create job_openings table
CREATE TABLE public.job_openings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  responsibilities TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  traits TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view active job openings"
ON public.job_openings
FOR SELECT
USING (is_active = true);

-- Admin full access
CREATE POLICY "Admins can manage job openings"
ON public.job_openings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert initial job openings
INSERT INTO public.job_openings (title, subtitle, description, responsibilities, requirements, traits, sort_order) VALUES
(
  'Project Manager (3D / Production)',
  'What This Role Really Is',
  'This is not a checklist manager role. As a Project Manager at Neotrix, you sit between ideas, artists, and execution. You understand how 3D production actually works — timelines, dependencies, revisions, render constraints — and you think in systems, not chaos control. Your job is simple but demanding: make complex 3D projects run smoothly, predictably, and efficiently.',
  ARRAY[
    'Translate creative briefs into clear production plans',
    'Build realistic timelines for 3D, animation, and real-time pipelines',
    'Coordinate artists, freelancers, and internal teams',
    'Anticipate bottlenecks before they become problems',
    'Optimize workflows, not just manage them',
    'Protect quality without killing speed',
    'Keep projects on track without micromanaging creatives'
  ],
  ARRAY[
    '3D production stages (modeling, texturing, rigging, animation, lighting, render)',
    'How revisions actually affect time and cost',
    'Why "small changes" are rarely small in 3D',
    'The difference between offline rendering and real-time workflows',
    'That efficiency is designed, not forced'
  ],
  ARRAY[
    'You think in cause–effect, not panic mode',
    'You enjoy making messy systems clean',
    'You can speak both creative and technical',
    'You''re calm under pressure and clear in communication',
    'You care about how things work, not just deadlines'
  ],
  1
),
(
  'Account Executive (Clients & Growth)',
  'What This Role Really Is',
  'This is not a sales-only role. As an Account Executive at Neotrix, you are the bridge between clients and production. You manage leads, guide clients through decisions, and make sure expectations stay aligned with reality — creatively, technically, and financially. Your role protects both the client relationship and the production team.',
  ARRAY[
    'Manage incoming leads and client inquiries',
    'Qualify projects before they reach production',
    'Help clients understand scopes, timelines, and constraints',
    'Coordinate with the internal team on feasibility and pricing',
    'Maintain long-term client relationships',
    'Ensure communication stays clear, honest, and professional',
    'Reduce friction between "what clients want" and "what''s possible"'
  ],
  ARRAY[
    'Creative production is not instant or unlimited',
    'Scope clarity saves time, money, and stress',
    'Clients value confidence and clarity more than hype',
    'Good communication prevents 80% of production problems'
  ],
  ARRAY[
    'Structured, calm, and detail-aware',
    'Comfortable talking to clients and internal teams',
    'Able to explain technical or creative limits clearly',
    'Not afraid to say "this will affect timeline or cost"',
    'Oriented toward long-term trust, not quick wins'
  ],
  2
);