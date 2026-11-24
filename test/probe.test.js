import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DRM_KEY_SYSTEMS,
  VIDEO_CODEC_PROFILES,
  AUDIO_CODEC_PROFILES,
  probeDrmKeySystems,
  probeVideoCodecs,
  probeAudioCodecs,
  probeHdcpPolicy,
  runFullMediaProbe,
} from '../src/index.js';

function createMockNavigator({
  isSecureContext = true,
  widevineRobustness = [],
  widevineByCodec = null,
  widevineSchemes = ['cenc', 'cbcs'],
  playreadyKeySystems = null,
  playreadyRobustness = [],
  playreadySchemes = ['cenc', 'cbcs'],
  fairplay = false,
  fairplaySchemes = ['cbcs'],
  clearkey = true,
  clearkeySchemes = ['cenc', 'cbcs'],
  ignoreEncryptionSchemeInWebIdl = false,
  hdcpStatus = 'usable',
  hdcpUnsupported = false,
  videoSupport = {},
  audioSupport = {},
  coupledSupport = null,
  coupledReturnsAccess = true,
  logCalls = null,
} = {}) {
  return {
    isSecureContext,
    async requestMediaKeySystemAccess(keySystem, configs) {
      const config = configs?.[0] || {};
      const cap = config.videoCapabilities?.[0] || {};
      const robustness = cap.robustness;
      const scheme = cap.encryptionScheme;
      const ct = cap.contentType || '';
      const initDataTypes = config.initDataTypes || [];

      if (logCalls) {
        logCalls.eme.push({ keySystem, config });
      }

      const buildAccess = (acceptedSchemeList) => {
        if (scheme !== undefined && !ignoreEncryptionSchemeInWebIdl) {
          if (!acceptedSchemeList.includes(scheme)) {
            throw new Error(`Unsupported encryptionScheme: ${scheme}`);
          }
        }
        return {
          keySystem,
          getConfiguration() {
            const retCap = { contentType: ct };
            if (robustness !== undefined) retCap.robustness = robustness;
            if (scheme !== undefined && !ignoreEncryptionSchemeInWebIdl) {
              retCap.encryptionScheme = scheme;
            }
            return {
              initDataTypes,
              videoCapabilities: [retCap],
            };
          },
          async createMediaKeys() {
            if (hdcpUnsupported) {
              return {};
            }
            return {
              async getStatusForPolicy({ minHdcpVersion }) {
                if (typeof hdcpStatus === 'function') {
                  return hdcpStatus({ minHdcpVersion, keySystem });
                }
                return hdcpStatus;
              },
            };
          },
        };
      };

      if (keySystem === 'com.widevine.alpha') {
        let allowed = widevineRobustness;
        if (widevineByCodec) {
          const matchedEntry = Object.entries(widevineByCodec).find(([pattern]) => ct.includes(pattern));
          allowed = matchedEntry ? matchedEntry[1] : [];
        }
        if (allowed.includes(robustness)) {
          return buildAccess(widevineSchemes);
        }
        throw new Error('Unsupported Widevine robustness');
      }

      if (keySystem.startsWith('com.microsoft.playready')) {
        if (playreadyKeySystems) {
          const allowedRobustness = playreadyKeySystems[keySystem];
          if (Array.isArray(allowedRobustness) && allowedRobustness.includes(robustness)) {
            return buildAccess(playreadySchemes);
          }
          throw new Error(`Unsupported PlayReady config: ${keySystem}`);
        }
        if (keySystem === 'com.microsoft.playready' && playreadyRobustness.includes(robustness)) {
          return buildAccess(playreadySchemes);
        }
        throw new Error(`Unsupported PlayReady key system: ${keySystem}`);
      }

      if (keySystem === 'com.apple.fps' && fairplay) {
        assert.deepEqual(initDataTypes, ['sinf', 'skd']);
        assert.ok(!initDataTypes.includes('cenc'));
        return buildAccess(fairplaySchemes);
      }

      if (keySystem === 'org.w3.clearkey' && clearkey) {
        return buildAccess(clearkeySchemes);
      }

      throw new Error(`Unsupported key system: ${keySystem}`);
    },
    mediaCapabilities: {
      async decodingInfo(config) {
        if (logCalls) {
          logCalls.mc.push(config);
        }
        if (config.keySystemConfiguration && coupledSupport) {
          const coupledRes =
            typeof coupledSupport === 'function' ? coupledSupport(config) : coupledSupport;
          return {
            ...coupledRes,
            ...(coupledRes.supported && coupledReturnsAccess ? { keySystemAccess: { keySystem: config.keySystemConfiguration.keySystem } } : {}),
          };
        }
        if (config.video) {
          const ct = config.video.contentType;
          const height = config.video.height;
          for (const [pattern, handler] of Object.entries(videoSupport)) {
            if (ct.includes(pattern)) {
              const res = typeof handler === 'function' ? handler(config.video, config) : handler;
              if (config.keySystemConfiguration && res.supported && coupledReturnsAccess) {
                return { ...res, keySystemAccess: { keySystem: config.keySystemConfiguration.keySystem } };
              }
              return res;
            }
          }
          if (height <= 2160) {
            return { supported: false, smooth: false, powerEfficient: false };
          }
        }
        if (config.audio) {
          const ct = config.audio.contentType;
          for (const [pattern, handler] of Object.entries(audioSupport)) {
            if (ct.includes(pattern)) {
              return typeof handler === 'function' ? handler(config.audio, config) : handler;
            }
          }
        }
        return { supported: false, smooth: false, powerEfficient: false };
      },
    },
  };
}

