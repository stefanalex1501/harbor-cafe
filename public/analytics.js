(() => {
  // Measure only the public website, never local previews or test builds.
  if (window.location.protocol !== "https:" ||
      !["harborcafe.ro", "www.harborcafe.ro"].includes(window.location.hostname)) return;
  if (document.querySelector('script[src^="https://static.cloudflareinsights.com/beacon.min.js"]')) return;

  const beacon = document.createElement("script");
  beacon.type = "module";
  beacon.src = "https://static.cloudflareinsights.com/beacon.min.js";
  // This is a public site identifier, not a Cloudflare account/API credential.
  // Section anchors are not separate pages: do not count smooth-scroll
  // navigation as additional page views.
  beacon.dataset.cfBeacon = JSON.stringify({
    token: "eb225d3fa9164ca89c18e4958a79494e",
    spa: false,
  });
  document.body.appendChild(beacon);
})();
