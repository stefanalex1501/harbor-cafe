"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from "react";
import { animateScrollTo } from "./scroll-motion";
import { MobileSheet } from "./mobile-sheet";

type Language = "ro" | "en";
type MenuCategory = "coffee" | "notCoffee" | "brunch" | "sweet";
type SectionId = "top" | "story" | "menu" | "reviews" | "visit" | "gallery";
type FoodTag = "milk" | "gluten" | "eggs" | "nuts" | "alcoholFree" | "plantOption" | "plantIncluded";

const copy = {
  ro: {
    skip: "Sari la conținut", home: "Acasă", story: "Poveste", menu: "Meniu", reviews: "Recenzii", gallery: "Galerie", visit: "Vizitează-ne",
    openMenu: "Deschide meniul de navigație", closeMenu: "Închide meniul de navigație", switchLanguage: "Switch language to English",
    explore: "Explorează", chooseCategory: "Alege categoria", closePanel: "Închide panoul", changeCategory: "Schimbă categoria",
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
    foodInfo: "Informații alimentare", showFoodInfo: "Vezi informațiile alimentare", hideFoodInfo: "Ascunde informațiile alimentare",
    foodInfoIntro: "Marcajele sunt orientative și se bazează pe rețetele obișnuite. Ingredientele și riscul de contaminare încrucișată pot varia; dacă ai alergii sau intoleranțe, confirmă întotdeauna cu barista înainte de comandă.",
    plantInfo: "Înlocuirea laptelui obișnuit cu lapte vegetal costă +5 RON doar la băuturile marcate cu această opțiune, în funcție de stoc. Matcha Latte și Iced Strawberry Matcha se prepară cu lapte vegetal, deja inclus în preț.",
    plantSurcharge: "+5 RON",
    foodTags: { milk: "Lapte", gluten: "Gluten", eggs: "Ouă", nuts: "Fructe cu coajă", alcoholFree: "Fără alcool", plantOption: "Lapte vegetal", plantIncluded: "Lapte vegetal inclus" },
    itemFoodInfo: "Informații orientative despre ingrediente",
    categories: { coffee: "Cafea", notCoffee: "Rece & bar", brunch: "Ciabatta", sweet: "Deserturi" },
    galleryKicker: "Galerie", galleryTitle: <>Texturi, lumină<br />și cafea bună.</>,
    galleryNote: "O privire în atmosfera Harbor Cafe — lumină caldă, cafea pregătită cu grijă și ceva bun alături.",
    showAllPhotos: "Vezi toate fotografiile", showFewerPhotos: "Arată mai puține", photosLabel: "fotografii",
    backToMenu: "Înapoi la meniu", productsLabel: "produse", today: "Azi",
    closingIn: (minutes: number) => `Închidem în ${minutes} min`,
    reviewsUpdated: "Scor și număr de recenzii introduse pe site la", reviewsSnapshotDate: "3 septembrie 2026", reviewsUpdateNote: "Actualizate manual, nu în timp real.",
    viewPhoto: "Deschide fotografia", lightboxLabel: "Galeria Harbor Cafe", closeGallery: "Închide galeria", previousPhoto: "Fotografia anterioară", nextPhoto: "Fotografia următoare", photoOf: "din",
    reviewsKicker: "Recenzii Google", reviewsTitle: <>Cuvinte lăsate<br />de oaspeții noștri.</>,
    reviewsIntro: "Recenzii publice, păstrate exact în forma în care au fost scrise.", reviewsScore: "4,9 pe Google", reviewsCount: "67 de recenzii", showOtherReviews: "Arată alte recenzii", googleReview: "Recenzie publicată pe Google", ratingLabel: "5 din 5 stele", openReview: "Deschide recenzia", viewAllReviews: "Vezi toate recenziile pe Google Maps",
    galleryAlts: ["Latte art pregătit la Harbor Cafe", "Cafea măcinată manual", "Vitrina Harbor Cafe cu băuturi și gustări", "Cafea rece cu portocală", "Selecție de cafea de specialitate", "Decorul cu influențe nautice Harbor Cafe", "Cold brew turnat peste gheață", "Produse proaspete în vitrina Harbor Cafe", "Cafea preparată prin metoda V60", "Espressorul Harbor Cafe", "Barista tasând cafeaua", "Cafea rece fotografiată de sus", "Socată și croissante pe tejghea", "Selecție de cafea MABÓ și croissante", "Cafea măcinată pentru espresso", "Barista distribuind cafeaua în portafiltru", "Espresso proaspăt extras", "Espresso servit cu apă", "Espresso și croissante pe tejghea"],
    visitKicker: "Găsește-ne", visitTitle: "Ne vedem la Harbor.", addressLabel: "Adresă", address: "Bulevardul Alexandru Ioan Cuza 13, 011051 București",
    hoursLabel: "Program", mapTitle: "Harbor Cafe pe Google Maps", directions: "Deschide în Google Maps", copyAddress: "Copiază adresa", addressCopied: "Adresă copiată", addressCopyFailed: "Selectează adresa", instagram: "Urmărește-ne pe Instagram",
    quickMenu: "Meniu", quickMap: "Hartă", openNow: "Deschis acum", closedNow: "Închis acum", opensAt: "deschide la", until: "până la", checkingHours: "Verificăm programul",
    hours: [["Luni", "07:00–17:00"], ["Marți", "07:00–17:00"], ["Miercuri", "07:00–17:00"], ["Joi", "07:00–17:00"], ["Vineri", "07:00–17:00"], ["Sâmbătă", "08:00–16:00"], ["Duminică", "Închis"]],
    footerLine: "Cafea bună. Ritm domol.", footerNote: "Harbor Cafe · Toate drepturile rezervate",
  },
  en: {
    skip: "Skip to content", home: "Home", story: "Story", menu: "Menu", reviews: "Reviews", gallery: "Gallery", visit: "Visit us",
    openMenu: "Open navigation menu", closeMenu: "Close navigation menu", switchLanguage: "Schimbă limba în română",
    explore: "Explore", chooseCategory: "Choose a category", closePanel: "Close panel", changeCategory: "Change category",
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
    foodInfo: "Food information", showFoodInfo: "View food information", hideFoodInfo: "Hide food information",
    foodInfoIntro: "Markers are a guide based on the usual recipes. Ingredients and cross-contamination risks may vary; if you have allergies or intolerances, always confirm with the barista before ordering.",
    plantInfo: "Replacing regular milk with plant milk costs +5 RON only for drinks marked with this option, subject to availability. Matcha Latte and Iced Strawberry Matcha are made with plant milk, already included in the price.",
    plantSurcharge: "+5 RON",
    foodTags: { milk: "Milk", gluten: "Gluten", eggs: "Eggs", nuts: "Tree nuts", alcoholFree: "Alcohol-free", plantOption: "Plant milk", plantIncluded: "Plant milk included" },
    itemFoodInfo: "Indicative ingredient information",
    categories: { coffee: "Hot coffee", notCoffee: "Cold & bar", brunch: "Ciabatta", sweet: "Sweets" },
    galleryKicker: "Gallery", galleryTitle: <>Texture, light<br />and good coffee.</>,
    galleryNote: "A glimpse into Harbor Cafe — warm light, carefully made coffee, and something good on the side.",
    showAllPhotos: "View all photos", showFewerPhotos: "Show fewer photos", photosLabel: "photos",
    backToMenu: "Back to the menu", productsLabel: "items", today: "Today",
    closingIn: (minutes: number) => `Closing in ${minutes} min`,
    reviewsUpdated: "Rating and review count added to this site on", reviewsSnapshotDate: "3 September 2026", reviewsUpdateNote: "Updated manually, not in real time.",
    viewPhoto: "Open photo", lightboxLabel: "Harbor Cafe gallery", closeGallery: "Close gallery", previousPhoto: "Previous photo", nextPhoto: "Next photo", photoOf: "of",
    reviewsKicker: "Google reviews", reviewsTitle: <>Words from<br />our guests.</>,
    reviewsIntro: "Public reviews, preserved exactly as they were written.", reviewsScore: "4.9 on Google", reviewsCount: "67 reviews", showOtherReviews: "Show other reviews", googleReview: "Review published on Google", ratingLabel: "5 out of 5 stars", openReview: "Open review", viewAllReviews: "View all reviews on Google Maps",
    galleryAlts: ["Latte art being made at Harbor Cafe", "Coffee being ground by hand", "The Harbor Cafe counter with drinks and snacks", "Iced coffee with orange", "A selection of specialty coffee", "Harbor Cafe's nautical interior", "Cold brew poured over ice", "Fresh products at the Harbor Cafe counter", "Coffee brewed with the V60 method", "The Harbor Cafe espresso machine", "A barista tamping coffee", "Iced coffee photographed from above", "Elderflower soda and croissants on the counter", "A MABÓ coffee selection with croissants", "Coffee being ground for espresso", "A barista distributing coffee in a portafilter", "Freshly extracted espresso", "Espresso served with water", "Espresso and croissants on the counter"],
    visitKicker: "Find us", visitTitle: "Meet you at Harbor.", addressLabel: "Address", address: "13 Alexandru Ioan Cuza Boulevard, 011051 Bucharest",
    hoursLabel: "Opening hours", mapTitle: "Harbor Cafe on Google Maps", directions: "Open in Google Maps", copyAddress: "Copy address", addressCopied: "Address copied", addressCopyFailed: "Select the address", instagram: "Follow us on Instagram",
    quickMenu: "Menu", quickMap: "Map", openNow: "Open now", closedNow: "Closed now", opensAt: "opens at", until: "until", checkingHours: "Checking hours",
    hours: [["Monday", "7:00 AM–5:00 PM"], ["Tuesday", "7:00 AM–5:00 PM"], ["Wednesday", "7:00 AM–5:00 PM"], ["Thursday", "7:00 AM–5:00 PM"], ["Friday", "7:00 AM–5:00 PM"], ["Saturday", "8:00 AM–4:00 PM"], ["Sunday", "Closed"]],
    footerLine: "Good coffee. Easy rhythm.", footerNote: "Harbor Cafe · All rights reserved",
  },
} as const;