test('DRM_KEY_SYSTEMS, VIDEO_CODEC_PROFILES, and AUDIO_CODEC_PROFILES expose spec-accurate profiles', () => {
  assert.equal(DRM_KEY_SYSTEMS.length, 4);
  assert.equal(VIDEO_CODEC_PROFILES.length, 4);
  assert.equal(AUDIO_CODEC_PROFILES.length, 4);

  const byId = Object.fromEntries(VIDEO_CODEC_PROFILES.map((c) => [c.codecId, c]));
  assert.deepEqual(
    byId.av1.profiles.map((p) => [p.resolution, p.contentType]),
    [
      ['1080p60', 'video/mp4; codecs="av01.0.09M.08"'],
      ['4K30', 'video/mp4; codecs="av01.0.12M.08"'],
      ['4K60', 'video/mp4; codecs="av01.0.13M.08"'],
    ]
  );
  assert.deepEqual(
    byId.hevc.profiles.map((p) => [p.resolution, p.contentType]),
    [
      ['1080p60', 'video/mp4; codecs="hvc1.1.6.L123.90"'],
      ['4K30', 'video/mp4; codecs="hvc1.2.4.L150.B0"'],
      ['4K60', 'video/mp4; codecs="hvc1.2.4.L153.B0"'],
    ]
  );
  assert.deepEqual(
    byId.vp9.profiles.map((p) => [p.resolution, p.contentType]),
    [
      ['1080p60', 'video/webm; codecs="vp09.00.41.08"'],
      ['4K30', 'video/webm; codecs="vp09.00.50.08"'],
      ['4K60', 'video/webm; codecs="vp09.00.51.08"'],
    ]
  );
  assert.deepEqual(
    byId.h264.profiles.map((p) => [p.resolution, p.contentType]),
    [
      ['1080p60', 'video/mp4; codecs="avc1.64002a"'],
      ['4K30', 'video/mp4; codecs="avc1.640033"'],
      ['4K60', 'video/mp4; codecs="avc1.640034"'],
    ]
  );
});

test('probeDrmKeySystems supports full 5-tier Widevine L1 / L2 / L3 ladder', async () => {
  const cases = [
    { tiers: ['HW_SECURE_ALL', 'SW_SECURE_CRYPTO'], expectedLevel: 'L1', expectedHw: true, expectedRob: 'HW_SECURE_ALL' },
    { tiers: ['HW_SECURE_DECODE', 'SW_SECURE_CRYPTO'], expectedLevel: 'L1', expectedHw: true, expectedRob: 'HW_SECURE_DECODE' },
    { tiers: ['HW_SECURE_CRYPTO', 'SW_SECURE_CRYPTO'], expectedLevel: 'L2', expectedHw: false, expectedRob: 'HW_SECURE_CRYPTO', expectedTeeCrypto: true },
    { tiers: ['SW_SECURE_DECODE'], expectedLevel: 'L3', expectedHw: false, expectedRob: 'SW_SECURE_DECODE' },
    { tiers: ['SW_SECURE_CRYPTO'], expectedLevel: 'L3', expectedHw: false, expectedRob: 'SW_SECURE_CRYPTO' },
  ];

  for (const c of cases) {
    const nav = createMockNavigator({ widevineRobustness: c.tiers });
    const drm = await probeDrmKeySystems(nav);
    const widevine = drm.find((d) => d.id === 'widevine');
    assert.equal(widevine.supported, true);
    assert.equal(widevine.securityLevel, c.expectedLevel);
    assert.equal(widevine.hardwareBacked, c.expectedHw);
    assert.equal(widevine.robustness, c.expectedRob);
    if (c.expectedTeeCrypto) {
      assert.equal(widevine.teeCrypto, true);
    }
  }
});

