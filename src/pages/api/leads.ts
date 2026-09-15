import type { APIRoute } from "astro"; import { env } from "cloudflare:workers"; import { leadSchema } from "@/lib/leadSchema";
export const prerender=false; const MAX_BODY=12_000; const WINDOW_MS=60_000; const requestCounts=new Map<string,{count:number;reset:number}>();
interface RuntimeEnv { TURNSTILE_SECRET_KEY?:string; LEAD_WEBHOOK_URL?:string; LEAD_WEBHOOK_SECRET?:string; }
const json=(body:object,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
export const POST:APIRoute=async({request,clientAddress})=>{
  const now=Date.now(); const key=clientAddress||"unknown"; const bucket=requestCounts.get(key); if(bucket&&bucket.reset>now&&bucket.count>=5)return json({ok:false,message:"Too many requests. Please wait or call us."},429); requestCounts.set(key,bucket&&bucket.reset>now?{...bucket,count:bucket.count+1}:{count:1,reset:now+WINDOW_MS});
  if(!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))return json({ok:false,message:"Unsupported request."},415);
  const size=Number(request.headers.get("content-length")??0); if(size>MAX_BODY)return json({ok:false,message:"Request is too large."},413);
  let raw:unknown; try{const text=await request.text(); if(text.length>MAX_BODY)return json({ok:false,message:"Request is too large."},413); raw=JSON.parse(text);}catch{return json({ok:false,message:"Check the form and try again."},400);}
  const parsed=leadSchema.safeParse(raw); if(!parsed.success)return json({ok:false,message:"Check the highlighted information and try again."},422);
  const runtimeEnv=env as RuntimeEnv; if(!runtimeEnv.TURNSTILE_SECRET_KEY)return json({ok:false,message:"Security verification is temporarily unavailable. Please call us."},503);
  const verifyBody=new FormData(); verifyBody.set("secret",runtimeEnv.TURNSTILE_SECRET_KEY); verifyBody.set("response",parsed.data.turnstileToken); if(clientAddress)verifyBody.set("remoteip",clientAddress);
  const verification=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",body:verifyBody}); const result=await verification.json() as {success?:boolean};
  if(!verification.ok||!result.success)return json({ok:false,message:"Security check failed. Please try again or call us."},400);
  if(!runtimeEnv.LEAD_WEBHOOK_URL)return json({ok:false,message:"Online requests are temporarily unavailable. Please call us."},503);
  const payload={...parsed.data,turnstileToken:undefined,receivedAt:new Date().toISOString(),source:"unitedwdr.com"};
  const delivered=await fetch(runtimeEnv.LEAD_WEBHOOK_URL,{method:"POST",headers:{"content-type":"application/json",...(runtimeEnv.LEAD_WEBHOOK_SECRET?{"authorization":`Bearer ${runtimeEnv.LEAD_WEBHOOK_SECRET}`}:{})},body:JSON.stringify(payload)});
  if(!delivered.ok)return json({ok:false,message:"We couldn’t send the request. Please call us or try again."},502);
  return json({ok:true,message:"Request received."});
};
