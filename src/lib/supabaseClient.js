import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qzgqehegeaciunbbvkyt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Z3FlaGVnZWFjaXVuYmJ2a3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODY3NDksImV4cCI6MjA5MDE2Mjc0OX0.pLHn6DDDz6QwwRnptYYs1McwrSfXTmy8D8bSCBDjTVs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);