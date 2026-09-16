import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, relative, resolve } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const articlePath = resolve(repositoryRoot, 'article/tutorial.md');
const bundlePath = resolve(repositoryRoot, 'teaching-history.bundle');
const canonicalBindings = new Map([
  ['SNIP-02', 'src/components/ScreenReaderStatusMessage.jsx'],
  ['SNIP-03', 'src/App.jsx'],
]);
const excerptBindings = new Map([
  ['SNIP-04', 'src/components/ScreenReaderStatusMessage.test.jsx'],
  ['SNIP-05', 'src/App.repeated-status.test.jsx'],
]);
const commandBindings = new Map([
  ['SNIP-01', 'npm ci\nnpm run dev'],
  ['SNIP-06', 'npm run check'],
]);
const expectedStepIds = [
  'STEP-01',
  'STEP-02',
  'STEP-03',
  'STEP-04',
  'STEP-05',
  'STEP-06',
];
const expectedSnippetClasses = new Map([
  ['SNIP-01', 'command'],
  ['SNIP-02', 'canonical'],
  ['SNIP-03', 'canonical'],
  ['SNIP-04', 'excerpt'],
  ['SNIP-05', 'excerpt'],
  ['SNIP-06', 'command'],
]);
const exampleAllowlist = [
  '.gitattributes',
  '.gitignore',
  '.prettierrc',
  'LICENSE',
  'eslint.config.js',
  'index.html',
  'package-lock.json',
  'package.json',
  'public/favicon.ico',
  'public/logo192.png',
  'public/logo512.png',
  'public/manifest.json',
  'public/robots.txt',
  'src/App.css',
  'src/App.jsx',
  'src/App.repeated-status.test.jsx',
  'src/App.test.jsx',
  'src/components/ScreenReaderStatusMessage.jsx',
  'src/components/ScreenReaderStatusMessage.replacement.test.jsx',
  'src/components/ScreenReaderStatusMessage.test.jsx',
  'src/index.css',
  'src/main.jsx',
  'src/setupTests.js',
  'vite.config.js',
].sort();
const expectedHistorySubjects = [
  'chore: establish the locked Vite example',
  'feat: implement the persistent status region',
  'feat: connect the focus-preserving cart workflow',
];

function normalizeLineEndings(value) {
  return value.replaceAll('\r\n', '\n');
}

function assertExactIds(label, actual, expected) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${label} must be ${expected.join(', ')}; found ${actual.join(', ')}.`
    );
  }
}

async function listFiles(directory, base = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => entry.name !== '.git')
      .map(async (entry) => {
        const path = resolve(directory, entry.name);
        return entry.isDirectory()
          ? listFiles(path, base)
          : [relative(base, path).replaceAll('\\', '/')];
      })
  );
  return nested.flat().sort();
}

for (const path of [
  'README.md',
  'article/tutorial.md',
  'design.md',
  'history.md',
  'pair.md',
  'sources.md',
  'verification.md',
  'teaching-history.bundle',
]) {
  await readFile(resolve(repositoryRoot, path));
}

const article = await readFile(articlePath, 'utf8');
const stepIds = [
  ...article.matchAll(
    /^<!-- twa:step id=([A-Za-z][A-Za-z0-9._-]*) -->\r?\n## [^\r\n]+$/gm
  ),
].map((match) => match[1]);
assertExactIds('Article step markers', stepIds, expectedStepIds);

const snippetMatches = [
  ...article.matchAll(
    /^<!-- twa:snippet id=([A-Za-z][A-Za-z0-9._-]*) class=(canonical|excerpt|command|output|conceptual) -->\r?\n```[^\r\n]*\r?\n([\s\S]*?)\r?\n```/gm
  ),
];
assertExactIds(
  'Article snippet markers',
  snippetMatches.map((match) => match[1]),
  [...expectedSnippetClasses.keys()]
);
const snippets = new Map(
  snippetMatches.map((match) => [
    match[1],
    { className: match[2], content: match[3] },
  ])
);

for (const [snippetId, expectedClass] of expectedSnippetClasses) {
  if (snippets.get(snippetId)?.className !== expectedClass) {
    throw new Error(`${snippetId} must use the ${expectedClass} class.`);
  }
}

for (const [snippetId, sourcePath] of canonicalBindings) {
  const source = await readFile(resolve(repositoryRoot, sourcePath), 'utf8');
  const fenced = `${snippets.get(snippetId).content}\n`;
  if (normalizeLineEndings(fenced) !== normalizeLineEndings(source)) {
    throw new Error(`${snippetId} has drifted from ${sourcePath}.`);
  }
}

for (const [snippetId, sourcePath] of excerptBindings) {
  const source = normalizeLineEndings(
    await readFile(resolve(repositoryRoot, sourcePath), 'utf8')
  );
  const excerpt = normalizeLineEndings(snippets.get(snippetId).content);
  const occurrences = source.split(excerpt).length - 1;
  if (occurrences !== 1) {
    throw new Error(
      `${snippetId} must match one exact, unique excerpt from ${sourcePath}.`
    );
  }
}

for (const [snippetId, command] of commandBindings) {
  if (snippets.get(snippetId).content !== command) {
    throw new Error(`${snippetId} has drifted from its reviewed command.`);
  }
}

const packageManifest = JSON.parse(
  await readFile(resolve(repositoryRoot, 'package.json'), 'utf8')
);
for (const scriptName of ['dev', 'check', 'verify:tutorial']) {
  if (typeof packageManifest.scripts?.[scriptName] !== 'string') {
    throw new Error(`package.json must define the ${scriptName} script.`);
  }
}

for (const path of [
  'README.md',
  'article/tutorial.md',
  'design.md',
  'history.md',
  'pair.md',
  'sources.md',
  'verification.md',
]) {
  const content = await readFile(resolve(repositoryRoot, path), 'utf8');
  if (/\b(?:TODO|TBD)\b|[–—]/u.test(content)) {
    throw new Error(`${path} contains a placeholder or nonportable dash.`);
  }
}

const verificationRecord = await readFile(
  resolve(repositoryRoot, 'verification.md'),
  'utf8'
);
for (const path of [
  'article/tutorial.md',
  'README.md',
  'package-lock.json',
  'teaching-history.bundle',
]) {
  const digest = createHash('sha256')
    .update(await readFile(resolve(repositoryRoot, path)))
    .digest('hex');
  const digestRowExists = verificationRecord
    .split(/\r?\n/)
    .some(
      (line) => line.includes(`\`${path}\``) && line.includes(`\`${digest}\``)
    );
  if (!digestRowExists) {
    throw new Error(`verification.md has a stale SHA-256 value for ${path}.`);
  }
}
if (verificationRecord.includes('`not_run`')) {
  throw new Error(
    'verification.md still contains an unexecuted automated lane.'
  );
}
await run('git', ['bundle', 'verify', bundlePath], { cwd: repositoryRoot });
const { stdout: bundleHeads } = await run(
  'git',
  ['bundle', 'list-heads', bundlePath],
  { cwd: repositoryRoot }
);
const bundleRefs = bundleHeads.trim().split(/\r?\n/).filter(Boolean);
if (bundleRefs.length !== 1) {
  throw new Error('Teaching bundle must contain exactly one ref.');
}
const headMatch = bundleRefs[0].match(/^([0-9a-f]{40}) refs\/heads\/main$/);
if (!headMatch) {
  throw new Error('Teaching bundle must contain only refs/heads/main.');
}
const historyRecord = await readFile(
  resolve(repositoryRoot, 'history.md'),
  'utf8'
);
if (!historyRecord.includes(`**Bundle head:** \`${headMatch[1]}\``)) {
  throw new Error('history.md does not record the exact bundle head.');
}

