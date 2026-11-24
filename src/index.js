/**
 * browser-drm-codec-probe v1.1.1
 * Zero-dependency W3C EME DRM, HDCP 2.2 policy & MSE MediaCapabilities hardware decode inspector.
 */

export const EME_VIDEO_CODECS = [
  { codecId: 'h264', contentType: 'video/mp4; codecs="avc1.64002a"' },
  { codecId: 'vp9', contentType: 'video/mp4; codecs="vp09.00.41.08"' },
  { codecId: 'av1', contentType: 'video/mp4; codecs="av01.0.09M.08"' },
  { codecId: 'hevc', contentType: 'video/mp4; codecs="hvc1.1.6.L123.90"' },
];

export const DRM_KEY_SYSTEMS = [
  {
    id: 'widevine',
    keySystem: 'com.widevine.alpha',
    name: 'Google Widevine',
    candidateEncryptionSchemes: ['cenc', 'cbcs', 'cbcs-1-9'],
    candidates: [
      {
        keySystem: 'com.widevine.alpha',
        initDataTypes: ['cenc'],
        robustness: 'HW_SECURE_ALL',
        securityLevel: 'L1',
        hardwareBacked: true,
        teeCrypto: true,
        legacy: false,
        robustnessLabel: 'Hardware TEE (Crypto + Decode + Output)',
      },
      {
        keySystem: 'com.widevine.alpha',
        initDataTypes: ['cenc'],
        robustness: 'HW_SECURE_DECODE',
        securityLevel: 'L1',
        hardwareBacked: true,
        teeCrypto: true,
        legacy: false,
        robustnessLabel: 'Hardware TEE Crypto + Secure Decode (Render Path May Differ)',
      },
      {
        keySystem: 'com.widevine.alpha',
        initDataTypes: ['cenc'],
        robustness: 'HW_SECURE_CRYPTO',
        securityLevel: 'L2',
        hardwareBacked: false,
        teeCrypto: true,
        legacy: false,
        robustnessLabel: 'Widevine L2 (Hardware TEE Crypto / Software Decode)',
      },
      {
        keySystem: 'com.widevine.alpha',
        initDataTypes: ['cenc'],
        robustness: 'SW_SECURE_DECODE',
        securityLevel: 'L3',
        hardwareBacked: false,
        teeCrypto: false,
        legacy: false,
        robustnessLabel: 'Software Decode (L3)',
      },
      {
        keySystem: 'com.widevine.alpha',
        initDataTypes: ['cenc'],
        robustness: 'SW_SECURE_CRYPTO',
        securityLevel: 'L3',
        hardwareBacked: false,
        teeCrypto: false,
        legacy: false,
        robustnessLabel: 'Software Crypto & Decode (L3)',
      },
    ],
  },
  {
    id: 'playready',
    keySystem: 'com.microsoft.playready.recommendation',
    name: 'Microsoft PlayReady',
    candidateEncryptionSchemes: ['cenc', 'cbcs', 'cbcs-1-9'],
    candidates: [
      {
        keySystem: 'com.microsoft.playready.recommendation.3000',
        initDataTypes: ['cenc'],
        robustness: undefined,
        securityLevel: 'SL3000',
        hardwareBacked: true,
        teeCrypto: true,
        legacy: false,
        robustnessLabel: 'PlayReady SL3000 (Modern Recommendation)',
      },
      {
        keySystem: 'com.microsoft.playready.recommendation.3000',
        initDataTypes: ['cenc'],
        robustness: '3000',
        securityLevel: 'SL3000',
        hardwareBacked: true,
        teeCrypto: true,
        legacy: false,
        robustnessLabel: 'PlayReady SL3000 (Modern Recommendation)',
      },
      {
        keySystem: 'com.microsoft.playready.recommendation.3000.clearlead',
        initDataTypes: ['cenc'],
        robustness: undefined,
        securityLevel: 'SL3000',
        hardwareBacked: true,
        teeCrypto: true,
        legacy: false,
        robustnessLabel: 'PlayReady SL3000 ClearLead (Modern Recommendation)',
      },
      {
        keySystem: 'com.microsoft.playready.recommendation.3000.clearlead',
        initDataTypes: ['cenc'],
        robustness: '3000',
        securityLevel: 'SL3000',
        hardwareBacked: true,
        teeCrypto: true,
        legacy: false,
        robustnessLabel: 'PlayReady SL3000 ClearLead (Modern Recommendation)',
      },
      {
        keySystem: 'com.microsoft.playready.recommendation',
        initDataTypes: ['cenc'],
        robustness: '3000',
        securityLevel: 'SL3000',
        hardwareBacked: true,
        teeCrypto: true,
        legacy: false,
        robustnessLabel: 'PlayReady SL3000 (Recommendation)',
      },
      {
        keySystem: 'com.microsoft.playready.recommendation',
        initDataTypes: ['cenc'],
        robustness: '2000',
        securityLevel: 'SL2000',
        hardwareBacked: false,
        teeCrypto: false,
        legacy: false,
        robustnessLabel: 'PlayReady SL2000 (Recommendation)',
      },
      {
        keySystem: 'com.microsoft.playready.recommendation',
        initDataTypes: ['cenc'],
        robustness: undefined,
        securityLevel: 'SL2000',
        hardwareBacked: false,
        teeCrypto: false,
        legacy: false,
        robustnessLabel: 'PlayReady SL2000 (Default Recommendation)',
      },
      {
        keySystem: 'com.microsoft.playready',
        initDataTypes: ['cenc'],
        robustness: '3000',
        securityLevel: 'SL3000',
        hardwareBacked: true,
        teeCrypto: true,
        legacy: true,
        robustnessLabel: 'Legacy EdgeHTML PlayReady (SL3000)',
      },
      {
        keySystem: 'com.microsoft.playready',
        initDataTypes: ['cenc'],
        robustness: '2000',
        securityLevel: 'SL2000',
        hardwareBacked: false,
        teeCrypto: false,
        legacy: true,
        robustnessLabel: 'Legacy EdgeHTML PlayReady (SL2000)',
      },
      {
        keySystem: 'com.microsoft.playready',
        initDataTypes: ['cenc'],
        robustness: undefined,
        securityLevel: 'SL2000',
        hardwareBacked: false,
        teeCrypto: false,
        legacy: true,
        robustnessLabel: 'Legacy EdgeHTML PlayReady (SL2000)',
      },
    ],
  },
  {
    id: 'fairplay',
    keySystem: 'com.apple.fps',
    name: 'Apple FairPlay Streaming',
    candidateEncryptionSchemes: ['cbcs', 'cbcs-1-9'],
    candidates: [
      {
        keySystem: 'com.apple.fps',
        initDataTypes: ['sinf', 'skd'],
        robustness: undefined,
        securityLevel: 'FairPlay (platform-managed)',
        hardwareBacked: null,
        teeCrypto: null,
        legacy: false,
        robustnessLabel: 'Platform-managed (EME does not expose FairPlay hardware vs. legacy tier)',
      },
    ],
  },
  {
    id: 'clearkey',
    keySystem: 'org.w3.clearkey',
    name: 'W3C ClearKey',
    candidateEncryptionSchemes: ['cenc', 'cbcs'],
    candidates: [
      {
        keySystem: 'org.w3.clearkey',
        initDataTypes: ['cenc', 'keyids'],
        robustness: undefined,
        securityLevel: 'ClearKey',
        hardwareBacked: false,
        teeCrypto: false,
        legacy: false,
        robustnessLabel: 'Baseline W3C ClearKey',
      },
    ],
  },
];

