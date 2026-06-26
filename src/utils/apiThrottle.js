const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runLimited(items, worker, delayMs = 150) {
  const results = [];

  for (const item of items) {
    const result = await worker(item);
    results.push(result);
    await wait(delayMs);
  }

  return results;
}