import { Router, type IRouter } from "express";
import {
  ListProjectsResponse,
  GetProjectResponse,
  GetImpactMetricsResponse,
} from "@workspace/api-zod";
import { db, projects, eq, sql } from "../lib/agrillion";

type Project = typeof projects.$inferSelect;

const router: IRouter = Router();

router.get("/tech/projects", async (_req, res) => {
  const rows = await db.select().from(projects).orderBy(projects.startedAt);
  res.json(
    ListProjectsResponse.parse(
      rows.map((p: Project) => ({
        id: p.id,
        name: p.name,
        location: p.location,
        category: p.category,
        status: p.status,
        progress: p.progress,
        coverImage: p.coverImage,
        summary: p.summary,
        startedAt: p.startedAt.toISOString(),
      })),
    ),
  );
});

router.get("/tech/projects/:projectId", async (req, res) => {
  const id = req.params.projectId;
  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!rows[0]) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  const p = rows[0];
  res.json(
    GetProjectResponse.parse({
      id: p.id,
      name: p.name,
      location: p.location,
      category: p.category,
      status: p.status,
      progress: p.progress,
      coverImage: p.coverImage,
      summary: p.summary,
      startedAt: p.startedAt.toISOString(),
      milestones: p.milestones,
      updates: p.updates,
      impact: {
        jobsCreated: p.jobsCreated,
        farmersSupported: p.farmersSupported,
        tonsProcessed: Number(p.tonsProcessed),
      },
    }),
  );
});

router.get("/tech/impact", async (_req, res) => {
  const allRows = await db.select().from(projects);
  const active = allRows.filter((p: Project) => p.status === "active" || p.status === "milestone").length;
  const states = new Set(allRows.map((p: Project) => p.location));
  const jobs = allRows.reduce((s: number, p: Project) => s + p.jobsCreated, 0);
  const farmers = allRows.reduce((s: number, p: Project) => s + p.farmersSupported, 0);
  const tons = allRows.reduce((s: number, p: Project) => s + Number(p.tonsProcessed), 0);

  const breakdown: { state: string; projects: number }[] = [];
  const map = new Map<string, number>();
  allRows.forEach((p: Project) => map.set(p.location, (map.get(p.location) ?? 0) + 1));
  map.forEach((projects, state) => breakdown.push({ state, projects }));

  res.json(
    GetImpactMetricsResponse.parse({
      activeProjects: active,
      statesCovered: states.size,
      jobsCreated: jobs,
      farmersSupported: farmers,
      tonsProcessed: tons,
      statesBreakdown: breakdown,
    }),
  );
});

void sql;

export default router;