const menuCategoryKeys: MenuCategory[] = ["coffee", "notCoffee", "brunch", "sweet"];
const galleryPreviewCount = 6;
// Date these figures were introduced in the site, not a live Google verification.
const reviewsSnapshotDate = "2026-09-03";

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

const plantMilkIncludedDrinks = new Set(["Matcha Latte", "Iced Strawberry Matcha"]);

const milkSubstitutionDrinks = new Set([
  "Cortado", "Cappuccino", "Flat White", "Latte", "Ciocolată caldă", "Babyccino",
  "Cold Brew Latte", "Iced Latte",
]);

function getFoodTags(category: MenuCategory, itemName: string): FoodTag[] {
  if (plantMilkIncludedDrinks.has(itemName)) return ["plantIncluded"];
  if (milkSubstitutionDrinks.has(itemName)) return ["milk", "plantOption"];
  if (category === "brunch") return itemName === "Cotto" ? ["gluten", "milk", "nuts"] : ["gluten", "milk"];
  if (category === "sweet") return itemName === "Pricomigdale" ? ["nuts", "eggs"] : ["gluten", "milk", "eggs"];
  if (itemName === "Cocktail F.A.") return ["alcoholFree"];
  return [];
}

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const galleryImageData = [
  { name: "latte-art-pour", width: 982, height: 1600 },
  { name: "hand-grinder", width: 1066, height: 1600 },
  { name: "harbor-counter", width: 1600, height: 986 },
  { name: "iced-coffee", width: 1066, height: 1600 },
  { name: "coffee-shelf", width: 1600, height: 1066 },
  { name: "harbor-decor", width: 1600, height: 1004 },
  { name: "cold-brew-pour", width: 1192, height: 1600 },
  { name: "pastry-counter", width: 1600, height: 1004 },
  { name: "pour-over", width: 946, height: 2048 },
  { name: "espresso-machine", width: 1600, height: 1066 },
  { name: "barista-tamping", width: 1066, height: 1600 },
  { name: "iced-coffee-overhead", width: 1600, height: 1066 },
  { name: "socata-croissants", width: 1600, height: 1066 },
  { name: "mabo-coffee-selection", width: 1600, height: 1066 },
  { name: "grinder-in-action", width: 1066, height: 1600 },
  { name: "coffee-distribution", width: 1600, height: 1066 },
  { name: "espresso-extraction", width: 1066, height: 1600 },
  { name: "espresso-service", width: 1600, height: 1066 },
  { name: "espresso-and-croissants", width: 1600, height: 1066 },
] as const;

const galleryImages = galleryImageData.map(({ name, width, height }) => ({
  src: assetUrl(`gallery/${name}.jpg`),
  srcSet: `${assetUrl(`gallery/${name}-480.jpg`)} 480w, ${assetUrl(`gallery/${name}-900.jpg`)} 900w, ${assetUrl(`gallery/${name}.jpg`)} ${width}w`,
  webpSrcSet: `${assetUrl(`gallery/${name}-480.webp`)} 480w, ${assetUrl(`gallery/${name}-900.webp`)} 900w, ${assetUrl(`gallery/${name}.webp`)} ${width}w`,
  avifSrcSet: `${assetUrl(`gallery/${name}-480.avif`)} 480w, ${assetUrl(`gallery/${name}-900.avif`)} 900w, ${assetUrl(`gallery/${name}.avif`)} ${width}w`,
  width,
  height,
}));

