-- Neo-Timeline: make calendar_events readable by everyone (shared calendar)

-- Replace per-user SELECT policy with public read
DROP POLICY IF EXISTS "Users can view their own events" ON public.calendar_events;

CREATE POLICY "Anyone can view events"
ON public.calendar_events
FOR SELECT
USING (true);

-- Keep ownership-based write policies
-- (recreate defensively in case names changed)
DROP POLICY IF EXISTS "Users can create their own events" ON public.calendar_events;
CREATE POLICY "Users can create their own events"
ON public.calendar_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own events" ON public.calendar_events;
CREATE POLICY "Users can update their own events"
ON public.calendar_events
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own events" ON public.calendar_events;
CREATE POLICY "Users can delete their own events"
ON public.calendar_events
FOR DELETE
USING (auth.uid() = user_id);
