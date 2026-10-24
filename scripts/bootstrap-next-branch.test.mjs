import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const script = readFileSync(
  new URL('./bootstrap-next-branch.sh', import.meta.url),
);
const config = JSON.parse(
  readFileSync(new URL('../release-please-config-next.json', import.meta.url)),
);

test('next uses prerelease versioning and a one-time bootstrap cutoff', () => {
  assert.equal(config.versioning, 'prerelease');
  assert.equal(config.prerelease, true);
  assert.equal(config['prerelease-type'], 'next');
  assert.equal(config['last-release-sha'], undefined);
});

test('bootstrap creates, resumes, and advances next without resetting active counters', () => {
  const root = mkdtempSync(join(tmpdir(), 'pixels-bootstrap-'));
  const repo = join(root, 'repo');
  const origin = join(root, 'origin.git');
  const env = {
    ...process.env,
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_NOSYSTEM: '1',
    HUSKY: '0',
  };
  const git = (...args) =>
    execFileSync('git', args, {
      cwd: repo,
      env,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  const write = (file, value) =>
    writeFileSync(join(repo, file), JSON.stringify(value, null, 2) + '\n');
  const read = (file) => JSON.parse(readFileSync(join(repo, file)));
  const bootstrap = () =>
    execFileSync('bash', ['bootstrap.sh'], {
      cwd: repo,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  const commit = () => {
    git('add', '.');
    git('commit', '-m', 'test fixture');
  };
  const manifest = '.release-please-manifest-next.json';
  const configFile = 'release-please-config-next.json';
  try {
    execFileSync('git', ['init', '--bare', origin], { env, stdio: 'pipe' });
    execFileSync('git', ['init', '-b', 'main', repo], { env, stdio: 'pipe' });
    git('config', 'user.name', 'Release test');
    git('config', 'user.email', 'release@example.invalid');
    git('remote', 'add', 'origin', origin);
    writeFileSync(join(repo, 'bootstrap.sh'), script);
    write('.release-please-manifest.json', {
      'packages/a': '1.4.1',
      'packages/b': '0.4.1',
    });
    write(manifest, {});
    write(configFile, {
      versioning: 'default',
      packages: { 'packages/a': {}, 'packages/b': {} },
    });
    commit();
    git('push', '-u', 'origin', 'main');
    const cutoff = git('rev-parse', 'HEAD');
    bootstrap();
    assert.equal(git('branch', '--show-current'), 'next');
    assert.deepEqual(read(manifest), {
      'packages/a': '2.0.0-next.0',
      'packages/b': '1.0.0-next.0',
    });
    assert.equal(read(configFile)['bootstrap-sha'], cutoff);
    const first = git('rev-parse', 'HEAD');
    bootstrap();
    assert.equal(git('rev-parse', 'HEAD'), first, 'reruns must be idempotent');

    write(manifest, {
      'packages/a': '2.0.0-next.7',
      'packages/b': '1.0.0-next.3',
    });
    const legacy = read(configFile);
    legacy['last-release-sha'] = legacy['bootstrap-sha'];
    delete legacy['bootstrap-sha'];
    write(configFile, legacy);
    commit();
    bootstrap();
    assert.equal(read(manifest)['packages/a'], '2.0.0-next.7');
    assert.equal(read(configFile)['bootstrap-sha'], cutoff);
    assert.equal(read(configFile)['last-release-sha'], undefined);
    git('push', '-u', 'origin', 'next');

    // Resume a remote-only next branch rather than recreating its manifest.
    git('checkout', 'main');
    git('branch', '-D', 'next');
    bootstrap();
    assert.equal(read(manifest)['packages/b'], '1.0.0-next.3');

    // A stable release catches up with A; B is still an active prerelease.
    git('checkout', 'main');
    write('.release-please-manifest.json', {
      'packages/a': '2.0.0',
      'packages/b': '0.5.0',
      'packages/c': '1.2.0',
    });
    commit();
    git('push', 'origin', 'main');
    bootstrap();
    assert.deepEqual(read(manifest), {
      'packages/a': '3.0.0-next.0',
      'packages/b': '1.0.0-next.3',
      'packages/c': '2.0.0-next.0',
    });
    assert.equal(read(configFile)['bootstrap-sha'], cutoff);

    const before = git('rev-parse', 'HEAD');
    writeFileSync(join(repo, 'unrelated.txt'), 'keep me');
    const dirty = spawnSync('bash', ['bootstrap.sh'], {
      cwd: repo,
      env,
      encoding: 'utf8',
    });
    assert.equal(dirty.status, 1);
    assert.match(dirty.stderr, /Commit or stash/);
    assert.equal(git('rev-parse', 'HEAD'), before);
    assert.equal(git('status', '--porcelain'), '?? unrelated.txt');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
