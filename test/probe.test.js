import test from 'node:test';
import assert from 'node:assert/strict';
import {
  probeDrmKeySystems,
  probeVideoCodecs,
  probeAudioCodecs,
  runFullMediaProbe,
} from '../src/index.js';

function createMockNavigator({
  widevineRobustness = [],
  playreadyRobustness = [],
  fairplay = false,
  clearkey = true,
  videoSupport = {},
  audioSupport = {},
} = {}) {
  return {
    async requestMediaKeySystemAccess(keySystem, configs) {
      const cap = configs?.[0]?.videoCapabilities?.[0] || {};
      const robustness = cap.robustness;

      if (keySystem === 'com.widevine.alpha') {
        if (widevineRobustness.includes(robustness)) {
          return { keySystem };
        }
        throw new Error('Unsupported Widevine robustness');
      }
      if (keySystem === 'com.microsoft.playready') {
        if (playreadyRobustness.includes(robustness)) {
          return { keySystem };
        }
        throw new Error('Unsupported PlayReady robustness');
      }
      if (keySystem === 'com.apple.fps' && fairplay) {
        return { keySystem };
      }
      if (keySystem === 'org.w3.clearkey' && clearkey) {
        return { keySystem };
      }
      throw new Error(`Unsupported key system: ${keySystem}`);
    },
    mediaCapabilities: {
      async decodingInfo(config) {
        if (config.video) {
          const ct = config.video.contentType;
          const height = config.video.height;
          for (const [pattern, handler] of Object.entries(videoSupport)) {
            if (ct.includes(pattern)) {
              return typeof handler === 'function' ? handler(config.video) : handler;
            }
          }
          if (height <= 2160) {
            return { supported: false, smooth: false, powerEfficient: false };
          }
        }
        if (config.audio) {
          const ct = config.audio.contentType;
          for (const [pattern, result] of Object.entries(audioSupport)) {
            if (ct.includes(pattern)) {
              return result;
            }
          }
        }
        return { supported: false, smooth: false, powerEfficient: false };
      },
    },
  };
}

test('probeDrmKeySystems detects Widevine L1 hardware TEE when HW_SECURE_ALL succeeds', async () => {
  const nav = createMockNavigator({ widevineRobustness: ['HW_SECURE_ALL', 'SW_SECURE_CRYPTO'] });
  const drm = await probeDrmKeySystems(nav);
  const widevine = drm.find((d) => d.id === 'widevine');

  assert.equal(widevine.supported, true);
  assert.equal(widevine.securityLevel, 'L1');
  assert.equal(widevine.hardwareBacked, true);
  assert.equal(widevine.robustness, 'HW_SECURE_ALL');
  assert.deepEqual(widevine.encryptionSchemes, ['cenc', 'cbcs']);
});

test('probeDrmKeySystems falls back to Widevine L3 when HW_SECURE_ALL rejects and SW_SECURE_CRYPTO succeeds', async () => {
  const nav = createMockNavigator({ widevineRobustness: ['SW_SECURE_CRYPTO'] });
  const drm = await probeDrmKeySystems(nav);
  const widevine = drm.find((d) => d.id === 'widevine');

  assert.equal(widevine.supported, true);
  assert.equal(widevine.securityLevel, 'L3');
  assert.equal(widevine.hardwareBacked, false);
  assert.equal(widevine.robustness, 'SW_SECURE_CRYPTO');
});

test('probeDrmKeySystems detects Edge PlayReady SL3000 vs SL2000 and Safari FairPlay TEE', async () => {
  const edgeNav = createMockNavigator({
    widevineRobustness: ['SW_SECURE_CRYPTO'],
    playreadyRobustness: ['3000', '2000'],
  });
  const edgeDrm = await probeDrmKeySystems(edgeNav);
  const playready3000 = edgeDrm.find((d) => d.id === 'playready');
  assert.equal(playready3000.supported, true);
  assert.equal(playready3000.securityLevel, 'SL3000');
  assert.equal(playready3000.hardwareBacked, true);

  const edgeSwNav = createMockNavigator({ playreadyRobustness: ['2000'] });
  const edgeSwDrm = await probeDrmKeySystems(edgeSwNav);
  const playready2000 = edgeSwDrm.find((d) => d.id === 'playready');
  assert.equal(playready2000.securityLevel, 'SL2000');
  assert.equal(playready2000.hardwareBacked, false);

  const safariNav = createMockNavigator({ fairplay: true, clearkey: true });
  const safariDrm = await probeDrmKeySystems(safariNav);
  const fairplay = safariDrm.find((d) => d.id === 'fairplay');
  assert.equal(fairplay.supported, true);
  assert.equal(fairplay.securityLevel, 'TEE');
  assert.equal(fairplay.hardwareBacked, true);
});

