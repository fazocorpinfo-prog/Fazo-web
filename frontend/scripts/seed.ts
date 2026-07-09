/**
 * Seed MongoDB from the existing next-intl messages + SECTION_REGISTRY.
 * Loses nothing: every JSON leaf + techstack list + legacy image path is captured.
 *
 *   npm run seed              # upsert (insert-only; never clobbers admin edits)
 *   npm run seed -- --force   # replace content docs with the i18n baseline
 *   npm run seed -- --dry-run # build + validate everything, touch NO database
 *   npm run seed -- --with-media  # also stream legacy /public images into GridFS
 *
 * Env (frontend/.env.local): MONGODB_URI, MONGODB_DB, ADMIN_SEED_USER, ADMIN_SEED_PASS
 */
import { readFileSync, existsSync, statSync, createReadStream } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import { SECTION_REGISTRY } from "../src/lib/content/registry";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const LOCALES = ["uz", "ru", "en"] as const;

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const FORCE = args.includes("--force");
const WITH_MEDIA = args.includes("--with-media");

// ── tiny .env.local loader (tsx does not auto-load it) ─────────────────────
function loadEnv(file: string) {
  const p = join(ROOT, file);
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}
loadEnv(".env.local");
loadEnv(".env");

// ── messages ───────────────────────────────────────────────────────────────
type Json = Record<string, unknown>;
const msgs: Record<string, Json> = {};
for (const l of LOCALES) {
  msgs[l] = JSON.parse(readFileSync(join(ROOT, "messages", `${l}.json`), "utf8"));
}

function get(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o == null ? undefined : (o as Json)[k]), obj);
}

type L10n = { uz: string; ru?: string; en?: string };

function L(ns: string, path: string): L10n {
  const out: Record<string, string> = {};
  for (const l of LOCALES) {
    const v = get(msgs[l], `${ns}.${path}`);
    if (typeof v === "string" && v.length) out[l] = v;
  }
  return out as L10n;
}

function LList(ns: string, path: string): L10n[] {
  const arrs: Record<string, string[]> = {};
  for (const l of LOCALES) {
    const v = get(msgs[l], `${ns}.${path}`);
    arrs[l] = Array.isArray(v) ? (v as string[]) : [];
  }
  const len = Math.max(...LOCALES.map((l) => arrs[l].length));
  const out: L10n[] = [];
  for (let i = 0; i < len; i++) {
    const el: Record<string, string> = {};
    for (const l of LOCALES) if (typeof arrs[l][i] === "string") el[l] = arrs[l][i];
    out.push(el as L10n);
  }
  return out;
}

// ── build content docs from the registry ────────────────────────────────────
function buildDocs() {
  return SECTION_REGISTRY.map((s) => {
    const doc: Record<string, unknown> = {
      key: s.key,
      type: s.type,
      enabled: s.enabled,
      order: s.order,
      fields: {} as Record<string, unknown>,
      items: [] as unknown[],
      stats: [] as unknown[],
      extra: s.extra ?? {},
      updatedAt: new Date(),
      updatedBy: "seed",
    };
    const fields = doc.fields as Record<string, unknown>;
    for (const f of s.fields) fields[f] = L(s.key, f);
    for (const f of s.listFields ?? []) fields[f] = LList(s.key, f);

    (s.items ?? []).forEach((it, i) => {
      const path = it.path ?? it.id;
      const itemFields: Record<string, unknown> = {};
      for (const f of it.fields) itemFields[f] = L(s.key, `${path}.${f}`);
      const item: Record<string, unknown> = { id: it.id, order: i, enabled: true, meta: {}, fields: itemFields };
      if (it.image) {
        item.image = { mediaId: null, legacySrc: it.image.legacySrc ?? null, alt: L(s.key, `${path}.title`) };
      }
      (doc.items as unknown[]).push(item);
    });

    (s.stats ?? []).forEach((id) => {
      (doc.stats as unknown[]).push({ id, value: L(s.key, `${id}.value`), label: L(s.key, `${id}.label`) });
    });

    return doc;
  });
}

