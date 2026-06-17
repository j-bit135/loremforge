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


function PageWrapper({ onBack, children }) {
  return (
    <div>
      <button onClick={onBack} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"transparent", border:"1.5px solid #e8e8e2", borderRadius:5, color:"#aaa", fontSize:12, fontFamily:"DM Mono,monospace", padding:"6px 14px", cursor:"pointer", marginBottom:24, transition:"all .15s" }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=GREEN;e.currentTarget.style.color=GREEN;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="#e8e8e2";e.currentTarget.style.color="#aaa";}}>
        <i className="ti ti-arrow-left" style={{fontSize:13}}/> Back to tools
      </button>
      {children}
    </div>
  );
}

function LoremAboutPage({ onBack }) {
  return (
    <PageWrapper onBack={onBack}>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>About Us</div>
        <h1 style={{fontSize:26,fontWeight:600,color:"#1a1a1a",marginBottom:12,lineHeight:1.3}}>Built by people who've felt the friction</h1>
      </div>
      <div className="card" style={{marginBottom:16,lineHeight:1.9}}>
        <p style={{fontSize:14,color:"#777",marginBottom:16}}>
          Our team has spent over a decade working across web development and digital media — building products, shipping interfaces, and supporting teams across most industries you can name. What connects all of it is time spent in the tools.
        </p>
        <p style={{fontSize:14,color:"#777",marginBottom:16}}>
          Anyone who's built a UI knows the small, repetitive frustrations that add up: hunting down a Lorem Ipsum generator, getting something that outputs twelve identical paragraphs, needing dummy JSON that actually looks realistic, wanting placeholder images at a specific size without opening a design tool.
        </p>
        <p style={{fontSize:14,color:"#777",marginBottom:16}}>
          In 2026, we set out to consolidate the best of these everyday developer utilities into one well-designed, fast, and genuinely useful place. LoremForge is the result — tools covering the most common placeholder content needs, all AI-powered where that adds real value, and completely free to use.
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
    </PageWrapper>
  );
}

