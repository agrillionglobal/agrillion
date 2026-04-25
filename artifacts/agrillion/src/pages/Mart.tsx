import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  useListMartProducts,
  useListMartOrders,
  useCreateMartOrder,
  useGetWallet,
  useGetSmartUnitsSummary,
  getListMartOrdersQueryKey,
  getGetWalletQueryKey,
  getGetSmartUnitsSummaryQueryKey,
  getGetDashboardSummaryQueryKey,
  getListSmartUnitsLedgerQueryKey,
} from "@workspace/api-client-react";
import { naira, num, units, fullDate } from "@/lib/format";
import { toast } from "sonner";
import { Star, ShoppingBag, Package, Minus, Plus, Leaf } from "lucide-react";

const COLORS = [
  "from-emerald-700 to-emerald-900",
  "from-amber-600 to-amber-800",
  "from-rose-700 to-rose-900",
  "from-yellow-600 to-amber-700",
  "from-orange-700 to-orange-900",
  "from-lime-700 to-emerald-800",
  "from-stone-700 to-stone-900",
  "from-teal-700 to-teal-900",
  "from-sky-700 to-sky-900",
  "from-amber-700 to-orange-900",
];

type Product = NonNullable<ReturnType<typeof useListMartProducts>["data"]>[number];

export default function Mart() {
  const products = useListMartProducts();
  const orders = useListMartOrders();
  const wallet = useGetWallet();
  const summary = useGetSmartUnitsSummary();
  const queryClient = useQueryClient();

  const [category, setCategory] = useState<string>("all");
  const [active, setActive] = useState<Product | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.data?.forEach((p) => set.add(p.category));
    return ["all", ...Array.from(set)];
  }, [products.data]);

  const filtered = (products.data ?? []).filter((p) => category === "all" || p.category === category);

  const createOrder = useCreateMartOrder({
    mutation: {
      onSuccess: () => {
        toast.success("Order placed", { description: "Track it in My Orders." });
        setActive(null);
        queryClient.invalidateQueries({ queryKey: getListMartOrdersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSmartUnitsSummaryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListSmartUnitsLedgerQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      },
      onError: (err) => toast.error("Order failed", { description: err.message }),
    },
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Mart"
        title="The Agrillion marketplace."
        description="Premium Nigerian-grown produce, farm inputs and equipment — sourced directly from cooperatives. Pay with cash, Smart Units, or both."
        actions={
          <div className="hidden md:flex items-center gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-full bg-muted">
              <span className="text-muted-foreground">Cash:</span> <span className="font-semibold ml-1">{naira(wallet.data?.cashBalance ?? 0)}</span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-amber-100/60 dark:bg-amber-950/40 ring-1 ring-amber-300/30">
              <span className="text-amber-800 dark:text-amber-300">SU:</span> <span className="font-semibold ml-1 text-amber-900 dark:text-amber-100">{num(summary.data?.totalUnits ?? 0)}</span>
            </div>
          </div>
        }
      />

      <Tabs defaultValue="shop" className="mt-8">
        <TabsList>
          <TabsTrigger value="shop"><ShoppingBag className="h-3.5 w-3.5 mr-1.5" /> Shop</TabsTrigger>
          <TabsTrigger value="orders"><Package className="h-3.5 w-3.5 mr-1.5" /> My orders ({orders.data?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="shop" className="mt-6">
          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={category === c ? "default" : "outline"}
                onClick={() => setCategory(c)}
                className={category === c ? "bg-primary text-primary-foreground" : ""}
              >
                {c === "all" ? "All products" : c}
              </Button>
            ))}
          </div>

          {/* Grid */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className={`aspect-[4/3] relative bg-gradient-to-br ${COLORS[i % COLORS.length]} leaf-motif`}>
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 dark:bg-black/60 backdrop-blur text-xs">
                        {p.category}
                      </Badge>
                    </div>
                    {p.rating != null && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-amber-200 backdrop-blur">
                        <Star className="h-3 w-3 fill-amber-300 stroke-amber-300" /> {p.rating.toFixed(1)}
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-emerald-950/70 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-200/90 backdrop-blur">
                      <Leaf className="h-3 w-3" /> {p.stock > 20 ? "In stock" : `Only ${p.stock} left`}
                    </div>
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <p className="font-medium text-sm leading-tight line-clamp-2">{p.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 flex-1">{p.description}</p>
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <p className="font-serif text-lg font-semibold">{naira(p.priceNgn)}</p>
                        <p className="text-xs gold-text font-medium">or {num(p.priceUnits)} SU</p>
                      </div>
                      <Button size="sm" onClick={() => setActive(p)}>Buy</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          {orders.data && orders.data.length > 0 ? (
            <div className="grid gap-3">
              {orders.data.map((o) => (
                <Card key={o.id}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="size-14 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 grid place-items-center text-amber-300 ring-1 ring-amber-300/20 shrink-0">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium leading-tight truncate">{o.productName}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Qty {o.quantity} · {o.paymentMethod} payment · {fullDate(o.createdAt)}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                        {o.cashPaid > 0 && <span><span className="text-muted-foreground">Cash:</span> <span className="font-medium">{naira(o.cashPaid)}</span></span>}
                        {o.unitsUsed > 0 && <span><span className="text-muted-foreground">Units:</span> <span className="font-medium gold-text">{num(o.unitsUsed)} SU</span></span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-lg font-semibold">{naira(o.totalNgn)}</p>
                      <div className="mt-1.5"><StatusPill status={o.status} /></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="No orders yet" description="Browse the Shop tab to place your first order." />
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="sm:max-w-lg">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle>{active.name}</DialogTitle>
                <DialogDescription>{active.description}</DialogDescription>
              </DialogHeader>
              <BuyForm
                product={active}
                cashBalance={wallet.data?.cashBalance ?? 0}
                unitsBalance={summary.data?.totalUnits ?? 0}
                busy={createOrder.isPending}
                onSubmit={(payload) => createOrder.mutate({ data: payload })}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function BuyForm({
  product,
  cashBalance,
  unitsBalance,
  busy,
  onSubmit,
}: {
  product: Product;
  cashBalance: number;
  unitsBalance: number;
  busy: boolean;
  onSubmit: (p: { productId: string; quantity: number; paymentMethod: "cash" | "units" | "split"; cashPaid?: number; unitsUsed?: number }) => void;
}) {
  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState<"cash" | "units" | "split">("cash");
  const totalNgn = product.priceNgn * qty;
  const totalUnits = product.priceUnits * qty;
  const [cashPaid, setCashPaid] = useState(Math.round(totalNgn / 2));
  const unitsForSplit = Math.max(0, Math.ceil((totalNgn - cashPaid) * (totalUnits / totalNgn)));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const payload: { productId: string; quantity: number; paymentMethod: "cash" | "units" | "split"; cashPaid?: number; unitsUsed?: number } = {
          productId: product.id,
          quantity: qty,
          paymentMethod: method,
        };
        if (method === "split") {
          payload.cashPaid = cashPaid;
          payload.unitsUsed = unitsForSplit;
        }
        onSubmit(payload);
      }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <Label>Quantity</Label>
        <div className="inline-flex items-center rounded-lg border border-border">
          <Button type="button" size="icon" variant="ghost" onClick={() => setQty(Math.max(1, qty - 1))} className="h-9 w-9">
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-4 font-mono">{qty}</span>
          <Button type="button" size="icon" variant="ghost" onClick={() => setQty(Math.min(product.stock, qty + 1))} className="h-9 w-9">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-xl bg-muted/40 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-semibold">{naira(totalNgn)}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-muted-foreground">Or in units</span>
          <span className="gold-text font-semibold">{num(totalUnits)} SU</span>
        </div>
      </div>

      <div>
        <Label>Payment method</Label>
        <RadioGroup value={method} onValueChange={(v) => setMethod(v as typeof method)} className="mt-2 grid grid-cols-3 gap-2">
          {[
            { v: "cash", label: "Cash only", sub: naira(totalNgn), disabled: cashBalance < totalNgn },
            { v: "units", label: "Units only", sub: `${num(totalUnits)} SU`, disabled: unitsBalance < totalUnits },
            { v: "split", label: "Split", sub: "Mix both", disabled: false },
          ].map((opt) => (
            <label
              key={opt.v}
              className={`relative cursor-pointer rounded-lg border-2 p-3 transition ${
                method === opt.v
                  ? "border-primary bg-primary/5"
                  : opt.disabled
                  ? "border-border opacity-40 cursor-not-allowed"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <RadioGroupItem value={opt.v} disabled={opt.disabled} className="sr-only" />
              <p className="text-xs font-semibold">{opt.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{opt.sub}</p>
            </label>
          ))}
        </RadioGroup>
      </div>

      {method === "split" && (
        <div className="space-y-2">
          <Label>Cash portion (₦)</Label>
          <Input
            type="number"
            min={0}
            max={Math.min(totalNgn, cashBalance)}
            value={cashPaid}
            onChange={(e) => setCashPaid(Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Remaining covered by <span className="gold-text font-semibold">{num(unitsForSplit)} SU</span>
          </p>
        </div>
      )}

      <Button type="submit" disabled={busy} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        {busy ? "Placing order..." : `Place order · ${naira(totalNgn)}`}
      </Button>
    </form>
  );
}
