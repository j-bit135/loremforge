import { useState, useEffect, useCallback } from "react";

// ── TOOLS ──────────────────────────────────────────────────────────────
const TOOLS = [
  { id: "classic",    label: "Classic Lorem",      icon: "ti-text",          desc: "Traditional Latin placeholder text" },
  { id: "hipster",    label: "Hipster Ipsum",       icon: "ti-coffee",        desc: "Artisanal, craft-beer flavoured filler" },
  { id: "devspeak",   label: "Dev Speak",           icon: "ti-code",          desc: "Tech jargon dummy text for devs" },
  { id: "corporate",  label: "Corporate Waffle",    icon: "ti-briefcase",     desc: "Synergistic enterprise placeholder copy" },
  { id: "markdown",   label: "Markdown Blocks",     icon: "ti-markdown",      desc: "Lorem with headers, lists & code blocks" },
  { id: "json",       label: "JSON Placeholder",    icon: "ti-braces",        desc: "Dummy JSON data structures" },
  { id: "avatar",     label: "Placeholder Images",  icon: "ti-photo",         desc: "Copy img tags for placeholder images" },
  { id: "names",      label: "Fake Names & Data",   icon: "ti-user-circle",   desc: "Names, emails, addresses & more" },
];

const GREEN  = "#16a34a";

// ── URL & SEO HELPERS ─────────────────────────────────────────────────
const TOOL_META = {
  classic:   { path:"/tools/classic-lorem",      title:"Lorem Ipsum Generator — Free Placeholder Text | LoremForge",      desc:"Generate classic Latin lorem ipsum placeholder text instantly. Choose paragraphs, word count and more. Free forever." },
  hipster:   { path:"/tools/hipster-ipsum",       title:"Hipster Ipsum Generator — Artisanal Placeholder Text | LoremForge",desc:"Generate artisanal, craft-beer flavoured hipster lorem ipsum placeholder text for your designs and prototypes." },
  devspeak:  { path:"/tools/dev-speak",           title:"Dev Speak Lorem Ipsum — Tech Jargon Placeholder Text | LoremForge",desc:"Generate developer-flavoured lorem ipsum using real technical terminology. Full stack, backend, frontend, ML and DevOps flavours." },
  corporate: { path:"/tools/corporate-waffle",    title:"Corporate Waffle Generator — Business Jargon Placeholder | LoremForge",desc:"Generate synergistic corporate waffle placeholder text. Perfect for satirising enterprise copy or filling business UI mockups." },
  markdown:  { path:"/tools/markdown-blocks",     title:"Markdown Lorem Ipsum Generator — Headers, Lists & Code | LoremForge",desc:"Generate placeholder markdown content with headers, paragraphs, code blocks, tables and lists for developer documentation." },
  json:      { path:"/tools/json-placeholder",    title:"JSON Placeholder Data Generator — Free Dummy Data | LoremForge",   desc:"Generate realistic dummy JSON data for users, products, blog posts, orders and more. Copy as JSON or CSV instantly." },
  avatar:    { path:"/tools/placeholder-images",  title:"Placeholder Image Generator — img Tags & URLs | LoremForge",       desc:"Generate placeholder image tags, markdown and CSS for any size. Supports Lorem Picsum, Placehold.co and more." },
  names:     { path:"/tools/fake-names-data",     title:"Fake Names & Data Generator — Realistic Dummy Data | LoremForge",  desc:"Generate realistic fake names, emails, addresses, companies and credit card data for development and testing." },
};
const PAGE_META = {
  blog:        { path:"/blog",        title:"Developer & Design Blog — Tools, Guides & Deep Dives | LoremForge", desc:"Practical guides for frontend developers and designers. CSS, accessibility, performance, Git workflows and more." },
  advertising: { path:"/advertising", title:"Advertise on LoremForge — Reach Developers & Designers",            desc:"Reach frontend developers, UI/UX designers and product teams. Premium ad placements on LoremForge." },
  subscribe:   { path:"/subscribe",   title:"Subscribe to the LoremForge Monthly Newsletter",                      desc:"Weekly developer hints, tips and tools straight to your inbox. Free forever." },
  privacy:     { path:"/privacy",     title:"Privacy Policy | LoremForge",                            desc:"LoremForge privacy policy. How we collect, use and protect your data." },
  about:       { path:"/about",       title:"About LoremForge — Built by Developers, for Developers",             desc:"LoremForge is a free placeholder content toolkit built by web developers and digital media professionals." },
};
const SITE_DEFAULT = { title:"LoremForge — Free Lorem Ipsum & Placeholder Content Generator", desc:"Free AI-powered placeholder content tools for developers and designers. Lorem ipsum, JSON data, fake names, placeholder images, markdown and more." };

function useDocumentMeta(title, desc) {
  useEffect(() => {
    document.title = title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name = 'description'; document.head.appendChild(metaDesc); }
    metaDesc.content = desc;
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property','og:title'); document.head.appendChild(ogTitle); }
    ogTitle.content = title;
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property','og:description'); document.head.appendChild(ogDesc); }
    ogDesc.content = desc;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = 'https://loremforge.co.uk' + window.location.pathname;
  }, [title, desc]);
}

function usePushState(path) {
  useEffect(() => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [path]);
}

const GREENBG = "#f0fdf4";

