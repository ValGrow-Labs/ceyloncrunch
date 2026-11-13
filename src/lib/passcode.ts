/**
 * Ceylon Crunch - Site-Wide Passcode Security & Permanent Device Verification
 * Powered by ValGrow Labs
 */

// Storage keys
const STORAGE_KEY_SESSION = 'ceylon_crunch_passcode_session';
const STORAGE_KEY_LOCAL = 'ceylon_crunch_passcode_auth';
const STORAGE_KEY_ATTEMPTS = 'ceylon_crunch_passcode_attempts';

// Rate limiting thresholds
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 1000; // 30 seconds

// Pre-computed SHA-256 hashes of standard default passcodes:
// 'crunch2026' -> 24db66463194d962f64b289b5ccf5912206b5c4302dc09e4b6d907c7a8b6f145
// 'ceylon2026' -> 0e54454254db324351d733ef212f4d68381b98551e0da8bdaad444d307c8343a
// 'ceyloncrunch' -> fb158a889b0aa6230a33706819fc08fbdebe091d7290bbae42511f7f6264690e
const DEFAULT_PASSCODE_HASHES: string[] = [
  '24db66463194d962f64b289b5ccf5912206b5c4302dc09e4b6d907c7a8b6f145', // crunch2026
  '0e54454254db324351d733ef212f4d68381b98551e0da8bdaad444d307c8343a', // ceylon2026
  'fb158a889b0aa6230a33706819fc08fbdebe091d7290bbae42511f7f6264690e', // ceyloncrunch
];

// Configured environment passcode (if set)
const getConfiguredPasscode = (): string | null => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const envVal = (import.meta as any).env.VITE_SITE_PASSCODE || (import.meta as any).env.VITE_PASSCODE;
      if (envVal && typeof envVal === 'string' && envVal.trim()) {
        return envVal.trim();
      }
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env) {
      const envVal = process.env.VITE_SITE_PASSCODE || process.env.VITE_PASSCODE;
      if (envVal && typeof envVal === 'string' && envVal.trim()) {
        return envVal.trim();
      }
    }
  } catch {}
  return null;
};

/**
 * Pure TypeScript SHA-256 fallback implementation
 * Ensures cryptographic hashing works in every runtime (browsers, testing, SSR, web workers)
 */
function sha256Fallback(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i = 0;
  let j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  const hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, boolean> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 300; i += candidate) {
        isComposite[i] = true;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80';
  while ((ascii.length % 64) !== 56) ascii += '\x00';
  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength | 0;

  for (j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];

      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] =
        i < 16
          ? w[i]
          : (w[i - 16] + s0 + w[i - 7] + s1) | 0;

      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp1 =
        hash[7] +
        (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) +
        ch +
        k[i] +
        w[i];
      const temp2 =
        (rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) +
        maj;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byte = (hash[i] >> (8 * b)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return result;
}

/**
 * Computes SHA-256 hash of a string using Web Crypto API or pure fallback
 */
export async function computeHash(input: string): Promise<string> {
  const normalized = input.trim();
  try {
    if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
      const buffer = new TextEncoder().encode(normalized);
      const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', buffer);
      return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch {}
  return sha256Fallback(normalized);
}

/**
 * Constant-time string comparison to resist timing attacks
 */
function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

interface StoredSession {
  hash: string;
  unlockedAt: number;
  token: string;
  permanent: boolean;
}

interface AttemptsState {
  count: number;
  lockedUntil: number;
}

/**
 * Retrieve rate-limiting attempt status
 */
export function getRateLimitStatus(): { isLocked: boolean; remainingSeconds: number } {
  try {
    if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0 };
    const raw = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
    if (!raw) return { isLocked: false, remainingSeconds: 0 };

    const state: AttemptsState = JSON.parse(raw);
    const now = Date.now();
    if (state.lockedUntil && state.lockedUntil > now) {
      const remainingSeconds = Math.ceil((state.lockedUntil - now) / 1000);
      return { isLocked: true, remainingSeconds };
    }
  } catch {}
  return { isLocked: false, remainingSeconds: 0 };
}

/**
 * Record a failed attempt
 */
