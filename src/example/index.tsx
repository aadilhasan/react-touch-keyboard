import React, { Component } from "react";

import Keyboard from "../keyboard";

type myState = {
  input: string;
  textarea: string;
};

class Example extends Component {
  state: myState = {
    input: "",
    textarea: ""
  };

  render() {
    const { input, textarea } = this.state;
    return (
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            console.log(" submited");
          }}
        >
          <input
            value={input}
            placeholder="first input"
            onChange={e => this.setState({ input: e.target.value })}
          />
          <textarea
            id="t"
            value={textarea}
            placeholder="first input"
            onChange={e => {
              let x = { value: e.target.value };
              console.log("text area changed ", x);
              this.setState({ textarea: e.target.value });
            }}
          />
          <br />
          <br />
          <br />

          <input
            placeholder="first input"
            onChange={e => console.log(" input changed")}
          />
          <button> btn </button>
          <br />
          <br />
          <br />
          <input value={input} placeholder="first input" />
        </form>
        <Keyboard mountAt={document.getElementById("root")} />
      </div>
    );
  }
}

export default Example;
