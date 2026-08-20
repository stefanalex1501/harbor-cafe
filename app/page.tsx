"use client";

import { useState } from "react";

type Language = "ro" | "en";
type MenuCategory = "coffee" | "notCoffee" | "brunch" | "sweet";

const copy = {
  ro: {
    skip: "Sari la conținut", home: "Acasă", story: "Poveste", menu: "Meniu", gallery: "Galerie", visit: "Vizitează-ne",
    openMenu: "Deschide meniul de navigație", closeMenu: "Închide meniul de navigație", switchLanguage: "Switch language to English",
    eyebrow: "Slow coffee. Lumină naturală.", title: <>Un mic refugiu<br />în inima orașului.</>,
    intro: "Cafea de specialitate, Prosecco și acel sentiment că ai ajuns exact unde trebuie.", discover: "Descoperă meniul",
    heroNote: <>Dimineți tihnite.<br />Cafea făcută cu grijă.</>, manifesto: "Din prima ceașcă până la ultima poveste a zilei.",
    manifestoSmall: "Harbor Cafe · pauza ta de zi cu zi", storyKicker: "Povestea noastră", storyTitle: <>Un loc în care timpul<br />curge puțin mai încet.</>,
    storyBody1: "Harbor Cafe s-a născut din plăcerea lucrurilor făcute cu grijă: specialty coffee, lumină naturală și conversații care nu se grăbesc nicăieri.",
    storyBody2: "Am imaginat un spațiu cald și familiar, cu energia unui port liniștit — un punct de întâlnire în care revii pentru gust, dar rămâi pentru atmosferă.",
    detail1: "Boabe alese", detail2: "Preparare atentă", detail3: "Momente tihnite",
    detailBody1: "Folosim cafea de specialitate prăjită de MABÓ în București, în loturi atent selecționate din ferme transparente și sustenabile. Boabele 100% Arabica sunt alese pentru claritate, echilibru și caracterul fiecărei origini.",
    detailBody2: "Cântărim fiecare doză, urmărim timpul și ajustăm măcinătura pe parcursul zilei, pentru ca fiecare cafea să rămână echilibrată și expresivă.",
    detailBody3: "Harbor este locul pentru câteva minute fără grabă — o cafea bună, lumină caldă și timp să respiri înainte ca ziua să meargă mai departe.",
    expandDetail: "Afișează mai multe informații", collapseDetail: "Ascunde informațiile", menuKicker: "Meniul Harbor", menuTitle: "Simplu. Bun. Memorabil.",
    menuIntro: "Cafea de specialitate, băuturi reci, ciabatta și deserturi — toate într-un singur loc.",
    categories: { coffee: "Cafea caldă", notCoffee: "Rece & bar", brunch: "Ciabatta", sweet: "Deserturi" },
    galleryKicker: "Galerie", galleryTitle: <>Texturi, lumină<br />și cafea bună.</>,
    galleryNote: "O privire în atmosfera Harbor Cafe — lumină caldă, cafea pregătită cu grijă și ceva bun alături.",
    galleryAlts: ["Latte art pregătit la Harbor Cafe", "Cafea măcinată manual", "Vitrina Harbor Cafe cu băuturi și gustări", "Cafea rece cu portocală", "Selecție de cafea de specialitate", "Decorul cu influențe nautice Harbor Cafe", "Cold brew turnat peste gheață", "Produse proaspete în vitrina Harbor Cafe", "Cafea preparată prin metoda V60", "Espressorul Harbor Cafe", "Barista tasând cafeaua", "Cafea rece fotografiată de sus", "Socată și croissante pe tejghea", "Selecție de cafea MABÓ și croissante", "Cafea măcinată pentru espresso", "Barista distribuind cafeaua în portafiltru", "Espresso proaspăt extras", "Espresso servit cu apă", "Espresso și croissante pe tejghea"],
    visitKicker: "Găsește-ne", visitTitle: "Ne vedem la Harbor.", addressLabel: "Adresă", address: "Bulevardul Alexandru Ioan Cuza 13, 011051 București",
    hoursLabel: "Program", mapTitle: "Harbor Cafe pe Google Maps", directions: "Deschide în Google Maps", instagram: "Urmărește-ne pe Instagram",
    hours: [["Luni", "07:00–17:00"], ["Marți", "07:00–17:00"], ["Miercuri", "07:00–17:00"], ["Joi", "07:00–17:00"], ["Vineri", "07:00–17:00"], ["Sâmbătă", "08:00–16:00"], ["Duminică", "Închis"]],
    footerLine: "Cafea bună. Ritm domol.", footerNote: "Harbor Cafe · Toate drepturile rezervate",
  },
  en: {
    skip: "Skip to content", home: "Home", story: "Story", menu: "Menu", gallery: "Gallery", visit: "Visit us",
    openMenu: "Open navigation menu", closeMenu: "Close navigation menu", switchLanguage: "Schimbă limba în română",
    eyebrow: "Slow coffee. Natural light.", title: <>A little refuge<br />in the heart of the city.</>,
    intro: "Specialty coffee, Prosecco, and that feeling of arriving exactly where you need to be.", discover: "Explore the menu",
    heroNote: <>Slow mornings.<br />Coffee made with care.</>, manifesto: "From the first cup to the last story of the day.",
    manifestoSmall: "Harbor Cafe · your daily pause", storyKicker: "Our story", storyTitle: <>A place where time<br />moves a little slower.</>,
    storyBody1: "Harbor Cafe grew from the joy of things made with care: specialty coffee, natural light, and conversations in no hurry to end.",
    storyBody2: "We imagined a warm, familiar space with the energy of a quiet harbor — a meeting point you return to for the taste and stay for the feeling.",
    detail1: "Selected beans", detail2: "Careful brewing", detail3: "Unhurried moments",
    detailBody1: "We use specialty coffee roasted by MABÓ in Bucharest, in carefully selected batches sourced from transparent and sustainable farms. The 100% Arabica beans are chosen for clarity, balance, and the character of every origin.",
    detailBody2: "We weigh every dose, track each extraction, and adjust the grind throughout the day so every coffee remains balanced and expressive.",
    detailBody3: "Harbor is a place for a few unhurried minutes — good coffee, warm light, and time to breathe before the day moves on.",
    expandDetail: "Show more information", collapseDetail: "Hide information", menuKicker: "The Harbor menu", menuTitle: "Simple. Good. Memorable.",
    menuIntro: "Specialty coffee, cold drinks, ciabatta, and sweets — all in one place.",
    categories: { coffee: "Hot coffee", notCoffee: "Cold & bar", brunch: "Ciabatta", sweet: "Sweets" },
    galleryKicker: "Gallery", galleryTitle: <>Texture, light<br />and good coffee.</>,
    galleryNote: "A glimpse into Harbor Cafe — warm light, carefully made coffee, and something good on the side.",
    galleryAlts: ["Latte art being made at Harbor Cafe", "Coffee being ground by hand", "The Harbor Cafe counter with drinks and snacks", "Iced coffee with orange", "A selection of specialty coffee", "Harbor Cafe's nautical interior", "Cold brew poured over ice", "Fresh products at the Harbor Cafe counter", "Coffee brewed with the V60 method", "The Harbor Cafe espresso machine", "A barista tamping coffee", "Iced coffee photographed from above", "Elderflower soda and croissants on the counter", "A MABÓ coffee selection with croissants", "Coffee being ground for espresso", "A barista distributing coffee in a portafilter", "Freshly extracted espresso", "Espresso served with water", "Espresso and croissants on the counter"],
    visitKicker: "Find us", visitTitle: "Meet you at Harbor.", addressLabel: "Address", address: "13 Alexandru Ioan Cuza Boulevard, 011051 Bucharest",
    hoursLabel: "Opening hours", mapTitle: "Harbor Cafe on Google Maps", directions: "Open in Google Maps", instagram: "Follow us on Instagram",
    hours: [["Monday", "7:00 AM–5:00 PM"], ["Tuesday", "7:00 AM–5:00 PM"], ["Wednesday", "7:00 AM–5:00 PM"], ["Thursday", "7:00 AM–5:00 PM"], ["Friday", "7:00 AM–5:00 PM"], ["Saturday", "8:00 AM–4:00 PM"], ["Sunday", "Closed"]],
    footerLine: "Good coffee. Easy rhythm.", footerNote: "Harbor Cafe · All rights reserved",
  },
} as const;

