# Mobile Store Testing

This repo now has Capacitor Android and iOS shells for the existing static Next.js export.

## App Identity

- App name: `NeuroQuest Academy`
- Android package ID: `com.ndnanalytics.neuroquest`
- iOS bundle ID: `com.ndnanalytics.neuroquest`
- Web source directory copied into native apps: `out`

Treat the package and bundle ID as permanent before creating store listings.

## Local Native Sync

```powershell
npm ci
npm run mobile:assets
npm run mobile:sync
```

Use the bundled static app by default. To point the native shell at the deployed Firebase site for testing, run sync with:

```powershell
$env:CAPACITOR_SERVER_URL='https://neuroquest-academy-2026.web.app'
npm run mobile:sync
Remove-Item Env:\CAPACITOR_SERVER_URL
```

The bundled static app has the same limitation as Firebase static hosting: Next API routes under `/api/*` are not available unless those APIs are deployed separately or the shell is pointed at a server that provides them.

## Android Internal Testing

Prerequisites:

- Google Play Developer account with a Play Console app using `com.ndnanalytics.neuroquest`
- Play App Signing enabled
- JDK 21 and Android SDK installed locally or in CI
- Release keystore kept outside git
- Optional Play Developer API service-account JSON for CLI uploads

This workspace has a portable Android toolchain installed under ignored `.tooling/`:

- JDK 21: `.tooling/jdk21`
- Android SDK: `.tooling/android-sdk`
- Upload keystore: `.tooling/signing/neuroquest-upload.jks`
- Signing env loader: `.tooling/signing/neuroquest-upload.env.ps1`

Build a signed Android App Bundle:

```powershell
npm run mobile:android:release
```

Expected output:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

Current local upload certificate:

```text
Alias: neuroquest-upload
SHA256: BB:27:1C:0B:CE:BE:EB:63:33:F1:29:44:B5:01:1A:FD:27:A9:99:A4:4E:A4:74:7C:E0:AC:B1:47:3B:8E:BA:A4
Valid until: 2053-09-10
```

Upload that AAB to the Play Console internal testing track, or use Fastlane once a Play API service account exists:

```powershell
fastlane supply --json_key C:\secure\play-service-account.json --package_name com.ndnanalytics.neuroquest --aab android/app/build/outputs/bundle/release/app-release.aab --track internal
```

Or use the repo-native uploader:

```powershell
New-Item -ItemType Directory -Force .tooling\play
# Put the Play Console service-account JSON at:
# .tooling\play\play-service-account.json
npm run mobile:play:internal
```

For a quick Internal App Sharing link instead of a track release:

```powershell
npm run mobile:play:share
```

Required Play Console setup:

- Create the app manually in Play Console with package name `com.ndnanalytics.neuroquest`.
- Link a Google Cloud service account under Play Console API access.
- Grant that service account permission to release apps to testing tracks.
- Add testers to the internal testing track.

## iOS TestFlight

Prerequisites:

- macOS build host with current Xcode
- Apple Developer Program membership
- App Store Connect app using `com.ndnanalytics.neuroquest`
- Distribution certificate and provisioning profile, or automatic signing configured in Xcode
- App Store Connect API key for CI uploads

On a Mac:

```bash
npm ci
npm run mobile:assets
npm run mobile:sync
open ios/App/App.xcodeproj
```

In Xcode, set the development team, archive the `App` scheme, then distribute the archive to App Store Connect for TestFlight.

## Current Blockers In This Workspace

- No Play Console service-account JSON or authenticated Play Console upload session is present.
- No Apple Developer/App Store Connect API key, certificate, or provisioning profile is present.
- A local signed Android release bundle has been built, but Play Console upload still requires Play Console access or a Play Developer API service account.
- This is Windows, so iOS archive and TestFlight upload must run on macOS/Xcode or a macOS CI runner.