export const VIDEO_CODEC_PROFILES = [
  {
    codecId: 'av1',
    name: 'AOMedia AV1',
    hdrNote: '10-bit HDR Main profile uses av01.0.13M.10 at 4K60.',
    profiles: [
      { resolution: '1080p60', contentType: 'video/mp4; codecs="av01.0.09M.08"', width: 1920, height: 1080, framerate: 60, bitrate: 5_000_000 },
      { resolution: '4K30', contentType: 'video/mp4; codecs="av01.0.12M.08"', width: 3840, height: 2160, framerate: 30, bitrate: 15_000_000 },
      { resolution: '4K60', contentType: 'video/mp4; codecs="av01.0.13M.08"', width: 3840, height: 2160, framerate: 60, bitrate: 20_000_000 },
    ],
  },
  {
    codecId: 'hevc',
    name: 'HEVC (H.265)',
    hdrNote: '1080p60 probes 8-bit Main (hvc1.1); 4K30 and 4K60 probe 10-bit Main 10 (hvc1.2).',
    profiles: [
      { resolution: '1080p60', contentType: 'video/mp4; codecs="hvc1.1.6.L123.90"', width: 1920, height: 1080, framerate: 60, bitrate: 6_000_000 },
      { resolution: '4K30', contentType: 'video/mp4; codecs="hvc1.2.4.L150.B0"', width: 3840, height: 2160, framerate: 30, bitrate: 16_000_000 },
      { resolution: '4K60', contentType: 'video/mp4; codecs="hvc1.2.4.L153.B0"', width: 3840, height: 2160, framerate: 60, bitrate: 22_000_000 },
    ],
  },
  {
    codecId: 'vp9',
    name: 'Google VP9',
    profiles: [
      {
        resolution: '1080p60',
        contentType: 'video/webm; codecs="vp09.00.41.08"',
        encryptedContentType: 'video/mp4; codecs="vp09.00.41.08"',
        width: 1920,
        height: 1080,
        framerate: 60,
        bitrate: 6_000_000,
      },
      {
        resolution: '4K30',
        contentType: 'video/webm; codecs="vp09.00.50.08"',
        encryptedContentType: 'video/mp4; codecs="vp09.00.50.08"',
        width: 3840,
        height: 2160,
        framerate: 30,
        bitrate: 16_000_000,
      },
      {
        resolution: '4K60',
        contentType: 'video/webm; codecs="vp09.00.51.08"',
        encryptedContentType: 'video/mp4; codecs="vp09.00.51.08"',
        width: 3840,
        height: 2160,
        framerate: 60,
        bitrate: 22_000_000,
      },
    ],
  },
  {
    codecId: 'h264',
    name: 'H.264 (AVC)',
    profiles: [
      { resolution: '1080p60', contentType: 'video/mp4; codecs="avc1.64002a"', width: 1920, height: 1080, framerate: 60, bitrate: 8_000_000 },
      { resolution: '4K30', contentType: 'video/mp4; codecs="avc1.640033"', width: 3840, height: 2160, framerate: 30, bitrate: 20_000_000 },
      { resolution: '4K60', contentType: 'video/mp4; codecs="avc1.640034"', width: 3840, height: 2160, framerate: 60, bitrate: 28_000_000 },
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

const resolveIsSecureContext = (nav, options) => {
  if (typeof options?.isSecureContext === 'boolean') return options.isSecureContext;
  if (typeof nav?.isSecureContext === 'boolean') return nav.isSecureContext;
  if (typeof globalThis !== 'undefined' && typeof globalThis.isSecureContext === 'boolean') {
    return globalThis.isSecureContext;
  }
  return false;
};

const classifyStatus = (supported, powerEfficient) =>
  !supported ? 'unsupported' : powerEfficient ? 'hardware' : 'software';

async function safeDecodingInfo(nav, config) {
  if (!nav?.mediaCapabilities || typeof nav.mediaCapabilities.decodingInfo !== 'function') {
    return { supported: false, smooth: false, powerEfficient: false, keySystemAccess: null };
  }
  try {
    const info = await nav.mediaCapabilities.decodingInfo(config);
    const supported = Boolean(info?.supported);
    return {
      supported,
      smooth: supported && Boolean(info?.smooth),
      powerEfficient: supported && Boolean(info?.powerEfficient),
      keySystemAccess: supported && info?.keySystemAccess ? info.keySystemAccess : null,
    };
  } catch {
    return { supported: false, smooth: false, powerEfficient: false, keySystemAccess: null };
  }
}

function buildDrmNotes(specId, candidate) {
  if (!candidate) return null;
  if (specId === 'widevine') {
    if (candidate.robustness === 'HW_SECURE_ALL') {
      return 'requestMediaKeySystemAccess resolved for HW_SECURE_ALL (L1). End-to-end 4K playback also requires valid device keybox provisioning and HDCP output protection.';
    }
    if (candidate.robustness === 'HW_SECURE_DECODE') {
      return 'Widevine L1 (HW_SECURE_DECODE): provides hardware TEE crypto and hardware-secure video decode (teeCrypto: true), differing from HW_SECURE_ALL in that the full rendering/output path may not be hardware-protected. End-to-end 4K playback also requires device keybox provisioning and HDCP compliance.';
    }
    if (candidate.robustness === 'HW_SECURE_CRYPTO') {
      return 'Widevine L2 (HW_SECURE_CRYPTO): TEE secures key cryptography (teeCrypto: true), while video decode runs outside a full hardware-protected decode path.';
    }
    return 'Software-only Widevine L3; streaming caps vary by platform and service (e.g., 720p HD on desktop Netflix, 480p SD on many L3 Android devices, or up to 1080p on some services).';
  }
  if (specId === 'playready') {
    if (candidate.legacy) {
      return 'Matched legacy com.microsoft.playready key system (EdgeHTML). Modern Chromium Edge uses com.microsoft.playready.recommendation.3000.';
    }
    if (candidate.securityLevel === 'SL3000') {
      return 'Modern PlayReady SL3000 matched; actual 4K UHD playback also depends on HDCP 2.2 compliance on the active display chain.';
    }
    return 'Software PlayReady SL2000 matched; streaming caps vary by service (typically 720p HD–1080p HD, without SL3000 4K DRM).';
  }
  if (specId === 'fairplay') {
    return 'com.apple.fps availability alone does not prove 4K hardware TEE via EME: Apple Silicon and Intel T2 Macs support 4K hardware-enforced pipelines, while pre-T2 Intel Macs typically cap at 1080p.';
  }
  return 'W3C baseline ClearKey for open key delivery; not used for commercial studio DRM.';
}

async function probeConfirmedEncryptionSchemes(targetNav, matchedCandidate, probeContentType, candidateSchemes) {
  if (!matchedCandidate || !candidateSchemes?.length) {
    return { encryptionSchemes: [], encryptionSchemeProbed: false };
  }

  const confirmed = [];
  let probed = false;

  for (const scheme of candidateSchemes) {
    const videoCap = {
      contentType: probeContentType,
      ...(matchedCandidate.robustness ? { robustness: matchedCandidate.robustness } : {}),
      encryptionScheme: scheme,
    };
    try {
      const access = await targetNav.requestMediaKeySystemAccess(matchedCandidate.keySystem, [
        { initDataTypes: matchedCandidate.initDataTypes, videoCapabilities: [videoCap] },
      ]);
      const cfg = typeof access?.getConfiguration === 'function' ? access.getConfiguration() : null;
      const echoed = cfg?.videoCapabilities?.[0]?.encryptionScheme;
      if (echoed === scheme) {
        confirmed.push(scheme);
        probed = true;
      }
      // If echoed is undefined, the browser silently ignored the unknown encryptionScheme WebIDL field.
    } catch {
      // Explicit rejection for this scheme proves the CDM evaluated encryptionScheme.
      probed = true;
    }
  }

  return { encryptionSchemes: confirmed, encryptionSchemeProbed: probed };
}

async function checkKeySystemAvailable(targetNav, spec, candidate, preCheckCache) {
  const cacheKey = `${candidate.keySystem}|${candidate.initDataTypes.join(',')}`;
  if (preCheckCache.has(cacheKey)) {
    return preCheckCache.get(cacheKey);
  }

  const sameKeySystemCandidates = spec.candidates.filter((c) => c.keySystem === candidate.keySystem);
  const lowestRobustness =
    spec.id === 'widevine'
      ? 'SW_SECURE_CRYPTO'
      : sameKeySystemCandidates.some((c) => c.robustness === undefined)
      ? undefined
      : sameKeySystemCandidates[sameKeySystemCandidates.length - 1]?.robustness;

  const distinctRobustnesses = [];
  for (const r of [lowestRobustness, ...sameKeySystemCandidates.map((c) => c.robustness).reverse()]) {
    if (!distinctRobustnesses.includes(r)) {
      distinctRobustnesses.push(r);
    }
  }

  const supportedConfigurations = distinctRobustnesses.map((robustness) => ({
    initDataTypes: candidate.initDataTypes,
    videoCapabilities: EME_VIDEO_CODECS.map((c) =>
      robustness ? { contentType: c.contentType, robustness } : { contentType: c.contentType }
    ),
  }));

  try {
    await targetNav.requestMediaKeySystemAccess(candidate.keySystem, supportedConfigurations);
    preCheckCache.set(cacheKey, true);
    return true;
  } catch {
    preCheckCache.set(cacheKey, false);
    return false;
  }
}

export async function probeDrmKeySystems(nav) {
  const targetNav = resolveNavigator(nav);
  const canProbe = Boolean(targetNav && typeof targetNav.requestMediaKeySystemAccess === 'function');
  const preCheckCache = new Map();
  const results = [];

  for (const spec of DRM_KEY_SYSTEMS) {
    const supportedCodecs = Object.fromEntries(
      EME_VIDEO_CODECS.map((c) => [
        c.codecId,
        {
          codecId: c.codecId,
          contentType: c.contentType,
          supported: false,
          securityLevel: 'Unsupported',
          hardwareBacked: false,
          teeCrypto: false,
          robustness: null,
          matchedKeySystem: null,
          encryptionSchemes: [],
          encryptionSchemeProbed: false,
        },
      ])
    );

    const matchedCodecCandidates = {};
    let bestMatch = null;

    if (canProbe) {
      for (let idx = 0; idx < spec.candidates.length; idx++) {
        const candidate = spec.candidates[idx];
        if (!(await checkKeySystemAvailable(targetNav, spec, candidate, preCheckCache))) {
          continue;
        }
        for (const codec of EME_VIDEO_CODECS) {
          if (supportedCodecs[codec.codecId].supported) continue;

          const videoCap = candidate.robustness
            ? { contentType: codec.contentType, robustness: candidate.robustness }
            : { contentType: codec.contentType };
          try {
            await targetNav.requestMediaKeySystemAccess(candidate.keySystem, [
              { initDataTypes: candidate.initDataTypes, videoCapabilities: [videoCap] },
            ]);
            supportedCodecs[codec.codecId] = {
              codecId: codec.codecId,
              contentType: codec.contentType,
              supported: true,
              securityLevel: candidate.securityLevel,
              hardwareBacked: candidate.hardwareBacked,
              teeCrypto: candidate.teeCrypto,
              robustness: candidate.robustness ?? null,
              matchedKeySystem: candidate.keySystem,
              encryptionSchemes: [],
              encryptionSchemeProbed: false,
            };
            matchedCodecCandidates[codec.codecId] = candidate;
            if (!bestMatch || idx < bestMatch.candidateIndex) {
              bestMatch = {
                candidate,
                candidateIndex: idx,
                contentType: codec.contentType,
                codecId: codec.codecId,
              };
            }
          } catch {
            // Try next codec / lower robustness tier.
          }
        }
      }

      for (const codec of EME_VIDEO_CODECS) {
        const codecCandidate = matchedCodecCandidates[codec.codecId];
        if (!codecCandidate) continue;
        const codecSchemeProbe = await probeConfirmedEncryptionSchemes(
          targetNav,
          codecCandidate,
          codec.contentType,
          spec.candidateEncryptionSchemes
        );
        supportedCodecs[codec.codecId].encryptionSchemes = codecSchemeProbe.encryptionSchemes;
        supportedCodecs[codec.codecId].encryptionSchemeProbed = codecSchemeProbe.encryptionSchemeProbed;
      }
    }

    const matchedCandidate = bestMatch?.candidate ?? null;
    const confirmedSchemeSet = new Set();
    let anySchemeProbed = false;
    for (const codec of EME_VIDEO_CODECS) {
      const c = supportedCodecs[codec.codecId];
      if (!c.supported) continue;
      if (c.encryptionSchemeProbed) anySchemeProbed = true;
      for (const s of c.encryptionSchemes) confirmedSchemeSet.add(s);
    }
    const encryptionSchemes = spec.candidateEncryptionSchemes.filter((s) => confirmedSchemeSet.has(s));

    results.push({
      id: spec.id,
      keySystem: matchedCandidate ? matchedCandidate.keySystem : spec.keySystem,
      matchedKeySystem: matchedCandidate ? matchedCandidate.keySystem : null,
      name: spec.name,
      supported: Boolean(matchedCandidate),
      securityLevel: matchedCandidate ? matchedCandidate.securityLevel : 'Unsupported',
      hardwareBacked: matchedCandidate ? matchedCandidate.hardwareBacked : false,
      teeCrypto: matchedCandidate ? matchedCandidate.teeCrypto : false,
      legacy: matchedCandidate ? Boolean(matchedCandidate.legacy) : false,
      robustness: matchedCandidate?.robustness ?? null,
      robustnessLabel: matchedCandidate ? matchedCandidate.robustnessLabel : null,
      encryptionSchemes,
      encryptionSchemeProbed: anySchemeProbed,
      supportedCodecs,
      notes: buildDrmNotes(spec.id, matchedCandidate),
    });
  }

  return results;
}

export async function probeVideoCodecs(nav, options = {}) {
  const targetNav = resolveNavigator(nav);
  const mediaType = options.mediaType === 'file' ? 'file' : 'media-source';
  const results = [];

  for (const codec of VIDEO_CODEC_PROFILES) {
    const profileResults = [];
    for (const profile of codec.profiles) {
      const caps = await safeDecodingInfo(targetNav, {
        type: mediaType,
        video: {
          contentType: profile.contentType,
          width: profile.width,
          height: profile.height,
          bitrate: profile.bitrate,
          framerate: profile.framerate,
        },
      });
      profileResults.push({
        resolution: profile.resolution,
        contentType: profile.contentType,
        ...(profile.encryptedContentType ? { encryptedContentType: profile.encryptedContentType } : {}),
        mediaType,
        width: profile.width,
        height: profile.height,
        framerate: profile.framerate,
        bitrate: profile.bitrate,
        supported: caps.supported,
        smooth: caps.smooth,
        powerEfficient: caps.powerEfficient,
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
      contentType: codec.profiles[0].contentType,
      mediaType,
      ...(codec.hdrNote ? { hdrNote: codec.hdrNote } : {}),
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

export async function probeAudioCodecs(nav, options = {}) {
  const targetNav = resolveNavigator(nav);
  const mediaType = options.mediaType === 'file' ? 'file' : 'media-source';
  const results = [];

  for (const codec of AUDIO_CODEC_PROFILES) {
    let caps = await safeDecodingInfo(targetNav, {
      type: mediaType,
      audio: {
        contentType: codec.contentType,
        channels: codec.channels,
        bitrate: codec.bitrate,
        samplerate: codec.samplerate,
      },
    });

    let mediaTypeUsed = mediaType;
    let notes = null;

    if (codec.codecId === 'flac' && mediaType === 'media-source' && !caps.supported) {
      const fileCaps = await safeDecodingInfo(targetNav, {
        type: 'file',
        audio: {
          contentType: codec.contentType,
          channels: codec.channels,
          bitrate: codec.bitrate,
          samplerate: codec.samplerate,
        },
      });
      if (fileCaps.supported) {
        caps = fileCaps;
        mediaTypeUsed = 'file';
        notes = 'FLAC decodingInfo succeeded with type: "file" (raw audio/flac is often unsupported in MSE on Safari).';
      }
    }

    results.push({
      codecId: codec.codecId,
      name: codec.name,
      contentType: codec.contentType,
      channels: codec.channels,
      mediaTypeUsed,
      supported: caps.supported,
      smooth: caps.smooth,
      powerEfficient: caps.powerEfficient,
      ...(notes ? { notes } : {}),
    });
  }

  return results;
}

export async function probeEncryptedStreaming(nav, drmResults, videoCodecs, _options = {}) {
  const targetNav = resolveNavigator(nav);
  // W3C MediaCapabilities & Chromium media_capabilities.cc reject keySystemConfiguration with type: 'file'.
  const mediaType = 'media-source';
  const canQueryMc = Boolean(targetNav?.mediaCapabilities && typeof targetNav.mediaCapabilities.decodingInfo === 'function');
  const commercialDrms = (drmResults || []).filter((d) => d.supported && d.id !== 'clearkey');
  const checks = [];

  if (!canQueryMc || commercialDrms.length === 0) {
    return { coupledSupported: false, checks };
  }

  for (const drm of commercialDrms) {
    const initDataType = drm.id === 'fairplay' ? 'sinf' : 'cenc';

    for (const codec of videoCodecs || []) {
      const codecDrm = drm.supportedCodecs?.[codec.codecId];
      if (!codecDrm?.supported || !codec.supported) continue;

      const scheme =
        typeof codecDrm.encryptionSchemeProbed === 'boolean'
          ? codecDrm.encryptionSchemeProbed
            ? codecDrm.encryptionSchemes?.[0]
            : undefined
          : drm.encryptionSchemeProbed
          ? drm.encryptionSchemes?.[0]
          : undefined;

      const targetProfiles = codec.profiles.filter((p) => p.supported);
      for (const profile of targetProfiles) {
        let probeContentType = profile.encryptedContentType || profile.contentType;
        if (codec.codecId === 'vp9' && /^video\/webm\b/i.test(probeContentType)) {
          probeContentType = probeContentType.replace(/^video\/webm\b/i, 'video/mp4');
        }

        const keySystemConfiguration = {
          keySystem: codecDrm.matchedKeySystem || drm.matchedKeySystem || drm.keySystem,
          initDataType,
          video: {
            ...(codecDrm.robustness ? { robustness: codecDrm.robustness } : {}),
            ...(scheme ? { encryptionScheme: scheme } : {}),
          },
        };

        const info = await safeDecodingInfo(targetNav, {
          type: mediaType,
          video: {
            contentType: probeContentType,
            width: profile.width,
            height: profile.height,
            bitrate: profile.bitrate,
            framerate: profile.framerate,
          },
          keySystemConfiguration,
        });

        checks.push({
          drmId: drm.id,
          keySystem: keySystemConfiguration.keySystem,
          codecId: codec.codecId,
          resolution: profile.resolution,
          contentType: probeContentType,
          drmSecurityLevel: codecDrm.securityLevel,
          drmHardwareBacked: codecDrm.hardwareBacked,
          supported: info.supported,
          smooth: info.smooth,
          powerEfficient: info.powerEfficient,
          coupledKeySystemVerified: Boolean(info.keySystemAccess),
        });
      }
    }
  }

  const coupledSupported = checks.some((c) => c.coupledKeySystemVerified);
  return {
    coupledSupported,
    checks,
    ...(checks.length > 0 && !coupledSupported
      ? {
          notes:
            'Browser did not return MediaKeySystemAccess for MediaCapabilities.decodingInfo({ keySystemConfiguration }) (such as Safari or Firefox < 129 ignoring the WebIDL field); estimates fall back to uncoupled EME + MediaCapabilities.',
        }
      : {}),
  };
}

export async function probeHdcpPolicy(nav, options = {}) {
  const targetNav = resolveNavigator(nav);
  const minHdcpVersion = options.minHdcpVersion || '2.2';
  const drmResults = options.drmResults;

  if (!targetNav || typeof targetNav.requestMediaKeySystemAccess !== 'function') {
    return {
      checked: true,
      supported: false,
      compliant: false,
      minHdcpVersion,
      status: 'eme-unsupported',
      keySystem: null,
      checkedSystems: [],
      notes: 'Encrypted Media Extensions (EME) API is unavailable in this environment.',
    };
  }

  const candidateSpecs = [];
  if (Array.isArray(drmResults)) {
    const hwRank = (hw) => (hw === true ? 0 : hw === null ? 1 : 2);
    const tieOrder = { widevine: 0, playready: 1, fairplay: 2 };
    const ordered = drmResults
      .filter((d) => d && d.supported && d.id !== 'clearkey')
      .slice()
      .sort(
        (a, b) =>
          hwRank(a.hardwareBacked) - hwRank(b.hardwareBacked) ||
          (tieOrder[a.id] ?? 9) - (tieOrder[b.id] ?? 9)
      );

    for (const d of ordered) {
      const codecEntries = Object.values(d.supportedCodecs || {});
      const supportedCodec =
        codecEntries.find((c) => c.supported && c.hardwareBacked === d.hardwareBacked) ||
        codecEntries.find((c) => c.supported);
      const spec = DRM_KEY_SYSTEMS.find((s) => s.id === d.id);
      const matchedCand = spec?.candidates.find(
        (c) => c.keySystem === (d.matchedKeySystem || d.keySystem) && (c.robustness ?? null) === d.robustness
      );
      candidateSpecs.push({
        keySystem: d.matchedKeySystem || d.keySystem,
        initDataTypes: matchedCand?.initDataTypes || (d.id === 'fairplay' ? ['sinf', 'skd'] : ['cenc']),
        contentType: supportedCodec?.contentType || EME_VIDEO_CODECS[0].contentType,
        robustness: d.robustness || undefined,
        hardwareBacked: d.hardwareBacked,
      });
    }
  }

  if (candidateSpecs.length === 0) {
    candidateSpecs.push(
      { keySystem: 'com.widevine.alpha', initDataTypes: ['cenc'], contentType: EME_VIDEO_CODECS[0].contentType, robustness: 'HW_SECURE_ALL', hardwareBacked: true },
      { keySystem: 'com.widevine.alpha', initDataTypes: ['cenc'], contentType: EME_VIDEO_CODECS[0].contentType, robustness: 'HW_SECURE_DECODE', hardwareBacked: true },
      { keySystem: 'com.microsoft.playready.recommendation.3000', initDataTypes: ['cenc'], contentType: EME_VIDEO_CODECS[0].contentType, hardwareBacked: true },
      { keySystem: 'com.microsoft.playready.recommendation.3000', initDataTypes: ['cenc'], contentType: EME_VIDEO_CODECS[0].contentType, robustness: '3000', hardwareBacked: true },
      { keySystem: 'com.microsoft.playready.recommendation.3000.clearlead', initDataTypes: ['cenc'], contentType: EME_VIDEO_CODECS[0].contentType, hardwareBacked: true },
      { keySystem: 'com.microsoft.playready.recommendation', initDataTypes: ['cenc'], contentType: EME_VIDEO_CODECS[0].contentType, robustness: '3000', hardwareBacked: true },
      { keySystem: 'com.apple.fps', initDataTypes: ['sinf', 'skd'], contentType: EME_VIDEO_CODECS[0].contentType, hardwareBacked: null },
      { keySystem: 'com.widevine.alpha', initDataTypes: ['cenc'], contentType: EME_VIDEO_CODECS[0].contentType, robustness: 'SW_SECURE_CRYPTO', hardwareBacked: false },
      { keySystem: 'com.microsoft.playready.recommendation', initDataTypes: ['cenc'], contentType: EME_VIDEO_CODECS[0].contentType, robustness: '2000', hardwareBacked: false },
      { keySystem: 'com.microsoft.playready.recommendation', initDataTypes: ['cenc'], contentType: EME_VIDEO_CODECS[0].contentType, hardwareBacked: false }
    );
  }

  const checkedSystems = [];
  const probedKeySystems = new Set();
  let firstNonCompliant = null;
  let firstUnsupported = null;
  let lastError = null;

  for (let i = 0; i < candidateSpecs.length; i++) {
    const spec = candidateSpecs[i];
    if (probedKeySystems.has(spec.keySystem)) {
      continue;
    }

    try {
      const access = await targetNav.requestMediaKeySystemAccess(spec.keySystem, [
        {
          initDataTypes: spec.initDataTypes,
          videoCapabilities: [
            spec.robustness ? { contentType: spec.contentType, robustness: spec.robustness } : { contentType: spec.contentType },
          ],
        },
      ]);
      if (typeof access?.createMediaKeys !== 'function') continue;
      const mediaKeys = await access.createMediaKeys();
      probedKeySystems.add(spec.keySystem);

      if (typeof mediaKeys?.getStatusForPolicy !== 'function') {
        checkedSystems.push({
          keySystem: spec.keySystem,
          robustness: spec.robustness ?? null,
          hardwareBacked: spec.hardwareBacked,
          status: 'api-unsupported',
          compliant: false,
        });
        if (!firstUnsupported) {
          firstUnsupported = {
            checked: true,
            supported: false,
            compliant: false,
            minHdcpVersion,
            status: 'api-unsupported',
            keySystem: spec.keySystem,
            notes: 'MediaKeys.getStatusForPolicy() is not implemented in this browser.',
          };
        }
        continue;
      }

      const status = await mediaKeys.getStatusForPolicy({ minHdcpVersion });
      const compliant = status === 'usable';
      checkedSystems.push({
        keySystem: spec.keySystem,
        robustness: spec.robustness ?? null,
        hardwareBacked: spec.hardwareBacked,
        status,
        compliant,
      });

      if (compliant) {
        return {
          checked: true,
          supported: true,
          compliant: true,
          minHdcpVersion,
          status,
          keySystem: spec.keySystem,
          checkedSystems,
          notes: `Display pipeline reports usable HDCP ${minHdcpVersion}+ output protection.`,
        };
      }

      if (!firstNonCompliant) {
        firstNonCompliant = {
          checked: true,
          supported: true,
          compliant: false,
          minHdcpVersion,
          status,
          keySystem: spec.keySystem,
          notes: `Display pipeline returned "${status}" for HDCP ${minHdcpVersion}.`,
        };
      }

      const hasMoreHardwareSpecs = candidateSpecs
        .slice(i + 1)
        .some((next) => next.hardwareBacked === true && !probedKeySystems.has(next.keySystem));
      if (!hasMoreHardwareSpecs) {
        break;
      }
    } catch (err) {
      lastError = err;
    }
  }

  if (firstNonCompliant) {
    return { ...firstNonCompliant, checkedSystems };
  }
  if (firstUnsupported) {
    return { ...firstUnsupported, checkedSystems };
  }

  return {
    checked: true,
    supported: false,
    compliant: false,
    minHdcpVersion,
    status: 'error',
    keySystem: null,
    checkedSystems,
    notes: lastError?.message || 'Unable to instantiate MediaKeys for HDCP policy check.',
  };
}

export async function runFullMediaProbe(nav, options = {}) {
  const targetNav = resolveNavigator(nav);
  const mediaType = options.mediaType === 'file' ? 'file' : 'media-source';
  const minHdcpVersion = options.minHdcpVersion || '2.2';
  const isSecureContext = resolveIsSecureContext(targetNav, options);

  const [drm, videoCodecs, audioCodecs] = await Promise.all([
    probeDrmKeySystems(targetNav),
    probeVideoCodecs(targetNav, { mediaType }),
    probeAudioCodecs(targetNav, { mediaType }),
  ]);

  const encryptedStreaming = await probeEncryptedStreaming(targetNav, drm, videoCodecs, { mediaType });
  const hdcp = options.checkHdcp
    ? await probeHdcpPolicy(targetNav, { minHdcpVersion, drmResults: drm })
    : {
        checked: false,
        supported: null,
        compliant: null,
        minHdcpVersion,
        status: 'not-probed',
        keySystem: null,
        checkedSystems: [],
      };

  const widevine = drm.find((d) => d.id === 'widevine');
  const playready = drm.find((d) => d.id === 'playready');
  const fairplay = drm.find((d) => d.id === 'fairplay');
  const widevineTier = widevine?.supported ? widevine.securityLevel : 'Unsupported';

  let highestHardwareDrm = null;
  if (widevine?.supported && widevine.hardwareBacked) highestHardwareDrm = 'Widevine L1';
  else if (playready?.supported && playready.hardwareBacked) highestHardwareDrm = 'PlayReady SL3000';

  const platformManagedDrm = fairplay?.supported ? 'Apple FairPlay (platform-managed)' : null;
  const byCodec = Object.fromEntries(videoCodecs.map((c) => [c.codecId, c]));

  const is4kRes = (res) => res === '4K30' || res === '4K60';
  const coupled4kHw = encryptedStreaming.checks.some(
    (c) => c.supported && c.coupledKeySystemVerified && c.powerEfficient && c.drmHardwareBacked && is4kRes(c.resolution)
  );
  const coupled1080Hw = encryptedStreaming.checks.some(
    (c) => c.supported && c.coupledKeySystemVerified && c.drmHardwareBacked && c.resolution === '1080p60'
  );
  const coupled4kFairPlay = encryptedStreaming.checks.some(
    (c) =>
      c.supported &&
      c.coupledKeySystemVerified &&
      c.powerEfficient &&
      c.drmId === 'fairplay' &&
      is4kRes(c.resolution)
  );

  // Also intersect per-codec DRM hardware backing with per-codec 4K hardware decode
  const perCodec4kHw = [widevine, playready].some(
    (d) =>
      d?.supported &&
      videoCodecs.some(
        (vc) => d.supportedCodecs?.[vc.codecId]?.hardwareBacked === true && is4kRes(vc.maxHardwareResolution)
      )
  );
  const hasClear4kHw = videoCodecs.some((c) => is4kRes(c.maxHardwareResolution));
  const hasSoftwareOrL2Drm = Boolean(widevine?.supported || playready?.supported);

  let estimatedMaxStreamingResolution = 'Unverified (No EME DRM)';
  if (highestHardwareDrm) {
    if (encryptedStreaming.coupledSupported) {
      if (coupled4kHw && perCodec4kHw) {
        estimatedMaxStreamingResolution = '4K / UHD';
      } else if (coupled1080Hw) {
        estimatedMaxStreamingResolution = '1080p HD (Hardware DRM)';
      } else {
        estimatedMaxStreamingResolution = '720p HD (Coupled 1080p/4K DRM Rejected)';
      }
    } else {
      estimatedMaxStreamingResolution = perCodec4kHw ? '4K / UHD' : '1080p HD (Hardware DRM)';
    }
  } else if (platformManagedDrm) {
    if (encryptedStreaming.coupledSupported) {
      estimatedMaxStreamingResolution = coupled4kFairPlay
        ? '1080p–4K UHD (FairPlay; T2/Apple Silicon for 4K)'
        : 'Up to 1080p HD (FairPlay platform-managed)';
    } else {
      estimatedMaxStreamingResolution = hasClear4kHw
        ? '1080p–4K UHD (FairPlay; T2/Apple Silicon for 4K)'
        : 'Up to 1080p HD (FairPlay platform-managed)';
    }
  } else if (widevineTier === 'L2') {
    estimatedMaxStreamingResolution = '720p–1080p HD (Widevine L2; TEE Crypto Only)';
  } else if (hasSoftwareOrL2Drm) {
    estimatedMaxStreamingResolution = '720p HD (Software DRM Cap)';
  }

  const hdcpRestricted = Boolean(hdcp.checked && hdcp.supported === true && hdcp.compliant === false);
  const hdcpRestrictedLabel =
    minHdcpVersion === '2.2' ? '1080p HD (HDCP 2.2 Restricted)' : '1080p HD (HDCP Restricted)';
  if (
    hdcpRestricted &&
    (estimatedMaxStreamingResolution === '4K / UHD' ||
      estimatedMaxStreamingResolution === '1080p–4K UHD (FairPlay; T2/Apple Silicon for 4K)')
  ) {
    estimatedMaxStreamingResolution = hdcpRestrictedLabel;
  }

  const hwCodecs = videoCodecs.filter((c) => c.hardwareAccelerated).map((c) => c.codecId.toUpperCase());
  const hwLabel = hwCodecs.length ? hwCodecs.join(', ') : 'None (CPU software decode)';
  const emeSupported = Boolean(targetNav && typeof targetNav.requestMediaKeySystemAccess === 'function');
  const uncoupledNote =
    !encryptedStreaming.coupledSupported && encryptedStreaming.checks.length > 0
      ? ' (uncoupled EME + MediaCapabilities estimate; browser did not verify keySystemConfiguration)'
      : '';

  let headline;
  if (!emeSupported && !isSecureContext) {
    headline = `EME DRM unavailable in insecure context (isSecureContext: false — HTTPS or localhost required); GPU decode: ${hwLabel}.`;
  } else if (highestHardwareDrm) {
    if (hdcpRestricted) {
      headline = `Hardware DRM (${highestHardwareDrm}) detected, but HDCP ${minHdcpVersion} returned "${hdcp.status}" — capped at ${estimatedMaxStreamingResolution}${uncoupledNote}; GPU decode: ${hwLabel}.`;
    } else {
      headline = `Hardware DRM (${highestHardwareDrm}) detected — likely ${estimatedMaxStreamingResolution}${uncoupledNote}; GPU decode: ${hwLabel}.`;
    }
  } else if (platformManagedDrm) {
    if (hdcpRestricted) {
      headline = `Apple FairPlay (platform-managed) detected, but HDCP ${minHdcpVersion} returned "${hdcp.status}" — capped at ${estimatedMaxStreamingResolution}${uncoupledNote}; GPU decode: ${hwLabel}.`;
    } else {
      headline = `Apple FairPlay (platform-managed) detected — 4K requires Apple Silicon or Intel T2+ + HDCP 2.2 (pre-T2 Macs typically cap at 1080p)${uncoupledNote}; GPU decode: ${hwLabel}.`;
    }
  } else if (widevineTier === 'L2') {
    headline = `Widevine L2 (HW_SECURE_CRYPTO) detected — hardware crypto with software decode; GPU decode: ${hwLabel}.`;
  } else if (hasSoftwareOrL2Drm) {
    const swName = widevine?.supported ? `Widevine ${widevineTier}` : `PlayReady ${playready?.securityLevel || 'SL2000'}`;
    headline = `Software DRM only (${swName}) — streaming typically capped around 720p HD on desktop or 480p SD on L3 mobile; GPU decode: ${hwLabel}.`;
  } else {
    headline = `No commercial EME DRM key system available; GPU decode: ${hwLabel}.`;
  }

  return {
    probedAt: new Date().toISOString(),
    environmentSupported: {
      eme: emeSupported,
      mediaCapabilities: Boolean(targetNav?.mediaCapabilities && typeof targetNav.mediaCapabilities.decodingInfo === 'function'),
      isSecureContext,
    },
    mediaType,
    drm,
    videoCodecs,
    audioCodecs,
    encryptedStreaming,
    hdcp,
    summary: {
      widevineTier,
      highestHardwareDrm,
      platformManagedDrm,
      coupledEncryptedVerified: encryptedStreaming.coupledSupported,
      estimatedMaxStreamingResolution,
      hardwareAv1: Boolean(byCodec.av1?.hardwareAccelerated),
      hardwareHevc: Boolean(byCodec.hevc?.hardwareAccelerated),
      hardwareVp9: Boolean(byCodec.vp9?.hardwareAccelerated),
      hardwareH264: Boolean(byCodec.h264?.hardwareAccelerated),
      dolbyDigitalPlus: Boolean(audioCodecs.find((a) => a.codecId === 'ec3')?.supported),
      powerEfficiencyNote:
        'powerEfficient reflects W3C MediaCapabilities power-efficiency heuristics (e.g., Chromium VideoDecodeStats, which can be optimistic on cold profiles or vary across Firefox OS backends), not absolute fixed-function GPU proof.',
      headline,
    },
  };
}
