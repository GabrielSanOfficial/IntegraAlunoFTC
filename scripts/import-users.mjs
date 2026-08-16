import 'dotenv/config';import xlsx from 'xlsx';import {createClient} from '@supabase/supabase-js';
const {SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,TURMA_CODIGO,USERS_XLSX='backlogusers.xlsx'}=process.env;
if(!SUPABASE_URL||!SUPABASE_SERVICE_ROLE_KEY||!TURMA_CODIGO)throw new Error('Preencha o arquivo .env');
const admin=createClient(SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false}});
const wb=xlsx.readFile(USERS_XLSX),rows=xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:''});
for(const row of rows){const nome=String(row['Nome Completo']||'').trim(),email=String(row['E-mail']||'').trim(),password=String(row['Senha']||'').trim();if(!nome||!email||!password){console.log('Ignorado: linha incompleta',email);continue}const {data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{nome,codigo_turma:TURMA_CODIGO}});console.log(error?`ERRO ${email}: ${error.message}`:`OK ${email}: ${data.user.id}`)}