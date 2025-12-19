import { z } from 'zod';

const EnvSchema = z.object({
  SERVER_ACTIVITIES_URL: z.string().url(),
  // Optional: used for generating absolute URLs in metadata/social cards.
  APP_BASE_URL: z.string().url().optional(),
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
