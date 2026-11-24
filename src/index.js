/**
 * browser-drm-codec-probe
 * Zero-dependency W3C EME DRM & MediaCapabilities hardware decode inspector.
 */

const SAMPLE_VIDEO = 'video/mp4; codecs="avc1.64002a"';

export const DRM_KEY_SYSTEMS = [
  {
    id: 'widevine',
    keySystem: 'com.widevine.alpha',
    name: 'Google Widevine',
    encryptionSchemes: ['cenc', 'cbcs'],
    candidates: [
      { initDataTypes: ['cenc'], robustness: 'HW_SECURE_ALL', securityLevel: 'L1', hardwareBacked: true },
      { initDataTypes: ['cenc'], robustness: 'SW_SECURE_CRYPTO', securityLevel: 'L3', hardwareBacked: false },
      { initDataTypes: ['cenc'], robustness: undefined, securityLevel: 'L3', hardwareBacked: false },
    ],
  },
  {
    id: 'playready',
    keySystem: 'com.microsoft.playready',
    name: 'Microsoft PlayReady',
    encryptionSchemes: ['cenc', 'cbcs'],
    candidates: [
      { initDataTypes: ['cenc'], robustness: '3000', securityLevel: 'SL3000', hardwareBacked: true },
      { initDataTypes: ['cenc'], robustness: '2000', securityLevel: 'SL2000', hardwareBacked: false },
      { initDataTypes: ['cenc'], robustness: undefined, securityLevel: 'SL2000', hardwareBacked: false },
    ],
  },
  {
    id: 'fairplay',
    keySystem: 'com.apple.fps',
    name: 'Apple FairPlay Streaming',
    encryptionSchemes: ['cbcs'],
    candidates: [
      { initDataTypes: ['sinf', 'skd', 'cenc'], robustness: undefined, securityLevel: 'TEE', hardwareBacked: true },
    ],
  },
  {
    id: 'clearkey',
    keySystem: 'org.w3.clearkey',
    name: 'W3C ClearKey',
    encryptionSchemes: ['cenc'],
    candidates: [
      { initDataTypes: ['cenc', 'keyids'], robustness: undefined, securityLevel: 'ClearKey', hardwareBacked: false },
    ],
  },
];

export const VIDEO_CODEC_PROFILES = [
  {
    codecId: 'av1',
    name: 'AOMedia AV1',
    contentType: 'video/mp4; codecs="av01.0.08M.08"',
    profiles: [
      { resolution: '1080p60', width: 1920, height: 1080, framerate: 60, bitrate: 5_000_000 },
      { resolution: '4K60', width: 3840, height: 2160, framerate: 60, bitrate: 20_000_000 },
    ],
  },
  {
    codecId: 'hevc',
    name: 'HEVC (H.265)',
    contentType: 'video/mp4; codecs="hvc1.1.6.L120.90"',
    profiles: [
      { resolution: '1080p60', width: 1920, height: 1080, framerate: 60, bitrate: 6_000_000 },
      { resolution: '4K60', width: 3840, height: 2160, framerate: 60, bitrate: 22_000_000 },
    ],
  },
  {
    codecId: 'vp9',
    name: 'Google VP9',
    contentType: 'video/webm; codecs="vp09.00.41.08"',
    profiles: [
      { resolution: '1080p60', width: 1920, height: 1080, framerate: 60, bitrate: 6_000_000 },
      { resolution: '4K60', width: 3840, height: 2160, framerate: 60, bitrate: 22_000_000 },
    ],
  },
  {
    codecId: 'h264',
    name: 'H.264 (AVC)',
    contentType: 'video/mp4; codecs="avc1.64002a"',
    profiles: [
      { resolution: '1080p60', width: 1920, height: 1080, framerate: 60, bitrate: 8_000_000 },
      { resolution: '4K60', width: 3840, height: 2160, framerate: 60, bitrate: 28_000_000 },
    ],
  },
];

