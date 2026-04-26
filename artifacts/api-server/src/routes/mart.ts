import { Router, type IRouter } from "express";
import {
  ListMartProductsResponse,
  ListMartOrdersResponse,
  CreateMartOrderBody,
  ListMartOrdersResponseItem,
} from "@workspace/api-zod";
import {
  db,
  martProducts,
  martOrders,
  wallets,
  smartUnitsLedger,
  getCurrentMember,
  getOrCreateWallet,
  desc,
  eq,
} from "../lib/agrillion";

const router: IRouter = Router();

router.get("/mart/products", async (_req, res) => {
  const rows = await db.select().from(martProducts).orderBy(desc(martProducts.createdAt));
  res.json(
    ListMartProductsResponse.parse(
      rows.map((r: typeof martProducts.$inferSelect) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        category: r.category,
        priceNgn: Number(r.priceNgn),
        priceUnits: Number(r.priceUnits),
        imageUrl: r.imageUrl,
        stock: r.stock,
        rating: r.rating ? Number(r.rating) : null,
        seller: r.seller,
      })),
    ),
  );
});

router.get("/mart/orders", async (req, res) => {
  const m = await getCurrentMember(req.auth?.memberId);
  const rows = await db
    .select()
    .from(martOrders)
    .where(eq(martOrders.memberId, m.id))
    .orderBy(desc(martOrders.createdAt));
  res.json(
    ListMartOrdersResponse.parse(
      rows.map((r: typeof martOrders.$inferSelect) => ({
        id: r.id,
        productId: r.productId,
        productName: r.productName,
        productImage: r.productImage,
        quantity: r.quantity,
        paymentMethod: r.paymentMethod,
        cashPaid: Number(r.cashPaid),
        unitsUsed: Number(r.unitsUsed),
        totalNgn: Number(r.totalNgn),
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      })),
    ),
  );
});

router.post("/mart/orders", async (req, res) => {
  const body = CreateMartOrderBody.parse(req.body);
  const m = await getCurrentMember(req.auth?.memberId);
  const w = await getOrCreateWallet(m.id);

  const product = await db
    .select()
    .from(martProducts)
    .where(eq(martProducts.id, body.productId))
    .limit(1);
  if (!product[0]) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  if (product[0].stock < body.quantity) {
    res.status(400).json({ error: "Insufficient stock" });
    return;
  }

  const totalNgn = Number(product[0].priceNgn) * body.quantity;
  const totalUnits = Number(product[0].priceUnits) * body.quantity;

  let cashPaid = 0;
  let unitsUsed = 0;

  if (body.paymentMethod === "cash") {
    cashPaid = totalNgn;
    if (Number(w.cashBalance) < cashPaid) {
      res.status(400).json({ error: "Insufficient cash balance" });
      return;
    }
  } else if (body.paymentMethod === "units") {
    unitsUsed = totalUnits;
    if (Number(w.smartUnits) < unitsUsed) {
      res.status(400).json({ error: "Insufficient Smart Units" });
      return;
    }
  } else {
    cashPaid = body.cashPaid ?? 0;
    unitsUsed = body.unitsUsed ?? 0;
    const covered = cashPaid + unitsUsed * (totalNgn / Math.max(totalUnits, 1));
    if (covered + 0.01 < totalNgn) {
      res.status(400).json({ error: "Split payment does not cover total" });
      return;
    }
    if (Number(w.cashBalance) < cashPaid) {
      res.status(400).json({ error: "Insufficient cash balance" });
      return;
    }
    if (Number(w.smartUnits) < unitsUsed) {
      res.status(400).json({ error: "Insufficient Smart Units" });
      return;
    }
  }

  const newCash = Number(w.cashBalance) - cashPaid;
  const newUnits = Number(w.smartUnits) - unitsUsed;
  await db
    .update(wallets)
    .set({
      cashBalance: newCash.toFixed(2),
      smartUnits: newUnits.toFixed(2),
      updatedAt: new Date(),
    })
    .where(eq(wallets.memberId, m.id));

  await db
    .update(martProducts)
    .set({ stock: product[0].stock - body.quantity })
    .where(eq(martProducts.id, product[0].id));

  if (unitsUsed > 0) {
    await db.insert(smartUnitsLedger).values({
      memberId: m.id,
      sourceType: "mart_redeem",
      referenceId: product[0].id,
      unitsAdded: "0",
      unitsUsed: unitsUsed.toFixed(2),
      balanceAfter: newUnits.toFixed(2),
      description: `Redeemed for ${product[0].name}`,
    });
  }

  const [order] = await db
    .insert(martOrders)
    .values({
      memberId: m.id,
      productId: product[0].id,
      productName: product[0].name,
      productImage: product[0].imageUrl,
      quantity: body.quantity,
      paymentMethod: body.paymentMethod,
      cashPaid: cashPaid.toFixed(2),
      unitsUsed: unitsUsed.toFixed(2),
      totalNgn: totalNgn.toFixed(2),
      status: "processing",
    })
    .returning();

  res.status(201).json(
    ListMartOrdersResponseItem.parse({
      id: order!.id,
      productId: order!.productId,
      productName: order!.productName,
      productImage: order!.productImage,
      quantity: order!.quantity,
      paymentMethod: order!.paymentMethod,
      cashPaid: Number(order!.cashPaid),
      unitsUsed: Number(order!.unitsUsed),
      totalNgn: Number(order!.totalNgn),
      status: order!.status,
      createdAt: order!.createdAt.toISOString(),
    }),
  );
});

export default router;
