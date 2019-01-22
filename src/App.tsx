import React, { Component, createRef, forwardRef } from "react";

import {
  topRowItems,
  secondRow,
  thirdRow,
  fourthRow,
  fifthRow,
  matchNodeType
} from "./helper";

import "./App.scss";

type myState = {
  visible: Boolean;
  top: number;
  left: number;
};

type elementPosition = {
  top: number;
  left: number;
};

declare global {
  interface Window {
    HTMLInputElement: any;
  }
}

// declare function Object

class App extends Component {
  timeout: number = -1;
  width: number = 900;
  paddingFromInput: number = 0;
  lastFocused: HTMLElement | null = null;
  customEvent: any = null;

  state: myState = {
    visible: true,
    top: 0,
    left: 0
  };

  componentDidMount() {
    const { document, HTMLInputElement } = window;
    const { prototype } = HTMLInputElement;

    // TODO: fix error - Object can be 'undefined'

    // const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    //   prototype,
    //   "value"
    // ).set;
    // nativeInputValueSetter.call(input, "react 16 value");
    // this.customEvent = new Event("input", { bubbles: true });

    // if (!nativeInputValueSetter) return;

    document.body.addEventListener("focusin", this.onFocus);
    document.body.addEventListener("focusout", this.onBlur);
  }

  onFocus = (e: Event) => {
    const node = e.target as HTMLInputElement;
    if (matchNodeType(node, "input")) {
      // if there a timer added by blur even then remove it
      this.cancelTimer();
      const position = this.getKeyboardPosition(node);
      this.setState({ visible: true, ...position });
    } else if (
      this.lastFocused &&
      matchNodeType(node, "div") &&
      node.classList.contains("_key")
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
    if (activeElement && !matchNodeType(activeElement, "input")) {
      if (matchNodeType(lastFocused, "input")) {
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
    const input = document.activeElement;
    console.log(" focused ", input, e.target);
    if (this.customEvent) {
      input && input.dispatchEvent(this.customEvent);
    }
  };

  render() {
    const { visible, ...position } = this.state;
    return (
      <div>
        <input placeholder="first input" />
        <input placeholder="first input" />
        <button> btn </button>
        <input placeholder="first input" />
        {visible && (
          <Keyboard
            {...position}
            width={this.width}
            onKeyPress={this.onKeyPress}
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
};

const Keyboard = (props: keyboardProps) => {
  const position = {
    width: props.width,
    transform: `translate(${props.left}px, ${props.top}px)`,
    transitionDuration: `0.5s`
  };
  return (
    <div
      className="_rc-v-keyboard"
      style={{ ...position }}
      onClick={props.onKeyPress}
    >
      <div className="_keys _top-keys">
        {topRowItems.map(key => {
          return (
            <div
              tabIndex={-1}
              className={`_key ${key.isSpecial ? "_special" : ""}`}
            >
              <div className="_sub"> {key.sub} </div>
              <div className="_main"> {key.main} </div>
            </div>
          );
        })}
      </div>
      <div className="_keys _top-keys">
        {secondRow.map(key => {
          return (
            <div
              tabIndex={-1}
              className={`_key ${key.isSpecial ? "_special" : ""}`}
            >
              <div className="_sub"> {key.sub} </div>
              <div className="_main"> {key.main} </div>
            </div>
          );
        })}
      </div>
      <div className="_keys _top-keys">
        {thirdRow.map(key => {
          return (
            <div
              tabIndex={-1}
              className={`_key ${key.isSpecial ? "_special" : ""}`}
            >
              <div className="_sub"> {key.sub} </div>
              <div className="_main"> {key.main} </div>
            </div>
          );
        })}
      </div>
      <div className="_keys _top-keys">
        {fourthRow.map(key => {
          return (
            <div
              tabIndex={-1}
              className={`_key ${key.isSpecial ? "_special" : ""}`}
            >
              <div className="_sub"> {key.sub} </div>
              <div className="_main"> {key.main} </div>
            </div>
          );
        })}
      </div>
      <div className="_keys _top-keys">
        {fifthRow.map(key => {
          return (
            <div
              tabIndex={-1}
              className={`_key ${key.isSpace ? "_space" : ""}`}
            >
              {key.main}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
