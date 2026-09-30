/* ==========================================================================
   Unicum Car — vetrina e interazioni
   ========================================================================== */
(() => {
  "use strict";

  /*
   * PARCO AUTO
   * Per aggiungere o modificare un'auto basta intervenire qui.
   * - photos: numero di foto nella cartella assets/img/cars/<slug>/ (01.jpg, 02.jpg, …
   *   più la miniatura 01-sm.jpg, 02-sm.jpg, …)
   * - I campi lasciati a null (anno, prezzo, alimentazione, cambio, km) non vengono mostrati.
   * - price: null mostra "Prezzo su richiesta".
   */
  const CARS = [
    { stock: "UN·001", slug: "mini-cooper", brand: "Mini", model: "Cooper 3 porte", body: "City car", fuel: "Benzina", gear: "Manuale", km: 119000, year: null, price: null, photos: 10,
      note: "Livrea arancione con strisce nere sul cofano, tetto apribile in vetro e interni in tessuto." },
    { stock: "UN·002", slug: "porsche-panamera", brand: "Porsche", model: "Panamera", body: "Berlina", fuel: null, gear: "Automatico", km: null, year: null, price: null, photos: 6,
      note: "Grigio scuro metallizzato, interni in pelle chiara, console centrale posteriore." },
    { stock: "UN·003", slug: "citroen-c3", brand: "Citroën", model: "C3", body: "City car", fuel: "Diesel", gear: null, km: 99999, year: null, price: null, photos: 9,
      note: "Bianca con dettagli neri e Airbump laterali, perfetta per la città e per i neopatentati." },
    { stock: "UN·004", slug: "suzuki-jimny", brand: "Suzuki", model: "Jimny", body: "Fuoristrada", fuel: "Benzina", gear: null, km: 44800, year: null, price: null, photos: 3,
      note: "Grigio argento, portapacchi sul tetto e griglia divisoria per il vano di carico." },
    { stock: "UN·005", slug: "audi-tt", brand: "Audi", model: "TT Coupé 2.0 TFSI", body: "Coupé", fuel: "Benzina", gear: "Manuale", km: null, year: null, price: null, photos: 9,
      note: "Nera, motore 2.0 TFSI, sedili sportivi in pelle e cerchi in lega." },
    { stock: "UN·006", slug: "mercedes-ml-320", brand: "Mercedes-Benz", model: "ML 320 CDI 4Matic", body: "SUV", fuel: "Diesel", gear: "Automatico", km: null, year: null, price: null, photos: 4,
      note: "Nera, trazione integrale 4Matic, pedane laterali e fendinebbia." },
    { stock: "UN·007", slug: "mercedes-ml", brand: "Mercedes-Benz", model: "Classe ML", body: "SUV", fuel: null, gear: "Automatico", km: null, year: null, price: null, photos: 5,
      note: "Nera, interni in pelle nera, bagagliaio ampio con copribagagli." },
    { stock: "UN·008", slug: "mercedes-glc", brand: "Mercedes-Benz", model: "GLC", body: "SUV", fuel: "Diesel", gear: "Automatico", km: null, year: null, price: null, photos: 7,
      note: "Bianca, interni in pelle nera, portellone con vano di carico ampio e regolare." },
  ];

  /* Auto che scorrono nell'apertura (slug e numero della foto) */
  const HERO = [
    { slug: "mini-cooper", photo: 1 },
    { slug: "mercedes-glc", photo: 1 },
    { slug: "audi-tt", photo: 1 },
    { slug: "porsche-panamera", photo: 1 },
    { slug: "citroen-c3", photo: 1 },
  ];
  const SLIDE_MS = 6000;

  /* ---------- Helpers ---------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const eur = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const num = new Intl.NumberFormat("it-IT");
  const photo = (car, i, small) => `assets/img/cars/${car.slug}/${String(i).padStart(2, "0")}${small ? "-sm" : ""}.jpg`;
  const name = (car) => `${car.brand} ${car.model}`;
  const bySlug = (slug) => CARS.find((c) => c.slug === slug);
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const specsOf = (car) => [
    car.year && String(car.year),
    car.km != null && `${num.format(car.km)} km`,
    car.fuel,
    car.gear,
  ].filter(Boolean);

  const plateHTML = (text) => `<span class="plate"><span class="plate__eu">I</span><span class="plate__num">${esc(text)}</span></span>`;

  /* ---------- Hero slideshow ---------- */
  const hero = $(".hero");
  const stage = $("#heroStage");
  const bars = $("#heroBars");
  const caption = $("#heroCaption");
  let slide = 0;
  let timer = null;

  stage.innerHTML = HERO.map((h, i) => {
    const car = bySlug(h.slug);
    return `<img class="hero__slide${i === 0 ? " is-active" : ""}" src="${photo(car, h.photo)}" alt="${esc(name(car))}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} />`;
  }).join("");
  bars.innerHTML = HERO.map((h, i) =>
    `<button type="button" class="hero__bar" role="tab" aria-label="${esc(name(bySlug(h.slug)))}" data-slide="${i}"><span></span></button>`
  ).join("");
  bars.style.setProperty("--slide-ms", `${SLIDE_MS}ms`);

  function showSlide(i) {
    slide = (i + HERO.length) % HERO.length;
    const car = bySlug(HERO[slide].slug);
    $$(".hero__slide", stage).forEach((img, k) => img.classList.toggle("is-active", k === slide));
    $$(".hero__bar", bars).forEach((b, k) => {
      b.classList.toggle("is-done", k < slide);
      b.classList.remove("is-active");
      b.setAttribute("aria-selected", String(k === slide));
    });
    const active = $$(".hero__bar", bars)[slide];
    void active.offsetWidth; // restart the progress animation
    active.classList.add("is-active");
    $("#heroName").textContent = name(car);
    $("#heroMeta").textContent = [car.km != null && `${num.format(car.km)} km`, car.fuel, car.body].filter(Boolean).join(" · ");
    caption.dataset.open = car.slug;
    clearTimeout(timer);
    if (!reduceMotion) timer = setTimeout(() => showSlide(slide + 1), SLIDE_MS);
  }
  bars.addEventListener("click", (e) => {
    const b = e.target.closest("[data-slide]");
    if (b) showSlide(Number(b.dataset.slide));
  });
  caption.addEventListener("click", () => openSheet(caption.dataset.open));
  // swipe on the hero photo (phones)
  let hx = null;
  hero.addEventListener("touchstart", (e) => { if (!e.target.closest("a, button")) hx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", (e) => {
    if (hx == null) return;
    const dx = e.changedTouches[0].clientX - hx;
    if (Math.abs(dx) > 50) showSlide(slide + (dx < 0 ? 1 : -1));
    hx = null;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearTimeout(timer); else showSlide(slide);
  });
  showSlide(0);

  /* ---------- Inventory ---------- */
  const state = { body: "Tutte", sort: "stock" };
  const stockEl = $("#stock");
  const chipsEl = $("#chips");

  const bodies = ["Tutte", ...new Set(CARS.map((c) => c.body))];
  chipsEl.innerHTML = bodies.map((b) => {
    const n = b === "Tutte" ? CARS.length : CARS.filter((c) => c.body === b).length;
    return `<button type="button" class="chip" data-body="${esc(b)}" aria-pressed="${b === state.body}">${esc(b)}<span class="chip__n">${n}</span></button>`;
  }).join("");

  function visibleCars() {
    const list = CARS.filter((c) => state.body === "Tutte" || c.body === state.body);
    if (state.sort === "km-asc") list.sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity));
    if (state.sort === "brand") list.sort((a, b) => name(a).localeCompare(name(b), "it"));
    return list;
  }

  const CAMERA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>';
  const ARROW = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function cardHTML(car, i) {
    const specs = specsOf(car).map((s) => `<li>${/km$/.test(s) ? `<span class="mono">${esc(s)}</span>` : esc(s)}</li>`).join("");
    const price = car.price
      ? `<span class="car__price">${eur.format(car.price)}</span>`
      : `<span class="car__price car__price--ask">Prezzo su richiesta</span>`;
    return `
      <article class="car" style="animation-delay:${i * 60}ms">
        <div class="car__media">
          <img src="${photo(car, 1, true)}" alt="" loading="lazy" width="450" height="600" />
          ${plateHTML(car.stock)}
          <span class="car__photos">${CAMERA}${car.photos} foto</span>
        </div>
        <div class="car__body">
          <p class="car__brand">${esc(car.brand)}</p>
          <h3 class="car__model">${esc(car.model)}</h3>
          <ul class="car__specs">${specs}</ul>
          <div class="car__foot">${price}<span class="car__go">${ARROW}</span></div>
        </div>
        <button type="button" class="car__open" data-open="${esc(car.slug)}" aria-label="Apri scheda e foto di ${esc(name(car))}"></button>
      </article>`;
  }

  function render() {
    const list = visibleCars();
    stockEl.innerHTML = list.map(cardHTML).join("");
    $("#resultCount").innerHTML = `<strong>${list.length}</strong> ${list.length === 1 ? "auto disponibile" : "auto disponibili"}${state.body !== "Tutte" ? ` · ${esc(state.body)}` : ""}`;
    $("#emptyState").hidden = list.length > 0;
    $$(".chip", chipsEl).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.body === state.body)));
  }

  chipsEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.body = chip.dataset.body;
    render();
  });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  $("#resetFilters").addEventListener("click", () => { state.body = "Tutte"; render(); });
  stockEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open]");
    if (btn) openSheet(btn.dataset.open);
  });

  /* ---------- Vehicle sheet with swipe gallery ---------- */
  const sheet = $("#sheet");
  const track = $("#galleryTrack");
  const thumbs = $("#galleryThumbs");
  const count = $("#galleryCount");
  let current = null;

  const photoIndex = () => Math.round(track.scrollLeft / Math.max(1, track.clientWidth));

  function markPhoto(i) {
    if (!current) return;
    count.textContent = `${i + 1} / ${current.photos}`;
    $$("button", thumbs).forEach((b, k) => {
      const on = k === i;
      b.setAttribute("aria-current", String(on));
      if (on) b.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  }
  function goPhoto(i) {
    const n = current.photos;
    const target = ((i % n) + n) % n;
    track.scrollTo({ left: target * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
    markPhoto(target);
  }

  function openSheet(slug) {
    const car = bySlug(slug);
    if (!car) return;
    current = car;

    track.innerHTML = Array.from({ length: car.photos }, (_, k) =>
      `<img src="${photo(car, k + 1)}" alt="${esc(name(car))}, foto ${k + 1} di ${car.photos}" ${k > 1 ? 'loading="lazy"' : ""} />`
    ).join("");
    thumbs.innerHTML = Array.from({ length: car.photos }, (_, k) =>
      `<button type="button" data-i="${k}" aria-label="Foto ${k + 1}"><img src="${photo(car, k + 1, true)}" alt="" loading="lazy" /></button>`
    ).join("");

    const rows = [
      ["Codice", `<span class="mono">${esc(car.stock)}</span>`],
      ["Carrozzeria", esc(car.body)],
      car.year && ["Anno", `<span class="mono">${car.year}</span>`],
      car.km != null && ["Chilometri", `<span class="mono">${num.format(car.km)} km</span>`],
      car.fuel && ["Alimentazione", esc(car.fuel)],
      car.gear && ["Cambio", esc(car.gear)],
      ["Garanzia", "12 mesi inclusa"],
    ].filter(Boolean);

    $("#sheetInfo").innerHTML = `
      <div>
        <p class="sheet__brand">${esc(car.brand)}</p>
        <h3 id="sheetTitle">${esc(car.model)}</h3>
      </div>
      <p class="sheet__note">${esc(car.note)}</p>
      ${car.price ? `<p class="sheet__price">${eur.format(car.price)}</p>` : `<p class="sheet__price sheet__price--ask">Prezzo su richiesta: te lo comunichiamo subito insieme alla disponibilità.</p>`}
      <table class="specs"><tbody>${rows.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join("")}</tbody></table>
      <div class="sheet__actions">
        <a href="#contatti" class="btn btn--red btn--lg" data-subject="Disponibilità di un'auto" data-car="${esc(name(car))}">Chiedi disponibilità e prezzo</a>
        <a href="#contatti" class="btn btn--ghost btn--lg" data-subject="Prova su strada" data-car="${esc(name(car))}">Prenota una prova su strada</a>
      </div>`;

    if (!sheet.open) sheet.showModal();
    document.documentElement.style.overflow = "hidden";
    track.scrollLeft = 0;
    $(".sheet__grid").scrollTop = 0;
    markPhoto(0);
    clearTimeout(timer);
  }

  function closeSheet() { if (sheet.open) sheet.close(); }
  sheet.addEventListener("close", () => {
    document.documentElement.style.overflow = "";
    if (!reduceMotion) timer = setTimeout(() => showSlide(slide + 1), SLIDE_MS);
  });

  let scrollRaf = 0;
  track.addEventListener("scroll", () => {
    cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(() => markPhoto(photoIndex()));
  }, { passive: true });
  thumbs.addEventListener("click", (e) => {
    const b = e.target.closest("[data-i]");
    if (b) goPhoto(Number(b.dataset.i));
  });
  $("#galleryPrev").addEventListener("click", () => goPhoto(photoIndex() - 1));
  $("#galleryNext").addEventListener("click", () => goPhoto(photoIndex() + 1));
  $("#sheetClose").addEventListener("click", closeSheet);
  sheet.addEventListener("click", (e) => { if (e.target === sheet) closeSheet(); });
  sheet.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goPhoto(photoIndex() - 1);
    if (e.key === "ArrowRight") goPhoto(photoIndex() + 1);
  });

  /* ---------- Prefill the contact form from any CTA ---------- */
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-subject]");
    if (!link) return;
    $("#fSubject").value = link.dataset.subject;
    $("#fCar").value = link.dataset.car || "";
    closeSheet();
    setNav(false);
  });

  /* ---------- Finance calculator ---------- */
  const calc = { price: $("#cPrice"), down: $("#cDown"), months: $("#cMonths"), rate: $("#cRate") };
  const installment = (principal, months, tan) => {
    if (principal <= 0) return 0;
    const r = tan / 100 / 12;
    return r === 0 ? principal / months : (principal * r) / (1 - Math.pow(1 + r, -months));
  };
  function updateCalc() {
    const price = Number(calc.price.value);
    calc.down.max = Math.min(30000, price);
    const down = Math.min(Number(calc.down.value), price);
    const months = Number(calc.months.value);
    const tan = Number(calc.rate.value);
    const financed = price - down;
    const m = installment(financed, months, tan);
    $("#oPrice").textContent = eur.format(price);
    $("#oDown").textContent = eur.format(down);
    $("#oMonths").textContent = `${months} mesi`;
    $("#oRate").textContent = `${tan.toFixed(1).replace(".", ",")}%`;
    $("#oMonthly").textContent = eur.format(m);
    $("#oTotal").textContent = `Finanzi ${eur.format(financed)} · totale rate ${eur.format(m * months)}`;
    Object.values(calc).forEach((el) => el.style.setProperty("--p", `${((el.value - el.min) / (el.max - el.min)) * 100}%`));
  }
  Object.values(calc).forEach((el) => el.addEventListener("input", updateCalc));
  updateCalc();

  /* ---------- Header and navigation ---------- */
  const header = $("#header");
  const burger = $("#burger");
  const nav = $("#nav");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    header.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
    document.documentElement.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setNav(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });

  const links = $$(".nav__link");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${en.target.id}`));
    }), { rootMargin: "-40% 0px -55% 0px" });
    links.forEach((l) => { const s = $(l.getAttribute("href")); if (s) io.observe(s); });
  }

  /* ---------- Copy buttons ---------- */
  $$("[data-copy]").forEach((btn) => btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.copy);
    const done = () => { btn.textContent = "Copiato"; setTimeout(() => { btn.textContent = "Copia"; }, 1600); };
    const selectText = () => {
      const range = document.createRange();
      range.selectNodeContents(target);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(target.textContent.trim()).then(done, selectText);
    else selectText();
  }));

  /* ---------- Contact form ---------- */
  const form = $("#contactForm");
  const status = $("#formStatus");
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const checks = [
      [$("#fName"), (v) => v.trim().length > 1],
      [$("#fPhone"), (v) => v.replace(/\D/g, "").length >= 6],
      [$("#fEmail"), (v) => emailOk(v.trim())],
    ];
    let valid = true;
    checks.forEach(([input, test]) => {
      const ok = test(input.value);
      input.closest(".field").classList.toggle("has-error", !ok);
      if (!ok) valid = false;
    });
    const privacy = $("#fPrivacy");
    privacy.closest(".check").classList.toggle("has-error", !privacy.checked);
    if (!privacy.checked) valid = false;

    status.className = "form__status";
    if (!valid) {
      status.textContent = "Completa i campi segnati in rosso per inviare la richiesta.";
      status.classList.add("is-error");
      form.querySelector(".has-error input")?.focus();
      return;
    }
    // Collegare qui il servizio di invio (es. Formspree, Netlify Forms o un backend).
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Invio in corso…";
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.textContent = "Invia la richiesta";
      status.textContent = "Richiesta ricevuta. Ti ricontattiamo entro la giornata.";
      status.classList.add("is-ok");
    }, 700);
  });
  $$("input", form).forEach((i) => i.addEventListener("input", () => i.closest(".field, .check")?.classList.remove("has-error")));

  $("#year").textContent = new Date().getFullYear();
  render();
})();
