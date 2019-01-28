import React, { Component } from "react";
import * as ReactDOM from "react-dom";

import KeyboardRows from "./components/rows";

import {
  isTextInputElement,
  addEnter,
  shiftIt,
  capsIt,
  focusNext,
  noop
} from "./utils/helper";

import "./keyboard.scss";

declare global {
  interface Window {
    HTMLInputElement: any;
    HTMLTextAreaElement: any;
  }
}

const defaultMountNode = document.body;

type elementPosition = {
  top: number;
  left: number;
};

type KeyboardProps = {
  marginFromInput: number;
  focusNextOnTab: Boolean;
  alwaysOpen: Boolean;
  disabled: Array<string>;
  width: number;
  height: number | string;
  fullScreen: Boolean;
  stickToBottom: Boolean;
  mountAt: HTMLElement | null;
  onKeyPress: Function;
  beforeOpen: Function;
  afterOpen: Function;
  beforeClose: Function;
  afterClose: Function;
};

let DefaultProps = {
  marginFromInput: 10,
  focusNextOnTab: true,
  alwaysOpen: false,
  disabled: [],
  width: 900,
  height: "auto",
  fullScreen: false,
  stickToBottom: false,
  mountAt: defaultMountNode,
  onKeyPress: noop,
  beforeOpen: noop, // gets triggered every time focus changes
  afterOpen: noop, // gets triggered every time focus changes
  beforeClose: noop,
  afterClose: noop
};

type MyState = {
  visible: Boolean;
  top: number;
  left: number;
  activeKeys: Map<string, undefined>;
  input: string;
  textarea: string;
};

// TODO: when input is below the keyboard show input's value in keyboard
// TODO: add expand keyboard btn, close keyboard btn, fullScreenBtn etc.

class Keyboard extends Component<KeyboardProps> {
  timeout: number = -1;
  width: number = 900;
  paddingFromInput: number = 0;
  activeElement: HTMLInputElement | null = null;
  lastFocused: HTMLElement | null = null;
  customInputEvent: any = null;
  customEnterInputEvent: any = null;
  nativeInputValueSetter: any = null;
  nativeTextAreaValueSetter: any = null;
  disabled: Array<string> = ["ctrl", "fn", "window", "alt"];

  static defaultProps = DefaultProps;

  state: MyState = {
    visible: false,
    activeKeys: new Map(),
    top: 0,
    left: 0,
    input: "",
    textarea: ""
  };

  constructor(props: any) {
    super(props);
    this.state = { ...this.state };
  }

  componentDidMount() {
    this.addEventListeners(Object);
  }
  componentWillUnmount() {
    this.removeEventListeners();
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

    document.body.addEventListener("focusin", this.onFocus);
    document.body.addEventListener("focusout", this.onBlur);
  };

  removeEventListeners = () => {
    document.body.removeEventListener("focusin", this.onFocus);
    document.body.removeEventListener("focusout", this.onBlur);
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
      this.props.beforeOpen();
      this.setState({ visible: true, ...position }, () => {
        this.props.afterOpen();
      });
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
    //   this.props.beforeClose();
    //   this.setState({ visible: false },  () => { this.props.afterClose(); });
    //   return
    // }
    this.timeout = setTimeout(() => {
      if (this.timeout === -1) return; // fix edge case when on double tab keyboard hides

      this.timeout = -1;
      this.props.beforeClose();
      this.setState({ visible: false }, () => {
        this.props.afterClose();
      });
      this.lastFocused = null;
    }, 300);
  };

  cancelTimer = () => {
    if (this.timeout !== -1) {
      // if there a timer added by blur even then remove it
      clearTimeout(this.timeout);
      this.timeout = -1;
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
      const ifOverflowing = this.props.width + left > widowWidth;
      if (ifOverflowing) {
        left = widowWidth - this.props.width;
      }
      left = left < 0 ? 0 : left;
      position = { top: top + height + this.props.marginFromInput, left };
    }
    return position;
  };

  onKeyPress = (e: any) => {
    this.activeElement = document.activeElement as HTMLInputElement;
    const targetEl = e.target as HTMLInputElement;
    let pressedKey = targetEl.getAttribute("key-val");
    const classList = targetEl.classList;
    const disabled = classList.contains("_disabled");
    if (disabled) {
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

    pressedKey = addEnter(this.activeElement, pressedKey);

    if (pressedKey === "delete") {
      existingValue = existingValue.slice(0, -1);
      pressedKey = "";
    }

    if (pressedKey === "tab") {
      if (this.props.focusNextOnTab) {
        focusNext(this.activeElement);
        return;
      } else {
        pressedKey = "  ";
      }
    }

    pressedKey = shiftIt(activeKeys, targetEl, pressedKey);
    pressedKey = capsIt(activeKeys, pressedKey);

    this.triggerChange(this.activeElement, existingValue + pressedKey);
    this.props.onKeyPress(pressedKey);
  };

  triggerChange = (
    element: HTMLInputElement | HTMLTextAreaElement,
    newValue: string
  ) => {
    if (!element || !this.customInputEvent) return;
    if (element.nodeName === "INPUT" && this.nativeInputValueSetter) {
      this.nativeInputValueSetter.call(element, newValue);
      element.dispatchEvent(this.customInputEvent);
    } else if (
      element.nodeName === "TEXTAREA" &&
      this.nativeTextAreaValueSetter
    ) {
      this.nativeTextAreaValueSetter.call(element, newValue);
      element.dispatchEvent(this.customInputEvent);
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
    const { activeKeys, top, left, visible } = this.state;
    const {
      disabled,
      width,
      height,
      fullScreen,
      stickToBottom,
      mountAt
    } = this.props;
    const disabledKeys = [...this.disabled, ...disabled];
    // make sure keyboard width is always less then or equals to the widow width
    const actualWidth = fullScreen
      ? window.innerWidth
      : width > window.innerWidth
      ? window.innerWidth
      : width;

    const actualTop = stickToBottom ? 0 : top;
    const actualLeft = fullScreen ? 0 : left;

    const position = {
      width: actualWidth,
      height: height,
      transform: `translate(${actualLeft}px, ${actualTop}px)`,
      transitionDuration: `0.5s`,
      display: visible ? "block" : "none",
      bottom: stickToBottom ? 0 : "auto"
    };

    const parentNode = mountAt instanceof Node ? mountAt : defaultMountNode;

    return ReactDOM.createPortal(
      <div
        className="_rc-v-keyboard"
        style={{ ...position }}
        onClick={this.onKeyPress}
        tabIndex={-1}
        // it needs tab index show if user clicks in keyboard body it gets focused
        // and then we can return focus to input
      >
        <KeyboardRows activeKeys={activeKeys} disabledKeys={disabledKeys} />
      </div>,
      parentNode
    );
  }
}

export default Keyboard;
