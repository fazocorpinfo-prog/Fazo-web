import { NextRequest, NextResponse } from "next/server";
import { analyticsCol, leadsCol } from "@/lib/db/collections";
import { normalizeProject } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const project = normalizeProject(searchParams.get("project"));
    const days = Math.min(Math.max(Number(searchParams.get("days") || 30), 1), 365);
    const since = new Date(Date.now() - days * 86_400_000);

    const analytics = await analyticsCol();
    const leads = await leadsCol();
    const base = { project, createdAt: { $gte: since } };
    const pv = { ...base, type: "pageview" as const };

    const [pageviews, events, leadCount, byDay, topPaths, devices, locales] = await Promise.all([
      analytics.countDocuments(pv),
      analytics.countDocuments({ ...base, type: "event" }),
      leads.countDocuments({ project, createdAt: { $gte: since } }),
      analytics.aggregate([
        { $match: pv },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]).toArray(),
      analytics.aggregate([
        { $match: pv },
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]).toArray(),
      analytics.aggregate([
        { $match: pv },
        { $group: { _id: "$device", count: { $sum: 1 } } },
      ]).toArray(),
      analytics.aggregate([
        { $match: pv },
        { $group: { _id: "$locale", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
    ]);

    const conversion = pageviews > 0 ? Math.round((leadCount / pageviews) * 1000) / 10 : 0;

    return NextResponse.json({
      project, days, pageviews, events, leads: leadCount, conversion,
      byDay, topPaths, devices, locales,
    });
  } catch (err) {
    console.error("[admin/analytics] failed:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
