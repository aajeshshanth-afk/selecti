import { jwtVerify, createRemoteJWKSet } from 'jose';
const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
export async function googleUser(credential, clientId){
  if(!credential || !clientId) throw new Error('Authentication is not configured.');
  const {payload} = await jwtVerify(credential, JWKS, {issuer:['https://accounts.google.com','accounts.google.com'], audience:clientId});
  if(payload.email_verified !== true) throw new Error('Google email is not verified.');
  if(!payload.sub || !payload.email) throw new Error('Google account data is incomplete.');
  return {sub:String(payload.sub),email:String(payload.email),name:String(payload.name||''),picture:String(payload.picture||'')};
}
export async function cookieUser(request,env){const raw=request.headers.get('Cookie')||'';const m=raw.match(/(?:^|;\s*)sc_session=([^;]+)/);if(!m)return null;const hash=await sha256(decodeURIComponent(m[1]));return await env.DB.prepare('SELECT u.id,u.email,u.name,u.picture FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?').bind(hash,new Date().toISOString()).first();}
export async function sha256(value){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}
export function randomToken(){const a=new Uint8Array(32);crypto.getRandomValues(a);return [...a].map(x=>x.toString(16).padStart(2,'0')).join('');}
export function cookie(token,maxAge=2592000){return `sc_session=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`}
export function clearCookie(){return 'sc_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax'}
export function json(data,status=200,extra={}){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...extra}})}
