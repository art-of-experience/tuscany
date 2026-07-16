import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import rough from "https://esm.sh/roughjs@4.6.6";

/* ============================================================
   The Art of Experience — Under the Tuscan Sun
   ============================================================ */

const T = "var(--terracotta)";
const O = "var(--olive)";
const K = "var(--ochre)";
const I = "var(--ink)";

/* ---------------- Scroll reveal wrapper ---------------- */

function Reveal({ children, as: Tag = "div", delay, className = "", ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-delay={delay}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------------- Parallax hook ---------------- */

function useParallax() {
  const sunRef = useRef(null);
  const hillsRef = useRef(null);
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const mobile = window.matchMedia("(max-width: 560px)").matches;
    if (reduce || mobile) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (sunRef.current)
          sunRef.current.style.transform = `translate(-50%, ${y * 0.28}px)`;
        if (hillsRef.current)
          hillsRef.current.style.transform = `translateY(${y * 0.08}px)`;
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { sunRef, hillsRef };
}

/* ============================================================
   Illustrations — hand-drawn ink sketches (rough.js)
   ============================================================ */

const INK = "#2b2620";
const TER = "#b0552f";
const OLV = "#6f7350";
const OCH = "#bd8a3c";
const CRM = "#cdb98f";

// shared rough.js options — loose, hand-drawn ink feel
const RB = (o = {}) => ({
  roughness: 2,
  bowing: 1.6,
  strokeWidth: 1.5,
  stroke: INK,
  ...o,
});

// Draw hand-drawn shapes into an <svg> via rough.js
function useRough(draw) {
  const ref = useRef(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const add = (n) => {
      if (n) svg.appendChild(n);
    };
    draw(rc, add);
  }, []);
  return ref;
}

/* ---- reusable sketch primitives ---- */

function rGlass(rc, add, cx, top, h = 30, wine) {
  const bb = top + h;
  if (wine)
    add(
      rc.path(
        `M${cx - 11} ${top + 7} C ${cx - 9} ${top + 17} ${cx + 9} ${top + 17} ${cx + 11} ${top + 7}`,
        RB({ fill: TER, fillStyle: "solid", stroke: TER, strokeWidth: 0.8 })
      )
    );
  add(
    rc.path(
      `M${cx - 14} ${top} C ${cx - 13} ${top + 20} ${cx - 4} ${bb} ${cx} ${bb} C ${cx + 4} ${bb} ${cx + 13} ${top + 20} ${cx + 14} ${top}`,
      RB()
    )
  );
  add(rc.line(cx, bb, cx, bb + 22, RB()));
  add(rc.line(cx - 12, bb + 22, cx + 12, bb + 22, RB()));
}

function rLeaf(rc, add, cx, cy, angle, color = OLV) {
  const w = 15;
  const h = 8;
  const g = rc.path(
    `M${cx - w} ${cy} C ${cx - w + 2} ${cy - h} ${cx + w - 2} ${cy - h} ${cx + w} ${cy} C ${cx + w - 2} ${cy + h} ${cx - w + 2} ${cy + h} ${cx - w} ${cy} Z`,
    RB({
      stroke: color,
      fill: color,
      fillStyle: "hachure",
      fillWeight: 0.7,
      hachureGap: 3.2,
      roughness: 1.5,
    })
  );
  g.setAttribute("transform", `rotate(${angle} ${cx} ${cy})`);
  add(g);
}

function HeroHills() {
  return (
    <svg viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 260 Q 240 180 480 232 T 960 214 T 1440 246 L1440 320 L0 320 Z"
        fill="#cbb48c"
        opacity="0.55"
      />
      <path
        d="M0 292 Q 300 214 620 268 T 1180 258 T 1440 288 L1440 320 L0 320 Z"
        fill="#a98f63"
        opacity="0.65"
      />
      {/* cypress trees */}
      {[220, 260, 300].map((x, i) => (
        <g key={i} transform={`translate(${x} ${252 - i * 4})`}>
          <path
            d="M0 0 C -7 -18 -7 -44 0 -70 C 7 -44 7 -18 0 0 Z"
            fill="#6f7350"
            opacity="0.8"
          />
        </g>
      ))}
      <g transform="translate(1120 250)">
        <path
          d="M0 0 C -9 -22 -9 -56 0 -88 C 9 -56 9 -22 0 0 Z"
          fill="#6f7350"
          opacity="0.75"
        />
      </g>
    </svg>
  );
}

// A long banquet table for ten, seen in perspective — shared drawing
function drawBanquet(rc, add) {
  {
    // atmosphere — sun, hills, cypress
    add(rc.circle(150, 40, 24, RB({ stroke: OCH })));
    add(
      rc.path(
        "M6 84 C 46 72 84 82 116 74 C 148 66 174 78 196 70",
        RB({ stroke: OLV, strokeWidth: 1, roughness: 1.6 })
      )
    );
    [30, 176].forEach((x) =>
      add(
        rc.path(
          `M${x} 84 C ${x - 4} 74 ${x - 4} 60 ${x} 50 C ${x + 4} 60 ${x + 4} 74 ${x} 84 Z`,
          RB({
            stroke: OLV,
            fill: OLV,
            fillStyle: "hachure",
            fillWeight: 0.6,
            hachureGap: 3,
          })
        )
      )
    );

    // the long table receding into the distance
    add(
      rc.path("M40 216 L84 96 L116 96 L160 216 Z", RB({ strokeWidth: 1.6 }))
    );

    // ten place settings — five plates each side
    const rows = [
      { y: 205, left: 58, right: 142, w: 30, h: 12 },
      { y: 178, left: 64, right: 136, w: 26, h: 10 },
      { y: 151, left: 72, right: 128, w: 22, h: 9 },
      { y: 126, left: 80, right: 120, w: 18, h: 7 },
      { y: 104, left: 88, right: 112, w: 14, h: 6 },
    ];
    rows.forEach((p) => {
      [p.left, p.right].forEach((cx) => {
        add(rc.ellipse(cx, p.y, p.w, p.h, RB({ strokeWidth: 1.2 })));
        add(rc.ellipse(cx, p.y, p.w * 0.5, p.h * 0.5, RB({ strokeWidth: 0.6 })));
      });
      // chair backs — a seat (and a guest) at every plate
      add(
        rc.line(p.left - p.w / 2 - 5, p.y + 3, p.left - p.w / 2 - 5, p.y - 4, RB({ strokeWidth: 0.8, stroke: "#8a7f6d" }))
      );
      add(
        rc.line(p.right + p.w / 2 + 5, p.y + 3, p.right + p.w / 2 + 5, p.y - 4, RB({ strokeWidth: 0.8, stroke: "#8a7f6d" }))
      );
    });

    // centre-line atmosphere — bottles, candles, glasses
    const bottle = (x, y, s) => {
      add(rc.rectangle(x - 3 * s, y - 12 * s, 6 * s, 16 * s, RB({ strokeWidth: 1, stroke: TER })));
      add(rc.line(x, y - 12 * s, x, y - 18 * s, RB({ strokeWidth: 1, stroke: TER })));
    };
    const candle = (x, y, s) => {
      add(rc.line(x, y, x, y - 12 * s, RB({ strokeWidth: 1 })));
      add(rc.circle(x, y - 14 * s, 3 * s, RB({ stroke: OCH, fill: OCH, fillStyle: "solid" })));
    };
    const glass = (x, y, s) => {
      add(
        rc.path(
          `M${x - 2.4 * s} ${y - 7 * s} C ${x - 2.4 * s} ${y - 2 * s} ${x + 2.4 * s} ${y - 2 * s} ${x + 2.4 * s} ${y - 7 * s}`,
          RB({ strokeWidth: 0.8 })
        )
      );
      add(rc.line(x, y - 2 * s, x, y, RB({ strokeWidth: 0.8 })));
    };
    bottle(95, 198, 1);
    glass(112, 196, 1);
    candle(90, 172, 0.95);
    bottle(107, 166, 0.85);
    glass(90, 150, 0.8);
    candle(105, 146, 0.75);
    bottle(100, 126, 0.68);
    candle(98, 110, 0.55);
  }
}

// A round communal table with ten guests gathered around it
function drawRoundTable(rc, add) {
  const cx = 100;
  const cy = 128;
  const rx = 74;
  const ry = 48;

  // the table
  add(rc.ellipse(cx, cy, rx * 2, ry * 2, RB({ strokeWidth: 1.6 })));
  add(rc.ellipse(cx, cy, rx * 2 - 18, ry * 2 - 14, RB({ strokeWidth: 0.6 })));

  const N = 10;
  const plateColors = ["#c47a55", "#8b8f68", "#bd8a3c", "#d8b48f", "#b0552f"];
  for (let i = 0; i < N; i++) {
    const a = (-90 + i * (360 / N)) * (Math.PI / 180);
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    // colourful plate on the rim
    const px = cx + (rx - 16) * ca;
    const py = cy + (ry - 12) * sa;
    const pc = plateColors[i % plateColors.length];
    add(
      rc.ellipse(px, py, 22, 12, RB({ strokeWidth: 1.1, fill: pc, fillStyle: "solid" }))
    );
    add(rc.ellipse(px, py, 11, 6, RB({ strokeWidth: 0.55 })));
    // guest — head + shoulders, facing the table
    const hx = cx + (rx + 14) * ca;
    const hy = cy + (ry + 14) * sa;
    const d = Math.hypot(cx - hx, cy - hy) || 1;
    const tx = (cx - hx) / d;
    const ty = (cy - hy) / d; // toward centre
    const ax = -tx;
    const ay = -ty; // away from centre
    const perpx = -ty;
    const perpy = tx;
    add(rc.circle(hx + tx * 2, hy + ty * 2, 10, RB({ strokeWidth: 1.1 })));
    const p1 = [hx + perpx * 8 + ax * 2, hy + perpy * 8 + ay * 2];
    const p2 = [hx - perpx * 8 + ax * 2, hy - perpy * 8 + ay * 2];
    const ctrl = [hx + ax * 9, hy + ay * 9];
    add(
      rc.path(
        `M${p1[0]} ${p1[1]} Q ${ctrl[0]} ${ctrl[1]} ${p2[0]} ${p2[1]}`,
        RB({ strokeWidth: 1, stroke: "#6b6357" })
      )
    );
  }

  // centrepiece — a small bunch of flowers
  const flower = (x, y, color) => {
    for (let k = 0; k < 5; k++) {
      const deg = k * 72;
      const pa = deg * (Math.PI / 180);
      const exx = x + Math.cos(pa) * 4.5;
      const eyy = y + Math.sin(pa) * 4.5;
      const pe = rc.ellipse(
        exx,
        eyy,
        7,
        3.6,
        RB({ strokeWidth: 0.6, stroke: color, fill: color, fillStyle: "solid" })
      );
      pe.setAttribute("transform", `rotate(${deg} ${exx} ${eyy})`);
      add(pe);
    }
    add(rc.circle(x, y, 3.6, RB({ strokeWidth: 0.5, stroke: OCH, fill: OCH, fillStyle: "solid" })));
  };
  // stems & leaves
  add(rc.line(cx, cy + 16, 94, cy - 10, RB({ strokeWidth: 1, stroke: OLV })));
  add(rc.line(cx, cy + 16, 108, cy - 12, RB({ strokeWidth: 1, stroke: OLV })));
  add(rc.line(cx, cy + 16, cx, cy - 6, RB({ strokeWidth: 1, stroke: OLV })));
  rLeaf(rc, add, 90, cy + 6, 20, OLV);
  rLeaf(rc, add, 112, cy + 4, -20, OLV);
  flower(94, cy - 12, TER);
  flower(108, cy - 14, "#c47a55");
  flower(cx, cy - 4, OCH);
}

function ArtWelcome() {
  // a community gathering around a round table
  const ref = useRough((rc, add) => drawRoundTable(rc, add));
  return <svg viewBox="0 0 200 240" aria-hidden="true" ref={ref} />;
}

function ArtVilla() {
  const ref = useRough((rc, add) => {
    add(rc.circle(152, 54, 32, RB({ stroke: OCH })));
    // villa
    add(
      rc.polygon(
        [
          [52, 190],
          [52, 120],
          [100, 86],
          [148, 120],
          [148, 190],
        ],
        RB({ strokeWidth: 1.6 })
      )
    );
    add(
      rc.linearPath(
        [
          [48, 122],
          [100, 84],
          [152, 122],
        ],
        RB({ stroke: TER, strokeWidth: 1.6 })
      )
    );
    add(rc.rectangle(88, 152, 22, 38, RB())); // door
    add(rc.rectangle(64, 138, 18, 18, RB({ stroke: OLV }))); // window
    add(rc.rectangle(118, 138, 18, 18, RB({ stroke: OLV }))); // window
    // cypress
    add(
      rc.path(
        "M172 190 C 165 168 165 130 172 100 C 179 130 179 168 172 190 Z",
        RB({
          stroke: OLV,
          fill: OLV,
          fillStyle: "hachure",
          fillWeight: 0.7,
          hachureGap: 3,
        })
      )
    );
    add(rc.line(24, 190, 188, 190, RB()));
  });
  return <svg viewBox="0 0 200 240" aria-hidden="true" ref={ref} />;
}

function ArtFlorence() {
  // Ponte Vecchio — the old bridge with its little shops over the Arno
  const ref = useRough((rc, add) => {
    const deckTop = 138;
    const deckBot = 146;
    const waterY = 184;

    // the row of little shops on the bridge
    const houses = [
      [28, 20, 34],
      [50, 18, 44],
      [70, 22, 30],
      [94, 18, 40],
      [114, 22, 34],
      [138, 18, 46],
      [158, 16, 30],
    ];
    houses.forEach(([x, w, h]) => {
      add(rc.rectangle(x, deckTop - h, w, h, RB({ strokeWidth: 1.2 })));
      add(rc.line(x - 1, deckTop - h, x + w + 1, deckTop - h, RB({ strokeWidth: 1.4, stroke: TER })));
      add(rc.rectangle(x + w * 0.3, deckTop - h * 0.62, 5, 6, RB({ strokeWidth: 0.6, stroke: OCH })));
    });

    // bridge deck
    add(rc.line(22, deckTop, 178, deckTop, RB({ strokeWidth: 1.5 })));
    add(rc.line(20, deckBot, 180, deckBot, RB({ strokeWidth: 1.5 })));

    // arches over the river + bank abutments
    [54, 100, 146].forEach((cx) => {
      const w = 20;
      add(
        rc.path(
          `M${cx - w} ${waterY} L${cx - w} 162 Q ${cx} ${deckBot} ${cx + w} 162 L${cx + w} ${waterY}`,
          RB({ strokeWidth: 1.3 })
        )
      );
    });
    add(rc.line(24, deckBot, 24, waterY, RB({ strokeWidth: 1.3 })));
    add(rc.line(176, deckBot, 176, waterY, RB({ strokeWidth: 1.3 })));

    // the Arno + reflections
    [waterY + 3, waterY + 9, waterY + 15].forEach((y) =>
      add(
        rc.path(`M20 ${y} C 60 ${y - 3} 100 ${y + 3} 180 ${y}`, RB({ strokeWidth: 1, stroke: OLV, roughness: 1.6 }))
      )
    );
    [54, 100, 146].forEach((cx) =>
      add(rc.line(cx, waterY + 2, cx, waterY + 13, RB({ strokeWidth: 0.6, stroke: OLV })))
    );
  });
  return <svg viewBox="0 0 200 240" aria-hidden="true" ref={ref} />;
}

function ArtNonna() {
  // two hands shaping fresh pasta by hand — no machine
  const DOUGH = "#e8dcc0";
  const ref = useRough((rc, add) => {
    const hand = (ox, oy, thumbSide) => {
      const fw = 5;
      const gap = 1.6;
      const r = 2.4;
      const rightEdge = ox + 4 * fw + 3 * gap;
      const lens = [12, 16, 16, 12];
      let x = ox;
      for (let i = 0; i < 4; i++) {
        const tipY = oy + lens[i];
        add(
          rc.path(
            `M${x} ${oy} L${x} ${tipY - r} Q ${x} ${tipY} ${x + r} ${tipY} L${x + fw - r} ${tipY} Q ${x + fw} ${tipY} ${x + fw} ${tipY - r} L${x + fw} ${oy}`,
            RB({ strokeWidth: 1, roughness: 1.4 })
          )
        );
        x += fw + gap;
      }
      // back of the hand up to the wrist
      add(
        rc.path(
          `M${ox - 3} ${oy} C ${ox - 6} ${oy - 14} ${ox - 1} ${oy - 24} ${ox + 9} ${oy - 24} L${rightEdge - 6} ${oy - 24} C ${rightEdge + 2} ${oy - 16} ${rightEdge + 2} ${oy - 5} ${rightEdge - 1} ${oy}`,
          RB({ strokeWidth: 1.2 })
        )
      );
      // thumb on the inner side
      if (thumbSide > 0)
        add(rc.path(`M${rightEdge - 1} ${oy - 6} C ${rightEdge + 11} ${oy - 4} ${rightEdge + 12} ${oy + 7} ${rightEdge + 3} ${oy + 12}`, RB({ strokeWidth: 1.2 })));
      else
        add(rc.path(`M${ox - 3} ${oy - 6} C ${ox - 15} ${oy - 4} ${ox - 16} ${oy + 7} ${ox - 7} ${oy + 12}`, RB({ strokeWidth: 1.2 })));
      // cuff + sleeve going up and outward
      const sleeveDir = -thumbSide;
      add(rc.line(ox + 3, oy - 24, rightEdge - 3, oy - 24, RB({ strokeWidth: 1 })));
      add(rc.path(`M${ox + 3} ${oy - 24} L${ox + 3 + sleeveDir * 8} ${oy - 46}`, RB({ strokeWidth: 1.2 })));
      add(rc.path(`M${rightEdge - 3} ${oy - 24} L${rightEdge - 3 + sleeveDir * 8} ${oy - 46}`, RB({ strokeWidth: 1.2 })));
    };

    // the dough being shaped
    add(rc.ellipse(100, 150, 46, 26, RB({ stroke: INK, fill: DOUGH, fillStyle: "solid", strokeWidth: 1.2 })));
    // squished dough peeking up between the fingertips + press dimples
    [80, 90, 100, 110, 120].forEach((x) =>
      add(rc.path(`M${x - 3} 146 C ${x} 141 ${x} 141 ${x + 3} 146`, RB({ stroke: INK, strokeWidth: 0.7, roughness: 1.6 })))
    );
    add(rc.path("M74 150 C 88 156 112 156 126 150", RB({ stroke: INK, strokeWidth: 0.6, roughness: 1.8 })));

    // two hands pressing into the dough
    hand(66, 133, 1);
    hand(104, 133, -1);

    // table
    add(rc.line(24, 162, 176, 162, RB({ strokeWidth: 1.6 })));

    // flour dusting
    [
      [88, 158],
      [112, 159],
      [100, 156],
      [78, 160],
      [124, 158],
    ].forEach(([x, y]) =>
      add(rc.circle(x, y, 1.5, RB({ stroke: "#cdb98f", fill: "#cdb98f", fillStyle: "solid", strokeWidth: 0.4 })))
    );

    // finished pasta shapes (orecchiette)
    [
      [146, 156],
      [156, 160],
      [150, 166],
      [162, 168],
    ].forEach(([x, y]) => {
      add(rc.path(`M${x - 5} ${y} C ${x - 5} ${y - 6} ${x + 5} ${y - 6} ${x + 5} ${y}`, RB({ stroke: OCH, strokeWidth: 1 })));
      add(rc.path(`M${x - 3} ${y - 2} C ${x - 2} ${y - 4} ${x + 2} ${y - 4} ${x + 3} ${y - 2}`, RB({ stroke: OCH, strokeWidth: 0.6 })));
    });

    // a small bowl of flour on the left
    add(rc.path("M30 150 C 30 166 62 166 62 150 Z", RB({ strokeWidth: 1.3 })));
    add(rc.ellipse(46, 150, 34, 10, RB({ strokeWidth: 1.1 })));
    add(rc.path("M34 150 C 40 144 52 144 58 150", RB({ stroke: "#cdb98f", strokeWidth: 1 })));

    // cherry tomatoes on the vine — red accents
    const RED = "#c0492b";
    add(rc.path("M150 170 C 156 174 162 178 160 184", RB({ stroke: OLV, strokeWidth: 1 })));
    [
      [150, 180],
      [163, 185],
      [154, 194],
    ].forEach(([x, y]) => {
      add(rc.circle(x, y, 12, RB({ stroke: INK, fill: RED, fillStyle: "solid" })));
      add(rc.path(`M${x - 4} ${y - 4} C ${x - 1} ${y - 2} ${x - 1} ${y} ${x - 4} ${y + 2}`, RB({ stroke: "#e6a98d", strokeWidth: 0.8 })));
      add(rc.path(`M${x - 2} ${y - 6} l 4 0 l -2 -3 z`, RB({ stroke: OLV, fill: OLV, fillStyle: "solid", strokeWidth: 0.5 })));
    });

    // a halved cherry tomato by the bowl
    add(rc.circle(38, 178, 14, RB({ stroke: INK, fill: RED, fillStyle: "solid" })));
    add(rc.circle(38, 178, 8, RB({ stroke: "#e6a98d", strokeWidth: 0.9 })));
    [
      [35, 176],
      [42, 175],
      [39, 181],
      [34, 180],
    ].forEach(([x, y]) => add(rc.circle(x, y, 1, RB({ stroke: DOUGH, fill: DOUGH, fillStyle: "solid", strokeWidth: 0.3 }))));

    // basil sprig
    rLeaf(rc, add, 126, 182, -16, OLV);
    rLeaf(rc, add, 120, 176, 20, OLV);
  });
  return <svg viewBox="0 0 200 240" aria-hidden="true" ref={ref} />;
}

function ArtWine() {
  const ref = useRough((rc, add) => {
    // bottle (left)
    add(rc.rectangle(58, 96, 34, 86, RB())); // body
    add(rc.rectangle(69, 58, 12, 40, RB())); // neck
    add(rc.rectangle(69, 52, 12, 8, RB({ stroke: TER }))); // cap
    add(rc.line(64, 120, 86, 120, RB({ strokeWidth: 0.9 })));
    add(rc.line(64, 150, 86, 150, RB({ strokeWidth: 0.9 })));
    // glass with wine (right)
    rGlass(rc, add, 132, 92, 30, true);
    // grapes cluster (bottom centre)
    [
      [104, 152],
      [116, 160],
      [96, 162],
      [106, 170],
      [122, 172],
    ].forEach(([x, y]) => add(rc.circle(x, y, 12, RB({ stroke: OCH }))));
    add(rc.path("M104 142 C 110 136 118 136 122 140", RB({ stroke: OLV })));
  });
  return <svg viewBox="0 0 200 240" aria-hidden="true" ref={ref} />;
}

function ArtEvening() {
  // evenings under the Tuscan sky — the same long banquet table
  const ref = useRough((rc, add) => drawBanquet(rc, add));
  return <svg viewBox="0 0 200 240" aria-hidden="true" ref={ref} />;
}

function ArtCommunity() {
  // the story continues — a toast between friends
  const ref = useRough((rc, add) => {
    add(
      rc.path(
        "M72 72 L94 66 C 96 92 90 104 84 108 L86 140 L72 142 Z",
        RB({ stroke: TER })
      )
    );
    add(
      rc.path(
        "M128 72 L106 66 C 104 92 110 104 116 108 L114 140 L128 142 Z",
        RB({ stroke: TER })
      )
    );
    add(rc.line(66, 144, 90, 142, RB()));
    add(rc.line(110, 142, 134, 144, RB()));
    // spark
    [...Array(6)].forEach((_, i) => {
      const a = (i / 6) * Math.PI * 2;
      add(
        rc.line(
          100 + Math.cos(a) * 8,
          66 + Math.sin(a) * 8,
          100 + Math.cos(a) * 15,
          66 + Math.sin(a) * 15,
          RB({ stroke: OCH, strokeWidth: 1 })
        )
      );
    });
    // community — connected dots
    const pts = [
      [60, 188],
      [100, 178],
      [140, 188],
      [80, 204],
      [120, 204],
    ];
    add(rc.linearPath([pts[0], pts[1], pts[2]], RB({ stroke: OLV, strokeWidth: 0.9 })));
    add(rc.linearPath([pts[3], pts[1], pts[4]], RB({ stroke: OLV, strokeWidth: 0.9 })));
    pts.forEach(([x, y]) =>
      add(rc.circle(x, y, 7, RB({ stroke: OLV, fill: OLV, fillStyle: "solid" })))
    );
  });
  return <svg viewBox="0 0 200 240" aria-hidden="true" ref={ref} />;
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="check" aria-hidden="true">
      <path
        d="M4 12.5 L10 18 L20 6"
        className="ln"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

/* ============================================================
   Sections
   ============================================================ */

function Hero() {
  const { sunRef, hillsRef } = useParallax();
  return (
    <header className="hero">
      <div className="hero__sky" />
      <div className="hero__scene">
        <div className="hero__sun" ref={sunRef} />
        <div className="hero__hills" ref={hillsRef}>
          <HeroHills />
        </div>
      </div>
      <div className="wrap hero__content">
        <Reveal as="p" className="kicker">
          The Art of Experience
        </Reveal>
        <Reveal as="h1" className="hero__title" delay="1">
          Under the
          <br />
          <em>Tuscan Sun</em>
        </Reveal>
        <Reveal as="p" className="hero__sub" delay="2">
          A private journey through the soul of Tuscany — where art,
          craftsmanship and Italian living come together.
        </Reveal>
        <Reveal className="hero__meta" delay="3">
          <span>16–20 September 2026</span>
          <span>
            <i className="dot" />
            Tuscany, Italy
          </span>
          <span>
            <i className="dot" />
            Limited to 10 guests
          </span>
        </Reveal>
      </div>
      <div className="scroll-hint" aria-hidden="true">
        <span>Scroll</span>
        <span className="bar" />
      </div>
    </header>
  );
}

function Manifesto() {
  return (
    <section className="section manifesto">
      <div className="wrap">
        <Reveal as="p" className="kicker" style={{ justifyContent: "center" }}>
          A Place Where Time Slows Down
        </Reveal>
        <Reveal as="p" className="manifesto__line" delay="1">
          Some places are beautiful. Others change the way you feel.{" "}
          <em>Tuscany is one of them.</em>
        </Reveal>
        <Reveal as="p" className="manifesto__coda" delay="2">
          Golden light over rolling hills. The scent of olive trees after a warm
          afternoon. A table where strangers become friends. Here, life follows
          a different rhythm — not rushed, not planned. Simply lived.
          <br />
          <br />
          <strong>
            This isn’t Tuscany as a destination. It’s Tuscany as a way of life.
          </strong>
        </Reveal>
      </div>
    </section>
  );
}

const STORIES = [
  {
    kicker: "Before Tuscany Begins",
    title: "Every great story begins around a table",
    art: <ArtWelcome />,
    reverse: false,
    body: [
      "Before we travel to Italy, we’ll gather in London for an intimate welcome dinner — an evening of Italian food, wine and conversation.",
      "A chance to meet the people who will soon become your travel companions.",
      ["Because the best experiences don’t begin at the airport. ", "They begin with human connection."],
    ],
  },
  {
    kicker: "Your Tuscan Home",
    title: "Not a hotel. Your home in Tuscany.",
    art: <ArtVilla />,
    reverse: true,
    body: [
      "Hidden among olive groves and gentle hills, your private villa becomes more than a place to stay.",
      "Mornings begin with breakfast on the terrace. Afternoons invite you to slow down beside the pool. Evenings end around a beautifully prepared table, sharing stories over local wine.",
    ],
  },
  {
    kicker: "Florence — Beyond the Postcard",
    title: "Experience Florence through the people who live it",
    art: <ArtFlorence />,
    reverse: false,
    body: [
      "We won’t just show you Florence. We’ll introduce you to the people who keep its soul alive.",
      "Beyond Renaissance masterpieces lies a city still shaped by artists, artisans and families preserving traditions passed down through generations.",
      ["Not as a visitor. ", "But as someone welcomed into its world."],
    ],
  },
  {
    kicker: "A Table with Nonna",
    title: "In Italy, recipes are family history",
    art: <ArtNonna />,
    reverse: true,
    body: [
      "Step into Nonna’s kitchen and learn the traditions behind handmade pasta, using techniques lovingly passed from one generation to the next.",
      "Cook together. Share stories. Gather around the table for a long Tuscan lunch filled with warmth, laughter and authentic flavours.",
      ["Because in Italy, food isn’t simply served. ", "It’s shared."],
    ],
  },
  {
    kicker: "The Taste of Tuscany",
    title: "Every bottle tells the story of its land",
    art: <ArtWine />,
    reverse: false,
    body: [
      "Walk through vineyards shaped by generations of winemakers. Discover local wines. Share a long countryside lunch.",
      ["Slow down. ", "Taste Tuscany exactly as it was meant to be experienced."],
    ],
  },
  {
    kicker: "Evenings Under the Tuscan Sky",
    title: "The moments you’ll remember most",
    art: <ArtEvening />,
    reverse: true,
    body: [
      "As daylight fades, another part of the story begins. A beautifully set table. A private chef. Local wines. Music drifting through the evening air.",
      "Conversations that continue long after dessert.",
    ],
  },
  {
    kicker: "The Story Continues",
    title: "The best journeys don’t end when you come home",
    art: <ArtCommunity />,
    reverse: false,
    body: [
      "Back in London, we’ll gather once again for drinks, conversation and shared memories — reliving the moments that made the journey unforgettable and celebrating the friendships that began in Italy.",
      ["The Art of Experience isn’t about one journey. ", "It’s about building a community brought together by curiosity, meaningful connections and unforgettable moments."],
    ],
  },
];

function Paragraph({ node }) {
  if (Array.isArray(node)) {
    return (
      <p>
        {node[0]}
        <span className="accent">{node[1]}</span>
      </p>
    );
  }
  return <p>{node}</p>;
}

function Story({ data, index }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className={`story ${data.reverse ? "story--reverse" : ""}`}>
          <Reveal className="story__text">
            <p className="kicker">{data.kicker}</p>
            <h2 className="story__title">{data.title}</h2>
            <div className="story__body">
              {data.body.map((n, i) => (
                <Paragraph key={i} node={n} />
              ))}
            </div>
          </Reveal>
          <Reveal className="story__art" delay="1">
            <div className="art-frame">{data.art}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const INCLUDED = [
  "Welcome dinner in London before departure",
  "Four nights in a private Tuscan villa near Lucca",
  "Daily breakfast on the villa terrace",
  "Florence cultural experience",
  "Pasta experience with Nonna, followed by lunch",
  "Exclusive winery visit and guided tasting",
  "Chef dinners",
  "Airport transfers from Pisa",
  "Private transportation throughout the experience",
  "Curated welcome gift",
];

function Included() {
  return (
    <section className="section included">
      <div className="wrap">
        <Reveal className="included__head">
          <p className="kicker">What Awaits You</p>
          <h2 className="story__title">
            Every detail thoughtfully curated — simply arrive and enjoy.
          </h2>
        </Reveal>
        <div className="included__grid">
          {INCLUDED.map((item, i) => (
            <Reveal className="included__item" key={i} delay={String((i % 4) + 1)}>
              <Check />
              <span>{item}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Price() {
  return (
    <section className="section price">
      <div className="wrap">
        <Reveal as="p" className="kicker" style={{ justifyContent: "center" }}>
          Reserve Your Place
        </Reveal>
        <Reveal className="price__amount" delay="1">
          £2,350
          <span className="per">per guest</span>
        </Reveal>
        <Reveal as="p" className="price__body" delay="2">
          A fully curated experience including accommodation, private dining,
          cultural experiences, transportation and every thoughtful detail
          designed to create memories that last long after you return home.
        </Reveal>
      </div>
    </section>
  );
}

function Guests() {
  return (
    <section className="section guests">
      <div className="wrap">
        <Reveal as="p" className="kicker" style={{ justifyContent: "center" }}>
          Only 10 Guests
        </Reveal>
        <Reveal className="guests__num" delay="1">
          10
        </Reveal>
        <Reveal as="p" className="guests__label" delay="1">
          Every edition is intentionally intimate.
        </Reveal>
        <Reveal as="p" className="guests__body" delay="2">
          Not for exclusivity alone — but because the most meaningful
          conversations, genuine friendships and unforgettable moments are
          created in small groups.
        </Reveal>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="section closing">
      <div className="wrap">
        <Reveal as="h2" className="closing__lead">
          Come for Tuscany.
          <br />
          Leave with <em>something far more valuable.</em>
        </Reveal>
        <Reveal className="closing__list" delay="1">
          <span>Not just photographs. Not just memories.</span>
          <span>A new perspective.</span>
          <span>New friendships.</span>
          <span>
            A deeper connection to a place — and to the people who shared it.
          </span>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <p className="foot__mark">The Art of Experience</p>
        <p className="foot__meta">
          <span>Under the Tuscan Sun</span>
          <span className="foot__meta-sep" aria-hidden="true">
            {" "}
            ·{" "}
          </span>
          <span>16–20 September 2026</span>
        </p>
      </div>
    </footer>
  );
}

/* ============================================================
   App
   ============================================================ */

function App() {
  return (
    <>
      <Hero />
      <Manifesto />
      <div className="divider-rule" />
      {STORIES.map((s, i) => (
        <Story data={s} index={i} key={i} />
      ))}
      <Included />
      <Price />
      <Guests />
      <Closing />
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
