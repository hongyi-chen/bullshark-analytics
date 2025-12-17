import { spawnSync } from 'node:child_process';

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: false, ...opts });
  if (res.status !== 0) {
    process.exit(res.status ?? 1);
  }
}

run('npx', ['prisma', 'generate']);

const dbUrl = process.env.DATABASE_URL || '';
const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');

// On Vercel/CI with a Postgres DATABASE_URL, ensure migrations are applied.
if (isPostgres) {
  run('npx', ['prisma', 'migrate', 'deploy']);
}

run('npx', ['next', 'build']);
