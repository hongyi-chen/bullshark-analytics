import { z } from 'zod';

function optionalNonEmptyString() {
  return z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().min(1).optional(),
  );
}

const EnvSchema = z.object({
  STRAVA_CLIENT_ID: z.string().min(1),
  STRAVA_CLIENT_SECRET: z.string().min(1),

  // Club-feed MVP configuration (single service account polls the club feed)
  STRAVA_CLUB_ID: z.string().min(1),
  STRAVA_SERVICE_ATHLETE_ID: z.string().min(1),

  APP_BASE_URL: z.string().url(),
  APP_ENCRYPTION_KEY: z.string().min(1),

  // Protects admin/cron endpoints (club poller)
  // Optional for local development; REQUIRED in production.
  JOBS_RUNNER_SECRET: optionalNonEmptyString(),

  DATABASE_URL: z.string().min(1),
});

export type Env = z.infer<typeof EnvSchema>;

export function env(): Env {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const msg = parsed.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${msg}`);
  }
  return parsed.data;
}
