
-- Create a new bucket for chat files with public access
INSERT INTO storage.buckets
  (id, name, public)
VALUES
  ('chat_files', 'chat_files', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow all operations for all users on chat_files
CREATE POLICY "Allow ALL operations on chat_files for all users"
ON storage.objects FOR ALL
USING ( bucket_id = 'chat_files' )
WITH CHECK ( bucket_id = 'chat_files' );
