ALTER TABLE public.bookings
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX bookings_user_id_idx ON public.bookings(user_id);

DROP POLICY IF EXISTS "Anyone can create booking requests" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;

CREATE POLICY "Signed in users can create their own booking requests"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can view own bookings or admins can view all"
ON public.bookings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Guests can create booking requests only while signed in"
ON public.bookings
FOR INSERT
TO anon
WITH CHECK (false);