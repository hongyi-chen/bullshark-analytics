import { spawnSync } from 'node:child_process';

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: false, ...opts });
  if (res.status !== 0) {
    process.exit(res.status ?? 1);
  }
}

// Build the Next.js application
run('npx', ['next', 'build']);
