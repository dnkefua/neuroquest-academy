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
const releaseName = process.env.PLAY_RELEASE_NAME ?? 'NeuroQuest Academy 1.0';
const track = process.env.PLAY_TRACK ?? 'internal';

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

const baseUrl = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(packageName)}`;
const uploadBaseUrl = `https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/${encodeURIComponent(packageName)}`;

const edit = await jsonRequest(`${baseUrl}/edits`, {
  method: 'POST',
  headers: authHeaders(token),
});

try {
  const bundle = await uploadBundle(`${uploadBaseUrl}/edits/${encodeURIComponent(edit.id)}/bundles?uploadType=media`, token, aabPath);
  const versionCode = bundle.versionCode?.toString();

  if (!versionCode) {
    throw new Error(`Bundle uploaded, but no versionCode was returned: ${JSON.stringify(bundle)}`);
  }

  await jsonRequest(`${baseUrl}/edits/${encodeURIComponent(edit.id)}/tracks/${encodeURIComponent(track)}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({
      track,
      releases: [
        {
          name: releaseName,
          status: 'completed',
          versionCodes: [versionCode],
        },
      ],
    }),
  });

  await jsonRequest(`${baseUrl}/edits/${encodeURIComponent(edit.id)}:commit`, {
    method: 'POST',
    headers: authHeaders(token),
  });

  console.log(`Uploaded ${path.relative(process.cwd(), aabPath)} to Play ${track} testing for ${packageName}.`);
  console.log(`Version code: ${versionCode}`);
} catch (error) {
  await tryDeleteEdit(baseUrl, edit.id, token);
  throw error;
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function uploadBundle(url, token, filePath) {
  const body = await fs.readFile(filePath);
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
    throw new Error(await formatError(response));
  }

  return response.json();
}

async function jsonRequest(url, init) {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(await formatError(response));
  }

  return response.json();
}

async function formatError(response) {
  const text = await response.text();
  return `Google Play API ${response.status} ${response.statusText}: ${text}`;
}

async function tryDeleteEdit(baseUrl, editId, token) {
  try {
    await fetch(`${baseUrl}/edits/${encodeURIComponent(editId)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    // Best-effort cleanup only.
  }
}

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