export function recordFailedAttempt(): { isLocked: boolean; remainingSeconds: number } {
  try {
    if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0 };
    const raw = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
    let state: AttemptsState = { count: 0, lockedUntil: 0 };
    if (raw) {
      try {
        state = JSON.parse(raw);
      } catch {}
    }

    state.count = (state.count || 0) + 1;
    const now = Date.now();

    if (state.count >= MAX_FAILED_ATTEMPTS) {
      state.lockedUntil = now + LOCKOUT_DURATION_MS;
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(state));
      return { isLocked: true, remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000) };
    }

    localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(state));
  } catch {}
  return { isLocked: false, remainingSeconds: 0 };
}

/**
 * Reset failed attempts after successful passcode entry
 */
export function resetFailedAttempts(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
    }
  } catch {}
}

/**
 * Validate input passcode against configured passcode and defaults
 */
export async function verifyPasscode(input: string): Promise<boolean> {
  const cleanInput = input.trim();
  if (!cleanInput) return false;

  const inputHash = await computeHash(cleanInput);

  // 1. Check against environment configured passcode (if set)
  const envPasscode = getConfiguredPasscode();
  if (envPasscode) {
    if (cleanInput === envPasscode) return true;
    const envHash = await computeHash(envPasscode);
    if (constantTimeEquals(inputHash, envHash)) return true;
  }

  // 2. Check against default hashes
  for (const expectedHash of DEFAULT_PASSCODE_HASHES) {
    if (constantTimeEquals(inputHash, expectedHash)) {
      return true;
    }
  }

  return false;
}

/**
 * Save authenticated passcode session permanently in browser storage.
 * Access is remembered indefinitely on this browser across refreshes and restarts.
 */
export async function saveSession(inputPasscode: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const hash = await computeHash(inputPasscode.trim());
  const now = Date.now();
  const token = await computeHash(`${hash}:${now}:permanent`);

  const sessionData: StoredSession = {
    hash,
    unlockedAt: now,
    token,
    permanent: true,
  };

  const payload = JSON.stringify(sessionData);

  // Permanently save to localStorage (persists indefinitely until browser data is cleared)
  try {
    localStorage.setItem(STORAGE_KEY_LOCAL, payload);
  } catch {}

  // Also hydrate sessionStorage for current active tab
  try {
    sessionStorage.setItem(STORAGE_KEY_SESSION, payload);
  } catch {}
}

/**
 * Check if the site is currently unlocked permanently on this browser.
 * Returns true if valid access was previously entered, requiring no re-entry.
 */
export async function isSiteUnlocked(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const checkPayload = async (raw: string | null): Promise<boolean> => {
    if (!raw) return false;
    try {
      const session = JSON.parse(raw);
      if (!session || !session.hash) {
        return false;
      }

      // Check if hash matches environment passcode or default hashes
      const envPasscode = getConfiguredPasscode();
      if (envPasscode) {
        const envHash = await computeHash(envPasscode);
        if (constantTimeEquals(session.hash, envHash)) return true;
      }

      for (const expectedHash of DEFAULT_PASSCODE_HASHES) {
        if (constantTimeEquals(session.hash, expectedHash)) {
          return true;
        }
      }
    } catch {}
    return false;
  };

  // 1. Check permanent localStorage first (persists across sessions, restarts & refreshes)
  try {
    const localRaw = localStorage.getItem(STORAGE_KEY_LOCAL);
    if (localRaw && (await checkPayload(localRaw))) {
      // Re-hydrate sessionStorage for this tab
      try {
        sessionStorage.setItem(STORAGE_KEY_SESSION, localRaw);
      } catch {}
      return true;
    }
  } catch {}

  // 2. Fallback check for sessionStorage
  try {
    const sessionRaw = sessionStorage.getItem(STORAGE_KEY_SESSION);
    if (sessionRaw && (await checkPayload(sessionRaw))) {
      return true;
    }
  } catch {}

  return false;
}

/**
 * Lock site and clear stored access tokens (used when user manually clears data or for testing)
 */
export function lockSite(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY_SESSION);
    localStorage.removeItem(STORAGE_KEY_LOCAL);
  } catch {}
}