test('probeDrmKeySystems probes modern Edge PlayReady (.recommendation.3000, .clearlead, .recommendation) before legacy fallback', async () => {
  const modernEdge = createMockNavigator({
    playreadyKeySystems: {
      'com.microsoft.playready.recommendation.3000': [undefined, '3000'],
      'com.microsoft.playready.recommendation': ['3000', '2000', undefined],
    },
  });
  const modernDrm = await probeDrmKeySystems(modernEdge);
  const prModern = modernDrm.find((d) => d.id === 'playready');
  assert.equal(prModern.supported, true);
  assert.equal(prModern.matchedKeySystem, 'com.microsoft.playready.recommendation.3000');
  assert.equal(prModern.securityLevel, 'SL3000');
  assert.equal(prModern.hardwareBacked, true);
  assert.equal(prModern.legacy, false);

  const clearLeadEdge = createMockNavigator({
    playreadyKeySystems: {
      'com.microsoft.playready.recommendation.3000.clearlead': [undefined],
    },
  });
  const clDrm = await probeDrmKeySystems(clearLeadEdge);
  const prCl = clDrm.find((d) => d.id === 'playready');
  assert.equal(prCl.matchedKeySystem, 'com.microsoft.playready.recommendation.3000.clearlead');
  assert.equal(prCl.securityLevel, 'SL3000');
  assert.equal(prCl.hardwareBacked, true);
  assert.equal(prCl.legacy, false);

  const rec2000 = createMockNavigator({
    playreadyKeySystems: {
      'com.microsoft.playready.recommendation': ['2000', undefined],
    },
  });
  const pr2000 = (await probeDrmKeySystems(rec2000)).find((d) => d.id === 'playready');
  assert.equal(pr2000.matchedKeySystem, 'com.microsoft.playready.recommendation');
  assert.equal(pr2000.securityLevel, 'SL2000');
  assert.equal(pr2000.hardwareBacked, false);
  assert.equal(pr2000.legacy, false);

  const legacyEdge = createMockNavigator({
    playreadyRobustness: ['2000'],
  });
  const prLegacy = (await probeDrmKeySystems(legacyEdge)).find((d) => d.id === 'playready');
  assert.equal(prLegacy.matchedKeySystem, 'com.microsoft.playready');
  assert.equal(prLegacy.securityLevel, 'SL2000');
  assert.equal(prLegacy.legacy, true);
});

test('probeDrmKeySystems handles Apple FairPlay accurately without cenc or synthetic hardware-tee', async () => {
  const safariNav = createMockNavigator({ fairplay: true, clearkey: true });
  const drm = await probeDrmKeySystems(safariNav);
  const fairplay = drm.find((d) => d.id === 'fairplay');

  assert.equal(fairplay.supported, true);
  assert.equal(fairplay.matchedKeySystem, 'com.apple.fps');
  assert.equal(fairplay.securityLevel, 'FairPlay (platform-managed)');
  assert.equal(fairplay.hardwareBacked, null);
  assert.equal(fairplay.robustness, null);
  assert.match(fairplay.robustnessLabel, /Platform-managed/);
  assert.match(fairplay.notes, /Apple Silicon.*T2/i);
  assert.deepEqual(fairplay.encryptionSchemes, ['cbcs']);
});

test('encryptionScheme probing verifies getConfiguration() and avoids WebIDL ignore false positives', async () => {
  const realNav = createMockNavigator({
    widevineRobustness: ['HW_SECURE_ALL'],
    widevineSchemes: ['cenc'], // cbcs rejected
  });
  const realDrm = await probeDrmKeySystems(realNav);
  const wvReal = realDrm.find((d) => d.id === 'widevine');
  assert.equal(wvReal.encryptionSchemeProbed, true);
  assert.deepEqual(wvReal.encryptionSchemes, ['cenc']);

  const webIdlIgnoreNav = createMockNavigator({
    widevineRobustness: ['HW_SECURE_ALL'],
    ignoreEncryptionSchemeInWebIdl: true,
  });
  const ignoredDrm = await probeDrmKeySystems(webIdlIgnoreNav);
  const wvIgnored = ignoredDrm.find((d) => d.id === 'widevine');
  assert.equal(wvIgnored.encryptionSchemeProbed, false);
  assert.deepEqual(wvIgnored.encryptionSchemes, []);
});

