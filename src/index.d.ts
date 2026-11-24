export type DrmKeySystemId = 'widevine' | 'playready' | 'fairplay' | 'clearkey';

export type DrmSecurityLevel = 'L1' | 'L3' | 'SL3000' | 'SL2000' | 'TEE' | 'ClearKey' | 'Unsupported';

export interface DrmProbeResult {
  id: DrmKeySystemId;
  keySystem: string;
  name: string;
  supported: boolean;
  securityLevel: DrmSecurityLevel;
  hardwareBacked: boolean;
  robustness: string | null;
  encryptionSchemes: string[];
}

export type VideoCodecId = 'av1' | 'hevc' | 'vp9' | 'h264';
export type DecodeStatus = 'hardware' | 'software' | 'unsupported';
export type VideoResolutionTier = '1080p60' | '4K60';

export interface VideoProfileProbeResult {
  resolution: VideoResolutionTier;
  width: number;
  height: number;
  framerate: number;
  bitrate: number;
  supported: boolean;
  smooth: boolean;
  powerEfficient: boolean;
  status: DecodeStatus;
}

export interface VideoCodecProbeResult {
  codecId: VideoCodecId;
  name: string;
  contentType: string;
  supported: boolean;
  smooth: boolean;
  powerEfficient: boolean;
  hardwareAccelerated: boolean;
  status: DecodeStatus;
  maxSupportedResolution: VideoResolutionTier | null;
  maxHardwareResolution: VideoResolutionTier | null;
  profiles: VideoProfileProbeResult[];
}

export type AudioCodecId = 'opus' | 'aac' | 'flac' | 'ec3';

export interface AudioCodecProbeResult {
  codecId: AudioCodecId;
  name: string;
  contentType: string;
  channels: string;
  supported: boolean;
  smooth: boolean;
  powerEfficient: boolean;
}

export interface MediaProbeSummary {
  widevineTier: 'L1' | 'L3' | 'Unsupported';
  highestHardwareDrm: 'Widevine L1' | 'PlayReady SL3000' | 'FairPlay TEE' | null;
  estimatedMaxStreamingResolution:
    | '4K / UHD'
    | '1080p HD (Hardware DRM)'
    | '720p SD (Software DRM Cap)'
    | 'Unverified (No EME DRM)';
  hardwareAv1: boolean;
  hardwareHevc: boolean;
  hardwareVp9: boolean;
  hardwareH264: boolean;
  dolbyDigitalPlus: boolean;
  headline: string;
}

export interface FullMediaProbeReport {
  probedAt: string;
  environmentSupported: {
    eme: boolean;
    mediaCapabilities: boolean;
  };
  drm: DrmProbeResult[];
  videoCodecs: VideoCodecProbeResult[];
  audioCodecs: AudioCodecProbeResult[];
  summary: MediaProbeSummary;
}

export type NavigatorLike = Pick<Partial<Navigator>, 'requestMediaKeySystemAccess' | 'mediaCapabilities'> | null | undefined;

export function probeDrmKeySystems(nav?: NavigatorLike): Promise<DrmProbeResult[]>;
export function probeVideoCodecs(nav?: NavigatorLike): Promise<VideoCodecProbeResult[]>;
export function probeAudioCodecs(nav?: NavigatorLike): Promise<AudioCodecProbeResult[]>;
export function runFullMediaProbe(nav?: NavigatorLike): Promise<FullMediaProbeReport>;
