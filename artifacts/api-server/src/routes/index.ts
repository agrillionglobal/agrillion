import { Router, type IRouter } from "express";
import healthRouter from "./health";
import membersRouter from "./members";
import walletRouter from "./wallet";
import smartUnitsRouter from "./smartUnits";
import utilitiesRouter from "./utilities";
import martRouter from "./mart";
import techRouter from "./tech";
import dashboardRouter from "./dashboard";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(membersRouter);
router.use(walletRouter);
router.use(smartUnitsRouter);
router.use(utilitiesRouter);
router.use(martRouter);
router.use(techRouter);
router.use(dashboardRouter);
router.use(adminRouter);

export default router;
