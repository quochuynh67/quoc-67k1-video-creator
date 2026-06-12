import type { Scene } from "./types";

const uid = () => crypto.randomUUID();

export type Template = {
  id: string;
  name: string;
  description: string;
  category: string;
  scenes: Omit<Scene, "id">[];
};

const fadeUp = `@keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}`;
const fadeLeft = `@keyframes fadeLeft{from{opacity:0;transform:translateX(-50px)}to{opacity:1;transform:translateX(0)}}`;
const fadeRight = `@keyframes fadeRight{from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:translateX(0)}}`;
const scaleIn = `@keyframes scaleIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}`;
const lineGrow = `@keyframes lineGrow{from{width:0}to{width:200px}}`;
const pulse = `@keyframes pulse{0%,100%{opacity:0.7}50%{opacity:1}}`;
const shimmer = `@keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}`;
const rotate = `@keyframes rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`;
const slideBar = `@keyframes slideBar{from{width:0}to{width:var(--w)}}`;
const floatY = `@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`;
const glow = `@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.4)}50%{box-shadow:0 0 50px rgba(99,102,241,0.9)}}`;

export const TEMPLATES: Template[] = [
  /* ═══════════════════════════════════════════
     1. LUXURY PRODUCT LAUNCH
  ═══════════════════════════════════════════ */
  {
    id: "luxury-product",
    name: "Luxury Product Launch",
    description: "Sang trọng, tinh tế - phù hợp ra mắt sản phẩm cao cấp",
    category: "Quảng cáo",
    scenes: [
      {
        name: "Brand Reveal",
        duration: 5000,
        background: "#07050a",
        sourceType: "html",
        html: `<div style="width:100%;height:100%;background:linear-gradient(135deg,#07050a 0%,#1a0e00 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Georgia,serif;overflow:hidden;position:relative;">
<style>${fadeUp}${lineGrow}${pulse}
.particles{position:absolute;width:100%;height:100%;pointer-events:none;}
.p{position:absolute;width:2px;height:2px;background:#c9a84c;border-radius:50%;animation:pulse 3s ease infinite;}
</style>
<div class="particles">
  <div class="p" style="left:10%;top:20%;animation-delay:0s;opacity:0.4;"></div>
  <div class="p" style="left:25%;top:70%;animation-delay:1s;opacity:0.3;"></div>
  <div class="p" style="left:80%;top:30%;animation-delay:0.5s;opacity:0.5;"></div>
  <div class="p" style="left:65%;top:80%;animation-delay:1.5s;opacity:0.3;"></div>
  <div class="p" style="left:90%;top:60%;animation-delay:2s;opacity:0.4;"></div>
</div>
<div style="text-align:center;z-index:1;">
  <div style="font-size:13px;letter-spacing:10px;color:#c9a84c;text-transform:uppercase;animation:fadeUp 0.8s ease both;animation-delay:0.3s;opacity:0;">Introducing</div>
  <div style="width:200px;height:1px;background:linear-gradient(to right,transparent,#c9a84c,transparent);margin:24px auto;animation:lineGrow 1.2s ease both;animation-delay:0.8s;"></div>
  <h1 style="font-size:90px;color:#fff;margin:0;letter-spacing:8px;animation:fadeUp 1s ease both;animation-delay:1s;opacity:0;text-shadow:0 0 60px rgba(201,168,76,0.3);">AURORA</h1>
  <div style="font-size:15px;letter-spacing:6px;color:#c9a84c;text-transform:uppercase;margin-top:16px;animation:fadeUp 1s ease both;animation-delay:1.4s;opacity:0;">Luxury Collection 2025</div>
  <div style="width:200px;height:1px;background:linear-gradient(to right,transparent,#c9a84c,transparent);margin:24px auto;animation:lineGrow 1.2s ease both;animation-delay:1.8s;"></div>
</div>
</div>`,
        url: "",
        transition: { id: "fade", duration: 800 },
        startTime: 0,
        autostartRender: true,
      },
      {
        name: "Product Feature",
        duration: 5000,
        background: "#0d0b1a",
        sourceType: "html",
        html: `<div style="width:100%;height:100%;background:linear-gradient(160deg,#0d0b1a 0%,#1a0e2e 60%,#0a0a0a 100%);display:flex;align-items:center;justify-content:center;font-family:'Helvetica Neue',sans-serif;overflow:hidden;gap:80px;padding:60px;">
<style>${fadeLeft}${fadeRight}${scaleIn}${pulse}
.feature{display:flex;align-items:flex-start;gap:16px;margin-bottom:28px;animation:fadeLeft 0.8s ease both;opacity:0;}
.dot{width:8px;height:8px;background:#c9a84c;border-radius:50%;margin-top:8px;flex-shrink:0;animation:pulse 2s infinite;}
</style>
<div style="flex:1;animation:fadeLeft 1s ease both;opacity:0;">
  <div style="font-size:12px;letter-spacing:6px;color:#c9a84c;text-transform:uppercase;margin-bottom:20px;">The Essence of Perfection</div>
  <h2 style="font-size:52px;color:#fff;margin:0 0 12px 0;line-height:1.1;font-weight:300;">AURORA<br><span style="color:#c9a84c;font-style:italic;">Parfum</span></h2>
  <div style="width:60px;height:2px;background:#c9a84c;margin-bottom:32px;"></div>
  <div class="feature" style="animation-delay:0.8s;">
    <div class="dot"></div>
    <div>
      <div style="color:#fff;font-size:16px;font-weight:500;">Top Notes</div>
      <div style="color:#94a3b8;font-size:14px;margin-top:4px;">Bergamot · Saffron · Pink Pepper</div>
    </div>
  </div>
  <div class="feature" style="animation-delay:1.1s;">
    <div class="dot"></div>
    <div>
      <div style="color:#fff;font-size:16px;font-weight:500;">Heart Notes</div>
      <div style="color:#94a3b8;font-size:14px;margin-top:4px;">Rose · Jasmine · Ylang Ylang</div>
    </div>
  </div>
  <div class="feature" style="animation-delay:1.4s;">
    <div class="dot"></div>
    <div>
      <div style="color:#fff;font-size:16px;font-weight:500;">Base Notes</div>
      <div style="color:#94a3b8;font-size:14px;margin-top:4px;">Oud Wood · Vanilla · Amber</div>
    </div>
  </div>
</div>
<div style="width:280px;height:380px;background:linear-gradient(160deg,#2d1f6e 0%,#1a0e2e 100%);border-radius:20px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(201,168,76,0.2);animation:scaleIn 1.2s ease both;animation-delay:0.2s;opacity:0;box-shadow:0 30px 80px rgba(0,0,0,0.6),inset 0 0 60px rgba(201,168,76,0.05);">
  <div style="text-align:center;">
    <div style="font-size:70px;filter:drop-shadow(0 0 30px rgba(201,168,76,0.5));animation:floatY 4s ease infinite;" >🏺</div>
    <div style="color:#c9a84c;font-size:13px;letter-spacing:3px;margin-top:16px;">EAU DE PARFUM</div>
    <div style="color:#ffffff60;font-size:11px;margin-top:6px;">100 ML</div>
  </div>
</div>
</div>`,
        url: "",
        transition: { id: "dissolve", duration: 600 },
        startTime: 0,
        autostartRender: true,
      },
      {
        name: "Call To Action",
        duration: 4000,
        background: "#07050a",
        sourceType: "html",
        html: `<div style="width:100%;height:100%;background:radial-gradient(ellipse at center,#1a0e2e 0%,#07050a 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Georgia,serif;overflow:hidden;text-align:center;">
<style>${scaleIn}${fadeUp}${pulse}${shimmer}
.btn{display:inline-block;padding:18px 48px;border:1px solid #c9a84c;color:#c9a84c;font-size:14px;letter-spacing:4px;text-transform:uppercase;font-family:'Helvetica Neue',sans-serif;animation:fadeUp 1s ease both;animation-delay:1.2s;opacity:0;cursor:pointer;position:relative;overflow:hidden;}
</style>
<div style="font-size:12px;letter-spacing:8px;color:#c9a84c;text-transform:uppercase;animation:fadeUp 0.8s ease both;animation-delay:0.2s;opacity:0;">Limited Edition</div>
<h1 style="font-size:82px;color:#fff;margin:20px 0 8px 0;letter-spacing:4px;font-weight:300;animation:scaleIn 1.2s ease both;animation-delay:0.5s;opacity:0;text-shadow:0 0 80px rgba(201,168,76,0.4);">AURORA</h1>
<div style="font-size:22px;color:#c9a84c;letter-spacing:2px;font-style:italic;animation:fadeUp 1s ease both;animation-delay:0.9s;opacity:0;">Only 500 Bottles Worldwide</div>
<div style="margin-top:48px;" class="btn">Discover Now</div>
<div style="font-size:12px;color:#ffffff30;letter-spacing:3px;margin-top:32px;text-transform:uppercase;animation:fadeUp 1s ease both;animation-delay:1.6s;opacity:0;">aurora-parfum.com</div>
</div>`,
        url: "",
        transition: { id: "fadeblack", duration: 1000 },
        startTime: 0,
        autostartRender: true,
      },
    ],
  },

  /* ═══════════════════════════════════════════
     2. TECH PRODUCT PROMO
  ═══════════════════════════════════════════ */
  {
    id: "tech-product",
    name: "Tech Product Promo",
    description: "Hiện đại, năng động - cho sản phẩm công nghệ, điện tử",
    category: "Quảng cáo",
    scenes: [
      {
        name: "Tech Hero",
        duration: 5000,
        background: "#03081a",
        sourceType: "html",
        html: `<div style="width:100%;height:100%;background:radial-gradient(ellipse at 30% 50%,#0f1f4a 0%,#03081a 60%);display:flex;align-items:center;justify-content:center;font-family:'Helvetica Neue',Arial,sans-serif;overflow:hidden;gap:100px;padding:80px;">
<style>${fadeLeft}${fadeRight}${scaleIn}${glow}${floatY}${pulse}
.tech-badge{display:inline-block;padding:6px 14px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.4);border-radius:20px;font-size:11px;letter-spacing:3px;color:#818cf8;text-transform:uppercase;margin-bottom:20px;animation:fadeLeft 0.8s ease both;animation-delay:0.3s;opacity:0;}
.spec-row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);animation:fadeLeft 0.8s ease both;opacity:0;}
</style>
<div style="flex:1;">
  <div class="tech-badge">New 2025</div>
  <h1 style="font-size:68px;color:#fff;margin:0 0 8px 0;font-weight:700;letter-spacing:-1px;animation:fadeLeft 1s ease both;animation-delay:0.5s;opacity:0;">NovaPro<br><span style="background:linear-gradient(90deg,#6366f1,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">X7 Ultra</span></h1>
  <p style="font-size:18px;color:#94a3b8;margin:0 0 36px 0;animation:fadeLeft 0.8s ease both;animation-delay:0.8s;opacity:0;">Redefine your productivity.<br>Built for those who push boundaries.</p>
  <div class="spec-row" style="animation-delay:1s;">
    <span style="color:#94a3b8;font-size:14px;">Processor</span>
    <span style="color:#22d3ee;font-size:14px;font-weight:600;">NeuraCore X 4.8GHz</span>
  </div>
  <div class="spec-row" style="animation-delay:1.2s;">
    <span style="color:#94a3b8;font-size:14px;">Display</span>
    <span style="color:#22d3ee;font-size:14px;font-weight:600;">6.9" AMOLED 144Hz</span>
  </div>
  <div class="spec-row" style="animation-delay:1.4s;">
    <span style="color:#94a3b8;font-size:14px;">Battery</span>
    <span style="color:#22d3ee;font-size:14px;font-weight:600;">6000 mAh · 120W Fast</span>
  </div>
  <div class="spec-row" style="animation-delay:1.6s;">
    <span style="color:#94a3b8;font-size:14px;">Camera</span>
    <span style="color:#22d3ee;font-size:14px;font-weight:600;">200MP · AI Enhanced</span>
  </div>
</div>
<div style="width:260px;height:420px;background:linear-gradient(160deg,#1e2a5a,#0f1530);border-radius:32px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(99,102,241,0.25);animation:glow 3s ease infinite,floatY 5s ease infinite,scaleIn 1s ease both;animation-delay:0s,0s,0.3s;opacity:0;box-shadow:0 40px 100px rgba(0,0,0,0.7);">
  <div style="text-align:center;padding:20px;">
    <div style="font-size:72px;filter:drop-shadow(0 0 30px rgba(34,211,238,0.6));">📱</div>
    <div style="width:80px;height:4px;background:linear-gradient(90deg,#6366f1,#22d3ee);border-radius:2px;margin:16px auto;"></div>
    <div style="color:#818cf8;font-size:11px;letter-spacing:2px;">NOVA · 2025</div>
  </div>
</div>
</div>`,
        url: "",
        transition: { id: "wipeleft", duration: 600 },
        startTime: 0,
        autostartRender: true,
      },
      {
        name: "Key Features",
        duration: 5000,
        background: "#03081a",
        sourceType: "html",
        html: `<div style="width:100%;height:100%;background:linear-gradient(135deg,#03081a 0%,#0a0f2e 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Helvetica Neue',Arial,sans-serif;padding:60px;overflow:hidden;">
<style>${fadeUp}${scaleIn}${pulse}
.card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;text-align:center;animation:fadeUp 0.8s ease both;opacity:0;transition:all 0.3s;flex:1;}
.icon{font-size:42px;margin-bottom:16px;display:block;animation:pulse 3s infinite;}
</style>
<div style="text-align:center;margin-bottom:48px;animation:fadeUp 0.8s ease both;opacity:0;">
  <div style="font-size:13px;letter-spacing:4px;color:#6366f1;text-transform:uppercase;margin-bottom:12px;">Why Choose NovaPro X7</div>
  <h2 style="font-size:44px;color:#fff;margin:0;font-weight:700;">Built Different. <span style="background:linear-gradient(90deg,#6366f1,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Performs Better.</span></h2>
</div>
<div style="display:flex;gap:20px;width:100%;">
  <div class="card" style="animation-delay:0.4s;">
    <span class="icon">⚡</span>
    <div style="color:#22d3ee;font-size:28px;font-weight:700;margin-bottom:6px;">4.8GHz</div>
    <div style="color:#fff;font-size:15px;font-weight:600;margin-bottom:8px;">Lightning Fast</div>
    <div style="color:#64748b;font-size:13px;">Next-gen NeuraCore processor with AI acceleration</div>
  </div>
  <div class="card" style="animation-delay:0.65s;">
    <span class="icon">📸</span>
    <div style="color:#22d3ee;font-size:28px;font-weight:700;margin-bottom:6px;">200MP</div>
    <div style="color:#fff;font-size:15px;font-weight:600;margin-bottom:8px;">Pro Camera</div>
    <div style="color:#64748b;font-size:13px;">See every detail with AI-enhanced computational photography</div>
  </div>
  <div class="card" style="animation-delay:0.9s;">
    <span class="icon">🔋</span>
    <div style="color:#22d3ee;font-size:28px;font-weight:700;margin-bottom:6px;">72hrs</div>
    <div style="color:#fff;font-size:15px;font-weight:600;margin-bottom:8px;">All-Day Battery</div>
    <div style="color:#64748b;font-size:13px;">6000mAh with 120W SuperCharge — full in 25 minutes</div>
  </div>
  <div class="card" style="animation-delay:1.15s;">
    <span class="icon">🔒</span>
    <div style="color:#22d3ee;font-size:28px;font-weight:700;margin-bottom:6px;">Shield AI</div>
    <div style="color:#fff;font-size:15px;font-weight:600;margin-bottom:8px;">Total Security</div>
    <div style="color:#64748b;font-size:13px;">Military-grade encryption with under-display fingerprint</div>
  </div>
</div>
</div>`,
        url: "",
        transition: { id: "fade", duration: 600 },
        startTime: 0,
        autostartRender: true,
      },
      {
        name: "Price & CTA",
        duration: 4000,
        background: "#03081a",
        sourceType: "html",
        html: `<div style="width:100%;height:100%;background:radial-gradient(ellipse at center,#0f1f4a 0%,#03081a 65%);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Helvetica Neue',Arial,sans-serif;text-align:center;overflow:hidden;">
<style>${scaleIn}${fadeUp}${glow}${pulse}
.price-badge{display:inline-block;background:linear-gradient(135deg,#6366f1,#4f46e5);padding:4px 16px;border-radius:20px;font-size:12px;letter-spacing:2px;color:#fff;margin-bottom:20px;animation:scaleIn 0.8s ease both;animation-delay:0.3s;opacity:0;}
.cta-btn{display:inline-block;padding:18px 56px;background:linear-gradient(135deg,#6366f1,#22d3ee);border-radius:50px;color:#fff;font-size:17px;font-weight:700;letter-spacing:1px;animation:fadeUp 1s ease both;animation-delay:1.4s;opacity:0;box-shadow:0 20px 60px rgba(99,102,241,0.4);}
</style>
<div class="price-badge">Available Now</div>
<h1 style="font-size:78px;color:#fff;margin:0 0 4px 0;font-weight:800;letter-spacing:-2px;animation:scaleIn 1s ease both;animation-delay:0.5s;opacity:0;">NovaPro X7</h1>
<div style="font-size:18px;color:#64748b;margin-bottom:36px;animation:fadeUp 0.8s ease both;animation-delay:0.8s;opacity:0;letter-spacing:2px;">ULTRA · EDITION</div>
<div style="animation:fadeUp 0.8s ease both;animation-delay:1s;opacity:0;margin-bottom:40px;">
  <span style="font-size:20px;color:#94a3b8;text-decoration:line-through;">$1,499</span>
  <span style="font-size:56px;color:#22d3ee;font-weight:800;margin-left:16px;">$1,199</span>
</div>
<div class="cta-btn">Order Now →</div>
<div style="font-size:12px;color:#334155;margin-top:24px;letter-spacing:2px;animation:fadeUp 0.8s ease both;animation-delay:1.8s;opacity:0;">FREE SHIPPING · 2-YEAR WARRANTY · 30-DAY RETURNS</div>
</div>`,
        url: "",
        transition: { id: "fadeblack", duration: 800 },
        startTime: 0,
        autostartRender: true,
      },
    ],
  },

  /* ═══════════════════════════════════════════
     3. FLASH SALE PROMO
  ═══════════════════════════════════════════ */
  {
    id: "flash-sale",
    name: "Flash Sale Promo",
    description: "Bold, năng lượng cao - cho khuyến mãi, sale, giảm giá",
    category: "Khuyến mãi",
    scenes: [
      {
        name: "Sale Opener",
        duration: 4000,
        background: "#1a0500",
        sourceType: "html",
        html: `<div style="width:100%;height:100%;background:linear-gradient(135deg,#1a0500 0%,#2d0f00 50%,#1a0500 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Impact,Arial,sans-serif;overflow:hidden;position:relative;">
<style>${scaleIn}${fadeUp}${pulse}${rotate}
.flash{position:absolute;font-size:400px;opacity:0.03;animation:rotate 20s linear infinite;user-select:none;}
.sale-text{font-size:160px;background:linear-gradient(135deg,#ff4500,#ff8c00,#ffd700);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0;letter-spacing:-4px;animation:scaleIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275) both;animation-delay:0.2s;opacity:0;line-height:1;text-shadow:none;}
.pct{font-size:200px;color:#ffd700;margin:0;font-weight:900;animation:scaleIn 0.8s cubic-bezier(0.175,0.885,0.32,1.275) both;animation-delay:0.5s;opacity:0;line-height:0.9;filter:drop-shadow(0 0 40px rgba(255,215,0,0.6));}
.off{font-size:80px;color:#ff4500;letter-spacing:8px;animation:fadeUp 0.8s ease both;animation-delay:0.9s;opacity:0;}
.timer{font-size:20px;letter-spacing:4px;color:#ff8c00;margin-top:20px;animation:pulse 1s infinite;font-family:'Helvetica Neue',sans-serif;}
</style>
<div class="flash">⚡</div>
<div style="text-align:center;z-index:1;">
  <div class="sale-text">FLASH SALE</div>
  <div class="pct">70%</div>
  <div class="off">OFF</div>
  <div class="timer">⏱ ENDS IN 24 HOURS</div>
</div>
</div>`,
        url: "",
        transition: { id: "zoomin", duration: 400 },
        startTime: 0,
        autostartRender: true,
      },
      {
        name: "Products Grid",
        duration: 5000,
        background: "#0f0f0f",
        sourceType: "html",
        html: `<div style="width:100%;height:100%;background:#0f0f0f;display:flex;flex-direction:column;padding:48px;font-family:'Helvetica Neue',Arial,sans-serif;overflow:hidden;">
<style>${fadeUp}${scaleIn}${pulse}
.prod-card{background:linear-gradient(160deg,#1a1a2e,#16213e);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;display:flex;flex-direction:column;align-items:center;text-align:center;animation:fadeUp 0.8s ease both;opacity:0;position:relative;overflow:hidden;flex:1;}
.badge{position:absolute;top:12px;right:12px;background:#ff4500;color:#fff;font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px;}
.old-price{font-size:14px;color:#64748b;text-decoration:line-through;}
.new-price{font-size:26px;color:#ffd700;font-weight:800;}
</style>
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;animation:fadeUp 0.6s ease both;opacity:0;">
  <h2 style="font-size:36px;color:#fff;margin:0;font-weight:800;">Today's <span style="color:#ff4500;">Best Deals</span></h2>
  <div style="font-size:14px;color:#ff8c00;animation:pulse 1s infinite;letter-spacing:2px;">🔥 LIMITED STOCK</div>
</div>
<div style="display:flex;gap:16px;flex:1;">
  <div class="prod-card" style="animation-delay:0.3s;">
    <div class="badge">-65%</div>
    <div style="font-size:64px;margin-bottom:12px;">⌚</div>
    <div style="color:#fff;font-size:16px;font-weight:600;margin-bottom:8px;">SmartWatch Pro</div>
    <div style="color:#94a3b8;font-size:12px;margin-bottom:12px;">AMOLED · GPS · Health Monitor</div>
    <div class="old-price">$299</div>
    <div class="new-price">$104</div>
  </div>
  <div class="prod-card" style="animation-delay:0.5s;">
    <div class="badge">-50%</div>
    <div style="font-size:64px;margin-bottom:12px;">🎧</div>
    <div style="color:#fff;font-size:16px;font-weight:600;margin-bottom:8px;">BeatPods Ultra</div>
    <div style="color:#94a3b8;font-size:12px;margin-bottom:12px;">ANC · Hi-Res Audio · 36h</div>
    <div class="old-price">$249</div>
    <div class="new-price">$124</div>
  </div>
  <div class="prod-card" style="animation-delay:0.7s;">
    <div class="badge">-70%</div>
    <div style="font-size:64px;margin-bottom:12px;">💻</div>
    <div style="color:#fff;font-size:16px;font-weight:600;margin-bottom:8px;">UltraBook Slim</div>
    <div style="color:#94a3b8;font-size:12px;margin-bottom:12px;">i9 · 32GB · OLED Display</div>
    <div class="old-price">$1,899</div>
    <div class="new-price">$569</div>
  </div>
  <div class="prod-card" style="animation-delay:0.9s;">
    <div class="badge">-55%</div>
    <div style="font-size:64px;margin-bottom:12px;">📷</div>
    <div style="color:#fff;font-size:16px;font-weight:600;margin-bottom:8px;">ProCam X5</div>
    <div style="color:#94a3b8;font-size:12px;margin-bottom:12px;">50MP · 4K Video · AI Auto</div>
    <div class="old-price">$799</div>
    <div class="new-price">$359</div>
  </div>
</div>
</div>`,
        url: "",
        transition: { id: "wiperight", duration: 500 },
        startTime: 0,
        autostartRender: true,
      },
      {
        name: "Urgency CTA",
        duration: 4000,
        background: "#0a0000",
        sourceType: "html",
        html: `<div style="width:100%;height:100%;background:radial-gradient(ellipse at center,#2d0f00 0%,#0a0000 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Helvetica Neue',Arial,sans-serif;text-align:center;overflow:hidden;">
<style>${scaleIn}${fadeUp}${pulse}
.cta-main{display:inline-block;padding:20px 60px;background:linear-gradient(135deg,#ff4500,#ff8c00);border-radius:50px;color:#fff;font-size:22px;font-weight:800;letter-spacing:2px;animation:scaleIn 0.8s cubic-bezier(0.175,0.885,0.32,1.275) both;animation-delay:1s;opacity:0;box-shadow:0 20px 60px rgba(255,69,0,0.5);}
.count{font-size:72px;color:#ffd700;font-weight:900;animation:pulse 1s infinite;text-shadow:0 0 30px rgba(255,215,0,0.5);}
</style>
<div style="font-size:14px;letter-spacing:6px;color:#ff8c00;text-transform:uppercase;animation:fadeUp 0.8s ease both;opacity:0;margin-bottom:16px;">Hurry Up! Sale Ends In</div>
<div style="display:flex;gap:24px;margin-bottom:48px;animation:scaleIn 0.8s ease both;animation-delay:0.3s;opacity:0;">
  <div><div class="count">23</div><div style="color:#94a3b8;font-size:12px;letter-spacing:2px;">HOURS</div></div>
  <div style="color:#ffd700;font-size:72px;font-weight:900;align-self:flex-start;">:</div>
  <div><div class="count">47</div><div style="color:#94a3b8;font-size:12px;letter-spacing:2px;">MINS</div></div>
  <div style="color:#ffd700;font-size:72px;font-weight:900;align-self:flex-start;">:</div>
  <div><div class="count">12</div><div style="color:#94a3b8;font-size:12px;letter-spacing:2px;">SECS</div></div>
</div>
<div style="font-size:40px;color:#fff;font-weight:800;margin-bottom:8px;animation:fadeUp 0.8s ease both;animation-delay:0.6s;opacity:0;">Don't Miss Out!</div>
<div style="font-size:16px;color:#94a3b8;margin-bottom:40px;animation:fadeUp 0.8s ease both;animation-delay:0.8s;opacity:0;">Use code <span style="color:#ffd700;font-weight:700;">FLASH70</span> at checkout</div>
<div class="cta-main">SHOP NOW →</div>
</div>`,
        url: "",
        transition: { id: "fadeblack", duration: 800 },
        startTime: 0,
        autostartRender: true,
      },
    ],
  },

  /* ═══════════════════════════════════════════
     4. CORPORATE PRESENTATION
  ═══════════════════════════════════════════ */
  {
    id: "corporate-presentation",
    name: "Corporate Presentation",
    description: "Chuyên nghiệp, rõ ràng - cho báo cáo công ty, pitch deck",
    category: "Trình chiếu",
    scenes: [
      {
        name: "Title Slide",
        duration: 5000,
        background: "#020817",
        sourceType: "html",
        html: `<div style="width:100%;height:100%;background:linear-gradient(160deg,#020817 0%,#0c1445 50%,#020817 100%);display:flex;align-items:center;justify-content:center;font-family:'Helvetica Neue',Arial,sans-serif;overflow:hidden;position:relative;">
<style>${fadeLeft}${fadeRight}${fadeUp}${scaleIn}${lineGrow}
.grid-line{position:absolute;background:rgba(255,255,255,0.03);}
</style>
<div class="grid-line" style="left:50%;top:0;width:1px;height:100%;"></div>
<div class="grid-line" style="left:0;top:50%;width:100%;height:1px;"></div>
<div style="display:flex;gap:80px;align-items:center;z-index:1;width:100%;padding:80px;">
  <div style="flex:1;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;animation:fadeLeft 0.8s ease both;opacity:0;">
      <div style="width:40px;height:40px;background:linear-gradient(135deg,#3b82f6,#6366f1);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;">◈</div>
      <span style="color:#3b82f6;font-size:14px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">NexaCorp · 2025</span>
    </div>
    <h1 style="font-size:64px;color:#fff;margin:0 0 16px 0;font-weight:700;line-height:1.1;animation:fadeLeft 1s ease both;animation-delay:0.3s;opacity:0;">Annual Report &<br><span style="background:linear-gradient(90deg,#3b82f6,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Growth Strategy</span></h1>
    <p style="font-size:18px;color:#64748b;margin:0 0 40px 0;animation:fadeLeft 0.8s ease both;animation-delay:0.6s;opacity:0;line-height:1.6;">Fiscal Year 2025 · Q4 Investor Briefing<br>Presented by the Executive Team</p>
    <div style="display:flex;gap:20px;animation:fadeUp 0.8s ease both;animation-delay:1s;opacity:0;">
      <div style="text-align:center;">
        <div style="font-size:32px;color:#3b82f6;font-weight:800;">$4.2B</div>
        <div style="font-size:12px;color:#64748b;letter-spacing:1px;">Revenue</div>
      </div>
      <div style="width:1px;background:rgba(255,255,255,0.1);"></div>
      <div style="text-align:center;">
        <div style="font-size:32px;color:#6366f1;font-weight:800;">+127%</div>
        <div style="font-size:12px;color:#64748b;letter-spacing:1px;">YoY Growth</div>
      </div>
      <div style="width:1px;background:rgba(255,255,255,0.1);"></div>
      <div style="text-align:center;">
        <div style="font-size:32px;color:#8b5cf6;font-weight:800;">142K</div>
        <div style="font-size:12px;color:#64748b;letter-spacing:1px;">Customers</div>
      </div>
    </div>
  </div>
  <div style="width:320px;aspect-ratio:3/4;background:linear-gradient(160deg,#1e3a8a20,#6366f110);border:1px solid rgba(99,102,241,0.2);border-radius:20px;display:flex;align-items:center;justify-content:center;animation:scaleIn 1.2s ease both;animation-delay:0.4s;opacity:0;">
    <div style="text-align:center;padding:32px;">
      <div style="font-size:72px;margin-bottom:16px;filter:drop-shadow(0 0 20px rgba(99,102,241,0.5));">📊</div>
      <div style="width:80px;height:3px;background:linear-gradient(90deg,#3b82f6,#6366f1);border-radius:2px;margin:0 auto;"></div>
    </div>
  </div>
</div>
</div>`,
        url: "",
        transition: { id: "fade", duration: 600 },
        startTime: 0,
        autostartRender: true,
      },
      {
        name: "Key Metrics",
        duration: 5000,
        background: "#020817",
        sourceType: "html",
        html: `<div style="width:100%;height:100%;background:#020817;display:flex;flex-direction:column;padding:60px;font-family:'Helvetica Neue',Arial,sans-serif;overflow:hidden;">
<style>${fadeUp}${fadeLeft}${slideBar}${scaleIn}
.metric-bar{height:8px;background:#1e293b;border-radius:4px;overflow:hidden;margin-top:10px;}
.bar-fill{height:100%;border-radius:4px;animation:slideBar 1.5s ease both;}
.kpi{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:28px;animation:fadeUp 0.8s ease both;opacity:0;flex:1;}
</style>
<div style="display:flex;align-items:center;gap:12px;margin-bottom:40px;animation:fadeLeft 0.8s ease both;opacity:0;">
  <div style="width:4px;height:32px;background:linear-gradient(to bottom,#3b82f6,#6366f1);border-radius:2px;"></div>
  <h2 style="font-size:36px;color:#fff;margin:0;font-weight:700;">Key Performance Indicators</h2>
  <div style="margin-left:auto;font-size:13px;color:#64748b;letter-spacing:2px;">FY 2025</div>
</div>
<div style="display:flex;gap:20px;margin-bottom:24px;">
  <div class="kpi" style="animation-delay:0.3s;">
    <div style="font-size:12px;color:#64748b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Revenue Growth</div>
    <div style="font-size:40px;color:#3b82f6;font-weight:800;">+127%</div>
    <div class="metric-bar"><div class="bar-fill" style="--w:80%;width:0;background:linear-gradient(90deg,#3b82f6,#6366f1);animation-delay:0.8s;"></div></div>
  </div>
  <div class="kpi" style="animation-delay:0.5s;">
    <div style="font-size:12px;color:#64748b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Customer Retention</div>
    <div style="font-size:40px;color:#10b981;font-weight:800;">94.7%</div>
    <div class="metric-bar"><div class="bar-fill" style="--w:94.7%;width:0;background:linear-gradient(90deg,#10b981,#06b6d4);animation-delay:1s;"></div></div>
  </div>
  <div class="kpi" style="animation-delay:0.7s;">
    <div style="font-size:12px;color:#64748b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Market Share</div>
    <div style="font-size:40px;color:#f59e0b;font-weight:800;">38.2%</div>
    <div class="metric-bar"><div class="bar-fill" style="--w:38.2%;width:0;background:linear-gradient(90deg,#f59e0b,#ef4444);animation-delay:1.2s;"></div></div>
  </div>
</div>
<div style="display:flex;gap:20px;">
  <div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:20px;flex:1;animation:fadeUp 0.8s ease both;animation-delay:0.9s;opacity:0;">
    <div style="color:#3b82f6;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Net Promoter Score</div>
    <div style="font-size:28px;color:#fff;font-weight:700;">NPS 72 <span style="color:#10b981;font-size:16px;">↑ +18</span></div>
  </div>
  <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:20px;flex:1;animation:fadeUp 0.8s ease both;animation-delay:1.1s;opacity:0;">
    <div style="color:#10b981;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Operating Margin</div>
    <div style="font-size:28px;color:#fff;font-weight:700;">31.4% <span style="color:#10b981;font-size:16px;">↑ +8.2pp</span></div>
  </div>
  <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:20px;flex:1;animation:fadeUp 0.8s ease both;animation-delay:1.3s;opacity:0;">
    <div style="color:#f59e0b;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">New Customers</div>
    <div style="font-size:28px;color:#fff;font-weight:700;">+42,000 <span style="color:#10b981;font-size:16px;">this quarter</span></div>
  </div>
</div>
</div>`,
        url: "",
        transition: { id: "slideleft", duration: 500 },
        startTime: 0,
        autostartRender: true,
      },
      {
        name: "Vision 2026",
        duration: 5000,
        background: "#020817",
        sourceType: "html",
        html: `<div style="width:100%;height:100%;background:linear-gradient(160deg,#020817 0%,#0c1445 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Helvetica Neue',Arial,sans-serif;padding:80px;overflow:hidden;text-align:center;">
<style>${fadeUp}${scaleIn}${pulse}
.goal{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:24px 20px;animation:fadeUp 0.8s ease both;opacity:0;flex:1;}
.num{font-size:42px;font-weight:800;margin-bottom:6px;}
</style>
<div style="font-size:12px;letter-spacing:6px;color:#6366f1;text-transform:uppercase;margin-bottom:16px;animation:fadeUp 0.6s ease both;opacity:0;">Strategic Roadmap</div>
<h2 style="font-size:52px;color:#fff;margin:0 0 12px 0;font-weight:700;animation:scaleIn 1s ease both;animation-delay:0.2s;opacity:0;">Vision <span style="background:linear-gradient(90deg,#3b82f6,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">2026</span></h2>
<p style="font-size:18px;color:#64748b;margin:0 0 56px 0;animation:fadeUp 0.8s ease both;animation-delay:0.4s;opacity:0;max-width:700px;line-height:1.6;">"To become the global leader in enterprise AI solutions, empowering 1 million businesses to scale smarter."</p>
<div style="display:flex;gap:20px;width:100%;">
  <div class="goal" style="animation-delay:0.6s;">
    <div class="num" style="color:#3b82f6;">$8B</div>
    <div style="color:#fff;font-size:15px;font-weight:600;margin-bottom:6px;">Revenue Target</div>
    <div style="color:#64748b;font-size:13px;">Reaching 2× growth through new enterprise contracts</div>
  </div>
  <div class="goal" style="animation-delay:0.8s;">
    <div class="num" style="color:#6366f1;">300K</div>
    <div style="color:#fff;font-size:15px;font-weight:600;margin-bottom:6px;">Active Users</div>
    <div style="color:#64748b;font-size:13px;">Expanding to APAC, MENA, and LatAm markets</div>
  </div>
  <div class="goal" style="animation-delay:1s;">
    <div class="num" style="color:#8b5cf6;">45%</div>
    <div style="color:#fff;font-size:15px;font-weight:600;margin-bottom:6px;">AI Revenue Mix</div>
    <div style="color:#64748b;font-size:13px;">Shifting towards recurring AI-as-a-Service model</div>
  </div>
  <div class="goal" style="animation-delay:1.2s;">
    <div class="num" style="color:#06b6d4;">B Corp</div>
    <div style="color:#fff;font-size:15px;font-weight:600;margin-bottom:6px;">Certification</div>
    <div style="color:#64748b;font-size:13px;">Net-zero operations & sustainable supply chain</div>
  </div>
</div>
</div>`,
        url: "",
        transition: { id: "fadeblack", duration: 800 },
        startTime: 0,
        autostartRender: true,
      },
    ],
  },

  /* ═══════════════════════════════════════════
     5. FOOD & LIFESTYLE PRODUCT
  ═══════════════════════════════════════════ */
  {
    id: "food-lifestyle",
    name: "Food & Lifestyle Product",
    description: "Tươi mát, hấp dẫn - cho thực phẩm, đồ uống, lifestyle",
    category: "Quảng cáo",
    scenes: [
      {
        name: "Brand Intro",
        duration: 4500,
        background: "#0d1a0a",
        sourceType: "html",
        html: `<div style="width:100%;height:100%;background:radial-gradient(ellipse at 40% 60%,#1a3a0a 0%,#0d1a0a 70%);display:flex;align-items:center;justify-content:center;font-family:'Helvetica Neue',Arial,sans-serif;overflow:hidden;gap:80px;padding:80px;">
<style>${fadeLeft}${fadeRight}${scaleIn}${floatY}${pulse}
.leaf{position:absolute;font-size:60px;opacity:0.1;animation:floatY 4s ease infinite;}
.tag{display:inline-block;padding:6px 16px;background:rgba(134,239,172,0.15);border:1px solid rgba(134,239,172,0.3);border-radius:20px;font-size:12px;letter-spacing:3px;color:#86efac;text-transform:uppercase;margin-bottom:20px;}
</style>
<div style="position:absolute;width:100%;height:100%;pointer-events:none;">
  <div class="leaf" style="left:5%;top:10%;animation-delay:0s;">🌿</div>
  <div class="leaf" style="right:8%;top:20%;animation-delay:1s;">🍃</div>
  <div class="leaf" style="left:15%;bottom:15%;animation-delay:0.5s;">✦</div>
  <div class="leaf" style="right:12%;bottom:20%;animation-delay:1.5s;">🌱</div>
</div>
<div style="flex:1;z-index:1;animation:fadeLeft 1s ease both;opacity:0;">
  <div class="tag">100% Organic</div>
  <h1 style="font-size:72px;color:#fff;margin:0 0 12px 0;font-weight:800;line-height:1.1;">Verde<br><span style="background:linear-gradient(90deg,#86efac,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Natural</span></h1>
  <p style="font-size:18px;color:#86efac80;margin:0 0 32px 0;line-height:1.6;">Pure, cold-pressed juices crafted<br>from farm-to-bottle in 24 hours.</p>
  <div style="display:flex;gap:24px;">
    <div style="text-align:center;">
      <div style="font-size:28px;color:#86efac;font-weight:700;">0g</div>
      <div style="font-size:11px;color:#64748b;letter-spacing:1px;">Added Sugar</div>
    </div>
    <div style="width:1px;background:rgba(255,255,255,0.1);"></div>
    <div style="text-align:center;">
      <div style="font-size:28px;color:#86efac;font-weight:700;">100%</div>
      <div style="font-size:11px;color:#64748b;letter-spacing:1px;">Natural</div>
    </div>
    <div style="width:1px;background:rgba(255,255,255,0.1);"></div>
    <div style="text-align:center;">
      <div style="font-size:28px;color:#86efac;font-weight:700;">24h</div>
      <div style="font-size:11px;color:#64748b;letter-spacing:1px;">Farm Fresh</div>
    </div>
  </div>
</div>
<div style="width:280px;aspect-ratio:1/1.4;background:linear-gradient(160deg,#1a3a0a,#0d2706);border-radius:24px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(134,239,172,0.15);animation:scaleIn 1.2s ease both;animation-delay:0.3s;opacity:0;z-index:1;box-shadow:0 40px 80px rgba(0,0,0,0.6);position:relative;overflow:hidden;">
  <div style="position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(to top,rgba(134,239,172,0.1),transparent);"></div>
  <div style="text-align:center;z-index:1;">
    <div style="font-size:90px;animation:floatY 4s ease infinite;filter:drop-shadow(0 0 30px rgba(34,197,94,0.5));">🥤</div>
    <div style="color:#86efac;font-size:13px;letter-spacing:3px;margin-top:12px;">VERDE CLASSIC</div>
    <div style="color:#ffffff40;font-size:11px;margin-top:4px;">330 ML</div>
  </div>
</div>
</div>`,
        url: "",
        transition: { id: "fade", duration: 600 },
        startTime: 0,
        autostartRender: true,
      },
      {
        name: "Ingredients",
        duration: 5000,
        background: "#0d1a0a",
        sourceType: "html",
        html: `<div style="width:100%;height:100%;background:linear-gradient(135deg,#0d1a0a 0%,#1a3a0a 50%,#0d1a0a 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Helvetica Neue',Arial,sans-serif;padding:70px;overflow:hidden;">
<style>${fadeUp}${scaleIn}${floatY}
.ing-card{background:rgba(255,255,255,0.04);border:1px solid rgba(134,239,172,0.1);border-radius:20px;padding:28px;text-align:center;animation:fadeUp 0.8s ease both;opacity:0;flex:1;}
.ing-icon{font-size:52px;margin-bottom:12px;display:block;animation:floatY 4s ease infinite;}
</style>
<div style="text-align:center;margin-bottom:48px;animation:fadeUp 0.8s ease both;opacity:0;">
  <div style="font-size:12px;letter-spacing:5px;color:#86efac;text-transform:uppercase;margin-bottom:12px;">Crafted with Nature</div>
  <h2 style="font-size:46px;color:#fff;margin:0;font-weight:700;">Only <span style="background:linear-gradient(90deg,#86efac,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Pure Ingredients</span></h2>
</div>
<div style="display:flex;gap:20px;width:100%;">
  <div class="ing-card" style="animation-delay:0.3s;">
    <span class="ing-icon" style="animation-delay:0s;">🍏</span>
    <div style="color:#86efac;font-size:16px;font-weight:700;margin-bottom:6px;">Green Apple</div>
    <div style="color:#64748b;font-size:13px;">High in antioxidants · Refreshing natural sweetness</div>
  </div>
  <div class="ing-card" style="animation-delay:0.5s;">
    <span class="ing-icon" style="animation-delay:0.5s;">🥬</span>
    <div style="color:#86efac;font-size:16px;font-weight:700;margin-bottom:6px;">Spinach</div>
    <div style="color:#64748b;font-size:13px;">Rich in iron & vitamins · Superfood powerhouse</div>
  </div>
  <div class="ing-card" style="animation-delay:0.7s;">
    <span class="ing-icon" style="animation-delay:1s;">🍋</span>
    <div style="color:#86efac;font-size:16px;font-weight:700;margin-bottom:6px;">Lemon</div>
    <div style="color:#64748b;font-size:13px;">Immune-boosting vitamin C · Bright & zesty flavor</div>
  </div>
  <div class="ing-card" style="animation-delay:0.9s;">
    <span class="ing-icon" style="animation-delay:1.5s;">🫚</span>
    <div style="color:#86efac;font-size:16px;font-weight:700;margin-bottom:6px;">Ginger</div>
    <div style="color:#64748b;font-size:13px;">Anti-inflammatory · Energizing spicy kick</div>
  </div>
  <div class="ing-card" style="animation-delay:1.1s;">
    <span class="ing-icon" style="animation-delay:2s;">🥒</span>
    <div style="color:#86efac;font-size:16px;font-weight:700;margin-bottom:6px;">Cucumber</div>
    <div style="color:#64748b;font-size:13px;">Hydrating & cooling · Packed with minerals</div>
  </div>
</div>
</div>`,
        url: "",
        transition: { id: "dissolve", duration: 600 },
        startTime: 0,
        autostartRender: true,
      },
      {
        name: "Order CTA",
        duration: 4000,
        background: "#0d1a0a",
        sourceType: "html",
        html: `<div style="width:100%;height:100%;background:radial-gradient(ellipse at center,#1a3a0a 0%,#0d1a0a 65%);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Helvetica Neue',Arial,sans-serif;text-align:center;overflow:hidden;">
<style>${fadeUp}${scaleIn}${pulse}${floatY}
.order-btn{display:inline-block;padding:18px 52px;background:linear-gradient(135deg,#22c55e,#16a34a);border-radius:50px;color:#fff;font-size:18px;font-weight:700;letter-spacing:1px;animation:scaleIn 1s cubic-bezier(0.175,0.885,0.32,1.275) both;animation-delay:1.2s;opacity:0;box-shadow:0 20px 60px rgba(34,197,94,0.4);}
</style>
<div style="font-size:80px;animation:floatY 4s ease infinite,scaleIn 0.8s ease both;opacity:0;animation-fill-mode:both;filter:drop-shadow(0 0 40px rgba(34,197,94,0.5));">🌿</div>
<h1 style="font-size:60px;color:#fff;margin:20px 0 8px 0;font-weight:800;animation:scaleIn 1s ease both;animation-delay:0.3s;opacity:0;">Verde Natural</h1>
<div style="font-size:18px;color:#86efac80;margin-bottom:12px;animation:fadeUp 0.8s ease both;animation-delay:0.6s;opacity:0;">Start your wellness journey today</div>
<div style="display:flex;align-items:baseline;gap:12px;margin-bottom:40px;animation:fadeUp 0.8s ease both;animation-delay:0.9s;opacity:0;">
  <span style="font-size:18px;color:#64748b;text-decoration:line-through;">$8.99</span>
  <span style="font-size:48px;color:#86efac;font-weight:800;">$6.99</span>
  <span style="font-size:14px;color:#86efac;">/ bottle</span>
</div>
<div class="order-btn">Order Fresh →</div>
<div style="font-size:12px;color:#334155;margin-top:24px;letter-spacing:2px;animation:fadeUp 0.8s ease both;animation-delay:1.6s;opacity:0;">FREE DELIVERY · SUBSCRIBE & SAVE 20% · CANCEL ANYTIME</div>
</div>`,
        url: "",
        transition: { id: "fadeblack", duration: 1000 },
        startTime: 0,
        autostartRender: true,
      },
    ],
  },
];

export function instantiateTemplate(template: Template): Scene[] {
  return template.scenes.map((s) => ({ ...s, id: uid() }));
}
