import React from "react";

type KeyProps = {
  value: string;
  sub?: string;
  disabledKeys?: Array<String>;
};

const Key = ({ value, sub, disabledKeys = [] }: KeyProps) => {
  const isDisable = disabledKeys.indexOf(value) !== -1;
  return (
    <div
      tabIndex={-1}
      className={`_key ${isDisable ? "_disabled" : ""}`}
      key-val={value}
      shift-val={sub}
    >
      <div className="_sub"> {sub} </div>
      <div className="_main"> {value} </div>
    </div>
  );
};

export default Key;
