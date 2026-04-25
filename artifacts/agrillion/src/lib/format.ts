const NGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});
const NGN_DEC = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const NUM = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 });
const NUM2 = new Intl.NumberFormat("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function naira(n: number | string | null | undefined, dec = false): string {
  const v = typeof n === "string" ? Number(n) : (n ?? 0);
  return dec ? NGN_DEC.format(v) : NGN.format(v);
}

export function units(n: number | string | null | undefined): string {
  const v = typeof n === "string" ? Number(n) : (n ?? 0);
  return `${NUM2.format(v)} SU`;
}

export function num(n: number | string | null | undefined): string {
  const v = typeof n === "string" ? Number(n) : (n ?? 0);
  return NUM.format(v);
}

export function relativeDate(iso: string): string {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export function fullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function dateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

export const NIGERIA_STATES_LGAS: Record<string, string[]> = {
  Lagos: ["Ikeja", "Lekki", "Yaba", "Surulere", "Victoria Island", "Apapa", "Ikoyi", "Mushin"],
  FCT: ["Gwagwalada", "Kuje", "Bwari", "Kwali", "Abaji", "Municipal"],
  Rivers: ["Port Harcourt", "Obio-Akpor", "Eleme", "Ikwerre"],
  Kano: ["Nassarawa", "Fagge", "Dala", "Tarauni", "Gwale"],
  Oyo: ["Ibadan North", "Egbeda", "Lagelu", "Akinyele"],
  Kaduna: ["Kaduna North", "Kaduna South", "Chikun", "Igabi"],
  Enugu: ["Enugu East", "Enugu North", "Nsukka"],
  Anambra: ["Awka South", "Onitsha North", "Idemili North"],
  "Cross River": ["Calabar Municipal", "Calabar South", "Akpabuyo"],
  Edo: ["Oredo", "Ikpoba-Okha", "Egor"],
  Ogun: ["Abeokuta South", "Ijebu Ode", "Sagamu", "Ifo"],
  Ondo: ["Akure South", "Owo", "Ondo West"],
  Plateau: ["Jos North", "Jos South", "Bukuru"],
  Borno: ["Maiduguri", "Jere"],
  Sokoto: ["Sokoto North", "Sokoto South", "Wamako"],
};
