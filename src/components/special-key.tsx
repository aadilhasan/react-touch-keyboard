import React from "react";

type SpecialKeyProps = {
  value: string;
  name?: string;
  activeKeys?: Map<string, undefined>;
  disabledKeys?: Array<String>;
};

const SpecialKey = ({
  value,
  name,
  activeKeys,
  disabledKeys = []
}: SpecialKeyProps) => {
  const isDisable = disabledKeys.indexOf(value) !== -1;
  const isActive = !isDisable && activeKeys && activeKeys.has(value);
  return (
    <div
      tabIndex={-1}
      className={`_key _special ${isActive ? "_active" : ""} ${
        isDisable ? "_disabled" : ""
      }`}
      key-val={value}
    >
      <div className="_main"> {name || value} </div>
    </div>
  );
};

export default SpecialKey;