const menuItems = {
  coffee: [
    { ro: "Espresso", en: "Espresso", noteRo: "40 ml", noteEn: "40 ml", price: "14 lei" },
    { ro: "Long Black", en: "Long Black", noteRo: "100 ml", noteEn: "100 ml", price: "15 lei" },
    { ro: "Americano", en: "Americano", noteRo: "100 ml", noteEn: "100 ml", price: "14 lei" },
    { ro: "Cortado", en: "Cortado", noteRo: "100 ml", noteEn: "100 ml", price: "15 lei" },
    { ro: "Cappuccino", en: "Cappuccino", noteRo: "180 ml", noteEn: "180 ml", price: "17 lei" },
    { ro: "Flat White", en: "Flat White", noteRo: "220 ml", noteEn: "220 ml", price: "19 lei" },
    { ro: "Latte", en: "Latte", noteRo: "300 ml", noteEn: "300 ml", price: "21 lei" },
    { ro: "V60 / Rarity", en: "V60 / Rarity", noteRo: "250 ml", noteEn: "250 ml", price: "23 / 33 lei" },
    { ro: "Ciocolată caldă", en: "Hot Chocolate", noteRo: "220 ml", noteEn: "220 ml", price: "19 lei" },
    { ro: "Matcha Latte", en: "Matcha Latte", noteRo: "220 ml", noteEn: "220 ml", price: "23 lei" },
    { ro: "Babyccino", en: "Babyccino", noteRo: "220 ml", noteEn: "220 ml", price: "15 lei" },
    { ro: "Ceai", en: "Tea", noteRo: "250 ml", noteEn: "250 ml", price: "17 lei" },
  ],
  notCoffee: [
    { ro: "Cold Brew", en: "Cold Brew", noteRo: "220 ml", noteEn: "220 ml", price: "23 lei" },
    { ro: "Cold Brew Latte", en: "Cold Brew Latte", noteRo: "220 ml", noteEn: "220 ml", price: "26 lei" },
    { ro: "Cold Brew Tonic", en: "Cold Brew Tonic", noteRo: "220 ml", noteEn: "220 ml", price: "28 lei" },
    { ro: "Tonic Espresso", en: "Tonic Espresso", noteRo: "220 ml", noteEn: "220 ml", price: "21 lei" },
    { ro: "Iced Latte", en: "Iced Latte", noteRo: "300 ml", noteEn: "300 ml", price: "21 lei" },
    { ro: "Iced Strawberry Matcha", en: "Iced Strawberry Matcha", noteRo: "300 ml", noteEn: "300 ml", price: "30 lei" },
    { ro: "Iced Lime Matcha Soda", en: "Iced Lime Matcha Soda", noteRo: "300 ml", noteEn: "300 ml", price: "21 lei" },
    { ro: "Socată", en: "Elderflower Soda", noteRo: "275 ml", noteEn: "275 ml", price: "21 lei" },
    { ro: "Mellow Orange", en: "Mellow Orange", noteRo: "330 ml", noteEn: "330 ml", price: "24 lei" },
    { ro: "Limonadă", en: "Lemonade", noteRo: "Proaspătă și răcoritoare", noteEn: "Fresh and refreshing", price: "24 lei" },
    { ro: "Apă plată / minerală", en: "Still / Sparkling Water", noteRo: "Apă îmbuteliată", noteEn: "Bottled water", price: "12 lei" },
    { ro: "Vin", en: "Wine", noteRo: "Pahar", noteEn: "Glass", price: "25 lei" },
    { ro: "Prosecco", en: "Prosecco", noteRo: "Pahar", noteEn: "Glass", price: "30 lei" },
    { ro: "Cocktail", en: "Cocktail", noteRo: "Cu alcool", noteEn: "Alcoholic", price: "25 lei" },
    { ro: "Cocktail F.A.", en: "Alcohol-free Cocktail", noteRo: "Fără alcool", noteEn: "Alcohol-free", price: "21 lei" },
  ],
  brunch: [
    { ro: "Cotto", en: "Cotto", noteRo: "Prosciutto cotto, mozzarella, sos pesto", noteEn: "Prosciutto cotto, mozzarella, pesto sauce", price: "34 lei" },
    { ro: "Chorizzino", en: "Chorizzino", noteRo: "Rucola, mozzarella, salami chorizo, salsa de trufe", noteEn: "Rocket, mozzarella, chorizo salami, truffle salsa", price: "34 lei" },
    { ro: "Toscana", en: "Toscana", noteRo: "Mozzarella, șuncă de pui, carciofi, cremă de brânză", noteEn: "Mozzarella, chicken ham, artichokes, cream cheese", price: "34 lei" },
  ],
  sweet: [
    { ro: "Pricomigdale", en: "Almond Macaroons", noteRo: "Desert cu migdale", noteEn: "Almond treat", price: "11 lei" },
    { ro: "Cookies cu ciocolată", en: "Chocolate Cookies", noteRo: "Cu bucăți de ciocolată", noteEn: "With chocolate pieces", price: "8 lei" },
    { ro: "Banana Bread", en: "Banana Bread", noteRo: "Fraged și aromat", noteEn: "Tender and fragrant", price: "18 lei" },
    { ro: "Brownies", en: "Brownies", noteRo: "Intens ciocolatoase", noteEn: "Rich and chocolatey", price: "18 lei" },
    { ro: "Chec", en: "Loaf Cake", noteRo: "Pufos și proaspăt", noteEn: "Soft and freshly baked", price: "16 lei" },
    { ro: "Croissant cu ciocolată", en: "Chocolate Croissant", noteRo: "Crocant și bogat", noteEn: "Flaky and rich", price: "24 lei" },
    { ro: "Cozonac", en: "Sweet Bread", noteRo: "Felie", noteEn: "Slice", price: "23 lei" },
    { ro: "Pastéis de nata", en: "Pastéis de Nata", noteRo: "Tartă portugheză cu cremă", noteEn: "Portuguese custard tart", price: "12 lei" },
    { ro: "Brioșă cu vișine și ciocolată", en: "Sour Cherry & Chocolate Muffin", noteRo: "Vișine și ciocolată", noteEn: "Sour cherry and chocolate", price: "18 lei" },
  ],
} as const;

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const galleryImages = [
  assetUrl("gallery/latte-art-pour.jpg"),
  assetUrl("gallery/hand-grinder.jpg"),
  assetUrl("gallery/harbor-counter.jpg"),
  assetUrl("gallery/iced-coffee.jpg"),
  assetUrl("gallery/coffee-shelf.jpg"),
  assetUrl("gallery/harbor-decor.jpg"),
  assetUrl("gallery/cold-brew-pour.jpg"),
  assetUrl("gallery/pastry-counter.jpg"),
  assetUrl("gallery/pour-over.jpg"),
  assetUrl("gallery/espresso-machine.jpg"),
  assetUrl("gallery/barista-tamping.jpg"),
  assetUrl("gallery/iced-coffee-overhead.jpg"),
  assetUrl("gallery/socata-croissants.jpg"),
  assetUrl("gallery/mabo-coffee-selection.jpg"),
  assetUrl("gallery/grinder-in-action.jpg"),
  assetUrl("gallery/coffee-distribution.jpg"),
  assetUrl("gallery/espresso-extraction.jpg"),
  assetUrl("gallery/espresso-service.jpg"),
  assetUrl("gallery/espresso-and-croissants.jpg"),
];

