"use strict";

const SUPABASE_URL = "https://tcypshmctpbjoqlhzfcg.supabase.co";
const SUPABASE_KEY = "sb_publishable_-nmGn336nVouwDXVZW1XIw_vBYdOobh";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

export { supabase };