"use client";

import { useState } from "react";

type Language = "ro" | "en";
type MenuCategory = "coffee" | "notCoffee" | "brunch" | "sweet";

const copy = {
  ro: {
    skip: "Sari la conținut", home: "Acasă", story: "Poveste", menu: "Meniu", gallery: "Galerie", visit: "Vizitează-ne",
    openMenu: "Deschide meniul de navigație", closeMenu: "Închide meniul de navigație", switchLanguage: "Switch language to English",
    eyebrow: "Cafea bună. Ritm domol.", title: <>Un mic refugiu<br />la malul orașului.</>,
    intro: "Cafea de specialitate, gusturi simple și acel sentiment că ai ajuns exact unde trebuie.", discover: "Descoperă meniul",
    heroNote: <>Dimineți tihnite.<br />Cafea făcută cu grijă.</>, manifesto: "Din prima ceașcă până la ultima poveste a zilei.",
    manifestoSmall: "Harbor Cafe · pauza ta de zi cu zi", storyKicker: "Povestea noastră", storyTitle: <>Un loc în care timpul<br />curge puțin mai încet.</>,
    storyBody1: "Harbor Cafe s-a născut din plăcerea lucrurilor făcute cu grijă: o cafea echilibrată, un colț luminos și conversații care nu se grăbesc nicăieri.",
    storyBody2: "Am imaginat un spațiu cald și familiar, cu energia unui port liniștit — un punct de întâlnire în care revii pentru gust, dar rămâi pentru atmosferă.",
    detail1: "Boabe alese", detail2: "Preparare atentă", detail3: "Momente tihnite", menuKicker: "Meniul Harbor", menuTitle: "Simplu. Bun. Memorabil.",
    menuIntro: "O selecție orientativă pentru prima versiune. Vom înlocui produsele și vom adăuga prețurile imediat ce meniul final este gata.",
    sample: "Meniu demonstrativ", priceSoon: "preț în curând", categories: { coffee: "Cafea", notCoffee: "Altceva bun", brunch: "Mic dejun", sweet: "Ceva dulce" },
    galleryKicker: "Galerie", galleryTitle: <>Texturi, lumină<br />și cafea bună.</>,
    galleryNote: "O privire în atmosfera Harbor Cafe — lumină caldă, cafea pregătită cu grijă și ceva bun alături.",
    galleryAlts: ["Vitrina cu produse Harbor Cafe", "Barista Harbor Cafe pregătind cafeaua", "Espresso curgând într-o ceașcă", "Espresso servit alături de croissante"],
    visitKicker: "Găsește-ne", visitTitle: "Ne vedem la Harbor.", addressLabel: "Adresă", address: "Adresa va fi anunțată în curând",
    hoursLabel: "Program", hours: "Programul va fi anunțat în curând", mapReady: "Harta este pregătită", mapNote: "O activăm imediat ce avem adresa finală.",
    footerLine: "Cafea bună. Ritm domol.", footerNote: "Harbor Cafe · Toate drepturile rezervate",
  },
  en: {
    skip: "Skip to content", home: "Home", story: "Story", menu: "Menu", gallery: "Gallery", visit: "Visit us",
    openMenu: "Open navigation menu", closeMenu: "Close navigation menu", switchLanguage: "Schimbă limba în română",
    eyebrow: "Good coffee. Easy rhythm.", title: <>A little refuge<br />by the city shore.</>,
    intro: "Specialty coffee, simple flavors, and that feeling of arriving exactly where you need to be.", discover: "Explore the menu",
    heroNote: <>Slow mornings.<br />Coffee made with care.</>, manifesto: "From the first cup to the last story of the day.",
    manifestoSmall: "Harbor Cafe · your daily pause", storyKicker: "Our story", storyTitle: <>A place where time<br />moves a little slower.</>,
    storyBody1: "Harbor Cafe grew from the joy of things made with care: balanced coffee, a bright corner, and conversations in no hurry to end.",
    storyBody2: "We imagined a warm, familiar space with the energy of a quiet harbor — a meeting point you return to for the taste and stay for the feeling.",
    detail1: "Selected beans", detail2: "Careful brewing", detail3: "Unhurried moments", menuKicker: "The Harbor menu", menuTitle: "Simple. Good. Memorable.",
    menuIntro: "A sample selection for this first version. We will replace the products and add prices as soon as the final menu is ready.",
    sample: "Sample menu", priceSoon: "price coming soon", categories: { coffee: "Coffee", notCoffee: "More to sip", brunch: "Breakfast", sweet: "Something sweet" },
    galleryKicker: "Gallery", galleryTitle: <>Texture, light<br />and good coffee.</>,
    galleryNote: "A glimpse into Harbor Cafe — warm light, carefully made coffee, and something good on the side.",
    galleryAlts: ["The Harbor Cafe counter", "Harbor Cafe barista preparing coffee", "Espresso pouring into a cup", "Espresso served with croissants"],
    visitKicker: "Find us", visitTitle: "Meet you at Harbor.", addressLabel: "Address", address: "Address to be announced soon",
    hoursLabel: "Opening hours", hours: "Opening hours to be announced soon", mapReady: "The map is ready", mapNote: "We will activate it as soon as the final address is available.",
    footerLine: "Good coffee. Easy rhythm.", footerNote: "Harbor Cafe · All rights reserved",
  },
} as const;

