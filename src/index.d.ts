export type DrmKeySystemId = 'widevine' | 'playready' | 'fairplay' | 'clearkey';

export type DrmSecurityLevel =
  | 'L1'
  | 'L2'
  | 'L3'
  | 'SL3000'
  | 'SL2000'
  | 'FairPlay (platform-managed)'
  | 'ClearKey'
  | 'Unsupported';

export type VideoCodecId = 'av1' | 'hevc' | 'vp9' | 'h264';
export type AudioCodecId = 'opus' | 'aac' | 'flac' | 'ec3';
export type DecodeStatus = 'hardware' | 'software' | 'unsupported';
export type VideoResolutionTier = '1080p60' | '4K30' | '4K60';
export type MediaDecodingType = 'media-source' | 'file';

export interface DrmCandidateSpec {
  keySystem: string;
  initDataTypes: string[];
  robustness?: string;
  securityLevel: DrmSecurityLevel;
  hardwareBacked: boolean | null;
  teeCrypto: boolean | null;
  legacy: boolean;
  robustnessLabel: string;
}

export interface DrmKeySystemSpec {
  id: DrmKeySystemId;
  keySystem: string;
  name: string;
  candidateEncryptionSchemes: string[];
  candidates: DrmCandidateSpec[];
}

export interface CodecDrmSupport {
  codecId: VideoCodecId;
  contentType: string;
  supported: boolean;
  securityLevel: DrmSecurityLevel;
  hardwareBacked: boolean | null;
  teeCrypto: boolean | null;
  robustness: string | null;
  matchedKeySystem: string | null;
  encryptionSchemes: string[];
  encryptionSchemeProbed: boolean;
}

export interface DrmProbeResult {
  id: DrmKeySystemId;
  keySystem: string;
  matchedKeySystem: string | null;
  name: string;
  supported: boolean;
  securityLevel: DrmSecurityLevel;
  hardwareBacked: boolean | null;
  teeCrypto: boolean | null;
  legacy: boolean;
  robustness: string | null;
  robustnessLabel: string | null;
  encryptionSchemes: string[];
  encryptionSchemeProbed: boolean;
  supportedCodecs: Record<VideoCodecId, CodecDrmSupport>;
  notes: string | null;
}

export interface VideoCodecProfileDefinition {
  resolution: VideoResolutionTier;
  contentType: string;
  encryptedContentType?: string;
  width: number;
  height: number;
  framerate: number;
  bitrate: number;
}

export interface VideoCodecSpec {
  codecId: VideoCodecId;
  name: string;
  hdrNote?: string;
  profiles: VideoCodecProfileDefinition[];
}

export interface AudioCodecSpec {
  codecId: AudioCodecId;
  name: string;
  contentType: string;
  channels: string;
  bitrate: number;
  samplerate: number;
}

export interface VideoProfileProbeResult {
  resolution: VideoResolutionTier;
  contentType: string;
  encryptedContentType?: string;
  mediaType: MediaDecodingType;
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
  mediaType: MediaDecodingType;
  hdrNote?: string;
  supported: boolean;
  smooth: boolean;
  powerEfficient: boolean;
  hardwareAccelerated: boolean;
  status: DecodeStatus;
  maxSupportedResolution: VideoResolutionTier | null;
  maxHardwareResolution: VideoResolutionTier | null;
  profiles: VideoProfileProbeResult[];
}

export interface AudioCodecProbeResult {
  codecId: AudioCodecId;
  name: string;
  contentType: string;
  channels: string;
  mediaTypeUsed: MediaDecodingType;
  supported: boolean;
  smooth: boolean;
  powerEfficient: boolean;
  notes?: string;
}

export interface EncryptedStreamingCheck {
  drmId: DrmKeySystemId;
  keySystem: string;
  codecId: VideoCodecId;
  resolution: VideoResolutionTier;
  contentType: string;
  drmSecurityLevel: DrmSecurityLevel;
  drmHardwareBacked: boolean | null;
  supported: boolean;
  smooth: boolean;
  powerEfficient: boolean;
  coupledKeySystemVerified: boolean;
}

export interface EncryptedStreamingReport {
  coupledSupported: boolean;
  checks: EncryptedStreamingCheck[];
  notes?: string;
}

