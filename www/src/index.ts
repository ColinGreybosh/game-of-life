import { getColors } from "./color";
import { GameState } from "./game_state";
import { loadWasm } from "./wasm";

async function main() {
  const wasm = await loadWasm();
  const colors = getColors();
  if (colors == null) {
    throw Error("failed to initialize color pickers");
  }
  const game = new GameState(wasm, {
    canvasElementId: "game-of-life",
    width: 200,
    height: 200,
    cellSize: 3,
    colors,
  });
  const loop = () => {
    game.tick();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

main();
