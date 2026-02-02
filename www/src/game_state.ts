import { Game } from "game-of-life";
import { Wasm } from "./wasm";

const CELL_SIZE = 3;
const GRID_COLOR = "#F1FAFF";
const ALIVE_COLOR = "#051118";
const DEAD_COLOR = "#F8F7F4";

export class GameState {
  readonly wasm: Wasm;
  readonly width: number;
  readonly height: number;
  readonly ctx: CanvasRenderingContext2D;
  readonly game: Game;

  constructor(wasm: Wasm, args: {
    canvasElementId: string;
    width: number;
    height: number;
  }) {
    this.wasm = wasm;
    this.width = args.width;
    this.height = args.height;
    
    const canvas = document.getElementById(args.canvasElementId);
    if (canvas == null || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error(`failed to locate <canvas> element with ID ${args.canvasElementId}`);
    }

    canvas.height = (CELL_SIZE + 1) * this.height + 1;
    canvas.width = (CELL_SIZE + 1) * this.width + 1;

    const ctx = canvas.getContext("2d");
    if (ctx == null) {
      throw new Error("failed to obtain canvas context");
    }
    this.ctx = ctx;

    this.game = wasm.Game.new(this.width, this.height);
  }

  tick() {
    this.drawGrid();
    this.drawCells();
    this.game.update();
  }

  private drawGrid() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= this.width; i++) {
      this.ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      this.ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * this.height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= this.height; j++) {
      this.ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
      this.ctx.lineTo((CELL_SIZE + 1) * this.width + 1, j * (CELL_SIZE + 1) + 1);
    }

    this.ctx.stroke();
  }

  private drawCells() {
    const cells = this.game.cells();

    this.ctx.beginPath();

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const idx = this.getIndex(row, col);

        this.ctx.fillStyle = cells[idx] === this.wasm.Cell.Dead
          ? DEAD_COLOR
          : ALIVE_COLOR;

        this.ctx.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }

    this.ctx.stroke();
  }

  private getIndex(x: number, y: number): number {
    return x * this.width + y;
  }
}