// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
/* 
const SUPABASE_URL = "https://dwbvvnvdcomlgvxuokxd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YnZ2bnZkY29tbGd2eHVva3hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3ODI5NTEsImV4cCI6MjA1ODM1ODk1MX0.J91ujeywJD6UdBx-LRaWEPE6QY20fBSPLb984y9OT1s";
 */

const SUPABASE_URL = "https://xeqfordyobjphmvswqbb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcWZvcmR5b2JqcGhtdnN3cWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDk3ODMsImV4cCI6MjA2NDIyNTc4M30.sOAA521eD_6tJoSkBqxV7HrPxskvFMUZWhg1uxLcTd8";


// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);