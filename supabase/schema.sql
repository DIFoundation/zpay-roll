-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (linked to Supabase auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Payroll batches table
CREATE TABLE IF NOT EXISTS public.payroll_batches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  memo TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'broadcasting', 'pending', 'completed', 'failed')),
  total_zec NUMERIC NOT NULL DEFAULT 0,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  operation_id TEXT,
  tx_ids TEXT[],
  broadcasted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Payroll recipients table
CREATE TABLE IF NOT EXISTS public.payroll_recipients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  batch_id UUID REFERENCES public.payroll_batches(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  address TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  memo TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  tx_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payroll_batches_user_id ON public.payroll_batches(user_id);
CREATE INDEX IF NOT EXISTS idx_payroll_batches_user_status ON public.payroll_batches(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payroll_recipients_batch_id ON public.payroll_recipients(batch_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_recipients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for payroll_batches
CREATE POLICY "Users can view own batches" ON public.payroll_batches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own batches" ON public.payroll_batches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own batches" ON public.payroll_batches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own batches" ON public.payroll_batches FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for payroll_recipients
CREATE POLICY "Users can view recipients of own batches" ON public.payroll_recipients FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.payroll_batches 
    WHERE payroll_batches.id = payroll_recipients.batch_id 
    AND payroll_batches.user_id = auth.uid()
  )
);
CREATE POLICY "Users can create recipients for own batches" ON public.payroll_recipients FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.payroll_batches 
    WHERE payroll_batches.id = payroll_recipients.batch_id 
    AND payroll_batches.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update recipients of own batches" ON public.payroll_recipients FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.payroll_batches 
    WHERE payroll_batches.id = payroll_recipients.batch_id 
    AND payroll_batches.user_id = auth.uid()
  )
);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payroll_batches_updated_at BEFORE UPDATE ON public.payroll_batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payroll_recipients_updated_at BEFORE UPDATE ON public.payroll_recipients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
