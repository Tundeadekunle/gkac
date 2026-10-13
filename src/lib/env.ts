import fs from 'fs';
import path from 'path';

export function getEnvConfig() {
  let envFile = '';
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      envFile = fs.readFileSync(envPath, 'utf8');
    }
  } catch {}

  const parsed: Record<string, string> = {};
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      parsed[key] = val;
    }
  }

  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    parsed.DATABASE_URL ||
    parsed.NEON_DATABASE_URL ||
    parsed.POSTGRES_URL ||
    '';

  const neonAuthBaseUrl =
    process.env.NEON_AUTH_BASE_URL ||
    process.env.NEXT_PUBLIC_NEON_AUTH_URL ||
    parsed.NEON_AUTH_BASE_URL ||
    parsed.NEXT_PUBLIC_NEON_AUTH_URL ||
    '';

  const neonAuthCookieSecret =
    process.env.NEON_AUTH_COOKIE_SECRET ||
    parsed.NEON_AUTH_COOKIE_SECRET ||
    'glorious-king-academy-and-college-secret-key-32chars';

  return {
    databaseUrl,
    neonAuthBaseUrl,
    neonAuthCookieSecret,
    isNeonConfigured: Boolean(databaseUrl),
    isNeonAuthConfigured: Boolean(neonAuthBaseUrl),
  };
}
