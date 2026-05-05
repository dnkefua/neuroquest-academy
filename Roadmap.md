# NeuroQuest Project Roadmap

Last updated: 2026-04-25 04:30 GST

## Current Deployment State

- Repository: `https://github.com/dnkefua/neuroquest-academy` /
- Branch: `master`
- Latest pushed commit: `8899ce5 Upgrade Grade 8 3D learning experience`
- Firebase project: `neuroquest-academy-2026`
- Live URL: `https://neuroquest-academy-2026.web.app`
- Alternate Firebase URL: `https://neuroquest-academy-2026.firebaseapp.com`
- Firebase Hosting release completed on 2026-04-25 using:
  - `firebase deploy --only hosting --project neuroquest-academy-2026 --non-interactive`
- No `.github` workflow folder exists, so GitHub push alone does not currently auto-deploy Firebase Hosting.

## Live Verification

Verified after Firebase Hosting deployment:

- `https://neuroquest-academy-2026.web.app` returns `200`.
- `https://neuroquest-academy-2026.firebaseapp.com` returns `200`.
- `https://neuroquest-academy-2026.web.app/game/math?grade=8` returns `200`.
- `https://neuroquest-academy-2026.web.app/game/science?grade=8` returns `200`.
- `https://neuroquest-academy-2026.web.app/game-market` returns `200`.
- `https://neuroquest-academy-2026.web.app/games/math-racer-3d` returns `200`.
- `https://neuroquest-academy-2026.web.app/games/maze-pursuit-3d` returns `200`.
- `https://neuroquest-academy-2026.web.app/play/math-racer-3d/index.html` returns `200`.
- `https://neuroquest-academy-2026.web.app/play/maze-pursuit-3d/index.html` returns `200`.

Content checks:

- Live `/play/manifest.json` contains `Velocity Quest 3D`, `Maze Pursuit 3D`, `math-racer-3d`, and `maze-pursuit-3d`.
- Live Math Racer file contains expected game text: `Velocity Quest 3D`, `speed`, `question`, `correct`.
- Live Maze Pursuit file contains expected game text: `Maze Pursuit 3D`, `blink`, `coins`, `monster`.

Headless Chrome smoke test:

- Landing page loaded with the upgraded NeuroQuest Academy landing copy.
- Grade 8 math quest map loaded.
- Grade 8 science quest map loaded.
- Math Racer wrapper loaded.
- Math Racer playable HTML loaded.
- Maze Pursuit playable HTML loaded.
- No runtime exceptions observed.
- One browser warning observed on `/games/math-racer-3d`: iframe has both `allow-scripts` and `allow-same-origin` in its sandbox attribute. This warning does not block loading, but should be reviewed before a security hardening pass.

## Verification Commands Run

- `npm run build` passed.
- `npm run build:firebase` passed.
- `npx.cmd tsc --noEmit` passed before deployment.
- `npx.cmd vitest run` passed before deployment:
  - 13 test files passed.
  - 393 tests passed.

Build warnings still present:

- Several existing `@next/next/no-img-element` warnings.
- Existing React Hook dependency warnings in English/Social/Social Skills quiz scenes, `world-map`, `QuestGuide`, and `StreakClaim`.
- These warnings did not fail the build.

## Major Improvements Completed

- Upgraded the landing page with a high-fidelity 3D showcase component.
- Fixed the React Three Fiber runtime error by aligning `@react-three/fiber`, `@react-three/drei`, and postprocessing versions with React 18.
- Added `ReaderControls` with reader on/off and volume control.
- Reduced repeated TTS reading and moved math quiz reading to a cleaner single prompt.
- Improved Grade 8 one-window layout for iPad, Android tablet, mobile, and laptop.
- Prevented Grade 8 math/science screens from needing scroll in the main learning flow.
- Reworked math and science quest maps into paged grids.
- Reworked Grade 8 math quiz layout so Confirm/Next controls remain visible.
- Reworked math/science clue boxes to stay inside the viewport.
- Added new 3D classroom and lab stage components:
  - `src/components/lesson-stages/MathClassroomStage.tsx`
  - `src/components/lesson-stages/ScienceLabStage.tsx`
- Added richer math explainer animations:
  - negative number line motion
  - ratio/unit-block mixing
  - equation balance model
  - Pythagorean area-proof scene
  - scientific notation decimal movement
  - improved fraction and operation visuals
- Added Grade 8 math explainer inference:
  - `src/app/game/math/utils/explainerMappings.ts`
- Added science visual mapping:
  - `src/app/game/science/utils/visualMappings.ts`
- Added complete Grade 8 school-aligned curriculum data:
  - `src/curriculum/data/grade8-complete.ts`
  - `src/curriculum/data/schoolSources.ts`
- Added two playable learning games:
  - `public/play/math-racer-3d/index.html`
  - `public/play/maze-pursuit-3d/index.html`
