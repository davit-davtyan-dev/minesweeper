import EmptyFlagIcon from "./assets/emptyFlag.svg?react";
import FlagIcon from "./assets/flag.svg?react";
import MineIcon from "../public/mine.svg?react";

import type { Block } from "./types";

type BlockComponentProps = {
  block: Block;
  onClick: () => void;
  onDoubleClick: () => void;
  loosed: boolean;
  won: boolean;
  x: number;
  y: number;
};

const BlockComponent = (props: BlockComponentProps) => {
  return (
    <div
      style={{
        border: "3px solid lightGray",
        width: 20,
        height: 20,
        color: "black",
        userSelect: "none",
        backgroundColor: props.block.blownUp
          ? "#c64641"
          : props.block.opened
          ? "white"
          : "darkGray",
        textAlign: "center",
      }}
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
      data-x={props.x}
      data-y={props.y}
    >
      <BlockContent {...props} />
    </div>
  );
};

type BlockContentProps = Omit<BlockComponentProps, "onClick" | "onDoubleClick">;

function BlockContent({ block, loosed, won, x, y }: BlockContentProps) {
  const isFinished = loosed || won;

  const noContent = !block.flagged && !block.mine && !block.neighborMinesCount;

  if (
    (!block.flagged && !block.opened && (!isFinished || !block.mine)) ||
    noContent
  ) {
    return null;
  }

  if (block.flagged && loosed && !block.mine) {
    return <EmptyFlagIcon data-x={x} data-y={y} />;
  }

  if (won && block.mine && !block.flagged) {
    return <FlagIcon data-x={x} data-y={y} opacity={0.3} />;
  }

  if (block.flagged) {
    return <FlagIcon data-x={x} data-y={y} opacity={1} />;
  }

  if (block.mine && isFinished) {
    return <MineIcon data-x={x} data-y={y} />;
  }

  return block.neighborMinesCount || null;
}

export default BlockComponent;
