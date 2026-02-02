import { GameState } from "./game_state";
import { loadWasm } from "./wasm";

async function main() {
  const wasm = await loadWasm();
  const game = new GameState(wasm, {
    canvasElementId: "game-of-life",
    width: 200,
    height: 200,
  });
  const loop = () => {
    game.tick();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

main();