test('multi-codec EME probing detects Widevine on Chromium/Linux without H.264 and reports per-codec tiers', async () => {
  const openSourceLinuxNav = createMockNavigator({
    widevineByCodec: {
      avc1: [], // no proprietary H.264
      vp09: ['SW_SECURE_CRYPTO'],
      av01: ['SW_SECURE_CRYPTO'],
      hvc1: [],
    },
  });
  const drm = await probeDrmKeySystems(openSourceLinuxNav);
  const wv = drm.find((d) => d.id === 'widevine');
  assert.equal(wv.supported, true);
  assert.equal(wv.securityLevel, 'L3');
  assert.equal(wv.supportedCodecs.h264.supported, false);
  assert.equal(wv.supportedCodecs.vp9.supported, true);
  assert.equal(wv.supportedCodecs.av1.supported, true);

  const mixedCodecNav = createMockNavigator({
    widevineByCodec: {
      avc1: ['HW_SECURE_ALL', 'SW_SECURE_CRYPTO'],
      av01: ['SW_SECURE_CRYPTO'],
      vp09: ['HW_SECURE_CRYPTO', 'SW_SECURE_CRYPTO'],
      hvc1: [],
    },
    videoSupport: {
      avc1: (v) => ({ supported: v.height <= 1080, smooth: true, powerEfficient: true }),
      av01: { supported: true, smooth: true, powerEfficient: true }, // clear 4K AV1, but only L3 DRM!
    },
  });
  const mixedReport = await runFullMediaProbe(mixedCodecNav);
  const mixedWv = mixedReport.drm.find((d) => d.id === 'widevine');
  assert.equal(mixedWv.supportedCodecs.h264.securityLevel, 'L1');
  assert.equal(mixedWv.supportedCodecs.vp9.securityLevel, 'L2');
  assert.equal(mixedWv.supportedCodecs.av1.securityLevel, 'L3');
  // Decoupled bug would have claimed 4K/UHD; coupled per-codec logic caps at 1080p HD!
  assert.equal(mixedReport.summary.estimatedMaxStreamingResolution, '1080p HD (Hardware DRM)');
});

test('probeVideoCodecs defaults to media-source MSE, supports 4K30, and permits file override', async () => {
  const calls = { eme: [], mc: [] };
  const nav = createMockNavigator({
    logCalls: calls,
    videoSupport: {
      av01: (v) => ({
        supported: v.framerate <= 30 || v.height <= 1080, // 1080p60 + 4K30 supported, 4K60 unsupported
        smooth: true,
        powerEfficient: true,
      }),
      hvc1: { supported: true, smooth: true, powerEfficient: true },
      vp09: (v) => ({
        supported: true,
        smooth: true,
        powerEfficient: v.height <= 1080,
      }),
      avc1: { supported: false, smooth: false, powerEfficient: false },
    },
  });

  const codecs = await probeVideoCodecs(nav);
  assert.ok(calls.mc.every((c) => c.type === 'media-source'));

  const av1 = codecs.find((c) => c.codecId === 'av1');
  assert.equal(av1.maxSupportedResolution, '4K30');
  assert.equal(av1.maxHardwareResolution, '4K30');
  assert.equal(av1.profiles.find((p) => p.resolution === '4K30').contentType, 'video/mp4; codecs="av01.0.12M.08"');

  const fileCalls = { eme: [], mc: [] };
  const fileNav = createMockNavigator({ logCalls: fileCalls });
  await probeVideoCodecs(fileNav, { mediaType: 'file' });
  assert.ok(fileCalls.mc.every((c) => c.type === 'file'));
});

test('probeAudioCodecs handles Safari FLAC media-source vs file fallback nuance', async () => {
  const safariLikeNav = createMockNavigator({
    audioSupport: {
      opus: { supported: true, smooth: true, powerEfficient: true },
      'mp4a.40.2': { supported: true, smooth: true, powerEfficient: true },
      flac: (_audio, fullConfig) =>
        fullConfig.type === 'file'
          ? { supported: true, smooth: true, powerEfficient: true }
          : { supported: false, smooth: false, powerEfficient: false },
      'ec-3': { supported: true, smooth: true, powerEfficient: true },
    },
  });

  const audio = await probeAudioCodecs(safariLikeNav);
  const flac = audio.find((a) => a.codecId === 'flac');
  assert.equal(flac.supported, true);
  assert.equal(flac.mediaTypeUsed, 'file');
  assert.match(flac.notes, /type: "file"/);
});

