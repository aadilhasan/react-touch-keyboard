import React from "react";
import Key from "./normal-key";
import SpecialKey from "./special-key";
import SpaceKey from "./space-key";

import {
  firstRowItems,
  secondRow,
  thirdRow,
  fourthRow,
  fifthRow
} from "./helper";

type RowProps = {
  activeKeys?: Map<string, undefined>;
  disabledKeys: Array<string>;
};

export const FirstRow = ({ activeKeys, disabledKeys = [] }: RowProps) => {
  return (
    <div className="_keys _top-keys">
      {firstRowItems.map((key, index) => {
        return (
          <Key
            key={index}
            value={key.main}
            sub={key.sub}
            disabledKeys={disabledKeys}
          />
        );
      })}
      <SpecialKey key="s_1_1" value="delete" disabledKeys={disabledKeys} />
    </div>
  );
};
export const SecondRow = ({ activeKeys, disabledKeys = [] }: RowProps) => {
  return (
    <div className="_keys _top-keys">
      <SpecialKey key="s_2_1" value="tab" disabledKeys={disabledKeys} />
      {secondRow.map((key, index) => {
        return (
          <Key
            key={index}
            value={key.main}
            sub={key.sub}
            disabledKeys={disabledKeys}
          />
        );
      })}
    </div>
  );
};

export const ThirdRow = ({ activeKeys, disabledKeys = [] }: RowProps) => {
  return (
    <div className="_keys _top-keys">
      <SpecialKey
        key="s_3_1"
        value="caps"
        name="caps lock"
        activeKeys={activeKeys}
        disabledKeys={disabledKeys}
      />
      {thirdRow.map((key, index) => {
        return (
          <Key
            key={index}
            value={key.main}
            sub={key.sub}
            disabledKeys={disabledKeys}
          />
        );
      })}
      <SpecialKey key="s_3_2" value="enter" disabledKeys={disabledKeys} />
    </div>
  );
};
export const FourthRow = ({ activeKeys, disabledKeys = [] }: RowProps) => {
  return (
    <div className="_keys _top-keys">
      <SpecialKey
        key="s_4_1"
        value="shift"
        activeKeys={activeKeys}
        disabledKeys={disabledKeys}
      />
      {fourthRow.map((key, index) => {
        return (
          <Key
            key={index}
            value={key.main}
            sub={key.sub}
            disabledKeys={disabledKeys}
          />
        );
      })}
      <SpecialKey
        key="s_4_2"
        value="shift"
        activeKeys={activeKeys}
        disabledKeys={disabledKeys}
      />
    </div>
  );
};

export const FifthRow = ({ activeKeys, disabledKeys = [] }: RowProps) => {
  return (
    <div className="_keys _top-keys">
      {fifthRow.map((key, index) => {
        return key.isSpace ? (
          <SpaceKey key={index} disabled={disabledKeys.indexOf(" ") !== -1} />
        ) : (
          <SpecialKey
            key={index}
            value={key.main}
            disabledKeys={disabledKeys}
          />
        );
      })}
    </div>
  );
};

const KeyboardRows = (props: RowProps) => {
  return (
    <React.Fragment>
      <FirstRow {...props} />
      <SecondRow {...props} />
      <ThirdRow {...props} />
      <FourthRow {...props} />
      <FifthRow {...props} />
    </React.Fragment>
  );
};

export default KeyboardRows;
