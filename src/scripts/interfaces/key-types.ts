// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
export type KeyTypes =
  | 'Alt'
  | 'AltGraph'
  | 'Tab'
  | 'Enter'
  | 'Shift'
  | 'Meta'
  | 'Backspace'
  | 'Delete'
  | 'A'
  | 'Escape'
  | 'Esc' // In Firefox 36 and earlier, the Esc key returns "Esc" instead of "Escape".
  | 'ArrowUp'
  | 'ArrowDown'
  | 'PageDown'
  | 'PageUp';
