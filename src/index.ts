import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'node:path';

type Platform = 'linux' | 'windows' | 'macos';

function getPlatform(): Platform {
  switch (process.platform) {
    case 'win32':
      return 'windows';
    case 'darwin':
      return 'macos';
    default:
      return 'linux';
  }
}

function parseCsv(input: string): string[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function resolveDownloadUrl(version: string): Promise<string> {
  const platform = getPlatform();

  // Map Node platform to Regolith asset naming. For now we always pick amd64
  // for GitHub-hosted runners.
  let osPart: string;
  let ext: string;

  if (platform === 'windows') {
    osPart = 'windows_amd64';
    ext = 'zip';
  } else if (platform === 'macos') {
    // Prefer amd64 for default macOS runners; adjust to arm64 if needed later.
    osPart = 'darwin_amd64';
    ext = 'tar.gz';
  } else {
    osPart = 'linux_amd64';
    ext = 'tar.gz';
  }

  const assetName = `regolith_${version}_${osPart}.${ext}`;

  if (version === 'latest') {
    // GitHub redirects /releases/latest/download/asset
    return `https://github.com/Bedrock-OSS/regolith/releases/latest/download/${assetName}`;
  }

  return `https://github.com/Bedrock-OSS/regolith/releases/download/${version}/${assetName}`;
}

async function installRegolith(version: string): Promise<string> {
  const url = await resolveDownloadUrl(version);
  core.info(`Downloading Regolith from ${url}`);

  const downloadPath = await tc.downloadTool(url);

  let extractDir: string;
  if (url.endsWith('.zip')) {
    extractDir = await tc.extractZip(downloadPath);
  } else if (url.endsWith('.tar.gz')) {
    extractDir = await tc.extractTar(downloadPath);
  } else {
    throw new Error(`Unsupported Regolith archive format: ${url}`);
  }

  // Cache the directory so future runs can reuse it.
  const cachedDir = await tc.cacheDir(extractDir, 'regolith', version === 'latest' ? 'latest' : version);

  // On Windows the binary might be regolith.exe in the root; on *nix just regolith.
  const platform = getPlatform();
  const binaryName = platform === 'windows' ? 'regolith.exe' : 'regolith';
  const regolithPath = path.join(cachedDir, binaryName);

  core.addPath(cachedDir);
  core.info(`Regolith installed at ${regolithPath}`);

  return regolithPath;
}

async function configureResolvers(regolithBin: string, resolvers: string[], cwd: string): Promise<void> {
  for (const resolver of resolvers) {
    core.info(`Appending resolver to config: ${resolver}`);
    await exec.exec(regolithBin, ['config', 'resolvers', '--append', resolver], { cwd });
  }
}

async function run(): Promise<void> {
  try {
    const regolithVersion = core.getInput('regolith-version') || 'latest';
    const resolvers = parseCsv(core.getInput('resolvers') || '');

    const workspace = process.env.GITHUB_WORKSPACE ?? process.cwd();
    core.info(`Workspace directory: ${workspace}`);

    // Install Regolith
    const regolithBin = await installRegolith(regolithVersion);

    // Configure optional custom resolvers in user config
    await configureResolvers(regolithBin, resolvers, workspace);

    core.info('Regolith has been installed and configured. You can now use `regolith` in subsequent steps.');
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('Unknown error occurred while running setup-regolith Action');
    }
  }
}

run();
