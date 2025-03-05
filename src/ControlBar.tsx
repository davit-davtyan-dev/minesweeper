import React from "react";
import {
  boardSettingsEasy,
  boardSettingsMedium,
  boardSettingsHard
} from "./helpers";
import { BoardSettings } from "./types";

const LinkItem: React.FC<{ onClick: () => void }> = (props) => (
  <span
    style={{ color: "#337ab7", cursor: "pointer", marginTop: 4 }}
    onClick={props.onClick}
  >
    {props.children}
  </span>
);

type ControlBarProps = {
  handleRestart: (boardSettings?: BoardSettings) => void;
  started: boolean;
  boardSettings: BoardSettings;
  onBoardSettingsChange: (boardSettings: Partial<BoardSettings>) => void;
};

const ControlBar = (props: ControlBarProps) => {
  return (
    <div
      style={{
        padding: "8px 12px",
        marginRight: 12,
        border: "1px solid gray",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <button onClick={() => props.handleRestart()} disabled={!props.started}>
        Restart
      </button>
      <LinkItem
        onClick={() => {
          props.onBoardSettingsChange(boardSettingsEasy);
          props.handleRestart(boardSettingsEasy);
        }}
      >
        Easy
      </LinkItem>
      <LinkItem
        onClick={() => {
          props.onBoardSettingsChange(boardSettingsMedium);
          props.handleRestart(boardSettingsMedium);
        }}
      >
        Medium
      </LinkItem>
      <LinkItem
        onClick={() => {
          props.onBoardSettingsChange(boardSettingsHard);
          props.handleRestart(boardSettingsHard);
        }}
      >
        Hard
      </LinkItem>
    </div>
  );
};

export default ControlBar;
