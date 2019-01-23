import React, { Component } from "react";

import Key from "./normal-key";
import SpecialKey from "./special-key";
import SpaceKey from "./space-key";

import {
  topRowItems,
  secondRow,
  thirdRow,
  fourthRow,
  fifthRow,
  isTextInputElement,
  addEnter,
  shiftIt,
  capsIt
} from "./helper";

import "./App.scss";

type myState = {
  visible: Boolean;
  top: number;
  left: number;
  activeKeys: Map<string, undefined>;
};

type elementPosition = {
  top: number;
  left: number;
};

declare global {
  interface Window {
    HTMLInputElement: any;
    HTMLTextAreaElement: any;
  }
}

// declare function Object

class App extends Component {
  timeout: number = -1;
  width: number = 900;
  paddingFromInput: number = 0;
  activeElement: HTMLInputElement | null = null;
  lastFocused: HTMLElement | null = null;
  customInputEvent: any = null;
  customTextAreaEvent: any = null;
  nativeInputValueSetter: any = null;
  nativeTextAreaValueSetter: any = null;
  disabled: Array<string> = [];

  state: myState = {
    visible: false,
    activeKeys: new Map(),
    top: 0,
    left: 0
  };

  componentDidMount() {
    this.addEventListeners(Object);
    this.disabled = ["ctrl", "fn", "window", "alt"];
  }

  addEventListeners = (obj: any) => {
    const { document, HTMLInputElement, HTMLTextAreaElement } = window;
    const { prototype: inputPrototype } = HTMLInputElement;
    const { prototype: textAreaPrototype } = HTMLTextAreaElement;

    this.nativeInputValueSetter = obj.getOwnPropertyDescriptor(
      inputPrototype,
      "value"
    ).set;
    this.nativeTextAreaValueSetter = obj.getOwnPropertyDescriptor(
      textAreaPrototype,
      "value"
    ).set;

    this.customInputEvent = new Event("input", { bubbles: true });
    this.customTextAreaEvent = new Event("textarea", { bubbles: true });

    document.body.addEventListener("focusin", this.onFocus);
    document.body.addEventListener("focusout", this.onBlur);
  };

  onFocus = (e: Event) => {
    const node = e.target as HTMLInputElement;
    const clickInsideKeyboard =
      node.classList.contains("_key") ||
      node.classList.contains("_rc-v-keyboard");

    if (isTextInputElement(node)) {
      // if there a timer added by blur even then remove it
      this.cancelTimer();
      const position = this.getKeyboardPosition(node);
      this.setState({ visible: true, ...position });
    } else if (
      this.lastFocused &&
      node &&
      node.nodeName === "DIV" &&
      clickInsideKeyboard
    ) {
      this.cancelTimer();
      this.lastFocused.focus && this.lastFocused.focus();
      this.lastFocused = null;
    }
  };

  onBlur = (e: Event) => {
    const { document } = window;
    const activeElement = document.activeElement as HTMLElement;
    const lastFocused = e.target as HTMLElement;
    if (activeElement && !isTextInputElement(activeElement)) {
      if (isTextInputElement(lastFocused)) {
        this.lastFocused = e.target as HTMLElement;
      }
      this.setTimer();
    }
  };

  // blur after 1/2 sec delay, it is possible that next input gets focused
  // in that case first blur will get triggered and then focus
  // it prevents flickering of keyboard
  setTimer = (immediately: Boolean = false) => {
    // if(immediately){
    //   clearTimeout(this.timeout);
    //   this.timeout = -1;
    //   this.setState({ visible: false });
    //   return
    // }
    this.timeout = setTimeout(() => {
      this.timeout = -1;
      this.setState({ visible: false });
      this.lastFocused = null;
    }, 300);
  };

  cancelTimer = () => {
    if (this.timeout !== -1) {
      // if there a timer added by blur even then remove it
      clearTimeout(this.timeout);
    }
  };

  getKeyboardPosition = (el: HTMLElement): elementPosition => {
    let position = {
      top: 0,
      left: 0
    };
    if (el) {
      let { top, left, height } = el.getBoundingClientRect();
      const widowWidth = window.innerWidth;
      if (widowWidth - left < this.width) {
        left = widowWidth - this.width;
      }
      position = { top: top + height + this.paddingFromInput, left };
    }
    return position;
  };

