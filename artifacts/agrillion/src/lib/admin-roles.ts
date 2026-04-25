export type AdminRole = "super_admin" | "admin" | "finance" | "operations" | "support" | "moderator";

export const ROLE_LABEL: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  finance: "Finance",
  operations: "Operations",
  support: "Support",
  moderator: "Moderator",
};

export const ROLE_DESC: Record<AdminRole, string> = {
  super_admin:
    "Founder-level. Can add/remove admins, assign any role, change platform settings, view everything.",
  admin: "General admin. Manage members, transactions, services. Cannot manage other admins.",
  finance: "Read & reconcile revenue, payouts, refunds. Adjust unit conversion rates.",
  operations: "Operate Mart inventory, project milestones, fulfilment status.",
  support: "Member support: view accounts, reset passwords, resolve disputes.",
  moderator: "Read-only oversight of activity feeds and fraud alerts.",
};

export type Permission =
  | "manage_admins"
  | "edit_settings"
  | "manage_members"
  | "manage_transactions"
  | "manage_inventory"
  | "manage_projects"
  | "view_revenue"
  | "view_members"
  | "view_transactions"
  | "support_actions"
  | "view_fraud_alerts";

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  super_admin: [
    "manage_admins",
    "edit_settings",
    "manage_members",
    "manage_transactions",
    "manage_inventory",
    "manage_projects",
    "view_revenue",
    "view_members",
    "view_transactions",
    "support_actions",
    "view_fraud_alerts",
  ],
  admin: [
    "edit_settings",
    "manage_members",
    "manage_transactions",
    "manage_inventory",
    "manage_projects",
    "view_revenue",
    "view_members",
    "view_transactions",
    "support_actions",
    "view_fraud_alerts",
  ],
  finance: ["view_revenue", "view_transactions", "view_members"],
  operations: ["manage_inventory", "manage_projects", "view_members", "view_transactions"],
  support: ["view_members", "view_transactions", "support_actions"],
  moderator: ["view_members", "view_transactions", "view_fraud_alerts"],
};

export function hasPermission(role: AdminRole, perm: Permission) {
  return ROLE_PERMISSIONS[role]?.includes(perm) ?? false;
}

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: AdminRole;
  status: "active" | "suspended" | "invited";
  lastActiveAt: string;
  createdAt: string;
  isFounder?: boolean;
};

export const SEED_ADMINS: AdminUser[] = [
  {
    id: "adm_founder",
    fullName: "Adaeze Okoye",
    email: "founder@agrillion.ng",
    phone: "+234 803 000 0001",
    role: "super_admin",
    status: "active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    createdAt: "2025-01-12T08:00:00.000Z",
    isFounder: true,
  },
  {
    id: "adm_002",
    fullName: "Tunde Bakare",
    email: "tunde@agrillion.ng",
    phone: "+234 803 000 0102",
    role: "admin",
    status: "active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdAt: "2025-02-01T08:00:00.000Z",
  },
  {
    id: "adm_003",
    fullName: "Ifeoma Eze",
    email: "ifeoma@agrillion.ng",
    phone: "+234 803 000 0103",
    role: "finance",
    status: "active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    createdAt: "2025-02-14T08:00:00.000Z",
  },
  {
    id: "adm_004",
    fullName: "Chinedu Okafor",
    email: "chinedu@agrillion.ng",
    phone: "+234 803 000 0104",
    role: "operations",
    status: "active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdAt: "2025-03-05T08:00:00.000Z",
  },
  {
    id: "adm_005",
    fullName: "Halima Yusuf",
    email: "halima@agrillion.ng",
    phone: "+234 803 000 0105",
    role: "support",
    status: "active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    createdAt: "2025-04-01T08:00:00.000Z",
  },
  {
    id: "adm_006",
    fullName: "Bola Adeyemi",
    email: "bola@agrillion.ng",
    phone: "+234 803 000 0106",
    role: "moderator",
    status: "invited",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    createdAt: "2026-04-10T08:00:00.000Z",
  },
];

export const CURRENT_ADMIN_ID = "adm_founder";

export const ROLE_DESCRIPTION = ROLE_DESC;

export const ALL_ROLES: AdminRole[] = [
  "super_admin",
  "admin",
  "finance",
  "operations",
  "support",
  "moderator",
];

export const ROLE_BADGE_CLASS: Record<AdminRole, string> = {
  super_admin: "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30",
  admin: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30",
  finance: "bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500/30",
  operations: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30",
  support: "bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30",
  moderator: "bg-muted text-muted-foreground ring-1 ring-border",
};
