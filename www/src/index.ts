import { onButtonClick } from "./button";
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
    width: 250,
    height: 200,
    cellSize: 3,
    colors,
  });
  
  let handle: number | undefined = undefined;
  const loop = () => {
    game.tick();
    handle = requestAnimationFrame(loop);
  };

  onButtonClick("play-button", (button) => {
    if (handle != null) {
      cancelAnimationFrame(handle);
      handle = undefined;
      button.textContent = "Play";
    } else {
      button.textContent = "Pause";
      loop();
    }
  });

  onButtonClick("clear-button", () => {
    game.clear();
  });

  onButtonClick("randomize-button", () => {
    game.reset();
  })

  requestAnimationFrame(loop);
}

main();
