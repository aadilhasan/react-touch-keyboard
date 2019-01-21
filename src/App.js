import React, { Component } from "react";

import {
  topRowItems,
  secondRow,
  thirdRow,
  fourthRow,
  fifthRow
} from "./helper";

import "./App.scss";

class App extends Component {
  renderNumbers = () => {};
  render() {
    return (
      <div className="App">
        <div className="_rc-v-keyboard">
          <div className="_keys _top-keys">
            {topRowItems.map(key => {
              return (
                <div className={`_key ${key.isSpecial ? "_special" : ""}`}>
                  <div className="_sub"> {key.sub} </div>
                  <div className="_main"> {key.main} </div>
                </div>
              );
            })}
          </div>
          <div className="_keys _top-keys">
            {secondRow.map(key => {
              return (
                <div className={`_key ${key.isSpecial ? "_special" : ""}`}>
                  <div className="_sub"> {key.sub} </div>
                  <div className="_main"> {key.main} </div>
                </div>
              );
            })}
          </div>
          <div className="_keys _top-keys">
            {thirdRow.map(key => {
              return (
                <div className={`_key ${key.isSpecial ? "_special" : ""}`}>
                  <div className="_sub"> {key.sub} </div>
                  <div className="_main"> {key.main} </div>
                </div>
              );
            })}
          </div>
          <div className="_keys _top-keys">
            {fourthRow.map(key => {
              return (
                <div className={`_key ${key.isSpecial ? "_special" : ""}`}>
                  <div className="_sub"> {key.sub} </div>
                  <div className="_main"> {key.main} </div>
                </div>
              );
            })}
          </div>
          <div className="_keys _top-keys">
            {fifthRow.map(key => {
              return (
                <div className={`_key ${key.isSpace ? "_space" : ""}`}>
                  {key.main}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
