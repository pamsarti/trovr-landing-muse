/**
 * Creates (or re-uses) the local admin auth user and grants it the `admin`
 * role in public.user_roles. Run AFTER `supabase start` is up.
 *
 *   npm run seed:admin
 *
 * Credentials default to the local test admin and can be overridden with
 * ADMIN_EMAIL / ADMIN_PASSWORD env vars. Reads Supabase connection details
 * from process.env, falling back to .dev.vars / .env.local in the repo root.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

// Minimal KEY=VALUE loader for .dev.vars / .env.local (no extra deps).
function loadEnvFile(name) {
  const p = resolve(root, name);
  if (!existsSync(p)) return;
  for (const raw of readFileSync(p, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}
loadEnvFile(".dev.vars");
loadEnvFile(".env.local");

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "http://127.0.0.1:54321";
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@trovr.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "trovr-admin-123";

if (!SERVICE_ROLE) {
  console.error(
    "Missing SUPABASE_SERVICE_ROLE_KEY. Set it in .dev.vars (run `supabase status` to get it).",
  );
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  // Paginate listUsers until we find the email (local DB is tiny).
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(error.message);
    const hit = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (hit) return hit;
    if (data.users.length < 200) break;
  }
  return null;
}

async function main() {
  let userId;
  const { data: created, error } = await admin.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });

  if (error) {
    const existing = await findUserByEmail(ADMIN_EMAIL);
    if (!existing) throw new Error(`createUser failed and user not found: ${error.message}`);
    userId = existing.id;
    // Make sure the password matches what we document.
    await admin.auth.admin.updateUserById(userId, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    console.log(`Admin user already existed, reused: ${ADMIN_EMAIL}`);
  } else {
    userId = created.user.id;
    console.log(`Created admin user: ${ADMIN_EMAIL}`);
  }

  const { error: roleErr } = await admin
    .from("user_roles")
    .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
  if (roleErr) throw new Error(`granting admin role failed: ${roleErr.message}`);

  console.log(`Granted 'admin' role to ${ADMIN_EMAIL} (${userId})`);
  console.log(`\nLogin at /admin/login with:\n  email:    ${ADMIN_EMAIL}\n  password: ${ADMIN_PASSWORD}`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
