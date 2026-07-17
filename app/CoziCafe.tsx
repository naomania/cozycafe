"use client";

import React, { useEffect, useState } from "react";

/* Café configuration (design props). */
function getServiceMode(): "barista" | "kiosk" {
  return "barista";
}
const SERVICE_MODE = getServiceMode();
const TABLE_COUNT = 6;

/* Parse a design inline-CSS string into a React style object so the design's
   exact styling can be kept verbatim. */
function sx(css: string): React.CSSProperties {
  const out: Record<string, string> = {};
  for (const decl of css.split(";")) {
    const i = decl.indexOf(":");
    if (i === -1) continue;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!prop) continue;
    const camel = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    out[camel] = val;
  }
  return out as React.CSSProperties;
}

type Item = { id: string; name: string; desc: string; price: number };
type Category = { cat: string; color: string; items: Item[] };

const MENU: Category[] = [
  {
    cat: "Snacks",
    color: "#f7e6da",
    items: [
      { id: "popcorn", name: "Popcorn", desc: "Buttery little clouds, popped with love.", price: 2 },
      { id: "fruit", name: "Fruit Bowl", desc: "A rainbow of the sweetest bites.", price: 3 },
    ],
  },
  {
    cat: "Breakfast",
    color: "#e3e9dd",
    items: [
      { id: "waffles", name: "Waffles", desc: "Golden squares with syrup puddles.", price: 4 },
      { id: "cereal", name: "Cereal", desc: "Crunchy stars in cold, cold milk.", price: 2 },
      { id: "special", name: "The Chef Special Breakfast", desc: "A surprise! Whatever Mimi feels fancy about today.", price: 5 },
    ],
  },
  {
    cat: "Lunch",
    color: "#c4dbd9",
    items: [
      { id: "nuggets", name: "McCuties Nuggets & French Fries", desc: "Crispy little cuties with golden fries.", price: 4 },
    ],
  },
  {
    cat: "Dinner",
    color: "#cae0e4",
    items: [
      { id: "wings", name: "Chicken Wings", desc: "Sticky, saucy, finger-licky.", price: 4 },
      { id: "dumplings", name: "Dumplings", desc: "Little pillows of yum.", price: 3 },
      { id: "ramen", name: "Ramen", desc: "Slurpy noodles in a big cozy broth.", price: 5 },
      { id: "pizza", name: "Pizza", desc: "A cheesy triangle of happiness.", price: 4 },
    ],
  },
  {
    cat: "Drinks",
    color: "#c8c7d6",
    items: [
      { id: "milkshake", name: "Cute Milkshake", desc: "Extra whip, extra cherry, extra cute.", price: 3 },
      { id: "olipop", name: "Olipop Flavors", desc: "Fizzy pop in all your favorite flavors.", price: 2 },
      { id: "strawberry", name: "Strawberry Drink", desc: "Pink, cold, and very refreshing.", price: 2 },
      { id: "boba", name: "Yum Yum Yum Yum Yum Yum Yum Yum Yum Boba", desc: "Nine whole yums of chewy pearls.", price: 3 },
    ],
  },
  {
    cat: "Desserts",
    color: "#f0d7df",
    items: [
      { id: "cake", name: "Yum Yum Cake", desc: "Layers and layers of celebration.", price: 3 },
      { id: "jelly", name: "Jelly", desc: "Wibbly, wobbly, extremely giggly.", price: 1 },
      { id: "cupcakes", name: "Cupcakes", desc: "A tiny cake that is all yours.", price: 2 },
      { id: "icecream", name: "Ice Cream", desc: "Two scoops of pure smiles.", price: 2 },
    ],
  },
];

const COPY =
  SERVICE_MODE === "kiosk"
    ? {
        homeCta: "Start my order",
        menuPrompt: "Tap anything yummy!",
        setupTitle: "Tell us about you!",
        setupSub: "So we know whose treats these are",
        receiptFooter: "Show this to Mimi at the counter ♥",
        party: (no: string, who: string) =>
          "Order " + no + " for " + who + " is on its way. Mimi is making it right now!",
      }
    : {
        homeCta: "Take an order",
        menuPrompt: "What can I get you?",
        setupTitle: "Who is this order for?",
        setupSub: "Every guest gets the royal treatment",
        receiptFooter: "Read it back to your guest ♥",
        party: (no: string, who: string) =>
          "Order " + no + " for " + who + " is confirmed. Time to make some magic, Mimi!",
      };

