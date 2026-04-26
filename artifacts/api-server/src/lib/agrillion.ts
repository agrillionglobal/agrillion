import { db } from "@workspace/db";
import {
  members,
  wallets,
  sessions,
  utilityTransactions,
  smartUnitsLedger,
  martProducts,
  martOrders,
  projects,
  notifications,
  adminSettings,
} from "@workspace/db";
import { eq, desc, sql, isNull } from "drizzle-orm";
import { logger } from "./logger";
import { hashPassword } from "./password";

async function ensureDemoPasswords(): Promise<void> {
  const missing = await db
    .select({ id: members.id })
    .from(members)
    .where(isNull(members.passwordHash));
  if (missing.length === 0) return;
  const hash = await hashPassword("demo1234");
  for (const m of missing) {
    await db.update(members).set({ passwordHash: hash }).where(eq(members.id, m.id));
  }
  logger.info({ count: missing.length }, "Backfilled demo password hashes");
}

const STATES = [
  { state: "Lagos", code: "LA", lgas: ["Ikeja", "Lekki", "Yaba", "Surulere"] },
  { state: "FCT", code: "FCT", lgas: ["Gwagwalada", "Kuje", "Bwari"] },
  { state: "Rivers", code: "RV", lgas: ["Port Harcourt", "Obio-Akpor"] },
  { state: "Kano", code: "KN", lgas: ["Nassarawa", "Fagge"] },
  { state: "Oyo", code: "OY", lgas: ["Ibadan North", "Egbeda"] },
];

export function makeMembershipId(prefix: "AGP" | "AGC", stateCode: string, lgaCode: string, n: number): string {
  return `${prefix}-${stateCode}-${lgaCode}-${String(n).padStart(6, "0")}`;
}

export function genReference(prefix = "AGR"): string {
  const s = Math.random().toString(36).slice(2, 8).toUpperCase();
  const t = Date.now().toString(36).toUpperCase().slice(-6);
  return `${prefix}-${t}-${s}`;
}

const MARGIN_RATES: Record<string, number> = {
  airtime: 0.03,
  data: 0.05,
  cable: 0.04,
  electricity: 0.025,
  internet: 0.04,
};

export function marginForCategory(category: string): number {
  return MARGIN_RATES[category] ?? 0.03;
}

export const UTILITY_SERVICES = [
  {
    id: "svc-airtime",
    category: "airtime",
    name: "Airtime",
    providers: [
      { code: "MTN", name: "MTN Nigeria", logoColor: "#FFCC00" },
      { code: "AIR", name: "Airtel", logoColor: "#E60000" },
      { code: "GLO", name: "Glo Mobile", logoColor: "#00A859" },
      { code: "9MB", name: "9mobile", logoColor: "#0E8C3A" },
    ],
    marginRate: MARGIN_RATES.airtime,
  },
  {
    id: "svc-data",
    category: "data",
    name: "Data Bundle",
    providers: [
      { code: "MTN", name: "MTN Data", logoColor: "#FFCC00" },
      { code: "AIR", name: "Airtel Data", logoColor: "#E60000" },
      { code: "GLO", name: "Glo Data", logoColor: "#00A859" },
      { code: "9MB", name: "9mobile Data", logoColor: "#0E8C3A" },
    ],
    marginRate: MARGIN_RATES.data,
  },
  {
    id: "svc-cable",
    category: "cable",
    name: "Cable TV",
    providers: [
      { code: "DSTV", name: "DStv", logoColor: "#0066B3" },
      { code: "GOTV", name: "GOtv", logoColor: "#00A859" },
      { code: "STAR", name: "Startimes", logoColor: "#E30613" },
    ],
    marginRate: MARGIN_RATES.cable,
  },
  {
    id: "svc-electricity",
    category: "electricity",
    name: "Electricity",
    providers: [
      { code: "EKEDC", name: "Eko Electric", logoColor: "#1E90C0" },
      { code: "IKEDC", name: "Ikeja Electric", logoColor: "#E30613" },
      { code: "AEDC", name: "Abuja Electric", logoColor: "#0E8C3A" },
      { code: "PHED", name: "PH Electric", logoColor: "#FF7300" },
    ],
    marginRate: MARGIN_RATES.electricity,
  },
  {
    id: "svc-internet",
    category: "internet",
    name: "Internet",
    providers: [
      { code: "SPECTRANET", name: "Spectranet", logoColor: "#FF6600" },
      { code: "SMILE", name: "Smile", logoColor: "#FFD400" },
      { code: "FIBER", name: "ipNX Fiber", logoColor: "#1E5BC6" },
    ],
    marginRate: MARGIN_RATES.internet,
  },
];

