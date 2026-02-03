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
    alive: () => {
      window.localStorage.setItem("alive-color", aliveColorInput.value);
      return aliveColorInput.value;
    },
    dead: () => {
      window.localStorage.setItem("dead-color", deadColorInput.value);
      return deadColorInput.value;
    },
    grid: () => {
      window.localStorage.setItem("grid-color", gridColorInput.value);
      return gridColorInput.value;
    },
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
  const value = window.localStorage.getItem(id);
  if (value != null) {
    element.value = value;
  }
  return element;
}