import { Game } from "game-of-life";
import { Wasm } from "./wasm";

interface Color {
  alive: string;
  dead: string;
  grid: string
}
export class GameState {
  private readonly wasm: Wasm;
  private readonly width: number;
  private readonly height: number;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly game: Game;
  private readonly cellSize: number;
  private readonly color: Color;

  constructor(wasm: Wasm, args: {
    canvasElementId: string;
    width: number;
    height: number;
    cellSize: number;
    color: Color;
  }) {
    this.wasm = wasm;
    this.width = args.width;
    this.height = args.height;
    this.cellSize = args.cellSize;
    this.color = args.color;
    
    const canvas = document.getElementById(args.canvasElementId);
    if (canvas == null || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error(`failed to locate <canvas> element with ID ${args.canvasElementId}`);
    }

    canvas.height = (this.cellSize + 1) * this.height + 1;
    canvas.width = (this.cellSize + 1) * this.width + 1;

    const ctx = canvas.getContext("2d");
    if (ctx == null) {
      throw new Error("failed to obtain canvas context");
    }
    this.ctx = ctx;

    this.game = wasm.Game.new(this.width, this.height);
  }

  public tick() {
    this.drawGrid();
    this.drawCells();
    this.game.update();
  }

  private drawGrid() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.color.grid;

    // Vertical lines.
    for (let i = 0; i <= this.width; i++) {
      this.ctx.moveTo(i * (this.cellSize + 1) + 1, 0);
      this.ctx.lineTo(i * (this.cellSize + 1) + 1, (this.cellSize + 1) * this.height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= this.height; j++) {
      this.ctx.moveTo(0, j * (this.cellSize + 1) + 1);
      this.ctx.lineTo((this.cellSize + 1) * this.width + 1, j * (this.cellSize + 1) + 1);
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
          ? this.color.dead
          : this.color.alive;

        this.ctx.fillRect(
          col * (this.cellSize + 1) + 1,
          row * (this.cellSize + 1) + 1,
          this.cellSize,
          this.cellSize
        );
      }
    }

    this.ctx.stroke();
  }

  private getIndex(x: number, y: number): number {
    return x * this.width + y;
  }
}