// Manual snapshot checked on Harbor Cafe's Google Maps profile.
// Update these three values together only after checking the source again.
export const googleReviewSummary = {
  rating: 4.9,
  reviewCount: 68,
  verifiedAt: "2026-10-08",
  sourceUrl: "https://www.google.com/maps/place/Harbor+Cafe/@44.4489541,26.0806877,19z/data=!4m16!1m9!3m8!1s0x40b201004f4513f3:0xc119237662a4b949!2sHarbor+Cafe!8m2!3d44.4489541!4d26.0813495!9m1!1b1!16s%2Fg%2F11x90nxt_4!3m5!1s0x40b201004f4513f3:0xc119237662a4b949!8m2!3d44.4489541!4d26.0813495!16s%2Fg%2F11x90nxt_4?entry=ttu",
} as const;

export function formatReviewSummary(language: "ro" | "en") {
  const locale = language === "ro" ? "ro-RO" : "en-GB";
  const rating = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(googleReviewSummary.rating);
  const date = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${googleReviewSummary.verifiedAt}T12:00:00Z`));
  return {
    score: `${rating} ${language === "ro" ? "pe Google" : "on Google"}`,
    count: `${googleReviewSummary.reviewCount} ${language === "ro" ? "de recenzii" : "reviews"}`,
    date,
  };
}