test('probeVideoCodecs distinguishes hardware AV1 vs CPU software decode fallback', async () => {
  const nav = createMockNavigator({
    videoSupport: {
      av01: (v) => ({
        supported: true,
        smooth: v.height <= 1080,
        powerEfficient: false, // CPU software AV1 fallback
      }),
      hvc1: { supported: true, smooth: true, powerEfficient: true },
      vp09: (v) => ({
        supported: true,
        smooth: true,
        powerEfficient: v.height <= 1080, // 1080p60 HW, 4K60 SW
      }),
      avc1: { supported: false, smooth: false, powerEfficient: false },
    },
  });

  const codecs = await probeVideoCodecs(nav);
  const av1 = codecs.find((c) => c.codecId === 'av1');
  const hevc = codecs.find((c) => c.codecId === 'hevc');
  const vp9 = codecs.find((c) => c.codecId === 'vp9');
  const h264 = codecs.find((c) => c.codecId === 'h264');

  assert.equal(av1.supported, true);
  assert.equal(av1.powerEfficient, false);
  assert.equal(av1.hardwareAccelerated, false);
  assert.equal(av1.status, 'software');
  assert.equal(av1.maxSupportedResolution, '4K60');
  assert.equal(av1.maxHardwareResolution, null);

  assert.equal(hevc.status, 'hardware');
  assert.equal(hevc.maxHardwareResolution, '4K60');

  assert.equal(vp9.status, 'hardware');
  assert.equal(vp9.maxHardwareResolution, '1080p60');

  assert.equal(h264.supported, false);
  assert.equal(h264.status, 'unsupported');
});

test('probeAudioCodecs probes Opus, AAC-LC, FLAC, and Dolby Digital Plus (EC-3)', async () => {
  const nav = createMockNavigator({
    audioSupport: {
      opus: { supported: true, smooth: true, powerEfficient: true },
      'mp4a.40.2': { supported: true, smooth: true, powerEfficient: true },
      flac: { supported: true, smooth: true, powerEfficient: false },
      'ec-3': { supported: false, smooth: false, powerEfficient: false },
    },
  });

  const audio = await probeAudioCodecs(nav);
  assert.equal(audio.length, 4);
  assert.equal(audio.find((a) => a.codecId === 'opus').supported, true);
  assert.equal(audio.find((a) => a.codecId === 'aac').supported, true);
  assert.equal(audio.find((a) => a.codecId === 'flac').powerEfficient, false);
  assert.equal(audio.find((a) => a.codecId === 'ec3').supported, false);
});

test('SSR and missing navigator inputs degrade gracefully without throwing', async () => {
  for (const missing of [null, undefined, {}]) {
    const report = await runFullMediaProbe(missing);
    assert.equal(report.environmentSupported.eme, false);
    assert.equal(report.environmentSupported.mediaCapabilities, false);
    assert.equal(report.drm.length, 4);
    assert.ok(report.drm.every((d) => d.supported === false && d.securityLevel === 'Unsupported'));
    assert.equal(report.videoCodecs.length, 4);
    assert.ok(report.videoCodecs.every((v) => v.status === 'unsupported'));
    assert.equal(report.audioCodecs.length, 4);
    assert.ok(report.audioCodecs.every((a) => a.supported === false));
    assert.equal(report.summary.widevineTier, 'Unsupported');
    assert.equal(report.summary.highestHardwareDrm, null);
  }
});

test('runFullMediaProbe returns structured JSON report and accurate streaming summary', async () => {
  const l1Nav = createMockNavigator({
    widevineRobustness: ['HW_SECURE_ALL', 'SW_SECURE_CRYPTO'],
    videoSupport: {
      av01: { supported: true, smooth: true, powerEfficient: true },
      hvc1: { supported: true, smooth: true, powerEfficient: true },
      vp09: { supported: true, smooth: true, powerEfficient: true },
      avc1: { supported: true, smooth: true, powerEfficient: true },
    },
    audioSupport: {
      opus: { supported: true, smooth: true, powerEfficient: true },
      'mp4a.40.2': { supported: true, smooth: true, powerEfficient: true },
      flac: { supported: true, smooth: true, powerEfficient: true },
      'ec-3': { supported: true, smooth: true, powerEfficient: true },
    },
  });

  const report = await runFullMediaProbe(l1Nav);
  assert.equal(report.environmentSupported.eme, true);
  assert.equal(report.environmentSupported.mediaCapabilities, true);
  assert.equal(report.summary.widevineTier, 'L1');
  assert.equal(report.summary.highestHardwareDrm, 'Widevine L1');
  assert.equal(report.summary.estimatedMaxStreamingResolution, '4K / UHD');
  assert.equal(report.summary.hardwareAv1, true);
  assert.equal(report.summary.hardwareHevc, true);
  assert.equal(report.summary.dolbyDigitalPlus, true);
  assert.match(report.summary.headline, /Widevine L1/);

  const l3Nav = createMockNavigator({
    widevineRobustness: ['SW_SECURE_CRYPTO'],
    videoSupport: { avc1: { supported: true, smooth: true, powerEfficient: true } },
  });
  const l3Report = await runFullMediaProbe(l3Nav);
  assert.equal(l3Report.summary.widevineTier, 'L3');
  assert.equal(l3Report.summary.highestHardwareDrm, null);
  assert.equal(l3Report.summary.estimatedMaxStreamingResolution, '720p SD (Software DRM Cap)');
  assert.match(l3Report.summary.headline, /720p/);
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
