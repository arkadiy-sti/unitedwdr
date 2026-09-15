export const businessConfig = {
  name: "UNITED WATER DAMAGE RESTORATION", shortName: "UNITED", phoneDisplay: "(408) 385-4892", phoneHref: "+14083854892",
  email: "info@unitedwdr.com", address: { street: "3310 Victor Ct", city: "Santa Clara", region: "CA", postalCode: "95054", country: "US" },
  canonicalOrigin: "https://www.unitedwdr.com", emergencySupport24x7: true,
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? "",
  serviceLabel: () => businessConfig.emergencySupport24x7 ? "24/7 Emergency Response" : "Emergency Water Damage Response"
} as const;
