export function getCached(key, maxAgeMs) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  const cached = JSON.parse(raw);
  const isFresh = Date.now() - cached.savedAt < maxAgeMs;

  return isFresh ? cached.data : null;
}

export function setCached(key, data) {
  localStorage.setItem(
    key,
    JSON.stringify({
      savedAt: Date.now(),
      data,
    })
  );
}