export const AUDIO_CODEC_PROFILES = [
  { codecId: 'opus', name: 'Opus', contentType: 'audio/webm; codecs="opus"', channels: '2', bitrate: 128_000, samplerate: 48_000 },
  { codecId: 'aac', name: 'AAC-LC', contentType: 'audio/mp4; codecs="mp4a.40.2"', channels: '2', bitrate: 192_000, samplerate: 48_000 },
  { codecId: 'flac', name: 'FLAC', contentType: 'audio/flac', channels: '2', bitrate: 1_000_000, samplerate: 48_000 },
  { codecId: 'ec3', name: 'Dolby Digital Plus (EC-3)', contentType: 'audio/mp4; codecs="ec-3"', channels: '6', bitrate: 384_000, samplerate: 48_000 },
];

const resolveNavigator = (nav) =>
  nav !== undefined ? nav : typeof globalThis !== 'undefined' ? globalThis.navigator : undefined;

const classifyStatus = (supported, powerEfficient) =>
  !supported ? 'unsupported' : powerEfficient ? 'hardware' : 'software';

async function safeDecodingInfo(nav, config) {
  if (!nav?.mediaCapabilities || typeof nav.mediaCapabilities.decodingInfo !== 'function') {
    return { supported: false, smooth: false, powerEfficient: false };
  }
  try {
    const info = await nav.mediaCapabilities.decodingInfo(config);
    const supported = Boolean(info?.supported);
    return {
      supported,
      smooth: supported && Boolean(info?.smooth),
      powerEfficient: supported && Boolean(info?.powerEfficient),
    };
  } catch {
    return { supported: false, smooth: false, powerEfficient: false };
  }
}

export async function probeDrmKeySystems(nav) {
  const targetNav = resolveNavigator(nav);
  const canProbe = Boolean(targetNav && typeof targetNav.requestMediaKeySystemAccess === 'function');
  const results = [];

  for (const spec of DRM_KEY_SYSTEMS) {
    let matched = null;
    if (canProbe) {
      for (const candidate of spec.candidates) {
        const videoCap = candidate.robustness
          ? { contentType: SAMPLE_VIDEO, robustness: candidate.robustness }
          : { contentType: SAMPLE_VIDEO };
        try {
          await targetNav.requestMediaKeySystemAccess(spec.keySystem, [
            { initDataTypes: candidate.initDataTypes, videoCapabilities: [videoCap] },
          ]);
          matched = candidate;
          break;
        } catch {
          // Try next robustness tier.
        }
      }
    }

    results.push({
      id: spec.id,
      keySystem: spec.keySystem,
      name: spec.name,
      supported: Boolean(matched),
      securityLevel: matched ? matched.securityLevel : 'Unsupported',
      hardwareBacked: Boolean(matched?.hardwareBacked),
      robustness: matched?.robustness ?? (matched?.hardwareBacked ? 'hardware-tee' : null),
      encryptionSchemes: matched ? [...spec.encryptionSchemes] : [],
    });
  }

  return results;
}

export async function probeVideoCodecs(nav) {
  const targetNav = resolveNavigator(nav);
  const results = [];

  for (const codec of VIDEO_CODEC_PROFILES) {
    const profileResults = [];
    for (const profile of codec.profiles) {
      const caps = await safeDecodingInfo(targetNav, {
        type: 'file',
        video: {
          contentType: codec.contentType,
          width: profile.width,
          height: profile.height,
          bitrate: profile.bitrate,
          framerate: profile.framerate,
        },
      });
      profileResults.push({
        ...profile,
        ...caps,
        status: classifyStatus(caps.supported, caps.powerEfficient),
      });
    }

    const supported = profileResults.some((p) => p.supported);
    const powerEfficient = profileResults.some((p) => p.supported && p.powerEfficient);
    const smooth = profileResults.some((p) => p.supported && p.smooth);
    const maxSupported = [...profileResults].reverse().find((p) => p.supported);
    const maxHardware = [...profileResults].reverse().find((p) => p.supported && p.powerEfficient);

    results.push({
      codecId: codec.codecId,
      name: codec.name,
      contentType: codec.contentType,
      supported,
      smooth,
      powerEfficient,
      hardwareAccelerated: powerEfficient,
      status: classifyStatus(supported, powerEfficient),
      maxSupportedResolution: maxSupported?.resolution ?? null,
      maxHardwareResolution: maxHardware?.resolution ?? null,
      profiles: profileResults,
    });
  }

  return results;
}

