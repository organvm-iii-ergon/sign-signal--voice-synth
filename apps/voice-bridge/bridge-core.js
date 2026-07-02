const path = require('path');

const ANSI_ESCAPE_PATTERN = /\x1B\[[0-9;]*[JKmsu]/g;
const LEADING_BRACKET_PATTERN = /^\[.*?\]/;
const COMMAND_PUNCTUATION_PATTERN = /[.,!?]/g;

const DEFAULT_NOISE_PHRASES = [
  'thank you.',
  'thank you for watching.',
  'you',
  'please subscribe',
  'english subtitles',
  'subscribe',
  'watching',
  'thanks for watching'
];

const loadConfig = (env = process.env, baseDir = __dirname) => ({
  port: env.PORT || 9999,
  modelPath: env.WHISPER_MODEL_PATH
    ? path.resolve(baseDir, env.WHISPER_MODEL_PATH)
    : path.join(baseDir, 'models', 'ggml-base.en.bin'),
  threads: env.WHISPER_THREADS || '4',
  stepMs: env.WHISPER_STEP_MS || '500',
  lengthMs: env.WHISPER_LENGTH_MS || '3000',
  vadThreshold: env.WHISPER_VAD_THOLD || '0.6'
});

const cleanCommand = (phrase) => String(phrase)
  .toLowerCase()
  .replace(COMMAND_PUNCTUATION_PATTERN, '')
  .trim();

const normalizeCommand = (phrase, registeredCommands = new Set()) => {
  const cleanPhrase = cleanCommand(phrase);
  for (const command of registeredCommands) {
    if (cleanCommand(command) === cleanPhrase) {
      return command;
    }
  }
  return phrase;
};

const cleanRecognitionLine = (line) => String(line)
  .replace(ANSI_ESCAPE_PATTERN, '')
  .replace(LEADING_BRACKET_PATTERN, '')
  .trim();

const isNoiseRecognition = (rawPhrase, noisePhrases = DEFAULT_NOISE_PHRASES) => {
  const phrase = rawPhrase.toLowerCase();

  if (
    phrase.startsWith('[') ||
    phrase.endsWith(']') ||
    phrase.startsWith('(') ||
    phrase.endsWith(')')
  ) {
    return true;
  }

  if (noisePhrases.some((noise) => phrase.includes(noise))) {
    return true;
  }

  return phrase.length < 2;
};

const parseWhisperRecognitions = (data, registeredCommands = new Set()) => {
  const text = data.toString().trim();
  if (!text) {
    return [];
  }

  return text
    .split('\n')
    .map(cleanRecognitionLine)
    .filter((rawPhrase) => rawPhrase && !isNoiseRecognition(rawPhrase))
    .map((rawPhrase) => ({
      rawPhrase,
      command: normalizeCommand(rawPhrase, registeredCommands)
    }));
};

const addRegisteredCommands = (registeredCommands, commands = []) => {
  if (!Array.isArray(commands)) {
    return registeredCommands;
  }

  commands.forEach((command) => {
    if (command && typeof command.command === 'string') {
      registeredCommands.add(command.command);
    }
  });

  return registeredCommands;
};

const buildWhisperArgs = (config) => [
  '-m',
  config.modelPath,
  '-t',
  config.threads,
  '--step',
  config.stepMs,
  '--length',
  config.lengthMs,
  '-vth',
  config.vadThreshold
];

module.exports = {
  addRegisteredCommands,
  buildWhisperArgs,
  cleanCommand,
  cleanRecognitionLine,
  isNoiseRecognition,
  loadConfig,
  normalizeCommand,
  parseWhisperRecognitions
};
