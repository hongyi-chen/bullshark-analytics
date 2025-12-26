// Fun emoji pool for athlete avatars
const ATHLETE_EMOJIS = [
  "🦈",
  "🐬",
  "🐳",
  "🦭",
  "🐙",
  "🦑",
  "🦀",
  "🦞",
  "🐠",
  "🐟",
  "🦋",
  "🐝",
  "🐢",
  "🦎",
  "🐍",
  "🦖",
  "🦕",
  "🐲",
  "🦩",
  "🦚",
  "🦜",
  "🦢",
  "🦉",
  "🐧",
  "🐼",
  "🐨",
  "🦁",
  "🐯",
  "🐻",
  "🦊",
  "🐺",
  "🦝",
  "🐵",
  "🦍",
  "🦧",
  "🐘",
  "🦛",
  "🦏",
  "🐪",
  "🦒",
  "🦬",
  "🐂",
  "🐃",
  "🦌",
  "🐎",
  "🦄",
  "🐕",
  "🐈",
  "🐓",
  "🦃",
];

// Background colors that pair well with emojis
const EMOJI_BACKGROUNDS = [
  "rgba(34, 197, 94, 0.15)", // green
  "rgba(59, 130, 246, 0.15)", // blue
  "rgba(168, 85, 247, 0.15)", // purple
  "rgba(236, 72, 153, 0.15)", // pink
  "rgba(249, 115, 22, 0.15)", // orange
  "rgba(234, 179, 8, 0.15)", // yellow
  "rgba(6, 182, 212, 0.15)", // cyan
  "rgba(239, 68, 68, 0.15)", // red
  "rgba(132, 204, 22, 0.15)", // lime
  "rgba(99, 102, 241, 0.15)", // indigo
];

interface EmojiAndBackground {
  background: string;
  emoji: string;
}

// Simple hash function to get consistent index for a name
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getAthleteEmojiAndBackground(name: string): EmojiAndBackground {
  const hash = hashString(name);
  return {
    background: EMOJI_BACKGROUNDS[hash % EMOJI_BACKGROUNDS.length],
    emoji: ATHLETE_EMOJIS[hash % ATHLETE_EMOJIS.length],
  };
}
