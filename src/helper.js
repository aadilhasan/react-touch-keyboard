export const topRowItems = [
  {
    main: "`",
    sub: "~"
  },
  {
    main: "1",
    sub: "!"
  },
  {
    main: "2",
    sub: "@"
  },
  {
    main: "3",
    sub: "#"
  },
  {
    main: "4",
    sub: "$"
  },
  {
    main: "5",
    sub: "%"
  },
  {
    main: "6",
    sub: "^"
  },
  {
    main: "7",
    sub: "&"
  },
  {
    main: "8",
    sub: "*"
  },
  {
    main: "9",
    sub: "("
  },
  {
    main: "0",
    sub: ")"
  },
  {
    main: "-",
    sub: "_"
  },
  {
    main: "+",
    sub: "="
  }
];

export const secondRow = [
  {
    main: "q"
  },
  {
    main: "w"
  },
  {
    main: "e"
  },
  {
    main: "r"
  },
  {
    main: "y"
  },
  {
    main: "u"
  },
  {
    main: "i"
  },
  {
    main: "o"
  },
  {
    main: "p"
  },
  {
    main: "[",
    sub: "{"
  },
  {
    main: "]",
    sub: "}"
  },
  {
    main: "\\",
    sub: "|"
  }
];

export const thirdRow = [
  {
    main: "a"
  },
  {
    main: "s"
  },
  {
    main: "d"
  },
  {
    main: "f"
  },
  {
    main: "g"
  },
  {
    main: "h"
  },
  {
    main: "j"
  },
  {
    main: "k"
  },
  {
    main: "k"
  },
  {
    main: "l"
  },
  {
    main: ";",
    sub: ";"
  },
  {
    main: "'",
    sub: '"'
  }
];

export const fourthRow = [
  {
    main: "z"
  },
  {
    main: "x"
  },
  {
    main: "c"
  },
  {
    main: "v"
  },
  {
    main: "b"
  },
  {
    main: "n"
  },
  {
    main: "m"
  },
  {
    main: ",",
    sub: "<"
  },
  {
    main: ".",
    sub: ">"
  },
  {
    main: "/",
    sub: "?"
  }
];

export const fifthRow = [
  {
    main: "ctrl"
  },
  {
    main: "fn"
  },

  {
    main: "window"
  },
  {
    main: "alt"
  },
  {
    main: " ",
    isSpace: true
  },
  {
    main: "alt"
  },
  {
    main: "ctrl"
  }
];

export const isTextInputElement = node => {
  return (
    node &&
    node.nodeName &&
    (node.nodeName === "INPUT" || node.nodeName === "TEXTAREA")
  );
};

// export const addEnter = (targetEl: HTMLInputElement, key: string): string => {
//   if (key === "enter") {
//     if (targetEl && targetEl.nodeName === "TEXTAREA") {
//       return key + "\\\n";
//     }
//     return "";
//   }
//   return key;
// };

export const addEnter = (targetEl, key) => {
  if (key === "enter") {
    if (targetEl && targetEl.nodeName === "TEXTAREA") {
      return "\n";
    }
    return "";
  }
  return key;
};

// export const shiftIt = (
//   activeKeys: Map<string, undefined>,
//   targetEl: HTMLInputElement,
//   mainValue: string
// ): string => {
//   if (activeKeys.has("shift")) {
//     const shiftValue = targetEl.getAttribute("shift-val");
//     mainValue = shiftValue ? shiftValue : mainValue.toUpperCase();
//   }
//   return mainValue;
// };

export const shiftIt = (activeKeys, targetEl, mainValue) => {
  if (activeKeys.has("shift")) {
    const shiftValue = targetEl.getAttribute("shift-val");
    mainValue = shiftValue ? shiftValue : mainValue.toUpperCase();
  }
  return mainValue;
};

// export const capsIt = (activeKeys: any, mainValue: string): string => {
//   if (activeKeys.has("caps")) {
//     mainValue = mainValue.toUpperCase();
//   }
//   return mainValue;
// };
export const capsIt = (activeKeys, mainValue) => {
  if (activeKeys.has("caps")) {
    mainValue = mainValue.toUpperCase();
  }
  return mainValue;
};

export const focusNext = el => {
  const allFocusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  let i = 0,
    len = allFocusableElements.length;
  for (i; i < len; i += 1) {
    if (allFocusableElements[i] === el && i + 1 < len) {
      allFocusableElements[i + 1].focus();
    }
  }
};
