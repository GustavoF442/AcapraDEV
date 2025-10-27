const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Usar service key para uploads no backend

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL e SUPABASE_SERVICE_KEY devem estar definidos no .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
