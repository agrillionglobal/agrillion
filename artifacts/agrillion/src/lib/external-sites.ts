export const EXTERNAL_SITES = {
  smart: {
    name: "Agrillion Smart Shares",
    url: "https://agrillionsmartshare.store",
    description:
      "Detailed catalogue, pricing tables and earning calculator for every utility service — airtime, data, cable, electricity and home internet.",
    short: "agrillionsmartshare.store",
  },
  mart: {
    name: "Agrillion Mart",
    url: "https://agrillionmart.store",
    description:
      "Full storefront for Nigerian-grown food, farm inputs and equipment — with product specs, sourcing notes and member pricing.",
    short: "agrillionmart.store",
  },
  tech: {
    name: "Agrillion Smart Tech & Projects",
    url: "https://agrillionsmarttech.store",
    description:
      "Comprehensive listing of every Agrillion-backed agro-project, milestone tracker and impact dashboard.",
    short: "agrillionsmarttech.store",
  },
} as const;

export type ExternalKey = keyof typeof EXTERNAL_SITES;

export function externalUrl(key: ExternalKey, path = "") {
  const base = EXTERNAL_SITES[key].url;
  if (!path) return base;
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
