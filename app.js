(() => {
const D = window.DATA;
const $ = (s) => document.querySelector(s);
const TYPE_EN = { "Bomba Hát": "Back", "Kárhozat": "Legs", "Taktikai mell": "Chest", "Tuti váll": "Shoulders" };
// Session types and lifts take the colour of the IEC plate they are paired with.
const TYPE_VAR = { "Bomba Hát": "--blue", "Kárhozat": "--red", "Taktikai mell": "--yellow", "Tuti váll": "--green" };
const LIFT_VAR = { "Squat (Barbell)": "--red", "Bench Press (Barbell)": "--yellow", "Bench Press - Close Grip (Barbell)": "--green", "Deadlift (Barbell)": "--blue" };
const LIFT = {
  en: { "Squat (Barbell)": "Squat", "Bench Press (Barbell)": "Bench press", "Bench Press - Close Grip (Barbell)": "Close-grip bench", "Deadlift (Barbell)": "Deadlift" },
  hu: { "Squat (Barbell)": "Guggolás", "Bench Press (Barbell)": "Fekvenyomás", "Bench Press - Close Grip (Barbell)": "Szűk fekvenyomás", "Deadlift (Barbell)": "Felhúzás" },
};
const ACC_VAR = { "Single Arm Lateral Raise": "--green", "EZ Bar Biceps Curl": "--blue", "Skullcrusher (Barbell)": "--yellow" };
const ACC = {
  en: { "Single Arm Lateral Raise": "Single-arm lateral raise", "EZ Bar Biceps Curl": "EZ-bar biceps curl", "Skullcrusher (Barbell)": "Skullcrusher" },
  hu: { "Single Arm Lateral Raise": "Egykezes oldalemelés", "EZ Bar Biceps Curl": "Franciarudas bicepszhajlítás", "Skullcrusher (Barbell)": "Skullcrusher" },
};
const I18N = {
  en: {
    title: "Training log", skip: "Skip to content", brand: "Training log",
    nav_strength: "Strength", nav_acc: "Accessories", nav_volume: "Volume", nav_attendance: "Attendance", nav_length: "Session length", nav_pdf: "PDF report", pdf_link: "Open the PDF report (2 pages, with the statistics behind the charts)",
    h1: (n, kg, r) => `Heaviest ${n}: ${kg} kg for ${r}`,
    plates: (d, list) => `A 20 kg bar with ${list} on each side (${d}).`,
    lede: (a, n, s, h, tn) => `${a}: <b>${n}</b> sessions, <b>${s}</b> working sets, <b>${h}</b> hours, <b>${tn}</b> tonnes of volume load.`,
    s_title: "Strength", s_sub: "Estimated one-rep max (e1RM, Epley formula) from the best set of each session. The line is a least-squares trend, the band its 95% confidence interval.",
    finding: (n, sl, lo, hi, r2, c, cur, hk, hr, hd) => `${n} is trending <b>${sl} kg a week</b> (95% interval ${lo} to ${hi}, R² ${r2}, ${c} sessions). Latest best e1RM is ${cur} kg. Heaviest set: ${hk} kg for ${hr} on ${hd}.`,
    x_title: "Accessories", x_sub: "Estimated max (e1RM) per session for the isolation work, with the same trend method as the main lifts.",
    accFinding: (sl, lo, hi, r2, n, hk, hr) => `<b>${sl} kg a week</b> (95% interval ${lo} to ${hi}, R² ${r2}, ${n} sessions). Heaviest set: ${hk} kg for ${hr}.`,
    v_title: "Volume", v_sub: "Weekly volume load: sets × reps × kg, warm-ups excluded.",
    a_title: "Attendance", a_sub: (n, w, a) => `${n} sessions in ${w} weeks, ${a} a week. Colour is the session type, depth is volume.`,
    d_title: "Session length", d_sub: "Minutes per session by type. The vertical bar marks the median.",
    foot: "Built from a Hevy CSV export. e1RM uses the Epley formula on sets of 1–10 reps. Trends are ordinary least-squares fits.",
    hollow: "Hollow points are sessions where the coach's sheet records something else. Tap one to see what.",
    sheetSays: (m) => `(sheet: ${m})`,
    weekOf: "Week of", min: "min", kg: "kg", t: "t", sets: "sets", mon: "Mon", wed: "Wed", fri: "Fri", perSide: "per side",
  },
  hu: {
    title: "Edzésnapló", skip: "Ugrás a tartalomra", brand: "Edzésnapló",
    nav_strength: "Erő", nav_acc: "Kiegészítők", nav_volume: "Volumen", nav_attendance: "Jelenlét", nav_length: "Edzés hossza", nav_pdf: "PDF-jelentés", pdf_link: "A PDF-jelentés megnyitása (2 oldal, a grafikonok mögötti statisztikákkal)",
    h1: (n, kg, r) => `Legnehezebb ${n}: ${kg} kg, ${r} ismétlés`,
    plates: (d, list) => `20 kg-os rúd, oldalanként ${list} (${d}).`,
    lede: (a, n, s, h, tn) => `${a}: <b>${n}</b> edzés, <b>${s}</b> munkasorozat, <b>${h}</b> óra, <b>${tn}</b> tonna terhelési volumen.`,
    s_title: "Erő", s_sub: "Becsült egyismétléses maximum (e1RM, Epley-képlet) az edzések legjobb sorozatából. A vonal legkisebb négyzetes trend, a sáv a 95%-os konfidenciaintervallum.",
    finding: (n, sl, lo, hi, r2, c, cur, hk, hr, hd) => `${n}: a trend <b>${sl} kg hetente</b> (95%-os intervallum ${lo} – ${hi}, R² ${r2}, ${c} edzés). A legutóbbi legjobb e1RM ${cur} kg. Legnehezebb sorozat: ${hk} kg, ${hr} ismétlés (${hd}).`,
    x_title: "Kiegészítők", x_sub: "Becsült maximum (e1RM) edzésenként az izolációs gyakorlatokra, ugyanazzal a trendmódszerrel, mint a fő emeléseknél.",
    accFinding: (sl, lo, hi, r2, n, hk, hr) => `<b>${sl} kg hetente</b> (95%-os intervallum ${lo} – ${hi}, R² ${r2}, ${n} edzés). Legnehezebb sorozat: ${hk} kg, ${hr} ismétlés.`,
    v_title: "Volumen", v_sub: "Heti terhelési volumen: sorozat × ismétlés × kg, bemelegítés nélkül.",
    a_title: "Jelenlét", a_sub: (n, w, a) => `${n} edzés ${w} hét alatt, heti ${a}. A szín az edzés típusa, a telítettség a volumen.`,
    d_title: "Edzés hossza", d_sub: "Az edzések hossza percben, típusonként. A függőleges vonal a mediánt jelöli.",
    foot: "Hevy CSV-exportból készült. Az e1RM az Epley-képletet használja 1–10 ismétléses sorozatokon. A trendek legkisebb négyzetes illesztések.",
    hollow: "Az üres pontoknál az edző táblázata mást rögzített. Koppints rá, hogy lásd, mit.",
    sheetSays: (m) => `(táblázat: ${m})`,
    weekOf: "Hét kezdete:", min: "perc", kg: "kg", t: "t", sets: "sorozat", mon: "H", wed: "Sze", fri: "P", perSide: "oldalanként",
  },
};
let lang = localStorage.getItem("lang") || (navigator.language.startsWith("hu") ? "hu" : "en");
let lift = 3;
const t = (k, ...a) => { const v = I18N[lang][k]; return typeof v === "function" ? v(...a) : v; };
const typeName = (i) => (lang === "hu" ? D.types[i] : TYPE_EN[D.types[i]] || D.types[i]);
const typeColor = (i) => `var(${TYPE_VAR[D.types[i]]})`;
const ts = (s) => new Date(s + "T00:00:00").getTime();
const fd = (ms, o) => new Intl.DateTimeFormat(lang, o).format(ms);
const nf = (n, o) => n.toLocaleString(lang, o);
const f2 = (n, sign) => nf(n, { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: sign ? "always" : "auto" });
const f1 = (n) => nf(n, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function niceTicks(lo, hi, n) {
  const raw = (hi - lo) / n, p = 10 ** Math.floor(Math.log10(raw)), f = raw / p;
  const step = (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p;
  const out = [];
  for (let v = Math.floor(lo / step) * step; v < hi + step - 1e-9; v += step) out.push(+v.toFixed(6));
  return out;
}
const svg = (w, h, inner) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${inner}</svg>`;
const monthTicks = (x0, x1) => {
  const out = [], d = new Date(x0); d.setDate(1); d.setMonth(d.getMonth() + 1);
  for (; d.getTime() <= x1; d.setMonth(d.getMonth() + 1)) out.push(d.getTime());
  return out;
};

/* Hero: the heaviest deadlift set, drawn as the bar that was actually loaded. */
const PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const PS = {
  25: { c: "#c62828", w: 78, h: 262, k: "#fff" }, 20: { c: "#1e50b4", w: 68, h: 262, k: "#fff" },
  15: { c: "#e8b400", w: 58, h: 262, k: "#141516" }, 10: { c: "#1e8a44", w: 48, h: 262, k: "#fff" },
  5: { c: "#ededE8", w: 36, h: 140, k: "#141516" }, 2.5: { c: "#2b2d30", w: 28, h: 112, k: "#fff" },
  1.25: { c: "#9aa0a6", w: 22, h: 96, k: "#141516" },
};
function platesFor(kg) {
  let side = (kg - 20) / 2; const out = [];
  for (const p of PLATES) while (side >= p - 1e-9) { out.push(p); side -= p; }
  return out;
}
const BELL = [0, 1, 3];
let bell = 3;
const heavy = () => D.lifts[bell].heavy;
function drawBell() {
  const W = 1200, cy = 150, ps = platesFor(heavy().kg);
  let s = `<rect x="0" y="${cy - 6}" width="${W}" height="12" fill="var(--steel)"/>`
    + `<rect x="714" y="${cy - 11}" width="${W - 714}" height="22" fill="var(--steel2)"/><rect x="0" y="${cy - 11}" width="486" height="22" fill="var(--steel2)"/>`
    + `<rect x="700" y="${cy - 34}" width="14" height="68" fill="var(--steel)"/><rect x="486" y="${cy - 34}" width="14" height="68" fill="var(--steel)"/>`;
  let x = 722;
  ps.forEach((p, i) => {
    const { c, w, h, k } = PS[p], label = `<text transform="translate(@X,${cy + 1}) rotate(-90)" text-anchor="middle" dominant-baseline="central" font-size="${Math.min(30, w - 10)}" fill="${k}">${p}</text>`;
    const shape = `<rect x="@R" y="${cy - h / 2}" width="${w}" height="${h}" rx="3" fill="${c}" stroke="rgba(0,0,0,.35)"/>`;
    s += `<g class="plate" style="--i:${i};--dx:60px">${shape.replace("@R", x)}${label.replace("@X", x + w / 2)}</g>`;
    s += `<g class="plate" style="--i:${i};--dx:-60px">${shape.replace("@R", W - x - w)}${label.replace("@X", W - x - w / 2)}</g>`;
    x += w + 5;
  });
  $("#bell").innerHTML = s;
  $("#bell").setAttribute("aria-label", `${heavy().kg} kg: ${ps.join(", ")}`);
}

function drawStrength() { drawTrend($("#cStrength"), D.lifts[lift], "var(--lc)"); }

function drawTrend(el, L, col, fixedH) {
  const W = el.clientWidth, H = fixedH || Math.round(Math.min(420, Math.max(280, W * 0.5)));
  const m = { l: 44, r: 14, t: 10, b: 30 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
  const xs = L.rows.map((r) => ts(r.d)), x0 = Math.min(...xs), x1 = Math.max(...xs);
  const ys = [...L.rows.map((r) => r.e), ...L.trend.line.flatMap((p) => [p.lo, p.hi])];
  const yt = niceTicks(Math.min(...ys), Math.max(...ys), 4), y0 = yt[0], y1 = yt[yt.length - 1];
  const X = (v) => m.l + ((v - x0) / (x1 - x0 || 1)) * iw, Y = (v) => m.t + ih - ((v - y0) / (y1 - y0)) * ih;
  let s = yt.map((v) => `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${m.l - 8}" y="${Y(v) + 4}" text-anchor="end">${v}</text>`).join("");
  s += monthTicks(x0, x1).map((v) => `<text x="${X(v)}" y="${H - 8}" text-anchor="middle">${fd(v, { month: "short" })}</text>`).join("");
  const up = L.trend.line.map((p) => `${X(ts(p.d))},${Y(p.hi)}`), dn = L.trend.line.map((p) => `${X(ts(p.d))},${Y(p.lo)}`).reverse();
  s += `<polygon points="${up.concat(dn).join(" ")}" fill="${col}" opacity=".16"/>`;
  s += `<polyline points="${L.trend.line.map((p) => `${X(ts(p.d))},${Y(p.m)}`).join(" ")}" fill="none" stroke="${col}" stroke-width="2.5"/>`;
  s += L.rows.map((r) => {
    const hollow = r.v === "d";
    const tip = `${fd(ts(r.d), { day: "numeric", month: "short" })}: ${r.top} ${t("kg")}, e1RM ${f1(r.e)} ${t("kg")}${hollow ? ` ${t("sheetSays", r.m)}` : ""}`;
    const look = hollow ? `fill="var(--bg)" stroke="${col}" stroke-width="2.5"` : `fill="${col}" stroke="var(--bg)" stroke-width="2"`;
    return `<circle class="dot" tabindex="0" cx="${X(ts(r.d))}" cy="${Y(r.e)}" r="5" ${look} data-tip="${tip}" aria-label="${tip}"/>`;
  }).join("");
  el.innerHTML = svg(W, H, s);
}

function updateFinding() {
  const L = D.lifts[lift], tr = L.trend, hv = L.heavy;
  $("#strength").style.setProperty("--lc", `var(${LIFT_VAR[L.key]})`);
  $("#finding").innerHTML = t("finding", LIFT[lang][L.key], f2(tr.slope, true), f2(tr.lo, true), f2(tr.hi, true), f2(tr.r2), tr.n,
    f1(L.rows[L.rows.length - 1].e), nf(hv.kg), hv.reps, fd(ts(hv.d), { day: "numeric", month: "short" }));
  $("#sNote").textContent = L.rows.some((r) => r.v === "d") ? t("hollow") : "";
}

function drawVolume() {
  const el = $("#cVolume"), W = el.clientWidth, H = 320, m = { l: 40, r: 8, t: 10, b: 30 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b, n = D.weeks.length, slot = iw / n, bw = Math.max(3, slot * 0.72);
  const tot = D.weeks.map((w) => w.v.reduce((a, b) => a + b, 0));
  const yt = niceTicks(0, Math.max(...tot), 4), ymax = yt[yt.length - 1], Y = (v) => m.t + ih - (v / ymax) * ih;
  let s = yt.map((v) => `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${m.l - 8}" y="${Y(v) + 4}" text-anchor="end">${v}</text>`).join("");
  const every = Math.ceil(52 / slot);
  D.weeks.forEach((w, i) => {
    const x = m.l + i * slot + (slot - bw) / 2, ms = ts(w.w);
    let acc = 0;
    const tip = `${t("weekOf")} ${fd(ms, { day: "numeric", month: "short" })}: ${f1(tot[i])} ${t("t")}`;
    w.v.forEach((v, k) => {
      if (v <= 0) return;
      s += `<rect class="bar-el" x="${x}" y="${Y(acc + v)}" width="${bw}" height="${Math.max(0, Y(acc) - Y(acc + v) - 1)}" fill="${typeColor(k)}" data-tip="${tip} (${typeName(k)} ${f1(v)})"/>`;
      acc += v;
    });
    if (i % every === 0) s += `<text x="${x + bw / 2}" y="${H - 8}" text-anchor="middle">${fd(ms, { day: "numeric", month: "short" })}</text>`;
  });
  el.innerHTML = svg(W, H, s);
  $("#legend").innerHTML = D.types.map((_, k) => `<span><i style="background:${typeColor(k)}"></i>${typeName(k)}</span>`).join("");
}

function drawCalendar() {
  const el = $("#cCal"), first = new Date(ts(D.meta.first)), last = ts(D.meta.last);
  const start = new Date(first); start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const cell = 16, gap = 4, step = cell + gap, left = 34, top = 20;
  const weeks = Math.floor((last - start.getTime()) / 6048e5) + 1;
  const day = {}; D.days.forEach((d) => { const o = (day[d.d] ||= { v: 0, t: d.t }); o.v += d.v; });
  const max = Math.max(...Object.values(day).map((o) => o.v)), W = left + weeks * step, H = top + 7 * step;
  let s = [[0, "mon"], [2, "wed"], [4, "fri"]].map(([r, k]) => `<text x="0" y="${top + r * step + 12}">${t(k)}</text>`).join("");
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const wd = new Date(start.getTime() + w * 6048e5);
    if (wd.getMonth() !== lastMonth) { lastMonth = wd.getMonth(); s += `<text x="${left + w * step}" y="10">${fd(wd, { month: "short" })}</text>`; }
    for (let r = 0; r < 7; r++) {
      const d = new Date(start.getTime() + (w * 7 + r) * 864e5), iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (d.getTime() > last) continue;
      const o = day[iso], x = left + w * step, y = top + r * step;
      s += o
        ? `<rect class="bar-el" x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${typeColor(o.t)}" opacity="${0.35 + 0.65 * (o.v / max)}" data-tip="${fd(d, { day: "numeric", month: "short" })}: ${typeName(o.t)}, ${f1(o.v)} ${t("t")}"/>`
        : `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="var(--line)" opacity=".5"/>`;
    }
  }
  el.innerHTML = svg(W, H, s);
  $("#aSub").textContent = t("a_sub", D.meta.sessions, weeks, f1(D.meta.sessions / weeks));
}

function drawDuration() {
  const el = $("#cDur"), W = el.clientWidth, row = 60, m = { l: 96, r: 10, t: 6, b: 28 }, H = m.t + m.b + row * D.types.length;
  const iw = W - m.l - m.r, mx = Math.ceil(Math.max(...D.dur.map((d) => d.m)) / 30) * 30, X = (v) => m.l + (v / mx) * iw;
  let s = "";
  for (let v = 0; v <= mx; v += 30) s += `<line class="grid" x1="${X(v)}" x2="${X(v)}" y1="${m.t}" y2="${H - m.b}"/><text x="${X(v)}" y="${H - 8}" text-anchor="middle">${v}</text>`;
  D.types.forEach((_, k) => {
    const cy = m.t + row * k + row / 2, ds = D.dur.filter((d) => d.t === k).map((d) => d.m).sort((a, b) => a - b);
    const med = ds.length % 2 ? ds[(ds.length - 1) / 2] : (ds[ds.length / 2 - 1] + ds[ds.length / 2]) / 2;
    s += `<text x="${m.l - 14}" y="${cy + 4}" text-anchor="end" style="fill:var(--fg);font-size:14px">${typeName(k)}</text>`;
    ds.forEach((v, i) => {
      s += `<circle class="dot" cx="${X(v)}" cy="${cy + ((i * 37) % 17) - 8}" r="4.5" fill="${typeColor(k)}" opacity=".8" data-tip="${v} ${t("min")}"/>`;
    });
    s += `<rect x="${X(med) - 1.5}" y="${cy - 22}" width="3" height="44" fill="var(--fg)" data-tip="${typeName(k)}: ${nf(med)} ${t("min")}"/>`;
  });
  el.innerHTML = svg(W, H, s);
}

function drawAcc() { D.acc.forEach((a, i) => drawTrend($(`#cAcc${i}`), a, `var(${ACC_VAR[a.key]})`, 240)); }

function drawAll() { drawStrength(); drawAcc(); drawVolume(); drawCalendar(); drawDuration(); }

function heroText() {
  const hv = heavy(), dfmt = { day: "numeric", month: "long", year: "numeric" };
  $("#h1").textContent = t("h1", LIFT[lang][D.lifts[bell].key].toLocaleLowerCase(lang), nf(hv.kg), hv.reps);
  $("#plates").textContent = t("plates", fd(ts(hv.d), dfmt), platesFor(hv.kg).map((p) => nf(p)).join(", "));
}

function applyLang() {
  document.documentElement.lang = lang; document.title = t("title");
  document.querySelectorAll("[data-i18n]").forEach((e) => (e.textContent = t(e.dataset.i18n)));
  document.querySelectorAll("#lang button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  const m = D.meta, dfmt = { day: "numeric", month: "long", year: "numeric" };
  heroText();
  $("#lede").innerHTML = t("lede", `${fd(ts(m.first), { day: "numeric", month: "long" })} – ${fd(ts(m.last), dfmt)}`, m.sessions, nf(m.sets), m.hours, nf(m.tonnes));
  $("#liftTabs").innerHTML = D.lifts.map((l, i) => `<button type="button" data-i="${i}" style="--lc:var(${LIFT_VAR[l.key]})" aria-pressed="${i === lift}"><i></i>${LIFT[lang][l.key]}</button>`).join("");
  $("#bellTabs").innerHTML = BELL.map((i) => `<button type="button" data-i="${i}" style="--lc:var(${LIFT_VAR[D.lifts[i].key]})" aria-pressed="${i === bell}"><i></i>${LIFT[lang][D.lifts[i].key]}</button>`).join("");
  $("#acc").innerHTML = D.acc.map((a, i) => {
    const tr = a.trend, hv = a.heavy;
    return `<article><div><h3>${ACC[lang][a.key]}</h3><p class="finding sm" style="--lc:var(${ACC_VAR[a.key]})">${t("accFinding", f2(tr.slope, true), f2(tr.lo, true), f2(tr.hi, true), f2(tr.r2), tr.n, nf(hv.kg), hv.reps)}</p></div><div class="chart" id="cAcc${i}" role="img" aria-label="${ACC[lang][a.key]}"></div></article>`;
  }).join("");
  updateFinding(); drawAll();
}

$("#lang").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  lang = b.dataset.lang; localStorage.setItem("lang", lang); applyLang();
});
$("#bellTabs").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  bell = +b.dataset.i;
  document.querySelectorAll("#bellTabs button").forEach((x) => x.setAttribute("aria-pressed", x === b));
  heroText(); drawBell();
});
$("#liftTabs").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  lift = +b.dataset.i;
  document.querySelectorAll("#liftTabs button").forEach((x) => x.setAttribute("aria-pressed", x === b));
  updateFinding(); drawStrength();
});

const tip = $("#tip");
const showTip = (e) => {
  const el = e.target.closest && e.target.closest("[data-tip]");
  if (!el) { tip.hidden = true; return; }
  const r = el.getBoundingClientRect();
  tip.textContent = el.dataset.tip; tip.hidden = false;
  const w = tip.offsetWidth, h = tip.offsetHeight;
  tip.style.left = `${Math.min(innerWidth - w / 2 - 8, Math.max(w / 2 + 8, r.left + r.width / 2))}px`;
  tip.style.top = `${r.top - h - 8 < 8 ? r.bottom + 8 : r.top - h - 8}px`;
};
["mouseover", "focusin", "click"].forEach((ev) => document.addEventListener(ev, showTip));
["focusout", "scroll"].forEach((ev) => document.addEventListener(ev, () => (tip.hidden = true), true));

let lastW = 0;
new ResizeObserver(() => { const w = document.body.clientWidth; if (w !== lastW) { lastW = w; drawAll(); } }).observe(document.body);

drawBell();
applyLang();
})();