  onKeyPress = (e: Event) => {
    this.activeElement = document.activeElement as HTMLInputElement;
    const targetEl = e.target as HTMLInputElement;
    let pressedKey = targetEl.getAttribute("key-val");
    const classList = targetEl.classList;
    const disabled = classList.contains("_disabled");
    if (disabled) {
      console.log(" pressed disabled key");
      return;
    }

    if (!pressedKey || !isTextInputElement(this.activeElement)) return;

    let existingValue = this.activeElement.value;
    const isSpecial = classList.contains("_special");

    const isEditableSpecialKey =
      pressedKey === "delete" || pressedKey === "tab" || pressedKey === "enter";

    if (isSpecial && !isEditableSpecialKey) {
      this.handleSpecial(pressedKey);
      return;
    }

    const { activeKeys } = this.state;

    pressedKey = addEnter(targetEl, pressedKey);

    if (pressedKey === "delete") {
      existingValue = existingValue.slice(0, -1);
      pressedKey = "";
    }

    if (pressedKey === "tab") {
      pressedKey = "  ";
    }

    pressedKey = shiftIt(activeKeys, targetEl, pressedKey);
    pressedKey = capsIt(activeKeys, pressedKey);

    this.triggerChange(this.activeElement, existingValue + pressedKey);
  };

  triggerChange = (
    element: HTMLInputElement | HTMLTextAreaElement,
    newValue: string
  ) => {
    if (!element) return;
    if (
      element.nodeName === "INPUT" &&
      this.nativeInputValueSetter &&
      this.customInputEvent
    ) {
      this.nativeInputValueSetter.call(element, newValue);
      element.dispatchEvent(this.customInputEvent);
    } else if (
      element.nodeName === "TEXTAREA" &&
      this.nativeTextAreaValueSetter &&
      this.customTextAreaEvent
    ) {
      this.nativeTextAreaValueSetter.call(element, newValue);
      element.dispatchEvent(this.customTextAreaEvent);
    }
  };

  handleSpecial = (key: string) => {
    const { activeKeys } = this.state;
    if (activeKeys.has(key)) {
      activeKeys.delete(key);
    } else {
      activeKeys.set(key, undefined);
    }
    this.setState({ activeKeys });
  };

  render() {
    const { visible, ...position } = this.state;
    return (
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            console.log(" submited");
          }}
        >
          <input
            placeholder="first input"
            onChange={e => console.log(" changed")}
          />
          <textarea
            placeholder="first input"
            onChange={e => console.log(" text-area changed")}
          />

          <input placeholder="first input" />
          <button> btn </button>
          <input placeholder="first input" />
        </form>
        {visible && (
          <Keyboard
            {...position}
            width={this.width}
            onKeyPress={this.onKeyPress}
            disabledKeys={this.disabled}
          />
        )}
      </div>
    );
  }
}

type keyboardProps = {
  width: number;
  top: number;
  left: number;
  onKeyPress: any;
  activeKeys?: Map<string, undefined>;
  disabledKeys?: Array<String>;
};

const Keyboard = (props: keyboardProps) => {
  const position = {
    width: props.width,
    transform: `translate(${props.left}px, ${props.top}px)`,
    transitionDuration: `0.5s`
  };
  const { activeKeys, disabledKeys = [] } = props;
  return (
    <div
      className="_rc-v-keyboard"
      style={{ ...position }}
      onClick={props.onKeyPress}
      tabIndex={-1}
      // it needs tab index show if user clicks in keyboard body it gets focused
      // and then we can return focus to input
    >
      <div className="_keys _top-keys">
        {topRowItems.map(key => {
          return (
            <Key value={key.main} sub={key.sub} disabledKeys={disabledKeys} />
          );
        })}
        <SpecialKey value="delete" disabledKeys={disabledKeys} />
      </div>
      <div className="_keys _top-keys">
        <SpecialKey value="tab" disabledKeys={disabledKeys} />
        {secondRow.map(key => {
          return (
            <Key value={key.main} sub={key.sub} disabledKeys={disabledKeys} />
          );
        })}
      </div>
      <div className="_keys _top-keys">
        <SpecialKey
          value="caps"
          name="caps lock"
          activeKeys={activeKeys}
          disabledKeys={disabledKeys}
        />
        {thirdRow.map(key => {
          return (
            <Key value={key.main} sub={key.sub} disabledKeys={disabledKeys} />
          );
        })}
        <SpecialKey value="enter" disabledKeys={disabledKeys} />
      </div>
      <div className="_keys _top-keys">
        <SpecialKey
          value="shift"
          activeKeys={activeKeys}
          disabledKeys={disabledKeys}
        />
        {fourthRow.map(key => {
          return (
            <Key value={key.main} sub={key.sub} disabledKeys={disabledKeys} />
          );
        })}
        <SpecialKey
          value="shift"
          activeKeys={activeKeys}
          disabledKeys={disabledKeys}
        />
      </div>
      <div className="_keys _top-keys">
        {fifthRow.map(key => {
          return key.isSpace ? (
            <SpaceKey disabled={disabledKeys.indexOf(" ") !== -1} />
          ) : (
            <SpecialKey value={key.main} disabledKeys={disabledKeys} />
          );
        })}
      </div>
    </div>
  );
};

export default App;
