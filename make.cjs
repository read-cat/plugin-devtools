const fs = require('fs');
const { join, relative } = require('path');
const crypto = require('crypto');
const { gzipSync } = require('zlib');
const pkg = require('./package.json');
const { execSync } = require('child_process');

const FILE_HEAD = Buffer.from([0x52, 0x50, 0x44, 0x54]);
const commitId = execSync('git log -1 --pretty=format:%H', { encoding: 'utf-8' }).trim();

const dist = join(__dirname, 'dist');
const readDir = (path) => {
  const files = fs.readdirSync(path, 'utf-8');
  const results = [];
  for (const file of files) {
    const filePath = join(path, file);
    if (fs.statSync(filePath).isDirectory()) {
      results.push(...readDir(filePath));
    } else {
      results.push(filePath);
    }
  }
  return results;
}
const hashs = [];
const files = {};
for (const file of readDir(dist)) {
  const hash = crypto.createHash('sha256');
  const buf = fs.readFileSync(file);
  hash.update(buf);
  hashs.push({
    file: relative(dist, file),
    sha256: hash.digest('hex')
  });
  files[relative(dist, file)] = Array.from(buf);
}
const date = new Date();
const version = pkg.version + (pkg.branch !== 'main' ? `-${pkg.branch}` : '');
const vs = pkg.version.split('.');
const versionCode = Number(`${vs[0]}.${vs.slice(1).join('')}`);
const metadata = JSON.stringify({
  name: pkg.name,
  version,
  branch: pkg.branch,
  versionCode,
  date: date.toISOString(),
  commit: commitId,
  files: hashs
}, undefined, 2);
fs.writeFileSync(join(dist, 'metadata.json'), metadata, {
  encoding: 'utf-8'
});
files['metadata.json'] = metadata;
const gzip = gzipSync(Buffer.from(JSON.stringify(files)));
const rpdt = Buffer.concat([FILE_HEAD, gzip]);

fs.writeFileSync(join(dist, `PluginDevtools-${version}.${commitId.substring(0, 8)}.rpdt`), rpdt);
