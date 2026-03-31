export type DurationMode = "AUTO" | "FIXED_MS";
export type StartTrigger = "IMMEDIATE" | "AFTER_PREVIOUS" | "ON_CONDUCTOR_MARK";
export type LoopMode = "FIXED" | "ESCALATING";
export type VoiceProvider = "ELEVENLABS" | "COQUI" | "VALLE" | "CUSTOM_CLONE";

export interface Scene {
  id: string;
  title: string;
  rawText: string;
  createdAt: string;
  updatedAt: string;
}

export interface Speaker {
  id: string;
  sceneId: string;
  displayName: string;
  voiceProfileId: string | null;
  sortOrder: number;
}

export interface PhraseEvent {
  id: string;
  sceneId: string;
  speakerId: string | null;
  textContent: string;
  phraseIndex: number;
  repeatCount: number;
  staggerMs: number;
  durationMode: DurationMode;
  fixedDurationMs: number | null;
  startTrigger: StartTrigger;
  loopMode: LoopMode;
  estimatedDurationMs: number;
}

export interface VoiceProfile {
  id: string;
  provider: VoiceProvider;
  modelKey: string;
  displayName: string;
  speechRate: number;
  pitchOffset: number;
  cloneAudioUri: string | null;
}

export interface Version {
  id: string;
  sceneId: string;
  versionLabel: string;
  rawTextSnapshot: string;
  phrasesSnapshot: string;
  createdAt: string;
}

export interface CreateSceneInput {
  title: string;
  rawText: string;
}

export interface UpdateSceneInput {
  title?: string;
  rawText?: string;
}

export interface CreateSpeakerInput {
  sceneId: string;
  displayName: string;
}

export interface UpdateSpeakerInput {
  displayName?: string;
  voiceProfileId?: string | null;
  sortOrder?: number;
}

export interface CreatePhraseInput {
  sceneId: string;
  speakerId: string | null;
  textContent: string;
  phraseIndex: number;
}

export interface UpdatePhraseInput {
  speakerId?: string | null;
  textContent?: string;
  phraseIndex?: number;
  repeatCount?: number;
  staggerMs?: number;
  durationMode?: DurationMode;
  fixedDurationMs?: number | null;
  startTrigger?: StartTrigger;
  loopMode?: LoopMode;
}

export interface CreateVersionInput {
  sceneId: string;
  versionLabel: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentPhraseIndex: number;
  currentRepeatIndex: number;
  elapsedMs: number;
}

export interface TTSRequest {
  text: string;
  voiceProfileId: string;
}

export interface TTSResponse {
  audioUrl: string;
  durationMs: number;
}