export async function probeAudioCodecs(nav) {
  const targetNav = resolveNavigator(nav);
  const results = [];

  for (const codec of AUDIO_CODEC_PROFILES) {
    const caps = await safeDecodingInfo(targetNav, {
      type: 'file',
      audio: {
        contentType: codec.contentType,
        channels: codec.channels,
        bitrate: codec.bitrate,
        samplerate: codec.samplerate,
      },
    });
    results.push({
      codecId: codec.codecId,
      name: codec.name,
      contentType: codec.contentType,
      channels: codec.channels,
      ...caps,
    });
  }

  return results;
}

export async function runFullMediaProbe(nav) {
  const targetNav = resolveNavigator(nav);
  const [drm, videoCodecs, audioCodecs] = await Promise.all([
    probeDrmKeySystems(targetNav),
    probeVideoCodecs(targetNav),
    probeAudioCodecs(targetNav),
  ]);

  const widevine = drm.find((d) => d.id === 'widevine');
  const playready = drm.find((d) => d.id === 'playready');
  const fairplay = drm.find((d) => d.id === 'fairplay');
  const widevineTier = widevine?.supported ? widevine.securityLevel : 'Unsupported';

  let highestHardwareDrm = null;
  if (widevine?.supported && widevine.hardwareBacked) highestHardwareDrm = 'Widevine L1';
  else if (playready?.supported && playready.hardwareBacked) highestHardwareDrm = 'PlayReady SL3000';
  else if (fairplay?.supported && fairplay.hardwareBacked) highestHardwareDrm = 'FairPlay TEE';

  const hasSoftwareDrm = Boolean(widevine?.supported || playready?.supported);
  const byCodec = Object.fromEntries(videoCodecs.map((c) => [c.codecId, c]));
  const has4kHardware = videoCodecs.some((c) => c.maxHardwareResolution === '4K60');

  let estimatedMaxStreamingResolution = 'Unverified (No EME DRM)';
  if (highestHardwareDrm) {
    estimatedMaxStreamingResolution = has4kHardware ? '4K / UHD' : '1080p HD (Hardware DRM)';
  } else if (hasSoftwareDrm) {
    estimatedMaxStreamingResolution = '720p SD (Software DRM Cap)';
  }

  const hwCodecs = videoCodecs.filter((c) => c.hardwareAccelerated).map((c) => c.codecId.toUpperCase());
  const hwLabel = hwCodecs.length ? hwCodecs.join(', ') : 'None (CPU software decode)';
  let headline;
  if (highestHardwareDrm) {
    headline = `Hardware DRM (${highestHardwareDrm}) detected — likely ${estimatedMaxStreamingResolution}; GPU decode: ${hwLabel}.`;
  } else if (hasSoftwareDrm) {
    headline = `Software DRM only (${widevine?.supported ? `Widevine ${widevineTier}` : 'PlayReady SL2000'}) — streaming typically capped at 720p; GPU decode: ${hwLabel}.`;
  } else {
    headline = `No commercial EME DRM key system available; GPU decode: ${hwLabel}.`;
  }

  return {
    probedAt: new Date().toISOString(),
    environmentSupported: {
      eme: Boolean(targetNav && typeof targetNav.requestMediaKeySystemAccess === 'function'),
      mediaCapabilities: Boolean(targetNav?.mediaCapabilities && typeof targetNav.mediaCapabilities.decodingInfo === 'function'),
    },
    drm,
    videoCodecs,
    audioCodecs,
    summary: {
      widevineTier,
      highestHardwareDrm,
      estimatedMaxStreamingResolution,
      hardwareAv1: Boolean(byCodec.av1?.hardwareAccelerated),
      hardwareHevc: Boolean(byCodec.hevc?.hardwareAccelerated),
      hardwareVp9: Boolean(byCodec.vp9?.hardwareAccelerated),
      hardwareH264: Boolean(byCodec.h264?.hardwareAccelerated),
      dolbyDigitalPlus: Boolean(audioCodecs.find((a) => a.codecId === 'ec3')?.supported),
      headline,
    },
  };
}
