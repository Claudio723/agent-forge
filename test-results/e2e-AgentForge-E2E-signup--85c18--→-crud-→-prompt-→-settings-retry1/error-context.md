# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> AgentForge E2E >> signup → onboarding → dashboard → crud → prompt → settings
- Location: tests/e2e.spec.ts:8:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> /tmp/playwright-browsers/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --no-sandbox --disable-setuid-sandbox --user-data-dir=/var/folders/8h/hmbwlg7d7xs_dhw22049zp680000gn/T/playwright_chromiumdev_profile-zfIgL2 --remote-debugging-pipe --no-startup-window
<launched> pid=66607
[pid=66607][err] Received signal 11 SEGV_ACCERR 000000000010
[pid=66607][err]  [0x0001095a5250]
[pid=66607][err]  [0x0001095a88ec]
[pid=66607][err]  [0x000186303744]
[pid=66607][err]  [0x000106c71768]
[pid=66607][err]  [0x000106c71768]
[pid=66607][err]  [0x0001065be738]
[pid=66607][err]  [0x000105d436f0]
[pid=66607][err]  [0x000107899118]
[pid=66607][err]  [0x000107899ec0]
[pid=66607][err]  [0x000185f3be00]
[pid=66607][err] [end of stack trace]
Call log:
  - <launching> /tmp/playwright-browsers/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --no-sandbox --disable-setuid-sandbox --user-data-dir=/var/folders/8h/hmbwlg7d7xs_dhw22049zp680000gn/T/playwright_chromiumdev_profile-zfIgL2 --remote-debugging-pipe --no-startup-window
  - <launched> pid=66607
  - [pid=66607][err] Received signal 11 SEGV_ACCERR 000000000010
  - [pid=66607][err]  [0x0001095a5250]
  - [pid=66607][err]  [0x0001095a88ec]
  - [pid=66607][err]  [0x000186303744]
  2 × [pid=66607][err]  [0x000106c71768]
  - [pid=66607][err]  [0x0001065be738]
  - [pid=66607][err]  [0x000105d436f0]
  - [pid=66607][err]  [0x000107899118]
  - [pid=66607][err]  [0x000107899ec0]
  - [pid=66607][err]  [0x000185f3be00]
  - [pid=66607][err] [end of stack trace]
  - [pid=66607] <gracefully close start>
  - [pid=66607] <kill>
  - [pid=66607] <will force kill>
  - [pid=66607] exception while trying to kill process: Error: kill ESRCH
  - [pid=66607] <process did exit: exitCode=null, signal=SIGSEGV>
  - [pid=66607] starting temporary directories cleanup
  - [pid=66607] finished temporary directories cleanup
  - [pid=66607] <gracefully close end>

```