/* Cutesy hand-drawn icon for each menu item. */
function renderIcon(id: string): React.ReactElement {
  const E = React.createElement;
  const ink = "#5c3a42";
  const C = (cx: number, cy: number, r: number, f: string, o?: number) =>
    E("circle", { cx, cy, r, fill: f, opacity: o ?? 1 });
  const R = (x: number, y: number, w: number, h: number, rx: number, f: string) =>
    E("rect", { x, y, width: w, height: h, rx, fill: f });
  const P = (d: string, f: string | null, s?: string, sw?: number) =>
    E("path", { d, fill: f || "none", stroke: s, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" });
  const EL = (cx: number, cy: number, rx: number, ry: number, f: string) =>
    E("ellipse", { cx, cy, rx, ry, fill: f });
  const face = (x: number, y: number) => [
    C(x - 4, y, 1.6, ink),
    C(x + 4, y, 1.6, ink),
    P("M " + (x - 2) + " " + (y + 2.5) + " Q " + x + " " + (y + 4.5) + " " + (x + 2) + " " + (y + 2.5), null, ink, 1.6),
    C(x - 7.5, y + 2.5, 2, "#f2b8c2"),
    C(x + 7.5, y + 2.5, 2, "#f2b8c2"),
  ];
  const kids: Record<string, React.ReactElement[]> = {
    popcorn: [R(14, 22, 20, 18, 5, "#f4a7b6"), R(19, 22, 3, 18, 0, "#fff"), R(26, 22, 3, 18, 0, "#fff"), C(16, 18, 5, "#fff6ee"), C(24, 13, 6.5, "#fff6ee"), C(32, 18, 5, "#fff6ee"), ...face(24, 30)],
    fruit: [C(17, 20, 4.5, "#e98f8f"), C(24, 17, 4.5, "#f3d9a4"), C(31, 20, 4.5, "#a8cbb7"), P("M9 24 A15 15 0 0 0 39 24 Z", "#cae0e4"), ...face(24, 30)],
    waffles: [R(11, 11, 26, 26, 7, "#e9b87d"), P("M20 11 V37 M28 11 V37 M11 20 H37 M11 28 H37", null, "#c98d5f", 2), ...face(24, 22)],
    cereal: [P("M9 24 A15 15 0 0 0 39 24 Z", "#c8c7d6"), EL(24, 24, 15, 3.4, "#fff"), C(18, 23, 1.8, "#e9b87d"), C(25, 22.6, 1.8, "#f4a7b6"), C(31, 23.2, 1.8, "#e9b87d"), ...face(24, 31)],
    special: [C(24, 26, 15, "#fff"), E("circle", { cx: 24, cy: 26, r: 14.5, fill: "none", stroke: "#f0d7df", strokeWidth: 2 }), P("M14 24 Q13 16 21 17 Q20 11 27 13 Q33 11 33 19 Q38 21 34 26 Q30 31 23 29 Q15 31 14 24 Z", "#fff6ee"), C(24, 22, 5, "#f3d9a4"), ...face(24, 30)],
    nuggets: [R(9, 17, 13, 10, 5, "#e9b87d"), R(26, 14, 13, 10, 5, "#e9b87d"), R(17, 28, 14, 11, 5.5, "#f0c789"), ...face(24, 32)],
    wings: [EL(22, 22, 12, 9.5, "#d99e66"), P("M31 27 L39 34", null, "#fff6ee", 4), C(40, 32, 3, "#fff6ee"), C(37, 37, 3, "#fff6ee"), ...face(21, 21)],
    dumplings: [P("M10 31 Q10 13 24 13 Q38 13 38 31 Z", "#fff6ee"), P("M18 15 Q19.5 19 17 22 M24 13 Q25.5 17 23.5 20 M30 15 Q30 19 29 22", null, "#e5c9b3", 1.6), ...face(24, 26)],
    ramen: [P("M31 4 L37 19", null, "#c98d5f", 2.5), P("M27 5 L33 20", null, "#c98d5f", 2.5), P("M8 22 A16 16 0 0 0 40 22 Z", "#e3849b"), EL(24, 22, 15.5, 3.2, "#f7e6da"), P("M15 21.5 Q17 19 19 21.5 M22 21.5 Q24 19 26 21.5 M29 21.5 Q31 19 33 21.5", null, "#e9b87d", 1.6), ...face(24, 30)],
    pizza: [P("M24 41 L11 13 Q24 7 37 13 Z", "#f3d9a4"), P("M11 13 Q24 7 37 13", null, "#e9885f", 5), C(18, 18, 2.8, "#e98f8f"), C(30, 18, 2.8, "#e98f8f"), C(24, 31, 2.8, "#e98f8f"), ...face(24, 23)],
    milkshake: [R(26, 1, 3.5, 13, 1.7, "#e3849b"), P("M15 18 L18 40 Q24 43 30 40 L33 18 Z", "#f8eaec"), C(16.5, 16, 5, "#fff"), C(24, 13, 6.5, "#fff"), C(31.5, 16, 5, "#fff"), C(24, 6.5, 3, "#d76d89"), ...face(24, 29)],
    olipop: [R(15, 9, 18, 31, 5.5, "#a8cbb7"), R(15, 18, 18, 9, 0, "#fff"), C(38, 9, 2, "#a8cbb7"), C(41, 15, 1.5, "#a8cbb7"), ...face(24, 33)],
    strawberry: [P("M20 8 L24 13 L28 8 L24 6 Z", "#7ba884"), P("M24 42 Q9 31 12 18 Q16 10 24 14 Q32 10 36 18 Q39 31 24 42 Z", "#e88ca0"), C(17, 22, 1.3, "#fff"), C(31, 22, 1.3, "#fff"), C(24, 36, 1.3, "#fff"), C(16, 30, 1.3, "#fff"), C(32, 30, 1.3, "#fff"), ...face(24, 25)],
    boba: [R(22, 1, 4, 14, 2, "#a8cbb7"), P("M14 12 L17 40 Q24 43 31 40 L34 12 Z", "#f7e6da"), C(19, 36, 2.4, ink), C(24, 37.5, 2.4, ink), C(29, 36, 2.4, ink), P("M14 12 H34", null, "#d99e66", 2.5), ...face(24, 24)],
    cake: [R(12, 26, 24, 13, 4, "#f4a7b6"), R(15, 17, 18, 10, 4, "#fff6ee"), P("M15 22 Q17 25 19 22 Q21 25 24 22 Q27 25 29 22 Q31 25 33 22", null, "#f4a7b6", 2), C(24, 12.5, 3.2, "#d76d89"), ...face(24, 32)],
    jelly: [EL(24, 36, 16, 3.5, "#f0d7df"), P("M11 35 Q11 15 24 15 Q37 15 37 35 Z", "#e3849b"), C(18, 21, 2.6, "#fff", 0.7), ...face(24, 27)],
    cupcakes: [C(24, 19, 9.5, "#f4a7b6"), C(16.5, 23, 5.5, "#f4a7b6"), C(31.5, 23, 5.5, "#f4a7b6"), C(24, 8.5, 2.8, "#d76d89"), P("M13.5 26 L18 41 H30 L34.5 26 Z", "#c8c7d6"), P("M20 27 L21.5 40 M28 27 L26.5 40", null, "#b3b1c6", 1.6), ...face(24, 20)],
    icecream: [C(24, 16, 9.5, "#f8eaec"), P("M15.5 23 L24 43 L32.5 23 Z", "#e9b87d"), P("M19 27 L29 27 M21 32 L27 32", null, "#c98d5f", 1.6), ...face(24, 16)],
  };
  return E("svg", { viewBox: "0 0 48 48", width: 52, height: 52, "aria-hidden": true }, ...(kids[id] || [C(24, 24, 14, "#f0d7df"), ...face(24, 24)]));
}

type Confetti = { x: number; s: number; d: number; delay: number; col: string; ch: string };
type Screen = "home" | "menu" | "events" | "about";
type Phase = null | "setup" | "receipt" | "party";

export default function CoziCafe() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeCat, setActiveCat] = useState(0);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [guest, setGuest] = useState("");
  const [dine, setDine] = useState<"dine" | "togo">("dine");
  const [table, setTable] = useState(1);
  const [metaSet, setMetaSet] = useState(false);
  const [phase, setPhase] = useState<Phase>(null);
  const [orderNo, setOrderNo] = useState(1);
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    const n = parseInt(localStorage.getItem("cozi-order-no") || "1", 10);
    if (n > 1) setOrderNo(n);
  }, []);

  const resetOrder = () => {
    setCart({});
    setGuest("");
    setDine("dine");
    setTable(1);
    setMetaSet(false);
    setPhase(null);
  };

  const active = MENU[Math.min(activeCat, MENU.length - 1)];
  const flat: Record<string, Item> = {};
  MENU.forEach((c) => c.items.forEach((it) => (flat[it.id] = it)));
  const ids = Object.keys(cart).filter((id) => cart[id] > 0);
  const total = ids.reduce((sum, id) => sum + flat[id].price * cart[id], 0);

  const addItem = (id: string) =>
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const step = (id: string, d: number) =>
    setCart((c) => {
      const next = { ...c };
      next[id] = Math.max(0, (next[id] || 0) + d);
      if (!next[id]) delete next[id];
      return next;
    });

  const guestName = guest.trim() || "Mystery guest";
  const orderNoLabel = "#" + String(orderNo).padStart(2, "0");
  const metaBits = metaSet
    ? guestName + " · " + (dine === "dine" ? "Table " + table : "To-go")
    : null;

  const startFromHome = () => {
    setScreen("menu");
    setPhase(metaSet ? null : "setup");
  };
  const showReceipt = () => {
    if (ids.length) setPhase("receipt");
  };
  const orderUp = () => {
    const cols = ["#ffd3de", "#fff6ee", "#f3d9a4", "#d4e5e3", "#ffffff"];
    const chs = ["♥", "♡", "✿", "★"];
    const next: Confetti[] = Array.from({ length: 26 }, () => ({
      x: Math.random() * 100,
      s: 16 + Math.random() * 22,
      d: 3 + Math.random() * 3,
      delay: Math.random() * 2.5,
      col: cols[Math.floor(Math.random() * cols.length)],
      ch: chs[Math.floor(Math.random() * chs.length)],
    }));
    localStorage.setItem("cozi-order-no", String(orderNo + 1));
    setConfetti(next);
    setPhase("party");
  };
  const nextOrder = () => {
    resetOrder();
    setOrderNo((n) => n + 1);
    setPhase("setup");
    setScreen("menu");
  };
  const partyHome = () => {
    resetOrder();
    setOrderNo((n) => n + 1);
    setScreen("home");
  };

  const tabDefs: [string, Screen][] = [
    ["Home", "home"],
    ["Menu & Order", "menu"],
    ["Events", "events"],
    ["About", "about"],
  ];
  const tabBase =
    "cursor:pointer;border-radius:99px;padding:11px 20px;font-family:Baloo 2,sans-serif;font-weight:700;font-size:16.5px;min-height:46px;";

  const modeBtn = (on: boolean) =>
    "flex:1;cursor:pointer;font-family:Baloo 2,sans-serif;font-weight:700;font-size:18px;padding:13px;border-radius:99px;min-height:52px;" +
    (on
      ? "border:none;background:#d76d89;color:#fff;box-shadow:0 3px 0 #b95672"
      : "border:2px solid #f0d7df;background:#fff;color:#9a7680");

  return (
    <div style={sx("height:100vh;display:flex;flex-direction:column;overflow:hidden;font-family:'Quicksand',sans-serif;color:#6f4d55;background:linear-gradient(180deg,#fbf0ec 0%,#f9e0e2 100%)")}>
      {/* Header */}
      <header style={sx("flex:none;display:flex;align-items:center;gap:24px;padding:14px 28px;background:rgba(255,250,247,.85);backdrop-filter:blur(8px);border-bottom:2px dashed #f0d7df")}>
        <div style={sx("display:flex;align-items:center;gap:12px;cursor:pointer")} onClick={() => setScreen("home")}>
          <svg viewBox="0 0 48 48" width={44} height={44} aria-hidden="true">
            <polygon points="9,22 11,5 25,13" fill="#e3849b" />
            <polygon points="39,22 37,5 23,13" fill="#e3849b" />
            <polygon points="12,19 13,9 21,14" fill="#f8eaec" />
            <polygon points="36,19 35,9 27,14" fill="#f8eaec" />
            <circle cx="24" cy="27" r="17" fill="#e3849b" />
            <circle cx="18" cy="25" r="2" fill="#5c3a42" />
            <circle cx="30" cy="25" r="2" fill="#5c3a42" />
            <path d="M21 30 Q24 33 27 30" stroke="#5c3a42" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="13" cy="30" r="2.6" fill="#f2b8c2" />
            <circle cx="35" cy="30" r="2.6" fill="#f2b8c2" />
          </svg>
          <div>
            <div style={sx("font-family:'Pacifico',cursive;font-size:26px;line-height:1.1;color:#d76d89")}>Cozi Cafe</div>
            <div style={sx("font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#b98f99")}>est. by Mimi &amp; Lulu</div>
          </div>
        </div>
        <nav style={sx("display:flex;gap:8px;margin-left:auto")}>
          {tabDefs.map(([label, sc]) => (
            <button
              key={sc}
              onClick={() => setScreen(sc)}
              style={sx(
                tabBase +
                  (screen === sc
                    ? "border:none;background:#d76d89;color:#fff;box-shadow:0 3px 0 #b95672"
                    : "border:2px solid #f0d7df;background:#fffaf7;color:#9a7680")
              )}
            >
              {label}
            </button>
          ))}
        </nav>
        <div style={sx("display:flex;align-items:center;gap:8px;background:#e3e9dd;border-radius:99px;padding:8px 16px;font-weight:700;font-size:13px;color:#5f7361")}>
          <span style={sx("width:9px;height:9px;border-radius:50%;background:#7ba884;display:inline-block")} />
          Open now
        </div>
      </header>

      {/* Home */}
      {screen === "home" && (
        <main style={sx("flex:1;overflow:auto;display:grid;grid-template-columns:1.05fr 1fr;gap:40px;align-items:center;padding:40px 56px")}>
          <div style={sx("display:flex;flex-direction:column;gap:22px;max-width:560px")}>
            <div style={sx("align-self:flex-start;display:flex;align-items:center;gap:8px;background:#fffaf7;border:2px solid #f0d7df;border-radius:99px;padding:8px 18px;font-weight:700;font-size:14px;color:#d76d89")}>♥ A cozy little café</div>
            <h1 style={sx("margin:0;font-family:'Pacifico',cursive;font-weight:400;font-size:72px;line-height:1.15;color:#d76d89;text-wrap:pretty")}>
              Welcome to<br />Cozi Cafe
            </h1>
            <p style={sx("margin:0;font-size:20px;line-height:1.6;font-weight:600;color:#8a666e;text-wrap:pretty")}>A warm and friendly place for a snack and a drink — served with extra love by Mimi, with quality control by Lulu the cat.</p>
            <div style={sx("display:flex;gap:14px;flex-wrap:wrap")}>
              <button onClick={startFromHome} style={sx("border:none;cursor:pointer;background:#d76d89;color:#fff;font-family:'Baloo 2',sans-serif;font-weight:700;font-size:22px;padding:18px 36px;border-radius:99px;box-shadow:0 6px 0 #b95672;min-height:60px")}>{COPY.homeCta} ♥</button>
              <button onClick={() => setScreen("menu")} style={sx("cursor:pointer;background:#fffaf7;color:#d76d89;border:2px solid #f0c4cf;font-family:'Baloo 2',sans-serif;font-weight:700;font-size:20px;padding:18px 30px;border-radius:99px;min-height:60px")}>Peek at the menu</button>
            </div>
            <div style={sx("display:flex;gap:12px;flex-wrap:wrap;margin-top:6px")}>
              <div style={sx("background:#fffaf7;border:2px solid #f0d7df;border-radius:18px;padding:12px 18px;font-weight:700;font-size:14px;color:#8a666e")}>☺ Open daily</div>
              <div style={sx("background:#fffaf7;border:2px solid #d4e5e3;border-radius:18px;padding:12px 18px;font-weight:700;font-size:14px;color:#5f7361")}>Lulu is in today</div>
              <div style={sx("background:#fffaf7;border:2px solid #c8c7d6;border-radius:18px;padding:12px 18px;font-weight:700;font-size:14px;color:#77738f")}>Everything under $5</div>
            </div>
          </div>
          <div style={sx("position:relative;justify-self:center;animation:coziFloat 5s ease-in-out infinite")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero.jpg" alt="Inside Cozi Cafe" style={sx("width:100%;max-width:560px;aspect-ratio:4/3;object-fit:cover;border-radius:44% 56% 52% 48% / 48% 44% 56% 52%;border:8px solid #fffaf7;box-shadow:0 18px 48px rgba(215,109,137,.28)")} />
            <div style={sx("position:absolute;bottom:14px;left:22px;background:#fffaf7;border-radius:99px;padding:10px 20px;font-family:'Pacifico',cursive;font-size:17px;color:#d76d89;box-shadow:0 4px 14px rgba(111,77,85,.18)")}>good days start with snacks ♥</div>
          </div>
        </main>
      )}

      {/* Menu & Order */}
      {screen === "menu" && (
        <main style={sx("flex:1;display:flex;min-height:0")}>
          <aside style={sx("flex:none;width:200px;overflow:auto;padding:20px 14px;display:flex;flex-direction:column;gap:10px;border-right:2px dashed #f0d7df")}>
            <div style={sx("font-family:'Baloo 2',sans-serif;font-weight:800;font-size:14px;letter-spacing:.12em;text-transform:uppercase;color:#b98f99;padding:0 8px")}>Menu</div>
            {MENU.map((c, i) => (
              <button
                key={c.cat}
                onClick={() => setActiveCat(i)}
                style={sx(
                  "cursor:pointer;text-align:left;border-radius:16px;padding:13px 16px;font-family:Baloo 2,sans-serif;font-weight:700;font-size:17px;min-height:50px;" +
                    (activeCat === i
                      ? "border:none;background:" + c.color + ";color:#54484e;box-shadow:inset 0 -3px 0 rgba(111,77,85,.15)"
                      : "border:2px solid transparent;background:transparent;color:#9a7680")
                )}
              >
                {c.cat}
              </button>
            ))}
            <div style={sx("margin-top:auto;padding:14px 10px;text-align:center;font-size:12.5px;font-weight:700;color:#b98f99;line-height:1.5")}>Tap a treat to add it to the order ♥</div>
          </aside>

          <section style={sx("flex:1;min-width:0;overflow:auto;padding:24px 26px")}>
            <div style={sx("display:flex;align-items:baseline;gap:14px;margin-bottom:18px;flex-wrap:wrap")}>
              <h2 style={sx("margin:0;font-family:'Baloo 2',sans-serif;font-weight:800;font-size:32px;color:#6f4d55")}>{active.cat}</h2>
              <span style={sx("font-weight:700;font-size:16px;color:#b98f99")}>{COPY.menuPrompt}</span>
            </div>
            <div style={sx("display:grid;grid-template-columns:repeat(auto-fill,minmax(216px,1fr));gap:16px")}>
              {active.items.map((it) => {
                const count = cart[it.id] || 0;
                return (
                  <button
                    key={it.id}
                    onClick={() => addItem(it.id)}
                    style={sx(
                      "position:relative;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:8px;text-align:left;background:#fffaf7;border:2px solid " +
                        (count ? "#e3a4b4" : "#f4e3e7") +
                        ";border-radius:24px;padding:18px;min-height:220px;font-family:Quicksand,sans-serif;transition:transform .1s;box-shadow:0 3px 0 " +
                        (count ? "#f0c4cf" : "#f4e3e7")
                    )}
                  >
                    <span style={sx("position:absolute;top:10px;right:10px;background:#d76d89;color:#fff;font-family:Baloo 2,sans-serif;font-weight:800;font-size:14px;border-radius:99px;padding:3px 10px;" + (count ? "" : "display:none;"))}>{count ? "×" + count : ""}</span>
                    <span style={sx("width:76px;height:76px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:" + active.color)}>{renderIcon(it.id)}</span>
                    <span style={sx("font-family:'Baloo 2',sans-serif;font-weight:700;font-size:18px;line-height:1.25;color:#6f4d55;text-wrap:pretty")}>{it.name}</span>
                    <span style={sx("font-weight:600;font-size:13.5px;line-height:1.45;color:#9a7680;text-wrap:pretty")}>{it.desc}</span>
                    <span style={sx("margin-top:auto;background:#f8eaec;color:#d76d89;font-family:'Baloo 2',sans-serif;font-weight:800;font-size:17px;border-radius:99px;padding:6px 16px")}>${it.price}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <aside style={sx("flex:none;width:308px;display:flex;flex-direction:column;background:#fffaf7;border-left:2px dashed #f0d7df")}>
            <div style={sx("flex:none;padding:18px 20px 14px;border-bottom:2px dashed #f0d7df")}>
              <div style={sx("display:flex;align-items:center;justify-content:space-between")}>
                <div style={sx("font-family:'Baloo 2',sans-serif;font-weight:800;font-size:22px;color:#6f4d55")}>Order <span style={sx("color:#d76d89")}>{orderNoLabel}</span></div>
                <button
                  onClick={resetOrder}
                  style={sx("cursor:pointer;border:none;background:transparent;color:#c9a3ad;font-family:Quicksand,sans-serif;font-weight:700;font-size:14px;text-decoration:underline;padding:8px;" + (ids.length || metaSet ? "" : "visibility:hidden;"))}
                >
                  Clear
                </button>
              </div>
              <button
                onClick={() => setPhase("setup")}
                style={sx("margin-top:10px;width:100%;cursor:pointer;border-radius:14px;padding:11px 14px;font-family:Quicksand,sans-serif;font-weight:700;font-size:15px;text-align:left;min-height:46px;" + (metaBits ? "border:2px solid #d4e5e3;background:#eef5f0;color:#5f7361" : "border:2px dashed #e3a4b4;background:#fdf4f6;color:#d76d89"))}
              >
                {metaBits ? "♥ " + metaBits : "+ Add guest details"}
              </button>
            </div>
            <div style={sx("flex:1;overflow:auto;padding:12px 16px;display:flex;flex-direction:column;gap:10px")}>
              {ids.length === 0 && (
                <div style={sx("margin:auto;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px")}>
                  <svg viewBox="0 0 48 48" width={64} height={64} aria-hidden="true">
                    <polygon points="9,22 11,6 25,13" fill="#f0d7df" />
                    <polygon points="39,22 37,6 23,13" fill="#f0d7df" />
                    <circle cx="24" cy="27" r="16" fill="#f0d7df" />
                    <circle cx="18" cy="25" r="2" fill="#b98f99" />
                    <circle cx="30" cy="25" r="2" fill="#b98f99" />
                    <path d="M21 31 Q24 34 27 31" stroke="#b98f99" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                  <div style={sx("font-weight:700;font-size:15px;color:#b98f99;line-height:1.5")}>Nothing yet!<br />Tap something yummy ♥</div>
                </div>
              )}
              {ids.map((id) => (
                <div key={id} style={sx("display:flex;align-items:center;gap:10px;background:#fff;border:2px solid #f8eaec;border-radius:16px;padding:10px 12px")}>
                  <div style={sx("flex:1;min-width:0")}>
                    <div style={sx("font-family:'Baloo 2',sans-serif;font-weight:700;font-size:15px;line-height:1.2;color:#6f4d55")}>{flat[id].name}</div>
                    <div style={sx("font-weight:700;font-size:13px;color:#b98f99")}>${flat[id].price} each</div>
                  </div>
                  <div style={sx("display:flex;align-items:center;gap:6px")}>
                    <button onClick={() => step(id, -1)} style={sx("width:34px;height:34px;border-radius:50%;border:2px solid #f0c4cf;background:#fffaf7;color:#d76d89;font-size:18px;font-weight:800;cursor:pointer;line-height:1")}>−</button>
                    <span style={sx("min-width:20px;text-align:center;font-family:'Baloo 2',sans-serif;font-weight:800;font-size:16px")}>{cart[id]}</span>
                    <button onClick={() => step(id, 1)} style={sx("width:34px;height:34px;border-radius:50%;border:none;background:#d76d89;color:#fff;font-size:18px;font-weight:800;cursor:pointer;line-height:1")}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={sx("flex:none;padding:16px 20px 20px;border-top:2px dashed #f0d7df;display:flex;flex-direction:column;gap:12px")}>
              <div style={sx("display:flex;justify-content:space-between;align-items:baseline")}>
                <span style={sx("font-weight:700;font-size:15px;color:#9a7680")}>{ids.length ? ids.length + " treat" + (ids.length > 1 ? "s" : "") + " picked" : "Total"}</span>
                <span style={sx("font-family:'Baloo 2',sans-serif;font-weight:800;font-size:30px;color:#d76d89")}>${total}</span>
              </div>
              <button
                onClick={showReceipt}
                style={sx("width:100%;font-family:Baloo 2,sans-serif;font-weight:700;font-size:20px;padding:15px;border-radius:99px;border:none;min-height:56px;" + (ids.length ? "cursor:pointer;background:#d76d89;color:#fff;box-shadow:0 5px 0 #b95672" : "background:#f0e3e6;color:#c9a3ad"))}
              >
                Show receipt ♥
              </button>
            </div>
          </aside>
        </main>
      )}

      {/* Events */}
      {screen === "events" && (
        <main style={sx("flex:1;overflow:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;padding:40px;text-align:center")}>
          <div style={sx("font-size:30px;letter-spacing:14px;color:#e3a4b4")}>♥ ♥ ♥</div>
          <h1 style={sx("margin:0;font-family:'Pacifico',cursive;font-weight:400;font-size:54px;color:#d76d89")}>Events are coming soon!</h1>
          <p style={sx("margin:0;max-width:480px;font-size:19px;font-weight:600;line-height:1.6;color:#8a666e;text-wrap:pretty")}>Mimi is planning tea parties, story time with Lulu, and cocoa afternoons. Check back very soon!</p>
          <div style={sx("background:#fffaf7;border:2px dashed #e3a4b4;border-radius:22px;padding:18px 30px;font-weight:700;font-size:16px;color:#d76d89")}>Want to host a party at Cozi Cafe? Ask Mimi at the counter ♥</div>
        </main>
      )}

      {/* About */}
      {screen === "about" && (
        <main style={sx("flex:1;overflow:auto;padding:44px 56px")}>
          <div style={sx("max-width:980px;margin:0 auto;display:flex;flex-direction:column;gap:32px")}>
            <div style={sx("max-width:640px")}>
              <h1 style={sx("margin:0 0 14px;font-family:'Pacifico',cursive;font-weight:400;font-size:48px;color:#d76d89")}>How it all started</h1>
              <p style={sx("margin:0;font-size:18px;font-weight:600;line-height:1.7;color:#8a666e;text-wrap:pretty")}>One day, over family dinner, a big idea was born: a café where everyone is welcome, everything costs pocket money, and the mascot purrs. Cozi Cafe has been serving smiles ever since.</p>
            </div>
            <h2 style={sx("margin:0;font-family:'Baloo 2',sans-serif;font-weight:800;font-size:30px;color:#6f4d55")}>Meet the team</h2>
            <div style={sx("display:grid;grid-template-columns:1fr 1fr;gap:24px")}>
              <div style={sx("background:#fffaf7;border:2px solid #f0d7df;border-radius:28px;padding:28px;display:flex;flex-direction:column;gap:14px;align-items:flex-start")}>
                <div style={sx("width:110px;height:110px;border-radius:50%;background:#f8eaec;border:6px solid #f0d7df;display:flex;align-items:center;justify-content:center;font-family:'Pacifico',cursive;font-size:44px;color:#d76d89")}>M</div>
                <div style={sx("font-family:'Baloo 2',sans-serif;font-weight:800;font-size:26px;color:#6f4d55")}>Mimi</div>
                <div style={sx("background:#f8eaec;color:#d76d89;border-radius:99px;padding:5px 14px;font-weight:800;font-size:13px;letter-spacing:.08em;text-transform:uppercase")}>Owner &amp; Cook</div>
                <p style={sx("margin:0;font-size:16px;font-weight:600;line-height:1.65;color:#8a666e;text-wrap:pretty")}>Mimi runs the whole show — she takes orders, cooks every dish, and makes sure every guest leaves with a smile.</p>
              </div>
              <div style={sx("background:#fffaf7;border:2px solid #d4e5e3;border-radius:28px;padding:28px;display:flex;flex-direction:column;gap:14px;align-items:flex-start")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/lulu.jpg" alt="Lulu the calico cat" style={sx("width:110px;height:110px;border-radius:50%;object-fit:cover;border:6px solid #d4e5e3")} />
                <div style={sx("font-family:'Baloo 2',sans-serif;font-weight:800;font-size:26px;color:#6f4d55")}>Lulu</div>
                <div style={sx("background:#d4e5e3;color:#5f7361;border-radius:99px;padding:5px 14px;font-weight:800;font-size:13px;letter-spacing:.08em;text-transform:uppercase")}>Mascot</div>
                <p style={sx("margin:0;font-size:16px;font-weight:600;line-height:1.65;color:#8a666e;text-wrap:pretty")}>Lulu is our 4-year-old calico mascot. Head of naps, chief taste-tester of whipped cream, and the coziest employee we have.</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Guest setup modal */}
      {phase === "setup" && (
        <div style={sx("position:fixed;inset:0;background:rgba(111,77,85,.35);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;z-index:40;padding:24px")}>
          <div style={sx("background:#fffaf7;border-radius:32px;padding:34px 38px;width:520px;max-width:100%;display:flex;flex-direction:column;gap:20px;box-shadow:0 24px 60px rgba(111,77,85,.3);animation:coziPop .25s ease-out")}>
            <div style={sx("text-align:center")}>
              <div style={sx("font-family:'Pacifico',cursive;font-size:32px;color:#d76d89")}>{COPY.setupTitle}</div>
              <div style={sx("font-weight:700;font-size:15px;color:#b98f99;margin-top:4px")}>{COPY.setupSub}</div>
            </div>
            <label style={sx("display:flex;flex-direction:column;gap:8px;font-weight:800;font-size:14px;letter-spacing:.06em;text-transform:uppercase;color:#9a7680")}>
              Guest name
              <input value={guest} onChange={(e) => setGuest(e.target.value)} placeholder="Grandma, Dad, Ms. Lulu…" style={sx("border:2px solid #f0c4cf;border-radius:16px;padding:14px 18px;font-family:'Quicksand',sans-serif;font-weight:700;font-size:18px;color:#6f4d55;background:#fff;outline-color:#d76d89")} />
            </label>
            <div style={sx("display:flex;flex-direction:column;gap:8px")}>
              <div style={sx("font-weight:800;font-size:14px;letter-spacing:.06em;text-transform:uppercase;color:#9a7680")}>Where are we eating?</div>
              <div style={sx("display:flex;gap:10px")}>
                <button onClick={() => setDine("dine")} style={sx(modeBtn(dine === "dine"))}>Dine in</button>
                <button onClick={() => setDine("togo")} style={sx(modeBtn(dine === "togo"))}>To-go</button>
              </div>
            </div>
            <div style={sx("flex-direction:column;gap:8px;display:" + (dine === "dine" ? "flex" : "none"))}>
              <div style={sx("font-weight:800;font-size:14px;letter-spacing:.06em;text-transform:uppercase;color:#9a7680")}>Pick a table</div>
              <div style={sx("display:flex;gap:10px;flex-wrap:wrap")}>
                {Array.from({ length: Math.max(1, Math.min(12, TABLE_COUNT)) }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setTable(n)}
                    style={sx("width:52px;height:52px;cursor:pointer;border-radius:16px;font-family:Baloo 2,sans-serif;font-weight:800;font-size:19px;" + (table === n ? "border:none;background:#d76d89;color:#fff;box-shadow:0 3px 0 #b95672" : "border:2px solid #f0d7df;background:#fff;color:#9a7680"))}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div style={sx("display:flex;gap:12px;margin-top:6px")}>
              <button onClick={() => setPhase(null)} style={sx("flex:1;cursor:pointer;background:#fff;border:2px solid #f0d7df;color:#9a7680;font-family:'Baloo 2',sans-serif;font-weight:700;font-size:18px;padding:14px;border-radius:99px;min-height:54px")}>Not yet</button>
              <button onClick={() => { setMetaSet(true); setPhase(null); setScreen("menu"); }} style={sx("flex:2;cursor:pointer;background:#d76d89;border:none;color:#fff;font-family:'Baloo 2',sans-serif;font-weight:700;font-size:19px;padding:14px;border-radius:99px;box-shadow:0 5px 0 #b95672;min-height:54px")}>Start the order ♥</button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt modal */}
      {phase === "receipt" && (
        <div style={sx("position:fixed;inset:0;background:rgba(111,77,85,.4);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;z-index:40;padding:24px")}>
          <div style={sx("width:440px;max-width:100%;max-height:100%;overflow:auto;background:#fffdf9;border-radius:6px 6px 22px 22px;padding:32px 34px 28px;box-shadow:0 24px 60px rgba(111,77,85,.35);animation:coziPop .25s ease-out;background-image:radial-gradient(circle at 8px -6px,transparent 7px,#fffdf9 8px);font-variant-numeric:tabular-nums")}>
            <div style={sx("text-align:center;border-bottom:2px dashed #e8d3d8;padding-bottom:16px")}>
              <div style={sx("font-family:'Pacifico',cursive;font-size:34px;color:#d76d89")}>Cozi Cafe</div>
              <div style={sx("font-weight:700;font-size:12.5px;letter-spacing:.16em;text-transform:uppercase;color:#b98f99;margin-top:4px")}>Official receipt</div>
              <div style={sx("font-weight:700;font-size:14px;color:#9a7680;margin-top:10px")}>{"Order " + orderNoLabel + " · " + guestName + " · " + (dine === "dine" ? "Table " + table : "To-go")}</div>
              <div style={sx("font-weight:600;font-size:13px;color:#b98f99")}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
            </div>
            <div style={sx("display:flex;flex-direction:column;gap:10px;padding:18px 0;border-bottom:2px dashed #e8d3d8")}>
              {ids.map((id) => (
                <div key={id} style={sx("display:flex;justify-content:space-between;gap:12px;font-weight:700;font-size:16px;color:#6f4d55")}>
                  <span style={sx("text-wrap:pretty")}>{cart[id] + " × " + flat[id].name}</span>
                  <span style={sx("flex:none")}>${flat[id].price * cart[id]}</span>
                </div>
              ))}
            </div>
            <div style={sx("display:flex;justify-content:space-between;align-items:baseline;padding:16px 0 6px")}>
              <span style={sx("font-family:'Baloo 2',sans-serif;font-weight:800;font-size:20px;color:#6f4d55")}>Total</span>
              <span style={sx("font-family:'Baloo 2',sans-serif;font-weight:800;font-size:32px;color:#d76d89")}>${total}</span>
            </div>
            <div style={sx("text-align:center;font-weight:700;font-size:14px;color:#b98f99;padding:8px 0 18px")}>{COPY.receiptFooter}</div>
            <div style={sx("display:flex;gap:10px")}>
              <button onClick={() => setPhase(null)} style={sx("flex:1;cursor:pointer;background:#fff;border:2px solid #f0d7df;color:#9a7680;font-family:'Baloo 2',sans-serif;font-weight:700;font-size:17px;padding:13px;border-radius:99px;min-height:52px")}>Go back</button>
              <button onClick={orderUp} style={sx("flex:2;cursor:pointer;background:#7ba884;border:none;color:#fff;font-family:'Baloo 2',sans-serif;font-weight:700;font-size:18px;padding:13px;border-radius:99px;box-shadow:0 5px 0 #5e8a68;min-height:52px")}>It&#39;s correct — order up!</button>
            </div>
          </div>
        </div>
      )}

      {/* Celebration */}
      {phase === "party" && (
        <div style={sx("position:fixed;inset:0;background:rgba(215,109,137,.92);display:flex;align-items:center;justify-content:center;z-index:50;padding:24px;overflow:hidden")}>
          <div style={sx("position:absolute;inset:0;pointer-events:none")}>
            {confetti.map((c, i) => (
              <span key={i} style={{ position: "absolute", top: "-60px", left: c.x + "%", fontSize: c.s + "px", color: c.col, animation: "coziFall " + c.d + "s linear " + c.delay + "s infinite" }}>{c.ch}</span>
            ))}
          </div>
          <div style={sx("position:relative;text-align:center;display:flex;flex-direction:column;align-items:center;gap:18px;animation:coziPop .35s ease-out")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/lulu.jpg" alt="Lulu celebrating" style={sx("width:170px;height:170px;border-radius:50%;object-fit:cover;border:8px solid #fffaf7;box-shadow:0 14px 40px rgba(0,0,0,.25);animation:coziWiggle 1.6s ease-in-out infinite")} />
            <div style={sx("font-family:'Pacifico',cursive;font-size:64px;color:#fff;text-shadow:0 4px 0 rgba(0,0,0,.12)")}>Order up!</div>
            <div style={sx("font-weight:700;font-size:22px;color:#ffe9ef;max-width:440px;line-height:1.5;text-wrap:pretty")}>{COPY.party(orderNoLabel, guestName)}</div>
            <div style={sx("display:flex;gap:14px;margin-top:8px")}>
              <button onClick={nextOrder} style={sx("cursor:pointer;background:#fffaf7;border:none;color:#d76d89;font-family:'Baloo 2',sans-serif;font-weight:800;font-size:20px;padding:16px 32px;border-radius:99px;box-shadow:0 5px 0 rgba(0,0,0,.15);min-height:58px")}>Next guest, please ♥</button>
              <button onClick={partyHome} style={sx("cursor:pointer;background:transparent;border:2px solid #ffd3de;color:#fff;font-family:'Baloo 2',sans-serif;font-weight:700;font-size:18px;padding:16px 26px;border-radius:99px;min-height:58px")}>Back home</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