const menuItems = {
  coffee: [
    { ro: "Espresso", en: "Espresso", noteRo: "Scurt, intens, echilibrat", noteEn: "Short, intense, balanced" },
    { ro: "Americano", en: "Americano", noteRo: "Espresso și apă fierbinte", noteEn: "Espresso and hot water" },
    { ro: "Cappuccino", en: "Cappuccino", noteRo: "Espresso, lapte și spumă fină", noteEn: "Espresso, milk and silky foam" },
    { ro: "Flat White", en: "Flat White", noteRo: "Dublu espresso și lapte texturat", noteEn: "Double espresso and textured milk" },
  ],
  notCoffee: [
    { ro: "Matcha Latte", en: "Matcha Latte", noteRo: "Matcha ceremonială și lapte", noteEn: "Ceremonial matcha and milk" },
    { ro: "Chai Latte", en: "Chai Latte", noteRo: "Condimente calde și lapte", noteEn: "Warm spices and milk" },
    { ro: "Ciocolată caldă", en: "Hot Chocolate", noteRo: "Cremoasă și intensă", noteEn: "Rich and creamy" },
    { ro: "Limonadă", en: "Lemonade", noteRo: "Proaspătă, simplă, răcoritoare", noteEn: "Fresh, simple, refreshing" },
  ],
  brunch: [
    { ro: "Croissant cu unt", en: "Butter Croissant", noteRo: "Crocant la exterior, pufos înăuntru", noteEn: "Crisp outside, soft inside" },
    { ro: "Toast Harbor", en: "Harbor Toast", noteRo: "O combinație de sezon", noteEn: "A seasonal combination" },
    { ro: "Granola Bowl", en: "Granola Bowl", noteRo: "Iaurt, granola și fructe", noteEn: "Yogurt, granola and fruit" },
    { ro: "Sandwichul zilei", en: "Sandwich of the Day", noteRo: "Pregătit proaspăt, în fiecare zi", noteEn: "Made fresh, every day" },
  ],
  sweet: [
    { ro: "Rulou cu scorțișoară", en: "Cinnamon Roll", noteRo: "Moale, aromat și glazurat", noteEn: "Soft, fragrant and glazed" },
    { ro: "Banana Bread", en: "Banana Bread", noteRo: "Fraged și reconfortant", noteEn: "Tender and comforting" },
    { ro: "Cheesecake", en: "Cheesecake", noteRo: "Cremos, cu un twist de sezon", noteEn: "Creamy, with a seasonal twist" },
    { ro: "Prăjitura zilei", en: "Cake of the Day", noteRo: "Întreabă-ne ce am copt azi", noteEn: "See what we baked today" },
  ],
} as const;

const galleryImages = [
  "/gallery/cafe-counter.jpg",
  "/gallery/barista-preparing-coffee.jpg",
  "/gallery/espresso-pour.jpg",
  "/gallery/coffee-and-croissants.jpg",
];

export default function Home() {
  const [language, setLanguage] = useState<Language>("ro");
  const [category, setCategory] = useState<MenuCategory>("coffee");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = copy[language];
  const navItems = [["story", t.story], ["menu", t.menu], ["gallery", t.gallery], ["visit", t.visit]] as const;
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
            <img src="/harbor-cafe-logo.png" alt="Harbor Cafe" /><span className="orbit-copy" aria-hidden="true">COFFEE • SLOW MORNINGS • HARBOR • </span>
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
              <div className="story-details">{[t.detail1, t.detail2, t.detail3].map((detail, index) => <div key={detail}><span>0{index + 1}</span>{detail}</div>)}</div>
            </div>
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-kicker light"><span>03</span>{t.menuKicker}</div>
          <div className="menu-heading"><div><span className="sample-badge">{t.sample}</span><h2>{t.menuTitle}</h2></div><p>{t.menuIntro}</p></div>
          <div className="menu-tabs" role="tablist" aria-label={t.menuKicker}>
            {(Object.keys(t.categories) as MenuCategory[]).map((key) => <button type="button" key={key} role="tab" aria-selected={category === key} onClick={() => setCategory(key)}>{t.categories[key]}</button>)}
          </div>
          <div className="menu-list" role="tabpanel">
            {menuItems[category].map((item, index) => <article className="menu-item" key={item.ro}><span className="item-number">0{index + 1}</span><div><h3>{item[language]}</h3><p>{language === "ro" ? item.noteRo : item.noteEn}</p></div><span className="item-price">{t.priceSoon}</span></article>)}
          </div>
        </section>

        <section className="gallery-section" id="gallery">
          <div className="section-kicker"><span>04</span>{t.galleryKicker}</div>
          <div className="gallery-heading"><h2>{t.galleryTitle}</h2><p>{t.galleryNote}</p></div>
          <div className="gallery-grid">{galleryImages.map((src, index) => <figure key={src} className={`gallery-item gallery-item-${index + 1}`}><img src={src} alt={t.galleryAlts[index]} loading="lazy" /><figcaption><span>0{index + 1}</span> Harbor Cafe</figcaption></figure>)}</div>
        </section>

        <section className="visit-section" id="visit">
          <div className="visit-copy"><div className="section-kicker light"><span>05</span>{t.visitKicker}</div><h2>{t.visitTitle}</h2>
            <div className="visit-details"><div><span>{t.addressLabel}</span><p>{t.address}</p></div><div><span>{t.hoursLabel}</span><p>{t.hours}</p></div></div>
          </div>
          <div className="map-placeholder" aria-label={`${t.mapReady}. ${t.mapNote}`}><div className="map-water" /><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" /><div className="map-pin"><span>HC</span></div><div className="map-message"><strong>{t.mapReady}</strong><span>{t.mapNote}</span></div></div>
        </section>
      </main>

      <footer><div className="footer-brand"><img src="/harbor-cafe-logo.png" alt="" /><div><strong>Harbor Cafe</strong><span>{t.footerLine}</span></div></div><a href="#top" className="back-top" aria-label={t.home}>↑</a><p>{t.footerNote} · {new Date().getFullYear()}</p></footer>
    </>
  );
}