// ── STYLES ─────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body, #root {
    background: #f8f8f5;
    color: #1a1a1a;
    font-family: 'DM Sans', sans-serif;
  }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: #eee; }
  ::-webkit-scrollbar-thumb { background: #ccc; }

  textarea, input, select {
    background: #fff;
    border: 1.5px solid #e0e0da;
    color: #1a1a1a;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    border-radius: 5px;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  textarea:focus, input:focus, select:focus {
    border-color: #16a34a;
    box-shadow: 0 0 0 3px rgba(22,163,74,.1);
  }
  textarea { resize: vertical; width: 100%; padding: 10px 12px; line-height: 1.7; }
  input    { width: 100%; padding: 8px 12px; height: 40px; }
  select   { width: 100%; padding: 8px 12px; height: 40px; cursor: pointer; }
  select option { background: #fff; }
  label {
    display: block; font-size: 11px; letter-spacing: .07em;
    color: #888; margin-bottom: 6px; text-transform: uppercase; font-weight: 500;
  }

  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; background: #16a34a; color: #fff;
    font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500;
    border: none; border-radius: 5px; cursor: pointer;
    transition: background .2s, transform .1s, box-shadow .2s;
    letter-spacing: .03em; white-space: nowrap;
  }
  .btn:hover   { background: #15803d; box-shadow: 0 2px 8px rgba(22,163,74,.25); }
  .btn:active  { transform: scale(.98); }
  .btn:disabled { background: #d1d5db; color: #9ca3af; cursor: not-allowed; box-shadow: none; }
  .btn-full { width: 100%; justify-content: center; }
  .btn-ghost {
    background: transparent; border: 1.5px solid #e0e0da;
    color: #555; padding: 7px 14px; font-size: 12px;
  }
  .btn-ghost:hover { background: #f0fdf4; border-color: #16a34a; color: #16a34a; }
  .btn-outline {
    background: transparent; border: 1.5px solid #16a34a;
    color: #16a34a; padding: 7px 16px; font-size: 12px;
  }
  .btn-outline:hover { background: #f0fdf4; }

  .card {
    background: #fff; border: 1.5px solid #e8e8e2;
    border-radius: 8px; padding: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .result-box {
    background: #fafaf7; border: 1.5px solid #e8e8e2;
    border-radius: 6px; padding: 16px;
    font-family: 'DM Mono', monospace; font-size: 13px;
    line-height: 1.85; color: #333; white-space: pre-wrap;
    min-height: 140px;
  }
  .result-box-white {
    background: #fff;
  }
  .spinner {
    width: 15px; height: 15px; border: 2px solid #d1fae5;
    border-top-color: #16a34a; border-radius: 50%;
    animation: spin .7s linear infinite; display: inline-block; flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .copy-btn {
    background: transparent; border: none; color: #aaa; cursor: pointer;
    font-size: 11px; font-family: 'DM Mono', monospace;
    padding: 4px 8px; border-radius: 3px; transition: color .2s;
  }
  .copy-btn:hover { color: #16a34a; }

  .grid2  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .grid3  { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .section-title {
    font-size: 11px; letter-spacing: .1em; text-transform: uppercase;
    color: #aaa; margin-bottom: 12px; padding-bottom: 8px;
    border-bottom: 1.5px solid #f0f0eb; font-weight: 600;
  }
  .tag {
    display: inline-block; background: #f0fdf4; border: 1px solid #bbf7d0;
    border-radius: 3px; padding: 2px 9px;
    font-family: 'DM Mono', monospace; font-size: 11px; color: #15803d;
    margin: 3px;
  }
  .chip {
    display: inline-flex; align-items: center; gap: 5px;
    background: #f8f8f5; border: 1.5px solid #e8e8e2;
    border-radius: 4px; padding: 5px 11px; margin: 3px;
    font-size: 12px; font-family: 'DM Mono', monospace;
    color: #555; cursor: pointer; transition: all .15s;
  }
  .chip:hover    { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }
  .chip.selected { background: #f0fdf4; border-color: #16a34a; color: #16a34a; }
  .tip-box {
    background: #f0fdf4; border-radius: 6px;
    padding: 12px 14px; border-left: 3px solid #16a34a;
  }
  .counter {
    font-family: 'DM Mono', monospace; font-size: 11px;
    color: #bbb; text-align: right; margin-top: 4px;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 324px; background: #fff;
    border-right: 1.5px solid #e8e8e2;
    padding: 0; flex-shrink: 0; overflow-y: auto;
    display: flex; flex-direction: column;
  }
  .sidebar-tool-btn {
    width: 100%; display: flex; align-items: center; gap: 10px;
    padding: 9px 16px; background: transparent; border: none;
    cursor: pointer; transition: all .15s; text-align: left;
  }
  .sidebar-tool-btn:hover { background: #f8f8f5; }

  /* ── MOBILE ── */
  .mobile-header { display: none; }
  .mobile-drawer {
    position: fixed; inset: 0; z-index: 200; display: flex;
  }
  .mobile-drawer-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,.4);
    backdrop-filter: blur(2px);
  }
  .mobile-drawer-panel {
    position: relative; z-index: 1;
    width: min(92vw, 340px); height: 100%;
    background: #fff; border-right: 1.5px solid #e8e8e2;
    overflow-y: auto; display: flex; flex-direction: column;
  }

  /* ── MAIN ── */
  .main-scroll { flex: 1; overflow: auto; padding: 28px; background: #f8f8f5; }
  .main-inner  { max-width: 740px; margin: 0 auto; }

  /* ── INLINE AD ── */
  .inline-ad {
    width: 100%; border: 1.5px solid #e8e8e2; border-radius: 8px;
    background: #fff; overflow: hidden; cursor: pointer;
    transition: border-color .2s; margin-top: 8px;
  }
  .inline-ad:hover { border-color: #bbf7d0; }
  .inline-ad-label {
    font-size: 9px; letter-spacing: .1em; color: #d1d5db;
    text-transform: uppercase; text-align: center; padding: 5px 0 0;
    font-family: 'DM Mono', monospace;
  }
  .inline-ad-slot {
    width: 100%; height: 90px;
    display: flex; align-items: center; justify-content: center;
    gap: 14px; padding: 0 24px; position: relative;
  }
  .inline-ad-slot::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, #16a34a 40%, #16a34a 60%, transparent);
    opacity: .12;
  }
  .inline-ad-size   { font-family: 'DM Mono', monospace; font-size: 11px; color: #aaa; }
  .inline-ad-divider { width: 1px; height: 38px; background: #e0e0da; flex-shrink: 0; }
  .inline-ad-tag    { font-family: 'DM Mono', monospace; font-size: 10px; color: #aaa; }
  .show-desktop { display: inline; }
  .show-mobile  { display: none; }

  /* ── SIDEBAR AD ── */
  .sidebar-ad {
    margin: 12px 16px; border: 1.5px dashed #e8e8e2; border-radius: 6px;
    padding: 0; background: #fafaf7; overflow: hidden; cursor: pointer;
    transition: border-color .2s;
  }
  .sidebar-ad:hover { border-color: #bbf7d0; }
  .sidebar-ad-label {
    font-size: 8px; letter-spacing: .1em; color: #d1d5db;
    text-transform: uppercase; text-align: center; padding: 6px 0 0;
    font-family: 'DM Mono', monospace;
  }
  .sidebar-ad-slot {
    width: 100%; height: 120px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 5px;
  }

  @media (max-width: 768px) {
    .sidebar        { display: none; }
    .mobile-header  { display: flex; }
    .main-scroll    { padding: 16px; }
    .grid2          { grid-template-columns: 1fr; }
    .grid3          { grid-template-columns: 1fr; }
    .ab-cols        { grid-template-columns: 1fr !important; }
    .card           { padding: 14px; }
    .btn            { font-size: 12px; padding: 9px 14px; }
    .hide-mobile    { display: none !important; }
    .inline-ad-slot { height: 58px; padding: 0 14px; gap: 10px; }
    .show-desktop { display: none !important; }
    .show-mobile  { display: inline !important; }
    .inline-ad-divider { height: 26px; }
    h1.tool-title   { font-size: 16px !important; }
    .bottom-ad-slot    { height: 58px !important; padding: 0 14px !important; gap: 10px !important; }
    .bottom-ad-divider { height: 26px !important; }
  }
  @media (max-width: 480px) {
    .main-scroll { padding: 12px; }
    .card        { padding: 12px; }
  }
`;

// ── HELPERS ────────────────────────────────────────────────────────────
async function callClaude(sys, msg, maxTokens = 1200) {
  const resp = await fetch("/.netlify/functions/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: maxTokens,
      system: sys,
      messages: [{ role: "user", content: msg }],
    }),
  });
  const data = await resp.json();
  return data.content?.[0]?.text || "";
}

function CopyButton({ text, label = "copy" }) {
  const [copied, setCopied] = useState(false);
  return (
    <button className="copy-btn"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
      {copied ? "✓ copied" : label}
    </button>
  );
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth <= 768);
    window.addEventListener("resize", fn);
    fn(); // run once on mount to ensure accuracy
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function CountBar({ value, max, warn }) {
  return (
    <div className="counter" style={{ color: value > (warn||max) ? "#dc2626" : "#bbb" }}>
      {value.toLocaleString()} chars
    </div>
  );
}

// ── INLINE AD ──────────────────────────────────────────────────────────
function InlineAdUnit() {
  const isMobile = useIsMobile();
  const [hover, setHover] = useState(false);
  const slotH = isMobile ? 58 : 90;
  const divH  = isMobile ? 26 : 40;
  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{ width:"100%", border:`1.5px solid ${hover ? "#bbf7d0" : "#e8e8e2"}`, borderRadius:6,
        background:"#fff", overflow:"hidden", cursor:"pointer",
        transition:"border-color .2s", marginTop:8 }}
      title="Responsive ad slot — replace with your ad tag"
    >
      <div style={{ fontSize:9, letterSpacing:".1em", color:"#aaa", textTransform:"uppercase",
        textAlign:"center", padding:"5px 0 0", fontFamily:"'DM Mono',monospace" }}>
        Advertisement
      </div>
      <div style={{ width:"100%", height:slotH, display:"flex", alignItems:"center",
        justifyContent:"center", gap:isMobile?10:14, padding:`0 ${isMobile?14:24}px`,
        position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1,
          background:`linear-gradient(90deg,transparent,#16a34a 40%,#16a34a 60%,transparent)`,
          opacity: hover ? .25 : .12, transition:"opacity .2s" }} />
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, flexShrink:0 }}>
          <i className="ti ti-ad-2" style={{ fontSize:isMobile?14:18, color:"#bbb" }} />
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#aaa" }}>
            {isMobile ? "320 × 50" : "728 × 90"}
          </span>
        </div>
        <div style={{ width:1, height:divH, background:"#e0e0da", flexShrink:0 }} />
        <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:isMobile?9:10, color:"#aaa" }}>
            {isMobile ? "Mobile banner — insert ad tag here" : "Leaderboard — insert ad tag here"}
          </span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#bbb" }}>
            Responsive · switches format by breakpoint
          </span>
        </div>
      </div>
    </div>
  );
}

// ── SIDEBAR AD (300×250) ──────────────────────────────────────────────
function SidebarAdUnit() {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ padding:"12px", borderTop:"1.5px solid #e8e8e2", marginTop:8 }}>
      <div style={{ fontSize:9, letterSpacing:".1em", color:"#bbb", textTransform:"uppercase",
        marginBottom:6, textAlign:"center", fontFamily:"DM Mono,monospace" }}>Advertisement</div>
      <div
        onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
        style={{ width:300, height:250, background:hover?"#f0fdf4":"#fafaf7",
          border:`1.5px dashed ${hover?"#16a34a":"#e8e8e2"}`, borderRadius:6,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          cursor:"pointer", transition:"all .2s", position:"relative", overflow:"hidden", margin:"0 auto" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
          background:"#16a34a", opacity:hover?0.4:0.15, transition:"opacity .2s" }} />
        <i className="ti ti-ad-2" style={{ fontSize:28, color:"#ccc", marginBottom:10 }} />
        <div style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#bbb",
          letterSpacing:".06em", marginBottom:4 }}>300 × 250</div>
        <div style={{ fontFamily:"DM Mono,monospace", fontSize:10, color:"#ccc" }}>AD PLACEMENT</div>
        <div style={{ position:"absolute", bottom:8, fontSize:9, color:"#ccc",
          fontFamily:"DM Mono,monospace" }}>Insert ad tag here</div>
      </div>
    </div>
  );
}

// ── 1. CLASSIC LOREM ───────────────────────────────────────────────────
const LOREM_BASE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
const LOREM_WORDS = LOREM_BASE.replace(/[.,]/g,"").split(" ");

function classicLorem(paragraphs, startWithLorem) {
  const paras = [];
  for (let p = 0; p < paragraphs; p++) {
    if (p === 0 && startWithLorem) { paras.push(LOREM_BASE); continue; }
    const len = 40 + Math.floor(Math.random() * 40);
    const words = [];
    for (let i = 0; i < len; i++) words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    paras.push(words.join(" ") + ".");
  }
  return paras.join("\n\n");
}

function wordCount(text) { return text.trim().split(/\s+/).filter(Boolean).length; }
function sentenceCount(text) { return (text.match(/[.!?]+/g)||[]).length; }

function ClassicLorem() {
  const [paragraphs, setParagraphs] = useState(3);
  const [startWithLorem, setStart]  = useState(true);
  const [output, setOutput]         = useState(() => classicLorem(3, true));

  const generate = () => setOutput(classicLorem(paragraphs, startWithLorem));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div className="grid2">
        <div>
          <label>Paragraphs</label>
          <select value={paragraphs} onChange={e => { setParagraphs(Number(e.target.value)); }}>
            {[1,2,3,4,5,8,10].map(n => <option key={n} value={n}>{n} paragraph{n>1?"s":""}</option>)}
          </select>
        </div>
        <div style={{ display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
          <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", textTransform:"none", fontSize:13, color:"#555", letterSpacing:0 }}>
            <input type="checkbox" checked={startWithLorem} onChange={e => setStart(e.target.checked)}
              style={{ width:15, height:15, accentColor:"#16a34a", cursor:"pointer" }} />
            Start with "Lorem ipsum…"
          </label>
        </div>
      </div>
      <button className="btn btn-full" onClick={generate}>
        <i className="ti ti-refresh" /> Generate
      </button>
      {output && (
        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:8 }}>
            <div style={{ display:"flex", gap:12 }}>
              <span style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#aaa" }}>{wordCount(output)} words</span>
              <span style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#aaa" }}>{sentenceCount(output)} sentences</span>
              <span style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#aaa" }}>{output.length} chars</span>
            </div>
            <CopyButton text={output} />
          </div>
          <div className="result-box">{output}</div>
        </div>
      )}
    </div>
  );
}

// ── 2. HIPSTER IPSUM ───────────────────────────────────────────────────
function HipsterIpsum() {
  const [paragraphs, setParagraphs] = useState(2);
  const [result, setResult]         = useState("");
  const [loading, setLoading]       = useState(false);

  const generate = async () => {
    setLoading(true); setResult("");
    const sys = `You generate hipster/artisanal lorem ipsum placeholder text. Write natural flowing paragraphs (NOT a list) using hipster vocabulary: craft beer, vinyl, artisanal, small-batch, single-origin, cold brew, fixie, kombucha, farm-to-table, normcore, ethical, sustainable, curated, aesthetic, vibe, etc. Make it read like pretentious but fluent dummy text. Return ONLY the plain text paragraphs, no labels, no JSON, no markdown formatting. Separate paragraphs with a blank line.`;
    const r = await callClaude(sys, `Write ${paragraphs} paragraph${paragraphs>1?"s":""} of hipster lorem ipsum placeholder text.`, 800);
    setResult(r); setLoading(false);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div>
        <label>Paragraphs</label>
        <select value={paragraphs} onChange={e => setParagraphs(Number(e.target.value))}>
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} paragraph{n>1?"s":""}</option>)}
        </select>
      </div>
      <button className="btn btn-full" onClick={generate} disabled={loading}>
        {loading ? <><span className="spinner" /> Brewing…</> : <><i className="ti ti-coffee" /> Generate Hipster Ipsum</>}
      </button>
      {result && (
        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:8 }}>
            <div style={{ display:"flex", gap:12 }}>
              <span style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#aaa" }}>{wordCount(result)} words</span>
              <span style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#aaa" }}>{result.length} chars</span>
            </div>
            <CopyButton text={result} />
          </div>
          <div className="result-box result-box-white" style={{ fontFamily:"DM Sans,sans-serif", fontSize:14, lineHeight:1.8 }}>{result}</div>
        </div>
      )}
    </div>
  );
}

// ── 3. DEV SPEAK ───────────────────────────────────────────────────────
function DevSpeak() {
  const [paragraphs, setParagraphs] = useState(2);
  const [flavour, setFlavour]       = useState("fullstack");
  const [result, setResult]         = useState("");
  const [loading, setLoading]       = useState(false);

  const generate = async () => {
    setLoading(true); setResult("");
    const flavours = {
      fullstack: "full-stack web development (React, Node, APIs, databases, CI/CD, Docker)",
      backend:   "backend engineering (microservices, Kubernetes, databases, caching, message queues)",
      frontend:  "frontend development (components, state management, CSS, accessibility, performance)",
      ml:        "machine learning and AI (models, training, inference, embeddings, pipelines)",
      devops:    "DevOps and infrastructure (cloud, IaC, monitoring, deployments, SRE)",
    };
    const sys = `You generate developer-flavoured lorem ipsum placeholder text. Write fluent, natural-sounding paragraphs that use real technical terminology from ${flavours[flavour]}. It should sound like documentation or a technical blog post but be meaningless placeholder text. Return ONLY the plain text paragraphs, no labels, no JSON, no markdown.`;
    const r = await callClaude(sys, `Write ${paragraphs} paragraph${paragraphs>1?"s":""} of dev-speak lorem ipsum.`, 800);
    setResult(r); setLoading(false);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div className="grid2">
        <div>
          <label>Paragraphs</label>
          <select value={paragraphs} onChange={e => setParagraphs(Number(e.target.value))}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} paragraph{n>1?"s":""}</option>)}
          </select>
        </div>
        <div>
          <label>Flavour</label>
          <select value={flavour} onChange={e => setFlavour(e.target.value)}>
            <option value="fullstack">Full Stack</option>
            <option value="backend">Backend / Infra</option>
            <option value="frontend">Frontend / UI</option>
            <option value="ml">ML / AI</option>
            <option value="devops">DevOps / Cloud</option>
          </select>
        </div>
      </div>
      <button className="btn btn-full" onClick={generate} disabled={loading}>
        {loading ? <><span className="spinner" /> Compiling…</> : <><i className="ti ti-code" /> Generate Dev Speak</>}
      </button>
      {result && (
        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:8 }}>
            <div style={{ display:"flex", gap:12 }}>
              <span style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#aaa" }}>{wordCount(result)} words</span>
              <span style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#aaa" }}>{result.length} chars</span>
            </div>
            <CopyButton text={result} />
          </div>
          <div className="result-box result-box-white" style={{ fontFamily:"DM Sans,sans-serif", fontSize:14 }}>{result}</div>
        </div>
      )}
    </div>
  );
}

