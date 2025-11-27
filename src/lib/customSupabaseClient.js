import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ilxpgcpyvwccktnjuuag.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlseHBnY3B5dndjY2t0bmp1dWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDU0NTcsImV4cCI6MjA3NTQ4MTQ1N30.oeOzM0egco8Zk3Jgc96EC53VOEi8jPawTi9dD9gn4q8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);