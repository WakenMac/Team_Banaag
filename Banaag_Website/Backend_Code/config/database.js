// Backend_Code/controllers/mainHandler.js

// Prepares the connection to the database:
import { createClient } from '@supabase/supabase-js';
let supabaseClient = null;

export function initializeSupabaseClient(){
    console.log('Initializing Supabase Client')
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (!url || !key){
        const errorMsg = 'Supabase client initialization failed: SUPABASE_URL or SUPABASE_ANON_KEY is undefined.';
        console.error('ERROR:', errorMsg);
        throw new Error(errorMsg);
    }

    supabaseClient = createClient(url, key);
    console.log('Supabase Client successfully initialized')
}

export function getSupabaseClient(){
    if (!supabaseClient)
        throw new Error('Supabase client has not been initialized. Call instantiate first')
    return supabaseClient;
}
