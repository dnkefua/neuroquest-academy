$ErrorActionPreference = 'Stop'

$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$JdkRoot = Join-Path $Root '.tooling\jdk21'
$SdkRoot = Join-Path $Root '.tooling\android-sdk'
$SigningEnv = Join-Path $Root '.tooling\signing\neuroquest-upload.env.ps1'

if (-not (Test-Path -LiteralPath $JdkRoot)) {
  throw "Missing local JDK 21 at $JdkRoot"
}

if (-not (Test-Path -LiteralPath $SdkRoot)) {
  throw "Missing local Android SDK at $SdkRoot"
}

$env:JAVA_HOME = (Get-ChildItem -LiteralPath $JdkRoot -Directory | Select-Object -First 1).FullName
$env:ANDROID_SDK_ROOT = $SdkRoot
$env:ANDROID_HOME = $SdkRoot
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_SDK_ROOT\cmdline-tools\latest\bin;$env:ANDROID_SDK_ROOT\platform-tools;$env:Path"

if (Test-Path -LiteralPath $SigningEnv) {
  $text = Get-Content -LiteralPath $SigningEnv -Raw
  foreach ($match in [regex]::Matches($text, '\$env:(ANDROID_[A-Z_]+)\s*=\s*''([^'']*)''')) {
    [Environment]::SetEnvironmentVariable($match.Groups[1].Value, $match.Groups[2].Value, 'Process')
  }
} else {
  Write-Warning "No signing env file found at $SigningEnv. Gradle will create an unsigned release bundle."
}

Push-Location $Root
try {
  npm run mobile:assets
  npm run mobile:sync
  & android\gradlew.bat -p android bundleRelease
} finally {
  Pop-Location
}
