import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  numeric,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  membershipId: varchar("membership_id", { length: 32 }).notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  state: text("state").notNull(),
  lga: text("lga").notNull(),
  tier: varchar("tier", { length: 16 }).notNull().default("member"),
  status: varchar("status", { length: 16 }).notNull().default("active"),
  passwordHash: text("password_hash"),
  walletPinHash: text("wallet_pin_hash"),
  avatarUrl: text("avatar_url"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

export const wallets = pgTable("wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  cashBalance: numeric("cash_balance", { precision: 14, scale: 2 }).notNull().default("0"),
  smartUnits: numeric("smart_units", { precision: 14, scale: 2 }).notNull().default("0"),
  pendingUnits: numeric("pending_units", { precision: 14, scale: 2 }).notNull().default("0"),
  currency: varchar("currency", { length: 3 }).notNull().default("NGN"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const utilityTransactions = pgTable("utility_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  serviceCategory: varchar("service_category", { length: 32 }).notNull(),
  provider: varchar("provider", { length: 64 }).notNull(),
  beneficiary: varchar("beneficiary", { length: 64 }).notNull(),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  marginGenerated: numeric("margin_generated", { precision: 14, scale: 2 }).notNull(),
  unitsEarned: numeric("units_earned", { precision: 14, scale: 2 }).notNull(),
  status: varchar("status", { length: 16 }).notNull().default("success"),
  reference: varchar("reference", { length: 64 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const smartUnitsLedger = pgTable("smart_units_ledger", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  sourceType: varchar("source_type", { length: 32 }).notNull(),
  referenceId: varchar("reference_id", { length: 64 }),
  unitsAdded: numeric("units_added", { precision: 14, scale: 2 }).notNull().default("0"),
  unitsUsed: numeric("units_used", { precision: 14, scale: 2 }).notNull().default("0"),
  balanceAfter: numeric("balance_after", { precision: 14, scale: 2 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const martProducts = pgTable("mart_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  priceNgn: numeric("price_ngn", { precision: 14, scale: 2 }).notNull(),
  priceUnits: numeric("price_units", { precision: 14, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  stock: integer("stock").notNull().default(0),
  rating: numeric("rating", { precision: 3, scale: 2 }),
  seller: text("seller").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const martOrders = pgTable("mart_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => martProducts.id),
  productName: text("product_name").notNull(),
  productImage: text("product_image"),
  quantity: integer("quantity").notNull(),
  paymentMethod: varchar("payment_method", { length: 16 }).notNull(),
  cashPaid: numeric("cash_paid", { precision: 14, scale: 2 }).notNull().default("0"),
  unitsUsed: numeric("units_used", { precision: 14, scale: 2 }).notNull().default("0"),
  totalNgn: numeric("total_ngn", { precision: 14, scale: 2 }).notNull(),
  status: varchar("status", { length: 16 }).notNull().default("processing"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  status: varchar("status", { length: 16 }).notNull().default("active"),
  progress: integer("progress").notNull().default(0),
  coverImage: text("cover_image"),
  summary: text("summary").notNull(),
  milestones: jsonb("milestones").notNull().default([]),
  updates: jsonb("updates").notNull().default([]),
  jobsCreated: integer("jobs_created").notNull().default(0),
  farmersSupported: integer("farmers_supported").notNull().default(0),
  tonsProcessed: numeric("tons_processed", { precision: 14, scale: 2 }).notNull().default("0"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  kind: varchar("kind", { length: 16 }).notNull().default("info"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  refreshTokenHash: text("refresh_token_hash").notNull().unique(),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminSettings = pgTable("admin_settings", {
  id: integer("id").primaryKey().default(1),
  unitConversionRateNgn: numeric("unit_conversion_rate_ngn", { precision: 10, scale: 4 }).notNull().default("1"),
  rewardSplitMemberPct: integer("reward_split_member_pct").notNull().default(60),
  airtimeEnabled: boolean("airtime_enabled").notNull().default(true),
  dataEnabled: boolean("data_enabled").notNull().default(true),
  cableEnabled: boolean("cable_enabled").notNull().default(true),
  electricityEnabled: boolean("electricity_enabled").notNull().default(true),
  internetEnabled: boolean("internet_enabled").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