function buildSettings() {
  return {
    _id: "global",
    brand: { name: "FAZO", logo: { mediaId: null, legacySrc: "/fazo-logo.svg" } },
    defaultLocale: "uz",
    locales: ["uz", "ru", "en"],
    contact: {
      phone1: (get(msgs.uz, "footer.phone1") as string) ?? "",
      phone2: (get(msgs.uz, "footer.phone2") as string) ?? "",
      email: process.env.SITE_EMAIL || "fazocorpinfo@gmail.com",
    },
    socials: {
      telegram: (get(msgs.uz, "footer.telegram") as string) ?? "",
      instagram: (get(msgs.uz, "footer.instagram") as string) ?? "",
      youtube: (get(msgs.uz, "footer.youtube") as string) ?? "",
    },
    seo: {
      title: { uz: "FAZO — Raqamli g'oyalar galaktikasi" },
      description: L("hero", "subheadline"),
      ogImage: { mediaId: null, legacySrc: "/fazo-logo.png" },
    },
    nav: { order: ["services", "portfolio", "process", "team", "contact"] },
    updatedAt: new Date(),
    updatedBy: "seed",
  };
}

// ── validation (drives --dry-run report; catches JSON drift) ────────────────
function validate(docs: Record<string, unknown>[]) {
  const problems: string[] = [];
  const isL10n = (v: unknown): v is L10n => !!v && typeof v === "object" && !Array.isArray(v);
  for (const d of docs) {
    const key = d.key as string;
    const fields = d.fields as Record<string, unknown>;
    for (const [f, v] of Object.entries(fields)) {
      if (Array.isArray(v)) {
        v.forEach((el, i) => { if (!(el as L10n)?.uz) problems.push(`${key}.fields.${f}[${i}].uz empty`); });
      } else if (isL10n(v) && !v.uz) {
        problems.push(`${key}.fields.${f}.uz empty`);
      }
    }
    for (const it of d.items as Record<string, unknown>[]) {
      const itf = it.fields as Record<string, L10n>;
      for (const [f, v] of Object.entries(itf)) if (!v?.uz) problems.push(`${key}.${it.id}.${f}.uz empty`);
    }
    for (const st of d.stats as { id: string; value: L10n; label: L10n }[]) {
      if (!st.value?.uz) problems.push(`${key}.${st.id}.value.uz empty`);
      if (!st.label?.uz) problems.push(`${key}.${st.id}.label.uz empty`);
    }
  }
  return problems;
}