// ── 4. CORPORATE WAFFLE ────────────────────────────────────────────────
function CorporateWaffle() {
  const [paragraphs, setParagraphs] = useState(2);
  const [industry, setIndustry]     = useState("generic");
  const [result, setResult]         = useState("");
  const [loading, setLoading]       = useState(false);

  const generate = async () => {
    setLoading(true); setResult("");
    const industries = {
      generic:  "generic corporate business",
      fintech:  "financial services and fintech",
      saas:     "B2B SaaS software",
      consulting:"management consulting",
      hr:       "HR and people operations",
    };
    const sys = `You generate corporate waffle lorem ipsum placeholder text. Write pompous, jargon-heavy placeholder paragraphs using business buzzwords for ${industries[industry]}: leverage, synergy, holistic, paradigm shift, value proposition, thought leadership, move the needle, circle back, bandwidth, agile, scalable, disruptive, ecosystem, stakeholder, KPI, etc. Should sound like corporate filler copy. Return ONLY plain text paragraphs, no labels, no JSON, no markdown.`;
    const r = await callClaude(sys, `Write ${paragraphs} paragraph${paragraphs>1?"s":""} of corporate waffle placeholder text.`, 800);
    setResult(r); setLoading(false);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div className="grid2">
        <div>
          <label>Paragraphs</label>
          <select value={paragraphs} onChange={e => setParagraphs(Number(e.target.value))}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} paragraph{n>1?"s":""}</option>)}
          </select>
        </div>
        <div>
          <label>Industry</label>
          <select value={industry} onChange={e => setIndustry(e.target.value)}>
            <option value="generic">Generic Corporate</option>
            <option value="fintech">Fintech / Finance</option>
            <option value="saas">B2B SaaS</option>
            <option value="consulting">Consulting</option>
            <option value="hr">HR / People Ops</option>
          </select>
        </div>
      </div>
      <button className="btn btn-full" onClick={generate} disabled={loading}>
        {loading ? <><span className="spinner" /> Synergising…</> : <><i className="ti ti-briefcase" /> Generate Waffle</>}
      </button>
      {result && (
        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#aaa" }}>{wordCount(result)} words · {result.length} chars</span>
            <CopyButton text={result} />
          </div>
          <div className="result-box result-box-white" style={{ fontFamily:"DM Sans,sans-serif", fontSize:14 }}>{result}</div>
        </div>
      )}
    </div>
  );
}

// ── 5. MARKDOWN BLOCKS ─────────────────────────────────────────────────
function MarkdownBlocks() {
  const [sections, setSections] = useState(2);
  const [includeCode, setIncludeCode]   = useState(true);
  const [includeTables, setIncludeTables] = useState(true);
  const [includeLists, setIncludeLists]   = useState(true);
  const [result, setResult]     = useState("");
  const [loading, setLoading]   = useState(false);

  const generate = async () => {
    setLoading(true); setResult("");
    const extras = [
      includeCode   && "fenced code blocks (use realistic-looking but dummy code)",
      includeTables && "markdown tables with dummy data",
      includeLists  && "bullet and numbered lists",
    ].filter(Boolean).join(", ");
    const sys = `You generate markdown lorem ipsum placeholder text for developers to use when building UI. Use realistic markdown formatting with headings (##, ###), paragraphs of placeholder text, ${extras || "and paragraphs"}. The content should look like realistic documentation filler. Return ONLY raw markdown, no explanation, no wrapping backtick fences.`;
    const r = await callClaude(sys, `Generate ${sections} main section${sections>1?"s":""} of markdown placeholder content.`, 1000);
    setResult(r); setLoading(false);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div className="grid2">
        <div>
          <label>Sections</label>
          <select value={sections} onChange={e => setSections(Number(e.target.value))}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} section{n>1?"s":""}</option>)}
          </select>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8, justifyContent:"flex-end" }}>
          {[
            { label:"Include code blocks", val:includeCode,   set:setIncludeCode },
            { label:"Include tables",      val:includeTables, set:setIncludeTables },
            { label:"Include lists",       val:includeLists,  set:setIncludeLists },
          ].map(({ label, val, set }) => (
            <label key={label} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", textTransform:"none", fontSize:13, color:"#555", letterSpacing:0 }}>
              <input type="checkbox" checked={val} onChange={e => set(e.target.checked)}
                style={{ width:14, height:14, accentColor:"#16a34a", cursor:"pointer" }} />
              {label}
            </label>
          ))}
        </div>
      </div>
      <button className="btn btn-full" onClick={generate} disabled={loading}>
        {loading ? <><span className="spinner" /> Generating…</> : <><i className="ti ti-markdown" /> Generate Markdown</>}
      </button>
      {result && (
        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#aaa" }}>{result.length} chars · {result.split("\n").length} lines</span>
            <CopyButton text={result} />
          </div>
          <div className="result-box" style={{ fontSize:12, lineHeight:1.7 }}>{result}</div>
        </div>
      )}
    </div>
  );
}

// ── 6. JSON PLACEHOLDER ────────────────────────────────────────────────
function JSONPlaceholder() {
  const [schema, setSchema]   = useState("users");
  const [count, setCount]     = useState(5);
  const [result, setResult]   = useState("");
  const [loading, setLoading] = useState(false);

  const schemas = {
    users:    "user objects with id, name, email, avatar, role, createdAt, isActive",
    products: "product objects with id, name, slug, price, currency, category, stock, rating, imageUrl",
    posts:    "blog post objects with id, title, slug, excerpt, author, tags, publishedAt, readTime",
    orders:   "order objects with id, customerId, items (array), total, status, shippedAt, address",
    events:   "calendar event objects with id, title, description, startAt, endAt, location, attendees",
    custom:   "a custom schema — ask the user to describe it below",
  };

  const generate = async () => {
    setLoading(true); setResult("");
    const sys = `You generate realistic dummy JSON data for developers. Return ONLY a valid JSON array with no explanation, no markdown fences, just raw JSON starting with [ and ending with ]. Use realistic-looking but fake data (names, emails, UUIDs, dates etc). Dates in ISO 8601. IDs as UUIDs.`;
    const msg = schema === "custom"
      ? `Generate an array of ${count} JSON objects. Schema: ${schema}`
      : `Generate an array of ${count} JSON objects matching this schema: ${schemas[schema]}`;
    const r = await callClaude(sys, msg, 1200);
    try {
      const clean = r.replace(/```json|```/g,"").trim();
      JSON.parse(clean);
      setResult(JSON.stringify(JSON.parse(clean), null, 2));
    } catch { setResult(r); }
    setLoading(false);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div className="grid2">
        <div>
          <label>Schema</label>
          <select value={schema} onChange={e => setSchema(e.target.value)}>
            <option value="users">Users</option>
            <option value="products">Products</option>
            <option value="posts">Blog Posts</option>
            <option value="orders">Orders</option>
            <option value="events">Calendar Events</option>
          </select>
        </div>
        <div>
          <label>Records</label>
          <select value={count} onChange={e => setCount(Number(e.target.value))}>
            {[1,3,5,10,20].map(n => <option key={n} value={n}>{n} record{n>1?"s":""}</option>)}
          </select>
        </div>
      </div>
      <button className="btn btn-full" onClick={generate} disabled={loading}>
        {loading ? <><span className="spinner" /> Generating…</> : <><i className="ti ti-braces" /> Generate JSON</>}
      </button>
      {result && (
        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#aaa" }}>{result.length} chars · {count} records</span>
            <CopyButton text={result} />
          </div>
          <div className="result-box" style={{ fontSize:12, maxHeight:420, overflowY:"auto" }}>{result}</div>
        </div>
      )}
    </div>
  );
}

// ── 7. PLACEHOLDER IMAGES ──────────────────────────────────────────────
const IMG_SERVICES = [
  { id:"picsum",    label:"Lorem Picsum",   base:"https://picsum.photos" },
  { id:"placehold", label:"Placehold.co",   base:"https://placehold.co" },
  { id:"via",       label:"via.placeholder",base:"https://via.placeholder.com" },
];

const PRESETS = [
  { label:"Hero (1200×400)",  w:1200, h:400 },
  { label:"Card (400×300)",   w:400,  h:300 },
  { label:"Avatar (80×80)",   w:80,   h:80  },
  { label:"Thumbnail (320×180)", w:320, h:180 },
  { label:"Banner (728×90)",  w:728,  h:90  },
  { label:"Square (500×500)", w:500,  h:500 },
];

