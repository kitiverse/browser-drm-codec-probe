# browser-drm-codec-probe

Zero-dependency browser diagnostic library that probes **W3C Encrypted Media Extensions (EME)** DRM security tiers (`Widevine L1` vs `L3`, `PlayReady SL3000`/`SL2000`, `Apple FairPlay`, `ClearKey`) and **MediaCapabilities** GPU hardware decoding support (`AV1`, `HEVC`, `VP9`, `H.264`, plus `Opus`, `AAC-LC`, `FLAC`, `Dolby Digital Plus EC-3`).

👉 **[Try Live in Browser (No Install)](https://kitiverse.com/hardware/video-drm-codec-tester/)**

## Why This Exists

Streaming quality and playback efficiency in web browsers depend on two browser subsystems rather than raw internet speed alone:

1. **EME DRM Robustness Tier**: Determines whether protected streams unlock `1080p`/`4K` HDR or get capped at `720p`/`480p`.
2. **`MediaCapabilities.decodingInfo()` Flags**: Distinguishes dedicated GPU fixed-function video silicon (`powerEfficient: true`) from high-CPU software fallback (`powerEfficient: false`).

| Platform / Browser Setup | Typical DRM Tier Detected | Video Hardware Codecs | Expected Streaming Cap |
| :--- | :--- | :--- | :--- |
| **Android Chrome / Chromebook (Hardware TEE)** | Widevine `L1` (`HW_SECURE_ALL`) | H.264, VP9, AV1 (newer SoCs) | **1080p / 4K UHD** |
| **Windows Edge (Supported GPU + HDCP 2.2)** | PlayReady `SL3000` (+ Widevine `L3`) | H.264, HEVC, VP9, AV1 | **4K UHD + HDR** |
| **macOS Safari (Apple Silicon / Intel T2+)** | Apple FairPlay (`TEE`) | H.264, HEVC, AV1 (M3+) | **1080p / 4K UHD** |
| **Desktop Chrome / Firefox (Windows, macOS, Linux)** | Widevine `L3` (`SW_SECURE_CRYPTO`) | Varies by GPU driver | **720p / 480p SD** |
| **Headless / Disabled Hardware Acceleration** | `L3` or Unsupported | `powerEfficient: false` (CPU fallback) | **720p or lower (high CPU)** |

*Note: Commercial services also verify display HDCP 2.2 compliance and account plan entitlements on top of EME robustness.*

## Quick Start

```js
import {
  probeDrmKeySystems,
  probeVideoCodecs,
  probeAudioCodecs,
  runFullMediaProbe,
} from 'browser-drm-codec-probe';

const report = await runFullMediaProbe();
console.log(report.summary.headline);
console.log(report.summary);
```

### Example Output (`runFullMediaProbe()`)

```json
{
  "probedAt": "2026-11-24T22:25:00.000Z",
  "environmentSupported": {
    "eme": true,
    "mediaCapabilities": true
  },
  "drm": [
    {
      "id": "widevine",
      "keySystem": "com.widevine.alpha",
      "name": "Google Widevine",
      "supported": true,
      "securityLevel": "L1",
      "hardwareBacked": true,
      "robustness": "HW_SECURE_ALL",
      "encryptionSchemes": ["cenc", "cbcs"]
    }
  ],
  "videoCodecs": [
    {
      "codecId": "av1",
      "name": "AOMedia AV1",
      "supported": true,
      "smooth": true,
      "powerEfficient": true,
      "hardwareAccelerated": true,
      "status": "hardware",
      "maxSupportedResolution": "4K60",
      "maxHardwareResolution": "4K60"
    }
  ],
  "summary": {
    "widevineTier": "L1",
    "highestHardwareDrm": "Widevine L1",
    "estimatedMaxStreamingResolution": "4K / UHD",
    "hardwareAv1": true,
    "hardwareHevc": true,
    "hardwareVp9": true,
    "hardwareH264": true,
    "dolbyDigitalPlus": true,
    "headline": "Hardware DRM (Widevine L1) detected — likely 4K / UHD; GPU decode: AV1, HEVC, VP9, H264."
  }
}
```

## API

- `probeDrmKeySystems(nav?)` — Probes `com.widevine.alpha` (`HW_SECURE_ALL` L1 vs `SW_SECURE_CRYPTO` L3), `com.microsoft.playready` (`3000` vs `2000`), `com.apple.fps`, and `org.w3.clearkey`.
- `probeVideoCodecs(nav?)` — Queries `navigator.mediaCapabilities.decodingInfo()` across `AV1`, `HEVC (H.265)`, `VP9`, and `H.264 (AVC)` at `1080p60` and `4K60`.
- `probeAudioCodecs(nav?)` — Queries `Opus`, `AAC-LC`, `FLAC`, and `Dolby Digital Plus (EC-3)` decode support.
- `runFullMediaProbe(nav?)` — Runs all three probes concurrently and builds a structured JSON report plus a human-readable `summary`.

All functions accept an optional `Navigator`-like object for dependency injection in tests and degrade safely in SSR or Node environments where browser media APIs are absent.

## Running Tests

```bash
node --test
```

## License

MIT — see [LICENSE](./LICENSE).

---

Maintained by [Kitiverse Digital Lab](https://kitiverse.com/) — browser-local [hardware diagnostics](https://kitiverse.com/hardware/) and [document tools](https://kitiverse.com/pdf/).