- Registered the games in `public/play/manifest.json`.
- Updated `/games/[slug]` pages so the new game slugs export and deploy.
- Ignored large local authoring assets and temporary logs:
  - `Educational videos/`
  - `textbook-folder/`
  - `.next-dev-*.log`
  - `.next-dev-*.err.log`

## Important Deployment Notes

- Firebase Hosting is currently serving a static export from `out`.
- The Firebase deploy predeploy command runs `npm run build:firebase`.
- Static Firebase Hosting does not provide full server-side support for Next API routes. If production AI/TTS API routes must run live, migrate deployment to Firebase App Hosting, Cloud Run, or Cloud Functions.
- Current default hosting config:
  - `firebase.json` hosting public directory: `out`
  - clean URLs enabled
  - trailing slash disabled
- Live deployment worked only after manual Firebase CLI deployment. To automate future pushes, add a GitHub Actions workflow or configure Firebase App Hosting with GitHub integration.

## Known Risks And Follow-Ups

- Blender/UPBGE is connected through the local bridge at `127.0.0.1:9876`.
- Added local Blender automation:
  - `tools/blender-bridge.js`
  - `tools/blender-create-neuroquest-assets.py`
- Generated real Blender-exported GLB assets in `public/models/neuroquest/`:
  - `grade8-math-classroom.glb`
  - `grade8-science-lab.glb`
  - `learning-maze-pursuit.glb`
- Wired Grade 8 math and science 3D stages to load the Blender classroom/lab GLB assets while preserving live concept animations.
- Verification after Blender integration:
  - `npx.cmd tsc --noEmit` passed.
  - `npm.cmd run build:firebase` passed after elevated worker permission.
  - Localhost restarted on `http://localhost:3004`.
  - `/game/math?grade=8` returned `200 OK`.
  - `/game/science?grade=8` returned `200 OK`.
  - `/models/neuroquest/grade8-math-classroom.glb` returned `200 OK`.
  - `/models/neuroquest/learning-maze-pursuit.glb` returned `200 OK`.
- Review iframe sandbox warning on `/games/[slug]`. Decide whether `allow-same-origin` is required for the game iframe or can be removed.
- Add browser tests for the deployed Grade 8 math/science flows, especially:
  - iPad landscape `1024x768`
  - iPad portrait `768x1024`
  - narrow mobile `390x844`
- Add tests for `MathExplainer` concept inference and rendering.
- Review static Hosting limitation for API routes:
  - `/api/tts`
  - `/api/generate-lesson`
  - `/api/npc-reaction`
  - `/api/tutor-explanation`
- Consider Firebase App Hosting or Cloud Run if those APIs are part of the live product experience.
- The Game Market static HTML does not contain game titles directly because content is client-rendered, but live `/play/manifest.json` contains the new entries.
- Existing ESLint warnings should be cleaned in a later quality pass.
- Continue improving Grade 8 science animated explainers with richer 3D lab-specific scenes.
- Continue adding Grade 8 game concepts that blend learning with game mechanics:
  - racing with sign-board questions and speed boosts
  - maze pursuit with coin drain, blink powers, and level progression
  - lab challenge games for science topics

## Handoff For Next Agent

Start here after any context reset:

1. Read this file.
2. Run `git status -sb`.
3. Confirm latest commit is on `origin/master`.
4. If deployment is needed, run:

```powershell
& npm.cmd run build:firebase
& firebase.cmd deploy --only hosting --project neuroquest-academy-2026 --non-interactive
```

5. Verify live routes:

```powershell
$urls = @(
  'https://neuroquest-academy-2026.web.app',
  'https://neuroquest-academy-2026.web.app/game/math?grade=8',
  'https://neuroquest-academy-2026.web.app/game/science?grade=8',
  'https://neuroquest-academy-2026.web.app/games/math-racer-3d',
  'https://neuroquest-academy-2026.web.app/games/maze-pursuit-3d',
  'https://neuroquest-academy-2026.web.app/play/math-racer-3d/index.html',
  'https://neuroquest-academy-2026.web.app/play/maze-pursuit-3d/index.html'
)
foreach ($url in $urls) {
  $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20
  "$($r.StatusCode) $url"
}
```

6. If Firebase auth fails, run `firebase login --reauth` interactively, then deploy again.

## Current Project Direction

The product goal is a premium, iPad-first IB/MYP learning platform where Grade 8 is the most complete reference grade. The experience should feel like high-quality game-based learning, not a worksheet with decoration. All major math and science learning screens should stay inside one viewport without scroll, especially on iPad.

Priority order:

1. Keep Grade 8 math/science stable and one-window.
2. Improve explainer animations so they teach the concept visually before the student answers.
3. Build more learning games that directly reward correct academic reasoning.
4. Expand polished classroom/lab environments.
5. Add deployment automation so GitHub pushes can safely trigger production deployment.
