// library/logger.ts — structured logs + PII redaction
export const logger = {
info: (msg: string, ctx?: any) => console.log(JSON.stringify({ level: "info", ts: new Date().toISOString(), msg, ...ctx })),
warn: (msg: string, ctx?: any) => console.warn(JSON.stringify({ level: "warn", ts: new Date().toISOString(), msg, ...ctx })),
error: (msg: string, ctx?: any) => console.error(JSON.stringify({ level: "error", ts: new Date().toISOString(), msg, ...ctx })),
zoho: {
  start: (msg: string, ctx?: any) => console.log(JSON.stringify({ level: "info", ts: new Date().toISOString(), msg: `[ZOHO START] ${msg}`, ...ctx })),
  success: (msg: string, ctx?: any) => console.log(JSON.stringify({ level: "info", ts: new Date().toISOString(), msg: `[ZOHO SUCCESS] ${msg}`, ...ctx })),
  warn: (msg: string, ctx?: any) => console.warn(JSON.stringify({ level: "warn", ts: new Date().toISOString(), msg: `[ZOHO WARN] ${msg}`, ...ctx })),
  error: (msg: string, ctx?: any) => console.error(JSON.stringify({ level: "error", ts: new Date().toISOString(), msg: `[ZOHO ERROR] ${msg}`, ...ctx })),
},
};


export const redactPII = (v: any) => {
if (!v) return v;
const s = String(v);
if (s.includes("@")) return s.replace(/(.{2}).+(@.+)/, (_m, a, b) => `${a}***${b}`);
if (/^\+?\d{7,}$/.test(s)) return s.slice(0, 3) + "***" + s.slice(-2);
return s;
};
