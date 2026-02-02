export type Wasm = Awaited<ReturnType<typeof loadWasm>>;

export async function loadWasm() {
  return await import("game-of-life");
}