// js/supabase.js
const SUPABASE_URL = "https://zuahdikwqlcsuyrfrjeg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1YWhkaWt3cWxjc3V5cmZyamVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NDMzMjIsImV4cCI6MjA4NjExOTMyMn0.OnJtcrbG9O1TaEvqLnDnE1kIMZtqNUAy_AwFiPFrObg";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
