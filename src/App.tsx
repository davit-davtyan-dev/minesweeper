import { useEffect, useState } from "react";
import BlockComponent from "./BlockComponent";
import ControlBar from "./ControlBar";
import TopBar from "./TopBar";
import useStateAndRef from "./useStateAndRef";
import {
  callForNeghbors,
  generateBlocks,
  openNeghbors,
  boardSettingsEasy,
} from "./helpers";
import { Coordinates, Matrix } from "./types";

export default function App() {
  const [boardSettings, setBoardSettings] = useState(boardSettingsEasy);
  const [matrix, setMatrix, matrixRef] = useStateAndRef(() =>
    generateBlocks(
      boardSettings.width,
      boardSettings.height,
      boardSettings.count
    )
  );
  const [started, setStarted, startedRef] = useStateAndRef(false);
  const [loosed, setLoosed, loosedRef] = useStateAndRef(false);
  const [won, setWon, wonRef] = useStateAndRef(false);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        !event.target ||
        wonRef.current ||
        !startedRef.current ||
        loosedRef.current
      ) {
        return;
      }

      const xStr = (event.target as HTMLDivElement).getAttribute("data-x");
      const yStr = (event.target as HTMLDivElement).getAttribute("data-y");
      if (!xStr || !yStr) {
        return;
      }
      event.preventDefault();
      const x = Number(xStr);
      const y = Number(yStr);

      const newMatrix = [...matrixRef.current];
      if (!newMatrix[y][x].opened) {
        newMatrix[y][x] = {
          ...newMatrix[y][x],
          flagged: !newMatrix[y][x].flagged,
        };
        newMatrix[y] = [...newMatrix[y]];
      }
      setMatrix(newMatrix);
    };
    document.addEventListener("contextmenu", handler);

    return () => {
      document.removeEventListener("contextmenu", handler);
    };
  }, [matrixRef, setMatrix, wonRef, startedRef, loosedRef]);

  const checkIsWin = (matrixToCheck: Matrix) => {
    for (const row of matrixToCheck) {
      for (const block of row) {
        if (!block.opened && !block.mine) {
          return;
        }
      }
    }

    setWon(true);
  };

  const handleBlockClick = (x: number, y: number) => {
    if (won || loosed) {
      return;
    }
    const newMatrix = started
      ? [...matrix]
      : generateBlocks(
          boardSettings.width,
          boardSettings.height,
          boardSettings.count,
          { x, y }
        );
    if (!started) {
      setStarted(true);
    }
    const block = newMatrix[y][x];
    if (block.flagged) {
      return;
    }
    if (block.mine) {
      setLoosed(true);
      newMatrix[y][x] = { ...block, blownUp: true };
      newMatrix[y] = [...newMatrix[y]];
      setMatrix(newMatrix);
      return;
    }
    if (!block.neighborMinesCount) {
      openNeghbors(newMatrix, block, { x, y });
    }
    newMatrix[y][x].opened = true;
    setMatrix(newMatrix);
    checkIsWin(newMatrix);
  };

  const handleBlockDoubleClick = (x: number, y: number) => {
    if (won || loosed) {
      return;
    }
    const newMatrix = [...matrix];
    const block = newMatrix[y][x];

    if (block.flagged) {
      return;
    }
    if (!block.neighborMinesCount) {
      return;
    }
    let flaggedNeighbors = 0;
    let notFlaggedNeighborWithMineCoords: Coordinates | undefined;

    callForNeghbors(
      (neighbor, coordinates) => {
        flaggedNeighbors += Number(neighbor.flagged);
        if (
          neighbor.mine &&
          !neighbor.flagged &&
          !notFlaggedNeighborWithMineCoords
        ) {
          notFlaggedNeighborWithMineCoords = { ...coordinates };
        }
      },
      newMatrix,
      { x, y }
    );

    if (flaggedNeighbors >= block.neighborMinesCount) {
      openNeghbors(newMatrix, block, { x, y }, true);
      if (notFlaggedNeighborWithMineCoords) {
        newMatrix[notFlaggedNeighborWithMineCoords.y][
          notFlaggedNeighborWithMineCoords.x
        ].blownUp = true;
        setLoosed(true);
      }
    }
    setMatrix(newMatrix);
    checkIsWin(newMatrix);
  };

  const handleRestart = (settings = boardSettings) => {
    setMatrix(generateBlocks(settings.width, settings.height, settings.count));
    setStarted(false);
    setLoosed(false);
    setWon(false);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", width: "fit-content" }}
    >
      <TopBar
        loosed={loosed}
        won={won}
        started={started}
        matrix={matrix}
        count={boardSettings.count}
      />
      <div style={{ display: "flex" }}>
        <ControlBar
          handleRestart={handleRestart}
          started={started}
          boardSettings={boardSettings}
          onBoardSettingsChange={(newBoardSettings) =>
            setBoardSettings({ ...boardSettings, ...newBoardSettings })
          }
        />
        <div style={{ position: "relative" }}>
          {(won || loosed) && (
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: won ? "#84d6c6" : "#fbcfcf",
                opacity: 0.3,
              }}
            />
          )}
          {matrix.map((row, y) => (
            <div key={y} style={{ display: "flex" }}>
              {row.map((block, x) => (
                <BlockComponent
                  key={x}
                  block={block}
                  onClick={() => handleBlockClick(x, y)}
                  onDoubleClick={() => handleBlockDoubleClick(x, y)}
                  loosed={loosed}
                  won={won}
                  x={x}
                  y={y}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