const checkout = await mkdtemp(resolve(tmpdir(), 'status-message-history-'));
try {
  await run('git', [
    'clone',
    '--quiet',
    '--branch',
    'main',
    bundlePath,
    checkout,
  ]);
  assertExactIds(
    'Teaching snapshot files',
    await listFiles(checkout),
    exampleAllowlist
  );
  for (const path of exampleAllowlist) {
    const [current, historical] = await Promise.all([
      readFile(resolve(repositoryRoot, path)),
      readFile(resolve(checkout, path)),
    ]);
    if (!current.equals(historical)) {
      throw new Error(`Teaching snapshot has drifted from ${path}.`);
    }
  }
  const { stdout: subjects } = await run(
    'git',
    ['log', '--reverse', '--format=%s', 'main'],
    { cwd: checkout }
  );
  assertExactIds(
    'Teaching commit subjects',
    subjects.trim().split(/\r?\n/),
    expectedHistorySubjects
  );
  const { stdout: metadata } = await run(
    'git',
    ['log', '--reverse', '--format=%H%x09%P%x09%an <%ae>%x09%cn <%ce>', 'main'],
    { cwd: checkout }
  );
  const commits = metadata
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split('\t'));
  if (commits.length !== expectedHistorySubjects.length) {
    throw new Error('Teaching history has an unexpected commit count.');
  }
  const expectedIdentity = 'Technical Writing Assistant <twa@example.invalid>';
  const introducedPaths = new Set();
  for (const [
    index,
    [commit, parents, author, committer],
  ] of commits.entries()) {
    const parentList = parents ? parents.split(' ') : [];
    const expectedParentCount = index === 0 ? 0 : 1;
    if (parentList.length !== expectedParentCount) {
      throw new Error('Teaching history must be linear from one root commit.');
    }
    if (author !== expectedIdentity || committer !== expectedIdentity) {
      throw new Error(
        'Teaching history contains an unexpected author or committer identity.'
      );
    }
    if (
      !historyRecord.includes(
        String.fromCharCode(96) + commit + String.fromCharCode(96)
      )
    ) {
      throw new Error('history.md does not record checkpoint ' + commit + '.');
    }
    const { stdout: changedPaths } = await run(
      'git',
      ['diff-tree', '--root', '--no-commit-id', '--name-only', '-r', commit],
      { cwd: checkout }
    );
    for (const path of changedPaths.trim().split(/\r?\n/).filter(Boolean)) {
      if (introducedPaths.has(path)) {
        throw new Error(
          'Teaching path ' + path + ' changes in more than one checkpoint.'
        );
      }
      introducedPaths.add(path);
    }
  }
  assertExactIds(
    'Teaching checkpoint path ownership',
    [...introducedPaths].sort(),
    exampleAllowlist
  );
} finally {
  await rm(checkout, { recursive: true, force: true });
}

console.log(
  `Verified ${stepIds.length} tutorial steps, ${snippets.size} snippet bindings, and ${exampleAllowlist.length} teaching snapshot files at ${headMatch[1]}.`
);