const instagramUrl = "https://www.instagram.com/harborcafe.bucuresti/";
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Bulevardul%20Alexandru%20Ioan%20Cuza%2013%2C%20011051%20Bucuresti";
const mapsEmbedUrl = "https://www.google.com/maps?q=Bulevardul%20Alexandru%20Ioan%20Cuza%2013%2C%20011051%20Bucuresti&output=embed";

export default function Home() {
  const [language, setLanguage] = useState<Language>("ro");
  const [category, setCategory] = useState<MenuCategory>("coffee");
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedDetail, setExpandedDetail] = useState<number | null>(null);
  const [hoveredDetail, setHoveredDetail] = useState<number | null>(null);
  const t = copy[language];
  const activeDetail = hoveredDetail ?? expandedDetail;
  const storyDetails = [
    { title: t.detail1, body: t.detailBody1 },
    { title: t.detail2, body: t.detailBody2 },
    { title: t.detail3, body: t.detailBody3 },
  ];
  const navItems = [["story", t.story], ["menu", t.menu], ["visit", t.visit], ["gallery", t.gallery]] as const;
  const changeLanguage = () => setLanguage((current) => (current === "ro" ? "en" : "ro"));

  return (
    <>
      <a className="skip-link" href="#content">{t.skip}</a>
      <header className={`site-header ${menuOpen ? "is-open" : ""}`}>
        <a className="wordmark" href="#top" aria-label={`Harbor Cafe — ${t.home}`} onClick={() => setMenuOpen(false)}>Harbor Cafe</a>
        <nav aria-label={language === "ro" ? "Navigație principală" : "Main navigation"}>
          {navItems.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="language" type="button" onClick={changeLanguage} aria-label={t.switchLanguage}>{language === "ro" ? "EN" : "RO"}</button>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-label={menuOpen ? t.closeMenu : t.openMenu} onClick={() => setMenuOpen((open) => !open)}><span /><span /></button>
        </div>
      </header>

      <main id="content">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p className="intro">{t.intro}</p>
            <a className="primary-action" href="#menu">{t.discover} <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-mark" aria-label="Logo Harbor Cafe">
            <img src={assetUrl("harbor-cafe-logo.png")} alt="Harbor Cafe" /><span className="orbit-copy" aria-hidden="true">COFFEE • SLOW MORNINGS • HARBOR • </span>
          </div>
          <div className="hero-note" aria-label={language === "ro" ? "Atmosfera Harbor Cafe" : "The Harbor Cafe mood"}><span>01</span><p>{t.heroNote}</p></div>
          <a className="scroll-cue" href="#story" aria-label={t.story}><span />SCROLL</a>
        </section>

        <section className="manifesto"><p>{t.manifesto}</p><span>{t.manifestoSmall}</span></section>

        <section className="story-section" id="story">
          <div className="section-kicker"><span>02</span>{t.storyKicker}</div>
          <div className="story-grid">
            <div className="story-heading"><h2>{t.storyTitle}</h2><div className="story-image-wrap"><img src={galleryImages[0]} alt={t.galleryAlts[0]} loading="lazy" /><span className="image-label">Harbor mood / 01</span></div></div>
            <div className="story-copy"><p className="lead">{t.storyBody1}</p><p>{t.storyBody2}</p>
              <div className="story-details">
                {storyDetails.map((detail, index) => {
                  const isActive = activeDetail === index;
                  const panelId = `story-detail-${index}`;
                  return (
                    <article className={`story-detail ${isActive ? "is-expanded" : ""}`} key={detail.title} onPointerEnter={(event) => event.pointerType === "mouse" && setHoveredDetail(index)} onPointerLeave={(event) => event.pointerType === "mouse" && setHoveredDetail(null)}>
                      <button type="button" className="story-detail-trigger" aria-expanded={isActive} aria-controls={panelId} aria-label={`${detail.title}: ${isActive ? t.collapseDetail : t.expandDetail}`} onClick={() => setExpandedDetail((current) => current === index ? null : index)}>
                        <span className="story-detail-number">0{index + 1}</span>
                        <strong>{detail.title}</strong>
                        <span className="story-detail-icon" aria-hidden="true">+</span>
                      </button>
                      <div className="story-detail-panel" id={panelId} aria-hidden={!isActive}>
                        <div className="story-detail-content">
                          <p>{detail.body}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-kicker light"><span>03</span>{t.menuKicker}</div>
          <div className="menu-heading"><div><h2>{t.menuTitle}</h2></div><p>{t.menuIntro}</p></div>
          <div className="menu-tabs" role="tablist" aria-label={t.menuKicker}>
            {(Object.keys(t.categories) as MenuCategory[]).map((key) => <button type="button" key={key} role="tab" aria-selected={category === key} onClick={() => setCategory(key)}>{t.categories[key]}</button>)}
          </div>
          <div className="menu-list" role="tabpanel">
            {menuItems[category].map((item, index) => <article className="menu-item" key={item.ro}><span className="item-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{item[language]}</h3><p>{language === "ro" ? item.noteRo : item.noteEn}</p></div><span className="item-price">{item.price.replace(/ lei$/, "")} RON</span></article>)}
          </div>
        </section>

        <section className="visit-section" id="visit">
          <div className="visit-copy"><div className="section-kicker light"><span>04</span>{t.visitKicker}</div><h2>{t.visitTitle}</h2>
            <div className="visit-details">
              <div className="address-block"><span>{t.addressLabel}</span><address>{t.address}</address><a href={mapsUrl} target="_blank" rel="noreferrer">{t.directions} <span aria-hidden="true">↗</span></a></div>
              <div className="hours-block"><span>{t.hoursLabel}</span><dl>{t.hours.map(([day, time]) => <div key={day}><dt>{day}</dt><dd>{time}</dd></div>)}</dl></div>
            </div>
            <a className="instagram-link" href={instagramUrl} target="_blank" rel="noreferrer" aria-label={`${t.instagram}: @harborcafe.bucuresti`}><span>{t.instagram}</span><strong>@harborcafe.bucuresti</strong><span aria-hidden="true">↗</span></a>
          </div>
          <div className="map-embed"><iframe src={mapsEmbedUrl} title={t.mapTitle} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div>
        </section>

        <section className="gallery-section" id="gallery">
          <div className="section-kicker"><span>05</span>{t.galleryKicker}</div>
          <div className="gallery-heading"><h2>{t.galleryTitle}</h2><p>{t.galleryNote}</p></div>
          <div className="gallery-grid">{galleryImages.map((src, index) => <figure key={src} className={`gallery-item gallery-item-${index + 1}`}><img src={src} alt={t.galleryAlts[index]} loading="lazy" /><figcaption><span>{String(index + 1).padStart(2, "0")}</span> Harbor Cafe</figcaption></figure>)}</div>
        </section>
      </main>

      <footer><div className="footer-brand"><img src={assetUrl("harbor-cafe-logo.png")} alt="" /><div><strong>Harbor Cafe</strong><span>{t.footerLine}</span></div></div><a href="#top" className="back-top" aria-label={t.home}>↑</a><p><a href={instagramUrl} target="_blank" rel="noreferrer">Instagram</a> · {t.footerNote} · {new Date().getFullYear()}</p></footer>
    </>
  );
}