export async function ensureDemoSeed() {
  const existing = await db.select({ id: members.id }).from(members).limit(1);
  if (existing.length > 0) {
    await ensureDemoPasswords();
    return;
  }
  logger.info("Seeding Agrillion demo data...");

  // Settings
  await db.insert(adminSettings).values({ id: 1 }).onConflictDoNothing();

  // Demo password (same for all seeded members): "demo1234"
  const demoHash = await hashPassword("demo1234");

  // Members
  const memberRows = await db
    .insert(members)
    .values([
      {
        membershipId: makeMembershipId("AGP", "LA", "IKE", 245),
        fullName: "Adaeze Okoye",
        email: "ada@agrillion.ng",
        phone: "+2348031234567",
        state: "Lagos",
        lga: "Ikeja",
        tier: "premier",
        passwordHash: demoHash,
      },
      {
        membershipId: makeMembershipId("AGC", "FCT", "GWA", 11),
        fullName: "Tunde Bakare",
        email: "tunde@agrillion.ng",
        phone: "+2347061122334",
        state: "FCT",
        lga: "Gwagwalada",
        tier: "member",
        passwordHash: demoHash,
      },
      {
        membershipId: makeMembershipId("AGP", "RV", "PHC", 87),
        fullName: "Ifeoma Eze",
        email: "ifeoma@agrillion.ng",
        phone: "+2349025556677",
        state: "Rivers",
        lga: "Port Harcourt",
        tier: "partner",
        passwordHash: demoHash,
      },
    ])
    .returning();

  // Wallets
  const cashBalances = ["48500.00", "12300.50", "215000.00"];
  const smartBalances = ["8420.00", "1340.50", "27600.00"];
  const pendingBalances = ["120.00", "0.00", "560.00"];
  await db.insert(wallets).values(
    memberRows.map((m: typeof members.$inferSelect, i: number) => ({
      memberId: m.id,
      cashBalance: cashBalances[i]!,
      smartUnits: smartBalances[i]!,
      pendingUnits: pendingBalances[i]!,
    })),
  );

  const primary = memberRows[0]!;

  // Utility transactions for primary member
  const now = Date.now();
  const utilityRows: (typeof utilityTransactions.$inferInsert)[] = [];
  const ledgerRows: (typeof smartUnitsLedger.$inferInsert)[] = [];
  let runningBalance = 8420;

  const samples = [
    { cat: "airtime", prov: "MTN", ben: "+2348031234567", amt: 1000 },
    { cat: "data", prov: "AIR", ben: "+2348031234567", amt: 2500 },
    { cat: "cable", prov: "DSTV", ben: "1023456789", amt: 8500 },
    { cat: "electricity", prov: "EKEDC", ben: "62110987654", amt: 5000 },
    { cat: "internet", prov: "SPECTRANET", ben: "SPN-29918", amt: 15000 },
    { cat: "airtime", prov: "GLO", ben: "+2348100992211", amt: 500 },
    { cat: "data", prov: "MTN", ben: "+2348031234567", amt: 3000 },
    { cat: "cable", prov: "GOTV", ben: "2017788991", amt: 3600 },
    { cat: "electricity", prov: "IKEDC", ben: "31900882211", amt: 7500 },
    { cat: "airtime", prov: "AIR", ben: "+2348022003344", amt: 2000 },
    { cat: "data", prov: "9MB", ben: "+2349001112233", amt: 1200 },
    { cat: "cable", prov: "STAR", ben: "9981122003", amt: 2400 },
    { cat: "electricity", prov: "AEDC", ben: "44551122003", amt: 6000 },
    { cat: "internet", prov: "SMILE", ben: "SML-77231", amt: 9000 },
    { cat: "airtime", prov: "MTN", ben: "+2348031234567", amt: 1500 },
    { cat: "data", prov: "AIR", ben: "+2348031234567", amt: 4500 },
    { cat: "cable", prov: "DSTV", ben: "1023456789", amt: 12500 },
    { cat: "electricity", prov: "EKEDC", ben: "62110987654", amt: 8000 },
    { cat: "airtime", prov: "MTN", ben: "+2348031234567", amt: 2000 },
    { cat: "data", prov: "GLO", ben: "+2348100992211", amt: 1500 },
  ];

  samples.forEach((s, i) => {
    const margin = +(s.amt * marginForCategory(s.cat)).toFixed(2);
    const units = +(margin * 0.6).toFixed(2);
    const ref = genReference("UTL");
    const created = new Date(now - (samples.length - i) * 1000 * 60 * 60 * 18);
    utilityRows.push({
      memberId: primary.id,
      serviceCategory: s.cat,
      provider: s.prov,
      beneficiary: s.ben,
      amount: s.amt.toFixed(2),
      marginGenerated: margin.toFixed(2),
      unitsEarned: units.toFixed(2),
      status: "success",
      reference: ref,
      createdAt: created,
    });
    runningBalance += units;
    ledgerRows.push({
      memberId: primary.id,
      sourceType: "utility",
      referenceId: ref,
      unitsAdded: units.toFixed(2),
      unitsUsed: "0",
      balanceAfter: runningBalance.toFixed(2),
      description: `Earned from ${s.prov} ${s.cat} payment`,
      createdAt: created,
    });
  });

  await db.insert(utilityTransactions).values(utilityRows);
  await db.insert(smartUnitsLedger).values(ledgerRows);

  // Mart products
  const productRows = await db
    .insert(martProducts)
    .values([
      {
        name: "Premium Ofada Rice 5kg",
        description: "Stone-free locally milled Ofada rice from Ogun State.",
        category: "Grains",
        priceNgn: "12500.00",
        priceUnits: "1250.00",
        imageUrl: "/mart/ofada-rice.jpg",
        stock: 120,
        rating: "4.80",
        seller: "Ogun Mills Co-op",
      },
      {
        name: "Cold-Pressed Palm Oil 5L",
        description: "Pure red palm oil cold-pressed from Cross River groves.",
        category: "Oils",
        priceNgn: "18500.00",
        priceUnits: "1850.00",
        imageUrl: "/mart/palm-oil.jpg",
        stock: 60,
        rating: "4.90",
        seller: "Cross River Estates",
      },
      {
        name: "Garri Ijebu 10kg",
        description: "Crispy white garri sun-dried in Ijebu.",
        category: "Grains",
        priceNgn: "9800.00",
        priceUnits: "980.00",
        imageUrl: "/mart/garri.jpg",
        stock: 200,
        rating: "4.60",
        seller: "Ijebu Farmers Union",
      },
      {
        name: "Free-Range Chicken Crate",
        description: "20 fresh free-range chickens, processed and chilled.",
        category: "Poultry",
        priceNgn: "85000.00",
        priceUnits: "8500.00",
        imageUrl: "/mart/chicken.jpg",
        stock: 35,
        rating: "4.70",
        seller: "Agrillion Poultry",
      },
      {
        name: "Solar Irrigation Pump",
        description: "Off-grid solar pump for smallholder farmers.",
        category: "Equipment",
        priceNgn: "245000.00",
        priceUnits: "24500.00",
        imageUrl: "/mart/pump.jpg",
        stock: 12,
        rating: "4.85",
        seller: "Agrillion Tech",
      },
      {
        name: "Cassava Starter Bundle",
        description: "Improved TME-419 cassava cuttings for one acre.",
        category: "Inputs",
        priceNgn: "32000.00",
        priceUnits: "3200.00",
        imageUrl: "/mart/cassava-cuttings.jpg",
        stock: 80,
        rating: "4.50",
        seller: "Cassava Plant Project",
      },
      {
        name: "NPK Fertilizer 50kg",
        description: "Balanced NPK 15-15-15 for healthy yields.",
        category: "Inputs",
        priceNgn: "26500.00",
        priceUnits: "2650.00",
        imageUrl: "/mart/fertilizer.jpg",
        stock: 150,
        rating: "4.40",
        seller: "Northern Agro Supply",
      },
      {
        name: "Honey - Wild Harvested 1L",
        description: "Pure raw honey from Mambilla Plateau.",
        category: "Pantry",
        priceNgn: "11500.00",
        priceUnits: "1150.00",
        imageUrl: "/mart/honey.jpg",
        stock: 90,
        rating: "4.95",
        seller: "Mambilla Apiaries",
      },
      {
        name: "Smoked Catfish 2kg",
        description: "Hickory-smoked catfish from Lagos lagoon farms.",
        category: "Seafood",
        priceNgn: "14800.00",
        priceUnits: "1480.00",
        imageUrl: "/mart/catfish.jpg",
        stock: 50,
        rating: "4.65",
        seller: "Lagos Lagoon Farms",
      },
      {
        name: "Plantain Crate (40 fingers)",
        description: "Fresh ripe plantains from Edo State.",
        category: "Produce",
        priceNgn: "18000.00",
        priceUnits: "1800.00",
        imageUrl: "/mart/plantain.jpg",
        stock: 70,
        rating: "4.55",
        seller: "Edo Plantain Growers",
      },
    ])
    .returning();

  // A few mart orders for primary member
  await db.insert(martOrders).values([
    {
      memberId: primary.id,
      productId: productRows[0]!.id,
      productName: productRows[0]!.name,
      productImage: productRows[0]!.imageUrl,
      quantity: 2,
      paymentMethod: "split",
      cashPaid: "20000.00",
      unitsUsed: "500.00",
      totalNgn: "25000.00",
      status: "delivered",
    },
    {
      memberId: primary.id,
      productId: productRows[2]!.id,
      productName: productRows[2]!.name,
      productImage: productRows[2]!.imageUrl,
      quantity: 1,
      paymentMethod: "units",
      cashPaid: "0",
      unitsUsed: "980.00",
      totalNgn: "9800.00",
      status: "shipped",
    },
    {
      memberId: primary.id,
      productId: productRows[7]!.id,
      productName: productRows[7]!.name,
      productImage: productRows[7]!.imageUrl,
      quantity: 1,
      paymentMethod: "cash",
      cashPaid: "11500.00",
      unitsUsed: "0",
      totalNgn: "11500.00",
      status: "processing",
    },
  ]);

  // Projects
  await db.insert(projects).values([
    {
      name: "Abakaliki Rice Mill",
      location: "Ebonyi State",
      category: "Processing",
      status: "active",
      progress: 72,
      coverImage: "/projects/rice-mill.jpg",
      summary: "Modern parboiling and milling facility serving 4,200 rice farmers in the South-East.",
      milestones: [
        { title: "Land cleared and foundation laid", description: "8 acres cleared in Abakaliki LGA.", status: "completed", date: new Date("2025-04-12").toISOString() },
        { title: "Mill machinery installed", description: "Italian milling line commissioned and tested.", status: "completed", date: new Date("2025-09-30").toISOString() },
        { title: "Outgrower programme launch", description: "Onboarding 4,200 smallholder farmers across Ebonyi.", status: "in_progress", date: null },
        { title: "First export shipment", description: "150 tons branded \"Agrillion Ofada\" to ECOWAS.", status: "pending", date: null },
      ],
      updates: [
        { id: "u1", title: "Mill exceeds Q1 throughput target", body: "Processed 1,820 tons of paddy in Q1 — 14% above plan.", postedAt: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString(), imageUrl: "/projects/rice-mill.jpg" },
        { id: "u2", title: "Outgrower payments digitised", body: "Smart Units rewards now sent to outgrowers within 24 hours of delivery.", postedAt: new Date(now - 1000 * 60 * 60 * 24 * 18).toISOString() },
      ],
      jobsCreated: 187,
      farmersSupported: 4200,
      tonsProcessed: "1820.00",
      startedAt: new Date("2025-01-10"),
    },
    {
      name: "Ogun Cassava Plant",
      location: "Ogun State",
      category: "Processing",
      status: "active",
      progress: 58,
      coverImage: "/projects/cassava.jpg",
      summary: "High-quality cassava flour and starch plant supplying breweries and bakeries.",
      milestones: [
        { title: "Site acquisition", description: "32 hectares acquired in Ewekoro LGA.", status: "completed", date: new Date("2025-02-22").toISOString() },
        { title: "Plant construction", description: "60% civil works completed.", status: "in_progress", date: null },
        { title: "Outgrower onboarding", description: "Onboarding 1,800 cassava farmers.", status: "in_progress", date: null },
        { title: "Production launch", description: "Cold-start expected in Q3 2026.", status: "pending", date: null },
      ],
      updates: [
        { id: "u1", title: "Outgrower training week complete", body: "850 farmers trained on TME-419 cuttings management.", postedAt: new Date(now - 1000 * 60 * 60 * 24 * 9).toISOString(), imageUrl: "/projects/cassava.jpg" },
      ],
      jobsCreated: 92,
      farmersSupported: 1800,
      tonsProcessed: "640.00",
      startedAt: new Date("2025-03-04"),
    },
    {
      name: "Lagos Cold Storage Hub",
      location: "Lagos State",
      category: "Storage & Logistics",
      status: "milestone",
      progress: 88,
      coverImage: "/projects/cold-storage.jpg",
      summary: "1,200-pallet cold chain facility cutting post-harvest losses for Lagos agro-traders.",
      milestones: [
        { title: "Cold rooms commissioned", description: "All 12 rooms operating at -18°C.", status: "completed", date: new Date("2025-11-12").toISOString() },
        { title: "Logistics fleet onboarded", description: "18 reefer trucks running daily routes.", status: "completed", date: new Date("2026-01-04").toISOString() },
        { title: "Marketplace integration", description: "Cold-stored Mart inventory live on Agrillion.", status: "in_progress", date: null },
      ],
      updates: [
        { id: "u1", title: "Saved ₦310M in post-harvest losses", body: "First-quarter cold storage prevented 1,140 tons of spoilage across the Lagos hub.", postedAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(), imageUrl: "/projects/cold-storage.jpg" },
        { id: "u2", title: "Reefer fleet hits 99% on-time", body: "New routing software pushed delivery reliability to 99% across the metro.", postedAt: new Date(now - 1000 * 60 * 60 * 24 * 12).toISOString() },
      ],
      jobsCreated: 134,
      farmersSupported: 920,
      tonsProcessed: "3120.00",
      startedAt: new Date("2024-08-15"),
    },
    {
      name: "Kaduna Poultry Feed Factory",
      location: "Kaduna State",
      category: "Manufacturing",
      status: "planning",
      progress: 22,
      coverImage: "/projects/poultry-feed.jpg",
      summary: "Locally formulated poultry feed cutting input costs for Northern Nigerian farms by 30%.",
      milestones: [
        { title: "Feasibility study complete", description: "Demand validated across 6 northern states.", status: "completed", date: new Date("2026-01-30").toISOString() },
        { title: "Factory construction", description: "Site clearing in progress.", status: "in_progress", date: null },
        { title: "Initial production", description: "First feed bag projected Q4 2026.", status: "pending", date: null },
      ],
      updates: [
        { id: "u1", title: "Land allocation finalised", body: "12 hectares secured in Kaduna's industrial corridor.", postedAt: new Date(now - 1000 * 60 * 60 * 24 * 25).toISOString() },
      ],
      jobsCreated: 28,
      farmersSupported: 0,
      tonsProcessed: "0",
      startedAt: new Date("2026-02-01"),
    },
    {
      name: "Mambilla Honey Sanctuary",
      location: "Taraba State",
      category: "Apiculture",
      status: "completed",
      progress: 100,
      coverImage: "/projects/honey.jpg",
      summary: "Smallholder beekeeping cooperative producing wild-harvested honey at scale.",
      milestones: [
        { title: "1,200 hives deployed", description: "Across the Mambilla plateau.", status: "completed", date: new Date("2025-06-05").toISOString() },
        { title: "First harvest exported", description: "12 tons of honey shipped to South Africa.", status: "completed", date: new Date("2026-02-14").toISOString() },
      ],
      updates: [
        { id: "u1", title: "Honey wins gold at SIAL Paris", body: "Mambilla Wild Honey awarded the SIAL Innovation gold medal.", postedAt: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString(), imageUrl: "/projects/honey.jpg" },
      ],
      jobsCreated: 64,
      farmersSupported: 480,
      tonsProcessed: "26.50",
      startedAt: new Date("2024-11-04"),
    },
  ]);

  // Notifications
  await db.insert(notifications).values([
    { memberId: primary.id, title: "Smart Units credited", body: "You earned 60 Smart Units from your last MTN airtime payment.", kind: "success" },
    { memberId: primary.id, title: "Cold Storage Hub update", body: "Lagos Cold Storage Hub saved ₦310M in post-harvest losses this quarter.", kind: "project" },
    { memberId: primary.id, title: "Order shipped", body: "Your order of Garri Ijebu 10kg has been shipped.", kind: "info" },
    { memberId: primary.id, title: "New reward bonus available", body: "Pay any electricity bill this week and earn double Smart Units.", kind: "info", read: true },
  ]);

  logger.info("Agrillion demo data seeded.");
}

