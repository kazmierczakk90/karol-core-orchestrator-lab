
-- Create browser_history table to store browsing history
CREATE TABLE public.browser_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  url TEXT NOT NULL,
  title TEXT,
  domain TEXT,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  search_query TEXT,
  search_engine TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX browser_history_user_id_idx ON public.browser_history(user_id);
CREATE INDEX browser_history_visited_at_idx ON public.browser_history(visited_at DESC);
CREATE INDEX browser_history_domain_idx ON public.browser_history(domain);

-- Enable Row Level Security
ALTER TABLE public.browser_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own browser history" 
  ON public.browser_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own browser history" 
  ON public.browser_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own browser history" 
  ON public.browser_history 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own browser history" 
  ON public.browser_history 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create api_search_results table for storing API search results
CREATE TABLE public.api_search_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  query TEXT NOT NULL,
  results JSONB NOT NULL,
  api_key_ref TEXT NOT NULL,
  search_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  result_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes
CREATE INDEX api_search_results_user_id_idx ON public.api_search_results(user_id);
CREATE INDEX api_search_results_query_idx ON public.api_search_results(query);
CREATE INDEX api_search_results_timestamp_idx ON public.api_search_results(search_timestamp DESC);

-- Enable RLS
ALTER TABLE public.api_search_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own API search results" 
  ON public.api_search_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API search results" 
  ON public.api_search_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
