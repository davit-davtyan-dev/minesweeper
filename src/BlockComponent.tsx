import EmptyFlagIcon from "./icons/EmptyFlagIcon";
import FlagIcon from "./icons/FlagIcon";
import MineIcon from "./icons/MineIcon";

import type { Block } from "./types";

type BlockComponentProps = {
  block: Block;
  onClick: () => void;
  onDoubleClick: () => void;
  loosed: boolean;
  x: number;
  y: number;
};

const BlockComponent = ({
  block,
  onClick,
  onDoubleClick,
  loosed,
  x,
  y
}: BlockComponentProps) => {
  return (
    <div
      style={{
        border: "3px solid lightGray",
        width: 20,
        height: 20,
        color: "black",
        userSelect: "none",
        backgroundColor: block.blownUp
          ? "#c64641"
          : block.opened
          ? "white"
          : "darkGray",
        textAlign: "center"
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      data-x={x}
      data-y={y}
    >
      {!block.opened && !block.flagged && !loosed ? (
        ""
      ) : block.flagged ? (
        loosed && !block.mine ? (
          <EmptyFlagIcon data-x={x} data-y={y} />
        ) : (
          <FlagIcon data-x={x} data-y={y} />
        )
      ) : block.mine ? (
        <MineIcon data-x={x} data-y={y} />
      ) : (
        block.neighborMinesCount || ""
      )}
    </div>
  );
};

export default BlockComponent;
