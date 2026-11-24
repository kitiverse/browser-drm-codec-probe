# browser-drm-codec-probe

Zero-dependency browser diagnostic library that probes **W3C Encrypted Media Extensions (EME)** DRM security tiers (`Widevine L1 / L2 / L3`, modern `PlayReady SL3000 / SL2000`, `Apple FairPlay`, `ClearKey`), verified `encryptionScheme` support, opt-in **HDCP 2.2** output protection (`getStatusForPolicy`), and **MSE MediaCapabilities** (`type: 'media-source'`) video/audio decoding across `1080p60`, `4K30`, and `4K60`.

👉 **[Try Live in Browser (No Install)](https://kitiverse.com/hardware/video-drm-codec-tester/)**

## Why This Exists

Streaming quality and playback efficiency in browsers depend on multiple interacting subsystems rather than raw internet speed alone:

1. **EME DRM Robustness & Per-Codec Tiers**: Probes Widevine (`HW_SECURE_ALL`, `HW_SECURE_DECODE`, `HW_SECURE_CRYPTO`, `SW_SECURE_DECODE`, `SW_SECURE_CRYPTO`), PlayReady (`com.microsoft.playready.recommendation.3000` / `.clearlead` / `.recommendation` / legacy fallback), Apple FairPlay (`com.apple.fps` with `sinf`/`skd`), and ClearKey across `H.264`, `VP9`, `AV1`, and `HEVC`.
2. **Verified `encryptionScheme` Probing**: Actively tests `cenc`, `cbcs`, and `cbcs-1-9` and checks `access.getConfiguration().videoCapabilities[0].encryptionScheme` so browsers that silently ignore unknown WebIDL dictionary members never produce false positives.
3. **Coupled MSE `MediaCapabilities.decodingInfo()`**: Defaults to `type: 'media-source'` (what adaptive streaming players use) across spec-accurate `1080p60`, `4K30`, and `4K60` codec levels and optionally pairs `keySystemConfiguration` so 4K estimates verify DRM and 4K decode together.
4. **Opt-In HDCP 2.2 Output Policy**: Only instantiates a CDM (`createMediaKeys().getStatusForPolicy({ minHdcpVersion: '2.2' })`) when explicitly requested (`{ checkHdcp: true }`).

| Platform / Browser Setup | Typical DRM Tier Detected | Video Codecs (`1080p60` / `4K30` / `4K60`) | Expected Streaming Cap |
| :--- | :--- | :--- | :--- |
| **Android Chrome / Chromebook (Hardware TEE)** | Widevine `L1` (`HW_SECURE_ALL`) | H.264, VP9, AV1 (newer SoCs) | **1080p / 4K UHD** *(with keybox + HDCP 2.2)* |
| **Windows Chrome (Media Foundation CDM)** | Widevine `L1` (supported GPUs/drivers) or `L3` fallback | H.264, HEVC, VP9, AV1 | **1080p / 4K UHD** *(L1 + HDCP 2.2)* or **720p HD** *(L3)* |
| **Windows Edge (Supported GPU + HDCP 2.2)** | PlayReady `SL3000` (`.recommendation.3000`) + Widevine | H.264, HEVC, VP9, AV1 | **4K UHD + HDR** |
| **macOS Safari** | Apple FairPlay (`com.apple.fps`, platform-managed) | H.264, HEVC, AV1 (M3+) | **4K UHD** *(Apple Silicon / T2+)*; **1080p** *(pre-T2 Intel)* |
| **macOS / Linux Chrome & Firefox** | Widevine `L3` (`SW_SECURE_CRYPTO`) | Varies by GPU driver (`VA-API` / Metal) | **720p HD** desktop *(up to 1080p or 480p SD on L3 mobile)* |
| **Insecure HTTP (`isSecureContext: false`)** | EME Unavailable | Clear `MediaCapabilities` only | **Encrypted playback disabled** *(HTTPS or `localhost` required)* |

*Notes:*
- *`requestMediaKeySystemAccess` resolving for `HW_SECURE_ALL` indicates platform declaration; real-world 4K playback also requires valid device keybox provisioning and HDCP 2.2 output protection.*
- *`powerEfficient` reflects W3C `MediaCapabilities`' power-efficiency heuristic (for example, Chromium's `VideoDecodeStats` can be optimistic on cold profiles, and Firefox varies by OS backend) rather than absolute fixed-function ASIC proof.*

