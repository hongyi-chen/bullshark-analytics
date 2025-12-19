import { z } from 'zod';

const EnvSchema = z.object({
  SERVER_ACTIVITIES_URL: z.string().url(),
  APP_BASE_URL: z.string().url(),
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