function report(docs: Record<string, unknown>[]) {
  const sections = docs.filter((d) => d.type === "section");
  const singles = docs.filter((d) => d.type === "singleton");
  const items = docs.reduce((n, d) => n + (d.items as unknown[]).length, 0);
  const leaves = docs.reduce((n, d) => {
    const f = Object.keys(d.fields as object).length;
    const it = (d.items as Record<string, unknown>[]).reduce((m, i) => m + Object.keys(i.fields as object).length, 0);
    const st = (d.stats as unknown[]).length * 2;
    return n + f + it + st;
  }, 0);
  console.log(`\n  sections: ${sections.length} (expected 14)`);
  console.log(`  singletons: ${singles.length} (expected 5)`);
  console.log(`  repeatable items: ${items}`);
  console.log(`  localized field-groups captured: ${leaves}`);
  const perLocale = LOCALES.map((l) => {
    let filled = 0, total = 0;
    const walk = (v: unknown) => {
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") {
        if ("uz" in (v as object)) { total++; if ((v as L10n)[l]) filled++; }
        else Object.values(v as object).forEach(walk);
      }
    };
    docs.forEach((d) => { walk(d.fields); (d.items as Record<string, unknown>[]).forEach((i) => walk(i.fields)); walk(d.stats); });
    return `${l}: ${filled}/${total}`;
  });
  console.log(`  translation coverage → ${perLocale.join("  ")}`);
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  const docs = buildDocs();
  const settings = buildSettings();

  console.log(`\nFAZO seed  ${DRY ? "[DRY-RUN — no DB writes]" : FORCE ? "[FORCE]" : "[upsert]"}`);
  report(docs);

  const problems = validate(docs);
  if (problems.length) {
    console.log(`\n  ⚠ ${problems.length} empty uz value(s) — possible JSON drift:`);
    problems.slice(0, 40).forEach((p) => console.log(`     - ${p}`));
  } else {
    console.log(`\n  ✓ every uz value present — nothing lost.`);
  }

  if (DRY) {
    console.log(`\nDry-run OK. Set MONGODB_URI in .env.local and run without --dry-run to write.\n`);
    return;
  }

  const { MongoClient, GridFSBucket } = await import("mongodb");
  const bcrypt = (await import("bcryptjs")).default;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set (frontend/.env.local)");
  const dbName = process.env.MONGODB_DB || "fazo";

  const client = await new MongoClient(uri).connect();
  try {
    const db = client.db(dbName);
    const content = db.collection("content");
    const settingsCol = db.collection("site_settings");
    const admins = db.collection("admins");

    // indexes
    await content.createIndex({ key: 1 }, { unique: true });
    await content.createIndex({ type: 1, enabled: 1, order: 1 });
    await admins.createIndex({ username: 1 }, { unique: true });
    await admins.createIndex({ email: 1 }, { unique: true });

    // content
    let inserted = 0, kept = 0, replaced = 0;
    for (const doc of docs) {
      if (FORCE) {
        await content.replaceOne({ key: doc.key }, doc, { upsert: true });
        replaced++;
      } else {
        const r = await content.updateOne({ key: doc.key }, { $setOnInsert: doc }, { upsert: true });
        if (r.upsertedCount) inserted++; else kept++;
      }
    }

    // settings (insert-only unless force)
    if (FORCE) await settingsCol.replaceOne({ _id: "global" as never }, settings as never, { upsert: true });
    else await settingsCol.updateOne({ _id: "global" as never }, { $setOnInsert: settings as never }, { upsert: true });

    // admin seed (never re-hash on later runs)
    const user = process.env.ADMIN_SEED_USER || "admin";
    const pass = process.env.ADMIN_SEED_PASS || "admin123";
    const passwordHash = await bcrypt.hash(pass, 12);
    await admins.updateOne(
      { username: user },
      {
        $setOnInsert: {
          username: user,
          email: process.env.ADMIN_SEED_EMAIL || "fazocorpinfo@gmail.com",
          passwordHash,
          role: "superadmin",
          isActive: true,
          createdAt: new Date(),
          lastLoginAt: null,
        },
      },
      { upsert: true }
    );

    // optional legacy media import
    if (WITH_MEDIA) {
      const bucket = new GridFSBucket(db, { bucketName: "media" });
      for (const doc of docs) {
        for (const it of doc.items as Record<string, unknown>[]) {
          const img = it.image as { legacySrc?: string | null; mediaId?: string | null } | undefined;
          if (!img?.legacySrc) continue;
          const file = join(ROOT, "public", img.legacySrc.replace(/^\//, ""));
          if (!existsSync(file) || !statSync(file).isFile()) continue;
          const sha = createHash("sha256").update(readFileSync(file)).digest("hex");
          const existing = await db.collection("media.files").findOne({ "metadata.sha256": sha });
          let id = existing?._id;
          if (!id) {
            const filename = img.legacySrc.split("/").pop()!;
            const ext = filename.split(".").pop()?.toLowerCase();
            const ct = ext === "png" ? "image/png" : ext === "svg" ? "image/svg+xml" : "image/jpeg";
            id = await new Promise((resolve, reject) => {
              const up = bucket.openUploadStream(filename, {
                metadata: { contentType: ct, project: "fazo", usedBy: { content: doc.key, itemId: it.id, slot: "image" }, sha256: sha, uploadedBy: "seed" },
              });
              createReadStream(file).pipe(up).on("finish", () => resolve(up.id)).on("error", reject);
            });
          }
          await content.updateOne(
            { key: doc.key, "items.id": it.id },
            { $set: { "items.$.image.mediaId": String(id) } }
          );
        }
      }
      console.log("  media: legacy images imported to GridFS");
    }

    console.log(`\n  content → inserted:${inserted} kept:${kept} replaced:${replaced}`);
    console.log(`  admin   → "${user}" ensured (role superadmin)`);
    console.log(`\n✓ Seed complete.\n`);
  } finally {
    await client.close();
  }
}

main().catch((e) => {
  console.error("\nSeed failed:", e);
  process.exit(1);
});