function PlaceholderImages() {
  const [service, setService] = useState("picsum");
  const [width, setWidth]     = useState(400);
  const [height, setHeight]   = useState(300);
  const [count, setCount]     = useState(4);
  const [format, setFormat]   = useState("html");
  const [result, setResult]   = useState("");

  const buildUrl = (svc, w, h, seed) => {
    if (svc === "picsum")    return `https://picsum.photos/seed/${seed}/${w}/${h}`;
    if (svc === "placehold") return `https://placehold.co/${w}x${h}`;
    return `https://via.placeholder.com/${w}x${h}`;
  };

  const generate = () => {
    const lines = [];
    for (let i = 0; i < count; i++) {
      const seed = Math.random().toString(36).slice(2, 8);
      const url  = buildUrl(service, width, height, seed);
      if (format === "html")     lines.push(`<img src="${url}" alt="Placeholder ${i+1}" width="${width}" height="${height}" />`);
      else if (format === "md")  lines.push(`![Placeholder ${i+1}](${url})`);
      else if (format === "css") lines.push(`background-image: url('${url}');`);
      else                       lines.push(url);
    }
    setResult(lines.join("\n"));
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div>
        <div className="section-title">Size Presets</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {PRESETS.map(p => (
            <button key={p.label} className="btn btn-ghost" style={{ fontSize:11, padding:"5px 11px" }}
              onClick={() => { setWidth(p.w); setHeight(p.h); }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid3">
        <div>
          <label>Width (px)</label>
          <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} min={1} max={2000} />
        </div>
        <div>
          <label>Height (px)</label>
          <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} min={1} max={2000} />
        </div>
        <div>
          <label>Count</label>
          <select value={count} onChange={e => setCount(Number(e.target.value))}>
            {[1,2,3,4,6,8,10].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <div className="grid2">
        <div>
          <label>Service</label>
          <select value={service} onChange={e => setService(e.target.value)}>
            {IMG_SERVICES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label>Output Format</label>
          <select value={format} onChange={e => setFormat(e.target.value)}>
            <option value="html">HTML img tag</option>
            <option value="md">Markdown</option>
            <option value="css">CSS background-image</option>
            <option value="url">URL only</option>
          </select>
        </div>
      </div>
      <button className="btn btn-full" onClick={generate}>
        <i className="ti ti-photo" /> Generate Image Tags
      </button>
      {result && (
        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:8 }}>
            <span style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#aaa" }}>{count} image{count>1?"s":""} · {width}×{height}px · {service}</span>
            <CopyButton text={result} />
          </div>
          <div className="result-box" style={{ fontSize:12 }}>{result}</div>
          {service === "picsum" && (
            <div className="tip-box" style={{ marginTop:12 }}>
              <div style={{ fontSize:11, color:GREEN, letterSpacing:".06em", marginBottom:6, fontWeight:600 }}>PREVIEW</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {result.split("\n").slice(0,4).map((line, i) => {
                  const match = line.match(/https:\/\/picsum\.photos\/seed\/\w+\/\d+\/\d+/);
                  return match ? <img key={i} src={match[0]} alt="" style={{ height:60, borderRadius:4, objectFit:"cover" }} /> : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── 8. FAKE NAMES & DATA ───────────────────────────────────────────────
function FakeNamesData() {
  const [dataType, setDataType] = useState("people");
  const [count, setCount]       = useState(10);
  const [locale, setLocale]     = useState("en_GB");
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);

  const generate = async () => {
    setLoading(true); setResult(null);
    const types = {
      people:    "people with: fullName, email, phone (UK format if en_GB), jobTitle, company, avatarUrl (use https://i.pravatar.cc/80?u=RANDOMSEED)",
      addresses: "postal addresses with: street, city, county, postcode (UK format if en_GB), country",
      companies: "companies with: name, domain, industry, employeeCount, founded, ceo, website",
      cards:     "credit card test data with: cardType (Visa/Mastercard/Amex), number (fake, correct format), expiry, cvv, cardholderName",
      logins:    "user login credentials with: username, email, password (obviously fake), role, lastLogin",
    };
    const sys = `You generate realistic-looking but entirely fake placeholder data for developers. Return ONLY a valid JSON array, no markdown, no explanation. Locale: ${locale}. Generate ${count} records of ${types[dataType]}. Use realistic formatting for the locale.`;
    const r = await callClaude(sys, `Generate the data.`, 1200);
    try {
      const clean = r.replace(/```json|```/g,"").trim();
      setResult(JSON.parse(clean));
    } catch { setResult({ raw: r }); }
    setLoading(false);
  };

  const raw = result && !result.raw
    ? JSON.stringify(result, null, 2)
    : result?.raw || "";

  const headers = result && Array.isArray(result) && result.length > 0
    ? Object.keys(result[0])
    : [];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div className="grid3">
        <div>
          <label>Data Type</label>
          <select value={dataType} onChange={e => setDataType(e.target.value)}>
            <option value="people">People</option>
            <option value="addresses">Addresses</option>
            <option value="companies">Companies</option>
            <option value="cards">Credit Cards</option>
            <option value="logins">User Logins</option>
          </select>
        </div>
        <div>
          <label>Records</label>
          <select value={count} onChange={e => setCount(Number(e.target.value))}>
            {[5,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label>Locale</label>
          <select value={locale} onChange={e => setLocale(e.target.value)}>
            <option value="en_GB">🇬🇧 en_GB</option>
            <option value="en_US">🇺🇸 en_US</option>
            <option value="de_DE">🇩🇪 de_DE</option>
            <option value="fr_FR">🇫🇷 fr_FR</option>
          </select>
        </div>
      </div>
      <button className="btn btn-full" onClick={generate} disabled={loading}>
        {loading ? <><span className="spinner" /> Generating…</> : <><i className="ti ti-user-circle" /> Generate Data</>}
      </button>
      {result && Array.isArray(result) && (
        <div className="card" style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            <span style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#aaa" }}>{result.length} records · {headers.length} fields</span>
            <div style={{ display:"flex", gap:8 }}>
              <CopyButton text={raw} label="copy JSON" />
              <button className="btn btn-outline" style={{ padding:"4px 12px", fontSize:11 }}
                onClick={() => {
                  const csv = [headers.join(","), ...result.map(r => headers.map(h => `"${String(r[h]||"").replace(/"/g,'""')}"`).join(","))].join("\n");
                  navigator.clipboard.writeText(csv);
                }}>
                copy CSV
              </button>
            </div>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr style={{ background:"#f8f8f5" }}>
                  {headers.map(h => (
                    <th key={h} style={{ padding:"7px 10px", textAlign:"left", fontFamily:"DM Mono,monospace", fontSize:10, color:"#888", fontWeight:500, borderBottom:"1.5px solid #f0f0eb", whiteSpace:"nowrap", letterSpacing:".04em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.map((row, i) => (
                  <tr key={i} style={{ borderBottom:"1px solid #f8f8f5" }}>
                    {headers.map(h => (
                      <td key={h} style={{ padding:"7px 10px", color:"#444", fontFamily: h.includes("email")||h.includes("url")||h.includes("domain")||h.includes("website") ? "DM Mono,monospace" : "inherit", fontSize: h.includes("email")||h.includes("url") ? 11 : 13, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {String(row[h] || "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── BOTTOM RESPONSIVE AD UNIT ──────────────────────────────────────────
function BottomAdUnit() {
  const isMobile = useIsMobile();
  const [hover, setHover] = useState(false);
  const slotH = isMobile ? 58 : 90;
  const divH  = isMobile ? 26 : 40;
  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{ width:"100%", border:`1.5px solid ${hover ? "#bbf7d0" : "#e8e8e2"}`,
        borderRadius:6, background:"#fff", overflow:"hidden", cursor:"pointer",
        transition:"border-color .2s", marginTop:32 }}
      title="Responsive bottom ad slot — replace with your ad tag"
    >
      <div style={{ fontSize:9, letterSpacing:".1em", color:"#aaa", textTransform:"uppercase",
        textAlign:"center", padding:"5px 0 0", fontFamily:"'DM Mono',monospace" }}>
        Advertisement
      </div>
      <div style={{ width:"100%", height:slotH, display:"flex", alignItems:"center",
        justifyContent:"center", gap:isMobile?10:14, padding:`0 ${isMobile?14:24}px`,
        position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1,
          background:`linear-gradient(90deg,transparent,#16a34a 40%,#16a34a 60%,transparent)`,
          opacity: hover ? .25 : .12, transition:"opacity .2s" }} />
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, flexShrink:0 }}>
          <i className="ti ti-ad-2" style={{ fontSize:isMobile?14:18, color:"#bbb" }} />
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#aaa" }}>
            {isMobile ? "320 × 50" : "728 × 90"}
          </span>
        </div>
        <div style={{ width:1, height:divH, background:"#e0e0da", flexShrink:0 }} />
        <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:isMobile?9:10, color:"#aaa" }}>
            {isMobile ? "Mobile banner — insert ad tag here" : "Leaderboard — insert ad tag here"}
          </span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#bbb" }}>
            Responsive · switches format by breakpoint
          </span>
        </div>
      </div>
    </div>
  );
}

// ── STATIC PAGES ───────────────────────────────────────────────────────


function LoremAdvertisingPage({ onBack }) {
  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Advertising</div>
        <h1 style={{fontSize:26,fontWeight:600,color:"#1a1a1a",marginBottom:12,lineHeight:1.3}}>Reach developers and designers who build things</h1>
        <p style={{fontSize:15,color:"#888",lineHeight:1.8}}>LoremForge is used daily by frontend developers, UI/UX designers, full-stack engineers, and anyone who builds interfaces and needs realistic placeholder content fast. These are technically literate, tool-savvy professionals who know what they want — and act on it.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:28}}>
        {[
          {label:"Primary Audience",value:"Frontend & full-stack developers"},
          {label:"Secondary Audience",value:"UI/UX designers & product teams"},
          {label:"Geography",value:"Primarily UK-based"},
          {label:"Ad Formats",value:"728×90 leaderboard, 320×50 mobile, 300×250 sidebar"},
        ].map(item=>(
          <div key={item.label} className="card" style={{padding:"14px 16px"}}>
            <div style={{fontSize:10,color:"#aaa",letterSpacing:".08em",textTransform:"uppercase",fontFamily:"DM Mono,monospace",marginBottom:6}}>{item.label}</div>
            <div style={{fontSize:13,color:"#555",lineHeight:1.5}}>{item.value}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{marginBottom:20}}>
        <div style={{fontSize:11,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".08em",marginBottom:12,textTransform:"uppercase"}}>Get in touch</div>
        <p style={{fontSize:14,color:"#888",lineHeight:1.8,marginBottom:16}}>
          We offer direct advertising placements on LoremForge — well suited to developer tools, SaaS products, design resources, hosting providers, coding courses, and any product that serves the developer and designer community. Enquiries are handled personally.
        </p>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,background:GREENBG,border:`1.5px solid #bbf7d0`,borderRadius:5,padding:"10px 18px"}}>
          <i className="ti ti-mail" style={{fontSize:15,color:GREEN}}/>
          <a href="mailto:contact.loremforge@gmail.com" style={{fontFamily:"DM Mono,monospace",fontSize:13,color:GREEN,textDecoration:"none",letterSpacing:".03em"}}>contact.loremforge@gmail.com</a>
        </div>
        <p style={{fontSize:12,color:"#bbb",marginTop:12,fontStyle:"italic"}}>Contact us directly for rates, formats and availability.</p>
      </div>
    </div>
  );
}

function LoremAboutPage({ onBack }) {
  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>About Us</div>
        <h1 style={{fontSize:26,fontWeight:600,color:"#1a1a1a",marginBottom:12,lineHeight:1.3}}>Built by people who've felt the friction</h1>
      </div>
      <div className="card" style={{marginBottom:16,lineHeight:1.9}}>
        <p style={{fontSize:14,color:"#777",marginBottom:16}}>
          Our team has spent over a decade working across web development and digital media — building products, shipping interfaces, and supporting teams across most industries you can name. We've worked with startups finding their feet and enterprises managing complex digital estates. What connects all of it is time spent in the tools.
        </p>
        <p style={{fontSize:14,color:"#777",marginBottom:16}}>
          Anyone who's built a UI knows the small, repetitive frustrations that add up: hunting down a Lorem Ipsum generator, getting something that outputs twelve identical paragraphs, needing dummy JSON that actually looks realistic, wanting placeholder images at a specific size without opening a design tool. None of these are big problems. But they're constant ones.
        </p>
        <p style={{fontSize:14,color:"#777",marginBottom:16}}>
          In 2026, we set out to consolidate the best of these everyday developer utilities into one well-designed, fast, and genuinely useful place. LoremForge is the result — eight tools covering the most common placeholder content needs, all AI-powered where that adds real value, and completely free to use.
        </p>
        <p style={{fontSize:14,color:"#777"}}>
          We're continuing to add tools and refine what's here. If something's missing that you'd find useful, we'd genuinely like to know.
        </p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
        {[
          {icon:"ti-calendar",label:"Founded",value:"2026"},
          {icon:"ti-map-pin",label:"Based in",value:"United Kingdom"},
          {icon:"ti-tool",label:"Tools available",value:"8 and growing"},
          {icon:"ti-code",label:"Built for",value:"Developers & designers"},
        ].map(item=>(
          <div key={item.label} className="card" style={{padding:"12px 14px",textAlign:"center"}}>
            <i className={`ti ${item.icon}`} style={{fontSize:20,color:GREEN,display:"block",marginBottom:8}}/>
            <div style={{fontSize:10,color:"#bbb",letterSpacing:".08em",textTransform:"uppercase",fontFamily:"DM Mono,monospace",marginBottom:4}}>{item.label}</div>
            <div style={{fontSize:13,color:"#555"}}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoremSubscribePage({ onBack }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Subscribe</div>
        <h1 style={{fontSize:26,fontWeight:600,color:"#1a1a1a",marginBottom:12,lineHeight:1.3}}>A monthly email for developers who build things</h1>
        <p style={{fontSize:15,color:"#888",lineHeight:1.8}}>We send out a monthly email with hints, tips, and practical advice for developers and designers — covering frontend techniques, useful tools, workflow improvements, and the occasional deep dive. Concise, actionable, and worth the two minutes it takes to read.</p>
      </div>
      {!submitted ? (
        <div className="card" style={{maxWidth:480}}>
          <div style={{fontSize:13,color:"#888",marginBottom:20,lineHeight:1.7}}>Enter your email below and we'll add you to our monthly list. First Monday of every month, straight to your inbox — free, forever.</div>
          <div style={{marginBottom:12}}>
            <label>Your email address</label>
            <input type="email" placeholder="you@yourcompany.com" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <button className="btn btn-full" onClick={()=>{ if(email.includes("@")) setSubmitted(true); }} disabled={!email.includes("@")}>
            <i className="ti ti-mail"/> Subscribe — it's free
          </button>
          <p style={{fontSize:11,color:"#bbb",marginTop:10,textAlign:"center",fontFamily:"DM Mono,monospace"}}>No spam. Unsubscribe any time.</p>
        </div>
      ) : (
        <div className="card" style={{textAlign:"center",padding:"32px 24px",maxWidth:480}}>
          <i className="ti ti-circle-check" style={{fontSize:36,color:GREEN,display:"block",marginBottom:12}}/>
          <div style={{fontSize:16,fontWeight:600,color:"#1a1a1a",marginBottom:8}}>You're in!</div>
          <div style={{fontSize:13,color:"#888"}}>Thanks for subscribing. Your first edition lands next Monday.</div>
        </div>
      )}
    </div>
  );
}

function LoremBlogPage({ onBack, onNavigate }) {
  const [article, setArticle] = useState(null);
  usePushState(article ? `/blog/${article}` : '/blog');
  useEffect(() => {
    if (article) {
      const post = posts.find(p => p.slug === article);
      if (post) {
        document.title = post.title + ' | LoremForge';
        let m = document.querySelector('meta[name="description"]');
        if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
        m.content = post.intro;
        let c = document.querySelector('link[rel="canonical"]');
        if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c); }
        c.href = 'https://loremforge.co.uk/blog/' + article;
      }
    }
  }, [article]);
  usePushState(article ? `/blog/${article}` : '/blog');
  const posts = [
    {
      slug:"history-of-lorem-ipsum",
      title:"The Surprisingly Long History of Lorem Ipsum",
      readTime:"7 min read",
      category:"Design & Development",
      intro:"You've pasted it into a thousand wireframes without a second thought. But where did Lorem Ipsum actually come from — and why has a scrambled passage of ancient Latin become the universal language of placeholder content?",
      body:`Walk into any design studio, open any UI mockup, inspect any prototype in progress, and there it is. Lorem ipsum dolor sit amet, consectetur adipiscing elit. It's so ubiquitous in the world of web development and design that most people who use it daily have never once wondered what it means, where it came from, or why it's Latin.

The answer, it turns out, is more interesting than you'd expect.

THE ANCIENT SOURCE

Lorem ipsum is derived from De Finibus Bonorum et Malorum — a philosophical treatise written by the Roman orator and statesman Marcus Tullius Cicero in 45 BC. The title translates roughly as "On the Ends of Good and Evil", and the work is a detailed exploration of the ethical theories of the major ancient philosophical schools — Epicureanism, Stoicism, and the philosophy of Plato.

The original Latin passage that Lorem Ipsum is drawn from reads: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit" — which translates as "Nor is there anyone who loves pain itself, since it is pain and thus wants to obtain it."

The familiar Lorem ipsum text is a scrambled, truncated, and altered version of this passage. Words have been rearranged, removed, or slightly modified to make the text flow as convincing filler without being directly readable as coherent Latin. It reads like real text at a glance — and that, as it turns out, was entirely the point.

THE TYPESETTING ERA

The use of Lorem Ipsum as placeholder text is most often traced back to the 1500s, when an unknown printer scrambled the passage to use as type specimen text. In the days of movable type, printers needed to demonstrate typefaces, layouts, and spacing without the distraction of meaningful content. A reader looking at a type specimen needed to evaluate the letterforms and their arrangement — not get drawn into reading the actual words.

Lorem ipsum served this purpose perfectly. It had the rhythm and visual texture of real Latin prose. The word lengths varied naturally. The letter distribution looked authentic. And crucially, it was unfamiliar enough to most readers that it wouldn't trigger the instinct to actually read it. It was designed to be seen, not read.

The practice continued largely unchanged through centuries of printing and typesetting. When hot metal typesetting gave way to phototypesetting in the 1960s and 1970s, Lorem ipsum came with it. Letraset — the dry-transfer lettering sheets used by designers before desktop publishing — included Lorem ipsum on their sheets as standard placeholder text.

THE DESKTOP PUBLISHING REVOLUTION

Lorem ipsum's transition into the digital world happened in the 1980s, largely driven by Aldus PageMaker — the pioneering desktop publishing software that first brought professional-grade layout tools to personal computers. Aldus included Lorem ipsum as default placeholder text in PageMaker's template sheets, and from that moment, its adoption became effectively universal.

Every designer who trained on PageMaker learned to reach for Lorem ipsum as a matter of instinct. When Adobe later acquired Aldus and developed InDesign as the successor to PageMaker, Lorem ipsum came along. When the web design industry grew out of desktop publishing conventions in the 1990s, Lorem ipsum came with it.

By the time the first Lorem ipsum generator websites appeared in the early 2000s, the text had already been in continuous professional use for the better part of five centuries. The web just made it easier to get more of it.

THE MODERN ERA AND ITS ALTERNATIVES

The standard Lorem ipsum text runs to a few hundred words — not enough for every design need. This spawned a small industry of Lorem ipsum generators offering extended versions, random variations, and increasingly creative alternatives.

Today the landscape has expanded considerably. Hipster ipsum offers artisanal, craft-focused filler. Corporate ipsum delivers the synergistic buzzword soup of business communication. Developer-flavoured variants use technical jargon as their raw material. JSON placeholder APIs generate structured dummy data. The underlying principle — convincing filler that doesn't distract from the design — remains exactly what Cicero's rearranged prose offered to that anonymous 16th-century typesetter.

The specific words have always mattered less than what they do: hold space, simulate content weight, and let the design speak for itself. Two thousand years after Cicero wrote De Finibus, his words are still doing exactly that — just in slightly more scrambled form, in considerably more browser tabs.`,
    },
    {
      slug:"why-developers-use-lorem-ipsum",
      title:"Why Developers Use Lorem Ipsum — and When You Should Use Something Else",
      readTime:"5 min read",
      category:"Development",
      intro:"Lorem ipsum is everywhere in development and design. But it is not always the right choice. Here is when it helps, when it hurts, and what the alternatives are.",
      body:`Lorem ipsum is so deeply embedded in the web development workflow that most developers reach for it automatically, without stopping to ask whether it is actually the right tool for the situation. Most of the time it is. But not always — and understanding when to use it and when not to is a small distinction that makes a meaningful difference to output quality.

WHY LOREM IPSUM EXISTS

The purpose of placeholder text is to separate the evaluation of design from the distraction of content. When a designer is reviewing a layout, or a developer is testing component rendering, readable meaningful text introduces cognitive noise. The eye is drawn to words with meaning. Opinions form about content that was never the point of the exercise. Lorem ipsum short-circuits this by providing text that looks like language but does not function as it.

This is the core use case and it is a genuinely good one. For any situation where you need to evaluate visual design, component spacing, typography, or layout behaviour without real content available, Lorem ipsum does exactly what it should.

WHEN LOREM IPSUM IS NOT THE RIGHT CHOICE

The problems arise when Lorem ipsum is used as a permanent substitute for thinking about content, rather than a temporary placeholder for when content is not yet available.

The most common example is in component design. If you are building a card component that will display a user name and a short bio, using generic Lorem ipsum obscures important questions: how does the component handle a very long name? What happens when the bio is two sentences versus eight? Does truncation work correctly? Does the layout break when real-world content variation is introduced? Lorem ipsum, with its predictable word lengths and consistent paragraph density, will hide all of these edge cases until they surface in production.

For these situations, realistic dummy data is far more useful. Names, email addresses, product descriptions, and prices that reflect actual data characteristics will stress-test your components in a way that Lorem ipsum cannot.

REALISTIC ALTERNATIVES FOR DIFFERENT CONTEXTS

For user data — names, emails, job titles, addresses — a fake data generator that produces realistic values is always preferable to Lorem ipsum when testing data-driven interfaces. The visual and functional difference between a table populated with realistic names and one populated with Lorem ipsum fragments is significant when evaluating whether the design actually works.

For product copy, the best alternative is often a small set of real or near-real examples. Writing three or four realistic product descriptions takes ten minutes and produces a far more accurate picture of how a product listing will look in production than any generated text can.

For structural content like legal pages, about sections, and blog posts, Lorem ipsum is fine precisely because the content itself is not what is being evaluated — only the typographic presentation and layout behaviour.

THE PRACTICAL RULE

Use Lorem ipsum when you are evaluating design and layout and content is genuinely not available yet. Use realistic placeholder data when you are building components that will render real variable content and you need to understand how the component behaves under real conditions. The distinction is simple but applying it consistently produces noticeably better work.`,
    },
    {
      slug:"best-placeholder-image-services-2026",
      title:"The Best Placeholder Image Services for Web Development in 2026",
      readTime:"5 min read",
      category:"Design & Development",
      intro:"Not all placeholder image services are equal. Here is a practical comparison of the main options, what each one is best for, and when to use which.",
      body:`Every frontend developer has needed a placeholder image at some point — a stand-in for content that does not exist yet, sized correctly and ready to drop into a layout without breaking anything. The options have multiplied considerably over the years. Here is a clear comparison of the most useful ones available in 2026.

LOREM PICSUM

Lorem Picsum (picsum.photos) is the most widely used placeholder image service and for good reason. It serves real photographs from a curated collection, sized to your exact pixel dimensions, via a simple URL structure: https://picsum.photos/400/300 returns a random 400x300 image.

The killer feature is seeded images. Adding a seed parameter — https://picsum.photos/seed/myapp/400/300 — returns the same image every time for that seed value. This means your layout stays visually consistent across page refreshes and test runs, which makes it far more useful for design review than random images that change on every reload.

Picsum also supports greyscale and blur filters via URL parameters, which is occasionally useful for specific design contexts. It is the right default choice for most situations.

PLACEHOLD.CO

Placehold.co takes a different approach — it generates flat colour placeholder images with the dimensions displayed as text in the centre. A request to https://placehold.co/400x300 returns a grey rectangle with "400x300" written on it.

This is less visually interesting than Picsum but serves a specific purpose well: when you need to make image dimensions immediately legible in a layout for review purposes. It supports custom background and text colours via URL parameters and requires no third-party photography, which makes it suitable for use in environments with strict content policies.

VIA PLACEHOLDER

Via.placeholder.com works similarly to Placehold.co — solid colour backgrounds with dimension labels. It is the older of the two services and slightly less flexible in terms of customisation options, but reliable and widely supported.

WHEN TO USE EACH

For general UI development and design review where visual quality matters, Lorem Picsum with a fixed seed is the clear choice. The realistic photography produces a much more accurate impression of how a finished interface will look.

For technical documentation, component libraries, and design systems where clarity of dimensions is more important than visual realism, Placehold.co is better — the labelled dimensions make it immediately clear what space is allocated for imagery.

For any situation where you need predictable, dependency-free placeholders that will work in any environment, either of the solid-colour services is the safer choice since they do not rely on third-party photograph collections.

A NOTE ON PRODUCTION

All of these services are development and design tools. None of them should be referenced in production code — both because the services can be unavailable or slow, and because real content should always replace placeholder content before anything ships. Placeholder images in a live product are a sign of an incomplete build, and search engines and accessibility tools will treat missing meaningful images accordingly.`,
    },
    {
      slug:"json-placeholder-data-guide",
      title:"JSON Placeholder Data — A Developer Guide to Realistic Dummy Data",
      readTime:"6 min read",
      category:"Development",
      intro:"Generic placeholder JSON is everywhere in tutorials and demos. But realistic dummy data — structured and formatted the way production data actually looks — is far more useful when building real interfaces. Here is why it matters and how to generate it effectively.",
      body:`There is a gap between the JSON that appears in most development tutorials and the JSON that real applications actually work with. Tutorial JSON looks like this: name: "John Doe", email: "john@example.com", age: 30. Real application data looks like this: name: "Priya Ramasubramanian", email: "p.ramasubramanian@northbridgepartners.co.uk", created_at: "2024-11-03T09:17:42Z", subscription_tier: "pro", last_login_ip: "82.45.201.17".

The difference is not just cosmetic. The way you build and test components changes significantly based on the realistic characteristics of the data they will receive.

WHY REALISTIC DATA STRUCTURE MATTERS

Consider building a user table component. With tutorial-style dummy data, every name fits neatly in a cell, every email address is roughly the same length, and nothing breaks. With realistic data, you immediately encounter the questions that actually matter in production: how does the table handle a name with thirty-two characters? What happens when an email address causes the column to overflow on a 1024px viewport? How does the component behave when last_login is null because the user has never logged in?

These are not edge cases — they are normal conditions in production data. Building against realistic dummy data forces you to address them during development rather than discovering them after launch.

THE COMPONENTS OF REALISTIC JSON

Realistic JSON dummy data shares several characteristics with real production data. IDs are UUIDs rather than sequential integers — because almost no production system uses simple integer IDs any more, and UUID formatting affects column width and copy-paste behaviour in ways that matter. Dates are ISO 8601 formatted strings with timezone offsets, not simplified date-only values. Names reflect realistic cultural and linguistic diversity rather than a parade of Anglo-Saxon names. Email addresses use realistic domain patterns including corporate domains, not just gmail.com.

Numerical values have realistic distributions — prices are not round numbers, ratings are not always five stars, counts are not always small integers.

STRUCTURING NESTED DATA

Real application JSON is rarely flat. A product object might contain a nested seller object, an array of category tags, a reviews array with nested reviewer objects, and a variants array with stock levels per variant. Building components against flat placeholder data and then switching to nested production data mid-build is a common source of refactoring work that could have been avoided.

When generating dummy JSON for development purposes, match the nesting depth and structure of your actual data schema as closely as possible, even if the values themselves are placeholder. The structure is what your component logic depends on — the values are what the user sees.

USING JSON PLACEHOLDER DATA EFFECTIVELY

The most efficient approach is to generate a realistic set of dummy data once at the start of a project, based on your actual data schemas, and reuse it consistently throughout development. This produces visual consistency across component development sessions, makes design reviews more meaningful, and ensures that edge cases surface during development rather than in production.

For rapid prototyping where schemas are not yet defined, a generated set of plausible user, product, or content objects is far more useful than hand-written tutorial data — both because it is faster to produce and because the realistic values give a much more accurate impression of how the finished interface will look and behave.`,
    }
,
    {
      slug:"css-design-tokens-guide",
      title:"CSS Design Tokens — What They Are and Why Every Project Needs Them",
      readTime:"6 min read",
      category:"Frontend Development",
      intro:"Design tokens are the single source of truth for your visual language — colours, spacing, typography, and more. Here is what they are, how they work, and why adopting them early saves significant pain later.",
      body:`If you have ever worked on a project where the same shade of blue is defined in four different places, or where changing the base font size requires hunting through dozens of CSS files, you have experienced the problem that design tokens solve. They are one of those concepts that seems abstract until you have worked on a project without them, at which point the value becomes immediately obvious.

WHAT DESIGN TOKENS ARE

A design token is a named variable that stores a single design decision. Instead of writing color: #1a56db in your CSS, you write color: var(--color-primary). The token --color-primary is defined once, in one place, and referenced everywhere it is used.

The power is not just in the variable itself — it is in what the token represents. A design token is not just a CSS variable. It is a named, documented, intentional design decision that exists independently of any specific implementation. The same token can be expressed in CSS custom properties, JavaScript objects, iOS Swift variables, or Android XML resources. It is the design system's vocabulary, platform-agnostic.

THE THREE TIERS OF TOKENS

A well-structured token system has three tiers. Global tokens are the raw values — --color-blue-600: #1a56db. These are the palette, not yet assigned meaning. Alias tokens assign semantic meaning to global tokens — --color-interactive: var(--color-blue-600). These describe intent rather than appearance. Component tokens are the most specific tier — --button-background-color: var(--color-interactive). These connect semantic meaning to specific components.

This hierarchy is what makes design token systems powerful for theming. To create a dark theme, you do not rewrite every component. You redefine the alias tokens for dark mode — --color-interactive becomes a lighter blue — and every component that references those tokens updates automatically.

IMPLEMENTING TOKENS IN A PROJECT

The simplest implementation is CSS custom properties defined at the :root level. This gives you global scope and cascade-based overrides for themes. For projects that need tokens in JavaScript as well as CSS, tools like Style Dictionary from Amazon allow you to define tokens once in JSON and compile them to CSS custom properties, JavaScript ES modules, and any other format you need simultaneously.

The discipline that makes token systems work is not technical — it is organisational. Every time a new colour, spacing value, or typography decision is made, it needs to go into the token system rather than being hardcoded at the point of use. The enforcement of this discipline is what separates projects with genuine design token systems from projects with a handful of CSS variables that get ignored when someone is in a hurry.

Start with colour and spacing. These are the highest-value tokens to systematise early because they are the most frequently referenced and the most painful to change at scale. Typography tokens follow naturally, and from there the system grows to cover everything from border radii to animation durations.`,
    },
    {
      slug:"web-accessibility-checklist-developers",
      title:"A Practical Web Accessibility Checklist for Developers",
      readTime:"7 min read",
      category:"Frontend Development",
      intro:"Accessibility is not a feature to add at the end — it is a quality standard to build in from the start. This checklist covers the most impactful things developers can do to make their work genuinely usable by everyone.",
      body:`Web accessibility is one of those areas where the gap between knowing it matters and actually doing it consistently is frustratingly wide. The WCAG guidelines run to hundreds of criteria across multiple conformance levels. Most developers know they should be thinking about accessibility but are unclear on where to start and what actually moves the needle.

This is not a comprehensive audit framework. It is a practical checklist of the things that make the biggest real-world difference, prioritised by impact and ease of implementation.

SEMANTIC HTML FIRST

The single highest-leverage accessibility improvement you can make is using correct semantic HTML. A button that performs an action should be a button element, not a div with an onClick. A navigation landmark should be a nav element. Headings should reflect document hierarchy using h1 through h6 in logical order, not be chosen based on their default visual size.

Semantic HTML is free. It requires no additional libraries, no extra code, and no configuration. It is simply a matter of using the right element for the right purpose. Screen readers, keyboard navigation, and browser accessibility features all build on semantic structure — when the structure is correct, much of the accessibility comes with it.

KEYBOARD NAVIGATION

Every interactive element on your site must be reachable and operable using only a keyboard. Tab should move focus forward through interactive elements, Shift+Tab should move it backward, Enter and Space should activate buttons and links, and Escape should close modals and dropdowns.

Test this by unplugging your mouse and trying to use your own site. This exercise surfaces accessibility issues faster than any automated tool. Common failures include custom dropdown menus that trap keyboard focus, modal dialogs that do not move focus to the first interactive element when they open, and interactive elements that are not in the natural tab order because they are positioned with CSS.

COLOUR CONTRAST

Text must have sufficient contrast against its background to be readable by people with low vision or colour blindness. WCAG AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. WCAG AAA requires 7:1 and 4.5:1 respectively.

Check your contrast ratios using the WebAIM Contrast Checker or the browser's built-in accessibility tools. Pay particular attention to placeholder text in form fields, disabled state text, and text on coloured backgrounds — these are where low contrast issues most commonly occur.

IMAGES AND ALT TEXT

Every meaningful image must have descriptive alt text. Decorative images that add no information should have empty alt attributes (alt="") so screen readers skip them. Images that are links need alt text describing the destination, not the image itself.

The quality of alt text matters as much as its presence. "Image" or "photo" is not useful alt text. A description that conveys the meaningful content of the image — what it shows, what it communicates — is what assistive technology users need.

FORM LABELS AND ERROR MESSAGES

Every form input must have an associated label. Placeholder text is not a label — it disappears when the user starts typing, leaving them without context. Use the label element with a for attribute matching the input's id, or use aria-label for cases where a visible label is not appropriate.

Error messages must be specific and helpful. "Invalid input" is not useful. "Please enter a valid UK postcode" tells the user exactly what to fix. Associate error messages with their fields using aria-describedby so screen readers announce them when the field receives focus.

AUTOMATED TESTING AS A BASELINE

Tools like axe, Lighthouse's accessibility audit, and the WAVE browser extension will catch around 30% of accessibility issues automatically. Run them on every page you build as a baseline check — they are fast, free, and will catch the most egregious problems.

The remaining 70% requires human testing, ideally including testing with actual assistive technology users. But the automated baseline is where to start, and fixing everything an automated tool flags is a meaningful improvement over doing nothing.`,
    },
    {
      slug:"frontend-performance-optimisation-guide",
      title:"Frontend Performance Optimisation — The Developer Guide to Faster Websites",
      readTime:"8 min read",
      category:"Frontend Development",
      intro:"Page speed is not just a user experience concern — it directly affects search rankings, conversion rates, and revenue. Here is a systematic guide to the optimisations that make the biggest real-world difference.",
      body:`The relationship between page speed and business outcomes is well established. Google uses Core Web Vitals as a ranking signal. Every 100ms of additional load time reduces conversion rates measurably on e-commerce sites. Users on mobile networks abandon pages that take more than three seconds to load at rates that make the business case for performance work straightforward.

Despite this, performance optimisation is still treated as a bonus task on many projects — something to look at if there is time rather than a first-class quality requirement. This guide is structured around the optimisations with the highest impact-to-effort ratio.

MEASURE BEFORE YOU OPTIMISE

The first rule of performance work is that you cannot improve what you do not measure. Before making any changes, establish a baseline using real measurement tools. Lighthouse in Chrome DevTools gives you a comprehensive performance audit with specific recommendations. WebPageTest provides more detailed waterfall analysis and the ability to test from different locations and connection speeds. Google Search Console's Core Web Vitals report shows you real-user data from your actual visitors.

The metrics that matter most are Largest Contentful Paint (LCP) — how long until the main content is visible — First Input Delay (FID) or Interaction to Next Paint (INP) — how responsive the page is to user interaction — and Cumulative Layout Shift (CLS) — how much the layout jumps around as assets load.

IMAGE OPTIMISATION

Images are almost always the largest contributor to page weight and the highest-impact area for optimisation. The improvements available are significant and the effort is low.

Serve images in modern formats. WebP provides 25-35% smaller file sizes than JPEG at equivalent quality. AVIF provides even better compression for browsers that support it. Use the picture element with format fallbacks to serve the best format each browser supports.

Implement responsive images. A 1200px wide image served to a 375px mobile screen is transferring roughly ten times the data needed. Use the srcset attribute with multiple image sizes and let the browser select the appropriate one.

Lazy load images below the fold. The loading="lazy" attribute on img elements is now supported across all modern browsers and defers loading of off-screen images until the user scrolls toward them, reducing initial page weight significantly.

JAVASCRIPT BUNDLE OPTIMISATION

JavaScript is the most expensive resource type on the web — not just in bytes, but in CPU time required to parse and execute it. A 200KB JavaScript file takes significantly more processing time than a 200KB image.

Code splitting is the most impactful JavaScript optimisation available in modern build tools. Instead of shipping all your JavaScript in a single bundle, split it so that each route or feature only loads the code it actually needs. Vite and webpack both support this natively.

Audit your dependencies regularly. The node_modules directory is where performance goes to die on many projects. Tools like bundlephobia.com show you the size cost of every npm package. Before adding a new dependency, check whether the functionality is achievable with native browser APIs or a lighter-weight alternative.

CACHING AND CDN

Static assets — JavaScript, CSS, images, fonts — should be served with long-lived cache headers and content-hashed filenames. A filename like main.a3f9c2.js changes when the content changes, so you can set cache expiry to one year with confidence that users will always get the latest version when it changes, while getting the cached version on subsequent visits otherwise.

Serving assets from a CDN that has edge nodes close to your users reduces latency significantly for geographically distributed audiences. Vercel and Netlify both include global CDN distribution automatically, which is one of the practical reasons they have become the default deployment platforms for frontend projects.`,
    },
    {
      slug:"git-workflow-best-practices",
      title:"Git Workflow Best Practices for Frontend Developers",
      readTime:"6 min read",
      category:"Development",
      intro:"A consistent Git workflow is the foundation of effective collaboration on any development team. Here is a practical guide to the conventions and practices that keep codebases clean and deployments predictable.",
      body:`Git is the one tool that every developer uses every day, and yet Git workflow — the conventions around how branches are named, how commits are written, how pull requests are structured — is surprisingly inconsistently implemented across teams. The cost of poor Git hygiene compounds over time: history that is difficult to understand, merges that are harder than they should be, and deployments where nobody is quite sure what changed.

These are the practices that make the biggest difference in day-to-day development velocity and long-term codebase maintainability.

BRANCH NAMING CONVENTIONS

Consistent branch naming makes the purpose of every branch immediately legible from a branch list. A widely adopted convention follows the pattern type/description — for example feature/user-authentication, fix/checkout-form-validation, or chore/update-dependencies.

The type prefix indicates the category of work. Feature branches contain new functionality. Fix branches address bugs. Chore branches handle maintenance tasks like dependency updates or build configuration changes. Refactor branches improve code structure without changing behaviour. This mirrors the conventional commits standard for commit messages and makes the branch list self-documenting.

Keep branch names lowercase, use hyphens as separators, and keep descriptions concise but meaningful. A branch named fix/nav-dropdown-keyboard-focus tells you everything you need to know. A branch named jeremys-changes tells you nothing useful.

COMMIT MESSAGE QUALITY

A well-written commit message is a communication to your future self and your teammates about what changed and why. The convention that has become the industry standard is Conventional Commits: a short header following the format type(scope): description, followed by an optional body with more detail.

Examples: feat(auth): add email verification flow. fix(checkout): prevent double-submission on payment form. docs(readme): update local development setup instructions.

The most important discipline is writing commit messages that explain the why, not just the what. The diff shows what changed. The commit message should explain why that change was necessary and what problem it solves. Future developers — including yourself six months from now — will thank you.

PULL REQUEST STRUCTURE

Pull requests are a communication tool as much as a code review mechanism. A good PR description includes a summary of what changed and why, a note on any testing performed, screenshots or recordings for UI changes, and any context the reviewer needs to evaluate the implementation sensibly.

Keep PRs focused and small. A PR that touches 20 files across three unrelated concerns is significantly harder to review than three focused PRs with clear, singular purposes. The discipline of keeping PRs small forces clearer thinking about scope and makes the review process faster and more effective.

PROTECTING THE MAIN BRANCH

The main or master branch should always be in a deployable state. Protecting it with branch rules — requiring pull request reviews before merging, requiring status checks to pass, preventing direct pushes — is not bureaucracy. It is the practice that prevents the category of incidents where someone pushes a breaking change directly to production at 4pm on a Friday.

Combined with a CI pipeline that runs tests and linting on every pull request, branch protection turns your main branch into a reliable foundation rather than a shared workspace where anything might be broken at any given moment.`,
    }
  ];

  if (article) {
    const post = posts.find(p=>p.slug===article);
    return (
      <div>
        <div style={{marginBottom:8}}>
          <span style={{fontSize:11,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".08em"}}>{post.category}</span>
        </div>
        <h1 style={{fontSize:22,fontWeight:600,color:"#1a1a1a",marginBottom:12,lineHeight:1.4}}>{post.title}</h1>
        <div style={{display:"flex",gap:16,marginBottom:28}}>          <span style={{fontSize:12,color:"#bbb",fontFamily:"DM Mono,monospace"}}>{post.readTime}</span>
        </div>
        <p style={{fontSize:15,color:"#777",lineHeight:1.9,marginBottom:24,borderLeft:`2.5px solid ${GREEN}`,paddingLeft:16,fontStyle:"italic"}}>{post.intro}</p>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {post.body.split("\n\n").map((para,i)=>(
            para.trim() === para.trim().toUpperCase() && para.length < 80
              ? <h3 key={i} style={{fontSize:13,fontWeight:600,color:GREEN,letterSpacing:".08em",fontFamily:"DM Mono,monospace",marginTop:8}}>{para}</h3>
              : <p key={i} style={{fontSize:14,color:"#666",lineHeight:1.9}}>{para}</p>
          ))}
        </div>
        <BottomAdUnit />
        <SiteFooter onNavigate={(p) => { if(p === "blog") { setArticle(null); setTimeout(()=>{ const el=document.querySelector(".main-scroll"); if(el) el.scrollTop=0; window.scrollTo(0,0); },0); } else if(onNavigate) onNavigate(p); }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Blog</div>
        <h1 style={{fontSize:26,fontWeight:600,color:"#1a1a1a",marginBottom:8}}>For developers & designers</h1>
        <p style={{fontSize:14,color:"#aaa"}}>Tools, history, techniques and deep dives for people who build things on the web.</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {posts.map(post=>(
          <div key={post.slug} className="card" style={{cursor:"pointer",transition:"border-color .15s,box-shadow .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=GREEN;e.currentTarget.style.boxShadow=`0 2px 12px rgba(22,163,74,.08)`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#e8e8e2";e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.04)";}}
            onClick={()=>{ setArticle(post.slug); setTimeout(()=>{ const el=document.querySelector(".main-scroll"); if(el) el.scrollTop=0; window.scrollTo(0,0); },0); }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
              <div style={{flex:1}}>
                <span style={{fontSize:10,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".08em",display:"block",marginBottom:6}}>{post.category}</span>
                <h2 style={{fontSize:15,fontWeight:600,color:"#1a1a1a",marginBottom:8,lineHeight:1.4}}>{post.title}</h2>
                <p style={{fontSize:13,color:"#aaa",lineHeight:1.7}}>{post.intro}</p>
              </div>
            </div>
            <div style={{display:"flex",gap:16,marginTop:12,paddingTop:12,borderTop:"1.5px solid #f0f0eb",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",gap:12}}>                <span style={{fontSize:11,color:"#bbb",fontFamily:"DM Mono,monospace"}}>{post.readTime}</span>
              </div>
              <span style={{fontSize:11,color:GREEN,fontFamily:"DM Mono,monospace"}}>Read article →</span>
            </div>
          </div>
        ))}
      </div>
      <BottomAdUnit />
      <SiteFooter onNavigate={onNavigate} />
    </div>
  );
}


/* ──────────────────────────────────── PRIVACY POLICY PAGE ── */
function LoremPrivacyPage({ onBack }) {
  const sections = [
    {
      title: "Overview",
      body: `This Privacy Policy explains how LoremForge ("we", "us", "our") collects, uses and protects information when you visit loremforge.co.uk (the "Site"). By using the Site you agree to the practices described in this policy. If you do not agree, please discontinue use of the Site.

We are committed to ensuring your privacy is protected. This policy is effective from June 2026 and may be updated periodically. We will notify you of significant changes by updating the date at the top of this page.`
    },
    {
      title: "Information We Collect",
      body: `We do not require you to create an account or provide personal information to use LoremForge. However, the following information may be collected:

Automatically collected data: When you visit the Site, standard web server logs and analytics tools may record your IP address, browser type, operating system, referring URLs, pages visited and time spent on the Site. This data is used in aggregate form to understand how the Site is used and to improve it.

Tool inputs: LoremForge provides AI-powered placeholder content tools including lorem ipsum generators, JSON placeholder data generator, fake names and data generator, placeholder image generator and markdown block generator. Any text you enter into these tools is sent to the Anthropic API to generate a response and is not stored on our servers. We do not retain, log or analyse the content of your tool inputs.

Email address: If you choose to subscribe to our newsletter, we collect your email address for the sole purpose of sending you that newsletter. We do not share your email address with third parties.`
    },
    {
      title: "How We Use Your Information",
      body: `We use the information collected in the following ways:

To operate and improve the Site and its tools. To understand aggregate usage patterns and optimise the user experience. To send you our newsletter if you have subscribed. To serve relevant advertising through third-party ad networks including Google AdSense.

We do not sell, trade or rent your personal information to third parties. We do not use your tool inputs for any purpose other than generating the requested output via the Anthropic API.`
    },
    {
      title: "Third-Party Services",
      body: `LoremForge uses the following third-party services which may collect data independently under their own privacy policies:

Anthropic API: Tool inputs are processed by Anthropic's Claude API to generate AI responses. Anthropic's privacy policy applies to this processing. Please review Anthropic's privacy policy at anthropic.com/privacy.

Google AdSense: We display advertisements served by Google AdSense. Google may use cookies and similar technologies to serve ads based on your prior visits to this or other websites. You can opt out of personalised advertising by visiting Google's Ad Settings at adssettings.google.com.

Google Analytics: We may use Google Analytics to understand site usage. Google Analytics collects anonymised usage data. You can opt out using the Google Analytics Opt-out Browser Add-on.

Vercel: The Site is hosted on Vercel's infrastructure. Vercel may collect standard server logs. Please review Vercel's privacy policy at vercel.com/legal/privacy-policy.`
    },
    {
      title: "Cookies",
      body: `The Site uses cookies in the following ways:

Essential cookies: Required for the Site to function correctly. These cannot be disabled.

Analytics cookies: Used to collect anonymised information about how visitors use the Site. You can disable these in your browser settings.

Advertising cookies: Google AdSense may set cookies to serve personalised advertisements. You can manage your ad personalisation preferences at adssettings.google.com.

You can control cookie settings through your browser. Note that disabling certain cookies may affect the functionality of the Site.`
    },
    {
      title: "Data Retention",
      body: `We retain data only for as long as necessary for the purposes described in this policy. Newsletter subscriber email addresses are retained until you unsubscribe. Aggregate analytics data may be retained for up to 26 months. Tool input data is not retained — it is processed in real time and discarded.`
    },
    {
      title: "Your Rights",
      body: `Under UK data protection law (UK GDPR) you have the following rights:

The right to access personal data we hold about you. The right to correct inaccurate personal data. The right to erasure of your personal data. The right to restrict processing of your personal data. The right to data portability. The right to object to processing.

To exercise any of these rights, please contact us at contact.loremforge@gmail.com. We will respond to all requests within 30 days.`
    },
    {
      title: "Children's Privacy",
      body: `LoremForge is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will take steps to delete it promptly.`
    },
    {
      title: "Changes to This Policy",
      body: `We may update this Privacy Policy from time to time. We will post any changes on this page with an updated effective date. We encourage you to review this policy periodically. Your continued use of the Site after any changes constitutes your acceptance of the revised policy.`
    },
    {
      title: "Contact Us",
      body: `If you have any questions about this Privacy Policy or our data practices, please contact us at contact.loremforge@gmail.com. We are based in the United Kingdom.`
    },
  ];

  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Privacy Policy</div>
        <h1 style={{fontSize:26,fontWeight:600,color:"#1a1a1a",marginBottom:8,lineHeight:1.3}}>Privacy Policy</h1>
        <p style={{fontSize:13,color:"#aaa"}}>Effective date: June 2026 · loremforge.co.uk</p>
      </div>
      {sections.map((sec, i) => (
        <div key={i} className="card" style={{marginBottom:12,borderColor:"#e8e8e2"}}>
          <div style={{fontSize:13,fontWeight:600,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".04em",marginBottom:10,textTransform:"uppercase"}}>{"0" + (i+1).toString().slice(-2)} — {sec.title}</div>
          {sec.body.split("\n\n").map((para, j) => (
            <p key={j} style={{fontSize:14,color:"#777",lineHeight:1.85,marginBottom: j < sec.body.split("\n\n").length-1 ? 10 : 0}}>{para}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── SITE FOOTER ────────────────────────────────────────────────────────
function SiteFooter({ onNavigate }) {
  const links = [
    { label:"Blog",        icon:"ti-pencil",     page:"blog" },
    { label:"Advertising", icon:"ti-ad-2",        page:"advertising" },
    { label:"Subscribe",   icon:"ti-mail",        page:"subscribe" },
    { label:"About Us",    icon:"ti-info-circle", page:"about" },
    { label:"Privacy Policy", icon:"ti-shield",      page:"privacy" },
  ];
  return (
    <div style={{ marginTop:40, paddingTop:20, borderTop:"1.5px solid #e8e8e2" }}>
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8, marginBottom:16 }}>
        {links.map(l => (
          <button key={l.label} onClick={()=>onNavigate(l.page)} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 16px", background:"#fff", border:"1.5px solid #e8e8e2", borderRadius:5, color:"#aaa", fontSize:12, fontFamily:"DM Mono,monospace", cursor:"pointer", transition:"all .15s", letterSpacing:".03em", boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=GREEN; e.currentTarget.style.color=GREEN; e.currentTarget.style.background="#f0fdf4"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#e8e8e2"; e.currentTarget.style.color="#aaa"; e.currentTarget.style.background="#fff"; }}>
            <i className={`ti ${l.icon}`} style={{ fontSize:13 }} />
            {l.label}
          </button>
        ))}
      </div>
      <div style={{ textAlign:"center", fontFamily:"DM Mono,monospace", fontSize:10, color:"#ccc", paddingBottom:20, letterSpacing:".06em" }}>
        © {new Date().getFullYear()} LoremForge · loremforge.co.uk
      </div>
    </div>
  );
}


// ── SIDEBAR CONTENTS ───────────────────────────────────────────────────
function SidebarContents({ activeTool, setActiveTool, onClose }) {
  return (
    <>
      {/* Logo block — only shown in mobile drawer, hidden on desktop sidebar */}
      {onClose && (
        <div style={{ padding:"16px 16px 10px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1.5px solid #f0f0eb" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:28, height:28, background:GREEN, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 6px rgba(22,163,74,.3)" }}>
              <svg width="15" height="14" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                
                <path d="M2 10 Q2 9 3 9 L17 9 Q18 9 18 10 L17 12 L3 12 Z" fill="#fff"/>
                
                <path d="M3 9.5 L1 11 L3 11 Z" fill="#fff"/>
                
                <rect x="6" y="12" width="8" height="2" rx="0.5" fill="#fff"/>
                
                <rect x="4" y="14" width="12" height="2.5" rx="1" fill="#fff"/>
                
                <rect x="10" y="1" width="6" height="3.5" rx="1" fill="#fff" transform="rotate(-35 13 2.5)"/>
                
                <rect x="12.5" y="3" width="2" height="6" rx="0.8" fill="#fff" transform="rotate(-35 13.5 6)"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily:"DM Mono,monospace", fontSize:14, fontWeight:500, color:"#1a1a1a", letterSpacing:".02em" }}>LoremForge</div>
              <div style={{ fontSize:9, color:"#bbb", letterSpacing:".1em", textTransform:"uppercase" }}>placeholder toolkit</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#bbb", cursor:"pointer", fontSize:20, padding:"2px 6px", lineHeight:1, borderRadius:4 }}>×</button>
        </div>
      )}
      <div style={{ padding:"10px 16px 6px", fontSize:10, letterSpacing:".1em", color:"#ccc", textTransform:"uppercase", fontWeight:600 }}>Tools</div>
      {TOOLS.map(tool => (
        <button key={tool.id} className="sidebar-tool-btn"
          onClick={() => { setActiveTool(tool.id); onClose && onClose(); }}
          style={{
            borderLeft: `2.5px solid ${activeTool === tool.id ? GREEN : "transparent"}`,
            background: activeTool === tool.id ? GREENBG : "transparent",
          }}>
          <i className={`ti ${tool.icon}`} style={{ fontSize:15, color: activeTool === tool.id ? GREEN : "#ccc", flexShrink:0 }} />
          <div>
            <div style={{ fontSize:12, color: activeTool === tool.id ? "#1a1a1a" : "#777", fontWeight: activeTool === tool.id ? 600 : 400 }}>
              {tool.label}
            </div>
            <div style={{ fontSize:10, color:"#ccc", marginTop:1 }}>{tool.desc}</div>
          </div>
        </button>
      ))}
      <div style={{ margin:"12px 16px 0", paddingTop:12, borderTop:"1.5px solid #f0f0eb" }}>
        <div style={{ fontSize:10, letterSpacing:".08em", color:"#ddd", marginBottom:5, textTransform:"uppercase" }}>Powered by</div>
        <div style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#ccc" }}>Claude Sonnet 4</div>
      </div>
      <SidebarAdUnit />
    </>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────
export default function App() {
  const [activeTool, setActiveTool] = useState("classic");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage]             = useState(null);
  const isMobile = useIsMobile();

  const handleNav  = p => { setPage(p); setDrawerOpen(false); };
  const handleBack = () => setPage(null);

  // ── Dynamic meta tags & URLs ──
  const toolMeta = TOOL_META[activeTool] || {};
  const pageMeta = page ? PAGE_META[page] : null;
  const currentMeta = pageMeta || (page ? SITE_DEFAULT : toolMeta);
  useDocumentMeta(currentMeta.title || SITE_DEFAULT.title, currentMeta.desc || SITE_DEFAULT.desc);
  usePushState(pageMeta ? pageMeta.path : (toolMeta.path || "/"));

  // Scroll to top whenever page or tool changes
  useEffect(() => {
    const el = document.querySelector('.main-scroll');
    if (el) el.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [page, activeTool]);

  const activeMeta = TOOLS.find(t => t.id === activeTool);

  const toolComponents = {
    classic:   <ClassicLorem />,
    hipster:   <HipsterIpsum />,
    devspeak:  <DevSpeak />,
    corporate: <CorporateWaffle />,
    markdown:  <MarkdownBlocks />,
    json:      <JSONPlaceholder />,
    avatar:    <PlaceholderImages />,
    names:     <FakeNamesData />,
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight:"100vh", background:"#f8f8f5", display:"flex", flexDirection:"column" }}>

        {/* Desktop header */}
        {!isMobile && (
          <div style={{ borderBottom:"1.5px solid #e8e8e2", padding:"13px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fff", flexShrink:0, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }} onClick={handleBack}>
              <div style={{ width:30, height:30, background:GREEN, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(22,163,74,.3)" }}>
                <svg width="16" height="14" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                
                <path d="M2 10 Q2 9 3 9 L17 9 Q18 9 18 10 L17 12 L3 12 Z" fill="#fff"/>
                
                <path d="M3 9.5 L1 11 L3 11 Z" fill="#fff"/>
                
                <rect x="6" y="12" width="8" height="2" rx="0.5" fill="#fff"/>
                
                <rect x="4" y="14" width="12" height="2.5" rx="1" fill="#fff"/>
                
                <rect x="10" y="1" width="6" height="3.5" rx="1" fill="#fff" transform="rotate(-35 13 2.5)"/>
                
                <rect x="12.5" y="3" width="2" height="6" rx="0.8" fill="#fff" transform="rotate(-35 13.5 6)"/>
              </svg>
              </div>
              <div>
                <div style={{ fontFamily:"DM Mono,monospace", fontSize:16, fontWeight:500, color:"#1a1a1a", letterSpacing:".02em" }}>LoremForge</div>
                <div style={{ fontSize:10, color:"#bbb", letterSpacing:".1em", textTransform:"uppercase" }}>placeholder toolkit for developers</div>
              </div>
            </div>
            <div style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#ccc", letterSpacing:".06em" }}>
              {page ? page.toUpperCase() : activeMeta?.label.toUpperCase()}
            </div>
          </div>
        )}

        {/* Mobile header */}
        {isMobile && (
          <div className="mobile-header" style={{ borderBottom:"1.5px solid #e8e8e2", padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fff", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={handleBack}>
              <div style={{ width:26, height:26, background:GREEN, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="14" height="12" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                
                <path d="M2 10 Q2 9 3 9 L17 9 Q18 9 18 10 L17 12 L3 12 Z" fill="#fff"/>
                
                <path d="M3 9.5 L1 11 L3 11 Z" fill="#fff"/>
                
                <rect x="6" y="12" width="8" height="2" rx="0.5" fill="#fff"/>
                
                <rect x="4" y="14" width="12" height="2.5" rx="1" fill="#fff"/>
                
                <rect x="10" y="1" width="6" height="3.5" rx="1" fill="#fff" transform="rotate(-35 13 2.5)"/>
                
                <rect x="12.5" y="3" width="2" height="6" rx="0.8" fill="#fff" transform="rotate(-35 13.5 6)"/>
              </svg>
              </div>
              <span style={{ fontFamily:"DM Mono,monospace", fontSize:14, fontWeight:500, color:"#1a1a1a" }}>LoremForge</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:12, color:"#bbb" }}>{page || activeMeta?.label}</span>
              <button onClick={() => setDrawerOpen(true)}
                style={{ background:"none", border:"1.5px solid #e8e8e2", borderRadius:5, color:"#777", cursor:"pointer", padding:"6px 10px", display:"flex", alignItems:"center", gap:5, fontSize:12 }}>
                <i className="ti ti-menu-2" style={{ fontSize:14 }} /> Tools
              </button>
            </div>
          </div>
        )}

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="mobile-drawer">
            <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)} />
            <div className="mobile-drawer-panel">
              <SidebarContents activeTool={activeTool} setActiveTool={t=>{setActiveTool(t);setPage(null);}} onClose={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        {/* Body */}
        <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
          {!isMobile && (
            <div className="sidebar">
              <SidebarContents activeTool={activeTool} setActiveTool={t=>{setActiveTool(t);setPage(null);}} onClose={null} />
            </div>
          )}
          <div className="main-scroll">
            <div className="main-inner">
              {page ? (
                <>
                  <InlineAdUnit />
                  <div style={{ marginTop:24 }}>
                    {page==="blog"        && <LoremBlogPage key={page} onBack={handleBack} onNavigate={handleNav} />}
                    {page==="advertising" && <LoremAdvertisingPage onBack={handleBack} />}
                    {page==="subscribe"   && <LoremSubscribePage onBack={handleBack} />}
                    {page==="about"       && <LoremAboutPage onBack={handleBack} />}
                    {page==="privacy"     && <LoremPrivacyPage onBack={handleBack} />}
                  </div>
                  {page !== "blog" && <BottomAdUnit />}
                  {page !== "blog" && <SiteFooter onNavigate={handleNav} />}
                  {isMobile && <div style={{ height:32 }} />}
                </>
              ) : (
                <>
                  <div style={{ marginBottom:20 }}>
                    <h1 className="tool-title" style={{ fontSize:18, fontWeight:600, color:"#1a1a1a", marginBottom:4 }}>{activeMeta?.label}</h1>
                    <p style={{ fontSize:13, color:"#aaa" }}>{activeMeta?.desc}</p>
                  </div>
                  <InlineAdUnit />
                  <div style={{ marginTop:24 }}>
                    {toolComponents[activeTool]}
                  </div>
                  <BottomAdUnit />
                  <SiteFooter onNavigate={handleNav} />
                  {isMobile && <div style={{ height:32 }} />}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
