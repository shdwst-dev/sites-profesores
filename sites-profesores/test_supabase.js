
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function test() {
    console.log("Testeando emails_permitidos...");
    const { data: d1, error: e1 } = await supabase.from('emails_permitidos').select('*').limit(1);
    console.log("Error emails_permitidos:", e1?.message || "OK");

    console.log("\nTesteando usuarios...");
    const { data: d2, error: e2 } = await supabase.from('usuarios').select('email, nombre, rol, picture, last_login').limit(1);
    console.log("Error usuarios:", e2?.message || "OK");
}

test();
