import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createRemoteJWKSet, jwtVerify } from 'https://esm.sh/jose@5';
const JWKS=createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
Deno.serve(async(req)=>{
  if(req.method==='OPTIONS') return new Response('ok',{headers:cors});
  if(req.method!=='POST') return new Response('Method not allowed',{status:405,headers:cors});
  try {
    const token=(req.headers.get('Authorization')||'').replace(/^Bearer\s+/i,'');
    const project=Deno.env.get('FIREBASE_PROJECT_ID')!;
    const {payload}=await jwtVerify(token,JWKS,{issuer:`https://securetoken.google.com/${project}`,audience:project});
    const body=await req.json();
    if(typeof body.pgn!=='string'||body.pgn.length>50000||typeof body.result!=='string') return new Response('Invalid game payload',{status:400});
    const supabase=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const {data,error}=await supabase.from('chess_games').insert({firebase_uid:payload.sub,room_code:body.roomCode||null,result:body.result,pgn:body.pgn,white_ms:Number.isFinite(body.whiteMs)?body.whiteMs:null,black_ms:Number.isFinite(body.blackMs)?body.blackMs:null}).select('id').single();
    if(error) throw error;
    const {data:profile}=await supabase.from('player_profiles').select('games_played,wins,losses,draws').eq('firebase_uid',payload.sub).maybeSingle();
    if(profile){const color=body.playerColor==='b'?'b':'w';const result=String(body.result);const isDraw=/draw/i.test(result);const won=(color==='w'&&/white wins/i.test(result))||(color==='b'&&/black wins/i.test(result));await supabase.from('player_profiles').update({games_played:(profile.games_played||0)+1,wins:(profile.wins||0)+(won?1:0),losses:(profile.losses||0)+(!won&&!isDraw?1:0),draws:(profile.draws||0)+(isDraw?1:0),updated_at:new Date().toISOString()}).eq('firebase_uid',payload.sub);}
    return Response.json({ok:true,id:data.id},{headers:cors});
  } catch(e) { return Response.json({error:'Authentication or save failed',detail:String(e)},{status:401,headers:cors}); }
});
