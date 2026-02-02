export interface Colors {
  alive: () => string;
  dead: () => string;
  grid: () => string;
}

export function getColors(): Colors | undefined {
  const aliveColorInput = getColorPicker("alive-color");
  if (aliveColorInput == null) {
    return undefined;
  }
  const deadColorInput = getColorPicker("dead-color");
  if (deadColorInput == null) {
    return undefined;
  }
  const gridColorInput = getColorPicker("grid-color");
  if (gridColorInput == null) {
    return undefined;
  }
  return {
    alive: () => aliveColorInput.value,
    dead: () => deadColorInput.value,
    grid: () => gridColorInput.value,
  }
}

function getColorPicker(id: string): HTMLInputElement | undefined {
  const element = document.getElementById(id);
  if (element == null || !(element instanceof HTMLInputElement)) {
    return undefined;
  }
  if (element.type !== "color") {
    return undefined;
  }
  return element;
}