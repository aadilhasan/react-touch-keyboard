export const isTextInputElement = (node: HTMLElement) => {
  return (
    node &&
    node.nodeName &&
    (node.nodeName === "INPUT" || node.nodeName === "TEXTAREA")
  );
};

export const addEnter = (targetEl: HTMLElement, key: string) => {
  if (key === "enter") {
    if (targetEl && targetEl.nodeName === "TEXTAREA") {
      return "\n";
    }
    return "";
  }
  return key;
};

export const shiftIt = (
  activeKeys: Map<string, undefined>,
  targetEl: HTMLInputElement,
  mainValue: string
): string => {
  if (activeKeys.has("shift")) {
    const shiftValue = targetEl.getAttribute("shift-val");
    mainValue = shiftValue ? shiftValue : mainValue.toUpperCase();
  }
  return mainValue;
};

export const capsIt = (activeKeys: any, mainValue: string): string => {
  if (activeKeys.has("caps")) {
    mainValue = mainValue.toUpperCase();
  }
  return mainValue;
};

export const focusNext = (el: HTMLInputElement | HTMLTextAreaElement) => {
  const allFocusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  let i = 0,
    len = allFocusableElements.length;
  for (i; i < len; i += 1) {
    if (allFocusableElements[i] === el && i + 1 < len) {
      const el = allFocusableElements[i + 1] as
        | HTMLInputElement
        | HTMLTextAreaElement;
      el.focus();
    }
  }
};

export const noop = () => {};
