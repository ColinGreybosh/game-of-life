import { GameState } from "./game_state";
import { loadWasm } from "./wasm";

async function main() {
  const wasm = await loadWasm();
  const game = new GameState(wasm, {
    canvasElementId: "game-of-life",
    width: 200,
    height: 200,
    cellSize: 3,
    color: {
      alive: "#051118",
      dead: "#F8F7F4",
      grid: "#F1FAFF",
    }
  });
  const loop = () => {
    game.tick();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

main();
