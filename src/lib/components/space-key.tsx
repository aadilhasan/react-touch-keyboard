import React from "react";

type SpaceKeyProps = {
  disabled?: Boolean;
};

const SpaceKey = ({ disabled }: SpaceKeyProps) => {
  return (
    <div
      tabIndex={-1}
      className={`_key _space  ${disabled ? "_disabled" : ""}`}
      key-val=" "
    >
      <div className="_main"> </div>
    </div>
  );
};

export default SpaceKey;