export interface HdcpCheckedSystem {
  keySystem: string;
  robustness: string | null;
  hardwareBacked: boolean | null;
  status: string;
  compliant: boolean;
}

export interface HdcpPolicyResult {
  checked: boolean;
  supported: boolean | null;
  compliant: boolean | null;
  minHdcpVersion: string;
  status: string;
  keySystem: string | null;
  checkedSystems: HdcpCheckedSystem[];
  notes?: string;
}

export interface MediaProbeSummary {
  widevineTier: 'L1' | 'L2' | 'L3' | 'Unsupported';
  highestHardwareDrm: 'Widevine L1' | 'PlayReady SL3000' | null;
  platformManagedDrm: 'Apple FairPlay (platform-managed)' | null;
  coupledEncryptedVerified: boolean;
  estimatedMaxStreamingResolution:
    | '4K / UHD'
    | '1080p HD (Hardware DRM)'
    | '1080p HD (HDCP 2.2 Restricted)'
    | '1080p HD (HDCP Restricted)'
    | '720p HD (Coupled 1080p/4K DRM Rejected)'
    | '1080p–4K UHD (FairPlay; T2/Apple Silicon for 4K)'
    | 'Up to 1080p HD (FairPlay platform-managed)'
    | '720p–1080p HD (Widevine L2; TEE Crypto Only)'
    | '720p HD (Software DRM Cap)'
    | 'Unverified (No EME DRM)';
  hardwareAv1: boolean;
  hardwareHevc: boolean;
  hardwareVp9: boolean;
  hardwareH264: boolean;
  dolbyDigitalPlus: boolean;
  powerEfficiencyNote: string;
  headline: string;
}

export interface FullMediaProbeReport {
  probedAt: string;
  environmentSupported: {
    eme: boolean;
    mediaCapabilities: boolean;
    isSecureContext: boolean;
  };
  mediaType: MediaDecodingType;
  drm: DrmProbeResult[];
  videoCodecs: VideoCodecProbeResult[];
  audioCodecs: AudioCodecProbeResult[];
  encryptedStreaming: EncryptedStreamingReport;
  hdcp: HdcpPolicyResult;
  summary: MediaProbeSummary;
}

export interface ProbeVideoOptions {
  mediaType?: MediaDecodingType;
}

export interface ProbeAudioOptions {
  mediaType?: MediaDecodingType;
}

export interface ProbeHdcpOptions {
  minHdcpVersion?: string;
  drmResults?: DrmProbeResult[];
}

export interface FullProbeOptions {
  mediaType?: MediaDecodingType;
  checkHdcp?: boolean;
  minHdcpVersion?: string;
  isSecureContext?: boolean;
}

export type NavigatorLike =
  | (Pick<Partial<Navigator>, 'requestMediaKeySystemAccess' | 'mediaCapabilities'> & {
      isSecureContext?: boolean;
    })
  | null
  | undefined;

export declare const EME_VIDEO_CODECS: Array<{ codecId: VideoCodecId; contentType: string }>;
export declare const DRM_KEY_SYSTEMS: DrmKeySystemSpec[];
export declare const VIDEO_CODEC_PROFILES: VideoCodecSpec[];
export declare const AUDIO_CODEC_PROFILES: AudioCodecSpec[];

export function probeDrmKeySystems(nav?: NavigatorLike): Promise<DrmProbeResult[]>;
export function probeVideoCodecs(nav?: NavigatorLike, options?: ProbeVideoOptions): Promise<VideoCodecProbeResult[]>;
export function probeAudioCodecs(nav?: NavigatorLike, options?: ProbeAudioOptions): Promise<AudioCodecProbeResult[]>;
export function probeEncryptedStreaming(
  nav: NavigatorLike,
  drmResults: DrmProbeResult[],
  videoCodecs: VideoCodecProbeResult[],
  options?: ProbeVideoOptions
): Promise<EncryptedStreamingReport>;
export function probeHdcpPolicy(nav?: NavigatorLike, options?: ProbeHdcpOptions): Promise<HdcpPolicyResult>;
export function runFullMediaProbe(nav?: NavigatorLike, options?: FullProbeOptions): Promise<FullMediaProbeReport>;
