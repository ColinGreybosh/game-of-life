export function onButtonClick(id: string, callback: (button: HTMLButtonElement) => void): boolean {
  const button = document.getElementById(id);
  if (button == null || !(button instanceof HTMLButtonElement)) {
    return false;
  }
  button.addEventListener('click', () => callback(button));
  return true;
}