type GalleryPictureProps = {
  image: (typeof galleryImages)[number];
  alt: string;
  sizes: string;
  loading?: "eager" | "lazy";
};

function GalleryPicture({ image, alt, sizes, loading = "lazy" }: GalleryPictureProps) {
  return (
    <picture>
      <source type="image/avif" srcSet={image.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={image.webpSrcSet} sizes={sizes} />
      <img src={image.src} srcSet={image.srcSet} sizes={sizes} width={image.width} height={image.height} alt={alt} loading={loading} decoding="async" />
    </picture>
  );
}

const instagramUrl = "https://www.instagram.com/harborcafe.bucuresti/";
const physicalAddress = "Bulevardul Alexandru Ioan Cuza 13, 011051 București";
const languageStorageKey = "harbor-cafe-language";
const mapsUrl = "https://www.google.com/maps/place/Harbor+Cafe/@44.4489541,26.0806877,19z/data=!4m16!1m9!3m8!1s0x40b201004f4513f3:0xc119237662a4b949!2sHarbor+Cafe!8m2!3d44.4489541!4d26.0813495!9m1!1b1!16s%2Fg%2F11x90nxt_4!3m5!1s0x40b201004f4513f3:0xc119237662a4b949!8m2!3d44.4489541!4d26.0813495!16s%2Fg%2F11x90nxt_4?entry=ttu";
const mapsEmbedUrl = "https://www.google.com/maps?q=Harbor%20Cafe%2C%20Bulevardul%20Alexandru%20Ioan%20Cuza%2013%2C%20Bucuresti&output=embed";
const sectionIds: SectionId[] = ["top", "story", "menu", "reviews", "visit", "gallery"];

let clientLanguage: Language | null = null;
const languageListeners = new Set<() => void>();
const getServerLanguage = (): Language => "ro";
const getClientLanguage = (): Language => {
  if (clientLanguage !== null) return clientLanguage;
  try {
    const savedLanguage = window.localStorage.getItem(languageStorageKey);
    clientLanguage = savedLanguage === "en" ? "en" : "ro";
  } catch {
    clientLanguage = "ro";
  }
  return clientLanguage;
};
const subscribeToLanguage = (listener: () => void) => {
  languageListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== languageStorageKey) return;
    clientLanguage = event.newValue === "en" ? "en" : "ro";
    languageListeners.forEach((languageListener) => languageListener());
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    languageListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
};
const saveLanguage = (language: Language) => {
  clientLanguage = language;
  try {
    window.localStorage.setItem(languageStorageKey, language);
  } catch {
    // The language still changes for this visit if browser storage is unavailable.
  }
  languageListeners.forEach((listener) => listener());
};

const googleReviews = [
  { author: "Miriam 18", quote: "O cafenea super cozy, perfectă pentru relaxare sau stat la povești. Cafeaua e foarte bună, iar personalul e prietenos și atent.", sourceUrl: "https://maps.app.goo.gl/T3QEAoutTwmY8DQp6" },
  { author: "Alexia", quote: "Cappuccino-ul a fost foarte bun, cremos și bine echilibrat. Se simte calitatea cafelei. Atmosferă plăcută și personal amabil. Recomand!", sourceUrl: "https://maps.app.goo.gl/52kMgZSwzGVmD1ZQA" },
  { author: "Ana", quote: "Cafea foarte buna si o atmosfera minunata, cu bancute foarte dragute si o muzica linistitoare. De asemenea, proprietarul a fost foarte amabil…", sourceUrl: "https://maps.app.goo.gl/L6Hohg7Gq4P4Qskm8" },
  { author: "Alex Stefan", quote: "O cafenea primitoare cu atmosferă plăcută și personal prietenos. Cafeaua este aromată și bine preparată, iar deserturile sunt surprinzător de bune.", sourceUrl: "https://maps.app.goo.gl/Kee8xSHKqJg1zTah7" },
  { author: "Anisa Ioana Dogaru", quote: "am băut un matcha și am mâncat un brownie. timpul de așteptare a fost foarte scurt. băutura a fost excelentă la fel și desertul.", sourceUrl: "https://maps.app.goo.gl/QAcQhoQasSwsH5qH6" },
  { author: "Motanul Negru", quote: "Harbor Cafe - locul unde se poate bea cel mai bun espresso din oras, preparat cu precizie stiintifica, rafinat cu o doza mare de atentie…", sourceUrl: mapsUrl },
  { author: "Eduard Tanasescu", quote: "Am avut o experiență excelentă la Harbor Cafe! ☕️ Atmosfera este extrem de plăcută și relaxantă — muzica linistitoare și băncuțele drăguțe…", sourceUrl: mapsUrl },
  { author: "Oana Toma", quote: "Atenție, loc extrem de periculos 🙈intri pentru o cafea bunaaa și ajungi să te îndrăgostești de pricomigdale! Crocante, potrivit de dulci și imposibil de refuzat…", sourceUrl: mapsUrl },
] as const;

type GoogleReview = (typeof googleReviews)[number];
let clientReviewSelection: ReadonlyArray<GoogleReview> | null = null;

function pickRandomReviews(excludedAuthors = new Set<string>()) {
  const availableReviews = googleReviews.filter((review) => !excludedAuthors.has(review.author));
  const shuffled = [...(availableReviews.length >= 3 ? availableReviews : googleReviews)];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled.slice(0, 3);
}

function getClientReviews() {
  if (clientReviewSelection === null) clientReviewSelection = pickRandomReviews();
  return clientReviewSelection;
}

const serverReviewSelection = googleReviews.slice(0, 3);
const getServerReviews = () => serverReviewSelection;
const reviewSelectionListeners = new Set<() => void>();
const subscribeToReviewSelection = (listener: () => void) => {
  reviewSelectionListeners.add(listener);
  return () => reviewSelectionListeners.delete(listener);
};

function showOtherReviewSelection() {
  const currentAuthors = new Set((clientReviewSelection ?? serverReviewSelection).map((review) => review.author));
  clientReviewSelection = pickRandomReviews(currentAuthors);
  reviewSelectionListeners.forEach((listener) => listener());
}

type OpeningStatus = { isOpen: boolean; dayIndex: number; closingInMinutes?: number; nextTime?: string; phase?: "before" | "during" };

