# Media Tracker

Android app for tracking movies, series and anime (TMDB), rewritten in
React Native CLI 0.88.1 + strict TypeScript.

## First setup on a new PC

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create the git-ignored TMDB key file **`src/config/secrets.ts`** (not `config/` in the project root, that one is not ignored):

   ```ts
   export const TMDB_API_KEY = "…";
   ```

3. Tell Gradle where the Android SDK is: `android/local.properties` with

   ```properties
   sdk.dir=/home/roan/Android/Sdk
   ```

4. Build with **JDK 17** (JDK 27 fails with "Unsupported class file major version 71"):

   ```sh
   sudo archlinux-java set java-17-openjdk
   ```

   or put `JAVA_HOME=/usr/lib/jvm/java-17-openjdk` in front of each Gradle command (as below).

## Daily run (Waydroid)

```sh
waydroid show-full-ui
waydroid status                    # shows the IP, usually 192.168.240.112
adb connect 192.168.240.112:5555
adb reverse tcp:8081 tcp:8081
npm start
```

First `adb connect` on a new PC: accept "Allow USB debugging" inside Waydroid.

## Build and install

Only needed after **native** changes (new native library, `android/` files). JS changes just reload through Metro.

Waydroid:

```sh
adb devices                        # only the device you want should be listed
(cd android && JAVA_HOME=/usr/lib/jvm/java-17-openjdk ./gradlew installDebug)
```

Pixel (USB, only arm64 for a faster build):

```sh
adb disconnect 192.168.240.112:5555   # if Waydroid is connected too
adb devices
(cd android && JAVA_HOME=/usr/lib/jvm/java-17-openjdk ./gradlew installDebug -PreactNativeArchitectures=arm64-v8a)
adb reverse tcp:8081 tcp:8081
npm start
```

Build an APK without a device:

```sh
(cd android && JAVA_HOME=/usr/lib/jvm/java-17-openjdk ./gradlew assembleDebug)
```

The debug build is `com.mediatracker.debug`, so it installs next to the release app. Check the suffix with:

```sh
grep -n applicationIdSuffix android/app/build.gradle
```

## Metro

```sh
npm start                          # normal
npm start -- --reset-cache         # after a new DB migration or odd bundling errors
```

Reload in the app: press <kbd>R</kbd> twice in the Metro terminal, or open the Dev Menu.

## Logs

```sh
adb logcat -c && adb logcat ReactNativeJS:V ReactNative:V *:S
```

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run check                      # all three
```

## Database

New migration after changing `src/db/schema.ts`, then restart Metro with `--reset-cache`:

```sh
npx drizzle-kit generate
```

Copy the app's database out of Waydroid (`run-as` doesn't work there):

```sh
sudo waydroid shell cat /data/data/com.mediatracker.debug/databases/mediaTrackerData > /tmp/mediatracker-app.db
```

(Use `com.mediatracker` instead of `com.mediatracker.debug` for a non-debug build.)

## Waydroid troubleshooting

**`adb connect` says "No route to host"** although the IP is right:

```sh
ip neigh show dev waydroid0        # FAILED → restart Waydroid:
waydroid session stop
sudo systemctl restart waydroid-container
waydroid show-full-ui
```

**Waydroid has no IPv4** (ufw blocks DHCP/forwarding):

```sh
sudo ufw allow 53
sudo ufw allow 67
sudo ufw default allow FORWARD
sudo ufw reload
```

**Screen size** (for `adb shell input swipe` tests):

```sh
adb shell wm size
adb shell input swipe 700 700 80 700 300   # swipe right → left
```

**sudo locked** after 3 wrong passwords (10 minutes): check with `faillock --user roan`.

## Release reminders

- Before a release build, delete `android/app/build`, `android/app/.cxx` and `android/build`.
- Don't use `./gradlew clean` (breaks the CMake config).
- Check the signature: `apksigner verify --print-certs app-release.apk`.
- Still to do before the first release: version from `package.json` and release signing in `android/app/build.gradle`.
