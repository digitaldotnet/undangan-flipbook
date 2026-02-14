import { createClient } from
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

/* ===== CONFIG ===== */
export const supabase = createClient(
  'https://klhjovidkfvjzshquhqt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsaGpvdmlka2Z2anpzaHF1aHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MzQ2MzIsImV4cCI6MjA4MjExMDYzMn0.6OjoyeCjgtx6gXFsySGH68w9TGkyf1p0fvkKVRyjy5w'
);