const openingHours: Record<string, { opens: number; closes: number }> = {
  Mon: { opens: 7 * 60, closes: 17 * 60 },
  Tue: { opens: 7 * 60, closes: 17 * 60 },
  Wed: { opens: 7 * 60, closes: 17 * 60 },
  Thu: { opens: 7 * 60, closes: 17 * 60 },
  Fri: { opens: 7 * 60, closes: 17 * 60 },
  Sat: { opens: 8 * 60, closes: 16 * 60 },
};

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
}

function getOpeningStatus(now = new Date()): OpeningStatus {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Bucharest",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const dayIndex = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(values.weekday);
  const hours = openingHours[values.weekday];
  if (!hours) return { isOpen: false, dayIndex };

  const currentMinutes = Number(values.hour) * 60 + Number(values.minute);
  if (currentMinutes < hours.opens) return { isOpen: false, dayIndex, phase: "before", nextTime: formatMinutes(hours.opens) };
  if (currentMinutes < hours.closes) {
    const remaining = hours.closes - currentMinutes;
    return { isOpen: true, dayIndex, closingInMinutes: remaining <= 30 ? remaining : undefined, phase: "during", nextTime: formatMinutes(hours.closes) };
  }
  return { isOpen: false, dayIndex };
}

export default function Home() {
  const language = useSyncExternalStore(subscribeToLanguage, getClientLanguage, getServerLanguage);
  const [showBrandIntro, setShowBrandIntro] = useState(true);
  const [category, setCategory] = useState<MenuCategory>("coffee");
  const [displayedCategory, setDisplayedCategory] = useState<MenuCategory>("coffee");
  const [menuLeaving, setMenuLeaving] = useState(false);
  const menuTransitionTimer = useRef<number | null>(null);
  const [mobileSheet, setMobileSheet] = useState<"explore" | "categories" | null>(null);
  const [compactMenu, setCompactMenu] = useState(false);
  const menuTabsRef = useRef<HTMLDivElement>(null);
  const compactCategoryRef = useRef<HTMLButtonElement>(null);
  const menuFromCompactRef = useRef(false);
  const [expandedDetail, setExpandedDetail] = useState<number | null>(null);
  const [hoveredDetail, setHoveredDetail] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("top");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxClosing, setLightboxClosing] = useState(false);
  const lightboxExitTimer = useRef<number | null>(null);
  const desktopNavigationRef = useRef<HTMLElement>(null);
  const scrollTargetRef = useRef<SectionId | null>(null);
  const cancelScrollRef = useRef<(() => void) | null>(null);
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const firstExtraPhotoRef = useRef<HTMLButtonElement>(null);
  const galleryToggleRef = useRef<HTMLButtonElement>(null);
  const galleryCollapsePending = useRef(false);
  const [openingStatus, setOpeningStatus] = useState<OpeningStatus | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [foodInfoOpen, setFoodInfoOpen] = useState(false);
  const visibleReviews = useSyncExternalStore(subscribeToReviewSelection, getClientReviews, getServerReviews);
  const [reviewPhase, setReviewPhase] = useState<"idle" | "leaving" | "entering">("idle");
  const reviewRefreshTimer = useRef<number | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const swipeStartX = useRef<number | null>(null);
  const copyResetTimer = useRef<number | null>(null);
  const menuStartRef = useRef<HTMLDivElement>(null);
  const categoryScrollPending = useRef(false);
  const t = copy[language];
  const openingLabel = !openingStatus ? t.checkingHours : openingStatus.closingInMinutes ? t.closingIn(openingStatus.closingInMinutes) : openingStatus.isOpen ? t.openNow : t.closedNow;
  const visibleGalleryImages = galleryExpanded ? galleryImages : galleryImages.slice(0, galleryPreviewCount);
  const isLightboxOpen = lightboxIndex !== null;
  const activeDetail = hoveredDetail ?? expandedDetail;
  const closeMobileSheet = useCallback(() => setMobileSheet(null), []);
  const openMobileSheet = (sheet: "explore" | "categories") => {
    cancelScrollRef.current?.();
    setMobileSheet(sheet);
  };
  const moveTo = useCallback((getDestination: () => number, section: SectionId) => {
    cancelScrollRef.current?.();
    scrollTargetRef.current = section;
    setActiveSection(section);
    cancelScrollRef.current = animateScrollTo(getDestination, () => {
      scrollTargetRef.current = null;
      // Reconcile the reading position after arrival or a manual interruption.
      window.dispatchEvent(new Event("scroll"));
    });
  }, []);
  useEffect(() => () => cancelScrollRef.current?.(), []);
  const refreshReviews = () => {
    // Ignore repeated clicks until the current transition has finished.
    if (reviewRefreshTimer.current !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showOtherReviewSelection();
      return;
    }
    setReviewPhase("leaving");
    reviewRefreshTimer.current = window.setTimeout(() => {
      showOtherReviewSelection();
      setReviewPhase("entering");
      reviewRefreshTimer.current = window.setTimeout(() => {
        setReviewPhase("idle");
        reviewRefreshTimer.current = null;
      }, 600);
    }, 200);
  };
  useEffect(() => () => {
    if (reviewRefreshTimer.current !== null) window.clearTimeout(reviewRefreshTimer.current);
  }, []);
  useEffect(() => {
    const dismiss = () => setShowBrandIntro(false);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timeout = window.setTimeout(dismiss, reducedMotion.matches ? 0 : 1500);
    // Keep the entrance decorative: any interaction immediately reveals the page.
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    window.addEventListener("touchstart", dismiss, { once: true, passive: true });
    reducedMotion.addEventListener("change", dismiss, { once: true });
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchstart", dismiss);
      reducedMotion.removeEventListener("change", dismiss);
    };
  }, []);
  useEffect(() => {
    if (!galleryExpanded || !firstExtraPhotoRef.current) return;
    const photo = firstExtraPhotoRef.current;
    photo.focus({ preventScroll: true });
    moveTo(() => window.scrollY + photo.getBoundingClientRect().top - 28, "gallery");
  }, [galleryExpanded, moveTo]);
  useLayoutEffect(() => {
    if (galleryExpanded || !galleryCollapsePending.current) return;
    galleryCollapsePending.current = false;
    galleryToggleRef.current?.focus({ preventScroll: true });
    const toggle = galleryToggleRef.current;
    if (toggle) moveTo(() => window.scrollY + toggle.getBoundingClientRect().top - window.innerHeight / 2 + toggle.offsetHeight / 2, "gallery");
  }, [galleryExpanded, moveTo]);
  useLayoutEffect(() => {
    if (!categoryScrollPending.current || !menuStartRef.current) return;
    categoryScrollPending.current = false;
    if (window.matchMedia("(max-width: 760px)").matches) {
      // No page journey when choosing products. A compact selection starts the
      // new list directly below its control, even after a long category.
      if (menuFromCompactRef.current && menuTabsRef.current) {
        // Measure the stable tabs, not the list's animated entrance transform.
        const controlHeight = compactCategoryRef.current?.parentElement?.offsetHeight ?? 64;
        window.scrollTo({ top: window.scrollY + menuTabsRef.current.getBoundingClientRect().bottom - controlHeight, behavior: "instant" });
      }
      menuFromCompactRef.current = false;
      return;
    }
    const menuStart = menuStartRef.current;
    moveTo(() => window.scrollY + menuStart.getBoundingClientRect().top - 12, "menu");
  }, [displayedCategory, moveTo]);
  const selectMenuCategory = (nextCategory: MenuCategory, fromCompact = false) => {
    if (nextCategory === category) return;
    menuFromCompactRef.current = fromCompact;
    setCategory(nextCategory);
    if (menuTransitionTimer.current !== null) window.clearTimeout(menuTransitionTimer.current);
    const swap = () => {
      categoryScrollPending.current = true;
      setDisplayedCategory(nextCategory);
      setMenuLeaving(false);
      menuTransitionTimer.current = null;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) swap();
    else {
      setMenuLeaving(true);
      menuTransitionTimer.current = window.setTimeout(swap, 160);
    }
  };
  const closeLightbox = useCallback(() => {
    if (lightboxExitTimer.current !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLightboxIndex(null);
      return;
    }
    setLightboxClosing(true);
    lightboxExitTimer.current = window.setTimeout(() => {
      setLightboxIndex(null);
      setLightboxClosing(false);
      lightboxExitTimer.current = null;
    }, 220);
  }, []);
  useEffect(() => () => {
    if (menuTransitionTimer.current !== null) window.clearTimeout(menuTransitionTimer.current);
    if (lightboxExitTimer.current !== null) window.clearTimeout(lightboxExitTimer.current);
  }, []);

  useLayoutEffect(() => {
    const navigation = desktopNavigationRef.current;
    if (!navigation) return;
    const updateIndicator = () => {
      const active = navigation.querySelector<HTMLElement>('a[aria-current="location"]');
      if (!active || !active.offsetWidth) return;
      navigation.style.setProperty("--nav-x", `${active.offsetLeft}px`);
      navigation.style.setProperty("--nav-y", `${active.offsetTop}px`);
      navigation.style.setProperty("--nav-width", `${active.offsetWidth}px`);
      navigation.style.setProperty("--nav-height", `${active.offsetHeight}px`);
      navigation.dataset.indicator = "ready";
    };
    updateIndicator();
    const observer = new ResizeObserver(updateIndicator);
    observer.observe(navigation);
    navigation.querySelectorAll("a, button").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [activeSection, language]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !("IntersectionObserver" in window)) return;
    const targets = document.querySelectorAll<HTMLElement>(".section-kicker, .story-heading, .story-copy, .menu-heading, .reviews-heading, .visit-copy > h2, .gallery-heading");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("reveal-pending");
        entry.target.classList.add("reveal-arriving");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    targets.forEach((target) => {
      if (target.getBoundingClientRect().top < window.innerHeight) return;
      target.classList.add("reveal-pending");
      observer.observe(target);
    });
    const revealAll = () => {
      if (!motion.matches) return;
      observer.disconnect();
      targets.forEach((target) => target.classList.remove("reveal-pending", "reveal-arriving"));
    };
    motion.addEventListener("change", revealAll);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", revealAll);
      targets.forEach((target) => target.classList.remove("reveal-pending", "reveal-arriving"));
    };
  }, []);
  const showOpeningHours = () => {
    const hours = document.getElementById("opening-hours");
    if (!hours) return;
    window.history.replaceState(null, "", "#opening-hours");
    hours.focus({ preventScroll: true });
    moveTo(() => window.scrollY + hours.getBoundingClientRect().top - 24, "visit");
  };
  const storyDetails = [
    { title: t.detail1, body: t.detailBody1 },
    { title: t.detail2, body: t.detailBody2 },
    { title: t.detail3, body: t.detailBody3 },
  ];
  const navItems = [["story", t.story], ["menu", t.menu], ["reviews", t.reviews], ["visit", t.visit], ["gallery", t.gallery]] as const;
  const sideNavItems: ReadonlyArray<readonly [SectionId, string]> = [["top", t.home], ...navItems];
  const changeLanguage = () => saveLanguage(language === "ro" ? "en" : "ro");
  const scrollToSection = (event: ReactMouseEvent<HTMLAnchorElement>, id: SectionId) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const section = document.getElementById(id);
    if (!section) return;
    window.history.replaceState(null, "", `#${id}`);
    moveTo(() => id === "top" ? 0 : window.scrollY + section.getBoundingClientRect().top, id);
  };
  const showPreviousPhoto = () => setLightboxIndex((current) => current === null ? null : (current - 1 + galleryImages.length) % galleryImages.length);
  const showNextPhoto = () => setLightboxIndex((current) => current === null ? null : (current + 1) % galleryImages.length);
  const handleMenuTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, currentCategory: MenuCategory) => {
    const currentIndex = menuCategoryKeys.indexOf(currentCategory);
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % menuCategoryKeys.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + menuCategoryKeys.length) % menuCategoryKeys.length;
    if (window.matchMedia("(max-width: 760px)").matches && (event.key === "ArrowDown" || event.key === "ArrowUp")) nextIndex = (currentIndex + 2) % menuCategoryKeys.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = menuCategoryKeys.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    const nextCategory = menuCategoryKeys[nextIndex];
    selectMenuCategory(nextCategory);
    document.getElementById(`menu-tab-${nextCategory}`)?.focus({ preventScroll: true });
  };
  const copyAddressToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(physicalAddress);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
    if (copyResetTimer.current !== null) window.clearTimeout(copyResetTimer.current);
    copyResetTimer.current = window.setTimeout(() => setCopyStatus("idle"), 2400);
  };

  useEffect(() => {
    const updateStatus = () => setOpeningStatus(getOpeningStatus());
    updateStatus();
    const interval = window.setInterval(updateStatus, 60_000);
    document.addEventListener("visibilitychange", updateStatus);
    window.addEventListener("focus", updateStatus);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", updateStatus);
      window.removeEventListener("focus", updateStatus);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations()
        .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
        .then(() => window.caches?.keys())
        .then((cacheNames) => cacheNames && Promise.all(cacheNames.filter((name) => name.startsWith("harbor-cafe-")).map((name) => window.caches.delete(name))))
        .catch(() => undefined);
      return;
    }
    const registerServiceWorker = () => {
      navigator.serviceWorker.register(assetUrl("sw.js")).catch(() => undefined);
    };
    if (document.readyState === "complete") registerServiceWorker();
    else window.addEventListener("load", registerServiceWorker, { once: true });
    return () => window.removeEventListener("load", registerServiceWorker);
  }, []);

  useEffect(() => () => {
    if (copyResetTimer.current !== null) window.clearTimeout(copyResetTimer.current);
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    const updateActiveSection = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        // A clicked destination owns the highlight until its scroll settles.
        if (scrollTargetRef.current !== null) return;
        const readingLine = window.scrollY + window.innerHeight * .5;
        let currentSection: SectionId = "top";
        sectionIds.forEach((id) => {
          const section = document.getElementById(id);
          if (section && section.offsetTop <= readingLine) currentSection = id;
        });
        setActiveSection((current) => current === currentSection ? current : currentSection);
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const tabs = menuTabsRef.current;
        const section = document.getElementById("menu");
        const controlHeight = compactCategoryRef.current?.parentElement?.offsetHeight ?? 64;
        const compact = window.innerWidth <= 760 && !!tabs && !!section && tabs.getBoundingClientRect().bottom <= controlHeight + 1 && section.getBoundingClientRect().bottom > 180;
        setCompactMenu((previous) => previous === compact ? previous : compact);
      });
    };
    update();
    const resize = new ResizeObserver(update);
    const section = document.getElementById("menu");
    if (section) resize.observe(section);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) return;
    cancelScrollRef.current?.();
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lightboxCloseRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") setLightboxIndex((current) => current === null ? null : (current - 1 + galleryImages.length) % galleryImages.length);
      if (event.key === "ArrowRight") setLightboxIndex((current) => current === null ? null : (current + 1) % galleryImages.length);
      if (event.key === "Tab") {
        const dialog = document.querySelector<HTMLElement>(".lightbox");
        const controls = dialog ? Array.from(dialog.querySelectorAll<HTMLButtonElement>("button:not([disabled])")) : [];
        const firstControl = controls[0];
        const lastControl = controls.at(-1);
        if (!firstControl || !lastControl) return;
        if (event.shiftKey && document.activeElement === firstControl) {
          event.preventDefault();
          lastControl.focus();
        } else if (!event.shiftKey && document.activeElement === lastControl) {
          event.preventDefault();
          firstControl.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isLightboxOpen, closeLightbox]);

  return (
    <>
      {showBrandIntro && <div className="brand-intro" aria-hidden="true">
        <div className="brand-intro-content">
          <img className="brand-intro-logo" src={assetUrl("harbor-cafe-round-192.png")} width={128} height={128} alt="" />
          <span className="brand-intro-name">Harbor Cafe</span>
          <span className="brand-intro-line" />
        </div>
      </div>}
      <a className="skip-link" href="#content">{t.skip}</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={`Harbor Cafe — ${t.home}`} onClick={(event) => scrollToSection(event, "top")}>Harbor Cafe</a>
        <nav aria-label={language === "ro" ? "Navigație principală" : "Main navigation"}>
          {navItems.map(([id, label]) => <a key={id} href={`#${id}`} onClick={(event) => scrollToSection(event, id)}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="language" type="button" onClick={changeLanguage} aria-label={t.switchLanguage}>{language === "ro" ? "EN" : "RO"}</button>
        </div>
      </header>

      <nav ref={desktopNavigationRef} className="desktop-navigation" aria-label={language === "ro" ? "Navigație pe secțiuni" : "Section navigation"}>
        <span className="desktop-navigation-indicator" aria-hidden="true" />
        <button type="button" onClick={showOpeningHours} className={`desktop-opening-status ${openingStatus?.isOpen ? "is-open" : "is-closed"}`} aria-live="polite">
          <span className="desktop-status-dot" aria-hidden="true" />
          <span>
            <strong>{openingLabel}</strong>
            {openingStatus?.nextTime && <small>{openingStatus.phase === "during" ? t.until : t.opensAt} {openingStatus.nextTime}</small>}
            <small className="hours-shortcut-label">{t.hoursLabel} ↗</small>
          </span>
        </button>
        {sideNavItems.map(([id, label], index) => (
          <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} onClick={(event) => scrollToSection(event, id)}>
            <span className="desktop-nav-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="desktop-nav-label">{label}</span>
          </a>
        ))}
      </nav>

      <main id="content">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p className="intro">{t.intro}</p>
            <a className="primary-action" href="#menu" onClick={(event) => scrollToSection(event, "menu")}>{t.discover} <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-mark" aria-label="Logo Harbor Cafe">
            <img src={assetUrl("harbor-cafe-logo.png")} alt="Harbor Cafe" /><span className="orbit-copy" aria-hidden="true">COFFEE • SLOW MORNINGS • HARBOR • </span>
          </div>
          <div className="hero-note" aria-label={language === "ro" ? "Atmosfera Harbor Cafe" : "The Harbor Cafe mood"}><span>01</span><p>{t.heroNote}</p></div>
          <a className="scroll-cue" href="#story" aria-label={t.story} onClick={(event) => scrollToSection(event, "story")}><span />SCROLL</a>
        </section>

        <section className="manifesto"><p>{t.manifesto}</p><span>{t.manifestoSmall}</span></section>

        <section className="story-section" id="story">
          <div className="section-kicker"><span>02</span>{t.storyKicker}</div>
          <div className="story-grid">
            <div className="story-heading"><h2>{t.storyTitle}</h2><div className="story-image-wrap"><GalleryPicture image={galleryImages[0]} sizes="(max-width: 760px) 91vw, 40vw" alt={t.galleryAlts[0]} /><span className="image-label">Harbor mood / 01</span></div></div>
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
                        <span className="story-detail-icon expanding-icon" aria-hidden="true" />
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
          <div className="food-information">
            <button type="button" className="food-information-trigger" aria-expanded={foodInfoOpen} aria-controls="food-information-panel" onClick={() => setFoodInfoOpen((open) => !open)}>
              <span>{t.foodInfo}</span><span className="expanding-icon" aria-hidden="true" />
              <small>{foodInfoOpen ? t.hideFoodInfo : t.showFoodInfo}</small>
            </button>
            <div className="food-information-expander" data-open={foodInfoOpen} aria-hidden={!foodInfoOpen} inert={!foodInfoOpen}>
            <div className="food-information-clip">
            <div className="food-information-panel" id="food-information-panel">
              <p>{t.foodInfoIntro}</p>
              <p>{t.plantInfo}</p>
              <ul aria-label={t.foodInfo}>{(Object.keys(t.foodTags) as FoodTag[]).map((tag) => <li className={tag === "plantOption" ? "surcharge-tag" : undefined} key={tag}><span>{t.foodTags[tag]}</span>{tag === "plantOption" && <strong>{t.plantSurcharge}</strong>}</li>)}</ul>
            </div>
            </div>
            </div>
          </div>
          <div ref={menuStartRef} className="menu-category-start" />
          <div ref={menuTabsRef} className="menu-tabs" role="tablist" aria-label={t.menuKicker}>
            {menuCategoryKeys.map((key) => <button type="button" id={`menu-tab-${key}`} key={key} role="tab" aria-label={`${t.categories[key]}, ${menuItems[key].length} ${t.productsLabel}`} aria-selected={category === key} aria-controls="menu-panel" tabIndex={category === key ? 0 : -1} onClick={() => selectMenuCategory(key)} onKeyDown={(event) => handleMenuTabKeyDown(event, key)}><span>{t.categories[key]}</span><span className="menu-category-count" aria-hidden="true">{menuItems[key].length}</span></button>)}
          </div>
          <div className={`mobile-category-bar ${compactMenu ? "is-visible" : ""}`} inert={!compactMenu} aria-hidden={!compactMenu}><button ref={compactCategoryRef} type="button" aria-haspopup="dialog" aria-expanded={mobileSheet === "categories"} onClick={() => openMobileSheet("categories")}><span><small>{t.menuKicker}</small><strong>{t.categories[category]}</strong></span><span className="category-change-label">{t.changeCategory}</span><span aria-hidden="true">⌄</span></button></div>
          <div className={`menu-list ${menuLeaving ? "is-leaving" : ""}`} id="menu-panel" key={displayedCategory} role="tabpanel" aria-busy={menuLeaving} aria-labelledby={`menu-tab-${displayedCategory}`} tabIndex={0}>
            {menuItems[displayedCategory].map((item, index) => {
              const foodTags = getFoodTags(displayedCategory, item.ro);
              return <article className={`menu-item ${item[language].length > 23 ? "has-long-name" : ""}`} key={item.ro}><span className="item-number">{String(index + 1).padStart(2, "0")}</span><div className="menu-item-details"><h3>{item[language]}</h3><p>{language === "ro" ? item.noteRo : item.noteEn}</p>{foodTags.length > 0 && <ul className="item-tags" aria-label={t.itemFoodInfo}>{foodTags.map((tag) => <li className={tag === "plantOption" ? "surcharge-tag" : undefined} key={tag}><span>{t.foodTags[tag]}</span>{tag === "plantOption" && <strong>{t.plantSurcharge}</strong>}</li>)}</ul>}</div><span className="item-price">{`${item.price.replace(/ lei$/, "")} RON`}</span></article>;
            })}
          </div>
        </section>

        <section className="reviews-section" id="reviews" aria-labelledby="reviews-title">
          <div className="section-kicker light"><span>04</span>{t.reviewsKicker}</div>
          <div className="reviews-heading">
            <h2 id="reviews-title">{t.reviewsTitle}</h2>
            <div>
              <a className="reviews-score" href={mapsUrl} target="_blank" rel="noreferrer" aria-label={`${t.reviewsScore}, ${t.reviewsCount}`}>
                <strong>{t.reviewsScore}</strong><span aria-hidden="true">★★★★★</span><small>{t.reviewsCount}</small>
              </a>
              <p className="reviews-update-note">{t.reviewsUpdated} <time dateTime={reviewsSnapshotDate}>{t.reviewsSnapshotDate}</time>. <span>{t.reviewsUpdateNote}</span></p>
              <p>{t.reviewsIntro}</p>
              <a className="reviews-google-link" href={mapsUrl} target="_blank" rel="noreferrer">{t.viewAllReviews} <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="reviews-grid" id="reviews-grid" data-phase={reviewPhase} aria-busy={reviewPhase !== "idle"}>
            {visibleReviews.map((review, index) => <article className="review-card" key={review.author}>
              <div className="review-card-top"><span>0{index + 1}</span><div className="review-stars" aria-label={t.ratingLabel}><span aria-hidden="true">★★★★★</span></div></div>
              <blockquote><p>“{review.quote}”</p></blockquote>
              <cite><span><strong>{review.author}</strong><small>{t.googleReview}</small></span><a href={review.sourceUrl} target="_blank" rel="noreferrer" aria-label={`${t.openReview}: ${review.author}`}>{t.openReview} <span aria-hidden="true">↗</span></a></cite>
            </article>)}
          </div>
          <div className="reviews-footer"><button type="button" onClick={refreshReviews} aria-controls="reviews-grid" aria-disabled={reviewPhase !== "idle"}>{t.showOtherReviews} <span aria-hidden="true">↻</span></button></div>
        </section>

        <section className="visit-section" id="visit">
          <div className="visit-copy"><div className="section-kicker light"><span>05</span>{t.visitKicker}</div><h2>{t.visitTitle}</h2>
            <div className="visit-details">
              <div className="address-block"><span>{t.addressLabel}</span><address>{t.address}</address><div className="address-actions"><a href={mapsUrl} target="_blank" rel="noreferrer">{t.directions} <span aria-hidden="true">↗</span></a><button type="button" className="address-copy" data-status={copyStatus} onClick={copyAddressToClipboard} aria-live="polite"><svg className="copy-feedback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><g className="copy-symbol"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></g><path className="copy-check" d="m5 12 4 4L19 6" /></svg>{copyStatus === "copied" ? t.addressCopied : copyStatus === "failed" ? t.addressCopyFailed : t.copyAddress}</button></div></div>
              <div className="hours-block" id="opening-hours" tabIndex={-1} role="region" aria-label={t.hoursLabel}><span>{t.hoursLabel}</span><dl>{t.hours.map(([day, time], index) => <div key={day} className={openingStatus?.dayIndex === index ? "is-today" : undefined}><dt>{day}{openingStatus?.dayIndex === index && <em className="today-label">{t.today}</em>}</dt><dd>{time}</dd></div>)}</dl></div>
            </div>
            <a className="instagram-link" href={instagramUrl} target="_blank" rel="noreferrer" aria-label={`${t.instagram}: @harborcafe.bucuresti`}><span>{t.instagram}</span><strong>@harborcafe.bucuresti</strong><span aria-hidden="true">↗</span></a>
          </div>
          <div className="map-embed"><iframe src={mapsEmbedUrl} title={t.mapTitle} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div>
        </section>

        <section className="gallery-section" id="gallery">
          <div className="section-kicker"><span>06</span>{t.galleryKicker}</div>
          <div className="gallery-heading"><h2>{t.galleryTitle}</h2><p>{t.galleryNote}</p></div>
          <div className="gallery-grid" id="gallery-grid">{visibleGalleryImages.map((image, index) => <figure key={image.src} className={`gallery-item gallery-item-${index + 1}${index >= galleryPreviewCount ? " gallery-item-added" : ""}`} style={index >= galleryPreviewCount ? { animationDelay: `${Math.min(index - galleryPreviewCount, 3) * 80}ms` } : undefined}><button type="button" ref={index === galleryPreviewCount ? firstExtraPhotoRef : undefined} className="gallery-image-button" aria-label={`${t.viewPhoto}: ${t.galleryAlts[index]}`} aria-haspopup="dialog" onClick={() => setLightboxIndex(index)}><GalleryPicture image={image} sizes="(max-width: 760px) 91vw, 55vw" alt={t.galleryAlts[index]} /></button><figcaption><span>{String(index + 1).padStart(2, "0")}</span> {t.galleryAlts[index]}</figcaption></figure>)}</div>
          <div className="gallery-footer">
            <p role="status">{visibleGalleryImages.length} {t.photoOf} {galleryImages.length} {t.photosLabel}</p>
            <button ref={galleryToggleRef} type="button" aria-controls="gallery-grid" aria-expanded={galleryExpanded} onClick={() => { galleryCollapsePending.current = galleryExpanded; setGalleryExpanded(!galleryExpanded); }}>{galleryExpanded ? t.showFewerPhotos : t.showAllPhotos}<span aria-hidden="true">{galleryExpanded ? "−" : "＋"}</span></button>
          </div>
          <a className="gallery-back-menu" href="#menu" onClick={(event) => scrollToSection(event, "menu")}>{t.backToMenu}<span aria-hidden="true">↑</span></a>
        </section>
      </main>

      <footer><div className="footer-brand"><img src={assetUrl("harbor-cafe-logo.png")} alt="" /><div><strong>Harbor Cafe</strong><span>{t.footerLine}</span></div></div><a href="#top" className="back-top" aria-label={t.home} onClick={(event) => scrollToSection(event, "top")}>↑</a><p><a href={instagramUrl} target="_blank" rel="noreferrer">Instagram</a> · {t.footerNote} · {new Date().getFullYear()}</p></footer>

      <nav className="mobile-quickbar" aria-label={language === "ro" ? "Navigație mobilă" : "Mobile navigation"}>
        <a href="#menu" aria-current={activeSection === "menu" ? "location" : undefined} onClick={(event) => scrollToSection(event, "menu")}><strong>{t.quickMenu}</strong></a>
        <a className="mobile-map-action" href={mapsUrl} target="_blank" rel="noreferrer"><strong>{t.quickMap} <span aria-hidden="true">↗</span></strong><small className={openingStatus?.isOpen ? "is-open" : "is-closed"}>{openingStatus ? openingStatus.isOpen ? t.openNow : t.closedNow : "—"}</small></a>
        <button type="button" aria-haspopup="dialog" aria-expanded={mobileSheet === "explore"} onClick={() => openMobileSheet("explore")}><strong>{t.explore}</strong><span className="explore-symbol" aria-hidden="true"><i /><i /></span></button>
      </nav>

      {mobileSheet && <MobileSheet title={mobileSheet === "explore" ? t.explore : t.chooseCategory} closeLabel={t.closePanel} onClose={closeMobileSheet}>{(dismiss) => mobileSheet === "explore" ? <>
        <nav className="mobile-sheet-links" aria-label={t.explore}>{([["story", t.story], ["reviews", t.reviews], ["gallery", t.gallery], ["visit", t.visit]] as const).map(([id, label], index) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} style={{ animationDelay: `${index * 55 + 70}ms` }} onClick={(event) => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); dismiss(() => { const section = document.getElementById(id); if (section) { window.history.replaceState(null, "", `#${id}`); moveTo(() => window.scrollY + section.getBoundingClientRect().top, id); } }); }}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><span aria-hidden="true">↗</span></a>)}</nav>
        <button className="mobile-sheet-hours" type="button" onClick={() => dismiss(showOpeningHours)}><span><strong>{openingLabel}</strong>{openingStatus?.nextTime && <small>{openingStatus.phase === "during" ? t.until : t.opensAt} {openingStatus.nextTime}</small>}</span><span>{t.hoursLabel} ↗</span></button>
      </> : <div className="mobile-sheet-categories">{menuCategoryKeys.map((key, index) => <button type="button" key={key} aria-pressed={category === key} style={{ animationDelay: `${index * 55 + 70}ms` }} onClick={() => dismiss(() => selectMenuCategory(key, true))}><span><strong>{t.categories[key]}</strong><small>{menuItems[key].length} {t.productsLabel}</small></span><span aria-hidden="true">{category === key ? "✓" : "↗"}</span></button>)}</div>}</MobileSheet>}

      {lightboxIndex !== null && <div className={`lightbox ${lightboxClosing ? "is-closing" : ""}`} role="dialog" aria-modal="true" aria-label={t.lightboxLabel}>
        <button ref={lightboxCloseRef} type="button" className="lightbox-close" aria-label={t.closeGallery} onClick={closeLightbox}>×</button>
        <button type="button" className="lightbox-nav lightbox-previous" aria-label={t.previousPhoto} onClick={showPreviousPhoto}>←</button>
        <figure className="lightbox-content" onPointerDown={(event) => { if (event.pointerType === "touch") swipeStartX.current = event.clientX; }} onPointerUp={(event) => {
          if (event.pointerType !== "touch" || swipeStartX.current === null) return;
          const distance = swipeStartX.current - event.clientX;
          swipeStartX.current = null;
          if (Math.abs(distance) < 45) return;
          if (distance > 0) showNextPhoto(); else showPreviousPhoto();
        }} onPointerCancel={() => { swipeStartX.current = null; }}>
          <div className="lightbox-media">
            <GalleryPicture image={galleryImages[lightboxIndex]} sizes="100vw" alt={t.galleryAlts[lightboxIndex]} loading="eager" />
          </div>
          <figcaption><span>{String(lightboxIndex + 1).padStart(2, "0")} {t.photoOf} {galleryImages.length}</span><span>{t.galleryAlts[lightboxIndex]}</span></figcaption>
        </figure>
        <button type="button" className="lightbox-nav lightbox-next" aria-label={t.nextPhoto} onClick={showNextPhoto}>→</button>
      </div>}
    </>
  );
}