export async function getCurrentMember(memberId?: string | null) {
  // Authenticated path: resolve by id when provided.
  if (memberId) {
    const rows = await db
      .select()
      .from(members)
      .where(eq(members.id, memberId))
      .limit(1);
    if (rows[0]) return rows[0];
  }
  // Demo fallback: first seeded member (preserves existing pages while auth rolls out).
  const rows = await db
    .select()
    .from(members)
    .orderBy(members.joinedAt)
    .limit(1);
  if (rows.length === 0) throw new Error("No members seeded");
  return rows[0]!;
}

const STATE_CODE_BY_NAME: Record<string, string> = {
  Lagos: "LA",
  FCT: "FCT",
  Rivers: "RV",
  Kano: "KN",
  Oyo: "OY",
};

function codeFor(name: string, fallbackLen = 3): string {
  const cleaned = name.replace(/[^A-Za-z]/g, "").toUpperCase();
  return cleaned.slice(0, fallbackLen) || "XXX";
}

function stateCodeFor(state: string): string {
  return STATE_CODE_BY_NAME[state] ?? codeFor(state, 2);
}

export async function allocateMembershipId(opts: {
  state: string;
  lga: string;
  tier: string;
}): Promise<string> {
  const prefix: "AGP" | "AGC" = opts.tier === "premier" ? "AGP" : "AGC";
  const stateCode = stateCodeFor(opts.state);
  const lgaCode = codeFor(opts.lga, 3);
  // Count existing members in same state/lga to allocate next number; gap-tolerant via random fallback.
  const existing = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(members)
    .where(eq(members.lga, opts.lga));
  const n = (existing[0]?.count ?? 0) + 1 + Math.floor(Math.random() * 7);
  return makeMembershipId(prefix, stateCode, lgaCode, n);
}

export function memberToDto(m: typeof members.$inferSelect): {
  id: string;
  membershipId: string;
  fullName: string;
  email: string;
  phone: string;
  state: string;
  lga: string;
  tier: string;
  joinedAt: string;
  avatarUrl: string | null;
} {
  return {
    id: m.id,
    membershipId: m.membershipId,
    fullName: m.fullName,
    email: m.email,
    phone: m.phone,
    state: m.state,
    lga: m.lga,
    tier: m.tier,
    joinedAt: m.joinedAt.toISOString(),
    avatarUrl: m.avatarUrl,
  };
}

export async function getOrCreateWallet(memberId: string) {
  const existing = await db
    .select()
    .from(wallets)
    .where(eq(wallets.memberId, memberId))
    .limit(1);
  if (existing[0]) return existing[0];
  const [created] = await db
    .insert(wallets)
    .values({ memberId })
    .returning();
  return created!;
}

export { db, members, wallets, sessions, utilityTransactions, smartUnitsLedger, martProducts, martOrders, projects, notifications, adminSettings, eq, desc, sql };