function LoremBlogPage({ onBack }) {
  const [article, setArticle] = useState(null);
  const posts = [
    {
      slug:"history-of-lorem-ipsum",
      title:"The Surprisingly Long History of Lorem Ipsum",
      date:"2 June 2026",
      readTime:"7 min read",
      category:"Design & Development",
      intro:"You have pasted it into a thousand wireframes without a second thought. But where did Lorem Ipsum actually come from - and why has a scrambled passage of ancient Latin become the universal language of placeholder content?",
      body:"Lorem ipsum is derived from De Finibus Bonorum et Malorum, a philosophical treatise written by Marcus Tullius Cicero in 45 BC. The original passage translates as: Nor is there anyone who loves pain itself, since it is pain and thus wants to obtain it.\n\nThe familiar Lorem ipsum text is a scrambled, altered version of this passage. It was used by an unknown printer in the 1500s as type specimen text to demonstrate typefaces without distracting readers with meaningful content.\n\nTHE TYPESETTING ERA\n\nLorem ipsum served this purpose perfectly. It had the rhythm and visual texture of real Latin prose. Word lengths varied naturally. And crucially, it was unfamiliar enough that it would not trigger the instinct to actually read it. It was designed to be seen, not read.\n\nTHE DESKTOP PUBLISHING REVOLUTION\n\nLorem ipsum moved into the digital world in the 1980s through Aldus PageMaker, the pioneering desktop publishing software. From that moment its adoption became effectively universal.\n\nTHE MODERN ERA\n\nToday the landscape has expanded considerably. Hipster ipsum offers artisanal filler. Corporate ipsum delivers buzzword soup. Developer variants use technical jargon. JSON placeholder APIs generate structured dummy data.\n\nTwo thousand years after Cicero wrote De Finibus, his words are still holding space in browser tabs across the world.",
    },
    ,
    {
      slug:"why-developers-use-lorem-ipsum",
      title:"Why Developers Use Lorem Ipsum and When You Should Use Something Else",
      date:"3 June 2026",
      readTime:"5 min read",
      category:"Development",
      intro:"Lorem ipsum is everywhere in development and design. But it is not always the right choice. Here is when it helps, when it hurts, and what the alternatives are.",
      body:"Lorem ipsum is so deeply embedded in the web development workflow that most developers reach for it automatically. Most of the time it is the right choice. But not always.\n\nWHY LOREM IPSUM EXISTS\n\nThe purpose of placeholder text is to separate the evaluation of design from the distraction of content. When a designer is reviewing a layout readable meaningful text introduces cognitive noise. Lorem ipsum short-circuits this by providing text that looks like language but does not function as it.\n\nWHEN IT IS NOT THE RIGHT CHOICE\n\nThe problems arise in component design. If you are building a card that displays a user name and bio, Lorem ipsum hides important questions: how does the component handle a very long name? What happens when the bio is eight sentences? Does truncation work correctly? Lorem ipsum with its predictable word lengths will hide all these edge cases until they surface in production.\n\nREALISTIC ALTERNATIVES\n\nFor user data - names, emails, job titles - a fake data generator that produces realistic values is always preferable when testing data-driven interfaces. For product copy, a small set of real examples takes ten minutes and produces a far more accurate picture than any generated text.\n\nTHE PRACTICAL RULE\n\nUse Lorem ipsum when evaluating design and layout and content is not yet available. Use realistic placeholder data when building components that will render real variable content.",
    },
    {
      slug:"best-placeholder-image-services-2026",
      title:"The Best Placeholder Image Services for Web Development in 2026",
      date:"4 June 2026",
      readTime:"5 min read",
      category:"Design and Development",
      intro:"Not all placeholder image services are equal. Here is a practical comparison of the main options, what each one is best for, and when to use which.",
      body:"Every frontend developer has needed a placeholder image at some point - a stand-in for content that does not exist yet, sized correctly and ready to drop into a layout.\n\nLOREM PICSUM\n\nLorem Picsum (picsum.photos) is the most widely used placeholder image service. It serves real photographs sized to your exact pixel dimensions via a simple URL: https://picsum.photos/400/300 returns a random 400x300 image.\n\nThe killer feature is seeded images. Adding a seed parameter returns the same image every time for that seed value, keeping your layout visually consistent across page refreshes.\n\nPLACEHOLD.CO\n\nPlacehold.co generates flat colour placeholder images with dimensions displayed as text in the centre. This is less visually interesting than Picsum but serves a specific purpose well: when you need to make image dimensions immediately legible in a layout for review purposes.\n\nWHEN TO USE EACH\n\nFor general UI development where visual quality matters, Lorem Picsum with a fixed seed is the clear choice. For technical documentation and component libraries where clarity of dimensions matters more than visual realism, Placehold.co is better.\n\nA NOTE ON PRODUCTION\n\nAll placeholder image services are development tools only. None should be referenced in production code.",
    },
    {
      slug:"json-placeholder-data-guide",
      title:"JSON Placeholder Data - A Developer Guide to Realistic Dummy Data",
      date:"5 June 2026",
      readTime:"6 min read",
      category:"Development",
      intro:"Generic placeholder JSON is everywhere in tutorials. But realistic dummy data structured the way production data actually looks is far more useful when building real interfaces.",
      body:"There is a gap between the JSON in most tutorials and the JSON real applications work with. Tutorial JSON: name: John Doe, email: john@example.com, age: 30. Real data: name: Priya Ramasubramanian, email: p.ramasubramanian@northbridgepartners.co.uk, created_at: 2024-11-03T09:17:42Z.\n\nWHY REALISTIC DATA STRUCTURE MATTERS\n\nWith tutorial-style dummy data, every name fits neatly in a cell and nothing breaks. With realistic data you immediately encounter the questions that matter in production: how does the table handle a thirty-two character name? What happens when an email causes column overflow on a narrow viewport? How does the component behave when last_login is null because the user has never logged in?\n\nTHE COMPONENTS OF REALISTIC JSON\n\nRealistic JSON shares several characteristics with real production data. IDs are UUIDs rather than sequential integers. Dates are ISO 8601 formatted strings with timezone offsets. Names reflect realistic cultural diversity. Email addresses use realistic domain patterns including corporate domains.\n\nSTRUCTURING NESTED DATA\n\nReal application JSON is rarely flat. A product object might contain a nested seller object, category tags array, and reviews with nested reviewer objects. Building against flat placeholder data and then switching to nested production data mid-build is a common source of avoidable refactoring.\n\nUSING JSON PLACEHOLDER DATA EFFECTIVELY\n\nGenerate a realistic set of dummy data once at the start of a project based on your actual schemas and reuse it throughout development. This produces visual consistency across component sessions and ensures edge cases surface during development rather than in production.",
    }
    ,
    {
      slug:"css-design-tokens-guide",
      title:"CSS Design Tokens - What They Are and Why Every Project Needs Them",
      date:"6 June 2026",
      readTime:"6 min read",
      category:"Frontend Development",
      intro:"Design tokens are the single source of truth for your visual language - colours, spacing, typography, and more. Here is what they are, how they work, and why adopting them early saves significant pain later.",
      body:"A design token is a named variable that stores a single design decision. Instead of writing color: #1a56db in your CSS you write color: var(--color-primary). The token is defined once in one place and referenced everywhere it is used.\n\nWHAT DESIGN TOKENS ARE\n\nThe power is not just in the variable itself - it is in what the token represents. A design token is not just a CSS variable. It is a named documented intentional design decision that exists independently of any specific implementation. The same token can be expressed in CSS custom properties, JavaScript objects, iOS Swift variables, or Android XML resources.\n\nTHE THREE TIERS OF TOKENS\n\nA well-structured token system has three tiers. Global tokens are the raw values. Alias tokens assign semantic meaning to global tokens - they describe intent rather than appearance. Component tokens are the most specific tier connecting semantic meaning to specific components.\n\nThis hierarchy is what makes design token systems powerful for theming. To create a dark theme you do not rewrite every component. You redefine the alias tokens for dark mode and every component that references those tokens updates automatically.\n\nIMPLEMENTING TOKENS IN A PROJECT\n\nThe simplest implementation is CSS custom properties defined at the root level. For projects that need tokens in JavaScript as well as CSS, tools like Style Dictionary from Amazon allow you to define tokens once in JSON and compile them to CSS custom properties and JavaScript modules simultaneously.",
    },
    {
      slug:"web-accessibility-checklist-developers",
      title:"A Practical Web Accessibility Checklist for Developers",
      date:"7 June 2026",
      readTime:"7 min read",
      category:"Frontend Development",
      intro:"Accessibility is not a feature to add at the end - it is a quality standard to build in from the start. This checklist covers the most impactful things developers can do to make their work genuinely usable by everyone.",
      body:"SEMANTIC HTML FIRST\n\nThe single highest-leverage accessibility improvement you can make is using correct semantic HTML. A button that performs an action should be a button element not a div with an onClick. A navigation landmark should be a nav element. Headings should reflect document hierarchy using h1 through h6 in logical order.\n\nKEYBOARD NAVIGATION\n\nEvery interactive element on your site must be reachable and operable using only a keyboard. Tab should move focus forward, Shift+Tab backward, Enter and Space should activate buttons and links, and Escape should close modals and dropdowns. Test this by unplugging your mouse and trying to use your own site.\n\nCOLOUR CONTRAST\n\nText must have sufficient contrast against its background. WCAG AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. Check your ratios using the WebAIM Contrast Checker or browser accessibility tools.\n\nIMAGES AND ALT TEXT\n\nEvery meaningful image must have descriptive alt text. Decorative images should have empty alt attributes so screen readers skip them. The quality of alt text matters as much as its presence.\n\nAUTOMATED TESTING AS A BASELINE\n\nTools like axe, Lighthouse accessibility audit, and the WAVE browser extension will catch around 30% of issues automatically. Run them on every page as a baseline check. The remaining 70% requires human testing.",
    },
    {
      slug:"frontend-performance-optimisation-guide",
      title:"Frontend Performance Optimisation - The Developer Guide to Faster Websites",
      date:"8 June 2026",
      readTime:"8 min read",
      category:"Frontend Development",
      intro:"Page speed directly affects search rankings, conversion rates, and revenue. Here is a systematic guide to the optimisations that make the biggest real-world difference.",
      body:"MEASURE BEFORE YOU OPTIMISE\n\nThe first rule of performance work is that you cannot improve what you do not measure. Establish a baseline using Lighthouse in Chrome DevTools, WebPageTest for detailed waterfall analysis, and Google Search Console Core Web Vitals for real-user data. The metrics that matter most are Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift.\n\nIMAGE OPTIMISATION\n\nImages are almost always the largest contributor to page weight. Serve images in modern formats - WebP provides 25-35% smaller file sizes than JPEG at equivalent quality. Implement responsive images using the srcset attribute. Lazy load images below the fold using the loading=lazy attribute which is now supported across all modern browsers.\n\nJAVASCRIPT BUNDLE OPTIMISATION\n\nJavaScript is the most expensive resource type on the web - not just in bytes but in CPU time required to parse and execute it. Code splitting is the most impactful optimisation available in modern build tools. Audit your dependencies regularly using tools like bundlephobia.com which shows the size cost of every npm package.\n\nCACHING AND CDN\n\nStatic assets should be served with long-lived cache headers and content-hashed filenames. Serving assets from a CDN that has edge nodes close to your users reduces latency significantly. Vercel and Netlify both include global CDN distribution automatically.",
    },
    {
      slug:"git-workflow-best-practices",
      title:"Git Workflow Best Practices for Frontend Developers",
      date:"9 June 2026",
      readTime:"6 min read",
      category:"Development",
      intro:"A consistent Git workflow is the foundation of effective collaboration on any development team. Here is a practical guide to the conventions and practices that keep codebases clean and deployments predictable.",
      body:"BRANCH NAMING CONVENTIONS\n\nConsistent branch naming makes the purpose of every branch immediately legible. A widely adopted convention follows the pattern type/description - for example feature/user-authentication, fix/checkout-form-validation, or chore/update-dependencies. Keep branch names lowercase, use hyphens as separators, and keep descriptions concise but meaningful.\n\nCOMMIT MESSAGE QUALITY\n\nA well-written commit message is a communication to your future self and your teammates about what changed and why. The convention that has become the industry standard is Conventional Commits: a short header following the format type(scope): description, followed by an optional body with more detail. Write messages that explain the why not just the what.\n\nPULL REQUEST STRUCTURE\n\nPull requests are a communication tool as much as a code review mechanism. A good PR description includes a summary of what changed and why, a note on testing performed, and screenshots for UI changes. Keep PRs focused and small - a PR that touches 20 files across three unrelated concerns is significantly harder to review than three focused PRs.\n\nPROTECTING THE MAIN BRANCH\n\nThe main branch should always be in a deployable state. Protecting it with branch rules requiring pull request reviews and status checks prevents the category of incidents where someone pushes a breaking change directly to production at 4pm on a Friday.",
    }
  ];

  if (article) {
    const post = posts.find(p=>p.slug===article);
    return (
      <PageWrapper onBack={()=>setArticle(null)}>
        <div style={{marginBottom:8}}>
          <span style={{fontSize:11,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".08em"}}>{post.category}</span>
        </div>
        <h1 style={{fontSize:22,fontWeight:600,color:"#1a1a1a",marginBottom:12,lineHeight:1.4}}>{post.title}</h1>
        <div style={{display:"flex",gap:16,marginBottom:28}}>
          <span style={{fontSize:12,color:"#bbb",fontFamily:"DM Mono,monospace"}}>{post.date}</span>
          <span style={{fontSize:12,color:"#bbb",fontFamily:"DM Mono,monospace"}}>{post.readTime}</span>
        </div>
        <p style={{fontSize:15,color:"#777",lineHeight:1.9,marginBottom:24,borderLeft:"2.5px solid "+GREEN,paddingLeft:16,fontStyle:"italic"}}>{post.intro}</p>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {post.body.split("\n\n").map((para,i)=>(
            para.trim() === para.trim().toUpperCase() && para.length < 80
              ? <h3 key={i} style={{fontSize:13,fontWeight:600,color:GREEN,letterSpacing:".08em",fontFamily:"DM Mono,monospace",marginTop:8}}>{para}</h3>
              : <p key={i} style={{fontSize:14,color:"#666",lineHeight:1.9}}>{para}</p>
          ))}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper onBack={onBack}>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Blog</div>
        <h1 style={{fontSize:26,fontWeight:600,color:"#1a1a1a",marginBottom:8}}>For developers & designers</h1>
        <p style={{fontSize:14,color:"#aaa"}}>Tools, history, techniques and deep dives for people who build things on the web.</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {posts.map(post=>(
          <div key={post.slug} className="card" style={{cursor:"pointer",transition:"border-color .15s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=GREEN}
            onMouseLeave={e=>e.currentTarget.style.borderColor="#e8e8e2"}
            onClick={()=>setArticle(post.slug)}>
            <div style={{flex:1}}>
              <span style={{fontSize:10,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".08em",display:"block",marginBottom:6}}>{post.category}</span>
              <h2 style={{fontSize:15,fontWeight:600,color:"#1a1a1a",marginBottom:8,lineHeight:1.4}}>{post.title}</h2>
              <p style={{fontSize:13,color:"#aaa",lineHeight:1.7}}>{post.intro}</p>
            </div>
            <div style={{display:"flex",gap:16,marginTop:12,paddingTop:12,borderTop:"1.5px solid #f0f0eb",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",gap:12}}>
                <span style={{fontSize:11,color:"#bbb",fontFamily:"DM Mono,monospace"}}>{post.date}</span>
                <span style={{fontSize:11,color:"#bbb",fontFamily:"DM Mono,monospace"}}>{post.readTime}</span>
              </div>
              <span style={{fontSize:11,color:GREEN,fontFamily:"DM Mono,monospace"}}>Read article</span>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

function LoremContactPage({ onBack }) {
  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Contact</div>
        <h1 style={{fontSize:26,fontWeight:600,color:"#1a1a1a",marginBottom:12,lineHeight:1.3}}>Get in Touch</h1>
      </div>
      <div className="card" style={{marginBottom:16,lineHeight:1.9}}>
        <p style={{fontSize:14,color:"#555"}}>
          Whether you have a question, a suggestion, or want to discuss advertising - we would love to hear from you. Reach us at <a href="mailto:contact.jwgroup@proton.me" style={{color:GREEN}}>contact.jwgroup@proton.me</a>.
        </p>
      </div>
      {[
        { label:"General Enquiries", body:"Have a suggestion for a new tool, found a bug or want to give feedback? We would love to hear from developers, designers and content creators using LoremForge. Email contact.jwgroup@proton.me and we will get back to you as soon as possible." },
        { label:"Advertising & Partnerships", body:"LoremForge reaches developers, designers and content creators who need placeholder content tools in their daily workflow. We welcome advertising from developer tools, design software, hosting providers, SaaS products and creative services. Contact us at contact.jwgroup@proton.me to discuss opportunities." },
      ].map((sec, i) => (
        <div key={i} className="card" style={{marginBottom:12,borderColor:"#e8e8e2"}}>
          <div style={{fontSize:13,fontWeight:600,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".04em",marginBottom:10,textTransform:"uppercase"}}>{"0" + (i+1).toString().slice(-2)} - {sec.label}</div>
          <p style={{fontSize:14,color:"#555",lineHeight:1.85}}>{sec.body}</p>
        </div>
      ))}
    </div>
  );
}

function LoremTermsPage({ onBack }) {
  const sections = [
    { title:"Acceptance of Terms", body:"By using LoremForge (loremforge.co.uk) you agree to these Terms of Service. If you do not agree, please do not use our website." },
    { title:"Use of Tools", body:"LoremForge provides free placeholder content tools for personal and professional use. Generated content is provided for use as placeholder material only and should be replaced with real content before publication." },
    { title:"Generated Content", body:"All content generated by LoremForge tools is for placeholder purposes only. We make no warranties regarding the suitability of generated content for any specific purpose." },
    { title:"Advertising", body:"LoremForge displays third-party advertisements including those served by Google AdSense. We are not responsible for the content of third-party ads." },
    { title:"Intellectual Property", body:"LoremForge and all associated tools, branding and original content are the intellectual property of JW Group. All rights reserved." },
    { title:"Limitation of Liability", body:"LoremForge and its operators shall not be liable for any damages arising from your use of our tools or website." },
    { title:"Changes to Terms", body:"We may update these terms at any time. Continued use of LoremForge constitutes acceptance of any revised terms." },
    { title:"Governing Law", body:"These terms are governed by the laws of England and Wales." },
    { title:"Contact", body:"Questions about these Terms of Service? Contact us at contact.jwgroup@proton.me." },
  ];
  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Legal</div>
        <h1 style={{fontSize:26,fontWeight:500,color:"#1a1a1a",marginBottom:8,lineHeight:1.3}}>Terms of Service</h1>
        <p style={{fontSize:13,color:"#aaa"}}>Last updated: June 2025 - loremforge.co.uk</p>
      </div>
      {sections.map((sec, i) => (
        <div key={i} className="card" style={{marginBottom:12,borderColor:"#e8e8e2"}}>
          <div style={{fontSize:13,fontWeight:600,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".04em",marginBottom:10,textTransform:"uppercase"}}>{"0" + (i+1).toString().slice(-2)} - {sec.title}</div>
          <p style={{fontSize:14,color:"#555",lineHeight:1.85}}>{sec.body}</p>
        </div>
      ))}
    </div>
  );
}

function LoremPrivacyPage({ onBack }) {
  const sections = [
    { title:"Overview", body:"This Privacy Policy explains how LoremForge collects, uses and protects information when you visit loremforge.co.uk. By using the Site you agree to the practices described in this policy." },
    { title:"Information We Collect", body:"We do not require you to create an account or provide personal information to use LoremForge. Analytics tools may record your IP address, browser type, pages visited and time spent on the Site in aggregate form. Any text you enter into our AI tools is sent to the Anthropic API to generate a response and is not stored on our servers." },
    { title:"Third-Party Services", body:"LoremForge uses the Anthropic API to power our AI tools. We may display advertisements served by Google AdSense. We may use Google Analytics to understand site usage in aggregate form." },
    { title:"Cookies", body:"Essential cookies are required for the Site to function. Analytics and advertising cookies may be set by third-party services. You can control cookie settings through your browser." },
    { title:"Your Rights", body:"Under UK GDPR you have the right to access, correct, or delete your personal data. To exercise these rights, contact us at contact.jwgroup@proton.me." },
    { title:"Contact Us", body:"If you have any questions about this Privacy Policy, please contact us at contact.jwgroup@proton.me. We are based in the United Kingdom." },
  ];
  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Privacy Policy</div>
        <h1 style={{fontSize:26,fontWeight:600,color:"#1a1a1a",marginBottom:8,lineHeight:1.3}}>Privacy Policy</h1>
        <p style={{fontSize:13,color:"#aaa"}}>Effective date: June 2026 - loremforge.co.uk</p>
      </div>
      {sections.map((sec, i) => (
        <div key={i} className="card" style={{marginBottom:12,borderColor:"#e8e8e2"}}>
          <div style={{fontSize:13,fontWeight:600,color:GREEN,fontFamily:"DM Mono,monospace",letterSpacing:".04em",marginBottom:10,textTransform:"uppercase"}}>{"0" + (i+1).toString().slice(-2)} - {sec.title}</div>
          <p style={{fontSize:14,color:"#555",lineHeight:1.85}}>{sec.body}</p>
        </div>
      ))}
    </div>
  );
}

// ── SITE FOOTER ──────────────────────────────────────────────────────────────
function SiteFooter({ onNavigate }) {
  const links = [
    { label:"Blog",             icon:"ti-pencil",      page:"blog" },
    { label:"Contact",          icon:"ti-ad-2",        page:"contact" },
    { label:"About Us",         icon:"ti-info-circle", page:"about" },
    { label:"Privacy Policy",   icon:"ti-shield",      page:"privacy" },
    { label:"Terms of Service", icon:"ti-file-text",   page:"terms" },
  ];
  return (
    <div style={{ marginTop:40, paddingTop:20, borderTop:"1.5px solid #e8e8e2" }}>
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8, marginBottom:16 }}>
        {links.map(l => (
          <button key={l.label} onClick={()=>onNavigate(l.page)} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 16px", background:"#fff", border:"1.5px solid #e8e8e2", borderRadius:5, color:"#aaa", fontSize:12, fontFamily:"DM Mono,monospace", cursor:"pointer", transition:"all .15s", letterSpacing:".03em" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=GREEN; e.currentTarget.style.color=GREEN; e.currentTarget.style.background="#f0fdf4"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#e8e8e2"; e.currentTarget.style.color="#aaa"; e.currentTarget.style.background="#fff"; }}>
            <i className={"ti " + l.icon} style={{ fontSize:13 }} />
            {l.label}
          </button>
        ))}
      </div>
      <div style={{ textAlign:"center", fontFamily:"DM Mono,monospace", fontSize:10, color:"#ccc", paddingBottom:20, letterSpacing:".06em" }}>
        {new Date().getFullYear()} LoremForge - loremforge.co.uk
      </div>
    </div>
  );
}

// ── SIDEBAR CONTENTS ─────────────────────────────────────────────────────────
function SidebarContents({ activeTool, setActiveTool, onClose }) {
  return (
    <>
      {onClose && (
        <div style={{ padding:"16px 16px 10px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1.5px solid #e8e8e2" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:26,height:26,background:GREEN,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <i className="ti ti-align-left" style={{ fontSize:14, color:"#fff" }} />
            </div>
            <div>
              <div style={{ fontFamily:"DM Mono,monospace",fontSize:13,fontWeight:500,color:"#1a1a1a",letterSpacing:".02em" }}>LoremForge</div>
              <div style={{ fontSize:9,color:"#bbb",letterSpacing:".08em",textTransform:"uppercase" }}>Placeholder toolkit</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#bbb",cursor:"pointer",fontSize:18,padding:"4px",lineHeight:1 }}>x</button>
        </div>
      )}
      <div style={{ padding:"10px 16px 8px",fontSize:10,letterSpacing:".1em",color:"#bbb",textTransform:"uppercase" }}>Tools</div>
      {TOOLS.map(tool=>(
        <button key={tool.id} className="sidebar-tool-btn"
          onClick={()=>{ setActiveTool(tool.id); onClose&&onClose(); }}
          style={{ borderLeft:"2px solid " + (activeTool===tool.id ? GREEN : "transparent"), background:activeTool===tool.id ? GREENBG : "transparent" }}>
          <i className={"ti " + tool.icon} style={{ fontSize:15, color:activeTool===tool.id ? GREEN : "#bbb", flexShrink:0 }} />
          <div>
            <div style={{ fontSize:12,color:activeTool===tool.id ? "#1a1a1a" : "#888",fontWeight:activeTool===tool.id ? 600 : 400 }}>{tool.label}</div>
            <div style={{ fontSize:10,color:"#ccc",marginTop:1 }}>{tool.desc}</div>
          </div>
        </button>
      ))}
      <SidebarAdUnit />
    </>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTool, setActiveTool] = useState("classic");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage]             = useState(null);
  const isMobile = useIsMobile();

  const handleNav  = p => { setPage(p); setDrawerOpen(false); };
  const handleBack = () => setPage(null);

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

        {!isMobile && (
          <div style={{ borderBottom:"1.5px solid #e8e8e2", padding:"13px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fff", flexShrink:0, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }} onClick={handleBack}>
              <div style={{ width:30, height:30, background:GREEN, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className="ti ti-align-left" style={{ fontSize:16, color:"#fff" }} />
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

        {isMobile && (
          <div className="mobile-header" style={{ borderBottom:"1.5px solid #e8e8e2", padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fff", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={handleBack}>
              <div style={{ width:26, height:26, background:GREEN, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className="ti ti-align-left" style={{ fontSize:14, color:"#fff" }} />
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

        {drawerOpen && (
          <div className="mobile-drawer">
            <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)} />
            <div className="mobile-drawer-panel">
              <SidebarContents activeTool={activeTool} setActiveTool={t=>{setActiveTool(t);setPage(null);}} onClose={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

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
                    {page==="blog"        && <LoremBlogPage onBack={handleBack} />}
                    {page==="about"       && <LoremAboutPage onBack={handleBack} />}
                    {page==="privacy"     && <LoremPrivacyPage onBack={handleBack} />}
                    {page==="contact"     && <LoremContactPage onBack={handleBack} />}
                    {page==="terms"       && <LoremTermsPage onBack={handleBack} />}
                  </div>
                  <BottomAdUnit />
                  <SiteFooter onNavigate={handleNav} />
                  {isMobile && <div style={{ height:32 }} />}
                </>
              ) : (
                <>
                  <InlineAdUnit />
                  <div style={{ marginBottom:20, marginTop:24 }}>
                    <h1 className="tool-title" style={{ fontSize:18, fontWeight:600, color:"#1a1a1a", marginBottom:4 }}>{activeMeta?.label}</h1>
                    <p style={{ fontSize:13, color:"#aaa" }}>{activeMeta?.desc}</p>
                  </div>
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