## Quick Start

```js
import {
  probeDrmKeySystems,
  probeVideoCodecs,
  probeAudioCodecs,
  probeHdcpPolicy,
  runFullMediaProbe,
} from 'browser-drm-codec-probe';

// Fast default probe (does not instantiate MediaKeys / HDCP check)
const report = await runFullMediaProbe();
console.log(report.summary.headline);

// Opt-in HDCP 2.2 policy check (instantiates a CDM via createMediaKeys)
const hdcpReport = await runFullMediaProbe(undefined, {
  checkHdcp: true,
  minHdcpVersion: '2.2',
});
console.log(hdcpReport.hdcp);
```

## API

- `DRM_KEY_SYSTEMS`, `EME_VIDEO_CODECS`, `VIDEO_CODEC_PROFILES`, `AUDIO_CODEC_PROFILES` — Exported spec tables (`av01.0.09M.08` / `.12M.08` / `.13M.08`, `hvc1.1.6.L123.90` / `hvc1.2.4.L150.B0` / `.L153.B0`, `vp09.00.41.08` / `.50.08` / `.51.08`, `avc1.64002a` / `.640033` / `.640034`).
- `probeDrmKeySystems(nav?)` — Probes Widevine 5-tier L1/L2/L3 ladder, modern PlayReady `.recommendation.3000` / `.clearlead` / `.recommendation` / legacy fallback, FairPlay (`sinf`, `skd`), and ClearKey across H.264, VP9, AV1, and HEVC, plus `getConfiguration()`-verified `encryptionSchemes`.
- `probeVideoCodecs(nav?, { mediaType?: 'media-source' | 'file' })` — Queries `MediaCapabilities.decodingInfo()` (defaults to `'media-source'`) across `1080p60`, `4K30`, and `4K60`.
- `probeAudioCodecs(nav?, { mediaType?: 'media-source' | 'file' })` — Queries `Opus`, `AAC-LC`, `FLAC` (automatically falling back to `'file'` if `'media-source'` rejects raw `audio/flac`), and `Dolby Digital Plus (EC-3)`.
- `probeEncryptedStreaming(nav, drmResults, videoCodecs, { mediaType? })` — Always forces `type: 'media-source'` (per W3C MediaCapabilities) and uses CMAF/MP4 containers for coupled `MediaCapabilities.decodingInfo({ type: 'media-source', video, keySystemConfiguration })`.
- `probeHdcpPolicy(nav?, { minHdcpVersion?: '2.2', drmResults? })` — Opt-in helper prioritizing `hardwareBacked` key systems first (e.g., PlayReady SL3000 before Widevine L3 on Edge) and checking remaining hardware-backed systems before returning `compliant: false` via `createMediaKeys().getStatusForPolicy({ minHdcpVersion })`.
- `runFullMediaProbe(nav?, { mediaType?, checkHdcp?, minHdcpVersion?, isSecureContext? })` — Runs probes concurrently and builds a structured JSON report including `environmentSupported.isSecureContext` and `summary`.

All functions accept an optional `Navigator`-like object for dependency injection in tests and degrade safely in SSR or Node environments.

## Running Tests

```bash
node --test
```

## License

MIT — see [LICENSE](./LICENSE).

---

Maintained by [Kitiverse Digital Lab](https://kitiverse.com/) — browser-local [hardware diagnostics](https://kitiverse.com/hardware/) and [document tools](https://kitiverse.com/pdf/).
