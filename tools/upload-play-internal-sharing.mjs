import fs from 'node:fs/promises';
import path from 'node:path';
import { GoogleAuth } from 'google-auth-library';

const packageName = process.env.PLAY_PACKAGE_NAME ?? 'com.ndnanalytics.neuroquest';
const serviceAccountPath =
  process.env.PLAY_SERVICE_ACCOUNT_JSON ??
  path.join(process.cwd(), '.tooling', 'play', 'play-service-account.json');
const aabPath =
  process.env.PLAY_AAB_PATH ??
  path.join(process.cwd(), 'android', 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab');

await assertFile(serviceAccountPath, 'Play service-account JSON');
await assertFile(aabPath, 'Android App Bundle');

const auth = new GoogleAuth({
  keyFile: serviceAccountPath,
  scopes: ['https://www.googleapis.com/auth/androidpublisher'],
});
const client = await auth.getClient();
const tokenResponse = await client.getAccessToken();
const token = typeof tokenResponse === 'string' ? tokenResponse : tokenResponse?.token;

if (!token) {
  throw new Error('Could not obtain an Android Publisher access token.');
}

const body = await fs.readFile(aabPath);
const url = `https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/internalappsharing/${encodeURIComponent(packageName)}/artifacts/bundle?uploadType=media`;
const response = await fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/octet-stream',
    'Content-Length': body.length.toString(),
  },
  body,
});

if (!response.ok) {
  throw new Error(`Google Play API ${response.status} ${response.statusText}: ${await response.text()}`);
}

const artifact = await response.json();
console.log(`Uploaded ${path.relative(process.cwd(), aabPath)} to Google Play Internal App Sharing.`);
console.log(`Download URL: ${artifact.downloadUrl}`);
console.log(`SHA256: ${artifact.sha256}`);
console.log(`Certificate fingerprint: ${artifact.certificateFingerprint}`);

async function assertFile(filePath, label) {
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) {
      throw new Error(`${label} path is not a file: ${filePath}`);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`${label} not found at ${filePath}`);
    }
    throw error;
  }
}