test('coupled keySystemConfiguration probe blocks 4K claim when encrypted 4K rejects', async () => {
  const nav = createMockNavigator({
    widevineRobustness: ['HW_SECURE_ALL'],
    videoSupport: {
      hvc1: { supported: true, smooth: true, powerEfficient: true },
    },
    coupledSupport: (config) => {
      if (config.video.height >= 2160) {
        return { supported: false, smooth: false, powerEfficient: false };
      }
      return { supported: true, smooth: true, powerEfficient: true };
    },
  });

  const report = await runFullMediaProbe(nav);
  assert.equal(report.encryptedStreaming.coupledSupported, true);
  assert.equal(report.summary.coupledEncryptedVerified, true);
  assert.equal(report.summary.estimatedMaxStreamingResolution, '1080p HD (Hardware DRM)');
});

test('opt-in HDCP 2.2 policy check is skipped by default and runs when checkHdcp: true', async () => {
  const nav = createMockNavigator({
    widevineRobustness: ['HW_SECURE_ALL'],
    hdcpStatus: 'usable',
  });

  const fastReport = await runFullMediaProbe(nav);
  assert.equal(fastReport.hdcp.checked, false);
  assert.equal(fastReport.hdcp.status, 'not-probed');

  const hdcpReport = await runFullMediaProbe(nav, { checkHdcp: true, minHdcpVersion: '2.2' });
  assert.equal(hdcpReport.hdcp.checked, true);
  assert.equal(hdcpReport.hdcp.supported, true);
  assert.equal(hdcpReport.hdcp.compliant, true);
  assert.equal(hdcpReport.hdcp.status, 'usable');

  const restrictedNav = createMockNavigator({
    widevineRobustness: ['HW_SECURE_ALL'],
    hdcpStatus: 'output-restricted',
  });
  const restricted = await probeHdcpPolicy(restrictedNav, { minHdcpVersion: '2.2' });
  assert.equal(restricted.compliant, false);
  assert.equal(restricted.status, 'output-restricted');

  const noPolicyNav = createMockNavigator({
    widevineRobustness: ['HW_SECURE_ALL'],
    hdcpUnsupported: true,
  });
  const unsupported = await probeHdcpPolicy(noPolicyNav, { minHdcpVersion: '2.2' });
  assert.equal(unsupported.supported, false);
  assert.equal(unsupported.status, 'api-unsupported');
});

test('SSR, missing navigator, and isSecureContext: false degrade gracefully with 720p HD wording', async () => {
  for (const missing of [null, undefined, {}]) {
    const report = await runFullMediaProbe(missing);
    assert.equal(report.environmentSupported.eme, false);
    assert.equal(report.environmentSupported.mediaCapabilities, false);
    assert.equal(report.environmentSupported.isSecureContext, false);
    assert.equal(report.drm.length, 4);
    assert.ok(report.drm.every((d) => d.supported === false && d.securityLevel === 'Unsupported'));
    assert.equal(report.videoCodecs.length, 4);
    assert.equal(report.audioCodecs.length, 4);
  }

  const httpNav = {
    isSecureContext: false,
    mediaCapabilities: {
      async decodingInfo() {
        return { supported: true, smooth: true, powerEfficient: true };
      },
    },
  };
  const httpReport = await runFullMediaProbe(httpNav);
  assert.equal(httpReport.environmentSupported.isSecureContext, false);
  assert.match(httpReport.summary.headline, /isSecureContext: false/);

  const l3Nav = createMockNavigator({
    widevineRobustness: ['SW_SECURE_CRYPTO'],
    videoSupport: { avc1: { supported: true, smooth: true, powerEfficient: true } },
  });
  const l3Report = await runFullMediaProbe(l3Nav);
  assert.equal(l3Report.summary.widevineTier, 'L3');
  assert.equal(l3Report.summary.estimatedMaxStreamingResolution, '720p HD (Software DRM Cap)');
  assert.doesNotMatch(l3Report.summary.estimatedMaxStreamingResolution, /720p SD/);
  assert.match(l3Report.summary.headline, /720p HD/);
});

test('probeVideoCodecs and probeAudioCodecs handle decodingInfo rejections per codec without aborting', async () => {
  const flakyNav = {
    mediaCapabilities: {
      async decodingInfo(config) {
        if (config.video?.contentType.includes('av01') || config.audio?.contentType.includes('ec-3')) {
          throw new Error('Transient MediaCapabilities query failure');
        }
        return { supported: true, smooth: true, powerEfficient: true };
      },
    },
  };

  const [video, audio] = await Promise.all([probeVideoCodecs(flakyNav), probeAudioCodecs(flakyNav)]);
  assert.equal(video.find((c) => c.codecId === 'av1').status, 'unsupported');
  assert.equal(video.find((c) => c.codecId === 'hevc').status, 'hardware');
  assert.equal(audio.find((a) => a.codecId === 'ec3').supported, false);
  assert.equal(audio.find((a) => a.codecId === 'opus').supported, true);
});
